# CHANGES-FOR-CARE.md — สิ่งที่ noeysod แก้ในโฟลเดอร์ `schooldark/` (ของแคร์)

> ไฟล์นี้เป็น "คู่มือนำทาง" สำหรับแคร์ (และ Claude ของแคร์): ทุกครั้งที่ noeysod แก้ไฟล์ในโฟลเดอร์นี้
> จะบันทึกไว้ที่นี่ ตามหลักว่า **แก้เฉพาะสิ่งที่ผู้ใช้ไม่เห็นหน้าตาเปลี่ยน** (ถ้าหน้าตาเปลี่ยน ต้องคุยกับแคร์ก่อน)
> รูปแบบต่อรายการ: วันที่ · ไฟล์/ฟังก์ชัน · แก้อะไร · ทำไม · หน้าตาเปลี่ยนไหม · ถ้าอยากย้อน
> รายการใหม่ให้เพิ่มไว้ **บนสุด**

## 2026-09-29 (รอบ 2: ย้ายหมวดการลา + wizard บุคลากร) — ⚠️ **หน้าตาเปลี่ยน**: หน้าตั้งค่าการลาย้ายที่, เมนูบุคลากรหาย 3 อัน

> ⚠️ **แคร์ต้อง `git pull` ก่อนแก้ `app.html` / `app.js` / `index.js` / `personnel.js` / `app.css` / `leave-features.*`**
> - ฟอร์ม/logic ตั้งค่าการลา (บุคลากร + นักเรียน) **ไม่อยู่ใน `schooldark/` แล้ว** → ไปแก้ที่ `settings/leave.html` + `settings/js/leave-settings-*.js`
> - ข้อ "ที่ยังไม่ได้ย้าย: หมวดการลา" ในรายการ 18 ด้านล่าง **ล้าสมัยแล้ว** — ย้ายครบแล้วในรอบนี้

### 19. ย้ายหน้าตั้งค่าการลา (บุคลากร + นักเรียน) ออกจาก `schooldark/` ไป `settings/leave.html`
- **ทำไม**: noeysod สั่งย้ายการตั้งค่าที่แคร์ดูแลมารวมที่ `settings/` (หมวดโรงเรียน + บุคลากรย้ายไปแล้วในรายการ 18 เหลือหมวดการลา)
- **ไฟล์ใหม่**: `settings/leave.html` (2 แท็บ `#tab=staff` / `#tab=student`), `settings/js/leave-settings.js` (router + helpers; contract `window.LeaveSettings = { tabs, helpers:{esc,toast,openModal,closeModal,confirm,debounce,svg}, switchTab }`, แท็บ = `{title, desc, iconSvg, render(panelEl)}`), `settings/js/leave-settings-staff.js` (wizard 6 ขั้น + live preview — มาจาก view `leave-settings` ใน `app.html`), `settings/js/leave-settings-student.js` (wizard 5 ขั้น ประเภทการลา การ์ดบทบาทผู้อนุมัติ โมดัลบันทึกพร้อมวันที่มีผล → เวอร์ชัน active/scheduled และ drawer ประวัติ — มาจาก `student-leave-settings` ใน `leave-features.html`)
- **`settings/js/sd-settings-store.js` เพิ่ม**: `leaveSettings()`/`saveLeaveSettings()` (คีย์เดิม `schooldark_settings`, seed = `INITIAL_SETTINGS` ใน `index.js` **ต้องตรงกัน**), `studentLeaveVersions()`/`saveStudentLeaveVersions()` (คีย์ใหม่ `sd_student_leave_versions`), `studentLeaveForm()`/`saveStudentLeaveForm()` (คีย์ใหม่ `sd_student_leave_form`: acadYear, term1Start/End, term2Start/End, approverCount, roleTeacher1/2, roleHead, roleDean, approverSequence, sickDocRequired, sickDocDays, alertParent, deadlineTime, quotaWarningPercent)
- **ของแคร์ที่ลบ**:
  - `app.html`: `#view-leave-settings`
  - `app.js`: `MODULE_DEFAULT_VIEWS.leave` → `'leave-form'`, `VIEW_TITLES` `leave-settings`/`settings`, สาขา `renderSettingsView` ใน `fireModuleInit`
  - `index.js`: `renderSettingsView`, `addApprover`/`removeApprover`, `saveSettingsFromDOM`, `saveAllSettings`, `goToSettingsStep`/`next`/`prevSettingsStep`, `ensureStaffTypeQuotaSeeded`, `renderStaffTypeQuotaTable`, `staffTypeNameSafe`, `updatePreviewStep1..6`, `updateAllSettingsPreviews`, `initSettingsPreview` + การผูก event ตอนโหลด (`add-approver-btn`, `save-settings-btn`, `rule-rollover`, คลิก journey-step ของ settings, `prev/next-settings-btn` — พวกนี้ไม่มี null check ถ้าลบ markup โดยไม่ลบบรรทัดเหล่านี้ ฟอร์มยื่นลาจะพัง)
  - `leave-features.html`: `#view-student-leave-settings`, `#modal-leave-type` (+overlay), `#settings-save-modal` (+overlay)
  - `leave-features.js`: ฟังก์ชันตั้งค่าทั้งหมด + `window.*` exports + `syncApproverRoleCards()` ระดับบนสุด + `activeSettingStep`, `approverRoleSelectionOrder`, `getActiveSettingsVersion` + รายการ `VIEW_TITLES`/`BREADCRUMB_GROUP`/`showModuleView`/submenu ของ `student-leave-settings`
  - **คงไว้**: `INITIAL_SETTINGS`, `systemState`, `initializeDatabase`, `getStaffQuota`, `activeStaffTypesSafe`, helper journey-step ของฟอร์ม/อนุมัติ, `studentLeaveTypeBadgeClass`, `CURRENT_APPROVER_NAME`, `detailDrawerRefresh`, `#drawer-detail`
