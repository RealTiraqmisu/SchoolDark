# CHANGES-FOR-CARE.md — สิ่งที่ noeysod แก้ในโฟลเดอร์ `schooldark/` (ของแคร์)

> ไฟล์นี้เป็น "คู่มือนำทาง" สำหรับแคร์ (และ Claude ของแคร์): ทุกครั้งที่ noeysod แก้ไฟล์ในโฟลเดอร์นี้
> จะบันทึกไว้ที่นี่ ตามหลักว่า **แก้เฉพาะสิ่งที่ผู้ใช้ไม่เห็นหน้าตาเปลี่ยน** (ถ้าหน้าตาเปลี่ยน ต้องคุยกับแคร์ก่อน)
> รูปแบบต่อรายการ: วันที่ · ไฟล์/ฟังก์ชัน · แก้อะไร · ทำไม · หน้าตาเปลี่ยนไหม · ถ้าอยากย้อน
> รายการใหม่ให้เพิ่มไว้ **บนสุด**

## 2026-09-29 — รอบแก้หน้าค้าง + เมนูซ้ายกางหุบวุ่น (ทุกข้อ: หน้าตาไม่เปลี่ยน)

> ⚠️ **แคร์ต้อง `git pull` ก่อนแก้ `leave-features.html`** — ไฟล์นั้นถูกแยก CSS/JS ออกเป็นไฟล์ใหม่แล้ว (ข้อ 1)
> ถ้าแก้ของเดิมค้างอยู่ให้ย้ายส่วนที่แก้ไปไฟล์ใหม่ (`leave-features.js` / `leave-features.css`) ก่อน merge

### 1. แยก `leave-features.html` เป็น 3 ไฟล์ (ย้ายแบบ 1:1 ไม่แก้ logic)
- **ไฟล์**: `leave-features.html` → `leave-features.css` (เดิมคือ `<style>` ใน `<head>`), `leave-features.js` (เดิมคือ `<script>` inline ท้าย `<body>`)
- **ทำไม**: ไฟล์เดียว 474KB parse ช้า + แก้/รีวิว/ค้นหายาก + เบราว์เซอร์ cache แยกไฟล์ได้
- **หน้าตาเปลี่ยน**: ไม่ (ตรวจแล้วว่า DOM ที่เรนเดอร์และตัวเลขแดชบอร์ดเหมือนเดิมทุกค่า)
- **หมายเหตุ**: ยังเป็น classic script (ไม่ใช่ module) ดังนั้น `onclick="fn()"` ใน HTML ใช้ได้เหมือนเดิม
- **ย้อน**: วาง CSS/JS กลับเข้า `<style>`/`<script>` ตำแหน่งเดิม แล้วลบ `<link>`/`<script src>` ที่เพิ่ม

### 2. บั๊ก: `navigateToView` ชื่อซ้ำ 2 ไฟล์ (`index.js` กับ `settings.js`)
- **ไฟล์/ฟังก์ชัน**: `settings.js` → เปลี่ยนชื่อเป็น **`navigateToSettingsView`** (ทุกจุดในไฟล์); `index.js` ยังใช้ `navigateToView` (ของหน้าลา) เหมือนเดิม
- **อาการเดิม**: `settings.js` โหลดทีหลังจึงทับของ `index.js` → สลับ role / บันทึกใบลาแล้ว `navigateToView("form")` ไปเรียก `App.navigate('settings','form')` ผิดหน้า
- **หลังแก้**: สลับ role แล้วอยู่หน้ายื่นใบลาถูกต้อง (ตรวจด้วย headless Chrome แล้ว)
- **โค้ดใหม่ของแคร์**: ถ้าจะเรียกเปลี่ยนหน้าตั้งค่า ใช้ `navigateToSettingsView(id)`
- **หน้าตาเปลี่ยน**: ไม่ (แก้บั๊กให้ทำงานตามที่ตั้งใจ)
- **ย้อน**: เปลี่ยนชื่อกลับ — แต่จะได้บั๊กเดิมกลับมาด้วย

