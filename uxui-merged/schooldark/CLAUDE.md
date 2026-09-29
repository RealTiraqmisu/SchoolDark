> [!IMPORTANT]
> **care / Claude ของ care: อ่าน [`CHANGES-FOR-CARE.md`](CHANGES-FOR-CARE.md) ก่อน** — noeysod แก้ไฟล์ในโฟลเดอร์นี้ไปบางส่วน (ไม่เปลี่ยนหน้าตา) และบันทึกไว้ที่นั่นทุกครั้ง

# SchoolDark — UX/UI Prototype

This file documents the `schooldark/` prototype based on inspection of `app.html`, `app.css`, `app.js`, and `leave-features.html`. It is meant to orient a future Claude session working in this folder.

> [!NOTE]
> This folder used to be the standalone `uxui/` folder. It now lives under `uxui-merged/schooldark/`
> alongside a second prototype (`../admission/`, a student-admission system with its own Tailwind-based
> design system). Read `../CLAUDE.md` first for the merged-folder rules — in particular: the two systems
> deliberately keep separate design systems, and **any page added/removed/renamed here must also be
> updated in `../shared/cross-nav.js`**, the single source of truth for the cross-system menu.
>
> The live pages here are **`app.html`** and **`leave-features.html`** only. The older `index.html`,
> `personnel.html` and `settings.html` (plus `index.css`, `personnel.css`, `settings.css`) were deleted
> during the merge, because `app.html` had already absorbed all of their views. Their JavaScript —
> `index.js`, `personnel.js`, `settings.js` — is still here and still loaded by `app.html`.
>
> **The left `<aside class="sidebar" id="sidebar">` no longer has hand-written menu markup in this
> folder.** Both `app.html` and `leave-features.html` now hold just a single
> `<script src="../shared/cross-nav.js"></script>` inside that `<aside>`, which builds the entire
> sidebar (logo, menu groups, submenus, badges, user footer) from `NAV_GROUPS` in that shared file —
> the same menu data also drives `admission/*`'s sidebar. The sidebar's CSS moved out of `app.css`
> entirely into `../shared/cross-nav.css` too. **Add/remove/rename a sidebar item by editing
> `NAV_GROUPS` in `../shared/cross-nav.js`, never by hand-editing markup in `app.html` /
> `leave-features.html`.** None of this touched `app.js` / `index.js` / `personnel.js` / `settings.js`
> — the generated markup intentionally keeps every id/class/data-attribute those files already query
> (`#sidebar`, `#sidebar-toggle-btn`, `#menu-*` ids, `.menu-item[data-module]`,
> `.submenu-item[data-step|data-tab|data-subtab]`, `#sidebar-approval-badge`, etc.) so their existing
> click/bind logic keeps working unmodified. See `../CLAUDE.md` → "จุดเชื่อมของเมนูรวมในแต่ละหน้า".

## 1. What this system is for

**SchoolDark** is a Thai school administration system covering two connected domains:

- **Personnel / HR management** (`app.html`) — teacher and staff records, staff leave requests and approvals, work schedules, and system-wide settings (roles, signatories, general school info).
- **Student attendance & permission tracking** (`leave-features.html`) — recording "permission tickets" (บัตรขออนุญาต) for students leaving class/school during the day, viewing history/reports, and configuring a separate **student leave (multi-day absence)** system for sick/personal leave.

The two are explicitly distinct concepts (per `implementation_plan.md`):
- **บัตรขออนุญาต (permission ticket)** — a student briefly entering/leaving a classroom or the school grounds *within a day* (already implemented).
- **การลาเรียน (student leave)** — a student absent for one or more *whole days* (sick leave, personal leave, etc.), modeled after the staff leave system in `app.html`, with its own settings wizard (newly added to `leave-features.html`).

Everything is currently a static front-end prototype/mockup: no backend, all data is mocked in JS, state lives only in memory/DOM.

## 2. User roles

Roles are implied by UI copy and a role-switcher on the leave module, rather than enforced by real auth:

| Role | Thai label | Capabilities implied by the UI |
|---|---|---|
| System admin | ผู้ดูแลระบบ / แอดมิน ระบบ | Full access to all modules; shown in `app.html` sidebar footer by default |
| HR / personnel officer | เจ้าหน้าที่บุคคล | Default logged-in user in `leave-features.html` (e.g. "สมปอง ทองดี"); manages tickets, history, employee directory, student leave settings |
| Teacher (general) | คุณครูทั่วไป (ผู้ยื่นขอลา) | Submits their own leave requests (mock role in the leave module's role switcher) |
| Head teacher / approver | หัวหน้าครู / ผู้อนุมัติ | Approves/rejects staff leave requests (mock role in the role switcher) |
| Homeroom teacher (ครูประจำชั้น) | — | Auto-resolved (not manually assigned) as first-line approver for student leave, based on classroom data |
| Advisor teacher (ครูที่ปรึกษา) | — | Auto-resolved second-line approver for student leave |
| Level head / student affairs (หัวหน้าระดับชั้น / ฝ่ายปกครอง) | — | Optional additional/fallback approvers for student leave, selectable from a dropdown |
| Student | นักเรียน | Implicit subject of permission tickets and leave only — cannot submit leave themselves (a teacher/officer files it for them) |
| Parent/guardian | ผู้ปกครอง | Notified automatically (LINE/SMS) when a student leave is approved, if enabled |

## 3. Pages / screens

### `app.html` — Personnel & Staff Leave module (sidebar-driven SPA shell)

Sidebar sections in the shared menu (`../shared/cross-nav.js`, reorganised 2026-09-29: งานกิจการนักเรียน / งานบุคลากร / งานบริหารการลา / การตั้งค่า — the older group names mentioned below are historical):

**ภาพรวมระบบ (Overview)**
- `view-dashboard-main` — Dashboard: welcome banner, 4 KPI stat cards (total staff, pending leave, expiring documents, approved today), recent leave requests activity feed, quick actions.

**ระบบบริหารการลา (Leave management)**
- ~~`view-leave-settings`~~ — **ย้ายออกจาก `app.html` แล้ว (2026-09-29)** ไปที่ `../settings/leave.html#tab=staff` (wizard 6 ขั้นเดิม: รอบปี, ผู้อนุมัติ, โควตา + ตารางโควตาแยกประเภทบุคลากร `staffTypeQuotaOverrides`, เงื่อนไข, แจ้งล่วงหน้า, การแจ้งเตือน/ผู้รับ) ค่าเก็บที่ `schooldark_settings` (seed `INITIAL_SETTINGS` ใน `index.js`) `index.js` ยังอ่านผ่าน `systemState.settings` / `getStaffQuota()` แต่ฟังก์ชันหน้าตั้งค่าทั้งหมด (`renderSettingsView`, `saveSettingsFromDOM`, `updatePreviewStep1..6` ฯลฯ) ถูกลบออกแล้ว
- `view-leave-form` — Leave request submission form: leave type, start/end date, half-day options, reason, submit-on-behalf-of (ส่งใบลาในนาม), plus a table of the user's own submitted requests (date, type, duration, status).
- `view-leave-approve` / `view-approve` — Calendar overview on top, then two tabs: **รายการคำขอ** (approval queue: teacher name, leave type, dates, attachment link, status; pending rows get approve/reject, resolved rows get an "อนุมัติโดย/ปฏิเสธ" note plus a "เปลี่ยนสถานะ" reset button, and every row has a "ดู" button opening `modal-detail` with the full request + attachment + evidence) and **ประวัติการลารายบุคคล** (a searchable teacher-name list — no more select dropdown — where clicking a teacher opens `modal-teacher-profile` with quota cards + a full history timeline; history items there drill further into `modal-detail`).

**ระบบบุคลากร (Personnel)**
- `view-directory` — Staff directory: searchable/filterable table (photo, staff code, name, position/department, phone, data status).
- `view-basic-info` — Edit basic personnel info: personal details, ID number, DOB, gender, blood type, religion, contact info, registered/current address, spouse & children info.
- `view-education` — Education & training records, honors, TOEIC score, certificate uploads.
- `view-job-license` — Job position & professional license info. The "ข้อมูลตำแหน่งงาน" sub-tab has a **ประเภทบุคลากร** select (`#job-staff-type`, populated from `settingsState.staffTypes`) feeding a **ตำแหน่งปัจจุบัน** select (`#job-position`, populated from `settingsState.positions` filtered to that type via `typeIds`) — changing the staff type re-filters the position list. It also has a **กลุ่มสาระการเรียนรู้** select (`#job-department`, populated from `settingsState.departments`, not filtered by anything). Saved onto the record as `job.staffTypeId` / `job.positionId` / `job.departmentId` (plus `job.position` / `job.department` kept as plain name strings for existing display/print code).
- **Personnel wizard (แก้ 2026-09-29, flow ของแคร์)** — `view-basic-info` / `view-education` / `view-job-license` ไม่ใช่เมนู sidebar แล้ว (ลบ `menu-basic-info/education/job-license` ออกจาก `cross-nav.js`) เข้าผ่าน directory → ปุ่ม "เพิ่มบุคลากรรายบุคคล" (`createNewBlankForm()` + `switchView('basic-info')`) หรือ "แก้ไข" (`editTeacherProfile`) โดย 3 view นี้ถูกห่อใน `#view-personnel-wizard` (การ์ด stepper 3 ขั้นด้านบน: `.journey-step[data-step=1..3]`) และเปลี่ยน class ของแต่ละ pane จาก `view-section` เป็น `personnel-step-pane` (id เดิม) — `personnel.js` `switchView()` เดิมรองรับ wrapper นี้อยู่แล้วแต่ `app.html` ไม่มี markup จึงเคยขึ้นหน้าว่าง; ตอนนี้ sidebar ไฮไลต์ "รายชื่อบุคลากร" ระหว่างอยู่ใน wizard, คลิก stepper ได้เมื่อบันทึกข้อมูลพื้นฐานแล้ว (ไม่งั้น toast "กรุณาบันทึกข้อมูลพื้นฐานก่อน"), `deleteTeacherProfile` เคลียร์ `selectedTeacherId`, `import-hub` ไม่อยู่ใน wizard แล้ว. CSS: `.personnel-step-pane` / `.personnel-wizard-stepper` ใน `app.css`
- `view-import-hub` — Bulk import: drag-and-drop Excel (via `xlsx.js`) upload of personnel data and photos.
- `view-print-studio` — Print & QR studio: select a staff profile and print/generate ID/QR documents.

**การตั้งค่าระบบ (System settings) — ย้ายออกจาก `app.html` แล้ว (2026-09-29)**
หน้าตั้งค่า general / homeroom / schedule / permissions / signatories / staff-types / positions / departments **ไม่อยู่ใน `app.html` แล้ว** (ลบ `#module-settings`
และโมดัลตั้งค่า 8 ตัว) ย้ายไปที่ `../settings/school.html` (แท็บ school, homeroom, attendance) และ `../settings/personnel.html` (แท็บ schedule, permissions,
signatories, staff-types, positions, departments) — ปุ่มลัดแดชบอร์ด "ตั้งค่าระบบ" ไป `../settings/school.html#tab=school` คีย์ `sd_*` ใน localStorage ยังเป็นชุดเดิม
(รวม `sd_users[].perms` ฟิลด์ใหม่จากหน้า permissions) ดู `CHANGES-FOR-CARE.md` รายการ 18 เหตุผล/วิธีย้อน ข้อควรรู้: การนับ "ห้ามลบถ้ายังมีบุคลากรผูกอยู่"
ของ staff-types/positions/departments และตัวเลือกหัวหน้าแผนก (`headTeacherId`) ย้ายไปอยู่ใน `settings/js/personnel-settings.js` แล้ว
หมวดการลาก็ย้ายแล้วเช่นกัน: `view-leave-settings` → `../settings/leave.html#tab=staff`, `view-student-leave-settings` (ใน `leave-features.html`) → `../settings/leave.html#tab=student` (ดู `CHANGES-FOR-CARE.md` รายการ 19–20) — `leave-features.js` อ่านเวอร์ชันประเภทการลาที่ active จากคีย์ `sd_student_leave_versions` ตอนโหลด (`STUDENT_LEAVE_TYPES` / `SETTINGS_VERSIONS` ยังเป็น `let` และมีค่า default ในโค้ดเป็น fallback)

Several modals overlay these views: leave request detail (`modal-detail`), the individual teacher leave profile (`modal-teacher-profile`, quota cards + history, opened from the searchable name list on the "ประวัติการลารายบุคคล" tab), shift editor, holiday editor, user role editor, signatory editor, and a generic confirm dialog.

### `leave-features.html` — Student permission tickets & reports module

Sidebar sections:

**การมาเรียนของนักเรียน (Student attendance)** — no scanner hardware yet, so attendance comes from (1) homeroom teachers checking names, (2) approved student leave (`STUDENT_LEAVE_REQUESTS`, auto-filled and locked), (3) approved exit tickets in `HISTORY` (`ATT_EXIT_TICKET_TYPES` → "ออกก่อนเวลา"). `getAttendance(student, date)` is the single source of truth for a student-day, in that priority order; past dates the teacher never saved fall back to deterministic mock data (`attMockRecord`, seeded so reloads match) and today/unsaved shows "ยังไม่เช็คชื่อ". A `source` field (`teacher`/`scan`/`import`/`leave`) is already modeled for a future scanner/Excel import. Teacher saves live in localStorage `sd_student_attendance` (key `<date>|<studentId>`); settings in `sd_student_attendance_settings`.
- `view-student-dashboard` — "แดชบอร์ดการมาเรียน" (first item of the group). A sticky filter bar (`.sd-filter-sticky`) holds a period dropdown (วันนี้/เมื่อวาน/สัปดาห์นี้/สัปดาห์ที่แล้ว/เดือนนี้/เดือนที่แล้ว/ภาคเรียนนี้/กำหนดเอง…), ‹ › buttons that step one unit (`sdPeriod.unit` = day/week/month/term/custom; day-steps skip non-school days), two selects — ระดับชั้น (`#sd-grade`) and ห้อง (`#sd-room`, option values are full class names like `ม.1/1`; with no grade picked it lists every room, and picking one sets the grade for you, so neither box is ever disabled; the combined key `''`/`ม.1`/`ม.1/1` from `sdClassKey()` is what gets saved), and a "ล้างตัวกรอง" button shown only when filters differ from the default (this month, all classes). **Terms come from `SchoolStore.get('school_academic_years')`** (`../settings/js/school-store.js`, loaded by this page) — the term containing today, else the latest started one. "The previous period" used for comparison is always `sdShiftPeriod(sdPeriod, -1)`. Filters + chart mode persist in localStorage `sd_student_dashboard_filters`; preset choices are recomputed from today on load. `sdCompute(period, grade, room)` walks every student × school day through `getAttendance()` and counts tickets from `HISTORY` (excluding "ไม่อนุมัติ"); the unit is "คน-วัน", and % มาเรียน = (ตรงเวลา + สาย) ÷ days already checked. The overview is three tiers: a hero rate with Δ vs the previous period and the `SD_RISK.rate` threshold; one 100% composition bar (colour order ontime→leave→late→absent, chosen so it stays readable for colour-blind users) with per-school-day averages; and a "ต้องติดตาม" strip (unchecked rooms on the latest school day, at-risk students, pending leave/tickets) that hides when empty. The daily chart (Chart.js from jsDelivr) has 3 modes — อัตรามาเรียน (current vs previous period aligned by school-day index + dashed threshold), แยกสถานะ (`SD_LINE_COLORS`, validated all-pairs), เทียบห้อง (`SD_ROOM_COLORS` keyed to the room, not its rank; hover highlights one line; refuses >8 rooms). The "บัตรขออนุญาตแยกประเภท" card is plain HTML bars (`renderSDTicketChart`), not Chart.js — long Thai category names on a Chart.js y-axis got clipped at the left edge (label width is measured before the Sarabun web font loads, and the card is narrow). Tabs: รายห้อง (click a row/bar to drill into that room) and รายบุคคล (single-select status chips counted in students, cleared only via its own "ล้างตัวกรอง" button — clicking the active chip again does nothing; sortable; paged by `SD_PAGE_SIZE`; "กลุ่มเฝ้าระวัง" flags from `SD_RISK`; clicking a row opens `sdOpenStudentDrawer()` in the shared `#drawer-detail` instead of navigating away — per-student stats, a one-square-per-school-day strip, the non-ontime days, and that period's tickets/leave requests; clicking a ticket/leave opens its existing detail in the same drawer with the ‹ back button wired via `sdDrawerGo()` → `detailDrawerBackTo`). `sdExportExcel()` writes a 5-sheet workbook (สรุปภาพรวม / รายห้อง / รายบุคคล / รายวัน / บัตรขออนุญาต).
- `view-attendance-check` — "เช็คชื่อนักเรียน": pick grade + room + date (max today); everyone defaults to "มา", the teacher only flips late/absent/early-leave rows (time inputs enable only when relevant), "ทุกคนมาเรียน" resets the room, "บันทึกการเช็คชื่อ" saves the whole room (`recordedBy` = `CURRENT_APPROVER_NAME`).
- `view-attendance-report` — "รายงานการมาเรียน": filters by grade, room, date range (capped at `ATT_REPORT_MAX_DAYS`, school days only), name/ID search; clickable KPI cards double as status filters; 50-row pagination (`ATT_REPORT_PAGE_SIZE`) because a month of ~175 students is thousands of rows; `exportExcel('attendance')` exports all filtered rows. Columns: วันที่, ชั้น/ห้อง, ชื่อ-นามสกุล (with prefix via `studentFullName()`), รหัส, สถานะเข้า, เวลาเข้า, สถานะเลิก, เวลาออก, บันทึกโดย, หมายเหตุ.
- `view-attendance-settings` — **ย้ายไป `../settings/school.html#tab=attendance` แล้ว (2026-09-29) ไม่มี view นี้ใน `leave-features.html` อีก** ค่าตั้งยังเก็บที่คีย์ `sd_student_attendance_settings` (start/end, absentAfter, gateOpen [เก็บไว้เฉยๆ สำหรับเครื่องสแกนในอนาคต], lateMin/earlyMin, days) และหน้านี้ยังอ่านผ่าน `attSettings` (`ATT_SETTINGS_KEY`, `attMin`, `attHHMM` ยังอยู่) สถานะของแถวที่มีเวลาถูกคำนวณจากค่านี้ตอน render (`attStatusInFromTime`/`attStatusOutFromTime`) ครูที่บันทึกสถานะไว้จะเก็บค่าตรงๆ
- `STUDENTS` now gets ~167 generated students appended right after its literal (`generateStudentRoster()`, 25 per room in `ATT_ROOMS`, ids `S-<grade><room><no>`, plus a `gender` field for name prefixes) so every student list on this page (ticket wizard, leave wizard, history) sees the same roster.

**การลาเรียนของนักเรียน → อนุมัติการลานักเรียน** (sidebar group was "การอนุมัติ" before the menu reorganization; see `../CLAUDE.md`)
- `view-approve` — "อนุมัติการลานักเรียน": a calendar overview of student leave on top (**ปฏิทินภาพรวมการลาของนักเรียน** — month/week/day, same `.calendar-grid`/`.calendar-leave-pill`/`.cal-mode-btn` pattern as `app.html`'s staff calendar, sourced from `STUDENT_LEAVE_REQUESTS`; leave-type colors/legend come from the CRUD-able `STUDENT_LEAVE_TYPES` via `studentLeaveTypeBadgeClass`), one KPI card (pending count), then two tabs:
  1. **รายการคำขอ** — the approval queue table, with a name/ID search box + leave-type filter dropdown alongside the existing status filter chips. The attachment column is a clickable paperclip link (`slAttachmentLinkHTML`, matching the staff table's style); there is **no action column any more** — the first column "สถานะ" is a colored dropdown (`slStatusSelectHTML` / `onSLStatusSelect`) that does the same job: choosing อนุมัติ/ไม่อนุมัติ calls `approveStudentLeave`/`rejectStudentLeave` (confirm modal with a required note), choosing รอตรวจสอบ calls `resetSLLeaveStatus`; the select snaps back to the stored status until the modal is confirmed, so cancelling leaves nothing changed, and approved↔rejected can be switched directly. Pending rows sort to the top with a left accent stripe, and a "ดู" column (pinned to the right edge, `.sl-sticky-view`) opens the full request + attachment in the shared `#drawer-detail` (`viewSLRequestDetails`).
  2. **ประวัติการลา** — a searchable, class-filterable student-name list (no dropdown); clicking a student opens their quota cards + full history timeline in the same `#drawer-detail` (`openSLProfileDrawer`), and history entries there drill further into `viewSLRequestDetails`.
  A day on the calendar (or a pill) opens `#drawer-day-leaves` listing that day's requests with inline approve/reject. All of these — the calendar, its day-drawer, the request table, and the profile drawer — share one refresh path (`refreshSLCalendarIfVisible()` + the generic `detailDrawerRefresh` callback) so a status change made from any of them updates all the others.
- `view-ticket-calendar` — "ปฏิทินภาพรวมบัตรขออนุญาต" (sidebar item sits just above "ประวัติการขออนุญาต"): the same calendar-on-top layout as `view-approve`, but for single-day permission tickets (`HISTORY`, matched by exact date rather than a date range) — legend/pill colors reuse the existing `typeBadgeClass` categories (`class-in`/`class-out`/`school-out`/`late-permit`/`parent-pick`/`duty-delegate`). Below the calendar: one KPI card (ticket-pending count) and the ticket approval table, upgraded the same way as the student leave table (search + type filter; status is the first column as the same colored dropdown — `ticketStatusSelectHTML` / `onTicketStatusSelect`, sharing `SL_STATUS_OPTIONS` and `.sl-status-select` — calling `approveTicket`/`rejectTicket`/`resetTicketStatus`, with no separate action column; pending rows sort first; a "ดู" column into `#drawer-detail` via `viewTicketRequestDetails` and a "ประวัติ" column). A calendar day opens `#drawer-day-tickets`. This view has its own sidebar badge (`sidebar-ticket-badge`) separate from the leave-only `sidebar-approve-badge`.

**บัตรขออนุญาตนักเรียน (Permission tickets)** (sidebar group was "รายงาน & บัตรอนุญาต")
- `view-leave-card` — Record a permission ticket: 2 KPI cards (tickets recorded today, pending print) + a 3-step horizontal wizard (search/select student → choose permission type → fill details), producing a printable ticket preview (`.ticket-preview`).
- `view-history` — Permission history, in 3 tabs: **รายการทั้งหมด** (all records table: code, name, class, type, date, time range, reason, status, with Excel export and month/type filters), **ประวัติรายบุคคล** (per-student search + cumulative history/timeline panel), **สรุปรวมตามชั้นเรียน** (summary table aggregated by class: entered class / left class / left campus / other / parent pickup / total, with a 6-column stats grid).
- `view-employees` — **No longer in the sidebar** (merged into `app.html`'s `view-directory` as the single staff directory menu; the view's code is still here and not yet ported). Staff directory (compact/full toggle, filter chips by employment type: municipal teacher, contract teacher, teaching assistant, administrator, general staff), Excel export.

`#drawer-detail` is a single generic right-side drawer reused for three different things (a leave request's details, a ticket's details, or a person's quota+history profile) — whichever function last populated `#drawer-detail-title`/`#drawer-detail-body` "owns" it, and `detailDrawerRefresh` (a closure set by that function) is what the approve/reject/reset handlers call to keep it live-updated.

**การลาเรียนของนักเรียน (Student leave)**
- ~~`view-student-leave-settings`~~ — **ย้ายไป `../settings/leave.html#tab=student` แล้ว (2026-09-29) ไม่มี view นี้ใน `leave-features.html` อีก** (ลบ modal ประเภทการลา + modal บันทึกด้วย) เนื้อหาเดิม — Student leave settings wizard (Journey Steps, 5 steps), 2-column form+live-preview:
  1. **ปีการศึกษา** — academic year + term 1/2 start-end dates.
  2. **ประเภทการลา** — CRUD table of leave types (name, description, color badge, requires-medical-certificate toggle), with add/edit modal.
  3. **ผู้ตรวจสอบ/อนุมัติ** — minimum approver count, approver role checkboxes (homeroom teacher/advisor auto-resolved from classroom data; level head/student affairs manually selectable), sequential-approval toggle.
  4. **โควตาวันลา** — per-leave-type annual quota, "unlimited" toggle, optional monthly cap.
  5. **เงื่อนไขเพิ่มเติม** — require medical certificate after N sick days, auto-notify parents (LINE/SMS), same-day submission cut-off time, quota-warning threshold. (There is deliberately **no** "allow students to self-submit" toggle — students never submit leave themselves; a homeroom teacher/officer files it via `view-sl-submit`.)

Both pages share `app.css`. Both link back to each other (`leave-features.html`'s logo links to `app.html`). Dark mode has been removed entirely — `body` always carries `class="light-mode"` and there is no theme toggle anywhere in this folder.

## 4. Design patterns observed

- **Sidebar SPA navigation**: fixed left sidebar grouped by `menu-label` sections and dividers; `data-module`/`data-view` (or `data-view` only) attributes drive JS-based view switching (`.module-view`/`.view-section` show/hide, no page reloads).
- **Journey Steps wizard**: a reusable horizontal numbered-step pattern (`.journey-steps` / `.journey-step` / `.step-node` / `.step-label`) used for every multi-step settings/entry flow (staff leave settings, student leave settings, permission ticket entry).
- **Two-column settings step**: `.settings-step-grid` = form column (`.settings-form-col`) on the left + a live preview panel (`.step-preview-panel`) on the right that updates in real time as the form changes (`updateSettingPreview()`, `updatePreviewStep1()`, etc.).
- **Glass-morphism cards**: `.glass-card`, `.glass-input`, `.glass-select` — translucent, blurred, rounded surfaces (`--glass-blur`, `--br-md`/`--br-lg` radii) over a dark (or light) app background.
- **CSS custom-property theming**: a single token set (`--bg-*`, `--text-*`, `--primary`, `--success/warning/danger/info` + `-bg`/`-glow` variants) defined once on `:root` — light-only, hardcoded colors rather than a runtime-switchable design system. Dark mode existed here previously (a `.light-mode` override class toggled by a `theme-toggle-btn`) and was fully removed; don't reintroduce it without the user asking.
- **Stat/KPI cards**: `.stat-card` with icon badge, big value, and a trend line (`.stat-change.up/.down/.neutral`) — used on every dashboard-like view.
- **Data tables**: consistent `.data-table` / `.premium-table` styling, paired with a `.toolbar` (search box + filter selects/chips) above and often an Excel export button.
- **Chips & tabs**: pill-shaped filter chips (`.chip.active`) and top-level tab bars (`.tabs`/`.tab-btn`) for switching sub-views without leaving the page.
- **Drawers & modals**: right-side sliding drawer (`.drawer-panel`) for record detail (e.g. employee detail with accordions), plus centered modals (`.modal`, opened/closed via `App.openModal/closeModal`) for CRUD forms and confirmations.
- **Accordion sections**: collapsible `.accordion-section` blocks for dense detail views (e.g. employee profile fields).
- **Badges everywhere**: status (`badge-pending`/`badge-approved`), permission-type badges (`type-badge.class-in/class-out/school-out/...`), and leave-type color badges, all built on the same pill shape.
- **Bilingual/localized content**: UI is Thai-first (Sarabun font paired with Outfit for headings); dates use Thai Buddhist-era years (e.g. พ.ศ. 2569).
- **Icon system**: `app.html` inlines per-icon SVGs; `leave-features.html` instead defines a single `<svg><symbol>` sprite reused via `<use href="#i-...">`, so the two files use different (inconsistent) icon strategies.

## 5. Proposed component structure

If this prototype were rebuilt as componentized code (e.g. React/Vue), a natural decomposition:

```
components/
  layout/
    AppShell            (sidebar + top header + theme toggle, shared by both pages)
    Sidebar / SidebarMenuGroup / SidebarMenuItem
    TopHeader (title, breadcrumb, header actions slot)
    RoleSwitcher        (mock role selector, leave module only)
  shared/
    GlassCard, GlassInput, GlassSelect
    StatCard / StatsGrid
    DataTable (+ Toolbar: SearchBox, FilterSelect, FilterChips)
    Badge / StatusBadge / TypeBadge
    Modal, ConfirmDialog, Drawer
    AccordionSection
    Tabs / TabPanel
    JourneyWizard          (JourneySteps nav + StepPane + step routing)
      SettingsStepGrid     (FormColumn + LivePreviewPanel pairing used inside each step)
    ToastNotification
  personnel/
    DashboardView (StatsGrid + RecentActivityList + QuickActions)
    StaffDirectory (DataTable + search/filter)
    BasicInfoForm, EducationForm, JobLicenseForm
    ImportHub (FileDropzone + xlsx parsing)
    PrintStudio (ProfileSelect + PrintPreview/QR)
  leave-staff/
    LeaveSettingsWizard (6 steps: cutoff date, approvers, quotas, conditions, advance notice, notifications)
    LeaveRequestForm (+ MyRequestsTable)
    LeaveApprovalQueue (PendingTable + QuotaSummary)
  leave-student/
    LeaveSettingsWizard (5 steps: academic year, leave types CRUD, approver roles, quotas, extra conditions)
    LeaveTypeModal (add/edit CRUD form)
    ApproverRoleCard (checkbox card w/ auto-resolved badge)
  tickets/
    TicketWizard (student search → type select → detail form → TicketPreview)
    TicketPreview (printable card layout)
    HistoryTabs (AllHistoryTable, PersonalHistoryPanel [StudentList + ProfileTimeline], ClassSummaryTable)
    EmployeeDirectory (compact/full toggle variant)
  settings/   (ย้ายไป ../settings/school.html และ personnel.html แล้ว — เหลือเป็นแผนภาพเดิมเพื่ออ้างอิง)
    GeneralSettingsForm (school info + academic year)
    ScheduleSettingsForm (+ ShiftModal, HolidayModal, HolidayTable)
    PermissionsTable (+ UserRoleModal)
    SignatoriesList (+ SignatoryModal)

state/
  navigation store (active module/view, mirrors data-module/data-view)
```

## Notes for future work

- `app.html` itself contains almost no page-specific logic — it only loads `app.js` (shell: nav/theme/modals/toasts) plus `index.js`, `personnel.js`, and `settings.js`, which hold the real dashboard/leave/personnel behavior. `settings.js` is now a **data layer only** (`INITIAL_*`, `settingsState`, `initSettingsDatabase`, `saveStateToLocalStorage`, toast/modal wrappers; ~340 lines) — the settings UI moved to `../settings/` (see `CHANGES-FOR-CARE.md` item 18); its seeds are duplicated in `../settings/js/sd-settings-store.js` and must stay identical. Those three files were **not** in scope for this inspection; read them before modifying anything beyond markup/CSS in `app.html`.
- `leave-features.html` is markup only: its CSS is `leave-features.css` and its wizard/table/CRUD logic is `leave-features.js` (split out 1:1 from the former inline `<style>`/`<script>` on 2026-09-29 — see `CHANGES-FOR-CARE.md`; it is still a classic script, so inline `onclick="fn()"` handlers keep working) (functions like `goSettingStep`, `renderLeaveTypesTable`, `renderStudentList`, `exportExcel`, etc.).
- `implementation_plan.md` documents the (already-implemented) design for the student leave settings wizard in `leave-features.html`, including three open questions from the original design discussion (default leave types, source of homeroom/advisor teacher data, whether the academic-year step belongs here vs. a central setting) — check whether those were resolved before extending that feature.
- `app.html` and `leave-features.html` use two different icon strategies (inline SVG vs. sprite `<symbol>`) — pick one convention if unifying the codebase.
- Staff types/positions (`settingsState.staffTypes` / `.positions` in `settings.js`) are read cross-file by `index.js` (leave quota overrides) and `personnel.js` (job-license form selects). This works because all four `<script>` tags execute top-to-bottom before `DOMContentLoaded` fires, and every cross-file reference lives inside a function body (called later, on user interaction) rather than at top level — see `personnelListSafe()`/`activeStaffTypesSafe()`-style guards used throughout. Keep that pattern (function-scoped access, never top-level) if you add more cross-file state.
- Like every other seed-data array in this prototype, `INITIAL_STAFF_TYPES`/`INITIAL_POSITIONS`/`INITIAL_TEACHERS` only take effect for a *fresh* `localStorage` (the `if (!localStorage.getItem(...))` seeding guard is one-shot). Personnel records created before this feature existed won't retroactively gain `job.staffTypeId`/`job.positionId` — there's no migration step, matching how this codebase already handles every other seed-data change.
