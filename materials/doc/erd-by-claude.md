# ERD ทีม B (เนยสด + แคลร์) — ฉบับเร่งส่งอาจารย์

> 👉 **ยังไม่เคยอ่านชุดนี้ เริ่มที่ [`erd-by-claude-guide.md`](erd-by-claude-guide.md) ก่อน** (คู่มืออ่าน 2 หน้า) ไฟล์นี้ยาวและเป็นรายละเอียด

> 📌 **ไฟล์นี้คือคำอธิบายคู่กับ [`erd-by-claude.drawio`](erd-by-claude.drawio)** (ตัวแผนภาพที่แก้ได้ใน draw.io 4 หน้า: Chen ภาพรวม · ER เนยสด · ER แคลร์ · จุดเชื่อม)
> ตารางในหัวข้อ 4 ของไฟล์นี้เป็นแหล่งข้อมูลเดียวที่ใช้สร้าง drawio ถ้าแก้ตาราง ต้องแก้ทั้งสองไฟล์ให้ตรงกัน · ไฟล์นี้มีรายละเอียดแบบ Chen ของแต่ละฝั่ง (3.2 และ 3.3) ที่ drawio ไม่ได้วาด
> เดิมเลขาเข้าใจผิดว่านายต้องการเป็น md ล้วน จึงทำเป็น mermaid ก่อน (แก้ 2026-10-13)

> ⚠️ **ฉบับเร่ง จะออกแบบใหม่ทีหลัง** เนยสดบอกเมื่อ 2026-10-13 ว่าจะออกแบบทับ ไฟล์นี้ไม่ใช่ตัวหลัก
> เลขาเจนให้เมื่อ 2026-10-13 ตาม `plan/90` ในโปรเจกต์เลขา · **ทุกจุดที่เลขาสมมติเองติดป้าย 🟡 สมมติ** และรวมไว้ที่หัวข้อ 6
> ยังไม่มีใครตรวจ · ห้ามเอาลงเล่ม §3.4 จนกว่าทีมจะตัดสินคำถามที่ค้าง

## 0. อ่านก่อน

ไฟล์นี้รวม ER ของสองคนเป็นภาพเดียว ต้นทางมี 3 ไฟล์
- **ฝั่งเนยสด (รับสมัคร + ทะเบียน):** `SchoolDark/erd.drawio` 13 ตาราง ซึ่งเป็นร่างที่เพื่อนเจนด้วย AI ยังไม่ตรวจ
- **ฝั่งแคลร์ (บุคลากร):** `materials/doc/er-employee.drawio` 13 ตาราง
- **รูป Figma:** `report-drafts/school-dark/figma-erd-draft.png` (ในโปรเจกต์เลขา) ภาพใหญ่ 26,960 × 12,475 px ใช้เป็นตัวเทียบ และเป็นต้นทางของตารางลา/บัตรขออนุญาตของฝั่งแคลร์

ข้อจำกัดที่ต้องรู้
- Figma เป็น ER ของ**ทั้งโครงการ** (ราว 40 ตาราง) มีตารางทีม A (วิชาการ) และทีม C (ความประพฤติ) ปนอยู่ด้วย เลขาอ่านเฉพาะตารางที่เกี่ยวกับทีม B กับตารางส่วนกลางที่ทีม B ต้องเชื่อมถึง ตารางทีม A/C ที่เหลืออ่านแค่ชื่อ
- ในรูป Figma **ไม่มีตารางฝั่งรับสมัครเลย** ฝั่งเนยสดจึงเทียบได้แค่กับ `erd.drawio` ส่วนตารางส่วนกลางของ Figma (`students` `guardians` `classes` `teachers`) ออกแบบคนละแบบกับ `erd.drawio` ดูหัวข้อ 2.4
- เส้นเชื่อมบางเส้นใน Figma วิ่งไกลข้ามภาพ เลขาไล่ปลายเส้นไม่ได้ครบ เส้นที่อนุมานเอาจะบอกไว้ว่าอนุมาน
- ยังไม่พบตารางลาของครู และตารางตั้งค่าระบบ (ข้อมูลโรงเรียน วันเวลา สิทธิ์ ผู้ลงนาม) ทั้งใน `er-employee.drawio` และใน Figma ทั้งที่ `team-b-todo.md` ระบุว่าเป็นงานของแคลร์

## 1. วิธีอ่านแผนภาพ

### 1.1 แบบ Chen (ใช้ดูภาพรวม)

อ่านเหมือนอ่านประโยค "ใคร ทำอะไร กับอะไร"
- **สี่เหลี่ยม** = สิ่งของที่ระบบเก็บ (entity) เช่น คน ใบสมัคร ห้องเรียน แต่ละอันคือ 1 ตารางในฐานข้อมูล (บางอันรวมหลายตารางไว้ในกล่องเดียว บอกในชื่อกล่อง)
- **ข้าวหลามตัด** = ความสัมพันธ์ ตั้งชื่อเป็นกริยา เช่น "ยื่น" "สังกัด"
- **ตัวเลขบนเส้น** บอกจำนวน
	- `1` = ฝั่งนี้มีได้ 1
	- `N` หรือ `M` = ฝั่งนี้มีได้หลาย
	- ตัวอย่าง: คน `1` — ยื่น — `N` ใบสมัคร อ่านว่า "คน 1 คนยื่นได้หลายใบ"
- **ข้าวหลามตัดเส้นประ** = ความสัมพันธ์ที่เลขาอนุมานเอง ยังไม่มีใครยืนยัน 🟡
- **วงรี** = คุณสมบัติ ใส่เฉพาะตัวระบุหลัก (key) ไม่ใส่ทุกคอลัมน์
- **ความสัมพันธ์ 1:N** ไม่เกิดตารางใหม่ ฝั่ง N เก็บ FK ไว้ในตารางของตัวเอง (เช่น `application.person_id`) วาดเป็นข้าวหลามตัดธรรมดา
- **ความสัมพันธ์ M:N** (หลายต่อหลาย) ในฐานข้อมูลจริงต้องมีตารางคั่นกลาง ในรูป Chen วาดเป็น **associative entity** คือกรอบสี่เหลี่ยมครอบข้าวหลามตัด ชื่อตารางคั่นกลางเขียนอยู่ที่กรอบ
	- drawio ใช้กรอบเส้นคู่ · mermaid ไม่มีเส้นคู่ ใช้ `subgraph` เส้นหนาแทน
	- ตัวเลขบนเส้นของ M:N เป็น `M` กับ `N`
	- `application` ไม่ได้วาดเป็น associative entity เพราะมีตารางลูกของตัวเองและสร้างนักเรียนต่อ จึงเป็น entity ธรรมดา (ในตาราง M:N หัวข้อ 3.1 บอกไว้)

### 1.2 แบบ crow's foot (ใช้ดูตารางจริง)

ตารางพร้อมคอลัมน์ เส้นปลายตีนกา = ฝั่งหลาย
- `||` = ต้องมี 1 · `o|` = มี 0 หรือ 1 · `o{` = มี 0 ถึงหลาย
- `PK` = คีย์หลัก · `FK` = คีย์อ้างอิงตารางอื่น · `UK` = ค่าห้ามซ้ำ
- **เส้นประ** = ความสัมพันธ์ที่เลขาอนุมาน 🟡
- ชื่อตารางกับคอลัมน์ใช้ `snake_case` ทั้งสองฝั่ง (นายเลือกเมื่อ 2026-10-13) ของแคลร์เดิมเป็น camelCase เลขาแปลงชื่อเท่านั้น ไม่เปลี่ยนโครง ตารางเทียบอยู่หัวข้อ 5
- เขียนไว้เฉพาะคอลัมน์ที่ต้นทางมี ไม่เติมคอลัมน์เอง

## 2. ผลเช็ค: Figma กับไฟล์ของแคลร์ เชื่อมกันยังไง

### 2.1 ฝั่งแคลร์: Figma กับ `er-employee.drawio` ตรงกันไหม

