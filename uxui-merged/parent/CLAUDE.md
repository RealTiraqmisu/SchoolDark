# parent/ — พอร์ทัลผู้ปกครอง

> [!NOTE]
> อ่าน `../CLAUDE.md` ก่อน (โดยเฉพาะหัวข้อ "จุดเชื่อมของเมนูรวมในแต่ละหน้า") เพื่อเข้าใจว่า
> โฟลเดอร์นี้เป็นข้อยกเว้นของกฎ sidebar รวมโดยตั้งใจ — รายละเอียดอยู่ด้านล่าง

## 1. จุดประสงค์

พอร์ทัลสำหรับ**ผู้ปกครอง**เข้ามาดูข้อมูลของบุตรหลาน: ตารางเรียน/ตารางสอบ, ปฏิทินโรงเรียน,
ผลการเรียน, การมาเรียน, ประวัติการลา รวมถึง**แจ้งลาเรียนแทนบุตร**และจัดการโปรไฟล์ผู้ปกครองเอง
เป็น static prototype ล้วน ๆ ไม่มี backend จริง เปิดไฟล์ `.html` ตรง ๆ ด้วย `file:///` ต้อง
ทำงานได้ทันทีเหมือนอีก 2 ระบบ

## 2. รายการหน้า

- `login.html` — หน้าเข้าสู่ระบบของผู้ปกครอง (mock auth)
- `index.html` — แดชบอร์ดภาพรวม: การ์ดบุตรที่เลือก (กดชื่อ/รูปไปหน้าประวัติ `student.html`) มี
  สถิติ "การมาเรียน/วันลาที่ใช้" แบบย่ออยู่ในบรรทัดเดียวกันทางขวาของการ์ด (ไม่ใช่กล่องแยก) —
  บล็อกมาเรียนแสดง % สีตามเกณฑ์ (≥90 success/≥80 warning/อื่น destructive), บล็อกวันลาสรุปทุก
  ประเภทจาก `ParentStore.LEAVE_TYPES` เป็นบรรทัดเดียว ("ป่วย 2/15 · กิจ 1/10 · อื่น ๆ 0/5")
  กดฝั่งไหนไปแท็บนั้นของ `reports.html#tab=attendance|leave` (ไม่มีการ์ด "คำขอลารอตรวจสอบ"
  และไม่มีหลอด progress แล้ว — ตัวเลขสีบอกสถานะแทน), ทางลัด "บริการอื่น ๆ" (สร้างจาก
  `ParentUI.SERVICES` แหล่งเดียวกับเมนู), ประกาศจากโรงเรียน 3 รายการล่าสุด (ปุ่ม "ดูทั้งหมด →"
  ไป `announcements.html`) และกิจกรรมที่จะถึง
- `student.html` — ประวัติส่วนตัวของบุตร (ข้อมูลส่วนตัว, การศึกษา, ที่อยู่, ครอบครัว, พี่น้อง, สุขภาพ/ผู้ติดต่อ
  ฉุกเฉิน) อ่านอย่างเดียว รับ query `?id=<childId>`; ถ้าไม่มี/ไม่ตรงกับบุตรของผู้ปกครองนี้จะ fallback เป็น
  บุตรที่เลือกอยู่ (`getActiveChild()`) และ sync กลับเข้า `parent_active_child` เพื่อให้ child switcher บน
  navbar ตรงกัน เข้าถึงได้จากชื่อ/รูปบุตรบนหน้า `index.html` และลิงก์ "ดูประวัติเต็ม →" บนการ์ดบุตรของ
  `profile.html`
- `timetable.html` — ตารางเรียน/ตารางสอบของบุตร
- `calendar.html` — ปฏิทินโรงเรียน (อ่านข้อมูลปีการศึกษา/วันหยุดจาก `settings/` แบบอ่านอย่างเดียว)
- `reports.html` — ผลการเรียนและสถิติการมาเรียน/ขาด-ลา-มาสาย/ความประพฤติ เรียงแท็บ การมาเรียน →
  การลา → ผลการเรียน → ความประพฤติ (`#tab=attendance|leave|grades|behavior`, default `attendance`)
