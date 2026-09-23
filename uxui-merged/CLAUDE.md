# uxui-merged — โปรโตไทป์ UX/UI ของ SchoolDark (รวม 2 ระบบ)

โฟลเดอร์นี้รวมโปรโตไทป์หน้าเว็บ **2 ระบบ** ที่เดิมอยู่คนละโฟลเดอร์ (`uxui/` และ `uxui-noeysod/`)
เข้าด้วยกัน โดย **รวมเฉพาะเมนู/การเดินทางระหว่างหน้า** — แต่ละระบบยังคงดีไซน์และโค้ดเดิมของตัวเองไว้ทั้งหมด

> [!IMPORTANT]
> ทั้งสองระบบใช้ **design system คนละชุด** และตั้งใจให้อยู่ร่วมกันแบบนี้ไปก่อน
> ยังไม่มีการ unify ธีม/คอมโพเนนต์ และยังไม่มีการรวม data layer — อย่าเริ่มแปลงฝั่งใดฝั่งหนึ่ง
> ไปหาอีกฝั่งโดยไม่ได้รับคำสั่งชัดเจนจากผู้ใช้

## โครงสร้าง

```text
uxui-merged/
├── index.html        # หน้า hub รวมลิงก์ทุกระบบ (ไม่พึ่ง CSS ของระบบย่อยฝั่งไหน)
├── shared/
│   └── cross-nav.js  # แหล่งข้อมูลเมนูรวม + ตัว render 3 แบบ (sidebar / topbar / hub)
├── schooldark/       # ระบบบุคลากร, การลา, บัตรขออนุญาต, การลาเรียนนักเรียน
│   └── CLAUDE.md     # ← รายละเอียดของระบบนี้อยู่ในไฟล์นี้
└── admission/        # ระบบรับสมัครนักเรียน + ทะเบียน/ข้อมูลนักเรียน (Admitify Spark)
    └── AGENTS.md     # ← รายละเอียดของระบบนี้อยู่ในไฟล์นี้ (source of truth ของฝั่งนั้น)
```

## ความต่างของ 2 ระบบ (อ่านก่อนแก้โค้ด)

| | `schooldark/` | `admission/` |
|---|---|---|
| โดเมน | บุคลากร/HR, การลาบุคลากร, บัตรขออนุญาต, การลาเรียนนักเรียน | รับสมัครนักเรียน ม.1/ม.4 (3 เฟส) + ทะเบียน/ข้อมูลนักเรียน |
| CSS | เขียนเอง (`app.css`) + CSS custom properties, glass-morphism | Tailwind CSS ผ่าน CDN + `tailwind.config` ในแต่ละหน้า |
| ธีม | มืด/สว่าง สลับได้ | ขาวอย่างเดียว (ห้ามเปลี่ยนกลับเป็นมืด) |
| ไอคอน | inline SVG (`app.html`) / SVG sprite `<use href="#i-...">` (`leave-features.html`) | Lucide ผ่าน CDN (`<i data-lucide="...">`) |
| State | localStorage `schooldark_*` (ใน `index.js`) + mock ในหน่วยความจำ | localStorage `admitify_*` ผ่าน `js/store.js` (`AdmitifyStore`) |
| Nav | sidebar + สลับ view แบบ SPA (`data-view`) ภายในไฟล์เดียว | header บนสุด + แยกไฟล์ HTML ต่อหน้า |

ทั้งคู่เป็น static prototype: เปิดไฟล์ `.html` ตรง ๆ ด้วย `file:///` ต้องทำงานได้ทันที
ไม่มี build step, ไม่มี backend

## กฎสำคัญ

1. **เพิ่ม/ลบ/เปลี่ยนชื่อหน้า = ต้องแก้ `shared/cross-nav.js` ด้วยเสมอ**
   ไฟล์นั้นคือแหล่งข้อมูลเมนูจุดเดียวของทั้งโปรเจกต์ ถ้าไม่แก้ หน้าใหม่จะไปไม่ถึงจากเมนูไหนเลย
2. **ห้ามฮาร์ดโค้ดลิงก์ข้ามระบบซ้ำในหน้าอื่น** — ให้ไปเพิ่มใน `NAV_SYSTEMS` แทน
3. ทุกหน้าในระบบย่อยอยู่ลึก 1 ชั้นเสมอ ลิงก์ข้ามระบบจึงใช้ prefix `../` (ตัว render จัดการให้แล้ว)
4. ลิงก์ *ภายใน* ระบบเดียวกันยังเป็น relative ในโฟลเดอร์ตัวเอง — ห้ามเปลี่ยนเป็น path เต็ม

## จุดเชื่อมของเมนูรวมในแต่ละหน้า

| ระบบ | placeholder ที่ฝังไว้ | ได้ออกมาเป็น |
|---|---|---|
| `schooldark/*.html` | `<li id="cross-nav-sidebar">` ท้าย `<ul class="sidebar-menu">` | กลุ่มเมนูใน sidebar สไตล์ `app.css` |
| `admission/*.html` | `<span id="cross-nav-topbar">` ในแถบแท็บของ `<header>` | ปุ่ม dropdown "ระบบอื่น" สไตล์ Tailwind |
| `index.html` (hub) | `<div id="cross-nav-hub">` | การ์ดของแต่ละระบบพร้อมลิสต์ลิงก์ |

ตัว render จะ**ตัดระบบที่หน้านั้นสังกัดอยู่ออก**เสมอ (กันซ้ำกับเมนูเดิมของหน้า)

## ประวัติการรวม

- โฟลเดอร์เดิม `uxui/` → `schooldark/`, `uxui-noeysod/` → `admission/` (ย้ายด้วย `git mv` ประวัติไม่ขาด)
- ลบไฟล์เก่าของ `uxui/` ที่ `app.html` แทนที่ไปแล้ว: `index.html`, `personnel.html`, `settings.html`
  และ CSS ของมัน (`index.css`, `personnel.css`, `settings.css`) — แต่ **`index.js` / `personnel.js` /
  `settings.js` ยังอยู่** เพราะ `app.html` ยังโหลดใช้เป็นสมองของแต่ละโมดูล
- `admission/` เป็นโปรเจกต์ที่เคยเชื่อมกับ Lovable (`.lovable/project.json` ถูกย้ายมาด้วย) —
  ถ้า Lovable sync ไม่เจอหลังย้าย ให้ย้อน commit ที่ย้ายโฟลเดอร์ (ห้าม force push / rewrite history)