ตรงกัน ทั้ง 13 ตาราง เท่าที่อ่านได้จากรูป ชื่อตาราง คอลัมน์ และเส้นเหมือนกัน
- **ที่อ่านจากรูปไม่ครบ 🟡:** `training` อ่านได้ 4 คอลัมน์แรก (training_id, employee_id, training_name, training_type) ส่วน `countries` เห็นแค่หัวตารางในภาพรวม ที่เหลือเลขาถือว่าเหมือนไฟล์ drawio
- **ตารางที่ตรงกัน:** employees · education · royal_decorations · license · toeic_score · job_details · training · family_member · address · countries · provinces · districts · sub_districts
- **เส้นที่ตรงกัน:** employees 1—N ตารางลูกทั้ง 8 ตาราง · countries→provinces→districts→sub_districts เป็นลูกโซ่ 1—N · ทั้ง 4 ระดับต่อเข้า address ด้วยเส้น 1—N
- **ความต่างเดียว:** Figma มีแถวคำอธิบาย `TABLE_INFO` กับตัวอย่างค่าในแต่ละตาราง ไฟล์ drawio ไม่มี (เลขาใช้คำอธิบายนี้เขียนหัวข้อ 3.3)
- **ปัญหาที่ซ้ำกันทั้งสองไฟล์ (เลขาไม่แก้ แค่แจ้ง 🟡)**
	- `royal_decorations` กับ `license` ตั้งชื่อ PK เหมือนกันว่า `licenseNO_PK` (Figma เขียนกำกับว่า "ตั้งตามภาพว่า licenseNO" ดูเหมือนก๊อปมา)
	- `job_details.dapartment` สะกดผิด เลขาเขียนเป็น `department`
	- `provinces.countryID` ไม่มีคำต่อท้าย `_FK` ทั้งที่เป็นคีย์อ้างอิง

### 2.2 สิ่งที่ Figma มีเพิ่มจากไฟล์ของแคลร์

Figma มีตารางสีชมพูเข้มของฝั่งแคลร์เพิ่ม 6 ตาราง เป็นเรื่องลาและบัตรขออนุญาตของ**นักเรียน** (ไม่ใช่ของครู)

| ตาราง | คืออะไร | เส้นที่เห็น |
|---|---|---|
| student_leave_type | ประเภทการลา (ลาป่วย ลากิจ) พร้อมสี วันสูงสุด ต้องมีเอกสารไหม | 1 ประเภท มีได้หลายแถวตั้งค่าต่อภาคเรียน |
| student_leave_setting_type | ตั้งค่าประเภทการลาต่อภาคเรียน (วันสูงสุด ต้องมีเอกสารไหม) | ต่อกับ student_leave_type และกับ `academic_terms` ของทีม A |
| student_leave_setting_approver | ตั้งค่าผู้อนุมัติ | **ไม่เห็นเส้นเชื่อม** และคอลัมน์เหมือน setting_type ทุกตัว ดูเหมือนก๊อปมาแล้วยังไม่แก้ 🟡 |
| student_leave_form | ใบลา 1 ใบของนักเรียน 1 คน | นักเรียน 1—N ใบลา |
| student_leave_approval | บันทึกการพิจารณาใบลาแต่ละครั้ง (สถานะ หมายเหตุ เวลา) | ใบลา 1—N การพิจารณา · มี `approver_id` ("id ของผู้อนุมัติ") |
| tardy_slip | บัตรขออนุญาต (เข้า/ออกห้อง ออกโรงเรียน ออกก่อนเวลา ไปทำหน้าที่ ฯลฯ) | นักเรียน 1—N บัตร |

### 2.3 Figma ทั้งภาพ: สีบอกอะไร

| สีหัวตาราง | ความหมาย | ตัวอย่าง |
|---|---|---|
| ส้ม | ตารางหลัก (entity ต้นทาง) | subjects · curriculums · rooms · teachers · classes · students · employees |
| ฟ้า | ตารางลูก/ตารางเชื่อม/รายการ | academic_terms · teaching_assignments · assignments · attendances · student_scores · student_class_histories · ตารางลูกของ employees · ตารางความประพฤติ |
| เทา | ผู้ปกครอง | guardians · student_guardians |
| ชมพูเข้ม | ลา/บัตรขออนุญาต (ฝั่งแคลร์) | 6 ตารางในหัวข้อ 2.2 |
| ชมพูอ่อน | ข้อมูลอ้างอิงที่อยู่ | countries · provinces · districts · sub_districts |

โน้ตที่เขียนไว้มุมล่างขวาของรูป (ของแคลร์ อ่านได้ตามนี้): "เดี๋ยวไปเพิ่ม postcode แล้วเอา fk อื่นออกจาก address"
- แปลว่า address ตอนนี้ชี้ไปหา 4 ตาราง (ตำบล อำเภอ จังหวัด ประเทศ) แต่แคลร์จะเก็บแค่ตำบล เพราะตำบลรู้ว่าอยู่อำเภอไหน จังหวัดไหน
- ถ้าแคลร์ทำตามนี้ ER ฉบับนี้ต้องแก้ ตอนนี้เลขาวาดตามที่ไฟล์ปัจจุบันเป็น 🟡

### 2.4 จุดเชื่อมระหว่างฝั่งเนยสดกับฝั่งแคลร์/ตารางส่วนกลาง

เป็นหัวใจของงานข้อ 1 ที่นายสั่ง แต่ละจุดบอกว่าสองฝั่งเก็บเรื่องเดียวกันคนละแบบตรงไหน ร่างนี้เลือกอะไร และใครต้องตัดสิน

| # | เรื่อง | ฝั่งเนยสด (`erd.drawio`) | ฝั่งแคลร์ / Figma | ร่างนี้เลือก 🟡 | ใครตัดสิน |
|---|---|---|---|---|---|
| J1 | **นักเรียน** | `person` (ตัวคน เลขบัตร ชื่อ) → `student` (หลังมอบตัว) | Figma `students` ตารางเดียว มีชื่อ วันเกิด เพศ ไม่มี person · ตารางลา/บัตรขออนุญาตของแคลร์ชี้มาที่ตารางนี้ | ให้ `student_leave_form.student_id` และ `tardy_slip.student_id` ชี้ไป `student` ของเนยสด ถือว่า `students` ใน Figma คือ `student` ตัวเดียวกัน | เนยสด + แคลร์ (+ ทีม A เพราะ `students` เป็นตารางส่วนกลาง) |
| J2 | **ผู้ปกครอง** | `applicant_guardian` ผูกกับใบสมัคร (บิดา/มารดา/ผู้ปกครองรวมตารางเดียว) | Figma `guardians` + `student_guardians` ผูกกับนักเรียน (1 เด็กมีได้หลายผู้ปกครอง M:N) | เก็บทั้งสองไว้ ใบสมัครเก็บตอนสมัคร ส่วนนักเรียนที่มอบตัวแล้วใช้ `student_guardians` ยังไม่ได้ลากเส้นระหว่าง `applicant_guardian` กับ `guardians` | เนยสด |
| J3 | **ห้องเรียน** | `classroom` (ปีการศึกษา ระดับ เลขห้อง) กับ `student.classroom_id` (ห้องปัจจุบัน) | Figma `classes` (ชื่อกลุ่ม ครูประจำชั้น ห้อง) กับ `student_class_histories` (นักเรียนกับห้องเป็น M:N เก็บประวัติเลื่อนชั้น) | ถือว่า `classes` = `classroom` · เก็บ `student_class_histories` ไว้เป็นตารางประวัติ ให้ `student.classroom_id` เป็นห้องปัจจุบัน | เนยสด + ทีม A |
| J4 | **ครูประจำชั้น** | `classroom.homeroom_teacher_id` ชี้ไป "SchoolDark" (ระบบบุคลากร) ไม่ได้ระบุตาราง | Figma `classes.homeroom_teacher_FK` ชี้ `teachers` (id, รหัส, ชื่อ, ตำแหน่ง) · เส้นยาวจาก `teachers` ไปเข้า `employees` เป็น `‖—‖` (1 ต่อ 1) | `classroom.homeroom_teacher_id` ชี้ `teachers` · `teachers` 1:1 `employees` **อนุมานจากเส้น ปลายเส้นไม่ได้ไล่ถึงตัวสุดท้าย** | แคลร์ + ทีม A |
| J5 | **ครูซ้ำสองตาราง** | — | `teachers` กับ `employees` เก็บชื่อ/ตำแหน่งซ้ำกัน (teachers มี first_name_th, position_th · employees + job_details มีชื่อ ตำแหน่งครบกว่า) | ไม่ตัด เก็บทั้งคู่ตาม Figma | แคลร์ + ทีม A |
| J6 | **ที่อยู่** | `applicant_address` เก็บ ตำบล/อำเภอ/จังหวัด เป็นข้อความ + zip_code | `address` ชี้ตาราง `sub_districts` `districts` `provinces` `countries` · แคลร์จะเหลือแค่ตำบล + postcode | ไม่ลากเส้นระหว่างสองฝั่ง ใช้ตามต้นทางของใครของมัน | เนยสด + แคลร์ (ข้อ "ตารางที่อยู่ ใช้ร่วมกันไหม" ใน `team-b-todo.md`) |
| J7 | **ผู้อนุมัติใบลา** | — | `student_leave_approval.approver_id` มีคำอธิบายว่า "id ของผู้อนุมัติ" ปลายเส้นวิ่งไกล | ชี้ `employees` (อนุมานจากชื่อคอลัมน์ ไม่ใช่จากปลายเส้น) | แคลร์ |
| J8 | **ผู้ทำรายการ** | `application_status_history.changed_by` · `application.last_edited_by` · `application_document.verified_by` เป็นข้อความ | `employees` | ไม่ผูก FK คงเป็นข้อความตามต้นทาง | เนยสด |
| J9 | **ปีการศึกษา** | `admission_round.academic_year` และ `classroom.academic_year` เป็นตัวเลข | Figma `academic_terms` (ทีม A) เก็บปีการศึกษา/ภาคเรียน · `student_leave_setting_type` ชี้มาที่ตารางนี้ | ไม่ผูก 3 ที่ (ปีเป็นตัวเลขสองที่ กับ academic_terms) | ทุกฝ่าย |
| J10 | **แผนการเรียน/ห้องสอบ** | `course_plan` (แผนที่เปิดรับต่อรอบ) · `exam_room` (ชื่อห้องเป็นข้อความ) | Figma `curriculums` (แผนการเรียนหลักของโรงเรียน) · `rooms` (ห้องกายภาพ ความจุ) | ไม่ผูก คงตามต้นทาง | เนยสด + ทีม A |
| J11 | **ผู้ใช้/บทบาท (login)** | ไม่มีตาราง | `employees.role` เป็นข้อความ ไม่มีตาราง user/role | ไม่เติม ตรงกับข้อ "ใครถือ login/token" ใน `team-b-todo.md` | ทั้งคู่ |