- **ของเหลือ (ยังไม่เก็บ)**: CSS `#settings-save-modal` ใน `leave-features.css` (บรรทัด ~46–47) และอาจมี `.approver-role-card`; คอมเมนต์ใน `index.js` ที่ `INITIAL_SETTINGS` ยังพูดถึง `ensureStaffTypeQuotaSeeded`; `systemState.currentSettingsStep` ไม่มีใครใช้; สาขา `goToSettingsStep` (มี `typeof` guard) ใน `bindSubmenus` ของ `app.js` กลายเป็นโค้ดตาย
- **เมนู** (`shared/cross-nav.js`): "ตั้งค่าการลา" มีลูก → `settings/leave.html#tab=staff` / `#tab=student` (origin `schooldark`)

### 20. พฤติกรรมที่เปลี่ยน (ไม่ใช่แค่ย้ายที่)
- **ตั้งค่าการลาบุคลากรบันทึกจริงแล้ว**: เดิม `saveStateToLocalStorage` ของ `settings.js` บังชื่อของ `index.js` ทำให้ `schooldark_settings` ไม่ถูกเซฟซ้ำหลัง seed (แก้แล้วรีโหลดค่าหาย) — หน้าใหม่เขียนคีย์นี้ตรง ๆ ทำให้โควตา/ผู้อนุมัติ/เงื่อนไขที่ `index.js` อ่านผ่าน `systemState.settings` (`getStaffQuota`, `ruleHalfDay`, `ruleSickDoc`, `ruleAdvanceDays`, `approvers[0]`) เห็นค่าที่บันทึก; ช่องผู้รับแจ้งเตือน (`recipients`) โหลด/บันทึกได้ (เดิมไม่); เพิ่ม/ลบผู้อนุมัติบันทึกทันที
- **ประเภทการลานักเรียนบันทึกจริง**: `leave-features.js` อ่านเวอร์ชัน active จาก `sd_student_leave_versions` ตอนโหลด (`STUDENT_LEAVE_TYPES`/`SETTINGS_VERSIONS` ยังเป็น `let` และมี default ในโค้ดเป็น fallback) ช่อง `sett-*` ถูกบันทึกที่ `sd_student_leave_form` แต่ยังไม่มีหน้าไหนอ่านไปใช้ (เหมือนเดิม)
- **UI ต่างจากเดิมเล็กน้อย**: โมดัลประเภทการลาเป็นกลางจอ, drawer ประวัติเป็นแผงของตัวเอง, "วันนี้" ใช้วันที่ท้องถิ่น, ขั้นที่ทำแล้วเป็นสีเขียว (class `done` ของแคร์ไม่มี CSS)
- **ช่องว่างที่ยังมี**: เวอร์ชัน scheduled ไม่ถูกเลื่อนเป็น active อัตโนมัติเมื่อถึงวันที่มีผล (เหมือนของเดิมแคร์)
- **ข้อสังเกตที่เจอตอนทดสอบ**: ค่าโควตาตั้งต้น (ป่วย/พักผ่อน/คลอด) ถูกคัดลอกลงตารางแยกตามประเภทบุคลากรครั้งแรกที่เปิดหน้า ครูที่มี `staffTypeId` จึงใช้ค่าในตารางนั้น (`getStaffQuota` ให้ override มาก่อน) — แก้เฉพาะช่องตั้งต้นจึงไม่เปลี่ยนการ์ดโควตาของครู ต้องแก้ในตารางประเภทบุคลากรด้วย (พฤติกรรมเดิมของแคร์ ไม่ได้แก้)

