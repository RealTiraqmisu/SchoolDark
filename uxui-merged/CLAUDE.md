# uxui-merged — โปรโตไทป์ UX/UI ของ SchoolDark (รวม 2 ระบบ)

โฟลเดอร์นี้รวมโปรโตไทป์หน้าเว็บ **2 ระบบ** ที่เดิมอยู่คนละโฟลเดอร์ (`uxui/` และ `uxui-noeysod/`)
เข้าด้วยกัน โดย **รวมเฉพาะเมนู/การเดินทางระหว่างหน้า** — แต่ละระบบยังคงดีไซน์และโค้ดเดิมของตัวเองไว้ทั้งหมด

> [!IMPORTANT]
> ทั้งสองระบบใช้ **design system คนละชุด** และตั้งใจให้อยู่ร่วมกันแบบนี้ไปก่อน
> ยังไม่มีการ unify ธีม/คอมโพเนนต์ และยังไม่มีการรวม data layer — อย่าเริ่มแปลงฝั่งใดฝั่งหนึ่ง
> ไปหาอีกฝั่งโดยไม่ได้รับคำสั่งชัดเจนจากผู้ใช้

## ผู้พัฒนาและขอบเขตความรับผิดชอบ

โปรเจกต์นี้มีผู้พัฒนา 2 คน (Team B ตาม `admission/materials/doc/copy-of-scope.md`) แบ่งงานตามโฟลเดอร์:

- **noeysod** (เนยสด): `admission/` (รับสมัครนักเรียน + ฝ่ายทะเบียน/ข้อมูลนักเรียน) และ `parent/`
  (พอร์ทัลผู้ปกครอง) — หมายเหตุ: ขาสมัครเรียนฝั่งผู้ปกครองใน `parent/` ยังไม่ได้ทำ พักไว้ก่อน
- **care** (แคร์): `schooldark/` (บุคลากร, การลาบุคลากร, บัตรขออนุญาตนักเรียน, การมาเรียน/
  การลาเรียนนักเรียน ฯลฯ)

ส่วนกลางที่ใช้ร่วมกัน (`shared/`, `settings/`, `index.html` หน้า hub) ไม่ใช่ของฝ่ายใดฝ่ายหนึ่ง —
แก้ไฟล์เหล่านี้กระทบทั้ง 2 ฝั่ง ควรแจ้งอีกฝ่ายเสมอ

`sdq.html`/`home-visit.html` ใน `parent/` เป็น placeholder ของ Team C (ดู `parent/CLAUDE.md`)
ไม่ใช่ของ noeysod หรือ care

หากได้รับคำสั่งให้แก้ไฟล์ในโฟลเดอร์ของอีกฝ่าย (เช่น noeysod สั่งแก้ `schooldark/`) ให้ทำได้เมื่อ
มีคำสั่งชัดเจนเท่านั้น และบันทึก/แจ้งไว้ให้อีกฝ่ายทราบว่ามีการแก้ไฟล์ของตัวเอง

noeysod มีกฎการทำงานส่วนตัวเพิ่มเติมที่ `uxui-merged/noeysod-stuff/noeysod.md` (มีผลเฉพาะ
session ที่ noeysod เป็นคนคุยเท่านั้น ไม่ใช่กฎของทีม)

## โครงสร้าง

```text
uxui-merged/
├── index.html         # หน้า hub รวมลิงก์ทุกระบบ (การ์ดกลางหน้า ไม่มี sidebar ของตัวเอง)
├── shared/
│   ├── cross-nav.js   # แหล่งข้อมูลเมนูรวมจุดเดียว — สร้าง sidebar ทั้งอันของทุกหน้า
│   ├── cross-nav.css  # สไตล์ของ sidebar ทั้งอัน (ย้ายมาจาก schooldark/app.css เดิม)
│   ├── demo-panel.js  # แผงสาธิตลอย (ลาก/หุบได้): สลับบทบาท (actor) + ปุ่มกรอกข้อมูลตัวอย่างของหน้า (XDemo.register) — โหลดโดย cross-nav.js
│   └── impact-confirm.js  # ป๊อปอัปยืนยันการแก้/ลบ/ปิดใช้งาน/บันทึกการตั้งค่า (ImpactConfirm.show) — ดูกฎข้อ 8
├── schooldark/       # ระบบบุคลากร, การลา, บัตรขออนุญาต, การลาเรียนนักเรียน
│   └── CLAUDE.md     # ← รายละเอียดของระบบนี้อยู่ในไฟล์นี้
├── admission/        # ระบบรับสมัครนักเรียน + ทะเบียน/ข้อมูลนักเรียน (Admitify Spark)
│   └── AGENTS.md     # ← รายละเอียดของระบบนี้อยู่ในไฟล์นี้ (source of truth ของฝั่งนั้น)
├── apply/            # พอร์ทัลสมัครเรียนออนไลน์สำหรับผู้สมัคร/ผู้ปกครอง (ย้ายออกมาจาก admission/) — ดูหัวข้อ "พอร์ทัลสมัครเรียน (apply/)" ด้านล่าง
├── settings/         # ศูนย์รวมการตั้งค่าของทั้ง 2 ระบบ (โฟลเดอร์กลาง ไม่ใช่ของฝั่งใด)
│   ├── index.html    # การ์ดรวมทุกหมวดตั้งค่า (อ่านจาก NAV_GROUPS กลุ่ม id "settings")
│   ├── school.html   # ตั้งค่าโรงเรียน 8 แท็บ (5 master data ของ noeysod + 3 ย้ายมาจาก care) — ดูหัวข้อถัดไป
│   ├── personnel.html  # ตั้งค่าบุคลากร 6 แท็บ (ย้ายมาจาก schooldark/app.html)
│   ├── leave.html    # ตั้งค่าการลา 2 แท็บ: staff (บุคลากร) + student (นักเรียน) — ย้ายมาจาก schooldark/ (2026-09-29)
│   └── js/
│       ├── school-store.js        # เก็บข้อมูล master data ของ school.html คีย์ localStorage `school_*`
│       ├── sd-settings-store.js   # window.SdSettings — อ่าน/เขียนคีย์ `sd_*` ของ care (seed ซ้ำกับ schooldark/settings.js)
│       ├── personnel-settings.js  # logic ของ personnel.html
│       ├── leave-settings.js      # router + helpers ของ leave.html (window.LeaveSettings)
│       ├── leave-settings-staff.js    # แท็บ staff: wizard 6 ขั้น + live preview
│       └── leave-settings-student.js  # แท็บ student: wizard 5 ขั้น ประเภทการลา/ผู้อนุมัติ/เวอร์ชัน
└── parent/           # พอร์ทัลผู้ปกครอง — navbar บนสุดของตัวเอง (ไม่ใช้ sidebar แอดมิน)
    └── CLAUDE.md     # ← รายละเอียดของระบบนี้อยู่ในไฟล์นี้
```

