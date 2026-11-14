# Handoff: รวมตารางทีม A (และ C) เข้า ER ทั้งระบบของทีม B

จาก: Claude (เลขาของเนยสด) · 2026-11-14 · ถึง: session ถัดไปที่ทำ ER ต่อ
งานค้างอยู่ `materials/ai-bro/TODO.md` หัว "รอ / ยังไม่เริ่ม" (ข้อที่ขึ้นต้น "ER ทั้งระบบ") · ไฟล์นี้บอกแค่ "ทำอะไรไป / รู้อะไรมา"
plan ฝั่งเลขา: `my personal researcher 2/plan/229-merge-team-a-agreements-erd.md` (🟢 เสร็จ) · รอบถัดไปจะเป็น plan 230 (ยังไม่เขียน)

## ไฟล์ที่แก้

`materials/doc/ver-full/erd-by-claude.drawio` แท็บแรก "ER ทั้งระบบ (ต้นฉบับ · แก้ที่นี่ที่เดียว) v3" (diagram id `pg-master-v3`)
- แก้เฉพาะ `<diagram id="pg-master-v3">` ตัวแรก · แท็บ "Copy of ER ทั้งระบบ…" มี id ซ้ำกัน ห้ามแตะ
- ยังไม่ commit

## ทำไปแล้ว (plan 229 · 2026-11-11 ถึง 11-12)

ตามข้อตกลงกับทีม A ข้อ B1–B4 ใน `materials/ai-bro/others/team-a-cross-team-change-summary.md`
- **AcademicYears** — ปี พ.ศ. เป็น PK แทนรหัสปี (เอาแถว academicYear ออก)
- **Semesters** — เพิ่ม `isCurrent`
- **SchoolRoom** — เพิ่ม `roomCode` (UK) · `shortName` · `roomType` · `maxClasses` · `isActive`
- ขยับ Classroom ลง +90 และ ClassroomHomeroomTeacher +90 (พร้อม waypoint ของเส้นที่ y≥1620) เพราะ SchoolRoom ยาวขึ้นจนทับ
- เติมคำอธิบายสีใน legend (เซลล์ที่ขึ้นต้น "สี: ฟ้า = เนยสด")

## รูปแบบที่เนยสดตกลงแล้ว (ใช้ต่อทุกตาราง)

- **ตารางจริงที่แก้ตามทีมอื่น** แก้ที่ตารางเดิม (เส้นเดิมยังต่ออยู่) แล้วเปลี่ยนเป็นหัวดำ `fillColor=#1a1a1a;strokeColor=#000000;fontColor=#ffffff;` · แถว `fillColor=#ffffff` เส้น `#999999` · desc `#e6e6e6` · แถวที่เพิ่ม/เปลี่ยนเป็นเขียว `#d5e8d4`
- **ฉบับเดิม** สร้างกล่องใหม่ชื่อ `(เดิม) X` หัวส้มเส้นประ `fillColor=#ffe6cc;strokeColor=#d79b00;dashed=1;fontColor=#777777;` (เขียวที่หัวอย่างเดียว ไม่ทำ · ลองแล้วเนยสดเลือกส้ม) · แถว `fillColor=none` เส้น `#cccccc` ตัวอักษร `#888888` · desc `#f5f5f5` เขียนว่า "ฉบับเดิมก่อนตกลงกับทีม A (2026-11-11) · เก็บไว้ดูเทียบ ไม่มีเส้นอื่นต่อ"
- **เส้นจากเดิม → ใหม่** `edgeStyle=orthogonalEdgeStyle;dashed=1;strokeColor=#999999;fontColor=#777777;endArrow=open;` ป้ายบอกว่าเปลี่ยนอะไร
- ห้ามลบตารางเก่า · ยังใช้ camelCase (snake_case ข้อ B6 ทำหลังพรีโปรเจก)

## รู้อะไรมาจาก docs ทีม A และ C (อ่าน 2026-11-14)

