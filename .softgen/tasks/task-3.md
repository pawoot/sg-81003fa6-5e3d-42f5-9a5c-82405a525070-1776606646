---
title: Policy Explorer + Detail Pages
status: done
priority: high
type: feature
tags: [policies, detail]
created_by: agent
created_at: 2026-04-19T13:18:16Z
position: 3
---

## Notes
หน้า Policy Explorer: แสดงนโยบายทั้งหมด กรองตาม cluster/status/priority
หน้า Policy Detail: ข้อมูลครบถ้วน milestones, budget, activity log, evidence, public vote

## Checklist
- [ ] Policy Explorer: grid cards, filters (cluster, status, priority), search
- [ ] PolicyCard component: title, status badge, progress bar, cluster color, countdown (ถ้ามี deadline)
- [ ] Policy Detail page: hero, description, KPIs, milestones timeline
- [ ] MilestoneTimeline component: horizontal steps (desktop), vertical (mobile)
- [ ] BudgetTracker: แสดงงบประมาณ planned/approved/disbursed (ถ้ามี)
- [ ] ActivityLog: timeline updates พร้อม DataSourceBadge
- [ ] EvidenceBox: links + files พร้อม source type icons
- [ ] PublicVote component: trust/doubt/distrust buttons + results

## Acceptance
1. ดูนโยบายได้ทั้ง 23 ตัว แบ่งตาม cluster ชัดเจน
2. Policy Detail แสดงข้อมูลครบ timeline + budget + updates
3. Vote system ใช้งานได้ (IP hash dedup)