> [!NOTE]
> ตั้งแต่รอบรวม sidebar (ดู "ประวัติการรวม" ท้ายไฟล์) ทั้ง 2 ระบบมี **sidebar ซ้ายเดียวกัน
> ทุกหน้า** แล้ว (ก่อนหน้านี้ admission ใช้แถบแท็บบน header แทน) `shared/cross-nav.js`
> เป็นคนสร้าง `<aside class="sidebar">` ทั้งก้อนให้ทุกหน้า ไม่ใช่แค่เติมเมนูข้ามระบบต่อท้าย
> เมนูเดิมอีกต่อไป — ดูรายละเอียดในหัวข้อ "จุดเชื่อมของเมนูรวมในแต่ละหน้า" ด้านล่าง

> [!NOTE]
> **layout ความกว้างเนื้อหา (ทดลอง 2026-09-29)**: มี `shared/page-layout.css` ให้เลือก 1 แบบต่อหน้า — `.xpage--read` (หน้าอ่าน/ฟอร์ม
> ตรงกลาง จำกัด 1280px) หรือ `.xpage--wide` (หน้าตาราง เต็มพื้นที่เนื้อหา) ใส่คลาสเดียวกันทั้ง `<header>` ด้านใน และ `<main>` — ตอนนี้ใช้กับ
> `admission/index.html`, `admission/students.html` และ `settings/{index,school,personnel,leave}.html` และหน้าตั้งค่า admission 4 หน้า (`admission/{settings,course_settings,room_exam_settings,student_field_settings}.html`) (แบบ wide, 2026-09-30) หน้าอื่นยังเป็น `max-w-[1400px]` เดิม รอเนยสดดูผลก่อนขยาย
>
> **ไอคอนสี่เหลี่ยมตกแต่ง (2026-09-30)**: ลบกล่องไอคอนข้างชื่อระบบใน `<header>` และข้างชื่อหน้า (`<h2>`) ออกจากหน้า admission/settings/apply แล้ว ตามที่ noeysod สั่ง (รก) — อย่าใส่กลับ

## ความต่างของ 2 ระบบ (อ่านก่อนแก้โค้ด)

| | `schooldark/` | `admission/` |
|---|---|---|
| โดเมน | บุคลากร/HR, การลาบุคลากร, บัตรขออนุญาต, การลาเรียนนักเรียน | รับสมัครนักเรียน ม.1/ม.4 (3 เฟส) + ทะเบียน/ข้อมูลนักเรียน |
| CSS | เขียนเอง (`app.css`) + CSS custom properties, glass-morphism | Tailwind CSS ผ่าน CDN + `tailwind.config` ในแต่ละหน้า |
| ธีม | ขาวอย่างเดียว (ถอดโหมดมืดออกทั้งหมดแล้ว) | ขาวอย่างเดียว (ห้ามเปลี่ยนกลับเป็นมืด) |
| ไอคอน | inline SVG (`app.html`) / SVG sprite `<use href="#i-...">` (`leave-features.html`) | Lucide ผ่าน CDN (`<i data-lucide="...">`) |
| State | localStorage `schooldark_*` (ใน `index.js`) + mock ในหน่วยความจำ | localStorage `admitify_*` ผ่าน `js/store.js` (`AdmitifyStore`) |
| Nav ภายในระบบ | sidebar + สลับ view แบบ SPA (`data-view`) ภายในไฟล์เดียว | header บนสุด (เดิม — ตอนนี้ถูกซ่อนด้วย `data-legacy-tabs`) + แยกไฟล์ HTML ต่อหน้า |
| Nav รวม (sidebar ซ้าย) | **เหมือนกันทุกหน้า** — สร้างและคุมโดย `shared/cross-nav.js` (ดูหัวข้อถัดไป) | เหมือนกัน |

ทั้งคู่เป็น static prototype: เปิดไฟล์ `.html` ตรง ๆ ด้วย `file:///` ต้องทำงานได้ทันที
ไม่มี build step, ไม่มี backend

## กฎสำคัญ