ไฟล์: `materials/ai-bro/others/team-a-final-proj1.md` (data dictionary ภาคผนวก ข บรรทัด ~3069–3860) · `team-c-final-proj1.md` (Database Design บรรทัด ~3888–4970)

**ทีม A (58 ตาราง schema `academic`)**
- **ไม่มี `semester_setting`** แล้ว — ย้ายไปอยู่ใน `semester`: `is_current` · `grade_submission_deadline` · `unavailability_deadline` · `remedial_deadline` · ต้องเติม 3 deadline ใน Semesters ของเรา
- `academic_year` มี `start_date` `end_date` — เทียบกับ AcademicYears ของเรา
- `learning_area`: `learning_area_id` PK · `area_code` UK · `area_name` UK · `area_type` (learning_area / activity) · `sequence`
- `app_user` (ฉบับย่อของ A) มี `learning_area_id` = กลุ่มสาระที่ครูสังกัด → ชนกับ Department ของเรา (คำถาม Q2)
- `teacher_subject`: PK คู่ `user_id` (→ app_user) + `subject_id` (→ subject ของ A)
- `room`: ค่า `room_type` = regular · lab · computer · sport · art · music (ตอบข้อ B5 แล้ว) · `max_classes` = จำนวนห้องเรียนที่ใช้พร้อมกันได้ ค่าเริ่มต้น 1 (ลบ ⚠️ ได้) · มี `room_name` `capacity` `building` `status` ที่ต้องเทียบกับ SchoolRoom
- `classroom` มี `home_room_id` → room และ `study_plan_id` → study_plan

**ทีม C (41 ตาราง)**
- FK ที่ชี้ตารางกลาง: app_user 41 · student 14 · semester 8 (ชื่อ `term_id` ทุกที่ = ข้อ C3) · academic_year 5 · classroom 2
- ตารางข้อมูลร่วมที่ควรวาดในผังทั้งระบบ: `TeacherResponsibility` (ครูที่ปรึกษา × นักเรียน × ภาค) · `ParentStudentLink` · `RegistryCorrectionRequest` (C ส่งคำขอแก้ทะเบียนมาที่ B) · ที่เหลือเขียนหมายเหตุแทนวาด (เลขาเสนอ เนยสดยังไม่ตัดสิน)

## สคริปต์ (`materials/ai-bro/tools/erd-merge/`)

รันด้วย `C:\Python311\python.exe -I` · เปิดไฟล์ด้วย `encoding="utf-8", newline=""`
| สคริปต์ | ทำอะไร |
|---|---|
| `rest229.py <drawio> [dry]` | แก้ตารางเป็นหัวดำ + เพิ่มแถวเขียว + สร้างกล่อง "(เดิม)" + เส้นประ · แก้ `JOBS` ข้างในก่อนรัน · `dry` = แค่หาที่ว่างวางกล่อง · บรรทัด legend ท้ายไฟล์ห้ามรันซ้ำ (จะเติมซ้ำ) |
| `crop229.py <src> <out> X0 Y0 X1 Y1` | ตัด drawio เฉพาะพื้นที่ไว้ export ภาพดู |
| `cfk230.py <team-c md>` | นับ FK ของทีม C ที่ชี้ตารางกลาง |

export ภาพ: `"/c/Program Files/draw.io/draw.io.exe" -x -f png -s 1.5 -b 20 -o out.png in.drawio`

## กับดักที่เคยเจอ

- ป้ายเส้นซ้อนกันถ้ากล่องเดิมห่างจากตารางจริงแค่ 60 px → เว้น 180
- เปลี่ยนแค่หัวตารางเป็นดำ แถวจะดำตาม → ต้องตั้ง fill ของทุก cell เป็น #ffffff
- กล่องเดิมวางทับเส้นแนวตั้งได้ → เช็กเส้นด้วยภาพ export ก่อนส่ง
- เนยสดอาจแก้ไฟล์ระหว่างทาง (เคยเพิ่มแท็บ Copy) → เช็ก mtime แล้วอ่านใหม่ก่อนแก้ทุกครั้ง · อย่าจัดเส้นที่เนยสดปรับเอง
