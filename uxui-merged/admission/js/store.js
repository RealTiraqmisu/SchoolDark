// Static In-Memory Database stored in LocalStorage for Admitify Spark Demo

const STATUS_LABEL = {
  unpaid_exam_fee: "ยังไม่ได้ชำระเงินค่าสอบ",
  paid_exam_fee: "ชำระเงินค่าสอบแล้ว",
  awaiting_results: "รอประกาศผลสอบ",
  passed: "สอบผ่าน",
  reserve: "สำรอง",
  failed: "สอบไม่ผ่าน",
  not_reported: "ยังไม่ได้รายงานตัว",
  reported: "รายงานตัวแล้ว",
  enrolled: "กำลังศึกษา / มอบตัวเสร็จสิ้น",
  graduated: "สำเร็จการศึกษา",
  resigned: "ลาออก",
  transferred: "ย้ายโรงเรียน",
  dismissed: "พ้นสภาพ",
  on_leave: "พักการเรียน",
};

const PHASE_LABEL = {
  1: "เฟสรับสมัครและคัดเลือก",
  2: "เฟสประกาศผลสอบ",
  3: "เฟสรายงานตัวและมอบตัว",
};

const PHASE_OPTIONS = {
  1: ["unpaid_exam_fee", "paid_exam_fee"],
  2: ["awaiting_results", "passed", "reserve", "failed"],
  3: ["not_reported", "reported", "enrolled"],
};

const STUDY_PLAN_OPTIONS = [
  "วิทย์-คณิต",
  "ศิลป์-คำนวณ",
  "ศิลป์-ภาษา",
  "คอมพิวเตอร์และเทคโนโลยี",
  "ทั่วไป",
];

const EMAIL_TEMPLATES = {
  passed: {
    label: "แจ้งผลสอบผ่าน (Passed Notification)",
    subject: "ขอแสดงความยินดี — ผลการสอบคัดเลือก [ชื่อนักเรียน]",
    body: `เรียน ผู้ปกครองของ [ชื่อนักเรียน]\n\nทางโรงเรียนขอแสดงความยินดี นักเรียนได้สอบคัดเลือกผ่านในแผนการเรียน [แผนการเรียน] โดยมีคะแนนรวม [คะแนนรวม]\n\nกรุณามารายงานตัวตามวันและเวลาที่กำหนด\n\nขอแสดงความนับถือ\nฝ่ายรับสมัคร`,
  },
  failed: {
    label: "แจ้งผลสอบไม่ผ่าน (Failed Notification)",
    subject: "แจ้งผลการสอบคัดเลือก — [ชื่อนักเรียน]",
    body: `เรียน ผู้ปกครองของ [ชื่อนักเรียน]\n\nขอขอบคุณที่ให้ความสนใจสมัครเรียน ในรอบนี้คะแนนรวม [คะแนนรวม] ยังไม่ผ่านเกณฑ์ของแผน [แผนการเรียน]\n\nขอแสดงความนับถือ\nฝ่ายรับสมัคร`,
  },
  missing_docs: {
    label: "แจ้งเตือนเอกสารไม่ครบ (Missing Documents)",
    subject: "เอกสารการสมัครยังไม่ครบ — [ชื่อนักเรียน]",
    body: `เรียน ผู้ปกครองของ [ชื่อนักเรียน]\n\nทางโรงเรียนตรวจสอบแล้วพบว่าเอกสารการสมัครยังไม่ครบถ้วน กรุณาส่งเอกสารเพิ่มเติมภายใน 7 วัน\n\nขอแสดงความนับถือ\nฝ่ายรับสมัคร`,
  },
  fee_reminder: {
    label: "แจ้งเตือนชำระค่าสมัครสอบ (Fee Reminder)",
    subject: "แจ้งเตือนการชำระค่าสมัครสอบ — [ชื่อนักเรียน]",
    body: `เรียน ผู้ปกครองของ [ชื่อนักเรียน]\n\nระบบยังไม่ได้รับการชำระค่าสมัครสอบของนักเรียน กรุณาชำระภายในวันที่กำหนด\n\nขอแสดงความนับถือ\nฝ่ายรับสมัคร`,
  },
};

const PLACEHOLDERS = ["[ชื่อนักเรียน]", "[แผนการเรียน]", "[คะแนนรวม]", "[ห้องเรียน]"];

