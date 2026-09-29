/* =====================================================================
 * SdSettings — ที่อ่าน/เขียนค่าตั้งค่า `sd_*` ของ care (schooldark) ร่วมกัน
 * ใช้โดย settings/school.html และ settings/personnel.html
 * คีย์ localStorage เป็นคีย์เดียวกับ schooldark/app.html ทุกตัว (ห้ามเปลี่ยนชื่อคีย์/รูปแบบการเก็บ)
 *
 * ค่าเริ่มต้น (seed) ด้านล่างต้องเหมือน schooldark/settings.js `initSettingsDatabase()` และ
 * schooldark/leave-features.js (ATT_DEFAULT_SETTINGS) ทุกตัวอักษร — ถ้าฝั่ง care แก้ seed ต้องมาแก้ที่นี่ด้วย
 *
 * เพิ่ม (หมวดการลา): leaveSettings() = คีย์ `schooldark_settings` (seed ต้องเหมือน schooldark/index.js INITIAL_SETTINGS),
 * studentLeaveVersions() = `sd_student_leave_versions` (seed ต้องเหมือน SETTINGS_VERSIONS/STUDENT_LEAVE_TYPES ใน schooldark/leave-features.js),
 * studentLeaveForm() = `sd_student_leave_form` (ค่าเริ่มต้นของช่อง sett-* ใน leave-features.html) — ถ้าฝั่ง care แก้ seed ต้องแก้ที่นี่ด้วย
 *
 * รูปแบบการเก็บ: 'raw' = setItem(key, string) / 'num' = setItem(key, number) (เก็บเป็นสตริง, get() คืน Number)
 *               'json' = setItem(key, JSON.stringify(value))
 * classic script (ไม่ใช้ module) — ทำงานบน file:///
 * ===================================================================== */