1. **เพิ่ม/ลบ/เปลี่ยนชื่อเมนูใด ๆ (ทั้งของ schooldark และ admission) = ต้องแก้ `NAV_GROUPS`
   ใน `shared/cross-nav.js` ด้วยเสมอ** — ไฟล์นั้นคือแหล่งข้อมูลเมนูจุดเดียวของทั้งโปรเจกต์
   ถ้าไม่แก้ หน้าใหม่จะไปไม่ถึงจากเมนูไหนเลย และเมนูจะไม่ตรงกันระหว่างหน้า
2. **ห้ามฮาร์ดโค้ดลิงก์ข้ามระบบซ้ำในหน้าอื่น** — ให้ไปเพิ่มใน `NAV_GROUPS` แทน
3. ทุกหน้าในระบบย่อยอยู่ลึก 1 ชั้นเสมอ ลิงก์ข้ามระบบจึงใช้ prefix `../` (`hrefTo()` ใน
   cross-nav.js คำนวณให้อัตโนมัติจากตำแหน่งไฟล์ปัจจุบัน — ไม่ต้องเขียน `../` เองใน `NAV_GROUPS`)
4. ลิงก์ *ภายใน* ระบบเดียวกันยังเป็น relative ในโฟลเดอร์ตัวเอง — ห้ามเปลี่ยนเป็น path เต็ม
5. **ห้ามใช้ class `submenu-item` กับเมนูย่อยที่ลิงก์ข้ามหน้า** — ทั้ง `schooldark/app.js`
   (`bindSubmenus`) และ `schooldark/leave-features.js` ดัก `.submenu-item` ทุกตัวด้วย
   `preventDefault()` เสมอ ถ้าใช้ class เดิมลิงก์ข้ามหน้าจะกดไม่ไปไหนเลย — cross-nav.js ใช้
   class `submenu-link` แยกไว้แล้วสำหรับกรณีนี้ (ดูฟังก์ชัน `renderItem` ในไฟล์นั้น)
6. ห้ามแก้สไตล์ sidebar ที่ `schooldark/app.css` อีกต่อไป (ย้ายไป `shared/cross-nav.css`
   ทั้งหมดแล้ว) และห้ามแก้ markup ของ sidebar ตรง ๆ ในแต่ละหน้า — ทุกหน้าได้ sidebar มาจาก
   `shared/cross-nav.js` เท่านั้น (ดูหัวข้อถัดไป)
7. **สี/ฟอนต์/ขนาดของ sidebar กำหนดที่ `--xnav-*` ใน `shared/cross-nav.css` ที่เดียว** — ห้ามให้หน้าใดประกาศ `--xnav-*` หรือสไตล์
   `.sidebar`/`.menu-item` ฯลฯ ทับ และห้ามให้ sidebar ไปอ่านตัวแปรสีของหน้า (เคยทำให้สี sidebar ต่างกันระหว่าง schooldark กับ admission)
8. **แก้ไข / ลบ / ปิดใช้งาน / บันทึก / นำกลับมาใช้ การตั้งค่าใด ๆ ต้องผ่าน `ImpactConfirm.show()`** (`shared/impact-confirm.js`,
   โหลดแล้วใน `schooldark/app.html`, `schooldark/leave-features.html`, `settings/school.html`) — บอก "สิ่งที่เปลี่ยน" (เดิม → ใหม่)
   และ "ส่งผลกับ" หน้า/ส่วนไหน (เขียนจากที่ใช้ข้อมูลนั้นจริงในโค้ด ถ้ายังไม่ได้เชื่อมที่ไหนให้บอกตรง ๆ) ห้ามใช้ `confirm()` เปล่า ๆ
   การเพิ่มรายการใหม่ไม่ต้องมีป๊อปอัป วิซาร์ดตั้งค่า (การลาบุคลากร / การลาเรียน / บัตรขออนุญาต) มีปุ่ม "ประวัติการตั้งค่า"
   ที่ดูเวอร์ชันเก่าตามรอบปี/ปีการศึกษา/ภาคเรียน และ "นำการตั้งค่านี้มาใช้" ได้ — ถ้าเพิ่มวิซาร์ดตั้งค่าใหม่ให้ทำแบบเดียวกัน
   และกดถัดไป/ย้อนกลับในวิซาร์ดต้องเลื่อนกลับขึ้นบนสุดเสมอ
9. **เมนูใหม่ใน `NAV_GROUPS` ต้องใส่ `roles` ให้ถูก** (ดู `ACTORS` ใน `cross-nav.js`; ไม่ใส่ = ทุกบทบาท, `[]` = admin เท่านั้น) และปุ่ม "กรอกข้อมูลตัวอย่าง" ของหน้า admin
   ให้ลงทะเบียนผ่าน `window.XDemo.register({id,label,run,when})` เข้าแผงสาธิตกลาง แทนการทำปุ่มลอยเองในหน้า (ยกเว้น `apply/`/`parent/` ที่ไม่โหลด cross-nav
   มีแผงของตัวเอง) actor เก็บที่ localStorage `xdemo_actor` — มีผลแค่เมนู/ป้ายผู้ใช้ ยังไม่ผูก logic ในหน้า

## จุดเชื่อมของเมนูรวมในแต่ละหน้า

ตั้งแต่รอบรวม sidebar, `shared/cross-nav.js` **สร้าง `<aside class="sidebar">` ทั้งก้อน**
(โลโก้ + กลุ่มเมนู + เมนูย่อย + badge + user footer) ให้ทุกหน้า ไม่ใช่แค่เติมท้ายเมนูเดิมอีกต่อไป:

| ระบบ | วิธีฝังสคริปต์ | ผลลัพธ์ |
|---|---|---|
| `schooldark/*.html` | วาง `<script src="../shared/cross-nav.js">` **แทนที่เนื้อหาเดิมข้างใน** `<aside class="sidebar" id="sidebar">...</aside>` ที่มีอยู่แล้ว | คุม sidebar SPA เดิม (data-module/data-view/data-step/data-tab/data-subtab) — `app.js` / อินไลน์สคริปต์ของ `leave-features.html` ยัง bind การคลิกเมนูในหน้าเดียวกันเหมือนเดิมทุกอย่าง |
| `admission/*.html` | วาง `<script src="../shared/cross-nav.js">` เป็น**สิ่งแรกหลัง `<body>`** (ไม่มี `<aside>` อยู่ก่อน) | สคริปต์สร้าง `<aside id="sidebar">` แบบ `position:fixed` ทางซ้ายให้เอง + ใส่ class `xnav-fixed-layout` บน `<html>` (ดัน body ด้วย padding-left ใน `cross-nav.css`) |
| `index.html` (hub) | `<div id="cross-nav-hub">` (เหมือนเดิม) | การ์ดของแต่ละระบบพร้อมลิสต์ลิงก์ — หน้านี้**ไม่มี sidebar ซ้าย** ตั้งใจเก็บดีไซน์การ์ดกลางหน้าแบบเดิมไว้ |
| `settings/*.html` | เหมือน `admission/*.html` (script เป็นสิ่งแรกหลัง `<body>`, ไม่มี `<aside>` มาก่อน) | ได้ sidebar fixed แบบเดียวกับ admission; `settings/index.html` มี `<div id="settings-hub">` เพิ่มเติมที่อ่าน `window.CrossNav.NAV_GROUPS` เอง (ดูย่อหน้าถัดไป) |
| `parent/*.html` | **ไม่โหลด** `shared/cross-nav.js`/`cross-nav.css` เลย (ข้อยกเว้นตั้งใจ) — ใช้ `parent/js/parent-nav.js` เรนเดอร์ navbar บนสุดของตัวเองแทน | navbar เต็มความกว้างด้านบน (ไม่ใช่ sidebar), เข้าถึงจากหน้า hub ผ่าน item `hubOnly: true` ในกลุ่ม `id: 'parent'` ของ `NAV_GROUPS` |
| `apply/*.html` | **ไม่โหลด** `shared/cross-nav.js`/`cross-nav.css` เลย (ข้อยกเว้นตั้งใจ เหมือน `parent/`) — เป็นพอร์ทัลสำหรับผู้สมัคร ไม่ใช่เจ้าหน้าที่ จึงไม่มี sidebar แอดมิน มีแค่ header เรียบๆ ของตัวเองลิงก์กลับ `apply/index.html` | เข้าถึงจากหน้า hub ผ่านกลุ่ม `id: 'public'` (`hubOnly: true` ทั้งกลุ่ม, การ์ดขึ้นก่อนการ์ดอื่นด้วยคลาส `hub-card--featured`) — สคริปต์อ้าง `../admission/js/*` ตรงๆ (คนละโฟลเดอร์แต่ data layer เดียวกับ admission) |

ทุกหน้าต้องโหลด `shared/cross-nav.css` คู่กับ `cross-nav.js` เสมอ (ยกเว้น hub ที่ไม่จำเป็น)
เมนูที่แสดงจะเป็น**ชุดเดียวกันทุกหน้า** (ไม่ตัดกลุ่มของระบบตัวเองออกอีกต่อไป) — ต่างกันแค่ไฮไลต์
รายการที่ active และ item ที่อยู่หน้าเดียวกันจะกลายเป็นปุ่มสลับ view แบบไม่โหลดหน้าใหม่
(ส่วนที่ไม่ใช่หน้าปัจจุบันจะเป็นลิงก์ข้ามหน้าจริง พร้อม deep-link ผ่าน hash ไปหน้า/ขั้นตอนที่ถูกต้อง)

ใน `NAV_GROUPS` เมนูย่อย (`children`) มีได้ 2 แบบ: `{ label, step|tab|subtab }` = สลับ view ในหน้า
เดียวกัน (schooldark) หรือ `{ label, page }` = ลิงก์ไปคนละไฟล์ (เช่น "ตั้งค่ารับสมัคร" ของ admission
ที่รวม 4 หน้าตั้งค่าไว้ใต้เมนูเดียว) ส่วน item ที่ใส่ `hubOnly: true` จะแสดงแค่ในการ์ดหน้า hub
ไม่แสดงใน sidebar (กลุ่ม `id: 'parent'` และกลุ่ม `id: 'public'` ทั้งกลุ่มเป็น `hubOnly: true` ทั้งหมด)