const defaultFieldSettings = {
  personal: {
    title: "ประวัติส่วนตัว",
    groups: [
      {
        name: "ข้อมูลทั่วไป",
        fields: [
          { key: "photo", num: "1.", labelTh: "รูปนักเรียน", labelEn: "Student Photo", required: false, icon: "image", color: "blue" },
          { key: "student_type", num: "2.", labelTh: "ประเภท", labelEn: "Student Type", required: false, icon: "user-cog", color: "purple" },
          { key: "gender", num: "10.", labelTh: "เพศ", labelEn: "Gender", required: true, icon: "users-round", color: "pink" },
          { key: "dob", num: "11.", labelTh: "วันเกิด", labelEn: "Date of Birth", required: true, icon: "calendar", color: "amber" },
          { key: "citizen_id", num: "12.", labelTh: "รหัสบัตรประชาชน", labelEn: "Citizen ID No.", required: true, icon: "id-card", color: "indigo" }
        ]
      },
      {
        name: "ชื่อและคำนำหน้า",
        fields: [
          { key: "prefix", num: "3.", labelTh: "คำนำหน้า", labelEn: "Prefixes", required: true, icon: "user", color: "emerald" },
          { key: "first_name_th", num: "4.", labelTh: "ชื่อผู้สมัคร(ภาษาไทย)", labelEn: "Thai Name", required: true, icon: "user-check", color: "teal" },
          { key: "last_name_th", num: "5.", labelTh: "นามสกุล(ภาษาไทย)", labelEn: "Thai Last Name", required: true, icon: "user-check", color: "teal" },
          { key: "first_name_en", num: "6.", labelTh: "ชื่อผู้สมัคร(ภาษาอังกฤษ)", labelEn: "English Name", required: false, icon: "languages", color: "sky" },
          { key: "last_name_en", num: "7.", labelTh: "นามสกุล(ภาษาอังกฤษ)", labelEn: "English Last Name", required: false, icon: "languages", color: "sky" },
          { key: "nickname_th", num: "8.", labelTh: "ชื่อเล่น", labelEn: "Nickname", required: false, icon: "smile", color: "rose" },
          { key: "nickname_en", num: "9.", labelTh: "ชื่อเล่น(Eng)", labelEn: "Eng Nickname", required: false, icon: "smile", color: "rose" }
        ]
      },
      {
        name: "ครอบครัวและเชื้อชาติ",
        fields: [
          { key: "race", num: "13.", labelTh: "เชื้อชาติ", labelEn: "Race", required: true, icon: "flag", color: "red" },
          { key: "nationality", num: "14.", labelTh: "สัญชาติ", labelEn: "Nationality", required: true, icon: "globe", color: "blue" },
          { key: "religion", num: "15.", labelTh: "ศาสนา", labelEn: "Religion", required: true, icon: "heart", color: "violet" },
          { key: "siblings_count", num: "16.", labelTh: "จำนวนพี่น้อง", labelEn: "Siblings", required: true, icon: "users", color: "cyan" },
          { key: "sibling_order", num: "17.", labelTh: "เป็นบุตรคนที่", labelEn: "Your Order Among Sibling", required: true, icon: "user-plus", color: "fuchsia" }
        ]
      }
    ]
  },
  registered_address: {
    title: "ที่อยู่ตามทะเบียนบ้าน",
    groups: [
      {
        name: "ข้อมูลติดต่อพื้นฐาน",
        fields: [
          { key: "mobile", num: "10.", labelTh: "เบอร์โทรศัพท์", labelEn: "Mobile Phone", required: true, icon: "phone", color: "green" },
          { key: "email", num: "11.", labelTh: "อีเมล์", labelEn: "E-Mail", required: false, icon: "mail", color: "orange" }
        ]
      },
      {
        name: "ข้อมูลที่อยู่",
        fields: [
          { key: "house_code", num: "1.", labelTh: "รหัสประจำบ้าน", labelEn: "House Code", required: false, icon: "home", color: "amber" },
          { key: "address_no", num: "2.", labelTh: "บ้านเลขที่", labelEn: "Address No.", required: true, icon: "map-pin", color: "red" },
          { key: "soi", num: "3.", labelTh: "ซอย", labelEn: "Soi", required: false, icon: "navigation", color: "slate" },
          { key: "moo", num: "4.", labelTh: "หมู่", labelEn: "Moo", required: false, icon: "map", color: "indigo" },
          { key: "street", num: "5.", labelTh: "ถนน", labelEn: "Street", required: false, icon: "milestone", color: "violet" }
        ]
      },
      {
        name: "ข้อมูลการปกครอง",
        fields: [
          { key: "province", num: "6.", labelTh: "จังหวัด", labelEn: "Province", required: true, icon: "map-pinned", color: "cyan" },
          { key: "district", num: "7.", labelTh: "เขต/อำเภอ", labelEn: "District", required: true, icon: "map-pinned", color: "teal" },
          { key: "sub_district", num: "8.", labelTh: "แขวง/ตำบล", labelEn: "Sub District", required: true, icon: "map-pinned", color: "emerald" },
          { key: "post_code", num: "9.", labelTh: "รหัสไปรษณีย์", labelEn: "Post Code", required: true, icon: "hash", color: "rose" }
        ]
      }
    ]
  },
  current_address: {
    title: "ที่อยู่ปัจจุบัน",
    groups: [
      {
        name: "ข้อมูลที่อยู่พื้นฐาน",
        fields: [
          { key: "address_no", num: "1.", labelTh: "บ้านเลขที่", labelEn: "Address No.", required: true, icon: "map-pin", color: "red" },
          { key: "soi", num: "2.", labelTh: "ซอย", labelEn: "Soi", required: false, icon: "navigation", color: "slate" },
          { key: "moo", num: "3.", labelTh: "หมู่", labelEn: "Moo", required: false, icon: "map", color: "indigo" },
          { key: "street", num: "4.", labelTh: "ถนน", labelEn: "Street", required: false, icon: "milestone", color: "violet" },
          { key: "province", num: "5.", labelTh: "จังหวัด", labelEn: "Province", required: true, icon: "map-pinned", color: "cyan" },
          { key: "district", num: "6.", labelTh: "เขต/อำเภอ", labelEn: "District", required: true, icon: "map-pinned", color: "teal" },
          { key: "sub_district", num: "7.", labelTh: "แขวง/ตำบล", labelEn: "Sub District", required: true, icon: "map-pinned", color: "emerald" },
          { key: "post_code", num: "8.", labelTh: "รหัสไปรษณีย์", labelEn: "Post Code", required: true, icon: "hash", color: "rose" },
          { key: "mobile", num: "9.", labelTh: "เบอร์โทรศัพท์", labelEn: "Mobile Phone", required: true, icon: "phone", color: "green" },
          { key: "email", num: "10.", labelTh: "อีเมล์", labelEn: "E-Mail", required: false, icon: "mail", color: "orange" }
        ]
      },
      {
        name: "ข้อมูลผู้พักอาศัยอยู่ด้วย",
        fields: [
          { key: "stay_with_prefix", num: "11.", labelTh: "พักอาศัยอยู่กับ (คำนำหน้า)", labelEn: "Stay with (Prefixes)", required: false, icon: "user", color: "teal" },
          { key: "stay_with_first_name", num: "12.", labelTh: "พักอาศัยอยู่กับ (ชื่อ)", labelEn: "Stay with (Thai Name)", required: false, icon: "user-check", color: "emerald" },
          { key: "stay_with_last_name", num: "13.", labelTh: "พักอาศัยอยู่กับ (นามสกุล)", labelEn: "Stay with (Thai Last Name)", required: false, icon: "user-check", color: "emerald" },
          { key: "emergency_phone", num: "14.", labelTh: "ที่ติดต่อฉุกเฉิน/โทรศัพท์", labelEn: "Emergency contacts / phone", required: false, icon: "phone-call", color: "red" },
          { key: "house_style", num: "15.", labelTh: "ลักษณะบ้านที่อยู่", labelEn: "House style", required: false, icon: "home", color: "amber" }
        ]
      },
      {
        name: "ข้อมูลเพื่อนบ้านใกล้เคียง",
        fields: [
          { key: "neighbor_first_name", num: "16.", labelTh: "เพื่อนใกล้บ้าน (ชื่อ)", labelEn: "Neighbor (Thai Name)", required: false, icon: "users", color: "blue" },
          { key: "neighbor_last_name", num: "17.", labelTh: "เพื่อนใกล้บ้าน (นามสกุล)", labelEn: "Neighbor (Thai Last Name)", required: false, icon: "users", color: "blue" },
          { key: "neighbor_grade", num: "18.", labelTh: "เพื่อนใกล้บ้าน (ระดับชั้น)", labelEn: "Neighbor (Education level)", required: false, icon: "graduation-cap", color: "purple" },
          { key: "neighbor_phone", num: "19.", labelTh: "เพื่อนใกล้บ้าน (โทรศัพท์/มือถือ)", labelEn: "Neighbor (Mobile Phone)", required: false, icon: "smartphone", color: "green" }
        ]
      }
    ]
  },
  father: {
    title: "ข้อมูลบิดา",
    groups: [
      {
        name: "ข้อมูลส่วนตัวบิดา",
        fields: [
          { key: "prefix", num: "1.", labelTh: "คำนำหน้า", labelEn: "Prefixes", required: false, icon: "user", color: "teal" },
          { key: "first_name", num: "2.", labelTh: "ชื่อบิดา", labelEn: "Father's Name", required: false, icon: "user-check", color: "emerald" },
          { key: "last_name", num: "3.", labelTh: "นามสกุล", labelEn: "Last Name", required: false, icon: "user-check", color: "emerald" },
          { key: "first_name_en", num: "4.", labelTh: "ชื่อบิดา(Eng)", labelEn: "Eng Father's Name", required: false, icon: "languages", color: "sky" },
          { key: "last_name_en", num: "5.", labelTh: "นามสกุล(Eng)", labelEn: "Eng Last Name", required: false, icon: "languages", color: "sky" },
          { key: "dob", num: "6.", labelTh: "วันเกิด", labelEn: "Date of Birth", required: false, icon: "calendar", color: "amber" },
          { key: "citizen_id", num: "7.", labelTh: "รหัสบัตรประชาชน", labelEn: "Citizen ID No.", required: false, icon: "id-card", color: "indigo" },
          { key: "race", num: "8.", labelTh: "เชื้อชาติ", labelEn: "Race", required: false, icon: "flag", color: "red" },
          { key: "nationality", num: "9.", labelTh: "สัญชาติ", labelEn: "Nationality", required: false, icon: "globe", color: "blue" },
          { key: "religion", num: "10.", labelTh: "ศาสนา", labelEn: "Religion", required: false, icon: "heart", color: "violet" },
          { key: "education", num: "11.", labelTh: "วุฒิการศึกษา", labelEn: "Degree of Education", required: false, icon: "graduation-cap", color: "purple" }
        ]
      },
      {
        name: "ข้อมูลที่อยู่บิดา",
        fields: [
          { key: "address_no", num: "12.", labelTh: "บ้านเลขที่", labelEn: "Address No.", required: false, icon: "map-pin", color: "red" },
          { key: "soi", num: "13.", labelTh: "ซอย", labelEn: "Soi", required: false, icon: "navigation", color: "slate" },
          { key: "moo", num: "14.", labelTh: "หมู่", labelEn: "Moo", required: false, icon: "map", color: "indigo" },
          { key: "street", num: "15.", labelTh: "ถนน", labelEn: "Street", required: false, icon: "milestone", color: "violet" },
          { key: "province", num: "16.", labelTh: "จังหวัด", labelEn: "Province", required: false, icon: "map-pinned", color: "cyan" },
          { key: "district", num: "17.", labelTh: "เขต/อำเภอ", labelEn: "District", required: false, icon: "map-pinned", color: "teal" },
          { key: "sub_district", num: "18.", labelTh: "แขวง/ตำบล", labelEn: "Sub District", required: false, icon: "map-pinned", color: "emerald" },
          { key: "post_code", num: "19.", labelTh: "รหัสไปรษณีย์", labelEn: "Post Code", required: false, icon: "hash", color: "rose" }
        ]
      },
      {
        name: "อาชีพและการติดต่อ",
        fields: [
          { key: "occupation", num: "20.", labelTh: "อาชีพ", labelEn: "Occupation", required: false, icon: "briefcase", color: "blue" },
          { key: "company", num: "21.", labelTh: "สถานที่ทำงาน", labelEn: "Company's Name", required: false, icon: "building", color: "indigo" },
          { key: "monthly_income", num: "22.", labelTh: "รายได้ต่อเดือน", labelEn: "Monthly Income", required: false, icon: "wallet", color: "emerald" },
          { key: "yearly_income", num: "23.", labelTh: "รายได้ต่อปี", labelEn: "Yearly Income", required: false, icon: "banknote", color: "teal" },
          { key: "home_phone", num: "24.", labelTh: "เบอร์โทรศัพท์(บ้าน)", labelEn: "Telephone Number", required: false, icon: "phone", color: "slate" },
          { key: "mobile", num: "25.", labelTh: "เบอร์โทรศัพท์(มือถือ)", labelEn: "Mobile Phone", required: false, icon: "smartphone", color: "green" },
          { key: "work_phone", num: "26.", labelTh: "เบอร์โทรศัพท์(ที่ทำงาน)", labelEn: "Work Phone Number", required: false, icon: "phone-forwarded", color: "violet" },
          { key: "email", num: "27.", labelTh: "อีเมล์", labelEn: "E-Mail", required: false, icon: "mail", color: "orange" }
        ]
      }
    ]
  },
  mother: {
    title: "ข้อมูลมารดา",
    groups: [
      {
        name: "ข้อมูลส่วนตัวมารดา",
        fields: [
          { key: "prefix", num: "1.", labelTh: "คำนำหน้า", labelEn: "Prefixes", required: false, icon: "user", color: "teal" },
          { key: "first_name", num: "2.", labelTh: "ชื่อมารดา", labelEn: "Mother's Name", required: false, icon: "user-check", color: "emerald" },
          { key: "last_name", num: "3.", labelTh: "นามสกุล", labelEn: "Last Name", required: false, icon: "user-check", color: "emerald" },
          { key: "first_name_en", num: "4.", labelTh: "ชื่อมารดา(Eng)", labelEn: "Eng Mother's Name", required: false, icon: "languages", color: "sky" },
          { key: "last_name_en", num: "5.", labelTh: "นามสกุล(Eng)", labelEn: "Eng Last Name", required: false, icon: "languages", color: "sky" },
          { key: "dob", num: "6.", labelTh: "วันเกิด", labelEn: "Date of Birth", required: false, icon: "calendar", color: "amber" },
          { key: "citizen_id", num: "7.", labelTh: "รหัสบัตรประชาชน", labelEn: "Citizen ID No.", required: false, icon: "id-card", color: "indigo" },
          { key: "race", num: "8.", labelTh: "เชื้อชาติ", labelEn: "Race", required: false, icon: "flag", color: "red" },
          { key: "nationality", num: "9.", labelTh: "สัญชาติ", labelEn: "Nationality", required: false, icon: "globe", color: "blue" },
          { key: "religion", num: "10.", labelTh: "ศาสนา", labelEn: "Religion", required: false, icon: "heart", color: "violet" },
          { key: "education", num: "11.", labelTh: "วุฒิการศึกษา", labelEn: "Degree of Education", required: false, icon: "graduation-cap", color: "purple" }
        ]
      },
      {
        name: "ข้อมูลที่อยู่มารดา",
        fields: [
          { key: "address_no", num: "12.", labelTh: "บ้านเลขที่", labelEn: "Address No.", required: false, icon: "map-pin", color: "red" },
          { key: "soi", num: "13.", labelTh: "ซอย", labelEn: "Soi", required: false, icon: "navigation", color: "slate" },
          { key: "moo", num: "14.", labelTh: "หมู่", labelEn: "Moo", required: false, icon: "map", color: "indigo" },
          { key: "street", num: "15.", labelTh: "ถนน", labelEn: "Street", required: false, icon: "milestone", color: "violet" },
          { key: "province", num: "16.", labelTh: "จังหวัด", labelEn: "Province", required: false, icon: "map-pinned", color: "cyan" },
          { key: "district", num: "17.", labelTh: "เขต/อำเภอ", labelEn: "District", required: false, icon: "map-pinned", color: "teal" },
          { key: "sub_district", num: "18.", labelTh: "แขวง/ตำบล", labelEn: "Sub District", required: false, icon: "map-pinned", color: "emerald" },
          { key: "post_code", num: "19.", labelTh: "รหัสไปรษณีย์", labelEn: "Post Code", required: false, icon: "hash", color: "rose" }
        ]
      },
      {
        name: "อาชีพและการติดต่อ",
        fields: [
          { key: "occupation", num: "20.", labelTh: "อาชีพ", labelEn: "Occupation", required: false, icon: "briefcase", color: "blue" },
          { key: "company", num: "21.", labelTh: "สถานที่ทำงาน", labelEn: "Company's Name", required: false, icon: "building", color: "indigo" },
          { key: "monthly_income", num: "22.", labelTh: "รายได้ต่อเดือน", labelEn: "Monthly Income", required: false, icon: "wallet", color: "emerald" },
          { key: "yearly_income", num: "23.", labelTh: "รายได้ต่อปี", labelEn: "Yearly Income", required: false, icon: "banknote", color: "teal" },
          { key: "home_phone", num: "24.", labelTh: "เบอร์โทรศัพท์(บ้าน)", labelEn: "Telephone Number", required: false, icon: "phone", color: "slate" },
          { key: "mobile", num: "25.", labelTh: "เบอร์โทรศัพท์(มือถือ)", labelEn: "Mobile Phone", required: false, icon: "smartphone", color: "green" },
          { key: "work_phone", num: "26.", labelTh: "เบอร์โทรศัพท์(ที่ทำงาน)", labelEn: "Work Phone Number", required: false, icon: "phone-forwarded", color: "violet" },
          { key: "email", num: "27.", labelTh: "อีเมล์", labelEn: "E-Mail", required: false, icon: "mail", color: "orange" }
        ]
      }
    ]
  },
  guardian: {
    title: "ข้อมูลผู้ปกครอง",
    groups: [
      {
        name: "ความสัมพันธ์และประเภท",
        fields: [
          { key: "relationship", num: "1.", labelTh: "ความสัมพันธ์", labelEn: "Relationship", required: false, icon: "users-round", color: "blue" },
          { key: "relationship_specify", num: "2.", labelTh: "ระบุความสัมพันธ์", labelEn: "Relationship", required: false, icon: "pencil", color: "slate" },
          { key: "family_status", num: "14.", labelTh: "สถานะครอบครัว", labelEn: "Family Status", required: false, icon: "heart-crack", color: "red" }
        ]
      },
      {
        name: "ข้อมูลส่วนตัวผู้ปกครอง",
        fields: [
          { key: "prefix", num: "3.", labelTh: "คำนำหน้า", labelEn: "Prefixes", required: true, icon: "user", color: "teal" },
          { key: "first_name", num: "4.", labelTh: "ชื่อผู้ปกครอง(ภาษาไทย)", labelEn: "Thai Name", required: true, icon: "user-check", color: "emerald" },
          { key: "last_name", num: "5.", labelTh: "นามสกุล(ภาษาไทย)", labelEn: "Thai Last Name", required: true, icon: "user-check", color: "emerald" },
          { key: "first_name_en", num: "6.", labelTh: "ชื่อผู้ปกครอง(ภาษาอังกฤษ)", labelEn: "English Name", required: false, icon: "languages", color: "sky" },
          { key: "last_name_en", num: "7.", labelTh: "นามสกุล(ภาษาอังกฤษ)", labelEn: "English Last Name", required: false, icon: "languages", color: "sky" },
          { key: "dob", num: "8.", labelTh: "วันเกิด", labelEn: "Date of Birth", required: false, icon: "calendar", color: "amber" },
          { key: "citizen_id", num: "9.", labelTh: "รหัสบัตรประชาชน", labelEn: "Citizen ID No.", required: false, icon: "id-card", color: "indigo" },
          { key: "race", num: "10.", labelTh: "เชื้อชาติ", labelEn: "Race", required: false, icon: "flag", color: "red" },
          { key: "nationality", num: "11.", labelTh: "สัญชาติ", labelEn: "Nationality", required: false, icon: "globe", color: "blue" },
          { key: "religion", num: "12.", labelTh: "ศาสนา", labelEn: "Religion", required: false, icon: "heart", color: "violet" },
          { key: "education", num: "13.", labelTh: "วุฒิการศึกษา", labelEn: "Degree of Education", required: false, icon: "graduation-cap", color: "purple" }
        ]
      },
      {
        name: "ข้อมูลที่อยู่ผู้ปกครอง",
        fields: [
          { key: "address_no", num: "15.", labelTh: "บ้านเลขที่", labelEn: "Address No.", required: false, icon: "map-pin", color: "red" },
          { key: "soi", num: "16.", labelTh: "ซอย", labelEn: "Soi", required: false, icon: "navigation", color: "slate" },
          { key: "moo", num: "17.", labelTh: "หมู่", labelEn: "Moo", required: false, icon: "map", color: "indigo" },
          { key: "street", num: "18.", labelTh: "ถนน", labelEn: "Street", required: false, icon: "milestone", color: "violet" },
          { key: "province", num: "19.", labelTh: "จังหวัด", labelEn: "Province", required: false, icon: "map-pinned", color: "cyan" },
          { key: "district", num: "20.", labelTh: "เขต/อำเภอ", labelEn: "District", required: false, icon: "map-pinned", color: "teal" },
          { key: "sub_district", num: "21.", labelTh: "แขวง/ตำบล", labelEn: "Sub District", required: false, icon: "map-pinned", color: "emerald" },
          { key: "post_code", num: "22.", labelTh: "รหัสไปรษณีย์", labelEn: "Post Code", required: false, icon: "hash", color: "rose" }
        ]
      },
      {
        name: "อาชีพและการติดต่อ",
        fields: [
          { key: "occupation", num: "23.", labelTh: "อาชีพ", labelEn: "Occupation", required: false, icon: "briefcase", color: "blue" },
          { key: "company", num: "24.", labelTh: "สถานที่ทำงาน", labelEn: "Company's Name", required: false, icon: "building", color: "indigo" },
          { key: "monthly_income", num: "25.", labelTh: "รายได้ต่อเดือน", labelEn: "Monthly Income", required: false, icon: "wallet", color: "emerald" },
          { key: "yearly_income", num: "26.", labelTh: "รายได้ต่อปี", labelEn: "Yearly Income", required: false, icon: "banknote", color: "teal" },
          { key: "home_phone", num: "27.", labelTh: "เบอร์โทรศัพท์(บ้าน)", labelEn: "Telephone Number", required: false, icon: "phone", color: "slate" },
          { key: "mobile", num: "28.", labelTh: "เบอร์โทรศัพท์(มือถือ)", labelEn: "Mobile Phone", required: false, icon: "smartphone", color: "green" },
          { key: "work_phone", num: "29.", labelTh: "เบอร์โทรศัพท์(ที่ทำงาน)", labelEn: "Work Phone Number", required: false, icon: "phone-forwarded", color: "violet" },
          { key: "email", num: "30.", labelTh: "อีเมล์", labelEn: "E-Mail", required: false, icon: "mail", color: "orange" }
        ]
      }
    ]
  },
  education: {
    title: "ข้อมูลทางการศึกษานักเรียน",
    groups: [
      {
        name: "ข้อมูลสถาบันเดิม",
        fields: [
          { key: "former_school", num: "1.", labelTh: "สถานศึกษาเดิม", labelEn: "Former School", required: true, icon: "school", color: "blue" },
          { key: "province", num: "2.", labelTh: "จังหวัด", labelEn: "Province", required: true, icon: "map-pinned", color: "cyan" },
          { key: "district", num: "3.", labelTh: "อำเภอ", labelEn: "District", required: true, icon: "map-pinned", color: "teal" },
          { key: "sub_district", num: "4.", labelTh: "ตำบล", labelEn: "Sub District", required: true, icon: "map-pinned", color: "emerald" }
        ]
      },
      {
        name: "ข้อมูลวุฒิและผลการเรียน",
        fields: [
          { key: "education_level", num: "5.", labelTh: "วุฒิการศึกษา", labelEn: "Degree of Education", required: true, icon: "graduation-cap", color: "purple" },
          { key: "gpa", num: "6.", labelTh: "หน่วยกิจการเรียนที่ได้(GPA)", labelEn: "Grade Point Average Earned(GPA)", required: false, icon: "award", color: "amber" }
        ]
      }
    ]
  },
  health: {
    title: "ข้อมูลสุขภาพ",
    groups: [
      {
        name: "ข้อมูลสุขภาพพื้นฐาน",
        fields: [
          { key: "weight", num: "1.", labelTh: "น้ำหนักปัจจุบัน", labelEn: "Weight", required: false, icon: "weight", color: "blue" },
          { key: "height", num: "2.", labelTh: "ส่วนสูงปัจจุบัน", labelEn: "Height", required: false, icon: "ruler", color: "teal" },
          { key: "blood_type", num: "3.", labelTh: "กรุ๊ปเลือด", labelEn: "Blood Type", required: false, icon: "droplet", color: "red" }
        ]
      },
      {
        name: "ประวัติการแพ้และโรคประจำตัว",
        fields: [
          { key: "allergy_symptoms", num: "4.", labelTh: "อาการโรคภูมิแพ้", labelEn: "Allergy Symptoms", required: false, icon: "frown", color: "orange" },
          { key: "food_allergy", num: "5.", labelTh: "แพ้อาหาร", labelEn: "Food Allergy", required: false, icon: "soup", color: "amber" },
          { key: "drug_allergy", num: "6.", labelTh: "แพ้ยา", labelEn: "Drug(s) Allergy", required: false, icon: "pill", color: "rose" },
          { key: "other_allergy", num: "7.", labelTh: "แพ้อื่นๆ", labelEn: "Other Allergy", required: false, icon: "shield-alert", color: "slate" },
          { key: "chronic_disease", num: "8.", labelTh: "โรคประจำตัว", labelEn: "Chronic Disease", required: false, icon: "activity", color: "indigo" },
          { key: "serious_illness", num: "9.", labelTh: "โรคร้ายแรง", labelEn: "Serious Illness or Medical Condition", required: false, icon: "heart-pulse", color: "fuchsia" }
        ]
      }
    ]
  },
  documents: {
    title: "หลักฐานการสมัคร",
    groups: [
      {
        name: "เอกสารส่วนตัวนักเรียน",
        fields: [
          { key: "birth_cert", num: "1.", labelTh: "สำเนาสูติบัตรหรือบัตรประชาชน จำนวน 1 ฉบับ กรณีเกิดต่างประเทศให้มีฉบับแปลเป็นภาษาไทยแนบมาด้วย", labelEn: "One copy of the birth certificate or ID card, in case of foreign birth, a Thai translation must be attached.", required: false, icon: "file-text", color: "blue" }
        ]
      },
      {
        name: "เอกสารทะเบียนบ้าน",
        fields: [
          { key: "student_house_reg_header", num: "2.", labelTh: "สำเนาทะเบียนบ้านนักเรียน บิดา และมารดา", labelEn: "A copy of the student's house registration, father and mother", required: false, isHeader: true, icon: "folder", color: "indigo" },
          { key: "student_house_reg", num: "2.1.", labelTh: "สำเนาทะเบียนบ้านนักเรียน จำนวน 1 ฉบับ", labelEn: "A copy of the student's house registration 1 copy", required: false, icon: "file", color: "indigo" },
          { key: "father_house_reg", num: "2.2.", labelTh: "สำเนาทะเบียนบ้านบิดา จำนวน 1 ฉบับ", labelEn: "A copy of the father's house registration 1 copy", required: false, icon: "file", color: "indigo" },
          { key: "mother_house_reg", num: "2.3.", labelTh: "สำเนาทะเบียนบ้านมารดา จำนวน 1 ฉบับ", labelEn: "A copy of the mother's house registration 1 copy", required: false, icon: "file", color: "indigo" },
          { key: "owner_house_reg", num: "2.4.", labelTh: "สำเนาหลักฐานเป็นเจ้าบ้านหรือเจ้าของบ้าน", labelEn: "A copy of the host or homeowner", required: false, icon: "file-check", color: "teal" }
        ]
      },
      {
        name: "เอกสารบัตรประชาชนผู้ปกครอง",
        fields: [
          { key: "parent_id_card_header", num: "3.", labelTh: "สำเนาบัตรประชาชน บิดา และมารดา", labelEn: "Copy of ID card of father and mother", required: false, isHeader: true, icon: "folder", color: "amber" },
          { key: "father_id_card", num: "3.1.", labelTh: "สำเนาบัตรประชาชนบิดา จำนวน 1 ฉบับ", labelEn: "A copy of father ID card 1 copy", required: false, icon: "file", color: "amber" },
          { key: "mother_id_card", num: "3.2.", labelTh: "สำเนาบัตรประชาชนมารดา จำนวน 1 ฉบับ", labelEn: "A copy of mother ID card 1 copy", required: false, icon: "file", color: "amber" }
        ]
      },
      {
        name: "เอกสารทางการเรียน",
        fields: [
          { key: "transcript_header", num: "4.", labelTh: "สำเนาระเบียนแสดงผลการเรียน (ปพ.1)", labelEn: "A copy of the Transcript", required: false, isHeader: true, icon: "folder", color: "purple" },
          { key: "transcript_front", num: "4.1.", labelTh: "สำเนาระเบียนแสดงผลการเรียน (ปพ.1) \"ด้านหน้า\" จำนวน 1 ฉบับ", labelEn: "A copy of the Transcript, front document 1 copy", required: false, icon: "file", color: "purple" },
          { key: "transcript_back", num: "4.2.", labelTh: "สำเนาระเบียนแสดงผลการเรียน (ปพ.1) \"ด้านหลัง\" จำนวน 1 ฉบับ", labelEn: "A copy of the Transcript, back document 1 copy", required: false, icon: "file", color: "purple" },
          { key: "portfolio", num: "6.", labelTh: "แฟ้มสะสมผลงาน (Portfolio) เฉพาะนักเรียน ชั้น ม.1 และ ม.4", labelEn: "Portfolio, only for students in grades 1 and 4", required: false, icon: "book-open", color: "fuchsia" }
        ]
      },
      {
        name: "หลักฐานอื่นๆ",
        fields: [
          { key: "name_change_header", num: "5.", labelTh: "สำเนาหลักฐานการเปลี่ยนชื่อ-สกุล นักเรียน บิดา และมารดา (ถ้ามี)", labelEn: "Copy of proof of name-surname change student, father and mother (if any)", required: false, isHeader: true, icon: "folder", color: "rose" },
          { key: "name_change_student", num: "5.1.", labelTh: "สำเนาหลักฐานการเปลี่ยนชื่อ-สกุล นักเรียน (ถ้ามี)", labelEn: "Copy of proof of name-surname change of student(if any)", required: false, icon: "file", color: "rose" },
          { key: "name_change_father", num: "5.2.", labelTh: "สำเนาหลักฐานการเปลี่ยนชื่อ-สกุล บิดา (ถ้ามี)", labelEn: "Copy of proof of name-surname change of father (if any)", required: false, icon: "file", color: "rose" },
          { key: "name_change_mother", num: "5.3.", labelTh: "สำเนาหลักฐานการเปลี่ยนชื่อ-สกุล มารดา (ถ้ามี)", labelEn: "Copy of proof of name-surname change of mother (if any)", required: false, icon: "file", color: "rose" },
          { key: "adoption_cert", num: "7.", labelTh: "สำเนาใบจดทะเบียนเป็นบุตรบุญธรรม (กรณีรับเป็นบุตรบุญธรรม) จำนวน 1 ฉบับ", labelEn: "Copy of adoption registration certificate (In the case of adoption) 1 copy", required: false, icon: "file-check", color: "slate" },
          { key: "medical_cert", num: "8.", labelTh: "ใบรับรองแพทย์ (โรงพยาบาลหรือคลินิก)", labelEn: "Medical certificate (Hospital or Clinic)", required: false, icon: "stethoscope", color: "emerald" },
          { key: "payment_slip", num: "9.", labelTh: "หลักฐานการโอนเงินค่าธรรมเนียมการสมัคร (สลิปการโอนเงิน)", labelEn: "Proof of transfer of the application fee (transfer slip)", required: false, icon: "receipt", color: "green" }
        ]
      }
    ]
  }
};

