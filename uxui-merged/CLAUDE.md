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
├── index.html         # หน้า hub รวมลิงก์ทุกระบบ (การ์ดกลางหน้า ไม่มี sidebar ของตัวเอง)
├── shared/
│   ├── cross-nav.js   # แหล่งข้อมูลเมนูรวมจุดเดียว — สร้าง sidebar ทั้งอันของทุกหน้า
│   └── cross-nav.css  # สไตล์ของ sidebar ทั้งอัน (ย้ายมาจาก schooldark/app.css เดิม)
├── schooldark/       # ระบบบุคลากร, การลา, บัตรขออนุญาต, การลาเรียนนักเรียน
│   └── CLAUDE.md     # ← รายละเอียดของระบบนี้อยู่ในไฟล์นี้
├── admission/        # ระบบรับสมัครนักเรียน + ทะเบียน/ข้อมูลนักเรียน (Admitify Spark)
│   └── AGENTS.md     # ← รายละเอียดของระบบนี้อยู่ในไฟล์นี้ (source of truth ของฝั่งนั้น)
└── settings/         # ศูนย์รวมการตั้งค่าของทั้ง 2 ระบบ (โฟลเดอร์กลาง ไม่ใช่ของฝั่งใด)
    ├── index.html    # การ์ดรวมทุกหมวดตั้งค่า (อ่านจาก NAV_GROUPS กลุ่ม id "settings")
    ├── school.html   # ตั้งค่าโรงเรียน (master data) 5 แท็บ — ดูหัวข้อถัดไป
    └── js/school-store.js  # เก็บข้อมูลของ school.html คีย์ localStorage `school_*`