### 3. เลิกสั่งเปิดหน้า "ตั้งค่าทั่วไป" ตอนโหลด (`settings.js`, DOMContentLoaded)
- **แก้อะไร**: ลบ `navigateToView("general")` ท้ายไฟล์ (ต้นเหตุที่เปิด `app.html` แล้วไปโผล่หน้าตั้งค่า + เมนูกาง/หุบซ้ำหลายรอบ)
- **ทำไม**: `app.js` (`App.init`) เปิดแดชบอร์ดอยู่แล้ว การสั่งซ้ำทับกันทำให้ sidebar กางแล้วหุบแล้วกาง
- **ยังทำงานเหมือนเดิม**: หน้าตั้งค่าแต่ละ view ถูก render ตอนกดเมนู (`app.js` เรียก `renderViewData` ในโมดูล settings) และ deep-link `#m=settings&v=general` (ตรวจแล้ว)
- **หน้าตาเปลี่ยน**: ไม่ (เปิดมาที่แดชบอร์ดตามที่ตั้งใจ)
- **ย้อน**: ใส่ `navigateToSettingsView("general");` ใน DOMContentLoaded ของ `settings.js`

### 4. โหลด xlsx และ Chart.js แบบ lazy (ไม่บล็อกหน้าตอนเปิด)
- **ไฟล์**: ใหม่ `lazy-libs.js` (`loadScriptOnce`, `LAZY_LIBS`, `debounce`) โหลดใน `app.html` และ `leave-features.html`; ลบ `<script src=...xlsx>` ออกจาก `<head>` ทั้ง 2 หน้า และ `chart.umd` ออกจาก `leave-features.html`
- **จุดที่โหลดตอนใช้**: `personnel.js` (ปุ่มโหลดเทมเพลต + อ่านไฟล์ import); `leave-features.js` → `exportExcel`, `exportTrainingReport`, `sdExportExcel` (ห่อด้วย `withXlsx`, ฟังก์ชันเดิมเปลี่ยนชื่อเป็น `_exportExcel` ฯลฯ) และ `sdChart()` (โหลด Chart.js ตอนวาดกราฟครั้งแรก)
- **ทำไม**: xlsx ~900KB + Chart.js โหลดแบบ sync ใน `<head>` ทำให้จอขาวจนโหลดเสร็จ
- **หน้าตาเปลี่ยน**: ไม่ (กราฟครั้งแรกปรากฏช้ากว่าเดิมเสี้ยววินาทีระหว่างโหลดไลบรารี)
- **กฎใหม่**: ถ้าเขียนโค้ดใหม่ที่ใช้ `XLSX.` ให้ครอบด้วย `loadScriptOnce(LAZY_LIBS.xlsx).then(...)` (หรือ `withXlsx` ใน leave-features.js); ถ้าใช้ `new Chart` ให้ผ่าน `sdChart()`
- **ย้อน**: ใส่ `<script src>` กลับใน `<head>` (ครอบ lazy ทิ้งไว้ก็ไม่พัง)

### 5. ฟอนต์: `@import` → `<link>`
- **ไฟล์**: `app.css` (ลบ `@import url(fonts.googleapis...)`), `app.html` + `leave-features.html` (เพิ่ม `<link rel="preconnect">` x2 + `<link rel="stylesheet">` ฟอนต์เดิม Outfit + Sarabun)
- **ทำไม**: `@import` ใน CSS บล็อกการเรนเดอร์แบบต่อคิว (ต้องโหลด app.css ก่อนถึงจะรู้ว่าต้องโหลดฟอนต์)
- **หน้าตาเปลี่ยน**: ไม่ (ฟอนต์ชุดเดิม)
- **ย้อน**: ใส่ `@import` กลับบนสุดของ `app.css` แล้วลบ `<link>` ฟอนต์