const defaultCoursePlans = [
  {
    id: "p1",
    level: "ม.1",
    name: "ห้องเรียนพิเศษ (Gifted)",
    capacity: 30,
    regulations: "รับสมัครนักเรียนที่สำเร็จการศึกษาชั้น ป.6 มีคะแนนเฉลี่ยสะสม ป.4-ป.5 ไม่ต่ำกว่า 3.00",
    regDates: {
      applyStart: "2026-07-01",
      applyEnd: "2026-07-10",
      exam: "2026-07-15",
      announce: "2026-07-18",
      report: "2026-07-21",
      enroll: "2026-07-24"
    }
  },
  {
    id: "p2",
    level: "ม.1",
    name: "ทั่วไป",
    capacity: 120,
    regulations: "รับสมัครนักเรียนที่สำเร็จการศึกษาชั้น ป.6 ทั่วไป ไม่กำหนดเกณฑ์คะแนนเฉลี่ยขั้นต่ำ",
    regDates: {
      applyStart: "2026-07-05",
      applyEnd: "2026-07-20",
      exam: "2026-07-25",
      announce: "2026-07-28",
      report: "2026-08-01",
      enroll: "2026-08-04"
    }
  },
  {
    id: "p3",
    level: "ม.4",
    name: "วิทย์-คณิต",
    capacity: 40,
    regulations: "รับสมัครนักเรียนที่สำเร็จการศึกษาชั้น ม.3 หรือเทียบเท่า เกรดเฉลี่ยกลุ่มสาระวิทย์-คณิต ไม่ต่ำกว่า 3.00",
    regDates: {
      applyStart: "2026-07-01",
      applyEnd: "2026-07-15",
      exam: "2026-07-20",
      announce: "2026-07-25",
      report: "2026-07-28",
      enroll: "2026-07-30"
    }
  },
  {
    id: "p4",
    level: "ม.4",
    name: "ศิลป์-คำนวณ",
    capacity: 40,
    regulations: "รับสมัครนักเรียนที่สำเร็จการศึกษาชั้น ม.3 หรือเทียบเท่า เกรดเฉลี่ยวิชาคณิตศาสตร์และภาษาอังกฤษ ไม่ต่ำกว่า 2.75",
    regDates: {
      applyStart: "2026-07-01",
      applyEnd: "2026-07-15",
      exam: "2026-07-20",
      announce: "2026-07-25",
      report: "2026-07-28",
      enroll: "2026-07-30"
    }
  },
  {
    id: "p5",
    level: "ม.4",
    name: "ศิลป์-ภาษา",
    capacity: 40,
    regulations: "รับสมัครนักเรียนที่สำเร็จการศึกษาชั้น ม.3 หรือเทียบเท่า มีเกรดเฉลี่ยสะสมไม่ต่ำกว่า 2.50",
    regDates: {
      applyStart: "2026-07-01",
      applyEnd: "2026-07-15",
      exam: "2026-07-20",
      announce: "2026-07-25",
      report: "2026-07-28",
      enroll: "2026-07-30"
    }
  }
];

