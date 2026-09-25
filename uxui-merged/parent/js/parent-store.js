/* ======================================================================
 *  parent-store.js — ข้อมูล mock ของ "พอร์ทัลผู้ปกครอง" (parent/)
 *  เก็บใน localStorage คนละ key จากทั้ง schooldark (sd_*) และ admission
 *  (admitify_*) โดยตั้งใจ ทุกคีย์ของไฟล์นี้ขึ้นต้นด้วย parent_
 *
 *  ใช้ pattern เดียวกับ SchoolStore (settings/js/school-store.js):
 *  get() คืน seed ถ้าไม่มีคีย์ (ไม่เขียน), save() เขียน JSON, reset() ลบคีย์
 *  แล้วคืน seed ปัจจุบัน, uid(prefix) สร้าง id แบบสุ่ม
 *
 *  parent_attendance เป็นข้อมูลที่ "คำนวณ" จาก genAttendance() แบบ deterministic
 *  (ไม่ใช่ literal seed ตายตัว) ดูรายละเอียดที่ genAttendance() ด้านล่าง
 * ====================================================================== */

window.ParentStore = (function () {
  'use strict';

  /* ---------------------------------------------------------------------
   * helpers: วันที่ / hash แบบ deterministic (ไม่พึ่ง Date.toISOString เพื่อ
   * เลี่ยงปัญหา timezone แปลงวันที่เพี้ยน)
   * ------------------------------------------------------------------- */

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function parseDate(s) {
    var p = s.split('-');
    return { y: parseInt(p[0], 10), m: parseInt(p[1], 10), d: parseInt(p[2], 10) };
  }

  function toDateStr(y, m, d) { return y + '-' + pad2(m) + '-' + pad2(d); }

  function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }

  function addDays(dateStr, n) {
    var p = parseDate(dateStr);
    var y = p.y, m = p.m, d = p.d + n;
    while (d > daysInMonth(y, m)) { d -= daysInMonth(y, m); m++; if (m > 12) { m = 1; y++; } }
    while (d < 1) { m--; if (m < 1) { m = 12; y--; } d += daysInMonth(y, m); }
    return toDateStr(y, m, d);
  }

  function dayOfWeek(dateStr) {
    var p = parseDate(dateStr);
    return new Date(p.y, p.m - 1, p.d).getDay(); // 0=อา ... 6=ส
  }

  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) { h += s.charCodeAt(i) * (i + 1); }
    return h % 100;
  }

  /* ---------------------------------------------------------------------
   * seed functions — เรียกทุกครั้งที่ get() ไม่เจอคีย์ใน localStorage
   * ------------------------------------------------------------------- */

  function seedSession() { return null; }

  function seedActiveChild() { return 'c1'; }

  function seedProfile() {
    return {
      id: 'p1', prefix: 'นาย', firstName: 'สมชาย', lastName: 'ใจดี', relation: 'บิดา', phone: '089-123-4567',
      email: 'somchai.j@example.com', lineId: 'somchai.j', occupation: 'พนักงานบริษัท',
      address: '99/1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
      notify: {
        line: true, sms: false, email: true,
        announcements: true, leaveResult: true, attendance: false
      },
      childIds: ['c1', 'c2']
    };
  }

  function seedChildren() {
    return [
      { id: 'c1', studentId: 'STD-2568-0101', prefix: 'เด็กชาย', firstName: 'ภูมิ', lastName: 'ใจดี', nickname: 'ภูมิ',
        level: 'ม.1', classroom: 'ม.1/2', no: 15, studyPlan: 'ทั่วไป', homeroomTeacher: 'ครูสมศรี ใจงาม',
        homeroomPhone: '081-234-5678', dob: '2013-04-12', bloodType: 'O' },
      { id: 'c2', studentId: 'STD-2568-0102', prefix: 'นางสาว', firstName: 'ใบเตย', lastName: 'ใจดี', nickname: 'เตย',
        level: 'ม.4', classroom: 'ม.4/1', no: 8, studyPlan: 'วิทย์-คณิต', homeroomTeacher: 'ครูประเสริฐ วงศ์ดี',
        homeroomPhone: '082-345-6789', dob: '2010-01-30', bloodType: 'A' }
    ];
  }

  function seedPeriods() {
    return [
      { no: 1, start: '08:30', end: '09:20' }, { no: 2, start: '09:20', end: '10:10' }, { no: 3, start: '10:10', end: '11:00' },
      { no: 4, start: '11:00', end: '11:50' }, { no: 0, label: 'พักกลางวัน', start: '11:50', end: '12:40' },
      { no: 5, start: '12:40', end: '13:30' }, { no: 6, start: '13:30', end: '14:20' }, { no: 7, start: '14:20', end: '15:10' },
      { no: 8, start: '15:10', end: '16:00' }
    ];
  }

  function seedTimetables() {
    function t(code, subject, teacher, room) { return { code: code, subject: subject, teacher: teacher, room: room }; }

    // c1 — ม.1/2 (ทั่วไป)
    var TH = t('ท21101', 'ภาษาไทย 1', 'ครูสมศรี ใจงาม', '121');
    var MA = t('ค21101', 'คณิตศาสตร์ 1', 'ครูวิภา คำนวณดี', '121');
    var SC = t('ว21101', 'วิทยาศาสตร์ 1', 'ครูอนุชา วิทย์เจริญ', 'Lab-1');
    var EN = t('อ21101', 'ภาษาอังกฤษ 1', 'ครูมาลี อิงลิช', '121');
    var SO = t('ส21101', 'สังคมศึกษา 1', 'ครูประยุทธ สังคมกิจ', '121');
    var PE = t('พ21101', 'สุขศึกษาและพลศึกษา 1', 'ครูสมชาย แข็งแรง', 'โรงยิม');
    var AR = t('ศ21101', 'ศิลปะ 1', 'ครูปราณี ศิลป์สวย', 'ศ.101');
    var OC = t('ง21101', 'การงานอาชีพ 1', 'ครูสมหมาย ช่างฝีมือ', '121');
    var CS = t('ว21103', 'วิทยาการคำนวณ', 'ครูธนกร คอมพิวเตอร์', '121');
    var GU = t('ก21901', 'แนะแนว', 'ครูสมศรี ใจงาม', '121');
    var SG = t('ก21902', 'ลูกเสือ-เนตรนารี', 'ครูสมชาย แข็งแรง', '121');

    // c2 — ม.4/1 วิทย์-คณิต
    var TH31 = t('ท31101', 'ภาษาไทย 1', 'ครูสุนีย์ ภาษาดี', '421');
    var MB   = t('ค31101', 'คณิตศาสตร์พื้นฐาน 1', 'ครูประเสริฐ วงศ์ดี', '421');
    var MP   = t('ค31201', 'คณิตศาสตร์เพิ่มเติม 1', 'ครูวิทวัส เลขคณิต', '421');
    var PH   = t('ว31201', 'ฟิสิกส์ 1', 'ครูจักรกฤษณ์ ฟิสิกส์เก่ง', 'Lab-Phy');
    var CH   = t('ว31221', 'เคมี 1', 'ครูนงลักษณ์ เคมีวิจัย', 'Lab-Chem');
    var BI   = t('ว31241', 'ชีววิทยา 1', 'ครูสุภาพร ชีวาศาสตร์', 'Lab-Bio');
    var EN31 = t('อ31101', 'ภาษาอังกฤษ 1', 'ครูแคทลีน สมิท', '421');
    var SO31 = t('ส31101', 'สังคมศึกษา 1', 'ครูอนันต์ สังคมศาสตร์', '421');
    var PE31 = t('พ31101', 'สุขศึกษาและพลศึกษา 1', 'ครูสมชาย แข็งแรง', 'โรงยิม');
    var GU31 = t('ก31901', 'แนะแนว', 'ครูประเสริฐ วงศ์ดี', '421');

    return {
      c1: {
        mon: [TH, MA, SC, EN, PE, AR, CS, null],
        tue: [MA, TH, EN, SC, SO, OC, GU, SG],
        wed: [SC, EN, TH, MA, AR, PE, SO, null],
        thu: [EN, SC, MA, TH, CS, SO, OC, null],
        fri: [PE, AR, CS, OC, GU, GU, SG, null]
      },
      c2: {
        mon: [PH, CH, BI, TH31, MP, EN31, SO31, MB],
        tue: [SO31, PH, CH, BI, TH31, MP, EN31, MB],
        wed: [EN31, SO31, PH, CH, BI, TH31, MP, MB],
        thu: [MP, EN31, SO31, PH, CH, BI, TH31, null],
        fri: [PE31, GU31, PE31, GU31, null, null, null, null]
      }
    };
  }

  function seedExams() {
    return {
      c1: [
        { id: 'EX-1001', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-25', start: '09:00', end: '10:30', code: 'ท21101', subject: 'ภาษาไทย 1', room: '321', seat: '15' },
        { id: 'EX-1002', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-25', start: '13:00', end: '14:30', code: 'ค21101', subject: 'คณิตศาสตร์ 1', room: '321', seat: '15' },
        { id: 'EX-1003', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-26', start: '09:00', end: '10:30', code: 'ว21101', subject: 'วิทยาศาสตร์ 1', room: '321', seat: '15' },
        { id: 'EX-1004', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-27', start: '09:00', end: '10:30', code: 'อ21101', subject: 'ภาษาอังกฤษ 1', room: '321', seat: '15' },
        { id: 'EX-1005', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-28', start: '09:00', end: '10:30', code: 'ส21101', subject: 'สังคมศึกษา 1', room: '321', seat: '15' }
      ],
      c2: [
        { id: 'EX-2001', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-25', start: '09:00', end: '10:30', code: 'ท31101', subject: 'ภาษาไทย 1', room: '415', seat: '08' },
        { id: 'EX-2002', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-25', start: '13:00', end: '14:30', code: 'ค31201', subject: 'คณิตศาสตร์เพิ่มเติม 1', room: '415', seat: '08' },
        { id: 'EX-2003', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-26', start: '09:00', end: '10:30', code: 'ว31201', subject: 'ฟิสิกส์ 1', room: '415', seat: '08' },
        { id: 'EX-2004', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-26', start: '13:00', end: '14:30', code: 'ว31221', subject: 'เคมี 1', room: '415', seat: '08' },
        { id: 'EX-2005', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-27', start: '09:00', end: '10:30', code: 'อ31101', subject: 'ภาษาอังกฤษ 1', room: '415', seat: '08' },
        { id: 'EX-2006', exam: 'สอบกลางภาคเรียนที่ 1', date: '2025-08-28', start: '09:00', end: '10:30', code: 'ส31101', subject: 'สังคมศึกษา 1', room: '415', seat: '08' }
      ]
    };
  }

  function seedGrades() {
    return {
      c1: [
        { year: '2568', term: 1, subjects: [
          { code: 'ท21101', name: 'ภาษาไทย 1', credit: 1.5, score: 78 },
          { code: 'ค21101', name: 'คณิตศาสตร์ 1', credit: 1.5, score: 65 },
          { code: 'ว21101', name: 'วิทยาศาสตร์ 1', credit: 1.5, score: 82 },
          { code: 'ส21101', name: 'สังคมศึกษา 1', credit: 1.0, score: 74 },
          { code: 'อ21101', name: 'ภาษาอังกฤษ 1', credit: 1.5, score: 88 },
          { code: 'พ21101', name: 'สุขศึกษาและพลศึกษา 1', credit: 0.5, score: 90 },
          { code: 'ศ21101', name: 'ศิลปะ 1', credit: 0.5, score: 85 },
          { code: 'ง21101', name: 'การงานอาชีพ 1', credit: 0.5, score: 80 },
          { code: 'ว21103', name: 'วิทยาการคำนวณ', credit: 1.0, score: 76 },
          { code: 'ก21901', name: 'แนะแนว', credit: 0.5, score: 95 },
          { code: 'ก21902', name: 'ลูกเสือ-เนตรนารี', credit: 0.5, score: 92 }
        ] }
      ],
      c2: [
        { year: '2567', term: 1, subjects: [
          { code: 'ท23101', name: 'ภาษาไทย 5', credit: 1.5, score: 72 },
          { code: 'ค23101', name: 'คณิตศาสตร์ 5', credit: 1.5, score: 68 },
          { code: 'ว23101', name: 'วิทยาศาสตร์ 5', credit: 1.5, score: 74 },
          { code: 'ส23101', name: 'สังคมศึกษา 5', credit: 1.0, score: 80 },
          { code: 'อ23101', name: 'ภาษาอังกฤษ 5', credit: 1.5, score: 45 },
          { code: 'พ23101', name: 'สุขศึกษาและพลศึกษา 5', credit: 0.5, score: 88 },
          { code: 'ศ23101', name: 'ศิลปะ 5', credit: 0.5, score: 82 },
          { code: 'ง23101', name: 'การงานอาชีพ 5', credit: 0.5, score: 79 },
          { code: 'ว23103', name: 'วิทยาการคำนวณ', credit: 1.0, score: 70 },
          { code: 'ก23901', name: 'แนะแนว', credit: 0.5, score: 90 }
        ] },
        { year: '2567', term: 2, subjects: [
          { code: 'ท23102', name: 'ภาษาไทย 6', credit: 1.5, score: 75 },
          { code: 'ค23102', name: 'คณิตศาสตร์ 6', credit: 1.5, score: 71 },
          { code: 'ว23102', name: 'วิทยาศาสตร์ 6', credit: 1.5, score: 77 },
          { code: 'ส23102', name: 'สังคมศึกษา 6', credit: 1.0, score: 83 },
          { code: 'อ23102', name: 'ภาษาอังกฤษ 6', credit: 1.5, score: 66 },
          { code: 'พ23102', name: 'สุขศึกษาและพลศึกษา 6', credit: 0.5, score: 91 },
          { code: 'ศ23102', name: 'ศิลปะ 6', credit: 0.5, score: 84 },
          { code: 'ง23102', name: 'การงานอาชีพ 6', credit: 0.5, score: 81 },
          { code: 'ว23104', name: 'วิทยาการคำนวณ', credit: 1.0, score: 73 },
          { code: 'ก23902', name: 'ลูกเสือ-เนตรนารี', credit: 0.5, score: 95 }
        ] },
        { year: '2568', term: 1, subjects: [
          { code: 'ท31101', name: 'ภาษาไทย 1', credit: 1.5, score: 76 },
          { code: 'ค31101', name: 'คณิตศาสตร์พื้นฐาน 1', credit: 1.0, score: 69 },
          { code: 'ค31201', name: 'คณิตศาสตร์เพิ่มเติม 1', credit: 1.5, score: 63 },
          { code: 'ว31201', name: 'ฟิสิกส์ 1', credit: 1.5, score: 58 },
          { code: 'ว31221', name: 'เคมี 1', credit: 1.5, score: 61 },
          { code: 'ว31241', name: 'ชีววิทยา 1', credit: 1.5, score: 72 },
          { code: 'อ31101', name: 'ภาษาอังกฤษ 1', credit: 1.5, score: 85 },
          { code: 'ส31101', name: 'สังคมศึกษา 1', credit: 1.0, score: 79 },
          { code: 'พ31101', name: 'สุขศึกษาและพลศึกษา 1', credit: 0.5, score: 88 },
          { code: 'ก31901', name: 'แนะแนว', credit: 0.5, score: 92 }
        ] }
      ]
    };
  }

  function seedLeaveRequests() {
    return [
      { id: 'PL-0001', childId: 'c1', studentId: 'STD-2568-0101', name: 'ภูมิ ใจดี', cls: 'ม.1/2', type: 'ลาป่วย',
        submitDate: '2025-07-02', startDate: '2025-07-03', endDate: '2025-07-04', days: 2, reason: 'มีไข้สูง ไม่สบายตัว',
        attachment: { name: 'ใบรับรองแพทย์.pdf', size: '245 KB' }, contactPhone: '089-123-4567',
        status: 'อนุมัติ', comment: '', submittedBy: 'ผู้ปกครอง' },
      { id: 'PL-0002', childId: 'c1', studentId: 'STD-2568-0101', name: 'ภูมิ ใจดี', cls: 'ม.1/2', type: 'ลากิจ',
        submitDate: '2025-08-15', startDate: '2025-08-18', endDate: '2025-08-18', days: 1, reason: 'ไปทำธุระสำคัญของครอบครัวต่างจังหวัด',
        attachment: null, contactPhone: '089-123-4567', status: 'รอตรวจสอบ', comment: '', submittedBy: 'ผู้ปกครอง' },
      { id: 'PL-0003', childId: 'c2', studentId: 'STD-2568-0102', name: 'ใบเตย ใจดี', cls: 'ม.4/1', type: 'ลาป่วย',
        submitDate: '2025-08-10', startDate: '2025-08-11', endDate: '2025-08-11', days: 1, reason: 'ปวดท้องรุนแรง',
        attachment: null, contactPhone: '089-123-4567', status: 'ไม่อนุมัติ', comment: 'กรุณาแนบเอกสาร', submittedBy: 'ผู้ปกครอง' }
    ];
  }

  function seedStudentProfiles() {
    return {
      c1: {
        gender: 'ชาย', nationality: 'ไทย', ethnicity: 'ไทย', religion: 'พุทธ',
        nationalId: '1-1099-xxxxx-01-2', birthPlace: 'โรงพยาบาลรามาธิบดี กรุงเทพฯ',
        previousSchool: 'โรงเรียนอนุบาลจตุจักร', enrollDate: '2568-05-16',
        address: {
          registered: '99/1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          current: '99/1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900'
        },
        father: { name: 'นายสมชาย ใจดี', occupation: 'พนักงานบริษัท', phone: '089-123-4567', status: 'ผู้ปกครองหลัก' },
        mother: { name: 'นางสมหญิง ใจดี', occupation: 'พยาบาล', phone: '089-765-4321', status: 'ผู้ปกครองร่วม' },
        guardian: null,
        siblings: [
          { childId: 'c2', name: 'ใบเตย ใจดี', relation: 'พี่สาว', age: 15, school: 'โรงเรียนสาธิต SchoolDark' }
        ],
        health: { conditions: '-', allergies: 'แพ้อาหารทะเล', weight: '38 กก.', height: '148 ซม.' },
        emergencyContact: { name: 'นางสมหญิง ใจดี', relation: 'มารดา', phone: '089-765-4321' }
      },
      c2: {
        gender: 'หญิง', nationality: 'ไทย', ethnicity: 'ไทย', religion: 'พุทธ',
        nationalId: '1-1099-xxxxx-02-9', birthPlace: 'โรงพยาบาลรามาธิบดี กรุงเทพฯ',
        previousSchool: 'โรงเรียนสาธิต SchoolDark (ม.ต้น)', enrollDate: '2565-05-17',
        address: {
          registered: '99/1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          current: '99/1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900'
        },
        father: { name: 'นายสมชาย ใจดี', occupation: 'พนักงานบริษัท', phone: '089-123-4567', status: 'ผู้ปกครองหลัก' },
        mother: { name: 'นางสมหญิง ใจดี', occupation: 'พยาบาล', phone: '089-765-4321', status: 'ผู้ปกครองร่วม' },
        guardian: null,
        siblings: [
          { childId: 'c1', name: 'ภูมิ ใจดี', relation: 'น้องชาย', age: 12, school: 'โรงเรียนสาธิต SchoolDark' }
        ],
        health: { conditions: '-', allergies: '-', weight: '52 กก.', height: '160 ซม.' },
        emergencyContact: { name: 'นายสมชาย ใจดี', relation: 'บิดา', phone: '089-123-4567' }
      }
    };
  }

  function seedTickets() {
    return [
      { id: 'TK-0101', childId: 'c1', type: 'ผู้ปกครองมารับก่อนกำหนด', date: '2025-06-20', time: '14:00-16:00',
        reason: 'พาไปพบแพทย์ตามนัด', status: 'อนุมัติ', comment: '' },
      { id: 'TK-0102', childId: 'c2', type: 'ผู้ปกครองมารับก่อนกำหนด', date: '2025-07-15', time: '12:00-16:00',
        reason: 'ไปทำธุระสำคัญของครอบครัว', status: 'อนุมัติ', comment: '' }
    ];
  }

  function seedAnnouncements() {
    return [
      { id: 'AN-1', date: '2025-08-20', title: 'ประชุมผู้ปกครองประจำภาคเรียนที่ 1', body: 'ขอเชิญผู้ปกครองเข้าร่วมประชุมชี้แจงผลการเรียนและกิจกรรมของโรงเรียน ณ หอประชุมใหญ่ เวลา 08:30-12:00 น. โปรดนำบัตรประจำตัวผู้ปกครองมาแสดงที่จุดลงทะเบียนหน้าหอประชุม', tag: 'สำคัญ' },
      { id: 'AN-2', date: '2025-08-10', title: 'กำหนดการชำระค่าบำรุงการศึกษาภาคเรียนที่ 1', body: 'ขอให้ผู้ปกครองชำระค่าบำรุงการศึกษาภายในวันที่ 31 สิงหาคม 2568 ผ่านช่องทางที่โรงเรียนกำหนด หากพ้นกำหนดจะมีค่าธรรมเนียมล่าช้าตามระเบียบของโรงเรียน', tag: 'สำคัญ' },
      { id: 'AN-3', date: '2025-07-25', title: 'กิจกรรมกีฬาสีประจำปี 2568', body: 'โรงเรียนจัดกิจกรรมกีฬาสีเพื่อส่งเสริมสุขภาพและความสามัคคีของนักเรียน ระหว่างวันที่ 15-16 สิงหาคม 2568 ณ สนามกีฬาโรงเรียน ผู้ปกครองสามารถเข้าร่วมชมและเชียร์บุตรหลานได้ตลอดกิจกรรม', tag: 'กิจกรรม' },
      { id: 'AN-4', date: '2025-07-01', title: 'แจ้งหยุดเรียนวันเข้าพรรษา', body: 'โรงเรียนหยุดเรียนตามประกาศราชการในวันเข้าพรรษา และจะเปิดเรียนตามปกติในวันทำการถัดไป', tag: 'ทั่วไป' },
      { id: 'AN-5', date: '2025-06-15', title: 'เปิดให้ยืมหนังสือเรียนเพิ่มเติมที่ห้องสมุด', body: 'ห้องสมุดโรงเรียนเปิดให้นักเรียนยืมหนังสือเรียนและหนังสืออ่านเพิ่มเติมได้ตั้งแต่บัดนี้เป็นต้นไป สอบถามรายละเอียดที่เจ้าหน้าที่ห้องสมุด', tag: 'ทั่วไป' },
      { id: 'AN-6', date: '2025-06-01', title: 'แจ้งตารางตรวจสุขภาพนักเรียนประจำปี', body: 'โรงเรียนร่วมกับโรงพยาบาลในพื้นที่จัดตรวจสุขภาพนักเรียนทุกระดับชั้นประจำปีการศึกษา ผู้ปกครองไม่ต้องเตรียมเอกสารเพิ่มเติม ผลตรวจจะแจ้งผ่านครูประจำชั้น', tag: 'กิจกรรม' }
    ];
  }

  // points: ติดลบ = หัก, บวก = เพิ่ม (เริ่มต้น BEHAVIOR_BASE คะแนน — ดู behaviorSummary())
  function seedBehavior() {
    return [
      { id: 'BH-01', childId: 'c1', date: '2025-06-12', category: 'มาสาย', points: -2, detail: 'มาถึงโรงเรียน 08:15 น.', recordedBy: 'ครูสมศรี ใจงาม' },
      { id: 'BH-02', childId: 'c1', date: '2025-06-25', category: 'แต่งกายผิดระเบียบ', points: -5, detail: 'ไม่สวมรองเท้านักเรียนตามระเบียบ', recordedBy: 'ครูสมศรี ใจงาม' },
      { id: 'BH-03', childId: 'c1', date: '2025-07-08', category: 'ไม่ส่งงาน', points: -3, detail: 'ไม่ส่งการบ้านวิชาคณิตศาสตร์', recordedBy: 'ครูสมศรี ใจงาม' },
      { id: 'BH-04', childId: 'c1', date: '2025-07-20', category: 'ออกนอกบริเวณโรงเรียนโดยไม่ได้รับอนุญาต', points: -10, detail: 'ออกนอกโรงเรียนช่วงพักกลางวันโดยไม่ได้แจ้งครู', recordedBy: 'ฝ่ายปกครอง' },
      { id: 'BH-05', childId: 'c1', date: '2025-08-05', category: 'จิตอาสา/บำเพ็ญประโยชน์', points: 5, detail: 'ร่วมกิจกรรมบำเพ็ญประโยชน์ทำความสะอาดโรงเรียน', recordedBy: 'ครูสมศรี ใจงาม' },
      { id: 'BH-06', childId: 'c2', date: '2025-06-18', category: 'ได้รับคำชมเชย', points: 3, detail: 'ช่วยเหลือรุ่นน้องในกิจกรรมวันไหว้ครู', recordedBy: 'ครูประเสริฐ วงศ์ดี' },
      { id: 'BH-07', childId: 'c2', date: '2025-07-05', category: 'มาสาย', points: -2, detail: 'มาถึงโรงเรียน 08:10 น.', recordedBy: 'ครูประเสริฐ วงศ์ดี' },
      { id: 'BH-08', childId: 'c2', date: '2025-08-01', category: 'ไม่ส่งงาน', points: -3, detail: 'ไม่ส่งรายงานวิชาภาษาไทยตามกำหนด', recordedBy: 'ครูประเสริฐ วงศ์ดี' }
    ];
  }

  var LEAVE_TYPES = [
    { name: 'ลาป่วย', desc: 'ลาหยุดเนื่องจากเจ็บป่วย ไข้หวัด อุบัติเหตุ', color: 'danger', quota: 15 },
    { name: 'ลากิจ', desc: 'ลาหยุดเพื่อทำธุระส่วนตัว หรือธุระจำเป็นของครอบครัว', color: 'warning', quota: 10 },
    { name: 'ลาอื่น ๆ', desc: 'ลาหยุดเนื่องจากกรณีพิเศษอื่น ๆ ที่จำเป็น', color: 'primary', quota: 5 }
  ];

  var STATUS_LABEL = { present: 'มาเรียน', late: 'มาสาย', absent: 'ขาดเรียน', leave: 'ลา' };

  var BEHAVIOR_BASE = 100;

  var SEEDS = {
    parent_session: seedSession,
    parent_active_child: seedActiveChild,
    parent_profile: seedProfile,
    parent_children: seedChildren,
    parent_periods: seedPeriods,
    parent_timetables: seedTimetables,
    parent_exams: seedExams,
    parent_grades: seedGrades,
    parent_student_profiles: seedStudentProfiles,
    parent_leave_requests: seedLeaveRequests,
    parent_tickets: seedTickets,
    parent_announcements: seedAnnouncements,
    parent_behavior: seedBehavior
  };

  var ALL_KEYS = [
    'parent_session', 'parent_active_child', 'parent_profile', 'parent_children', 'parent_periods',
    'parent_timetables', 'parent_exams', 'parent_grades', 'parent_student_profiles', 'parent_leave_requests',
    'parent_tickets', 'parent_announcements', 'parent_attendance', 'parent_behavior'
  ];

  /* ---------------------------------------------------------------------
   * today() / attendance generator
   * ------------------------------------------------------------------- */

  function findCurrentAcademicYear() {
    try {
      if (!window.SchoolStore) return null;
      var years = window.SchoolStore.get('school_academic_years');
      for (var i = 0; i < years.length; i++) { if (years[i].isCurrent) return years[i]; }
    } catch (e) {}
    return null;
  }

  function todayImpl() {
    try {
      var cur = findCurrentAcademicYear();
      if (cur) {
        var now = new Date();
        var todayStr = toDateStr(now.getFullYear(), now.getMonth() + 1, now.getDate());
        if (todayStr >= cur.term1Start && todayStr <= cur.term2End) return todayStr;
      }
    } catch (e) {}
    return '2025-08-20';
  }

  function isHoliday(dateStr) {
    try {
      if (!window.SchoolStore) return false;
      var cal = window.SchoolStore.get('school_calendar');
      for (var i = 0; i < cal.length; i++) {
        var ev = cal[i];
        if (ev.type === 'holiday') {
          var start = ev.date, end = ev.endDate || ev.date;
          if (dateStr >= start && dateStr <= end) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function getAttendanceStartDate() {
    try {
      var cur = findCurrentAcademicYear();
      if (cur && cur.term1Start) return cur.term1Start;
    } catch (e) {}
    return '2025-05-16';
  }

  function genAttendance() {
    var start = getAttendanceStartDate();
    var end = todayImpl();
    var result = { c1: [], c2: [] };
    var ids = ['c1', 'c2'];
    var cur = start;
    var guard = 0;
    while (cur <= end && guard < 2000) {
      guard++;
      var dow = dayOfWeek(cur);
      if (dow >= 1 && dow <= 5 && !isHoliday(cur)) {
        ids.forEach(function (cid) {
          var h = hashStr(cid + cur);
          var status, timeIn;
          if (h < 3) { status = 'absent'; timeIn = null; }
          else if (h < 8) { status = 'leave'; timeIn = null; }
          else if (h < 18) { status = 'late'; timeIn = '08:' + pad2(h % 30); }
          else { status = 'present'; timeIn = '07:' + pad2(15 + (h % 45)); }
          result[cid].push({ date: cur, status: status, timeIn: timeIn });
        });
      }
      cur = addDays(cur, 1);
    }
    return result;
  }

  function countSchoolDaysImpl(start, end) {
    var count = 0, cur = start, guard = 0;
    while (cur <= end && guard < 3660) {
      guard++;
      var dow = dayOfWeek(cur);
      if (dow >= 1 && dow <= 5) count++;
      cur = addDays(cur, 1);
    }
    return count;
  }

  /* ---------------------------------------------------------------------
   * core get/save/reset
   * ------------------------------------------------------------------- */

  function get(key) {
    try {
      var raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (e) {}
    if (key === 'parent_attendance') return genAttendance();
    var seedFn = SEEDS[key];
    return seedFn ? seedFn() : null;
  }

  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function reset(key) {
    try { localStorage.removeItem(key); } catch (e) {}
    return get(key);
  }

  function resetAll() {
    ALL_KEYS.forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  function uid(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  }

  /* ---------------------------------------------------------------------
   * public API
   * ------------------------------------------------------------------- */

  var ParentStore = {
    get: get,
    save: save,
    reset: reset,
    resetAll: resetAll,
    uid: uid,

    LEAVE_TYPES: LEAVE_TYPES,
    STATUS_LABEL: STATUS_LABEL,
    BEHAVIOR_BASE: BEHAVIOR_BASE,

    getSession: function () { return this.get('parent_session'); },
    login: function (username) { this.save('parent_session', { parentId: 'p1', loginAt: new Date().toISOString() }); },
    logout: function () { this.save('parent_session', null); },

    getParent: function () { return this.get('parent_profile'); },
    saveParent: function (patch) {
      var cur = this.getParent();
      var merged = Object.assign({}, cur, patch);
      if (patch && patch.notify) merged.notify = Object.assign({}, cur.notify, patch.notify);
      this.save('parent_profile', merged);
      return merged;
    },

    getChildren: function () {
      var profile = this.getParent();
      var all = this.get('parent_children');
      return all.filter(function (c) { return (profile.childIds || []).indexOf(c.id) !== -1; });
    },
    getActiveChild: function () {
      var id = this.get('parent_active_child');
      var children = this.getChildren();
      var found = children.filter(function (c) { return c.id === id; })[0];
      return found || children[0];
    },
    setActiveChild: function (id) { this.save('parent_active_child', id); },

    getStudentProfile: function (childId) {
      var children = this.get('parent_children');
      var child = children.filter(function (c) { return c.id === childId; })[0];
      if (!child) return null;
      var profiles = this.get('parent_student_profiles');
      var extra = profiles[childId] || {};
      return Object.assign({}, child, extra);
    },

    today: function () { return todayImpl(); },

    gradePoint: function (score) {
      if (score >= 80) return 4;
      if (score >= 75) return 3.5;
      if (score >= 70) return 3;
      if (score >= 65) return 2.5;
      if (score >= 60) return 2;
      if (score >= 55) return 1.5;
      if (score >= 50) return 1;
      return 0;
    },
    gpa: function (subjects) {
      if (!subjects || !subjects.length) return 0;
      var self = this;
      var sumCredit = 0, sumPoint = 0;
      subjects.forEach(function (s) {
        sumCredit += s.credit;
        sumPoint += s.credit * self.gradePoint(s.score);
      });
      if (sumCredit === 0) return 0;
      return parseFloat((sumPoint / sumCredit).toFixed(2));
    },
    countSchoolDays: function (start, end) { return countSchoolDaysImpl(start, end); },

    addLeave: function (req) {
      var arr = this.get('parent_leave_requests');
      var maxNum = 0;
      arr.forEach(function (r) {
        var m = /PL-(\d+)/.exec(r.id);
        if (m) {
          var n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      });
      var id = 'PL-' + String(maxNum + 1).padStart(4, '0');
      var rec = Object.assign({}, req, {
        id: id,
        submitDate: this.today(),
        days: this.countSchoolDays(req.startDate, req.endDate),
        status: 'รอตรวจสอบ',
        comment: '',
        submittedBy: 'ผู้ปกครอง'
      });
      arr.push(rec);
      this.save('parent_leave_requests', arr);
      return rec;
    },
    cancelLeave: function (id) {
      var arr = this.get('parent_leave_requests');
      var rec = null;
      arr.forEach(function (r) {
        if (r.id === id) { r.status = 'ยกเลิก'; rec = r; }
      });
      this.save('parent_leave_requests', arr);
      return rec;
    },
    leaveUsed: function (childId, type) {
      var arr = this.get('parent_leave_requests');
      var total = 0;
      arr.forEach(function (r) {
        if (r.childId === childId && (!type || r.type === type) &&
            (r.status === 'อนุมัติ' || r.status === 'รอตรวจสอบ')) {
          total += r.days;
        }
      });
      return total;
    },
    behaviorSummary: function (childId) {
      var recs = (this.get('parent_behavior') || []).filter(function (r) { return r.childId === childId; });
      var deducted = 0, added = 0;
      recs.forEach(function (r) { if (r.points < 0) deducted += -r.points; else added += r.points; });
      return { records: recs, deducted: deducted, added: added, score: BEHAVIOR_BASE - deducted + added };
    }
  };

  return ParentStore;
})();
