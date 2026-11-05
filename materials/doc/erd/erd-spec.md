# Spec แก้ ERD ฝั่งเนยสด (รับสมัคร + ทะเบียน)

> สร้างจากการ grill 2026-11-05 ตามคอมเมนต์อาจารย์ · plan 200 (โฟลเดอร์เลขา) · ใช้ไล่แก้ `erd-by-claude.drawio` หน้า "ER เนยสด (รับสมัคร+ทะเบียน)" และหน้า "จุดเชื่อมสองฝั่ง"
> คำศัพท์อยู่ที่ `CONTEXT.md` · ADR อยู่ที่ `adr/` · ไฟล์นี้ไม่แก้ drawio ให้ นายแก้เอง
> ข้อที่ยังไม่ตัดสินอยู่หัวข้อ 4 ห้ามถือว่าตัดสินแล้ว

---

## 1. คอมเมนต์อาจารย์ → สิ่งที่ตัดสิน

| # | คอมเมนต์อาจารย์ | ในไฟล์เดิม | ตัดสินว่า |
|---|---|---|---|
| 1 | คนเดิมสมัครหลาย admission ควรใช้ข้อมูลเดิมไหม · ทำเหมือนระบบ account ที่ไม่ได้สมัคร ใช้ OTP / เลขบัตร | `person` UK เลขบัตร, 1:N `application` แต่ข้อมูลลูกผูก `application` กรอกซ้ำทุกใบ | สมัครซ้ำ = เลขบัตร + OTP ทางอีเมลผู้ติดต่อหลัก แล้วดึงใบล่าสุดมาเติมให้ ใบใหม่ยังแยกใบ |
| 2 | ประวัติที่โยงกับ applications น่าจะย้ายไป persons | ตารางลูก address/guardian/health ชี้ `application_id` | **ไม่ย้าย** คง application เป็น log (ADR 0001) ตัวบุคคลเกิดตอนมอบตัวที่ `student` (ADR 0002) |
| 3 | student classroom id เก็บเป็น log แยกตาราง | `student.classroom_id` ห้องปัจจุบันอย่างเดียว | ตารางใหม่ `student_class_history` เอา `classroom_id` ออกจาก `student` |
| 4 | ครู 1 คนดูได้ 1 ห้อง · 1 ห้องมีได้หลายคน ใครมั่ว | `classroom.homeroom_teacher_id` = 1 ห้องมีครู 1 คน (กลับด้าน) | **diagram ผิด** · ตารางคั่น `classroom_homeroom_teacher` · 1 ห้องหลายครู · 1 ครู 1 ห้องต่อปี |
| 5 | exam_room คืออะไร ทำไม 1:N จาก school_room ควรเชื่อม admission_round | `exam_room.plan_id` ชี้ `course_plan` | ผูก **รอบ** แทนแผน (หัวข้อ 2.4) |
| 6 | school_room ใส่สเปคห้องสอบ แมนซีจะใช้ | มีแค่ ชื่อ อาคาร ชั้น ความจุ | เพิ่มที่นั่งสอบ สถานะใช้เป็นห้องสอบได้ ผังแถว×คอลัมน์ (ไม่บังคับ) |

ข้อเพิ่มจากนาย (ไม่ใช่คอมเมนต์อาจารย์): `classroom` ควรมี FK ไป `school_room` และแผนการเรียน แทนการเขียนเป็น string

## 2. สิ่งที่ตัดสินแล้ว รายตาราง

### 2.1 ตารางใหม่

| ตาราง | คืออะไร | คอลัมน์หลัก (ชื่อชั่วคราว) |
|---|---|---|
| `study_program` | แผนการเรียนที่โรงเรียนเปิดสอน แถวเดียวถาวร | `study_program_id` PK · `name` · `level` (ระดับชั้น ถ้าต้องแยกตามระดับ ดู ❓ ข้อ 4.6) |
| `student_class_history` | ประวัติห้องของนักเรียน | `id` PK · FK `student_id` · FK `classroom_id` · `class_no` (เลขที่) · `start_date` · `end_date` (ว่าง = ห้องปัจจุบัน) |
| `classroom_homeroom_teacher` | ครูประจำชั้น | `id` PK · FK `classroom_id` · FK `employee_id` (ชี้ `employees` ของแคลร์) · UK(`employee_id`, ปีการศึกษา) ดู ❓ ข้อ 4.2 |

### 2.2 ตารางที่แก้