## 3. Chen: ภาพรวมก่อน แล้วค่อยลงรายละเอียด

### 3.1 ภาพรวมทีม B

รวมทั้งสองฝั่ง กล่องหนึ่งอาจรวมหลายตาราง ตารางคั่นกลางของ M:N วาดเป็นกรอบหนาครอบข้าวหลามตัด (associative entity) ชื่อตารางอยู่บนกรอบ

```mermaid
flowchart LR
    classDef ent fill:#dbeafe,stroke:#1d4ed8,color:#111
    classDef emp fill:#fde68a,stroke:#b45309,color:#111
    classDef shared fill:#e5e7eb,stroke:#4b5563,color:#111
    classDef rel fill:#fff,stroke:#111,color:#111
    classDef assumed fill:#fff,stroke:#dc2626,stroke-dasharray:5 4,color:#111

    round["ปีการศึกษาที่เปิดรับ<br/>admission_round"]:::ent
    plan["แผนการเรียนที่เปิดรับ<br/>course_plan"]:::ent
    person["คน<br/>person"]:::ent
    app["ใบสมัคร<br/>application"]:::ent
    appinfo["ข้อมูลประกอบใบสมัคร 5 ตาราง<br/>ที่อยู่ ผู้ปกครอง สุขภาพ เอกสาร ประวัติสถานะ"]:::ent
    stu["นักเรียน<br/>student"]:::ent
    room["ห้องเรียน<br/>classroom"]:::ent

    emp["พนักงาน/ครู<br/>employees"]:::emp
    empinfo["ข้อมูลประกอบพนักงาน 7 ตาราง<br/>การศึกษา ฝึกอบรม ใบอนุญาต TOEIC<br/>เครื่องราชฯ งาน ครอบครัว"]:::emp
    addr["ที่อยู่พนักงาน<br/>address"]:::emp
    geo["ตำบล อำเภอ จังหวัด ประเทศ<br/>4 ตาราง"]:::emp
    ltype["ประเภทการลา<br/>student_leave_type"]:::emp
    term["ภาคเรียน (ทีม A)<br/>academic_terms"]:::shared
    leave["ใบลานักเรียน<br/>student_leave_form"]:::emp
    tardy["บัตรขออนุญาต<br/>tardy_slip"]:::emp

    guard["ผู้ปกครอง<br/>guardians"]:::shared
    teacher["ครู<br/>teachers"]:::shared

    r1{"มีแผน"}:::rel
    r2{"รับสมัครใน"}:::rel
    r3{"ยื่น"}:::rel
    r4{"ถูกเลือก"}:::rel
    r5{"มีข้อมูลประกอบ"}:::rel
    r6{"มอบตัวแล้วเป็น"}:::rel
    r7{"เป็น"}:::rel
    r8{"สังกัดปัจจุบัน"}:::rel
    r10{"ยื่นใบลา"}:::rel
    r11{"ขอบัตร"}:::rel
    r15{"มี"}:::rel
    r16{"อยู่ที่"}:::rel
    r17{"ระบุ"}:::rel
    r18{"เป็นครูประจำชั้น"}:::assumed
    r19{"คือคนเดียวกัน"}:::assumed

    subgraph J1["student_guardians (ตารางคั่น M:N)"]
        r9{"มีผู้ปกครอง"}:::rel
    end
    subgraph J2["student_class_histories (ตารางคั่น M:N)"]
        r20{"เคยอยู่ห้อง"}:::rel
    end
    subgraph J3["student_leave_approval (ตารางคั่น M:N 🟡)"]
        r12{"พิจารณา"}:::assumed
    end
    subgraph J4["student_leave_setting_type (ตารางคั่น M:N)"]
        r14{"ตั้งค่าต่อภาคเรียน"}:::rel
    end
    style J1 fill:#fff,stroke:#111,stroke-width:3px
    style J2 fill:#fff,stroke:#111,stroke-width:3px
    style J3 fill:#fff,stroke:#dc2626,stroke-width:3px,stroke-dasharray:5 4
    style J4 fill:#fff,stroke:#111,stroke-width:3px

    round ---|1| r1 ---|N| plan
    round ---|1| r2 ---|N| app
    person ---|1| r3 ---|N| app
    plan ---|1| r4 ---|N| app
    app ---|1| r5 ---|N| appinfo
    app ---|1| r6 ---|1| stu
    person ---|1| r7 ---|N| stu
    room ---|1| r8 ---|N| stu
    room ---|M| r20 ---|N| stu
    stu ---|M| r9 ---|N| guard
    stu ---|1| r10 ---|N| leave
    stu ---|1| r11 ---|N| tardy
    leave ---|M| r12 ---|N| emp
    ltype ---|M| r14 ---|N| term
    emp ---|1| r15 ---|N| empinfo
    emp ---|1| r16 ---|N| addr
    geo ---|1| r17 ---|N| addr
    teacher ---|1| r18 ---|N| room
    teacher ---|1| r19 ---|1| emp
```

**สีกล่อง:** ฟ้า = ฝั่งเนยสด · เหลือง = ฝั่งแคลร์ · เทา = ตารางส่วนกลาง (Figma ทีม A) · ข้าวหลามตัดเส้นประแดง = อนุมาน 🟡 · **กรอบหนา = ตารางคั่นกลางของ M:N**

**ความสัมพันธ์แต่ละอัน แปลเป็นภาษางาน**