- `announcements.html` — ประกาศจากโรงเรียนทั้งหมด กรองตามแท็กได้ (ทั้งหมด/สำคัญ/กิจกรรม/ทั่วไป)
- `sdq.html` — แบบประเมิน SDQ หน้าเดียว (ไม่มีแท็บแยกฉบับผู้ปกครอง/นักเรียน — รวมเป็นคำอธิบายเดียว) —
  **placeholder เท่านั้น ยังไม่มี logic จริง — Team C รับผิดชอบพัฒนาต่อ** (ดูคอมเมนต์
  `TODO(Team C)` ในไฟล์)
- `home-visit.html` — เยี่ยมบ้านนักเรียน — **placeholder เดียวกับ `sdq.html` เป๊ะ ๆ** (ยังไม่มี
  logic/ข้อมูลจริง, คอมเมนต์ `TODO(Team C)`, Team C รับผิดชอบพัฒนาต่อ) อยู่ในกลุ่ม "บริการอื่น ๆ"
  เดียวกับแจ้งลาเรียน/SDQ
- `leave.html` — แจ้งลาเรียนแทนบุตร + การ์ดประวัติคำขอลา 5 รายการล่าสุด (ปุ่ม "ดูทั้งหมด →" ไป
  `leave-history.html`)
- `leave-history.html` — ประวัติคำขอลาเรียนแบบเต็ม: กรองตามบุตร/สถานะ, กดแถวเปิด modal ราย
  ละเอียดครบทุกฟิลด์ ยกเลิกคำขอได้จาก modal เมื่อสถานะ "รอตรวจสอบ" รองรับ deep-link `?id=PL-xxxx`
  เปิด modal อัตโนมัติ — เข้าถึงจากปุ่ม "ดูทั้งหมด →" ของ `leave.html` และลิงก์ "ดูเพิ่มเติม →" ของ
  แท็บการลาใน `reports.html`
- `profile.html` — จัดการโปรไฟล์ผู้ปกครอง (การ์ด "ข้อมูลผู้ปกครอง" เป็นโหมดแสดง/แก้ไข ปุ่มแก้ไข
  ปุ่มเดียวแก้ได้ทั้งข้อมูลและรูปโปรไฟล์ ผ่านโมดูลกลาง `js/parent-profile-editor.js`
  `ParentProfileEditor.mount()`), ข้อมูลบุตร และสลับบุตรที่ดูอยู่ (กรณีมีหลายคน) — รหัสผ่าน/
  การแจ้งเตือนย้ายไปอยู่ที่ `settings.html` แล้ว
- `settings.html` — ตั้งค่าบัญชีแบบ 2 คอลัมน์ (เมนูซ้าย + การ์ดทีละใบ สลับด้วย
  `#account|password|notify|devices|prototype`): บัญชีผู้ใช้ (mount `ParentProfileEditor` ตัว
  เดียวกับ `profile.html` แก้ไขได้จริง + ส่วน "บุตรในบัญชีนี้" อ่านอย่างเดียว มีปุ่ม "ลบออกจาก
  บัญชี" ต่อคน), เปลี่ยนรหัสผ่าน (จำลอง), **การแจ้งเตือนถูก disable ทั้งกล่องไว้ก่อน** (รอคุยกับ
  อาจารย์ ไม่มีโน้ตอธิบายในหน้าตามที่ตั้งใจ), อุปกรณ์ที่เข้าสู่ระบบ (mock), รีเซ็ตข้อมูลตัวอย่าง —
  เข้าถึงจากเมนูรูปโปรไฟล์บน navbar

## 3. ดีไซน์

ใช้ Tailwind CSS ผ่าน CDN (`cdn.tailwindcss.com`) ธีมขาวเหมือน `../admission/` เท่านั้น
(ห้ามมีโหมดมืด) ไอคอนใช้ Lucide ผ่าน CDN (`<i data-lucide="...">`) และฟอนต์ Sarabun ค่าสี
Tailwind config กลางของทั้งพอร์ทัลอยู่ที่ `js/tailwind-config.js` — ทุกหน้าโหลดไฟล์นี้คู่กับ
สคริปต์ `cdn.tailwindcss.com` เสมอ เพื่อให้ค่าสี/ธีมตรงกันทุกหน้าโดยไม่ต้องก็อป config ซ้ำ