| ตาราง | เอาออก | เพิ่ม/เปลี่ยน |
|---|---|---|
| `admission_round` | — | ไม่เปลี่ยน |
| `course_plan` | `level` และ `name` (ข้อความ) ถ้าย้ายไปอยู่ `study_program` ดู ❓ ข้อ 4.6 | FK `study_program_id` · คงวันทั้ง 6 วัน (เปิด-ปิดรับสมัคร, สอบ, ประกาศผล, รายงานตัว, มอบตัว) แต่ละแผนตั้งเองได้ · คง `capacity` `regulations` |
| `exam_room` | FK `plan_id` | FK `round_id` ชี้ `admission_round` · UK(`round_id`, `school_room_id`) · คง `name` `capacity` (ที่นั่งที่เปิดใช้ในรอบนี้) |
| `school_room` | — | `exam_capacity` (ที่นั่งสอบ แยกจากความจุปกติ) · `is_exam_room` (ใช้เป็นห้องสอบได้ไหม) · `exam_rows` · `exam_cols` (สองตัวหลังไม่บังคับกรอก) |
| `application` | FK `person_id` · `grade_level` · `plan_choice_1/2` (รวมเหลือ `plan_id`) | เก็บเลขบัตร ชื่อ ฯลฯ ครบในใบ · เลขบัตร**ห้าม UK เดี่ยว** แต่ UK คู่กับ `round_id` (1 คน 1 ใบต่อรอบ) · FK `plan_id` ชี้ `course_plan` (1 ใบ 1 แผน) · FK `exam_room_id` ชี้ exam_room ใหม่ · คง `round_id` (ดู 2.6) |
| `student` | `classroom_id` · FK `person_id` | ย้ายข้อมูลตัวบุคคลจากตาราง person เข้ามา: เลขบัตร (UK) · คำนำหน้า · ชื่อ · นามสกุล · ชื่อ-สกุลอังกฤษ · วันเกิด · เพศ · สัญชาติ · ศาสนา · `created_at` · `updated_at` · คง `from_application_id` |
| `classroom` | `major` (ข้อความ) · `homeroom_teacher_id` | FK `study_program_id` · FK `school_room_id` (ไม่บังคับกรอก ซ้ำห้องจริงได้) |
| ตารางลูกของนักเรียน (ถ้ามีในอนาคต: ที่อยู่ สุขภาพ ประวัติการศึกษาจริง) | — | ชี้ `student_id` ไม่ใช่ person |

### 2.3 ตารางที่ลบ

| ตาราง | เหตุผล |
|---|---|
| `person` | ยุบเข้า `student` (ADR 0002) |
| เส้น person→application, person→student | ตามข้างบน |
| `student_class_histories` ของ Figma (หน้า "จุดเชื่อมสองฝั่ง") | แทนด้วย `student_class_history` ที่เนยสดออกแบบเอง · ควรคุยกับทีม A ก่อนทิ้ง ดู ❓ ข้อ 4.5 |
| `teachers` ของ Figma ในส่วนครูประจำชั้น | ใช้ `employees` ของแคลร์ · เส้น teachers→classroom และ teachers↔employees ตัดออก |

### 2.4 exam_room อธิบายให้ชัด (ที่นายสงสัย)

ใช้**จัดผู้สมัครลงห้องสอบ** `application.exam_room_id` + `seat_number` = เด็กคนนี้สอบห้องไหน นั่งที่นั่งเลขไหน · `exam_room` = "ในรอบนี้ ห้องจริงห้องไหนถูกเปิดเป็นห้องสอบและรับได้กี่ที่" · ที่นั่งนับแยกตามวันสอบ เพราะวันสอบอยู่ที่ `course_plan` (แต่ละแผนตั้งเอง) ห้องเดียวใช้ได้หลายวัน

ขอบเขต: เฉพาะห้องสอบรับสมัคร ห้องสอบกลางภาค/ปลายภาคของโรงเรียน**ยังไม่ทำ** (ทีม A อาจทำ กลัวชนกัน)

### 2.5 ที่ไม่เปลี่ยน

`applicant_address` · `applicant_guardian` · `applicant_health` · `application_document` · `application_status_history` (ชี้ `application_id` เหมือนเดิม) · `guardians` + `student_guardians` (M:N ตาม Figma ใช้กับ Portal ผู้ปกครอง) · ตารางตั้งค่า 5 ตาราง · ฝั่งแคลร์ทั้งหมด (`employees` ไม่รวมกับ student)

### 2.6 ตัดสินเพิ่ม รอบ 2 (2026-11-05 · plan 202)