| ข้าวหลามตัด | อ่านว่า | ตัวอย่าง |
|---|---|---|
| มีแผน | 1 รอบรับสมัครเปิดได้หลายแผนการเรียน | รอบปี 2569 เปิด ม.1 วิทย์-คณิต กับ Gifted |
| รับสมัครใน | 1 รอบมีใบสมัครได้หลายใบ | รอบปี 2569 มี 300 ใบ |
| ยื่น | 1 คนยื่นได้หลายใบ (ต่างรอบ) | ปีนี้ไม่ติด ปีหน้าสมัครใหม่ |
| ถูกเลือก | 1 แผนถูกเลือกได้หลายใบ (ใบสมัครเลือกอันดับ 1 และ 2) | แผนวิทย์-คณิตถูกเลือกอันดับ 1 โดย 120 ใบ |
| มีข้อมูลประกอบ | 1 ใบสมัครมีที่อยู่ ผู้ปกครอง เอกสาร ฯลฯ ได้หลายแถว (สุขภาพมีได้ 1 แถว) | ใบสมัครมีที่อยู่ 2 ชุด (ทะเบียนบ้าน/ปัจจุบัน) |
| มอบตัวแล้วเป็น | ใบสมัครที่มอบตัวเสร็จสร้างนักเรียนขึ้นมา 1 คน | ใบ APP-2569-0001 กลายเป็น STD-2569-0001 |
| เป็น | 1 คนเป็นนักเรียนได้หลายแถว (เช่น ม.3 แล้วต่อ ม.4) | — |
| สังกัดปัจจุบัน | 1 ห้องมีนักเรียนได้หลายคน (ห้องที่นักเรียนอยู่ตอนนี้) | ม.1/1 มีนักเรียน 40 คน |
| เคยอยู่ห้อง (กรอบ `student_class_histories`) | **M:N** นักเรียน 1 คนเคยอยู่หลายห้องตามปี และ 1 ห้องมีนักเรียนหลายคน เก็บประวัติเลื่อนชั้น | ม.1/1 ปี 2569 แล้วย้ายไป ม.2/3 ปี 2570 |
| มีผู้ปกครอง (กรอบ `student_guardians`) | **M:N** 1 เด็กมีหลายผู้ปกครอง และ 1 ผู้ปกครองมีหลายเด็ก | พี่น้องที่มีผู้ปกครองคนเดียวกัน |
| ยื่นใบลา · ขอบัตร | 1 นักเรียนมีใบลา/บัตรได้หลายใบ | — |
| พิจารณา 🟡 (กรอบ `student_leave_approval`) | **M:N** 1 ใบลาถูกพิจารณาได้หลายครั้ง/หลายคน และ 1 พนักงานพิจารณาได้หลายใบลา (ปลายฝั่งพนักงานเป็นการอนุมาน) | รอผอ. แล้วอนุมัติ |
| ตั้งค่าต่อภาคเรียน (กรอบ `student_leave_setting_type`) | **M:N** ประเภทการลาแต่ละแบบตั้งค่าได้ต่างกันในแต่ละภาคเรียน | ลาป่วยเทอม 1 ไม่เกิน 5 วัน |
| มี · อยู่ที่ · ระบุ | พนักงาน 1 คนมีข้อมูลประกอบ/ที่อยู่ได้หลายแถว · ที่อยู่ระบุตำบล อำเภอ จังหวัด ประเทศ | — |
| เป็นครูประจำชั้น 🟡 | 1 ครูเป็นครูประจำชั้นได้หลายห้อง | — |
| คือคนเดียวกัน 🟡 | `teachers` 1 แถวตรงกับ `employees` 1 แถว | — |

**M:N ทั้งหมดที่เจอ และตารางคั่นกลาง**

| ฝั่งหนึ่ง | อีกฝั่ง | ตารางคั่นกลาง | วาดเป็น associative entity | ที่มา |
|---|---|---|---|---|
| คน (person) | รอบรับสมัคร / แผนการเรียน | `application` | ไม่ วาดเป็น entity ธรรมดา เพราะเป็นตารางหลักที่มีตารางลูกของตัวเอง (ที่อยู่ เอกสาร ฯลฯ) และสร้างนักเรียนต่อ | erd.drawio |
| นักเรียน | ผู้ปกครอง | `student_guardians` | ใช่ | Figma |
| นักเรียน | ห้องเรียน (ประวัติ) | `student_class_histories` | ใช่ | Figma |
| ประเภทการลา | ภาคเรียน | `student_leave_setting_type` | ใช่ | Figma |
| ใบลา | พนักงานผู้พิจารณา | `student_leave_approval` 🟡 | ใช่ (เส้นประแดง) | Figma + อนุมาน |

### 3.2 รายละเอียดฝั่งเนยสด (รับสมัคร + ทะเบียน)

แยกตารางประกอบใบสมัครให้เห็นครบ 13 ตาราง ใส่ตัวระบุหลักของตารางสำคัญ

```mermaid
flowchart LR
    classDef ent fill:#dbeafe,stroke:#1d4ed8,color:#111
    classDef weak fill:#eff6ff,stroke:#1d4ed8,stroke-dasharray:3 3,color:#111
    classDef rel fill:#fff,stroke:#111,color:#111
    classDef attr fill:#fff,stroke:#6b7280,color:#111

    round["รอบรับสมัคร<br/>admission_round"]:::ent
    plan["แผนการเรียนที่เปิดรับ<br/>course_plan"]:::ent
    exam["ห้องสอบ<br/>exam_room"]:::ent
    field["ฟอร์มที่ตั้งค่าได้<br/>field_definition"]:::ent
    person["คน<br/>person"]:::ent
    app["ใบสมัคร<br/>application"]:::ent
    stu["นักเรียน<br/>student"]:::ent
    room["ห้องเรียน<br/>classroom"]:::ent
    addr["ที่อยู่ผู้สมัคร<br/>applicant_address"]:::weak
    guard["ผู้ปกครองผู้สมัคร<br/>applicant_guardian"]:::weak
    health["สุขภาพ ข้อมูลอ่อนไหว<br/>applicant_health"]:::weak
    doc["เอกสารแนบ<br/>application_document"]:::weak
    hist["ประวัติสถานะ<br/>application_status_history"]:::weak

    a1(["round_id"]):::attr
    a2(["person_id<br/>citizen_id ห้ามซ้ำ"]):::attr
    a3(["application_id<br/>applicant_code"]):::attr
    a4(["student_id<br/>student_code"]):::attr

    r1{"มีแผน"}:::rel
    r2{"มีห้องสอบ"}:::rel
    r3{"กำหนดฟอร์ม"}:::rel
    r4{"รับสมัครใน"}:::rel
    r5{"ยื่น"}:::rel
    r6{"เลือกอันดับ 1/2"}:::rel
    r7{"จัดที่นั่ง"}:::rel
    r8{"มีที่อยู่ 2 ชุด"}:::rel
    r9{"มีผู้ปกครอง"}:::rel
    r10{"มีสุขภาพ"}:::rel
    r11{"แนบเอกสาร"}:::rel
    r12{"บันทึกสถานะ"}:::rel
    r13{"มอบตัวแล้วสร้าง"}:::rel
    r14{"เป็น"}:::rel
    r15{"สังกัด"}:::rel

    round --- a1
    person --- a2
    app --- a3
    stu --- a4
    round ---|1| r1 ---|N| plan
    plan ---|1| r2 ---|N| exam
    round ---|1| r3 ---|N| field
    round ---|1| r4 ---|N| app
    person ---|1| r5 ---|N| app
    plan ---|1| r6 ---|N| app
    exam ---|0..1| r7 ---|N| app
    app ---|1| r8 ---|N| addr
    app ---|1| r9 ---|N| guard
    app ---|1| r10 ---|1| health
    app ---|1| r11 ---|N| doc
    app ---|1| r12 ---|N| hist
    app ---|0..1| r13 ---|0..1| stu
    person ---|1| r14 ---|N| stu
    room ---|1| r15 ---|N| stu
```

**แต่ละกล่องคืออะไร (ที่มา: `erd.drawio` ฝั่งเนยสด)**