### 6. กราฟไม่ animate (`leave-features.js` → `sdChart`)
- **แก้อะไร**: บังคับ `options.animation = false` ให้ทุกกราฟของแดชบอร์ดการมาเรียน
- **ทำไม**: ลดงานตอนวาด/สลับโหมดกราฟ (สลับโหมดแล้วไม่ต้องรอเส้นวิ่ง)
- **หน้าตาเปลี่ยน**: เล็กน้อย — กราฟขึ้นทันทีแทนที่จะค่อย ๆ วาด (ถ้าอยากได้ animation กลับ ลบบรรทัด `config.options = Object.assign(...)` ใน `sdChart`)

### 7. Debounce ช่องค้นหา (พิมพ์แล้วรอ 200ms ค่อย render)
- **ไฟล์**: `leave-features.js` (ท้ายไฟล์: `sl-req-search`, `sl-profile-search`, `tk-req-search`, `student-list-search`, `emp-search`, `sd-search`, `att-rep-search` — **เอา `oninput="..."` ออกจาก HTML** ของ 7 ช่องนี้แล้วผูกใน JS แทน), `personnel.js` (`directory-search`), `settings.js` (`staff-type-search`, `position-search`, `department-search`)
- **ทำไม**: เดิมพิมพ์ทุกตัวอักษร render ตารางใหญ่ใหม่ทั้งตาราง
- **หน้าตาเปลี่ยน**: ไม่ (ผลค้นหาขึ้นช้าลง 0.2 วินาทีหลังหยุดพิมพ์)
- **ย้อน**: ใส่ `oninput` กลับใน HTML และเอาบล็อกท้าย `leave-features.js` ออก

### 8. ดัชนีชั่วคราวเวลาคำนวณการมาเรียน (`leave-features.js`)
- **ฟังก์ชัน**: `attWithIndex(fn)` (ใหม่), `attApprovedLeave` / `attExitTicket` / `homeroomTeacherName` (ใช้ Map ถ้ากำลังอยู่ในรอบ `attWithIndex`, ไม่งั้นใช้ `.find` เดิม), `sdCompute` (เป็น wrapper เรียก `_sdCompute` ภายใน `attWithIndex`), `renderAttendanceReport` (ห่อลูปสร้างแถว)
- **ทำไม**: `getAttendance()` ถูกเรียกเป็นพันครั้งต่อรอบ และแต่ละครั้ง `.find` ไล่ใบลา/ประวัติบัตรทั้งหมด → สร้าง Map ครั้งเดียวต่อรอบแล้วทิ้ง **ไม่ cache ข้ามรอบ** จึงไม่มีข้อมูลค้างเก่า
- **หน้าตาเปลี่ยน**: ไม่ (เทียบ `sdData.total/rooms/daily` และแถวรายงานกับของเดิมแล้ว ตรงกันทุกค่า)
- **ย้อน**: เรียก `_sdCompute` แทน wrapper และใช้ `.find` เดิม (โค้ดเดิมยังอยู่เป็น fallback)

### 9. `shared/cross-nav.js` + `cross-nav.css` — ปิด animation ของเมนูซ้ายระหว่างโหลดหน้า (ไฟล์ส่วนกลาง)
- **แก้อะไร**: ใส่ class `xnav-preload` บน `<html>` ตอนสร้างเมนู (ยกเว้นหน้า hub) → CSS ปิด `transition` ทั้งเมนู → ปลดหลังทุก handler โหลดหน้า + deep-link ทำงานเสร็จ (2 เฟรม + สำรอง 400ms)
- **ทำไม**: ตอนโหลดมีการกาง/หุบกลุ่มเมนู 3–4 รอบติดกัน แต่ละรอบมี animation 180ms ข้อนี้ช่วยเฉพาะส่วน animation — ต้นเหตุหลักที่ยังเหลือคือข้อ 10 ผู้ใช้กดเองยังมี animation ปกติ
- **หน้าตาเปลี่ยน**: ไม่ (แค่ไม่เห็นเมนูวิ่งตอนโหลด)
- **ย้อน**: ลบ 2 จุดใน `cross-nav.js` (บรรทัด `classList.add('xnav-preload')` และบล็อกปลดที่ท้าย deep-link) + กฎ `html.xnav-preload` ท้าย `cross-nav.css`

