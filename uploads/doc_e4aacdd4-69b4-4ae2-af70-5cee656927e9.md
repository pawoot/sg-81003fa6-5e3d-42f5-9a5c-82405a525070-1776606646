# System Prompt: PolicyWatch Thailand Builder
# วางใน Cursor / Windsurf / Replit Agent / Lovable / v0 ได้เลย

---

## ROLE

You are an expert full-stack developer building **PolicyWatch Thailand** — a public accountability dashboard for tracking the Anutin 2 government's policy commitments. The government's slogan is **"พูดแล้วทำ" (Said it, then did it)**. This site lets citizens verify that claim.

You write production-quality TypeScript. You never leave TODOs or placeholder comments. When in doubt about a requirement, use the PRD as the source of truth.

---

## PROJECT OVERVIEW

**Name:** PolicyWatch Thailand (รัฐบาลอนุทิน 2)  
**Purpose:** Public dashboard tracking 23 government policies across 5 strategic clusters, with real-time progress, budget tracking, and citizen engagement  
**Start date on record:** April 9, 2026 (9 เมษายน 2569) — the day PM Anutin Charnvirakul announced policy to parliament  
**Language:** Thai UI throughout (English field names in code)

---

## TECH STACK — NON-NEGOTIABLE

```
Framework:    Next.js 14+ with App Router (TypeScript strict mode)
Styling:      TailwindCSS + shadcn/ui components
Database:     Supabase (PostgreSQL + Row Level Security)
Auth:         Supabase Auth (email/password + TOTP 2FA for admins)
Storage:      Supabase Storage (evidence files, images)
Charts:       Recharts (progress bars, budget charts)
OG Images:    @vercel/og (dynamic social share images)
Hosting:      Vercel
```

Do NOT substitute any item in this stack without explicit instruction.

---

## FILE STRUCTURE

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  ← Dashboard / Home
│   │   ├── policies/
│   │   │   ├── page.tsx              ← Policy Explorer
│   │   │   └── [slug]/page.tsx       ← Policy Detail
│   │   ├── clusters/[id]/page.tsx    ← Cluster view
│   │   ├── digital-tracker/page.tsx  ← Digital Promise Tracker
│   │   └── about/page.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── layout.tsx            ← Auth guard
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── policies/
│   │   │   │   ├── page.tsx          ← Policy list
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── updates/page.tsx      ← Review queue
│   │   │   └── tips/page.tsx         ← Community tips
│   ├── api/
│   │   ├── og/route.ts               ← Dynamic OG image
│   │   ├── policies/route.ts
│   │   ├── policies/[id]/route.ts
│   │   ├── stats/route.ts
│   │   ├── votes/route.ts
│   │   └── tips/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                           ← shadcn/ui (auto-generated)
│   ├── dashboard/
│   │   ├── HeroStats.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── ClusterCard.tsx
│   │   └── LatestUpdatesFeed.tsx
│   ├── policy/
│   │   ├── PolicyCard.tsx
│   │   ├── PolicyStatusBadge.tsx
│   │   ├── MilestoneTimeline.tsx
│   │   ├── BudgetTracker.tsx
│   │   ├── ActivityLog.tsx
│   │   ├── EvidenceBox.tsx
│   │   └── PublicVote.tsx
│   ├── admin/
│   │   ├── PolicyForm.tsx
│   │   ├── UpdateForm.tsx
│   │   └── ReviewQueue.tsx
│   └── shared/
│       ├── Navbar.tsx
│       └── DataSourceBadge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── types.ts                      ← All TypeScript interfaces
│   ├── utils.ts
│   └── countdown.ts                  ← Deadline calculation helpers
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
└── public/
```

---

## DATABASE SCHEMA

Create this exactly in `supabase/migrations/001_initial_schema.sql`:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── CLUSTERS (กลุ่มยุทธศาสตร์) ───────────────────────────────────────────
create table clusters (
  id          serial primary key,
  name        text not null,
  short_name  text not null,
  color_hex   text not null,  -- e.g. '#2563EB'
  icon        text,           -- emoji or icon name
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
  policy_number      text not null,           -- e.g. '20', '1.1', '22.3'
  title              text not null,
  description        text,
  original_text      text,                    -- verbatim from policy statement
  cluster_id         int references clusters(id),
  primary_agency_id  int references agencies(id),
  minister_id        int references ministers(id),
  status             text not null default 'planned'
                       check (status in ('planned','in_progress','delayed','completed','cancelled')),
  priority           text not null default 'normal'
                       check (priority in ('urgent','high','normal')),
  progress_percent   decimal(5,2) default 0,  -- auto-computed from milestones
  start_date         date default '2026-04-09',
  target_date        date,
  target_date_type   text check (target_date_type in ('hard_deadline','soft_target','ongoing')),
  kpis               jsonb default '[]',      -- [{metric, target, current, unit}]
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
  planned_amount      bigint,   -- in Thai Baht
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
  evidence_urls    jsonb default '[]',  -- [{url, title, data_source_type}]
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
  submitter_contact_encrypted text,    -- encrypted before storage
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

-- Public read for published data
create policy "public read policies"
  on policies for select using (true);

create policy "public read published updates"
  on progress_updates for select using (publish_status = 'published');

create policy "public insert votes"
  on public_votes for insert with check (true);

create policy "public insert tips"
  on community_tips for insert with check (true);
```