| ตาราง | คืออะไร | ตัวอย่าง |
|---|---|---|
| admission_round | รอบรับสมัครแต่ละปี | รับสมัครปี 2569 เปิด/ปิดรับ |
| course_plan | แผนการเรียนที่เปิดในรอบนั้น พร้อมรับกี่คน วันสมัคร/สอบ/ประกาศ/มอบตัว | ม.1 วิทย์-คณิต รับ 120 คน |
| exam_room | ห้องสอบของแผนนั้น | ห้องสอบที่ 1 ห้อง 321 อาคาร 3 ความจุ 30 |
| field_definition | ฟิลด์ฟอร์มสมัครที่โรงเรียนตั้งเองได้ ผูกกับรอบ ใบสมัครปีเก่าอ่านด้วยฟอร์มของปีนั้น | ช่อง "ความสามารถพิเศษ" |
| person | ตัวคนจริง ค้นซ้ำด้วยเลขบัตรประชาชน | สมชาย เลขบัตร 13 หลัก |
| application | ใบสมัคร 1 ใบ ต่อ 1 คน ต่อ 1 รอบ เก็บสถานะ (9 ค่า) ค่าธรรมเนียม คะแนน ข้อมูลเสริมแบบ JSONB | APP-2569-0001 |
| student | นักเรียนที่มอบตัวแล้ว (สร้างใหม่ ไม่ได้ย้ายแถวจากใบสมัคร) | STD-2569-0001 สถานะ 3 ค่า (กำลังศึกษา/ย้าย/จบ) |
| classroom | ห้องเรียนต่อปีการศึกษา | ม.1 ห้อง 1 ปี 2569 |
| applicant_address | ที่อยู่ 2 ชุดในตารางเดียว แยกด้วยประเภท (ทะเบียนบ้าน/ปัจจุบัน) | — |
| applicant_guardian | บิดา/มารดา/ผู้ปกครอง รวมตารางเดียว แยกด้วย role | — |
| applicant_health | ข้อมูลสุขภาพ แยกตารางเพราะอ่อนไหว คุมสิทธิ์ตาม PDPA | แพ้ยา โรคประจำตัว |
| application_document | เอกสารแนบ 1 แถวต่อ 1 ไฟล์ พร้อมสถานะตรวจ | รูปถ่าย ปพ.1 |
| application_status_history | ประวัติเปลี่ยนสถานะ เพื่อให้กดย้อนกลับรายการได้ | จากรอตรวจ → ผ่าน |

### 3.3 รายละเอียดฝั่งแคลร์ (บุคลากร + ลา/บัตรขออนุญาต)

```mermaid
flowchart LR
    classDef emp fill:#fde68a,stroke:#b45309,color:#111
    classDef geo fill:#fbcfe8,stroke:#be185d,color:#111
    classDef shared fill:#e5e7eb,stroke:#4b5563,color:#111
    classDef rel fill:#fff,stroke:#111,color:#111
    classDef assumed fill:#fff,stroke:#dc2626,stroke-dasharray:5 4,color:#111
    classDef attr fill:#fff,stroke:#6b7280,color:#111

    emp["พนักงาน/ครู<br/>employees"]:::emp
    edu["ประวัติการศึกษา<br/>education"]:::emp
    roy["เครื่องราชอิสริยาภรณ์<br/>royal_decorations"]:::emp
    lic["ใบประกอบวิชาชีพ<br/>license"]:::emp
    toeic["คะแนน TOEIC<br/>toeic_score"]:::emp
    job["รายละเอียดการจ้างงาน<br/>job_details"]:::emp
    trn["การฝึกอบรม<br/>training"]:::emp
    fam["ครอบครัว<br/>family_member"]:::emp
    addr["ที่อยู่<br/>address"]:::emp
    ctry["ประเทศ<br/>countries"]:::geo
    prov["จังหวัด<br/>provinces"]:::geo
    dist["เขต/อำเภอ<br/>districts"]:::geo
    sub["แขวง/ตำบล + รหัสไปรษณีย์<br/>sub_districts"]:::geo

    ltype["ประเภทการลา<br/>student_leave_type"]:::emp
    lapp0["ตั้งค่าผู้อนุมัติ<br/>student_leave_setting_approver"]:::assumed
    term["ภาคเรียน ทีม A<br/>academic_terms"]:::shared
    stu["นักเรียน<br/>student"]:::shared
    lform["ใบลา<br/>student_leave_form"]:::emp
    tardy["บัตรขออนุญาต<br/>tardy_slip"]:::emp

    ea(["employee_id"]):::attr
    emp --- ea

    r1{"มี"}:::rel
    r2{"มี"}:::rel
    r3{"มี"}:::rel
    r4{"มี"}:::rel
    r5{"มี"}:::rel
    r6{"มี"}:::rel
    r7{"มี"}:::rel
    r8{"อยู่ที่"}:::rel
    g1{"มีจังหวัด"}:::rel
    g2{"มีอำเภอ"}:::rel
    g3{"มีตำบล"}:::rel
    g4{"ระบุตำบล"}:::rel
    g5{"ระบุอำเภอ"}:::rel
    g6{"ระบุจังหวัด"}:::rel
    g7{"ระบุประเทศ"}:::rel
    l3{"ยื่นใบลา"}:::rel
    l6{"ขอบัตร"}:::rel

    subgraph K1["student_leave_setting_type (ตารางคั่น M:N)"]
        l1{"ตั้งค่าต่อภาคเรียน"}:::rel
    end
    subgraph K2["student_leave_approval (ตารางคั่น M:N 🟡)"]
        l4{"พิจารณา"}:::assumed
    end
    style K1 fill:#fff,stroke:#111,stroke-width:3px
    style K2 fill:#fff,stroke:#dc2626,stroke-width:3px,stroke-dasharray:5 4

    emp ---|1| r1 ---|N| edu
    emp ---|1| r2 ---|N| roy
    emp ---|1| r3 ---|N| lic
    emp ---|1| r4 ---|N| toeic
    emp ---|1| r5 ---|N| job
    emp ---|1| r6 ---|N| trn
    emp ---|1| r7 ---|N| fam
    emp ---|1| r8 ---|N| addr
    ctry ---|1| g1 ---|N| prov
    prov ---|1| g2 ---|N| dist
    dist ---|1| g3 ---|N| sub
    sub ---|1| g4 ---|N| addr
    dist ---|1| g5 ---|N| addr
    prov ---|1| g6 ---|N| addr
    ctry ---|1| g7 ---|N| addr
    ltype ---|M| l1 ---|N| term
    stu ---|1| l3 ---|N| lform
    lform ---|M| l4 ---|N| emp
    stu ---|1| l6 ---|N| tardy
```

`student_leave_setting_approver` อยู่ในกรอบเส้นประเพราะไม่เห็นเส้นเชื่อมและคอลัมน์เหมือน `student_leave_setting_type` 🟡 จึงไม่ได้ลากเส้นให้ (ไม่มีข้อมูลว่าเชื่อมกับอะไร)

**แต่ละกล่องคืออะไร (คำอธิบายจากแถว `TABLE_INFO` ใน Figma ถ้ามี)**

