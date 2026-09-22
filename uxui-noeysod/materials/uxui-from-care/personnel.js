// Personnel Database and User Journey Logic for SchoolDark

// Initial Mock Data
const INITIAL_PERSONNEL_TEACHERS = [
    {
        id: "T-001",
        prefix: "ดร.",
        firstname: "สมชาย",
        lastname: "ใจดี",
        cid: "1-1002-34567-89-1",
        dob: "1980-04-12",
        gender: "ชาย",
        blood: "O",
        nationality: "ไทย",
        religion: "พุทธ",
        phone: "081-234-5678",
        email: "somchai.j@schooldark.ac.th",
        regAddress: { houseNo: "99/1", moo: "3", road: "ประชาอุทิศ", subdistrict: "ทุ่งครุ", district: "ทุ่งครุ", province: "กรุงเทพมหานคร", zipcode: "10140" },
        contactAddress: { houseNo: "99/1", moo: "3", road: "ประชาอุทิศ", subdistrict: "ทุ่งครุ", district: "ทุ่งครุ", province: "กรุงเทพมั่นคร", zipcode: "10140" },
        family: { spouse: "นางสมศรี ใจดี", spousePhone: "081-987-6543", children: ["เด็กชายสมศักดิ์ ใจดี"] },
        education: { degree: "ปริญญาเอก", major: "ฟิสิกส์ประยุกต์", institution: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี", gradYear: "2552", gpa: "3.90" },
        honors: ["ครูดีเด่นระดับจังหวัด ประจำปี 2565", "ครูผู้ฝึกสอนนักเรียนได้รับรางวัลระดับชาติ"],
        trainings: [
            { year: "2566", topic: "การจัดการเรียนการสอนฟิสิกส์ยุค AI", agency: "สสวท." },
            { year: "2567", topic: "ทักษะการให้คำปรึกษานักเรียนวัยรุ่น", agency: "กรมสุขภาพจิต" }
        ],
        toeic: { score: "780", date: "2024-05-10" },
        job: { position: "ครูเชี่ยวชาญ (คศ.4)", department: "วิทยาศาสตร์และเทคโนโลยี", hireDate: "2555-08-01", salary: "58000", status: "ปฏิบัติราชการปกติ" },
        license: { number: "63109000123456", type: "ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)", issueDate: "2020-05-15", expireDate: "2025-05-14" },
        royals: ["ทวีติยาภรณ์มงกุฎไทย (ท.ม.) - 2563", "ทวีติยาภรณ์ช้างเผือก (ท.ช.) - 2566"],
        status: "ครบถ้วน",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "T-002",
        prefix: "นางสาว",
        firstname: "ณิชา",
        lastname: "รักเรียน",
        cid: "1-2005-98765-43-2",
        dob: "1988-11-23",
        gender: "หญิง",
        blood: "AB",
        nationality: "ไทย",
        religion: "พุทธ",
        phone: "082-345-6789",
        email: "nicha.r@schooldark.ac.th",
        regAddress: { houseNo: "52/12", moo: "1", road: "สุขุมวิท", subdistrict: "คลองเตย", district: "คลองเตย", province: "กรุงเทพมหานคร", zipcode: "10110" },
        contactAddress: { houseNo: "52/12", moo: "1", road: "สุขุมวิท", subdistrict: "คลองเตย", district: "คลองเตย", province: "กรุงเทพมหานคร", zipcode: "10110" },
        family: { spouse: "", spousePhone: "", children: [] },
        education: { degree: "ปริญญาโท", major: "การสอนคณิตศาสตร์", institution: "จุฬาลงกรณ์มหาวิทยาลัย", gradYear: "2558", gpa: "3.82" },
        honors: ["ครูคณิตศาสตร์ดีเด่น เขตพื้นที่การศึกษา", "ครูดีไม่มีอบายมุข"],
        trainings: [
            { year: "2566", topic: "การสร้างบอร์ดเกมคณิตศาสตร์เพื่อการเรียนรู้", agency: "มหาวิทยาลัยศรีนครินทรวิโรฒ" }
        ],
        toeic: { score: "690", date: "2023-11-12" },
        job: { position: "ครูชำนาญการพิเศษ (คศ.3)", department: "คณิตศาสตร์", hireDate: "2560-05-16", salary: "42000", status: "ปฏิบัติราชการปกติ" },
        license: { number: "64109000554433", type: "ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)", issueDate: "2021-06-01", expireDate: "2026-05-31" },
        royals: ["ตริตาภรณ์มงกุฎไทย (ต.ม.) - 2564"],
        status: "ครบถ้วน",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "T-003",
        prefix: "นาย",
        firstname: "สมเกียรติ",
        lastname: "สารสิทธิ์",
        cid: "3-1005-44332-11-0",
        dob: "1995-02-05",
        gender: "ชาย",
        blood: "B",
        nationality: "ไทย",
        religion: "พุทธ",
        phone: "083-456-7890",
        email: "somkiat.s@schooldark.ac.th",
        regAddress: { houseNo: "123", moo: "8", road: "-", subdistrict: "หนองบัว", district: "เมืองนครสวรรค์", province: "นครสวรรค์", zipcode: "60000" },
        contactAddress: { houseNo: "456/9", moo: "-", road: "รามคำแหง", subdistrict: "หัวหมาก", district: "บางกะปิ", province: "กรุงเทพมหานคร", zipcode: "10240" },
        family: { spouse: "", spousePhone: "", children: [] },
        education: { degree: "ปริญญาตรี", major: "ภาษาไทยเพื่อการสื่อสาร", institution: "มหาวิทยาลัยเกษตรศาสตร์", gradYear: "2562", gpa: "3.20" },
        honors: [],
        trainings: [],
        toeic: { score: "", date: "" },
        job: { position: "ครูผู้ช่วย", department: "ภาษาไทย", hireDate: "2565-10-01", salary: "15800", status: "ปฏิบัติราชการปกติ" },
        license: { number: "", type: "ไม่มี", issueDate: "", expireDate: "" },
        royals: [],
        status: "ไม่ครบถ้วน", // Missing training / licenses
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "T-004",
        prefix: "นาง",
        firstname: "ปราณี",
        lastname: "อารีจิต",
        cid: "1-1003-99988-12-1",
        dob: "1972-07-30",
        gender: "หญิง",
        blood: "A",
        nationality: "ไทย",
        religion: "พุทธ",
        phone: "084-567-8901",
        email: "pranee.a@schooldark.ac.th",
        regAddress: { houseNo: "5", moo: "2", road: "บรมราชชนนี", subdistrict: "ตลิ่งชัน", district: "ตลิ่งชัน", province: "กรุงเทพมหานคร", zipcode: "10170" },
        contactAddress: { houseNo: "5", moo: "2", road: "บรมราชชนนี", subdistrict: "ตลิ่งชัน", district: "ตลิ่งชัน", province: "กรุงเทพมหานคร", zipcode: "10170" },
        family: { spouse: "นายเกรียงไกร อารีจิต", spousePhone: "089-111-2222", children: ["นางสาวพิมลวรรณ อารีจิต", "นายวรวุฒิ อารีจิต"] },
        education: { degree: "ปริญญาโท", major: "สังคมศึกษาและการพัฒนาการศึกษา", institution: "มหาวิทยาลัยธรรมศาสตร์", gradYear: "2545", gpa: "3.65" },
        honors: ["ครูดีเด่นรางวัลคุรุสภา"],
        trainings: [
            { year: "2565", topic: "การสอนประวัติศาสตร์ท้องถิ่นแบบ Active Learning", agency: "กระทรวงศึกษาธิการ" }
        ],
        toeic: { score: "550", date: "2022-08-18" },
        job: { position: "ครู (คศ.1)", department: "สังคมศึกษา ศาสนา และวัฒนธรรม", hireDate: "2550-06-01", salary: "34000", status: "ปฏิบัติราชการปกติ" },
        license: { number: "59109000998877", type: "ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)", issueDate: "2016-06-15", expireDate: "2026-06-14" },
        royals: ["จัตุรถาภรณ์มงกุฎไทย (จ.ม.) - 2558"],
        status: "ครบถ้วน",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "T-005",
        prefix: "นาย",
        firstname: "สมพงษ์",
        lastname: "สอนดี",
        cid: "3-1002-00011-22-3",
        dob: "1997-09-08",
        gender: "ชาย",
        blood: "O",
        nationality: "ไทย",
        religion: "คริสต์",
        phone: "085-678-9012",
        email: "sompong.s@schooldark.ac.th",
        regAddress: { houseNo: "88/4", moo: "5", road: "พหลโยธิน", subdistrict: "คูคต", district: "ลำลูกกา", province: "ปทุมธานี", zipcode: "12130" },
        contactAddress: { houseNo: "88/4", moo: "5", road: "พหลโยธิน", subdistrict: "คูคต", district: "ลำลูกกา", province: "ปทุมธานี", zipcode: "12130" },
        family: { spouse: "", spousePhone: "", children: [] },
        education: { degree: "ปริญญาตรี", major: "ภาษาอังกฤษและการสื่อสาร", institution: "มหาวิทยาลัยมหิดล", gradYear: "2563", gpa: "3.45" },
        honors: [],
        trainings: [],
        toeic: { score: "", date: "" }, // Missing TOEIC score
        job: { position: "อาจารย์อัตราจ้าง", department: "ภาษาต่างประเทศ", hireDate: "2566-02-01", salary: "18000", status: "ปฏิบัติราชการปกติ" },
        license: { number: "66209000112233", type: "ใบอนุญาตปฏิบัติการสอน", issueDate: "2023-03-01", expireDate: "2025-02-28" },
        royals: [],
        status: "ไม่ครบถ้วน",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    }
];

// App State Management
let teachers = [];
let selectedTeacherId = null;
let isEditMode = false;
let activeView = 'directory';

// Initialize Database
function initDB() {
    const saved = localStorage.getItem('schooldark_personnel_teachers');
    if (saved) {
        teachers = JSON.parse(saved);
    } else {
        teachers = [...INITIAL_PERSONNEL_TEACHERS];
        localStorage.setItem('schooldark_personnel_teachers', JSON.stringify(teachers));
    }
    updateMetrics();
    populateDirectoryTable();
    populatePrintDropdown();
}

function saveDB() {
    localStorage.setItem('schooldark_personnel_teachers', JSON.stringify(teachers));
    updateMetrics();
    populateDirectoryTable();
    populatePrintDropdown();
}

// UI State & View Switcher (consolidated Personnel Wizard wrapper support - Task 6)
function switchView(viewName) {
    activeView = viewName;
    
    // Toggle active classes on view sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const isWizardView = ['basic-info', 'education', 'job-license', 'import-hub'].includes(viewName);
    
    if (isWizardView) {
        // Show the unified wizard wrapper
        const wizardEl = document.getElementById('view-personnel-wizard');
        if (wizardEl) {
            wizardEl.classList.add('active');
        }
        
        // Map viewName to step index (1-4)
        const viewToStep = {
            'basic-info': 1,
            'education': 2,
            'job-license': 3,
            'import-hub': 4
        };
        const currentStep = viewToStep[viewName];
        
        // Highlight journey steps at top
        document.querySelectorAll('#view-personnel-wizard .journey-step').forEach(stepNode => {
            const stepNum = parseInt(stepNode.getAttribute('data-step'));
            stepNode.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                stepNode.classList.add('active');
            } else if (stepNum < currentStep) {
                stepNode.classList.add('completed');
            }
        });
        
        // Toggle step panes visibility
        document.querySelectorAll('#view-personnel-wizard .personnel-step-pane').forEach(pane => {
            const paneId = pane.id; // e.g. "view-basic-info"
            if (paneId === `view-${viewName}`) {
                pane.classList.add('active');
                pane.style.display = 'block';
            } else {
                pane.classList.remove('active');
                pane.style.display = 'none';
            }
        });
    } else {
        const targetSection = document.getElementById(`view-${viewName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    // Toggle active menu items in sidebar
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`.sidebar-menu [data-view="${viewName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Update Header Page Title
    const titleMap = {
        'directory': 'ทำเนียบบุคลากรและอาจารย์',
        'basic-info': 'แบบฟอร์ม - ข้อมูลพื้นฐานบุคลากร',
        'education': 'แบบฟอร์ม - ประวัติการศึกษา & อบรม',
        'job-license': 'แบบฟอร์ม - ตำแหน่ง & ใบวิชาชีพ',
        'import-hub': 'ระบบนำเข้าไฟล์ Bulk Import (Excel & Photos)',
        'print-studio': 'ศูนย์ผลิตบาร์โค้ด QR Code & ส่งออกรายงาน'
    };
    
    document.getElementById('current-view-title').innerText = titleMap[viewName] || 'ข้อมูลบุคลากร';
}

// Metrics Panel Updater
function updateMetrics() {
    const total = teachers.length;
    const pending = teachers.filter(t => t.status === 'ไม่ครบถ้วน').length;
    const complete = teachers.filter(t => t.status === 'ครบถ้วน').length;
    
    const totalEl = document.getElementById('stat-total');
    const pendingEl = document.getElementById('stat-pending');
    const completeEl = document.getElementById('stat-complete');
    
    if (totalEl) totalEl.innerText = total;
    if (pendingEl) pendingEl.innerText = pending;
    if (completeEl) completeEl.innerText = complete;
}

// Directory Search & Table Generator
function populateDirectoryTable(filterText = '', statusFilter = 'all') {
    const tbody = document.getElementById('directory-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filtered = teachers.filter(t => {
        const fullName = `${t.prefix || ''}${t.firstname || ''} ${t.lastname || ''}`;
        const matchText = (
            fullName.toLowerCase().includes(filterText.toLowerCase()) ||
            (t.id && t.id.toLowerCase().includes(filterText.toLowerCase())) ||
            (t.job?.position && t.job.position.toLowerCase().includes(filterText.toLowerCase())) ||
            (t.job?.department && t.job.department.toLowerCase().includes(filterText.toLowerCase()))
        );
        
        const matchStatus = statusFilter === 'all' || t.status === statusFilter;
        
        return matchText && matchStatus;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">ไม่พบข้อมูลบุคลากรที่ค้นหา</td></tr>`;
        return;
    }
    
    filtered.forEach(t => {
        const tr = document.createElement('tr');
        
        const statusBadge = t.status === 'ครบถ้วน' 
            ? `<span class="badge badge-success">ครบถ้วน</span>`
            : `<span class="badge badge-warning">ไม่ครบถ้วน</span>`;
            
        tr.innerHTML = `
            <td>
                <img src="${t.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50'}" 
                     style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);" alt="">
            </td>
            <td style="font-weight:600; font-family: var(--font-heading);">${t.id || ''}</td>
            <td style="font-weight: 500;">${t.prefix || ''}${t.firstname || ''} ${t.lastname || ''}</td>
            <td>
                <div style="font-weight: 500;">${t.job?.position || '-'}</div>
                <div style="font-size: 11px; color: var(--text-muted);">กลุ่มสาระฯ${t.job?.department || '-'}</div>
            </td>
            <td style="font-family: var(--font-heading);">${t.phone || '-'}</td>
            <td>${statusBadge}</td>
            <td style="text-align: right;">
                <button class="btn btn-secondary" onclick="editTeacherProfile('${t.id}')" style="padding: 6px 12px; font-size: 12px; margin-right: 4px;">แก้ไข</button>
                <button class="btn btn-secondary" onclick="openPrintStudioFor('${t.id}')" style="padding: 6px 12px; font-size: 12px; border-color: var(--primary-glow); color: var(--primary);">
                    QR / พิมพ์
                </button>
                <button class="btn btn-icon-only" onclick="deleteTeacherProfile('${t.id}')" title="ลบ" style="padding:6px; font-size:12px; margin-left:4px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Flowchart Dynamic Connection Drawer
const CONNECTIONS = [
    { from: 'enter-personal', to: 'enter-personnel' },
    // Action branches
    { from: 'enter-personnel', to: 'add-personnel' },
    { from: 'enter-personnel', to: 'edit-personnel' },
    { from: 'enter-personnel', to: 'import-personnel' },
    { from: 'enter-personnel', to: 'import-photos' },
    { from: 'enter-personnel', to: 'print-qrcode' },
    // Direct sub-process maps
    { from: 'import-personnel', to: 'upload-excel' },
    { from: 'import-photos', to: 'upload-photos' },
    
    // Excel upload feeds directly into the edit basic flow
    { from: 'upload-excel', to: 'edit-basic' },
    
    // Edit details
    { from: 'edit-personnel', to: 'edit-basic' },
    { from: 'edit-personnel', to: 'edit-education' },
    { from: 'edit-personnel', to: 'edit-job' },
    { from: 'edit-personnel', to: 'edit-license' },
    // Print branches
    { from: 'print-qrcode', to: 'print-individual' },
    { from: 'print-qrcode', to: 'print-all' },
    { from: 'print-qrcode', to: 'export-image' }
];

function drawFlowchartLines() {
    const svg = document.getElementById('flowchart-svg');
    const container = document.getElementById('flowchart-canvas');
    if (!svg || !container) return;
    
    // Clear previous paths
    svg.innerHTML = '';
    
    const containerRect = container.getBoundingClientRect();
    
    CONNECTIONS.forEach(conn => {
        const fromEl = document.querySelector(`[data-node="${conn.from}"]`);
        const toEl = document.querySelector(`[data-node="${conn.to}"]`);
        
        if (fromEl && toEl) {
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            
            // Calculate relative coordinates
            const x1 = fromRect.right - containerRect.left;
            const y1 = fromRect.top + (fromRect.height / 2) - containerRect.top;
            
            const x2 = toRect.left - containerRect.left;
            const y2 = toRect.top + (toRect.height / 2) - containerRect.top;
            
            // Draw smooth Bezier curve connection
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const controlOffset = Math.max(50, (x2 - x1) * 0.4);
            const d = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;
            
            path.setAttribute('d', d);
            path.setAttribute('data-from', conn.from);
            path.setAttribute('data-to', conn.to);
            svg.appendChild(path);
        }
    });
}

// Flowchart Node Details Panel Manager
const NODE_DETAILS = {
    'enter-personal': {
        title: "เข้าหน้าข้อมูลบุคคล",
        desc: "ขั้นตอนแรกสุด ผู้ใช้งานคลิกเข้ามาสู่เมนูบริหารจัดการข้อมูลส่วนบุคคลของระบบ SchoolDark เพื่อจัดการข้อมูลประวัติต่างๆ",
        actionBtn: "ไปทำเนียบบุคลากร",
        targetView: "directory"
    },
    'enter-personnel': {
        title: "เข้าหน้าข้อมูลบุคลากร - อาจารย์",
        desc: "ระบบแสดงตารางรายชื่อบุคลากรและอาจารย์ทั้งหมด ซึ่งเป็น Dashboard หลักในระบบงานบุคคลที่ผู้ดูแลระบบจะคอยจัดการข้อมูลเชิงลึก",
        actionBtn: "ดูตารางทำเนียบ",
        targetView: "directory"
    },
    'add-personnel': {
        title: "เพิ่มข้อมูลบุคลากรรายคน",
        desc: "เพิ่มข้อมูลครูหรืออาจารย์ใหม่ทีละคน เหมาะสำหรับครูที่เพิ่งบรรจุใหม่หรือย้ายเข้ามา โดยกรอกผ่านฟอร์มแยกเป็นหมวดหมู่",
        actionBtn: "เปิดฟอร์มเพิ่มข้อมูล",
        targetView: "basic-info",
        action: "addNewTeacher"
    },
    'edit-personnel': {
        title: "แก้ไขข้อมูลบุคลากร",
        desc: "ปรับปรุงข้อมูลครูอาจารย์ที่มีอยู่ในทำเนียบ โดยสามารถเลือกครูในตารางแล้วกดปุ่มแก้ไข ข้อมูลจะถูกแยกเป็น 4 ส่วนหลักเพื่อความสะดวก",
        actionBtn: "เลือกครูเพื่อแก้ไข",
        targetView: "directory"
    },
    'import-personnel': {
        title: "นำเข้าข้อมูลบุคลากร Bulk Import",
        desc: "กรณีเปิดเทอมใหม่หรือต้องการนำเข้าข้อมูลครูจำนวนมาก ระบบรองรับการนำเข้าไฟล์ Excel (.xlsx) เพื่อลดขั้นตอนการคีย์มือและลดความผิดพลาด",
        actionBtn: "ไปหน้านำเข้า Excel",
        targetView: "import-hub",
        subTab: "import-excel-tab"
    },
    'import-photos': {
        title: "นำเข้ารูปภาพบุคลากร Bulk Images",
        desc: "อัพโหลดรูปภาพประจำตัวครูจำนวนมากพร้อมกัน โดยตั้งชื่อรูปเป็นรหัสบุคลากร (เช่น T-001.jpg) ระบบจะแมตช์เข้าสู่โปรไฟล์ครูอัตโนมัติ",
        actionBtn: "อัพโหลดไฟล์รูปถ่าย",
        targetView: "import-hub",
        subTab: "import-photo-tab"
    },
    'print-qrcode': {
        title: "พิมพ์ QR Code เชื่อมต่อ LINE Official",
        desc: "จัดพิมพ์หรือสร้าง QR Code เพื่อให้ครูสแกนแอดไลน์ Line Official ประจำตัวโรงเรียน สำหรับรับบริการรายงานข้อมูลหรือรับข้อความสลิปรายบุคคล",
        actionBtn: "เปิดระบบ LINE & QR",
        targetView: "print-studio"
    },
    'edit-basic': {
        title: "แก้ไขข้อมูลพื้นฐานบุคลากร",
        desc: "กรอกและบันทึกประวัติส่วนตัวทั่วไป ที่อยู่ตามทะเบียนบ้าน ที่อยู่ติดต่อปัจจุบัน และรายละเอียดข้อมูลครอบครัว/สมรส/บุตร",
        actionBtn: "ไปฟอร์มข้อมูลพื้นฐาน",
        targetView: "basic-info"
    },
    'edit-education': {
        title: "แก้ไขข้อมูลการศึกษา & อบรม",
        desc: "บันทึกประวัติการศึกษาของครู วุฒิการศึกษาสูงสุด รางวัลเกียรติคุณที่เคยได้รับ ประวัติการเข้าอบรม/สัมมนาต่างๆ และคะแนนทดสอบ TOEIC",
        actionBtn: "ไปฟอร์มข้อมูลการศึกษา",
        targetView: "education"
    },
    'edit-job': {
        title: "แก้ไขข้อมูลตำแหน่งงาน",
        desc: "กำหนดตำแหน่งวิทยฐานะของครู (เช่น ครูชำนาญการพิเศษ) กลุ่มสาระการเรียนรู้ที่สังกัด วันเริ่มทำงาน เงินเดือนปัจจุบัน และสถานะปฏิบัติงาน",
        actionBtn: "ไปฟอร์มตำแหน่งงาน",
        targetView: "job-license"
    },
    'edit-license': {
        title: "แก้ไขใบอนุญาตประกอบวิชาชีพ",
        desc: "จัดการข้อมูลเลขที่ใบอนุญาตประกอบวิชาชีพครู วันออกบัตรและหมดอายุ รวมถึงประวัติการได้รับพระราชทานเครื่องราชอิสริยาภรณ์ต่างๆ",
        actionBtn: "ไปฟอร์มใบวิชาชีพ/เครื่องราชฯ",
        targetView: "job-license",
        subTab: "professional-license-tab"
    },
    'upload-excel': {
        title: "อัพโหลดไฟล์ Excel สำเร็จ",
        desc: "จำลองขั้นตอนวางไฟล์เพื่อประมวลผลลัพธ์ นำคอลัมน์ชื่อ รหัส และเบอร์โทรของครูเข้าไปบันทึกร่วมกับฐานข้อมูลทันที",
        actionBtn: "ทดลองวางไฟล์นำเข้า",
        targetView: "import-hub",
        subTab: "import-excel-tab"
    },
    'upload-photos': {
        title: "อัพโหลดไฟล์รูปภาพ Bulk",
        desc: "ระบบจับคู่อิมเมจกับรหัสไอดี พร้อมแสดงพรีวิวภาพถ่ายของอาจารย์แต่ละท่านที่ได้อัพโหลดเข้าสู่โฮสติ้งเซิร์ฟเวอร์",
        actionBtn: "ทดลองอัพโหลดรูปภาพ",
        targetView: "import-hub",
        subTab: "import-photo-tab"
    },
    'print-individual': {
        title: "พิมพ์ประวัติบุคลากรรายบุคคล",
        desc: "จัดรูปแบบประวัติครูแบบย่อออกกระดาษ A4 สวยงาม พร้อมรูปถ่าย บาร์โค้ดไอดี และ QR Code Line ส่วนตัว เพื่อเก็บเข้าแฟ้มเอกสารทางราชการ",
        actionBtn: "พรีวิวพิมพ์รายคน",
        targetView: "print-studio"
    },
    'print-all': {
        title: "พิมพ์รายงานบุคลากรทั้งหมด",
        desc: "สั่งรวมประวัติของบุคลากรทุกคนพิมพ์ออกเครื่องพิมพ์กระดาษต่อเนื่อง หรือเซฟเป็นไฟล์ PDF รายงานสรุปส่งสำนักงานเขตพื้นที่การศึกษา",
        actionBtn: "สั่งพิมพ์ทั้งหมด",
        targetView: "print-studio",
        action: "printAllSimulation"
    },
    'export-image': {
        title: "ส่งออกรูปภาพโปรไฟล์การ์ด",
        desc: "บันทึกประวัติย่อของครูออกมาในรูปแบบไฟล์รูปภาพภาพเดี่ยว (PNG/JPEG) เหมาะสำหรับการแชร์สรุปผลงานลงกลุ่มไลน์หรือจัดทำป้ายบอร์ดบุคลากร",
        actionBtn: "ส่งออกรูปภาพ PNG",
        targetView: "print-studio",
        action: "exportPngSimulation"
    }
};

function selectFlowchartNode(nodeId) {
    // Remove active styles on all flowchart nodes
    document.querySelectorAll('.flow-node-card').forEach(card => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
    
    // Remove active class from SVG paths
    document.querySelectorAll('.flowchart-svg-layer path').forEach(path => {
        path.classList.remove('active');
    });
    
    const selectedCard = document.querySelector(`[data-node="${nodeId}"]`);
    if (!selectedCard) return;
    
    // Apply styling to show selection
    selectedCard.style.transform = 'translateY(-6px) scale(1.05)';
    selectedCard.style.boxShadow = '0 0 20px var(--primary)';
    
    // Highlight adjacent paths in SVG
    document.querySelectorAll(`.flowchart-svg-layer path[data-from="${nodeId}"], .flowchart-svg-layer path[data-to="${nodeId}"]`).forEach(path => {
        path.classList.add('active');
    });
    
    // Populate Side Panel details
    const data = NODE_DETAILS[nodeId];
    const detailsPanel = document.getElementById('details-content-panel');
    if (!detailsPanel || !data) return;
    
    let subTabTrigger = '';
    if (data.subTab) {
        subTabTrigger = `data-subtab="${data.subTab}"`;
    }
    
    let actionTrigger = '';
    if (data.action) {
        actionTrigger = `data-action="${data.action}"`;
    }
    
    detailsPanel.innerHTML = `
        <div style="animation: fadeIn 0.3s forwards;">
            <h4 style="font-size: 15px; font-weight: 700; color: var(--primary); margin-bottom: 10px;">${data.title}</h4>
            <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">${data.desc}</p>
            
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 12px; margin-bottom: 20px;">
                <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">ระบบที่เชื่อมโยง</div>
                <div style="font-size: 13px; font-weight: 500; display:flex; align-items:center; gap:8px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--primary)" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span>${getViewLabel(data.targetView)}</span>
                </div>
            </div>
            
            <button class="btn btn-primary" style="width: 100%;" id="btn-flow-action-trigger" 
                    data-view="${data.targetView}" ${subTabTrigger} ${actionTrigger}>
                ${data.actionBtn}
            </button>
        </div>
    `;
    
    // Bind click trigger to go to live system demo
    document.getElementById('btn-flow-action-trigger').addEventListener('click', function() {
        const view = this.getAttribute('data-view');
        const sub = this.getAttribute('data-subtab');
        const action = this.getAttribute('data-action');
        
        if (action === 'addNewTeacher') {
            createNewBlankForm();
        }
        
        switchView(view);
        
        if (sub) {
            // If subtab exists, click it dynamically
            setTimeout(() => {
                const subtabBtn = document.querySelector(`.form-tab-btn[data-subtab="${sub}"]`);
                if (subtabBtn) subtabBtn.click();
            }, 150);
        }
        
        if (action === 'printAllSimulation') {
            document.getElementById('btn-print-all-cards').click();
        } else if (action === 'exportPngSimulation') {
            document.getElementById('btn-export-target-img').click();
        }
        
        showToast(`สลับไปโหมดจำลองระบบ: ${getViewLabel(view)}`, 'success');
    });
}

function getViewLabel(viewId) {
    const labels = {
        'directory': 'ทำเนียบบุคลากร',
        'basic-info': 'ข้อมูลพื้นฐาน',
        'education': 'ประวัติการศึกษา & อบรม',
        'job-license': 'ตำแหน่งงาน & ใบประกอบอาชีพ',
        'import-hub': 'ระบบนำเข้าไฟล์ Bulk Import',
        'print-studio': ' LINE QR & พิมพ์รายงาน'
    };
    return labels[viewId] || viewId;
}

// Form Tabs Handler
function setupFormTabs() {
    document.querySelectorAll('.form-tab-nav').forEach(nav => {
        nav.addEventListener('click', e => {
            const btn = e.target.closest('.form-tab-btn');
            if (!btn) return;
            
            const subtabId = btn.getAttribute('data-subtab');
            const navContainer = btn.parentElement;
            
            // Deactivate all tab buttons in this nav
            navContainer.querySelectorAll('.form-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Deactivate all subtab panels under the same view section
            const viewSection = navContainer.closest('.view-section');
            viewSection.querySelectorAll('.sub-tab-panel').forEach(p => p.classList.remove('active'));
            
            const targetPanel = viewSection.querySelector(`#subtab-${subtabId}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Address Sync Switch
function setupAddressSync() {
    const checkbox = document.getElementById('sync-address-checkbox');
    if (!checkbox) return;
    
    checkbox.addEventListener('change', function() {
        syncAddressVisibility();
        if (this.checked) {
            performAddressSync();
            showToast("ใช้ข้อมูลที่อยู่เดียวกับทะเบียนบ้าน (เชื่อมโยงข้อมูล)", "info");
        } else {
            // Reset contact address select/inputs
            const fields = ['house-no', 'moo', 'road', 'zipcode'];
            fields.forEach(f => {
                const contactEl = document.getElementById(`con-${f}`);
                if (contactEl) {
                    contactEl.value = '';
                }
            });
            
            // Reset cascading dropdowns
            document.getElementById('con-province').value = '';
            const districtSelect = document.getElementById('con-district');
            districtSelect.innerHTML = '<option value="">-- เลือกอำเภอ / เขต --</option>';
            districtSelect.disabled = true;
            
            const subdistrictSelect = document.getElementById('con-subdistrict');
            subdistrictSelect.innerHTML = '<option value="">-- เลือกตำบล / แขวง --</option>';
            subdistrictSelect.disabled = true;
        }
    });
    
    // Real-time syncing when registered address changes
    const regFields = ['reg-house-no', 'reg-moo', 'reg-road', 'reg-province', 'reg-district', 'reg-subdistrict', 'reg-zipcode'];
    regFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(eventName, function() {
                if (checkbox.checked) {
                    performAddressSync();
                }
            });
        }
    });
}

// Dynamic List Adders (Children, Honors, Trainings, Royal Decorations)
function appendChildRow(childData = '') {
    const list = document.getElementById('family-children-list');
    if (!list) return;
    
    let prefix = 'เด็กชาย';
    let name = '';
    
    if (typeof childData === 'object' && childData !== null) {
        prefix = childData.prefix || 'เด็กชาย';
        name = childData.name || '';
    } else if (typeof childData === 'string' && childData.trim() !== '') {
        // Try parsing prefix out of string
        const prefixes = ['เด็กหญิง', 'เด็กชาย', 'นางสาว', 'นาง', 'นาย'];
        let matched = false;
        for (const p of prefixes) {
            if (childData.startsWith(p)) {
                prefix = p;
                name = childData.substring(p.length).trim();
                matched = true;
                break;
            }
        }
        if (!matched) {
            name = childData;
        }
    }
    
    const div = document.createElement('div');
    div.className = 'dynamic-row-item';
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.style.marginBottom = '8px';
    
    div.innerHTML = `
        <select class="glass-select child-prefix-select" style="width: 120px; flex-shrink: 0; padding: 6px 10px;">
            <option value="เด็กชาย" ${prefix === 'เด็กชาย' ? 'selected' : ''}>เด็กชาย</option>
            <option value="เด็กหญิง" ${prefix === 'เด็กหญิง' ? 'selected' : ''}>เด็กหญิง</option>
            <option value="นาย" ${prefix === 'นาย' ? 'selected' : ''}>นาย</option>
            <option value="นางสาว" ${prefix === 'นางสาว' ? 'selected' : ''}>นางสาว</option>
            <option value="นาง" ${prefix === 'นาง' ? 'selected' : ''}>นาง</option>
        </select>
        <input type="text" class="glass-input child-input-field" placeholder="ชื่อ-นามสกุล บุตร" value="${name}" style="flex-grow: 1;">
        <button type="button" class="btn-icon-only" onclick="this.parentElement.remove()" style="flex-shrink: 0; padding: 6px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            </svg>
        </button>
    `;
    list.appendChild(div);
}

function appendHonorRow(honorText = '') {
    const list = document.getElementById('edu-honors-list');
    if (!list) return;
    
    const div = document.createElement('div');
    div.className = 'dynamic-row-item';
    div.innerHTML = `
        <input type="text" class="glass-input honor-input-field" placeholder="เช่น ครูดีเด่นปี 2567" value="${honorText}" style="flex-grow:1;">
        <button type="button" class="btn-icon-only" onclick="this.parentElement.remove()" style="flex-shrink:0;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            </svg>
        </button>
    `;
    list.appendChild(div);
}

function appendTrainingRow(year = '', topic = '', agency = '') {
    const list = document.getElementById('edu-trainings-list');
    if (!list) return;
    
    const div = document.createElement('div');
    div.className = 'dynamic-row-item';
    div.style.flexWrap = 'wrap';
    div.innerHTML = `
        <input type="text" class="glass-input training-year" placeholder="ปี พ.ศ." value="${year}" style="width: 100px;">
        <input type="text" class="glass-input training-topic" placeholder="หัวข้อการอบรม / ดูงาน" value="${topic}" style="flex-grow:1; min-width: 200px;">
        <input type="text" class="glass-input training-agency" placeholder="หน่วยงานที่จัดอบรม" value="${agency}" style="width: 220px;">
        <button type="button" class="btn-icon-only" onclick="this.parentElement.remove()" style="flex-shrink:0;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            </svg>
        </button>
    `;
    list.appendChild(div);
}

function appendRoyalRow(royalText = '') {
    const list = document.getElementById('job-royals-list');
    if (!list) return;
    
    const div = document.createElement('div');
    div.className = 'dynamic-row-item';
    div.innerHTML = `
        <input type="text" class="glass-input royal-input-field" placeholder="เช่น ทวีติยาภรณ์มงกุฎไทย (ท.ม.) - พ.ศ. 2565" value="${royalText}" style="flex-grow:1;">
        <button type="button" class="btn-icon-only" onclick="this.parentElement.remove()" style="flex-shrink:0;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            </svg>
        </button>
    `;
    list.appendChild(div);
}

// Edit Mode Load Details
function editTeacherProfile(teacherId) {
    selectedTeacherId = teacherId;
    const t = teachers.find(item => item.id === teacherId);
    if (!t) return;
    
    isEditMode = true;
    
    // Update labels and status badges on forms
    document.getElementById('form-basic-title').innerText = `แก้ไขข้อมูลพื้นฐาน: ${t.prefix}${t.firstname} ${t.lastname}`;
    document.getElementById('form-basic-status-badge').innerText = `รหัสบุคลากร: ${t.id}`;
    document.getElementById('form-edu-title').innerText = `แก้ไขประวัติการศึกษา: ${t.prefix}${t.firstname} ${t.lastname}`;
    document.getElementById('form-edu-status-badge').innerText = `รหัสบุคลากร: ${t.id}`;
    document.getElementById('form-job-title').innerText = `แก้ไขตำแหน่ง & ใบประกอบวิชาชีพ: ${t.prefix}${t.firstname} ${t.lastname}`;
    document.getElementById('form-job-status-badge').innerText = `รหัสบุคลากร: ${t.id}`;
    
    // Load Form 1: Basic Info
    document.getElementById('basic-code').value = t.id;
    document.getElementById('basic-code').disabled = true; // Cannot edit ID key
    document.getElementById('basic-prefix').value = t.prefix || 'นาย';
    document.getElementById('basic-firstname').value = t.firstname || '';
    document.getElementById('basic-lastname').value = t.lastname || '';
    document.getElementById('basic-cid').value = t.cid || '';
    document.getElementById('basic-dob').value = t.dob || '';
    document.getElementById('basic-gender').value = t.gender || 'ชาย';
    document.getElementById('basic-blood').value = t.blood || 'O';
    document.getElementById('basic-nationality').value = t.nationality || 'ไทย';
    document.getElementById('basic-religion').value = t.religion || 'พุทธ';
    document.getElementById('basic-phone').value = t.phone || '';
    document.getElementById('basic-email').value = t.email || '';
    
    // Addresses
    document.getElementById('reg-house-no').value = t.regAddress?.houseNo || '';
    document.getElementById('reg-moo').value = t.regAddress?.moo || '';
    document.getElementById('reg-road').value = t.regAddress?.road || '';
    
    const isSynced = JSON.stringify(t.regAddress) === JSON.stringify(t.contactAddress);
    document.getElementById('sync-address-checkbox').checked = isSynced;
    
    // Populate cascading selects
    setAddressDropdowns('reg', t.regAddress?.province, t.regAddress?.district, t.regAddress?.subdistrict);
    document.getElementById('reg-zipcode').value = t.regAddress?.zipcode || '';
    
    document.getElementById('con-house-no').value = t.contactAddress?.houseNo || '';
    document.getElementById('con-moo').value = t.contactAddress?.moo || '';
    document.getElementById('con-road').value = t.contactAddress?.road || '';
    
    setAddressDropdowns('con', t.contactAddress?.province, t.contactAddress?.district, t.contactAddress?.subdistrict);
    document.getElementById('con-zipcode').value = t.contactAddress?.zipcode || '';
    
    syncAddressVisibility();
    
    let spousePrefix = 'นาย';
    let spouseName = t.family?.spouse || '';
    if (spouseName) {
        const prefixes = ['นางสาว', 'นาง', 'นาย', 'ดร.'];
        for (const p of prefixes) {
            if (spouseName.startsWith(p)) {
                spousePrefix = p;
                spouseName = spouseName.substring(p.length).trim();
                break;
            }
        }
    }
    document.getElementById('fam-spouse-prefix').value = spousePrefix;
    document.getElementById('fam-spouse').value = spouseName;
    document.getElementById('fam-spouse-phone').value = t.family?.spousePhone || '';
    
    // Dynamic lists reset and reload
    document.getElementById('family-children-list').innerHTML = '';
    if (t.family?.children) {
        t.family.children.forEach(child => appendChildRow(child));
    }
    
    // Load Form 2: Education Info
    document.getElementById('edu-degree').value = t.education?.degree || 'ปริญญาตรี';
    document.getElementById('edu-major').value = t.education?.major || '';
    document.getElementById('edu-institution').value = t.education?.institution || '';
    document.getElementById('edu-grad-year').value = t.education?.gradYear || '';
    document.getElementById('edu-gpa').value = t.education?.gpa || '';
    
    document.getElementById('edu-honors-list').innerHTML = '';
    if (t.honors) {
        t.honors.forEach(h => appendHonorRow(h));
    }
    
    document.getElementById('edu-trainings-list').innerHTML = '';
    if (t.trainings) {
        t.trainings.forEach(tr => appendTrainingRow(tr.year, tr.topic, tr.agency));
    }
    
    document.getElementById('toeic-score').value = t.toeic?.score || '';
    document.getElementById('toeic-date').value = t.toeic?.date || '';
    document.getElementById('toeic-file').value = t.toeic?.score ? "toeic_cert_verified.pdf" : "ยังไม่ได้อัพโหลดไฟล์";
    
    // Load Form 3: Job Position
    document.getElementById('job-position').value = t.job?.position || 'ครูผู้ช่วย';
    document.getElementById('job-department').value = t.job?.department || 'วิทยาศาสตร์และเทคโนโลยี';
    document.getElementById('job-hire-date').value = t.job?.hireDate || '';
    document.getElementById('job-salary').value = t.job?.salary || '';
    document.getElementById('job-status').value = t.job?.status || 'ปฏิบัติราชการปกติ';
    
    document.getElementById('lic-number').value = t.license?.number || '';
    document.getElementById('lic-type').value = t.license?.type || 'ไม่มี';
    document.getElementById('lic-issue-date').value = t.license?.issueDate || '';
    document.getElementById('lic-expire-date').value = t.license?.expireDate || '';
    
    document.getElementById('job-royals-list').innerHTML = '';
    if (t.royals) {
        t.royals.forEach(r => appendRoyalRow(r));
    }
    
    // Switch to Form view (Default: Basic info)
    switchView('basic-info');
    showToast(`โหลดประวัติของ ${t.prefix}${t.firstname} สำเร็จ`, 'info');
}

// Reset form elements to blank for creating a new profile
function createNewBlankForm() {
    selectedTeacherId = null;
    isEditMode = false;
    
    // Update Titles
    document.getElementById('form-basic-title').innerText = "เพิ่มข้อมูลพื้นฐานบุคลากรใหม่";
    document.getElementById('form-basic-status-badge').innerText = "โหมดบันทึกใหม่";
    document.getElementById('form-edu-title').innerText = "เพิ่มข้อมูลประวัติการศึกษาใหม่";
    document.getElementById('form-edu-status-badge').innerText = "โหมดบันทึกใหม่";
    document.getElementById('form-job-title').innerText = "เพิ่มตำแหน่ง & ใบวิชาชีพใหม่";
    document.getElementById('form-job-status-badge').innerText = "โหมดบันทึกใหม่";
    
    // Reset forms
    document.getElementById('form-basic-info-body').reset();
    document.getElementById('form-education-body').reset();
    document.getElementById('form-job-license-body').reset();
    
    // Auto generate next code
    const ids = teachers.map(t => parseInt(t.id.replace('T-', '')));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const nextId = `T-${String(maxId + 1).padStart(3, '0')}`;
    
    document.getElementById('basic-code').value = nextId;
    document.getElementById('basic-code').disabled = false; // enable custom editing if they want
    
    // Clear list boxes
    document.getElementById('family-children-list').innerHTML = '';
    document.getElementById('edu-honors-list').innerHTML = '';
    document.getElementById('edu-trainings-list').innerHTML = '';
    document.getElementById('job-royals-list').innerHTML = '';
    
    // Reset address dropdown cascading states
    const regProv = document.getElementById('reg-province');
    if (regProv) regProv.value = '';
    const regDist = document.getElementById('reg-district');
    if (regDist) { regDist.innerHTML = '<option value="">-- เลือกอำเภอ / เขต --</option>'; regDist.disabled = true; }
    const regSub = document.getElementById('reg-subdistrict');
    if (regSub) { regSub.innerHTML = '<option value="">-- เลือกตำบล / แขวง --</option>'; regSub.disabled = true; }
    
    const conProv = document.getElementById('con-province');
    if (conProv) conProv.value = '';
    const conDist = document.getElementById('con-district');
    if (conDist) { conDist.innerHTML = '<option value="">-- เลือกอำเภอ / เขต --</option>'; conDist.disabled = true; }
    const conSub = document.getElementById('con-subdistrict');
    if (conSub) { conSub.innerHTML = '<option value="">-- เลือกตำบล / แขวง --</option>'; conSub.disabled = true; }
    
    document.getElementById('sync-address-checkbox').checked = false;
    syncAddressVisibility();
}

// Save basic profile form
function handleBasicFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('basic-code').value;
    if (!id) {
        showToast("กรุณาระบุรหัสบุคลากร", "danger");
        return;
    }
    
    const prefix = document.getElementById('basic-prefix').value;
    const firstname = document.getElementById('basic-firstname').value;
    const lastname = document.getElementById('basic-lastname').value;
    const phone = document.getElementById('basic-phone').value;
    
    // Validations
    const cid = document.getElementById('basic-cid').value.replace(/-/g, '').trim();
    if (cid.length !== 13 || isNaN(cid)) {
        showToast("เลขบัตรประจำตัวประชาชนต้องกรอกให้ครบ 13 หลัก", "danger");
        document.getElementById('basic-cid').focus();
        return;
    }
    
    const dob = document.getElementById('basic-dob').value;
    if (dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (dobDate >= today) {
            showToast("วันเกิดต้องน้อยกว่าวันปัจจุบัน", "danger");
            document.getElementById('basic-dob').focus();
            return;
        }
    } else {
        showToast("กรุณาระบุวันเกิด", "danger");
        document.getElementById('basic-dob').focus();
        return;
    }
    
    const phoneClean = phone.replace(/-/g, '').trim();
    if (phoneClean.length !== 10 || isNaN(phoneClean)) {
        showToast("เบอร์โทรศัพท์ติดต่อต้องกรอกให้ครบ 10 หลัก", "danger");
        document.getElementById('basic-phone').focus();
        return;
    }
    
    let teacher = teachers.find(item => item.id === id);
    let isNew = false;
    
    if (!teacher) {
        isNew = true;
        teacher = {
            id: id,
            status: 'ไม่ครบถ้วน',
            photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50' // default avatar
        };
    }
    
    teacher.prefix = prefix;
    teacher.firstname = firstname;
    teacher.lastname = lastname;
    teacher.cid = cid;
    teacher.dob = dob;
    teacher.gender = document.getElementById('basic-gender').value;
    teacher.blood = document.getElementById('basic-blood').value;
    teacher.nationality = document.getElementById('basic-nationality').value;
    teacher.religion = document.getElementById('basic-religion').value;
    teacher.phone = phone;
    teacher.email = document.getElementById('basic-email').value;
    
    teacher.regAddress = {
        houseNo: document.getElementById('reg-house-no').value,
        moo: document.getElementById('reg-moo').value,
        road: document.getElementById('reg-road').value,
        province: document.getElementById('reg-province').value,
        district: document.getElementById('reg-district').value,
        subdistrict: document.getElementById('reg-subdistrict').value,
        zipcode: document.getElementById('reg-zipcode').value
    };
    
    const syncCheckbox = document.getElementById('sync-address-checkbox').checked;
    if (syncCheckbox) {
        teacher.contactAddress = { ...teacher.regAddress };
    } else {
        teacher.contactAddress = {
            houseNo: document.getElementById('con-house-no').value,
            moo: document.getElementById('con-moo').value,
            road: document.getElementById('con-road').value,
            province: document.getElementById('con-province').value,
            district: document.getElementById('con-district').value,
            subdistrict: document.getElementById('con-subdistrict').value,
            zipcode: document.getElementById('con-zipcode').value
        };
    }
    
    // Children list parsing
    const children = [];
    document.querySelectorAll('#family-children-list .dynamic-row-item').forEach(row => {
        const prefixSelect = row.querySelector('.child-prefix-select');
        const inputField = row.querySelector('.child-input-field');
        if (prefixSelect && inputField && inputField.value.trim()) {
            children.push({
                prefix: prefixSelect.value,
                name: inputField.value.trim()
            });
        }
    });
    const spouseNameVal = document.getElementById('fam-spouse').value.trim();
    const spouseVal = spouseNameVal ? (document.getElementById('fam-spouse-prefix').value + spouseNameVal) : '';
    
    teacher.family = {
        spouse: spouseVal,
        spousePhone: document.getElementById('fam-spouse-phone').value,
        children: children
    };
    
    if (isNew) {
        // initialize empty objects for the rest if it's new
        teacher.education = { degree: 'ปริญญาตรี', major: '', institution: '', gradYear: '', gpa: '' };
        teacher.honors = [];
        teacher.trainings = [];
        teacher.toeic = { score: '', date: '' };
        teacher.job = { position: 'ครูผู้ช่วย', department: 'วิทยาศาสตร์และเทคโนโลยี', hireDate: '', salary: '', status: 'ปฏิบัติราชการปกติ' };
        teacher.license = { number: '', type: 'ไม่มี', issueDate: '', expireDate: '' };
        teacher.royals = [];
        teachers.push(teacher);
    }
    
    saveDB();
    selectedTeacherId = id;
    showToast("บันทึกข้อมูลส่วนตัวพื้นฐานแล้ว สามารถแก้ไขการศึกษาและตำแหน่งต่อได้", "success");
    
    // Automatically transition to the next step: Education Form
    setTimeout(() => {
        editTeacherProfile(id);
        switchView('education');
    }, 800);
}

function handleEducationFormSubmit(e) {
    e.preventDefault();
    if (!selectedTeacherId) {
        showToast("กรุณากรอกข้อมูลส่วนตัวขั้นแรกก่อนบันทึกการศึกษา", "danger");
        return;
    }
    
    const teacher = teachers.find(item => item.id === selectedTeacherId);
    if (!teacher) return;
    
    teacher.education = {
        degree: document.getElementById('edu-degree').value,
        major: document.getElementById('edu-major').value,
        institution: document.getElementById('edu-institution').value,
        gradYear: document.getElementById('edu-grad-year').value,
        gpa: document.getElementById('edu-gpa').value
    };
    
    // Honors parsing
    const honors = [];
    document.querySelectorAll('#edu-honors-list .honor-input-field').forEach(input => {
        if (input.value.trim()) honors.push(input.value.trim());
    });
    teacher.honors = honors;
    
    // Trainings parsing
    const trainings = [];
    document.querySelectorAll('#edu-trainings-list .dynamic-row-item').forEach(row => {
        const year = row.querySelector('.training-year').value.trim();
        const topic = row.querySelector('.training-topic').value.trim();
        const agency = row.querySelector('.training-agency').value.trim();
        if (year || topic || agency) {
            trainings.push({ year, topic, agency });
        }
    });
    teacher.trainings = trainings;
    
    // TOEIC parsing
    const toeicScore = document.getElementById('toeic-score').value.trim();
    const toeicDate = document.getElementById('toeic-date').value;
    teacher.toeic = {
        score: toeicScore,
        date: toeicDate
    };
    
    saveDB();
    showToast("บันทึกข้อมูลการศึกษาและอบรมเรียบร้อยแล้ว", "success");
    
    // Transition to step 3: Job and Licenses form
    setTimeout(() => {
        switchView('job-license');
    }, 800);
}

function handleJobLicenseFormSubmit(e) {
    e.preventDefault();
    if (!selectedTeacherId) {
        showToast("กรุณากรอกข้อมูลส่วนตัวขั้นแรกก่อน", "danger");
        return;
    }
    
    const teacher = teachers.find(item => item.id === selectedTeacherId);
    if (!teacher) return;
    
    teacher.job = {
        position: document.getElementById('job-position').value,
        department: document.getElementById('job-department').value,
        hireDate: document.getElementById('job-hire-date').value,
        salary: document.getElementById('job-salary').value,
        status: document.getElementById('job-status').value
    };
    
    teacher.license = {
        number: document.getElementById('lic-number').value.trim(),
        type: document.getElementById('lic-type').value,
        issueDate: document.getElementById('lic-issue-date').value,
        expireDate: document.getElementById('lic-expire-date').value
    };
    
    // Royals parsing
    const royals = [];
    document.querySelectorAll('#job-royals-list .royal-input-field').forEach(input => {
        if (input.value.trim()) royals.push(input.value.trim());
    });
    teacher.royals = royals;
    
    // Evaluate if profile information is complete or incomplete
    // E.g., Profile complete if basic forms are filled AND education forms have major/institution AND license is entered
    if (teacher.phone && teacher.firstname && teacher.education.major && teacher.education.institution && teacher.license.type !== 'ไม่มี') {
        teacher.status = 'ครบถ้วน';
    } else {
        teacher.status = 'ไม่ครบถ้วน';
    }
    
    saveDB();
    showToast("บันทึกตําแหน่งงานและใบประกอบวิชาชีพแล้ว แฟ้มประวัติสมบูรณ์เรียบร้อย", "success");
    
    // Finish, go back to database table overview
    setTimeout(() => {
        switchView('directory');
    }, 800);
}

function deleteTeacherProfile(teacherId) {
    if (confirm(`คุณต้องการลบแฟ้มข้อมูลของบุคลากรรายรหัส ${teacherId} หรือไม่?`)) {
        teachers = teachers.filter(t => t.id !== teacherId);
        saveDB();
        showToast(`ลบข้อมูลบุคลากร ${teacherId} เรียบร้อยแล้ว`, 'danger');
    }
}

// Real Excel Bulk Import
function setupExcelImport() {
    let pendingExcelData = [];
    const dropZone = document.getElementById('excel-drop-zone');
    const fileInput = document.getElementById('excel-file-input');
    const progressContainer = document.getElementById('excel-progress-container');
    const progressBar = document.getElementById('excel-progress-bar');
    const previewArea = document.getElementById('excel-preview-area');
    const tbody = document.getElementById('excel-preview-table-body');
    
    // Bind template download button click listener
    const downloadBtn = document.getElementById('btn-download-template');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                const templateData = [
                    {
                        "รหัสบุคลากร": "T-008",
                        "คำนำหน้า": "นาย",
                        "ชื่อจริง": "รักชาติ",
                        "นามสกุล": "ยิ่งชีพ",
                        "เลขบัตรประจำตัวประชาชน": "1100123456789",
                        "วัน/เดือน/ปี เกิด": "15/08/2530",
                        "เพศ": "ชาย",
                        "กรุ๊ปเลือด": "A",
                        "สัญชาติ": "ไทย",
                        "ศาสนา": "พุทธ",
                        "เบอร์โทรศัพท์": "0891234567",
                        "อีเมล": "rakchart.y@schooldark.ac.th",
                        "บ้านเลขที่": "12/3",
                        "หมู่": "1",
                        "ถนน": "พหลโยธิน",
                        "ตำบล / แขวง": "สามเสนใน",
                        "อำเภอ / เขต": "พญาไท",
                        "จังหวัด": "กรุงเทพมหานคร",
                        "รหัสไปรษณีย์": "10400",
                        "ชื่อคู่สมรส": "นางสมร ยิ่งชีพ",
                        "เบอร์โทรศัพท์คู่สมรส": "0897654321",
                        "ข้อมูลบุตร/ธิดา": "เด็กชายรักธรรม ยิ่งชีพ, เด็กหญิงรักดี ยิ่งชีพ",
                        "ตำแหน่ง": "ครูชำนาญการ (คศ.2)",
                        "กลุ่มสาระฯ": "วิทยาศาสตร์และเทคโนโลยี",
                        "วันที่เริ่มทำงาน": "2020-05-15",
                        "เงินเดือน": "32000",
                        "เลขใบอนุญาตวิชาชีพ": "65109000123456",
                        "ประเภทใบอนุญาต": "ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)",
                        "วันออกใบอนุญาต": "2022-05-15",
                        "วันหมดอายุใบอนุญาต": "2027-05-14"
                    }
                ];
                const worksheet = XLSX.utils.json_to_sheet(templateData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
                XLSX.writeFile(workbook, "schooldark_teacher_template.xlsx");
                showToast("ดาวน์โหลดเทมเพลต Excel เรียบร้อยแล้ว", "success");
            } catch (err) {
                console.error(err);
                showToast("ไม่สามารถสร้างเทมเพลตได้ ตรวจสอบว่าโหลดไลบรารี SheetJS แล้ว", "danger");
            }
        });
    }

    if (!dropZone || !fileInput) return;
    
    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });
    
    // File drop handling
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            simulateExcelParse(files[0]);
        }
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            simulateExcelParse(this.files[0]);
        }
    });
    
    function parseExcelDate(val) {
        if (!val) return "";
        if (val instanceof Date) {
            const offset = val.getTimezoneOffset();
            const date = new Date(val.getTime() - (offset * 60 * 1000));
            return date.toISOString().split('T')[0];
        }
        const str = String(val).trim();
        if (!str) return "";
        
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            return str;
        }
        
        const parts = str.split('/');
        if (parts.length === 3) {
            let day = parseInt(parts[0], 10);
            let month = parseInt(parts[1], 10);
            let year = parseInt(parts[2], 10);
            
            if (year > 2400) {
                year -= 543;
            }
            
            const pad = (n) => String(n).padStart(2, '0');
            return `${year}-${pad(month)}-${pad(day)}`;
        }
        return str;
    }

    function simulateExcelParse(file) {
        if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
            showToast("ฟอร์แมตไฟล์ไม่ถูกต้อง กรุณาอัพโหลดเฉพาะ .xlsx, .xls หรือ .csv", "danger");
            return;
        }
        
        progressContainer.style.display = 'block';
        progressBar.style.width = '30%';
        previewArea.style.display = 'none';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array', cellDates: true});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                
                progressBar.style.width = '100%';
                
                // Process, Validate and Map Data
                pendingExcelData = [];
                let validationErrors = [];
                
                jsonData.forEach((row, index) => {
                    const rowNum = index + 2; // Row offset in Excel (1-based sheet is row 1 header)
                    const id = row["รหัสบุคลากร"] || row["ID"] || "";
                    if (!id) {
                        validationErrors.push(`แถวที่ ${rowNum}: ไม่พบข้อมูล 'รหัสบุคลากร'`);
                        return;
                    }
                    
                    const cid = String(row["เลขบัตรประจำตัวประชาชน"] || row["เลขบัตรประชาชน"] || row["CID"] || "").trim().replace(/-/g, "");
                    const dobRaw = row["วัน/เดือน/ปี เกิด"] || row["วันเกิด"] || row["DOB"] || "";
                    const dob = parseExcelDate(dobRaw);
                    const subdistrict = String(row["ตำบล / แขวง"] || row["ตำบล"] || row["แขวง"] || "").trim();
                    const district = String(row["อำเภอ / เขต"] || row["อำเภอ"] || row["เขต"] || "").trim();
                    const province = String(row["จังหวัด"] || "").trim();
                    const firstname = String(row["ชื่อจริง"] || row["ชื่อ"] || "").trim();
                    
                    // Validations
                    if (!firstname) {
                        validationErrors.push(`แถวที่ ${rowNum} (${id}): ไม่พบข้อมูล 'ชื่อจริง'`);
                    }
                    
                    if (!cid) {
                        validationErrors.push(`แถวที่ ${rowNum} (${id}): ไม่พบข้อมูล 'เลขบัตรประจำตัวประชาชน' ซึ่งเป็นฟิลด์จำเป็น (*)`);
                    } else if (!/^\d{13}$/.test(cid)) {
                        validationErrors.push(`แถวที่ ${rowNum} (${id}): 'เลขบัตรประจำตัวประชาชน' ต้องเป็นตัวเลข 13 หลักเท่านั้น (พบ: ${cid})`);
                    }
                    
                    if (!dob) {
                        validationErrors.push(`แถวที่ ${rowNum} (${id}): ไม่พบข้อมูล 'วัน/เดือน/ปี เกิด' ซึ่งเป็นฟิลด์จำเป็น (*)`);
                    }
                    
                    if (!subdistrict) {
                        validationErrors.push(`แถวที่ ${rowNum} (${id}): ไม่พบข้อมูล 'ตำบล / แขวง' ซึ่งเป็นฟิลด์จำเป็น (*)`);
                    }
                    
                    if (!district) {
                        validationErrors.push(`แถวที่ ${rowNum} (${id}): ไม่พบข้อมูล 'อำเภอ / เขต' ซึ่งเป็นฟิลด์จำเป็น (*)`);
                    }
                    
                    if (!province) {
                        validationErrors.push(`แถวที่ ${rowNum} (${id}): ไม่พบข้อมูล 'จังหวัด' ซึ่งเป็นฟิลด์จำเป็น (*)`);
                    }

                    // Children list parsing
                    const childrenStr = row["ข้อมูลบุตร/ธิดา"] || row["บุตร/ธิดา"] || row["บุตร"] || "";
                    const children = childrenStr ? String(childrenStr).split(",").map(c => {
                        const childName = c.trim();
                        const prefixes = ['เด็กหญิง', 'เด็กชาย', 'นางสาว', 'นาง', 'นาย'];
                        let prefix = 'เด็กชาย';
                        let name = childName;
                        for (const p of prefixes) {
                            if (childName.startsWith(p)) {
                                prefix = p;
                                name = childName.substring(p.length).trim();
                                break;
                            }
                        }
                        return { prefix, name };
                    }).filter(c => c.name) : [];
                    
                    pendingExcelData.push({
                        id: String(id),
                        prefix: row["คำนำหน้า"] || "นาย",
                        firstname: firstname,
                        lastname: row["นามสกุล"] || "",
                        cid: cid,
                        dob: dob,
                        gender: row["เพศ"] || "ชาย",
                        blood: row["กรุ๊ปเลือด"] || "O",
                        nationality: row["สัญชาติ"] || "ไทย",
                        religion: row["ศาสนา"] || "พุทธ",
                        phone: row["เบอร์โทรศัพท์"] || row["เบอร์โทร"] || "",
                        email: row["อีเมล"] || "",
                        regAddress: {
                            houseNo: String(row["บ้านเลขที่"] || "").trim(),
                            moo: String(row["หมู่"] || "").trim(),
                            road: String(row["ถนน"] || "").trim(),
                            subdistrict: subdistrict,
                            district: district,
                            province: province,
                            zipcode: String(row["รหัสไปรษณีย์"] || "").trim()
                        },
                        contactAddress: {
                            houseNo: String(row["บ้านเลขที่"] || "").trim(),
                            moo: String(row["หมู่"] || "").trim(),
                            road: String(row["ถนน"] || "").trim(),
                            subdistrict: subdistrict,
                            district: district,
                            province: province,
                            zipcode: String(row["รหัสไปรษณีย์"] || "").trim()
                        },
                        family: {
                            spouse: row["ชื่อคู่สมรส"] || "",
                            spousePhone: row["เบอร์โทรศัพท์คู่สมรส"] || "",
                            children: children
                        },
                        education: {
                            degree: row["ระดับการศึกษา"] || "ปริญญาตรี",
                            major: row["วิชาเอก"] || "",
                            institution: row["สถาบันการศึกษา"] || "",
                            gradYear: row["ปีที่จบ (พ.ศ.)"] || "",
                            gpa: row["เกรดเฉลี่ย"] || ""
                        },
                        honors: [],
                        trainings: [],
                        toeic: { score: "", date: "" },
                        job: { 
                            position: row["ตำแหน่ง"] || "ครูผู้ช่วย", 
                            department: row["กลุ่มสาระฯ"] || row["แผนก"] || "วิทยาศาสตร์และเทคโนโลยี", 
                            hireDate: row["วันที่เริ่มทำงาน"] || "", 
                            salary: row["เงินเดือน"] || "", 
                            status: "ปฏิบัติราชการปกติ" 
                        },
                        license: {
                            number: row["เลขใบอนุญาตวิชาชีพ"] || "",
                            type: row["ประเภทใบอนุญาต"] || "ไม่มี",
                            issueDate: row["วันออกใบอนุญาต"] || "",
                            expireDate: row["วันหมดอายุใบอนุญาต"] || ""
                        },
                        status: "ไม่ครบถ้วน", 
                        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50"
                    });
                });
                
                // Show validation errors if any
                if (validationErrors.length > 0) {
                    const validationBody = document.getElementById('modal-validation-body');
                    const validationFooter = document.getElementById('modal-validation-footer');
                    const validationTitle = document.getElementById('modal-validation-title');
                    
                    if (validationTitle) validationTitle.innerHTML = `<span style="color:var(--danger)">พบข้อผิดพลาดในไฟล์นำเข้า</span>`;
                    if (validationBody) {
                        validationBody.innerHTML = `
                            <p style="margin-bottom:12px; font-weight:600; color:var(--text-secondary);">กรุณาแก้ไขข้อผิดพลาดต่อไปนี้ในไฟล์ Excel ก่อนนำเข้าข้อมูล:</p>
                            <div style="max-height: 250px; overflow-y: auto; padding: 10px; background: rgba(220, 38, 38, 0.05); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 8px;">
                                <ul style="padding-left:20px; color:var(--danger); display:flex; flex-direction:column; gap:6px; font-size:13px; text-align:left;">
                                    ${validationErrors.map(err => `<li>${err}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }
                    if (validationFooter) {
                        validationFooter.innerHTML = `
                            <button class="btn btn-secondary" style="width:100%" onclick="App.closeModal('modal-validation')">ปิดหน้าต่าง</button>
                        `;
                    }
                    App.openModal('modal-validation');
                    progressContainer.style.display = 'none';
                    return;
                }

                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    if (pendingExcelData.length > 0) {
                        showToast(`อ่านไฟล์สำเร็จ พบข้อมูล ${pendingExcelData.length} รายการ`, "success");
                        displayExcelPreviewData(file.name);
                    } else {
                        showToast("ไม่พบข้อมูลในไฟล์ Excel หรือไม่มีคอลัมน์ 'รหัสบุคลากร'", "danger");
                    }
                }, 500);
                
            } catch (err) {
                console.error(err);
                progressContainer.style.display = 'none';
                showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel ตรวจสอบให้แน่ใจว่าโหลดไลบรารี SheetJS แล้ว", "danger");
            }
        };
        reader.readAsArrayBuffer(file);
    }
    
    function displayExcelPreviewData(filename) {
        tbody.innerHTML = '';
        pendingExcelData.forEach(t => {
            const tr = document.createElement('tr');
            const statusBadge = t.phone 
                ? '<span class="badge badge-success">ผ่านการตรวจสอบ</span>'
                : '<span class="badge badge-warning">ไม่ระบุเบอร์โทร</span>';
            
            tr.innerHTML = `
                <td style="font-weight:600;">${t.id}</td>
                <td>${t.firstname}</td>
                <td>${t.lastname}</td>
                <td>${t.phone || '-'}</td>
                <td>${t.job.position}</td>
                <td>${t.job.department}</td>
                <td>${statusBadge}</td>
            `;
            tbody.appendChild(tr);
        });
        previewArea.style.display = 'block';
    }
    
    // Cancel import
    document.getElementById('btn-cancel-excel-import')?.addEventListener('click', () => {
        previewArea.style.display = 'none';
        fileInput.value = '';
        pendingExcelData = [];
        showToast("ยกเลิกการนำเข้าข้อมูล", "info");
    });
    
    // Confirm and Merge import data
    document.getElementById('btn-confirm-excel-import')?.addEventListener('click', () => {
        if (pendingExcelData.length === 0) return;
        
        let addedCount = 0;
        let updatedCount = 0;
        
        pendingExcelData.forEach(newTeacher => {
            const existingIndex = teachers.findIndex(t => t.id === newTeacher.id);
            if (existingIndex === -1) {
                // Initialize default structures for new teacher
                newTeacher.honors = [];
                newTeacher.trainings = [];
                newTeacher.toeic = { score: "", date: "" };
                newTeacher.license = { number: "", type: "ไม่มี", issueDate: "", expireDate: "" };
                newTeacher.royals = [];
                teachers.push(newTeacher);
                addedCount++;
            } else {
                // Update basic and parsed fields if already exists
                const t = teachers[existingIndex];
                t.prefix = newTeacher.prefix;
                t.firstname = newTeacher.firstname;
                t.lastname = newTeacher.lastname;
                t.cid = newTeacher.cid;
                t.dob = newTeacher.dob;
                t.gender = newTeacher.gender;
                t.blood = newTeacher.blood;
                t.nationality = newTeacher.nationality;
                t.religion = newTeacher.religion;
                t.email = newTeacher.email;
                if (newTeacher.phone) t.phone = newTeacher.phone;
                
                // Copy Addresses
                t.regAddress = { ...newTeacher.regAddress };
                t.contactAddress = { ...newTeacher.contactAddress };
                
                // Copy Family
                t.family = { ...newTeacher.family };
                
                // Copy Job details
                t.job = { ...newTeacher.job };
                
                // Copy license
                t.license = { ...newTeacher.license };

                updatedCount++;
            }
        });
        
        saveDB();
        previewArea.style.display = 'none';
        fileInput.value = '';
        pendingExcelData = [];
        
        if (addedCount > 0 || updatedCount > 0) {
            showToast(`นำเข้าเสร็จสิ้น: เพิ่มใหม่ ${addedCount} รายการ, อัพเดท ${updatedCount} รายการ`, "success");
        }
        switchView('directory');
    });
}

