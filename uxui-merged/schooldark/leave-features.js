// ======================================================================
//  MOCK DATA
// ======================================================================
const STUDENTS = [
  { id:'S-3001', name:'อนุชิต พิมใจ',    cls:'ม.3/1', no:12 },
  { id:'S-3002', name:'สุภาพร แก้วใส',   cls:'ม.3/1', no:18 },
  { id:'S-2001', name:'ปริญญา สุขสันต์', cls:'ม.2/3', no: 5 },
  { id:'S-2002', name:'วิภา ดวงดี',      cls:'ม.2/3', no:22 },
  { id:'S-4001', name:'ธนากร ทองคำ',     cls:'ม.4/2', no: 9 },
  { id:'S-4002', name:'ณัฐพล รักเรียน',  cls:'ม.4/2', no:14 },
  { id:'S-1001', name:'มาลี ชนะภัย',     cls:'ม.1/1', no: 3 },
  { id:'S-5001', name:'ภัทรวดี ไชยวงค์', cls:'ม.5/1', no:11 },
];

// ----------------------------------------------------------------------
// รายชื่อนักเรียนตัวอย่างเพิ่มเติม (สำหรับเช็คชื่อ/รายงานการมาเรียน) — สร้างแบบ deterministic
// (seed คงที่) ให้ได้ชื่อชุดเดิมทุกครั้งที่โหลดหน้า เติมห้องละ ATT_ROOM_SIZE คนโดยไม่ทับเลขที่
// ของ 8 คนเดิมด้านบน รหัสใหม่เป็น S-<ชั้น><ห้อง><เลขที่ 2 หลัก> จึงไม่ชนกับรหัสเดิม (S-x0xx)
// gender ใช้เลือกคำนำหน้า (เด็กชาย/เด็กหญิง ม.1-3, นาย/นางสาว ม.4-6) ดู studentFullName()
// ----------------------------------------------------------------------
const ATT_ROOM_SIZE = 25;
const ATT_ROOMS = ['ม.1/1', 'ม.1/2', 'ม.2/3', 'ม.3/1', 'ม.4/2', 'ม.5/1', 'ม.6/1'];
const STUDENT_GENDER_SEED = { 'S-3001': 'M', 'S-3002': 'F', 'S-2001': 'F', 'S-2002': 'F', 'S-4001': 'M', 'S-4002': 'M', 'S-1001': 'F', 'S-5001': 'F' };

function seededRandom(seedText) {
  // mulberry32 จาก hash ของข้อความ — ได้ลำดับสุ่มเดิมเสมอสำหรับ seed เดิม
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

(function generateStudentRoster() {
  const male = ['ปุณณ์', 'ธนภัทร', 'กิตติพัศ', 'ภูมิพัฒน์', 'ณัฐวุฒิ', 'ศุภกร', 'พีรพัฒน์', 'ธีรเดช', 'วรเมธ', 'ชยพล', 'อชิรวิทย์', 'ภาคิน', 'ธนกฤต', 'ปกรณ์', 'รัชชานนท์', 'สิรวิชญ์', 'กฤษดา', 'ณภัทร'];
  const female = ['ปุณยวีร์', 'ณิชาภัทร', 'พิมพ์ชนก', 'กัญญาณัฐ', 'ชนิดา', 'อรปรียา', 'ธัญชนก', 'ศิริกานดา', 'พรรษชล', 'ปาณิสรา', 'วรัญญา', 'สุชานันท์', 'ภัทรธิดา', 'กมลชนก', 'ญาณิศา', 'เบญญาภา', 'นันทิชา', 'ปริยากร'];
  const last = ['จันทร์ประโคน', 'ศรีสุข', 'บุญมา', 'แก้วมณี', 'ทองดี', 'สายสุวรรณ', 'พรหมวงศ์', 'รุ่งเรือง', 'ใจงาม', 'มั่นคง', 'วงศ์ไทย', 'ประเสริฐ', 'สมบูรณ์', 'ชัยมงคล', 'พูลสวัสดิ์', 'อินทรสุวรรณ', 'เพชรรัตน์', 'บุญเรือง', 'ศักดิ์ดี', 'คำภา'];
  STUDENTS.forEach(s => { s.gender = STUDENT_GENDER_SEED[s.id] || 'M'; });
  ATT_ROOMS.forEach(cls => {
    const rand = seededRandom('roster|' + cls);
    const used = new Set(STUDENTS.filter(s => s.cls === cls).map(s => s.no));
    const [g, rm] = cls.replace('ม.', '').split('/');
    for (let no = 1; no <= ATT_ROOM_SIZE; no++) {
      if (used.has(no)) continue;
      const gender = rand() < 0.5 ? 'M' : 'F';
      const pool = gender === 'M' ? male : female;
      const name = pool[Math.floor(rand() * pool.length)] + ' ' + last[Math.floor(rand() * last.length)];
      STUDENTS.push({ id: 'S-' + g + rm + String(no).padStart(2, '0'), name, cls, no, gender });
    }
  });
})();

// ชื่อเต็มพร้อมคำนำหน้า เช่น "เด็กชาย ปุณณ์ จันทร์ประโคน" (ม.1-3) / "นาย ..." (ม.4-6)
function studentFullName(s) {
  const grade = parseInt(String(s.cls || '').replace('ม.', ''), 10) || 0;
  const prefix = grade >= 4 ? (s.gender === 'F' ? 'นางสาว' : 'นาย') : (s.gender === 'F' ? 'เด็กหญิง' : 'เด็กชาย');
  return prefix + ' ' + s.name;
}


const EMPLOYEES = [
  {
    id: 'T-1042',
    name: 'สมปอง ทองดี',
    type: 'ครูเทศบาล',
    dept: 'วิทยาศาสตร์',
    pos: 'ครูประจำชั้น ม.3/1',
    bio: 'ใช้',
    finger: 'F-1042',
    contract: 'บรรจุ',
    phone: '081-234-5678',
    schedule: 'จ-ศ 07:30-16:30',
    attendance: { statusIn: 'ตรงเวลา', timeIn: '07:42', statusOut: 'ยังไม่ออก', timeOut: '-', note: '-' },
    // Rich details
    prefix: 'นาย',
    cid: '1309900123456',
    dob: '1985-03-15',
    gender: 'ชาย',
    blood: 'O',
    nationality: 'ไทย',
    religion: 'พุทธ',
    email: 'sompong@school.ac.th',
    regAddress: { houseNo: '123/45', moo: '2', road: 'มิตรภาพ', province: 'นครราชสีมา', district: 'เมือง', subdistrict: 'ในเมือง', zip: '30000' },
    conAddress: { same: true },
    spouse: 'นางสมศรี ทองดี',
    spousePhone: '089-765-4321',
    children: [{ name: 'ด.ช.สมชาย ทองดี', dob: '2015-08-20' }],
    degree: 'ปริญญาโท',
    major: 'ฟิสิกส์ศึกษา',
    institution: 'มหาวิทยาลัยขอนแก่น',
    gradYear: '2550',
    gpa: '3.65',
    honors: [{ name: 'ครูวิทยาศาสตร์ดีเด่น', org: 'สพฐ.' }],
    trainings: [{ name: 'อบรมการสอน Active Learning ยุคใหม่', date: '2025-12-15', org: 'คุรุสภา', type: 'อบรม', hours: 18, topic: 'เทคนิคการจัดการเรียนรู้เชิงรุกสำหรับวิชาวิทยาศาสตร์' }],
    toeicScore: '685',
    toeicDate: '2023-11-04',
    hireDate: '2555-05-16',
    salary: '32,500',
    workStatus: 'ปฏิบัติงานปกติ',
    licNumber: '63109000123456',
    licType: 'ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)',
    licIssue: '2020-05-10',
    licExpire: '2025-05-09',
    royalDecorations: [{ name: 'ทวีติยาภรณ์มงกุฎไทย (ท.ม.)', year: '2560' }]
  },
  {
    id: 'T-1049',
    name: 'สุดา ใจดี',
    type: 'ครูอัตราจ้าง',
    dept: 'ภาษาไทย',
    pos: 'ครูผู้สอน',
    bio: 'ใช้',
    finger: 'F-1049',
    contract: 'รายปี',
    phone: '089-876-5432',
    schedule: 'จ-ศ 07:30-16:30',
    attendance: { statusIn: 'สาย', timeIn: '08:18', statusOut: 'ออกแล้ว', timeOut: '16:35', note: 'รถติดหนัก' },
    prefix: 'นางสาว',
    cid: '1100200345678',
    dob: '1992-07-22',
    gender: 'หญิง',
    blood: 'B',
    nationality: 'ไทย',
    religion: 'พุทธ',
    email: 'suda.j@school.ac.th',
    regAddress: { houseNo: '99/1', moo: '5', road: 'สุขุมวิท', province: 'กรุงเทพมหานคร', district: 'วัฒนา', subdistrict: 'คลองเตยเหนือ', zip: '10110' },
    conAddress: { same: false, houseNo: '12/3', moo: '-', road: 'แจ้งวัฒนะ', province: 'นนทบุรี', district: 'ปากเกร็ด', subdistrict: 'บางตลาด', zip: '11120' },
    spouse: '-',
    spousePhone: '-',
    children: [],
    degree: 'ปริญญาตรี',
    major: 'การสอนภาษาไทย',
    institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
    gradYear: '2558',
    gpa: '3.42',
    honors: [{ name: 'ครูภาษาไทยดีเด่นประจำจังหวัด', org: 'จังหวัดนนทบุรี' }],
    trainings: [{ name: 'อบรมพัฒนาสื่อดิจิทัลภาษาไทย', date: '2026-01-20', org: 'สสวท.', type: 'อบรม', hours: 12, topic: 'การผลิตสื่อการสอนดิจิทัลวิชาภาษาไทย' }],
    toeicScore: '520',
    toeicDate: '2022-09-18',
    hireDate: '2562-06-01',
    salary: '18,000',
    workStatus: 'ปฏิบัติงานปกติ',
    licNumber: '64203001876543',
    licType: 'ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)',
    licIssue: '2021-08-15',
    licExpire: '2026-08-14',
    royalDecorations: []
  },
  {
    id: 'M-1001',
    name: 'มานพ ศรีสุข',
    type: 'ผู้บริหาร',
    dept: 'ฝ่ายบริหาร',
    pos: 'ผู้อำนวยการ',
    bio: 'ใช้',
    finger: 'F-1001',
    contract: 'บรรจุ',
    phone: '090-111-2222',
    schedule: 'จ-ศ 07:00-17:00',
    attendance: { statusIn: 'ขาด', timeIn: '-', statusOut: 'ไม่มีข้อมูล', timeOut: '-', note: 'ประชุม สพฐ.' },
    prefix: 'นาย',
    cid: '3101200334455',
    dob: '1970-11-05',
    gender: 'ชาย',
    blood: 'A',
    nationality: 'ไทย',
    religion: 'พุทธ',
    email: 'manop@school.ac.th',
    regAddress: { houseNo: '5/12', moo: '8', road: 'พหลโยธิน', province: 'กรุงเทพมหานคร', district: 'จตุจักร', subdistrict: 'ลาดยาว', zip: '10900' },
    conAddress: { same: true },
    spouse: 'นางสุภาพร ศรีสุข',
    spousePhone: '081-333-4444',
    children: [{ name: 'น.ส.แพรว ศรีสุข', dob: '2005-12-10' }, { name: 'นายพล ศรีสุข', dob: '2008-04-15' }],
    degree: 'ปริญญาเอก',
    major: 'การบริหารการศึกษา',
    institution: 'มหาวิทยาลัยเกษตรศาสตร์',
    gradYear: '2548',
    gpa: '3.89',
    honors: [{ name: 'ผู้บริหารสถานศึกษาดีเด่นแห่งชาติ', org: 'กระทรวงศึกษาธิการ' }],
    trainings: [{ name: 'สัมมนาการยกระดับคุณภาพการศึกษาระดับมัธยม', date: '2026-02-10', org: 'สพฐ.', type: 'สัมมนา', hours: 16, topic: 'แนวทางการยกระดับคุณภาพการศึกษาระดับมัธยมศึกษา' }],
    toeicScore: '780',
    toeicDate: '2024-02-15',
    hireDate: '2545-10-01',
    salary: '68,000',
    workStatus: 'ปฏิบัติงานปกติ',
    licNumber: '58402000111222',
    licType: 'ใบอนุญาตประกอบวิชาชีพผู้บริหารสถานศึกษา',
    licIssue: '2015-11-12',
    licExpire: '2025-11-11',
    royalDecorations: [{ name: 'ปถมาภรณ์มงกุฎไทย (ป.ม.)', year: '2561' }, { name: 'ทวีติยาภรณ์ช้างเผือก (ท.ช.)', year: '2565' }]
  },
  {
    id: 'T-1055',
    name: 'พัชรี บุญมา',
    type: 'ครูเทศบาล',
    dept: 'คณิตศาสตร์',
    pos: 'ครูผู้สอน',
    bio: 'ใช้',
    finger: 'F-1055',
    contract: 'บรรจุ',
    phone: '085-333-4444',
    schedule: 'จ-ศ 07:30-16:30',
    attendance: { statusIn: 'ตรงเวลา', timeIn: '07:38', statusOut: 'ออกแล้ว', timeOut: '16:30', note: '-' },
    prefix: 'นาง',
    cid: '3140500123987',
    dob: '1988-12-30',
    gender: 'หญิง',
    blood: 'AB',
    nationality: 'ไทย',
    religion: 'พุทธ',
    email: 'patcharee.b@school.ac.th',
    regAddress: { houseNo: '88/9', moo: '-', road: 'รัชดาภิเษก', province: 'กรุงเทพมหานคร', district: 'ห้วยขวาง', subdistrict: 'สามเสนนอก', zip: '10310' },
    conAddress: { same: true },
    spouse: 'นายเกรียงไกร บุญมา',
    spousePhone: '086-444-5555',
    children: [{ name: 'ด.ญ.กัญญากล บุญมา', dob: '2019-03-12' }],
    degree: 'ปริญญาโท',
    major: 'คณิตศาสตร์ประยุกต์',
    institution: 'จุฬาลงกรณ์มหาวิทยาลัย',
    gradYear: '2555',
    gpa: '3.70',
    honors: [{ name: 'ครูผู้สอนนักเรียนคณิตศาสตร์โอลิมปิกดีเด่น', org: 'สสวท.' }],
    trainings: [{ name: 'อบรม AI เพื่อการจัดการเรียนการสอนคณิตศาสตร์', date: '2026-03-05', org: 'มหาวิทยาลัยมหิดล', type: 'อบรม', hours: 20, topic: 'การประยุกต์ใช้ AI ในการจัดการเรียนการสอนวิชาคณิตศาสตร์' }],
    toeicScore: '605',
    toeicDate: '2023-08-12',
    hireDate: '2557-05-16',
    salary: '29,400',
    workStatus: 'ปฏิบัติงานปกติ',
    licNumber: '60109000889922',
    licType: 'ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)',
    licIssue: '2017-06-01',
    licExpire: '2027-05-31',
    royalDecorations: [{ name: 'เบญจมาภรณ์มงกุฎไทย (บ.ม.)', year: '2563' }]
  },
  {
    id: 'T-1060',
    name: 'ประสิทธิ์ แสง',
    type: 'พนักงานจ้างทั่วไป',
    dept: 'งานอาคาร',
    pos: 'เจ้าหน้าที่อาคาร',
    bio: 'ไม่ใช้',
    finger: '-',
    contract: 'รายเดือน',
    phone: '082-555-6666',
    schedule: 'จ-ศ 07:00-16:00',
    attendance: { statusIn: 'ตรงเวลา', timeIn: '07:00', statusOut: 'ออกแล้ว', timeOut: '16:00', note: '-' },
    prefix: 'นาย',
    cid: '3300500445566',
    dob: '1979-05-14',
    gender: 'ชาย',
    blood: 'O',
    nationality: 'ไทย',
    religion: 'พุทธ',
    email: 'prasit.s@school.ac.th',
    regAddress: { houseNo: '200', moo: '11', road: 'สุขประยูร', province: 'ชลบุรี', district: 'พานทอง', subdistrict: 'พานทอง', zip: '20160' },
    conAddress: { same: true },
    spouse: 'นางมาลี แสง',
    spousePhone: '083-222-3333',
    children: [],
    degree: 'มัธยมศึกษาปีที่ 6',
    major: 'สายอาชีพ/ก่อสร้าง',
    institution: 'วิทยาลัยเทคนิคชลบุรี',
    gradYear: '2540',
    gpa: '2.50',
    honors: [{ name: 'บุคลากรบริการดีเด่นประจำปี', org: 'โรงเรียนสาธิต' }],
    trainings: [{ name: 'อบรมความปลอดภัยและการซ่อมบำรุงอาคารสถานศึกษา', date: '2026-04-22', org: 'กระทรวงมหาดไทย', type: 'อบรม', hours: 8, topic: 'มาตรฐานความปลอดภัยและการซ่อมบำรุงอาคารสถานศึกษา' }],
    toeicScore: '-',
    toeicDate: '-',
    hireDate: '2560-01-01',
    salary: '12,500',
    workStatus: 'ปฏิบัติงานปกติ',
    licNumber: '-',
    licType: 'ไม่มี',
    licIssue: '-',
    licExpire: '-',
    royalDecorations: []
  },
  {
    id: 'T-1063',
    name: 'นงลักษณ์ มา',
    type: 'ครูอัตราจ้าง',
    dept: 'ภาษาอังกฤษ',
    pos: 'ครูผู้สอน',
    bio: 'ใช้',
    finger: 'F-1063',
    contract: 'รายปี',
    phone: '083-777-8888',
    schedule: 'จ-ศ 07:30-16:30',
    attendance: { statusIn: 'ลา', timeIn: '-', statusOut: '-', timeOut: '-', note: 'ลาป่วย' },
    prefix: 'นางสาว',
    cid: '1509900887766',
    dob: '1995-10-12',
    gender: 'หญิง',
    blood: 'A',
    nationality: 'ไทย',
    religion: 'คริสต์',
    email: 'nonglak.m@school.ac.th',
    regAddress: { houseNo: '14/9', moo: '3', road: 'นิมมานเหมินทร์', province: 'เชียงใหม่', district: 'เมือง', subdistrict: 'สุเทพ', zip: '50200' },
    conAddress: { same: true },
    spouse: '-',
    spousePhone: '-',
    children: [],
    degree: 'ปริญญาตรี',
    major: 'ภาษาอังกฤษศึกษา',
    institution: 'มหาวิทยาลัยเชียงใหม่',
    gradYear: '2561',
    gpa: '3.52',
    honors: [{ name: 'เหรียญทองครูผู้สอนทักษะภาษาอังกฤษเพื่อการสื่อสาร', org: 'เขตพื้นที่การศึกษา' }],
    trainings: [{ name: 'อบรม TESOL Certificate Program', date: '2026-05-18', org: 'British Council', type: 'อบรม', hours: 40, topic: 'การพัฒนาทักษะการสอนภาษาอังกฤษตามมาตรฐาน TESOL' }],
    toeicScore: '835',
    toeicDate: '2023-05-20',
    hireDate: '2563-11-01',
    salary: '19,500',
    workStatus: 'ปฏิบัติงานปกติ',
    licNumber: '64109000223344',
    licType: 'ใบอนุญาตประกอบวิชาชีพควบคุม (ครู)',
    licIssue: '2021-02-14',
    licExpire: '2026-02-13',
    royalDecorations: []
  },
  {
    id: 'T-1070',
    name: 'อภิชาต เด่น',
    type: 'ครูพี่เลี้ยง',
    dept: 'ชั้นประถม',
    pos: 'ครูพี่เลี้ยง',
    bio: 'ใช้',
    finger: 'F-1070',
    contract: 'รายภาคเรียน',
    phone: '084-999-0000',
    schedule: 'จ-ศ 07:30-16:30',
    attendance: { statusIn: 'ตรงเวลา', timeIn: '07:45', statusOut: 'ยังไม่ออก', timeOut: '-', note: '-' },
    prefix: 'นาย',
    cid: '1209900987654',
    dob: '1997-02-28',
    gender: 'ชาย',
    blood: 'AB',
    nationality: 'ไทย',
    religion: 'พุทธ',
    email: 'apichat.d@school.ac.th',
    regAddress: { houseNo: '78/2', moo: '-', road: 'แจ้งวัฒนะ', province: 'กรุงเทพมหานคร', district: 'หลักสี่', subdistrict: 'ทุ่งสองห้อง', zip: '10210' },
    conAddress: { same: true },
    spouse: '-',
    spousePhone: '-',
    children: [],
    degree: 'อนุปริญญา',
    major: 'การปฐมวัย',
    institution: 'สวนดุสิต',
    gradYear: '2563',
    gpa: '3.10',
    honors: [],
    trainings: [{ name: 'ปฐมนิเทศการดูแลเด็กพิเศษขั้นพื้นฐาน', date: '2026-06-30', org: 'กระทรวงสาธารณสุข', type: 'ปฐมนิเทศ', hours: 6, topic: 'พื้นฐานการดูแลและส่งเสริมพัฒนาการเด็กที่มีความต้องการพิเศษ' }],
    toeicScore: '-',
    toeicDate: '-',
    hireDate: '2565-05-16',
    salary: '14,000',
    workStatus: 'ปฏิบัติงานปกติ',
    licNumber: '-',
    licType: 'ไม่มี',
    licIssue: '-',
    licExpire: '-',
    royalDecorations: []
  }
];

const HISTORY = [
  { id:'S-3001', name:'อนุชิต พิมใจ',    cls:'ม.3/1', type:'ออกนอกห้องเรียน',        date:'2026-08-31', time:'10:30-11:30', reason:'ห้องน้ำ', status:'อนุมัติ' },
  { id:'S-3002', name:'สุภาพร แก้วใส',   cls:'ม.3/1', type:'เข้าห้องเรียนช้า',             date:'2026-08-30', time:'08:00-08:15', reason:'รถติด', status:'อนุมัติ' },
  { id:'S-4001', name:'ธนากร ทองคำ',     cls:'ม.4/2', type:'ออกนอกบริเวณโรงเรียน',   date:'2026-08-29', time:'13:00-15:00', reason:'ไปติดต่อราชการ', status:'รอตรวจสอบ' },
  { id:'S-2001', name:'ปริญญา สุขสันต์', cls:'ม.2/3', type:'ผู้ปกครองมารับก่อนกำหนด', date:'2026-08-28', time:'14:00',       reason:'ป่วย', status:'อนุมัติ' },
  { id:'S-4002', name:'ณัฐพล รักเรียน',  cls:'ม.4/2', type:'อนุญาตอื่น ๆ',            date:'2026-08-27', time:'08:00-08:30', reason:'รถเสีย', status:'ไม่อนุมัติ' },
  { id:'S-1001', name:'มาลี ชนะภัย',     cls:'ม.1/1', type:'เข้าห้องเรียนช้า',             date:'2026-08-26', time:'08:00-08:20', reason:'รถประจำทางช้า', status:'อนุมัติ' },
  { id:'S-5001', name:'ภัทรวดี ไชยวงค์', cls:'ม.5/1', type:'ออกนอกห้องเรียน',        date:'2026-08-25', time:'11:00-11:15', reason:'พยาบาล', status:'อนุมัติ' },
];
HISTORY.forEach((r, i) => { r.reqId = 'TK-' + String(i + 1).padStart(4, '0'); r.comment = r.comment || ''; });

// Pending/processed multi-day student leave requests (การลาเรียน — distinct from the in-day
// permission tickets above), used by the approval page (view-approve).
const STUDENT_LEAVE_REQUESTS = [
  { id:'SL-0001', studentId:'S-3001', name:'อนุชิต พิมใจ',    cls:'ม.3/1', type:'ลาป่วย',  submitDate:'2026-08-30', startDate:'2026-08-31', endDate:'2026-09-01', days:2, reason:'ไข้หวัดใหญ่ มีใบรับรองแพทย์', attachment:{ name:'ใบรับรองแพทย์-SL-0001.pdf', size:'245 KB' }, status:'รอตรวจสอบ', comment:'' },
  { id:'SL-0002', studentId:'S-2001', name:'ปริญญา สุขสันต์', cls:'ม.2/3', type:'ลากิจ',   submitDate:'2026-08-28', startDate:'2026-08-29', endDate:'2026-08-29', days:1, reason:'ธุระครอบครัวต่างจังหวัด',       attachment:null, status:'รอตรวจสอบ', comment:'' },
  { id:'SL-0003', studentId:'S-4001', name:'ธนากร ทองคำ',     cls:'ม.4/2', type:'ลาป่วย',  submitDate:'2026-08-20', startDate:'2026-08-21', endDate:'2026-08-22', days:2, reason:'ผ่าตัดไส้ติ่ง',                  attachment:{ name:'ใบรับรองแพทย์-SL-0003.pdf', size:'198 KB' }, status:'อนุมัติ', comment:'อนุมัติในระบบ' },
  { id:'SL-0004', studentId:'S-1001', name:'มาลี ชนะภัย',     cls:'ม.1/1', type:'ลาอื่น ๆ', submitDate:'2026-08-18', startDate:'2026-08-19', endDate:'2026-08-19', days:1, reason:'เข้าร่วมแข่งขันกีฬาระดับจังหวัด', attachment:null, status:'อนุมัติ', comment:'อนุมัติในระบบ' },
  { id:'SL-0005', studentId:'S-5001', name:'ภัทรวดี ไชยวงค์', cls:'ม.5/1', type:'ลากิจ',   submitDate:'2026-08-15', startDate:'2026-08-16', endDate:'2026-08-16', days:1, reason:'ไปทำบัตรประชาชน',               attachment:null, status:'ไม่อนุมัติ', comment:'เอกสารไม่ครบถ้วน' },
  // ลาป่วยระยะยาว (ทดสอบใบลาที่กินเวลาหลายสัปดาห์ ครอบคลุมทั้งวันนี้และอนาคต) — ล็อกแถวใน
  // "เช็คชื่อนักเรียน" และขึ้นสถานะ "ลาป่วย" ใน "รายงานการมาเรียน" ทุกวันเรียนตลอดช่วงนี้
  { id:'SL-0006', studentId:'S-1001', name:'มาลี ชนะภัย',     cls:'ม.1/1', type:'ลาป่วย',  submitDate:'2026-09-22', startDate:'2026-09-23', endDate:'2026-10-31', days:39, reason:'ป่วยเป็นไข้เลือดออก แพทย์ให้พักฟื้นระยะยาว', attachment:{ name:'ใบรับรองแพทย์-SL-0006.pdf', size:'312 KB' }, status:'อนุมัติ', comment:'อนุมัติในระบบ' },
];

const TICKET_TYPES = ['เข้าห้องเรียนช้า', 'ออกนอกห้องเรียน', 'ออกนอกบริเวณโรงเรียน', 'อนุญาตอื่น ๆ', 'ผู้ปกครองมารับก่อนกำหนด'];

const SUMMARY_DATA = {
  'ม.1': { 'เข้าห้องเรียนช้า':4, 'ออกนอกห้องเรียน':6,  'ออกนอกบริเวณโรงเรียน':1, 'อนุญาตอื่น ๆ':2, 'ผู้ปกครองมารับก่อนกำหนด':3 },
  'ม.2': { 'เข้าห้องเรียนช้า':7, 'ออกนอกห้องเรียน':9,  'ออกนอกบริเวณโรงเรียน':3, 'อนุญาตอื่น ๆ':4, 'ผู้ปกครองมารับก่อนกำหนด':2 },
  'ม.3': { 'เข้าห้องเรียนช้า':5, 'ออกนอกห้องเรียน':12, 'ออกนอกบริเวณโรงเรียน':5, 'อนุญาตอื่น ๆ':3, 'ผู้ปกครองมารับก่อนกำหนด':1 },
  'ม.4': { 'เข้าห้องเรียนช้า':3, 'ออกนอกห้องเรียน':8,  'ออกนอกบริเวณโรงเรียน':4, 'อนุญาตอื่น ๆ':1, 'ผู้ปกครองมารับก่อนกำหนด':0 },
  'ม.5': { 'เข้าห้องเรียนช้า':6, 'ออกนอกห้องเรียน':11, 'ออกนอกบริเวณโรงเรียน':7, 'อนุญาตอื่น ๆ':5, 'ผู้ปกครองมารับก่อนกำหนด':2 },
  'ม.6': { 'เข้าห้องเรียนช้า':2, 'ออกนอกห้องเรียน':5,  'ออกนอกบริเวณโรงเรียน':2, 'อนุญาตอื่น ๆ':1, 'ผู้ปกครองมารับก่อนกำหนด':1 },
};

// ======================================================================
//  NAVIGATION
// ======================================================================
const VIEW_TITLES = {
  'leave-card': 'ยื่นบัตรขออนุญาต',
  'approve':    'อนุมัติการลานักเรียน',
  'ticket-calendar': 'รายการบัตรขออนุญาต',
  'employees':   'รายชื่อบุคลากรและอาจารย์',
  'sl-submit': 'ยื่นขอลาของนักเรียน',
  'student-dashboard': 'แดชบอร์ดการมาเรียน',
  'attendance-check': 'เช็คชื่อนักเรียน',
  'attendance-report': 'รายงานการมาเรียน'
};

// ======================================================================
//  SHARED HELPERS (used across History and Approval views)
// ======================================================================
function typeBadgeClass(t) {
  switch (t) {
    case 'เข้าห้องเรียนช้า': return 'class-in';
    case 'ออกนอกห้องเรียน': return 'class-out';
    case 'ออกนอกบริเวณโรงเรียน': return 'school-out';
    case 'อนุญาตอื่น ๆ': return 'late-permit';
    case 'ผู้ปกครองมารับก่อนกำหนด': return 'parent-pick';
    default: return 'duty-delegate';
  }
}

function statusBadgeHTML(status) {
  const c = status === 'อนุมัติ' ? 'success' : status === 'รอตรวจสอบ' ? 'warning' : 'danger';
  return `<span class="badge ${c}">${status}</span>`;
}

function thaiDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${parseInt(y) + 543}`;
}

const THAI_MONTHS_FULL = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

// วันที่แบบเต็ม เช่น "07 สิงหาคม 2569" (ใช้ในเอกสารพิมพ์ เช่น แบบใบลา)
function thaiDateLong(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${THAI_MONTHS_FULL[m - 1]} ${y + 543}`;
}

const SCHOOL_INFO = {
  name: 'โรงเรียนเทศบาลนครมาบตาพุด',
  address: '9/9 ถ.มาบตาพุดเมืองใหม่สาย 2 เมืองระยอง ระยอง 21150',
  phone: '-'
};

function studentLeaveTypeBadgeClass(typeName) {
  const t = STUDENT_LEAVE_TYPES.find(t => t.name === typeName);
  const color = t ? t.color : 'info';
  // The .badge pill only has success/warning/danger/info variants defined.
  return color === 'primary' ? 'info' : color;
}

function showModuleView(view, activeItem = null) {
  if (!VIEW_TITLES[view]) return;
  const targetView = document.getElementById('view-' + view);
  if (!targetView) return;

  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
  if (activeItem) {
    activeItem.classList.add('active');
  } else {
    const menuItem = document.querySelector(`.menu-item[data-view="${view}"]`);
    if (menuItem) menuItem.classList.add('active');
  }

  // Auto-expand the active item's submenu (its tabs/wizard steps), collapse the rest
  document.querySelectorAll('.menu-item-group').forEach(group => group.classList.remove('expanded'));
  const activeMenuItem = document.querySelector('.menu-item.active');
  const activeGroup = activeMenuItem ? activeMenuItem.closest('.menu-item-group') : null;
  if (activeGroup) activeGroup.classList.add('expanded');

  document.querySelectorAll('.module-view').forEach(v => v.classList.remove('active'));
  targetView.classList.add('active');
  document.getElementById('current-title').textContent = VIEW_TITLES[view];

  // หมวดตรงกับกลุ่มใน sidebar (NAV_GROUPS ใน ../shared/cross-nav.js)
  const BREADCRUMB_GROUP = {
    'sl-submit': 'งานบริหารการลา', 'approve': 'งานบริหารการลา',
    'student-dashboard': 'งานกิจการนักเรียน',
    'attendance-check': 'งานกิจการนักเรียน', 'attendance-report': 'งานกิจการนักเรียน',
  };
  document.getElementById('breadcrumb').textContent = 'SchoolDark / ' + (BREADCRUMB_GROUP[view] || 'งานกิจการนักเรียน') + ' / ' + VIEW_TITLES[view];

  if (view === 'history') {
    renderHistKpi();
    renderAllHistory();
  }
  if (view === 'employees') renderEmployees();
  if (view === 'sl-submit') renderSLSubmitPending();
  if (view === 'approve') renderApprovals();
  if (view === 'student-dashboard') renderStudentDashboardView();
  if (view === 'attendance-check') renderAttendanceCheckView();
  if (view === 'attendance-report') renderAttendanceReportView();
  if (view === 'ticket-calendar') { renderTicketApprovals(); renderStudentList(); renderSummary(); }
}

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const view = item.dataset.view;
    if (!view) return; // Allow normal link href (like app.html) to work!
    e.preventDefault();
    showModuleView(view, item);
  });
});

document.querySelectorAll('.submenu-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const group = btn.closest('.menu-item-group');
    if (group) group.classList.toggle('expanded');
  });
});