| ตาราง | คืออะไร | ที่มาของคำอธิบาย |
|---|---|---|
| employees | ข้อมูลหลักของพนักงาน/ครู (ชื่อไทย-อังกฤษ เลขบัตร วันเกิด เพศ หมู่เลือด สัญชาติ ศาสนา เบอร์ อีเมล บทบาท) | Figma |
| education | ประวัติการศึกษา (วุฒิ สาขา สถาบัน ปีที่จบ เกรด) | Figma |
| royal_decorations | ประวัติเครื่องราชอิสริยาภรณ์ (ชั้น วันที่ได้รับ ราชกิจจานุเบกษา) | Figma |
| license | ใบประกอบวิชาชีพ (ประเภท วันออก วันหมดอายุ) | Figma |
| toeic_score | ผลคะแนนภาษาอังกฤษ (คะแนน วันหมดอายุ ลิงก์เอกสาร) | Figma |
| job_details | รายละเอียดการจ้างงาน (ตำแหน่ง แผนก วันเริ่ม เงินเดือน สถานะการทำงาน) | Figma |
| training | การฝึกอบรม (ชื่อ ประเภท ผู้จัด วันที่ ชั่วโมง สถานที่ ค่าใช้จ่าย) | ชื่อคอลัมน์ในไฟล์ |
| family_member | ข้อมูลครอบครัวพนักงาน (ความสัมพันธ์ สถานะสมรส สถานะการมีชีวิต อาชีพ) | Figma |
| address | ที่อยู่ของพนักงาน (บ้านเลขที่ หมู่ ซอย ถนน + ตำบล อำเภอ จังหวัด ประเทศ + ประเภท) | Figma |
| countries · provinces · districts · sub_districts | ข้อมูลอ้างอิงที่อยู่ 4 ระดับ ตำบลเก็บรหัสไปรษณีย์ | Figma |
| student_leave_type · student_leave_setting_type · student_leave_setting_approver | ประเภทการลา และการตั้งค่าต่อภาคเรียน | Figma (ไม่มีคำอธิบาย) |
| student_leave_form · student_leave_approval | ใบลา และบันทึกการพิจารณา | Figma (ไม่มีคำอธิบาย) |
| tardy_slip | บัตรขออนุญาต 6 ประเภท (เข้าห้อง ออกห้อง ออกโรงเรียน ออกก่อนเวลา ไปทำหน้าที่ อื่น ๆ) พร้อมช่วงวัน/เวลา และสถานะ 3 ค่า | Figma |

## 4. Crow's foot: ตารางพร้อมคอลัมน์

### 4.1 ฝั่งเนยสด (รับสมัคร + ทะเบียน)

ที่มา `erd.drawio` เปลี่ยนแค่รูปแบบการเขียน
- คอลัมน์ที่ต้นทางเขียนรวมกันบรรทัดเดียว (เช่น `apply_start / apply_end`) เลขาแยกเป็นคนละคอลัมน์
- **ชนิดข้อมูลบางตัวเลขาเดา 🟡** เพราะต้นทางไม่ระบุ ได้แก่ คอลัมน์ `..._id` ที่เป็น PK/FK (ใช้ INT) และคอลัมน์ที่ต้นทางเขียนติดกันโดยบอกชนิดไว้แค่ตัวแรก (เช่น `created_at / updated_at` ใช้ TIMESTAMPTZ ตามตัวแรก) ชนิดจริงต้องรอ Data Dictionary
- `prev_school_province` ต้นทางเขียน `prev_school_name / province` เลขาตั้งชื่อคอลัมน์หลังเอง

```mermaid
erDiagram
    admission_round {
        INT round_id PK
        INT academic_year "เช่น 2569"
        VARCHAR name
        BOOL is_open
        TIMESTAMPTZ created_at
    }
    course_plan {
        INT plan_id PK
        INT round_id FK
        VARCHAR level "ม.1 / ม.4"
        VARCHAR name "วิทย์-คณิต, Gifted"
        INT capacity
        TEXT regulations
        DATE apply_start
        DATE apply_end
        DATE exam_date
        DATE announce_date
        DATE report_date
        DATE enroll_date
    }
    exam_room {
        INT exam_room_id PK
        INT plan_id FK
        VARCHAR name "ห้องสอบที่ 1"
        VARCHAR room_name "ห้อง 321 อาคาร 3"
        INT capacity
    }
    field_definition {
        INT field_id PK
        INT round_id FK
        VARCHAR section_key "personal, health"
        VARCHAR group_name
        VARCHAR field_key
        VARCHAR label_th
        VARCHAR label_en
        VARCHAR data_type
        BOOL is_required
        INT display_order
        BOOL is_active
    }
    person {
        INT person_id PK
        CHAR citizen_id UK "13 หลัก"
        VARCHAR prefix
        VARCHAR first_name_th
        VARCHAR last_name_th
        VARCHAR full_name_en
        DATE dob
        VARCHAR gender
        VARCHAR nationality
        VARCHAR religion
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    application {
        INT application_id PK
        VARCHAR applicant_code UK "APP-2568-0001"
        INT person_id FK
        INT round_id FK
        INT plan_choice_1 FK
        INT plan_choice_2 FK "NULL ได้"
        INT exam_room_id FK "NULL ได้"
        VARCHAR grade_level
        VARCHAR seat_number
        VARCHAR prev_school_name
        VARCHAR prev_school_province
        VARCHAR prev_degree
        DECIMAL gpax
        ENUM status "9 ค่า"
        BOOL fee_paid
        TIMESTAMPTZ fee_paid_at
        DECIMAL score_raw
        BOOL documents_complete
        JSONB extra_fields "ฟิลด์ที่โรงเรียนเพิ่มเอง"
        TIMESTAMPTZ applied_at
        VARCHAR last_edited_by
        TIMESTAMPTZ last_edited_at
    }
    student {
        INT student_id PK
        VARCHAR student_code UK "STD-2568-0001"
        INT person_id FK
        INT from_application_id FK "NULL ได้"
        INT classroom_id FK
        DATE enrolled_at
        ENUM status "studying / transferred / graduated"
    }
    classroom {
        INT classroom_id PK
        INT academic_year
        VARCHAR level "ม.1"
        INT room_no "1..5"
        INT homeroom_teacher_id "ชี้ระบบบุคลากร ไม่ระบุตาราง"
    }
    applicant_address {
        INT address_id PK
        INT application_id FK
        ENUM address_type "registered / current"
        VARCHAR house_no
        VARCHAR moo
        VARCHAR soi
        VARCHAR road
        VARCHAR sub_district
        VARCHAR district
        VARCHAR province
        CHAR zip_code
    }
    applicant_guardian {
        INT guardian_id PK
        INT application_id FK
        ENUM role "father / mother / guardian"
        VARCHAR relationship "เฉพาะ guardian"
        VARCHAR full_name
        VARCHAR phone
        VARCHAR email
        VARCHAR occupation
        ENUM address_same_as "NULL ได้"
        BOOL is_primary_contact
    }
    applicant_health {
        INT health_id PK
        INT application_id FK "1:1"
        VARCHAR blood_type
        TEXT chronic_disease
        TEXT drug_allergy
        TEXT food_allergy
    }
    application_document {
        INT document_id PK
        INT application_id FK
        VARCHAR doc_type "รูปถ่าย, ปพ.1"
        VARCHAR file_path
        VARCHAR file_name
        VARCHAR mime_type
        BIGINT file_size
        TIMESTAMPTZ uploaded_at
        ENUM verify_status "pending / ok / reject"
        VARCHAR verified_by
        TIMESTAMPTZ verified_at
        TEXT reject_reason
    }
    application_status_history {
        INT history_id PK
        INT application_id FK
        ENUM from_status
        ENUM to_status
        VARCHAR changed_by
        TIMESTAMPTZ changed_at
        TEXT note
    }

    admission_round ||--o{ course_plan : "มีแผน"
    admission_round ||--o{ field_definition : "กำหนดฟอร์ม"
    admission_round ||--o{ application : "รับสมัครใน"
    course_plan ||--o{ exam_room : "มีห้องสอบ"
    course_plan ||--o{ application : "เลือกอันดับ 1 / 2"
    exam_room |o--o{ application : "จัดที่นั่ง"
    person ||--o{ application : "ยื่นได้หลายใบ"
    person ||--o{ student : "เป็นนักเรียน"
    application |o--o| student : "มอบตัวแล้วสร้างใหม่"
    classroom ||--o{ student : "สังกัด"
    application ||--o{ applicant_address : "มีที่อยู่"
    application ||--o{ applicant_guardian : "มีผู้ปกครอง"
    application ||--o| applicant_health : "มีสุขภาพ"
    application ||--o{ application_document : "แนบเอกสาร"
    application ||--o{ application_status_history : "บันทึกสถานะ"
```

### 4.2 ฝั่งแคลร์ (บุคลากร + ลา/บัตรขออนุญาต)

13 ตารางแรกยกจาก `er-employee.drawio` (ตรงกับ Figma) 6 ตารางสุดท้ายยกจาก Figma ล้วน ๆ ชื่อเปลี่ยนเป็น snake_case เท่านั้น