// Bulk Photo Import Simulator
function setupPhotoImport() {
    const dropZone = document.getElementById('photo-drop-zone');
    const fileInput = document.getElementById('photo-file-input');
    const progressContainer = document.getElementById('photo-progress-container');
    const progressBar = document.getElementById('photo-progress-bar');
    const previewArea = document.getElementById('photo-preview-area');
    const grid = document.getElementById('photo-preview-grid');
    
    if (!dropZone || !fileInput) return;
    
    dropZone.addEventListener('click', () => fileInput.click());
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });
    
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            simulatePhotoUpload(files);
        }
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            simulatePhotoUpload(this.files);
        }
    });
    
    function simulatePhotoUpload(files) {
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        previewArea.style.display = 'none';
        
        let progress = 0;
        const speed = Math.max(5, 100 / files.length); // Adjust rate depending on number of files
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                progressContainer.style.display = 'none';
                showToast(`จำลองอัพโหลดรูปภาพสำเร็จ ${files.length} รายการ`, "success");
                displayPhotoPreviewGrid();
            }
        }, 120);
    }
    
    function displayPhotoPreviewGrid() {
        grid.innerHTML = '';
        
        // Mock matching pictures with T-003 and imported files T-006, T-007
        const mockPhotos = [
            { id: "T-003", filename: "T-003.jpg", status: "match", name: "ครูสมเกียรติ สารสิทธิ์", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
            { id: "T-006", filename: "T-006.jpg", status: "match", name: "ครูณัฐพล เดชปัญญา", url: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200" },
            { id: "T-007", filename: "T-007.jpg", status: "match", name: "ครูพรรณราย แสงทอง", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
            { id: "UNKNOWN", filename: "my_profile.jpg", status: "unmatch", name: "ไม่พบรหัสผู้สอนในฐานข้อมูล", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" }
        ];
        
        mockPhotos.forEach(p => {
            const card = document.createElement('div');
            card.style.background = 'rgba(0,0,0,0.2)';
            card.style.border = '1px solid var(--border-color)';
            card.style.borderRadius = 'var(--border-radius-md)';
            card.style.padding = '12px';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';
            card.style.gap = '8px';
            
            const badge = p.status === 'match'
                ? `<span class="badge badge-success" style="font-size:10px;">จับคู่รหัส: ${p.id}</span>`
                : `<span class="badge badge-danger" style="font-size:10px;">ไม่พบรหัสบุคลากร</span>`;
                
            card.innerHTML = `
                <img src="${p.url}" style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px;" alt="">
                <div style="text-align: center;">
                    <div style="font-size: 11px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">${p.filename}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top:2px;">${p.name}</div>
                </div>
                ${badge}
            `;
            grid.appendChild(card);
        });
        
        previewArea.style.display = 'block';
    }
    
    document.getElementById('btn-cancel-photo-import')?.addEventListener('click', () => {
        previewArea.style.display = 'none';
        fileInput.value = '';
        showToast("ยกเลิกการอัพโหลดรูปภาพ", "info");
    });
    
    document.getElementById('btn-confirm-photo-import')?.addEventListener('click', () => {
        // Simulator merges valid pictures (T-003, T-006, T-007)
        const updates = [
            { id: "T-003", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
            { id: "T-006", url: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200" },
            { id: "T-007", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" }
        ];
        
        updates.forEach(up => {
            const t = teachers.find(item => item.id === up.id);
            if (t) {
                t.photo = up.url;
            }
        });
        
        saveDB();
        previewArea.style.display = 'none';
        fileInput.value = '';
        showToast("ปรับปรุงรูปถ่ายครูประจำการเข้าคลังเรียบร้อยแล้ว", "success");
        switchView('directory');
    });
}

// ================= THAI ADDRESS DATABASE & CASCADING SELECTS =================
const THAI_ADDRESS_DATA = {
    "กรุงเทพมหานคร": {
        "ทุ่งครุ": {
            "ทุ่งครุ": "10140",
            "บางมด": "10140"
        },
        "คลองเตย": {
            "คลองเตย": "10110",
            "คลองเตยเหนือ": "10110",
            "พระโขนง": "10110"
        },
        "บางกะปิ": {
            "หัวหมาก": "10240",
            "คลองจั่น": "10240"
        },
        "ตลิ่งชัน": {
            "ตลิ่งชัน": "10170",
            "คลองชักพระ": "10170"
        }
    },
    "นนทบุรี": {
        "เมืองนนทบุรี": {
            "บางกระสอ": "11000",
            "ท่าทราย": "11000",
            "ตลาดขวัญ": "11000"
        },
        "ปากเกร็ด": {
            "ปากเกร็ด": "11120",
            "บางตลาด": "11120"
        }
    },
    "ปทุมธานี": {
        "ลำลูกกา": {
            "คูคต": "12130",
            "ลาดสวาย": "12150"
        },
        "คลองหลวง": {
            "คลองหนึ่ง": "12120",
            "คลองสอง": "12120"
        }
    },
    "นครสวรรค์": {
        "เมืองนครสวรรค์": {
            "หนองบัว": "60000",
            "ปากน้ำโพ": "60000"
        }
    },
    "เชียงใหม่": {
        "เมืองเชียงใหม่": {
            "สุเทพ": "50200",
            "วัดเกต": "50000",
            "ศรีภูมิ": "50200"
        },
        "หางดง": {
            "หางดง": "50230",
            "หนองควาย": "50230"
        }
    },
    "ชลบุรี": {
        "บางละมุง": {
            "หนองปรือ": "20150",
            "นาเกลือ": "20150"
        },
        "เมืองชลบุรี": {
            "แสนสุข": "20130",
            "เสม็ด": "20000"
        }
    }
};

function initAddressDropdowns(prefix) {
    const provinceSelect = document.getElementById(`${prefix}-province`);
    if (!provinceSelect) return;
    
    provinceSelect.innerHTML = '<option value="">-- เลือกจังหวัด --</option>';
    Object.keys(THAI_ADDRESS_DATA).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.text = province;
        provinceSelect.appendChild(option);
    });
    
    provinceSelect.addEventListener('change', function() {
        const province = this.value;
        const districtSelect = document.getElementById(`${prefix}-district`);
        const subdistrictSelect = document.getElementById(`${prefix}-subdistrict`);
        const zipcodeEl = document.getElementById(`${prefix}-zipcode`);
        
        districtSelect.innerHTML = '<option value="">-- เลือกอำเภอ / เขต --</option>';
        subdistrictSelect.innerHTML = '<option value="">-- เลือกตำบล / แขวง --</option>';
        districtSelect.disabled = true;
        subdistrictSelect.disabled = true;
        zipcodeEl.value = '';
        
        if (province && THAI_ADDRESS_DATA[province]) {
            const districts = THAI_ADDRESS_DATA[province];
            Object.keys(districts).forEach(d => {
                const option = document.createElement('option');
                option.value = d;
                option.text = d;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;
        }
    });
    
    const districtSelect = document.getElementById(`${prefix}-district`);
    districtSelect.addEventListener('change', function() {
        const province = document.getElementById(`${prefix}-province`).value;
        const district = this.value;
        const subdistrictSelect = document.getElementById(`${prefix}-subdistrict`);
        const zipcodeEl = document.getElementById(`${prefix}-zipcode`);
        
        subdistrictSelect.innerHTML = '<option value="">-- เลือกตำบล / แขวง --</option>';
        subdistrictSelect.disabled = true;
        zipcodeEl.value = '';
        
        if (province && district && THAI_ADDRESS_DATA[province]?.[district]) {
            const subdistricts = THAI_ADDRESS_DATA[province][district];
            Object.keys(subdistricts).forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.text = sub;
                subdistrictSelect.appendChild(option);
            });
            subdistrictSelect.disabled = false;
        }
    });
    
    const subdistrictSelect = document.getElementById(`${prefix}-subdistrict`);
    subdistrictSelect.addEventListener('change', function() {
        const province = document.getElementById(`${prefix}-province`).value;
        const district = document.getElementById(`${prefix}-district`).value;
        const subdistrict = this.value;
        const zipcodeEl = document.getElementById(`${prefix}-zipcode`);
        
        if (province && district && subdistrict && THAI_ADDRESS_DATA[province]?.[district]?.[subdistrict]) {
            const zip = THAI_ADDRESS_DATA[province][district][subdistrict];
            zipcodeEl.value = zip || '';
        } else {
            zipcodeEl.value = '';
        }
    });
}

function setAddressDropdowns(prefix, province, district, subdistrict) {
    const provinceSelect = document.getElementById(`${prefix}-province`);
    const districtSelect = document.getElementById(`${prefix}-district`);
    const subdistrictSelect = document.getElementById(`${prefix}-subdistrict`);
    
    if (!provinceSelect || !districtSelect || !subdistrictSelect) return;
    
    provinceSelect.value = province || '';
    
    districtSelect.innerHTML = '<option value="">-- เลือกอำเภอ / เขต --</option>';
    subdistrictSelect.innerHTML = '<option value="">-- เลือกตำบล / แขวง --</option>';
    districtSelect.disabled = true;
    subdistrictSelect.disabled = true;
    
    if (province && THAI_ADDRESS_DATA[province]) {
        const districts = THAI_ADDRESS_DATA[province];
        Object.keys(districts).forEach(d => {
            const option = document.createElement('option');
            option.value = d;
            option.text = d;
            districtSelect.appendChild(option);
        });
        districtSelect.disabled = false;
        districtSelect.value = district || '';
        
        if (district && districts[district]) {
            const subdistricts = districts[district];
            Object.keys(subdistricts).forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.text = sub;
                subdistrictSelect.appendChild(option);
            });
            subdistrictSelect.disabled = false;
            subdistrictSelect.value = subdistrict || '';
        }
    }
}

function syncAddressVisibility() {
    const checkbox = document.getElementById('sync-address-checkbox');
    const fieldsContainer = document.getElementById('contact-address-fields');
    if (!checkbox || !fieldsContainer) return;
    
    const isSynced = checkbox.checked;
    
    // Hide or show contact address fields container based on sync state
    fieldsContainer.style.display = isSynced ? 'none' : 'grid';
    
    // Disable or enable contact inputs depending on sync state
    const fields = ['con-house-no', 'con-moo', 'con-road', 'con-province', 'con-district', 'con-subdistrict', 'con-zipcode'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = isSynced;
        }
    });
    
    // Toggle required fields depending on sync state
    const requiredFields = ['con-house-no', 'con-province', 'con-district', 'con-subdistrict', 'con-zipcode'];
    requiredFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (isSynced) {
                el.removeAttribute('required');
            } else {
                el.setAttribute('required', '');
            }
        }
    });
}