document.querySelectorAll('.submenu-item').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const view = link.dataset.view;
    const menuItem = document.querySelector(`.menu-item[data-view="${view}"]`);
    showModuleView(view, menuItem);

    document.querySelectorAll('.submenu-item').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const step = link.dataset.step;
    const tab = link.dataset.tab;

    if (step) {
      const stepNum = parseInt(step, 10);
      if (view === 'leave-card' && typeof goStep === 'function') goStep(stepNum);
      else if (view === 'sl-submit' && typeof goSLSubmitStep === 'function') goSLSubmitStep(stepNum);
    } else if (tab) {
      const tabBtn = document.querySelector(`#view-${view} .tab-btn[data-tab="${tab}"]`);
      if (tabBtn) tabBtn.click();
    }
  });
});

// cross-nav.js สร้าง sidebar ตอนที่ <main> ยังไม่ถูก parse (script ของมันอยู่ก่อน <main> ใน
// markup) มันเลยรู้แค่ว่าเรากำลังอยู่ "หน้า" leave-features.html แต่ไม่รู้ว่า view ไหนใน
// หน้านี้กำลังแสดงอยู่จริง — เลยมาร์ก .menu-item ทุกอันที่ชี้มาหน้านี้เป็น active/expanded
// พร้อมกันหมด (เช่น "อนุมัติการลานักเรียน" เด้ง active ทั้งที่หน้าที่เห็นจริงคือ "ยื่นบัตร
// ขออนุญาต") ทำให้ sidebar ยาวผิดปกติและกดเมนูพลาดไปโดนอันอื่น เรียก showModuleView() ครั้งเดียว
// ตรงนี้เพื่อ sync sidebar ให้ตรงกับ view ที่ HTML ตั้ง active ไว้จริง (ปกติคือ view-leave-card)
// — ถ้า URL มี deep-link hash (#m=..&v=..) ด้วย, ตัว setTimeout(0) ใน cross-nav.js จะทำงานทีหลัง
// บรรทัดนี้เสมอและจะสลับไป view ที่ hash ระบุให้ถูกต้องต่อไป
// 2026-09-29: cross-nav.js สร้าง sidebar ให้ active ถูก view เริ่มต้นตั้งแต่แรกแล้ว (SPA_DEFAULT_VIEW / hash) จึงข้ามการ sync นี้ตอนมี
// deep-link (#v=..) — ไม่งั้นเมนูสลับไป leave-card แล้วค่อยเด้งไป view ปลายทาง (เห็นเมนูกระตุก)
if (!/[#&]v=/.test(location.hash)) {
  const initialViewEl = document.querySelector('.module-view.active');
  showModuleView(initialViewEl ? initialViewEl.id.replace(/^view-/, '') : 'leave-card');
}

// ======================================================================
//  WIZARD — LEAVE CARD
// ======================================================================
let selectedStudent = null;
let selectedLeaveType = 'เข้าห้องเรียนช้า';
let editingTicketReqId = null; // null = บันทึกรายการใหม่, มีค่า = กำลังแก้ไขบัตรที่ยังไม่ถูกดำเนินการ

function goStep(step) {
  document.querySelectorAll('.wiz-step-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('wizard-' + step).classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const nav = document.getElementById('wiz-nav-' + i);
    nav.classList.remove('active', 'done');
    if (i === step) nav.classList.add('active');
    if (i < step) nav.classList.add('done');
  }

  if (step === 3 && selectedStudent) {
    document.getElementById('f-date-start').value = new Date().toISOString().split('T')[0];
    document.getElementById('f-date-end').value = new Date().toISOString().split('T')[0];

    // Update banner
    const banner = document.getElementById('selected-student-banner');
    banner.style.display = 'flex';
    document.getElementById('banner-name').textContent = selectedStudent.name;
    document.getElementById('banner-cls').textContent = selectedStudent.cls + ' · เลขที่ ' + selectedStudent.no + ' · ' + selectedStudent.id;
    document.getElementById('banner-avatar').textContent = selectedStudent.name.substring(0,2);
    
    // Trigger live preview
    updateLiveTicket();
  }
}

// Student search → table rows
function searchStudents(q) {
  syncSelectOptions(document.getElementById('student-room-filter'), studentRoomOptions(), 'ทุกห้อง');

  const cls = document.getElementById('student-class-filter').value;
  const room = document.getElementById('student-room-filter').value;
  const query = q.trim().toLowerCase();
  const list = STUDENTS.filter(s => {
    const mQ = !query || s.name.includes(query) || s.id.toLowerCase().includes(query) || s.cls.includes(query);
    const mC = !cls || s.cls.startsWith(cls);
    const mR = !room || s.cls.split('/')[1] === room;
    return mQ && mC && mR;
  });
  const tbody = document.getElementById('student-tbody');
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">ไม่พบนักเรียน</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s => {
    const sel = selectedStudent && selectedStudent.id === s.id;
    return `<tr class="${sel ? 'row-selected' : ''}" onclick="pickStudentRow('${s.id}', this)" style="cursor:pointer">
      <td><input type="radio" name="student-pick" ${sel ? 'checked' : ''}></td>
      <td>${s.id}</td><td><strong>${s.name}</strong></td><td>${s.cls}</td><td>${s.no}</td>
    </tr>`;
  }).join('');
}

function pickStudentRow(id, row) {
  selectedStudent = STUDENTS.find(s => s.id === id);
  document.querySelectorAll('#student-tbody tr').forEach(r => r.classList.remove('row-selected'));
  row.classList.add('row-selected');
  row.querySelector('input[type=radio]').checked = true;
  document.getElementById('btn-step1-next').disabled = false;
}

// Leave type selection
document.querySelectorAll('.leave-type').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.leave-type').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedLeaveType = card.dataset.type;
  });
});

// Live Preview Update
function updateLiveTicket() {
  const dateStartVal = document.getElementById('f-date-start').value;
  const dateEndVal = document.getElementById('f-date-end').value;
  
  let dateText = '-';
  let thaiYear = new Date().getFullYear() + 543;
  
  if (dateStartVal) {
    const [yS, mS, dS] = dateStartVal.split('-');
    thaiYear = parseInt(yS) + 543;
    const startText = `${dS}/${mS}/${thaiYear}`;
    
    if (dateEndVal && dateEndVal !== dateStartVal) {
      const [yE, mE, dE] = dateEndVal.split('-');
      const endYear = parseInt(yE) + 543;
      dateText = `${startText} ถึง ${dE}/${mE}/${endYear}`;
    } else {
      dateText = startText;
    }
  }

  // Ticket no: reuse the original reqId when editing, otherwise preview the
  // reqId this entry will actually get once saved (matches saveTicketEntry()).
  if (!window.currentTicketNo) {
    window.currentTicketNo = editingTicketReqId || ('TK-' + String(HISTORY.length + 1).padStart(4, '0'));
  }

  const timeStartVal = document.getElementById('f-time-start').value || '08:00';
  const timeEndVal = document.getElementById('f-time-end').value || '16:30';
  const timeText = `${timeStartVal} - ${timeEndVal}`;

  document.getElementById('t-no').textContent = window.currentTicketNo;
  document.getElementById('t-date').textContent = dateText;
  document.getElementById('t-name').textContent = selectedStudent ? selectedStudent.name : '-';
  document.getElementById('t-class').textContent = selectedStudent ? selectedStudent.cls + ' / เลขที่ ' + selectedStudent.no : '-';
  document.getElementById('t-type').textContent = selectedLeaveType;
  document.getElementById('t-time').textContent = timeText;
  document.getElementById('t-reason').textContent = document.getElementById('f-reason').value || '-';
}

function resetWizard() {
  selectedStudent = null;
  selectedLeaveType = 'เข้าห้องเรียนช้า';
  editingTicketReqId = null;
  window.currentTicketNo = null;
  document.getElementById('student-search').value = '';
  document.getElementById('student-class-filter').value = '';
  document.getElementById('btn-step1-next').disabled = true;
  document.getElementById('selected-student-banner').style.display = 'none';
  document.querySelector('.leave-type').classList.add('selected');
  document.querySelectorAll('.leave-type:not(:first-child)').forEach(c => c.classList.remove('selected'));
  document.getElementById('f-reason').value = '';
  document.getElementById('f-time-start').value = '08:00';
  document.getElementById('f-time-end').value = '16:30';

  // Reset live preview ticket labels
  document.getElementById('t-no').textContent = 'TK-xxxx';
  document.getElementById('t-date').textContent = '-';
  document.getElementById('t-name').textContent = '-';
  document.getElementById('t-class').textContent = '-';
  document.getElementById('t-type').textContent = '-';
  document.getElementById('t-time').textContent = '-';
  document.getElementById('t-reason').textContent = '-';

  searchStudents('');
  goStep(1);
}

// Persists the current wizard entry into HISTORY (or updates the existing
// record when editingTicketReqId is set), then clears the form for the next entry.
function saveTicketEntry() {
  if (!selectedStudent) { alert('กรุณาเลือกนักเรียนก่อนบันทึก'); return; }
  const dateStart = document.getElementById('f-date-start').value;
  if (!dateStart) { alert('กรุณาระบุวันที่ขออนุญาต'); return; }

  const timeStart = document.getElementById('f-time-start').value || '08:00';
  const timeEnd = document.getElementById('f-time-end').value || '16:30';
  const reason = document.getElementById('f-reason').value.trim();
  updateLiveTicket(); // ensures window.currentTicketNo is generated for a new entry

  if (editingTicketReqId) {
    const r = HISTORY.find(x => x.reqId === editingTicketReqId);
    if (r) {
      r.id = selectedStudent.id;
      r.name = selectedStudent.name;
      r.cls = selectedStudent.cls;
      r.type = selectedLeaveType;
      r.date = dateStart;
      r.time = `${timeStart}-${timeEnd}`;
      r.reason = reason;
    }
    alert('บันทึกการแก้ไขบัตรขออนุญาตเรียบร้อยแล้ว');
  } else {
    HISTORY.push({
      id: selectedStudent.id,
      name: selectedStudent.name,
      cls: selectedStudent.cls,
      type: selectedLeaveType,
      date: dateStart,
      time: `${timeStart}-${timeEnd}`,
      reason: reason,
      status: 'รอตรวจสอบ',
      comment: '',
      reqId: window.currentTicketNo
    });
    alert('บันทึกบัตรขออนุญาตเรียบร้อยแล้ว');
  }

  editingTicketReqId = null;
  renderTicketBadgeCount();
  renderApproveTicketTable();
  refreshTicketCalendarIfVisible();
  resetWizard();
}

// Reopens the wizard pre-filled with an existing, still-pending ticket so it can be edited.
function editTicketRequest(reqId) {
  const r = HISTORY.find(x => x.reqId === reqId);
  if (!r) return;
  closeDetailDrawer();
  showModuleView('leave-card');

  editingTicketReqId = reqId;
  selectedStudent = STUDENTS.find(s => s.id === r.id) || { id: r.id, name: r.name, cls: r.cls, no: '-' };
  selectedLeaveType = r.type;

  document.querySelectorAll('.leave-type').forEach(c => c.classList.toggle('selected', c.dataset.type === r.type));
  document.getElementById('btn-step1-next').disabled = false;
  searchStudents(document.getElementById('student-search').value || '');

  goStep(3);
  document.getElementById('f-date-start').value = r.date;
  document.getElementById('f-date-end').value = r.date;
  const [ts, te] = (r.time || '08:00-16:30').split('-').map(s => s.trim());
  document.getElementById('f-time-start').value = ts || '08:00';
  document.getElementById('f-time-end').value = te || '16:30';
  document.getElementById('f-reason').value = r.reason || '';
  window.currentTicketNo = r.reqId;
  updateLiveTicket();
}

// Initialize Wizard
searchStudents('');

// ======================================================================
//  ยื่นขอลาของนักเรียน (view-sl-submit) — จัดหน้าเหมือน view-leave-card ทุกประการ
//  (ค้นหานักเรียน → เลือกประเภทการลา → กรอกรายละเอียด + พรีวิวใบลาสด)
// ======================================================================
let slSubmitSelectedStudent = null;
let slSubmitSelectedType = null;
let slSubmitCurrentNo = null;
let editingSLId = null; // null = บันทึกรายการใหม่, มีค่า = กำลังแก้ไขใบลาที่ยังไม่ถูกดำเนินการ

function goSLSubmitStep(step) {
  document.querySelectorAll('#view-sl-submit .wiz-step-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('sl-wizard-' + step).classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const nav = document.getElementById('sl-wiz-nav-' + i);
    nav.classList.remove('active', 'done');
    if (i === step) nav.classList.add('active');
    if (i < step) nav.classList.add('done');
  }

  if (step === 3 && slSubmitSelectedStudent) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sl-f-date-start').value = today;
    document.getElementById('sl-f-date-end').value = today;

    const banner = document.getElementById('sl-submit-selected-student-banner');
    banner.style.display = 'flex';
    document.getElementById('sl-submit-banner-name').textContent = slSubmitSelectedStudent.name;
    document.getElementById('sl-submit-banner-cls').textContent = slSubmitSelectedStudent.cls + ' · เลขที่ ' + slSubmitSelectedStudent.no + ' · ' + slSubmitSelectedStudent.id;
    document.getElementById('sl-submit-banner-avatar').textContent = slSubmitSelectedStudent.name.substring(0, 2);

    updateLiveLeaveForm();
  }
}

// Student search → table rows (Step 1)
function searchStudentsForSLSubmit(q) {
  syncSelectOptions(document.getElementById('sl-submit-student-room-filter'), studentRoomOptions(), 'ทุกห้อง');

  const cls = document.getElementById('sl-submit-student-class-filter').value;
  const room = document.getElementById('sl-submit-student-room-filter').value;
  const query = q.trim().toLowerCase();
  const list = STUDENTS.filter(s => {
    const mQ = !query || s.name.includes(query) || s.id.toLowerCase().includes(query) || s.cls.includes(query);
    const mC = !cls || s.cls.startsWith(cls);
    const mR = !room || s.cls.split('/')[1] === room;
    return mQ && mC && mR;
  });
  const tbody = document.getElementById('sl-submit-student-tbody');
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">ไม่พบนักเรียน</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s => {
    const sel = slSubmitSelectedStudent && slSubmitSelectedStudent.id === s.id;
    return `<tr class="${sel ? 'row-selected' : ''}" onclick="pickStudentRowForSLSubmit('${s.id}', this)" style="cursor:pointer">
      <td><input type="radio" name="sl-submit-student-pick" ${sel ? 'checked' : ''}></td>
      <td>${s.id}</td><td><strong>${s.name}</strong></td><td>${s.cls}</td><td>${s.no}</td>
    </tr>`;
  }).join('');
}

function pickStudentRowForSLSubmit(id, row) {
  slSubmitSelectedStudent = STUDENTS.find(s => s.id === id);
  document.querySelectorAll('#sl-submit-student-tbody tr').forEach(r => r.classList.remove('row-selected'));
  row.classList.add('row-selected');
  row.querySelector('input[type=radio]').checked = true;
  document.getElementById('btn-sl-submit-step1-next').disabled = false;
}

// Leave-type cards (Step 2) — built from STUDENT_LEAVE_TYPES so it stays in sync
// with whatever leave types are configured in the student-leave settings wizard.
const SL_SUBMIT_TYPE_ICONS = { 'ลาป่วย': 'i-file', 'ลากิจ': 'i-tag', 'ลาอื่น ๆ': 'i-list' };

function renderSLSubmitLeaveTypeCards() {
  const grid = document.getElementById('sl-submit-leave-type-grid');
  if (!grid) return;
  if (!slSubmitSelectedType || !STUDENT_LEAVE_TYPES.some(t => t.name === slSubmitSelectedType)) {
    slSubmitSelectedType = STUDENT_LEAVE_TYPES[0] ? STUDENT_LEAVE_TYPES[0].name : null;
  }
  grid.innerHTML = STUDENT_LEAVE_TYPES.map(t => `
    <div class="lt-card sl-submit-leave-type ${t.name === slSubmitSelectedType ? 'selected' : ''}" data-type="${t.name}">
      <div class="lt-icon"><svg class="icon"><use href="#${SL_SUBMIT_TYPE_ICONS[t.name] || 'i-file'}"/></svg></div>
      <div><div class="lt-title">${t.name}</div><div class="lt-sub">${t.desc}</div></div>
    </div>
  `).join('');

  grid.querySelectorAll('.sl-submit-leave-type').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.sl-submit-leave-type').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      slSubmitSelectedType = card.dataset.type;
    });
  });
}

// Live Preview Update (Step 3)
function updateLiveLeaveForm() {
  document.getElementById('sl-t-school').textContent = SCHOOL_INFO.name;

  const dateStartVal = document.getElementById('sl-f-date-start').value;
  const dateEndVal = document.getElementById('sl-f-date-end').value;

  let dateRangeText = '-';
  let daysText = '-';
  let thaiYear = new Date().getFullYear() + 543;

  if (dateStartVal) {
    thaiYear = parseInt(dateStartVal.split('-')[0]) + 543;
    const endVal = dateEndVal || dateStartVal;
    dateRangeText = dateEndVal && dateEndVal !== dateStartVal
      ? `${thaiDateLong(dateStartVal)} ถึง ${thaiDateLong(endVal)}`
      : thaiDateLong(dateStartVal);

    const days = Math.round((new Date(endVal) - new Date(dateStartVal)) / 86400000) + 1;
    daysText = (days > 0 ? days : 1) + ' วัน';
  }

  // เลขที่ใบลา: ใช้เลขเดิมถ้ากำลังแก้ไข ไม่งั้นพรีวิวเลขที่จะได้จริงเมื่อบันทึก (ดู saveSLSubmitEntry)
  if (!slSubmitCurrentNo) {
    slSubmitCurrentNo = editingSLId || ('SL-' + String(STUDENT_LEAVE_REQUESTS.length + 1).padStart(4, '0'));
  }

  document.getElementById('sl-t-no').textContent = slSubmitCurrentNo;
  document.getElementById('sl-t-submit-date').textContent = thaiDateLong(new Date().toISOString().split('T')[0]);
  document.getElementById('sl-t-name').textContent = slSubmitSelectedStudent ? slSubmitSelectedStudent.name : '-';
  document.getElementById('sl-t-class').textContent = slSubmitSelectedStudent ? slSubmitSelectedStudent.cls + ' / เลขที่ ' + slSubmitSelectedStudent.no : '-';
  document.getElementById('sl-t-type').textContent = slSubmitSelectedType || '-';
  document.getElementById('sl-t-days').textContent = daysText;
  document.getElementById('sl-t-daterange').textContent = dateRangeText;
  document.getElementById('sl-t-reason').textContent = document.getElementById('sl-f-reason').value || '-';
}

function resetSLSubmitWizard() {
  slSubmitSelectedStudent = null;
  slSubmitSelectedType = null;
  slSubmitCurrentNo = null;
  editingSLId = null;
  document.getElementById('sl-submit-student-search').value = '';
  document.getElementById('sl-submit-student-class-filter').value = '';
  document.getElementById('sl-submit-student-room-filter').value = '';
  document.getElementById('btn-sl-submit-step1-next').disabled = true;
  document.getElementById('sl-submit-selected-student-banner').style.display = 'none';
  document.getElementById('sl-f-reason').value = '';
  document.getElementById('sl-f-date-start').value = '';
  document.getElementById('sl-f-date-end').value = '';

  document.getElementById('sl-t-no').textContent = 'SL-xxxx';
  document.getElementById('sl-t-submit-date').textContent = '-';
  document.getElementById('sl-t-name').textContent = '-';
  document.getElementById('sl-t-class').textContent = '-';
  document.getElementById('sl-t-type').textContent = '-';
  document.getElementById('sl-t-days').textContent = '-';
  document.getElementById('sl-t-daterange').textContent = '-';
  document.getElementById('sl-t-reason').textContent = '-';

  renderSLSubmitLeaveTypeCards();
  searchStudentsForSLSubmit('');
  goSLSubmitStep(1);
}

function renderSLSubmitPending() {
  const kpi = document.getElementById('sl-submit-kpi-pending');
  if (kpi) kpi.textContent = STUDENT_LEAVE_REQUESTS.filter(r => r.status === 'รอตรวจสอบ').length;
  renderSLSubmitLeaveTypeCards();
  searchStudentsForSLSubmit(document.getElementById('sl-submit-student-search').value || '');
}

// Persists the current wizard entry into STUDENT_LEAVE_REQUESTS (or updates the
// existing record when editingSLId is set), then clears the form for the next entry.
function saveSLSubmitEntry() {
  if (!slSubmitSelectedStudent) { alert('กรุณาเลือกนักเรียนก่อนบันทึก'); return; }
  if (!slSubmitSelectedType) { alert('กรุณาเลือกประเภทการลา'); return; }
  const dateStart = document.getElementById('sl-f-date-start').value;
  if (!dateStart) { alert('กรุณาระบุวันที่เริ่มลา'); return; }
  const dateEnd = document.getElementById('sl-f-date-end').value || dateStart;
  const reason = document.getElementById('sl-f-reason').value.trim();
  const days = Math.max(1, Math.round((new Date(dateEnd) - new Date(dateStart)) / 86400000) + 1);

  updateLiveLeaveForm(); // ensures slSubmitCurrentNo is generated for a new entry

  if (editingSLId) {
    const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === editingSLId);
    if (r) {
      r.studentId = slSubmitSelectedStudent.id;
      r.name = slSubmitSelectedStudent.name;
      r.cls = slSubmitSelectedStudent.cls;
      r.type = slSubmitSelectedType;
      r.startDate = dateStart;
      r.endDate = dateEnd;
      r.days = days;
      r.reason = reason;
    }
    alert('บันทึกการแก้ไขใบลาเรียบร้อยแล้ว');
  } else {
    STUDENT_LEAVE_REQUESTS.push({
      id: slSubmitCurrentNo,
      studentId: slSubmitSelectedStudent.id,
      name: slSubmitSelectedStudent.name,
      cls: slSubmitSelectedStudent.cls,
      type: slSubmitSelectedType,
      submitDate: new Date().toISOString().split('T')[0],
      startDate: dateStart,
      endDate: dateEnd,
      days: days,
      reason: reason,
      attachment: null,
      status: 'รอตรวจสอบ',
      comment: ''
    });
    alert('บันทึกใบลาของนักเรียนเรียบร้อยแล้ว');
  }

  editingSLId = null;
  renderApproveBadgeCount();
  renderApproveStudentLeaveTable();
  refreshSLCalendarIfVisible();
  resetSLSubmitWizard();
}

// Reopens the wizard pre-filled with an existing, still-pending leave request so it can be edited.
function editSLRequest(id) {
  const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  closeDetailDrawer();
  showModuleView('sl-submit');

  editingSLId = id;
  slSubmitSelectedStudent = STUDENTS.find(s => s.id === r.studentId) || { id: r.studentId, name: r.name, cls: r.cls, no: '-' };
  slSubmitSelectedType = r.type;

  renderSLSubmitLeaveTypeCards();
  document.getElementById('btn-sl-submit-step1-next').disabled = false;
  searchStudentsForSLSubmit(document.getElementById('sl-submit-student-search').value || '');

  goSLSubmitStep(3);
  document.getElementById('sl-f-date-start').value = r.startDate;
  document.getElementById('sl-f-date-end').value = r.endDate;
  document.getElementById('sl-f-reason').value = r.reason || '';
  slSubmitCurrentNo = r.id;
  updateLiveLeaveForm();
}

// ======================================================================
//  HISTORY KPI (shared top strip for both tabs)
// ======================================================================
function renderHistKpi() {
  const totals = { 'เข้าห้องเรียนช้า':0, 'ออกนอกห้องเรียน':0, 'ออกนอกบริเวณโรงเรียน':0, 'อนุญาตอื่น ๆ':0, 'ผู้ปกครองมารับก่อนกำหนด':0 };
  Object.values(SUMMARY_DATA).forEach(d => Object.keys(totals).forEach(k => { totals[k] += d[k]||0; }));
  const grand = Object.values(totals).reduce((a,b)=>a+b,0);
  const colors = ['var(--warning)','var(--info)','var(--danger)','var(--primary)','var(--success)'];
  const labels = ['เข้าห้องเรียนช้า','ออกนอกห้อง','ออกนอกบริเวณ','อนุญาตอื่น ๆ','ผปค.มารับ'];
  const keys = Object.keys(totals);
  const kpiTop = document.getElementById('hist-kpi-top');
  if (!kpiTop) return;
  
  kpiTop.innerHTML =
    keys.map((k,i) => `
      <div class="stat-card" style="--card-accent: ${colors[i]};">
        <div class="stat-content">
          <div class="stat-label">${labels[i]}</div>
          <div class="stat-value" style="color:${colors[i]}">${totals[k]}</div>
          <div class="stat-change neutral">ครั้งสะสม</div>
        </div>
      </div>
    `).join('') + `
      <div class="stat-card" style="--card-accent: var(--primary);">
        <div class="stat-content">
          <div class="stat-label">รวมทั้งหมด</div>
          <div class="stat-value" style="color:var(--text-primary)">${grand}</div>
          <div class="stat-change neutral">รายการอนุมัติทั้งหมด</div>
        </div>
      </div>
    `;
}

// ======================================================================
//  HISTORY – PERSONAL PROFILE VIEW (mimics app.html profile leave history)
// ======================================================================
// ======================================================================
//  HISTORY – ALL REQUESTS (Tab 1)
// ======================================================================
function renderAllHistory() {
  const q   = (document.getElementById('all-search').value || '').toLowerCase();
  const typ = document.getElementById('all-type').value;
  const mon = document.getElementById('all-month').value;
  const list = HISTORY.filter(r => {
    const mQ = !q   || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    const mT = !typ || r.type === typ;
    const mM = !mon || r.date.startsWith(mon);
    return mQ && mT && mM;
  });
  
  const tbody = document.getElementById('all-tbody');
  if (!tbody) return;
  tbody.innerHTML = list.length === 0
    ? '<tr><td colspan="10" class="no-data">ไม่พบข้อมูล</td></tr>'
    : list.map((r,i) => {
        const [y,m,d] = r.date.split('-');
        return `<tr>
          <td>${i+1}</td>
          <td>${r.id}</td>
          <td><strong>${r.name}</strong></td>
          <td>${r.cls}</td>
          <td><span class="type-badge ${typeBadgeClass(r.type)}">${r.type}</span></td>
          <td>${d}/${m}/${parseInt(y)+543}</td>
          <td>${r.time}</td>
          <td>${r.reason}</td>
          <td>${statusBadgeHTML(r.status || 'อนุมัติ')}</td>
          <td style="text-align:center;">
            <button class="btn-icon" title="ดูประวัติรายบุคคลของนักเรียนคนนี้" onclick="viewStudentHistory('${r.id}')">
              <svg class="icon"><use href="#i-user"/></svg>
            </button>
          </td>
        </tr>`;
      }).join('');
}

// Shortcut: jump from a row in "รายการทั้งหมด" or the ticket approval table
// straight to that student's individual history in the "ประวัติรายบุคคล" tab
// (now part of view-ticket-calendar, alongside the ticket list).
function viewStudentHistory(studentId) {
  activeSelectedStudentId = studentId;
  showModuleView('ticket-calendar');
  const personalTabBtn = document.querySelector('#view-ticket-calendar .tab-btn[data-tab="personal"]');
  if (personalTabBtn) personalTabBtn.click();
}

// ======================================================================
//  HISTORY – PERSONAL DETAILS WITH DIRECTORY COLUMN (Tab 2)
// ======================================================================
let activeSelectedStudentId = null;

function renderStudentList() {
  syncSelectOptions(document.getElementById('student-list-grade-filter'), studentGradeOptions(), 'ทุกชั้นปี');
  syncSelectOptions(document.getElementById('student-list-room-filter'), studentRoomOptions(), 'ทุกห้อง');

  const q = (document.getElementById('student-list-search').value || '').trim().toLowerCase();
  const gradeFilter = document.getElementById('student-list-grade-filter').value;
  const roomFilter = document.getElementById('student-list-room-filter').value;
  const container = document.getElementById('student-list-container');
  if (!container) return;

  const filtered = STUDENTS.filter(s =>
    studentMatchesGradeRoom(s.cls, gradeFilter, roomFilter) &&
    (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.cls.toLowerCase().includes(q))
  );
  
  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 12px; color: var(--text-muted); font-size:12px;">ไม่พบนักเรียน</div>`;
    return;
  }
  
  container.innerHTML = filtered.map(s => {
    const isSelected = activeSelectedStudentId === s.id;
    return `
      <div class="student-list-item ${isSelected ? 'active' : ''}" 
           onclick="selectPersonalStudent('${s.id}')"
           style="padding: 10px 12px; border-radius: var(--br-sm); border: 1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; background: ${isSelected ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255,255,255,0.01)'}; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 600; font-size: 13px; color: ${isSelected ? 'var(--primary)' : 'var(--text-primary)'};">${s.name}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${s.cls} · เลขที่ ${s.no} · ${s.id}</div>
        </div>
        <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: none; stroke: ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}; stroke-width: 2.5; display: ${isSelected ? 'block' : 'none'};"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
    `;
  }).join('');
}

const PROFILE_STAT_CATEGORIES = [
  { key: 'เข้าห้องเรียนช้า',        label: 'เข้าห้องเรียนช้า',        color: 'var(--warning)', cls: 'late' },
  { key: 'ออกนอกห้องเรียน',        label: 'ออกนอกห้องเรียน',        color: 'var(--info)',    cls: 'outclass' },
  { key: 'ออกนอกบริเวณโรงเรียน',   label: 'ออกนอกบริเวณโรงเรียน',   color: 'var(--danger)',  cls: 'outschool' },
  { key: 'อนุญาตอื่น ๆ',           label: 'อนุญาตอื่น ๆ',           color: 'var(--primary)', cls: 'other' },
  { key: 'ผู้ปกครองมารับก่อนกำหนด', label: 'ผปค. มารับก่อนกำหนด',    color: 'var(--success)', cls: 'pickup' },
];