const defaultExamRooms = [
  {
    id: "er1",
    name: "ห้องสอบที่ 1",
    planId: "p3",
    roomName: "ห้อง 321 (อาคาร 3 ชั้น 2)",
    capacity: 30
  },
  {
    id: "er2",
    name: "ห้องสอบที่ 2",
    planId: "p1",
    roomName: "ห้อง 431 (อาคาร 4 ชั้น 3)",
    capacity: 30
  }
];

// รายการคอลัมน์ของตารางข้อมูลนักเรียนใน students.html — แหล่งความจริงเดียวที่ทั้งหน้าตั้งค่าคอลัมน์
// (student_field_settings.html) และตัวตารางเองอ่านค่าร่วมกัน (task-11)
//   visible — แสดงในตารางหรือไม่ (เพิ่ม/ลดคอลัมน์)
//   primary — คอลัมน์หลัก มีได้ทีละ 1 คอลัมน์ เป็นเซลล์ที่คลิกเปิดโปรไฟล์ได้ ซ่อนไม่ได้
//   locked  — คอลัมน์เดิมของระบบ ลบไม่ได้ (แก้ชื่อ/ปิดการแสดงผลได้ แต่ลบทิ้งไม่ได้)
//   field   — key ในเรคคอร์ดนักเรียน รองรับ path ตื้นๆ เช่น "examScore.gpa"
const defaultStudentColumns = [
  { id: "seq",        labelTh: "ลำดับ",             field: "__seq__",  visible: true, primary: false, locked: true,  align: "center" },
  { id: "seat",       labelTh: "เลขที่",             field: "seatNumber", visible: true, primary: false, locked: true,  align: "center" },
  { id: "studentId",  labelTh: "รหัสนักเรียน (Username)", field: "studentId", visible: true, primary: false, locked: true, align: "left" },
  { id: "prefix",     labelTh: "คำนำหน้า",           field: "prefix",     visible: true, primary: false, locked: true,  align: "left" },
  { id: "firstName",  labelTh: "ชื่อ",               field: "firstName",  visible: true, primary: true,  locked: true,  align: "left" },
  { id: "lastName",   labelTh: "นามสกุล",            field: "lastName",   visible: true, primary: false, locked: true,  align: "left" },
  { id: "classroom",  labelTh: "ชั้นเรียน",           field: "classroom",  visible: true, primary: false, locked: true,  align: "left" },
  { id: "status",     labelTh: "สถานะ",              field: "status",     visible: true, primary: false, locked: true,  align: "left" },
  { id: "admitDate",  labelTh: "วันที่เข้าเรียน",      field: "appliedAt",  visible: true, primary: false, locked: true,  align: "left" },
  // คอลัมน์สำรอง ปิดไว้เป็นค่าเริ่มต้น — เปิดได้จากหน้าตั้งค่าคอลัมน์ (อ้างอิง field จาก IMPORT_TEMPLATE_COLUMNS ใน students.html)
  { id: "studyPlan",  labelTh: "แผนการเรียน",         field: "studyPlan",       visible: false, primary: false, locked: false, align: "left" },
  { id: "citizenId",  labelTh: "เลขประจำตัวประชาชน",  field: "citizenId",       visible: false, primary: false, locked: false, align: "left" },
  { id: "parentEmail",labelTh: "อีเมลผู้ปกครอง",       field: "parentEmail",     visible: false, primary: false, locked: false, align: "left" },
  { id: "gpax",       labelTh: "เกรดเฉลี่ย (GPAX)",   field: "examScore.gpa",  visible: false, primary: false, locked: false, align: "center" },
  { id: "examRoom",   labelTh: "ห้องสอบ",            field: "examRoom",       visible: false, primary: false, locked: false, align: "left" }
];