function performAddressSync() {
    const checkbox = document.getElementById('sync-address-checkbox');
    if (!checkbox || !checkbox.checked) return;
    
    // Copy house-no, moo, road
    document.getElementById('con-house-no').value = document.getElementById('reg-house-no').value;
    document.getElementById('con-moo').value = document.getElementById('reg-moo').value;
    document.getElementById('con-road').value = document.getElementById('reg-road').value;
    
    // Copy cascading selects
    const regProv = document.getElementById('reg-province').value;
    const regDist = document.getElementById('reg-district').value;
    const regSub = document.getElementById('reg-subdistrict').value;
    
    setAddressDropdowns('con', regProv, regDist, regSub);
    
    // Copy zipcode
    document.getElementById('con-zipcode').value = document.getElementById('reg-zipcode').value;
}

// QR Code Local Painter (Canvas API)
function drawMockQRCode(elementId, text) {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 160, 160);
    
    // Draw Simulated QR Code patterns
    ctx.fillStyle = '#0f172a';
    
    // Draw three outer anchors (squares in corners)
    // Top-Left
    ctx.fillRect(10, 10, 40, 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 15, 30, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 20, 20, 20);
    
    // Top-Right
    ctx.fillRect(110, 10, 40, 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(115, 15, 30, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(120, 20, 20, 20);
    
    // Bottom-Left
    ctx.fillRect(10, 110, 40, 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 115, 30, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 120, 20, 20);
    
    // Draw random pixel boxes inside (Simulating QR grid)
    for (let r = 10; r < 150; r += 8) {
        for (let c = 10; c < 150; c += 8) {
            // Skip anchor regions
            if ((r < 55 && c < 55) || (r < 55 && c > 105) || (r > 105 && c < 55)) continue;
            
            if (Math.random() > 0.4) {
                ctx.fillRect(c, r, 6, 6);
            }
        }
    }
    
    // Green center dot symbolizing LINE Add Official
    ctx.fillStyle = '#06c755';
    ctx.beginPath();
    ctx.arc(80, 80, 14, 0, 2 * Math.PI);
    ctx.fill();
    
    // Small L letter in center
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('L', 80, 80);
    
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = '';
        container.appendChild(canvas);
    }
}