function selectPersonalStudent(studentId) {
  activeSelectedStudentId = studentId;
  personalTabBackTo = null;
  updatePersonalProfileBackBtn();

  // Re-render list to highlight selection
  renderStudentList();

  const emptyState = document.getElementById('personal-empty-state');
  const panelState = document.getElementById('panel-student-profile');

  if (!studentId) {
    emptyState.style.display = 'flex';
    panelState.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  panelState.style.display = 'block';

  const student = STUDENTS.find(s => s.id === studentId);
  if (!student) return;

  // Header details
  document.getElementById('student-profile-avatar').textContent = student.name.substring(0, 2);
  document.getElementById('student-profile-name').textContent = student.name;
  document.getElementById('student-profile-details').textContent = `${student.cls} · เลขที่ ${student.no} · รหัสนักเรียน: ${student.id}`;

  const studentHistory = HISTORY.filter(h => h.id === studentId);

  // Render Stats — one card per permission category, so nothing is merged/hidden
  const quotaCardsContainer = document.getElementById('profile-quota-cards');
  quotaCardsContainer.innerHTML = PROFILE_STAT_CATEGORIES.map(cat => {
    const count = studentHistory.filter(h => h.type === cat.key).length;
    return `
      <div class="mini-quota-card ${cat.cls}">
        <div class="mini-quota-title">${cat.label}</div>
        <div class="mini-quota-value" style="color: ${cat.color}; font-size: 24px;">${count}</div>
        <div class="mini-quota-limit">สะสมทั้งหมดในปีนี้</div>
      </div>
    `;
  }).join('');

  renderProfileHistory();
}

// Builds a printable discipline/attendance summary for the selected student and
// opens it in the shared print-preview modal. The point-deduction figures follow a
// simple illustrative rule (this prototype has no real disciplinary-points config).
function printTicketHistoryReport() {
  const student = STUDENTS.find(s => s.id === activeSelectedStudentId);
  if (!student) return;

  const studentHistory = HISTORY.filter(h => h.id === student.id);
  const lateCount = studentHistory.filter(h => h.type === 'เข้าห้องเรียนช้า').length;
  const outClassCount = studentHistory.filter(h => h.type === 'ออกนอกห้องเรียน').length;
  const outSchoolCount = studentHistory.filter(h => h.type === 'ออกนอกบริเวณโรงเรียน').length;
  const absentCount = 0; // ต้นแบบนี้ยังไม่มีข้อมูลการขาดเรียนแยกต่างหาก

  const approvedLeaves = STUDENT_LEAVE_REQUESTS.filter(r => r.studentId === student.id && r.status === 'อนุมัติ');
  const sickLeaveCount = approvedLeaves.filter(r => r.type === 'ลาป่วย').length;
  const personalLeaveCount = approvedLeaves.filter(r => r.type === 'ลากิจ').length;

  const latePoints = lateCount + absentCount * 2;
  const otherPoints = outClassCount + outSchoolCount;
  const totalPoints = latePoints + otherPoints;

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  const html = `
    <div class="print-card-header">
      <div>
        <div style="font-weight:700;font-size:16px;">รายงานสถิติการขออนุญาตและความประพฤติรายบุคคล</div>
        <div style="font-size:12px;color:#475569;margin-top:4px;">เวลาพิมพ์ ${hh}:${mm} น. วันที่ ${now.getDate()} เดือน ${THAI_MONTHS_FULL[now.getMonth()]} ปี พ.ศ. ${now.getFullYear() + 543}</div>
      </div>
    </div>
    <div class="print-details">
      <div class="print-data-item" style="font-size:14px;"><strong>ชื่อสกุล:</strong> ${student.name}</div>
      <div class="print-data-item" style="font-size:14px;"><strong>เลขประจำตัว:</strong> ${student.id} &nbsp; <strong>ชั้น</strong> ${student.cls}</div>

      <div class="print-section-title" style="margin-top:18px;">สถิติสะสม</div>
      <div class="print-data-group">
        <div class="print-data-item">สถิติสาย <strong>${lateCount}</strong> ครั้ง</div>
        <div class="print-data-item">สถิติขาด <strong>${absentCount}</strong> ครั้ง</div>
        <div class="print-data-item">สถิติลากิจ <strong>${personalLeaveCount}</strong> ครั้ง</div>
        <div class="print-data-item">สถิติลาป่วย <strong>${sickLeaveCount}</strong> ครั้ง</div>
      </div>

      <div class="print-section-title" style="margin-top:18px;">การตัดคะแนนความประพฤติ</div>
      <div class="print-data-group">
        <div class="print-data-item">ตัดคะแนนสาย/ขาด <strong>${latePoints}</strong> คะแนน</div>
        <div class="print-data-item">ตัดคะแนนอื่นๆ <strong>${otherPoints}</strong> คะแนน</div>
      </div>
      <div class="print-data-item" style="margin-top:10px;font-size:15px;"><strong>รวมคะแนนถูกตัด ${totalPoints} คะแนน</strong></div>

      <div style="margin-top:70px;text-align:right;padding-right:30px;font-size:13px;">
        ลงชื่อ..........................................<br>
        ฝ่ายปกครอง
      </div>
    </div>
  `;

  openPrintPreview('รายงานบัตรขออนุญาตรายบุคคล', html);
}

// Timeline list for the selected student — supports a type filter and a
// newest-first / oldest-first sort, independent of the stat cards above.
function renderProfileHistory() {
  if (!activeSelectedStudentId) return;

  const typeFilter = document.getElementById('profile-history-type-filter').value;
  const sortOrder = document.getElementById('profile-history-sort').value;

  const container = document.getElementById('profile-history-list');
  let studentHistory = HISTORY.filter(h => h.id === activeSelectedStudentId && (!typeFilter || h.type === typeFilter));

  if (studentHistory.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--br-sm); font-size: 12px;">
        ไม่พบประวัติการทำรายการขออนุญาตของนักเรียนคนนี้ตามเงื่อนไขที่เลือก
      </div>
    `;
    return;
  }

  studentHistory = [...studentHistory].sort((a, b) =>
    sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
  );

  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  container.innerHTML = studentHistory.map(req => {
    const [y, m, d] = req.date.split('-');
    const monthIndex = parseInt(m) - 1;
    const monthStr = thaiMonths[monthIndex] || '';

    let statusBadge = "";
    if (req.status === "อนุมัติ") {
      statusBadge = `<div style="color: var(--success); display:flex; align-items:center; gap:4px; font-size:12px; font-weight:600;"><svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.5;"><polyline points="20 6 9 17 4 12"/></svg>อนุมัติแล้ว</div>`;
    } else if (req.status === "รอตรวจสอบ") {
      statusBadge = `<div style="color: var(--warning); display:flex; align-items:center; gap:4px; font-size:12px; font-weight:600;"><svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.5;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>รออนุมัติ</div>`;
    } else {
      statusBadge = `<div style="color: var(--danger); display:flex; align-items:center; gap:4px; font-size:12px; font-weight:600;"><svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.5;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>ไม่อนุมัติ</div>`;
    }

    return `
      <div class="history-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--br-sm); transition: transform 0.15s ease;">
        <div style="display: flex; align-items: center;">
          <div class="history-date-box" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.04); border-radius: var(--br-sm); padding: 6px; min-width: 50px; margin-right: 12px; border: 1px solid var(--border-color);">
            <span class="history-date-month" style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">${monthStr}</span>
            <span class="history-date-day" style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${d}</span>
          </div>
          <div class="history-info">
            <div class="history-type" style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">
              <span class="type-badge ${typeBadgeClass(req.type)}" style="margin-right: 6px; padding: 2px 6px; font-size: 10px;">${req.type}</span>
            </div>
            <div class="history-duration" style="font-size: 11px; color: var(--text-muted);">
              ช่วงเวลา: ${req.time} · เหตุผล: ${req.reason}
            </div>
          </div>
        </div>
        <div>
          ${statusBadge}
        </div>
      </div>
    `;
  }).join('');
}

function renderHistory() {
  renderAllHistory();
  renderStudentList();
}

// ======================================================================
//  HISTORY – SUMMARY
// ======================================================================
function renderSummary() {
  const clsF = document.getElementById('sum-class').value;
  const rows = Object.entries(SUMMARY_DATA).filter(([c]) => !clsF || c === clsF);
  
  const colTotals = { 'เข้าห้องเรียนช้า': 0, 'ออกนอกห้องเรียน': 0, 'ออกนอกบริเวณโรงเรียน': 0, 'อนุญาตอื่น ๆ': 0, 'ผู้ปกครองมารับก่อนกำหนด': 0, 'รวม': 0 };

  const tbody = document.getElementById('summary-tbody');
  tbody.innerHTML = rows.map(([cls,d]) => {
    const tot = Object.values(d).reduce((a,b)=>a+b,0);
    
    colTotals['เข้าห้องเรียนช้า'] += d['เข้าห้องเรียนช้า'] || 0;
    colTotals['ออกนอกห้องเรียน'] += d['ออกนอกห้องเรียน'] || 0;
    colTotals['ออกนอกบริเวณโรงเรียน'] += d['ออกนอกบริเวณโรงเรียน'] || 0;
    colTotals['อนุญาตอื่น ๆ'] += d['อนุญาตอื่น ๆ'] || 0;
    colTotals['ผู้ปกครองมารับก่อนกำหนด'] += d['ผู้ปกครองมารับก่อนกำหนด'] || 0;
    colTotals['รวม'] += tot;

    const renderCell = val => `<td>${val}</td>`;

    return `<tr>
      <td><strong>${cls}</strong></td>
      ${renderCell(d['เข้าห้องเรียนช้า'])}
      ${renderCell(d['ออกนอกห้องเรียน'])}
      ${renderCell(d['ออกนอกบริเวณโรงเรียน'])}
      ${renderCell(d['อนุญาตอื่น ๆ'])}
      ${renderCell(d['ผู้ปกครองมารับก่อนกำหนด'])}
      <td><strong>${tot}</strong></td>
    </tr>`;
  }).join('');

  // Add tfoot summary row if multiple rows exist
  if (rows.length > 1) {
    const tableEl = document.getElementById('summary-table');
    let tfoot = tableEl.querySelector('tfoot');
    if (!tfoot) {
      tfoot = document.createElement('tfoot');
      tableEl.appendChild(tfoot);
    }
    tfoot.innerHTML = `
      <tr style="background: rgba(0,0,0,0.06); font-weight: bold; border-top: 2px solid var(--border-color);">
        <td>รวมทั้งหมด</td>
        <td>${colTotals['เข้าห้องเรียนช้า']}</td>
        <td>${colTotals['ออกนอกห้องเรียน']}</td>
        <td>${colTotals['ออกนอกบริเวณโรงเรียน']}</td>
        <td>${colTotals['อนุญาตอื่น ๆ']}</td>
        <td>${colTotals['ผู้ปกครองมารับก่อนกำหนด']}</td>
        <td>${colTotals['รวม']}</td>
      </tr>
    `;
  } else {
    const tfoot = document.getElementById('summary-table').querySelector('tfoot');
    if (tfoot) tfoot.innerHTML = '';
  }
}

// ======================================================================
//  EMPLOYEES DIRECTORY
// ======================================================================
let empTypeFilter = '';
let empViewMode = 'compact';

function setEmpView(mode) {
  empViewMode = mode;
  document.getElementById('emp-compact-view').style.display = mode === 'compact' ? '' : 'none';
  document.getElementById('emp-full-view').style.display = mode === 'full' ? '' : 'none';
  document.getElementById('emp-compact-btn').classList.toggle('btn-active', mode === 'compact');
  document.getElementById('emp-full-btn').classList.toggle('btn-active', mode === 'full');
  renderEmployees();
}

document.querySelectorAll('#emp-type-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#emp-type-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    empTypeFilter = chip.dataset.emptype;
    renderEmployees();
  });
});

function renderEmployees() {
  const q = (document.getElementById('emp-search').value || '').toLowerCase();
  const list = EMPLOYEES.filter(e => {
    const mQ = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.phone.includes(q);
    const mT = !empTypeFilter || e.type === empTypeFilter;
    return mQ && mT;
  });

  const nd = `<tr><td colspan="14" class="no-data">ไม่พบข้อมูล</td></tr>`;

  // Draw Headers dynamically
  const compactHeader = document.getElementById('emp-compact-header');
  const fullHeader = document.getElementById('emp-full-header');

  const th = (icon, label) => `<th><span class="th-ic"><svg class="icon"><use href="#${icon}"/></svg>${label}</span></th>`;
  const thRight = (icon, label) => `<th style="text-align: right;"><span class="th-ic" style="justify-content:flex-end;"><svg class="icon"><use href="#${icon}"/></svg>${label}</span></th>`;

  compactHeader.innerHTML = `<th>#</th>${th('i-tag','รหัส')}${th('i-user','ชื่อ-สกุล')}${th('i-list','ประเภท')}${th('i-phone','เบอร์โทร')}${th('i-clock','ตารางเวลา')}${thRight('i-settings','จัดการ')}`;
  fullHeader.innerHTML = `<th>#</th>${th('i-tag','รหัส')}${th('i-user','ชื่อ-สกุล')}${th('i-list','ประเภท')}${th('i-building','แผนก')}${th('i-badge','ตำแหน่ง')}${th('i-file','ประเภทสัญญา')}${th('i-graduation','วุฒิ')}${th('i-idcard','เลขบัตรประชาชน')}${th('i-gender','เพศ')}${th('i-calendar','วันเกิด')}${thRight('i-settings','จัดการ')}`;

  const actionsHTML = e => `
    <div style="display: flex; gap: 4px; justify-content: flex-end;">
      <button class="btn btn-primary btn-sm" onclick="openEmpDetailDrawer('${e.id}')" style="padding: 4px 8px; font-size: 11px;"><svg class="icon"><use href="#i-user"/></svg></button>
    </div>
  `;

  // Render body rows
  if (empViewMode === 'compact') {
    document.getElementById('emp-compact-tbody').innerHTML = list.length === 0 ? nd :
      list.map((e,i) => `
        <tr>
          <td>${i+1}</td>
          <td>${e.id}</td>
          <td><strong>${e.name}</strong></td>
          <td>${e.type}</td>
          <td>${e.phone}</td>
          <td>${e.schedule}</td>
          <td style="text-align: right;">${actionsHTML(e)}</td>
        </tr>
      `).join('');
  } else {
    document.getElementById('emp-full-tbody').innerHTML = list.length === 0 ? nd :
      list.map((e,i) => `
        <tr>
          <td>${i+1}</td>
          <td>${e.id}</td>
          <td><strong>${e.name}</strong></td>
          <td>${e.type}</td>
          <td>${e.dept}</td>
          <td>${e.pos}</td>
          <td>${e.contract}</td>
          <td>${e.degree || '-'}</td>
          <td>${e.cid ? e.cid.replace(/.(?=.{4})/g, '*') : '-'}</td>
          <td>${e.gender || '-'}</td>
          <td>${e.dob || '-'}</td>
          <td style="text-align: right;">${actionsHTML(e)}</td>
        </tr>
      `).join('');
  }
}

// ======================================================================
//  ACCORDION DRAWER DETAIL
// ======================================================================
function toggleAccordion(header) {
  const section = header.closest('.accordion-section');
  const isActive = section.classList.contains('active');
  
  // Collapse others
  section.closest('.accordion-container').querySelectorAll('.accordion-section').forEach(s => {
    s.classList.remove('active');
  });

  if (!isActive) {
    section.classList.add('active');
  }
}

let activeEmpId = null;

function openEmpDetailDrawer(id) {
  const emp = EMPLOYEES.find(e => e.id === id);
  if (!emp) return;

  activeEmpId = id;
  
  // Basic display details
  document.getElementById('emp-detail-avatar').textContent = emp.name.substring(0, 2);
  document.getElementById('emp-detail-name').textContent = emp.name;
  document.getElementById('emp-detail-type').textContent = emp.type + ' · ' + emp.id;

  // Accordion Section: 1. ประวัติส่วนตัว
  document.getElementById('detail-section-personal').innerHTML = `
    <div><div class="detail-label">คำนำหน้าชื่อ</div><div class="detail-val">${emp.prefix || '-'}</div></div>
    <div><div class="detail-label">ชื่อ-นามสกุล</div><div class="detail-val">${emp.name}</div></div>
    <div><div class="detail-label">เลขบัตรประชาชน</div><div class="detail-val">${emp.cid || '-'}</div></div>
    <div><div class="detail-label">วันเกิด</div><div class="detail-val">${emp.dob || '-'}</div></div>
    <div><div class="detail-label">เพศ</div><div class="detail-val">${emp.gender || '-'}</div></div>
    <div><div class="detail-label">กรุ๊ปเลือด</div><div class="detail-val">${emp.blood || '-'}</div></div>
    <div><div class="detail-label">สัญชาติ</div><div class="detail-val">${emp.nationality || '-'}</div></div>
    <div><div class="detail-label">ศาสนา</div><div class="detail-val">${emp.religion || '-'}</div></div>
    <div><div class="detail-label">เบอร์โทรศัพท์</div><div class="detail-val">${emp.phone || '-'}</div></div>
    <div><div class="detail-label">อีเมล</div><div class="detail-val">${emp.email || '-'}</div></div>
  `;

  // Accordion Section: 2. ที่อยู่ทะเบียนบ้าน
  const reg = emp.regAddress || {};
  document.getElementById('detail-section-reg-addr').innerHTML = `
    <div><div class="detail-label">บ้านเลขที่ / หมู่</div><div class="detail-val">${reg.houseNo || '-'} ${reg.moo ? 'ม.' + reg.moo : ''}</div></div>
    <div><div class="detail-label">ถนน / ซอย</div><div class="detail-val">${reg.road || '-'}</div></div>
    <div><div class="detail-label">ตำบล / แขวง</div><div class="detail-val">${reg.subdistrict || '-'}</div></div>
    <div><div class="detail-label">อำเภอ / เขต</div><div class="detail-val">${reg.district || '-'}</div></div>
    <div><div class="detail-label">จังหวัด</div><div class="detail-val">${reg.province || '-'}</div></div>
    <div><div class="detail-label">รหัสไปรษณีย์</div><div class="detail-val">${reg.zip || '-'}</div></div>
  `;

  // Accordion Section: 3. ที่อยู่ติดต่อได้
  const con = emp.conAddress || {};
  if (con.same) {
    document.getElementById('detail-section-contact-addr').innerHTML = `<div style="grid-column: 1/-1;" class="detail-val">ใช้ที่อยู่เดียวกับที่อยู่ตามทะเบียนบ้าน</div>`;
  } else {
    document.getElementById('detail-section-contact-addr').innerHTML = `
      <div><div class="detail-label">บ้านเลขที่ / หมู่</div><div class="detail-val">${con.houseNo || '-'} ${con.moo ? 'ม.' + con.moo : ''}</div></div>
      <div><div class="detail-label">ถนน / ซอย</div><div class="detail-val">${con.road || '-'}</div></div>
      <div><div class="detail-label">ตำบล / แขวง</div><div class="detail-val">${con.subdistrict || '-'}</div></div>
      <div><div class="detail-label">อำเภอ / เขต</div><div class="detail-val">${con.district || '-'}</div></div>
      <div><div class="detail-label">จังหวัด</div><div class="detail-val">${con.province || '-'}</div></div>
      <div><div class="detail-label">รหัสไปรษณีย์</div><div class="detail-val">${con.zip || '-'}</div></div>
    `;
  }

  // Accordion Section: 4. ข้อมูลครอบครัว
  let childrenHTML = '-';
  if (emp.children && emp.children.length > 0) {
    childrenHTML = emp.children.map(c => `<div>${c.name} (เกิด ${c.dob})</div>`).join('');
  }
  document.getElementById('detail-section-family').innerHTML = `
    <div><div class="detail-label">ชื่อคู่สมรส</div><div class="detail-val">${emp.spouse || '-'}</div></div>
    <div><div class="detail-label">เบอร์โทรคู่สมรส</div><div class="detail-val">${emp.spousePhone || '-'}</div></div>
    <div style="grid-column: 1/-1;"><div class="detail-label">ข้อมูลบุตร</div><div class="detail-val">${childrenHTML}</div></div>
  `;

  // Accordion Section: 5. ข้อมูลการศึกษา
  document.getElementById('detail-section-education').innerHTML = `
    <div><div class="detail-label">วุฒิการศึกษาสูงสุด</div><div class="detail-val">${emp.degree || '-'}</div></div>
    <div><div class="detail-label">วิชาเอก / สาขา</div><div class="detail-val">${emp.major || '-'}</div></div>
    <div><div class="detail-label">สถาบันการศึกษา</div><div class="detail-val">${emp.institution || '-'}</div></div>
    <div><div class="detail-label">ปีที่สำเร็จการศึกษา</div><div class="detail-val">${emp.gradYear || '-'}</div></div>
    <div><div class="detail-label">เกรดเฉลี่ย (GPA)</div><div class="detail-val">${emp.gpa || '-'}</div></div>
  `;

  // Accordion Section: 6. เกียรติคุณ
  const honorsList = document.getElementById('detail-section-honors');
  if (emp.honors && emp.honors.length > 0) {
    honorsList.innerHTML = emp.honors.map(h => `
      <div style="padding: 8px 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--br-sm); margin-bottom: 6px;">
        <div style="font-weight: 600;">${h.name}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${h.org}</div>
      </div>
    `).join('');
  } else {
    honorsList.innerHTML = `<div class="detail-val">-</div>`;
  }

  // Accordion Section: 7. ประวัติอบรม
  const trainingList = document.getElementById('detail-section-training');
  if (emp.trainings && emp.trainings.length > 0) {
    trainingList.innerHTML = emp.trainings.map(t => `
      <div style="padding: 8px 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--br-sm); margin-bottom: 6px;">
        <div style="font-weight: 600;">${t.name}</div>
        <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between; margin-top: 4px;">
          <span>หน่วยงาน: ${t.org}</span>
          <span>วันที่: ${t.date}</span>
        </div>
      </div>
    `).join('');
  } else {
    trainingList.innerHTML = `<div class="detail-val">-</div>`;
  }

  // Accordion Section: 8. คะแนน TOEIC
  document.getElementById('detail-section-toeic').innerHTML = `
    <div><div class="detail-label">คะแนน TOEIC</div><div class="detail-val">${emp.toeicScore || '-'}</div></div>
    <div><div class="detail-label">วันที่สอบ</div><div class="detail-val">${emp.toeicDate || '-'}</div></div>
  `;

  // Accordion Section: 9. ข้อมูลตำแหน่งงาน
  document.getElementById('detail-section-job').innerHTML = `
    <div><div class="detail-label">ตำแหน่งปัจจุบัน</div><div class="detail-val">${emp.pos || '-'}</div></div>
    <div><div class="detail-label">กลุ่มสาระฯ / แผนก</div><div class="detail-val">${emp.dept || '-'}</div></div>
    <div><div class="detail-label">สัญญาจ้าง</div><div class="detail-val">${emp.contract || '-'}</div></div>
    <div><div class="detail-label">วันที่เริ่มงาน</div><div class="detail-val">${emp.hireDate || '-'}</div></div>
    <div><div class="detail-label">เงินเดือนปัจจุบัน</div><div class="detail-val">${emp.salary || '-'} บาท</div></div>
    <div><div class="detail-label">สถานะการทำงาน</div><div class="detail-val">${emp.workStatus || '-'}</div></div>
  `;

  // Accordion Section: 10. ใบอนุญาตวิชาชีพ
  document.getElementById('detail-section-license').innerHTML = `
    <div><div class="detail-label">เลขที่ใบอนุญาต</div><div class="detail-val">${emp.licNumber || '-'}</div></div>
    <div><div class="detail-label">ประเภทใบอนุญาต</div><div class="detail-val">${emp.licType || '-'}</div></div>
    <div><div class="detail-label">วันที่ออก</div><div class="detail-val">${emp.licIssue || '-'}</div></div>
    <div><div class="detail-label">วันที่หมดอายุ</div><div class="detail-val">${emp.licExpire || '-'}</div></div>
  `;

  // Accordion Section: 11. เครื่องราชฯ
  const royalList = document.getElementById('detail-section-royal');
  if (emp.royalDecorations && emp.royalDecorations.length > 0) {
    royalList.innerHTML = emp.royalDecorations.map(r => `
      <div style="padding: 8px 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--br-sm); margin-bottom: 6px;">
        <span style="font-weight: 600;">${r.name}</span> (ปีที่ได้รับ: พ.ศ. ${r.year})
      </div>
    `).join('');
  } else {
    royalList.innerHTML = `<div class="detail-val">-</div>`;
  }

  // Open Drawer 2 wide
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('drawer-employee-detail').classList.add('active');
}

const ALL_DRAWER_IDS = ['drawer-employee-detail', 'drawer-day-leaves', 'drawer-day-tickets', 'drawer-detail'];
function hideDrawerOverlayIfNoneActive() {
  const stillOpen = ALL_DRAWER_IDS.some(id => {
    const el = document.getElementById(id);
    return el && el.classList.contains('active');
  });
  if (!stillOpen) document.getElementById('drawer-overlay').classList.remove('active');
}

function closeEmpDetailDrawer() {
  document.getElementById('drawer-employee-detail').classList.remove('active');
  hideDrawerOverlayIfNoneActive();
  activeEmpId = null;
}

function closeAllDrawers() {
  closeEmpDetailDrawer();
  closeDayLeavesDrawer();
  closeDayTicketsDrawer();
  closeDetailDrawer();
}

// ======================================================================
//  PRINT PREVIEW MODAL (shared by the ticket-history report and the ใบลา form)
// ======================================================================
function openPrintPreview(title, bodyHtml) {
  document.getElementById('print-preview-modal-title').textContent = title;
  document.getElementById('print-preview-box-content').innerHTML = bodyHtml;
  document.getElementById('print-preview-overlay').classList.add('active');
  document.getElementById('print-preview-modal').classList.add('active');
}

function closePrintPreview() {
  document.getElementById('print-preview-overlay').classList.remove('active');
  document.getElementById('print-preview-modal').classList.remove('active');
}

// ======================================================================
//  CONFIRM MODAL (approve/reject: student leave requests & permission tickets)
//  Mirrors app.html's App.showConfirm({title, message, confirmLabel, requireNote, onConfirm})
// ======================================================================
function showConfirmModal({ title = 'ยืนยันการดำเนินการ', message = 'คุณแน่ใจหรือไม่?', confirmLabel = 'ยืนยัน', requireNote = false, onConfirm }) {
  document.getElementById('confirm-modal-title').textContent = title;
  document.getElementById('confirm-modal-message').innerHTML = message;

  const noteContainer = document.getElementById('confirm-modal-note-container');
  const noteInput = document.getElementById('confirm-modal-note');
  noteContainer.style.display = requireNote ? 'block' : 'none';
  noteInput.value = '';

  const oldBtn = document.getElementById('confirm-modal-btn');
  oldBtn.textContent = confirmLabel;
  // Swap in a fresh button so no listener from a previous call stays bound.
  const confirmBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(confirmBtn, oldBtn);
  confirmBtn.addEventListener('click', () => {
    if (requireNote && noteInput.value.trim() === '') {
      noteInput.focus();
      return;
    }
    const note = requireNote ? noteInput.value.trim() : null;
    closeConfirmModal();
    onConfirm(note);
  });

  document.getElementById('confirm-modal-overlay').classList.add('active');
  document.getElementById('confirm-modal').classList.add('active');
}

function closeConfirmModal() {
  document.getElementById('confirm-modal-overlay').classList.remove('active');
  document.getElementById('confirm-modal').classList.remove('active');
}

// ======================================================================
//  LIST MODE — ในแท็บรายการหลักของ view-approve และ view-ticket-calendar
//  ("รายการคำขอ" / "รายการบัตรขออนุญาตของนักเรียน") ผู้ใช้สลับดูได้ระหว่าง
//  โหมดตาราง (default) กับโหมดปฏิทิน — ปฏิทินจึงไม่ใช่ element ลอยบนสุดของ
//  ทั้งหน้าอีกต่อไป แต่เป็นมุมมองทางเลือกที่อยู่ในแท็บเดียวที่มันเกี่ยวข้อง
//  แท็บอื่น (ประวัติรายบุคคล/สรุปรวมตามชั้นเรียน/ประวัติการลา) ไม่มีปฏิทินเลย
// ======================================================================
const LIST_MODE_CONTEXT = {
  'approve':         { tablePanel: 'sl-table-panel', calPanel: 'sl-calendar-panel', render: () => renderStudentLeaveCalendar() },
  'ticket-calendar': { tablePanel: 'tk-table-panel', calPanel: 'tk-calendar-panel', render: () => renderTicketCalendar() }
};
const listMode = { approve: 'table', 'ticket-calendar': 'table' };

function setListMode(view, mode, btn) {
  const cfg = LIST_MODE_CONTEXT[view];
  if (!cfg) return;
  listMode[view] = mode;

  const tablePanel = document.getElementById(cfg.tablePanel);
  const calPanel = document.getElementById(cfg.calPanel);
  if (tablePanel) tablePanel.classList.toggle('hidden', mode !== 'table');
  if (calPanel) calPanel.classList.toggle('hidden', mode !== 'calendar');

  if (btn) {
    btn.parentElement.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  if (mode === 'calendar') cfg.render();
}

// ======================================================================
//  TABS
// ======================================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const parent = btn.closest('.module-view');
    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    const el = document.getElementById('tab-' + tabId);
    if (el) el.classList.add('active');

    if (tabId === 'all') renderAllHistory();
    if (tabId === 'personal') {
      renderStudentList();
      selectPersonalStudent(activeSelectedStudentId);
    }
    if (tabId === 'summary') renderSummary();
    if (tabId === 'requests') renderApproveStudentLeaveTable();
    if (tabId === 'leave-history') renderSLProfileList();
    if (tabId === 'sd-rooms' || tabId === 'sd-people') { sdState.tab = tabId; renderSDTab(); }

    const stickyBar = parent.querySelector('.view-tabs-sticky');
    if (stickyBar) stickyBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ======================================================================
//  APPROVALS — คำขอลานักเรียน (view-approve) & บัตรขออนุญาต (view-ticket-calendar)
// ======================================================================
let approveFilterSL = 'all';
let approveFilterTicket = 'all';
const CURRENT_APPROVER_NAME = 'สมปอง ทองดี';

// The single detail drawer (#drawer-detail) is reused for a leave request, a
// ticket, or a student's profile. When set, this re-renders whatever is
// currently shown in it after an approve/reject/reset action changes data.
let detailDrawerRefresh = null;

// Set only when #drawer-detail was opened by drilling in from a calendar day's
// list (via goToDaySLProfile / goToDaySLRequestDetail / goToDayTicketRequestDetail)
// — lets the drawer show a "back to that day's list" button instead of just closing.
let detailDrawerBackTo = null;

function updateDetailDrawerBackBtn() {
  const btn = document.getElementById('drawer-detail-back-btn');
  if (btn) btn.style.display = detailDrawerBackTo ? 'grid' : 'none';
}

function goBackFromDetailDrawer() {
  if (!detailDrawerBackTo) return;
  const reopen = detailDrawerBackTo;
  detailDrawerBackTo = null;
  closeDetailDrawer();
  reopen();
}

// Same idea as detailDrawerBackTo, but for the "ประวัติรายบุคคล" tab's profile
// panel in view-ticket-calendar, which isn't a drawer — reached via
// goToDayTicketProfile when drilling in from the ticket calendar's day list.
let personalTabBackTo = null;

function updatePersonalProfileBackBtn() {
  const btn = document.getElementById('personal-profile-back-btn');
  if (btn) btn.style.display = personalTabBackTo ? 'grid' : 'none';
}

function goBackFromPersonalProfile() {
  if (!personalTabBackTo) return;
  const reopen = personalTabBackTo;
  personalTabBackTo = null;
  reopen();
}

// Wrappers used by the calendar day-drawers/day-view so the detail drawer or
// profile panel they open knows how to jump back to that day's list.
function goToDaySLProfile(studentId, y, m, d) {
  closeDayLeavesDrawer();
  openSLProfileDrawer(studentId);
  detailDrawerBackTo = () => openDayLeavesDrawer(new Date(y, m, d));
  updateDetailDrawerBackBtn();
}
function goToDaySLRequestDetail(id, y, m, d) {
  closeDayLeavesDrawer();
  viewSLRequestDetails(id);
  detailDrawerBackTo = () => openDayLeavesDrawer(new Date(y, m, d));
  updateDetailDrawerBackBtn();
}
function goToDayTicketRequestDetail(reqId, y, m, d) {
  closeDayTicketsDrawer();
  viewTicketRequestDetails(reqId);
  detailDrawerBackTo = () => openDayTicketsDrawer(new Date(y, m, d));
  updateDetailDrawerBackBtn();
}
function goToDayTicketProfile(studentId, y, m, d) {
  closeDayTicketsDrawer();
  viewStudentHistory(studentId);
  personalTabBackTo = () => {
    const listTabBtn = document.querySelector('#view-ticket-calendar .tab-btn[data-tab="tk-list"]');
    if (listTabBtn) listTabBtn.click();
    const calBtn = document.querySelector('#tab-tk-list .view-mode-btn[data-mode="calendar"]');
    setListMode('ticket-calendar', 'calendar', calBtn);
    openDayTicketsDrawer(new Date(y, m, d));
  };
  updatePersonalProfileBackBtn();
}

function syncSelectOptions(select, values, placeholderText) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = `<option value="">${placeholderText}</option>` + values.map(v => `<option value="${v}">${v}</option>`).join('');
  if (values.includes(current)) select.value = current;
}

// ชั้นปี/ห้องเรียน ที่มีอยู่จริงในข้อมูลนักเรียน (STUDENTS[].cls เช่น "ม.3/1") — ใช้เติม
// dropdown กรองชั้นปี/ห้องเรียนแยกกันในหน้าค้นหานักเรียนต่าง ๆ
function studentGradeOptions() {
  return [...new Set(STUDENTS.map(s => s.cls.split('/')[0]))].sort();
}
function studentRoomOptions() {
  return [...new Set(STUDENTS.map(s => s.cls.split('/')[1]))].sort((a, b) => Number(a) - Number(b));
}
function studentMatchesGradeRoom(cls, grade, room) {
  const [g, rm] = (cls || '').split('/');
  if (grade && g !== grade) return false;
  if (room && rm !== room) return false;
  return true;
}

function renderApprovals() {
  renderApproveBadgeCount();
  renderApproveStudentLeaveTable();
  if (listMode.approve === 'calendar') renderStudentLeaveCalendar();
}

function renderTicketApprovals() {
  renderTicketBadgeCount();
  renderApproveTicketTable();
  if (listMode['ticket-calendar'] === 'calendar') renderTicketCalendar();
}