### 10. ต้นเหตุหลักของเมนู "เด้ง": sidebar ถูกสร้างเป็น active ทุกเมนูของหน้าแล้วค่อยหุบ (`shared/cross-nav.js`)
- **อาการ (วัดด้วย headless Chrome ทุก mutation ตอนโหลด)**: `app.html` ตอน cross-nav สร้างเมนูมี `.menu-item.active` **9 ตัว** กางหลายกลุ่ม สูง 1971px ค้างราว 0.4 วินาที แล้ว `App.init()` (`app.js`) หุบเหลือ 1; `leave-features.html` active 7 ตัว แล้ว `showModuleView()` หุบ → เมนูหดทันที + ตำแหน่ง scroll ที่คืนไว้ไม่ตรง = "เด้ง"
- **สาเหตุ**: `renderItem()` ตั้ง `isActive = หน้าตรงกับ item.page` — บนหน้า SPA ทุก item ที่ชี้หน้าเดียวกันเลยเป็น active พร้อมกัน
- **แก้อะไร**: `SPA_DEFAULT_VIEW` (view ที่แต่ละหน้าเปิดเองตอนโหลด) + `INITIAL_SPA` (อ่าน `#v=..` ถ้ามี) + `isInitialSpaItem()`; ใน `renderItem` item ของหน้า SPA จะ active เฉพาะ view เริ่มต้นตั้งแต่เฟรมแรก — ตอนนี้ trace ได้ active = 1 ตลอด
- **ที่ต้องรู้**: **ถ้าแคร์เปลี่ยน view เริ่มต้นของหน้า (`app.html` → `dashboard-main`, `leave-features.html` → `leave-card`) ต้องแก้ `SPA_DEFAULT_VIEW` ใน `shared/cross-nav.js` ด้วย**
- **แก้เพิ่มในไฟล์ของแคร์ 1 จุด**: `leave-features.js` ตรง `showModuleView(initialViewEl ...)` ตอนโหลด — ข้ามเมื่อ URL มี deep-link (`#v=..`) เพราะไม่งั้นเมนูสลับไป leave-card ก่อนแล้วค่อยเด้งไป view ปลายทาง (ไม่มี hash ยังรันเหมือนเดิม)
- **หน้าตาเปลี่ยน**: ไม่ · **ย้อน**: ลบบรรทัด `if (samePage && item.view) isActive = ...` ใน `renderItem` และเอา `if (!/[#&]v=/...)` ออกจาก `leave-features.js`

### 11. เมนู "อนุมัติการลา" ใน `app.html` โผล่แล้วหายตอนโหลด (`shared/cross-nav.js`)
- **สาเหตุ**: role เริ่มต้นคือ "ครู" (`index.js` `systemState.currentRole`) และ `updateSidebarVisibility()` ซ่อนกลุ่มนี้ตอน DOMContentLoaded — เมนูที่เห็นอยู่ 0.3 วินาทีเลยหายไปทำให้ทุกอย่างข้างล่างเลื่อนขึ้น ~45px
- **แก้อะไร**: `renderItem` ใส่ `style="display:none"` ให้กลุ่ม `menu-leave-approve` ตั้งแต่สร้างเมนู เฉพาะบน `app.html` (สลับเป็น ผอ. แล้ว `index.js` ตั้ง display กลับเองเหมือนเดิม — ตรวจแล้ว) · หน้าตาสุดท้ายเหมือนเดิม · ย้อน: ลบตัวแปร `hiddenForDefaultRole`
- **⚠️ ยกเลิกแล้ว (2026-09-29 รอบหลัง)**: เนยสดเลือกให้เมนูนี้ **แสดงเสมอทุกหน้า/ทุก role** — ลบ pre-hide ออกจาก `cross-nav.js` และลบการซ่อน/แสดงกลุ่มนี้ใน `updateSidebarVisibility()` ของ `index.js` (ดูรายการ 16)

