-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── CLUSTERS (กลุ่มยุทธศาสตร์) ───────────────────────────────────────────
create table clusters (
  id          serial primary key,
  name        text not null,
  short_name  text not null,
  color_hex   text not null,
  icon        text,
  description text,
  created_at  timestamptz default now()
);

-- ─── MINISTERS (รัฐมนตรี) ──────────────────────────────────────────────────
create table ministers (
  id          serial primary key,
  full_name   text not null,
  title       text not null,
  position    text not null,
  ministry    text,
  photo_url   text,
  party       text,
  start_date  date,
  end_date    date
);

-- ─── AGENCIES (หน่วยงาน) ───────────────────────────────────────────────────
create table agencies (
  id            serial primary key,
  name          text not null,
  short_name    text,
  type          text check (type in ('ministry','department','state_enterprise','other')),
  website_url   text,
  open_data_url text,
  minister_id   int references ministers(id)
);

-- ─── POLICIES (นโยบาย) ─────────────────────────────────────────────────────
create table policies (
  id                 uuid primary key default uuid_generate_v4(),
  policy_number      text not null,
  title              text not null,
  description        text,
  original_text      text,
  cluster_id         int references clusters(id),
  primary_agency_id  int references agencies(id),
  minister_id        int references ministers(id),
  status             text not null default 'planned'
                       check (status in ('planned','in_progress','delayed','completed','cancelled')),
  priority           text not null default 'normal'
                       check (priority in ('urgent','high','normal')),
  progress_percent   decimal(5,2) default 0,
  start_date         date default '2026-04-09',
  target_date        date,
  target_date_type   text check (target_date_type in ('hard_deadline','soft_target','ongoing')),
  kpis               jsonb default '[]',
  is_featured        boolean default false,
  slug               text unique not null,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- ─── POLICY ↔ AGENCY (M:N) ──────────────────────────────────────────────────
create table policy_agencies (
  policy_id  uuid references policies(id) on delete cascade,
  agency_id  int  references agencies(id),
  role       text check (role in ('primary','supporting')),
  primary key (policy_id, agency_id)
);

-- ─── MILESTONES ────────────────────────────────────────────────────────────
create table milestones (
  id               serial primary key,
  policy_id        uuid references policies(id) on delete cascade,
  name             text not null,
  milestone_order  int not null,
  weight_percent   decimal(5,2) not null default 0,
  status           text not null default 'pending'
                     check (status in ('pending','in_progress','completed','skipped')),
  target_date      date,
  completed_date   date,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ─── BUDGETS ───────────────────────────────────────────────────────────────
create table budgets (
  id                  serial primary key,
  policy_id           uuid references policies(id) on delete cascade,
  fiscal_year         int,
  planned_amount      bigint,
  approved_amount     bigint,
  disbursed_amount    bigint,
  source              text check (source in ('annual_budget','extra_budget','loan','ppp','revolving_fund')),
  source_detail       text,
  reference_document  text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ─── PROGRESS UPDATES (Activity Log) ──────────────────────────────────────
create table progress_updates (
  id               uuid primary key default uuid_generate_v4(),
  policy_id        uuid references policies(id) on delete cascade,
  milestone_id     int  references milestones(id),
  update_type      text check (update_type in (
                     'status_change','budget_update','evidence_added',
                     'news_mentioned','community_tip','law_passed','cabinet_approved'
                   )),
  description      text not null,
  old_status       text,
  new_status       text,
  evidence_urls    jsonb default '[]',
  data_source_type text check (data_source_type in ('api','csv','html','pdf','manual')),
  publish_status   text not null default 'draft'
                     check (publish_status in ('draft','under_review','published')),
  published_at     timestamptz,
  verified_by      uuid references auth.users(id),
  created_by       uuid references auth.users(id),
  created_at       timestamptz default now()
);

-- ─── PUBLIC VOTES ──────────────────────────────────────────────────────────
create table public_votes (
  id          serial primary key,
  policy_id   uuid references policies(id) on delete cascade,
  vote        text check (vote in ('trust','doubt','distrust')),
  ip_hash     text not null,
  created_at  timestamptz default now(),
  unique (policy_id, ip_hash)
);

-- ─── COMMUNITY TIPS (เบาะแสจากประชาชน) ────────────────────────────────────
create table community_tips (
  id                          serial primary key,
  policy_id                   uuid references policies(id) on delete cascade,
  description                 text not null,
  evidence_url                text,
  evidence_file_path          text,
  location_province           text,
  location_district           text,
  submitter_contact_encrypted text,
  status                      text not null default 'new'
                                check (status in ('new','under_review','verified_published','rejected')),
  reviewer_notes              text,
  reviewed_by                 uuid references auth.users(id),
  created_at                  timestamptz default now(),
  reviewed_at                 timestamptz
);

-- ─── TRIGGERS: auto-update updated_at ──────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger policies_updated_at before update on policies
  for each row execute function update_updated_at();
create trigger milestones_updated_at before update on milestones
  for each row execute function update_updated_at();
create trigger budgets_updated_at before update on budgets
  for each row execute function update_updated_at();

-- ─── TRIGGER: auto-recalculate progress_percent ────────────────────────────
create or replace function recalculate_progress()
returns trigger as $$
begin
  update policies set progress_percent = (
    select coalesce(sum(
      case when m.status = 'completed' then m.weight_percent
           when m.status = 'in_progress' then m.weight_percent * 0.5
           else 0 end
    ), 0)
    from milestones m
    where m.policy_id = coalesce(new.policy_id, old.policy_id)
  )
  where id = coalesce(new.policy_id, old.policy_id);
  return new;
end;
$$ language plpgsql;

create trigger milestone_progress_update
  after insert or update or delete on milestones
  for each row execute function recalculate_progress();

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────
alter table policies        enable row level security;
alter table progress_updates enable row level security;
alter table community_tips  enable row level security;
alter table public_votes    enable row level security;

create policy "public read policies"
  on policies for select using (true);

create policy "public read published updates"
  on progress_updates for select using (publish_status = 'published');

create policy "public insert votes"
  on public_votes for insert with check (true);

create policy "public insert tips"
  on community_tips for insert with check (true);