// ======================================================================
//  ประวัติการลารายบุคคล (Tab: leave-history) — a searchable/filterable name
//  list (mirrors the "ประวัติรายบุคคล" tab in view-ticket-calendar); clicking a name
//  opens the quota + history detail in #drawer-detail instead of a dropdown.
// ======================================================================
function renderSLProfileList() {
  syncSelectOptions(document.getElementById('sl-profile-grade-filter'), studentGradeOptions(), 'ทุกชั้นปี');
  syncSelectOptions(document.getElementById('sl-profile-room-filter'), studentRoomOptions(), 'ทุกห้อง');

  const q = (document.getElementById('sl-profile-search').value || '').trim().toLowerCase();
  const gradeFilter = document.getElementById('sl-profile-grade-filter').value;
  const roomFilter = document.getElementById('sl-profile-room-filter').value;
  const container = document.getElementById('sl-profile-list-container');
  if (!container) return;

  const filtered = STUDENTS.filter(s => {
    if (!studentMatchesGradeRoom(s.cls, gradeFilter, roomFilter)) return false;
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.cls.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="no-data">ไม่พบนักเรียน</div>`;
    return;
  }

  container.innerHTML = filtered.map(s => {
    const count = STUDENT_LEAVE_REQUESTS.filter(r => r.studentId === s.id).length;
    return `
      <div class="student-list-item" onclick="openSLProfileDrawer('${s.id}')" style="padding:10px 12px;border-radius:var(--br-sm);border:1px solid var(--border-color);background:rgba(255,255,255,0.01);cursor:pointer;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-weight:600;font-size:13px;color:var(--text-primary);">${s.name}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${s.cls} · เลขที่ ${s.no} · ${s.id}</div>
        </div>
        <span style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:4px;">${count} รายการ
          <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    `;
  }).join('');
}

function openSLProfileDrawer(studentId) {
  const student = STUDENTS.find(s => s.id === studentId);
  if (!student) return;
  detailDrawerBackTo = null;
  updateDetailDrawerBackBtn();
  const requests = STUDENT_LEAVE_REQUESTS.filter(r => r.studentId === studentId);

  const quotaCardsHtml = STUDENT_LEAVE_TYPES.map(t => {
    const used = requests.filter(r => r.type === t.name && r.status === 'อนุมัติ').reduce((sum, r) => sum + r.days, 0);
    const remaining = Math.max(0, t.quota - used);
    return `
      <div class="mini-quota-card ${studentLeaveTypeBadgeClass(t.name)}">
        <div class="mini-quota-title">${t.name}คงเหลือ</div>
        <div class="mini-quota-value">${remaining}</div>
        <div class="mini-quota-limit">ใช้ไปแล้ว ${used} จาก ${t.quota} วัน</div>
      </div>
    `;
  }).join('');

  let historyHtml;
  if (requests.length === 0) {
    historyHtml = `<div style="text-align:center; padding: 20px; color: var(--text-muted); background: var(--bg-card); border-radius: 8px;">ไม่พบประวัติการยื่นขอลาของนักเรียนคนนี้ในระบบ</div>`;
  } else {
    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const sorted = [...requests].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    historyHtml = sorted.map(req => {
      const startDate = new Date(req.startDate);
      return `
        <div class="history-item" style="cursor:pointer;" onclick="viewSLRequestDetails('${req.id}')">
          <div class="history-date-box">
            <span class="history-date-month">${thaiMonthsShort[startDate.getMonth()]}</span>
            <span class="history-date-day">${String(startDate.getDate()).padStart(2, '0')}</span>
          </div>
          <div class="history-info">
            <div class="history-type">${req.type}</div>
            <div class="history-duration">
              ${thaiDate(req.startDate)}${req.endDate !== req.startDate ? ' - ' + thaiDate(req.endDate) : ''}
              <span style="display:inline-block; margin-left:8px; padding:2px 6px; background: rgba(255,255,255,0.1); border-radius: 4px; font-weight:600;">${req.days} วัน</span>
            </div>
          </div>
          ${statusBadgeHTML(req.status)}
        </div>
      `;
    }).join('');
  }

  document.getElementById('drawer-detail-title').textContent = `ประวัติการลา: ${student.name}`;
  document.getElementById('drawer-detail-body').innerHTML = `
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">${student.cls} · เลขที่ ${student.no} · รหัสนักเรียน: ${student.id}</div>
    <div class="setting-section-title">โควตาวันลาคงเหลือ</div>
    <div class="grid-3" style="margin-top:12px;margin-bottom:24px;">${quotaCardsHtml}</div>
    <div class="setting-section-title">ประวัติการลาทั้งหมด</div>
    <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;">${historyHtml}</div>
  `;

  detailDrawerRefresh = () => openSLProfileDrawer(studentId);
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('drawer-detail').classList.add('active');
}

function renderApproveBadgeCount() {
  const pendingSL = STUDENT_LEAVE_REQUESTS.filter(r => r.status === 'รอตรวจสอบ').length;

  const slKpi = document.getElementById('approve-kpi-sl-pending');
  if (slKpi) slKpi.textContent = pendingSL;

  const badge = document.getElementById('sidebar-approve-badge');
  if (badge) {
    badge.textContent = pendingSL;
    badge.style.display = pendingSL > 0 ? 'inline-flex' : 'none';
  }
}

function renderTicketBadgeCount() {
  const pendingTicket = HISTORY.filter(r => r.status === 'รอตรวจสอบ').length;

  const ticketKpi = document.getElementById('approve-kpi-ticket-pending');
  if (ticketKpi) ticketKpi.textContent = pendingTicket;

  const badge = document.getElementById('sidebar-ticket-badge');
  if (badge) {
    badge.textContent = pendingTicket;
    badge.style.display = pendingTicket > 0 ? 'inline-flex' : 'none';
  }
}

function setApproveFilter(kind, val, btn) {
  if (kind === 'sl') approveFilterSL = val; else approveFilterTicket = val;
  btn.parentElement.querySelectorAll('.btn').forEach(b => b.classList.remove('btn-active'));
  btn.classList.add('btn-active');
  if (kind === 'sl') renderApproveStudentLeaveTable(); else renderApproveTicketTable();
}

// คอลัมน์สถานะของตาราง approve-sl-tbody — dropdown ทำหน้าที่แทนปุ่มดำเนินการเดิม:
// เลือก "อนุมัติ"/"ไม่อนุมัติ" → approveStudentLeave/rejectStudentLeave (มี modal ยืนยัน + หมายเหตุ),
// เลือก "รอตรวจสอบ" → resetSLLeaveStatus (ยกเลิกผลเดิม) — ถ้ากดยกเลิกใน modal สถานะเดิมยังคงอยู่
const SL_STATUS_OPTIONS = [
  { value: 'รอตรวจสอบ', cls: 'warning' },
  { value: 'อนุมัติ', cls: 'success' },
  { value: 'ไม่อนุมัติ', cls: 'danger' }
];
function slStatusSelectHTML(r) {
  const cur = SL_STATUS_OPTIONS.find(o => o.value === r.status) || SL_STATUS_OPTIONS[0];
  const tip = r.status === 'รอตรวจสอบ' ? 'เลือกเพื่ออนุมัติหรือไม่อนุมัติ'
    : `${r.status === 'อนุมัติ' ? 'อนุมัติ' : 'ปฏิเสธ'}โดย: ${CURRENT_APPROVER_NAME}${r.comment ? ' — ' + r.comment : ''}`;
  return `<select class="sl-status-select ${cur.cls}" aria-label="สถานะคำขอของ ${r.name}" title="${tip}" onchange="onSLStatusSelect('${r.id}', this)">
    ${SL_STATUS_OPTIONS.map(o => `<option value="${o.value}"${o.value === r.status ? ' selected' : ''}>${o.value}</option>`).join('')}
  </select>`;
}
function onSLStatusSelect(id, sel) {
  const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  const next = sel.value;
  sel.value = r.status; // คืนค่าเดิมไว้ก่อน — ตารางจะ render ใหม่เองเมื่อยืนยันแล้ว
  if (next === r.status) return;
  if (next === 'อนุมัติ') approveStudentLeave(id);
  else if (next === 'ไม่อนุมัติ') rejectStudentLeave(id);
  else resetSLLeaveStatus(id);
}

function slAttachmentLinkHTML(r) {
  if (!r.attachment) return '-';
  return `
    <a href="#" style="color: var(--primary); font-weight: 500;" onclick="viewSLAttachmentMock('${r.attachment.name}'); return false;" title="${r.attachment.name} (${r.attachment.size})">
      <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:middle;"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
    </a>
  `;
}

function renderApproveStudentLeaveTable() {
  syncSelectOptions(document.getElementById('sl-req-type-filter'), STUDENT_LEAVE_TYPES.map(t => t.name), 'ทุกประเภทการลา');
  syncSelectOptions(document.getElementById('sl-req-grade-filter'), studentGradeOptions(), 'ทุกชั้นปี');
  syncSelectOptions(document.getElementById('sl-req-room-filter'), studentRoomOptions(), 'ทุกห้อง');

  const tbody = document.getElementById('approve-sl-tbody');
  if (!tbody) return;
  const q = (document.getElementById('sl-req-search').value || '').trim().toLowerCase();
  const typeFilter = document.getElementById('sl-req-type-filter').value;
  const gradeFilter = document.getElementById('sl-req-grade-filter').value;
  const roomFilter = document.getElementById('sl-req-room-filter').value;

  const list = STUDENT_LEAVE_REQUESTS.filter(r => {
    if (approveFilterSL === 'pending' && r.status !== 'รอตรวจสอบ') return false;
    if (approveFilterSL === 'approved' && r.status !== 'อนุมัติ') return false;
    if (approveFilterSL === 'rejected' && r.status !== 'ไม่อนุมัติ') return false;
    if (typeFilter && r.type !== typeFilter) return false;
    if (!studentMatchesGradeRoom(r.cls, gradeFilter, roomFilter)) return false;
    if (q && !(r.name.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q) || r.cls.toLowerCase().includes(q))) return false;
    return true;
  });

  // รอตรวจสอบขึ้นก่อน (งานที่ต้องทำ) แล้วเรียงวันที่ยื่นใหม่ → เก่า
  const statusOrder = { 'รอตรวจสอบ': 0, 'อนุมัติ': 1, 'ไม่อนุมัติ': 2 };
  list.sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3) || b.submitDate.localeCompare(a.submitDate));

  tbody.innerHTML = list.length === 0 ? '<tr><td colspan="10" class="no-data">ไม่พบคำขอ</td></tr>' : list.map(r => `
    <tr class="${r.status === 'รอตรวจสอบ' ? 'sl-row-pending' : ''}">
      <td>${slStatusSelectHTML(r)}</td>
      <td>${thaiDate(r.submitDate)}</td>
      <td><strong>${r.name}</strong></td>
      <td>${r.cls}</td>
      <td><span class="badge ${studentLeaveTypeBadgeClass(r.type)}">${r.type}</span></td>
      <td>${thaiDate(r.startDate)}${r.endDate !== r.startDate ? ' - ' + thaiDate(r.endDate) : ''}</td>
      <td style="text-align:center;">${r.days}</td>
      <td class="sl-reason" title="${r.reason}">${r.reason}</td>
      <td style="text-align:center;">${slAttachmentLinkHTML(r)}</td>
      <td>
        <button class="btn-icon" title="ดูรายละเอียด" onclick="viewSLRequestDetails('${r.id}')"><svg class="icon"><use href="#i-view"/></svg></button>
      </td>
    </tr>
  `).join('');
  renderSLCalendarLegend();
}

// คอลัมน์สถานะของตาราง approve-ticket-tbody — dropdown แบบเดียวกับ slStatusSelectHTML (ใช้ SL_STATUS_OPTIONS
// และ CSS .sl-status-select ร่วมกัน): อนุมัติ/ไม่อนุมัติ → approveTicket/rejectTicket (modal ยืนยัน + หมายเหตุ),
// รอตรวจสอบ → resetTicketStatus — กดยกเลิกใน modal แล้วสถานะเดิมยังคงอยู่
function ticketStatusSelectHTML(r) {
  const cur = SL_STATUS_OPTIONS.find(o => o.value === r.status) || SL_STATUS_OPTIONS[0];
  const tip = r.status === 'รอตรวจสอบ' ? 'เลือกเพื่ออนุมัติหรือไม่อนุมัติ'
    : `${r.status === 'อนุมัติ' ? 'อนุมัติ' : 'ปฏิเสธ'}โดย: ${CURRENT_APPROVER_NAME}${r.comment ? ' — ' + r.comment : ''}`;
  return `<select class="sl-status-select ${cur.cls}" aria-label="สถานะบัตรขออนุญาตของ ${r.name}" title="${tip}" onchange="onTicketStatusSelect('${r.reqId}', this)">
    ${SL_STATUS_OPTIONS.map(o => `<option value="${o.value}"${o.value === r.status ? ' selected' : ''}>${o.value}</option>`).join('')}
  </select>`;
}
function onTicketStatusSelect(reqId, sel) {
  const r = HISTORY.find(x => x.reqId === reqId);
  if (!r) return;
  const next = sel.value;
  sel.value = r.status; // คืนค่าเดิมไว้ก่อน — ตารางจะ render ใหม่เองเมื่อยืนยันแล้ว
  if (next === r.status) return;
  if (next === 'อนุมัติ') approveTicket(reqId);
  else if (next === 'ไม่อนุมัติ') rejectTicket(reqId);
  else resetTicketStatus(reqId);
}

function renderApproveTicketTable() {
  syncSelectOptions(document.getElementById('tk-req-type-filter'), TICKET_TYPES, 'ทุกประเภทบัตรขออนุญาต');
  syncSelectOptions(document.getElementById('tk-req-grade-filter'), studentGradeOptions(), 'ทุกชั้นปี');
  syncSelectOptions(document.getElementById('tk-req-room-filter'), studentRoomOptions(), 'ทุกห้อง');

  const tbody = document.getElementById('approve-ticket-tbody');
  if (!tbody) return;
  const q = (document.getElementById('tk-req-search').value || '').trim().toLowerCase();
  const typeFilter = document.getElementById('tk-req-type-filter').value;
  const gradeFilter = document.getElementById('tk-req-grade-filter').value;
  const roomFilter = document.getElementById('tk-req-room-filter').value;

  const list = HISTORY.filter(r => {
    if (approveFilterTicket === 'pending' && r.status !== 'รอตรวจสอบ') return false;
    if (approveFilterTicket === 'approved' && r.status !== 'อนุมัติ') return false;
    if (approveFilterTicket === 'rejected' && r.status !== 'ไม่อนุมัติ') return false;
    if (typeFilter && r.type !== typeFilter) return false;
    if (!studentMatchesGradeRoom(r.cls, gradeFilter, roomFilter)) return false;
    if (q && !(r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.cls.toLowerCase().includes(q))) return false;
    return true;
  });

  // รอตรวจสอบขึ้นก่อน แล้วเรียงวันที่ใหม่ → เก่า (เหมือนตารางใบลา)
  const statusOrder = { 'รอตรวจสอบ': 0, 'อนุมัติ': 1, 'ไม่อนุมัติ': 2 };
  list.sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3) || b.date.localeCompare(a.date));

  tbody.innerHTML = list.length === 0 ? '<tr><td colspan="10" class="no-data">ไม่พบรายการ</td></tr>' : list.map(r => `
    <tr class="${r.status === 'รอตรวจสอบ' ? 'sl-row-pending' : ''}">
      <td>${ticketStatusSelectHTML(r)}</td>
      <td>${r.id}</td>
      <td><strong>${r.name}</strong></td>
      <td>${r.cls}</td>
      <td><span class="type-badge ${typeBadgeClass(r.type)}">${r.type}</span></td>
      <td>${thaiDate(r.date)}</td>
      <td>${r.time}</td>
      <td class="sl-reason" title="${r.reason}">${r.reason}</td>
      <td style="text-align:center;">
        <button class="btn-icon" title="ดูรายละเอียด" onclick="viewTicketRequestDetails('${r.reqId}')"><svg class="icon"><use href="#i-view"/></svg></button>
      </td>
      <td style="text-align:center;">
        <button class="btn-icon" title="ดูประวัติรายบุคคลของนักเรียนคนนี้" onclick="viewStudentHistory('${r.id}')">
          <svg class="icon"><use href="#i-user"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
  renderTicketCalendarLegend();
}

function viewSLAttachmentMock(filename) {
  alert(`จำลองการเปิดไฟล์: ${filename}`);
}

function viewSLRequestDetails(id) {
  const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  detailDrawerBackTo = null;
  updateDetailDrawerBackBtn();

  let attachmentHtml = "<span style='color:var(--text-muted);'>ไม่มีเอกสารแนบ</span>";
  if (r.attachment) {
    attachmentHtml = `
      <div class="file-preview-item" style="margin-top:0;background:rgba(16,185,129,0.05);border-color:rgba(16,185,129,0.2);">
        <div class="file-preview-info">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <a href="#" onclick="viewSLAttachmentMock('${r.attachment.name}'); return false;" style="color:var(--success);font-weight:600;text-decoration:none;">${r.attachment.name} (${r.attachment.size})</a>
        </div>
      </div>
    `;
  }

  const footerHtml = r.status === 'รอตรวจสอบ' ? `
    <button class="btn btn-danger" style="flex:1;" onclick="closeDetailDrawer(); rejectStudentLeave('${r.id}');">ไม่อนุมัติ</button>
    <button class="btn btn-success" style="flex:1;" onclick="closeDetailDrawer(); approveStudentLeave('${r.id}');">อนุมัติใบลา</button>
  ` : `<button class="btn btn-secondary" style="flex:1;" onclick="closeDetailDrawer(); resetSLLeaveStatus('${r.id}');">ยกเลิกผลและเปลี่ยนสถานะ</button>`;

  document.getElementById('drawer-detail-title').textContent = 'รายละเอียดคำขอลาของนักเรียน';
  document.getElementById('drawer-detail-body').innerHTML = `
    <div class="summary-table">
      <div class="summary-row"><span class="summary-label">รหัสคำขอ:</span><span class="summary-value">${r.id}</span></div>
      <div class="summary-row"><span class="summary-label">ชื่อนักเรียน:</span><span class="summary-value" style="font-weight:600;">${r.name} (${r.cls})</span></div>
      <div class="summary-row"><span class="summary-label">ประเภทการลา:</span><span class="summary-value">${r.type}</span></div>
      <div class="summary-row"><span class="summary-label">ช่วงเวลาการลา:</span><span class="summary-value">${thaiDate(r.startDate)} ถึง ${thaiDate(r.endDate)}</span></div>
      <div class="summary-row"><span class="summary-label">จำนวนวันลาสุทธิ:</span><span class="summary-value" style="color:var(--primary);font-size:16px;">${r.days} วัน</span></div>
      <div class="summary-row"><span class="summary-label">เหตุผลการขอลา:</span><span class="summary-value" style="font-weight:normal;text-align:right;max-width:250px;">${r.reason}</span></div>
      <div class="summary-row" style="flex-direction:column;gap:8px;border-bottom:none;">
        <span class="summary-label" style="margin-bottom:4px;">เอกสารหลักฐานแนบ:</span>
        <div>${attachmentHtml}</div>
      </div>
      <div class="summary-row" style="margin-top:10px;"><span class="summary-label">สถานะปัจจุบัน:</span><span class="summary-value">${statusBadgeHTML(r.status)}</span></div>
      ${r.comment ? `<div class="summary-row" style="flex-direction:column;border-bottom:none;background:rgba(255,255,255,0.02);padding:10px;border-radius:8px;margin-top:10px;"><span class="summary-label" style="font-size:12px;">ข้อคิดเห็นจากผู้อนุมัติ:</span><span class="summary-value" style="text-align:left;font-weight:normal;margin-top:4px;color:var(--text-secondary);">${r.comment}</span></div>` : ''}
    </div>
    <div style="margin-top:14px;"><button class="btn btn-secondary" style="width:100%;" onclick="printLeaveRequestPreview('${r.id}')"><svg class="icon"><use href="#i-print"/></svg> พิมพ์ใบลา</button></div>
    ${r.status === 'รอตรวจสอบ' ? `<div style="margin-top:10px;"><button class="btn btn-secondary" style="width:100%;" onclick="editSLRequest('${r.id}')"><svg class="icon"><use href="#i-edit"/></svg> แก้ไขรายการ</button></div>` : ''}
    <div style="display:flex;gap:10px;margin-top:12px;">${footerHtml}</div>
  `;

  detailDrawerRefresh = () => viewSLRequestDetails(id);
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('drawer-detail').classList.add('active');
}

// Renders the classic Thai leave-request form ("แบบใบลา") for one student leave
// request and opens it in the shared print-preview modal.
function printLeaveRequestPreview(id) {
  const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;

  const now = new Date();
  const printDateStr = `${String(now.getDate()).padStart(2, '0')} ${THAI_MONTHS_FULL[now.getMonth()]} ${now.getFullYear() + 543}`;
  const leaveTypeShort = r.type.replace(/^ลา/, ''); // 'ลาป่วย' -> 'ป่วย', 'ลากิจ' -> 'กิจ', ...

  const html = `
    <div style="text-align:center;margin-bottom:18px;">
      <div style="font-weight:700;font-size:15px;">${SCHOOL_INFO.name}</div>
      <div style="font-size:12px;color:#475569;margin-top:2px;">${SCHOOL_INFO.address}</div>
      <div style="font-size:12px;color:#475569;">โทร. ${SCHOOL_INFO.phone}</div>
    </div>
    <div style="text-align:center;font-weight:700;font-size:16px;margin-bottom:18px;">แบบใบลา</div>
    <div style="font-size:13px;line-height:2;">
      <div>เขียนที่ ${SCHOOL_INFO.name}</div>
      <div style="text-align:right;">วันที่ ${printDateStr}</div>
      <div style="margin-top:12px;">เรื่อง ขออนุญาตลา</div>
      <div>เรียน ผู้อำนวยการ${SCHOOL_INFO.name}</div>
      <div style="margin-top:10px;">ข้าพเจ้า ${r.name} ตำแหน่ง นักเรียน ${r.cls}</div>
      <div>สังกัด ${SCHOOL_INFO.name}</div>
      <div>ขอลา ${leaveTypeShort} เนื่องจาก ${r.reason}</div>
      <div>ตั้งแต่วันที่ ${thaiDateLong(r.startDate)} ถึงวันที่ ${thaiDateLong(r.endDate)} ประเภทการลา เต็มวัน รวมวันลา ${r.days} วัน</div>
      <div style="margin-top:10px;">ในระหว่างการลาจะติดต่อข้าพเจ้าได้ที่</div>
      <div class="print-data-group" style="margin-top:6px;line-height:1.6;">
        <div class="print-data-item">บ้านเลขที่ :</div>
        <div class="print-data-item">ถนน :</div>
        <div class="print-data-item">ตำบล :</div>
        <div class="print-data-item">อำเภอ :</div>
        <div class="print-data-item">จังหวัด :</div>
        <div class="print-data-item">โทรศัพท์ :</div>
      </div>
      <div style="margin-top:60px;text-align:right;padding-right:40px;">
        ลงชื่อ..........................................ผู้ยื่นคำร้อง<br>
        (${r.name})
      </div>
    </div>
  `;

  openPrintPreview('พรีวิวแบบใบลา', html);
}

function viewTicketRequestDetails(reqId) {
  const r = HISTORY.find(x => x.reqId === reqId);
  if (!r) return;
  detailDrawerBackTo = null;
  updateDetailDrawerBackBtn();

  const footerHtml = r.status === 'รอตรวจสอบ' ? `
    <button class="btn btn-danger" style="flex:1;" onclick="closeDetailDrawer(); rejectTicket('${r.reqId}');">ไม่อนุมัติ</button>
    <button class="btn btn-success" style="flex:1;" onclick="closeDetailDrawer(); approveTicket('${r.reqId}');">อนุมัติ</button>
  ` : `<button class="btn btn-secondary" style="flex:1;" onclick="closeDetailDrawer(); resetTicketStatus('${r.reqId}');">ยกเลิกผลและเปลี่ยนสถานะ</button>`;
  const editHtml = r.status === 'รอตรวจสอบ'
    ? `<div style="margin-top:14px;"><button class="btn btn-secondary" style="width:100%;" onclick="editTicketRequest('${r.reqId}')"><svg class="icon"><use href="#i-edit"/></svg> แก้ไขรายการ</button></div>`
    : '';

  document.getElementById('drawer-detail-title').textContent = 'รายละเอียดบัตรขออนุญาต';
  document.getElementById('drawer-detail-body').innerHTML = `
    <div class="summary-table">
      <div class="summary-row"><span class="summary-label">รหัส:</span><span class="summary-value">${r.id}</span></div>
      <div class="summary-row"><span class="summary-label">ชื่อนักเรียน:</span><span class="summary-value" style="font-weight:600;">${r.name} (${r.cls})</span></div>
      <div class="summary-row"><span class="summary-label">ประเภท:</span><span class="summary-value"><span class="type-badge ${typeBadgeClass(r.type)}">${r.type}</span></span></div>
      <div class="summary-row"><span class="summary-label">วันที่:</span><span class="summary-value">${thaiDate(r.date)}</span></div>
      <div class="summary-row"><span class="summary-label">ช่วงเวลา:</span><span class="summary-value">${r.time}</span></div>
      <div class="summary-row"><span class="summary-label">เหตุผล:</span><span class="summary-value" style="font-weight:normal;text-align:right;max-width:250px;">${r.reason}</span></div>
      <div class="summary-row" style="margin-top:10px;"><span class="summary-label">สถานะปัจจุบัน:</span><span class="summary-value">${statusBadgeHTML(r.status)}</span></div>
      ${r.comment ? `<div class="summary-row" style="flex-direction:column;border-bottom:none;background:rgba(255,255,255,0.02);padding:10px;border-radius:8px;margin-top:10px;"><span class="summary-label" style="font-size:12px;">ข้อคิดเห็นจากผู้อนุมัติ:</span><span class="summary-value" style="text-align:left;font-weight:normal;margin-top:4px;color:var(--text-secondary);">${r.comment}</span></div>` : ''}
    </div>
    ${editHtml}
    <div style="display:flex;gap:10px;margin-top:12px;">${footerHtml}</div>
  `;

  detailDrawerRefresh = () => viewTicketRequestDetails(reqId);
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('drawer-detail').classList.add('active');
}

function approveStudentLeave(id) {
  const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  showConfirmModal({
    title: 'ยืนยันอนุมัติใบลา',
    message: `ยืนยันการอนุมัติใบลาของ <strong style="color:var(--primary);">${r.name}</strong><br>ประเภท: ${r.type} (${r.days} วัน)`,
    confirmLabel: 'อนุมัติ',
    requireNote: true,
    onConfirm: (note) => {
      r.status = 'อนุมัติ';
      r.comment = note || 'อนุมัติในระบบ';
      renderApproveStudentLeaveTable();
      renderApproveBadgeCount();
      refreshSLCalendarIfVisible();
      if (detailDrawerRefresh) detailDrawerRefresh();
    }
  });
}

function rejectStudentLeave(id) {
  const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  showConfirmModal({
    title: 'ปฏิเสธคำขอการลา',
    message: `คุณกำลังปฏิเสธใบลาของ <strong style="color:var(--danger);">${r.name}</strong><br>ประเภท: ${r.type} (${r.days} วัน)`,
    confirmLabel: 'ปฏิเสธ',
    requireNote: true,
    onConfirm: (note) => {
      r.status = 'ไม่อนุมัติ';
      r.comment = note || 'ปฏิเสธคำขอการลา';
      renderApproveStudentLeaveTable();
      renderApproveBadgeCount();
      refreshSLCalendarIfVisible();
      if (detailDrawerRefresh) detailDrawerRefresh();
    }
  });
}

function resetSLLeaveStatus(id) {
  const r = STUDENT_LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`ต้องการยกเลิกการตัดสินใจและเปลี่ยนสถานะคำขอของ ${r.name} กลับเป็น "รอตรวจสอบ" ใช่หรือไม่?`)) return;
  r.status = 'รอตรวจสอบ';
  r.comment = '';
  renderApproveStudentLeaveTable();
  renderApproveBadgeCount();
  refreshSLCalendarIfVisible();
  if (detailDrawerRefresh) detailDrawerRefresh();
}

function approveTicket(reqId) {
  const r = HISTORY.find(x => x.reqId === reqId);
  if (!r) return;
  showConfirmModal({
    title: 'ยืนยันอนุมัติบัตรขออนุญาต',
    message: `ยืนยันการอนุมัติบัตรขออนุญาตของ <strong style="color:var(--primary);">${r.name}</strong><br>ประเภท: ${r.type}`,
    confirmLabel: 'อนุมัติ',
    requireNote: true,
    onConfirm: (note) => {
      r.status = 'อนุมัติ';
      r.comment = note || 'อนุมัติในระบบ';
      renderApproveTicketTable();
      renderTicketBadgeCount();
      refreshTicketCalendarIfVisible();
      if (detailDrawerRefresh) detailDrawerRefresh();
    }
  });
}

function rejectTicket(reqId) {
  const r = HISTORY.find(x => x.reqId === reqId);
  if (!r) return;
  showConfirmModal({
    title: 'ปฏิเสธบัตรขออนุญาต',
    message: `คุณกำลังปฏิเสธบัตรขออนุญาตของ <strong style="color:var(--danger);">${r.name}</strong><br>ประเภท: ${r.type}`,
    confirmLabel: 'ปฏิเสธ',
    requireNote: true,
    onConfirm: (note) => {
      r.status = 'ไม่อนุมัติ';
      r.comment = note || 'ปฏิเสธคำขอ';
      renderApproveTicketTable();
      renderTicketBadgeCount();
      refreshTicketCalendarIfVisible();
      if (detailDrawerRefresh) detailDrawerRefresh();
    }
  });
}

function resetTicketStatus(reqId) {
  const r = HISTORY.find(x => x.reqId === reqId);
  if (!r) return;
  if (!confirm(`ต้องการยกเลิกการตัดสินใจและเปลี่ยนสถานะคำขอของ ${r.name} กลับเป็น "รอตรวจสอบ" ใช่หรือไม่?`)) return;
  r.status = 'รอตรวจสอบ';
  r.comment = '';
  renderApproveTicketTable();
  renderTicketBadgeCount();
  refreshTicketCalendarIfVisible();
  if (detailDrawerRefresh) detailDrawerRefresh();
}

renderApproveBadgeCount();
renderTicketBadgeCount();

// ======================================================================
//  ปฏิทินภาพรวมการลาของนักเรียน (Student Leave Calendar)
//  Mirrors the "ปฏิทินภาพรวมการลาของบุคลากรครู" calendar in app.html/index.js,
//  adapted to STUDENT_LEAVE_REQUESTS + the CRUD-able STUDENT_LEAVE_TYPES.
// ======================================================================
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

const slCalState = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate(),
  mode: 'month'
};
let slDrawerOpenDate = null;

function parseSLDateString(str) {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

function slLeavesOnDate(cellDate) {
  const typeFilterEl = document.getElementById('sl-req-type-filter');
  const typeFilter = typeFilterEl ? typeFilterEl.value : '';
  return STUDENT_LEAVE_REQUESTS.filter(req => {
    if (typeFilter && req.type !== typeFilter) return false;
    const start = parseSLDateString(req.startDate);
    const end = parseSLDateString(req.endDate);
    if (!start || !end) return false;
    const t = cellDate.getTime();
    return t >= start.getTime() && t <= end.getTime();
  });
}

function refreshSLCalendarIfVisible() {
  const view = document.getElementById('view-approve');
  const tabRequests = document.getElementById('tab-requests');
  if (view && view.classList.contains('active') && listMode.approve === 'calendar'
      && tabRequests && tabRequests.classList.contains('active')) {
    renderStudentLeaveCalendar();
  }
  if (slDrawerOpenDate) openDayLeavesDrawer(slDrawerOpenDate);
}

function renderSLCalendarLegend() {
  const legend = document.getElementById('sl-calendar-legend');
  if (!legend) return;
  const typeFilterEl = document.getElementById('sl-req-type-filter');
  const activeType = typeFilterEl ? typeFilterEl.value : '';
  legend.innerHTML = STUDENT_LEAVE_TYPES.map(t => `
    <span class="calendar-leave-pill ${studentLeaveTypeBadgeClass(t.name)}${activeType === t.name ? ' legend-active' : ''}" style="cursor:pointer;" onclick="toggleSLLegendFilter('${t.name}')">${t.name}</span>
  `).join('') + `<span class="calendar-leave-pill pending" style="cursor:default;border-color:var(--text-muted);color:var(--text-muted);">เส้นประ = รอตรวจสอบ</span>`;
}

function toggleSLLegendFilter(typeName) {
  const select = document.getElementById('sl-req-type-filter');
  if (!select) return;
  select.value = select.value === typeName ? '' : typeName;
  const tabBtn = document.querySelector('#view-approve .tab-btn[data-tab="requests"]');
  if (tabBtn && !tabBtn.classList.contains('active')) tabBtn.click();
  else renderApproveStudentLeaveTable();
  refreshSLCalendarIfVisible();
}

function renderStudentLeaveCalendar() {
  const container = document.getElementById('sl-leave-calendar-container');
  const label = document.getElementById('sl-calendar-month-year-label');
  if (!container || !label) return;

  renderSLCalendarLegend();
  container.innerHTML = '';

  const { mode, year, month } = slCalState;
  const day = slCalState.day || 1;
  const targetDate = new Date(year, month, day);

  const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const thaiMonthsFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const thaiDaysFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  if (mode === 'month') {
    label.textContent = `${thaiMonthsFull[month]} ${year + 543}`;
    renderSLMonthView(container, year, month);
  } else if (mode === 'week') {
    const dayOfWeek = targetDate.getDay();
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    label.textContent = `${startOfWeek.getDate()} ${thaiMonthsShort[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${thaiMonthsShort[endOfWeek.getMonth()]} ${endOfWeek.getFullYear() + 543}`;
    renderSLWeekView(container, startOfWeek);
  } else if (mode === 'day') {
    label.textContent = `วัน${thaiDaysFull[targetDate.getDay()]}ที่ ${targetDate.getDate()} ${thaiMonthsFull[targetDate.getMonth()]} ${year + 543}`;
    renderSLDayView(container, targetDate);
  }
}

function slPillHTML(req) {
  const colorCls = studentLeaveTypeBadgeClass(req.type);
  const statusCls = req.status === 'รอตรวจสอบ' ? 'pending' : (req.status === 'อนุมัติ' ? 'approved' : '');
  return { colorCls, statusCls };
}

function renderSLMonthView(container, year, month) {
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].forEach(d => {
    const h = document.createElement('div');
    h.className = 'calendar-header-day';
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonthYear = today.getFullYear() === year && today.getMonth() === month;

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell inactive';
    cell.innerHTML = `<span class="calendar-cell-date">${prevMonthTotalDays - i}</span>`;
    grid.appendChild(cell);
  }

  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    const currentCellDate = new Date(year, month, d);
    const dayOfWeek = currentCellDate.getDay();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

    if (isWeekend) cell.classList.add('weekend');
    if (isHoliday) { cell.classList.add('holiday'); cell.title = 'วันหยุดนักขัตฤกษ์'; }
    if (isCurrentMonthYear && d === today.getDate()) cell.classList.add('today');

    cell.innerHTML = `<span class="calendar-cell-date">${d}</span>`;

    if (!isWeekend && !isHoliday) {
      const activeLeaves = slLeavesOnDate(currentCellDate);
      const MAX_VISIBLE = 2;
      const visibleLeaves = activeLeaves.slice(0, MAX_VISIBLE);
      const overflowCount = activeLeaves.length - MAX_VISIBLE;

      visibleLeaves.forEach(req => {
        const { colorCls, statusCls } = slPillHTML(req);
        const pill = document.createElement('div');
        pill.className = `calendar-leave-pill ${colorCls} ${statusCls}`.trim();
        pill.innerHTML = `${req.name.split(' ')[0]} (${req.type})`;
        pill.title = `${req.name} (${req.cls}) - ${req.type} (${req.days} วัน): ${req.reason}`;
        pill.onclick = (e) => { e.stopPropagation(); openDayLeavesDrawer(currentCellDate); };
        cell.appendChild(pill);
      });

      if (overflowCount > 0) {
        const moreBadge = document.createElement('div');
        moreBadge.className = 'calendar-more-badge';
        moreBadge.textContent = `+${overflowCount} เพิ่มเติม`;
        moreBadge.title = `ดูรายชื่อนักเรียนที่ลาทั้งหมด (${activeLeaves.length} คน)`;
        moreBadge.onclick = (e) => { e.stopPropagation(); openDayLeavesDrawer(currentCellDate); };
        cell.appendChild(moreBadge);
      }

      if (activeLeaves.length > 0) {
        cell.style.cursor = 'pointer';
        cell.onclick = () => openDayLeavesDrawer(currentCellDate);
      }
    } else if (isHoliday) {
      const holidaySpan = document.createElement('span');
      holidaySpan.className = 'calendar-holiday-name';
      holidaySpan.textContent = HOLIDAY_NAMES_2026[dateString] || 'วันหยุดนักขัตฤกษ์';
      cell.appendChild(holidaySpan);
    }

    grid.appendChild(cell);
  }

  const gridCellCount = firstDayIndex + totalDays;
  const remainingCells = 42 - gridCellCount;
  const totalPaddedCells = (remainingCells >= 7) ? 35 : 42;
  const finalPaddingCount = totalPaddedCells - gridCellCount;
  for (let i = 1; i <= finalPaddingCount; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell inactive';
    cell.innerHTML = `<span class="calendar-cell-date">${i}</span>`;
    grid.appendChild(cell);
  }

  container.appendChild(grid);
}