### 21. Personnel wizard 3 ขั้น (flow ของแคร์) + เอาเมนู 3 อันออก + แก้บั๊ก
- **flow**: รายชื่อบุคลากร → "เพิ่มบุคลากรรายบุคคล" (หรือ "แก้ไข") → 1 ข้อมูลพื้นฐาน → 2 การศึกษา & อบรม → 3 ตำแหน่ง & ใบประกอบฯ
- **สาเหตุที่ "แก้ไข" เคยขึ้นหน้าว่าง**: `personnel.js` `switchView()` รองรับ `#view-personnel-wizard` (`.journey-step[data-step]` + `.personnel-step-pane`) อยู่แล้ว แต่ `app.html` ไม่มี markup นั้น
- **`app.html`**: ห่อ `#view-basic-info` / `#view-education` / `#view-job-license` (เปลี่ยน class `view-section` → `personnel-step-pane` คง id เดิม) ด้วย `#view-personnel-wizard` พร้อมการ์ด stepper 3 ขั้น
- **`app.css`**: เพิ่ม `.personnel-step-pane` / `.personnel-wizard-stepper`
- **`personnel.js`**: ตัด `import-hub` ออกจากรายการ wizard; sidebar ไฮไลต์ "รายชื่อบุคลากร" ขณะอยู่ใน wizard; คลิก stepper ได้เมื่อบันทึกข้อมูลพื้นฐานแล้ว (ไม่งั้น toast "กรุณาบันทึกข้อมูลพื้นฐานก่อน"); `deleteTeacherProfile` เคลียร์ `selectedTeacherId` ถ้าลบคนที่เลือกอยู่
- **`app.js`**: ปุ่มเพิ่มบุคลากรเรียก `createNewBlankForm()` แล้ว `switchView('basic-info')` (แก้บั๊กที่กดเพิ่มแล้วเปิดฟอร์มของคนที่แก้ล่าสุด); `VIEW_TITLES` `basic-info`/`education`/`job-license` และสาขาใน `fireModuleInit` กลายเป็นโค้ดตาย
- **`shared/cross-nav.js`**: ลบเมนู `menu-basic-info`, `menu-education`, `menu-job-license` (งานบุคลากรเหลือ รายชื่อ / นำเข้าข้อมูล / พิมพ์ & QR Studio)
- **หน้าตาเปลี่ยน**: **ใช่** — ⚠️ (1) ตั้งค่าการลาอยู่ที่ `settings/leave.html` (2) sidebar งานบุคลากรเหลือ 3 เมนู (3) มี stepper 3 ขั้นบนฟอร์มบุคลากร
- **ย้อน**: `git checkout` ไฟล์ที่แก้ — `schooldark/app.html`, `app.js`, `index.js`, `personnel.js`, `app.css`, `leave-features.html`, `leave-features.js`, `leave-features.css` (ถ้าแตะ), `shared/cross-nav.js`, `settings/index.html` — แล้วลบ `settings/leave.html`, `settings/js/leave-settings.js`, `settings/js/leave-settings-staff.js`, `settings/js/leave-settings-student.js` และถอดส่วนที่เพิ่มใน `settings/js/sd-settings-store.js` (`leaveSettings`, `studentLeaveVersions`, `studentLeaveForm` + 3 คีย์ใน `KEYS`)