ที่มา: นายทักว่า `plan_choice` ทำไมมี 2 คอลัมน์ ทั้งที่ไม่ได้ grill (มาจากฟอร์ม prototype ไม่ใช่การตัดสินของทีม) แล้วให้ไล่หาจุดที่ไม่ make sense

| เรื่อง | ตัดสินว่า | เพราะ |
|---|---|---|
| เลือกแผน | **1 ใบสมัครเลือก 1 แผน** · `application.plan_id` คอลัมน์เดียว | นายตอบ · ปัญหาเลือก 2 แผนวันสอบคนละวันแต่ใบมีห้องสอบ/ที่นั่งได้ชุดเดียวหายไปเอง |
| ใบต่อรอบ | 1 คน 1 ใบต่อรอบ · UK(`citizen_id`, `round_id`) | นายตอบ |
| `application.round_id` | **คงไว้** ให้ฐานข้อมูลเช็กกฎข้างบน · ต้องตรงกับ `course_plan.round_id` ของแผนที่เลือก และ `exam_room.round_id` ของห้องสอบ | นายตอบ (เลือกคง หลังรู้ว่าเอาออกแล้วเช็กใบซ้ำในรอบเดียวกันไม่ได้) |
| `application.grade_level` | เอาออก ซ้ำกับ `course_plan.level` (รู้ชั้นจากแผนที่สมัคร) | เลขาเสนอใน plan 202 · นายอนุมัติ plan |
| ชั้นของห้องเรียน | `classroom.level` ต้องเข้ากับ `study_program.level_band` (ม.1–ม.3 กับ ม.ต้น · ม.4–ม.6 กับ ม.ปลาย) | เขียนเป็นกฎ ไม่ใช่ FK |
| ที่นั่งสอบ | `exam_room.capacity` ห้ามเกิน `school_room.exam_capacity` | เขียนเป็นกฎ |
| ห้องปัจจุบัน | `student_class_history` นักเรียน 1 คนมีแถวที่ `end_date` ว่างได้แถวเดียว | เขียนเป็นกฎ |
| `student.from_application_id` | คงชี้ใบล่าสุดที่มอบตัว ใบเก่าหาด้วยเลขบัตร | ไม่ทำอะไรเพิ่ม |
| หน้า "จุดเชื่อมสองฝั่ง" และ "Chen ภาพรวม" | **ยังเป็นแบบเก่า** (มี `homeroom_teacher_id` · `student.classroom_id` · `teachers` · person) | งานใหญ่ ทำทีหลัง จดไว้ใน `tasks.md` ฝั่งเลขา |

## 3. เช็กลิสต์ไล่แก้ drawio

- [ ] เพิ่ม `study_program`
- [ ] เพิ่ม `student_class_history` ตัดเส้น student→student_class_histories (Figma) เดิมออก
- [ ] เพิ่ม `classroom_homeroom_teacher` · ตัด `homeroom_teacher_id` ใน `classroom`
- [ ] `school_room`: เพิ่ม 4 คอลัมน์ตามข้อ 2.2
- [ ] `exam_room`: เปลี่ยน FK จาก `plan_id` เป็น `round_id` · เส้น course_plan→exam_room เปลี่ยนเป็น admission_round→exam_room
- [ ] `course_plan`: เพิ่ม FK `study_program_id`
- [ ] `classroom`: เอา `major` ออก ใส่ FK `study_program_id` กับ `school_room_id`
- [ ] `application`: เอา `person_id` `grade_level` ออก · `plan_choice_1/2` รวมเป็น `plan_id` · ตัดเส้น person→application
- [ ] `student`: ย้ายคอลัมน์ person เข้ามา เอา `classroom_id` กับ `person_id` ออก
- [ ] ลบ `person`
- [ ] หน้า "จุดเชื่อมสองฝั่ง": ตัดเส้น teachers→classroom, teachers↔employees เพิ่มเส้น employees→classroom_homeroom_teacher→classroom, ปรับเส้น classroom→student เป็นผ่าน `student_class_history`
- [ ] ปรับโน้ตบนหัวหน้า (ฉบับเร่ง/ยังไม่ตรวจ) ให้ตรงของจริง

