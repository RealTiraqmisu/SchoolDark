// =============================================================
// STATE MANAGEMENT & DATA SEEDING FOR SETTINGS PAGE
// =============================================================

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

// Global State
let settingsState = {
    schoolNameTh: "โรงเรียนตัวอย่าง",
    schoolNameEn: "Example School",
    schoolCode: "1012345",
    schoolPhone: "02-XXX-XXXX",
    schoolAddress: "123 ถ.ตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพมหานคร 10000",
    acadYear: "2568",
    acadStart: "2025-05-16",
    acadEnd: "2026-03-31",
    workStart: "07:30",
    workEnd: "16:30",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    lateThreshold: 15,
    earlyOutThreshold: 15,
    otStart: "17:00",
    workdays: ["mon", "tue", "wed", "thu", "fri"],
    shifts: [],
    holidays: [],
    users: [],
    signatories: [],
    docSignatories: [],
    homeroom: {},
    staffTypes: [],
    positions: [],
    departments: [],
    activeView: "general",
    editingShiftId: null,
    editingSignatoryId: null,
    editingHomeroomClass: null,
    editingStaffTypeId: null,
    editingPositionId: null,
    editingDepartmentId: null
};

// Settings state draft for uncommitted configurations (Task 4)
let settingsStateDraft = {};

// Initialize Settings Database from LocalStorage or seed data
function initSettingsDatabase() {
    // 1. Core School Info
    if (localStorage.getItem("sd_school_name_th")) {
        settingsState.schoolNameTh = localStorage.getItem("sd_school_name_th");
        settingsState.schoolNameEn = localStorage.getItem("sd_school_name_en") || "";
        settingsState.schoolCode = localStorage.getItem("sd_school_code") || "";
        settingsState.schoolPhone = localStorage.getItem("sd_school_phone") || "";
        settingsState.schoolAddress = localStorage.getItem("sd_school_address") || "";
    } else {
        localStorage.setItem("sd_school_name_th", settingsState.schoolNameTh);
        localStorage.setItem("sd_school_name_en", settingsState.schoolNameEn);
        localStorage.setItem("sd_school_code", settingsState.schoolCode);
        localStorage.setItem("sd_school_phone", settingsState.schoolPhone);
        localStorage.setItem("sd_school_address", settingsState.schoolAddress);
    }

    // 2. Academic Info
    if (localStorage.getItem("sd_acad_year")) {
        settingsState.acadYear = localStorage.getItem("sd_acad_year");
        settingsState.acadStart = localStorage.getItem("sd_acad_start") || "";
        settingsState.acadEnd = localStorage.getItem("sd_acad_end") || "";
    } else {
        localStorage.setItem("sd_acad_year", settingsState.acadYear);
        localStorage.setItem("sd_acad_start", settingsState.acadStart);
        localStorage.setItem("sd_acad_end", settingsState.acadEnd);
    }

    // 3. Work Hours Info
    if (localStorage.getItem("sd_work_start")) {
        settingsState.workStart = localStorage.getItem("sd_work_start");
        settingsState.workEnd = localStorage.getItem("sd_work_end");
        settingsState.lunchStart = localStorage.getItem("sd_lunch_start") || "12:00";
        settingsState.lunchEnd = localStorage.getItem("sd_lunch_end") || "13:00";
        settingsState.lateThreshold = parseInt(localStorage.getItem("sd_late_threshold") || 15);
        settingsState.earlyOutThreshold = parseInt(localStorage.getItem("sd_early_out_threshold") || 15);
        settingsState.otStart = localStorage.getItem("sd_ot_start") || "17:00";
        settingsState.workdays = JSON.parse(localStorage.getItem("sd_workdays") || '["mon", "tue", "wed", "thu", "fri"]');
    } else {
        localStorage.setItem("sd_work_start", settingsState.workStart);
        localStorage.setItem("sd_work_end", settingsState.workEnd);
        localStorage.setItem("sd_lunch_start", settingsState.lunchStart);
        localStorage.setItem("sd_lunch_end", settingsState.lunchEnd);
        localStorage.setItem("sd_late_threshold", settingsState.lateThreshold);
        localStorage.setItem("sd_early_out_threshold", settingsState.earlyOutThreshold);
        localStorage.setItem("sd_ot_start", settingsState.otStart);
        localStorage.setItem("sd_workdays", JSON.stringify(settingsState.workdays));
    }

    // 4. Shifts
    if (!localStorage.getItem("sd_shifts")) {
        localStorage.setItem("sd_shifts", JSON.stringify(INITIAL_SHIFTS));
    }
    settingsState.shifts = JSON.parse(localStorage.getItem("sd_shifts"));

    // 5. Holidays
    if (!localStorage.getItem("sd_holidays")) {
        localStorage.setItem("sd_holidays", JSON.stringify(INITIAL_HOLIDAYS));
    }
    settingsState.holidays = JSON.parse(localStorage.getItem("sd_holidays"));

    // 6. Users
    if (!localStorage.getItem("sd_users")) {
        localStorage.setItem("sd_users", JSON.stringify(INITIAL_USER_ROLES));
    }
    settingsState.users = JSON.parse(localStorage.getItem("sd_users"));

    // 7. Signatories
    if (!localStorage.getItem("sd_signatories")) {
        localStorage.setItem("sd_signatories", JSON.stringify(INITIAL_SIGNATORIES));
    }
    settingsState.signatories = JSON.parse(localStorage.getItem("sd_signatories"));

    // 8. Document Signatories
    if (!localStorage.getItem("sd_doc_signatories")) {
        localStorage.setItem("sd_doc_signatories", JSON.stringify(INITIAL_DOC_SIGNATORIES));
    }
    settingsState.docSignatories = JSON.parse(localStorage.getItem("sd_doc_signatories"));
    // Migrate old format to support multiple signatories array
    settingsState.docSignatories.forEach(item => {
        if (!item.signatoryIds) {
            item.signatoryIds = item.signatoryId ? [item.signatoryId] : [];
        }
    });

    // 8. Homeroom teachers (ครูประจำชั้น — เก็บแยกตามปีการศึกษา)
    if (localStorage.getItem("sd_homeroom_v2")) {
        settingsState.homeroom = JSON.parse(localStorage.getItem("sd_homeroom_v2"));
    } else {
        settingsState.homeroom = JSON.parse(JSON.stringify(INITIAL_HOMEROOM));
        localStorage.setItem("sd_homeroom_v2", JSON.stringify(settingsState.homeroom));
    }

    // 9. Staff Types (ประเภทบุคลากร)
    if (!localStorage.getItem("sd_staff_types")) {
        localStorage.setItem("sd_staff_types", JSON.stringify(INITIAL_STAFF_TYPES));
    }
    settingsState.staffTypes = JSON.parse(localStorage.getItem("sd_staff_types"));

    // 10. Positions (ตำแหน่ง) — ผูกกับประเภทบุคลากรผ่าน typeIds
    if (!localStorage.getItem("sd_positions")) {
        localStorage.setItem("sd_positions", JSON.stringify(INITIAL_POSITIONS));
    }
    settingsState.positions = JSON.parse(localStorage.getItem("sd_positions"));

    // 11. Departments / Learning Areas (แผนก / กลุ่มสาระการเรียนรู้)
    if (!localStorage.getItem("sd_departments")) {
        localStorage.setItem("sd_departments", JSON.stringify(INITIAL_DEPARTMENTS));
    }
    settingsState.departments = JSON.parse(localStorage.getItem("sd_departments"));

    // Load initial draft (Task 4)
    settingsStateDraft = JSON.parse(JSON.stringify(settingsState));
}