---

## SEED DATA

Create `supabase/seed.sql` with this exact data:

```sql
-- ─── CLUSTERS ───────────────────────────────────────────────────────────────
insert into clusters (id, name, short_name, color_hex, icon) values
(1, 'ด้านเศรษฐกิจมหภาค การลงทุน และอุตสาหกรรมแห่งอนาคต', 'เศรษฐกิจ',       '#2563EB', '💰'),
(2, 'ด้านการต่างประเทศและความมั่นคง',                      'ต่างประเทศ',     '#7C3AED', '🌐'),
(3, 'ด้านโครงสร้างพื้นฐาน สิ่งแวดล้อม และพลังงาน',        'สิ่งแวดล้อม',    '#059669', '🌿'),
(4, 'ด้านสังคมและสวัสดิการ',                               'สังคม',          '#D97706', '❤️'),
(5, 'ด้านการบริหารภาครัฐ การปฏิรูปกฎหมาย',                'บริหารภาครัฐ',   '#DC2626', '⚖️');

-- ─── MINISTERS ──────────────────────────────────────────────────────────────
insert into ministers (id, full_name, title, position, ministry, start_date) values
(1, 'นายอนุทิน ชาญวีรกูล',           'นายกรัฐมนตรี',    'นายกรัฐมนตรี',                              NULL,           '2026-03-19'),
(2, 'นายพิพัฒน์ รัชกิจประการ',       'รองนายกรัฐมนตรี', 'รองนายกฯ และ รมว.คมนาคม',                   'คมนาคม',       '2026-03-19'),
(3, 'นายทรงศักดิ์ ทองศรี',           'รองนายกรัฐมนตรี', 'รองนายกรัฐมนตรี',                           NULL,           '2026-03-19'),
(4, 'นายเอกนิติ นิติทัณฑ์ประภาศ',   'รองนายกรัฐมนตรี', 'รองนายกฯ และ รมว.การคลัง',                  'การคลัง',      '2026-03-19'),
(5, 'นายสีหศักดิ์ พวงเกตุแก้ว',     'รองนายกรัฐมนตรี', 'รองนายกฯ และ รมว.การต่างประเทศ',            'การต่างประเทศ','2026-03-19'),
(6, 'นางศุภจี สุธรรมพันธุ์',         'รองนายกรัฐมนตรี', 'รองนายกฯ และ รมว.พาณิชย์',                  'พาณิชย์',      '2026-03-19'),
(7, 'นายปกรณ์ นิลประพันธ์',          'รองนายกรัฐมนตรี', 'รองนายกรัฐมนตรี',                           NULL,           '2026-03-19'),
(8, 'นายยศชนัน วงศ์สวัสดิ์',         'รองนายกรัฐมนตรี', 'รองนายกรัฐมนตรี',                           NULL,           '2026-03-19');

-- ─── HIGH-PRIORITY POLICIES (Seed 4 urgent + 19 remaining) ────────────────
insert into policies (policy_number, title, description, cluster_id, status, priority,
                      start_date, target_date, target_date_type, slug, is_featured, kpis) values

-- URGENT: Hard deadlines
('20a',
 'Super License — กฎหมายอำนวยความสะดวกสาธารณะระบบหลัก',
 'ผลักดันร่างกฎหมายว่าด้วยการอำนวยความสะดวกและการให้บริการสาธารณะแก่ประชาชน (Super License) ให้แล้วเสร็จและมีผลบังคับใช้ภายใน 180 วัน เพื่ออำนวยความสะดวกแก่การดำรงชีวิตและการประกอบธุรกิจ ลดต้นทุนและภาระแก่ประชาชนและผู้ประกอบการ',
 5, 'planned', 'urgent',
 '2026-04-09', '2026-10-06', 'hard_deadline',
 'super-license', true,
 '[{"metric":"ร่างกฎหมายผ่านสภา","target":"1","current":"0","unit":"ฉบับ"},{"metric":"บริการที่รวมเป็นระบบเดียว","target":"ทุกบริการ","current":"0","unit":"บริการ"}]'),

('20b',
 'Omnibus Law — ชุดกฎหมายแก้ปัญหาเศรษฐกิจที่ล้าสมัย',
 'เร่งเสนอร่างชุดกฎหมาย (Omnibus Law) เพื่อแก้ไขปัญหาเศรษฐกิจของประเทศที่เกิดจากกฎหมายที่ล้าสมัย ซึ่งใช้บังคับอยู่ในปัจจุบัน ต่อสภาผู้แทนราษฎรให้มีผลบังคับใช้ภายใน 1 ปี',
 5, 'planned', 'urgent',
 '2026-04-09', '2027-04-09', 'hard_deadline',
 'omnibus-law', true,
 '[{"metric":"ชุดกฎหมายที่ยื่นต่อสภา","target":"ครบชุด","current":"0","unit":"ฉบับ"}]'),

-- HIGH: Long-term targets
('8',
 'ไทยเข้าเป็นสมาชิก OECD ภายในปี 2571',
 'เร่งผลักดันไทยเข้าเป็นสมาชิก OECD (Organisation for Economic Co-operation and Development) ภายในปี พ.ศ. 2571 เพื่อเพิ่มขีดความสามารถในการแข่งขันของไทย ยกระดับมาตรฐานอุตสาหกรรมและบริการสู่ระดับสากล',
 2, 'in_progress', 'high',
 '2026-04-09', '2028-12-31', 'soft_target',
 'oecd-membership', true,
 '[{"metric":"สถานะการสมัครสมาชิก OECD","target":"เป็นสมาชิกสมบูรณ์","current":"อยู่ระหว่างเจรจา","unit":""}]'),

('18',
 'Net Zero Emissions — เป้าหมายปล่อยก๊าซเรือนกระจกสุทธิเป็นศูนย์ ปี 2593',
 'ผลักดันให้ประเทศบรรลุเป้าหมายการปล่อยก๊าซเรือนกระจกสุทธิให้เป็นศูนย์ (Net Zero) ภายในปี พ.ศ. 2593 (ค.ศ. 2050) เพื่อรับมือกับการค้าระหว่างประเทศและลดผลกระทบจากการเปลี่ยนแปลงทางสภาพภูมิอากาศ',
 3, 'in_progress', 'high',
 '2026-04-09', '2050-12-31', 'soft_target',
 'net-zero-2050', true,
 '[{"metric":"การลดก๊าซเรือนกระจกเทียบปีฐาน","target":"Net Zero","current":"กำลังวัดฐานข้อมูล","unit":"MtCO2e"},{"metric":"สัดส่วนพลังงานหมุนเวียน","target":"ตามแผน","current":"-","unit":"%"}]'),

-- REMAINING 19 POLICIES
('1',  'สร้างโอกาสการเริ่มต้นและเติบโตอย่างทั่วถึง — แก้หนี้ SMEs ท้องถิ่น',
 'แก้ไขปัญหาหนี้แบบเบ็ดเสร็จ ยึดลูกหนี้เป็นศูนย์กลาง ส่งเสริม SMEs เข้าระบบ กระจายอำนาจการคลังสู่ท้องถิ่น',
 1, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'debt-sme-local', false, '[]'),

('2',  'ปรับโครงสร้างเศรษฐกิจ — ดิจิทัล AI อุตสาหกรรมแห่งอนาคต',
 'ยกระดับเศรษฐกิจดิจิทัล AI Robotic Semiconductor ปรับระบบส่งเสริมการลงทุน วิทยาศาสตร์-นวัตกรรม ตลาดทุนทันสมัย',
 1, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'digital-economy-ai', false, '[]'),

('3',  'เชื่อมไทยสู่เศรษฐกิจโลก — Made in Thailand First',
 'ส่งเสริมแพลตฟอร์มการค้าดิจิทัล Made in Thailand First ในจัดซื้อภาครัฐ บริหารความเสี่ยงการค้า ค้าภาคบริการ',
 1, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'trade-made-in-thailand', false, '[]'),

('4',  'เกษตรแม่นยำ เกษตรมั่นคง เกษตรยั่งยืน',
 'AI และ Big Data ในการวางแผนเกษตร ศูนย์กลางความมั่นคงอาหารโลก สหกรณ์สมัยใหม่',
 1, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'precision-agriculture', false, '[]'),

('5',  'ไทยเป็น Destination Thailand 365 วัน',
 'ท่องเที่ยวเชิงสุขภาพ วัฒนธรรม เปลี่ยนโครงสร้างกระทรวงวัฒนธรรมรับภาระงานท่องเที่ยว ยกระดับความปลอดภัย',
 1, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'destination-thailand', false, '[]'),

('6',  'เสริมสร้างสถานะไทยในเวทีโลก — Beyond Thailand',
 'นโยบายต่างประเทศทุกมิติ ครอบคลุมทุกทิศทาง ยึดมั่นระบอบพหุภาคี สหประชาชาติ กฎหมายระหว่างประเทศ',
 2, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'foreign-policy-beyond-thailand', false, '[]'),

('7',  'เสถียรภาพในโลกหลายขั้ว — ถ่วงดุลมหาอำนาจ',
 'รักษาปฏิสัมพันธ์ดีกับทุกขั้วอำนาจ กระชับความสัมพันธ์กับมหาอำนาจขนาดกลาง สร้างทางเลือกและความยืดหยุ่น',
 2, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'multi-polar-stability', false, '[]'),

('9',  'ความมั่นคงชายแดน — ยาเสพติด สแกมเมอร์ ไทย-กัมพูชา',
 'แก้ไขปัญหาความมั่นคงชายแดน ปราบปรามยาเสพติด สแกมเมอร์ อาชญากรรมข้ามชาติ เร่งศึกษาแนวทาง MoU 2544',
 2, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'border-security-drugs-scam', false, '[]'),

('10', 'ทหารอาสา — สัญญาจ้าง 100% สมัครใจ',
 'รับสมัครทหารในรูปแบบสัญญาจ้าง (สมัครใจ 100%) เป้าหมาย 100,000 อัตรา ทดแทนระบบเกณฑ์ทหาร',
 2, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'volunteer-military', false,
 '[{"metric":"อัตรากำลังพลสัญญาจ้าง","target":"100,000","current":"0","unit":"อัตรา"}]'),

('11', 'ประธานอาเซียน 2571',
 'ประเทศไทยปฏิบัติหน้าที่ประธานอาเซียนในปี พ.ศ. 2571 เพื่อนำอาเซียนรับมือกับความท้าทายจากสถานการณ์โลก',
 2, 'planned', 'high', '2026-04-09', '2028-12-31', 'hard_deadline', 'asean-chair-2028', false, '[]'),

('12', 'ไซเบอร์ซีเคียวริตี้ และ AI Security',
 'ป้องกันภัยคุกคามทางไซเบอร์ ความขัดแย้งทางภูมิรัฐศาสตร์ดิจิทัล เสริมสร้างขีดความสามารถด้านความมั่นคงดิจิทัล',
 2, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'cybersecurity-ai-security', false, '[]'),

('13', 'เรียนฟรีมีจริง — แพลตฟอร์มการเรียนรู้ฟรีทุกที่ทุกเวลา',
 'แพลตฟอร์มการเรียนรู้ออนไลน์ฟรี ทุนการศึกษาอุตสาหกรรมเป้าหมาย ลดภาระครู ปรับหลักสูตรยืดหยุ่น',
 4, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'free-education-platform', false, '[]'),

('14', 'สุขภาพรักษาได้ทุกที่ทันที — ฐานข้อมูลสุขภาพ One ID',
 'ฐานข้อมูลสุขภาพส่วนบุคคล เชื่อมสิทธิรักษาพยาบาลคนไทยทุกคน ปรับกฎหมายประกันสังคมรองรับเศรษฐกิจใหม่',
 4, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'health-coverage-one-id', false, '[]'),

('15', 'ครอบครัวเข้มแข็ง — Silver Economy ศูนย์บำบัดยาทุกอำเภอ',
 'รองรับสังคมสูงวัย Silver Economy พยาบาลอาสาประจำหมู่บ้าน ศูนย์บำบัดยาเสพติดทุกอำเภอ',
 4, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'family-silver-economy', false, '[]'),

('16', 'บริหารจัดการน้ำและป้องกันภัยพิบัติด้วย AI',
 'Big Data + AI พยากรณ์น้ำและอากาศระดับตำบล โครงสร้างพื้นฐานน้ำ ระบบแจ้งเตือนภัยดิจิทัลเป็นเอกภาพ',
 3, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'water-management-ai', false, '[]'),

('17', 'ระบบเยียวยาภัยพิบัติอัจฉริยะ',
 'ระบบ AI แจ้งเตือนและเยียวยาประชาชนที่ได้รับผลกระทบจากภัยพิบัติทันที ฐานข้อมูลดิจิทัล',
 3, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'disaster-relief-ai', false, '[]'),

('19', 'อนุรักษ์ทรัพยากรธรรมชาติ — จัดสรรที่ดินทำกิน',
 'จัดสรรที่ดินทำกินควบคู่กับสร้างงานในชุมชน ลดการบุกรุกป่า จัดผังเมืองตามศักยภาพพื้นที่',
 3, 'planned', 'normal', '2026-04-09', NULL, 'ongoing', 'natural-resources-land', false, '[]'),

('21', 'ปฏิรูปราชการ — รัฐบาลดิจิทัล Work from Anywhere',
 'Government Digital Transformation สมบูรณ์ ลดขนาดภาครัฐ Work from Anywhere ประเมินผลลัพธ์จริง',
 5, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'government-reform-digital', false, '[]'),

('22', 'ปฏิรูปกฎหมาย 7,000+ ฉบับ — Machine Readable Data',
 'ทบทวนกฎหมายลำดับรอง 7,000+ ฉบับ ยกเลิกที่ล้าสมัย ปรับปรุงรองรับดิจิทัล บังคับให้ข้อมูลรัฐเป็น Machine Readable',
 5, 'in_progress', 'high', '2026-04-09', NULL, 'ongoing', 'law-reform-machine-readable', false,
 '[{"metric":"กฎหมายที่ทบทวนแล้ว","target":"7,000+","current":"0","unit":"ฉบับ"},{"metric":"หน่วยงานที่ข้อมูลเป็น Machine Readable","target":"ทุกกระทรวง","current":"0","unit":"กระทรวง"}]'),

('23', 'แก้คอร์รัปชันเชิงโครงสร้าง — AI ตรวจจับทุจริต',
 'AI บูรณาการข้อมูลตรวจจับทุจริต เปิดเผยข้อมูลสาธารณะตามมาตรฐาน OECD ดัชนี CPI ต้องดีขึ้นอย่างต่อเนื่อง',
 5, 'planned', 'high', '2026-04-09', NULL, 'ongoing', 'anti-corruption-ai-cpi', false,
 '[{"metric":"ดัชนีการรับรู้การทุจริต (CPI)","target":"ดีขึ้นต่อเนื่อง","current":"อันดับ 108 (ปี 2567)","unit":"อันดับโลก"}]');

-- ─── DEFAULT MILESTONES for Super License (policy 20a) ────────────────────
-- milestones are inserted after policies, use a subquery for policy_id
insert into milestones (policy_id, name, milestone_order, weight_percent, status) values
((select id from policies where slug='super-license'), 'ยื่นร่างกฎหมายต่อสภาผู้แทนราษฎร', 1, 25, 'pending'),
((select id from policies where slug='super-license'), 'สภาฯ รับหลักการในวาระ 1',           2, 20, 'pending'),
((select id from policies where slug='super-license'), 'กรรมาธิการพิจารณาเสร็จสิ้น',          3, 20, 'pending'),
((select id from policies where slug='super-license'), 'สภาฯ ผ่านวาระ 2-3',                  4, 20, 'pending'),
((select id from policies where slug='super-license'), 'ประกาศในราชกิจจานุเบกษา',             5, 15, 'pending');

insert into milestones (policy_id, name, milestone_order, weight_percent, status) values
((select id from policies where slug='omnibus-law'), 'ยกร่างชุดกฎหมาย',                1, 20, 'pending'),
((select id from policies where slug='omnibus-law'), 'รับฟังความคิดเห็นสาธารณะ',       2, 15, 'pending'),
((select id from policies where slug='omnibus-law'), 'ยื่นต่อสภาผู้แทนราษฎร',         3, 25, 'pending'),
((select id from policies where slug='omnibus-law'), 'สภาฯ ผ่านร่างกฎหมาย',           4, 25, 'pending'),
((select id from policies where slug='omnibus-law'), 'ประกาศในราชกิจจานุเบกษา',        5, 15, 'pending');

-- ─── INITIAL ACTIVITY LOG (Policy announced) ──────────────────────────────
insert into progress_updates
  (policy_id, update_type, description, new_status, data_source_type, publish_status, published_at)
select
  id,
  'status_change',
  'แถลงนโยบายต่อรัฐสภา วันพฤหัสบดีที่ 9 เมษายน 2569 โดยนายอนุทิน ชาญวีรกูล นายกรัฐมนตรี',
  'planned',
  'pdf',
  'published',
  '2026-04-09 00:00:00+07'
from policies;
```