function renderSLWeekView(container, startOfWeek) {
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';
  const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].forEach(d => {
    const h = document.createElement('div');
    h.className = 'calendar-header-day';
    h.textContent = d;
    grid.appendChild(h);
  });

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const currentCellDate = new Date(startOfWeek);
    currentCellDate.setDate(startOfWeek.getDate() + i);
    const d = currentCellDate.getDate(), m = currentCellDate.getMonth(), y = currentCellDate.getFullYear();
    const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = currentCellDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.style.minHeight = '140px';
    if (isWeekend) cell.classList.add('weekend');
    if (isHoliday) { cell.classList.add('holiday'); cell.title = 'วันหยุดนักขัตฤกษ์'; }
    if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d) cell.classList.add('today');

    cell.innerHTML = `<span class="calendar-cell-date">${d} ${thaiMonthsShort[m]}</span>`;

    if (!isWeekend && !isHoliday) {
      slLeavesOnDate(currentCellDate).forEach(req => {
        const { colorCls, statusCls } = slPillHTML(req);
        const pill = document.createElement('div');
        pill.className = `calendar-leave-pill ${colorCls} ${statusCls}`.trim();
        pill.innerHTML = `${req.name.split(' ')[0]} (${req.type})`;
        pill.title = `${req.name} (${req.cls}) - ${req.type} (${req.days} วัน): ${req.reason}`;
        pill.onclick = (e) => { e.stopPropagation(); openDayLeavesDrawer(currentCellDate); };
        cell.appendChild(pill);
      });
    } else if (isHoliday) {
      const holidaySpan = document.createElement('span');
      holidaySpan.className = 'calendar-holiday-name';
      holidaySpan.textContent = HOLIDAY_NAMES_2026[dateString] || 'วันหยุดนักขัตฤกษ์';
      cell.appendChild(holidaySpan);
    }

    grid.appendChild(cell);
  }

  container.appendChild(grid);
}

function slDayCardHTML(req, actionAttr, navAttr) {
  const initials = req.name.replace(/\s/g, '').slice(0, 2);
  return `
    <div class="calendar-day-card">
      <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" title="ดูโควตาและประวัติการลาของ ${req.name}" ${navAttr('openSLProfileDrawer', req.studentId)}>
        <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--primary), var(--info)); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; font-family:var(--font-heading);">${initials}</div>
        <div>
          <div style="font-weight:600; color:var(--text-primary); font-size:14px;">${req.name} <span style="font-weight:400;color:var(--text-muted);">(${req.cls})</span></div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">เหตุผล: ${req.reason}</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="text-align:right;">
          <span class="calendar-leave-pill ${studentLeaveTypeBadgeClass(req.type)} ${req.status === 'รอตรวจสอบ' ? 'pending' : (req.status === 'อนุมัติ' ? 'approved' : '')}" style="display:inline-flex;">${req.type} (${req.days} วัน)</span>
          <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${thaiDate(req.startDate)}${req.endDate !== req.startDate ? ' - ' + thaiDate(req.endDate) : ''}</div>
        </div>
        <button class="btn-icon" title="ดูรายละเอียด" ${navAttr('viewSLRequestDetails', req.id)}><svg class="icon"><use href="#i-view"/></svg></button>
        ${req.status === 'รอตรวจสอบ' ? `
          <div style="display:flex;gap:6px;">
            <button class="btn-icon" style="border-color:var(--success);color:var(--success);" title="อนุมัติ" ${actionAttr('approveStudentLeave', req.id)}><svg class="icon"><use href="#i-check"/></svg></button>
            <button class="btn-icon" style="border-color:var(--danger);color:var(--danger);" title="ไม่อนุมัติ" ${actionAttr('rejectStudentLeave', req.id)}><svg class="icon"><use href="#i-x"/></svg></button>
          </div>
        ` : statusBadgeHTML(req.status)}
      </div>
    </div>
  `;
}

function renderSLDayView(container, targetDate) {
  const dayView = document.createElement('div');
  dayView.className = 'calendar-day-view-container';

  const y = targetDate.getFullYear(), m = targetDate.getMonth(), d = targetDate.getDate();
  const dayOfWeek = targetDate.getDay();
  const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
  const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

  let statusTag = `<span class="badge success">วันเรียนปกติ</span>`;
  if (isWeekend) statusTag = `<span class="badge danger">วันหยุดเสาร์-อาทิตย์</span>`;
  else if (isHoliday) statusTag = `<span class="badge warning">${HOLIDAY_NAMES_2026[dateString] || 'วันหยุดนักขัตฤกษ์'}</span>`;

  const activeLeaves = slLeavesOnDate(targetDate);
  // Rendered inline in the calendar itself (not inside a drawer), so nav actions
  // (open profile / view request) need no "close drawer + remember how to come back" step.
  const actionAttr = (fn, id) => `onclick="${fn}('${id}')"`;
  const navAttr = actionAttr;

  const contentHtml = activeLeaves.length === 0 ? `
    <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
      <svg viewBox="0 0 24 24" style="width: 40px; height: 40px; stroke: currentColor; fill: none; stroke-width: 1.5; margin-bottom: 8px; opacity: 0.5; display:inline-block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <p style="margin: 0; font-size: 14px; font-weight: 500;">ไม่มีนักเรียนยื่นขอลาในวันนี้</p>
    </div>
  ` : activeLeaves.map(req => slDayCardHTML(req, actionAttr, navAttr)).join('');

  dayView.innerHTML = `
    <div class="calendar-day-header">
      <strong style="font-size:15px;color:var(--text-primary);">สถานะวันเรียน</strong>
      <div>${statusTag}</div>
    </div>
    <div style="font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:12px;">รายการนักเรียนที่ลาในวันนี้ (${activeLeaves.length} คน)</div>
    <div>${contentHtml}</div>
  `;

  container.appendChild(dayView);
}

function openDayLeavesDrawer(cellDate) {
  const thaiMonthsFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const thaiDaysFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  const d = cellDate.getDate(), m = cellDate.getMonth(), y = cellDate.getFullYear();
  slDrawerOpenDate = cellDate;

  const titleEl = document.getElementById('drawer-day-leaves-title');
  if (titleEl) titleEl.textContent = `รายชื่อผู้ลาวัน${thaiDaysFull[cellDate.getDay()]}ที่ ${d} ${thaiMonthsFull[m]} ${y + 543}`;

  const bodyEl = document.getElementById('drawer-day-leaves-body');
  if (!bodyEl) return;

  const activeLeaves = slLeavesOnDate(cellDate);
  const actionAttr = (fn, id) => `onclick="closeDayLeavesDrawer(); ${fn}('${id}');"`;
  // Nav actions (open profile / view request) go through a wrapper that remembers
  // this date so the detail drawer can show a "back to this day's list" button.
  const navAttr = (fn, id) => {
    const wrapper = fn === 'openSLProfileDrawer' ? 'goToDaySLProfile' : 'goToDaySLRequestDetail';
    return `onclick="${wrapper}('${id}', ${y}, ${m}, ${d})"`;
  };
  bodyEl.innerHTML = activeLeaves.length === 0
    ? `<div style="text-align:center; padding: 30px; color: var(--text-muted);">ไม่มีนักเรียนยื่นขอลาในวันนี้</div>`
    : activeLeaves.map(req => slDayCardHTML(req, actionAttr, navAttr)).join('');

  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('drawer-day-leaves').classList.add('active');
}

function closeDayLeavesDrawer() {
  const panel = document.getElementById('drawer-day-leaves');
  if (panel) panel.classList.remove('active');
  hideDrawerOverlayIfNoneActive();
  slDrawerOpenDate = null;
}

function closeDayTicketsDrawer() {
  const panel = document.getElementById('drawer-day-tickets');
  if (panel) panel.classList.remove('active');
  hideDrawerOverlayIfNoneActive();
  tkDrawerOpenDate = null;
}

function closeDetailDrawer() {
  const panel = document.getElementById('drawer-detail');
  if (panel) panel.classList.remove('active');
  hideDrawerOverlayIfNoneActive();
  detailDrawerBackTo = null;
  updateDetailDrawerBackBtn();
}

function prevSLCalendarMonth() {
  const currDate = new Date(slCalState.year, slCalState.month, slCalState.day || 15);
  if (slCalState.mode === 'month') {
    slCalState.month--;
    if (slCalState.month < 0) { slCalState.month = 11; slCalState.year--; }
  } else {
    currDate.setDate(currDate.getDate() - (slCalState.mode === 'week' ? 7 : 1));
    slCalState.year = currDate.getFullYear();
    slCalState.month = currDate.getMonth();
    slCalState.day = currDate.getDate();
  }
  renderStudentLeaveCalendar();
}

function nextSLCalendarMonth() {
  const currDate = new Date(slCalState.year, slCalState.month, slCalState.day || 15);
  if (slCalState.mode === 'month') {
    slCalState.month++;
    if (slCalState.month > 11) { slCalState.month = 0; slCalState.year++; }
  } else {
    currDate.setDate(currDate.getDate() + (slCalState.mode === 'week' ? 7 : 1));
    slCalState.year = currDate.getFullYear();
    slCalState.month = currDate.getMonth();
    slCalState.day = currDate.getDate();
  }
  renderStudentLeaveCalendar();
}

function resetSLCalendarToday() {
  const today = new Date();
  slCalState.year = today.getFullYear();
  slCalState.month = today.getMonth();
  slCalState.day = today.getDate();
  renderStudentLeaveCalendar();
}

document.getElementById('sl-calendar-prev-month-btn').addEventListener('click', prevSLCalendarMonth);
document.getElementById('sl-calendar-next-month-btn').addEventListener('click', nextSLCalendarMonth);
document.getElementById('sl-calendar-today-btn').addEventListener('click', resetSLCalendarToday);
document.querySelectorAll('#sl-calendar-card .cal-mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('#sl-calendar-card .cal-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    slCalState.mode = btn.getAttribute('data-mode');
    renderStudentLeaveCalendar();
  });
});

// ======================================================================
//  ปฏิทินภาพรวมบัตรขออนุญาต (Ticket Calendar) — same month/week/day pattern
//  as the student leave calendar above, adapted to single-day HISTORY records.
// ======================================================================
const tkCalState = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate(),
  mode: 'month'
};
let tkDrawerOpenDate = null;

function tkTicketsOnDate(cellDate) {
  const y = cellDate.getFullYear(), m = cellDate.getMonth(), d = cellDate.getDate();
  const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const typeFilterEl = document.getElementById('tk-req-type-filter');
  const typeFilter = typeFilterEl ? typeFilterEl.value : '';
  return HISTORY.filter(r => r.date === dateString && (!typeFilter || r.type === typeFilter));
}

function refreshTicketCalendarIfVisible() {
  const view = document.getElementById('view-ticket-calendar');
  const tabTkList = document.getElementById('tab-tk-list');
  if (view && view.classList.contains('active') && listMode['ticket-calendar'] === 'calendar'
      && tabTkList && tabTkList.classList.contains('active')) {
    renderTicketCalendar();
  }
  if (tkDrawerOpenDate) openDayTicketsDrawer(tkDrawerOpenDate);
}

function renderTicketCalendarLegend() {
  const legend = document.getElementById('tk-calendar-legend');
  if (!legend) return;
  const typeFilterEl = document.getElementById('tk-req-type-filter');
  const activeType = typeFilterEl ? typeFilterEl.value : '';
  legend.innerHTML = TICKET_TYPES.map(t => `
    <span class="calendar-leave-pill ${typeBadgeClass(t)}${activeType === t ? ' legend-active' : ''}" style="cursor:pointer;" onclick="toggleTicketLegendFilter('${t}')">${t}</span>
  `).join('') + `<span class="calendar-leave-pill pending" style="cursor:default;border-color:var(--text-muted);color:var(--text-muted);">เส้นประ = รอตรวจสอบ</span>`;
}

function toggleTicketLegendFilter(type) {
  const select = document.getElementById('tk-req-type-filter');
  if (!select) return;
  select.value = select.value === type ? '' : type;
  const tabBtn = document.querySelector('#view-ticket-calendar .tab-btn[data-tab="tk-list"]');
  if (tabBtn && !tabBtn.classList.contains('active')) tabBtn.click();
  else renderApproveTicketTable();
  refreshTicketCalendarIfVisible();
}

function renderTicketCalendar() {
  const container = document.getElementById('tk-calendar-container');
  const label = document.getElementById('tk-calendar-month-year-label');
  if (!container || !label) return;

  renderTicketCalendarLegend();
  container.innerHTML = '';

  const { mode, year, month } = tkCalState;
  const day = tkCalState.day || 1;
  const targetDate = new Date(year, month, day);

  const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const thaiMonthsFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const thaiDaysFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  if (mode === 'month') {
    label.textContent = `${thaiMonthsFull[month]} ${year + 543}`;
    renderTkMonthView(container, year, month);
  } else if (mode === 'week') {
    const dayOfWeek = targetDate.getDay();
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    label.textContent = `${startOfWeek.getDate()} ${thaiMonthsShort[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${thaiMonthsShort[endOfWeek.getMonth()]} ${endOfWeek.getFullYear() + 543}`;
    renderTkWeekView(container, startOfWeek);
  } else if (mode === 'day') {
    label.textContent = `วัน${thaiDaysFull[targetDate.getDay()]}ที่ ${targetDate.getDate()} ${thaiMonthsFull[targetDate.getMonth()]} ${year + 543}`;
    renderTkDayView(container, targetDate);
  }
}

function tkPillClasses(r) {
  const colorCls = typeBadgeClass(r.type);
  const statusCls = r.status === 'รอตรวจสอบ' ? 'pending' : (r.status === 'อนุมัติ' ? 'approved' : '');
  return `${colorCls} ${statusCls}`.trim();
}

function renderTkMonthView(container, year, month) {
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].forEach(d => {
    const h = document.createElement('div');
    h.className = 'calendar-header-day';
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonthYear = today.getFullYear() === year && today.getMonth() === month;

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell inactive';
    cell.innerHTML = `<span class="calendar-cell-date">${prevMonthTotalDays - i}</span>`;
    grid.appendChild(cell);
  }

  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    const currentCellDate = new Date(year, month, d);
    const dayOfWeek = currentCellDate.getDay();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

    if (isWeekend) cell.classList.add('weekend');
    if (isHoliday) { cell.classList.add('holiday'); cell.title = 'วันหยุดนักขัตฤกษ์'; }
    if (isCurrentMonthYear && d === today.getDate()) cell.classList.add('today');

    cell.innerHTML = `<span class="calendar-cell-date">${d}</span>`;

    if (!isWeekend && !isHoliday) {
      const activeTickets = tkTicketsOnDate(currentCellDate);
      const MAX_VISIBLE = 2;
      const visibleTickets = activeTickets.slice(0, MAX_VISIBLE);
      const overflowCount = activeTickets.length - MAX_VISIBLE;

      visibleTickets.forEach(r => {
        const pill = document.createElement('div');
        pill.className = `calendar-leave-pill ${tkPillClasses(r)}`;
        pill.innerHTML = `${r.name.split(' ')[0]} (${r.type})`;
        pill.title = `${r.name} (${r.cls}) - ${r.type} ${r.time}: ${r.reason}`;
        pill.onclick = (e) => { e.stopPropagation(); openDayTicketsDrawer(currentCellDate); };
        cell.appendChild(pill);
      });

      if (overflowCount > 0) {
        const moreBadge = document.createElement('div');
        moreBadge.className = 'calendar-more-badge';
        moreBadge.textContent = `+${overflowCount} เพิ่มเติม`;
        moreBadge.title = `ดูรายชื่อทั้งหมด (${activeTickets.length} รายการ)`;
        moreBadge.onclick = (e) => { e.stopPropagation(); openDayTicketsDrawer(currentCellDate); };
        cell.appendChild(moreBadge);
      }

      if (activeTickets.length > 0) {
        cell.style.cursor = 'pointer';
        cell.onclick = () => openDayTicketsDrawer(currentCellDate);
      }
    } else if (isHoliday) {
      const holidaySpan = document.createElement('span');
      holidaySpan.className = 'calendar-holiday-name';
      holidaySpan.textContent = HOLIDAY_NAMES_2026[dateString] || 'วันหยุดนักขัตฤกษ์';
      cell.appendChild(holidaySpan);
    }

    grid.appendChild(cell);
  }

  const gridCellCount = firstDayIndex + totalDays;
  const remainingCells = 42 - gridCellCount;
  const totalPaddedCells = (remainingCells >= 7) ? 35 : 42;
  const finalPaddingCount = totalPaddedCells - gridCellCount;
  for (let i = 1; i <= finalPaddingCount; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell inactive';
    cell.innerHTML = `<span class="calendar-cell-date">${i}</span>`;
    grid.appendChild(cell);
  }

  container.appendChild(grid);
}

function renderTkWeekView(container, startOfWeek) {
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';
  const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].forEach(d => {
    const h = document.createElement('div');
    h.className = 'calendar-header-day';
    h.textContent = d;
    grid.appendChild(h);
  });

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const currentCellDate = new Date(startOfWeek);
    currentCellDate.setDate(startOfWeek.getDate() + i);
    const d = currentCellDate.getDate(), m = currentCellDate.getMonth(), y = currentCellDate.getFullYear();
    const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = currentCellDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.style.minHeight = '140px';
    if (isWeekend) cell.classList.add('weekend');
    if (isHoliday) { cell.classList.add('holiday'); cell.title = 'วันหยุดนักขัตฤกษ์'; }
    if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d) cell.classList.add('today');

    cell.innerHTML = `<span class="calendar-cell-date">${d} ${thaiMonthsShort[m]}</span>`;

    if (!isWeekend && !isHoliday) {
      tkTicketsOnDate(currentCellDate).forEach(r => {
        const pill = document.createElement('div');
        pill.className = `calendar-leave-pill ${tkPillClasses(r)}`;
        pill.innerHTML = `${r.name.split(' ')[0]} (${r.type})`;
        pill.title = `${r.name} (${r.cls}) - ${r.type} ${r.time}: ${r.reason}`;
        pill.onclick = (e) => { e.stopPropagation(); openDayTicketsDrawer(currentCellDate); };
        cell.appendChild(pill);
      });
    } else if (isHoliday) {
      const holidaySpan = document.createElement('span');
      holidaySpan.className = 'calendar-holiday-name';
      holidaySpan.textContent = HOLIDAY_NAMES_2026[dateString] || 'วันหยุดนักขัตฤกษ์';
      cell.appendChild(holidaySpan);
    }

    grid.appendChild(cell);
  }

  container.appendChild(grid);
}

function tkDayCardHTML(r, actionAttr, navAttr) {
  const initials = r.name.replace(/\s/g, '').slice(0, 2);
  return `
    <div class="calendar-day-card">
      <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" title="ดูโควตาและประวัติการขออนุญาตของ ${r.name}" ${navAttr('viewStudentHistory', r.id)}>
        <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--primary), var(--info)); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; font-family:var(--font-heading);">${initials}</div>
        <div>
          <div style="font-weight:600; color:var(--text-primary); font-size:14px;">${r.name} <span style="font-weight:400;color:var(--text-muted);">(${r.cls})</span></div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">เหตุผล: ${r.reason}</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="text-align:right;">
          <span class="type-badge ${typeBadgeClass(r.type)}" style="display:inline-flex;">${r.type}</span>
          <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${r.time}</div>
        </div>
        <button class="btn-icon" title="ดูรายละเอียด" ${navAttr('viewTicketRequestDetails', r.reqId)}><svg class="icon"><use href="#i-view"/></svg></button>
        ${r.status === 'รอตรวจสอบ' ? `
          <div style="display:flex;gap:6px;">
            <button class="btn-icon" style="border-color:var(--success);color:var(--success);" title="อนุมัติ" ${actionAttr('approveTicket', r.reqId)}><svg class="icon"><use href="#i-check"/></svg></button>
            <button class="btn-icon" style="border-color:var(--danger);color:var(--danger);" title="ไม่อนุมัติ" ${actionAttr('rejectTicket', r.reqId)}><svg class="icon"><use href="#i-x"/></svg></button>
          </div>
        ` : statusBadgeHTML(r.status)}
      </div>
    </div>
  `;
}

function renderTkDayView(container, targetDate) {
  const dayView = document.createElement('div');
  dayView.className = 'calendar-day-view-container';

  const y = targetDate.getFullYear(), m = targetDate.getMonth(), d = targetDate.getDate();
  const dayOfWeek = targetDate.getDay();
  const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
  const isHoliday = THAILAND_HOLIDAYS_2026.includes(dateString);

  let statusTag = `<span class="badge success">วันเรียนปกติ</span>`;
  if (isWeekend) statusTag = `<span class="badge danger">วันหยุดเสาร์-อาทิตย์</span>`;
  else if (isHoliday) statusTag = `<span class="badge warning">${HOLIDAY_NAMES_2026[dateString] || 'วันหยุดนักขัตฤกษ์'}</span>`;

  const activeTickets = tkTicketsOnDate(targetDate);
  // Rendered inline in the calendar itself (not inside a drawer), so nav actions
  // (open profile / view request) need no "close drawer + remember how to come back" step.
  const actionAttr = (fn, id) => `onclick="${fn}('${id}')"`;
  const navAttr = actionAttr;

  const contentHtml = activeTickets.length === 0 ? `
    <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
      <svg viewBox="0 0 24 24" style="width: 40px; height: 40px; stroke: currentColor; fill: none; stroke-width: 1.5; margin-bottom: 8px; opacity: 0.5; display:inline-block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <p style="margin: 0; font-size: 14px; font-weight: 500;">ไม่มีนักเรียนขออนุญาตในวันนี้</p>
    </div>
  ` : activeTickets.map(r => tkDayCardHTML(r, actionAttr, navAttr)).join('');

  dayView.innerHTML = `
    <div class="calendar-day-header">
      <strong style="font-size:15px;color:var(--text-primary);">สถานะวันเรียน</strong>
      <div>${statusTag}</div>
    </div>
    <div style="font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:12px;">รายการบัตรขออนุญาตในวันนี้ (${activeTickets.length} รายการ)</div>
    <div>${contentHtml}</div>
  `;

  container.appendChild(dayView);
}

function openDayTicketsDrawer(cellDate) {
  const thaiMonthsFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const thaiDaysFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  const d = cellDate.getDate(), m = cellDate.getMonth(), y = cellDate.getFullYear();
  tkDrawerOpenDate = cellDate;

  const titleEl = document.getElementById('drawer-day-tickets-title');
  if (titleEl) titleEl.textContent = `บัตรขออนุญาตวัน${thaiDaysFull[cellDate.getDay()]}ที่ ${d} ${thaiMonthsFull[m]} ${y + 543}`;

  const bodyEl = document.getElementById('drawer-day-tickets-body');
  if (!bodyEl) return;

  const activeTickets = tkTicketsOnDate(cellDate);
  const actionAttr = (fn, id) => `onclick="closeDayTicketsDrawer(); ${fn}('${id}');"`;
  // Nav actions (open profile / view request) go through a wrapper that remembers
  // this date so the destination can show a "back to this day's list" button.
  const navAttr = (fn, id) => {
    const wrapper = fn === 'viewStudentHistory' ? 'goToDayTicketProfile' : 'goToDayTicketRequestDetail';
    return `onclick="${wrapper}('${id}', ${y}, ${m}, ${d})"`;
  };
  bodyEl.innerHTML = activeTickets.length === 0
    ? `<div style="text-align:center; padding: 30px; color: var(--text-muted);">ไม่มีนักเรียนขออนุญาตในวันนี้</div>`
    : activeTickets.map(r => tkDayCardHTML(r, actionAttr, navAttr)).join('');

  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('drawer-day-tickets').classList.add('active');
}

function prevTkCalendarMonth() {
  const currDate = new Date(tkCalState.year, tkCalState.month, tkCalState.day || 15);
  if (tkCalState.mode === 'month') {
    tkCalState.month--;
    if (tkCalState.month < 0) { tkCalState.month = 11; tkCalState.year--; }
  } else {
    currDate.setDate(currDate.getDate() - (tkCalState.mode === 'week' ? 7 : 1));
    tkCalState.year = currDate.getFullYear();
    tkCalState.month = currDate.getMonth();
    tkCalState.day = currDate.getDate();
  }
  renderTicketCalendar();
}

function nextTkCalendarMonth() {
  const currDate = new Date(tkCalState.year, tkCalState.month, tkCalState.day || 15);
  if (tkCalState.mode === 'month') {
    tkCalState.month++;
    if (tkCalState.month > 11) { tkCalState.month = 0; tkCalState.year++; }
  } else {
    currDate.setDate(currDate.getDate() + (tkCalState.mode === 'week' ? 7 : 1));
    tkCalState.year = currDate.getFullYear();
    tkCalState.month = currDate.getMonth();
    tkCalState.day = currDate.getDate();
  }
  renderTicketCalendar();
}

function resetTkCalendarToday() {
  const today = new Date();
  tkCalState.year = today.getFullYear();
  tkCalState.month = today.getMonth();
  tkCalState.day = today.getDate();
  renderTicketCalendar();
}

document.getElementById('tk-calendar-prev-month-btn').addEventListener('click', prevTkCalendarMonth);
document.getElementById('tk-calendar-next-month-btn').addEventListener('click', nextTkCalendarMonth);
document.getElementById('tk-calendar-today-btn').addEventListener('click', resetTkCalendarToday);
document.querySelectorAll('#ticket-calendar-card .cal-mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('#ticket-calendar-card .cal-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tkCalState.mode = btn.getAttribute('data-mode');
    renderTicketCalendar();
  });
});

// โหลด xlsx ตอนกด export ครั้งแรก (ไม่ใส่ใน <head> แล้ว — ดู lazy-libs.js)
function withXlsx(run) {
  loadScriptOnce(LAZY_LIBS.xlsx).then(run).catch(() => alert('โหลดไลบรารี Excel ไม่สำเร็จ (ต้องเชื่อมต่ออินเทอร์เน็ต)'));
}