```mermaid
erDiagram
    employees {
        VARCHAR employee_id PK
        VARCHAR th_title
        VARCHAR en_title
        VARCHAR th_first_name
        VARCHAR th_last_name
        VARCHAR en_first_name
        VARCHAR en_last_name
        VARCHAR id_number "เลขบัตรประชาชน"
        DATE dob
        VARCHAR gender
        VARCHAR blood_group
        VARCHAR nationality
        VARCHAR religious
        VARCHAR phone_number
        VARCHAR email
        VARCHAR role "ข้อความ ไม่มีตารางบทบาท"
    }
    education {
        VARCHAR education_id PK
        VARCHAR employee_id FK
        VARCHAR degree
        VARCHAR major
        VARCHAR institution
        VARCHAR graduate_year
        DECIMAL gpa
    }
    royal_decorations {
        VARCHAR license_no PK "ต้นทางตั้งซ้ำกับ license"
        VARCHAR employee_id FK
        VARCHAR decoration_class
        DATE date_received
        VARCHAR year_received
        VARCHAR gazette_reference
    }
    license {
        VARCHAR license_no PK
        VARCHAR employee_id FK
        VARCHAR license_type
        DATE issue_date
        DATE expiry_date
    }
    toeic_score {
        VARCHAR toeic_id PK
        VARCHAR employee_id FK
        DECIMAL score
        DATE expiry_date
        VARCHAR document
    }
    job_details {
        VARCHAR job_id PK
        VARCHAR employee_id FK
        VARCHAR job_title
        VARCHAR department "ต้นทางสะกด dapartment"
        DATE start_date
        DECIMAL salary
        VARCHAR work_status
    }
    training {
        VARCHAR training_id PK
        VARCHAR employee_id FK
        VARCHAR training_name
        VARCHAR training_type
        VARCHAR organizer
        DATE start_date
        DATE end_date
        INT hour
        VARCHAR location
        VARCHAR country
        VARCHAR province
        DECIMAL cost
    }
    family_member {
        VARCHAR family_id PK
        VARCHAR employee_id FK
        VARCHAR th_title
        VARCHAR en_title
        VARCHAR th_first_name
        VARCHAR th_last_name
        VARCHAR en_first_name
        VARCHAR en_last_name
        VARCHAR phone_number
        VARCHAR relationship
        DATE dob
        VARCHAR marital_status
        VARCHAR life_status
        VARCHAR career
        VARCHAR education_level
    }
    address {
        VARCHAR address_id PK
        VARCHAR employee_id FK
        VARCHAR house_no
        VARCHAR moo
        VARCHAR soi
        VARCHAR street
        VARCHAR sub_district_id FK
        VARCHAR district_id FK
        VARCHAR province_id FK
        VARCHAR country_id FK
        VARCHAR address_type
    }
    countries {
        VARCHAR country_id PK
        VARCHAR th_country_name
        VARCHAR en_country_name
    }
    provinces {
        VARCHAR province_id PK
        VARCHAR country_id FK "ต้นทางไม่ติด _FK"
        VARCHAR th_province_name
        VARCHAR en_province_name
    }
    districts {
        VARCHAR district_id PK
        VARCHAR province_id FK
        VARCHAR th_district_name
        VARCHAR en_district_name
    }
    sub_districts {
        VARCHAR sub_district_id PK
        VARCHAR district_id FK
        VARCHAR th_sub_district_name
        VARCHAR en_sub_district_name
        VARCHAR zip_code
    }
    student_leave_type {
        VARCHAR id PK
        VARCHAR type
        VARCHAR description
        VARCHAR color
        INT max_days
        BOOL require_doc
    }
    student_leave_setting_type {
        VARCHAR id PK
        VARCHAR academic_terms_id FK "ชี้ academic_terms ของทีม A"
        VARCHAR student_leave_type_id FK
        INT max_days
        BOOL require_doc
    }
    student_leave_setting_approver {
        VARCHAR id PK
        VARCHAR student_leave_setting_id "คอลัมน์ตามต้นทาง ดูเหมือนก๊อปมา"
        VARCHAR student_leave_type_id
        INT max_days
        BOOL require_doc
    }
    student_leave_form {
        VARCHAR id PK
        VARCHAR student_id FK
        ENUM type "SICK_LEAVE / PERSONAL_LEAVE"
        DATE start_date
        DATE end_date
        BOOL is_half_day
        VARCHAR note
        VARCHAR attachment
    }
    student_leave_approval {
        VARCHAR id PK
        VARCHAR student_leave_form_id FK
        VARCHAR approver_id "id ของผู้อนุมัติ"
        ENUM status "PENDING / APPROVED / REJECTED"
        VARCHAR note
        DATETIME action_datetime
    }
    tardy_slip {
        VARCHAR id PK
        VARCHAR student_id FK
        ENUM type "ENTER_CLASSROOM / LEAVE_CLASSROOM / LEAVE_SCHOOL / EARLY_DISMISSAL / ASSIGNED_DUTY / OTHERS"
        DATE start_date
        DATE end_date
        TIME start_time
        TIME end_time
        VARCHAR note
        ENUM status "PENDING / APPROVED / REJECTED"
    }

    employees ||--o{ education : "มี"
    employees ||--o{ royal_decorations : "มี"
    employees ||--o{ license : "มี"
    employees ||--o{ toeic_score : "มี"
    employees ||--o{ job_details : "มี"
    employees ||--o{ training : "มี"
    employees ||--o{ family_member : "มี"
    employees ||--o{ address : "อยู่ที่"
    countries ||--o{ provinces : "มีจังหวัด"
    provinces ||--o{ districts : "มีอำเภอ"
    districts ||--o{ sub_districts : "มีตำบล"
    sub_districts ||--o{ address : "ระบุตำบล"
    districts ||--o{ address : "ระบุอำเภอ"
    provinces ||--o{ address : "ระบุจังหวัด"
    countries ||--o{ address : "ระบุประเทศ"
    student_leave_type ||--o{ student_leave_setting_type : "ถูกตั้งค่า"
    student_leave_form ||--o{ student_leave_approval : "ถูกพิจารณา"
```

### 4.3 จุดเชื่อมระหว่างสองฝั่ง

วาดเฉพาะตารางที่ต้องมีเส้นข้ามฝั่ง คอลัมน์ในกล่องมีแค่ที่เกี่ยวกับเส้น (ตัวเต็มอยู่หัวข้อ 4.1 และ 4.2) เส้นประ = อนุมาน 🟡 · เส้นทึบ = ตามต้นทาง ตารางที่มีหมายเหตุ "Figma" คือตารางส่วนกลางที่ไม่ได้อยู่ในฝั่งเนยสดหรือแคลร์

```mermaid
erDiagram
    student {
        INT student_id PK
        INT person_id FK
        INT classroom_id FK
    }
    classroom {
        INT classroom_id PK
        INT homeroom_teacher_id FK "ตามข้อ J4"
    }
    student_leave_form {
        VARCHAR id PK
        VARCHAR student_id FK
    }
    tardy_slip {
        VARCHAR id PK
        VARCHAR student_id FK
    }
    student_leave_approval {
        VARCHAR id PK
        VARCHAR approver_id "ตามข้อ J7"
    }
    employees {
        VARCHAR employee_id PK
    }
    teachers {
        VARCHAR id PK "Figma ส่วนกลาง"
        VARCHAR teacher_code
        VARCHAR first_name_th
        VARCHAR position_th
    }
    guardians {
        VARCHAR id PK "Figma ส่วนกลาง"
        VARCHAR first_name_th
        VARCHAR phone_number
        VARCHAR relationship
    }
    student_guardians {
        INT id PK "Figma ส่วนกลาง"
        VARCHAR student_id FK
        VARCHAR guardian_id FK
        BOOL is_emergency_contact
    }
    student_class_histories {
        INT id PK "Figma ส่วนกลาง"
        VARCHAR student_id FK
        INT class_id FK "ตามข้อ J3 ถือว่าคือ classroom"
    }
    academic_terms {
        INT id PK "Figma ทีม A"
        INT academic_year
    }
    student_leave_setting_type {
        VARCHAR id PK
        VARCHAR academic_terms_id FK
    }
    applicant_guardian {
        INT guardian_id PK
        INT application_id FK
    }

    student ||--o{ student_leave_form : "ยื่นใบลา"
    student ||--o{ tardy_slip : "ขอบัตร"
    student ||--o{ student_guardians : "มีผู้ปกครอง"
    guardians ||--o{ student_guardians : "ดูแล"
    student ||--o{ student_class_histories : "เคยอยู่ห้อง"
    classroom ||..o{ student_class_histories : "ประวัติห้อง"
    classroom ||--o{ student : "สังกัดปัจจุบัน"
    teachers ||..o{ classroom : "ครูประจำชั้น"
    teachers ||..|| employees : "คนเดียวกัน"
    employees ||..o{ student_leave_approval : "พิจารณา"
    academic_terms ||--o{ student_leave_setting_type : "กำหนดภาคเรียน"
    applicant_guardian }o..o{ guardians : "คนเดียวกันหลังมอบตัว"
```