```

> [!NOTE]
> ตั้งแต่รอบรวม sidebar (ดู "ประวัติการรวม" ท้ายไฟล์) ทั้ง 2 ระบบมี **sidebar ซ้ายเดียวกัน
> ทุกหน้า** แล้ว (ก่อนหน้านี้ admission ใช้แถบแท็บบน header แทน) `shared/cross-nav.js`
> เป็นคนสร้าง `<aside class="sidebar">` ทั้งก้อนให้ทุกหน้า ไม่ใช่แค่เติมเมนูข้ามระบบต่อท้าย
> เมนูเดิมอีกต่อไป — ดูรายละเอียดในหัวข้อ "จุดเชื่อมของเมนูรวมในแต่ละหน้า" ด้านล่าง

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
   (`bindSubmenus`) และสคริปต์ท้าย `leave-features.html` ดัก `.submenu-item` ทุกตัวด้วย
   `preventDefault()` เสมอ ถ้าใช้ class เดิมลิงก์ข้ามหน้าจะกดไม่ไปไหนเลย — cross-nav.js ใช้
   class `submenu-link` แยกไว้แล้วสำหรับกรณีนี้ (ดูฟังก์ชัน `renderItem` ในไฟล์นั้น)
6. ห้ามแก้สไตล์ sidebar ที่ `schooldark/app.css` อีกต่อไป (ย้ายไป `shared/cross-nav.css`
   ทั้งหมดแล้ว) และห้ามแก้ markup ของ sidebar ตรง ๆ ในแต่ละหน้า — ทุกหน้าได้ sidebar มาจาก
   `shared/cross-nav.js` เท่านั้น (ดูหัวข้อถัดไป)

## จุดเชื่อมของเมนูรวมในแต่ละหน้า

ตั้งแต่รอบรวม sidebar, `shared/cross-nav.js` **สร้าง `<aside class="sidebar">` ทั้งก้อน**
(โลโก้ + กลุ่มเมนู + เมนูย่อย + badge + user footer) ให้ทุกหน้า ไม่ใช่แค่เติมท้ายเมนูเดิมอีกต่อไป:

| ระบบ | วิธีฝังสคริปต์ | ผลลัพธ์ |
|---|---|---|
| `schooldark/*.html` | วาง `<script src="../shared/cross-nav.js">` **แทนที่เนื้อหาเดิมข้างใน** `<aside class="sidebar" id="sidebar">...</aside>` ที่มีอยู่แล้ว | คุม sidebar SPA เดิม (data-module/data-view/data-step/data-tab/data-subtab) — `app.js` / อินไลน์สคริปต์ของ `leave-features.html` ยัง bind การคลิกเมนูในหน้าเดียวกันเหมือนเดิมทุกอย่าง |
| `admission/*.html` | วาง `<script src="../shared/cross-nav.js">` เป็น**สิ่งแรกหลัง `<body>`** (ไม่มี `<aside>` อยู่ก่อน) | สคริปต์สร้าง `<aside id="sidebar">` แบบ `position:fixed` ทางซ้ายให้เอง + ใส่ class `xnav-fixed-layout` บน `<html>` (ดัน body ด้วย padding-left ใน `cross-nav.css`) |
| `index.html` (hub) | `<div id="cross-nav-hub">` (เหมือนเดิม) | การ์ดของแต่ละระบบพร้อมลิสต์ลิงก์ — หน้านี้**ไม่มี sidebar ซ้าย** ตั้งใจเก็บดีไซน์การ์ดกลางหน้าแบบเดิมไว้ |
| `settings/*.html` | เหมือน `admission/*.html` (script เป็นสิ่งแรกหลัง `<body>`, ไม่มี `<aside>` มาก่อน) | ได้ sidebar fixed แบบเดียวกับ admission; `settings/index.html` มี `<div id="settings-hub">` เพิ่มเติมที่อ่าน `window.CrossNav.NAV_GROUPS` เอง (ดูย่อหน้าถัดไป) |

ทุกหน้าต้องโหลด `shared/cross-nav.css` คู่กับ `cross-nav.js` เสมอ (ยกเว้น hub ที่ไม่จำเป็น)
เมนูที่แสดงจะเป็น**ชุดเดียวกันทุกหน้า** (ไม่ตัดกลุ่มของระบบตัวเองออกอีกต่อไป) — ต่างกันแค่ไฮไลต์
รายการที่ active และ item ที่อยู่หน้าเดียวกันจะกลายเป็นปุ่มสลับ view แบบไม่โหลดหน้าใหม่
(ส่วนที่ไม่ใช่หน้าปัจจุบันจะเป็นลิงก์ข้ามหน้าจริง พร้อม deep-link ผ่าน hash ไปหน้า/ขั้นตอนที่ถูกต้อง)

ใน `NAV_GROUPS` เมนูย่อย (`children`) มีได้ 2 แบบ: `{ label, step|tab|subtab }` = สลับ view ในหน้า
เดียวกัน (schooldark) หรือ `{ label, page }` = ลิงก์ไปคนละไฟล์ (เช่น "ตั้งค่ารับสมัคร" ของ admission
ที่รวม 4 หน้าตั้งค่าไว้ใต้เมนูเดียว) ส่วน item ที่ใส่ `hubOnly: true` จะแสดงแค่ในการ์ดหน้า hub
ไม่แสดงใน sidebar (ตอนนี้มี "พอร์ทัลสมัครเรียน" / `apply.html` ที่เข้าได้จากปุ่มบนบอร์ดรับสมัครอยู่แล้ว)

หมวดใน sidebar **จัดตามงานที่ผู้ใช้ทำ ไม่ได้จัดตามไฟล์**: ภาพรวม → บุคลากร → การลาของบุคลากร →
การมาเรียนของนักเรียน (เช็คชื่อ + รายงานการมาเรียน) → การลาเรียนของนักเรียน (ยื่นขอลา + อนุมัติการลานักเรียน) → บัตรขออนุญาตนักเรียน → รับสมัคร & ทะเบียน
นักเรียน → การตั้งค่า (ล่างสุด) รายชื่อบุคลากรมีเมนูเดียวคือของ `app.html` (view `directory`) —
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

item ที่ชี้มาหน้าปัจจุบันแบบไม่ใช่ SPA view (ไม่มี `module`/`view` — เช่นหมวด "ตั้งค่าโรงเรียน /
บุคลากร / การลา / รับสมัคร" ใน `settings/index.html` ที่เป็นลิงก์ `#anchor` ในหน้าเดียวกัน) จะถูก
ไฮไลต์ตาม `location.hash` โดย `syncAnchorActive()` ใน `cross-nav.js` (รันตอนโหลด + ทุก `hashchange`)
— hash ตรง `anchor` ตัวไหนตัวนั้น active และกางเมนูย่อย, ไม่ตรงเลย → item ของหน้านั้นที่ไม่มี
`anchor` (เช่น "ศูนย์รวมการตั้งค่า") active แทน

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

`settings/school.html` เป็นหน้าตั้งค่า "โรงเรียน" (master data) ใหม่ที่ยังไม่มีมาก่อนในทั้ง 2
ระบบ: ข้อมูลห้องเรียน, ปฏิทินโรงเรียน, ข้อมูลปีการศึกษา, ข้อมูลระดับการศึกษา, ข้อมูลสาขางาน-สาขาวิชา
(5 แท็บ สลับด้วย hash `#tab=<id>`) เก็บข้อมูลผ่าน `SchoolStore` (`settings/js/school-store.js`,
คีย์ localStorage ขึ้นต้นด้วย `school_*`) ส่วน "ข้อมูลโรงเรียน/ตั้งค่าระบบ" ตัวจริง (ชื่อ/รหัส/
ที่อยู่/ปีการศึกษาปัจจุบัน) และ "ข้อมูลครูประจำชั้น" ยังคงอยู่ที่เดิมคือ `schooldark/app.html`
(view `general`/`homeroom`) — การ์ดในศูนย์ตั้งค่าแค่ลิงก์ไปหาที่นั่น ไม่ได้ก็อปข้อมูลมาซ้ำ

> [!NOTE]
> ข้อมูลใน `school_*` (ห้องเรียน/ปฏิทิน/ปีการศึกษา/ระดับชั้น/สาขา) เป็น mockup ที่สร้างขึ้นใหม่
> **ยังไม่เชื่อมกับข้อมูลเดิมของ 2 ระบบ** เช่น ห้องเรียนที่นี่ไม่ถูกใช้ใน `schooldark/app.html`
> view "homeroom" หรือแผนการเรียนของ `admission/course_settings.html` — ตั้งใจทำเป็น mockup
> ใช้งาน/ดูตัวอย่างได้ก่อน ยังไม่ได้เชื่อมข้อมูลจริงข้ามหน้า

## ประวัติการรวม

- โฟลเดอร์เดิม `uxui/` → `schooldark/`, `uxui-noeysod/` → `admission/` (ย้ายด้วย `git mv` ประวัติไม่ขาด)
- ลบไฟล์เก่าของ `uxui/` ที่ `app.html` แทนที่ไปแล้ว: `index.html`, `personnel.html`, `settings.html`
  และ CSS ของมัน (`index.css`, `personnel.css`, `settings.css`) — แต่ **`index.js` / `personnel.js` /
  `settings.js` ยังอยู่** เพราะ `app.html` ยังโหลดใช้เป็นสมองของแต่ละโมดูล
- `admission/` เป็นโปรเจกต์ที่เคยเชื่อมกับ Lovable (`.lovable/project.json` ถูกย้ายมาด้วย) —
  ถ้า Lovable sync ไม่เจอหลังย้าย ให้ย้อน commit ที่ย้ายโฟลเดอร์ (ห้าม force push / rewrite history)
- **รวม sidebar ซ้าย** (หลังรวมเมนูครั้งแรก): `admission/*` ทุกหน้า (รวม `apply.html`/`status.html`)
  เปลี่ยนจากแถบแท็บบน header มาใช้ sidebar ซ้ายแบบเดียวกับ `schooldark/*` — `shared/cross-nav.js`
  เขียนใหม่ให้เป็นคนสร้าง `<aside class="sidebar">` ทั้งก้อน (ไม่ใช่แค่เติมท้ายเมนูเดิม) และย้าย
  สไตล์ sidebar section 4 เดิมของ `schooldark/app.css` ไปเป็น `shared/cross-nav.css` พร้อมแก้จุดที่
  ทำให้ย่อ/ขยายเมนูรู้สึกหน่วง (ตัด `transition: all`/animate width-padding/glow ที่ไม่จำเป็นออก)
  — ดูรายละเอียดเหตุผลแก้แลคในคอมเมนต์ของ `cross-nav.css` เอง JS ของ `schooldark/*`
  (`app.js`, `index.js`, `personnel.js`, `settings.js`, อินไลน์สคริปต์ท้าย `leave-features.html`)
  **ไม่ได้ถูกแก้เลย** — sidebar ใหม่จงใจคง id/class/data-attribute เดิมทุกตัวไว้ให้ตรงกัน
- **ศูนย์รวมการตั้งค่า**: ย้ายเมนูตั้งค่าทั้งหมดของทั้ง 2 ระบบไปรวมที่กลุ่ม `settings` เดียวใน
  `NAV_GROUPS` (เหลือ item ทางลัดในหมวดเดิม) และเพิ่มโฟลเดอร์ `settings/` ใหม่ (`index.html` การ์ด
  รวม, `school.html` หน้าตั้งค่าโรงเรียน/master data 5 แท็บที่ไม่เคยมีมาก่อน, `js/school-store.js`)
  — ดูหัวข้อ "ศูนย์รวมการตั้งค่า" ด้านบน
