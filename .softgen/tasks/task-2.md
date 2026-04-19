---
title: Homepage Dashboard
status: todo
priority: urgent
type: feature
tags: [dashboard, stats]
created_by: agent
created_at: 2026-04-19T13:18:16Z
position: 2
---

## Notes
หน้าแรกแสดง hero section + stats cards + countdown timers + latest updates feed
ใช้ข้อมูลจริงจาก seed data (23 policies, 5 clusters, 4 urgent policies)

## Checklist
- [ ] Hero section: slogan "พูดแล้วทำ", subtitle, CTA ดูนโยบายทั้งหมด
- [ ] HeroStats component: 4 cards (ทั้งหมด, กำลังดำเนินการ, เสร็จสิ้น, ล่าช้า/รอ)
- [ ] Featured policies section: 4 urgent policies (Super License, Omnibus Law, OECD, Net Zero) พร้อม countdown
- [ ] Cluster overview: 5 cards แสดงชื่อ cluster + icon + จำนวนนโยบาย
- [ ] Latest updates feed: 5 activity log ล่าสุด

## Acceptance
1. Dashboard โหลดเร็ว แสดงข้อมูลจริงทั้งหมด
2. Countdown timers แสดงสีตาม logic: เขียว (>90 วัน), เหลือง (30-90), แดง (<30)
3. Responsive ทั้ง desktop + mobile