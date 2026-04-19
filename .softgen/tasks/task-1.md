---
title: Design System + Core Layout
status: done
priority: urgent
type: feature
tags: [foundation, design-system]
created_by: agent
created_at: 2026-04-19T13:18:16Z
position: 1
---

## Notes
ตั้งค่า design system, fonts, color tokens ใน globals.css + tailwind.config.ts ให้พร้อมใช้งานทั้งโปรเจค
สร้าง Navbar + Footer + SEO component ที่ใช้ร่วมกันทุกหน้า

## Checklist
- [x] ตั้งค่า Sarabun + IBM Plex Sans Thai fonts ใน globals.css (import ก่อน @tailwind)
- [x] Retheme shadcn tokens (primary, accent, muted, success, destructive) ตาม project brief
- [x] สร้าง Navbar component: logo "PolicyWatch Thailand", menu links (Dashboard, นโยบาย, เกี่ยวกับ)
- [x] สร้าง Footer: copyright, social links, data sources disclaimer
- [x] อัปเดต SEO component defaults: title="PolicyWatch Thailand", description="ติดตามนโยบายรัฐบาลอนุทิน 2"

## Acceptance
1. ทุกหน้าแสดงฟอนต์ Sarabun สำหรับ headings และ IBM Plex Sans Thai สำหรับ body
2. สีตามออกแบบ: primary (indigo), success (emerald), warning (amber), destructive (red)
3. Navbar + Footer ปรากฏทุกหน้า พร้อม responsive mobile menu