// ======================================================================
//  EXPORT EXCEL
// ======================================================================
function exportExcel(type) { withXlsx(() => _exportExcel(type)); }
function _exportExcel(type) {
  let headers, data, filename;
  if (type === 'summary') {
    headers = ['ชั้น','เข้าห้องเรียนช้า','ออกนอกห้องเรียน','ออกนอกบริเวณโรงเรียน','อนุญาตอื่น ๆ','ผปค.มารับ','รวม'];
    data = Object.entries(SUMMARY_DATA).map(([c,d]) => { const t=Object.values(d).reduce((a,b)=>a+b,0); return [c,d['เข้าห้องเรียนช้า'],d['ออกนอกห้องเรียน'],d['ออกนอกบริเวณโรงเรียน'],d['อนุญาตอื่น ๆ'],d['ผู้ปกครองมารับก่อนกำหนด'],t]; });
    filename = 'สรุปรวมการขออนุญาต.xlsx';
  } else if (type === 'tickets') {
    headers = ['รหัส','ชื่อ-สกุล','ชั้น','ประเภท','วันที่','ช่วงเวลา','เหตุผล','สถานะ'];
    data = HISTORY.map(r => [r.id, r.name, r.cls, r.type, thaiDate(r.date), r.time, r.reason, r.status]);
    filename = 'รายการบัตรขออนุญาตของนักเรียน.xlsx';
  } else if (type === 'attendance') {
    headers = ['วันที่','ชั้น/ห้อง','ชื่อ-นามสกุล','รหัสนักเรียน','สถานะการเข้าเรียน','เวลาเข้า','สถานะการเลิกเรียน','เวลาออก','บันทึกโดย','หมายเหตุ'];
    data = attReportRows.map(({ date, s, rec }) => [thaiDate(date), s.cls, studentFullName(s), s.id, rec.statusIn, rec.timeIn || '-', rec.statusOut || '-', rec.timeOut || '-', rec.recordedBy || '-', rec.note || '-']);
    filename = 'รายงานการมาเรียนของนักเรียน.xlsx';
  } else if (type === 'sl-requests') {
    headers = ['วันที่ยื่น','ชื่อนักเรียน','ชั้น','ประเภทการลา','วันที่เริ่มลา','วันที่สิ้นสุด','จำนวนวัน','เหตุผล','สถานะ'];
    data = STUDENT_LEAVE_REQUESTS.map(r => [thaiDate(r.submitDate), r.name, r.cls, r.type, thaiDate(r.startDate), thaiDate(r.endDate), r.days, r.reason, r.status]);
    filename = 'รายการคำขอลาของนักเรียน.xlsx';
  } else {
    // Export Employees list (rich details option)
    headers = ['#','รหัส','ชื่อ-สกุล','ประเภท','แผนก','ตำแหน่ง','สัญญา','เบอร์โทร','วุฒิ','เลขบัตรประชาชน','เพศ','วันเกิด'];
    data = EMPLOYEES.map((e,i) => [i+1,e.id,e.name,e.type,e.dept,e.pos,e.contract,e.phone,e.degree,e.cid,e.gender,e.dob]);
    filename = 'รายชื่อบุคลากรและอาจารย์.xlsx';
  }
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  ws['!cols'] = headers.map(() => ({ wch: 20 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ข้อมูล');
  XLSX.writeFile(wb, filename);
}

// Flattens every staff member's training/seminar history into one Excel report,
// filtered to the selected date range, with a school-letterhead-style header.
function exportTrainingReport() { withXlsx(() => _exportTrainingReport()); }
function _exportTrainingReport() {
  const startVal = document.getElementById('training-report-start').value;
  const endVal = document.getElementById('training-report-end').value;

  const rows = [];
  EMPLOYEES.forEach(e => {
    (e.trainings || []).forEach(t => {
      if (startVal && t.date < startVal) return;
      if (endVal && t.date > endVal) return;
      rows.push({ date: t.date, type: t.type || 'อบรม', staffCode: e.id, hours: t.hours || 0, course: t.name, topic: t.topic || t.name, location: t.org });
    });
  });
  rows.sort((a, b) => new Date(a.date) - new Date(b.date));

  const aoa = [
    [SCHOOL_INFO.name],
    ['รายงานการฝึกอบรมแยกตามรหัสบุคลากร'],
    [`เริ่มต้น:${thaiDate(startVal)} วันที่สิ้นสุด:${thaiDate(endVal)}`],
    ['ลำดับ', 'วันที่', 'ประเภท', 'รหัสบุคลากร', 'จำนวนชั่วโมง', 'หลักสูตร', 'เรื่อง', 'สถานที่อบรม'],
    ...rows.map((r, i) => [i + 1, thaiDate(r.date), r.type, r.staffCode, r.hours, r.course, r.topic, r.location])
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [6, 10, 10, 14, 12, 32, 36, 20].map(w => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'รายงานการฝึกอบรม');
  XLSX.writeFile(wb, 'รายงานการฝึกอบรม.xlsx');
}

// ======================================================================
//  STUDENT LEAVE SETTINGS LOGIC
// ======================================================================

let STUDENT_LEAVE_TYPES = [
  { name: 'ลาป่วย', desc: 'ลาหยุดเนื่องจากเจ็บป่วย ไข้หวัด อุบัติเหตุ', color: 'danger', quota: 15 },
  { name: 'ลากิจ', desc: 'ลาหยุดเพื่อทำธุระส่วนตัว หรือธุระจำเป็นของครอบครัว', color: 'warning', quota: 10 },
  { name: 'ลาอื่น ๆ', desc: 'ลาหยุดเนื่องจากกรณีพิเศษอื่น ๆ ที่จำเป็น', color: 'primary', quota: 5 }
];

// ======================================================================
//  ประวัติการตั้งค่าการลาเรียน (SETTINGS_VERSIONS)
//  เก็บ snapshot ของ "ประเภทการลา/โควตา" (STUDENT_LEAVE_TYPES) แต่ละครั้งที่บันทึก
//  พร้อมวันที่มีผลบังคับใช้ — รองรับทั้งดูย้อนหลัง (past/active) และตั้งค่าล่วงหน้า (scheduled)
// ======================================================================
let SETTINGS_VERSIONS = [
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
    leaveTypes: JSON.parse(JSON.stringify(STUDENT_LEAVE_TYPES))
  }
];


// อ่านประวัติการตั้งค่าที่ settings/leave.html#tab=student บันทึกไว้ (localStorage) — ถ้าไม่มี/พังใช้ค่าเริ่มต้นด้านบน
try {
  const v = JSON.parse(localStorage.getItem('sd_student_leave_versions'));
  if (Array.isArray(v) && v.length) {
    SETTINGS_VERSIONS = v;
    const act = v.find(x => x.status === 'active');
    if (act) STUDENT_LEAVE_TYPES = JSON.parse(JSON.stringify(act.leaveTypes));
  }
} catch (e) {}

window.showModuleView = showModuleView;


// ======================================================================
//  การมาเรียนของนักเรียน — เช็คชื่อ / รายงาน / ตั้งค่าเวลาเข้า-เลิกเรียน
//  ยังไม่มีเครื่องสแกน: ข้อมูลมาจาก (1) ครูเช็คชื่อ (2) ใบลาที่อนุมัติแล้ว (3) บัตรขออนุญาต
//  ออกนอกโรงเรียน/ผู้ปกครองมารับ — source 'scan'/'import' เผื่อไว้สำหรับเครื่องสแกนในอนาคต
//  ที่เก็บ: localStorage sd_student_attendance (เฉพาะที่ครูบันทึก) และ
//           sd_student_attendance_settings (เวลาเข้า-เลิกเรียน) — วันที่ผ่านมาแล้วที่ครูยังไม่ได้
//  บันทึกจะใช้ข้อมูลตัวอย่างที่สุ่มแบบ deterministic (ดู attMockRecord) เพื่อให้รายงานมีข้อมูลดู
// ======================================================================
const ATT_SETTINGS_KEY = 'sd_student_attendance_settings';
const ATT_RECORDS_KEY = 'sd_student_attendance';
const ATT_DEFAULT_SETTINGS = { start: '08:00', end: '16:30', absentAfter: '10:00', gateOpen: '06:30', lateMin: 0, earlyMin: 0, days: [1, 2, 3, 4, 5] };
const ATT_EXIT_TICKET_TYPES = ['ออกนอกบริเวณโรงเรียน', 'ผู้ปกครองมารับก่อนกำหนด'];
const ATT_DAY_LABELS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const ATT_SOURCE_NOTE = { teacher: 'เช็คชื่อโดยครู', scan: 'สแกนด้วยบัตร', import: 'นำเข้าจากไฟล์', leave: 'อ้างอิงใบลา' };
const ATT_REPORT_PAGE_SIZE = 50;
const ATT_REPORT_MAX_DAYS = 62;

let attSettings = attLoad(ATT_SETTINGS_KEY, null) || { ...ATT_DEFAULT_SETTINGS };
let attRecords = attLoad(ATT_RECORDS_KEY, {}) || {};
let attCheckDraft = {};
let attCheckFilter = 'all';
let attReportFilter = 'all';
let attReportPage = 1;
let attReportRows = [];

function attLoad(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
function attStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function attToast(message) {
  let box = document.getElementById('toast-container');
  if (!box) { box = document.createElement('div'); box.id = 'toast-container'; document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = 'toast toast-success';
  t.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span></span>';
  t.querySelector('span').textContent = message;
  box.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ---- วันที่ / เวลา ----
function attToday() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function attAddDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
}
function attWeekday(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}
function attIsSchoolDay(dateStr) { return attSettings.days.includes(attWeekday(dateStr)); }
function attMin(t) { if (!t || t === '-') return null; const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function attHHMM(mins) { return String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0'); }

// ---- คำนวณสถานะจากเวลา ตามหน้าตั้งค่า ----
function attStatusInFromTime(timeIn) {
  const t = attMin(timeIn);
  if (t === null) return 'ตรงเวลา';
  if (t > attMin(attSettings.absentAfter)) return 'ขาด';
  if (t > attMin(attSettings.start) + Number(attSettings.lateMin || 0)) return 'สาย';
  return 'ตรงเวลา';
}
function attStatusOutFromTime(timeOut) {
  const t = attMin(timeOut);
  if (t === null) return 'ตรงเวลา';
  return t < attMin(attSettings.end) - Number(attSettings.earlyMin || 0) ? 'ออกก่อนเวลา' : 'ตรงเวลา';
}
// หมวดของสถานะเข้า ใช้กับ badge / KPI / ชิปกรอง
function attCategory(statusIn) {
  if (statusIn === 'ตรงเวลา') return 'ontime';
  if (statusIn === 'สาย') return 'late';
  if (statusIn === 'ขาด') return 'absent';
  if (statusIn === 'ยังไม่เช็คชื่อ') return 'none';
  return 'leave'; // ลาป่วย / ลากิจ / ประเภทการลาอื่นจาก STUDENT_LEAVE_TYPES
}
function attBadgeIn(statusIn) {
  const cls = { ontime: 'success', late: 'warning', absent: 'danger', leave: 'info', none: 'muted' }[attCategory(statusIn)];
  return `<span class="badge ${cls}">${statusIn}</span>`;
}
function attBadgeOut(statusOut) {
  if (!statusOut || statusOut === '-') return '<span style="color:var(--text-muted);">-</span>';
  const cls = statusOut === 'ตรงเวลา' ? 'success' : statusOut === 'ออกก่อนเวลา' ? 'warning' : 'muted';
  return `<span class="badge ${cls}">${statusOut}</span>`;
}

// ดัชนีชั่วคราวสำหรับรอบคำนวณใหญ่ (sdCompute / รายงานการมาเรียน) ที่เรียก getAttendance() หลายพันครั้ง
// — เดิมแต่ละครั้ง .find() ไล่ทั้งใบลา/ประวัติบัตร ตอนนี้สร้าง Map ครั้งเดียวต่อรอบ แล้วทิ้งเมื่อจบรอบ
// (ไม่ cache ข้ามรอบ จึงไม่มีข้อมูลค้างเก่า) ผลลัพธ์เท่าเดิมทุกประการ (คืนรายการแรกที่ตรงเหมือน .find)
let attIdx = null;
function attWithIndex(fn) {
  if (attIdx) return fn();
  const idx = { leave: new Map(), exit: new Map(), room: new Map() };
  STUDENT_LEAVE_REQUESTS.forEach(r => {
    if (r.status !== 'อนุมัติ') return;
    if (!idx.leave.has(r.studentId)) idx.leave.set(r.studentId, []);
    idx.leave.get(r.studentId).push(r);
  });
  HISTORY.forEach(h => {
    if (h.status !== 'อนุมัติ' || !ATT_EXIT_TICKET_TYPES.includes(h.type)) return;
    const k = h.id + '|' + h.date;
    if (!idx.exit.has(k)) idx.exit.set(k, h);
  });
  attIdx = idx;
  try { return fn(); } finally { attIdx = null; }
}

function homeroomTeacherName(cls) {
  if (attIdx && attIdx.room.has(cls)) return attIdx.room.get(cls);
  const t = (typeof EMPLOYEES !== 'undefined' ? EMPLOYEES : []).find(e => (e.pos || '').includes('ครูประจำชั้น ' + cls));
  const name = t ? t.name : 'ครูประจำชั้น ' + cls;
  if (attIdx) attIdx.room.set(cls, name);
  return name;
}
function attApprovedLeave(studentId, dateStr) {
  if (attIdx) return (attIdx.leave.get(studentId) || []).find(r => r.startDate <= dateStr && dateStr <= r.endDate);
  return STUDENT_LEAVE_REQUESTS.find(r => r.studentId === studentId && r.status === 'อนุมัติ' && r.startDate <= dateStr && dateStr <= r.endDate);
}
function attExitTicket(studentId, dateStr) {
  if (attIdx) return attIdx.exit.get(studentId + '|' + dateStr);
  return HISTORY.find(h => h.id === studentId && h.date === dateStr && h.status === 'อนุมัติ' && ATT_EXIT_TICKET_TYPES.includes(h.type));
}

// ข้อมูลตัวอย่างของวันที่ผ่านมาแล้ว (เหมือนครูเช็คชื่อไว้): ส่วนใหญ่มาตรงเวลา (ไม่มีเวลาจริง),
// บางคนสาย (มีเวลามาถึง → สถานะคิดจากหน้าตั้งค่า), ขาดบ้าง, กลับก่อนบ้าง
function attMockRecord(s, dateStr) {
  const rand = seededRandom('att|' + s.id + '|' + dateStr);
  const r = rand();
  const rec = { statusIn: 'ตรงเวลา', timeIn: '-', statusOut: 'ตรงเวลา', timeOut: '-', note: '', source: 'teacher', recordedBy: homeroomTeacherName(s.cls) };
  if (r < 0.035) {
    rec.statusIn = 'ขาด'; rec.statusOut = '-';
    rec.note = rand() < 0.5 ? 'ไม่ได้แจ้ง' : 'ผู้ปกครองโทรแจ้ง ไม่สบาย';
  } else if (r < 0.11) {
    rec.timeIn = attHHMM(attMin(attSettings.start) - 10 + Math.floor(rand() * 55));
    rec.statusIn = attStatusInFromTime(rec.timeIn);
    const lateReason = ['รถติด', 'ตื่นสาย', 'ฝนตก', 'ไปทำธุระกับผู้ปกครอง'][Math.floor(rand() * 4)];
    if (rec.statusIn === 'สาย') rec.note = lateReason; // ถึงก่อนเกณฑ์สาย (ตามหน้าตั้งค่า) → ไม่ต้องมีเหตุผล
  }
  if (rec.statusIn !== 'ขาด' && rand() < 0.025) {
    rec.timeOut = attHHMM(attMin(attSettings.end) - 30 - Math.floor(rand() * 150));
    rec.statusOut = attStatusOutFromTime(rec.timeOut);
    rec.note = (rec.note ? rec.note + ', ' : '') + 'ผู้ปกครองมารับ';
  }
  return rec;
}

// สถานะการมาเรียนที่ใช้แสดงจริงของนักเรียน 1 คนใน 1 วัน (ลำดับความสำคัญ: ใบลาที่อนุมัติ →
// ที่ครูบันทึก → ข้อมูลตัวอย่างของวันที่ผ่านมาแล้ว → "ยังไม่เช็คชื่อ") แล้วเติมบัตรขออนุญาตออก
// นอกโรงเรียนลงช่องเลิกเรียนถ้ายังเป็น "ตรงเวลา" อยู่
function getAttendance(s, dateStr) {
  const leave = attApprovedLeave(s.id, dateStr);
  if (leave) {
    return { statusIn: leave.type, timeIn: '-', statusOut: '-', timeOut: '-', source: 'leave', locked: true, reqId: leave.id,
             recordedBy: 'ระบบ (ใบลา)', note: 'ใบลา ' + leave.id + (leave.reason ? ' — ' + leave.reason : '') };
  }
  let rec = attRecords[dateStr + '|' + s.id];
  if (rec) rec = { ...rec };
  else if (dateStr < attToday()) rec = attMockRecord(s, dateStr);
  else rec = { statusIn: 'ยังไม่เช็คชื่อ', timeIn: '-', statusOut: '-', timeOut: '-', note: '', source: '', recordedBy: '' };

  const ticket = attExitTicket(s.id, dateStr);
  if (ticket && rec.statusOut === 'ตรงเวลา' && rec.statusIn !== 'ขาด') {
    rec.statusOut = 'ออกก่อนเวลา';
    rec.timeOut = (ticket.time || '').split('-')[0] || '-';
    rec.note = (rec.note ? rec.note + ', ' : '') + 'บัตรขออนุญาต: ' + ticket.type;
  }
  if (!rec.note && rec.source) rec.note = ATT_SOURCE_NOTE[rec.source] || '';
  return rec;
}

function attRoomsOfGrade(grade) {
  return [...new Set(STUDENTS.filter(s => !grade || s.cls.split('/')[0] === grade).map(s => s.cls.split('/')[1]))]
    .sort((a, b) => Number(a) - Number(b));
}
function attStudentsOf(grade, room) {
  return STUDENTS.filter(s => studentMatchesGradeRoom(s.cls, grade, room))
    .sort((a, b) => a.cls.localeCompare(b.cls, 'th', { numeric: true }) || a.no - b.no);
}

// ======================================================================
//  เช็คชื่อนักเรียน
// ======================================================================
function renderAttendanceCheckView() {
  const gradeSel = document.getElementById('att-check-grade');
  const dateInp = document.getElementById('att-check-date');
  if (!gradeSel.options.length) {
    const grades = studentGradeOptions();
    gradeSel.innerHTML = grades.map(g => `<option value="${g}">${g}</option>`).join('');
    onAttCheckGradeChange(true);
  }
  if (!dateInp.value) dateInp.value = attToday();
  dateInp.max = attToday();
  renderAttendanceCheck();
}
function onAttCheckGradeChange(silent) {
  const grade = document.getElementById('att-check-grade').value;
  const roomSel = document.getElementById('att-check-room');
  roomSel.innerHTML = attRoomsOfGrade(grade).map(r => `<option value="${r}">ห้อง ${r}</option>`).join('');
  if (!silent) renderAttendanceCheck();
}

function renderAttendanceCheck() {
  const grade = document.getElementById('att-check-grade').value;
  const room = document.getElementById('att-check-room').value;
  let dateStr = document.getElementById('att-check-date').value || attToday();
  if (dateStr > attToday()) { dateStr = attToday(); document.getElementById('att-check-date').value = dateStr; }
  const tbody = document.getElementById('att-check-tbody');
  const hint = document.getElementById('att-check-hint');
  const savedNote = document.getElementById('att-check-saved-note');
  hint.textContent = `เข้าเรียน ${attSettings.start} น. · สายหลัง ${attHHMM(attMin(attSettings.start) + Number(attSettings.lateMin || 0))} น. · เลิกเรียน ${attSettings.end} น.`;

  if (!attIsSchoolDay(dateStr)) {
    attCheckDraft = {};
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted);">วันที่เลือกไม่ใช่วันเรียน (ตั้งค่าวันเรียนได้ที่ "เวลาเข้า-เลิกเรียนของนักเรียน")</td></tr>`;
    document.getElementById('att-check-summary').innerHTML = '';
    savedNote.textContent = '';
    return;
  }

  const list = attStudentsOf(grade, room);
  attCheckDraft = {};
  let lastSaved = null;
  list.forEach(s => {
    const rec = getAttendance(s, dateStr);
    const saved = attRecords[dateStr + '|' + s.id];
    if (saved && (!lastSaved || saved.savedAt > lastSaved.savedAt)) lastSaved = saved;
    attCheckDraft[s.id] = rec.locked ? { ...rec } : {
      statusIn: rec.statusIn === 'ยังไม่เช็คชื่อ' ? 'ตรงเวลา' : rec.statusIn,
      timeIn: rec.timeIn, statusOut: rec.statusIn === 'ยังไม่เช็คชื่อ' ? 'ตรงเวลา' : rec.statusOut,
      timeOut: rec.timeOut, note: saved ? (saved.note || '') : (rec.source === 'teacher' ? '' : rec.note)
    };
    // บัตรขออนุญาตออกนอกโรงเรียนของวันนี้ → ตั้ง "ออกก่อนเวลา" ให้เลย
    if (!rec.locked && !saved) {
      const ticket = attExitTicket(s.id, dateStr);
      if (ticket && attCheckDraft[s.id].statusIn !== 'ขาด') {
        attCheckDraft[s.id].statusOut = 'ออกก่อนเวลา';
        attCheckDraft[s.id].timeOut = (ticket.time || '').split('-')[0] || '-';
        attCheckDraft[s.id].note = 'บัตรขออนุญาต: ' + ticket.type;
      }
    }
  });
  savedNote.textContent = lastSaved
    ? `บันทึกล่าสุดโดย ${lastSaved.recordedBy} · ${new Date(lastSaved.savedAt).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}`
    : (dateStr < attToday() ? 'ข้อมูลตัวอย่าง (ยังไม่มีการบันทึกจริง)' : 'ยังไม่ได้เช็คชื่อ');

  renderAttendanceCheckRows();
  renderAttendanceCheckSummary();
}

function attCheckMatchesFilter(d) {
  if (attCheckFilter === 'all') return true;
  if (attCheckFilter === 'early') return d.statusOut === 'ออกก่อนเวลา';
  return attCategory(d.statusIn) === attCheckFilter;
}

function attCheckRoomList() {
  const grade = document.getElementById('att-check-grade').value;
  const room = document.getElementById('att-check-room').value;
  return attStudentsOf(grade, room).filter(s => attCheckDraft[s.id]);
}

function attCheckFilteredList() {
  return attCheckRoomList().filter(s => attCheckMatchesFilter(attCheckDraft[s.id]));
}

function renderAttendanceCheckRows() {
  const full = attCheckRoomList();
  const visible = attCheckFilteredList();
  const emptyMsg = full.length === 0 ? 'ไม่มีนักเรียนในห้องนี้' : 'ไม่มีนักเรียนตรงกับตัวกรองที่เลือก';
  document.getElementById('att-check-tbody').innerHTML = visible.map(s => attCheckRowHTML(s)).join('') ||
    `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted);">${emptyMsg}</td></tr>`;
}

function setAttCheckFilter(f) {
  attCheckFilter = f;
  renderAttendanceCheckRows();
  renderAttendanceCheckSummary();
}

function attCheckRowHTML(s) {
  const d = attCheckDraft[s.id];
  if (d.locked) {
    const noteHtml = d.reqId
      ? `<a href="#" class="note-leave-link"" onclick="viewSLRequestDetails('${d.reqId}');return false;" title="ดูรายละเอียดใบลา">${d.note}</a>`
      : d.note;
    return `<tr class="att-row-locked">
      <td style="text-align:center;">${s.no}</td><td>${s.id}</td><td><strong>${studentFullName(s)}</strong></td>
      <td>${attBadgeIn(d.statusIn)}</td><td>-</td><td>-</td><td>-</td>
      <td style="color:var(--text-muted);font-size:12px;">${noteHtml}</td></tr>`;
  }
  const seg = ['ตรงเวลา', 'สาย', 'ขาด'].map(v =>
    `<button type="button" class="att-seg-btn ${d.statusIn === v ? 'on ' + attCategory(v) : ''}" onclick="setAttDraft('${s.id}','statusIn','${v}')">${v === 'ตรงเวลา' ? 'มา' : v}</button>`).join('');
  const absent = d.statusIn === 'ขาด';
  const early = d.statusOut === 'ออกก่อนเวลา';
  return `<tr>
    <td style="text-align:center;">${s.no}</td><td>${s.id}</td><td><strong>${studentFullName(s)}</strong></td>
    <td><div class="att-seg">${seg}</div></td>
    <td><input type="time" class="glass-input att-time" value="${d.timeIn !== '-' ? d.timeIn : ''}" ${d.statusIn === 'สาย' ? '' : 'disabled'} onchange="setAttDraft('${s.id}','timeIn',this.value)"></td>
    <td>${absent ? '<select class="glass-select att-out" disabled><option>-</option></select>' : `<select class="glass-select att-out" onchange="setAttDraft('${s.id}','statusOut',this.value)">
      <option value="ตรงเวลา" ${!early ? 'selected' : ''}>ตรงเวลา</option>
      <option value="ออกก่อนเวลา" ${early ? 'selected' : ''}>ออกก่อนเวลา</option></select>`}</td>
    <td><input type="time" class="glass-input att-time" value="${d.timeOut !== '-' ? d.timeOut : ''}" ${early && !absent ? '' : 'disabled'} onchange="setAttDraft('${s.id}','timeOut',this.value)"></td>
    <td><input class="glass-input att-note" value="${(d.note || '').replace(/"/g, '&quot;')}" placeholder="-" oninput="setAttDraft('${s.id}','note',this.value,true)"></td>
  </tr>`;
}

function setAttDraft(id, field, value, noRerender) {
  const d = attCheckDraft[id];
  if (!d || d.locked) return;
  d[field] = value || (field === 'note' ? '' : '-');
  if (field === 'statusIn') {
    if (value !== 'สาย') d.timeIn = '-';
    if (value === 'ขาด') { d.statusOut = '-'; d.timeOut = '-'; }
    else if (d.statusOut === '-') d.statusOut = 'ตรงเวลา';
  }
  if (field === 'statusOut' && value !== 'ออกก่อนเวลา') d.timeOut = '-';
  if (noRerender) return;
  renderAttendanceCheckRows();
  renderAttendanceCheckSummary();
}

function attCheckAllPresent() {
  Object.values(attCheckDraft).forEach(d => {
    if (d.locked) return;
    d.statusIn = 'ตรงเวลา'; d.timeIn = '-'; d.statusOut = 'ตรงเวลา'; d.timeOut = '-';
  });
  renderAttendanceCheckRows();
  renderAttendanceCheckSummary();
}

function renderAttendanceCheckSummary() {
  const c = { ontime: 0, late: 0, absent: 0, leave: 0, early: 0 };
  const all = Object.values(attCheckDraft);
  all.forEach(d => { c[attCategory(d.statusIn)] = (c[attCategory(d.statusIn)] || 0) + 1; if (d.statusOut === 'ออกก่อนเวลา') c.early++; });
  const kpis = [
    ['ontime', 'มา', c.ontime, 'success'], ['late', 'สาย', c.late, 'warning'],
    ['absent', 'ขาด', c.absent, 'danger'], ['leave', 'ลา', c.leave, 'info'],
    ['early', 'ออกก่อนเวลา', c.early, 'warning']
  ];
  document.getElementById('att-check-summary').innerHTML =
    `<button type="button" class="badge muted att-filter-btn ${attCheckFilter === 'all' ? 'on' : ''}" onclick="setAttCheckFilter('all')">ทั้งหมด <strong>${all.length}</strong> คน</button>` +
    kpis.map(([k, label, v, cls]) =>
      `<button type="button" class="badge ${cls} att-filter-btn ${attCheckFilter === k ? 'on' : ''}" onclick="setAttCheckFilter('${k}')">${label} ${v}</button>`).join('');
}

function saveAttendanceCheck() {
  const dateStr = document.getElementById('att-check-date').value || attToday();
  if (!attIsSchoolDay(dateStr)) return;
  const now = Date.now();
  let n = 0;
  Object.entries(attCheckDraft).forEach(([id, d]) => {
    if (d.locked) return;
    attRecords[dateStr + '|' + id] = {
      statusIn: d.statusIn, timeIn: d.statusIn === 'สาย' ? (d.timeIn || '-') : '-',
      statusOut: d.statusIn === 'ขาด' ? '-' : d.statusOut, timeOut: d.statusOut === 'ออกก่อนเวลา' ? (d.timeOut || '-') : '-',
      note: (d.note || '').trim(), source: 'teacher', recordedBy: CURRENT_APPROVER_NAME, savedAt: now
    };
    n++;
  });
  attStore(ATT_RECORDS_KEY, attRecords);
  renderAttendanceCheck();
  const room = document.getElementById('att-check-grade').value + '/' + document.getElementById('att-check-room').value;
  attToast(`บันทึกการเช็คชื่อ ${room} วันที่ ${thaiDate(dateStr)} แล้ว (${n} คน)`);
}

// ======================================================================
//  รายงานการมาเรียน
// ======================================================================
function renderAttendanceReportView() {
  const gradeSel = document.getElementById('att-rep-grade');
  if (!gradeSel.options.length) {
    gradeSel.innerHTML = '<option value="">ทุกระดับชั้น</option>' + studentGradeOptions().map(g => `<option value="${g}">${g}</option>`).join('');
    onAttRepGradeChange(true);
    const today = attToday();
    document.getElementById('att-rep-from').value = today;
    document.getElementById('att-rep-to').value = today;
  }
  document.getElementById('att-rep-from').max = attToday();
  document.getElementById('att-rep-to').max = attToday();
  renderAttendanceReport();
}
function onAttRepGradeChange(silent) {
  const grade = document.getElementById('att-rep-grade').value;
  const roomSel = document.getElementById('att-rep-room');
  roomSel.innerHTML = '<option value="">ทุกห้อง</option>' + attRoomsOfGrade(grade).map(r => `<option value="${r}">ห้อง ${r}</option>`).join('');
  attReportPage = 1;
  if (!silent) renderAttendanceReport();
}
function setAttReportFilter(f) { attReportFilter = f; attReportPage = 1; renderAttendanceReport(); }
function setAttReportPage(p) { attReportPage = p; renderAttendanceReport(); }

function renderAttendanceReport() {
  const grade = document.getElementById('att-rep-grade').value;
  const room = document.getElementById('att-rep-room').value;
  const q = document.getElementById('att-rep-search').value.trim().toLowerCase();
  const today = attToday();
  let from = document.getElementById('att-rep-from').value || today;
  let to = document.getElementById('att-rep-to').value || today;
  if (to > today) to = today;
  if (from > to) [from, to] = [to, from];
  let capped = false;
  if (attAddDays(from, ATT_REPORT_MAX_DAYS - 1) < to) { from = attAddDays(to, -(ATT_REPORT_MAX_DAYS - 1)); capped = true; }

  const students = attStudentsOf(grade, room).filter(s =>
    !q || s.name.toLowerCase().includes(q) || studentFullName(s).toLowerCase().includes(q) || s.id.toLowerCase().includes(q));

  const rows = [];
  attWithIndex(() => {
    for (let d = to; d >= from; d = attAddDays(d, -1)) {
      if (!attIsSchoolDay(d)) continue;
      students.forEach(s => rows.push({ date: d, s, rec: getAttendance(s, d) }));
    }
  });

  // KPI (นับทุกแถวตามตัวกรองชั้น/ห้อง/วันที่/ชื่อ ยังไม่กรองสถานะ)
  const c = { all: rows.length, ontime: 0, late: 0, absent: 0, leave: 0, none: 0, early: 0 };
  rows.forEach(r => { c[attCategory(r.rec.statusIn)]++; if (r.rec.statusOut === 'ออกก่อนเวลา') c.early++; });
  const kpis = [
    ['ontime', 'มาตรงเวลา', c.ontime, 'success'], ['late', 'มาสาย', c.late, 'warning'],
    ['absent', 'ขาดเรียน', c.absent, 'danger'], ['leave', 'ลา', c.leave, 'info'],
    ['early', 'ออกก่อนเวลา', c.early, 'warning'], ['none', 'ยังไม่เช็คชื่อ', c.none, 'muted']
  ];
  document.getElementById('att-report-kpis').innerHTML =
    `<button type="button" class="badge muted att-filter-btn ${attReportFilter === 'all' ? 'on' : ''}" onclick="setAttReportFilter('all')">ทั้งหมด <strong>${c.all.toLocaleString('th-TH')}</strong> รายการ</button>` +
    kpis.map(([k, label, v, cls]) =>
      `<button type="button" class="badge ${cls} att-filter-btn ${attReportFilter === k ? 'on' : ''}" onclick="setAttReportFilter('${k}')">${label} ${v.toLocaleString('th-TH')}</button>`).join('') +
    (capped ? `<span class="att-time-hint">แสดงสูงสุด ${ATT_REPORT_MAX_DAYS} วันย้อนหลังจากวันที่สิ้นสุด</span>` : '');

  attReportRows = rows.filter(r => attReportFilter === 'all' ||
    (attReportFilter === 'early' ? r.rec.statusOut === 'ออกก่อนเวลา' : attCategory(r.rec.statusIn) === attReportFilter));

  const pages = Math.max(1, Math.ceil(attReportRows.length / ATT_REPORT_PAGE_SIZE));
  if (attReportPage > pages) attReportPage = pages;
  const pageRows = attReportRows.slice((attReportPage - 1) * ATT_REPORT_PAGE_SIZE, attReportPage * ATT_REPORT_PAGE_SIZE);
  document.getElementById('att-rep-tbody').innerHTML = pageRows.map(({ date, s, rec }) => {
    const noteHtml = rec.reqId
      ? `<a href="#" class="note-leave-link" onclick="viewSLRequestDetails('${rec.reqId}');return false;" title="ดูรายละเอียดใบลา">${rec.note}</a>`
      : (rec.note || '-');
    return `<tr>
      <td>${thaiDate(date)}</td><td>${s.cls}</td><td><strong>${studentFullName(s)}</strong></td><td>${s.id}</td>
      <td>${attBadgeIn(rec.statusIn)}</td><td>${rec.timeIn || '-'}</td>
      <td>${attBadgeOut(rec.statusOut)}</td><td>${rec.timeOut || '-'}</td>
      <td>${rec.recordedBy || '-'}</td><td style="color:var(--text-muted);font-size:12px;">${noteHtml}</td></tr>`;
  }).join('') ||
    `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--text-muted);">ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา</td></tr>`;

  const pager = document.getElementById('att-rep-pager');
  if (pages <= 1) { pager.innerHTML = attReportRows.length ? `<span>${attReportRows.length} รายการ</span>` : ''; return; }
  const btn = (p, label, dis) => `<button class="btn btn-secondary btn-sm" ${dis ? 'disabled' : ''} onclick="setAttReportPage(${p})">${label}</button>`;
  pager.innerHTML = `<span>${attReportRows.length.toLocaleString('th-TH')} รายการ · หน้า ${attReportPage}/${pages}</span>` +
    btn(1, '«', attReportPage === 1) + btn(attReportPage - 1, '‹ ก่อนหน้า', attReportPage === 1) +
    btn(attReportPage + 1, 'ถัดไป ›', attReportPage === pages) + btn(pages, '»', attReportPage === pages);
}

// ======================================================================
//  แดชบอร์ดการมาเรียนของนักเรียน (view-student-dashboard)
//  สรุปมาตรงเวลา/สาย/ขาด/ลา/ออกก่อนเวลา/ยังไม่เช็คชื่อ + บัตรขออนุญาต ตามช่วงเวลาและชั้นเรียน
//  ไม่มีข้อมูลของตัวเอง: คำนวณสดจาก getAttendance() (ใบลาที่อนุมัติ → ที่ครูบันทึก → ข้อมูล
//  ตัวอย่าง) ทีละคนทีละวันเรียน และนับบัตรจาก HISTORY (ไม่นับบัตร "ไม่อนุมัติ")
//  หน่วยนับ "คน-วัน" = นักเรียน 1 คนใน 1 วันเรียน, % มาเรียน = (ตรงเวลา + สาย) ÷ วันที่เช็คชื่อแล้ว
//  ช่วงเวลา (sdPeriod) เป็นหน่วย วัน/สัปดาห์/เดือน/ภาคเรียน/กำหนดเอง — ปุ่ม ‹ › เลื่อนทีละหน่วย และ
//  "ช่วงก่อนหน้า" ที่ใช้เทียบก็คือช่วงที่ได้จากการกด ‹ หนึ่งครั้ง ภาคเรียนอ่านจาก SchoolStore
//  ('school_academic_years' ของ settings/school.html) เก็บเฉพาะตัวกรองล่าสุดใน localStorage
//  sd_student_dashboard_filters
// ======================================================================
const SD_FILTER_KEY = 'sd_student_dashboard_filters';
const SD_MAX_DAYS = 200;
const SD_PAGE_SIZE = 50;
// เกณฑ์ "กลุ่มเฝ้าระวัง": % มาเรียนต่ำกว่า rate (เมื่อเช็คชื่อแล้วอย่างน้อย minChecked วัน),
// ขาดติดกันตั้งแต่ streak วันเรียน, หรือใช้บัตรขออนุญาตตั้งแต่ tickets ใบในช่วงที่เลือก
const SD_RISK = { rate: 80, minChecked: 5, streak: 3, tickets: 3 };
// สีของแต่ละสถานะ (แท่งสัดส่วน, กราฟแท่งแยกห้อง, กราฟเส้น "แยกสถานะ") — ลำดับ ตรงเวลา → ลา → สาย
// → ขาด ไม่วาง เขียว↔ส้ม ติดกัน เพราะคนตาบอดสีแดง-เขียวแยกคู่นี้ไม่ออก; early ใช้ aqua แยกจากชุดสี
// badge เดิม — ชุดสีเส้นตรวจด้วย validate_palette (--pairs all) แล้ว
const SD_CATS = [
  { key: 'ontime', label: 'มาตรงเวลา', color: '--success' },
  { key: 'leave', label: 'ลา', color: '--info' },
  { key: 'late', label: 'มาสาย', color: '--warning' },
  { key: 'absent', label: 'ขาดเรียน', color: '--danger' },
  { key: 'none', label: 'ยังไม่เช็คชื่อ', color: '--text-muted' }
];
const SD_LINE_COLORS = { late: '#c47f08', absent: '#d5203e', leave: '#0b8fc1', early: '#1baf7a', tickets: '#5336e2', none: '#7b899d' };
// สีประจำห้อง (โหมด "เทียบห้อง") — ผูกกับห้อง ไม่ใช่ลำดับที่แสดง: ห้องเดิมได้สีเดิมเสมอแม้เปลี่ยนตัวกรอง
const SD_ROOM_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
const SD_SUM_KEYS = ['ontime', 'late', 'absent', 'leave', 'none', 'early', 'tickets', 'lastNone'];
const SD_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const SD_PRESETS = [
  { id: 'today', label: 'วันนี้' }, { id: 'yesterday', label: 'เมื่อวาน' },
  { id: 'week', label: 'สัปดาห์นี้' }, { id: 'lastweek', label: 'สัปดาห์ที่แล้ว' },
  { id: 'month', label: 'เดือนนี้' }, { id: 'lastmonth', label: 'เดือนที่แล้ว' },
  { id: 'term', label: 'ภาคเรียนนี้' }, { id: 'custom', label: 'กำหนดเอง…' }
];
// ชิปกรองในแท็บรายบุคคล — นับเป็น "จำนวนนักเรียนที่มีสถานะนั้นอย่างน้อย 1 วัน"
const SD_PEOPLE_CHIPS = [
  { key: 'late', label: 'มาสาย', cls: 'warning' }, { key: 'absent', label: 'ขาดเรียน', cls: 'danger' },
  { key: 'leave', label: 'ลา', cls: 'info' }, { key: 'early', label: 'ออกก่อนเวลา', cls: 'warning' },
  { key: 'tickets', label: 'ใช้บัตรขออนุญาต', cls: 'info' }, { key: 'none', label: 'ยังไม่เช็คชื่อ', cls: 'muted' },
  { key: 'risk', label: 'กลุ่มเฝ้าระวัง', cls: 'danger' }
];

let sdPeriod = null;     // { unit: 'day'|'week'|'month'|'term'|'custom', from, to } — ช่วงเต็ม (to อาจเลยวันนี้)
let sdState = { tab: 'sd-rooms', status: 'all', sortKey: 'cls', sortDir: 1, page: 1, trend: 'rate' };
let sdData = null;       // ผลคำนวณล่าสุด — ใช้ร่วมกันทั้งภาพรวม กราฟ ตาราง และ Export
let sdPrev = null;       // ผลคำนวณของช่วงก่อนหน้า (ใช้เทียบ)
const sdCharts = {};
const sdChartToken = {};

const sdNum = n => Number(n || 0).toLocaleString('th-TH');
const sdPct = v => v === null ? '-' : v.toFixed(1) + '%';
function sdShortDate(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return d + ' ' + SD_MONTHS_SHORT[m - 1];
}
function sdYMD(dt) { return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); }
function sdDaysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number), [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}
// "1–27 ก.ย. 2569" / "28 ก.ย. – 4 ต.ค. 2569" / "28 ธ.ค. 2569 – 3 ม.ค. 2570"
function sdRangeText(from, to) {
  const [y1, m1, d1] = from.split('-').map(Number), [y2, m2, d2] = to.split('-').map(Number);
  if (from === to) return `${d1} ${SD_MONTHS_SHORT[m1 - 1]} ${y1 + 543}`;
  if (y1 === y2 && m1 === m2) return `${d1}–${d2} ${SD_MONTHS_SHORT[m1 - 1]} ${y1 + 543}`;
  if (y1 === y2) return `${d1} ${SD_MONTHS_SHORT[m1 - 1]} – ${d2} ${SD_MONTHS_SHORT[m2 - 1]} ${y1 + 543}`;
  return `${d1} ${SD_MONTHS_SHORT[m1 - 1]} ${y1 + 543} – ${d2} ${SD_MONTHS_SHORT[m2 - 1]} ${y2 + 543}`;
}

// ---- ช่วงเวลา ----
function sdDayPeriod(d) { return { unit: 'day', from: d, to: d }; }
function sdWeekPeriod(d) { const mon = attAddDays(d, -((attWeekday(d) + 6) % 7)); return { unit: 'week', from: mon, to: attAddDays(mon, 6) }; }
function sdMonthPeriod(d) {
  const [y, m] = d.split('-').map(Number);
  return { unit: 'month', from: sdYMD(new Date(y, m - 1, 1)), to: sdYMD(new Date(y, m, 0)) };
}
function sdMonthShift(d, n) { const [y, m] = d.split('-').map(Number); return sdYMD(new Date(y, m - 1 + n, 1)); }
// ภาคเรียนทั้งหมดจากหน้าตั้งค่าโรงเรียน เรียงตามวันเปิดภาค
function sdTerms() {
  let years = [];
  try { years = (window.SchoolStore && SchoolStore.get('school_academic_years')) || []; } catch (e) {}
  const list = [];
  years.forEach(y => [1, 2].forEach(n => {
    const from = y['term' + n + 'Start'], to = y['term' + n + 'End'];
    if (from && to && from <= to) list.push({ unit: 'term', from, to, year: y.year, term: n });
  }));
  return list.sort((a, b) => a.from.localeCompare(b.from));
}
// ภาคเรียนที่ครอบวันนี้ ถ้าอยู่ช่วงปิดภาค → ภาคล่าสุดที่เปิดไปแล้ว
function sdCurrentTerm() {
  const today = attToday(), terms = sdTerms();
  return terms.find(t => t.from <= today && today <= t.to) || terms.filter(t => t.from <= today).pop() || null;
}
function sdPresetPeriod(id) {
  const t = attToday();
  if (id === 'today') return sdDayPeriod(t);
  if (id === 'yesterday') return sdDayPeriod(attAddDays(t, -1));
  if (id === 'week') return sdWeekPeriod(t);
  if (id === 'lastweek') return sdWeekPeriod(attAddDays(t, -7));
  if (id === 'lastmonth') return sdMonthPeriod(sdMonthShift(t, -1));
  if (id === 'term') return sdCurrentTerm();
  return sdMonthPeriod(t); // month
}
function sdShiftPeriod(p, dir) {
  if (p.unit === 'day') {
    let d = p.from;
    for (let i = 0; i < 14; i++) { d = attAddDays(d, dir); if (attIsSchoolDay(d)) break; } // ข้ามวันหยุดประจำสัปดาห์
    return sdDayPeriod(d);
  }
  if (p.unit === 'week') return sdWeekPeriod(attAddDays(p.from, 7 * dir));
  if (p.unit === 'month') return sdMonthPeriod(sdMonthShift(p.from, dir));
  if (p.unit === 'term') {
    const terms = sdTerms(), i = terms.findIndex(t => t.from === p.from && t.to === p.to);
    return i < 0 ? null : terms[i + dir] || null;
  }
  const len = sdDaysBetween(p.from, p.to) + 1;
  return { unit: 'custom', from: attAddDays(p.from, dir * len), to: attAddDays(p.to, dir * len) };
}
function sdPeriodLabel(p) {
  if (!p) return '-';
  if (p.unit === 'day') return `${ATT_DAY_LABELS[attWeekday(p.from)]}. ${sdRangeText(p.from, p.from)}`;
  if (p.unit === 'month') { const [y, m] = p.from.split('-').map(Number); return `${THAI_MONTHS_FULL[m - 1]} ${y + 543}`; }
  if (p.unit === 'term') return `ภาคเรียนที่ ${p.term}/${p.year}`;
  return sdRangeText(p.from, p.to);
}
function sdSamePeriod(a, b) { return !!a && !!b && a.unit === b.unit && a.from === b.from && a.to === b.to; }
function sdMatchedPreset() {
  if (sdPeriod.unit === 'custom') return 'custom';
  const hit = SD_PRESETS.find(x => x.id !== 'custom' && sdSamePeriod(sdPresetPeriod(x.id), sdPeriod));
  return hit ? hit.id : null;
}

// ---- ชั้นเรียน: 2 dropdown ระดับชั้น (sd-grade) + ห้อง (sd-room) ----
// ค่าของห้องเป็นชื่อห้องเต็ม ('ม.1/1') เสมอ — ยังไม่เลือกระดับชั้น ห้องก็เลือกได้ (แสดงทุกห้อง)
// และเลือกแล้วระดับชั้นจะตั้งตามให้เอง จึงไม่มีช่องที่กดไม่ได้
// sdClassKey(): '' = ทุกชั้น, 'ม.1' = ทั้งชั้นปี, 'ม.1/1' = ห้องเดียว (ใช้เก็บตัวกรอง/เช็คค่าเริ่มต้น)
function sdClassValue() {
  const grade = document.getElementById('sd-grade').value;
  const cls = document.getElementById('sd-room').value;
  return { grade, room: cls ? cls.split('/')[1] : '' };
}
function sdClassKey() { return document.getElementById('sd-room').value || document.getElementById('sd-grade').value; }
function sdFillGradeSelect() {
  document.getElementById('sd-grade').innerHTML = '<option value="">ทุกชั้นปี</option>' +
    studentGradeOptions().map(g => `<option value="${g}">${g}</option>`).join('');
}
function sdFillRoomSelect() {
  const grade = document.getElementById('sd-grade').value;
  const grades = grade ? [grade] : studentGradeOptions();
  document.getElementById('sd-room').innerHTML = '<option value="">ทุกห้อง</option>' +
    grades.flatMap(g => attRoomsOfGrade(g).map(r => `<option value="${g}/${r}">${grade ? 'ห้อง ' + r : g + '/' + r}</option>`)).join('');
}
// ตั้งค่าตัวกรองชั้นเรียนจาก key ('' / 'ม.1' / 'ม.1/1')
function sdSetClassKey(key) {
  const [grade, room] = (key || '').split('/');
  const gSel = document.getElementById('sd-grade');
  gSel.value = [...gSel.options].some(o => o.value === grade) ? grade : '';
  sdFillRoomSelect();
  const rSel = document.getElementById('sd-room');
  rSel.value = room && [...rSel.options].some(o => o.value === key) ? key : '';
}
function sdOnGradeChange() { sdFillRoomSelect(); sdOnFilterChange(); }
function sdOnRoomChange() {
  const cls = document.getElementById('sd-room').value;
  if (cls && !document.getElementById('sd-grade').value) sdSetClassKey(cls); // เลือกห้องก่อน → ตั้งระดับชั้นตาม
  sdOnFilterChange();
}

// ---- ตัวกรอง ----
function sdSaveFilters() {
  attStore(SD_FILTER_KEY, { preset: sdMatchedPreset(), period: sdPeriod, cls: sdClassKey(), trend: sdState.trend });
}
function sdSyncFilterBar() {
  const matched = sdMatchedPreset();
  const sel = document.getElementById('sd-period');
  sel.innerHTML = (matched ? '' : `<option value="__nav">${sdPeriodLabel(sdPeriod)}</option>`) +
    SD_PRESETS.map(x => `<option value="${x.id}">${x.label}</option>`).join('');
  sel.value = matched || '__nav';
  document.getElementById('sd-custom-range').classList.toggle('show', sdPeriod.unit === 'custom');
  if (sdPeriod.unit === 'custom') {
    document.getElementById('sd-from').value = sdPeriod.from;
    document.getElementById('sd-to').value = sdPeriod.to;
  }
  const next = sdShiftPeriod(sdPeriod, 1);
  document.getElementById('sd-prev').disabled = !sdShiftPeriod(sdPeriod, -1);
  document.getElementById('sd-next').disabled = !next || next.from > attToday();
  const isDefault = matched === 'month' && !sdClassKey();
  document.getElementById('sd-clear-filters').hidden = isDefault;
}
function renderStudentDashboardView() {
  if (!document.getElementById('sd-grade').options.length) {
    sdFillGradeSelect();
    const saved = attLoad(SD_FILTER_KEY, null) || {};
    sdSetClassKey(saved.cls || '');
    if (['rate', 'status', 'rooms'].includes(saved.trend)) sdState.trend = saved.trend;
    // ปุ่มลัด (เดือนนี้/สัปดาห์นี้/…) คำนวณใหม่ตามวันนี้เสมอ ส่วนช่วงที่เลื่อนเอง/กำหนดเองใช้ค่าที่เก็บไว้
    const p = saved.preset && saved.preset !== 'custom' ? sdPresetPeriod(saved.preset) : saved.period;
    sdPeriod = p && p.from && p.to ? p : sdPresetPeriod('month');
    document.querySelectorAll('#sd-trend-modes button').forEach(b => b.classList.toggle('active', b.dataset.mode === sdState.trend));
  }
  document.getElementById('sd-from').max = attToday();
  document.getElementById('sd-to').max = attToday();
  sdOnFilterChange();
}
function sdOnPeriodSelect() {
  const id = document.getElementById('sd-period').value;
  if (id === '__nav') return;
  if (id === 'custom') {
    const to = sdPeriod.to > attToday() ? attToday() : sdPeriod.to;
    sdPeriod = { unit: 'custom', from: sdPeriod.from, to };
  } else {
    const p = sdPresetPeriod(id);
    if (!p) { document.getElementById('sd-filter-note').innerHTML = 'ไม่พบข้อมูลภาคเรียน — ตั้งค่าวันเปิด-ปิดภาคเรียนที่ <a href="../settings/school.html#tab=years">ตั้งค่าโรงเรียน › ข้อมูลปีการศึกษา</a>'; sdSyncFilterBar(); return; }
    sdPeriod = p;
  }
  sdOnFilterChange();
}
function sdOnCustomDate() {
  let from = document.getElementById('sd-from').value, to = document.getElementById('sd-to').value;
  if (!from || !to) return;
  if (from > to) [from, to] = [to, from];
  sdPeriod = { unit: 'custom', from, to };
  sdOnFilterChange();
}
function sdStep(dir) {
  const p = sdShiftPeriod(sdPeriod, dir);
  if (!p || p.from > attToday()) return;
  sdPeriod = p;
  sdOnFilterChange();
}
function sdResetFilters() {
  sdPeriod = sdPresetPeriod('month');
  sdSetClassKey('');
  sdOnFilterChange();
}
function sdOnFilterChange() { sdState.page = 1; sdSyncFilterBar(); sdSaveFilters(); renderStudentDashboard(); }

// ---- คำนวณ ----
function sdFinish(o) {
  o.checked = o.ontime + o.late + o.absent + o.leave;
  o.present = o.ontime + o.late;
  o.rate = o.checked ? o.present / o.checked * 100 : null;
  return o;
}
function sdCompute(period, grade, room) { return attWithIndex(() => _sdCompute(period, grade, room)); }
function _sdCompute(period, grade, room) {
  const today = attToday();
  let from = period.from, to = period.to > today ? today : period.to;
  let capped = false;
  if (from > to) to = from; // ช่วงในอนาคตทั้งช่วง → ไม่มีวันเรียน (ดู days ด้านล่าง)
  if (attAddDays(from, SD_MAX_DAYS - 1) < to) { from = attAddDays(to, -(SD_MAX_DAYS - 1)); capped = true; }

  const students = attStudentsOf(grade, room);
  const days = [];
  for (let d = from; d <= to && d <= today; d = attAddDays(d, 1)) if (attIsSchoolDay(d)) days.push(d);
  const lastIdx = days.length - 1;

  const ids = new Set(students.map(s => s.id));
  const tickets = HISTORY.filter(h => ids.has(h.id) && h.date >= from && h.date <= to && h.status !== 'ไม่อนุมัติ')
    .sort((a, b) => a.date.localeCompare(b.date));
  const ticketCount = {}, ticketByDate = {};
  tickets.forEach(t => { ticketCount[t.id] = (ticketCount[t.id] || 0) + 1; ticketByDate[t.date] = (ticketByDate[t.date] || 0) + 1; });

  const blank = () => ({ ontime: 0, late: 0, absent: 0, leave: 0, none: 0, early: 0, tickets: 0, lastNone: 0 });
  const daily = days.map(date => ({ date, ...blank(), tickets: ticketByDate[date] || 0 }));
  const roomDaily = {}; // cls → [{ ontime, late, absent, leave, none }] ต่อวันเรียน (โหมดกราฟ "เทียบห้อง")
  const people = students.map(s => {
    const p = { s, ...blank(), streak: 0 };
    const rd = roomDaily[s.cls] || (roomDaily[s.cls] = days.map(() => ({ ontime: 0, late: 0, absent: 0, leave: 0, none: 0 })));
    let run = 0;
    days.forEach((d, i) => {
      const rec = getAttendance(s, d);
      const cat = attCategory(rec.statusIn);
      p[cat]++; daily[i][cat]++; rd[i][cat]++;
      if (rec.statusOut === 'ออกก่อนเวลา') { p.early++; daily[i].early++; }
      if (i === lastIdx && cat === 'none') p.lastNone = 1;
      run = cat === 'absent' ? run + 1 : 0;
      if (run > p.streak) p.streak = run;
    });
    p.tickets = ticketCount[s.id] || 0;
    sdFinish(p);
    p.flags = [];
    if (p.streak >= SD_RISK.streak) p.flags.push(`ขาดติดกัน ${p.streak} วัน`);
    if (p.checked >= SD_RISK.minChecked && p.rate < SD_RISK.rate) p.flags.push(`มาเรียน < ${SD_RISK.rate}%`);
    if (p.tickets >= SD_RISK.tickets) p.flags.push(`บัตรฯ ${p.tickets} ใบ`);
    p.risk = p.flags.length;
    return p;
  });
  daily.forEach(sdFinish);
  Object.values(roomDaily).forEach(arr => arr.forEach(sdFinish));

  const roomMap = new Map();
  const total = { cls: 'รวม', teacher: '', students: 0, risk: 0, ...blank() };
  people.forEach(p => {
    let r = roomMap.get(p.s.cls);
    if (!r) { r = { cls: p.s.cls, teacher: homeroomTeacherName(p.s.cls), students: 0, risk: 0, ...blank() }; roomMap.set(p.s.cls, r); }
    [r, total].forEach(o => {
      o.students++;
      if (p.flags.length) o.risk++;
      SD_SUM_KEYS.forEach(k => { o[k] += p[k]; });
    });
  });
  const rooms = [...roomMap.values()].sort((a, b) => a.cls.localeCompare(b.cls, 'th', { numeric: true }));
  rooms.forEach(sdFinish);
  sdFinish(total);

  // เรื่องที่รอดำเนินการ (แถบ "ต้องติดตาม") — เฉพาะนักเรียนตามตัวกรอง และคาบเกี่ยวช่วงที่เลือก
  const pendingTickets = tickets.filter(t => t.status === 'รอตรวจสอบ').length;
  const pendingLeaves = STUDENT_LEAVE_REQUESTS.filter(r => ids.has(r.studentId) && r.status === 'รอตรวจสอบ' && r.startDate <= to && r.endDate >= from).length;

  const ticketTypes = TICKET_TYPES.map(type => ({ type, count: tickets.filter(t => t.type === type).length }));
  return { from, to, capped, grade, room, days, lastDay: days[lastIdx] || null, people, daily, roomDaily, rooms, total, tickets, ticketTypes, pendingTickets, pendingLeaves };
}

// ---- แสดงผล ----
function renderStudentDashboard() {
  const { grade, room } = sdClassValue();
  sdData = sdCompute(sdPeriod, grade, room);
  const prevP = sdShiftPeriod(sdPeriod, -1);
  sdPrev = prevP ? { period: prevP, ...sdCompute(prevP, grade, room) } : null;

  const d = sdData;
  const clamped = sdPeriod.to > attToday() && sdPeriod.from <= attToday();
  document.getElementById('sd-period-label').innerHTML = `${sdPeriodLabel(sdPeriod)}<small>${d.days.length} วันเรียน${clamped ? ' · ถึงวันนี้' : ''}</small>`;
  const notes = [];
  if (d.capped) notes.push(`แสดงสูงสุด ${SD_MAX_DAYS} วันย้อนหลังจากวันที่สิ้นสุด`);
  if (!d.days.length) notes.push('ไม่มีวันเรียนในช่วงที่เลือก (วันหยุดประจำสัปดาห์ตามหน้าตั้งค่าเวลาเข้า-เลิกเรียน)');
  document.getElementById('sd-filter-note').innerHTML = notes.join(' · ');

  renderSDOverview();
  renderSDTrendChart();
  renderSDTicketChart();
  renderSDTab();
}
function renderSDTab() {
  if (!sdData) return;
  if (sdState.tab === 'sd-people') renderSDPeople();
  else { renderSDRooms(); renderSDRoomChart(); }
}
function sdGoTab(tab) {
  const btn = document.querySelector(`#view-student-dashboard .tab-btn[data-tab="${tab}"]`);
  if (btn) btn.click();
  document.querySelector('#view-student-dashboard .view-tabs-sticky').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const SD_ARROW_UP = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
const SD_ARROW_DOWN = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
const SD_ALERT = '<svg class="icon" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

function renderSDOverview() {
  const d = sdData, t = d.total;
  // ชั้น 1: ตัวเลขหลัก + เทียบช่วงก่อนหน้า + เกณฑ์
  let delta = '<span>ไม่มีข้อมูลช่วงก่อนหน้าให้เทียบ</span>';
  if (t.rate !== null && sdPrev && sdPrev.total.rate !== null) {
    const diff = t.rate - sdPrev.total.rate;
    const dir = Math.abs(diff) < 0.05 ? '' : diff > 0 ? 'up' : 'down';
    delta = `<span class="sd-delta ${dir}">${dir === 'up' ? SD_ARROW_UP : dir === 'down' ? SD_ARROW_DOWN : ''}${dir ? (diff > 0 ? '+' : '') + diff.toFixed(1) + ' จุด' : 'เท่าเดิม'}</span>
      <span>เทียบ${sdPeriodLabel(sdPrev.period)} (${sdPct(sdPrev.total.rate)})</span>`;
  }
  const pass = t.rate === null ? '' : t.rate >= SD_RISK.rate
    ? `<span class="badge success">✓ ผ่านเกณฑ์ ${SD_RISK.rate}%</span>`
    : `<span class="badge danger">ต่ำกว่าเกณฑ์ ${SD_RISK.rate}%</span>`;
  document.getElementById('sd-hero').innerHTML = `
    <div class="sd-hero-label">อัตราการมาเรียน</div>
    <div class="sd-hero-value">${sdPct(t.rate)}</div>
    <div class="sd-hero-row">${delta}</div>
    <div class="sd-hero-row sd-hero-foot">${pass}<span>มา ${sdNum(t.present)} จาก ${sdNum(t.checked)} คน-วันที่เช็คชื่อแล้ว</span></div>`;

  // ชั้น 2: แท่งสัดส่วนแท่งเดียว + ค่าเฉลี่ยต่อวันเรียน
  const all = t.checked + t.none;
  const cats = SD_CATS.filter(c => t[c.key] > 0);
  const share = n => all ? (n / all * 100) : 0;
  const perDay = n => { const v = d.days.length ? n / d.days.length : 0; return v >= 10 ? Math.round(v).toLocaleString('th-TH') : (Math.round(v * 10) / 10).toLocaleString('th-TH'); };
  const clickable = { leave: 1, late: 1, absent: 1, none: 1 };
  document.getElementById('sd-mix').innerHTML = !all
    ? `<div class="sd-mix-title">สัดส่วนการมาเรียน</div><div class="sd-chart-sub" style="margin-top:12px;">ไม่มีข้อมูลในช่วงที่เลือก</div>`
    : `<div class="sd-mix-title">สัดส่วนการมาเรียน <span style="font-weight:500;color:var(--text-muted);">· นักเรียน ${sdNum(t.students)} คน × ${d.days.length} วันเรียน</span></div>
      <div class="sd-mix-bar" role="img" aria-label="${cats.map(c => c.label + ' ' + share(t[c.key]).toFixed(1) + '%').join(', ')}">
        ${cats.map(c => `<span style="flex:${t[c.key]};background:var(${c.color});" title="${c.label} ${share(t[c.key]).toFixed(1)}% (${sdNum(t[c.key])} คน-วัน)"></span>`).join('')}
      </div>
      <div class="sd-mix-legend">
        ${cats.map(c => {
          const inner = `<i style="background:var(${c.color});"></i>${c.label} <strong>${share(t[c.key]).toFixed(1)}%</strong>`;
          return clickable[c.key]
            ? `<button type="button" class="sd-mix-item" onclick="sdFilterByStatus('${c.key}')" title="ดูรายชื่อนักเรียนที่มี${c.label}">${inner}</button>`
            : `<span class="sd-mix-item" style="cursor:default;">${inner}</span>`;
        }).join('')}
      </div>
      <div class="sd-mix-avg">เฉลี่ยต่อวันเรียน: มาสาย <strong>${perDay(t.late)}</strong> คน · ขาดเรียน <strong>${perDay(t.absent)}</strong> คน ·
        ลา <strong>${perDay(t.leave)}</strong> คน · ออกก่อนเวลา <strong>${perDay(t.early)}</strong> คน · บัตรขออนุญาต <strong>${perDay(d.tickets.length)}</strong> ใบ</div>`;

  // ชั้น 3: ต้องติดตาม — แสดงเฉพาะเรื่องที่ต้องลงมือทำ ไม่มีเลย → ซ่อนทั้งแถบ
  const uncheckedRooms = d.rooms.filter(r => r.lastNone > 0).length;
  const items = [];
  if (uncheckedRooms) items.push(`<button type="button" class="sd-action" onclick="sdGoTab('sd-rooms')">${SD_ALERT}${d.lastDay === attToday() ? 'วันนี้' : sdShortDate(d.lastDay)} ยังไม่เช็คชื่อ <strong>${uncheckedRooms}</strong> ห้อง</button>`);
  if (t.risk) items.push(`<button type="button" class="sd-action" onclick="sdFilterByStatus('risk')">${SD_ALERT}นักเรียนกลุ่มเฝ้าระวัง <strong>${t.risk}</strong> คน</button>`);
  if (d.pendingLeaves) items.push(`<button type="button" class="sd-action" onclick="showModuleView('approve')">${SD_ALERT}ใบลารออนุมัติ <strong>${d.pendingLeaves}</strong> ใบ</button>`);
  if (d.pendingTickets) items.push(`<button type="button" class="sd-action" onclick="showModuleView('ticket-calendar')">${SD_ALERT}บัตรขออนุญาตรอตรวจสอบ <strong>${d.pendingTickets}</strong> ใบ</button>`);
  const box = document.getElementById('sd-actions');
  box.hidden = !items.length;
  box.innerHTML = `<span class="sd-actions-title">ต้องติดตาม</span>` + items.join('');
}
function sdFilterByStatus(key) {
  sdState.status = key;
  sdState.page = 1;
  sdState.sortKey = key === 'risk' ? 'flags' : key; sdState.sortDir = -1;
  sdGoTab('sd-people');
}
function sdClearPeopleFilters() {
  sdState.status = 'all'; sdState.page = 1;
  sdState.sortKey = 'cls'; sdState.sortDir = 1;
  document.getElementById('sd-search').value = '';
  renderSDPeople();
}
function sdOpenRoom(cls) {
  sdSetClassKey(cls);
  sdState.status = 'all'; sdState.sortKey = 'no'; sdState.sortDir = 1;
  sdOnFilterChange();
  sdGoTab('sd-people');
}

// ---- drawer รายละเอียดนักเรียน (คลิกแถวในแท็บรายบุคคล) — ใช้ #drawer-detail ร่วมกับส่วนอื่นของหน้า
// เนื้อหาคิดจากช่วงเวลา/ข้อมูลเดียวกับแดชบอร์ดตอนเปิด (sdData) จึงตรงกับตัวเลขในแถวที่กด
// คลิกบัตร/ใบลาข้างในจะเปิดรายละเอียดใน drawer เดิม พร้อมปุ่ม ‹ กลับมาหน้านักเรียนคนนี้
const SD_DAY_COLOR = { ontime: '--success', leave: '--info', late: '--warning', absent: '--danger', none: '--text-muted' };
function sdDrawerGo(studentId, openFn) {
  openFn();
  detailDrawerBackTo = () => sdOpenStudentDrawer(studentId);
  updateDetailDrawerBackBtn();
}
function sdOpenStudentDrawer(studentId) {
  const p = sdData && sdData.people.find(x => x.s.id === studentId);
  if (!p) return;
  detailDrawerBackTo = null;
  updateDetailDrawerBackBtn();
  const s = p.s, d = sdData;

  const recs = d.days.map(date => ({ date, rec: getAttendance(s, date) }));
  const tickets = d.tickets.filter(t => t.id === s.id).sort((a, b) => b.date.localeCompare(a.date));
  const leaves = STUDENT_LEAVE_REQUESTS.filter(r => r.studentId === s.id && r.startDate <= d.to && r.endDate >= d.from)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  // วันที่ไม่ใช่ "มาตรงเวลาและกลับตามเวลา" — ใหม่ → เก่า
  const unusual = recs.filter(x => attCategory(x.rec.statusIn) !== 'ontime' || x.rec.statusOut === 'ออกก่อนเวลา').reverse();

  const stat = (label, value, color) => `
    <div class="sd-dstat"><span>${label}</span><strong${color ? ` style="color:var(${color})"` : ''}>${value}</strong></div>`;
  const dayStrip = recs.map(x => {
    const cat = attCategory(x.rec.statusIn), early = x.rec.statusOut === 'ออกก่อนเวลา';
    return `<i class="${early ? 'early' : ''}" style="background:var(${SD_DAY_COLOR[cat]});" title="${thaiDateLong(x.date)}: ${x.rec.statusIn}${early ? ' · ออกก่อนเวลา' : ''}"></i>`;
  }).join('');
  const dateBox = dateStr => {
    const [, m, dd] = dateStr.split('-').map(Number);
    return `<div class="history-date-box"><span class="history-date-month">${SD_MONTHS_SHORT[m - 1]}</span><span class="history-date-day">${String(dd).padStart(2, '0')}</span></div>`;
  };
  const empty = text => `<div class="sd-drawer-empty">${text}</div>`;

  const unusualHtml = unusual.length ? unusual.map(({ date, rec }) => `
    <div class="sd-day-row">
      <div class="sd-day-date">${ATT_DAY_LABELS[attWeekday(date)]}. ${sdShortDate(date)}</div>
      <div class="sd-day-status">${attBadgeIn(rec.statusIn)}${rec.timeIn && rec.timeIn !== '-' ? `<span>${rec.timeIn}</span>` : ''}
        ${rec.statusOut === 'ออกก่อนเวลา' ? `${attBadgeOut(rec.statusOut)}<span>${rec.timeOut}</span>` : ''}</div>
      <div class="sd-day-note">${rec.note || ''}</div>
    </div>`).join('') : empty('มาเรียนตรงเวลาและกลับตามเวลาทุกวันในช่วงนี้');

  const ticketHtml = tickets.length ? tickets.map(t => `
    <div class="history-item" style="cursor:pointer;" onclick="sdDrawerGo('${s.id}', () => viewTicketRequestDetails('${t.reqId}'))" title="ดูรายละเอียดบัตร">
      ${dateBox(t.date)}
      <div class="history-info"><div class="history-type">${t.type}</div><div class="history-duration">${t.time || '-'} · ${t.reason || '-'}</div></div>
      ${statusBadgeHTML(t.status)}
    </div>`).join('') : empty('ไม่มีบัตรขออนุญาตในช่วงนี้');

  const leaveHtml = leaves.length ? leaves.map(r => `
    <div class="history-item" style="cursor:pointer;" onclick="sdDrawerGo('${s.id}', () => viewSLRequestDetails('${r.id}'))" title="ดูรายละเอียดใบลา">
      ${dateBox(r.startDate)}
      <div class="history-info"><div class="history-type">${r.type} · ${r.days} วัน</div>
        <div class="history-duration">${thaiDate(r.startDate)}${r.endDate !== r.startDate ? ' - ' + thaiDate(r.endDate) : ''}</div></div>
      ${statusBadgeHTML(r.status)}
    </div>`).join('') : empty('ไม่มีใบลาในช่วงนี้');

  document.getElementById('drawer-detail-title').textContent = studentFullName(s);
  document.getElementById('drawer-detail-body').innerHTML = `
    <div class="sd-drawer-meta">${s.cls} · เลขที่ ${s.no} · รหัส ${s.id}<br>${sdPeriodLabel(sdPeriod)} · ${d.days.length} วันเรียน</div>
    ${p.flags.length ? `<div class="sd-flags" style="margin-bottom:14px;">${p.flags.map(f => `<span class="badge danger">${f}</span>`).join('')}</div>` : ''}
    <div class="sd-dstat-hero">
      <div><span>อัตราการมาเรียน</span><strong class="${p.rate !== null && p.rate < SD_RISK.rate ? 'low' : ''}">${sdPct(p.rate)}</strong></div>
      <div class="sd-dstat-sub">มา ${p.present} จาก ${p.checked} วันที่เช็คชื่อแล้ว${p.streak > 1 ? ` · ขาดติดกันสูงสุด ${p.streak} วัน` : ''}</div>
    </div>
    <div class="sd-dstat-grid">
      ${stat('ตรงเวลา', p.ontime)}${stat('มาสาย', p.late, p.late ? '--warning' : '')}${stat('ขาดเรียน', p.absent, p.absent ? '--danger' : '')}${stat('ลา', p.leave, p.leave ? '--info' : '')}
      ${stat('ออกก่อนเวลา', p.early)}${stat('บัตรฯ', p.tickets)}${stat('ยังไม่เช็ค', p.none)}
    </div>
    ${d.days.length ? `
    <div class="setting-section-title">รายวัน</div>
    <div class="sd-daystrip">${dayStrip}</div>
    <div class="sd-daystrip-legend">
      <span><i style="background:var(--success)"></i>ตรงเวลา</span><span><i style="background:var(--warning)"></i>สาย</span>
      <span><i style="background:var(--danger)"></i>ขาด</span><span><i style="background:var(--info)"></i>ลา</span>
      <span><i style="background:var(--text-muted)"></i>ยังไม่เช็ค</span><span><i class="early" style="background:var(--success)"></i>ออกก่อนเวลา</span>
    </div>` : ''}
    <div class="setting-section-title">วันที่ต้องดู (${unusual.length})</div>
    <div class="sd-day-list">${unusualHtml}</div>
    <div class="setting-section-title">บัตรขออนุญาต (${tickets.length})</div>
    <div class="sd-drawer-list">${ticketHtml}</div>
    <div class="setting-section-title">ใบลา (${leaves.length})</div>
    <div class="sd-drawer-list">${leaveHtml}</div>
    <div class="sd-drawer-actions">
      <button class="btn btn-secondary btn-sm" onclick="sdDrawerGo('${s.id}', () => openSLProfileDrawer('${s.id}'))"><svg class="icon"><use href="#i-history"/></svg> ประวัติการลาทั้งหมด</button>
      <button class="btn btn-secondary btn-sm" onclick="closeDetailDrawer(); viewStudentHistory('${s.id}')"><svg class="icon"><use href="#i-ticket"/></svg> ประวัติบัตรขออนุญาตทั้งหมด</button>
    </div>`;

  detailDrawerRefresh = () => { renderStudentDashboard(); sdOpenStudentDrawer(studentId); };
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('drawer-detail').classList.add('active');
}

// ---- กราฟ (Chart.js) ----
function sdColor(varName) { return getComputedStyle(document.body).getPropertyValue(varName).trim() || '#888'; }
function sdChart(id, config, emptyMsg) {
  if (sdCharts[id]) { sdCharts[id].destroy(); delete sdCharts[id]; }
  const box = document.getElementById(id + '-box');
  const canvas = document.getElementById(id);
  const oldEmpty = box.querySelector('.sd-chart-empty');
  if (oldEmpty) oldEmpty.remove();
  if (config && typeof Chart === 'undefined') {
    // Chart.js โหลดแบบ lazy ตอนเปิดกราฟครั้งแรก (ดู lazy-libs.js) — โหลดเสร็จค่อยวาดด้วย config เดิม
    // (token กัน render ซ้อนกัน: ถ้ามีการสั่งวาดกราฟเดียวกันใหม่ระหว่างรอ ให้ใช้เฉพาะครั้งล่าสุด)
    const token = sdChartToken[id] = (sdChartToken[id] || 0) + 1;
    canvas.style.display = 'none';
    loadScriptOnce(LAZY_LIBS.chart).then(() => {
      if (sdChartToken[id] === token && canvas.isConnected) sdChart(id, config, emptyMsg);
    }).catch(() => {
      if (sdChartToken[id] !== token) return;
      box.insertAdjacentHTML('beforeend', '<div class="sd-chart-empty">โหลดไลบรารีกราฟไม่สำเร็จ (ต้องเชื่อมต่ออินเทอร์เน็ต)</div>');
    });
    return;
  }
  if (!config) {
    sdChartToken[id] = (sdChartToken[id] || 0) + 1;
    canvas.style.display = 'none';
    box.insertAdjacentHTML('beforeend', `<div class="sd-chart-empty">${config ? 'โหลดไลบรารีกราฟไม่สำเร็จ (ต้องเชื่อมต่ออินเทอร์เน็ต)' : emptyMsg}</div>`);
    return;
  }
  canvas.style.display = '';
  sdChartToken[id] = (sdChartToken[id] || 0) + 1; // ยกเลิกการโหลดที่ค้างอยู่ของกราฟนี้
  config.options = Object.assign({}, config.options, { animation: false }); // ไม่ต้อง animate ตอนวาด/สลับโหมด (ลดงาน)
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = sdColor('--text-secondary');
  sdCharts[id] = new Chart(canvas, config);
}
const SD_GRID = 'rgba(0,0,0,.06)';
const SD_LEGEND = { position: 'top', align: 'start', labels: { boxWidth: 12, boxHeight: 12, padding: 14, usePointStyle: false } };
function sdThresholdSet(n) {
  return { key: 'threshold', label: `เกณฑ์ ${SD_RISK.rate}%`, data: Array(n).fill(SD_RISK.rate), borderColor: '#94a0b2', backgroundColor: '#94a0b2',
           borderWidth: 1.5, borderDash: [6, 4], pointRadius: 0, pointHoverRadius: 0, fill: false, order: 9 };
}
function sdRateAxis(values) {
  const nums = values.filter(v => v !== null && v !== undefined);
  const min = Math.min(SD_RISK.rate, ...nums);
  return { min: Math.max(0, Math.floor((min - 5) / 5) * 5), max: 100, ticks: { callback: v => v + '%' }, grid: { color: SD_GRID }, border: { display: false } };
}
function sdSetTrendMode(mode) {
  sdState.trend = mode;
  document.querySelectorAll('#sd-trend-modes button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  sdSaveFilters();
  renderSDTrendChart();
}
function renderSDTrendChart() {
  const mode = sdState.trend;
  const title = { rate: 'อัตราการมาเรียนรายวัน', status: 'จำนวนนักเรียนรายวันแยกสถานะ', rooms: 'อัตราการมาเรียนรายวันแยกห้อง' }[mode];
  document.getElementById('sd-trend-title').textContent = title;
  const sub = document.getElementById('sd-trend-sub');
  const days = sdData.daily;
  if (!days.length) { sub.textContent = ''; sdChart('sd-chart-trend', null, 'ไม่มีวันเรียนในช่วงที่เลือก'); return; }
  const labels = days.map(d => sdShortDate(d.date));
  const x = { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } };
  const pointR = days.length > 31 ? 0 : 3;
  const surface = sdColor('--bg-card');
  const line = (extra) => ({ borderWidth: 2, cubicInterpolationMode: 'monotone', // monotone: เส้นโค้งไม่พุ่งเกิน 100%
                              pointRadius: pointR, pointHoverRadius: 5, pointBorderColor: surface, pointBorderWidth: 2, spanGaps: true, fill: false, ...extra });
  const dayTitle = items => thaiDateLong(days[items[0].dataIndex].date);

  if (mode === 'rate') {
    if (!days.some(d => d.rate !== null)) { sub.textContent = ''; sdChart('sd-chart-trend', null, 'ยังไม่มีข้อมูลการเช็คชื่อในช่วงที่เลือก'); return; }
    const primary = sdColor('--primary');
    const cur = days.map(d => d.rate === null ? null : Math.round(d.rate * 10) / 10);
    // ช่วงก่อนหน้า: จับคู่ตาม "วันเรียนลำดับที่ n" (วันที่ 1 ของช่วงนี้ ↔ วันเรียนที่ 1 ของช่วงก่อน)
    const prevDays = sdPrev ? sdPrev.daily : [];
    const prev = days.map((_, i) => prevDays[i] && prevDays[i].rate !== null ? Math.round(prevDays[i].rate * 10) / 10 : null);
    const datasets = [line({ key: 'cur', label: sdPeriodLabel(sdPeriod), data: cur, borderColor: primary, backgroundColor: primary, order: 1 })];
    if (prev.some(v => v !== null)) datasets.push(line({ key: 'prev', label: sdPeriodLabel(sdPrev.period), data: prev, borderColor: '#b9c1cd', backgroundColor: '#b9c1cd', borderWidth: 1.5, pointRadius: 0, order: 2 }));
    datasets.push(sdThresholdSet(days.length));
    sub.textContent = `% ที่มาเรียน (ตรงเวลา + สาย) ของนักเรียนที่เช็คชื่อแล้ว` + (datasets.length > 2 ? ` · เส้นสีเทา = ${sdPeriodLabel(sdPrev.period)} เทียบวันเรียนลำดับเดียวกัน` : '');
    sdChart('sd-chart-trend', {
      type: 'line', data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: SD_LEGEND,
          tooltip: {
            filter: item => item.dataset.key !== 'threshold',
            callbacks: {
              title: dayTitle,
              label: c => {
                if (c.dataset.key === 'prev') return ` ${sdShortDate(prevDays[c.dataIndex].date)} (ช่วงก่อนหน้า): ${c.parsed.y}%`;
                const d = days[c.dataIndex];
                return [` มาเรียน ${c.parsed.y}%`, ` สาย ${d.late} · ขาด ${d.absent} · ลา ${d.leave}` + (d.none ? ` · ยังไม่เช็ค ${d.none}` : '')];
              }
            }
          }
        },
        scales: { y: sdRateAxis([...cur, ...prev]), x }
      }
    });
    return;
  }

  if (mode === 'status') {
    const keys = [['late', 'มาสาย'], ['absent', 'ขาดเรียน'], ['leave', 'ลา'], ['early', 'ออกก่อนเวลา'], ['tickets', 'บัตรขออนุญาต (ใบ)']];
    if (days.some(d => d.none)) keys.push(['none', 'ยังไม่เช็คชื่อ']);
    const datasets = keys.map(([k, label]) => line({
      key: k, label, data: days.map(d => d[k]), borderColor: SD_LINE_COLORS[k], backgroundColor: SD_LINE_COLORS[k],
      borderDash: k === 'tickets' ? [5, 4] : k === 'none' ? [2, 3] : [], borderWidth: 2
    }));
    sub.textContent = 'จำนวนนักเรียนต่อวัน · บัตรขออนุญาตนับเป็นใบ (เส้นประ) · คลิกชื่อด้านบนเพื่อซ่อน/แสดงเส้น';
    sdChart('sd-chart-trend', {
      type: 'line', data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: SD_LEGEND,
          tooltip: { callbacks: { title: dayTitle, label: c => ` ${c.dataset.label.replace(' (ใบ)', '')}: ${c.parsed.y} ${c.dataset.key === 'tickets' ? 'ใบ' : 'คน'}` } }
        },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: SD_GRID }, border: { display: false } }, x }
      }
    });
    return;
  }

  // rooms — สีผูกกับห้อง (ลำดับในรายชื่อห้องทั้งโรงเรียน) ไม่ใช่ลำดับที่แสดง
  const allRooms = [...new Set(STUDENTS.map(s => s.cls))].sort((a, b) => a.localeCompare(b, 'th', { numeric: true }));
  const rooms = sdData.rooms.map(r => r.cls);
  if (rooms.length > SD_ROOM_COLORS.length) {
    sub.textContent = '';
    sdChart('sd-chart-trend', null, `มี ${rooms.length} ห้องในตัวกรองนี้ — เลือกชั้นเรียนให้เหลือไม่เกิน ${SD_ROOM_COLORS.length} ห้องเพื่อเทียบ`);
    return;
  }
  const datasets = rooms.map(cls => {
    const color = SD_ROOM_COLORS[allRooms.indexOf(cls) % SD_ROOM_COLORS.length];
    return line({ key: cls, label: cls, baseColor: color, borderColor: color, backgroundColor: color, borderWidth: 2, pointRadius: 0,
      data: sdData.roomDaily[cls].map(v => v.rate === null ? null : Math.round(v.rate * 10) / 10) });
  });
  datasets.push(sdThresholdSet(days.length));
  sub.textContent = 'ชี้ที่เส้นหรือชื่อห้องเพื่อเน้น · คลิกชื่อห้องเพื่อซ่อน/แสดง';
  const highlight = (chart, idx) => {
    let changed = false;
    chart.data.datasets.forEach((ds, i) => {
      if (!ds.baseColor) return;
      const c = idx === null || i === idx ? ds.baseColor : ds.baseColor + '33';
      const w = idx !== null && i === idx ? 3 : 2;
      if (ds.borderColor !== c || ds.borderWidth !== w) { ds.borderColor = c; ds.backgroundColor = c; ds.borderWidth = w; changed = true; }
    });
    if (changed) chart.update('none');
  };
  sdChart('sd-chart-trend', {
    type: 'line', data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      onHover: (e, els, chart) => {
        const near = chart.getElementsAtEventForMode(e.native, 'nearest', { intersect: false }, false)[0];
        highlight(chart, near && chart.data.datasets[near.datasetIndex].baseColor ? near.datasetIndex : null);
      },
      plugins: {
        legend: { ...SD_LEGEND,
          onHover: (e, item, legend) => highlight(legend.chart, legend.chart.data.datasets[item.datasetIndex].baseColor ? item.datasetIndex : null),
          onLeave: (e, item, legend) => highlight(legend.chart, null) },
        tooltip: {
          filter: item => item.dataset.key !== 'threshold' && item.parsed.y !== null,
          itemSort: (a, b) => b.parsed.y - a.parsed.y,
          callbacks: { title: dayTitle, label: c => ` ${c.dataset.label}: ${c.parsed.y}%` }
        }
      },
      scales: { y: sdRateAxis(datasets.flatMap(ds => ds.data)), x }
    }
  });
  const canvas = document.getElementById('sd-chart-trend');
  canvas.onmouseleave = () => { if (sdCharts['sd-chart-trend']) highlight(sdCharts['sd-chart-trend'], null); };
}