หมวดใน sidebar **จัดตามงานที่ผู้ใช้ทำ ไม่ได้จัดตามไฟล์** (จัดใหม่ 2026-09-29): แดชบอร์ดภาพรวม (บนสุด ไม่มีหัวหมวด) → งานของฉัน (ยื่นคำขอลา (บุคลากร) — ทุกบทบาทเห็น) → งานทะเบียนนักเรียน
→ งานรับสมัครออนไลน์ → งานกิจการนักเรียน (แดชบอร์ดการมาเรียน + เช็คชื่อ + รายงานการมาเรียน + บัตรขออนุญาต — Team C เป็นเจ้าของหลัก
เรามีส่วนที่ต้องทำด้วย) → งานบุคลากร (เหลือเมนู รายชื่อบุคลากร / นำเข้าข้อมูล / พิมพ์ & QR Studio — ไม่มี ข้อมูลพื้นฐาน/การศึกษา/ตำแหน่ง แล้ว: เข้าผ่านปุ่ม "เพิ่มบุคลากรรายบุคคล"/"แก้ไข" ใน รายชื่อบุคลากร → wizard 3 ขั้น) → งานบริหารการลา (เมนูแบน 4 อัน: อนุมัติ (บุคลากร), ยื่น/อนุมัติ (นักเรียน), ยื่นบัตรขออนุญาต ต่อท้ายชื่อด้วย
(บุคลากร)/(นักเรียน) — ไม่ทำเมนูซ้ำ 2 ที่ ข้อมูลเชื่อมกันอยู่แล้ว เช่นแดชบอร์ดการมาเรียนดึงใบลาที่อนุมัติ) → การตั้งค่า (ล่างสุด)
กลุ่มที่ `label: ''` ใน `NAV_GROUPS` = ไม่แสดงหัวหมวด  รายชื่อบุคลากรมีเมนูเดียวคือของ `app.html` (view `directory`) —
เมนู "รายชื่อบุคลากรและอาจารย์" (view `employees` ใน `leave-features.html`) ถูกถอดออกจาก sidebar
แล้ว แต่โค้ด view นั้นยังอยู่ในไฟล์ (ฟีเจอร์ Export/ชิปประเภท/รายงานฝึกอบรมของมันยังไม่ได้ย้าย
มาไว้ที่ `app.html`)

**ช่องค้นหาเมนู** อยู่ใต้โลโก้ของทุกหน้า (สร้างใน `cross-nav.js` เอง ไม่ต้องแก้หน้าไหน): กรองเมนู
เดิมในที่ด้วย attribute `hidden` (ไม่ได้สร้างรายการผลลัพธ์ใหม่ ลิงก์จึงยังใช้ click handler เดิมของ
แต่ละหน้า), กางกลุ่มที่มีเมนูย่อยตรงคำค้นด้วยคลาส `.search-open` (ไม่แตะ `.expanded` ที่ JS ของหน้า
คุมอยู่), ค้นได้จาก label, ชื่อหมวด และ field `keywords` (คำพ้องคั่นด้วยช่องว่าง ใส่ใน item ของ
`NAV_GROUPS` — เพิ่มเมนูใหม่ควรใส่ด้วย) คีย์ลัด `/` หรือ `Ctrl+K`, `↑`/`↓` + `Enter` เปิด, `Esc` ล้าง

กดเมนู/เมนูย่อยที่สลับ view ในหน้าเดียวกัน `cross-nav.js` จะเลื่อน `.content-body` (และ window)
กลับขึ้นบนสุดเสมอ — listener ที่ `cross-nav.js` ฟังคลิกบน `.sidebar-menu` ต้องใช้ `capture: true`
เพราะ handler ของ `.submenu-item` ใน `app.js` / `leave-features.html` เรียก `stopPropagation()`

item ที่ชี้มาหน้าปัจจุบันแบบไม่ใช่ SPA view (ไม่มี `module`/`view` — เช่นหมวด "ตั้งค่ารับสมัคร"
ใน `settings/index.html` ที่เป็นลิงก์ `#anchor` ในหน้าเดียวกัน) จะถูก
ไฮไลต์ตาม `location.hash` โดย `syncAnchorActive()` ใน `cross-nav.js` (รันตอนโหลด + ทุก `hashchange`)
— hash ตรง `anchor` ตัวไหนตัวนั้น active และกางเมนูย่อย, ไม่ตรงเลย → item ของหน้านั้นที่ไม่มี
`anchor` (เช่น "ศูนย์รวมการตั้งค่า") active แทน
ตั้งค่าโรงเรียน/บุคลากร/การลา ลิงก์ไป `settings/school.html` / `personnel.html` / `leave.html` ตรง ๆ แล้ว
(2026-09-30) — ส่วนตั้งค่ารับสมัครยังเป็น anchor เพราะมี 4 หน้าแยก ไม่มีหน้าหลัก

เมนูย่อยต้องอยู่ในโครง `<div class="submenu"><ul class="submenu-list">…</ul></div>` เสมอ —
`.submenu` เป็น grid แถวเดียว (`0fr` ↔ `1fr`) ถ้าใส่ `<li>` เป็นลูกตรง ๆ หลายตัว จะพับได้แค่ตัวแรก
ตัวที่เหลือโผล่ค้างตอนพับเมนู (บั๊กเดิมที่เคยเจอ)