// Print Setup and Preview
function populatePrintDropdown() {
    const select = document.getElementById('print-target-select');
    if (!select) return;
    
    select.innerHTML = '';
    teachers.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.text = `[${t.id}] ${t.prefix}${t.firstname} ${t.lastname}`;
        select.appendChild(option);
    });
    
    // Set initial print preview target
    if (teachers.length > 0) {
        updatePrintPreview(teachers[0].id);
    }
}

function updatePrintPreview(teacherId) {
    const pane = document.getElementById('print-preview-pane');
    if (!pane) return;
    
    const t = teachers.find(item => item.id === teacherId);
    if (!t) return;
    
    const honorsList = (t.honors && t.honors.length > 0)
        ? t.honors.map(h => `<li>${h}</li>`).join('')
        : `<li style="color:#64748b;">ไม่มีข้อมูลเกียรติคุณ</li>`;
        
    const trainingsList = (t.trainings && t.trainings.length > 0)
        ? t.trainings.map(tr => `<li>[พ.ศ. ${tr.year || '-'}] ${tr.topic || ''} (${tr.agency || ''})</li>`).join('')
        : `<li style="color:#64748b;">ไม่มีประวัติการฝึกอบรม</li>`;
        
    const royalsList = (t.royals && t.royals.length > 0)
        ? t.royals.map(r => `<li>${r}</li>`).join('')
        : `<li style="color:#64748b;">ไม่มีประวัติการรับเครื่องราชฯ</li>`;
        
    pane.innerHTML = `
        <div class="print-card-header">
            <div>
                <h2 style="font-size:18px; font-weight:700;">แฟ้มประวัติประจําตัวข้าราชการครูและบุคลากรทางการศึกษา</h2>
                <p style="font-size:11px; color:#475569; margin-top:2px;">โรงเรียนต้นแบบการศึกษาด้านไอที (SchoolDark Academy)</p>
            </div>
            <div style="text-align:right;">
                <div style="font-size:14px; font-weight:700; font-family:monospace; border:1px solid #0f172a; padding:4px 8px; border-radius:4px;">ID: ${t.id || ''}</div>
            </div>
        </div>
        
        <div class="print-profile-grid">
            <div>
                <div class="print-photo">
                    <img src="${t.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}" alt="">
                </div>
                <div style="margin-top:15px; text-align:center;">
                    <div id="print-qrcode-card-draw" style="width:90px; height:90px; margin:0 auto; border:1px dashed #cbd5e1; display:flex; align-items:center; justify-content:center;"></div>
                    <div style="font-size:8px; color:#64748b; margin-top:4px;">LINE MEMBER QR</div>
                </div>
            </div>
            
            <div class="print-details">
                <div>
                    <h3 class="print-section-title">1. ประวัติส่วนบุคคลทั่วไป</h3>
                    <div class="print-data-group">
                        <div class="print-data-item"><strong>ชื่อ-นามสกุล:</strong> ${t.prefix || ''}${t.firstname || ''} ${t.lastname || ''}</div>
                        <div class="print-data-item"><strong>เลขประจำตัวประชาชน:</strong> ${t.cid || '-'}</div>
                        <div class="print-data-item"><strong>วันเกิด:</strong> ${t.dob || '-'}</div>
                        <div class="print-data-item"><strong>เพศ:</strong> ${t.gender || '-'}</div>
                        <div class="print-data-item"><strong>กรุ๊ปเลือด:</strong> ${t.blood || '-'}</div>
                        <div class="print-data-item"><strong>ศาสนา / สัญชาติ:</strong> ${t.religion || '-'} / ${t.nationality || '-'}</div>
                        <div class="print-data-item"><strong>เบอร์โทรศัพท์:</strong> ${t.phone || '-'}</div>
                        <div class="print-data-item"><strong>อีเมล:</strong> ${t.email || '-'}</div>
                    </div>
                </div>

                <div>
                    <h3 class="print-section-title">2. ประวัติการศึกษา & เกียรติคุณ</h3>
                    <div class="print-data-group">
                        <div class="print-data-item"><strong>ระดับสูงสุด:</strong> ${t.education?.degree || '-'}</div>
                        <div class="print-data-item"><strong>สาขา/วิชาเอก:</strong> ${t.education?.major || '-'}</div>
                        <div class="print-data-item" style="grid-column: span 2;"><strong>จบสถาบัน:</strong> ${t.education?.institution || '-'} (พ.ศ. ${t.education?.gradYear || '-'})</div>
                        <div class="print-data-item"><strong>เกรดเฉลี่ย GPA:</strong> ${t.education?.gpa || '-'}</div>
                        <div class="print-data-item"><strong>คะแนน TOEIC:</strong> ${t.toeic?.score || 'ไม่มีข้อมูล'}</div>
                    </div>
                    <div style="margin-top:10px; font-size:11px;">
                        <strong>รางวัล/เกียรติคุณ:</strong>
                        <ul style="padding-left:16px; margin-top:4px; display:flex; flex-direction:column; gap:2px;">
                            ${honorsList}
                        </ul>
                    </div>
                </div>

                <div>
                    <h3 class="print-section-title">3. ตําแหน่งการทำงาน & ใบประกอบวิชาชีพ</h3>
                    <div class="print-data-group">
                        <div class="print-data-item"><strong>ตำแหน่งงาน:</strong> ${t.job?.position || '-'}</div>
                        <div class="print-data-item"><strong>กลุ่มสาระการเรียนรู้:</strong> ${t.job?.department || '-'}</div>
                        <div class="print-data-item"><strong>วันบรรจุ/เข้าทํางาน:</strong> ${t.job?.hireDate || '-'}</div>
                        <div class="print-data-item"><strong>เลขใบอนุญาตวิชาชีพ:</strong> ${t.license?.number || 'ไม่มีข้อมูล'}</div>
                        <div class="print-data-item" style="grid-column: span 2;"><strong>ประเภทใบอนุญาต:</strong> ${t.license?.type || 'ไม่มี'}</div>
                    </div>
                </div>

                <div>
                    <h3 class="print-section-title">4. ประวัติฝึกอบรมสัมมนา & เครื่องราชฯ</h3>
                    <div style="font-size:11px; margin-bottom:8px;">
                        <strong>ประวัติการฝึกอบรม:</strong>
                        <ul style="padding-left:16px; margin-top:4px; display:flex; flex-direction:column; gap:2px;">
                            ${trainingsList}
                        </ul>
                    </div>
                    <div style="font-size:11px;">
                        <strong>เครื่องราชอิสริยาภรณ์:</strong>
                        <ul style="padding-left:16px; margin-top:4px; display:flex; flex-direction:column; gap:2px;">
                            ${royalsList}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Draw card mini QR inside print
    setTimeout(() => {
        drawMockQRCode('print-qrcode-card-draw', `line://ti/p/~${t.id}`);
    }, 50);
}

