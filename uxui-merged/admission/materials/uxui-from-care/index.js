// -------------------------------------------------------------
// STATE MANAGEMENT & DATA SEEDING
// -------------------------------------------------------------

// Thailand Public Holidays 2026 with Names
const HOLIDAY_NAMES_2026 = {
    "2026-01-01": "วันขึ้นปีใหม่",
    "2026-03-03": "วันมาฆบูชา",
    "2026-04-06": "วันจักรี",
    "2026-04-13": "วันสงกรานต์",
    "2026-04-14": "วันสงกรานต์",
    "2026-04-15": "วันสงกรานต์",
    "2026-05-01": "วันแรงงานแห่งชาติ",
    "2026-05-04": "วันฉัตรมงคล",
    "2026-06-01": "วันวิสาขบูชา",
    "2026-06-03": "วันพระราชินี",
    "2026-07-28": "วันเฉลิมฯ ร.10",
    "2026-07-29": "วันอาสาฬหบูชา",
    "2026-08-12": "วันแม่แห่งชาติ",
    "2026-10-13": "วันสวรรคต ร.9",
    "2026-10-23": "วันปิยมหาราช",
    "2026-12-05": "วันพ่อแห่งชาติ",
    "2026-12-10": "วันรัฐธรรมนูญ",
    "2026-12-31": "วันสิ้นปี"
};
const THAILAND_HOLIDAYS_2026 = Object.keys(HOLIDAY_NAMES_2026);

// Initial mock data if localStorage is empty
const INITIAL_SETTINGS = {
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
    approvers: ["ครูวิชัย เรียนดี", "ครูสุดา สอนดี"]
};

const INITIAL_TEACHERS = [
    { id: "T001", name: "ครูสมชาย ใจดี", role: "ครูประจำชั้น ม.1/1", sickUsed: 4, vacationUsed: 2, maternityUsed: 0 },
    { id: "T002", name: "ครูรุ่งทิพย์ ส่องแสง", role: "ครูวิชาภาษาไทย ม.2", sickUsed: 0, vacationUsed: 5, maternityUsed: 0 },
    { id: "T003", name: "ครูดวงใจ งามจริง", role: "ครูวิชาวิทยาศาสตร์ ม.3", sickUsed: 3, vacationUsed: 1, maternityUsed: 0 },
    { id: "T004", name: "ครูพิชิต ชัยชนะ", role: "ครูวิชาพละศึกษา", sickUsed: 1, vacationUsed: 8, maternityUsed: 0 }
];

const INITIAL_REQUESTS = [
    {
        id: "REQ001",
        teacherId: "T002",
        teacherName: "ครูรุ่งทิพย์ ส่องแสง",
        leaveType: "vacation",
        startDate: "2026-06-15",
        endDate: "2026-06-16",
        durationType: "full",
        netDays: 2.0,
        reason: "ติดธุระครอบครัวต่างจังหวัด (เยี่ยมญาติผู้ใหญ่)",
        attachment: null,
        status: "approved",
        submittedDate: "2026-06-10",
        comment: "รับทราบและอนุญาตให้ลาได้"
    },
    {
        id: "REQ002",
        teacherId: "T003",
        teacherName: "ครูดวงใจ งามจริง",
        leaveType: "sick",
        startDate: "2026-06-20",
        endDate: "2026-06-20",
        durationType: "full",
        netDays: 1.0,
        reason: "เป็นไข้หวัดใหญ่ ปวดศีรษะ ตัวร้อน",
        attachment: null,
        status: "approved",
        submittedDate: "2026-06-19",
        comment: "อนุญาต รักษาสุขภาพด้วยครับ"
    },
    {
        id: "REQ003",
        teacherId: "T001",
        teacherName: "ครูสมชาย ใจดี",
        leaveType: "sick",
        startDate: "2026-07-06",
        endDate: "2026-07-09",
        durationType: "full",
        netDays: 4.0,
        reason: "ผ่าตัดฟันคุดทันตกรรมตามแพทย์นัด มีใบรับรองแพทย์แนบ",
        attachment: { name: "medical_cert_somchai.pdf", size: "1.2 MB" },
        status: "pending",
        submittedDate: "2026-06-28",
        comment: ""
    },
    {
        id: "REQ004",
        teacherId: "T003",
        teacherName: "ครูดวงใจ งามจริง",
        leaveType: "vacation",
        startDate: "2026-07-13",
        endDate: "2026-07-15",
        durationType: "full",
        netDays: 3.0,
        reason: "เข้าร่วมสัมมนาทางวิชาการและงานวิจัยทางการศึกษา ณ มหาวิทยาลัยเชียงใหม่",
        attachment: null,
        status: "pending",
        submittedDate: "2026-06-29",
        comment: ""
    },
    {
        id: "REQ005",
        teacherId: "T001",
        teacherName: "ครูสมชาย ใจดี",
        leaveType: "vacation",
        startDate: "2026-08-10",
        endDate: "2026-08-10",
        durationType: "full",
        netDays: 1.0,
        reason: "ติดต่อราชการเรื่องโอนย้ายทะเบียนบ้าน",
        attachment: null,
        status: "approved",
        submittedDate: "2026-08-01",
        comment: "รับทราบ"
    },
    {
        id: "REQ006",
        teacherId: "T002",
        teacherName: "ครูรุ่งทิพย์ ส่องแสง",
        leaveType: "sick",
        startDate: "2026-08-10",
        endDate: "2026-08-11",
        durationType: "full",
        netDays: 2.0,
        reason: "อาหารเป็นพิษรุนแรง แพทย์ให้พัก 2 วัน",
        attachment: { name: "medical_006.jpg", size: "850 KB" },
        status: "pending",
        submittedDate: "2026-08-09",
        comment: ""
    },
    {
        id: "REQ007",
        teacherId: "T004",
        teacherName: "ครูพิชิต ชัยชนะ",
        leaveType: "vacation",
        startDate: "2026-08-10",
        endDate: "2026-08-14",
        durationType: "full",
        netDays: 5.0,
        reason: "พักผ่อนประจำปีพาครอบครัวไปเที่ยวต่างประเทศ",
        attachment: null,
        status: "approved",
        submittedDate: "2026-07-25",
        comment: "อนุญาต เดินทางปลอดภัยครับ"
    }
];

// Global State object loaded from LocalStorage
let systemState = {
    settings: {},
    teachers: [],
    requests: [],
    currentRole: "teacher", // 'teacher' or 'head'
    selectedTeacherId: "T001",
    activeView: "form",
    tempAttachment: null,
    currentSettingsStep: 1,
    editingRequestId: null,
    calendarYear: new Date().getFullYear(),
    calendarMonth: new Date().getMonth(),
    calendarDay: new Date().getDate(),
    calendarMode: "month"
};