Deep-link ข้ามหน้า (`#m=..&v=..&step|tab|subtab=..`) ใน `cross-nav.js` รอ `DOMContentLoaded` แล้ว
ค่อย `setTimeout(0)` ก่อนคลิกเมนูเป้าหมาย — ห้ามเปลี่ยนกลับเป็น `setTimeout(0)` เฉย ๆ เพราะหน้าใหญ่
อย่าง `leave-features.html` timer จะยิงก่อนสคริปต์ท้ายหน้าผูก listener ให้เมนู ทำให้คลิกไม่มีผลและ
ค้างอยู่ที่ view เริ่มต้น (เคยเป็นบั๊ก: กด "อนุมัติการลานักเรียน" จาก `app.html` แล้วไปโผล่ "ยื่นบัตร
ขออนุญาต")

แถบแท็บเดิมบน `<header>` ของ admission (บอร์ดรับสมัคร/ข้อมูลนักเรียน/ตั้งค่าฟอร์ม) ยังอยู่ใน
HTML ทุกไฟล์ แต่ถูกซ่อนด้วย `data-legacy-tabs` (กฎ CSS จุดเดียวใน `cross-nav.css`) ตามที่ตกลง
กันไว้ — ยังไม่ได้ลบทิ้ง เผื่อย้อนกลับมาใช้

### ศูนย์รวมการตั้งค่า (`settings/`)

การตั้งค่าทั้งหมดของทั้ง 2 ระบบถูกดึงมารวมไว้ที่กลุ่มเดียวใน `NAV_GROUPS`: กลุ่มที่มี
`id: 'settings'` (label "การตั้งค่า") — หมวดอื่น ๆ **ไม่มีเมนูตั้งค่าหรือปุ่มทางลัด "ตั้งค่า…→"
ของตัวเองอีกแล้ว** (เคยมี item `shortcut: true` + `anchor` ท้ายหมวด แต่ถอดออกเพราะซ้ำกับหมวด
"การตั้งค่า" — `renderItem` ยังรองรับ `shortcut`/`anchor` อยู่ถ้าจำเป็นต้องใช้อีก) —
เพิ่ม/ลบ/แก้หน้าตั้งค่าใด ๆ ให้แก้ที่ `children` ของ item ในกลุ่ม `settings` เท่านั้น การ์ดใน
`settings/index.html` จะขึ้นเองอัตโนมัติ (อ่านจาก `window.CrossNav.NAV_GROUPS` ที่ export ไว้
ท้าย `cross-nav.js`) field พิเศษที่ใช้ในกลุ่มนี้: `section` (id ของ `<section>` ในหน้า
`settings/index.html`), `desc` (คำอธิบายใต้ label ในการ์ด), และ `children` แบบ `{label, page,
module?, view?, hash?, desc?}` — ถ้า child มี `view` และ `page` ตรงกับหน้าปัจจุบันจะกลายเป็น
`submenu-item` แบบ SPA เดิมของ schooldark ให้อัตโนมัติ (ดู `renderItem` ใน `cross-nav.js`)

`settings/school.html` เป็นหน้าตั้งค่า "โรงเรียน" **8 แท็บ** (สลับด้วย hash `#tab=<id>`, แท็บเริ่มต้นคือ `school`):
- 3 แท็บที่ย้ายมาจาก care (2026-09-29): `school` ข้อมูลโรงเรียน/ปีการศึกษา (จาก view `general` ของ `app.html`), `homeroom` ข้อมูลครูประจำชั้น,
  `attendance` เวลาเข้า-เลิกเรียนของนักเรียน (จาก view `attendance-settings` ของ `leave-features.html`) — ใช้คีย์ `sd_*` /
  `sd_student_attendance_settings` เดิมของ care ผ่าน `SdSettings`
- 5 แท็บ master data ของ noeysod: ข้อมูลห้องเรียน, ปฏิทินโรงเรียน, ข้อมูลปีการศึกษา, ข้อมูลระดับการศึกษา, ข้อมูลสาขางาน-สาขาวิชา
  เก็บผ่าน `SchoolStore` (`settings/js/school-store.js`, คีย์ `school_*`)
- ความกว้างเนื้อหา (2026-09-30): หน้า `settings/*` (index/school/personnel/leave) ใช้ `.xpage xpage--wide` (จาก `shared/page-layout.css`) ที่ `<header>` ด้านใน และ `<main>` เหมือน `admission/index`/`students` และกล่องเนื้อหาไม่มี `max-w` ซ้อน (เหลือแค่แถบแท็บที่จำกัดความกว้าง)

`settings/personnel.html` (+ `js/personnel-settings.js`) เป็นหน้าตั้งค่า "บุคลากร" 6 แท็บ ย้ายมาจาก `schooldark/app.html`: `schedule`
(เวลาทำงาน/กะ/วันหยุด), `permissions` (ผู้ใช้/สิทธิ์), `signatories` (ผู้ลงนาม), `staff-types`, `positions`, `departments` ทั้งหมดอ่าน/เขียนผ่าน
`SdSettings` (`settings/js/sd-settings-store.js`) — คีย์เดียวกับ care ทุกตัว การแก้ในโมดัลบันทึกทันที (ไม่มี draft)

`settings/leave.html` เป็นหน้าตั้งค่า "การลา" 2 แท็บ (hash `#tab=staff` เริ่มต้น / `#tab=student`) ย้ายมาจาก `leave-settings` ใน `app.html`
และ `student-leave-settings` ใน `leave-features.html` (ทั้งสอง view ถูกลบออกจาก `schooldark/` แล้ว) สคริปต์โหลดตามลำดับ:
`sd-settings-store.js` → `leave-settings.js` (router + helpers) → `leave-settings-staff.js` → `leave-settings-student.js`
**Contract**: `window.LeaveSettings = { tabs, helpers:{esc,toast,openModal,closeModal,confirm,debounce,svg}, switchTab }` — แต่ละแท็บลงทะเบียน
`LeaveSettings.tabs.<key> = { title, desc, iconSvg, render(panelEl) }` (`render` สร้างมาร์กอัป/โมดัลเอง โมดัลอยู่ใน `#modal-root`)
- `staff`: wizard 6 ขั้น + preview สด อ่าน/เขียน `SdSettings.leaveSettings()` / `saveLeaveSettings()` (คีย์ `schooldark_settings`, seed = `INITIAL_SETTINGS` ใน `schooldark/index.js` —
  ต้องตรงกัน) ตอนนี้ **บันทึกจริง** (เดิมค่าไม่ถูกเก็บเพราะ `saveStateToLocalStorage` ของ `settings.js` บังชื่อของ `index.js`); เพิ่ม/ลบผู้อนุมัติบันทึกทันที
- `student`: wizard 5 ขั้น ประเภทการลา (โมดัลกลางจอ) การ์ดบทบาทผู้อนุมัติ โมดัลบันทึกพร้อมวันที่มีผล → เวอร์ชัน active/scheduled และ drawer ประวัติ
  `schooldark/leave-features.js` อ่านเวอร์ชัน active จาก `sd_student_leave_versions` ตอนโหลด (ยังมีค่า default ในโค้ดเป็น fallback)
  ช่องกรอก `sett-*` เก็บไว้แต่ยังไม่มีหน้าไหนอ่านไปใช้; เวอร์ชัน scheduled ยังไม่ถูกเลื่อนเป็น active อัตโนมัติเมื่อถึงวัน (ช่องว่างเดิมของ care)
- คีย์ localStorage ใหม่ผ่าน `SdSettings`: `sd_student_leave_versions` (`studentLeaveVersions()`/`saveStudentLeaveVersions()`) และ
  `sd_student_leave_form` (`studentLeaveForm()`/`saveStudentLeaveForm()` — ปีการศึกษา/ภาคเรียน จำนวน+บทบาทผู้อนุมัติ เอกสารลาป่วย กำหนดเวลา ฯลฯ)

> [!IMPORTANT]
> ค่าเริ่มต้น (seed) ของ `sd_*` ถูก**ทำซ้ำ**อยู่ใน `sd-settings-store.js` และ `schooldark/settings.js` (`initSettingsDatabase()`)
> — ต้องเหมือนกันทุกตัวอักษร ถ้าแก้ seed ที่ใดที่หนึ่งต้องแก้อีกที่ด้วย ส่วน `schooldark/settings.js` ตอนนี้เหลือเป็น data layer อย่างเดียว
> (ไม่มี UI ตั้งค่าใน `app.html` แล้ว) รายละเอียดการย้าย: `schooldark/CHANGES-FOR-CARE.md`
>
> หมวดการลาย้ายแล้ว (2026-09-29) — ดู `settings/leave.html` ด้านล่าง

> [!NOTE]
> ข้อมูลใน `school_*` (ห้องเรียน/ปฏิทิน/ปีการศึกษา/ระดับชั้น/สาขา) เป็น mockup ที่สร้างขึ้นใหม่
> **ยังไม่เชื่อมกับข้อมูลเดิมของ 2 ระบบ** เช่น ห้องเรียนที่นี่ไม่ถูกใช้ใน `schooldark/app.html`
> view "homeroom" หรือแผนการเรียนของ `admission/course_settings.html` — ตั้งใจทำเป็น mockup
> ใช้งาน/ดูตัวอย่างได้ก่อน ยังไม่ได้เชื่อมข้อมูลจริงข้ามหน้า
> ข้อยกเว้น (อ่านอย่างเดียว): `schooldark/leave-features.html` อ่านวันเปิด-ปิดภาคเรียน (`school_academic_years`) ให้ปุ่ม
> "ภาคเรียนนี้" ในแดชบอร์ดการมาเรียน และ `parent/` (`parent/js/parent-store.js`, `parent/calendar.html`) อ่าน
> `school_academic_years` + `school_calendar` (ปฏิทิน/ตารางเรียน/การมาเรียนตัวอย่าง)

### พอร์ทัลสมัครเรียน (`apply/`)

`apply.html`/`status.html` ย้ายออกจาก `admission/` มาเป็นโฟลเดอร์แยก `apply/` แล้ว (เหตุผล: คนละกลุ่ม
ผู้ใช้ — ผู้สมัคร/ผู้ปกครอง ไม่ใช่เจ้าหน้าที่ — และคนละเลย์เอาต์ ไม่มี sidebar แอดมิน) มี 3 ไฟล์:
`apply/index.html` (หน้า landing ของพอร์ทัล, การ์ด "สมัครเรียน"/"ตรวจสอบสถานะ"), `apply/register.html`
(เดิมคือ `admission/apply.html`), `apply/status.html` (เดิมคือ `admission/status.html`) — ทั้ง 3 ไฟล์
**ไม่โหลด** `shared/cross-nav.*` (ดูตาราง "จุดเชื่อมของเมนูรวม" ด้านบน) แต่สคริปต์ยังอ้าง
`../admission/js/store.js` / `js/ui.js` / `js/tailwind-config.js` ตรงๆ เพราะยังใช้ data layer เดียว
กับ `admission/` (`AdmitifyStore`, คีย์ localStorage `admitify_*` ชุดเดียวกัน) — ย้าย/ลบ `admission/js/`
ต่อจากนี้ต้องแก้ path ฝั่ง `apply/` ตามด้วยเสมอ

`NAV_GROUPS` มีกลุ่มใหม่ `id: 'public'` (label "พอร์ทัลสมัครเรียน (สำหรับผู้สมัคร)") วางไว้**กลุ่มแรก**
ของ array, ทุก item เป็น `hubOnly: true` (ชี้ไปหน้า 3 หน้าของ `apply/`) — หน้า hub เรนเดอร์การ์ดของ
กลุ่มนี้**ก่อน**การ์ดอื่นเสมอ พร้อม class เพิ่ม `hub-card--featured` (สไตล์เด่นกว่าการ์ดปกติ อยู่ใน
`index.html` ของ hub) เพื่อให้เห็นชัดว่าเป็นพอร์ทัลสาธิตแยกต่างหาก

### Off-canvas sidebar บนมือถือ (≤768px)

`shared/cross-nav.css`/`cross-nav.js` มี breakpoint ใหม่ที่ ≤768px: sidebar เปลี่ยนเป็น **off-canvas เต็มความกว้าง**
(ทุกจอ >768px ความกว้างตามปุ่มย่อ/ขยายเท่านั้น 280↔72px ไม่มี auto-rail แล้ว ปุ่มนี้คุมที่ `cross-nav.js` ที่เดียวทุกหน้า รวม schooldark) (`transform: translateX(-100%)` ซ่อนไว้,
เลื่อนเข้าด้วยคลาส `html.xnav-mobile-open`) — `cross-nav.js` สร้างปุ่มแฮมเบอร์เกอร์
`.xnav-mobile-toggle` (มุมซ้ายบน) และฉากหลัง `.xnav-backdrop` ให้เอง, ปิดได้ด้วยคลิกฉากหลัง/Esc/กด
ลิงก์เมนู — **มีผลเฉพาะหน้าที่ใช้ class `xnav-fixed-layout` บน `<html>`** คือ `admission/*`,
`settings/*` (และตอนนี้คือ hub ที่ไม่ได้ใช้ class นี้จึงไม่มีผล) — **`schooldark/*` ไม่ได้ใช้ class นี้
จึงไม่ได้รับผลกระทบจากการเปลี่ยนนี้เลย** (sidebar ของ schooldark ยังเป็นพฤติกรรมเดิมทุกอย่างที่
ทุก breakpoint) ส่วน `parent/*`/`apply/*` ไม่โหลด cross-nav อยู่แล้วจึงไม่เกี่ยวข้องเช่นกัน

## ประวัติการรวม

- โฟลเดอร์เดิม `uxui/` → `schooldark/`, `uxui-noeysod/` → `admission/` (ย้ายด้วย `git mv` ประวัติไม่ขาด)
- ลบไฟล์เก่าของ `uxui/` ที่ `app.html` แทนที่ไปแล้ว: `index.html`, `personnel.html`, `settings.html`
  และ CSS ของมัน (`index.css`, `personnel.css`, `settings.css`) — แต่ **`index.js` / `personnel.js` /
  `settings.js` ยังอยู่** เพราะ `app.html` ยังโหลดใช้เป็นสมองของแต่ละโมดูล
- `admission/` เป็นโปรเจกต์ที่เคยเชื่อมกับ Lovable (`.lovable/project.json` ถูกย้ายมาด้วย) —
  ถ้า Lovable sync ไม่เจอหลังย้าย ให้ย้อน commit ที่ย้ายโฟลเดอร์ (ห้าม force push / rewrite history)
- **รวม sidebar ซ้าย** (หลังรวมเมนูครั้งแรก): `admission/*` ทุกหน้า (รวม `apply.html`/`status.html`
  เดิม ก่อนที่จะย้ายออกไปเป็น `apply/` แยกต่างหากในภายหลัง — ดูหัวข้อ "พอร์ทัลสมัครเรียน (apply/)" ด้านบน)
  เปลี่ยนจากแถบแท็บบน header มาใช้ sidebar ซ้ายแบบเดียวกับ `schooldark/*` — `shared/cross-nav.js`
  เขียนใหม่ให้เป็นคนสร้าง `<aside class="sidebar">` ทั้งก้อน (ไม่ใช่แค่เติมท้ายเมนูเดิม) และย้าย
  สไตล์ sidebar section 4 เดิมของ `schooldark/app.css` ไปเป็น `shared/cross-nav.css` พร้อมแก้จุดที่
  ทำให้ย่อ/ขยายเมนูรู้สึกหน่วง (ตัด `transition: all`/animate width-padding/glow ที่ไม่จำเป็นออก)
  — ดูรายละเอียดเหตุผลแก้แลคในคอมเมนต์ของ `cross-nav.css` เอง JS ของ `schooldark/*`
  (`app.js`, `index.js`, `personnel.js`, `settings.js`, `leave-features.js`)
  **ไม่ได้ถูกแก้เลย** — sidebar ใหม่จงใจคง id/class/data-attribute เดิมทุกตัวไว้ให้ตรงกัน
- **ศูนย์รวมการตั้งค่า**: ย้ายเมนูตั้งค่าทั้งหมดของทั้ง 2 ระบบไปรวมที่กลุ่ม `settings` เดียวใน
  `NAV_GROUPS` (เหลือ item ทางลัดในหมวดเดิม) และเพิ่มโฟลเดอร์ `settings/` ใหม่ (`index.html` การ์ด
  รวม, `school.html` หน้าตั้งค่าโรงเรียน/master data 5 แท็บที่ไม่เคยมีมาก่อน, `js/school-store.js`)
  — ดูหัวข้อ "ศูนย์รวมการตั้งค่า" ด้านบน
- **เพิ่มพอร์ทัลผู้ปกครอง** (`parent/`) เป็นระบบที่ 3 ของโปรเจกต์ ใช้ navbar บนสุดของตัวเอง
  (`js/parent-nav.js`) ไม่ใช้ sidebar แอดมิน (ข้อยกเว้นของกฎ sidebar รวม) ข้อมูลทั้งหมดเป็น
  mock ใหม่ (`parent_*` ใน localStorage) ยังไม่เชื่อมกับข้อมูลจริงของ admission/schooldark
- เข้าถึงพอร์ทัลผู้ปกครองได้จากหน้า hub ผ่านการ์ดใหม่ (กลุ่ม `id: 'parent'` ใน `NAV_GROUPS`,
  item เดียวเป็น `hubOnly: true` จึงไม่โผล่ใน sidebar ของระบบอื่น)