## 5. ตารางเทียบชื่อเดิม → ชื่อใหม่ (ฝั่งแคลร์)

### 5.1 ตาราง

| ชื่อเดิม | ชื่อใหม่ |
|---|---|
| Employees | employees |
| Education | education |
| RoyalDecorations | royal_decorations |
| License | license |
| ToeicScore | toeic_score |
| JobDetails | job_details |
| Training | training |
| FamilyMember | family_member |
| Address | address |
| Countries · Provinces · Districts · SubDistricts | countries · provinces · districts · sub_districts |
| studentLeaveType · studentLeaveSettingType · studentLeaveSettingApprover · studentLeaveForm · studentLeaveApproval · tardySlip | student_leave_type · student_leave_setting_type · student_leave_setting_approver · student_leave_form · student_leave_approval · tardy_slip |

### 5.2 คอลัมน์ (กฎ: ตัดคำต่อท้าย `_PK` `_FK` แล้วแปลง camelCase เป็น snake_case)

| ชื่อเดิม | ชื่อใหม่ | หมายเหตุ |
|---|---|---|
| `employeeID` · `employeeID_FK` | `employee_id` | |
| `thTitle` · `enTitle` · `thFirstName` ฯลฯ | `th_title` · `en_title` · `th_first_name` ฯลฯ | |
| `idNumber` · `bloodGroup` · `phoneNumber` | `id_number` · `blood_group` · `phone_number` | |
| `educationID_PK` · `toeicID_PK` · `jobID_PK` · `trainingID_PK` · `familyID_PK` · `addressID_PK` | `education_id` · `toeic_id` · `job_id` · `training_id` · `family_id` · `address_id` | |
| `licenseNO_PK` (ทั้ง License และ RoyalDecorations) | `license_no` | 🟡 ต้นทางตั้งซ้ำกัน ไม่เปลี่ยนชื่อ |
| `dapartment` | `department` | 🟡 ต้นทางสะกดผิด |
| `subDistrictID_FK` · `districtID_FK` · `provinceID_FK` · `countryID_FK` · `countryID` | `sub_district_id` · `district_id` · `province_id` · `country_id` · `country_id` | `provinces.countryID` เป็น FK ทั้งที่ไม่ติด `_FK` |
| `id_PK` · `student_id_FK` (ตารางลา/บัตร) | `id` · `student_id` | ชื่อเดิมของ Figma เป็น snake_case อยู่แล้วบางส่วน (`student_id_FK`) |
| `academic_termsID` | `academic_terms_id` | |
| `studentLeaveTypeID` · `studentLeaveSettingID` · `studentLeaveFormIdFK` · `approverId` | `student_leave_type_id` · `student_leave_setting_id` · `student_leave_form_id` · `approver_id` | |
| `startDate` `endDate` `isHalfDay` `maxDays` `requireDoc` | `start_date` `end_date` `is_half_day` `max_days` `require_doc` | |
| `startTime` `endTime` | `start_time` `end_time` | |

ฝั่งเนยสดใช้ snake_case อยู่แล้ว ไม่ต้องแปลง

## 6. จุดสมมติและคำถามให้ทีม

เลขาไม่ตัดสินแทนทีม ข้อไหนที่ต้องเลือกทางเพื่อให้วาดได้ เลขาบอกไว้ว่าเลือกอะไร ข้อที่โยงกับคำถามใน `team-b-todo.md` ติ๊กในไฟล์นั้นไม่ได้จนกว่าเจ้าของข้อจะตัดสิน

| # | จุดสมมติ | เลขาเลือกอะไร | โยงกับข้อไหนใน team-b-todo.md |
|---|---|---|---|
| A1 | `students` ใน Figma คือ `student` ตัวเดียวกับของเนยสด (J1) | ให้ตารางลา/บัตรของแคลร์ชี้ `student` | "ER รับสมัคร: ผู้สมัครกับนักเรียนเก็บแบบไหน" |
| A2 | `classes` ใน Figma คือ `classroom` (J3) | ถือเป็นตารางเดียว | — |
| A3 | `teachers` 1:1 `employees` (J4) | เส้นยาวใน Figma ปลายเส้นไล่ไม่ถึง อนุมานจากเส้น `‖—‖` | "ER ของแคลร์ยังไม่ครบ" |
| A4 | `student_leave_approval.approver_id` ชี้ `employees` (J7) | อนุมานจากชื่อคอลัมน์ | — |
| A5 | `student_leave_setting_approver` ไม่ลากเส้น | ต้นทางไม่มีเส้น คอลัมน์ดูเหมือนก๊อป | — |
| A6 | `address` ของแคลร์ชี้ 4 ตาราง | วาดตามไฟล์ปัจจุบัน ทั้งที่แคลร์เขียนโน้ตว่าจะเก็บแค่ตำบล + postcode | "ตารางที่อยู่ ใช้ร่วมกันไหม" |
| A7 | `applicant_address` ไม่ผูกกับตารางที่อยู่ของแคลร์ | คงเป็นข้อความตามต้นทาง | "ตารางที่อยู่ ใช้ร่วมกันไหม" |
| A8 | `applicant_guardian` กับ `guardians` คนเดียวกันหลังมอบตัว | เส้นประอนุมาน ยังไม่ระบุวิธีย้ายข้อมูล | — |
| A9 | สถานะนักเรียน 3 ค่า | ตาม `erd.drawio` ทั้งที่เล่มมี use case "จัดการนักเรียนลาออก" ที่ต้องมีสถานะเพิ่ม | "สถานะนักเรียนหลังมอบตัวมี 3 หรือ 6 ค่า" |
| A10 | `person` → `application` → `student` แยก 3 ตาราง | ตาม `erd.drawio` | "ผู้สมัครกับนักเรียนเก็บแบบไหน" |
| A11 | สไตล์ชื่อ snake_case | นายเลือก แต่แคลร์ยังไม่ได้ตกลง เล่มตอนนี้แสดง ER บุคลากรเป็น camelCase (§3.4.1) | "สไตล์ตั้งชื่อตารางและคอลัมน์" |
| A12 | ไม่มีตารางผู้ใช้/บทบาท | ไม่เติม | "ใครถือ login/token" |
| A13 | ไม่มีตารางลาของครู และตั้งค่าระบบ | ไม่เติม ไม่ได้ออกแบบแทนแคลร์ | "ER ของแคลร์ยังไม่ครบ" |

## 7. ขั้นต่อไป

- ถ้าจะออกแบบทับ ใช้ไฟล์นี้เป็นตัวตั้งต้นเทียบ: หัวข้อ 2.4 กับ 6 คือรายการเรื่องที่ต้องตัดสิน
- หลังตัดสิน ตรวจ ER กับ use case ด้วย CRUD matrix ก่อนเขียน Data Dictionary (ตามหัวข้อ 5 ของ `knowledge/doc-master/analysis-n-design.md` ในโปรเจกต์เลขา)
- ถ้าจะวาดต่อ เปิด `erd-by-claude.drawio` ใน draw.io ได้เลย (ตารางเป็นกล่อง swimlane แก้คอลัมน์ได้ เส้นเชื่อมติดกับกล่อง) · ลำดับตารางใน drawio จัดตามคอลัมน์ ไม่ได้จัดเลย์เอาต์ละเอียด เส้นอาจพาดผ่านกล่องอื่น ลากย้ายเองได้