// บัตรขออนุญาตแยกประเภท — แท่ง HTML (ชื่อประเภท + จำนวนอยู่บรรทัดบน แท่งอยู่ใต้) แทน Chart.js เพราะ
// ชื่อประเภทภาษาไทยยาว ๆ บนแกน y ของ Chart.js ถูกตัดขอบซ้าย (วัดความกว้างก่อนฟอนต์ Sarabun โหลด
// และการ์ดแคบ) — HTML ตัดบรรทัด/ขยายตามฟอนต์จริงเองจึงไม่จมหาย
function renderSDTicketChart() {
  const box = document.getElementById('sd-chart-tickets-box');
  const types = sdData.ticketTypes;
  if (!sdData.tickets.length) { box.innerHTML = '<div class="sd-chart-empty">ไม่มีบัตรขออนุญาตในช่วงที่เลือก</div>'; return; }
  const max = Math.max(...types.map(t => t.count));
  box.innerHTML = '<ul class="sd-hbars">' + [...types].sort((a, b) => b.count - a.count).map(t => `
    <li title="${t.type}: ${t.count} ใบ">
      <div class="sd-hbar-head"><span>${t.type}</span><strong${t.count ? '' : ' class="zero"'}>${sdNum(t.count)} ใบ</strong></div>
      <div class="sd-hbar-track"><i style="width:${max ? t.count / max * 100 : 0}%"></i></div>
    </li>`).join('') + '</ul>';
}