## 2026-09-29 (รอบย้ายการตั้งค่า) — ย้ายหน้า "ตั้งค่า" ของ care ไปรวมที่ `settings/` (⚠️ **หน้าตาเปลี่ยน**: หน้าตั้งค่าย้ายที่)

> ⚠️ **แคร์ต้อง `git pull` ก่อนแก้ `app.html` / `app.js` / `settings.js` / `leave-features.*`** — หน้าตั้งค่าไม่อยู่ใน `schooldark/` แล้ว
> ถ้าแก้ฟอร์ม/โมดัลตั้งค่าค้างอยู่ใน `app.html` ให้ย้ายไปแก้ที่ `settings/school.html` / `settings/personnel.html` แทน
> **ที่ยังไม่ได้ย้าย**: หมวดการลา (`leave-settings` ใน `app.html`, `student-leave-settings` ใน `leave-features`) — เพราะ `student-leave-settings` เก็บข้อมูลไว้ในหน่วยความจำอย่างเดียว (`STUDENT_LEAVE_TYPES`) และหลายหน้าใช้ ต้องย้ายข้อมูลลง localStorage ก่อน

### 18. ย้ายหน้าตั้งค่าโรงเรียน + บุคลากรออกจาก `schooldark/` ไป `settings/`
- **ทำไม**: noeysod สั่งให้ย้ายการตั้งค่ามารวมที่ `settings/`
- **ไฟล์ใหม่ (3 ไฟล์)**: `settings/personnel.html` (6 แท็บ: schedule, permissions, signatories, staff-types, positions, departments — มาจาก view เดิมของ `app.html`), `settings/js/personnel-settings.js`, `settings/js/sd-settings-store.js` (`window.SdSettings` — อ่าน/เขียนคีย์ `sd_*` ชุดเดียวกับ care; **seed ต้องเหมือน `settings.js` `initSettingsDatabase()` ทุกตัวอักษร ถ้าแคร์แก้ seed ต้องแก้ที่นี่ด้วย**)
- **ไฟล์ที่แก้ใน `settings/` + `shared/`**: `settings/school.html` (เพิ่ม 3 แท็บ รวมเป็น 8: **school** = ข้อมูลโรงเรียน (จาก view `general` ตัดการ์ดทางลัด 6 ใบออก), **homeroom** = ครูประจำชั้น, **attendance** = เวลาเข้า-เลิกเรียนนักเรียน (จาก `attendance-settings`); แท็บเริ่มต้นเป็น school; แก้ `switchTab` ที่เดิมกดแท็บแล้วไม่ render ใหม่), `settings/index.html` (badge ระบบ "บุคลากร & การลา" สำหรับ origin schooldark), `shared/cross-nav.js` (เมนูตั้งค่าชี้หน้าใหม่ ติด `origin:'schooldark'`, เพิ่ม `syncSubmenuLinkActive()` ไฮไลต์ลิงก์เมนูย่อยตอน `hashchange`)
- **ไฟล์ของแคร์ที่แก้**:
  - `app.html`: ลบ `#module-settings` และโมดัลตั้งค่า 8 ตัว; ปุ่มลัดแดชบอร์ด "ตั้งค่าระบบ" ไป `../settings/school.html#tab=school`
  - `app.js`: ลบรายการของ settings ใน `VIEW_TITLES` / `MODULE_DEFAULT_VIEWS` / `fireModuleInit`
  - `settings.js`: จาก 1964 → 342 บรรทัด เหลือเป็น **data layer อย่างเดียว** (`INITIAL_*`, `settingsState`, `settingsStateDraft`, `initSettingsDatabase`, `saveStateToLocalStorage`, wrapper `showToast`/`openModal`/`closeModal`/`formatThaiDate` — ไม่แก้ค่า/ชื่อ) ห้ามลบ เพราะ `index.js`/`personnel.js` อ่าน `settingsState`
  - `leave-features.html` / `leave-features.js`: ลบ view `attendance-settings` และ `renderAttendanceSettings` / `saveAttendanceSettings` / `attDaysLabel` (คง `ATT_SETTINGS_KEY`, loader `attSettings`, `attMin`, `attHHMM` ไว้ — หน้าเช็คชื่อ/รายงานยังอ่านค่าจากคีย์เดิม)
  - `app.css`, `leave-features.css`: ตัดสไตล์ที่ใช้เฉพาะหน้าตั้งค่าที่ย้ายออก