function saveStateToLocalStorage() {
    localStorage.setItem("sd_school_name_th", settingsState.schoolNameTh);
    localStorage.setItem("sd_school_name_en", settingsState.schoolNameEn);
    localStorage.setItem("sd_school_code", settingsState.schoolCode);
    localStorage.setItem("sd_school_phone", settingsState.schoolPhone);
    localStorage.setItem("sd_school_address", settingsState.schoolAddress);
    localStorage.setItem("sd_acad_year", settingsState.acadYear);
    localStorage.setItem("sd_acad_start", settingsState.acadStart);
    localStorage.setItem("sd_acad_end", settingsState.acadEnd);
    localStorage.setItem("sd_work_start", settingsState.workStart);
    localStorage.setItem("sd_work_end", settingsState.workEnd);
    localStorage.setItem("sd_lunch_start", settingsState.lunchStart);
    localStorage.setItem("sd_lunch_end", settingsState.lunchEnd);
    localStorage.setItem("sd_late_threshold", settingsState.lateThreshold);
    localStorage.setItem("sd_early_out_threshold", settingsState.earlyOutThreshold);
    localStorage.setItem("sd_ot_start", settingsState.otStart);
    localStorage.setItem("sd_workdays", JSON.stringify(settingsState.workdays));
    localStorage.setItem("sd_shifts", JSON.stringify(settingsState.shifts));
    localStorage.setItem("sd_holidays", JSON.stringify(settingsState.holidays));
    localStorage.setItem("sd_users", JSON.stringify(settingsState.users));
    localStorage.setItem("sd_signatories", JSON.stringify(settingsState.signatories));
    localStorage.setItem("sd_doc_signatories", JSON.stringify(settingsState.docSignatories));
    localStorage.setItem("sd_homeroom_v2", JSON.stringify(settingsState.homeroom));
    localStorage.setItem("sd_staff_types", JSON.stringify(settingsState.staffTypes));
    localStorage.setItem("sd_positions", JSON.stringify(settingsState.positions));
    localStorage.setItem("sd_departments", JSON.stringify(settingsState.departments));
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS & DIALOGS
// -------------------------------------------------------------

function showToast(message, type = "info") {
    App.showToast(message, type === 'error' ? 'error' : type);
}

function openModal(id) {
    App.openModal(id);
}

function closeModal(id) {
    App.closeModal(id);
}

// -------------------------------------------------------------
// VIEW SWITCHING
// -------------------------------------------------------------

function navigateToView(viewId) {
    settingsState.activeView = viewId;
    App.navigate('settings', viewId);

    // Load fresh draft from state whenever navigating settings (Task 4)
    settingsStateDraft = JSON.parse(JSON.stringify(settingsState));

    // Load content for that view
    renderViewData(viewId);
}

function renderViewData(viewId) {
    if (viewId === "general") {
        renderGeneralView();
    } else if (viewId === "homeroom") {
        renderHomeroomView();
    } else if (viewId === "schedule") {
        renderScheduleView();
    } else if (viewId === "permissions") {
        renderPermissionsView();
    } else if (viewId === "signatories") {
        renderSignatoriesView();
    } else if (viewId === "staff-types") {
        renderStaffTypesView();
    } else if (viewId === "positions") {
        renderPositionsView();
    } else if (viewId === "departments") {
        renderDepartmentsView();
    }
}

// -------------------------------------------------------------
// RENDERERS
// -------------------------------------------------------------

// Render General View Form Elements (reads from draft)
function renderGeneralView() {
    document.getElementById("school-name-th").value = settingsStateDraft.schoolNameTh;
    document.getElementById("school-name-en").value = settingsStateDraft.schoolNameEn;
    document.getElementById("school-code").value = settingsStateDraft.schoolCode;
    document.getElementById("school-phone").value = settingsStateDraft.schoolPhone;
    document.getElementById("school-address").value = settingsStateDraft.schoolAddress;
    document.getElementById("acad-year").value = settingsStateDraft.acadYear;
    document.getElementById("acad-start").value = settingsStateDraft.acadStart;
    document.getElementById("acad-end").value = settingsStateDraft.acadEnd;
}

// -------------------------------------------------------------
// HOMEROOM TEACHERS (ครูประจำชั้น) — ตั้งค่าแยกตามปีการศึกษา
//
// เป็นแหล่งข้อมูลจริงของ "ครูประจำชั้น / ครูที่ปรึกษา" ที่หน้าตั้งค่าการลา
// ของนักเรียน (leave-features.html) ระบุไว้ว่า "ดึงข้อมูลอัตโนมัติ"
// ข้อมูลเก็บที่ settingsState.homeroom[ปีการศึกษา][ห้อง] = [{teacherId, role}]
// -------------------------------------------------------------

const HOMEROOM_LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const HOMEROOM_ROOMS_PER_LEVEL = 5;
const HOMEROOM_ROLE_LABEL = { homeroom: "ครูประจำชั้น", advisor: "ครูที่ปรึกษา / ร่วมประจำชั้น" };

// 30 ห้อง: ม.1/1 … ม.6/5 (ล้อกับ classroomOptions() ของฝั่ง admission เผื่อรวมระบบภายหลัง)
function homeroomClassList() {
    const list = [];
    HOMEROOM_LEVELS.forEach(level => {
        for (let room = 1; room <= HOMEROOM_ROOMS_PER_LEVEL; room++) {
            list.push(`${level}/${room}`);
        }
    });
    return list;
}

// อ่านรายชื่อครูจาก personnel.js ตอน render ทุกครั้ง (ไม่ cache)
// เพื่อให้บุคลากรที่เพิ่มใหม่ในหน้า "รายชื่อบุคลากร" โผล่ในตัวเลือกทันที
function getHomeroomTeacherPool() {
    let pool = [];
    if (typeof teachers !== "undefined" && Array.isArray(teachers) && teachers.length > 0) {
        pool = teachers;
    } else if (typeof INITIAL_PERSONNEL_TEACHERS !== "undefined") {
        pool = INITIAL_PERSONNEL_TEACHERS;
    }
    return pool.map(t => ({
        id: t.id,
        name: `${t.prefix || ""}${t.firstname || ""} ${t.lastname || ""}`.trim(),
        position: t.position || "",
        department: t.department || ""
    }));
}

function homeroomTeacherName(teacherId) {
    const found = getHomeroomTeacherPool().find(t => t.id === teacherId);
    return found ? found.name : `(ไม่พบบุคลากร ${teacherId})`;
}

// ปีการศึกษาที่เลือกอยู่บนหน้าจอ (fallback = ปีการศึกษาปัจจุบันจากหน้าตั้งค่าทั่วไป)
function getSelectedHomeroomYear() {
    const select = document.getElementById("homeroom-year");
    return (select && select.value) ? select.value : String(settingsStateDraft.acadYear || settingsState.acadYear);
}

// map ของปีที่เลือก (สร้างให้ถ้ายังไม่มี)
function getHomeroomYearMap(year) {
    if (!settingsStateDraft.homeroom) settingsStateDraft.homeroom = {};
    if (!settingsStateDraft.homeroom[year]) settingsStateDraft.homeroom[year] = {};
    return settingsStateDraft.homeroom[year];
}

// จำไว้ว่าปีไหนถูกเติมอัตโนมัติมาจากปีไหน เพื่อขึ้นแถบแจ้งเตือนว่ายังไม่ได้บันทึก
// (ล้างทิ้งเมื่อกดบันทึก — ไม่ถูกเก็บลง localStorage)
let homeroomAutoFillNote = null;

// เติมรายชื่อครูของปีที่เลือกให้อัตโนมัติจากปีที่แล้ว ถ้าปีนั้น "ยังไม่เคยตั้งค่า"
// เกณฑ์คือดูว่ามี key ของปีนั้นใน homeroom หรือยัง — ไม่ได้ดูว่าว่างหรือไม่
// เพราะถ้าผู้ใช้ตั้งใจล้างครูออกทั้งปีแล้วกดบันทึก (ได้ {} ว่าง) ต้องเคารพเจตนานั้น
// ไม่ใช่เติมกลับมาให้อีกทุกครั้งที่เปิดหน้า
function ensureHomeroomYearSeeded(year) {
    if (!settingsStateDraft.homeroom) settingsStateDraft.homeroom = {};
    if (year in settingsStateDraft.homeroom) return;

    const prevYear = String(parseInt(year, 10) - 1);
    const source = settingsStateDraft.homeroom[prevYear];

    if (source && Object.keys(source).length > 0) {
        settingsStateDraft.homeroom[year] = JSON.parse(JSON.stringify(source));
        homeroomAutoFillNote = { year: year, fromYear: prevYear, rooms: Object.keys(source).length };
    } else {
        settingsStateDraft.homeroom[year] = {};
    }
}

function populateHomeroomYearSelect() {
    const select = document.getElementById("homeroom-year");
    if (!select || select.dataset.ready === "1") return;
    const current = parseInt(settingsStateDraft.acadYear || settingsState.acadYear, 10) || 2568;
    let html = "";
    for (let y = current - 2; y <= current + 1; y++) {
        html += `<option value="${y}"${y === current ? " selected" : ""}>ปีการศึกษา ${y}</option>`;
    }
    select.innerHTML = html;
    select.dataset.ready = "1";
}

function renderHomeroomView() {
    populateHomeroomYearSelect();

    const year = getSelectedHomeroomYear();
    ensureHomeroomYearSeeded(year);
    const yearMap = getHomeroomYearMap(year);
    const classes = homeroomClassList();

    // แถบแจ้งว่ารายชื่อชุดนี้ถูกดึงมาจากปีที่แล้วให้อัตโนมัติ และยังไม่ได้บันทึก
    const note = document.getElementById("homeroom-source-note");
    if (note) {
        if (homeroomAutoFillNote && homeroomAutoFillNote.year === year) {
            document.getElementById("homeroom-source-note-text").textContent =
                `ดึงรายชื่อครูจากปีการศึกษา ${homeroomAutoFillNote.fromYear} มาให้อัตโนมัติ ${homeroomAutoFillNote.rooms} ห้อง — ตรวจสอบ แก้ไขห้องที่เปลี่ยน แล้วกด "บันทึก" เพื่อยืนยันเป็นข้อมูลของปี ${year}`;
            note.style.display = "flex";
        } else {
            note.style.display = "none";
        }
    }

    // ---- สถิติ 3 ใบ ----
    const filled = classes.filter(cls => (yearMap[cls] || []).length > 0).length;
    const uniqueTeachers = new Set();
    classes.forEach(cls => (yearMap[cls] || []).forEach(a => uniqueTeachers.add(a.teacherId)));
    document.getElementById("homeroom-stat-filled").textContent = filled;
    document.getElementById("homeroom-stat-empty").textContent = classes.length - filled;
    document.getElementById("homeroom-stat-teachers").textContent = uniqueTeachers.size;

    // ---- ตาราง ----
    const tbody = document.getElementById("homeroom-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    HOMEROOM_LEVELS.forEach(level => {
        const header = document.createElement("tr");
        header.className = "perm-group-header";
        header.innerHTML = `<td colspan="4">🏫 ระดับชั้น ${level}</td>`;
        tbody.appendChild(header);

        classes.filter(cls => cls.startsWith(level + "/")).forEach(cls => {
            const assigned = yearMap[cls] || [];
            const chips = role => {
                const list = assigned.filter(a => a.role === role);
                if (list.length === 0) {
                    return `<span style="color:var(--text-muted);font-size:12px;">— ยังไม่กำหนด —</span>`;
                }
                return list.map(a => `<span class="badge-soft" style="display:inline-block;margin:2px 4px 2px 0;padding:3px 10px;border-radius:999px;background:var(--primary-glow);color:var(--primary);font-size:12px;font-weight:600;">${homeroomTeacherName(a.teacherId)}</span>`).join("");
            };

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight:600;">${cls}</td>
                <td>${chips("homeroom")}</td>
                <td>${chips("advisor")}</td>
                <td style="text-align:center;">
                    <button class="icon-btn" onclick="openHomeroomModal('${cls}')" title="แก้ไขครูของห้อง ${cls}" style="margin:0 auto;">
                        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

// ---- โมดัลแก้ไขครูของห้องเดียว ----
function openHomeroomModal(cls) {
    settingsStateDraft.editingHomeroomClass = cls;
    const year = getSelectedHomeroomYear();
    document.getElementById("modal-homeroom-title").textContent = `ครูประจำชั้น ${cls}`;
    document.getElementById("modal-homeroom-subtitle").textContent =
        `ปีการศึกษา ${year} — เพิ่มครูได้ไม่จำกัดจำนวน และกำหนดบทบาทของแต่ละคนได้`;
    renderHomeroomModal();
    openModal("modal-homeroom");
}

function renderHomeroomModal() {
    const cls = settingsStateDraft.editingHomeroomClass;
    if (!cls) return;
    const yearMap = getHomeroomYearMap(getSelectedHomeroomYear());
    const assigned = yearMap[cls] || [];
    const pool = getHomeroomTeacherPool();

    // รายชื่อที่มอบหมายแล้ว
    const listEl = document.getElementById("homeroom-assigned-list");
    if (assigned.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:18px;border:1px dashed var(--border-color);border-radius:8px;">ยังไม่ได้กำหนดครูให้ห้องนี้</div>`;
    } else {
        listEl.innerHTML = assigned.map((a, idx) => `
            <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;">
                <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:600;">${homeroomTeacherName(a.teacherId)}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${(pool.find(t => t.id === a.teacherId) || {}).position || ""}</div>
                </div>
                <select class="glass-select" style="width:190px;font-size:12px;" onchange="changeHomeroomRole(${idx}, this.value)">
                    <option value="homeroom"${a.role === "homeroom" ? " selected" : ""}>ครูประจำชั้น</option>
                    <option value="advisor"${a.role === "advisor" ? " selected" : ""}>ครูที่ปรึกษา / ร่วมประจำชั้น</option>
                </select>
                <button class="icon-btn danger" onclick="removeHomeroomTeacher(${idx})" title="เอาออกจากห้องนี้">
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `).join("");
    }

    // ตัวเลือกเพิ่มครู — เฉพาะคนที่ยังไม่อยู่ในห้องนี้
    const assignedIds = assigned.map(a => a.teacherId);
    const available = pool.filter(t => !assignedIds.includes(t.id));
    const addSelect = document.getElementById("homeroom-add-teacher");
    if (available.length === 0) {
        addSelect.innerHTML = `<option value="">— บุคลากรทุกคนถูกเพิ่มในห้องนี้แล้ว —</option>`;
    } else {
        addSelect.innerHTML = available
            .map(t => `<option value="${t.id}">${t.name}${t.department ? " · " + t.department : ""}</option>`)
            .join("");
    }
}

function addHomeroomTeacher() {
    const cls = settingsStateDraft.editingHomeroomClass;
    const teacherId = document.getElementById("homeroom-add-teacher").value;
    if (!cls || !teacherId) {
        showToast("ไม่มีบุคลากรให้เพิ่มแล้ว", "warning");
        return;
    }
    const yearMap = getHomeroomYearMap(getSelectedHomeroomYear());
    if (!yearMap[cls]) yearMap[cls] = [];
    // คนแรกของห้องตั้งเป็นครูประจำชั้น คนถัดไปตั้งเป็นครูที่ปรึกษา (ปรับได้เองภายหลัง)
    const role = yearMap[cls].some(a => a.role === "homeroom") ? "advisor" : "homeroom";
    yearMap[cls].push({ teacherId, role });
    renderHomeroomModal();
    renderHomeroomView();
}

function changeHomeroomRole(index, role) {
    const cls = settingsStateDraft.editingHomeroomClass;
    const yearMap = getHomeroomYearMap(getSelectedHomeroomYear());
    if (!cls || !yearMap[cls] || !yearMap[cls][index]) return;
    yearMap[cls][index].role = role;
    renderHomeroomModal();
    renderHomeroomView();
}

function removeHomeroomTeacher(index) {
    const cls = settingsStateDraft.editingHomeroomClass;
    const yearMap = getHomeroomYearMap(getSelectedHomeroomYear());
    if (!cls || !yearMap[cls]) return;
    yearMap[cls].splice(index, 1);
    if (yearMap[cls].length === 0) delete yearMap[cls];
    renderHomeroomModal();
    renderHomeroomView();
}

// Render Schedule View (reads from draft)
function renderScheduleView() {
    // Stat display
    document.getElementById("display-start-time").textContent = `${settingsStateDraft.workStart} น.`;
    document.getElementById("display-end-time").textContent = `${settingsStateDraft.workEnd} น.`;
    document.getElementById("display-late-threshold").textContent = `${settingsStateDraft.lateThreshold} นาที`;

    // Input fields
    document.getElementById("work-start").value = settingsStateDraft.workStart;
    document.getElementById("work-end").value = settingsStateDraft.workEnd;
    document.getElementById("lunch-start").value = settingsStateDraft.lunchStart;
    document.getElementById("lunch-end").value = settingsStateDraft.lunchEnd;
    document.getElementById("late-threshold").value = settingsStateDraft.lateThreshold;
    document.getElementById("early-out-threshold").value = settingsStateDraft.earlyOutThreshold;
    document.getElementById("ot-start").value = settingsStateDraft.otStart;

    // Weekdays
    document.querySelectorAll(".weekday-selector .day-btn").forEach(label => {
        const checkbox = label.querySelector("input");
        const val = checkbox.value;
        const isChecked = settingsStateDraft.workdays.includes(val);
        checkbox.checked = isChecked;
        if (isChecked) {
            label.classList.add("checked");
        } else {
            label.classList.remove("checked");
        }
    });

    // Special Shifts List
    const shiftsList = document.getElementById("shifts-list");
    shiftsList.innerHTML = "";
    if (settingsStateDraft.shifts.length === 0) {
        shiftsList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:13px; padding:16px;">ยังไม่มีการตั้งกะงานพิเศษ (แบบร่าง)</div>`;
    } else {
        settingsStateDraft.shifts.forEach(shift => {
            const row = document.createElement("div");
            row.className = "shift-row";
            row.innerHTML = `
                <div class="shift-info">
                    <span class="shift-name">${shift.name}</span>
                    <span class="shift-time">${shift.start} น. - ${shift.end} น.</span>
                </div>
                <div class="shift-actions">
                    <button class="icon-btn" onclick="editShift('${shift.id}')" title="แก้ไข">
                        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="icon-btn danger" onclick="deleteShift('${shift.id}')" title="ลบ">
                        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            `;
            shiftsList.appendChild(row);
        });
    }

    // Holidays Table
    const holidayBody = document.getElementById("holiday-table-body");
    holidayBody.innerHTML = "";
    if (settingsStateDraft.holidays.length === 0) {
        holidayBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:24px;">ไม่พบรายการวันหยุด (แบบร่าง)</td></tr>`;
    } else {
        const sortedHolidays = [...settingsStateDraft.holidays].sort((a,b) => a.date.localeCompare(b.date));
        sortedHolidays.forEach(holiday => {
            let typeText = "วันหยุดทั่วไป";
            let typeClass = "ht-school";
            if (holiday.type === "national") {
                typeText = "วันหยุดราชการ/นักขัตฤกษ์";
                typeClass = "ht-national";
            } else if (holiday.type === "special") {
                typeText = "วันหยุดกรณีพิเศษ";
                typeClass = "ht-special";
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${formatThaiDate(holiday.date)}</td>
                <td style="font-weight: 500;">${holiday.name}</td>
                <td><span class="holiday-type-badge ${typeClass}">${typeText}</span></td>
                <td style="text-align:center;">
                    <button class="icon-btn danger" onclick="deleteHoliday('${holiday.date}')" style="margin: 0 auto;">
                        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </td>
            `;
            holidayBody.appendChild(tr);
        });
    }
}

// Render Permissions View (reads from draft)
function renderPermissionsView() {
    // Update counters
    const countDir = settingsStateDraft.users.filter(u => u.role === "ผู้อำนวยการ" && u.status === "active").length;
    const countVp = settingsStateDraft.users.filter(u => u.role === "รองผู้อำนวยการ" && u.status === "active").length;
    const countAdmin = settingsStateDraft.users.filter(u => u.role === "ผู้ดูแลระบบ" && u.status === "active").length;
    const countTeacher = settingsStateDraft.users.filter(u => u.role === "ครู" && u.status === "active").length;

    document.getElementById("count-director").textContent = `${countDir} คน`;
    document.getElementById("count-vp").textContent = `${countVp} คน`;
    document.getElementById("count-admin").textContent = `${countAdmin} คน`;
    document.getElementById("count-teacher").textContent = `${countTeacher} คน`;

    // Filtered user roles table
    const searchVal = document.getElementById("user-search").value.toLowerCase();
    const filterRoleVal = document.getElementById("filter-role").value;

    const userTableBody = document.getElementById("user-role-table-body");
    userTableBody.innerHTML = "";

    const filteredUsers = settingsStateDraft.users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchVal) || u.position.toLowerCase().includes(searchVal);
        const matchesRole = !filterRoleVal || u.role === filterRoleVal;
        return matchesSearch && matchesRole;
    });

    if (filteredUsers.length === 0) {
        userTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:24px;">ไม่พบข้อมูลผู้ใช้</td></tr>`;
    } else {
        filteredUsers.forEach(user => {
            const statusClass = user.status === "active" ? "badge-active" : "badge-inactive";
            const statusText = user.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน";
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight:600; color:var(--text-primary);">${user.name}</td>
                <td>${user.position}</td>
                <td><span class="badge badge-admin">${user.role}</span></td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td style="text-align:center;">
                    <button class="btn btn-secondary btn-sm" onclick="editUserRole('${user.id}')">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        สิทธิ์
                    </button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });
    }
}

// Render Signatories View (reads from draft, checkbox list for multiple signatories)
function renderSignatoriesView() {
    // 1. Render cards
    const grid = document.getElementById("signatory-grid");
    grid.innerHTML = "";

    if (settingsStateDraft.signatories.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:32px;">ยังไม่มีรายชื่อผู้ลงนามหลัก</div>`;
    } else {
        settingsStateDraft.signatories.forEach(sign => {
            const card = document.createElement("div");
            card.className = "signatory-card";
            
            const tags = sign.docTypes.map(tag => `<span class="sign-doc-tag">${tag}</span>`).join("");
            
            card.innerHTML = `
                <div class="signatory-card-actions">
                    <button class="icon-btn" onclick="editSignatory('${sign.id}')" title="แก้ไข">
                        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="icon-btn danger" onclick="deleteSignatory('${sign.id}')" title="ลบ">
                        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
                <div class="sign-avatar">${sign.name.substring(0, 2)}</div>
                <div class="sign-name">${sign.prefix || ""}${sign.name}</div>
                <div class="sign-position">${sign.position}</div>
                <div class="sign-order-badge">ผู้ลงนามลำดับที่ ${sign.order}</div>
                <div class="sign-docs">${tags}</div>
            `;
            grid.appendChild(card);
        });
    }

    // 2. Document Assignments (Task 3: Multiple Signatories Checklist)
    const docSignList = document.getElementById("doc-sign-list");
    docSignList.innerHTML = "";

    settingsStateDraft.docSignatories.forEach((item) => {
        const row = document.createElement("div");
        row.className = "doc-sign-row";
        
        let activeIds = item.signatoryIds || [];

        // Checkbox checklist HTML
        let checklistHtml = `
            <div style="display:flex; flex-wrap:wrap; gap:12px; flex-grow:1; max-width:550px;">
        `;
        settingsStateDraft.signatories.forEach(sign => {
            const isChecked = activeIds.includes(sign.id) ? "checked" : "";
            checklistHtml += `
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:12.5px; cursor:pointer; margin:0; padding:4px 8px; background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:6px; min-width:180px;">
                    <input type="checkbox" value="${sign.id}" ${isChecked} 
                           onchange="assignDocSignatoryMultiple('${item.docType}', '${sign.id}', this.checked)">
                    <span style="color:var(--text-secondary);">${sign.prefix || ""}${sign.name}</span>
                </label>
            `;
        });
        checklistHtml += `</div>`;

        row.innerHTML = `
            <div class="doc-sign-name" style="font-weight:600; color:var(--text-primary);">${item.docType}</div>
            ${checklistHtml}
        `;
        docSignList.appendChild(row);
    });
}

// -------------------------------------------------------------
// STAFF TYPES (ประเภทบุคลากร) & POSITIONS (ตำแหน่ง)
// -------------------------------------------------------------
// สองรายการนี้ผูกกันทางเดียว: ตำแหน่งหนึ่งเลือกได้ว่า "สังกัด" ประเภทบุคลากรใดบ้าง
// (position.typeIds เป็น array — เลือกได้หลายประเภท) ส่วนประเภทบุคลากรเองไม่เก็บ
// รายการตำแหน่งย้อนกลับ (derived ด้วย countPositionsForStaffType เสมอ กันข้อมูลไม่ตรงกัน)
//
// การลบ/ปิดใช้งาน: ถ้ามีบุคลากรจริง (teachers ใน personnel.js) หรือ — กรณีประเภทบุคลากร —
// มีตำแหน่งที่ยังผูกอยู่ จะไม่ให้ลบตรงๆ แต่ชวนให้ "ปิดใช้งาน" แทน เพื่อไม่ให้ข้อมูลอ้างอิงเดิมหาย

const STAFF_TYPE_COLOR_HEX = { danger: "#f87171", warning: "#fb923c", primary: "#60a5fa", success: "#4ade80", info: "#38bdf8" };

function personnelListSafe() {
    // teachers มาจาก personnel.js — โหลดก่อน settings.js เสมอ แต่กันไว้เผื่อสลับลำดับในอนาคต
    return (typeof teachers !== "undefined" && Array.isArray(teachers)) ? teachers : [];
}

function countPersonnelForStaffType(staffTypeId) {
    return personnelListSafe().filter(t => t.job?.staffTypeId === staffTypeId).length;
}

function countPersonnelForPosition(positionId) {
    return personnelListSafe().filter(t => t.job?.positionId === positionId).length;
}

function countPositionsForStaffType(staffTypeId) {
    return settingsStateDraft.positions.filter(p => p.typeIds && p.typeIds.includes(staffTypeId)).length;
}

function countPersonnelForDepartment(departmentId) {
    return personnelListSafe().filter(t => t.job?.departmentId === departmentId).length;
}

// รายชื่อบุคลากรที่เลือกเป็น "หัวหน้าแผนก" ได้ — ใช้ personnelListSafe() ตัวเดียวกับที่นับจำนวนผู้ใช้งาน
// (ต่างจาก getHomeroomTeacherPool() ของฝั่งครูประจำชั้น เพราะ field ชื่อ-สกุลเก็บคนละแบบ)
function departmentHeadCandidates() {
    return personnelListSafe().map(t => ({
        id: t.id,
        name: `${t.prefix || ""}${t.firstname || ""} ${t.lastname || ""}`.trim() || t.id
    }));
}

function departmentHeadName(headTeacherId) {
    if (!headTeacherId) return "";
    const found = departmentHeadCandidates().find(t => t.id === headTeacherId);
    return found ? found.name : `(ไม่พบบุคลากร ${headTeacherId})`;
}

// ---- Staff Types: render ----
function renderStaffTypesView() {
    const list = settingsStateDraft.staffTypes || [];
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));

    document.getElementById("stt-count-total").textContent = list.length;
    document.getElementById("stt-count-active").textContent = list.filter(t => t.active).length;
    document.getElementById("stt-count-inactive").textContent = list.filter(t => !t.active).length;

    const searchVal = (document.getElementById("staff-type-search")?.value || "").trim().toLowerCase();
    const statusVal = document.getElementById("staff-type-filter-status")?.value || "all";

    const filtered = sorted.filter(t => {
        const matchesSearch = !searchVal || t.name.toLowerCase().includes(searchVal) || (t.code || "").toLowerCase().includes(searchVal);
        const matchesStatus = statusVal === "all" || (statusVal === "active" ? t.active : !t.active);
        return matchesSearch && matchesStatus;
    });

    const tbody = document.getElementById("staff-types-table-body");
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px;">ไม่พบประเภทบุคลากรที่ค้นหา</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((t) => {
        const realIdx = sorted.findIndex(x => x.id === t.id);
        const dot = STAFF_TYPE_COLOR_HEX[t.color] || "#9ca3af";
        const usedCount = countPersonnelForStaffType(t.id);
        const posCount = countPositionsForStaffType(t.id);
        return `
            <tr style="${t.active ? "" : "opacity:.55;"}">
                <td style="text-align:center;white-space:nowrap;">
                    <button class="icon-btn" style="width:22px;height:22px;" title="เลื่อนขึ้น" onclick="moveStaffType('${t.id}', -1)"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>
                    <button class="icon-btn" style="width:22px;height:22px;" title="เลื่อนลง" onclick="moveStaffType('${t.id}', 1)"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
                </td>
                <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${dot};flex-shrink:0;"></span>
                        <div>
                            <div style="font-weight:600;color:var(--text-primary);">${t.name}</div>
                            <div style="font-size:11px;color:var(--text-muted);">${t.desc || "-"}</div>
                        </div>
                    </div>
                </td>
                <td style="font-family:var(--font-heading);color:var(--text-muted);">${t.code || "-"}</td>
                <td style="text-align:center;">
                    <span class="badge badge-admin" style="cursor:${posCount ? "pointer" : "default"};" ${posCount ? `onclick="App.navigate('settings','positions')"` : ""} title="ตำแหน่งที่สังกัดประเภทนี้">${posCount} ตำแหน่ง</span>
                </td>
                <td style="text-align:center;color:var(--text-secondary);">${usedCount} คน</td>
                <td style="text-align:center;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
                        <label class="switch" title="${t.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}">
                            <input type="checkbox" ${t.active ? "checked" : ""} onchange="toggleStaffTypeActive('${t.id}', this.checked)">
                            <span class="slider"></span>
                        </label>
                        <button class="icon-btn" title="แก้ไข" onclick="openEditStaffTypeModal('${t.id}')">
                            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="icon-btn danger" title="ลบ" onclick="deleteStaffType('${t.id}')">
                            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function moveStaffType(id, dir) {
    const list = settingsStateDraft.staffTypes;
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex(t => t.id === id);
    const swapIdx = idx + dir;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx], b = sorted[swapIdx];
    const tmp = a.order;
    a.order = b.order;
    b.order = tmp;

    renderStaffTypesView();
}

window.toggleStaffTypeActive = function (id, isActive) {
    const t = settingsStateDraft.staffTypes.find(x => x.id === id);
    if (!t) return;
    t.active = isActive;
    renderStaffTypesView();
    showToast(`${isActive ? "เปิด" : "ปิด"}ใช้งาน "${t.name}" แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)`, "info");
};

function openAddStaffTypeModal() {
    settingsStateDraft.editingStaffTypeId = null;
    document.getElementById("modal-staff-type-title").textContent = "เพิ่มประเภทบุคลากร";
    document.getElementById("stt-modal-name").value = "";
    document.getElementById("stt-modal-code").value = "";
    document.getElementById("stt-modal-desc").value = "";
    document.getElementById("stt-modal-color").value = "primary";
    openModal("modal-staff-type");
}

window.openEditStaffTypeModal = function (id) {
    const t = settingsStateDraft.staffTypes.find(x => x.id === id);
    if (!t) return;
    settingsStateDraft.editingStaffTypeId = id;
    document.getElementById("modal-staff-type-title").textContent = "แก้ไขประเภทบุคลากร";
    document.getElementById("stt-modal-name").value = t.name;
    document.getElementById("stt-modal-code").value = t.code || "";
    document.getElementById("stt-modal-desc").value = t.desc || "";
    document.getElementById("stt-modal-color").value = t.color || "primary";
    openModal("modal-staff-type");
};

function saveStaffTypeFromModal() {
    const name = document.getElementById("stt-modal-name").value.trim();
    const code = document.getElementById("stt-modal-code").value.trim();
    const desc = document.getElementById("stt-modal-desc").value.trim();
    const color = document.getElementById("stt-modal-color").value;

    if (!name) {
        showToast("กรุณาระบุชื่อประเภทบุคลากร", "error");
        return;
    }

    const dupe = settingsStateDraft.staffTypes.some(t =>
        t.name.trim().toLowerCase() === name.toLowerCase() && t.id !== settingsStateDraft.editingStaffTypeId
    );
    if (dupe) {
        showToast("มีประเภทบุคลากรชื่อนี้อยู่แล้ว", "error");
        return;
    }

    if (settingsStateDraft.editingStaffTypeId) {
        const t = settingsStateDraft.staffTypes.find(x => x.id === settingsStateDraft.editingStaffTypeId);
        t.name = name; t.code = code; t.desc = desc; t.color = color;
        showToast("แก้ไขแบบร่างประเภทบุคลากรแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    } else {
        const maxOrder = settingsStateDraft.staffTypes.reduce((m, t) => Math.max(m, t.order || 0), 0);
        const newId = `ST${String(settingsStateDraft.staffTypes.length + 1).padStart(2, "0")}`;
        settingsStateDraft.staffTypes.push({ id: newId, name, code, desc, color, active: true, order: maxOrder + 1 });
        showToast("เพิ่มแบบร่างประเภทบุคลากรใหม่แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    }

    closeModal("modal-staff-type");
    renderStaffTypesView();
}

window.deleteStaffType = function (id) {
    const t = settingsStateDraft.staffTypes.find(x => x.id === id);
    if (!t) return;

    const usedCount = countPersonnelForStaffType(id);
    const posCount = countPositionsForStaffType(id);

    if (usedCount > 0 || posCount > 0) {
        const reasons = [];
        if (usedCount > 0) reasons.push(`มีบุคลากร ${usedCount} คน`);
        if (posCount > 0) reasons.push(`มีตำแหน่ง ${posCount} ตำแหน่งสังกัดอยู่`);
        App.showConfirm({
            title: "ลบประเภทบุคลากรไม่ได้",
            message: `"${t.name}" ${reasons.join(" และ ")} — กรุณาย้ายบุคลากร/ตำแหน่งเหล่านั้นไปประเภทอื่นก่อน หรือกด "ปิดใช้งาน" แทนการลบ`,
            confirmLabel: "ปิดใช้งานแทน",
            requireNote: false,
            onConfirm: () => {
                t.active = false;
                renderStaffTypesView();
                showToast(`ปิดใช้งาน "${t.name}" แทนการลบแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)`, "warning");
            }
        });
        return;
    }

    App.showConfirm({
        title: "ยืนยันการลบ",
        message: `ต้องการลบประเภทบุคลากร "${t.name}" ใช่หรือไม่?`,
        confirmLabel: "ลบ",
        requireNote: false,
        onConfirm: () => {
            settingsStateDraft.staffTypes = settingsStateDraft.staffTypes.filter(x => x.id !== id);
            renderStaffTypesView();
            showToast("ลบแบบร่างประเภทบุคลากรแล้ว (กรุณากดบันทึกด้านล่างเพื่อยืนยัน)", "warning");
        }
    });
};

// ---- Positions: render ----
function renderPositionsView() {
    const staffTypes = settingsStateDraft.staffTypes || [];
    const list = settingsStateDraft.positions || [];
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));

    document.getElementById("pos-count-total").textContent = list.length;
    document.getElementById("pos-count-active").textContent = list.filter(p => p.active).length;
    document.getElementById("pos-count-inactive").textContent = list.filter(p => !p.active).length;

    // เติม/รีเฟรช dropdown ตัวกรองประเภทบุคลากร
    const typeFilterSelect = document.getElementById("position-filter-type");
    if (typeFilterSelect && typeFilterSelect.dataset.rendered !== String(staffTypes.length)) {
        const currentVal = typeFilterSelect.value;
        typeFilterSelect.innerHTML = `<option value="">ทุกประเภทบุคลากร</option>` +
            staffTypes.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
        typeFilterSelect.value = currentVal;
        typeFilterSelect.dataset.rendered = String(staffTypes.length);
    }

    const searchVal = (document.getElementById("position-search")?.value || "").trim().toLowerCase();
    const statusVal = document.getElementById("position-filter-status")?.value || "all";
    const typeVal = document.getElementById("position-filter-type")?.value || "";

    const filtered = sorted.filter(p => {
        const matchesSearch = !searchVal || p.name.toLowerCase().includes(searchVal) || (p.code || "").toLowerCase().includes(searchVal);
        const matchesStatus = statusVal === "all" || (statusVal === "active" ? p.active : !p.active);
        const matchesType = !typeVal || (p.typeIds || []).includes(typeVal);
        return matchesSearch && matchesStatus && matchesType;
    });

    const tbody = document.getElementById("positions-table-body");
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px;">ไม่พบตำแหน่งที่ค้นหา</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((p) => {
        const usedCount = countPersonnelForPosition(p.id);
        const typeTags = (p.typeIds || []).map(tid => {
            const t = staffTypes.find(x => x.id === tid);
            return t ? `<span class="sign-doc-tag">${t.name}</span>` : "";
        }).join("");

        return `
            <tr style="${p.active ? "" : "opacity:.55;"}">
                <td style="text-align:center;white-space:nowrap;">
                    <button class="icon-btn" style="width:22px;height:22px;" title="เลื่อนขึ้น" onclick="movePosition('${p.id}', -1)"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>
                    <button class="icon-btn" style="width:22px;height:22px;" title="เลื่อนลง" onclick="movePosition('${p.id}', 1)"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
                </td>
                <td style="font-weight:600;color:var(--text-primary);">${p.name}</td>
                <td style="font-family:var(--font-heading);color:var(--text-muted);">${p.code || "-"}</td>
                <td><div style="display:flex;flex-wrap:wrap;gap:4px;max-width:260px;">${typeTags || '<span style="color:var(--text-muted);font-size:11px;">ยังไม่ระบุ</span>'}</div></td>
                <td style="text-align:center;color:var(--text-secondary);">${usedCount} คน</td>
                <td style="text-align:center;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
                        <label class="switch" title="${p.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}">
                            <input type="checkbox" ${p.active ? "checked" : ""} onchange="togglePositionActive('${p.id}', this.checked)">
                            <span class="slider"></span>
                        </label>
                        <button class="icon-btn" title="แก้ไข" onclick="openEditPositionModal('${p.id}')">
                            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="icon-btn danger" title="ลบ" onclick="deletePosition('${p.id}')">
                            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function movePosition(id, dir) {
    const list = settingsStateDraft.positions;
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex(p => p.id === id);
    const swapIdx = idx + dir;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx], b = sorted[swapIdx];
    const tmp = a.order;
    a.order = b.order;
    b.order = tmp;

    renderPositionsView();
}

window.togglePositionActive = function (id, isActive) {
    const p = settingsStateDraft.positions.find(x => x.id === id);
    if (!p) return;
    p.active = isActive;
    renderPositionsView();
    showToast(`${isActive ? "เปิด" : "ปิด"}ใช้งาน "${p.name}" แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)`, "info");
};

function openAddPositionModal() {
    settingsStateDraft.editingPositionId = null;
    document.getElementById("modal-position-title").textContent = "เพิ่มตำแหน่ง";
    document.getElementById("pos-modal-name").value = "";
    document.getElementById("pos-modal-code").value = "";
    renderPositionModalTypeCheckboxes([]);
    openModal("modal-position");
}

window.openEditPositionModal = function (id) {
    const p = settingsStateDraft.positions.find(x => x.id === id);
    if (!p) return;
    settingsStateDraft.editingPositionId = id;
    document.getElementById("modal-position-title").textContent = "แก้ไขตำแหน่ง";
    document.getElementById("pos-modal-name").value = p.name;
    document.getElementById("pos-modal-code").value = p.code || "";
    renderPositionModalTypeCheckboxes(p.typeIds || []);
    openModal("modal-position");
};

function renderPositionModalTypeCheckboxes(checkedIds) {
    const container = document.getElementById("pos-modal-types-list");
    if (!container) return;
    const staffTypes = [...settingsStateDraft.staffTypes].sort((a, b) => (a.order || 0) - (b.order || 0));

    if (staffTypes.length === 0) {
        container.innerHTML = `<div style="font-size:12px;color:var(--text-muted);">ยังไม่มีประเภทบุคลากรในระบบ กรุณาไปเพิ่มที่หน้า "ตั้งค่าประเภทบุคลากร" ก่อน</div>`;
        return;
    }

    container.innerHTML = staffTypes.map(t => `
        <label style="display:inline-flex; align-items:center; gap:6px; font-size:12.5px; cursor:pointer; margin:0; padding:4px 8px; background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:6px;">
            <input type="checkbox" value="${t.id}" ${checkedIds.includes(t.id) ? "checked" : ""} ${!t.active ? "disabled" : ""}>
            <span style="color:var(--text-secondary);">${t.name}${!t.active ? " (ปิดใช้งาน)" : ""}</span>
        </label>
    `).join("");
}

function savePositionFromModal() {
    const name = document.getElementById("pos-modal-name").value.trim();
    const code = document.getElementById("pos-modal-code").value.trim();
    const typeIds = [...document.querySelectorAll("#pos-modal-types-list input[type='checkbox']:checked")].map(cb => cb.value);

    if (!name) {
        showToast("กรุณาระบุชื่อตำแหน่ง", "error");
        return;
    }
    if (typeIds.length === 0) {
        showToast("กรุณาเลือกอย่างน้อย 1 ประเภทบุคลากรที่สังกัดตำแหน่งนี้", "error");
        return;
    }

    const dupe = settingsStateDraft.positions.some(p =>
        p.name.trim().toLowerCase() === name.toLowerCase() && p.id !== settingsStateDraft.editingPositionId
    );
    if (dupe) {
        showToast("มีตำแหน่งชื่อนี้อยู่แล้ว", "error");
        return;
    }

    if (settingsStateDraft.editingPositionId) {
        const p = settingsStateDraft.positions.find(x => x.id === settingsStateDraft.editingPositionId);
        p.name = name; p.code = code; p.typeIds = typeIds;
        showToast("แก้ไขแบบร่างตำแหน่งแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    } else {
        const maxOrder = settingsStateDraft.positions.reduce((m, p) => Math.max(m, p.order || 0), 0);
        const newId = `POS${String(settingsStateDraft.positions.length + 1).padStart(2, "0")}`;
        settingsStateDraft.positions.push({ id: newId, name, code, typeIds, active: true, order: maxOrder + 1 });
        showToast("เพิ่มแบบร่างตำแหน่งใหม่แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    }

    closeModal("modal-position");
    renderPositionsView();
}

window.deletePosition = function (id) {
    const p = settingsStateDraft.positions.find(x => x.id === id);
    if (!p) return;

    const usedCount = countPersonnelForPosition(id);
    if (usedCount > 0) {
        App.showConfirm({
            title: "ลบตำแหน่งไม่ได้",
            message: `"${p.name}" มีบุคลากร ${usedCount} คนใช้ตำแหน่งนี้อยู่ — กรุณาย้ายบุคลากรเหล่านั้นไปตำแหน่งอื่นก่อน หรือกด "ปิดใช้งาน" แทนการลบ`,
            confirmLabel: "ปิดใช้งานแทน",
            requireNote: false,
            onConfirm: () => {
                p.active = false;
                renderPositionsView();
                showToast(`ปิดใช้งาน "${p.name}" แทนการลบแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)`, "warning");
            }
        });
        return;
    }

    App.showConfirm({
        title: "ยืนยันการลบ",
        message: `ต้องการลบตำแหน่ง "${p.name}" ใช่หรือไม่?`,
        confirmLabel: "ลบ",
        requireNote: false,
        onConfirm: () => {
            settingsStateDraft.positions = settingsStateDraft.positions.filter(x => x.id !== id);
            renderPositionsView();
            showToast("ลบแบบร่างตำแหน่งแล้ว (กรุณากดบันทึกด้านล่างเพื่อยืนยัน)", "warning");
        }
    });
};

// ---- Departments / Learning Areas: render ----
// รายการแบนธรรมดา ไม่ผูกกับ entity อื่น (ต่างจากตำแหน่งที่ผูกกับประเภทบุคลากร) —
// ใช้แค่เป็นตัวเลือก "กลุ่มสาระการเรียนรู้" ในฟอร์มข้อมูลตำแหน่งงานของบุคลากรเท่านั้น
function renderDepartmentsView() {
    const list = settingsStateDraft.departments || [];
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));

    document.getElementById("dep-count-total").textContent = list.length;
    document.getElementById("dep-count-active").textContent = list.filter(d => d.active).length;
    document.getElementById("dep-count-inactive").textContent = list.filter(d => !d.active).length;

    const searchVal = (document.getElementById("department-search")?.value || "").trim().toLowerCase();
    const statusVal = document.getElementById("department-filter-status")?.value || "all";

    const filtered = sorted.filter(d => {
        const matchesSearch = !searchVal || d.name.toLowerCase().includes(searchVal) || (d.code || "").toLowerCase().includes(searchVal);
        const matchesStatus = statusVal === "all" || (statusVal === "active" ? d.active : !d.active);
        return matchesSearch && matchesStatus;
    });

    const tbody = document.getElementById("departments-table-body");
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px;">ไม่พบแผนก/กลุ่มสาระการเรียนรู้ที่ค้นหา</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((d) => {
        const dot = STAFF_TYPE_COLOR_HEX[d.color] || "#9ca3af";
        const usedCount = countPersonnelForDepartment(d.id);
        const headName = departmentHeadName(d.headTeacherId);
        return `
            <tr style="${d.active ? "" : "opacity:.55;"}">
                <td style="text-align:center;white-space:nowrap;">
                    <button class="icon-btn" style="width:22px;height:22px;" title="เลื่อนขึ้น" onclick="moveDepartment('${d.id}', -1)"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>
                    <button class="icon-btn" style="width:22px;height:22px;" title="เลื่อนลง" onclick="moveDepartment('${d.id}', 1)"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
                </td>
                <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${dot};flex-shrink:0;"></span>
                        <div>
                            <div style="font-weight:600;color:var(--text-primary);">${d.name}</div>
                            <div style="font-size:11px;color:var(--text-muted);">${d.desc || "-"}</div>
                        </div>
                    </div>
                </td>
                <td style="font-family:var(--font-heading);color:var(--text-muted);">${d.code || "-"}</td>
                <td>${headName ? `<span style="color:var(--text-primary);">${headName}</span>` : `<span style="color:var(--text-muted);font-size:11px;">ยังไม่ระบุ</span>`}</td>
                <td style="text-align:center;color:var(--text-secondary);">${usedCount} คน</td>
                <td style="text-align:center;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
                        <label class="switch" title="${d.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}">
                            <input type="checkbox" ${d.active ? "checked" : ""} onchange="toggleDepartmentActive('${d.id}', this.checked)">
                            <span class="slider"></span>
                        </label>
                        <button class="icon-btn" title="แก้ไข" onclick="openEditDepartmentModal('${d.id}')">
                            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="icon-btn danger" title="ลบ" onclick="deleteDepartment('${d.id}')">
                            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function moveDepartment(id, dir) {
    const list = settingsStateDraft.departments;
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex(d => d.id === id);
    const swapIdx = idx + dir;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx], b = sorted[swapIdx];
    const tmp = a.order;
    a.order = b.order;
    b.order = tmp;

    renderDepartmentsView();
}

window.toggleDepartmentActive = function (id, isActive) {
    const d = settingsStateDraft.departments.find(x => x.id === id);
    if (!d) return;
    d.active = isActive;
    renderDepartmentsView();
    showToast(`${isActive ? "เปิด" : "ปิด"}ใช้งาน "${d.name}" แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)`, "info");
};

// เติม option ของ "หัวหน้าแผนก" ใหม่ทุกครั้งที่เปิดโมดัล (ไม่ cache) เพื่อให้บุคลากรที่เพิ่งเพิ่ม
// ในหน้ารายชื่อบุคลากรโผล่เป็นตัวเลือกทันที เหมือนแพทเทิร์นของ getHomeroomTeacherPool()
function populateDepartmentHeadSelect(selectedId) {
    const select = document.getElementById("dep-modal-head");
    if (!select) return;
    const candidates = departmentHeadCandidates();
    select.innerHTML = `<option value="">-- ไม่ระบุ --</option>` +
        candidates.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
    select.value = (selectedId && candidates.some(t => t.id === selectedId)) ? selectedId : "";
}

function openAddDepartmentModal() {
    settingsStateDraft.editingDepartmentId = null;
    document.getElementById("modal-department-title").textContent = "เพิ่มแผนก/กลุ่มสาระการเรียนรู้";
    document.getElementById("dep-modal-name").value = "";
    document.getElementById("dep-modal-code").value = "";
    document.getElementById("dep-modal-desc").value = "";
    document.getElementById("dep-modal-color").value = "primary";
    populateDepartmentHeadSelect(null);
    openModal("modal-department");
}

window.openEditDepartmentModal = function (id) {
    const d = settingsStateDraft.departments.find(x => x.id === id);
    if (!d) return;
    settingsStateDraft.editingDepartmentId = id;
    document.getElementById("modal-department-title").textContent = "แก้ไขแผนก/กลุ่มสาระการเรียนรู้";
    document.getElementById("dep-modal-name").value = d.name;
    document.getElementById("dep-modal-code").value = d.code || "";
    document.getElementById("dep-modal-desc").value = d.desc || "";
    document.getElementById("dep-modal-color").value = d.color || "primary";
    populateDepartmentHeadSelect(d.headTeacherId);
    openModal("modal-department");
};

function saveDepartmentFromModal() {
    const name = document.getElementById("dep-modal-name").value.trim();
    const code = document.getElementById("dep-modal-code").value.trim();
    const desc = document.getElementById("dep-modal-desc").value.trim();
    const color = document.getElementById("dep-modal-color").value;
    const headTeacherId = document.getElementById("dep-modal-head").value || null;

    if (!name) {
        showToast("กรุณาระบุชื่อแผนก/กลุ่มสาระการเรียนรู้", "error");
        return;
    }

    const dupe = settingsStateDraft.departments.some(d =>
        d.name.trim().toLowerCase() === name.toLowerCase() && d.id !== settingsStateDraft.editingDepartmentId
    );
    if (dupe) {
        showToast("มีแผนก/กลุ่มสาระการเรียนรู้ชื่อนี้อยู่แล้ว", "error");
        return;
    }

    if (settingsStateDraft.editingDepartmentId) {
        const d = settingsStateDraft.departments.find(x => x.id === settingsStateDraft.editingDepartmentId);
        d.name = name; d.code = code; d.desc = desc; d.color = color; d.headTeacherId = headTeacherId;
        showToast("แก้ไขแบบร่างแผนก/กลุ่มสาระการเรียนรู้แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    } else {
        const maxOrder = settingsStateDraft.departments.reduce((m, d) => Math.max(m, d.order || 0), 0);
        const newId = `DEP${String(settingsStateDraft.departments.length + 1).padStart(2, "0")}`;
        settingsStateDraft.departments.push({ id: newId, name, code, desc, color, headTeacherId, active: true, order: maxOrder + 1 });
        showToast("เพิ่มแบบร่างแผนก/กลุ่มสาระการเรียนรู้ใหม่แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    }

    closeModal("modal-department");
    renderDepartmentsView();
}

window.deleteDepartment = function (id) {
    const d = settingsStateDraft.departments.find(x => x.id === id);
    if (!d) return;

    const usedCount = countPersonnelForDepartment(id);
    if (usedCount > 0) {
        App.showConfirm({
            title: "ลบแผนก/กลุ่มสาระการเรียนรู้ไม่ได้",
            message: `"${d.name}" มีบุคลากร ${usedCount} คนสังกัดอยู่ — กรุณาย้ายบุคลากรเหล่านั้นไปแผนกอื่นก่อน หรือกด "ปิดใช้งาน" แทนการลบ`,
            confirmLabel: "ปิดใช้งานแทน",
            requireNote: false,
            onConfirm: () => {
                d.active = false;
                renderDepartmentsView();
                showToast(`ปิดใช้งาน "${d.name}" แทนการลบแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)`, "warning");
            }
        });
        return;
    }

    App.showConfirm({
        title: "ยืนยันการลบ",
        message: `ต้องการลบแผนก/กลุ่มสาระการเรียนรู้ "${d.name}" ใช่หรือไม่?`,
        confirmLabel: "ลบ",
        requireNote: false,
        onConfirm: () => {
            settingsStateDraft.departments = settingsStateDraft.departments.filter(x => x.id !== id);
            renderDepartmentsView();
            showToast("ลบแบบร่างแผนก/กลุ่มสาระการเรียนรู้แล้ว (กรุณากดบันทึกด้านล่างเพื่อยืนยัน)", "warning");
        }
    });
};

// -------------------------------------------------------------
// EVENT HANDLERS & SAVE ACTIONS
// -------------------------------------------------------------

// Save School Info
document.getElementById("btn-save-school").addEventListener("click", () => {
    settingsStateDraft.schoolNameTh = document.getElementById("school-name-th").value;
    settingsStateDraft.schoolNameEn = document.getElementById("school-name-en").value;
    settingsStateDraft.schoolCode = document.getElementById("school-code").value;
    settingsStateDraft.schoolPhone = document.getElementById("school-phone").value;
    settingsStateDraft.schoolAddress = document.getElementById("school-address").value;
    
    // Commit draft to active state
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();
    showToast("บันทึกข้อมูลโรงเรียนสำเร็จ", "success");
});

// Save Academic Info
document.getElementById("btn-save-acad").addEventListener("click", () => {
    settingsStateDraft.acadYear = document.getElementById("acad-year").value;
    settingsStateDraft.acadStart = document.getElementById("acad-start").value;
    settingsStateDraft.acadEnd = document.getElementById("acad-end").value;
    
    // Commit draft to active state
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();
    showToast("บันทึกปีการศึกษาปัจจุบันเรียบร้อยแล้ว", "success");
});

// ---- Homeroom teachers (ครูประจำชั้น) ----
document.getElementById("homeroom-year").addEventListener("change", () => {
    renderHomeroomView();
});

document.getElementById("btn-homeroom-add").addEventListener("click", addHomeroomTeacher);

document.getElementById("btn-homeroom-done").addEventListener("click", () => {
    closeModal("modal-homeroom");
    settingsStateDraft.editingHomeroomClass = null;
    renderHomeroomView();
});

document.getElementById("btn-save-homeroom").addEventListener("click", () => {
    // Commit draft to active state
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();

    // ยืนยันแล้วว่าเป็นข้อมูลของปีนี้จริง — เอาแถบ "ดึงมาจากปีที่แล้ว" ออก
    homeroomAutoFillNote = null;
    renderHomeroomView();

    const year = getSelectedHomeroomYear();
    const count = Object.keys(settingsState.homeroom[year] || {}).length;
    showToast(`บันทึกครูประจำชั้นปีการศึกษา ${year} แล้ว (${count} ห้อง)`, "success");
});

// Save Work Hours, Shifts, and Holidays (Task 4)
document.getElementById("btn-save-hours").addEventListener("click", () => {
    settingsStateDraft.workStart = document.getElementById("work-start").value;
    settingsStateDraft.workEnd = document.getElementById("work-end").value;
    settingsStateDraft.lunchStart = document.getElementById("lunch-start").value;
    settingsStateDraft.lunchEnd = document.getElementById("lunch-end").value;
    settingsStateDraft.lateThreshold = parseInt(document.getElementById("late-threshold").value) || 15;
    settingsStateDraft.earlyOutThreshold = parseInt(document.getElementById("early-out-threshold").value) || 15;
    settingsStateDraft.otStart = document.getElementById("ot-start").value;

    const newWorkdays = [];
    document.querySelectorAll(".weekday-selector input").forEach(cb => {
        if (cb.checked) newWorkdays.push(cb.value);
    });
    settingsStateDraft.workdays = newWorkdays;

    // Commit draft (including special shifts and holidays) to main state
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();
    
    renderScheduleView();
    showToast("บันทึกการตั้งค่าวันเวลา วันหยุด และกะงานเรียบร้อยแล้ว", "success");
});

// Weekday selector interactive styling
document.querySelectorAll(".weekday-selector input").forEach(cb => {
    cb.addEventListener("change", (e) => {
        const label = e.target.closest("label");
        if (e.target.checked) {
            label.classList.add("checked");
        } else {
            label.classList.remove("checked");
        }
    });
});

// Shift Modal Show
document.getElementById("btn-add-shift")?.addEventListener("click", () => {
    settingsStateDraft.editingShiftId = null;
    document.getElementById("modal-shift-title").textContent = "เพิ่มกะงานพิเศษ";
    document.getElementById("shift-name").value = "";
    document.getElementById("shift-start").value = "08:00";
    document.getElementById("shift-end").value = "17:00";
    openModal("modal-shift");
});

// Shift Modal Confirm (saves to draft, not database)
document.getElementById("btn-confirm-shift")?.addEventListener("click", () => {
    const name = document.getElementById("shift-name").value.trim();
    const start = document.getElementById("shift-start").value;
    const end = document.getElementById("shift-end").value;

    if (!name) {
        showToast("กรุณากรอกชื่อกะงาน", "error");
        return;
    }

    if (settingsStateDraft.editingShiftId) {
        // Edit Mode
        const shift = settingsStateDraft.shifts.find(s => s.id === settingsStateDraft.editingShiftId);
        if (shift) {
            shift.name = name;
            shift.start = start;
            shift.end = end;
            showToast("แก้ไขแบบร่างกะงานเรียบร้อยแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
        }
    } else {
        // Add Mode
        const newId = `S${String(settingsStateDraft.shifts.length + 1).padStart(3, "0")}`;
        settingsStateDraft.shifts.push({ id: newId, name, start, end });
        showToast("เพิ่มแบบร่างกะงานพิเศษเรียบร้อยแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    }

    closeModal("modal-shift");
    renderScheduleView();
});

// Edit Shift
window.editShift = function(id) {
    const shift = settingsStateDraft.shifts.find(s => s.id === id);
    if (!shift) return;

    settingsStateDraft.editingShiftId = id;
    document.getElementById("modal-shift-title").textContent = "แก้ไขกะงานพิเศษ";
    document.getElementById("shift-name").value = shift.name;
    document.getElementById("shift-start").value = shift.start;
    document.getElementById("shift-end").value = shift.end;
    openModal("modal-shift");
};

// Delete Shift (removes from draft)
window.deleteShift = function(id) {
    settingsStateDraft.shifts = settingsStateDraft.shifts.filter(s => s.id !== id);
    renderScheduleView();
    showToast("ลบแบบร่างกะงานแล้ว (กรุณากดบันทึกด้านล่างเพื่อยืนยัน)", "warning");
};

// Holiday Modal Show
document.getElementById("btn-add-holiday")?.addEventListener("click", () => {
    document.getElementById("holiday-date").value = "";
    document.getElementById("holiday-name").value = "";
    document.getElementById("holiday-type").value = "national";
    openModal("modal-holiday");
});

// Holiday Modal Confirm (saves to draft, not database)
document.getElementById("btn-confirm-holiday")?.addEventListener("click", () => {
    const date = document.getElementById("holiday-date").value;
    const name = document.getElementById("holiday-name").value.trim();
    const type = document.getElementById("holiday-type").value;

    if (!date || !name) {
        showToast("กรุณากรอกข้อมูลวันหยุดให้ครบถ้วน", "error");
        return;
    }

    // Check duplicate date in draft
    const exists = settingsStateDraft.holidays.some(h => h.date === date);
    if (exists) {
        showToast("มีวันหยุดในวันที่เลือกนี้อยู่แล้วในแบบร่าง", "error");
        return;
    }

    settingsStateDraft.holidays.push({ date, name, type });
    closeModal("modal-holiday");
    renderScheduleView();
    showToast("เพิ่มแบบร่างวันหยุดพิเศษแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
});

// Delete Holiday (removes from draft)
window.deleteHoliday = function(date) {
    settingsStateDraft.holidays = settingsStateDraft.holidays.filter(h => h.date !== date);
    renderScheduleView();
    showToast("ลบแบบร่างวันหยุดแล้ว (กรุณากดบันทึกด้านล่างเพื่อยืนยัน)", "warning");
};

// Signatory Modal Show
document.getElementById("btn-add-signatory")?.addEventListener("click", () => {
    settingsStateDraft.editingSignatoryId = null;
    document.getElementById("modal-sign-title").textContent = "เพิ่มผู้ลงนามหลัก";
    document.getElementById("sign-prefix").value = "นาย";
    document.getElementById("sign-fullname").value = "";
    document.getElementById("sign-position").value = "";
    document.getElementById("sign-order").value = "1";
    
    // Reset checked docTypes
    document.querySelectorAll('#modal-signatory input[type="checkbox"]').forEach(cb => cb.checked = false);
    openModal("modal-signatory");
});

// Signatory Modal Confirm (saves to draft)
document.getElementById("btn-confirm-signatory")?.addEventListener("click", () => {
    const prefix = document.getElementById("sign-prefix").value;
    const name = document.getElementById("sign-fullname").value.trim();
    const position = document.getElementById("sign-position").value.trim();
    const order = parseInt(document.getElementById("sign-order").value) || 1;

    if (!name || !position) {
        showToast("กรุณากรอกข้อมูลผู้ลงนามให้ครบถ้วน", "error");
        return;
    }

    const docTypes = [];
    document.querySelectorAll('#modal-signatory input[type="checkbox"]').forEach(cb => {
        if (cb.checked) docTypes.push(cb.value);
    });

    if (settingsStateDraft.editingSignatoryId) {
        // Edit mode
        const sign = settingsStateDraft.signatories.find(s => s.id === settingsStateDraft.editingSignatoryId);
        if (sign) {
            sign.prefix = prefix;
            sign.name = name;
            sign.position = position;
            sign.order = order;
            sign.docTypes = docTypes;
            showToast("แก้ไขข้อมูลแบบร่างผู้ลงนามแล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
        }
    } else {
        // Add mode
        const newId = `SIG${String(settingsStateDraft.signatories.length + 1).padStart(3, "0")}`;
        settingsStateDraft.signatories.push({ id: newId, prefix, name, position, order, docTypes });
        showToast("เพิ่มแบบร่างผู้ลงนามใหม่แล้ว (กรุณากดบันทึกด้านล่างอีกครั้ง)", "info");
    }

    closeModal("modal-signatory");
    renderSignatoriesView();
});

// Edit Signatory
window.editSignatory = function(id) {
    const sign = settingsStateDraft.signatories.find(s => s.id === id);
    if (!sign) return;

    settingsStateDraft.editingSignatoryId = id;
    document.getElementById("modal-sign-title").textContent = "แก้ไขข้อมูลผู้ลงนาม";
    document.getElementById("sign-prefix").value = sign.prefix;
    document.getElementById("sign-fullname").value = sign.name;
    document.getElementById("sign-position").value = sign.position;
    document.getElementById("sign-order").value = sign.order;

    document.querySelectorAll('#modal-signatory input[type="checkbox"]').forEach(cb => {
        cb.checked = sign.docTypes.includes(cb.value);
    });

    openModal("modal-signatory");
};

// Delete Signatory (removes from draft)
window.deleteSignatory = function(id) {
    settingsStateDraft.signatories = settingsStateDraft.signatories.filter(s => s.id !== id);
    
    // Remove references in document assignments draft
    settingsStateDraft.docSignatories.forEach(item => {
        if (item.signatoryId === id) item.signatoryId = "";
        if (item.signatoryIds) {
            item.signatoryIds = item.signatoryIds.filter(x => x !== id);
        }
    });

    renderSignatoriesView();
    showToast("ลบรายชื่อผู้ลงนามออกจากแบบร่างแล้ว (กรุณากดบันทึกด้านล่าง)", "warning");
};

// Multiple Signatories Checkbox assignment helper (Task 3)
window.assignDocSignatoryMultiple = function(docType, signatoryId, isChecked) {
    const target = settingsStateDraft.docSignatories.find(item => item.docType === docType);
    if (target) {
        if (!target.signatoryIds) {
            target.signatoryIds = target.signatoryId ? [target.signatoryId] : [];
        }
        if (isChecked) {
            if (!target.signatoryIds.includes(signatoryId)) {
                target.signatoryIds.push(signatoryId);
            }
        } else {
            target.signatoryIds = target.signatoryIds.filter(id => id !== signatoryId);
        }
        // Save to draft, render view, do not save to database yet
        renderSignatoriesView();
    }
};

// Save Document Signatories and Signatories list to DB (Task 3 & 4)
document.getElementById("btn-save-doc-signatories")?.addEventListener("click", () => {
    // Commit draft to active state
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();
    renderSignatoriesView();
    showToast("บันทึกข้อมูลผู้ลงนามและการมอบหมายเอกสารเรียบร้อยแล้ว", "success");
});

// ---- Staff Types (ประเภทบุคลากร) ----
document.getElementById("btn-add-staff-type")?.addEventListener("click", openAddStaffTypeModal);
document.getElementById("btn-confirm-staff-type")?.addEventListener("click", saveStaffTypeFromModal);
document.getElementById("staff-type-search")?.addEventListener("input", renderStaffTypesView);
document.getElementById("staff-type-filter-status")?.addEventListener("change", renderStaffTypesView);

document.getElementById("btn-save-staff-types")?.addEventListener("click", () => {
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();
    renderStaffTypesView();
    showToast("บันทึกประเภทบุคลากรเรียบร้อยแล้ว", "success");
});

// ---- Positions (ตำแหน่ง) ----
document.getElementById("btn-add-position")?.addEventListener("click", openAddPositionModal);
document.getElementById("btn-confirm-position")?.addEventListener("click", savePositionFromModal);
document.getElementById("position-search")?.addEventListener("input", renderPositionsView);
document.getElementById("position-filter-status")?.addEventListener("change", renderPositionsView);
document.getElementById("position-filter-type")?.addEventListener("change", renderPositionsView);

document.getElementById("btn-save-positions")?.addEventListener("click", () => {
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();
    renderPositionsView();
    showToast("บันทึกตำแหน่งเรียบร้อยแล้ว", "success");
});

// ---- Departments / Learning Areas (แผนก/กลุ่มสาระการเรียนรู้) ----
document.getElementById("btn-add-department")?.addEventListener("click", openAddDepartmentModal);
document.getElementById("btn-confirm-department")?.addEventListener("click", saveDepartmentFromModal);
document.getElementById("department-search")?.addEventListener("input", renderDepartmentsView);
document.getElementById("department-filter-status")?.addEventListener("change", renderDepartmentsView);

document.getElementById("btn-save-departments")?.addEventListener("click", () => {
    settingsState = JSON.parse(JSON.stringify(settingsStateDraft));
    saveStateToLocalStorage();
    renderDepartmentsView();
    showToast("บันทึกแผนก/กลุ่มสาระการเรียนรู้เรียบร้อยแล้ว", "success");
});

// -------------------------------------------------------------
// UTILITIES & INITIAL LOAD
// -------------------------------------------------------------

function formatThaiDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear() + 543; // convert to Buddhist Era
    
    const monthNames = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    
    return `${day} ${monthNames[month]} ${String(year).substring(2)}`;
}

// Attach Theme Toggler Events (Matching original files logic)
function initThemeToggle() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // Load theme setting
    const savedTheme = "light";
    if (savedTheme === "light") {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        updateThemeIcon("light");
    } else {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        updateThemeIcon("dark");
    }

    themeToggleBtn.addEventListener("click", () => {
        if (body.classList.contains("light-mode")) {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            localStorage.setItem("sd_theme", "dark");
            updateThemeIcon("dark");
            showToast("สลับเป็นโหมดมืด (Dark Mode)", "info");
        } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            localStorage.setItem("sd_theme", "light");
            updateThemeIcon("light");
            showToast("สลับเป็นโหมดสว่าง (Light Mode)", "info");
        }
    });
}

function updateThemeIcon(mode) {
    const themeIcon = document.getElementById("theme-icon");
    if (!themeIcon) return;
    
    if (mode === "light") {
        themeIcon.innerHTML = `
            <!-- Sun Icon -->
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    } else {
        themeIcon.innerHTML = `
            <!-- Moon Icon -->
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        `;
    }
}

// Sidebar toggle button collapse
function initSidebarToggle() {
    const btn = document.getElementById("sidebar-toggle-btn");
    const sidebar = document.getElementById("sidebar");
    
    if (btn && sidebar) {
        btn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
}

// Quick navigation triggers from dashboard
function initQuickNav() {
    document.querySelectorAll(".quick-nav-card").forEach(card => {
        card.addEventListener("click", () => {
            const target = card.getAttribute("data-goto");
            if (target) navigateToView(target);
        });
    });
}

// Sidebar Navigation Bindings
document.querySelectorAll(".menu-item[data-view]").forEach(item => {
    item.addEventListener("click", (e) => {
        const viewId = item.getAttribute("data-view");
        navigateToView(viewId);
    });
});

// Close buttons for modals
document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close");
        closeModal(modalId);
    });
});