## 4. Nav

`js/parent-nav.js` เป็นคนเรนเดอร์ **navbar บนสุดทั้งก้อน** ให้ทุกหน้าในโฟลเดอร์นี้ (ไม่ใช้
sidebar แอดมินของ `../shared/cross-nav.js` เลย) ค่าคงที่ `PARENT_PAGES` ในไฟล์นั้นคือ
แหล่งข้อมูลเมนูของพอร์ทัลนี้จุดเดียว — เพิ่ม/ลบ/เปลี่ยนชื่อหน้าใดในพอร์ทัลนี้ ให้แก้ที่ตัวแปร
นี้เท่านั้น

`PARENT_PAGES` รองรับ item แบบกลุ่มย่อย (dropdown) ด้วย `{ id, label, icon, children: [...] }`
เช่นกลุ่ม "บริการอื่น ๆ" (`id: 'services'`) ที่รวม แจ้งลาเรียน + แบบประเมิน SDQ (หน้าเดียว ไม่แยก
ฉบับผู้ปกครอง/นักเรียนในเมนู) + เยี่ยมบ้าน (`home-visit.html`) — child แต่ละตัวเป็น
`{ file, hash?, label, icon, desc? }`; ปุ่ม dropdown ใช้ pattern
`data-dropdown` / `data-dropdown-toggle` / `data-dropdown-menu` เดียวกับ dropdown อื่น ๆ ในไฟล์นี้
(child switcher, user menu) ที่ `bindNavbarEvents` bind แบบ generic ให้ทุกตัวอยู่แล้ว ไม่ต้องเขียน
handler เพิ่ม บนมือถือกลุ่มจะเรนเดอร์เป็นหัวข้อ + ลิงก์ลูกเยื้องเข้าไปแทน dropdown

`window.ParentUI.SERVICES` (export จากไฟล์นี้) คือ `children` ของกลุ่ม `services` — ใช้ที่
`index.html` เพื่อสร้างการ์ดทางลัด "บริการอื่น ๆ" จากแหล่งข้อมูลเมนูเดียวกัน ไม่ต้องก็อปรายการซ้ำ

user menu (เมนูรูปโปรไฟล์บนขวา) มีลิงก์ "ตั้งค่าบัญชี" → `settings.html` ต่อจาก "โปรไฟล์"

## 5. Data

`js/parent-store.js` (`window.ParentStore`) เก็บทุกอย่างผ่าน `localStorage` คีย์ขึ้นต้นด้วย
`parent_` ได้แก่ session, active_child, profile, children, periods, timetables, exams,
grades, student_profiles, leave_requests, tickets, announcements, attendance (สร้างอัตโนมัติ),
behavior มีฟังก์ชัน `today()` คืนวันสาธิต (ถ้าไม่มี `SchoolStore` ให้อ้างอิงจะ fallback เป็นวันที่
mock ของตัวเอง) — เช็ค override `parent_demo_today` ก่อนเสมอ (ดู "Demo panel" ด้านล่าง)

**Demo panel เลือกวันที่จำลอง**: ปุ่มลอยมุมซ้ายล่างทุกหน้า (ยกเว้น `login.html`) เรนเดอร์โดย
`renderDemoPanel()` ใน `js/parent-nav.js` — เลือกวันเองได้ผ่าน `<input type="date">` + ปุ่มลัด
วันสำคัญ + ปุ่มล้างค่า เก็บ override ที่ `parent_demo_today` **ไม่อยู่ใน `ALL_KEYS`** (ปุ่ม
"รีเซ็ตข้อมูลตัวอย่าง" ใน `settings.html` จึงไม่ล้างวันจำลองทิ้งโดยตั้งใจ)