### 12. ขนาด sidebar ไม่เท่ากันระหว่าง 2 ระบบ (`shared/cross-nav.css`) — ทำให้กดข้ามระบบแล้ว hover วิ่งไปทั่ว
- **สาเหตุ**: `admission/*` ได้ Tailwind preflight (`line-height: 1.5`, ปุ่ม/ช่องกรอกสืบทอดฟอนต์) แต่ `schooldark/*` ไม่มี (line-height `normal`, ปุ่มใช้ 13.33px ของเบราว์เซอร์, โลโก้/avatar ใช้ Outfit) → เมนูสูง 42 vs 40px, หัวโลโก้ 42 vs 36, เมนูเริ่ม y=133 vs 125 → กดข้ามระบบแล้วของใต้เมาส์เลื่อนหมด
- **แก้อะไร**: ท้าย `cross-nav.css` เพิ่มบล็อกบังคับขนาด sidebar ตามฝั่ง admission (เนยสดเลือกยึดฝั่งเนยสด) — วัดแล้วทุกแถวของ sidebar (โลโก้/ค้นหา/เมนู/footer) ขนาดเท่ากันทั้ง 3 หน้า
- **หน้าตาเปลี่ยน**: **เล็กน้อยในฝั่งแคร์** — เมนูสูงขึ้น ~2px/อัน, ชื่อโลโก้/avatar เป็น Sarabun แทน Outfit · **ย้อน**: ลบบล็อกท้าย `cross-nav.css` (แต่จะกลับไปเลื่อนตอนข้ามระบบ)

### 13. สี sidebar รวมศูนย์ที่ `shared/cross-nav.css` (ลบตัวที่ประกาศทับกัน)
- **สาเหตุ**: `cross-nav.css` อ่านตัวแปรสีของแต่ละหน้า (`--primary`, `--bg-sidebar`, …) หน้าแคร์ได้ค่าจาก `app.css` (พื้นเทาอมฟ้า, active ม่วง) ส่วนหน้าอื่นได้ค่า fallback ในบล็อก `html:not([data-app="schooldark"])` (พื้นขาว, active น้ำเงิน) → sidebar คนละสีกัน
- **แก้อะไร**: `cross-nav.css` ใช้ token ของตัวเอง `--xnav-*` (ประกาศบน `:root` ที่เดียว) ทั้งไฟล์ และไม่อ่านตัวแปรของหน้าอีก · **ลบ** `--bg-sidebar` ออกจาก `schooldark/app.css` (ใช้แค่ sidebar) · **ลบ** `.sidebar { display: none; }` ใน `@media (max-width: 960px)` ของ `schooldark/leave-features.css` (พฤติกรรมจอแคบให้ cross-nav.css คุมที่เดียว)
- **หน้าตาเปลี่ยน**: **ใช่** — sidebar ฝั่งแคร์เป็นพื้นขาว/active น้ำเงินเหมือนฝั่งเนยสด (ตามที่เนยสดสั่ง; เนื้อหาหน้ายังสีเดิม รอแผนธีมทีละหน้า)
- **กฎ**: อยากเปลี่ยนสี/ฟอนต์ sidebar ให้แก้ `--xnav-*` ใน `shared/cross-nav.css` เท่านั้น ห้ามประกาศทับในไฟล์ของหน้า · **ย้อน**: คืน `--bg-sidebar` ใน `app.css` และ `display:none` ใน media query (แต่ต้องทำให้ cross-nav.css อ่านตัวแปรหน้ากลับด้วย)