const schoolRooms = [
  { name: "ห้อง 321 (อาคาร 3 ชั้น 2)", capacity: 30 },
  { name: "ห้อง 322 (อาคาร 3 ชั้น 2)", capacity: 30 },
  { name: "ห้อง 323 (อาคาร 3 ชั้น 2)", capacity: 30 },
  { name: "ห้อง 431 (อาคาร 4 ชั้น 3)", capacity: 30 },
  { name: "ห้อง 432 (อาคาร 4 ชั้น 3)", capacity: 35 },
  { name: "ห้อง 541 (อาคาร 5 ชั้น 4)", capacity: 40 },
  { name: "ห้อง 542 (อาคาร 5 ชั้น 4)", capacity: 40 },
  { name: "ห้อง 543 (อาคาร 5 ชั้น 4)", capacity: 40 },
  { name: "ห้องประชุมใหญ่อาคาร 1", capacity: 120 }
];

const seedApplicants = [
  {
    id: "a1",
    applicantCode: "APP-2568-0001",
    firstName: "สมชาย",
    lastName: "ใจดี",
    appliedAt: "2025-11-02T09:15:00",
    gradeLevel: "ม.1",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "1",
    feePaid: false,
    status: "unpaid_exam_fee",
    parentEmail: "parent.somchai@example.com",
  },
  {
    id: "a2",
    applicantCode: "APP-2568-0002",
    firstName: "สมหญิง",
    lastName: "รักเรียน",
    appliedAt: "2025-11-02T10:42:00",
    gradeLevel: "ม.1",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "2",
    feePaid: true,
    status: "paid_exam_fee",
    parentEmail: "parent.somying@example.com",
  },
  {
    id: "a3",
    applicantCode: "APP-2568-0003",
    firstName: "ธนวัฒน์",
    lastName: "พงศ์ไพบูลย์",
    appliedAt: "2025-11-03T08:05:00",
    gradeLevel: "ม.4",
    studyPlan: "ศิลป์-ภาษา",
    documentsComplete: false,
    examRoom: "ห้อง B",
    seatNumber: "12",
    feePaid: true,
    status: "awaiting_results",
    parentEmail: "parent.thana@example.com",
    paymentSlipUrl: "https://placehold.co/600x400?text=Slip",
  },
  {
    id: "a4",
    applicantCode: "APP-2568-0004",
    firstName: "พิชญา",
    lastName: "สุขสวัสดิ์",
    appliedAt: "2025-11-03T11:30:00",
    gradeLevel: "ม.4",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง C",
    seatNumber: "5",
    feePaid: true,
    examScore: { raw: 87, gpa: 3.8 },
    status: "passed",
    parentEmail: "parent.pichaya@example.com",
  },
  {
    id: "a5",
    applicantCode: "APP-2568-0005",
    firstName: "ภาคิน",
    lastName: "ตั้งใจ",
    appliedAt: "2025-11-04T14:00:00",
    gradeLevel: "ม.1",
    studyPlan: "ทั่วไป",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "8",
    feePaid: true,
    examScore: { raw: 65, gpa: 2.9 },
    reserveRank: 3,
    status: "reserve",
    parentEmail: "parent.pakin@example.com",
  },
  {
    id: "a6",
    applicantCode: "APP-2568-0006",
    firstName: "อรวรา",
    lastName: "เกษมสุข",
    appliedAt: "2025-11-04T16:20:00",
    gradeLevel: "ม.4",
    studyPlan: "ศิลป์-คำนวณ",
    documentsComplete: true,
    examRoom: "ห้อง B",
    seatNumber: "20",
    feePaid: true,
    examScore: { raw: 78, gpa: 3.5 },
    status: "reported",
    parentEmail: "parent.orawara@example.com",
  },
  {
    id: "a7",
    applicantCode: "APP-2568-0007",
    firstName: "ณัฐภัทร",
    lastName: "วงศ์ดี",
    appliedAt: "2025-11-05T09:00:00",
    gradeLevel: "ม.1",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "11",
    feePaid: true,
    examScore: { raw: 92, gpa: 3.95 },
    status: "enrolled",
    studentId: "STD-2568-0001",
    parentEmail: "parent.natthapat@example.com",
  },
  {
    id: "a8",
    applicantCode: "APP-2568-0008",
    firstName: "สมเจตน์",
    lastName: "ตั้งมั่น",
    appliedAt: "2025-11-05T10:15:00",
    gradeLevel: "ม.4",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง C",
    seatNumber: "15",
    feePaid: true,
    examScore: { raw: 85, gpa: 3.72 },
    status: "enrolled",
    studentId: "STD-2568-0002",
    parentEmail: "parent.somjet@example.com",
  },
  {
    id: "a9",
    applicantCode: "APP-2568-0009",
    firstName: "กนกวรรณ",
    lastName: "รักษ์ดี",
    appliedAt: "2025-11-05T11:45:00",
    gradeLevel: "ม.1",
    studyPlan: "ทั่วไป",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "22",
    feePaid: true,
    examScore: { raw: 74, gpa: 3.12 },
    status: "enrolled",
    studentId: "STD-2568-0003",
    parentEmail: "parent.kanokwan@example.com",
  },
  {
    id: "a10",
    applicantCode: "APP-2568-0010",
    firstName: "นนทพัทธ์",
    lastName: "เกียรติคุณ",
    appliedAt: "2025-11-06T09:30:00",
    gradeLevel: "ม.4",
    studyPlan: "ศิลป์-คำนวณ",
    documentsComplete: true,
    examRoom: "ห้อง B",
    seatNumber: "4",
    feePaid: true,
    examScore: { raw: 88, gpa: 3.85 },
    status: "enrolled",
    studentId: "STD-2568-0004",
    parentEmail: "parent.nonthapat@example.com",
  },
  {
    id: "a11",
    applicantCode: "APP-2567-0101",
    firstName: "ชนาธิป",
    lastName: "เจริญพร",
    appliedAt: "2024-11-02T10:00:00",
    gradeLevel: "ม.2",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "3",
    feePaid: true,
    examScore: { raw: 82, gpa: 3.65 },
    status: "enrolled",
    studentId: "STD-2567-0012",
    parentEmail: "parent.chanathip@example.com",
  },
  {
    id: "a12",
    applicantCode: "APP-2567-0102",
    firstName: "ศิริพร",
    lastName: "บุญมี",
    appliedAt: "2024-11-03T11:20:00",
    gradeLevel: "ม.2",
    studyPlan: "ทั่วไป",
    documentsComplete: true,
    examRoom: "ห้อง B",
    seatNumber: "9",
    feePaid: true,
    examScore: { raw: 79, gpa: 3.4 },
    status: "enrolled",
    studentId: "STD-2567-0045",
    parentEmail: "parent.siriporn@example.com",
  },
  {
    id: "a13",
    applicantCode: "APP-2566-0201",
    firstName: "กิตติพงษ์",
    lastName: "อินทร์ทอง",
    appliedAt: "2023-11-01T08:30:00",
    gradeLevel: "ม.3",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "1",
    feePaid: true,
    examScore: { raw: 91, gpa: 3.92 },
    status: "enrolled",
    studentId: "STD-2566-0005",
    parentEmail: "parent.kittipong@example.com",
  },
  {
    id: "a14",
    applicantCode: "APP-2566-0202",
    firstName: "พัชรินทร์",
    lastName: "แซ่ลิ้ม",
    appliedAt: "2023-11-04T13:10:00",
    gradeLevel: "ม.3",
    studyPlan: "ศิลป์-ภาษา",
    documentsComplete: true,
    examRoom: "ห้อง C",
    seatNumber: "14",
    feePaid: true,
    examScore: { raw: 84, gpa: 3.7 },
    status: "graduated",
    studentId: "STD-2566-0089",
    parentEmail: "parent.patcharin@example.com",
  },
  {
    id: "a15",
    applicantCode: "APP-2567-0301",
    firstName: "วรวุฒิ",
    lastName: "สุขเกษม",
    appliedAt: "2024-11-05T14:45:00",
    gradeLevel: "ม.5",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "6",
    feePaid: true,
    examScore: { raw: 89, gpa: 3.88 },
    status: "enrolled",
    studentId: "STD-2567-0512",
    parentEmail: "parent.worawut@example.com",
  },
  {
    id: "a16",
    applicantCode: "APP-2567-0302",
    firstName: "เบญจมาศ",
    lastName: "งามเลิศ",
    appliedAt: "2024-11-06T09:15:00",
    gradeLevel: "ม.5",
    studyPlan: "คอมพิวเตอร์และเทคโนโลยี",
    documentsComplete: true,
    examRoom: "ห้อง D",
    seatNumber: "2",
    feePaid: true,
    examScore: { raw: 77, gpa: 3.35 },
    status: "on_leave",
    studentId: "STD-2567-0544",
    parentEmail: "parent.benchamas@example.com",
  },
  {
    id: "a17",
    applicantCode: "APP-2566-0401",
    firstName: "ภูวเดช",
    lastName: "ทรัพย์สมบูรณ์",
    appliedAt: "2023-11-02T10:30:00",
    gradeLevel: "ม.6",
    studyPlan: "วิทย์-คณิต",
    documentsComplete: true,
    examRoom: "ห้อง A",
    seatNumber: "5",
    feePaid: true,
    examScore: { raw: 95, gpa: 3.98 },
    status: "graduated",
    studentId: "STD-2566-0901",
    parentEmail: "parent.poowadech@example.com",
  },
  {
    id: "a18",
    applicantCode: "APP-2566-0402",
    firstName: "อภิษฎา",
    lastName: "วิเศษสุข",
    appliedAt: "2023-11-03T15:00:00",
    gradeLevel: "ม.6",
    studyPlan: "ศิลป์-คำนวณ",
    documentsComplete: true,
    examRoom: "ห้อง B",
    seatNumber: "11",
    feePaid: true,
    examScore: { raw: 86, gpa: 3.75 },
    status: "enrolled",
    studentId: "STD-2566-0922",
    parentEmail: "parent.apisada@example.com",
  },
  {
    id: "a19",
    applicantCode: "APP-2568-0019",
    firstName: "เกรียงไกร",
    lastName: "กล้าหาญ",
    appliedAt: "2025-11-07T08:45:00",
    gradeLevel: "ม.4",
    studyPlan: "คอมพิวเตอร์และเทคโนโลยี",
    documentsComplete: true,
    examRoom: "ห้อง B",
    seatNumber: "18",
    feePaid: true,
    examScore: { raw: 71, gpa: 3.05 },
    status: "transferred",
    studentId: "STD-2568-0019",
    parentEmail: "parent.kriengkrai@example.com",
  },
  {
    id: "a20",
    applicantCode: "APP-2568-0020",
    firstName: "พิมพ์นารา",
    lastName: "โชคประเสริฐ",
    appliedAt: "2025-11-08T11:10:00",
    gradeLevel: "ม.1",
    studyPlan: "ศิลป์-ภาษา",
    documentsComplete: true,
    examRoom: "ห้อง C",
    seatNumber: "25",
    feePaid: true,
    examScore: { raw: 68, gpa: 2.85 },
    status: "resigned",
    studentId: "STD-2568-0020",
    parentEmail: "parent.pimnara@example.com",
  },
];