> ✅ แท็บ v2 สร้างจากสเปกแล้ว (2026-11-05 · plan 201): แท็บ "ER เนยสด v2 (หลัง grill 2026-11-05)" ใน `erd-by-claude.drawio` (21 ตาราง · แท็บเดิมไม่แตะ · ยังไม่จัดเส้น นายจัดเอง) และหน้าอธิบาย `erd-v2-explained.html` · สเปกสคริปต์ `er-tools/er_nuesod_spec_v2.py` (ในโฟลเดอร์เลขา) · ผลต่าง: `erd-by-claude.md` กับ Data Dictionary ยังสร้างจาก ER เดิม จนกว่า ER ใหม่นิ่ง

## 4. ❓ ที่ยังไม่ตัดสิน (ห้ามถือว่าตัดสินแล้ว)

| # | เรื่อง | ทางที่เป็นไปได้ |
|---|---|---|
| 4.1 | ชื่อตารางใหม่ 3 ตัว (`study_program` `student_class_history` `classroom_homeroom_teacher`) เป็นชื่อชั่วคราว | นายตั้งเองหรือคงไว้ |
| 4.2 | กฎครู 1 คน 1 ห้องต่อปี ต้องมีปีการศึกษาในการเช็ก `classroom` มี `academic_year` อยู่แล้ว | ใช้ constraint ผ่านการ join / เก็บ `academic_year` ซ้ำในตารางคั่น · ✅ ตัดสินแล้ว 2026-11-05: เก็บ `academic_year` ซ้ำในตารางคั่น + UK(`employee_id`, `academic_year`) (นายตอบ · plan 201) |
| 4.3 | ตอนมอบตัว หาผู้ปกครองคนเดิมใน `guardians` ด้วยอะไรก่อนสร้างใหม่ | เบอร์โทร / อีเมล / เลขบัตรผู้ปกครอง (ตอนนี้ใบสมัครยังไม่เก็บเลขบัตรผู้ปกครอง) |
| 4.4 | `application.exam_room_id` กับ `seat_number` ที่นั่งนับแยกตามวันสอบได้จริงไหม เพราะ application ชี้แค่ห้อง ไม่ชี้วัน (วันอยู่ที่ course_plan ของใบนั้น) | น่าจะพอ เพราะวันสอบรู้จาก `plan_choice_1` · ต้องเช็กตอนออกแบบการจัดที่นั่ง · ✅ หมดปัญหา 2026-11-05 (plan 202): 1 ใบสมัครเลือก 1 แผน จึงมีวันสอบวันเดียว |
| 4.5 | ทีม A ใช้ `student_class_histories` ของ Figma อยู่ไหม ถ้าใช้ต้องคุยก่อนทิ้ง | ถามทีม A |
| 4.6 | `level` กับ `name` ของแผน อยู่ `study_program` หรือ `course_plan` (แผนเดียวเปิดหลายระดับไหม เช่น วิทย์-คณิต ม.4 กับ ม.5) | ถ้าแผนผูกระดับ → `study_program` มี `level` · ถ้าไม่ผูก → `level` อยู่ `course_plan` · ✅ ตัดสินแล้ว 2026-11-05: `study_program` เก็บช่วงชั้น (`level_band` ม.ต้น/ม.ปลาย) · `course_plan` เก็บชั้นที่เปิดรับ (`level` ม.1/ม.4) · `classroom` เก็บชั้นจริงของห้อง (นายตอบ · plan 201) |
| 4.7 | ที่สร้าง drawio หน้านี้มาจากสเปก `report-drafts/school-dark/er-tools/er_nuesod_spec.py` (ห้ามแก้ drawio ด้วยมือตามโน้ตในไฟล์) นายจะแก้ drawio เอง จึงต้องรู้ว่าสเปกสคริปต์จะเลิกใช้ หรือจะแก้ตาม | ตัดสินทีหลัง |
| 4.8 | `data-dictionary.md` `api-list.md` `er-*.md` ใน `report-drafts/school-dark` สร้างจาก ER เดิม จะล้าสมัยหลังแก้ | รอ ER ใหม่นิ่งแล้วสร้างใหม่หรือเลิก (ตามที่ตัดสินไว้ใน handoff) |

## 5. ที่มาของข้อตัดสิน (สำหรับตอบอาจารย์)

- ใบสมัครเป็น log: นายเสนอเองหลังเห็นตัวอย่าง GPAX ของเด็กสมัครสองรอบ (ADR 0001)
- ยุบ person: ผลของข้อข้างบนกับการไม่รวม `employees` (ADR 0002)
- ครู-ห้อง: อาจารย์ถามว่าใครมั่ว คำตอบคือ diagram ผิด (1 ห้องมีครู 1 คน กลับกับที่ตั้งใจ)
- exam_room ผูกรอบ: ตรงตามที่อาจารย์ชี้
