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
| Student | นักเรียน | Implicit subject of permission tickets and leave; may optionally submit their own leave request if enabled in settings |
| Parent/guardian | ผู้ปกครอง | Notified automatically (LINE/SMS) when a student leave is approved, if enabled |

## 3. Pages / screens

### `app.html` — Personnel & Staff Leave module (sidebar-driven SPA shell)

Grouped under three sidebar sections:

**ภาพรวมระบบ (Overview)**
- `view-dashboard-main` — Dashboard: welcome banner, 4 KPI stat cards (total staff, pending leave, expiring documents, approved today), recent leave requests activity feed, quick actions.

**ระบบบริหารการลา (Leave management)**
- `view-leave-settings` — Staff leave settings wizard (Journey Steps, 6 steps): 1) fiscal/work-year cutoff date, 2) approver list management, 3) annual leave quota per leave type (sick/vacation/personal, maternity, etc.) **plus a per-staff-type override table** (`staff-type-quota-tbody`, backed by `systemState.settings.staffTypeQuotaOverrides` in `index.js` — every active staff type from `view-staff-types` gets its own editable quota, seeded from the step's default values via `ensureStaffTypeQuotaSeeded()`/`getStaffQuota()`), 4) leave conditions, 5) advance-notice day count, 6) notification settings.
- `view-leave-form` — Leave request submission form: leave type, start/end date, half-day options, reason, submit-on-behalf-of (ส่งใบลาในนาม), plus a table of the user's own submitted requests (date, type, duration, status).
- `view-leave-approve` / `view-approve` — Calendar overview on top, then two tabs: **รายการคำขอ** (approval queue: teacher name, leave type, dates, attachment link, status; pending rows get approve/reject, resolved rows get an "อนุมัติโดย/ปฏิเสธ" note plus a "เปลี่ยนสถานะ" reset button, and every row has a "ดู" button opening `modal-detail` with the full request + attachment + evidence) and **ประวัติการลารายบุคคล** (a searchable teacher-name list — no more select dropdown — where clicking a teacher opens `modal-teacher-profile` with quota cards + a full history timeline; history items there drill further into `modal-detail`).

**ระบบบุคลากร (Personnel)**
- `view-directory` — Staff directory: searchable/filterable table (photo, staff code, name, position/department, phone, data status).
- `view-basic-info` — Edit basic personnel info: personal details, ID number, DOB, gender, blood type, religion, contact info, registered/current address, spouse & children info.
- `view-education` — Education & training records, honors, TOEIC score, certificate uploads.
- `view-job-license` — Job position & professional license info. The "ข้อมูลตำแหน่งงาน" sub-tab has a **ประเภทบุคลากร** select (`#job-staff-type`, populated from `settingsState.staffTypes`) feeding a **ตำแหน่งปัจจุบัน** select (`#job-position`, populated from `settingsState.positions` filtered to that type via `typeIds`) — changing the staff type re-filters the position list. It also has a **กลุ่มสาระการเรียนรู้** select (`#job-department`, populated from `settingsState.departments`, not filtered by anything). Saved onto the record as `job.staffTypeId` / `job.positionId` / `job.departmentId` (plus `job.position` / `job.department` kept as plain name strings for existing display/print code).
- `view-import-hub` — Bulk import: drag-and-drop Excel (via `xlsx.js`) upload of personnel data and photos.
- `view-print-studio` — Print & QR studio: select a staff profile and print/generate ID/QR documents.

**การตั้งค่าระบบ (System settings)**
- `view-general` — General settings: school name (TH/EN), school code, phone, address, academic year & term dates.
- `view-schedule` — Work schedule settings: work start/end time, lunch break, late threshold (minutes), shift management, holiday list (date, name, type).
- `view-permissions` — User roles & permissions: table of system users (name, position, system role, status), notification thresholds for late arrivals and document expiry.
- `view-signatories` — Document signatories: ordered list of people authorized to sign documents, with document-type assignment per signatory.
- `view-staff-types` — ประเภทบุคลากร (staff types, e.g. ข้าราชการ/ครูอัตราจ้าง/ผู้บริหาร/เจ้าหน้าที่ทั่วไป): add/edit/delete/reorder/enable-disable, mirroring the leave-type CRUD pattern in `leave-features.html`. Backed by `settingsState.staffTypes` (`sd_staff_types` in localStorage). Deleting a type that still has positions or personnel attached is blocked (offers "disable instead" via `App.showConfirm`) — see `countPositionsForStaffType()` / `countPersonnelForStaffType()` in `settings.js`.
- `view-positions` — ตำแหน่ง (job positions): same CRUD pattern, each position binds to one or more staff types (`positions[].typeIds`, checkboxes in the add/edit modal) so `view-job-license`'s position dropdown can be filtered by the selected staff type. Backed by `settingsState.positions` (`sd_positions`). Deletion is blocked the same way if any personnel record still references the position (`countPersonnelForPosition()`).
- `view-departments` — แผนก/กลุ่มสาระการเรียนรู้ (departments / learning areas): same CRUD pattern again, but a flat list with **no binding** to staff types or positions (unlike `view-positions`) — it only feeds `view-job-license`'s "กลุ่มสาระการเรียนรู้" dropdown. Each department also has an optional **หัวหน้าแผนก** (department head, `departments[].headTeacherId`, a plain personnel-id reference — not exclusive, and not required to be a member of that department) picked from a live personnel dropdown (`populateDepartmentHeadSelect()`/`departmentHeadCandidates()`, refreshed every time the add/edit modal opens so newly added staff show up immediately). Backed by `settingsState.departments` (`sd_departments`). Deletion is blocked the same way if any personnel record still references the department (`countPersonnelForDepartment()`) — the head-teacher link needs no such guard since it lives on the department itself and is simply dropped with it.

Several modals overlay these views: leave request detail (`modal-detail`), the individual teacher leave profile (`modal-teacher-profile`, quota cards + history, opened from the searchable name list on the "ประวัติการลารายบุคคล" tab), shift editor, holiday editor, user role editor, signatory editor, and a generic confirm dialog.

### `leave-features.html` — Student permission tickets & reports module

Sidebar sections:

**การอนุมัติ (Approvals)**
- `view-approve` — "อนุมัติการลานักเรียน": a calendar overview of student leave on top (**ปฏิทินภาพรวมการลาของนักเรียน** — month/week/day, same `.calendar-grid`/`.calendar-leave-pill`/`.cal-mode-btn` pattern as `app.html`'s staff calendar, sourced from `STUDENT_LEAVE_REQUESTS`; leave-type colors/legend come from the CRUD-able `STUDENT_LEAVE_TYPES` via `studentLeaveTypeBadgeClass`), one KPI card (pending count), then two tabs:
  1. **รายการคำขอ** — the approval queue table, with a name/ID search box + leave-type filter dropdown alongside the existing status filter chips. The attachment column is a clickable paperclip link (`slAttachmentLinkHTML`, matching the staff table's style); the action column is 3-state like the staff table (pending → approve/reject; resolved → an "อนุมัติโดย/ปฏิเสธ" note plus a "เปลี่ยนสถานะ" reset button via `resetSLLeaveStatus`); and a "ดู" column opens the full request + attachment in the shared `#drawer-detail` (`viewSLRequestDetails`).
  2. **ประวัติการลา** — a searchable, class-filterable student-name list (no dropdown); clicking a student opens their quota cards + full history timeline in the same `#drawer-detail` (`openSLProfileDrawer`), and history entries there drill further into `viewSLRequestDetails`.
  A day on the calendar (or a pill) opens `#drawer-day-leaves` listing that day's requests with inline approve/reject. All of these — the calendar, its day-drawer, the request table, and the profile drawer — share one refresh path (`refreshSLCalendarIfVisible()` + the generic `detailDrawerRefresh` callback) so a status change made from any of them updates all the others.
- `view-ticket-calendar` — "ปฏิทินภาพรวมบัตรขออนุญาต" (sidebar item sits just above "ประวัติการขออนุญาต"): the same calendar-on-top layout as `view-approve`, but for single-day permission tickets (`HISTORY`, matched by exact date rather than a date range) — legend/pill colors reuse the existing `typeBadgeClass` categories (`class-in`/`class-out`/`school-out`/`late-permit`/`parent-pick`/`duty-delegate`). Below the calendar: one KPI card (ticket-pending count) and the ticket approval table, upgraded the same way as the student leave table (search + type filter, 3-state action column with `resetTicketStatus`, and a "ดู" column into `#drawer-detail` via `viewTicketRequestDetails`). A calendar day opens `#drawer-day-tickets`. This view has its own sidebar badge (`sidebar-ticket-badge`) separate from the leave-only `sidebar-approve-badge`.

**รายงาน & บัตรอนุญาต (Reports & permission cards)**
- `view-leave-card` — Record a permission ticket: 2 KPI cards (tickets recorded today, pending print) + a 3-step horizontal wizard (search/select student → choose permission type → fill details), producing a printable ticket preview (`.ticket-preview`).
- `view-history` — Permission history, in 3 tabs: **รายการทั้งหมด** (all records table: code, name, class, type, date, time range, reason, status, with Excel export and month/type filters), **ประวัติรายบุคคล** (per-student search + cumulative history/timeline panel), **สรุปรวมตามชั้นเรียน** (summary table aggregated by class: entered class / left class / left campus / other / parent pickup / total, with a 6-column stats grid).
- `view-employees` — Staff directory (compact/full toggle, filter chips by employment type: municipal teacher, contract teacher, teaching assistant, administrator, general staff), Excel export.

`#drawer-detail` is a single generic right-side drawer reused for three different things (a leave request's details, a ticket's details, or a person's quota+history profile) — whichever function last populated `#drawer-detail-title`/`#drawer-detail-body` "owns" it, and `detailDrawerRefresh` (a closure set by that function) is what the approve/reject/reset handlers call to keep it live-updated.

**การลาเรียนของนักเรียน (Student leave)**
- `view-student-leave-settings` — Student leave settings wizard (Journey Steps, 5 steps), mirroring the staff leave wizard's 2-column form+live-preview layout:
  1. **ปีการศึกษา** — academic year + term 1/2 start-end dates.
  2. **ประเภทการลา** — CRUD table of leave types (name, description, color badge, requires-medical-certificate toggle), with add/edit modal.
  3. **ผู้ตรวจสอบ/อนุมัติ** — minimum approver count, approver role checkboxes (homeroom teacher/advisor auto-resolved from classroom data; level head/student affairs manually selectable), sequential-approval toggle.
  4. **โควตาวันลา** — per-leave-type annual quota, "unlimited" toggle, optional monthly cap.
  5. **เงื่อนไขเพิ่มเติม** — require medical certificate after N sick days, auto-notify parents (LINE/SMS), allow students to self-submit leave, quota-warning threshold.

Both pages share `app.css` and use a light/dark theme toggle, and both link back to each other (`leave-features.html`'s logo links to `app.html`).

## 4. Design patterns observed

- **Sidebar SPA navigation**: fixed left sidebar grouped by `menu-label` sections and dividers; `data-module`/`data-view` (or `data-view` only) attributes drive JS-based view switching (`.module-view`/`.view-section` show/hide, no page reloads).
- **Journey Steps wizard**: a reusable horizontal numbered-step pattern (`.journey-steps` / `.journey-step` / `.step-node` / `.step-label`) used for every multi-step settings/entry flow (staff leave settings, student leave settings, permission ticket entry).
- **Two-column settings step**: `.settings-step-grid` = form column (`.settings-form-col`) on the left + a live preview panel (`.step-preview-panel`) on the right that updates in real time as the form changes (`updateSettingPreview()`, `updatePreviewStep1()`, etc.).
- **Glass-morphism cards**: `.glass-card`, `.glass-input`, `.glass-select` — translucent, blurred, rounded surfaces (`--glass-blur`, `--br-md`/`--br-lg` radii) over a dark (or light) app background.
- **CSS custom-property theming**: a single token set (`--bg-*`, `--text-*`, `--primary`, `--success/warning/danger/info` + `-bg`/`-glow` variants) redefined under `.light-mode`, toggled at runtime by `theme-toggle-btn` — a full light/dark design system rather than hardcoded colors.
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
  settings/
    GeneralSettingsForm (school info + academic year)
    ScheduleSettingsForm (+ ShiftModal, HolidayModal, HolidayTable)
    PermissionsTable (+ UserRoleModal)
    SignatoriesList (+ SignatoryModal)

state/theming/
  ThemeProvider (light/dark tokens, persisted toggle)
  navigation store (active module/view, mirrors data-module/data-view)
```

## Notes for future work

- `app.html` itself contains almost no page-specific logic — it only loads `app.js` (shell: nav/theme/modals/toasts) plus `index.js`, `personnel.js`, and `settings.js`, which hold the real dashboard/leave/personnel/settings behavior. Those three files were **not** in scope for this inspection; read them before modifying anything beyond markup/CSS in `app.html`.
- `leave-features.html` is self-contained: its wizard/table/CRUD logic lives in an inline `<script>` at the bottom of the file (functions like `goSettingStep`, `renderLeaveTypesTable`, `renderStudentList`, `exportExcel`, etc.).
- `implementation_plan.md` documents the (already-implemented) design for the student leave settings wizard in `leave-features.html`, including three open questions from the original design discussion (default leave types, source of homeroom/advisor teacher data, whether the academic-year step belongs here vs. a central setting) — check whether those were resolved before extending that feature.
- `app.html` and `leave-features.html` use two different icon strategies (inline SVG vs. sprite `<symbol>`) — pick one convention if unifying the codebase.
- Staff types/positions (`settingsState.staffTypes` / `.positions` in `settings.js`) are read cross-file by `index.js` (leave quota overrides) and `personnel.js` (job-license form selects). This works because all four `<script>` tags execute top-to-bottom before `DOMContentLoaded` fires, and every cross-file reference lives inside a function body (called later, on user interaction) rather than at top level — see `personnelListSafe()`/`activeStaffTypesSafe()`-style guards used throughout. Keep that pattern (function-scoped access, never top-level) if you add more cross-file state.
- Like every other seed-data array in this prototype, `INITIAL_STAFF_TYPES`/`INITIAL_POSITIONS`/`INITIAL_TEACHERS` only take effect for a *fresh* `localStorage` (the `if (!localStorage.getItem(...))` seeding guard is one-shot). Personnel records created before this feature existed won't retroactively gain `job.staffTypeId`/`job.positionId` — there's no migration step, matching how this codebase already handles every other seed-data change.
