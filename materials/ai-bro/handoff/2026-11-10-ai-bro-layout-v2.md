# Handoff: โครง `materials/ai-bro/` ฉบับ 2 (แทนกติกาเก่าบางข้อ)

จาก: Claude (เลขาของเนยสด) · 2026-11-10 · ถึง: AI ทุกตัวที่ทำงานใน repo นี้
อ่านไฟล์นี้หลัง `2026-11-10-docx-to-md-ssot.md` และ `2026-11-10-ai-bro-convention-and-pending-docx-deletion.md` — **ถ้าขัดกัน ไฟล์นี้ใหม่กว่า**

## โครงตอนนี้ (นายจัดเอง 2026-11-10)

```
materials/
  ai-bro/                ของที่ AI ใช้ (โฟลเดอร์กลาง ไม่ใช่ของ AI ตัวไหน)
    final-report.md      SSOT เล่ม/SRS · อ่านก่อนเสมอ
    images/              รูปของ final-report.md (84 รูป)
    CONTEXT.md           คำศัพท์ ER ทีม B
    doc/                 Word ไฟล์โครงงาน (นายวางเมื่อจบ session แก้)
    handoff/             handoff ของ AI ทุกตัว
    tools/convert_docx_to_md.py
  doc/                   ไฟล์ทำงานของทีม (drawio · ER · use case) ที่ใช้ปรับเล่ม
```

## สิ่งที่เปลี่ยนจาก handoff ก่อนหน้า

- **`final-report.md` อยู่ `materials/ai-bro/` ไม่ใช่ `materials/doc/`** → กติกาเดิม "เนื้อหาไป materials/doc" ใช้ไม่ได้กับไฟล์นี้แล้ว
- **รูปย้ายไป `materials/ai-bro/images/`** (แปลงใหม่ 2026-11-10 · ลิงก์ครบ 84 · หาย 0) · `materials/doc/images/` ชุดเก่ายังอยู่ นายจะตัดสินเองว่าเก็บหรือลบ
- **Word ต้นทาง:** ทุก `.docx` ใน `materials/ai-bro/doc/` คือไฟล์โครงงาน ชื่ออะไรก็ได้ · เวลาแปลง ให้เรียงตามเวลาแก้ล่าสุด ใหม่สุดก่อน แล้วเลือก**ไฟล์ใหม่สุด** (ข้าม `~$*.docx` ไฟล์ล็อกของ Word) · บอกนายว่าเลือกไฟล์ไหน
- สคริปต์เขียนวันที่ของ docx ไว้หัว `final-report.md` แล้ว · คำสั่ง:
  `python materials/ai-bro/tools/convert_docx_to_md.py "materials/ai-bro/doc/<newest>.docx" materials/ai-bro/final-report.md materials/ai-bro/images`

## กติกาที่ยังใช้

- **แก้เล่มใน Word เท่านั้น ห้ามแก้ `final-report.md`** (สคริปต์เขียนทับทั้งไฟล์)
- ห้าม commit/push ถ้านายไม่สั่ง · การย้ายไฟล์รอบนี้ยังไม่ได้ commit
- artifact "School Dark · SRS ทีม B" บน claude.ai เป็นของเก่า ไม่ใช้อ้างอิง

## ยังค้าง

- `AGENTS.md` ที่ราก repo ยังไม่ได้สร้าง (ถามนายก่อน)
- Word 12 MB ใน `ai-bro/doc/` ถ้า commit ทุกฉบับ repo จะโตเร็ว → นายตัดสินเรื่อง commit
