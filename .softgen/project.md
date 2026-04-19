## Vision
PolicyWatch Thailand — แพลตฟอร์มติดตามนโยบายรัฐบาลอนุทิน 2 แบบเรียลไทม์ ให้ประชาชนตรวจสอบคำมั่นสัญญา "พูดแล้วทำ" จาก 23 นโยบายหลัก เริ่มนับตั้งแต่วันที่ 9 เมษายน 2569 (April 9, 2026)

เป้าหมาย: โปร่งใส น่าเชื่อถือ เข้าถึงง่าย — ศาลาว่าการดิจิทัลที่ทุกคนเข้าใจและใช้งานได้

**Current Status (2026-04-19):**
✅ Database schema พร้อม 23 นโยบาย, 5 กลุ่มยุทธศาสตร์, milestones, RLS
✅ Homepage Dashboard พร้อม stats, countdown timer, featured policies
✅ Policy Explorer พร้อม filters (cluster, status, priority, search)
✅ Policy Detail pages พร้อม timeline, KPIs, activity log
🚧 Admin Panel (next phase)
🚧 Community Tips (next phase)
🚧 Public Voting (next phase)

## Design
สไตล์: Government accountability meets civic tech — ความน่าเชื่อถือของหน่วยงานราชการ + ความทันสมัยของ data platforms

**Color System (HSL for opacity support):**
```css
--primary: 238 56% 49%        /* Indigo 600 — ราชการน่าเชื่อถือ */
--background: 42 47% 97%       /* Cream — อ่านง่าย ไม่จ้า */
--foreground: 222 47% 11%      /* Slate 900 — text หลัก */
--accent: 43 96% 56%           /* Amber 500 — deadline warning */
--muted: 210 40% 96%           /* Slate 50 — secondary surfaces */
--success: 160 84% 39%         /* Emerald 600 — สำเร็จ */
--destructive: 0 84% 60%       /* Red 500 — ล่าช้า */
```

**Typography:**
- Heading: `Sarabun` (700, 600) — Thai government standard, professional
- Body: `IBM Plex Sans Thai` (400, 500) — readable, modern, supports Thai numerals
- Both from Google Fonts, ทุก weight ที่ต้องใช้

**Style direction:**
- Card-based layout พร้อม subtle elevation
- Traffic light system สำหรับ deadline countdown (green → yellow → red)
- Clean data visualization — progress bars, timeline, budget charts
- Responsive mobile-first

## Features
1. **Dashboard** — overview stats, countdown timers, latest updates
2. **Policy Explorer** — 23 policies กรองตาม cluster/status/priority
3. **Policy Detail** — full info, milestones, budget, activity log, evidence
4. **Cluster Pages** — 5 strategic clusters
5. **Admin Panel** — manage policies, approve updates (Supabase Auth + RLS)
6. **Community Tips** — ประชาชนส่งเบาะแส (moderation queue)
7. **Public Vote** — trust/doubt/distrust per policy (IP hash dedup)