**พิมพ์ / ดาวน์โหลด**: โมดูลกลาง `js/parent-export.js`
(`ParentExport.open({ title, subtitle, filename, node, orientation })`) เปิด modal preview
กระดาษ A4 ก่อนพิมพ์/ดาวน์โหลดเสมอ (PDF ผ่าน `html2pdf.js`, JPG ผ่าน `toCanvas()`) ใช้แล้วใน
`timetable.html` และ `calendar.html` (เฉพาะโหมด "ตารางกิจกรรม") — หน้าใหม่ที่จะพิมพ์/ดาวน์โหลด
ให้เรียกโมดูลนี้ซ้ำ ไม่ต้องสร้าง modal เอง

**โมดัล/confirm มาตรฐาน**: `js/parent-nav.js` export `ParentUI.createDialog()` (สร้าง `<dialog>`
จริง) และ `ParentUI.confirm()` (แทน `window.confirm()`) — ทุกหน้าต้องใช้ 2 ตัวนี้ ห้ามเขียน
modal/`confirm()` เอง

`parent_student_profiles` เก็บข้อมูลประวัติส่วนตัวของบุตรแต่ละคน (keyed by child id เช่น `c1`/`c2`) —
แยกคีย์จาก `parent_children` (ข้อมูลพื้นฐาน/วิชาการที่หน้าอื่นใช้อยู่แล้ว) เพื่อไม่ชนกัน ใช้ผ่าน
`ParentStore.getStudentProfile(childId)` ที่ merge สองคีย์นี้เข้าด้วยกันให้แล้ว

`profile.notify` (ใน `parent_profile`) มี 2 มิติ: ช่องทาง (`line`/`sms`/`email`) และประเภท
(`announcements`/`leaveResult`/`attendance`) — ทั้งหมดเป็น boolean flat object เดียวกัน, บันทึกผ่าน
`saveParent({ notify: {...} })` ที่ merge เข้ากับของเดิมให้แล้ว (ดู `saveParent` ใน `parent-store.js`)
หน้า `settings.html` เป็นที่แก้ไขค่านี้ (ย้ายมาจาก `profile.html` เดิม)

## 6. ข้อจำกัดสำคัญ

ข้อมูลทั้งหมดเป็น **mock ใหม่ที่สร้างเฉพาะสำหรับพอร์ทัลนี้** ยังไม่เชื่อมกับข้อมูลจริงของ
`../admission/` (`admitify_*`) หรือ `../schooldark/` เลย เช่น การแจ้งลาเรียนที่หน้า `leave.html`
ไม่ได้ไปโผล่ในระบบลาเรียนของ `../schooldark/leave-features.html` จริง — เป็นการจำลองเก็บแยก
ไว้เองคนละชุดข้อมูล

## 7. อ่านข้อมูลข้ามระบบแบบอ่านอย่างเดียว

หน้า `index.html` และ `calendar.html` โหลด `../settings/js/school-store.js` เพื่ออ่าน
`school_calendar` / `school_academic_years` (ปฏิทินโรงเรียน/ปีการศึกษา) มาแสดงผล — เป็นการ
**อ่านอย่างเดียว** เท่านั้น ห้ามเขียนกลับเข้า `SchoolStore` จากหน้าใดในโฟลเดอร์นี้

## 8. กฎห้ามของโฟลเดอร์นี้

**ห้ามโหลด `../shared/cross-nav.js` หรือ `../shared/cross-nav.css` ในหน้าใดของโฟลเดอร์นี้
เด็ดขาด** — เป็นข้อยกเว้นที่ตั้งใจของโปรเจกต์ (ดู root `../CLAUDE.md` หัวข้อ "จุดเชื่อมของ
เมนูรวมในแต่ละหน้า") พอร์ทัลนี้เข้าถึงได้จากหน้า hub ผ่านการ์ดเดียวใต้กลุ่ม `id: 'parent'`
ใน `NAV_GROUPS` (item `hubOnly: true` ชี้ไปที่ `parent/login.html`) แต่ตัวมันเองไม่ใช้ sidebar
แอดมินหรือเมนูรวมของระบบอื่นเลย
