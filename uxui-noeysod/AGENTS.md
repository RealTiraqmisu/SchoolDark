<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Admitify Spark — ระบบบริหารจัดการผู้สมัครเรียน (Student Admission System) - Static Demo

คู่มือฉบับรวมสำหรับ AI agent ทุกตัว (Claude, Gemini, หรืออื่นๆ) ที่ทำงานกับโปรเจกต์นี้ — **ไฟล์นี้คือ source of truth เพียงไฟล์เดียว** ดูหมายเหตุท้ายไฟล์

> [!IMPORTANT]
> โปรเจกต์นี้ได้รับการย้ายระบบ (Migration) จาก React/TanStack Start มาเป็น **Vanilla HTML / CSS / JavaScript (Static Web)** เรียบร้อยแล้วเพื่อความเรียบง่ายในการทำ Demo และการเชื่อมต่อกับ Python Backend ในอนาคต

---

## 🌟 ภาพรวมของโปรเจกต์ (Project Overview)

**Admitify Spark** เป็นเว็บแอปพลิเคชันสำหรับเจ้าหน้าที่และครูผู้ดูแลการรับสมัครนักเรียน (สำหรับระดับชั้น **ม.1** และ **ม.4**) เพื่อติดตามสถานะของผู้สมัคร ตั้งแต่ขั้นตอนการชำระเงินค่าสมัครสอบ การกรอกคะแนนประกาศผลสอบ ไปจนถึงการรายงานตัวและมอบตัวเป็นนักเรียนอย่างสมบูรณ์

> actor หลักของระบบในตอนนี้คือ**คุณครู** — โปรเจกต์นี้กำลังสร้างสำหรับ actor คุณครูเป็นหลัก

ระบบแบ่งกระบวนการทำงานออกเป็น **3 เฟส (Phases)** หลัก:

1. **เฟสที่ 1: รับสมัครและคัดเลือก (Registration & Screening)**
   สถานะ: `ยังไม่ได้ชำระเงินค่าสอบ` (`unpaid_exam_fee`), `ชำระเงินค่าสอบแล้ว` (`paid_exam_fee`)
2. **เฟสที่ 2: ประกาศผลสอบ (Exam Results & Announcement)**
   สถานะ: `รอประกาศผลสอบ` (`awaiting_results`), `สอบผ่าน` (`passed`), `สำรอง` (`reserve`), `สอบไม่ผ่าน` (`failed`)
3. **เฟสที่ 3: รายงานตัวและมอบตัว (Reporting & Enrollment)**
   สถานะ: `ยังไม่ได้รายงานตัว` (`not_reported`), `รายงานตัวแล้ว` (`reported`), `มอบตัวเสร็จสิ้น` (`enrolled`)

---

## กฎและข้อจำกัดการพัฒนาต่อ (Developer Rules)

1. **หลีกเลี่ยงการใช้ตัวแปลภาษาหรือระบบ Build:** ห้ามนำ React, Vite, Bun, หรือ TypeScript กลับมาใช้ในระบบส่วนหน้านี้ ยกเว้นแต่มีคำสั่งที่ชัดเจนจากผู้ใช้
2. **ความเข้ากันได้:** โค้ดทั้งหมดต้องทำงานได้ทันทีเมื่อเปิดไฟล์ HTML แบบตรงๆ (`file:///...`) ในเว็บเบราว์เซอร์ (ดูกฎการทดสอบเพิ่มเติมด้านล่าง)
3. **ธีมสี:** ทั้งระบบเป็นธีมสีขาว/สว่าง (migrate จากธีมมืดเดิมแล้ว) — ยกเว้นจุดที่ตั้งใจให้มืดต่อ: QR PromptPay ใน `status.html` และ ID card mockup ห้ามเปลี่ยนกลับเป็นมืดทั้งหน้าโดยไม่ได้รับคำสั่ง

## 🛠️ เทคโนโลยีที่เลือกใช้ (Tech Stack)

ระบบเปลี่ยนมาใช้วิธีรันตรงบนเบราว์เซอร์ผ่าน CDNs เพื่อความง่ายในการเข้าถึงข้อมูล:

* **Markup & Structure:** [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) โครงสร้างตามมาตรฐานเซแมนติก
* **Styling (CSS):** [Tailwind CSS CDN](https://cdn.tailwindcss.com) ดึงสไตล์ชีทแบบ Dynamic และปรับแต่งโทนสีหลักผ่าน `tailwind.config` ในแต่ละหน้า
* **Logic & Event Handling:** [Vanilla JavaScript (ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) ไร้กรอบการทำงานของเฟรมเวิร์ก เพื่อให้ง่ายต่อการพัฒนาและควบรวมกับโค้ดฝั่ง Server (เช่น Python Flask/FastAPI) ในอนาคต
* **Icons:** [Lucide Icons CDN](https://lucide.dev/) (`https://unpkg.com/lucide@latest`) ใช้สคริปต์ JavaScript โหลดภาพเวกเตอร์แบบเรียลไทม์
* **State Persistence:** [Web Storage API (LocalStorage)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) ใช้บันทึกข้อมูลแบบ Persistent ในเบราว์เซอร์ เพื่อรักษาข้อมูลให้คงอยู่แม้มีการสลับหน้าจอหรือกดรีเฟรชหน้าเว็บ

---

## 📁 โครงสร้างโฟลเดอร์และไฟล์ปัจจุบัน (Project Structure)

```text
admitify-spark/
├── AGENTS.md                 # เอกสารและคำแนะนำฉบับรวม (ไฟล์นี้) — source of truth เพียงไฟล์เดียว
├── gemini.md / GEMINI.md      # pointer สั้นๆ ชี้กลับมาที่ AGENTS.md
├── CLAUDE.md                  # pointer สั้นๆ ชี้กลับมาที่ AGENTS.md
├── js/
│   └── store.js              # ตัวจัดการข้อมูลส่วนกลาง (LocalStorage Database) และ Utility functions
├── index.html                 # หน้า Dashboard หลัก สำหรับสลับเฟส กรองผลลัพธ์ และจัดการรายชื่อ
├── apply.html                 # พอร์ทัลสมัครเรียนออนไลน์ (ผู้ปกครอง/นักเรียน)
├── edit.html                  # หน้าแบบฟอร์มแก้ไขประวัติข้อมูลส่วนตัวและแผนการศึกษาของนักเรียน
├── students.html               # หน้าข้อมูลนักเรียน (ตารางจัดการรายชื่อหลัก)
├── profile.html                # โปรไฟล์ผู้สมัครแบบละเอียด (ประวัติ, ที่อยู่, ผู้ปกครอง, การศึกษา, สุขภาพ, เอกสาร)
├── status.html                 # หน้าตรวจสอบสถานะผู้สมัคร
├── notify.html                 # ระบบแต่งข้อความและจำลองส่งอีเมลแจ้งเตือน/ประกาศผลหาผู้ปกครอง
├── settings.html                # ตั้งค่าฟอร์มรับสมัคร (field settings)
├── course_settings.html          # ตั้งค่าแผนหลักสูตร/แผนการเรียน
├── room_exam_settings.html        # ตั้งค่าห้องสอบ
├── student_field_settings.html    # ตั้งค่าคอลัมน์ตารางข้อมูลนักเรียน (เพิ่ม/ลบ/เรียงลำดับ/ตั้งคอลัมน์หลัก) — โคลนโครงจาก course_settings.html
├── database.drawio             # แผนภาพฐานข้อมูล
├── materials/
│   ├── user-journey/          # ไฟล์อธิบาย flow การทำงานของแต่ละฟีเจอร์ (ดูคู่กับ mockup)
│   └── mockup/                # ไฟล์ดีไซน์/ภาพหน้าตา UI ของแต่ละฟีเจอร์ (ดูคู่กับ user-journey)
├── schoolbright/               # ภาพอ้างอิงดีไซน์เพิ่มเติม (เช่น settings/, ข้อมูลนักเรียน.png)
└── tasks/
    └── task.md                # task tracker แยกต่างหาก (ใช้ `[x]` checkbox เมื่อทำเสร็จ)
```

---

## 💻 เจาะลึกการออกแบบและสถาปัตยกรรม (Architecture & Design)

### 1. การจัดการข้อมูลจำลอง (State Management)

* ทำงานอยู่ในไฟล์ `js/store.js` (`AdmitifyStore`, global บน `window`)
* **LocalStorage DB:** ระบบจะมองหา key ต่างๆ เช่น `admitify_applicants`, `admitify_field_settings`, `admitify_course_plans`, `admitify_exam_rooms` หากไม่มีค่าอยู่จะดึงข้อมูล Seed ชุดเริ่มต้นไปบันทึกเก็บไว้ทันที (มีผู้สมัครตัวอย่าง, แผนหลักสูตร, ห้องสอบ ฝังไว้เพื่อ demo)
* **ฟังก์ชัน API ภายในที่สำคัญ:**
  - `getApplicants()`: ดึงข้อมูลล่าสุด
  - `updateStatus(id, newStatus)`: เปลี่ยนสถานะนักเรียน และมีเงื่อนไขพิเศษ เช่น หากเปลี่ยนสถานะเป็น `enrolled` (มอบตัวเสร็จสิ้น) จะสุ่มเจนรหัสนักเรียนในรูปแบบ `STD-2568-XXXX` ให้อัตโนมัติ
  - `updateScore(id, raw, gpa)`: บันทึกคะแนนดิบและ GPAX
  - `updateApplicant(id, data)`: อัปเดตข้อมูลผู้สมัครจากหน้าแก้ไขข้อมูล พร้อมลงประวัติผู้แก้ (`lastEditedBy`, `lastEditedAt`)
  - `deleteApplicant(id)`: ลบรายชื่อผู้สมัครรายบุคคล
  - `effectiveClassroom(student)`: ห้องเรียนจริงของนักเรียน — ใช้ `student.classroom` ที่บันทึกไว้ (หลังย้ายห้อง) ถ้ามี ไม่งั้น fallback ไปคำนวณจากแผนการเรียน (`classroomFor`); **ทุกหน้าที่แสดง/กรอง/เรียงห้องเรียนต้องเรียกฟังก์ชันนี้แทนคำนวณเอง** ไม่งั้นย้ายห้องแล้วบางหน้าจะยังโชว์ห้องเดิม
  - `classroomOptions(grade?)`: รายชื่อห้องเรียนมาตรฐานทั้งโรงเรียน (6 ระดับชั้น × 5 ห้อง) พร้อมจำนวนคนที่ `enrolled` จริงต่อห้อง — ใช้จุดเดียวกันทั้ง chip filter, โมดัลย้ายห้องเรียน, โมดัลเลื่อนชั้น ฯลฯ ห้ามฮาร์ดโค้ดรายชื่อห้องซ้ำที่อื่น
  - `getStudentColumns()` / `saveStudentColumns()` / `resetStudentColumns()`: config คอลัมน์ตาราง `students.html` (คล้ายแพตเทิร์นเดียวกับ `admitify_exam_rooms`) — แก้ที่ `student_field_settings.html`, `students.html` เรนเดอร์หัวตาราง/เซลล์ตาม config นี้แบบ data-driven ไม่ใช่ `<th>`/`<td>` ฮาร์ดโค้ด
* แต่ละหน้า HTML เรียกใช้ `AdmitifyStore` ตรงในสคริปต์ inline โดยตรง ไม่มี routing/build system ใดๆ

### 2. ฟังก์ชันเด่นบนหน้าเว็บหลัก (Core UI Features - index.html / students.html)

* **การกรองข้อมูลอัจฉริยะ (Smart Filter):** สลับแท็บตามเฟสการรับสมัคร (เฟส 1, 2, 3) พร้อมมีช่องค้นหาตัวอักษร, กรองตามระดับชั้น (ม.1 / ม.4) และกรองแยกตามแผนการเรียน — ใน `students.html` ตัวกรอง chip ทั้ง 4 แถว (ระดับชั้น/ห้องเรียน/แผนการเรียน/สถานะ) เก็บ state เป็น `Set` (เซ็ตว่าง = "ทั้งหมด") และมีสวิตช์ "เลือกหลายอัน" ข้าง dropdown "เรียงตาม" ให้เลือกได้มากกว่า 1 ค่าต่อแถวพร้อมกันเมื่อเปิดไว้ (ปิด = เลือกได้ทีละค่าเหมือนเดิม); แถวห้องเรียนขึ้นเฉพาะเมื่อเลือกระดับชั้นแล้ว ไม่งั้นโชว์ข้อความจางๆ แทน chip ทั้งโรงเรียน (task-14)
* **การทำรายการแบบกลุ่ม (Bulk Actions):** สามารถเลือกติ๊กถูกรายคน หรือกดปุ่ม `Shift` ค้างเพื่อเลือกแบบเป็นช่วง (Range Selection) จากนั้นแถบ Bulk Action จะเลื่อนขึ้นมาเพื่อให้ผู้ใช้งานเปลี่ยนสถานะพร้อมกันหลายคน สั่งจำลองการพิมพ์ หรือส่งอีเมลแจ้งเตือนพร้อมกันได้
* **ระบบย้อนกลับ (Undo Action):** เมื่อเปลี่ยนสถานะนักเรียน ระบบจะแสดงป๊อปอัปแจ้งเตือน (Toast Notification) ที่มีปุ่ม "ย้อนกลับ" ด้านหลัง หากคลิกจะย้อนกลับค่าสถานะนักเรียนรายคนหรือรายกลุ่มเป็นค่าก่อนการอัปเดตทันที
* **Modal Dialogs:** แสดงผลหน้าต่างลอยสำหรับการจัดการเอกสาร, แก้ไขคะแนนสอบ, คอนเฟิร์มการย้ายสถานะข้ามเฟส และการลบข้อมูลแบบนุ่มนวล

### 3. ระบบขอบเขต Action และทะเบียนนักเรียน (Action Scope & Registry - students.html)

* **ทุกปุ่ม/เมนู action** (`data-action="..."`) ประกาศ "ขอบเขต" ของตัวเองไว้ที่ `ACTION_SCOPES` (kind: `none` / `filter` / `store` / `selection` / `room` — บางเมนูเลือกขอบเขตเองในโมดัล เช่น ห้องเรียน/ปี-เทอม) แล้ว `getActionScope()` + `refreshActionLabels()` จะเขียนป้ายท้ายปุ่ม (`— N คนที่เลือก` / `— N รายการตามตัวกรอง` / `— ทั้งโรงเรียน (N คน)` ฯลฯ) ให้ตรงกับสถานะจริงเสมอ — **เพิ่มปุ่ม action ใหม่ ต้องเพิ่ม entry ใน `ACTION_SCOPES` ด้วย** ไม่งั้นจะไม่มีป้ายบอกขอบเขต
* ปุ่มที่มี 2 ทางเข้า (dropdown หัวตาราง vs bulk-action bar ตอนติ๊กเลือกนักเรียน) แปลคนละความหมายเสมอ โดยส่ง scope เป็นพารามิเตอร์ตรงๆ (เช่น `triggerExport('filter'|'selection')`, `triggerMoveClassroom('room'|'selection')`) — ห้ามเดา scope จาก `selectedStudentIds` เพราะสับสนง่ายว่าผู้ใช้ตั้งใจทำกับใคร
* Action ที่ "ยังทำไม่ได้" (เช่นยังไม่ได้ติ๊กเลือกใคร) **โดยหลักไม่ disable ปุ่ม** — ให้กดได้เสมอแล้วเด้ง popup อธิบายเหตุผลผ่าน `openWarningNotice(title, message)` (ห่อ `openNotice()`/`#modal-notice`) แทน เพราะปุ่มเทาๆ กดไม่ได้โดยไม่บอกเหตุผลทำให้ผู้ใช้คิดว่าโปรแกรมพัง — **ข้อยกเว้นเดียว (task-12):** action ที่ผูกกับ selection ตรงๆ เสมอไม่มี fallback ใดๆ (ปัจจุบันมีแค่ `transferOut` — "ย้ายออก/ลาออก/เปลี่ยนสถานะ") กลับไป `disabled` จริงเมื่อยังไม่ได้ติ๊กใคร เพราะกดได้แล้วเด้ง popup ทุกครั้งรำคาญกว่ามีประโยชน์ — แต่ยังต้องมีป้าย `.dd-action-scope` (`— ต้องติ๊กเลือกก่อน`) และ `title` tooltip อธิบายเหตุผลเสมอ ห้าม disable แบบเงียบไม่มีคำอธิบาย (ดู `getActionScope()`/`refreshActionLabels()`)
* Dropdown ทั้งหมดในหน้าประกาศ id รวมไว้ที่ `DROPDOWN_IDS` จุดเดียว (ปัจจุบัน: `dd-import-export`, `dd-registry`, `dd-reports`, `dd-bulk-docs`) — ตัว toggle/ปิดอัตโนมัติเมื่อคลิกนอกกรอบ derive มาจาก array นี้ ห้ามเพิ่ม dropdown ใหม่แล้วไปฮาร์ดโค้ด selector ซ้ำที่อื่น
* ห้องเรียนเป็น field จริงที่บันทึกได้ (`student.classroom`, ดู `effectiveClassroom()`/`classroomOptions()` ด้านบน) รองรับ "ย้ายห้องเรียน" ข้ามห้องในชั้นเดียวกัน, "ย้ายออก/ลาออก" (transfer out), "เลื่อนชั้น/จบการศึกษา" (promotion) และออกเอกสาร ปพ.1/ปพ.2 — โมดัลกลุ่มนี้ทั้งหมดใช้แพตเทิร์นเดียวกัน: รายชื่อ + checkbox ต่อคน พร้อมปุ่มเลือกทั้งหมด/ล้าง (ปุ่ม "ล้าง" สีแดง `text-rose-600` ต่างจาก "เลือกทั้งหมด" สีฟ้า)
* โมดัล export/print/save/ย้ายห้อง/ย้ายออกทั้งหมดใช้ shell กลาง `#mock-modal-card` (`setMockModalSize(maxWidthClass, heightClass)` — โมดัลที่ re-render ตัวเองระหว่างเปิดอยู่ต้องส่งความสูงคงที่กันการ์ดยืดหด: `MODAL_HEIGHT_DYNAMIC` ปกติ, `MODAL_HEIGHT_TALL` (`h-[88vh] max-h-[50rem]`) สำหรับโมดัลกว้างพิเศษที่ต้องการพื้นที่เยอะกว่าเพื่อเลี่ยง scroll ซ้อนกันหลายชั้น) และก่อน mock action จริงทุกจุดจะมีขั้น **preview** คั่นกลางเสมอ (`openActionPreview()`/`buildDocSheet()`/`buildTablePreview()`/`buildIdCardGrid()`, โมดัล `#modal-action-preview`) — เพิ่ม action export/print/save ใหม่ควรต่อ preview นี้ด้วย (task-13) — โมดัล "ส่งออกข้อมูล" (`renderExportModal()`) ใช้แพตเทิร์นเลย์เอาต์ 3 คอลัมน์ (`max-w-7xl` + `MODAL_HEIGHT_TALL`, grid `[13rem_21rem_minmax(0,1fr)]` — ทั้ง 3 รางต้องมี `min-h-0` ไม่งั้น `overflow-y-auto` ไม่ทำงานจริงใน CSS grid): ซ้าย 13rem = ตัวเลือก radio สั้นๆ คุมได้ในตัวเอง, กลาง 21rem คงที่ = ของที่กินพื้นที่ (ตารางห้องเรียน/คอลัมน์) โชว์ค้างตลอด, ขวา `minmax(0,1fr)` (กินพื้นที่ที่เหลือทั้งหมด ให้ preview มีที่พออ่านออก) = `buildExportPagedPreview()` โชว์ "ทุกหน้า" แบบกองกระดาษ print preview จริง ไม่ตัดทิ้งแถว/คอลัมน์ (ยึดภาษาภาพจาก `buildDocSheet()`/print preview ของ `index.html` แต่ใช้กระดาษสัดส่วน A4 responsive `aspect-[210/297]` แทน `w-[210mm]` ตายตัว เพราะรางแคบกว่ากระดาษจริงเสมอและทั้งโปรเจกต์ไม่มีกลไก scale-to-fit) — ถ้าจะทำโมดัลอื่นแบบนี้ต่อ ให้ดูของโมดัลนี้เป็นตัวอย่าง (task-15/15b/15c)
* **กฎโดเมน (task-15c):** ใบรายชื่อนักเรียนที่ export ออก **= 1 ห้อง 1 แผ่นเสมอโดยค่าเริ่มต้น** (`exportState.layout: 'sheet-per-room'` — ประเภทรายงานใช้ 1 ระดับชั้น 1 แผ่นแทนเพราะไม่มีห้อง) เดาจากโค้ดไม่ได้ ห้ามลืมตอนแก้ต่อ — `getExportGroups()` เป็นแหล่งเดียวที่จัดกลุ่มห้อง/ระดับชั้น (แบ่งตามห้องจริงของนักเรียนแต่ละคนเสมอ ไม่ว่าจะเลือกขอบเขต filter/selection/rooms แบบไหนก็ตาม) และ `getExportStructure()` เป็นแหล่งเดียวที่บอกโครงไฟล์→แผ่น→หน้าจริงตาม `exportState.layout` (`'sheet-per-room'` ค่าเริ่มต้น / `'one-sheet'` รวมทุกห้องไว้แผ่นเดียวสำหรับงานเฉพาะทางเช่นเช็คชื่อกีฬาสี ติ๊กคอลัมน์ `classroom` ให้อัตโนมัติ / `'file-per-room'` แยกไฟล์ต่อห้อง) — ให้ `getExportFileCount()`/`buildExportFileNames()`/`buildExportPagedPreview()` derive จากตัวนี้เสมอ อย่าคำนวณจำนวนไฟล์/หน้าเองที่อื่น
* **โมดัลส่งออกมี 2 เลย์เอาต์ให้เทียบกันอยู่ชั่วคราว (task-16):** `renderExportModal()` เป็นแค่ตัวกระจายงานตาม `exportVariant` ('classic' หรือ 'twoCol') ไปหา `renderExportModalClassic()` ("แบบ A" 3 คอลัมน์ของ task-15/15b/15c) หรือ `renderExportModalTwoCol()` ("แบบ B" 2 คอลัมน์สไตล์ Notion/Airtable) — สลับดูได้จากปุ่มในสล็อต `#mock-modal-header-slot` (ข้างปุ่ม X ของ `#mock-modal-card` — `setMockModalSize()` ล้างสล็อตนี้ทุกครั้งกันปุ่มเลอะข้ามโมดัลอื่น) **ยังไม่ได้ตัดสินใจว่าจะเก็บแบบไหน — แก้ฟีเจอร์ export ต้องแก้ทั้ง 2 ฟังก์ชันจนกว่าจะเลือกแล้วลบอีกแบบทิ้ง** ส่วนที่ A/B ใช้ร่วมกัน (ตารางติ๊กห้อง/ปุ่มชนิดไฟล์/ตัวเลือก layout/checkbox คอลัมน์) ถูกดึงเป็นฟังก์ชันกลางแล้ว (`buildExportRoomGridHtml()`, `buildExportFileTypeButtonsHtml()`, `buildExportLayoutOptionsHtml()`, `buildExportColumnCheckboxHtml()`) แก้ตัวเดียวมีผลทั้งคู่ — ที่ *ไม่* ใช้ร่วมกันโดยตั้งใจคือ preview ฝั่งขวา (A = `buildExportPagedPreview()` โชว์ครบทุกหน้า, B = `buildExportSingleSheetPreview()` โชว์แค่แผ่นแรก+กล่องสรุป) — คอลัมน์เสมือน "ช่องเซ็นชื่อ"/"หมายเหตุ" (`EXPORT_VIRTUAL_COLUMNS`, escape hatch ที่หัว `buildColumnCell()`) กับคอลัมน์ฐานล็อก (`EXPORT_BASE_COLUMN_IDS`) ใช้ร่วมทั้ง A/B ผ่าน `getExportSelectableColumns()`/`getExportColumns()`

### 4. ระบบส่งอีเมลแจ้งเตือน (Notification Composer - notify.html)

* ดึงพารามิเตอร์รหัสผู้รับที่ถูกเลือกจากหน้าหลักผ่านคิวรีสตริง (เช่น `?ids=a1,a2`)
* รองรับปุ่มดึงเทมเพลตสำเร็จรูป (สอบผ่าน, สอบไม่ผ่าน, เอกสารไม่ครบ, แจ้งชำระค่าสอบ)
* มีฟังก์ชันปุ่มคลิกเพิ่มแท็ก Placeholders (เช่น `[ชื่อนักเรียน]`, `[แผนการเรียน]`, `[คะแนนรวม]`) และมีพรีวิวด้านขวาแสดงอีเมลและข้อมูลดิบเพื่อช่วยตรวจสอบความปลอดภัยก่อนส่งจำลอง

---

## 🎯 ประโยชน์ของโครงสร้างแบบใหม่

1. **Zero Configuration:** ไม่ต้องการ Node.js หรือ Bun ในการรันเดโม เพียงเปิดไฟล์ตรงๆ บนระบบปฏิบัติการใดก็ได้
2. **Easy Backend Integration:** การแยก UI HTML ออกจากฟังก์ชัน JS ใน `js/store.js` อย่างชัดเจน ช่วยให้ผู้พัฒนานำไปเปลี่ยนไคลเอนต์เพื่อเรียกใช้ API ของฝั่ง Python (เช่น `fetch()` เรียกไปที่ Python API) แทน LocalStorage ได้ในทันทีโดยไม่ต้องแก้โครงสร้างหน้าเพจ
3. **Responsive Design:** ยังคงความสวยงาม ความคล่องตัว และลูกเล่นแอนิเมชันของ Tailwind CSS ไว้ได้ครบถ้วน

---

## สิ่งที่ต้องรู้

- folder `materials/user-journey` และ `materials/mockup` จะมีไฟล์ที่ชื่อเหมือนกัน แปลว่าต้องดูคู่กัน:
   1. อย่างถ้าจะดูเรื่องการรับสมัคร ให้ไปดูที่ `materials/user-journey` ก่อน
   2. จะเห็น flow ว่าเขาทำงานกันยังไง
   3. จากนั้นให้ไปดูที่ `materials/mockup` ในชื่อเดียวกัน ว่าออกแบบมาประมาณไหน
   4. แล้วนายก็ปรับตามหลัก UX ตกแต่ง UI ได้เต็มที่เลย
- ถ้ามีแต่ user-journey ไม่มี mockup แปลว่ารังสรรค์ขึ้นมาเองตามหลักการ UX ที่ดีได้เลย

## คำสั่งสำหรับ AI Agent (Agent Instructions)

- ไม่จำเป็นต้องทำพวก screenshot ในตอนท้าย เพราะยังไงสุดท้ายผู้ใช้ก็ต้องเข้าไปตรวจสอบด้วยการไปเล่นของจริงเองอยู่แล้ว เพื่อประหยัดโทเค่น ทำเพียงแค่ตรวจสอบความถูกต้อง ลองคลิ๊กๆ แบบที่ agent ทำ แค่นั้นก็พอ ไม่ต้อง screenshot เว้นแต่ผู้ใช้สั่งให้แก้แล้วแก้อีกจนไม่รู้ว่าหมายถึงตรงไหน ก็ค่อยใช้วิธี capture เอา
- เมื่อทำ task ใดเสร็จแล้ว ให้ใส่ `[x]` ที่กล่อง checkbox ในข้อนั้นๆ ด้วย (ดู `tasks/task.md`)
- หากอยากจะ test html ที่เขียนไว้ ห้าม run by localhost ให้เปิดไฟล์ในเครื่องตรงๆ เลย (เช่น `C:\...\admitify-spark\profile.html`)
   - หากมีความจำเป็นต้อง run localhost จริงๆ ให้ใช้ `http://localhost:5500` (Live Server port ที่ผู้ใช้เปิดไว้เป็นประจำ)
- ถ้าจะตรวจสอบ logic ด้วย jsdom (ติดตั้งชั่วคราวใน scratchpad ไม่ใช่ในโปรเจกต์): inline เนื้อหา `js/store.js` แทน `<script src>`, stub `window.tailwind={config:{}}`/`window.lucide.createIcons` (แซนด์บ็อกซ์ไม่มีเน็ต), ตั้ง `url:'http://localhost/...'` ไม่ใช่ `file://` (ไม่งั้น `localStorage` พังเพราะ opaque origin) — ตัวแปร `let`/`const` ระดับบนสุดของ script (เช่น `selectedStudentIds`, `exportState`) ไม่ auto-attach เป็น `window.xxx` (มีแค่ `function` declaration เท่านั้น) ต้องขับเคลื่อน state ผ่านฟังก์ชันที่ expose ไว้เสมอ (`toggleSelectOne`, `clearSelection` ฯลฯ)
- แผนที่ผู้ใช้กด approve ไม่ได้แปลว่าถูกทวนละเอียดเสมอไป — งานใหญ่หลายจุดแก้ไข ให้ agent ทวนแผนกับโค้ดจริงอีกรอบเอง (เลขบรรทัด/ชื่อฟังก์ชัน/พฤติกรรมเดิม) ก่อนลงมือ อย่าเชื่อว่าแผนถูกต้อง 100% เพียงเพราะผ่านการอนุมัติแล้ว (session 2026-09-09: แผนฉบับแรกมีจุดผิดหลายจุดที่ต้องแก้หลังทวนโค้ดจริง)

---

> [!NOTE]
> **ไฟล์นี้ (`AGENTS.md`) คือเอกสารรวมฉบับเดียวสำหรับทุก AI agent ในโปรเจกต์นี้** ไฟล์ `gemini.md`/`GEMINI.md` และ `CLAUDE.md` เป็นเพียง pointer ที่ชี้กลับมาที่นี่ — เวลาจะแก้ไขหรือเพิ่มคำแนะนำ ให้แก้ที่ไฟล์นี้ไฟล์เดียวพอ