function renderSDRoomChart() {
  const rooms = sdData.rooms;
  const box = document.getElementById('sd-chart-rooms-box');
  if (!rooms.length || !sdData.days.length) {
    box.style.height = '160px';
    sdChart('sd-chart-rooms', null, 'ไม่มีข้อมูลในช่วงที่เลือก');
    return;
  }
  box.style.height = Math.max(160, 70 + rooms.length * 36) + 'px';
  const surface = sdColor('--bg-card');
  const datasets = SD_CATS.filter(c => rooms.some(r => r[c.key] > 0)).map(c => ({
    label: c.label,
    data: rooms.map(r => { const all = r.checked + r.none; return all ? Math.round(r[c.key] / all * 1000) / 10 : 0; }),
    counts: rooms.map(r => r[c.key]),
    backgroundColor: sdColor(c.color),
    borderColor: surface, borderWidth: { right: 2 }, borderSkipped: false,
    barThickness: 20
  }));
  sdChart('sd-chart-rooms', {
    type: 'bar',
    data: { labels: rooms.map(r => r.cls), datasets },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      onClick: (e, els) => { if (els.length) sdOpenRoom(rooms[els[0].index].cls); },
      onHover: (e, els) => { e.native.target.style.cursor = els.length ? 'pointer' : 'default'; },
      plugins: {
        legend: SD_LEGEND,
        tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.x}% (${sdNum(c.dataset.counts[c.dataIndex])} คน-วัน)` } }
      },
      scales: {
        x: { stacked: true, min: 0, max: 100, ticks: { callback: v => v + '%' }, grid: { color: SD_GRID }, border: { display: false } },
        y: { stacked: true, grid: { display: false } }
      }
    }
  });
}

// ---- ตาราง ----
function sdCell(n) { return `<td class="num${n ? '' : ' zero'}">${sdNum(n)}</td>`; }
function sdRateCell(v) {
  if (v === null) return '<td class="num zero">-</td>';
  const low = v < SD_RISK.rate;
  return `<td class="num"><span class="sd-rate${low ? ' low' : ''}"><span class="sd-rate-bar"><i style="width:${Math.min(100, v)}%"></i></span><strong>${sdPct(v)}</strong></span></td>`;
}

function renderSDRooms() {
  const d = sdData;
  const checkHead = d.lastDay ? `เช็คชื่อ ${sdShortDate(d.lastDay)}` : 'เช็คชื่อ';
  document.getElementById('sd-room-thead').innerHTML = `<tr>
    <th>ห้อง</th><th>ครูประจำชั้น</th><th class="num">นักเรียน</th>
    <th class="num">ตรงเวลา</th><th class="num">สาย</th><th class="num">ขาด</th><th class="num">ลา</th>
    <th class="num">ออกก่อน</th><th class="num">บัตรฯ</th><th class="num">ยังไม่เช็ค</th>
    <th class="num">% มาเรียน</th><th>เฝ้าระวัง</th><th>${checkHead}</th></tr>`;
  const checkCell = r => {
    if (!d.lastDay) return '<td class="zero">-</td>';
    if (!r.lastNone) return `<td><span class="badge success">ครบ ${r.students} คน</span></td>`;
    return `<td><span class="badge warning">ยังไม่เช็ค ${r.lastNone}/${r.students}</span></td>`;
  };
  const row = (r, isTotal) => `
    <tr class="${isTotal ? 'sd-total' : 'sd-room-row'}" ${isTotal ? '' : `onclick="sdOpenRoom('${r.cls}')" title="ดูรายชื่อนักเรียน ${r.cls}"`}>
      <td><strong>${r.cls}</strong></td><td>${r.teacher || ''}</td>${sdCell(r.students)}
      ${sdCell(r.ontime)}${sdCell(r.late)}${sdCell(r.absent)}${sdCell(r.leave)}
      ${sdCell(r.early)}${sdCell(r.tickets)}${sdCell(r.none)}${sdRateCell(r.rate)}
      <td>${r.risk ? `<span class="badge danger">${r.risk} คน</span>` : '<span class="zero">-</span>'}</td>${checkCell(r)}
    </tr>`;
  document.getElementById('sd-room-tbody').innerHTML = d.rooms.length
    ? d.rooms.map(r => row(r)).join('') + (d.rooms.length > 1 ? row(d.total, true) : '')
    : `<tr><td colspan="13" style="text-align:center;padding:32px;color:var(--text-muted);">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</td></tr>`;
}

const SD_PEOPLE_COLS = [
  { key: 'no', label: 'เลขที่', num: true }, { key: 'cls', label: 'ห้อง' }, { key: 'id', label: 'รหัสนักเรียน' },
  { key: 'name', label: 'ชื่อ-นามสกุล' }, { key: 'ontime', label: 'ตรงเวลา', num: true }, { key: 'late', label: 'สาย', num: true },
  { key: 'absent', label: 'ขาด', num: true }, { key: 'leave', label: 'ลา', num: true }, { key: 'early', label: 'ออกก่อน', num: true },
  { key: 'tickets', label: 'บัตรฯ', num: true }, { key: 'none', label: 'ยังไม่เช็ค', num: true },
  { key: 'rate', label: '% มาเรียน', num: true }, { key: 'flags', label: 'เฝ้าระวัง' }
];
function sdSortValue(p, key) {
  if (key === 'id') return p.s.id;
  if (key === 'name') return p.s.name;
  if (key === 'rate') return p.rate === null ? -1 : p.rate;
  if (key === 'flags') return p.flags.length;
  return p[key];
}
function sdCompare(a, b) {
  const byRoom = a.s.cls.localeCompare(b.s.cls, 'th', { numeric: true }) || a.s.no - b.s.no;
  const key = sdState.sortKey;
  if (key === 'cls') return byRoom * sdState.sortDir;
  if (key === 'no') return (a.s.no - b.s.no) * sdState.sortDir || byRoom;
  const va = sdSortValue(a, key), vb = sdSortValue(b, key);
  const c = typeof va === 'string' ? va.localeCompare(vb, 'th') : va - vb;
  return c * sdState.sortDir || byRoom;
}
function sdSort(key) {
  if (sdState.sortKey === key) sdState.sortDir *= -1;
  else { sdState.sortKey = key; sdState.sortDir = SD_PEOPLE_COLS.find(c => c.key === key).num && key !== 'no' ? -1 : 1; } // ตัวเลขสถิติเริ่มจากมาก→น้อย
  sdState.page = 1;
  renderSDPeople();
}
function setSDPage(p) { sdState.page = p; renderSDPeople(); }
function sdSetPeopleStatus(key) {
  if (sdState.status === key) return; // เลือกซ้ำไม่ยกเลิก — ใช้ปุ่ม "ล้างตัวกรอง" แทน
  sdState.status = key; sdState.page = 1;
  sdState.sortKey = key === 'risk' ? 'flags' : key; sdState.sortDir = -1;
  renderSDPeople();
}

function renderSDPeople() {
  const q = document.getElementById('sd-search').value.trim().toLowerCase();
  const st = sdState.status;
  const matchQ = p => !q || p.s.name.toLowerCase().includes(q) || studentFullName(p.s).toLowerCase().includes(q) || p.s.id.toLowerCase().includes(q);
  const base = sdData.people.filter(matchQ);

  // ชิปกรอง — ตัวเลขนับตามคำค้นด้วย, เลือกได้ทีละชิป, ยกเลิกด้วยปุ่ม "ล้างตัวกรอง"
  document.getElementById('sd-people-chips').innerHTML =
    '<span style="font-size:12px;color:var(--text-muted);font-weight:600;">กรองนักเรียน:</span>' +
    SD_PEOPLE_CHIPS.map(c => {
      const n = base.filter(p => p[c.key] > 0).length;
      const on = st === c.key;
      return `<button type="button" class="badge ${n || on ? c.cls : 'muted'} att-filter-btn${on ? ' on' : ''}" ${!n && !on ? 'disabled style="opacity:.55;cursor:default;"' : ''} onclick="sdSetPeopleStatus('${c.key}')">${c.label} ${sdNum(n)} คน</button>`;
    }).join('') +
    (st !== 'all' || q ? `<button type="button" class="btn btn-secondary btn-sm" onclick="sdClearPeopleFilters()"><svg class="icon"><use href="#i-x"/></svg> ล้างตัวกรอง</button>` : '');

  document.getElementById('sd-people-thead').innerHTML = '<tr>' + SD_PEOPLE_COLS.map(c => {
    const arrow = sdState.sortKey === c.key ? `<span class="sd-sort">${sdState.sortDir > 0 ? '▲' : '▼'}</span>` : '';
    return `<th class="sortable${c.num ? ' num' : ''}" onclick="sdSort('${c.key}')">${c.label}${arrow}</th>`;
  }).join('') + '</tr>';

  const rows = base.filter(p => st === 'all' || p[st] > 0).sort(sdCompare);
  const pages = Math.max(1, Math.ceil(rows.length / SD_PAGE_SIZE));
  if (sdState.page > pages) sdState.page = pages;
  const pageRows = rows.slice((sdState.page - 1) * SD_PAGE_SIZE, sdState.page * SD_PAGE_SIZE);
  document.getElementById('sd-people-tbody').innerHTML = pageRows.map(p => `
    <tr class="sd-room-row" onclick="sdOpenStudentDrawer('${p.s.id}')" title="ดูรายละเอียดการมาเรียนของ ${p.s.name}">
      <td class="num">${p.s.no}</td><td>${p.s.cls}</td><td>${p.s.id}</td>
      <td><strong>${studentFullName(p.s)}</strong></td>
      ${sdCell(p.ontime)}${sdCell(p.late)}${sdCell(p.absent)}${sdCell(p.leave)}${sdCell(p.early)}${sdCell(p.tickets)}${sdCell(p.none)}
      ${sdRateCell(p.rate)}
      <td><div class="sd-flags">${p.flags.map(f => `<span class="badge danger">${f}</span>`).join('') || '<span class="zero">-</span>'}</div></td>
    </tr>`).join('') ||
    `<tr><td colspan="${SD_PEOPLE_COLS.length}" style="text-align:center;padding:32px;color:var(--text-muted);">ไม่พบนักเรียนตามเงื่อนไขที่เลือก</td></tr>`;

  const pager = document.getElementById('sd-people-pager');
  const countText = `${sdNum(rows.length)}${rows.length !== sdData.people.length ? ' จาก ' + sdNum(sdData.people.length) : ''} คน`;
  if (pages <= 1) { pager.innerHTML = rows.length ? `<span>${countText}</span>` : ''; return; }
  const btn = (p, label, dis) => `<button class="btn btn-secondary btn-sm" ${dis ? 'disabled' : ''} onclick="setSDPage(${p})">${label}</button>`;
  pager.innerHTML = `<span>${countText} · หน้า ${sdState.page}/${pages}</span>` +
    btn(1, '«', sdState.page === 1) + btn(sdState.page - 1, '‹ ก่อนหน้า', sdState.page === 1) +
    btn(sdState.page + 1, 'ถัดไป ›', sdState.page === pages) + btn(pages, '»', sdState.page === pages);
}

// ---- Export Excel (หลายชีต: สรุป / รายห้อง / รายบุคคล / รายวัน / บัตรขออนุญาต) ----
function sdExportExcel() { withXlsx(() => _sdExportExcel()); }
function _sdExportExcel() {
  if (typeof XLSX === 'undefined') { alert('โหลดไลบรารี Excel ไม่สำเร็จ (ต้องเชื่อมต่ออินเทอร์เน็ต)'); return; }
  if (!sdData) renderStudentDashboard();
  const d = sdData;
  const t = d.total;
  const r1 = v => v === null ? '-' : Math.round(v * 10) / 10;
  const scope = d.grade ? (d.room ? `${d.grade}/${d.room}` : d.grade) : 'ทุกชั้นเรียน';
  const prevRate = sdPrev ? sdPrev.total.rate : null;

  const summary = [
    ['แดชบอร์ดการมาเรียนของนักเรียน'], [SCHOOL_INFO.name], [],
    ['ช่วงเวลา', sdPeriodLabel(sdPeriod)], ['ช่วงวันที่', `${thaiDate(d.from)} – ${thaiDate(d.to)}`], ['ชั้นเรียน', scope],
    ['จำนวนวันเรียน', d.days.length], ['จำนวนนักเรียน', d.people.length], ['วันที่ส่งออก', thaiDate(attToday())], [],
    ['รายการ', 'จำนวน', 'หน่วย'],
    ['อัตราการมาเรียน', r1(t.rate), '%'],
    [`อัตราการมาเรียนช่วงก่อนหน้า (${sdPrev ? sdPeriodLabel(sdPrev.period) : '-'})`, r1(prevRate), '%'],
    ['มาตรงเวลา', t.ontime, 'คน-วัน'], ['มาสาย', t.late, 'คน-วัน'], ['ขาดเรียน', t.absent, 'คน-วัน'],
    ['ลา (ใบลาที่อนุมัติ)', t.leave, 'คน-วัน'], ['ออกก่อนเวลา', t.early, 'คน-วัน'], ['ยังไม่เช็คชื่อ', t.none, 'คน-วัน'],
    ['บัตรขออนุญาต (ไม่นับที่ไม่อนุมัติ)', d.tickets.length, 'ใบ'], ['นักเรียนกลุ่มเฝ้าระวัง', t.risk, 'คน'],
    ['ใบลารออนุมัติ', d.pendingLeaves, 'ใบ'], ['บัตรขออนุญาตรอตรวจสอบ', d.pendingTickets, 'ใบ'], [],
    ['หมายเหตุ'],
    ['• % มาเรียน = (มาตรงเวลา + มาสาย) ÷ จำนวนคน-วันที่เช็คชื่อแล้ว (ไม่นับวันที่ยังไม่เช็คชื่อ)'],
    [`• กลุ่มเฝ้าระวัง = มาเรียนต่ำกว่า ${SD_RISK.rate}% (เช็คชื่อแล้วอย่างน้อย ${SD_RISK.minChecked} วัน) หรือขาดติดกันตั้งแต่ ${SD_RISK.streak} วัน หรือใช้บัตรขออนุญาตตั้งแต่ ${SD_RISK.tickets} ใบ`]
  ];
  const roomRow = r => [r.cls, r.teacher || '-', r.students, r.ontime, r.late, r.absent, r.leave, r.early, r.tickets, r.none, r1(r.rate), r.risk];
  const roomSheet = [
    ['ห้อง', 'ครูประจำชั้น', 'นักเรียน (คน)', 'มาตรงเวลา', 'มาสาย', 'ขาดเรียน', 'ลา', 'ออกก่อนเวลา', 'บัตรขออนุญาต', 'ยังไม่เช็คชื่อ', '% มาเรียน', 'กลุ่มเฝ้าระวัง (คน)'],
    ...d.rooms.map(roomRow), roomRow(t)
  ];
  const peopleSheet = [
    ['ห้อง', 'เลขที่', 'รหัสนักเรียน', 'ชื่อ-นามสกุล', 'มาตรงเวลา', 'มาสาย', 'ขาดเรียน', 'ลา', 'ออกก่อนเวลา', 'บัตรขออนุญาต', 'ยังไม่เช็คชื่อ', 'วันที่เช็คชื่อแล้ว', '% มาเรียน', 'ขาดติดกันสูงสุด (วัน)', 'เฝ้าระวัง'],
    ...d.people.map(p => [p.s.cls, p.s.no, p.s.id, studentFullName(p.s), p.ontime, p.late, p.absent, p.leave, p.early, p.tickets, p.none, p.checked, r1(p.rate), p.streak, p.flags.join(', ') || '-'])
  ];
  const dailySheet = [
    ['วันที่', 'มาตรงเวลา', 'มาสาย', 'ขาดเรียน', 'ลา', 'ออกก่อนเวลา', 'ยังไม่เช็คชื่อ', 'บัตรขออนุญาต (ใบ)', '% มาเรียน'],
    ...d.daily.map(x => [thaiDate(x.date), x.ontime, x.late, x.absent, x.leave, x.early, x.none, x.tickets, r1(x.rate)])
  ];
  const ticketSheet = [
    ['วันที่', 'ช่วงเวลา', 'รหัสนักเรียน', 'ชื่อ-สกุล', 'ชั้น', 'ประเภท', 'เหตุผล', 'สถานะ'],
    ...d.tickets.map(x => [thaiDate(x.date), x.time, x.id, x.name, x.cls, x.type, x.reason, x.status])
  ];

  const wb = XLSX.utils.book_new();
  const add = (name, rows, widths) => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = widths.map(w => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  add('สรุปภาพรวม', summary, [40, 22, 10]);
  add('รายห้อง', roomSheet, [10, 26, 12, 12, 10, 10, 8, 12, 12, 12, 10, 16]);
  add('รายบุคคล', peopleSheet, [8, 8, 12, 30, 11, 9, 9, 7, 12, 12, 12, 14, 10, 16, 36]);
  add('รายวัน', dailySheet, [12, 11, 9, 9, 7, 12, 12, 16, 10]);
  add('บัตรขออนุญาต', ticketSheet, [12, 14, 12, 22, 8, 24, 24, 12]);
  XLSX.writeFile(wb, `แดชบอร์ดการมาเรียน_${scope.replace('/', '-')}_${d.from}_${d.to}.xlsx`);
}

// Initial populate on load
renderAllHistory();

// ช่องค้นหาที่ต้อง render ตารางใหญ่ใหม่ทุกครั้ง — หน่วง 200ms หลังหยุดพิมพ์ (เดิมใช้ inline oninput ยิงทุกตัวอักษร)
[
  ['sl-req-search', () => renderApproveStudentLeaveTable()],
  ['sl-profile-search', () => renderSLProfileList()],
  ['tk-req-search', () => renderApproveTicketTable()],
  ['student-list-search', () => renderStudentList()],
  ['emp-search', () => renderEmployees()],
  ['sd-search', () => { sdState.page = 1; renderSDPeople(); }],
  ['att-rep-search', () => { attReportPage = 1; renderAttendanceReport(); }],
].forEach(([id, fn]) => document.getElementById(id)?.addEventListener('input', debounce(fn, 200)));
