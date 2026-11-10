# AGENTS.md — อ่านก่อนทำงานใน repo นี้

ไฟล์นี้สำหรับ AI ทุกตัว (Claude · opencode · Copilot · ตัวอื่น ๆ) ที่เข้ามาทำงานใน SchoolDark

## อ่านตามลำดับนี้ก่อนเริ่มงาน

1. `materials/ai-bro/final-report.md` — **ต้นฉบับที่เดียว (SSOT)** ของเล่มรายงาน/SRS: requirement · use case · ER · data dictionary · สถาปัตยกรรม · ไฟล์ยาว ให้ค้นหัวข้อก่อน ไม่ต้องอ่านทั้งไฟล์
2. `materials/ai-bro/CONTEXT.md` — คำศัพท์ของ ER ทีม B (คำไหนใช้ คำไหนห้ามใช้)
3. `materials/ai-bro/TODO.md` — **งานทั้งหมดของทีมอยู่ที่นี่ที่เดียว** มีกติกาอยู่หัวไฟล์
4. `materials/ai-bro/handoff/` — บันทึกส่งต่อจาก AI ตัวก่อน (อ่านไฟล์ล่าสุด)

## แผนที่ `materials/doc/` (ที่เดียว · ย้ายไฟล์เมื่อไหร่ แก้ตรงนี้)

| โฟลเดอร์ | มีอะไร |
|---|---|
| `ver-full/` | **diagram หลัก (ต้นฉบับ)** · `erd-by-claude.drawio` แท็บ "ER ทั้งระบบ (ต้นฉบับ · แก้ที่นี่ที่เดียว) v3" + แท็บ draft · `system-architecture.drawio` · `unit3-how-we-work.drawio` |
| `ver-doc/` | **diagram ที่ใส่เล่ม** (แท็บที่แยกออกมาจากไฟล์หลัก ไฟล์จะได้ไม่บวม) · `erd-er-a4.drawio` (ER A4) · `erd-hierarchical-chen-a4.drawio` (Chen สัญลักษณ์ + Chen ลำดับชั้น A4) |
| `erd/` | spec ที่ AI ใช้ตอนสร้าง ER (`md/` เช่น `erd-spec.md` · `docx/` · `script/`) |
| `usecase/` | `usecase-merge-all.drawio` · `swimlane.drawio` + spec ที่ AI ใช้ (`md/` · `docx/` · `script/`) |
| `draft/` | ร่างเก่า ไม่ใช่ต้นฉบับ |

- แท็บใน `ver-doc/` มีที่เดียว (เอาออกจากไฟล์หลักแล้ว) · **ถ้าแก้ ER ทั้งระบบใน `ver-full/` ต้องแก้แท็บลงเล่มใน `ver-doc/` ตามเอง** ไม่มีอะไร sync ให้
- copy แท็บระหว่างไฟล์: คัดก้อน `<diagram>` ทั้งก้อนตรงตัว ห้ามแก้ไฟล์ต้นทาง

## กติกา

- `materials/ai-bro/` คือโฟลเดอร์กลางของ AI ทุกตัว ไม่ใช่ของเครื่องมือตัวไหน · ของที่เกี่ยวกับ AI (handoff · tools · TODO) อยู่ที่นี่ ไม่เก็บไว้แค่ใน `.claude/` `.opencode/` หรือโฟลเดอร์ชั่วคราว
- `materials/doc/` คือไฟล์ทำงานของทีม (drawio · ER · use case) ที่ใช้ปรับเล่ม
- **เล่มแก้ใน Word เท่านั้น** ห้ามแก้ `final-report.md` ตรง ๆ (สคริปต์เขียนทับทั้งไฟล์)
- แปลง Word → md: `materials/ai-bro/doc/` มีแต่เอกสารเล่มโครงงานเท่านั้น · เรียง `.docx` ตามเวลาแก้ล่าสุด เลือกไฟล์ใหม่สุด (ข้าม `~$*.docx`) · ถ้า `doc/` ว่าง ห้ามแปลง · `materials/ai-bro/template-real-layout-proj1-doc-for-ai.docx` เป็นแค่ต้นแบบ layout/heading ไม่ใช่เล่ม ห้ามแปลง · บอกเจ้าของก่อนว่าจะแปลงไฟล์ไหน แล้วรัน
  `python materials/ai-bro/tools/convert_docx_to_md.py "materials/ai-bro/doc/<newest>.docx" materials/ai-bro/final-report.md materials/ai-bro/images`
- งานใหม่ / งานค้าง → `TODO.md` · handoff เขียนแค่ "ทำอะไรไป รู้อะไรมา" ไม่เก็บ todo · ชื่อ handoff `YYYY-MM-DD-topic.md`
- ห้าม commit / push ถ้าเจ้าของไม่สั่ง · ห้ามลบไฟล์ของคนอื่น
- คุยกับเจ้าของเป็นภาษาไทย ตรง ๆ สั้น ๆ · ก่อนตัดสินเรื่องใหญ่ ถามหนึ่งคำถามพร้อมตัวเลือกที่แนะนำ
