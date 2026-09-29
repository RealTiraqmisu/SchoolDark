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
// มีเฉพาะปี 2567 (ปีที่แล้ว) เป็นต้นทาง — ปีปัจจุบันจะถูก ensureHomeroomYearSeeded() (ตอนนี้อยู่ใน settings/school.html)
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

// Close buttons for modals
document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close");
        closeModal(modalId);
    });
});


// Document Initial Load
document.addEventListener("DOMContentLoaded", () => {
    initSettingsDatabase();
    // theme / sidebar toggle ผูกไว้ที่ app.js ที่เดียว

});