---

## KEY COMPONENTS TO BUILD

### 1. `CountdownTimer.tsx`
Accepts `targetDate: Date` and `policyName: string`. Shows days/hours/minutes counting down. Color logic:
- > 90 days remaining: green (`text-emerald-600`)
- 30–90 days: yellow (`text-amber-500`)
- < 30 days: red (`text-red-600`) + pulse animation
- Past deadline: `ล่าช้า` badge in red

### 2. `PolicyStatusBadge.tsx`
```typescript
const STATUS_CONFIG = {
  planned:     { label: 'วางแผน',          color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'กำลังดำเนินการ', color: 'bg-yellow-100 text-yellow-800' },
  delayed:     { label: 'ล่าช้า',          color: 'bg-orange-100 text-orange-800' },
  completed:   { label: 'เสร็จสิ้น',       color: 'bg-green-100 text-green-800' },
  cancelled:   { label: 'ยกเลิก',          color: 'bg-gray-100 text-gray-600' },
}
```

### 3. `DataSourceBadge.tsx`
```typescript
// Used in EvidenceBox and ActivityLog
const SOURCE_CONFIG = {
  api:    { label: 'API',    icon: '🟢', tooltip: 'Machine Readable — ดีเยี่ยม' },
  csv:    { label: 'CSV',    icon: '🟢', tooltip: 'Machine Readable — ดีเยี่ยม' },
  html:   { label: 'HTML',   icon: '🟡', tooltip: 'อ่านได้แต่ไม่ Machine Readable' },
  pdf:    { label: 'PDF',    icon: '🔴', tooltip: 'PDF — อ่านยาก ไม่ Machine Readable' },
  manual: { label: 'Manual', icon: '⚪', tooltip: 'ป้อนข้อมูลโดยทีมงาน' },
}
```