// Setup settings view side outline links (Task 7)
function setupSettingsOutlines() {
    const views = [
        {
            id: "view-general",
            title: "",
            sections: [
                { id: "section-general-shortcuts", label: "🔗 ทางลัดด่วน" },
                { id: "section-general-school", label: "🏫 ข้อมูลโรงเรียน" },
                { id: "section-general-academic", label: "📅 ปีการศึกษา" },
                { id: "section-general-notifications", label: "🔔 แจ้งเตือนระบบ" }
            ]
        },
        {
            id: "view-schedule",
            title: "",
            sections: [
                { id: "section-schedule-stats", label: "📊 ภาพรวมวันทำงาน" },
                { id: "section-schedule-normal", label: "⏰ เวลาทำงานปกติ" },
                { id: "section-schedule-shifts", label: "🗓️ จัดการกะพิเศษ" },
                { id: "section-schedule-holidays", label: "🏖️ วันหยุดโรงเรียน" }
            ]
        },
        {
            id: "view-permissions",
            title: "",
            sections: [
                { id: "section-permissions-matrix", label: "🛡️ ตารางสิทธิ์เข้าถึง" },
                { id: "section-permissions-users", label: "👥 บทบาทรายบุคคล" }
            ]
        },
        {
            id: "view-signatories",
            title: "",
            sections: [
                { id: "section-signatories-cards", label: "✍️ ผู้ลงนามหลัก" },
                { id: "section-signatories-docs", label: "📄 กำหนดตามเอกสาร" }
            ]
        }
    ];

    views.forEach(v => {
        const viewEl = document.getElementById(v.id);
        if (!viewEl) return;
        
        if (viewEl.querySelector(".settings-with-outline")) return;

        const cards = [...viewEl.querySelectorAll(".glass-card, .settings-overview-grid, .shift-cards-row, .role-summary-row")];
        
        if (v.id === "view-general") {
            if (cards[0]) cards[0].id = "section-general-shortcuts";
            if (cards[1]) cards[1].id = "section-general-school";
            if (cards[2]) cards[2].id = "section-general-academic";
            if (cards[3]) cards[3].id = "section-general-notifications";
        } else if (v.id === "view-schedule") {
            if (cards[0]) cards[0].id = "section-schedule-stats";
            if (cards[1]) cards[1].id = "section-schedule-normal";
            if (cards[2]) cards[2].id = "section-schedule-shifts";
            if (cards[3]) cards[3].id = "section-schedule-holidays";
        } else if (v.id === "view-permissions") {
            // Note: cards[0] is role-summary-row, cards[1] is matrix table, cards[2] is individual roles
            if (cards[1]) cards[1].id = "section-permissions-matrix";
            if (cards[2]) cards[2].id = "section-permissions-users";
        } else if (v.id === "view-signatories") {
            // cards[0] is signatory list, cards[1] is doc signatory card
            if (cards[0]) cards[0].id = "section-signatories-cards";
            if (cards[1]) cards[1].id = "section-signatories-docs";
        }

        const wrapper = document.createElement("div");
        wrapper.className = "settings-with-outline";
        
        const sidebar = document.createElement("div");
        sidebar.className = "settings-outline-sidebar";
        sidebar.innerHTML = `<div class="outline-title">${v.title}</div>`;
        
        v.sections.forEach((s, sIdx) => {
            const a = document.createElement("a");
            a.href = `#${s.id}`;
            a.className = "outline-link" + (sIdx === 0 ? " active" : "");
            a.innerHTML = s.label;
            
            a.addEventListener("click", (e) => {
                e.preventDefault();
                const targetEl = document.getElementById(s.id);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    sidebar.querySelectorAll(".outline-link").forEach(l => l.classList.remove("active"));
                    a.classList.add("active");
                }
            });
            sidebar.appendChild(a);
        });
        
        const contentArea = document.createElement("div");
        contentArea.className = "settings-content-area";
        
        // Move children to contentArea
        const children = [...viewEl.childNodes];
        children.forEach(child => {
            if (child.classList && child.classList.contains("info-banner")) {
                // Keep info banners outside
            } else {
                contentArea.appendChild(child);
            }
        });
        
        wrapper.appendChild(sidebar);
        wrapper.appendChild(contentArea);
        viewEl.appendChild(wrapper);
    });
}

// Document Initial Load
document.addEventListener("DOMContentLoaded", () => {
    initSettingsDatabase();
    initThemeToggle();
    initSidebarToggle();
    initQuickNav();
    setupSettingsOutlines();

    // Default view
    navigateToView("general");
});