// เติมนักเรียนจำลองให้ครบทุกห้องเรียน (ห้องละ 3-4 คน) แบบ deterministic (ไม่ใช้ Math.random
// เพื่อไม่ให้ข้อมูลเปลี่ยนไปมาทุกครั้งที่โหลด — getApplicants() จะ merge เข้า localStorage โดยยึด id)
// ใช้ id namespace "sNNN" แยกจาก "aN" ของ addApplicant() เพื่อไม่ให้ id ชนกัน
(function seedFullClassrooms() {
  const GRADES = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
  const PLAN_BY_SECTION = {
    1: "วิทย์-คณิต",
    2: "ศิลป์-คำนวณ",
    3: "ศิลป์-ภาษา",
    4: "ทั่วไป",
    5: "คอมพิวเตอร์และเทคโนโลยี",
  };
  // จำนวนเป้าหมายต่อห้องแบบสลับ 3-4 คน ตามเลขห้อง (คี่ = 4, คู่ = 3)
  const TARGET_BY_SECTION = { 1: 4, 2: 3, 3: 4, 4: 3, 5: 4 };
  const EXAM_ROOMS = ["ห้อง A", "ห้อง B", "ห้อง C", "ห้อง D"];

  const FIRST_NAMES = [
    "ปิยะ", "สุพจน์", "อรทัย", "ธีรภัทร", "กัลยา", "นภัส", "วิชัย", "จิรายุ",
    "ปาริชาต", "สุรชัย", "อัจฉรา", "ธนกร", "รัตนา", "ศักดิ์ดา", "มาลี", "ประเสริฐ",
    "จันทร์เพ็ญ", "วีรยุทธ", "สายฝน", "อนุชา", "ดวงใจ", "ชัยวัฒน์", "พรทิพย์", "สมบัติ",
    "รุ่งนภา", "ไพโรจน์", "อรุณี", "ธวัชชัย", "สุนิสา", "กิตติศักดิ์", "นันทนา", "วรพล",
    "ปราณี", "สุเมธ", "อารีย์", "ธนพล", "รัชนี", "ประยุทธ", "มณีรัตน์", "ชาญณรงค์",
  ];
  const LAST_NAMES = [
    "ศรีสุข", "จันทร์แก้ว", "บัวทอง", "รุ่งเรือง", "ทองดี", "แสงจันทร์", "มั่นคง", "ผ่องใส",
    "สายทอง", "เพชรรัตน์", "ใจงาม", "วงศ์สุวรรณ", "ทิพย์วงศ์", "ขจรเกียรติ", "พูลสวัสดิ์",
    "สุขสมบูรณ์", "แก้วมณี", "บุญเรือง", "ศรีทอง", "หอมหวล", "ประเสริฐสุข", "วิไลลักษณ์",
    "ธนากร", "สมหวัง", "อ่อนน้อม", "เรืองศรี", "พงษ์ไพบูลย์", "สวัสดิ์ดี", "ทองสุข", "จิตต์งาม",
  ];

  // นับจำนวนนักเรียนกำลังศึกษาต่อห้องที่มีอยู่แล้วในข้อมูลชุดเดิม
  const counts = {};
  seedApplicants.forEach((s) => {
    if (s.status !== "enrolled") return;
    const room = s.classroom || classroomFor(s.studyPlan, s.gradeLevel);
    counts[room] = (counts[room] || 0) + 1;
  });

  let seq = 1;
  GRADES.forEach((grade) => {
    const codeYear = grade === "ม.1" || grade === "ม.4" ? 2568 : grade === "ม.2" || grade === "ม.5" ? 2567 : 2566;
    const gregorianYear = codeYear - 543;

    for (let section = 1; section <= 5; section++) {
      const room = `${grade}/${section}`;
      const target = TARGET_BY_SECTION[section];
      const existing = counts[room] || 0;
      const need = Math.max(0, target - existing);

      for (let i = 0; i < need; i++) {
        const n = seq++;
        const firstName = FIRST_NAMES[(n - 1) % FIRST_NAMES.length];
        const lastName = LAST_NAMES[(n - 1) % LAST_NAMES.length];
        const gpa = Math.round((3.0 + ((n * 7) % 10) * 0.1) * 100) / 100;

        seedApplicants.push({
          id: `s${String(n).padStart(3, "0")}`,
          applicantCode: `APP-${codeYear}-${String(1000 + n)}`,
          firstName,
          lastName,
          appliedAt: `${gregorianYear}-11-15T09:00:00`,
          gradeLevel: grade,
          studyPlan: PLAN_BY_SECTION[section],
          classroom: room,
          documentsComplete: true,
          examRoom: EXAM_ROOMS[n % EXAM_ROOMS.length],
          seatNumber: String(n),
          feePaid: true,
          examScore: { raw: 70 + (n % 25), gpa },
          status: "enrolled",
          studentId: `STD-${codeYear}-${String(2000 + n)}`,
          parentEmail: `parent.s${n}@example.com`,
        });
      }
    }
  });
})();