(function () {
  'use strict';

  // ---------- seed data (คัดลอกจาก schooldark/settings.js) ----------
  // Initial Shifts Seed Data
  const INITIAL_SHIFTS = [
      { id: "S001", name: "กะเวรรถโรงเรียน", start: "06:30", end: "15:30" },
      { id: "S002", name: "กะเวรกลางคืน", start: "18:00", end: "06:00" },
      { id: "S003", name: "กะกิจกรรมพิเศษ", start: "08:30", end: "17:30" }
  ];
  
  // Initial Holidays Seed Data
  const INITIAL_HOLIDAYS = [
      { date: "2026-01-01", name: "วันขึ้นปีใหม่", type: "national" },
      { date: "2026-04-13", name: "วันสงกรานต์", type: "national" },
      { date: "2026-04-14", name: "วันสงกรานต์", type: "national" },
      { date: "2026-04-15", name: "วันสงกรานต์", type: "national" },
      { date: "2026-05-01", name: "วันแรงงานแห่งชาติ", type: "national" },
      { date: "2026-06-03", name: "วันเฉลิมฯ สมเด็จพระนางเจ้าฯ พระบรมราชินี", type: "national" },
      { date: "2026-07-28", name: "วันเฉลิมฯ พระบาทสมเด็จพระเจ้าอยู่หัว ร.10", type: "national" },
      { date: "2026-08-12", name: "วันเฉลิมฯ สมเด็จพระบรมราชชนนีพันปีหลวง / วันแม่แห่งชาติ", type: "national" },
      { date: "2026-10-13", name: "วันคล้ายวันสวรรคต ร.9", type: "national" },
      { date: "2026-12-05", name: "วันคล้ายวันพระบรมราชสมภพ ร.9 / วันพ่อแห่งชาติ", type: "national" },
      { date: "2026-12-31", name: "วันสิ้นปี", type: "national" }
  ];
  
  // Initial User Roles Seed Data
  const INITIAL_USER_ROLES = [
      { id: "U001", name: "ดร.วิชัย เรียนดี", position: "ผู้อำนวยการโรงเรียน", role: "ผู้อำนวยการ", status: "active" },
      { id: "U002", name: "นางสุดา สอนดี", position: "รองผู้อำนวยการฝ่ายวิชาการ", role: "รองผู้อำนวยการ", status: "active" },
      { id: "U003", name: "นางสาวสมศรี ใจกว้าง", position: "หัวหน้าฝ่ายบุคลากร (HR)", role: "ผู้ดูแลระบบ", status: "active" },
      { id: "U004", name: "นายสมชาย ใจดี", position: "ครูประจำชั้น ม.1/1", role: "ครู", status: "active" },
      { id: "U005", name: "นางสาวดวงใจ งามจริง", position: "ครูวิชาวิทยาศาสตร์ ม.3", role: "ครู", status: "active" },
      { id: "U006", name: "นายพิชิต ชัยชนะ", position: "ครูวิชาพละศึกษา", role: "ครู", status: "active" },
      { id: "U007", name: "นางสาวรุ่งทิพย์ ส่องแสง", position: "ครูวิชาภาษาไทย ม.2", role: "ครู", status: "inactive" }
  ];
  
  // Initial Signatory Seed Data
  const INITIAL_SIGNATORIES = [
      { id: "SIG001", prefix: "ดร.", name: "วิชัย เรียนดี", position: "ผู้อำนวยการโรงเรียนตัวอย่าง", order: 1, docTypes: ["ใบลา", "หนังสือรับรอง", "เอกสารทั่วไป", "ใบผ่านงาน"] },
      { id: "SIG002", prefix: "นาง", name: "สุดา สอนดี", position: "รองผู้อำนวยการโรงเรียนตัวอย่าง", order: 2, docTypes: ["ใบลา", "เอกสารทั่วไป"] },
      { id: "SIG003", prefix: "นางสาว", name: "สมศรี ใจกว้าง", position: "หัวหน้าฝ่ายบุคคล", order: 3, docTypes: ["หนังสือรับรอง", "ใบผ่านงาน"] }
  ];
  
  // Initial Document Signatory Seed Data
  const INITIAL_DOC_SIGNATORIES = [
      { docType: "ใบอนุมัติการลา", signatoryId: "SIG001" },
      { docType: "หนังสือรับรองการเป็นบุคลากร", signatoryId: "SIG001" },
      { docType: "หนังสือรับรองเงินเดือน", signatoryId: "SIG003" },
      { docType: "หนังสือขอความอนุเคราะห์", signatoryId: "SIG002" }
  ];
  
  // Initial Staff Type Seed Data (ประเภทบุคลากร)
  // ใช้เป็นทั้งตัวจัดกลุ่มตำแหน่ง (positions.typeIds) และคีย์อ้างอิงโควตาวันลาแยกตามประเภท
  // (settings.staffTypeQuotaOverrides ใน index.js — ดู INITIAL_SETTINGS ที่นั่น)
  const INITIAL_STAFF_TYPES = [
      { id: "ST01", name: "ข้าราชการครู / ครูเทศบาล", code: "GOV", desc: "บรรจุประจำ สังกัดราชการหรือเทศบาล", color: "primary", active: true, order: 1 },
      { id: "ST02", name: "ครูอัตราจ้าง", code: "HIRE", desc: "จ้างเป็นรายปีหรือรายเดือน ไม่ใช่ข้าราชการ", color: "warning", active: true, order: 2 },
      { id: "ST03", name: "ผู้บริหารสถานศึกษา", code: "MGT", desc: "ผู้อำนวยการ / รองผู้อำนวยการ", color: "success", active: true, order: 3 },
      { id: "ST04", name: "เจ้าหน้าที่ทั่วไป", code: "STAFF", desc: "เจ้าหน้าที่ธุรการ การเงิน พัสดุ และสนับสนุนอื่นๆ", color: "info", active: true, order: 4 }
  ];
  
  // Initial Position Seed Data (ตำแหน่ง) — ผูกกับประเภทบุคลากรผ่าน typeIds (เลือกได้หลายประเภท)
  const INITIAL_POSITIONS = [
      { id: "POS01", name: "ครูผู้ช่วย", code: "T0", typeIds: ["ST01"], active: true, order: 1 },
      { id: "POS02", name: "ครู (คศ.1)", code: "T1", typeIds: ["ST01"], active: true, order: 2 },
      { id: "POS03", name: "ครูชำนาญการ (คศ.2)", code: "T2", typeIds: ["ST01"], active: true, order: 3 },
      { id: "POS04", name: "ครูชำนาญการพิเศษ (คศ.3)", code: "T3", typeIds: ["ST01"], active: true, order: 4 },
      { id: "POS05", name: "ครูเชี่ยวชาญ (คศ.4)", code: "T4", typeIds: ["ST01"], active: true, order: 5 },
      { id: "POS06", name: "อาจารย์อัตราจ้าง", code: "THIRE", typeIds: ["ST02"], active: true, order: 6 },
      { id: "POS07", name: "ผู้อำนวยการ", code: "DIR", typeIds: ["ST03"], active: true, order: 7 },
      { id: "POS08", name: "รองผู้อำนวยการ", code: "VDIR", typeIds: ["ST03"], active: true, order: 8 },
      { id: "POS09", name: "เจ้าหน้าที่ธุรการ", code: "ADM", typeIds: ["ST04"], active: true, order: 9 }
  ];
  
  // Initial Department / Learning Area Seed Data (แผนก / กลุ่มสาระการเรียนรู้)
  // เป็นรายการแบนธรรมดา ไม่ผูกกับประเภทบุคลากรหรือตำแหน่ง (ต่างจาก positions.typeIds) —
  // ใช้แค่กรอง/แสดงผลในฟอร์มข้อมูลตำแหน่งงานของบุคลากรเท่านั้น (job.departmentId)
  // headTeacherId อ้างอิงถึง id ของบุคลากรใน personnel.js (เช่น "T-001") — ไม่บังคับ เว้นว่างได้ (null)
  const INITIAL_DEPARTMENTS = [
      { id: "DEP01", name: "ภาษาไทย", code: "TH", desc: "", color: "danger", active: true, order: 1, headTeacherId: "T-003" },
      { id: "DEP02", name: "คณิตศาสตร์", code: "MATH", desc: "", color: "primary", active: true, order: 2, headTeacherId: "T-002" },
      { id: "DEP03", name: "วิทยาศาสตร์และเทคโนโลยี", code: "SCI", desc: "", color: "success", active: true, order: 3, headTeacherId: "T-001" },
      { id: "DEP04", name: "สังคมศึกษา ศาสนา และวัฒนธรรม", code: "SOC", desc: "", color: "warning", active: true, order: 4, headTeacherId: "T-004" },
      { id: "DEP05", name: "ภาษาต่างประเทศ", code: "LANG", desc: "", color: "info", active: true, order: 5, headTeacherId: "T-005" },
      { id: "DEP06", name: "สุขศึกษาและพลศึกษา", code: "PE", desc: "", color: "danger", active: true, order: 6, headTeacherId: null },
      { id: "DEP07", name: "ศิลปะ / ดนตรี", code: "ART", desc: "", color: "warning", active: true, order: 7, headTeacherId: null },
      { id: "DEP08", name: "การงานอาชีพ", code: "CAR", desc: "", color: "success", active: true, order: 8, headTeacherId: null }
  ];
  
  // Initial Homeroom Teacher Seed Data (ครูประจำชั้น — แยกตามปีการศึกษา)
  // โครง: { "<ปีการศึกษา>": { "<ห้อง>": [ { teacherId, role } ] } }
  // role: "homeroom" = ครูประจำชั้น, "advisor" = ครูที่ปรึกษา / ร่วมประจำชั้น
  // มีเฉพาะปี 2567 (ปีที่แล้ว) เป็นต้นทาง — ปีปัจจุบันจะถูก ensureHomeroomYearSeeded()
  // เติมให้อัตโนมัติเมื่อเปิดหน้าครั้งแรก แล้วผู้ใช้ค่อยแก้เฉพาะห้องที่เปลี่ยนและกดบันทึก
  // (ห้ามใส่ key ของปีปัจจุบันไว้ที่นี่ ไม่งั้นจะถือว่า "ตั้งค่าแล้ว" และไม่เติมอัตโนมัติ)
  const INITIAL_HOMEROOM = {
      "2567": {
          "ม.1/1": [{ teacherId: "T-001", role: "homeroom" }, { teacherId: "T-004", role: "advisor" }],
          "ม.1/2": [{ teacherId: "T-002", role: "homeroom" }],
          "ม.2/3": [{ teacherId: "T-004", role: "homeroom" }],
          "ม.3/1": [{ teacherId: "T-003", role: "homeroom" }, { teacherId: "T-005", role: "advisor" }],
          "ม.4/2": [{ teacherId: "T-005", role: "homeroom" }],
          "ม.5/1": [{ teacherId: "T-002", role: "homeroom" }, { teacherId: "T-001", role: "advisor" }]
      }
  };

  // ---------- หมวดการลา ----------
  // เหมือน schooldark/index.js INITIAL_SETTINGS ทุกตัวอักษร
  var LEAVE_SETTINGS_KEY = 'schooldark_settings';
  var INITIAL_LEAVE_SETTINGS = {
      cutoffDate: "2026-12-31",
      quotaSick: 30,
      quotaVacation: 10,
      quotaMaternity: 90,
      ruleHalfDay: true,
      ruleSickDoc: true,
      ruleAdvanceDays: 3,
      ruleRollover: true,
      ruleRolloverMax: 5,
      alertLate1: 3,
      alertLate2: 7,
      alertVisa: 30,
      alertWorkpermit: 30,
      alertLicense: 60,
      recipients: ["หัวหน้าครูสมศรี", "ผอ.วิชัย"],
      approvers: ["ครูวิชัย เรียนดี", "ครูสุดา สอนดี"],
      staffTypeQuotaOverrides: {}
  };

  // เหมือน schooldark/leave-features.js STUDENT_LEAVE_TYPES / SETTINGS_VERSIONS
  var STUDENT_LEAVE_VERSIONS_KEY = 'sd_student_leave_versions';
  var INITIAL_STUDENT_LEAVE_TYPES = [
    { name: 'ลาป่วย', desc: 'ลาหยุดเนื่องจากเจ็บป่วย ไข้หวัด อุบัติเหตุ', color: 'danger', quota: 15 },
    { name: 'ลากิจ', desc: 'ลาหยุดเพื่อทำธุระส่วนตัว หรือธุระจำเป็นของครอบครัว', color: 'warning', quota: 10 },
    { name: 'ลาอื่น ๆ', desc: 'ลาหยุดเนื่องจากกรณีพิเศษอื่น ๆ ที่จำเป็น', color: 'primary', quota: 5 }
  ];
  var INITIAL_STUDENT_LEAVE_VERSIONS = [
    {
      id: 'CFG-0001',
      effectiveDate: '2024-05-16',
      savedDate: '2024-05-10',
      savedBy: 'สมปอง ทองดี',
      note: 'ตั้งค่าประเภทการลาและโควตาเริ่มต้นของปีการศึกษา 2567',
      status: 'past',
      leaveTypes: [
        { name: 'ลาป่วย', desc: 'ลาหยุดเนื่องจากเจ็บป่วย ไข้หวัด อุบัติเหตุ', color: 'danger', quota: 10 },
        { name: 'ลากิจ', desc: 'ลาหยุดเพื่อทำธุระส่วนตัว หรือธุระจำเป็นของครอบครัว', color: 'warning', quota: 8 }
      ]
    },
    {
      id: 'CFG-0002',
      effectiveDate: '2025-05-16',
      savedDate: '2025-05-05',
      savedBy: 'สมปอง ทองดี',
      note: 'เพิ่มประเภท "ลาอื่น ๆ" และปรับเพิ่มโควตาลาป่วย/ลากิจ',
      status: 'active',
      leaveTypes: INITIAL_STUDENT_LEAVE_TYPES
    }
  ];

  // ค่าเริ่มต้นของช่อง sett-* ใน leave-features.html (#view-student-leave-settings)
  var STUDENT_LEAVE_FORM_KEY = 'sd_student_leave_form';
  var INITIAL_STUDENT_LEAVE_FORM = {
    acadYear: '2569',               // sett-acad-year (select, selected 2569)
    term1Start: '2026-05-16',       // sett-term1-start
    term1End: '2026-10-10',         // sett-term1-end
    term2Start: '2026-11-01',       // sett-term2-start
    term2End: '2027-03-31',         // sett-term2-end
    approverCount: 2,               // sett-approver-count
    roleTeacher1: true,             // sett-role-teacher-1 (checked)
    roleTeacher2: true,             // sett-role-teacher-2 (checked)
    roleHead: false,                // sett-role-head
    roleDean: false,                // sett-role-dean
    approverSequence: true,         // sett-approver-sequence (checked)
    sickDocRequired: true,          // sett-sick-doc-required (checked)
    sickDocDays: 3,                 // sett-sick-doc-days
    alertParent: true,              // sett-alert-parent (checked)
    deadlineTime: '08:30',          // sett-deadline-time
    quotaWarningPercent: 80         // sett-quota-warning-percent
  };

  // ---------- คีย์ + รูปแบบ + ค่าเริ่มต้น ----------
  var SPEC = {
    sd_school_name_th:      { fmt: 'raw',  def: "โรงเรียนตัวอย่าง" },
    sd_school_name_en:      { fmt: 'raw',  def: "Example School" },
    sd_school_code:         { fmt: 'raw',  def: "1012345" },
    sd_school_phone:        { fmt: 'raw',  def: "02-XXX-XXXX" },
    sd_school_address:      { fmt: 'raw',  def: "123 ถ.ตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพมหานคร 10000" },
    sd_acad_year:           { fmt: 'raw',  def: "2568" },
    sd_acad_start:          { fmt: 'raw',  def: "2025-05-16" },
    sd_acad_end:            { fmt: 'raw',  def: "2026-03-31" },
    sd_work_start:          { fmt: 'raw',  def: "07:30" },
    sd_work_end:            { fmt: 'raw',  def: "16:30" },
    sd_lunch_start:         { fmt: 'raw',  def: "12:00" },
    sd_lunch_end:           { fmt: 'raw',  def: "13:00" },
    sd_late_threshold:      { fmt: 'num',  def: 15 },
    sd_early_out_threshold: { fmt: 'num',  def: 15 },
    sd_ot_start:            { fmt: 'raw',  def: "17:00" },
    sd_workdays:            { fmt: 'json', def: ["mon", "tue", "wed", "thu", "fri"] },
    sd_shifts:              { fmt: 'json', def: INITIAL_SHIFTS },
    sd_holidays:            { fmt: 'json', def: INITIAL_HOLIDAYS },
    sd_users:               { fmt: 'json', def: INITIAL_USER_ROLES },
    sd_signatories:         { fmt: 'json', def: INITIAL_SIGNATORIES },
    sd_doc_signatories:     { fmt: 'json', def: INITIAL_DOC_SIGNATORIES },
    sd_homeroom_v2:         { fmt: 'json', def: INITIAL_HOMEROOM },
    sd_staff_types:         { fmt: 'json', def: INITIAL_STAFF_TYPES },
    sd_positions:           { fmt: 'json', def: INITIAL_POSITIONS },
    sd_departments:         { fmt: 'json', def: INITIAL_DEPARTMENTS }
  };

  // attendance — จาก schooldark/leave-features.js (ATT_SETTINGS_KEY / ATT_DEFAULT_SETTINGS)
  var ATT_SETTINGS_KEY = 'sd_student_attendance_settings';
  var ATT_DEFAULT_SETTINGS = { start: '08:00', end: '16:30', absentAfter: '10:00', gateOpen: '06:30', lateMin: 0, earlyMin: 0, days: [1, 2, 3, 4, 5] };

  var KEYS = {};
  Object.keys(SPEC).forEach(function (k) { KEYS[k] = k; });
  KEYS.sd_student_attendance_settings = ATT_SETTINGS_KEY;
  KEYS.schooldark_settings = LEAVE_SETTINGS_KEY;
  KEYS.sd_student_leave_versions = STUDENT_LEAVE_VERSIONS_KEY;
  KEYS.sd_student_leave_form = STUDENT_LEAVE_FORM_KEY;

  function clone(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }
  function ls() { try { return window.localStorage; } catch (e) { return null; } }

  function write(spec, key, value) {
    var s = ls(); if (!s) return;
    try { s.setItem(key, spec.fmt === 'json' ? JSON.stringify(value) : String(value)); } catch (e) {}
  }

  function migrate(key, val) {
    if (key === 'sd_doc_signatories' && Array.isArray(val)) {   // migrate เหมือน settings.js (ใช้ทั้งค่า seed และค่าที่เก็บไว้)
      val.forEach(function (item) {
        if (!item.signatoryIds) item.signatoryIds = item.signatoryId ? [item.signatoryId] : [];
      });
    }
    return val;
  }

  function get(key) {
    var spec = SPEC[key];
    if (!spec) throw new Error('SdSettings.get: unknown key ' + key);
    var s = ls(), raw = null;
    try { raw = s ? s.getItem(key) : null; } catch (e) {}
    if (raw === null || raw === '') {           // เหมือน settings.js: ค่าว่าง/ไม่มี => seed
      var def = migrate(key, clone(spec.def));
      write(spec, key, def);
      return def;
    }
    if (spec.fmt === 'json') {
      var val;
      try { val = JSON.parse(raw); }
      catch (e) { val = clone(spec.def); write(spec, key, val); }
      return migrate(key, val);
    }
    if (spec.fmt === 'num') { var n = parseInt(raw, 10); return isNaN(n) ? spec.def : n; }
    return raw;
  }

  function set(key, value) {
    var spec = SPEC[key];
    if (!spec) throw new Error('SdSettings.set: unknown key ' + key);
    write(spec, key, spec.fmt === 'json' ? clone(value) : value);
  }

  function teachers() {
    try {
      var v = JSON.parse(window.localStorage.getItem('schooldark_personnel_teachers'));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }

  // เหมือน leave-features.js: attLoad(...) || {...defaults} (เพิ่ม merge กับ default กันฟิลด์หาย)
  function attendance() {
    var saved = null;
    try { var r = window.localStorage.getItem(ATT_SETTINGS_KEY); saved = r ? JSON.parse(r) : null; } catch (e) {}
    var out = Object.assign({}, ATT_DEFAULT_SETTINGS, saved && typeof saved === 'object' ? saved : {});
    out.days = Array.isArray(out.days) ? out.days.slice() : ATT_DEFAULT_SETTINGS.days.slice();
    return out;
  }

  function saveAttendance(obj) {
    try { window.localStorage.setItem(ATT_SETTINGS_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  // อ่าน JSON จากคีย์; ไม่มี/เสีย => เขียน seed แล้วคืน (สำเนาลึกเสมอ)
  function readJson(key, seed, validate) {
    var raw = null;
    try { raw = window.localStorage.getItem(key); } catch (e) {}
    if (raw !== null && raw !== '') {
      try { var v = JSON.parse(raw); if (validate(v)) return v; } catch (e) {}
    }
    var def = clone(seed);
    try { window.localStorage.setItem(key, JSON.stringify(def)); } catch (e) {}
    return clone(def);
  }
  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(clone(value))); } catch (e) {}
  }
  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }

  // เหมือน index.js initializeDatabase: {...seed, ...saved}
  function leaveSettings() {
    var saved = readJson(LEAVE_SETTINGS_KEY, INITIAL_LEAVE_SETTINGS, isObj);
    return clone(Object.assign({}, clone(INITIAL_LEAVE_SETTINGS), saved));
  }
  function saveLeaveSettings(obj) { writeJson(LEAVE_SETTINGS_KEY, obj); }

  function studentLeaveVersions() {
    return clone(readJson(STUDENT_LEAVE_VERSIONS_KEY, INITIAL_STUDENT_LEAVE_VERSIONS, function (v) { return Array.isArray(v) && v.length > 0; }));
  }
  function saveStudentLeaveVersions(arr) { writeJson(STUDENT_LEAVE_VERSIONS_KEY, arr); }

  function studentLeaveForm() {
    var saved = readJson(STUDENT_LEAVE_FORM_KEY, INITIAL_STUDENT_LEAVE_FORM, isObj);
    return clone(Object.assign({}, clone(INITIAL_STUDENT_LEAVE_FORM), saved));
  }
  function saveStudentLeaveForm(obj) { writeJson(STUDENT_LEAVE_FORM_KEY, obj); }

  window.SdSettings = {
    get: get, set: set, teachers: teachers, attendance: attendance, saveAttendance: saveAttendance,
    leaveSettings: leaveSettings, saveLeaveSettings: saveLeaveSettings,
    studentLeaveVersions: studentLeaveVersions, saveStudentLeaveVersions: saveStudentLeaveVersions,
    studentLeaveForm: studentLeaveForm, saveStudentLeaveForm: saveStudentLeaveForm,
    KEYS: KEYS
  };
})();