### 14. จัดหมวดเมนูใหม่ + breadcrumb (`shared/cross-nav.js`, `app.js`, `leave-features.js`)
- **หมวดใหม่**: (แดชบอร์ดภาพรวม ไม่มีหัวหมวด) · งานทะเบียนนักเรียน · งานรับสมัครออนไลน์ · **งานกิจการนักเรียน** (แดชบอร์ดการมาเรียน/เช็คชื่อ/รายงานการมาเรียน/บัตรขออนุญาต 2 เมนู) · **งานบุคลากร** (เมนูเดิมของบุคลากร) · **งานบริหารการลา** (ยื่น/อนุมัติ บุคลากร + ยื่น/อนุมัติ นักเรียน 4 เมนูแบน) · การตั้งค่า
- **เมนูเปลี่ยนชื่อ 4 อัน** (id/view/badge เหมือนเดิม): `ยื่นคำขอลา (บุคลากร)`, `อนุมัติการลา (บุคลากร)`, `ยื่นขอลา (นักเรียน)`, `อนุมัติการลา (นักเรียน)` — ทุก item เดิมยังอยู่ครบ (นับแล้ว 27 = 27)
- **breadcrumb**: `app.js` `VIEW_TITLES[*].crumb` ('ระบบการลา /' → 'งานบริหารการลา / … (บุคลากร)', 'บุคลากร /' → 'งานบุคลากร /', ตั้งค่าการลา → 'การตั้งค่า / ตั้งค่าการลา') และ `leave-features.js` `BREADCRUMB_GROUP` (การลา → 'งานบริหารการลา', การมาเรียน/บัตร → 'งานกิจการนักเรียน')
- **หน้าตาเปลี่ยน**: ชื่อหมวด/ชื่อเมนูใน sidebar และข้อความ breadcrumb เท่านั้น · **ย้อน**: คืนลำดับ `NAV_GROUPS` และข้อความ breadcrumb (git diff ดูของเดิมได้)

### 15. ปุ่มย่อ/ขยาย sidebar ใช้ได้บ้างไม่ได้บ้าง → คุมที่ `shared/cross-nav.js` ที่เดียว
- **อาการ (วัดด้วยการคลิกจริง)**: `leave-features.html` กดปุ่มไม่มีผลเลย (ไม่มี handler), หน้า admission/settings จอ 769–1024px กดแล้วขนาดไม่เปลี่ยน (`@media (max-width:1024px)` บังคับ rail 72px ทับ)
- **แก้อะไร**: (1) `cross-nav.js` ผูก handler ปุ่มครั้งเดียวสำหรับทุกหน้า (toggle `.collapsed` + `xnav-collapsed` + จำใน localStorage `xnav-collapsed`) (2) `schooldark/app.js` `bindSidebarToggle()` ไม่ toggle แล้ว (เหลือคอมเมนต์ — ห้าม toggle ซ้ำ ไม่งั้นกดแล้วไม่เปลี่ยน) (3) ลบกฎ auto-rail ใน `@media (max-width:1024px)` ของ `cross-nav.css`
- **ผล**: ทั้ง 4 หน้า (app, leave-features, admission, settings) กด 280↔72 ได้ที่จอ 1366 และ 900 และเปิดหน้าใหม่แล้วจำสถานะหุบไว้ · จอ ≤768px ยังเป็น off-canvas เหมือนเดิม
- **หน้าตาเปลี่ยน**: จอ 769–1024px หน้า admission/settings ไม่ถูกบีบเป็น rail อัตโนมัติอีก (ตามปุ่มเท่านั้น) · **ย้อน**: คืน handler ใน `app.js` และกฎ media 1024px จาก git diff

### 16. เมนู "อนุมัติการลา (บุคลากร)" แสดงเสมอ (`schooldark/index.js` + `shared/cross-nav.js`)
- **สาเหตุที่ "บางทีขึ้นบางทีไม่ขึ้น"**: role จำลองเริ่มต้นเป็น "ครู" และ `updateSidebarVisibility()` ซ่อนกลุ่มนี้ เฉพาะบน `app.html` — หน้าอื่นไม่มีโค้ดนี้ (เห็นเสมอ) และ role ไม่ถูกจำข้ามหน้า
- **แก้อะไร**: ลบการซ่อน/แสดงกลุ่มนี้ใน `updateSidebarVisibility()` (เมนู "ตั้งค่าการลา" `menu-leave-settings` ไม่มีใน sidebar แล้ว จึงไม่มีผล) และลบ pre-hide ใน `cross-nav.js` · **คง** redirect และ `updateApprovalBadge()` เดิมไว้
- **ข้อควรรู้**: ตอนนี้ role ครูกดเมนูนี้แล้วเข้าหน้าอนุมัติได้ (redirect เดิมทำงานเฉพาะตอนโหลดหน้า/สลับ role ขณะอยู่หน้านั้น) — เป็น prototype ไม่มี login จริง ถ้าต้องการกันสิทธิ์ให้แคร์ทำที่ `navigate()` · หน้าตาเปลี่ยน: เมนูโผล่ตลอด · **ย้อน**: ใส่บรรทัด `approveMenu.style.display` กลับใน `index.js`