- **คีย์ localStorage ไม่เปลี่ยน**: ยังเป็น `sd_*` และ `sd_student_attendance_settings` ชุดเดิม ทั้งสองฝั่งอ่านเขียนร่วมกัน (ตรวจข้ามหน้าด้วย headless Chrome: เพิ่มตำแหน่งที่ settings → โผล่ในฟอร์ม job-license, ตั้งเวลาเข้าเรียน 07:40 → หน้าเช็คชื่อเห็น 07:40, ครูที่ seed จาก `app.html` โผล่ในแท็บ homeroom)
- **พฤติกรรมที่ต่างจากของเดิมตอนย้าย**: ไม่มี draft แล้ว (แก้ในโมดัลบันทึกทันที), ปุ่ม "บันทึก" ของลิสต์แค่ขึ้น toast, ลบกะ/วันหยุด/ผู้ลงนามต้องกดยืนยันก่อน, id ใหม่ = max+1
- **ปุ่มที่เดิม "ตาย" แล้วซ่อมตอนย้าย**: ปุ่ม "สิทธิ์" ของหน้า permissions เดิมเรียก `editUserRole` ที่ไม่มีอยู่ → ตอนนี้ใช้ได้ และบันทึก role/status พร้อมฟิลด์ใหม่ **`perms` (array) ลง `sd_users`** ⚠️ แคร์รับทราบ; ช่องค้นหาผู้ใช้/ตัวกรอง role ใช้ได้; การแก้ผู้ลงนามบันทึกจริง (เดิมพึ่ง `#btn-save-doc-signatories` ที่ไม่มี); สถิติ "วันทำงาน" ตามวันทำงานที่บันทึก; แก้ outline off-by-one
- **สไตล์**: หน้าใหม่ใช้ Tailwind แต่ layout / สี (พาเลต `sd-*`) / ไอคอน เป็นของ care
- **ที่ยังไม่ทำ/ข้อสังเกต**:
  - หน้า `settings/school.html` มี "ปีการศึกษาปัจจุบัน" 2 แหล่งที่ยังไม่ sync: `sd_acad_*` (care) กับ `school_academic_years` (noeysod)
  - ถ้ายังไม่เคยเปิด `app.html` (ยังไม่ seed `schooldark_personnel_teachers`) กลุ่มครูในแท็บ homeroom จะว่าง หน้าแสดงคำแนะนำ
  - คอมเมนต์ใน `settings.js` แถว ~94 พูดถึง `ensureHomeroomYearSeeded` ซึ่งตอนนี้อยู่ใน `settings/school.html`
  - ชื่อฟังก์ชัน `saveStateToLocalStorage` ชนกันระหว่าง `index.js` กับ `settings.js` (settings.js ชนะ) — มีมาก่อน ยังไม่แก้