function classroomFor(plan, grade) {
  const map = {
    "วิทย์-คณิต": "1",
    "ศิลป์-คำนวณ": "2",
    "ศิลป์-ภาษา": "3",
    "คอมพิวเตอร์และเทคโนโลยี": "5",
    "ทั่วไป": "4",
  };
  return `${grade}/${map[plan] || "4"}`;
}

// ห้องเรียนที่บันทึกไว้จริง (หลังการย้ายห้อง) จะชนะค่าที่คำนวณจากแผนการเรียน
function effectiveClassroom(student) {
  if (!student) return "";
  return student.classroom || classroomFor(student.studyPlan, student.gradeLevel);
}

// รายการห้องเรียนของโรงเรียนพร้อมจำนวนนักเรียนที่กำลังศึกษาอยู่ในแต่ละห้อง
// ระบุ grade (เช่น "ม.1") เพื่อเอาเฉพาะชั้นนั้น, ไม่ระบุ = ทุกชั้น
function classroomOptions(grade) {
  const grades = grade ? [grade] : ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
  const names = [];
  grades.forEach((g) => {
    for (let section = 1; section <= 5; section++) names.push(`${g}/${section}`);
  });

  const counts = {};
  AdmitifyStore.getApplicants().forEach((s) => {
    if (s.status !== "enrolled") return;
    if (grade && s.gradeLevel !== grade) return;
    const room = effectiveClassroom(s);
    counts[room] = (counts[room] || 0) + 1;
    // ห้องที่มีอยู่จริงในข้อมูลแต่ไม่อยู่ในรายการมาตรฐาน ก็ต้องเลือกได้ด้วย
    if (!names.includes(room)) names.push(room);
  });

  return names.sort().map((name) => ({ name, count: counts[name] || 0 }));
}