### 17. ธีมสีเนยสด เฉพาะแดชบอร์ดหลัก (`schooldark/app.css`, `schooldark/app.html`)
- **แก้อะไร**: (1) `app.css` ต่อจากบล็อก `:root {…}` เพิ่มบล็อก `#module-dashboard { --primary:#3e63dd; --primary-hover; --primary-glow; --success/--warning/--danger/--info (+ -bg/-glow) }` ใช้สีชุดเดียวกับ `admission/js/tailwind-config.js` ของเนยสด — มีผลเฉพาะภายใน `#module-dashboard` (2) `app.html` ใน `<section id="module-dashboard">` เปลี่ยน inline `background: linear-gradient(135deg, hsl(..), hsl(..))` ทั้ง 15 จุดเป็นสีทึบ: hue 250 → `var(--primary)`, 38 → `var(--warning)`, 350 → `var(--danger)`, 142 → `var(--success)`, 199 → `var(--info)`, ม่วง→ไวโอเล็ต (250→280) → `#9333ea`
- **ทำไม**: เนยสดตัดสินใจ (2026-09-29) ให้สีตามธีมเนยสด ไอคอนใช้สีทึบน้ำเงิน-ม่วงของเนยสด ส่วนการ์ดคงสไตล์แคร์ (ขาว/เงา/มุมโค้ง, พื้นหลังหน้า `--bg-app` ไม่เปลี่ยน) และทำเป็นก้าวแรกที่แดชบอร์ดหลักก่อน
- **หน้าตาเปลี่ยน**: **เปลี่ยน** — เฉพาะสีบนแดชบอร์ดหลัก และไอคอนไม่มี gradient แล้ว (เป็นสีทึบ) · view อื่นและ `leave-features.html` ยังใช้สีของแคร์เหมือนเดิม (gradient นอกแดชบอร์ดตั้งใจไม่แตะ)
- **กฎต่อไป**: เมื่อหน้าอื่นสลับตามธีมนี้ ให้เพิ่ม scope ของหน้านั้นแบบเดียวกัน (เช่น `#module-leave { … }`) หรือย้ายค่าเข้า `:root` ทีเดียวเมื่อครบทุกหน้า
- **ย้อน**: ลบบล็อก `#module-dashboard {…}` ใน `app.css` แล้วคืน inline gradient เดิมในส่วน dashboard ของ `app.html` (ดูของเดิมด้วย `git diff` / `git checkout -p` เฉพาะบรรทัดเหล่านั้น)

### ข้อสังเกต (ยังไม่ได้แก้ — ของแคร์ตัดสินใจเอง)
- `leave-features.js` ท้ายไฟล์เรียก `renderAllHistory()` แต่ `renderAllHistory` อ่าน `#all-search` ซึ่งไม่มีใน HTML แล้ว → ขึ้น `Uncaught TypeError: Cannot read properties of null (reading 'value')` ใน console ตอนโหลด (เป็นมาก่อนรอบนี้ ไม่ได้ทำให้หน้าพัง เพราะเป็นบรรทัดสุดท้าย) — แก้ได้โดยลบการเรียกนั้นหรือเช็ค null
- `settings.js` ผูก click กับ `.menu-item[data-view]` ทุกตัว (ไม่จำกัดเฉพาะเมนูตั้งค่า) — ยังไม่ได้แตะ แค่จดไว้
- ยังไม่ได้แตะ: เงา `.glass-card`, สีของหน้าอื่นนอกแดชบอร์ด, เลย์เอาต์ (ทุกอย่างที่หน้าตาเปลี่ยน) — รอเรื่องธีม (สีแดชบอร์ดหลักทำแล้ว ดูข้อ 17)