- **หน้าตาเปลี่ยน**: **ใช่** — หน้าตั้งค่าย้ายไปอยู่ใต้ `settings/` (เมนูซ้าย "การตั้งค่า") ไม่ได้อยู่ใน `app.html` / `leave-features.html` อีก
- **ย้อน**: `git checkout` ไฟล์ที่แก้ (`schooldark/app.html`, `app.js`, `settings.js`, `app.css`, `leave-features.html`, `leave-features.js`, `leave-features.css`, `shared/cross-nav.js`, `settings/school.html`, `settings/index.html`) แล้วลบไฟล์ใหม่ 3 ไฟล์ (`settings/personnel.html`, `settings/js/personnel-settings.js`, `settings/js/sd-settings-store.js`)

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

### 17. พื้นหลังหน้าเป็นเทาอ่อนแบบเนยสด (`schooldark/app.css`, `schooldark/leave-features.css`)
- **แก้อะไร**: (1) `app.css` `:root` `--bg-app` `hsl(210, 40%, 94%)` → `#f8fafc` (2) `main.main-content` ใช้ `var(--bg-app)` แทน `var(--bg-main)` (3) `header.top-header` เพิ่ม `background-color: var(--bg-main)` ให้แถบหัวยังขาว (4) `leave-features.css` `.sd-filter-sticky` ใช้ `var(--bg-app)` (แถบ sticky อยู่บนพื้นหน้า ไม่ให้เป็นแถบขาวโดด) · **ไม่แตะ** สี primary/success/warning/danger/info, gradient, เงา, เลย์เอาต์ · `--bg-main`/`--bg-card` ยังขาว (modal/drawer ใช้ `--bg-main`)
- **ทำไม**: ธีมเนยสดคือพื้นหน้า `#f8fafc` + การ์ดขาว แต่เดิม `main` เป็นขาว (`--bg-main`) การ์ด (`--bg-card`) ก็ขาว จึงขาวทับขาว มองไม่เห็นขอบเขตการ์ด (`--bg-app` เดิมถูก `main` บังอยู่) — เนยสดสั่ง (2026-09-29) ให้เปลี่ยนเฉพาะสีพื้นฐานขาว ๆ ส่วนสีเด่นของแคร์คงเดิม
- **หน้าตาเปลี่ยน**: **ใช่** — พื้นหลังหน้าเป็นเทาอ่อน การ์ด/แถบหัว/modal ยังขาว สีเด่นของแคร์เหมือนเดิม · มีผลทุกหน้าที่โหลด `app.css` (`app.html`, `leave-features.html`)
- **ย้อน**: `--bg-app` กลับเป็น `hsl(210, 40%, 94%)`, `main.main-content` กลับเป็น `var(--bg-main)`, ลบ `background-color` ใน `header.top-header`, `.sd-filter-sticky` กลับเป็น `var(--bg-main)`

### ข้อสังเกต (ยังไม่ได้แก้ — ของแคร์ตัดสินใจเอง)
- `leave-features.js` ท้ายไฟล์เรียก `renderAllHistory()` แต่ `renderAllHistory` อ่าน `#all-search` ซึ่งไม่มีใน HTML แล้ว → ขึ้น `Uncaught TypeError: Cannot read properties of null (reading 'value')` ใน console ตอนโหลด (เป็นมาก่อนรอบนี้ ไม่ได้ทำให้หน้าพัง เพราะเป็นบรรทัดสุดท้าย) — แก้ได้โดยลบการเรียกนั้นหรือเช็ค null
- `settings.js` ผูก click กับ `.menu-item[data-view]` ทุกตัว (ไม่จำกัดเฉพาะเมนูตั้งค่า) — ยังไม่ได้แตะ แค่จดไว้
- ยังไม่ได้แตะ: เงา `.glass-card`, สี, เลย์เอาต์ (ทุกอย่างที่หน้าตาเปลี่ยน) — รอเรื่องธีม (ทำแค่สีพื้นหลังหน้าแล้ว ดูข้อ 17)