function openPrintStudioFor(teacherId) {
    switchView('print-studio');
    const select = document.getElementById('print-target-select');
    if (select) {
        select.value = teacherId;
        updatePrintPreview(teacherId);
    }
}

// Toast Alert notification drawer
function showToast(message, type = 'primary') {
    const container = document.getElementById('toast-outlet');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    `;
    if (type === 'success') {
        icon = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
    } else if (type === 'danger') {
        icon = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;
    }
    
    toast.innerHTML = `
        ${icon}
        <span style="font-weight:500;">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// System Init Hook
document.addEventListener('DOMContentLoaded', () => {
    initDB();
    
    // Sidebar Collapse
    const sidebar = document.getElementById('app-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            setTimeout(drawFlowchartLines, 305); // Wait for transit CSS animation to draw correct line endpoints
        });
    }
    
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const icon = document.getElementById('theme-icon');
            if (document.body.classList.contains('light-mode')) {
                icon.innerHTML = `
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
                showToast("เปลี่ยนเป็นโหมดสว่าง", "info");
            } else {
                icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
                showToast("เปลี่ยนเป็นโหมดมืด", "info");
            }
            setTimeout(drawFlowchartLines, 50);
        });
    }
    
    // Shortcut headers btn
    document.getElementById('header-shortcut-btn')?.addEventListener('click', () => {
        createNewBlankForm();
        switchView('basic-info');
        showToast("เปิดฟอร์มเพื่อบันทึกบุคลากรใหม่", "info");
    });
    
    // Search directory event listener
    document.getElementById('directory-search')?.addEventListener('input', function() {
        const statusVal = document.getElementById('directory-filter-status').value;
        populateDirectoryTable(this.value, statusVal);
    });
    
    document.getElementById('directory-filter-status')?.addEventListener('change', function() {
        const searchVal = document.getElementById('directory-search').value;
        populateDirectoryTable(searchVal, this.value);
    });
    
    // Add teacher btn directory
    document.getElementById('btn-add-teacher')?.addEventListener('click', () => {
        createNewBlankForm();
        switchView('basic-info');
    });
    
    // Form submissions
    document.getElementById('form-basic-info-body')?.addEventListener('submit', handleBasicFormSubmit);
    document.getElementById('form-education-body')?.addEventListener('submit', handleEducationFormSubmit);
    document.getElementById('form-job-license-body')?.addEventListener('submit', handleJobLicenseFormSubmit);
    
    // Cancel form actions
    document.querySelectorAll('.btn-cancel-form').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView('directory');
            showToast("ยกเลิกการกรอกข้อมูลฟอร์ม", "warning");
        });
    });
    
    // Flowchart Click events
    document.querySelectorAll('.flow-node-card').forEach(card => {
        card.addEventListener('click', function() {
            const nodeId = this.getAttribute('data-node');
            selectFlowchartNode(nodeId);
        });
    });
    
    // Sub-form list add buttons
    document.getElementById('btn-add-child')?.addEventListener('click', () => appendChildRow());
    document.getElementById('btn-add-honor')?.addEventListener('click', () => appendHonorRow());
    document.getElementById('btn-add-training')?.addEventListener('click', () => appendTrainingRow());
    document.getElementById('btn-add-royal')?.addEventListener('click', () => appendRoyalRow());
    
    // Import Hub configurations
    setupExcelImport();
    setupPhotoImport();
    setupAddressSync();
    
    // Cascading address dropdowns initialization
    initAddressDropdowns('reg');
    initAddressDropdowns('con');
    syncAddressVisibility();
    
    // Day of birth maximum date limit validation
    const dobInput = document.getElementById('basic-dob');
    if (dobInput) {
        dobInput.max = new Date().toISOString().split('T')[0];
    }
    
    // Line official account QR generator
    const lineIdInput = document.getElementById('line-oa-id');
    if (lineIdInput) {
        lineIdInput.addEventListener('input', function() {
            const cleanVal = this.value.trim();
            document.getElementById('line-qr-caption').innerText = cleanVal || '@line_official';
            drawMockQRCode('line-qr-box', `line://ti/p/~${cleanVal}`);
        });
    }
    
    // Draw initial QR code
    drawMockQRCode('line-qr-box', 'line://ti/p/~@schooldark_info');
    
    // Print targets selectors
    document.getElementById('print-target-select')?.addEventListener('change', function() {
        updatePrintPreview(this.value);
    });
    
    document.getElementById('btn-print-target-card')?.addEventListener('click', () => {
        window.print();
    });
    
    document.getElementById('btn-print-all-cards')?.addEventListener('click', () => {
        showToast("จำลอง: กำลังรวมประวัติและส่งไปเครื่องพิมพ์กระดาษหลัก...", "info");
        setTimeout(() => {
            window.print();
        }, 800);
    });
    
    document.getElementById('btn-download-qrcode')?.addEventListener('click', () => {
        showToast("จำลอง: เริ่มดาวน์โหลดรูป QR Code ความละเอียดสูง...", "success");
    });
    
    document.getElementById('btn-sync-line-members')?.addEventListener('click', () => {
        showToast("จำลอง: ส่งข้อความต้อนรับเข้าบัญชี LINE บัญชีโรงเรียนสำเร็จ", "success");
    });
    
    document.getElementById('btn-export-target-img')?.addEventListener('click', () => {
        showToast("จำลอง: กำลังแปลงประวัติย่อเป็นไฟล์รูปภาพ (.png) และเริ่มดาวน์โหลด...", "success");
    });
    
    // Default select first node in flowchart
    selectFlowchartNode('enter-personal');
    

    
    setupFormTabs();
    
    // Redraw after DOM rendering settles
    setTimeout(drawFlowchartLines, 300);
});