// Initialize system database from LocalStorage or seed data
function initializeDatabase() {
    // Force refresh requests data to load new overlapping leave mock data
    localStorage.removeItem("schooldark_requests");

    if (!localStorage.getItem("schooldark_settings")) {
        localStorage.setItem("schooldark_settings", JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem("schooldark_teachers")) {
        localStorage.setItem("schooldark_teachers", JSON.stringify(INITIAL_TEACHERS));
    }
    if (!localStorage.getItem("schooldark_requests")) {
        localStorage.setItem("schooldark_requests", JSON.stringify(INITIAL_REQUESTS));
    }

    try {
        systemState.settings = JSON.parse(localStorage.getItem("schooldark_settings")) || INITIAL_SETTINGS;
        systemState.teachers = JSON.parse(localStorage.getItem("schooldark_teachers")) || INITIAL_TEACHERS;
        systemState.requests = JSON.parse(localStorage.getItem("schooldark_requests")) || INITIAL_REQUESTS;
    } catch (e) {
        systemState.settings = INITIAL_SETTINGS;
        systemState.teachers = INITIAL_TEACHERS;
        systemState.requests = INITIAL_REQUESTS;
    }
}

// Call database init immediately on script evaluation
initializeDatabase();

function saveStateToLocalStorage() {
    localStorage.setItem("schooldark_settings", JSON.stringify(systemState.settings));
    localStorage.setItem("schooldark_teachers", JSON.stringify(systemState.teachers));
    localStorage.setItem("schooldark_requests", JSON.stringify(systemState.requests));
}

// -------------------------------------------------------------
// HELPER FUNCTIONS & ALERTS
// -------------------------------------------------------------

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconSvg = "";
    if (type === "success") {
        iconSvg = `<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === "warning") {
        iconSvg = `<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else if (type === "danger") {
        iconSvg = `<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
        iconSvg = `<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
        ${iconSvg}
        <div style="font-size: 13px; font-weight: 500;">${message}</div>
    `;
    container.appendChild(toast);

    // Fade out after 4 seconds
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function openModal(id) {
    document.getElementById(id).classList.add("active");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("active");
}

function updateSidebarVisibility() {
    const role = systemState.currentRole;
    const settingsMenu = document.getElementById("menu-leave-settings") || document.getElementById("sidebar-menu-settings");
    const approveMenu = document.getElementById("menu-leave-approve") || document.getElementById("sidebar-menu-approve");
    
    if (role === "teacher") {
        if (settingsMenu) settingsMenu.style.display = "none";
        if (approveMenu) approveMenu.style.display = "none";
        
        // Redirect if currently on a restricted view
        const active = systemState.activeView || "";
        if (active === "settings" || active === "approve" || active === "leave-settings" || active === "leave-approve") {
            navigateToView("form");
        }
    } else {
        if (settingsMenu) settingsMenu.style.display = "block";
        if (approveMenu) approveMenu.style.display = "block";
    }
    
    updateApprovalBadge();
}

// -------------------------------------------------------------
// DYNAMIC LEAVE CALCULATOR (EXCLUDING WEEKENDS & HOLIDAYS)
// -------------------------------------------------------------

function calculateNetLeaveDays(startDateStr, endDateStr, durationType) {
    if (!startDateStr || !endDateStr) return 0;
    
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    if (end < start) return 0;
    
    let netDays = 0;
    const current = new Date(start);
    
    while (current <= end) {
        const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
        const dateString = current.toISOString().split("T")[0];
        
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);
        
        if (!isWeekend && !isHoliday) {
            netDays++;
        }
        current.setDate(current.getDate() + 1);
    }
    
    if (durationType === "morning" || durationType === "afternoon") {
        return netDays * 0.5;
    }
    
    return netDays;
}

// -------------------------------------------------------------
// UI VIEW NAVIGATION & FLOW SYNCING
// -------------------------------------------------------------

function navigateToView(viewId) {
    if (!viewId) viewId = "form";
    
    let fullViewId = viewId.startsWith("leave-") ? viewId : "leave-" + viewId;
    let cleanViewId = fullViewId.replace("leave-", "");

    // Role based access redirection check
    if (systemState.currentRole === "teacher" && (cleanViewId === "settings" || cleanViewId === "approve")) {
        fullViewId = "leave-form";
        cleanViewId = "form";
    }

    // Delegate to App Router if available
    if (typeof App !== "undefined" && typeof App.navigate === "function") {
        systemState.activeView = cleanViewId;
        App.navigate("leave", fullViewId);
        return;
    }

    // Fallback: Ensure module-leave section is active
    const moduleLeave = document.getElementById("module-leave");
    if (moduleLeave) {
        document.querySelectorAll(".module-section").forEach(m => m.classList.remove("active"));
        moduleLeave.classList.add("active");
    }

    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    // Show target view
    const targetSection = document.getElementById(`view-${fullViewId}`);
    if (targetSection) {
        targetSection.classList.add("active");
        systemState.activeView = cleanViewId;
    }

    // Update sidebar navigation selection
    document.querySelectorAll(".menu-item").forEach(item => {
        if (item.getAttribute("data-view") === fullViewId || item.getAttribute("data-view") === cleanViewId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Update Top Title header
    const titleLabelMap = {
        "settings": "ตั้งค่าการลา (ฝ่ายบริหาร)",
        "form": "ยื่นคำขอลา",
        "approve": "การอนุมัติการลา (ฝั่งผู้อนุมัติ)"
    };
    const titleEl = document.getElementById("current-view-title");
    if (titleEl) {
        titleEl.textContent = titleLabelMap[cleanViewId] || "ระบบการลา";
    }

    // Set step indicators on loading
    syncUserJourneySteps(cleanViewId);
    
    // Refresh content for that specific view
    if (cleanViewId === "settings") {
        renderSettingsView();
    } else if (cleanViewId === "form") {
        renderFormView();
    } else if (cleanViewId === "approve") {
        renderApprovalView();
    }
}

function syncUserJourneySteps(viewId) {
    const journeySection = document.querySelector(`#view-leave-${viewId} .journey-steps`);
    if (!journeySection) return;

    // Reset steps
    const steps = journeySection.querySelectorAll(".journey-step");
    steps.forEach((step, idx) => {
        step.classList.remove("active", "completed");
        if (idx === 0) {
            step.classList.add("active");
        }
    });
}

function updateJourneyStepProgress(viewId, activeStepIndex) {
    const journeySection = document.querySelector(`#view-leave-${viewId} .journey-steps`);
    if (!journeySection) return;

    const steps = journeySection.querySelectorAll(".journey-step");
    steps.forEach((step, idx) => {
        step.classList.remove("active", "completed");
        if (idx < activeStepIndex - 1) {
            step.classList.add("completed");
        } else if (idx === activeStepIndex - 1) {
            step.classList.add("active");
        }
    });
}

// -------------------------------------------------------------
// SECTION 1: SETTINGS VIEW LOGIC
// -------------------------------------------------------------

function renderSettingsView() {
    const settings = systemState.settings;
    
    // Set field values
    document.getElementById("cutoff-date").value = settings.cutoffDate;
    document.getElementById("quota-sick").value = settings.quotaSick;
    document.getElementById("quota-vacation").value = settings.quotaVacation;
    document.getElementById("quota-maternity").value = settings.quotaMaternity;
    
    document.getElementById("rule-half-day").checked = settings.ruleHalfDay;
    document.getElementById("rule-sick-doc").checked = settings.ruleSickDoc;
    document.getElementById("rule-advance-days").value = settings.ruleAdvanceDays;
    
    document.getElementById("rule-rollover").checked = settings.ruleRollover;
    document.getElementById("rule-rollover-max").value = settings.ruleRolloverMax;
    
    // Show/hide rollover max days field based on checkbox
    const rolloverGroup = document.getElementById("rollover-limit-group");
    rolloverGroup.style.display = settings.ruleRollover ? "block" : "none";

    document.getElementById("alert-late-1").value = settings.alertLate1;
    document.getElementById("alert-late-2").value = settings.alertLate2;
    document.getElementById("alert-visa").value = settings.alertVisa;
    document.getElementById("alert-workpermit").value = settings.alertWorkpermit;
    document.getElementById("alert-license").value = settings.alertLicense;

    // Render approvers table
    const tableBody = document.getElementById("approver-table-body");
    tableBody.innerHTML = "";
    
    settings.approvers.forEach((app, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight: 500; color: var(--text-primary);">${app}</td>
            <td style="text-align: center;">
                <button class="btn btn-secondary btn-icon" style="width:28px; height:28px; border-radius:6px; color:var(--danger);" onclick="removeApprover(${idx})">
                    <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Make sure we load the correct active step card in the wizard
    goToSettingsStep(systemState.currentSettingsStep || 1);

    // Update Virtual Preview
    updateAllSettingsPreviews();
}

function removeApprover(index) {
    App.showConfirm({
        title: "ยืนยันการลบ",
        message: "แน่ใจหรือไม่? ชื่อนี้จะถูกลบออกจากรายการผู้อนุมัติ",
        confirmLabel: "ลบ",
        requireNote: false,
        onConfirm: () => {
            systemState.settings.approvers.splice(index, 1);
            saveStateToLocalStorage();
            renderSettingsView();
            showToast("ลบรายชื่อผู้อนุมัติแล้ว", "warning");
        }
    });
}

function addApprover() {
    const select = document.getElementById("new-approver-select");
    const name = select.value;
    
    if (!name) {
        showToast("กรุณาเลือกรายชื่อคุณครู", "warning");
        return;
    }
    
    if (systemState.settings.approvers.includes(name)) {
        showToast("คุณครูรายนี้อยู่ในรายการผู้อนุมัติอยู่แล้ว", "warning");
        return;
    }
    
    systemState.settings.approvers.push(name);
    saveStateToLocalStorage();
    renderSettingsView();
    select.value = "";
    showToast("เพิ่มผู้อนุมัติเรียบร้อย", "success");
    
    // Sync journey step indicator
    updateJourneyStepProgress("settings", 2);
}

function saveSettingsFromDOM() {
    const settings = systemState.settings;
    
    const cutoffDateEl = document.getElementById("cutoff-date");
    if (cutoffDateEl) settings.cutoffDate = cutoffDateEl.value;
    
    const quotaSickEl = document.getElementById("quota-sick");
    if (quotaSickEl) settings.quotaSick = parseInt(quotaSickEl.value) || 0;
    
    const quotaVacationEl = document.getElementById("quota-vacation");
    if (quotaVacationEl) settings.quotaVacation = parseInt(quotaVacationEl.value) || 0;
    
    const quotaMaternityEl = document.getElementById("quota-maternity");
    if (quotaMaternityEl) settings.quotaMaternity = parseInt(quotaMaternityEl.value) || 0;
    
    const ruleHalfDayEl = document.getElementById("rule-half-day");
    if (ruleHalfDayEl) settings.ruleHalfDay = ruleHalfDayEl.checked;
    
    const ruleSickDocEl = document.getElementById("rule-sick-doc");
    if (ruleSickDocEl) settings.ruleSickDoc = ruleSickDocEl.checked;
    
    const ruleAdvanceDaysEl = document.getElementById("rule-advance-days");
    if (ruleAdvanceDaysEl) settings.ruleAdvanceDays = parseInt(ruleAdvanceDaysEl.value) || 0;
    
    const ruleRolloverEl = document.getElementById("rule-rollover");
    if (ruleRolloverEl) settings.ruleRollover = ruleRolloverEl.checked;
    
    const ruleRolloverMaxEl = document.getElementById("rule-rollover-max");
    if (ruleRolloverMaxEl) settings.ruleRolloverMax = parseInt(ruleRolloverMaxEl.value) || 0;
    
    const alertLate1El = document.getElementById("alert-late-1");
    if (alertLate1El) settings.alertLate1 = parseInt(alertLate1El.value) || 0;
    
    const alertLate2El = document.getElementById("alert-late-2");
    if (alertLate2El) settings.alertLate2 = parseInt(alertLate2El.value) || 0;
    
    const alertVisaEl = document.getElementById("alert-visa");
    if (alertVisaEl) settings.alertVisa = parseInt(alertVisaEl.value) || 0;
    
    const alertWorkpermitEl = document.getElementById("alert-workpermit");
    if (alertWorkpermitEl) settings.alertWorkpermit = parseInt(alertWorkpermitEl.value) || 0;
    
    const alertLicenseEl = document.getElementById("alert-license");
    if (alertLicenseEl) settings.alertLicense = parseInt(alertLicenseEl.value) || 0;
    
    saveStateToLocalStorage();
}

function saveAllSettings() {
    saveSettingsFromDOM();
    showToast("บันทึกการตั้งค่าระบบลาทั้งหมดเรียบร้อยแล้ว", "success");
    
    // Complete visual journey state indicator
    updateJourneyStepProgress("settings", 6);

    setTimeout(() => {
        goToSettingsStep(1);
    }, 1000);
}

// Settings Wizard step control
function goToSettingsStep(stepNum) {
    if (systemState.activeView === "settings") {
        saveSettingsFromDOM();
    }
    
    systemState.currentSettingsStep = stepNum;
    
    // Toggle active pane
    document.querySelectorAll(".settings-step-pane").forEach(pane => {
        const paneStep = parseInt(pane.getAttribute("data-step"));
        if (paneStep === stepNum) {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    });
    
    // Update step wizard indicator nodes
    updateJourneyStepProgress("settings", stepNum);
    
    // Update buttons
    const prevBtn = document.getElementById("prev-settings-btn");
    const nextBtn = document.getElementById("next-settings-btn");
    const wizardNavigation = document.getElementById("wizard-navigation");
    
    if (prevBtn && nextBtn && wizardNavigation) {
        prevBtn.style.display = (stepNum === 1) ? "none" : "flex";
        prevBtn.disabled = (stepNum === 1);
        wizardNavigation.style.justifyContent = (stepNum === 1) ? "flex-end" : "space-between";
        
        if (stepNum === 6) {
            nextBtn.innerHTML = `
                บันทึกการตั้งค่าทั้งหมด
                <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:middle;margin-left:4px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            `;
        } else {
            nextBtn.innerHTML = `
                ขั้นตอนถัดไป
                <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:middle;margin-left:4px;"><polyline points="9 18 15 12 9 6"/></svg>
            `;
        }
    }
}

function nextSettingsStep() {
    const step = systemState.currentSettingsStep || 1;
    if (step < 6) {
        goToSettingsStep(step + 1);
        showToast(`บันทึกความคืบหน้าขั้นตอนที่ ${step} เรียบร้อยแล้ว`, "success");
    } else {
        saveAllSettings();
    }
}

function prevSettingsStep() {
    const step = systemState.currentSettingsStep || 1;
    if (step > 1) {
        goToSettingsStep(step - 1);
        showToast(`ย้อนกลับมายังขั้นตอนที่ ${step - 1}`, "info");
    }
}

// -------------------------------------------------------------
// SECTION 2: LEAVE FORM & DASHBOARD VIEW LOGIC
// -------------------------------------------------------------

function renderFormView() {
    if (!systemState.teachers || systemState.teachers.length === 0) {
        initializeDatabase();
    }
    let activeTeacher = systemState.teachers.find(t => t.id === systemState.selectedTeacherId);
    if (!activeTeacher && systemState.teachers && systemState.teachers.length > 0) {
        activeTeacher = systemState.teachers[0];
        systemState.selectedTeacherId = activeTeacher.id;
    }
    if (!activeTeacher) return;
    
    const settings = systemState.settings || INITIAL_SETTINGS;
    
    // 1. Update visual circular progress rings & quotas
    updateQuotaCard("sick", settings.quotaSick, activeTeacher.sickUsed);
    updateQuotaCard("vacation", settings.quotaVacation, activeTeacher.vacationUsed);
    updateQuotaCard("maternity", settings.quotaMaternity, activeTeacher.maternityUsed);
    
    // 2. Hide or show half-day duration based on settings rule
    const morningOpt = document.getElementById("half-day-morning-option");
    const afternoonOpt = document.getElementById("half-day-afternoon-option");
    if (settings.ruleHalfDay) {
        if (morningOpt) morningOpt.style.display = "block";
        if (afternoonOpt) afternoonOpt.style.display = "block";
    } else {
        if (morningOpt) morningOpt.style.display = "none";
        if (afternoonOpt) afternoonOpt.style.display = "none";
        // Reset radio selection if half day was selected but now disabled
        const selectedDuration = document.querySelector('input[name="leave-duration-type"]:checked');
        if (selectedDuration && selectedDuration.value !== "full") {
            const fullRadio = document.querySelector('input[name="leave-duration-type"][value="full"]');
            if (fullRadio) fullRadio.checked = true;
        }
    }
    
    // 3. Render teacher submitter dropdown if head teacher is active
    // This allows simulating leaves on behalf of different teachers in the mockup
    const submitterContainer = document.getElementById("teacher-submitter-container");
    const submitterSelect = document.getElementById("leave-teacher-name");
    
    if (systemState.currentRole === "head") {
        if (submitterContainer) submitterContainer.style.display = "block";
        if (submitterSelect) {
            submitterSelect.innerHTML = "";
            systemState.teachers.forEach(t => {
                const opt = document.createElement("option");
                opt.value = t.id;
                opt.textContent = `${t.name} (${t.role})`;
                opt.selected = t.id === systemState.selectedTeacherId;
                submitterSelect.appendChild(opt);
            });
        }
    } else {
        if (submitterContainer) submitterContainer.style.display = "none";
    }
    
    // Reset temporary attachment state
    systemState.tempAttachment = null;
    const previewContainer = document.getElementById("file-preview-container");
    if (previewContainer) previewContainer.innerHTML = "";

    // 4. Render My Leave History
    renderHistoryTable();
    updateLiveCalculatedDays();
    updateFormButtonState();
}

function updateQuotaCard(type, maxQuota, used) {
    const remaining = Math.max(0, maxQuota - used);
    
    const quotaVal = document.getElementById(`dashboard-quota-${type}`);
    if (quotaVal) quotaVal.textContent = remaining;
    
    const limitVal = document.getElementById(`dashboard-limit-${type}`);
    if (limitVal) limitVal.textContent = `สิทธิ์การลาเต็ม: ${maxQuota} วัน (ใช้ไปแล้ว ${used} วัน)`;
    
    // Circular calculations: diameter = 60, circumference = 2 * PI * r = 2 * 3.14159 * 30 = 188.4
    const circle = document.getElementById(`circle-${type}`);
    const percentText = document.getElementById(`percent-text-${type}`);
    
    const percentage = maxQuota > 0 ? (remaining / maxQuota) : 0;
    const offset = 188.4 - (percentage * 188.4);
    
    if (circle) circle.style.strokeDashoffset = offset;
    if (percentText) percentText.textContent = `${Math.round(percentage * 100)}%`;
}

function updateLiveCalculatedDays() {
    const startEl = document.getElementById("leave-start-date");
    const endEl = document.getElementById("leave-end-date");
    const leaveTypeEl = document.getElementById("leave-type");
    const durationRadio = document.querySelector('input[name="leave-duration-type"]:checked');
    
    if (!startEl || !endEl || !leaveTypeEl || !durationRadio) return;
    
    const start = startEl.value;
    const end = endEl.value;
    const leaveType = leaveTypeEl.value;
    const duration = durationRadio.value;
    
    const daysNum = calculateNetLeaveDays(start, end, duration);
    const calculatedDaysNum = document.getElementById("calculated-days-num");
    if (calculatedDaysNum) calculatedDaysNum.textContent = daysNum;
    
    // Sync journey step indicator based on form completion
    if (leaveType) {
        updateJourneyStepProgress("form", 2);
    }
    if (start && end) {
        updateJourneyStepProgress("form", 3);
    }
    if (daysNum > 0) {
        updateJourneyStepProgress("form", 4);
    }

    // Dynamic warning checking: Sick Leave > 3 days requires medical cert doc
    const warnBanner = document.getElementById("medical-cert-warning");
    const attachmentLabel = document.getElementById("attachment-label");
    
    if (leaveType === "sick" && daysNum >= 3 && systemState.settings.ruleSickDoc) {
        if (warnBanner) warnBanner.style.display = "flex";
        if (attachmentLabel) attachmentLabel.innerHTML = `หลักฐานเอกสารแนบ (ใบรับรองแพทย์) <span class="required">*</span>`;
    } else {
        if (warnBanner) warnBanner.style.display = "none";
        if (attachmentLabel) attachmentLabel.innerHTML = "หลักฐานเอกสารแนบ";
    }
}

function handleFileSelection(file) {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showToast("ไฟล์มีขนาดใหญ่เกินกว่า 5MB", "danger");
        return;
    }

    const friendlySize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    systemState.tempAttachment = {
        name: file.name,
        size: friendlySize
    };
    
    const previewContainer = document.getElementById("file-preview-container");
    previewContainer.innerHTML = `
        <div class="file-preview-item">
            <div class="file-preview-info">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span class="file-preview-name">${file.name} (${friendlySize})</span>
            </div>
            <button class="file-remove-btn" type="button" onclick="removeSelectedFile()">&times;</button>
        </div>
    `;
    
    showToast("แนบไฟล์เอกสารเรียบร้อยแล้ว", "success");
    updateJourneyStepProgress("form", 5);
}

function removeSelectedFile() {
    systemState.tempAttachment = null;
    document.getElementById("file-preview-container").innerHTML = "";
    document.getElementById("leave-attachment").value = "";
    showToast("นำไฟล์แนบออกแล้ว", "warning");
}

function openSubmitReview() {
    const leaveType = document.getElementById("leave-type").value;
    const start = document.getElementById("leave-start-date").value;
    const end = document.getElementById("leave-end-date").value;
    const duration = document.querySelector('input[name="leave-duration-type"]:checked').value;
    const reason = document.getElementById("leave-reason").value;
    
    if (!leaveType) {
        showToast("กรุณาเลือกประเภทการลา", "warning");
        return;
    }
    if (!start || !end) {
        showToast("กรุณาระบุวันเริ่มต้นและสิ้นสุดการลา", "warning");
        return;
    }
    if (new Date(end) < new Date(start)) {
        showToast("วันสิ้นสุดการลาต้องไม่น้อยกว่าวันเริ่มต้น", "danger");
        return;
    }
    if (!reason.trim()) {
        showToast("กรุณากรอกเหตุผลและความจำเป็นของการลา", "warning");
        return;
    }
    
    const daysNum = calculateNetLeaveDays(start, end, duration);
    if (daysNum === 0) {
        showToast("คำขอลาของท่านตรงกับวันหยุดทั้งหมด หรือไม่มีวันทำการ", "warning");
        return;
    }

    // Rule validation check: Medical cert required for sick leave > 3 days
    if (leaveType === "sick" && daysNum >= 3 && systemState.settings.ruleSickDoc && !systemState.tempAttachment) {
        App.showError("ไม่สามารถบันทึกคำขอได้<br><span style='font-size:14px;color:var(--text-muted);'>กรุณาแนบใบรับรองแพทย์เนื่องจากลาป่วยเกิน 3 วัน ตามกฎระเบียบของโรงเรียน</span>");
        return;
    }

    // Rule validation check: Advance notice requirement
    if (leaveType !== "sick" && systemState.settings.ruleAdvanceDays > 0) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const startDate = new Date(start);
        
        const diffTime = startDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < systemState.settings.ruleAdvanceDays) {
            showToast(`ต้องยื่นใบลากล่วงหน้าอย่างน้อย ${systemState.settings.ruleAdvanceDays} วัน สำหรับการลานี้`, "warning");
            // Allow submission but warn user (as mock experience, we allow it with warning)
        }
    }

    // Populate Modal Summary details
    const activeTeacher = systemState.teachers.find(t => t.id === systemState.selectedTeacherId);
    document.getElementById("sum-teacher-name").textContent = activeTeacher.name;
    
    const typeLabel = { "sick": "ลาป่วย", "vacation": "ลาพักผ่อน / ลากิจ", "maternity": "ลาคลอดบุตร" };
    document.getElementById("sum-leave-type").textContent = typeLabel[leaveType] || leaveType;
    document.getElementById("sum-leave-dates").textContent = `${formatThaiDate(start)} ถึง ${formatThaiDate(end)}`;
    
    const durationLabel = { "full": "ลาเต็มวัน", "morning": "ลาครึ่งเช้า (0.5 วัน)", "afternoon": "ลาครึ่งบ่าย (0.5 วัน)" };
    document.getElementById("sum-leave-duration-type").textContent = durationLabel[duration];
    document.getElementById("sum-calculated-days").textContent = `${daysNum} วัน`;
    document.getElementById("sum-leave-reason").textContent = reason;
    
    const attachmentRow = document.getElementById("sum-attachment-row");
    if (systemState.tempAttachment) {
        attachmentRow.style.display = "flex";
        document.getElementById("sum-leave-attachment").textContent = systemState.tempAttachment.name;
    } else {
        attachmentRow.style.display = "none";
    }

    openModal("modal-review");
    updateJourneyStepProgress("form", 5);
}

function processLeaveSubmission() {
    const leaveType = document.getElementById("leave-type").value;
    const start = document.getElementById("leave-start-date").value;
    const end = document.getElementById("leave-end-date").value;
    const duration = document.querySelector('input[name="leave-duration-type"]:checked').value;
    const reason = document.getElementById("leave-reason").value;
    const activeTeacher = systemState.teachers.find(t => t.id === systemState.selectedTeacherId);
    
    const daysNum = calculateNetLeaveDays(start, end, duration);
    const isEditMode = !!systemState.editingRequestId;
    
    if (systemState.editingRequestId) {
        // Find existing request and update it
        const req = systemState.requests.find(r => r.id === systemState.editingRequestId);
        if (req) {
            req.leaveType = leaveType;
            req.startDate = start;
            req.endDate = end;
            req.durationType = duration;
            req.netDays = daysNum;
            req.reason = reason;
            req.attachment = systemState.tempAttachment;
            // Reset status back to pending, clear comments since it is edited
            req.status = "pending";
            req.comment = "";
            showToast("แก้ไขข้อมูลใบลาสำเร็จ", "success");
        }
        systemState.editingRequestId = null;
    } else {
        // Create new request
        const newRequest = {
            id: `REQ${String(systemState.requests.length + 1).padStart(3, "0")}`,
            teacherId: activeTeacher.id,
            teacherName: activeTeacher.name,
            leaveType: leaveType,
            startDate: start,
            endDate: end,
            durationType: duration,
            netDays: daysNum,
            reason: reason,
            attachment: systemState.tempAttachment,
            status: "pending",
            submittedDate: new Date().toISOString().split("T")[0],
            comment: ""
        };
        systemState.requests.push(newRequest);
        showToast("บันทึกส่งใบคำขอสำเร็จ", "success");
    }
    
    saveStateToLocalStorage();
    
    // Reset Form
    document.getElementById("leave-request-form").reset();
    systemState.tempAttachment = null;
    const previewContainer = document.getElementById("file-preview-container");
    if (previewContainer) previewContainer.innerHTML = "";
    
    closeModal("modal-review");
    
    // Trigger Success feedback
    document.getElementById("success-title").textContent = isEditMode ? "แก้ไขใบลาสำเร็จ!" : "ส่งใบคำขอลาสำเร็จ!";
    document.getElementById("success-desc").textContent = `ใบ${typeLabelShort(leaveType)}จำนวน ${daysNum} วัน ได้รับการลงทะเบียนในระบบเรียบร้อยแล้ว`;
    openModal("modal-success");
    
    // Reload UI tables and badges
    renderFormView();
    updateApprovalBadge();
    updateFormButtonState();
}

function renderHistoryTable(filterStatus = "all") {
    const tableBody = document.getElementById("history-table-body");
    tableBody.innerHTML = "";
    
    // Filter history for the current selected teacher only
    const myRequests = systemState.requests.filter(r => r.teacherId === systemState.selectedTeacherId);
    
    const filtered = myRequests.filter(r => {
        if (filterStatus === "all") return true;
        return r.status === filterStatus;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px;">ไม่พบประวัติการส่งคำขอลา</td></tr>`;
        return;
    }

    // Sort requests by submission date descending
    filtered.sort((a, b) => b.id.localeCompare(a.id));

    filtered.forEach(req => {
        const tr = document.createElement("tr");
        
        let statusBadge = "";
        if (req.status === "pending") {
            statusBadge = `<span class="badge badge-pending">รออนุมัติ</span>`;
        } else if (req.status === "approved") {
            statusBadge = `<span class="badge badge-approved">อนุมัติ</span>`;
        } else {
            statusBadge = `<span class="badge badge-rejected">ปฏิเสธ</span>`;
        }
        
        const typeLabel = { "sick": "ลาป่วย", "vacation": "ลากิจ / พักผ่อน", "maternity": "ลาคลอด" };
        const durationDisplay = req.durationType !== "full" ? " (ครึ่งวัน)" : "";

        tr.innerHTML = `
            <td>${formatThaiDate(req.submittedDate)}</td>
            <td style="font-weight: 500; color: var(--text-primary);">${typeLabel[req.leaveType] || req.leaveType}${durationDisplay}</td>
            <td>${formatThaiDate(req.startDate)} - ${formatThaiDate(req.endDate)}</td>
            <td style="text-align: center; font-weight: 600;">${req.netDays}</td>
            <td>${statusBadge}</td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 4px; justify-content: center;">
                    <button class="btn btn-secondary btn-icon" style="width:28px; height:28px; border-radius:6px; padding:0;" onclick="viewRequestDetails('${req.id}')" title="ดูรายละเอียด">
                        <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                    ${req.status === "pending" ? `
                    <button class="btn btn-secondary btn-icon" style="width:28px; height:28px; border-radius:6px; padding:0; color: var(--warning);" onclick="editRequest('${req.id}')" title="แก้ไขข้อมูล">
                        <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </button>
                    ` : ""}
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function editRequest(reqId) {
    const req = systemState.requests.find(r => r.id === reqId);
    if (!req) return;
    
    if (req.status !== "pending") {
        showToast("ไม่สามารถแก้ไขใบลาที่ผ่านการพิจารณาแล้วได้", "danger");
        return;
    }
    
    systemState.editingRequestId = req.id;
    
    // Populate Form Fields
    document.getElementById("leave-type").value = req.leaveType;
    document.getElementById("leave-start-date").value = req.startDate;
    document.getElementById("leave-end-date").value = req.endDate;
    
    // Set radio button for duration
    const radio = document.querySelector(`input[name="leave-duration-type"][value="${req.durationType}"]`);
    if (radio) radio.checked = true;
    
    document.getElementById("leave-reason").value = req.reason;
    
    // Handle attachment preview if exists
    if (req.attachment) {
        systemState.tempAttachment = req.attachment;
        const previewContainer = document.getElementById("file-preview-container");
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div class="file-preview-item">
                    <div class="file-preview-info">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        <span class="file-preview-name">${req.attachment.name} (${req.attachment.size})</span>
                    </div>
                    <button class="file-remove-btn" type="button" onclick="removeSelectedFile()">&times;</button>
                </div>
            `;
        }
    } else {
        systemState.tempAttachment = null;
        const previewContainer = document.getElementById("file-preview-container");
        if (previewContainer) previewContainer.innerHTML = "";
    }
    
    // Update days calculations
    updateLiveCalculatedDays();
    
    // Update Form Submit Button Text and Show Cancel Button
    updateFormButtonState();
    
    // Scroll up to the form
    document.getElementById("leave-request-form").scrollIntoView({ behavior: "smooth" });
    showToast(`กำลังแก้ไขใบลา รหัส ${req.id}`, "info");
}

function updateFormButtonState() {
    const submitBtn = document.getElementById("review-leave-btn");
    if (!submitBtn) return;
    
    if (systemState.editingRequestId) {
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:middle;margin-right:4px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            บันทึกการแก้ไขข้อมูลใบลา
        `;
        
        // Append a cancel button if not already present
        let cancelBtn = document.getElementById("cancel-edit-btn");
        if (!cancelBtn) {
            cancelBtn = document.createElement("button");
            cancelBtn.type = "button";
            cancelBtn.id = "cancel-edit-btn";
            cancelBtn.className = "btn btn-secondary";
            cancelBtn.style.width = "100%";
            cancelBtn.style.marginTop = "8px";
            cancelBtn.innerHTML = "ยกเลิกการแก้ไข";
            cancelBtn.onclick = cancelEditing;
            submitBtn.parentNode.appendChild(cancelBtn);
        }
    } else {
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            ตรวจสอบรายละเอียดและส่งใบลา
        `;
        const cancelBtn = document.getElementById("cancel-edit-btn");
        if (cancelBtn) cancelBtn.remove();
    }
}

function cancelEditing() {
    systemState.editingRequestId = null;
    document.getElementById("leave-request-form").reset();
    systemState.tempAttachment = null;
    const previewContainer = document.getElementById("file-preview-container");
    if (previewContainer) previewContainer.innerHTML = "";
    updateLiveCalculatedDays();
    updateFormButtonState();
    showToast("ยกเลิกการแก้ไขแล้ว", "warning");
}

// -------------------------------------------------------------
// SECTION 3: LEAVE APPROVAL VIEW LOGIC
// -------------------------------------------------------------

function renderApprovalView(filterStatus = "all") {
    const tableBody = document.getElementById("approval-table-body");
    tableBody.innerHTML = "";

    if (systemState.currentRole !== "head") {
        tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--danger); padding: 32px; font-weight:600;">ปฏิเสธการเข้าถึง: สำหรับหัวหน้าครูเท่านั้น</td></tr>`;
        return;
    }

    // Populate profile teacher select dropdown
    const profileSelect = document.getElementById("profile-teacher-select");
    if (profileSelect && profileSelect.options.length <= 1) {
        systemState.teachers.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t.id;
            opt.textContent = t.name;
            profileSelect.appendChild(opt);
        });
    }

    // Render leave calendar
    renderLeaveCalendar();

    const filtered = systemState.requests.filter(r => {
        if (filterStatus === "all") return true;
        return r.status === filterStatus;
    });

    // Display selected approver
    document.getElementById("current-approver-name-label").textContent = systemState.settings.approvers[0] || "ผู้บริหารสูงสุด";

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 32px;">ไม่พบรายการคำขอการลาในหมวดหมู่นี้</td></tr>`;
        return;
    }

    // Sort requests by pending first, then by id descending
    filtered.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return b.id.localeCompare(a.id);
    });

    filtered.forEach(req => {
        const tr = document.createElement("tr");
        
        let statusBadge = "";
        let actionButtons = "";
        
        if (req.status === "pending") {
            statusBadge = `<span class="badge badge-pending">รออนุมัติ</span>`;
            actionButtons = `
                <div style="display: flex; gap: 6px; justify-content: center;">
                    <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px; border-radius: 6px;" onclick="approveRequestDirect('${req.id}')">อนุมัติ</button>
                    <button class="btn btn-danger" style="padding: 6px 12px; font-size: 11px; border-radius: 6px;" onclick="rejectRequestDirect('${req.id}')">ปฏิเสธ</button>
                </div>
            `;
        } else if (req.status === "approved") {
            statusBadge = `<span class="badge badge-approved">อนุมัติ</span>`;
            actionButtons = `
                <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                    <span style="font-size:10px; color: var(--text-muted); text-align:center; display:block;">อนุมัติโดย: ${systemState.settings.approvers[0] || "ผู้อนุมัติ"}</span>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-radius: 4px; line-height: 1;" onclick="resetRequestStatus('${req.id}')">เปลี่ยนสถานะ</button>
                </div>
            `;
        } else {
            statusBadge = `<span class="badge badge-rejected">ไม่อนุมัติ</span>`;
            actionButtons = `
                <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                    <span style="font-size:10px; color: var(--danger); text-align:center; display:block;">ปฏิเสธคำขอการลา</span>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-radius: 4px; line-height: 1;" onclick="resetRequestStatus('${req.id}')">เปลี่ยนสถานะ</button>
                </div>
            `;
        }

        const typeLabel = { "sick": "ลาป่วย", "vacation": "ลากิจ / พักผ่อน", "maternity": "ลาคลอด" };
        const durationDisplay = req.durationType !== "full" ? " (ครึ่งวัน)" : "";
        
        let fileLink = "-";
        if (req.attachment) {
            fileLink = `<a href="#" style="color: var(--primary); font-weight: 500;" onclick="viewAttachmentMock('${req.attachment.name}'); return false;">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:middle;margin-right:2px;"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </a>`;
        }

        tr.innerHTML = `
            <td>${formatThaiDate(req.submittedDate)}</td>
            <td style="font-weight: 600; color: var(--text-primary);">${req.teacherName}</td>
            <td>${typeLabel[req.leaveType] || req.leaveType}${durationDisplay}</td>
            <td>${formatThaiDate(req.startDate)} - ${formatThaiDate(req.endDate)}</td>
            <td style="text-align: center; font-weight: 600;">${req.netDays}</td>
            <td style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${req.reason}">${req.reason}</td>
            <td style="text-align: center;">${fileLink}</td>
            <td>${statusBadge}</td>
            <td>${actionButtons}</td>
            <td style="text-align: center;">
                <button class="btn btn-secondary btn-icon" style="width:28px; height:28px; border-radius:6px; padding:0;" onclick="viewRequestDetails('${req.id}')">
                    <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function updateApprovalBadge() {
    const pendingCount = systemState.requests.filter(r => r.status === "pending").length;
    const badge = document.getElementById("sidebar-approval-badge");
    if (pendingCount > 0) {
        badge.textContent = pendingCount;
        badge.style.display = "inline-flex";
    } else {
        badge.style.display = "none";
    }
}

// -------------------------------------------------------------
// LEAVE CALENDAR OVERVIEW FOR APPROVERS
// -------------------------------------------------------------

function parseDateString(str) {
    if (!str) return null;
    const parts = str.split("-");
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

function renderLeaveCalendar() {
    const container = document.getElementById("leave-calendar-container");
    const label = document.getElementById("calendar-month-year-label");
    if (!container || !label) return;

    container.innerHTML = "";

    const mode = systemState.calendarMode || "month";
    const year = systemState.calendarYear;
    const month = systemState.calendarMonth;
    const day = systemState.calendarDay || 1;
    const targetDate = new Date(year, month, day);

    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const thaiMonthsFull = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const thaiDaysFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

    if (mode === "month") {
        label.textContent = `${thaiMonthsFull[month]} ${year + 543}`;
        renderMonthCalendarView(container, year, month);
    } else if (mode === "week") {
        const dayOfWeek = targetDate.getDay();
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        label.textContent = `${startOfWeek.getDate()} ${thaiMonthsShort[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${thaiMonthsShort[endOfWeek.getMonth()]} ${endOfWeek.getFullYear() + 543}`;
        renderWeekCalendarView(container, startOfWeek);
    } else if (mode === "day") {
        label.textContent = `วัน${thaiDaysFull[targetDate.getDay()]}ที่ ${targetDate.getDate()} ${thaiMonthsFull[targetDate.getMonth()]} ${year + 543}`;
        renderDayCalendarView(container, targetDate);
    }
}

function renderMonthCalendarView(container, year, month) {
    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    const dayHeaders = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "calendar-header-day";
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const isCurrentMonthYear = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    // Render inactive days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const cell = document.createElement("div");
        cell.className = "calendar-cell inactive";
        const dateNum = prevMonthTotalDays - i;
        cell.innerHTML = `<span class="calendar-cell-date">${dateNum}</span>`;
        grid.appendChild(cell);
    }

    // Render active days of current month
    for (let d = 1; d <= totalDays; d++) {
        const cell = document.createElement("div");
        cell.className = "calendar-cell";
        
        const currentCellDate = new Date(year, month, d);
        const dayOfWeek = currentCellDate.getDay();
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

        if (isWeekend) cell.classList.add("weekend");
        if (isHoliday) {
            cell.classList.add("holiday");
            cell.title = "วันหยุดนักขัตฤกษ์";
        }
        if (isCurrentMonthYear && d === todayDate) cell.classList.add("today");

        cell.innerHTML = `<span class="calendar-cell-date">${d}</span>`;

        if (!isWeekend && !isHoliday) {
            const activeLeaves = systemState.requests.filter(req => {
                const start = parseDateString(req.startDate);
                const end = parseDateString(req.endDate);
                if (!start || !end) return false;
                const cellTime = currentCellDate.getTime();
                return cellTime >= start.getTime() && cellTime <= end.getTime();
            });

            const MAX_VISIBLE = 2;
            const visibleLeaves = activeLeaves.slice(0, MAX_VISIBLE);
            const overflowCount = activeLeaves.length - MAX_VISIBLE;

            visibleLeaves.forEach(req => {
                const pill = document.createElement("div");
                pill.className = `calendar-leave-pill ${req.leaveType} ${req.status}`;
                const shortName = req.teacherName.split(" ")[0];
                const typeLabel = { "sick": "ป่วย", "vacation": "กิจ/พัก", "maternity": "คลอด" };
                const statusIndicator = req.status === "pending" ? `
                    <svg viewBox="0 0 24 24" style="width: 11px; height: 11px; stroke: currentColor; fill: none; stroke-width: 2.5; display: inline-block; vertical-align: middle; margin-right: 3px;">
                        <path d="M5 2h14M5 22h14M17 2v6.26a1 1 0 0 1-.29.7l-4.42 4.42a1 1 0 0 0 0 1.42l4.42 4.42a1 1 0 0 1 .29.7V22M7 2v6.26a1 1 0 0 0 .29.7V22"/>
                    </svg>
                ` : "";
                pill.innerHTML = `${statusIndicator}${shortName} (${typeLabel[req.leaveType] || req.leaveType})`;
                pill.title = `${req.teacherName} - ${typeLabelShort(req.leaveType)} (${req.netDays} วัน): ${req.reason}`;
                pill.onclick = (e) => {
                    e.stopPropagation();
                    viewRequestDetails(req.id);
                };
                cell.appendChild(pill);
            });

            if (overflowCount > 0) {
                const moreBadge = document.createElement("div");
                moreBadge.className = "calendar-more-badge";
                moreBadge.textContent = `+${overflowCount} เพิ่มเติม`;
                moreBadge.title = `ดูรายชื่อผู้ลาทั้งหมด (${activeLeaves.length} คน)`;
                moreBadge.onclick = (e) => {
                    e.stopPropagation();
                    openDayLeavesModal(currentCellDate);
                };
                cell.appendChild(moreBadge);
            }

            if (activeLeaves.length > 0) {
                cell.style.cursor = "pointer";
                cell.onclick = () => openDayLeavesModal(currentCellDate);
            }
        } else if (isHoliday) {
            const holidayName = HOLIDAY_NAMES_2026[dateString] || "วันหยุดนักขัตฤกษ์";
            const holidaySpan = document.createElement("span");
            holidaySpan.className = "calendar-holiday-name";
            holidaySpan.textContent = holidayName;
            cell.appendChild(holidaySpan);
        }

        grid.appendChild(cell);
    }

    // Padding for next month
    const gridCellCount = firstDayIndex + totalDays;
    const remainingCells = 42 - gridCellCount;
    const totalPaddedCells = (remainingCells >= 7) ? 35 : 42;
    const finalPaddingCount = totalPaddedCells - gridCellCount;

    for (let i = 1; i <= finalPaddingCount; i++) {
        const cell = document.createElement("div");
        cell.className = "calendar-cell inactive";
        cell.innerHTML = `<span class="calendar-cell-date">${i}</span>`;
        grid.appendChild(cell);
    }

    container.appendChild(grid);
}

function renderWeekCalendarView(container, startOfWeek) {
    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    const dayHeaders = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "calendar-header-day";
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const currentCellDate = new Date(startOfWeek);
        currentCellDate.setDate(startOfWeek.getDate() + i);

        const d = currentCellDate.getDate();
        const m = currentCellDate.getMonth();
        const y = currentCellDate.getFullYear();

        const cell = document.createElement("div");
        cell.className = "calendar-cell";
        cell.style.minHeight = "140px";

        const dayOfWeek = currentCellDate.getDay();
        const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

        if (isWeekend) cell.classList.add("weekend");
        if (isHoliday) {
            cell.classList.add("holiday");
            cell.title = "วันหยุดนักขัตฤกษ์";
        }
        if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d) {
            cell.classList.add("today");
        }

        cell.innerHTML = `<span class="calendar-cell-date">${d} ${thaiMonthsShort[m]}</span>`;

        if (!isWeekend && !isHoliday) {
            const activeLeaves = systemState.requests.filter(req => {
                const start = parseDateString(req.startDate);
                const end = parseDateString(req.endDate);
                if (!start || !end) return false;
                const cellTime = currentCellDate.getTime();
                return cellTime >= start.getTime() && cellTime <= end.getTime();
            });

            activeLeaves.forEach(req => {
                const pill = document.createElement("div");
                pill.className = `calendar-leave-pill ${req.leaveType} ${req.status}`;
                const typeLabel = { "sick": "ป่วย", "vacation": "กิจ/พัก", "maternity": "คลอด" };
                pill.innerHTML = `${req.teacherName.split(" ")[0]} (${typeLabel[req.leaveType] || req.leaveType})`;
                pill.title = `${req.teacherName} - ${typeLabelShort(req.leaveType)} (${req.netDays} วัน): ${req.reason}`;
                pill.onclick = (e) => {
                    e.stopPropagation();
                    viewRequestDetails(req.id);
                };
                cell.appendChild(pill);
            });
        } else if (isHoliday) {
            const holidayName = HOLIDAY_NAMES_2026[dateString] || "วันหยุดนักขัตฤกษ์";
            const holidaySpan = document.createElement("span");
            holidaySpan.className = "calendar-holiday-name";
            holidaySpan.textContent = holidayName;
            cell.appendChild(holidaySpan);
        }

        grid.appendChild(cell);
    }

    container.appendChild(grid);
}

function renderDayCalendarView(container, targetDate) {
    const dayView = document.createElement("div");
    dayView.className = "calendar-day-view-container";

    const y = targetDate.getFullYear();
    const m = targetDate.getMonth();
    const d = targetDate.getDate();
    const dayOfWeek = targetDate.getDay();
    const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

    let statusTag = `<span class="badge badge-approved" style="background:rgba(16,185,129,0.15);color:var(--success);">วันทำการปกติ</span>`;
    if (isWeekend) {
        statusTag = `<span class="badge badge-rejected" style="background:rgba(239,68,68,0.15);color:var(--danger);">วันหยุดเสาร์-อาทิตย์</span>`;
    } else if (isHoliday) {
        const holidayName = HOLIDAY_NAMES_2026[dateString] || "วันหยุดนักขัตฤกษ์";
        statusTag = `<span class="badge badge-pending" style="background:rgba(245,158,11,0.15);color:var(--warning);">${holidayName}</span>`;
    }

    const activeLeaves = systemState.requests.filter(req => {
        const start = parseDateString(req.startDate);
        const end = parseDateString(req.endDate);
        if (!start || !end) return false;
        const cellTime = targetDate.getTime();
        return cellTime >= start.getTime() && cellTime <= end.getTime();
    });

    let contentHtml = "";

    if (activeLeaves.length === 0) {
        contentHtml = `
            <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
                <svg viewBox="0 0 24 24" style="width: 40px; height: 40px; stroke: currentColor; fill: none; stroke-width: 1.5; margin-bottom: 8px; opacity: 0.5; display:inline-block;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p style="margin: 0; font-size: 14px; font-weight: 500;">ไม่มีบุคลากรครูยื่นขอลาในวันนี้ (ปฏิบัติงานปกติ)</p>
            </div>
        `;
    } else {
        contentHtml = activeLeaves.map(req => {
            const typeLabel = { "sick": "ลาป่วย", "vacation": "ลาพักผ่อน / ลากิจ", "maternity": "ลาคลอดบุตร" };
            return `
                <div class="calendar-day-card">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--primary), var(--info)); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; font-family:var(--font-heading);">
                            ${req.teacherName.slice(0, 2)}
                        </div>
                        <div>
                            <div style="font-weight:600; color:var(--text-primary); font-size:14px;">${req.teacherName}</div>
                            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
                                เหตุผล: ${req.reason}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="text-align:right;">
                            <span class="calendar-leave-pill ${req.leaveType} ${req.status}" style="display:inline-flex;">
                                ${typeLabel[req.leaveType] || req.leaveType} (${req.netDays} วัน)
                            </span>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                                ${formatThaiDate(req.startDate)} - ${formatThaiDate(req.endDate)}
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-icon" style="width:32px; height:32px; border-radius:6px;" onclick="viewRequestDetails('${req.id}')">
                            <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    dayView.innerHTML = `
        <div class="calendar-day-header">
            <div>
                <strong style="font-size:15px;color:var(--text-primary);">สถานะวันปฏิบัติงาน</strong>
            </div>
            <div>${statusTag}</div>
        </div>
        <div style="font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:12px;">
            รายการบุคลากรครูที่ลาในวันนี้ (${activeLeaves.length} คน)
        </div>
        <div>${contentHtml}</div>
    `;

    container.appendChild(dayView);
}

function openDayLeavesModal(cellDate) {
    const thaiMonthsFull = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const thaiDaysFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

    const d = cellDate.getDate();
    const m = cellDate.getMonth();
    const y = cellDate.getFullYear();

    const dateTitle = `รายชื่อผู้ลาประจำวัน${thaiDaysFull[cellDate.getDay()]}ที่ ${d} ${thaiMonthsFull[m]} ${y + 543}`;
    
    const dateTitleEl = document.getElementById("modal-day-leaves-date");
    if (dateTitleEl) dateTitleEl.textContent = dateTitle;

    const bodyEl = document.getElementById("modal-day-leaves-body");
    if (!bodyEl) return;

    const activeLeaves = systemState.requests.filter(req => {
        const start = parseDateString(req.startDate);
        const end = parseDateString(req.endDate);
        if (!start || !end) return false;
        const cellTime = cellDate.getTime();
        return cellTime >= start.getTime() && cellTime <= end.getTime();
    });

    if (activeLeaves.length === 0) {
        bodyEl.innerHTML = `<div style="text-align:center; padding: 30px; color: var(--text-muted);">ไม่มีข้อมูลการยื่นขอลาในวันนี้</div>`;
    } else {
        const typeLabel = { "sick": "ลาป่วย", "vacation": "ลาพักผ่อน / ลากิจ", "maternity": "ลาคลอดบุตร" };
        bodyEl.innerHTML = activeLeaves.map(req => {
            return `
                <div class="calendar-day-card" style="margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--primary), var(--info)); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; font-family:var(--font-heading);">
                            ${req.teacherName.slice(0, 2)}
                        </div>
                        <div>
                            <div style="font-weight:600; color:var(--text-primary); font-size:14px;">${req.teacherName}</div>
                            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
                                เหตุผล: ${req.reason}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="text-align:right;">
                            <span class="calendar-leave-pill ${req.leaveType} ${req.status}" style="display:inline-flex;">
                                ${typeLabel[req.leaveType] || req.leaveType} (${req.netDays} วัน)
                            </span>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                                ${formatThaiDate(req.startDate)} - ${formatThaiDate(req.endDate)}
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-icon" style="width:32px; height:32px; border-radius:6px;" onclick="closeModal('modal-day-leaves'); viewRequestDetails('${req.id}');">
                            <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    const switchBtn = document.getElementById("modal-day-switch-view-btn");
    if (switchBtn) {
        switchBtn.onclick = () => {
            closeModal("modal-day-leaves");
            systemState.calendarMode = "day";
            systemState.calendarYear = y;
            systemState.calendarMonth = m;
            systemState.calendarDay = d;
            
            document.querySelectorAll(".cal-mode-btn").forEach(b => {
                if (b.getAttribute("data-mode") === "day") b.classList.add("active");
                else b.classList.remove("active");
            });

            renderLeaveCalendar();
        };
    }

    openModal("modal-day-leaves");
}

function prevCalendarMonth() {
    const mode = systemState.calendarMode || "month";
    const currDate = new Date(systemState.calendarYear, systemState.calendarMonth, systemState.calendarDay || 15);
    
    if (mode === "month") {
        systemState.calendarMonth--;
        if (systemState.calendarMonth < 0) {
            systemState.calendarMonth = 11;
            systemState.calendarYear--;
        }
    } else if (mode === "week") {
        currDate.setDate(currDate.getDate() - 7);
        systemState.calendarYear = currDate.getFullYear();
        systemState.calendarMonth = currDate.getMonth();
        systemState.calendarDay = currDate.getDate();
    } else if (mode === "day") {
        currDate.setDate(currDate.getDate() - 1);
        systemState.calendarYear = currDate.getFullYear();
        systemState.calendarMonth = currDate.getMonth();
        systemState.calendarDay = currDate.getDate();
    }
    renderLeaveCalendar();
}

function nextCalendarMonth() {
    const mode = systemState.calendarMode || "month";
    const currDate = new Date(systemState.calendarYear, systemState.calendarMonth, systemState.calendarDay || 15);
    
    if (mode === "month") {
        systemState.calendarMonth++;
        if (systemState.calendarMonth > 11) {
            systemState.calendarMonth = 0;
            systemState.calendarYear++;
        }
    } else if (mode === "week") {
        currDate.setDate(currDate.getDate() + 7);
        systemState.calendarYear = currDate.getFullYear();
        systemState.calendarMonth = currDate.getMonth();
        systemState.calendarDay = currDate.getDate();
    } else if (mode === "day") {
        currDate.setDate(currDate.getDate() + 1);
        systemState.calendarYear = currDate.getFullYear();
        systemState.calendarMonth = currDate.getMonth();
        systemState.calendarDay = currDate.getDate();
    }
    renderLeaveCalendar();
}

function resetCalendarToToday() {
    const today = new Date();
    systemState.calendarYear = today.getFullYear();
    systemState.calendarMonth = today.getMonth();
    systemState.calendarDay = today.getDate();
    renderLeaveCalendar();
}

function approveRequestDirect(reqId) {
    const req = systemState.requests.find(r => r.id === reqId);
    if (!req) return;
    
    App.showConfirm({
        title: "ยืนยันอนุมัติใบลา",
        message: `ยืนยันการอนุมัติใบลาของ <strong style="color:var(--primary);">${req.teacherName}</strong><br>ประเภท: ${typeLabelShort(req.leaveType)} (${req.netDays} วัน)`,
        confirmLabel: "อนุมัติ",
        requireNote: true,
        onConfirm: (note) => {
            // Update request state
            req.status = "approved";
            req.comment = note || "อนุมัติในระบบ";
            
            // Deduct quota from teacher
            const teacher = systemState.teachers.find(t => t.id === req.teacherId);
            if (teacher) {
                if (req.leaveType === "sick") teacher.sickUsed += req.netDays;
                else if (req.leaveType === "vacation") teacher.vacationUsed += req.netDays;
                else if (req.leaveType === "maternity") teacher.maternityUsed += req.netDays;
            }
            
            saveStateToLocalStorage();
            renderApprovalView();
            updateApprovalBadge();
            showToast(`อนุมัติใบลาของ ${req.teacherName} สำเร็จ`, "success");
            
            // Sync steps
            updateJourneyStepProgress("approve", 3);
        }
    });
}

function rejectRequestDirect(reqId) {
    const req = systemState.requests.find(r => r.id === reqId);
    if (!req) return;
    
    App.showConfirm({
        title: "ปฏิเสธคำขอการลา",
        message: `คุณกำลังปฏิเสธใบลาของ <strong style="color:var(--danger);">${req.teacherName}</strong>`,
        confirmLabel: "ปฏิเสธ",
        requireNote: true,
        onConfirm: (note) => {
            req.status = "rejected";
            req.comment = note;
            
            saveStateToLocalStorage();
            renderApprovalView();
            updateApprovalBadge();
            showToast(`ปฏิเสธคำขอการลาของ ${req.teacherName}`, "danger");
            
            updateJourneyStepProgress("approve", 3);
        }
    });
}

function resetRequestStatus(reqId) {
    const req = systemState.requests.find(r => r.id === reqId);
    if (!req) return;
    
    if (!confirm(`คุณต้องการยกเลิกการตัดสินใจและเปลี่ยนสถานะคำขอของ ${req.teacherName} กลับเป็น "รออนุมัติ" ใช่หรือไม่?`)) return;
    
    // If it was approved, we must refund the used quota
    if (req.status === "approved") {
        const teacher = systemState.teachers.find(t => t.id === req.teacherId);
        if (teacher) {
            if (req.leaveType === "sick") teacher.sickUsed = Math.max(0, teacher.sickUsed - req.netDays);
            else if (req.leaveType === "vacation") teacher.vacationUsed = Math.max(0, teacher.vacationUsed - req.netDays);
            else if (req.leaveType === "maternity") teacher.maternityUsed = Math.max(0, teacher.maternityUsed - req.netDays);
        }
    }
    
    req.status = "pending";
    req.comment = "";
    
    saveStateToLocalStorage();
    renderApprovalView();
    updateApprovalBadge();
    showToast(`ยกเลิกการตัดสินใจของคำขอ ${req.teacherName} เรียบร้อยแล้ว`, "warning");
    
    updateJourneyStepProgress("approve", 1);
}

// Detailed Review screen for Approver Modal
function viewRequestDetails(reqId) {
    const req = systemState.requests.find(r => r.id === reqId);
    if (!req) return;

    const modalBody = document.getElementById("detail-modal-body");
    const modalFooter = document.getElementById("detail-modal-footer");
    
    const typeLabel = { "sick": "ลาป่วย", "vacation": "ลาพักผ่อน / ลากิจ", "maternity": "ลาคลอด" };
    const durationLabel = { "full": "ลาเต็มวัน", "morning": "ลาครึ่งเช้า (0.5 วัน)", "afternoon": "ลาครึ่งบ่าย (0.5 วัน)" };
    
    let attachmentHtml = "<span style='color: var(--text-muted);'>ไม่มีเอกสารแนบ</span>";
    if (req.attachment) {
        attachmentHtml = `
            <div class="file-preview-item" style="margin-top: 0; background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2);">
                <div class="file-preview-info">
                    <svg viewBox="0 0 24 24" style="stroke:var(--success);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <a href="#" onclick="viewAttachmentMock('${req.attachment.name}'); return false;" style="color:var(--success); font-weight:600; text-decoration:none;">${req.attachment.name} (${req.attachment.size})</a>
                </div>
            </div>
        `;
    }

    let statusLabel = "";
    if (req.status === "pending") statusLabel = `<span class="badge badge-pending">รออนุมัติ</span>`;
    else if (req.status === "approved") statusLabel = `<span class="badge badge-approved">อนุมัติ</span>`;
    else statusLabel = `<span class="badge badge-rejected">ปฏิเสธการลา</span>`;

    modalBody.innerHTML = `
        <div class="summary-table">
            <div class="summary-row">
                <span class="summary-label">รหัสเอกสาร:</span>
                <span class="summary-value">${req.id}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ชื่อผู้ขอลา:</span>
                <span class="summary-value" style="font-weight: 600;">${req.teacherName}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ประเภทการลา:</span>
                <span class="summary-value">${typeLabel[req.leaveType] || req.leaveType}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">ช่วงเวลาการลา:</span>
                <span class="summary-value">${formatThaiDate(req.startDate)} ถึง ${formatThaiDate(req.endDate)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">รายละเอียดช่วงวัน:</span>
                <span class="summary-value">${durationLabel[req.durationType] || req.durationType}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">จำนวนวันลาสุทธิ:</span>
                <span class="summary-value" style="color: var(--primary); font-size:16px;">${req.netDays} วัน</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">เหตุผลการขอลา:</span>
                <span class="summary-value" style="font-weight: normal; text-align: right; max-width: 250px;">${req.reason}</span>
            </div>
            <div class="summary-row" style="flex-direction: column; gap: 8px; border-bottom: none;">
                <span class="summary-label" style="margin-bottom: 4px;">เอกสารหลักฐานแนบ:</span>
                <div>${attachmentHtml}</div>
            </div>
            <div class="summary-row" style="margin-top: 10px;">
                <span class="summary-label">สถานะปัจจุบัน:</span>
                <span class="summary-value">${statusLabel}</span>
            </div>
            ${req.comment ? `
            <div class="summary-row" style="flex-direction: column; border-bottom: none; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; margin-top: 10px;">
                <span class="summary-label" style="font-size: 12px;">ข้อคิดเห็นจากผู้อนุมัติ:</span>
                <span class="summary-value" style="text-align: left; font-weight: normal; margin-top: 4px; color: var(--text-secondary);">${req.comment}</span>
            </div>` : ""}
        </div>
    `;

    // Manage footer actions: Show approval buttons only if pending
    if (req.status === "pending" && systemState.currentRole === "head") {
        modalFooter.innerHTML = `
            <button class="btn btn-danger" onclick="rejectRequestDirect('${req.id}'); closeModal('modal-detail');">ไม่อนุมัติ</button>
            <button class="btn btn-success" onclick="approveRequestDirect('${req.id}'); closeModal('modal-detail');">อนุมัติใบลา</button>
        `;
    } else if (systemState.currentRole === "head" && (req.status === "approved" || req.status === "rejected")) {
        modalFooter.innerHTML = `
            <button class="btn btn-warning" onclick="resetRequestStatus('${req.id}'); closeModal('modal-detail');">ยกเลิกผลและเปลี่ยนสถานะ</button>
        `;
    } else {
        modalFooter.innerHTML = `
            <button class="btn btn-primary" onclick="closeModal('modal-detail')" style="width: 100%;">ตกลง</button>
        `;
    }

    openModal("modal-detail");
    
    // Sync steps
    if (systemState.currentRole === "head") {
        updateJourneyStepProgress("approve", 1);
    }
}

function viewAttachmentMock(filename) {
    showToast(`จำลองการเปิดไฟล์: ${filename}`, "info");
}

// -------------------------------------------------------------
// INTERACTIVE DOM EVENT LISTENERS
// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const sidebarToggle = document.getElementById("sidebar-toggle-btn");
    const sidebar = document.getElementById("sidebar");
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }

    // 1. Initialize databases
    initializeDatabase();
    
    // 2. Sync sidebar visibility based on role
    updateSidebarVisibility();

    // 4. Role Selector Switch
    const roleSelect = document.getElementById("mock-user-role-select");
    roleSelect.addEventListener("change", (e) => {
        const role = e.target.value;
        systemState.currentRole = role;
        systemState.editingRequestId = null;
        
        // Adjust display based on role
        const avatar = document.getElementById("avatar-display");
        const username = document.getElementById("username-display");
        const roleLabel = document.getElementById("userrole-display");
        
        if (role === "head") {
            avatar.textContent = "ผอ";
            avatar.style.background = "linear-gradient(135deg, var(--warning), var(--danger))";
            username.textContent = "ครูวิชัย เรียนดี (ผอ.)";
            roleLabel.textContent = "ตำแหน่ง: ผู้อำนวยการสถานศึกษา";
            systemState.selectedTeacherId = "T001"; // Reset
        } else {
            avatar.textContent = "ครู";
            avatar.style.background = "linear-gradient(135deg, var(--primary), var(--info))";
            username.textContent = "ครูสมชาย ใจดี";
            roleLabel.textContent = "ตำแหน่ง: ครูประจำชั้น ม.1/1";
            systemState.selectedTeacherId = "T001";
        }
        
        showToast(`สลับจำลองสิทธิ์เป็น: ${role === "head" ? "ผู้อนุมัติ (ผอ.)" : "คุณครูผู้ขอลา"}`, "info");
        
        // Dynamic sidebar updates and view navigation
        updateSidebarVisibility();
        navigateToView(systemState.activeView || "form");
    });

    // 5. Theme Toggle Switch
    const themeBtn = document.getElementById("theme-toggle");
    themeBtn.addEventListener("click", () => {
        const body = document.body;
        const iconSvg = document.getElementById("theme-icon");
        
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            // Switch SVG to sun
            iconSvg.innerHTML = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
            showToast("เปลี่ยนเป็น โหมดสว่าง", "info");
        } else {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            // Switch SVG to moon
            iconSvg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
            showToast("เปลี่ยนเป็น โหมดมืด", "info");
        }
    });

    // 6. Settings interactions
    document.getElementById("add-approver-btn").addEventListener("click", addApprover);
    
    const saveSettingsBtn = document.getElementById("save-settings-btn");
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", saveAllSettings);
    }
    
    // Toggle element change
    document.getElementById("rule-rollover").addEventListener("change", (e) => {
        const rolloverGroup = document.getElementById("rollover-limit-group");
        rolloverGroup.style.display = e.target.checked ? "block" : "none";
    });

    // 7. Form page interactions
    document.getElementById("leave-type").addEventListener("change", updateLiveCalculatedDays);
    document.getElementById("leave-start-date").addEventListener("input", updateLiveCalculatedDays);
    document.getElementById("leave-end-date").addEventListener("input", updateLiveCalculatedDays);
    
    // Radio buttons leave duration durationType
    document.querySelectorAll('input[name="leave-duration-type"]').forEach(radio => {
        radio.addEventListener("change", updateLiveCalculatedDays);
    });

    // Switch active teacher dropdown on behalf of head teacher
    document.getElementById("leave-teacher-name").addEventListener("change", (e) => {
        systemState.selectedTeacherId = e.target.value;
        const activeT = systemState.teachers.find(t => t.id === systemState.selectedTeacherId);
        showToast(`กำลังกรอกคำขอในนาม: ${activeT.name}`, "info");
        renderFormView();
    });

    // Drag and Drop files
    const dropZone = document.getElementById("file-drop-zone");
    const fileInput = document.getElementById("leave-attachment");
    
    dropZone.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        handleFileSelection(e.target.files[0]);
    });
    
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
    
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });
    
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    // Form submission buttons
    document.getElementById("review-leave-btn").addEventListener("click", openSubmitReview);
    document.getElementById("confirm-submit-leave-btn").addEventListener("click", processLeaveSubmission);

    // Wizard step pane click navigation
    document.querySelectorAll("#view-leave-settings .journey-step").forEach(stepNode => {
        stepNode.addEventListener("click", (e) => {
            const stepNum = parseInt(e.currentTarget.getAttribute("data-step"));
            const currentStep = systemState.currentSettingsStep;
            if (stepNum === currentStep) return;
            
            goToSettingsStep(stepNum);
            showToast(`เปลี่ยนไปยังขั้นตอนที่ ${stepNum}`, "info");
        });
    });

    // Wizard buttons navigation
    document.getElementById("prev-settings-btn").addEventListener("click", prevSettingsStep);
    document.getElementById("next-settings-btn").addEventListener("click", nextSettingsStep);

    // 8. Filters for history
    document.getElementById("history-filter-all").addEventListener("click", (e) => setActiveFilter(e, "history", "all"));
    document.getElementById("history-filter-pending").addEventListener("click", (e) => setActiveFilter(e, "history", "pending"));
    document.getElementById("history-filter-approved").addEventListener("click", (e) => setActiveFilter(e, "history", "approved"));
    document.getElementById("history-filter-rejected").addEventListener("click", (e) => setActiveFilter(e, "history", "rejected"));

    // Filters for Approvals
    document.getElementById("approve-filter-all").addEventListener("click", (e) => setActiveFilter(e, "approve", "all"));
    document.getElementById("approve-filter-pending").addEventListener("click", (e) => setActiveFilter(e, "approve", "pending"));
    document.getElementById("approve-filter-approved").addEventListener("click", (e) => setActiveFilter(e, "approve", "approved"));
    document.getElementById("approve-filter-rejected").addEventListener("click", (e) => setActiveFilter(e, "approve", "rejected"));

    // Approve View Tabs (Requests vs Profile)
    document.querySelectorAll(".approve-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Update active state of buttons
            document.querySelectorAll(".approve-tab-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            // Show corresponding content
            const tabId = e.target.getAttribute("data-tab");
            document.querySelectorAll(".approve-tab-content").forEach(content => {
                content.classList.remove("active");
                content.style.display = "none";
            });
            const activeContent = document.getElementById(`approve-tab-${tabId}`);
            if (activeContent) {
                activeContent.classList.add("active");
                activeContent.style.display = "block";
            }
        });
    });

    // Profile teacher select
    const profileSelect = document.getElementById("profile-teacher-select");
    if (profileSelect) {
        profileSelect.addEventListener("change", (e) => {
            const teacherId = e.target.value;
            const emptyState = document.getElementById("profile-empty-state");
            const panelState = document.getElementById("panel-teacher-profile");
            
            if (!teacherId) {
                emptyState.style.display = "block";
                panelState.style.display = "none";
            } else {
                emptyState.style.display = "none";
                panelState.style.display = "block";
                renderTeacherLeaveProfile(teacherId);
                renderLeaveHistoryTimeline(teacherId);
            }
        });
    }

    // Calendar month & mode controls
    const prevMonthBtn = document.getElementById("calendar-prev-month-btn");
    const nextMonthBtn = document.getElementById("calendar-next-month-btn");
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener("click", prevCalendarMonth);
        nextMonthBtn.addEventListener("click", nextCalendarMonth);
    }

    document.querySelectorAll(".cal-mode-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".cal-mode-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            systemState.calendarMode = e.target.getAttribute("data-mode");
            renderLeaveCalendar();
        });
    });

    const todayBtn = document.getElementById("calendar-today-btn");
    if (todayBtn) {
        todayBtn.addEventListener("click", resetCalendarToToday);
    }
});

function setActiveFilter(e, category, status) {
    const parent = e.target.parentElement;
    parent.querySelectorAll(".btn").forEach(btn => btn.classList.remove("btn-active"));
    e.target.classList.add("btn-active");
    
    if (category === "history") {
        renderHistoryTable(status);
    } else {
        renderApprovalView(status);
    }
}

function renderTeacherLeaveProfile(teacherId) {
    const teacher = systemState.teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    // Mini Quota Cards
    const quotaCardsContainer = document.getElementById("profile-quota-cards");
    if (!quotaCardsContainer) return;

    const sickUsed = teacher.sickUsed || 0;
    const vacationUsed = teacher.vacationUsed || 0;
    const maternityUsed = teacher.maternityUsed || 0;

    const quotaSick = systemState.settings.quotaSick || 30;
    const quotaVacation = systemState.settings.quotaVacation || 10;
    const quotaMaternity = systemState.settings.quotaMaternity || 90;

    const quotas = [
        { type: "sick", label: "ลาป่วย", used: sickUsed, total: quotaSick },
        { type: "vacation", label: "ลาพักผ่อน / ลากิจ", used: vacationUsed, total: quotaVacation },
        { type: "maternity", label: "ลาคลอดบุตร", used: maternityUsed, total: quotaMaternity }
    ];

    quotaCardsContainer.innerHTML = quotas.map(q => {
        const remaining = Math.max(0, q.total - q.used);
        return `
            <div class="mini-quota-card ${q.type}">
                <div class="mini-quota-title">${q.label}คงเหลือ</div>
                <div class="mini-quota-value">${remaining}</div>
                <div class="mini-quota-limit">ใช้ไปแล้ว ${q.used} จาก ${q.total} วัน</div>
            </div>
        `;
    }).join('');
}

function renderLeaveHistoryTimeline(teacherId) {
    const container = document.getElementById("profile-history-list");
    if (!container) return;

    // Filter requests for this teacher
    const requests = systemState.requests.filter(r => r.teacherId === teacherId);
    
    if (requests.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); background: var(--bg-card); border-radius: 8px;">ไม่พบประวัติการยื่นขอลาของครูท่านนี้ในระบบ</div>`;
        return;
    }

    // Sort by start date descending
    requests.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    container.innerHTML = requests.map(req => {
        const startDate = new Date(req.startDate);
        const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const monthStr = thaiMonths[startDate.getMonth()];
        const dayStr = startDate.getDate().toString().padStart(2, '0');
        
        let statusBadge = "";
        if (req.status === "approved") {
            statusBadge = `<div style="color: var(--success); display:flex; align-items:center; gap:4px; font-size:12px; font-weight:500;"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;"><polyline points="20 6 9 17 4 12"/></svg>อนุมัติแล้ว</div>`;
        } else if (req.status === "pending") {
            statusBadge = `<div style="color: var(--warning); display:flex; align-items:center; gap:4px; font-size:12px; font-weight:500;"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>รออนุมัติ</div>`;
        } else {
            statusBadge = `<div style="color: var(--danger); display:flex; align-items:center; gap:4px; font-size:12px; font-weight:500;"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>ไม่อนุมัติ</div>`;
        }

        return `
            <div class="history-item">
                <div class="history-date-box">
                    <span class="history-date-month">${monthStr}</span>
                    <span class="history-date-day">${dayStr}</span>
                </div>
                <div class="history-info">
                    <div class="history-type">${typeLabelShort(req.leaveType)}</div>
                    <div class="history-duration">
                        ${formatThaiDate(req.startDate)} - ${formatThaiDate(req.endDate)} 
                        <span style="display:inline-block; margin-left:8px; padding:2px 6px; background: rgba(255,255,255,0.1); border-radius: 4px; font-weight:600;">${req.netDays} วัน</span>
                    </div>
                </div>
                ${statusBadge}
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------------
// FORMATTING HELPERS
// -------------------------------------------------------------

function formatThaiDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist year
    return `${day} ${month} ${String(year).slice(-2)}`;
}

function typeLabelShort(type) {
    const label = { "sick": "ลาป่วย", "vacation": "ลาพักผ่อน", "maternity": "ลาคลอด" };
    return label[type] || type;
}


// -------------------------------------------------------------
// SETTINGS VIRTUAL PREVIEW (Component 4+5 — Steps 1 to 6)
// -------------------------------------------------------------

function updatePreviewStep1() {
    const container = document.getElementById("preview-step-1");
    if (!container) return;
    const cutoffInput = document.getElementById("cutoff-date");
    const dateStr = cutoffInput ? cutoffInput.value : "2026-12-31";
    const cutoffDate = new Date(dateStr);
    
    const year = isNaN(cutoffDate.getFullYear()) ? 2026 : cutoffDate.getFullYear();
    const thaiYear = year + 543;
    
    const today = new Date();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = isNaN(cutoffDate.getTime()) ? new Date(year, 11, 31) : cutoffDate;
    
    const totalMs = Math.max(1, endOfYear.getTime() - startOfYear.getTime());
    const elapsedMs = Math.max(0, today.getTime() - startOfYear.getTime());
    const pct = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100))) || 65;
    
    const diffDays = Math.max(0, Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    container.innerHTML = `
        <div style="width:100%; text-align:left;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:13px; font-weight:600; color:var(--text-primary);">รอบปีการทำงาน ${thaiYear}</span>
                <span class="badge badge-approved" style="font-size:11px; padding:2px 8px;">ผ่านไปแล้ว ${pct}%</span>
            </div>
            <div style="width:100%; height:10px; background:rgba(255,255,255,0.08); border-radius:5px; overflow:hidden; margin-bottom:10px;">
                <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, var(--primary), var(--info)); transition:width 0.3s;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:12px;">
                <span>1 ม.ค. ${thaiYear}</span>
                <span style="color:var(--warning); font-weight:600;">📍 วันนี้</span>
                <span>31 ธ.ค. ${thaiYear}</span>
            </div>
            <div style="background:var(--primary-glow); border:1px solid rgba(99,102,241,0.25); padding:10px 12px; border-radius:6px; font-size:12px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
                <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:var(--primary);fill:none;stroke-width:2;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                    <div><strong>วันล้างยอดสะสม:</strong> ${endOfYear.getDate()} ธ.ค. ${thaiYear}</div>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">(เหลืออีก ${diffDays} วัน ก่อนเริ่มสิทธิ์โควตาปีถัดไป)</div>
                </div>
            </div>
        </div>
    `;
}

function updatePreviewStep2() {
    const container = document.getElementById("preview-step-2");
    if (!container) return;

    const approvers = systemState.settings.approvers || ["ครูวิชัย เรียนดี"];
    
    if (approvers.length === 0) {
        container.innerHTML = `
            <div style="width:100%; text-align:center; padding:20px; color:var(--danger); background:var(--danger-bg); border-radius:8px; border:1px dashed var(--danger);">
                ⚠️ ยังไม่ได้กำหนดผู้อนุมัติ (ครูจะไม่สามารถยื่นขอลาได้)
            </div>
        `;
        return;
    }

    const stepsHtml = approvers.map((name, index) => `
        <div style="display:flex; align-items:center; gap:10px; background:var(--bg-elevated); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); width:100%;">
            <div style="width:24px; height:24px; border-radius:50%; background:var(--primary); color:white; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;">
                ${index + 1}
            </div>
            <div style="flex:1;">
                <div style="font-size:13px; font-weight:600; color:var(--text-primary);">${name}</div>
                <div style="font-size:11px; color:var(--text-muted);">ผู้อนุมัติลำดับที่ ${index + 1}</div>
            </div>
            <span class="badge badge-pending" style="font-size:10px; padding:2px 6px;">พิจารณา</span>
        </div>
        ${index < approvers.length - 1 ? `<div style="width:2px; height:12px; background:var(--border-color); margin:2px 0 2px 23px;"></div>` : ""}
    `).join('');

    container.innerHTML = `
        <div style="width:100%; text-align:left;">
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">เส้นทางการอนุมัติคำขอลา (Approval Flow):</div>
            <div style="display:flex; flex-direction:column; align-items:flex-start;">
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px; font-weight:500;">🧑‍🏫 ครูยื่นคำขอลา</div>
                <div style="width:2px; height:10px; background:var(--primary); margin:0 0 6px 23px;"></div>
                ${stepsHtml}
                <div style="width:2px; height:10px; background:var(--success); margin:6px 0 4px 23px;"></div>
                <div style="font-size:12px; color:var(--success); font-weight:600;">✅ ใบลาอนุมัติสำเร็จ</div>
            </div>
        </div>
    `;
}

function updatePreviewStep3() {
    const container = document.getElementById("preview-step-3");
    if (!container) return;

    const qSick = parseInt(document.getElementById("quota-sick")?.value || 30);
    const qVacation = parseInt(document.getElementById("quota-vacation")?.value || 10);
    const qMaternity = parseInt(document.getElementById("quota-maternity")?.value || 90);

    container.innerHTML = `
        <div style="width:100%; display:flex; flex-direction:column; gap:10px;">
            <div class="mini-quota-card sick" style="background:var(--warning-bg); border-color:rgba(245,158,11,0.3); padding:12px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:13px; font-weight:600; color:var(--warning);">🤒 ลาป่วยคงเหลือ</span>
                    <strong style="font-size:18px; color:var(--warning);">${qSick} วัน</strong>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-top:8px; overflow:hidden;">
                    <div style="width:100%; height:100%; background:var(--warning);"></div>
                </div>
                <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">สิทธิ์เริ่มต้นปีการศึกษา: ${qSick} วัน</div>
            </div>

            <div class="mini-quota-card vacation" style="background:var(--info-bg); border-color:rgba(14,165,233,0.3); padding:12px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:13px; font-weight:600; color:var(--info);">✈️ ลาพักผ่อน/ลากิจคงเหลือ</span>
                    <strong style="font-size:18px; color:var(--info);">${qVacation} วัน</strong>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-top:8px; overflow:hidden;">
                    <div style="width:100%; height:100%; background:var(--info);"></div>
                </div>
                <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">สิทธิ์เริ่มต้นปีการศึกษา: ${qVacation} วัน</div>
            </div>

            <div class="mini-quota-card maternity" style="background:var(--success-bg); border-color:rgba(16,185,129,0.3); padding:12px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:13px; font-weight:600; color:var(--success);">👶 ลาคลอดบุตรคงเหลือ</span>
                    <strong style="font-size:18px; color:var(--success);">${qMaternity} วัน</strong>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-top:8px; overflow:hidden;">
                    <div style="width:100%; height:100%; background:var(--success);"></div>
                </div>
                <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">สิทธิ์เริ่มต้นปีการศึกษา: ${qMaternity} วัน</div>
            </div>
        </div>
    `;
}

function updatePreviewStep4() {
    const container = document.getElementById("preview-step-4");
    if (!container) return;

    const rHalfDay = document.getElementById("rule-half-day")?.checked;
    const rSickDoc = document.getElementById("rule-sick-doc")?.checked;
    const rAdvance = parseInt(document.getElementById("rule-advance-days")?.value || 3);
    const rRollover = document.getElementById("rule-rollover")?.checked;
    const rRolloverMax = parseInt(document.getElementById("rule-rollover-max")?.value || 5);

    let halfDayHtml = rHalfDay ? `
        <div style="display:flex; gap:6px; margin-top:4px;">
            <span class="badge" style="background:var(--primary); color:white; font-size:11px;">ทั้งวัน</span>
            <span class="badge" style="background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-primary); font-size:11px;">ครึ่งเช้า (0.5 วัน)</span>
            <span class="badge" style="background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-primary); font-size:11px;">ครึ่งบ่าย (0.5 วัน)</span>
        </div>
    ` : `
        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">(ยื่นลาได้เฉพาะเต็มวันเท่านั้น)</div>
    `;

    let sickDocHtml = rSickDoc ? `
        <div style="background:var(--danger-bg); border:1px solid rgba(239,68,68,0.3); padding:8px 10px; border-radius:6px; font-size:11px; color:var(--danger); margin-top:8px;">
            ⚠️ บังคับแนบใบรับรองแพทย์ เมื่อยื่นลาป่วยติดต่อกันเกิน 3 วัน
        </div>
    ` : "";

    let advanceHtml = rAdvance > 0 ? `
        <div style="background:var(--warning-bg); border:1px solid rgba(245,158,11,0.3); padding:8px 10px; border-radius:6px; font-size:11px; color:var(--warning); margin-top:8px;">
            ⏰ ต้องยื่นคำขอล่วงหน้าอย่างน้อย ${rAdvance} วันทำการ
        </div>
    ` : "";

    let rolloverHtml = rRollover ? `
        <div style="background:var(--info-bg); border:1px solid rgba(14,165,233,0.3); padding:8px 10px; border-radius:6px; font-size:11px; color:var(--info); margin-top:8px;">
            ✈️ วันลาพักผ่อนคงเหลือ ทบสะสมไปปีถัดไปได้สูงสุด ${rRolloverMax} วัน
        </div>
    ` : "";

    container.innerHTML = `
        <div style="width:100%; text-align:left; background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:14px;">
            <div style="font-size:12px; font-weight:600; color:var(--primary); margin-bottom:8px;">📝 ฟอร์มคำขอลา (มุมมองครู)</div>
            
            <div style="margin-bottom:10px;">
                <span style="font-size:12px; color:var(--text-muted);">ช่วงเวลาการลา:</span>
                ${halfDayHtml}
            </div>

            ${advanceHtml}
            ${sickDocHtml}
            ${rolloverHtml}
        </div>
    `;
}

function updatePreviewStep5() {
    const container = document.getElementById("preview-step-5");
    if (!container) return;

    const late1 = parseInt(document.getElementById("alert-late-1")?.value || 3);
    const late2 = parseInt(document.getElementById("alert-late-2")?.value || 7);
    const visaDays = parseInt(document.getElementById("alert-visa")?.value || 30);
    const workpermitDays = parseInt(document.getElementById("alert-workpermit")?.value || 30);
    const licenseDays = parseInt(document.getElementById("alert-license")?.value || 60);

    container.innerHTML = `
        <div style="width:100%; display:flex; flex-direction:column; gap:10px; text-align:left;">
            <div style="background:var(--warning-bg); border:1px solid rgba(245,158,11,0.3); border-radius:8px; padding:12px;">
                <div style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:var(--warning);">
                    <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    แจ้งเตือนมาสาย (ครั้งที่ 1)
                </div>
                <div style="font-size:12px; color:var(--text-primary); margin-top:4px;">
                    🔔 ครูสมชาย ใจดี มาสายสะสมครบ <strong>${late1} ครั้ง</strong> แล้ว
                </div>
            </div>

            <div style="background:var(--danger-bg); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:12px;">
                <div style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:var(--danger);">
                    <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    แจ้งเตือนมาสาย (ครั้งที่ 2 - วิกฤต)
                </div>
                <div style="font-size:12px; color:var(--text-primary); margin-top:4px;">
                    🚨 ครูสมชาย ใจดี มาสายสะสมครบ <strong>${late2} ครั้ง</strong> (ต้องรายงานผู้บริหาร)
                </div>
            </div>

            <div style="background:var(--info-bg); border:1px solid rgba(14,165,233,0.3); border-radius:8px; padding:12px;">
                <div style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:var(--info);">
                    <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    แจ้งเตือนวันหมดอายุเอกสาร
                </div>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:4px; line-height:1.5;">
                    • วีซ่า: เตือนล่วงหน้า <strong>${visaDays} วัน</strong><br>
                    • Work Permit: เตือนล่วงหน้า <strong>${workpermitDays} วัน</strong><br>
                    • ใบประกอบวิชาชีพ: เตือนล่วงหน้า <strong>${licenseDays} วัน</strong>
                </div>
            </div>
        </div>
    `;
}

function updatePreviewStep6() {
    const container = document.getElementById("preview-step-6");
    if (!container) return;

    const checkedBoxes = Array.from(document.querySelectorAll(".recipient-checkbox:checked")).map(cb => cb.value);

    let recipientsStr = checkedBoxes.length > 0 ? checkedBoxes.join(", ") : "⚠️ ยังไม่ได้เลือกผู้รับการแจ้งเตือน";

    container.innerHTML = `
        <div style="width:100%; text-align:left; background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:14px;">
            <div style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--primary); margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                ตัวอย่างอีเมล/ข้อความแจ้งเตือนอัตโนมัติ
            </div>

            <div style="font-size:12px; margin-bottom:6px;">
                <span style="color:var(--text-muted);">ส่งถึง:</span>
                <strong style="color:${checkedBoxes.length > 0 ? "var(--success)" : "var(--danger)"}; margin-left:4px;">${recipientsStr}</strong>
            </div>

            <div style="background:var(--bg-elevated); padding:10px; border-radius:6px; border:1px solid var(--border-color); font-size:11px; margin-top:8px;">
                <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">[SchoolDark] คำขอลาใหม่: ครูสมชาย ใจดี</div>
                <div style="color:var(--text-secondary);">ประเภท: ลาป่วย (3 วัน) | เหตุผล: ผ่าตัดฟันคุดทันตกรรมตามแพทย์นัด</div>
                <div style="display:flex; gap:6px; margin-top:8px;">
                    <span class="badge badge-approved" style="font-size:10px;">อนุมัติ</span>
                    <span class="badge badge-rejected" style="font-size:10px;">ไม่อนุมัติ</span>
                </div>
            </div>
            
            <div style="font-size:10px; color:var(--text-muted); margin-top:10px; text-align:right;">
                มีผู้รับการแจ้งเตือนทั้งหมด ${checkedBoxes.length} คน
            </div>
        </div>
    `;
}

function updateAllSettingsPreviews() {
    updatePreviewStep1();
    updatePreviewStep2();
    updatePreviewStep3();
    updatePreviewStep4();
    updatePreviewStep5();
    updatePreviewStep6();
}

function initSettingsPreview() {
    // Step 1
    const cutoffInput = document.getElementById("cutoff-date");
    if (cutoffInput) cutoffInput.addEventListener("change", updatePreviewStep1);

    // Step 3
    ["quota-sick", "quota-vacation", "quota-maternity"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updatePreviewStep3);
    });

    // Step 4
    ["rule-half-day", "rule-sick-doc", "rule-rollover"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("change", updatePreviewStep4);
    });
    ["rule-advance-days", "rule-rollover-max"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updatePreviewStep4);
    });

    // Step 5
    ["alert-late-1", "alert-late-2", "alert-visa", "alert-workpermit", "alert-license"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updatePreviewStep5);
    });

    // Step 6
    document.querySelectorAll(".recipient-checkbox").forEach(cb => {
        cb.addEventListener("change", updatePreviewStep6);
    });

    updateAllSettingsPreviews();
}

document.addEventListener("DOMContentLoaded", initSettingsPreview);