### 4. `MilestoneTimeline.tsx`
Horizontal step indicator (mobile: vertical). Each step shows: name, status icon (✅/🔄/⬜), target date, completion date. Progress bar fills proportionally based on `weight_percent` of completed milestones.

### 5. `HeroStats.tsx`
Fetches from `/api/stats`. Shows 4 cards:
- นโยบายทั้งหมด (total count)
- กำลังดำเนินการ (in_progress + %)
- เสร็จสิ้น (completed + %)
- ล่าช้า/ยังไม่เริ่ม (delayed + planned counts)

---

## IMPORTANT BUSINESS RULES

1. **Progress %** is automatically calculated by database trigger from milestones — never manually set in application code
2. **Countdown** always starts from `2026-04-09` as base date for policies without explicit `start_date`
3. **Super License deadline = 2026-10-06** (180 days from April 9, 2026)
4. **Omnibus Law deadline = 2027-04-09** (365 days from April 9, 2026)
5. **Vote deduplication** is by `ip_hash` (SHA-256 of IP + date salt) — one vote per IP per policy per day
6. **Community tips** are NEVER published directly — they must go through `status: 'verified_published'` by an admin
7. **Activity Log entries** with `publish_status: 'draft'` are invisible to public API
8. **All Thai dates** displayed in Buddhist Era (พ.ศ.) — `year + 543`. Use a `toBuddhistYear(date)` utility

---

## FIRST TASK SEQUENCE

Execute these in order:

1. `npx create-next-app@latest policywatch-thailand --typescript --tailwind --app --src-dir=false --import-alias="@/*"`
2. Install dependencies: `npm install @supabase/supabase-js @supabase/ssr shadcn-ui recharts @vercel/og date-fns`
3. Run `npx shadcn@latest init` — use Default style, Slate base color, CSS variables
4. Add shadcn components: `npx shadcn@latest add card badge button input select progress tabs`
5. Create Supabase project, run the migration SQL, then run the seed SQL
6. Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
7. Build in this order: types.ts → lib/supabase/* → API routes → components → pages

---

## CONTENT RULES

- All UI text in Thai (ภาษาไทย)
- Dates displayed as Thai format: `9 เมษายน 2569` (Buddhist Era)
- Numbers use Thai comma format: `1,500,000 บาท`
- Never use placeholder/lorem ipsum text — use actual policy names from the seed data
- Page titles follow pattern: `ชื่อนโยบาย | PolicyWatch Thailand`

---

*Source: คำแถลงนโยบายของคณะรัฐมนตรี นายอนุทิน ชาญวีรกูล แถลงต่อรัฐสภา วันพฤหัสบดีที่ 9 เมษายน 2569*