function phaseForStatus(status) {
  if (PHASE_OPTIONS[1].includes(status)) return 1;
  if (PHASE_OPTIONS[2].includes(status)) return 2;
  return 3;
}

// Store implementation using localStorage
const AdmitifyStore = {
  getApplicants() {
    const data = localStorage.getItem("admitify_applicants");
    if (!data) {
      localStorage.setItem("admitify_applicants", JSON.stringify(seedApplicants));
      return seedApplicants;
    }
    try {
      const current = JSON.parse(data);
      const existingIds = new Set(current.map(a => a.id));
      let hasNew = false;
      seedApplicants.forEach(seed => {
        if (!existingIds.has(seed.id)) {
          current.push(seed);
          hasNew = true;
        }
      });
      if (hasNew) {
        localStorage.setItem("admitify_applicants", JSON.stringify(current));
      }
      return current;
    } catch (e) {
      localStorage.setItem("admitify_applicants", JSON.stringify(seedApplicants));
      return seedApplicants;
    }
  },

  saveApplicants(applicants) {
    localStorage.setItem("admitify_applicants", JSON.stringify(applicants));
  },

  getById(id) {
    const applicants = this.getApplicants();
    return applicants.find((a) => a.id === id);
  },

  updateStatus(id, newStatus) {
    const applicants = this.getApplicants();
    const updated = applicants.map((a) => {
      if (a.id !== id) return a;
      const u = { ...a, status: newStatus };
      if (newStatus === "paid_exam_fee") u.feePaid = true;
      if (newStatus === "enrolled" && !u.studentId) {
        u.studentId = `STD-2568-${Math.floor(Math.random() * 9000) + 1000}`;
      }
      return u;
    });
    this.saveApplicants(updated);
    return updated;
  },

  updateScore(id, raw, gpa) {
    const applicants = this.getApplicants();
    const updated = applicants.map((a) => {
      if (a.id !== id) return a;
      return { ...a, examScore: { raw: Number(raw), gpa: Number(gpa) } };
    });
    this.saveApplicants(updated);
    return updated;
  },

  updateApplicant(id, patch) {
    const applicants = this.getApplicants();
    const updated = applicants.map((a) => {
      if (a.id !== id) return a;
      return {
        ...a,
        ...patch,
        lastEditedBy: "Admin_Pongsak",
        lastEditedAt: new Date().toISOString(),
      };
    });
    this.saveApplicants(updated);
    return updated;
  },

  // อัปเดตนักเรียนหลายคนพร้อมกัน โดยอ่าน/เขียน localStorage เพียงครั้งเดียว
  // updates: [{ id, patch }]
  updateMany(updates) {
    const patchById = new Map(updates.map((u) => [u.id, u.patch]));
    const now = new Date().toISOString();
    const applicants = this.getApplicants();
    const updated = applicants.map((a) => {
      const patch = patchById.get(a.id);
      if (!patch) return a;
      return {
        ...a,
        ...patch,
        lastEditedBy: "Admin_Pongsak",
        lastEditedAt: now,
      };
    });
    this.saveApplicants(updated);
    return updated;
  },

  addApplicant(patch) {
    const applicants = this.getApplicants();
    // find max numeric suffix for id "aXX"
    let maxNum = 0;
    applicants.forEach(a => {
      if (a.id && a.id.startsWith('a')) {
        const num = parseInt(a.id.substring(1));
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    const newId = `a${maxNum + 1}`;

    // find max numeric suffix for applicantCode "APP-2568-XXXX"
    let maxAppCode = 0;
    applicants.forEach(a => {
      if (a.applicantCode && a.applicantCode.startsWith('APP-2568-')) {
        const num = parseInt(a.applicantCode.substring(9));
        if (!isNaN(num) && num > maxAppCode) maxAppCode = num;
      }
    });
    const newCode = `APP-2568-${String(maxAppCode + 1).padStart(4, '0')}`;

    const newApplicant = {
      id: newId,
      applicantCode: newCode,
      appliedAt: new Date().toISOString(),
      status: 'unpaid_exam_fee',
      feePaid: false,
      documentsComplete: patch.documentsComplete !== undefined ? patch.documentsComplete : true,
      ...patch
    };

    applicants.push(newApplicant);
    this.saveApplicants(applicants);
    return newApplicant;
  },

  deleteApplicant(id) {
    const applicants = this.getApplicants();
    const updated = applicants.filter((a) => a.id !== id);
    this.saveApplicants(updated);
    return updated;
  },

  getFieldSettings() {
    const data = localStorage.getItem("admitify_field_settings");
    if (!data) {
      localStorage.setItem("admitify_field_settings", JSON.stringify(defaultFieldSettings));
      return defaultFieldSettings;
    }
    return JSON.parse(data);
  },

  saveFieldSettings(settings) {
    localStorage.setItem("admitify_field_settings", JSON.stringify(settings));
  },

  resetFieldSettings() {
    localStorage.setItem("admitify_field_settings", JSON.stringify(defaultFieldSettings));
    return defaultFieldSettings;
  },

  getCoursePlans() {
    const data = localStorage.getItem("admitify_course_plans");
    if (!data) {
      localStorage.setItem("admitify_course_plans", JSON.stringify(defaultCoursePlans));
      return defaultCoursePlans;
    }
    return JSON.parse(data);
  },

  saveCoursePlans(plans) {
    localStorage.setItem("admitify_course_plans", JSON.stringify(plans));
    // update STUDY_PLAN_OPTIONS dynamically
    window.STUDY_PLAN_OPTIONS = Array.from(new Set(plans.map(p => p.name)));
  },

  resetCoursePlans() {
    localStorage.setItem("admitify_course_plans", JSON.stringify(defaultCoursePlans));
    window.STUDY_PLAN_OPTIONS = Array.from(new Set(defaultCoursePlans.map(p => p.name)));
    return defaultCoursePlans;
  },

  getExamRooms() {
    const data = localStorage.getItem("admitify_exam_rooms");
    if (!data) {
      localStorage.setItem("admitify_exam_rooms", JSON.stringify(defaultExamRooms));
      return defaultExamRooms;
    }
    return JSON.parse(data);
  },

  saveExamRooms(rooms) {
    localStorage.setItem("admitify_exam_rooms", JSON.stringify(rooms));
  },

  resetExamRooms() {
    localStorage.setItem("admitify_exam_rooms", JSON.stringify(defaultExamRooms));
    return defaultExamRooms;
  },

  // task-11: config คอลัมน์ของตารางข้อมูลนักเรียน — แหล่งความจริงเดียวที่ทั้งหน้าตั้งค่าคอลัมน์
  // และตัวตารางใน students.html อ่านร่วมกัน (ดู defaultStudentColumns ด้านบน)
  getStudentColumns() {
    const data = localStorage.getItem("admitify_student_columns");
    if (!data) {
      localStorage.setItem("admitify_student_columns", JSON.stringify(defaultStudentColumns));
      return defaultStudentColumns;
    }
    return JSON.parse(data);
  },

  saveStudentColumns(columns) {
    localStorage.setItem("admitify_student_columns", JSON.stringify(columns));
  },

  resetStudentColumns() {
    localStorage.setItem("admitify_student_columns", JSON.stringify(defaultStudentColumns));
    return defaultStudentColumns;
  },

  reset() {
    localStorage.setItem("admitify_applicants", JSON.stringify(seedApplicants));
    this.resetFieldSettings();
    this.resetCoursePlans();
    this.resetExamRooms();
    this.resetStudentColumns();
    return seedApplicants;
  },
};

// Initialize Study Plan options on load
const plansInStore = localStorage.getItem("admitify_course_plans");
const loadedPlans = plansInStore ? JSON.parse(plansInStore) : defaultCoursePlans;
const STUDY_PLAN_OPTIONS_DYNAMIC = Array.from(new Set(loadedPlans.map(p => p.name)));

// Export to window object for usage in static HTML scripts
window.AdmitifyStore = AdmitifyStore;
window.STATUS_LABEL = STATUS_LABEL;
window.PHASE_LABEL = PHASE_LABEL;
window.PHASE_OPTIONS = PHASE_OPTIONS;
window.STUDY_PLAN_OPTIONS = STUDY_PLAN_OPTIONS_DYNAMIC;
window.EMAIL_TEMPLATES = EMAIL_TEMPLATES;
window.PLACEHOLDERS = PLACEHOLDERS;
window.classroomFor = classroomFor;
window.effectiveClassroom = effectiveClassroom;
window.classroomOptions = classroomOptions;
window.phaseForStatus = phaseForStatus;
window.defaultFieldSettings = defaultFieldSettings;
window.defaultCoursePlans = defaultCoursePlans;
window.defaultExamRooms = defaultExamRooms;
window.defaultStudentColumns = defaultStudentColumns;
window.schoolRooms = schoolRooms;
