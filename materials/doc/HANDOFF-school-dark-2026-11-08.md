# HANDOFF — SchoolDark (เอกสารประกอบรายงาน)

วันที่: 2026-11-08
ผู้ใช้: พูดไทย ตอบสั้นกระชับ รู้เทคนิคการเขียนเกม/โปรแกรม ลดกสรการ overthink

สถานะ: งานหลักจบ 2 ชิ้นใหญ่ (data-dict + use-case)? เปิดตัวใหม่ = เลขลำดับ flow ใน system-architecture.drawio — เสร็จล่าสุด

---

## เป้าหมายโปรเจกต์

เตรียมเอกสารรายงานโครงการสำหรับโรงเรียน (SchoolDark — ระบบรับสมัคร/ทะเบียน/บุคลากร/ตั้งค่า) จากหลักฐานที่มาใน `materials\doc\` — ไฟล์ .drawio และ .docx เป็นหลัก

**พารามิเตอร์สำคัญ:**
- **แหล่งข้อมูล final อยู่ที่ `C:\Users\noey\Desktop\SchoolDark\materials` เท่านั้น**
- `C:\Users\noey\Desktop\my personal researcher 2\report-drafts\school-dark` = ตัวอย่าง/remix เท่านั้น **ห้ามก๊อปวางกลับ**

## ผลงานที่เสร็จแล้ว (ไม่ต้องแตะซ้ำ)

1. **`materials\doc\darft-erd\use-case-description-by-opencode.docx`** — Use Case Description ใหม่ = 23 rows (1 header + 22 UCs) ตามหน้า "เล่มรายงาน (A4) แบบกล่องย่อย" ใน `usecase-merge-all.drawio` — คอลัมน์ `Use Case ID | Use Case Name | Actor | Description` — ID เรียง: ADM-01..06, REG-01..09, SET-01..04, STF-01..03, style Table Grid, font Sarabun
2. **`materials\doc\erd\data-dict-by-opencode.docx`** — Data Dictionary เต็ม 475 แถว / **56 ตาราง** ก.1–ก.56 คอลัมน์ Description ครบ; ถอดจากหน้า **"ER ทั้งระบบ (ต้นฉบับ · แก้ที่นี่ที่เดียว) v3"** (page index 2 ของ 26 หน้า) ใน `erd-by-claude.drawio` — ตรวจสุดท้าย EMOJI_LEFT=0, EMPTY=0, TYPOS=0
3. **`materials\doc\system-architecture.drawio`** — แท็บ **"Service B (Component Diagram · ฉบับทางการ)"** แก้ว่ามีเลขวงกลม ①–⑫ ใน 12 เส้น (edge values) และ f_leg legend ได้เขียนเป็นไทยเอง = เสร็จ

## บทเรียน/ทริคส์ (ลังเลต้องหลีก)

### Python regex / drawio parse
- `\u1f000` ฯลฯ ใน Python เป็นการอ่าน 4 หลักเท่านั้น ทำช่วงทับตัวไทยไปด้วย — **ใช้ `\U0001F000` 8 หลักเมื่อระบุอิโมจิใน character class**
- ห้าม `html.unescape()` ทั้งไฟล์ .drawio ก่อน ET.parse (ทำ XML พัง) — แยก chunk `<diagram ...>...</diagram>` ด้วย regex แล้วจึง ET.fromstring ทีละหน้า + unescape เฉพาะ value และชื่อหน้า
- ตารางใน .drawio = mxCell ซ้อน: หัว (`style มี tableLayout`) → row (`shape=tableRow`) → cell (`\w+c[012]` = badge PK/FK/UK, ชื่อ col, desc) — **บางตารางใช้ id สุ่ม** (เช่น Application ใน v3 = `v3-75MKJLEGYGBd3_8vAGot-3`): parser ต้องมอง style/parent ไม่อิง id ตายตัว
- แก้ .drawio = targeted regex patch ผูกกับ mxCell id (`<mxCell id="f_eN"[^>]*?value=")[^"]*(")`) — จะเซฟ backup ก่อนแก้กันเรื่องพลาด: ผมเก็บไว้ `C:\Users\noey\AppData\Local\Temp\opencode\system-architecture.backup-before-flownum.drawio`

### Windows/PowerShell
- Console เข้ารหัส cp874 ภาษาไทยเพี้ยน — แก้เสมอ:**เขียนผลลัพธ์ script ลงไฟล์ UTF-8 แล้วอ่านด้วย Read tool**
- `npx` โดน Execution Policy — **ใช้ `npx.cmd`** แทน
- สคริปต์เขียนผ่าน PowerShell here-string (`Set-Content -Value $script -Encoding UTF8`) ผลลัพธ์ `python file.py` — ค่าคืนพิมพ์สั้นระบุ `OK` / บดไปอ่านไฟล์ด้านถัด

### เชิง diagram design
- **เลขลำดับต้องผูกกับ "เหตุการณ์จริง (runtime)" ไม่ใช่ตำแหน่งเส้น** — ครั้งแรกเลขตามเส้น ⑤=Service, ⑥=IAM เป็นการสวนกับ runtime — 15 พฤษภาคม: **สลับ ⑤↔⑥** ให้ ⑤=IAM, ⑥=Service Layer (ตรวจ IAM ก่อนเรียก service)
- เส้น 3/4 (Service A/C เรียกระหว่างระบบ) อาจแจ้งผู้อ่านให้ aware ว่ามันและเส้นจาก web portal **เป็น 2 สายต่างชุด**: สาย A/C จบที่ 4 (ไม่ต่อ 5), สาย web ข้าม 3-4 เริ่ม 5 — ต้องอธิบายอย่างชัดว่า "สายนี้จบที่นี่"

## รายละเอียดเชิงเทคนิคล่าสุด (flow Service B — ฉบับระบุเลข)

ปัจจุบันในไฟล์:
- ① Web Portal → Nginx (HTTPS)
- ② Nginx → API Layer (HTTPS · /api/admission)
- ③ Service A/C → ยืนยันตัวตนและสิทธิ์ (dashed) — สายแยกจบที่นี่
- ④ Service A/C → Internal API (ขอข้อมูล) — สายแยกจบที่นี่
- ⑤ API Layer → IAM (ยืนยันสิทธิ์ก่อน)
- ⑥ API Layer → Service Layer
- ⑦ Service Layer → Data Access (Repository · SQLAlchemy)
- ⑧ Repository → PostgreSQL (SQL)
- ⑨ Repository → MinIO (S3 API)
- ⑩ Service Layer → Redis (enqueue)
- ⑪ Redis → Background Worker Celery (consume)
- ⑫ Worker → SMTP Server

Components อื่นในหน้าเดียวกัน: f_api (API Layer 6 routers: ยืนยันตัวตน / Internal API / รับสมัคร / ทะเบียน / ตั้งค่า / บุคลากร), f_svc/f_s1 (Service Layer), f_iam, f_data/f_d1, f_wrk/f_w1, storage: f_pg/f_minio/f_redis/f_smtp, legend f_leg

## งานค้าง (รอผู้ใช้สั่ง)

- **เพิ่ม tab personnel ใน `erd-by-claude.drawio`** — ยังไม่ได้เริ่ม
- ผู้ใช้ deferred การติดตั้ง drawio skill: `bahayonghang/drawio-skills@drawio` (8.7K installs, ตรวจผ่านหมด, ใช้ restyle/แก้ไฟล์ .drawio ได้) — หากผู้ใช้ขอให้ลง: `npx.cmd skills add bahayonghang/drawio-skills@drawio`
- ดีไซน์อื่นอาจเพิ่ม: "กรอบวง" ให้ flow ④→⑤ ต่อกัน / "2 ทางเข้า" อย่างชัดเจน (เป็น propose — ผู้ใช้ยังไม่ยืนยัน)

## Suggested Skills

หากผู้ใช้ขอให้ลง skill ที่เกี่ยว (ชื่อเหมือนมีแล้ว) — ผมไม่ได้ลง skill ใน session นี้; แต่ **หากผู้ใช้เรียกร้อง**:

- อยากทำ diagram/ER/flow ในไฟล์ .drawio ถึงจะมี skill: **`bahayonghang/drawio-skills@drawio`** (ยังไม่ลง — deferred) — ใช้ Skill tool หากลงแล้ว
- จะทำเอกสาร .docx ต่อ: **`docx`** หรือ **`docs`** ใน available_skills
- จะแก้/สร้าง .pptx, .pdf, .xlsx: ใช้ skill ชื่อเดียวกัน

## ไฟล์/footnote

พร้อมระบุตำแหน่งที่แน่:
- `C:\Users\noey\Desktop\SchoolDark\materials\doc\system-architecture.drawio` (514KB, 5 หน้า; 0=System Architecture, 1=Service B (ฉบับเอกสาร), 2=(old) Page-1, 3=(draft) Service B เจาะลึก C4, 4=Service B (Component Diagram · ฉบับทางการ))
- `C:\Users\noey\Desktop\SchoolDark\materials\doc\erd\erd-by-claude.drawio` (3.6MB, 26 หน้า)
- `C:\Users\noey\Desktop\SchoolDark\materials\doc\usecase-merge-all.drawio` (มีหน้า A4)
- **Temp opencode มี scripts ตัวช่วย:** `sa_p4b.py` (dump mxCell หน้า P4), `sa_edges.py` (edges + source/target), `sa_patch.py` / `swap56.py` (แก้เลขวง), `leg_fix2.py` (แก้ legend), `_sa_p4b.txt`, `_sa_edges.txt`, `_swap.txt`, `_leg3.txt` — อ่านได้ก่อนทำงานต่อถ้าต้อง metadata
- Backup drawio (ล่าสุดก่อน patch ทั้งหมด): `C:\Users\noey\AppData\Local\Temp\opencode\system-architecture.backup-before-flownum.drawio`

---

# ✎ เพิ่มเที่ยวบ่าย 2026-11-08 — ตาราง Use Case ฉบับ full + Swimlane (ให้ตัวเอง session ถัดไปอ่าน)

## สถานะล่าสุด (สรุป 2 ชิ้นงานใหญ่ที่พึ่งทำ)

1. **ตาราง Use Case 22 ตาราง (ก.1–ก.22) ใน `materials\doc\usecase\full-one-table.docx`** — เสร็จ + **ผู้ใช้ยืนยันเนื้อหาแล้ว** (77,838 bytes 11/8/2026 18:46) ผู้ใช้เปิดแก้เองและเซฟทับ → เช็คสิ่งสำคัญ: **คำที่ใช้ในตารางใหม่เปลี่ยนจาก "เจ้าหน้าที่งานทะเบียน" → "ฝ่ายทะเบียน"** (REG-04/05/06 Actor = "ผู้ดูแลระบบ, ฝ่ายทะเบียน (Primary)") — **ทุกภาพจากนี้ไปใช้คำ "ฝ่ายทะเบียน"** ตามตาราง อย่ากลับไปคำเก่า
2. **Swimlane ตัวอย่างแรก `materials\doc\usecase\swimlane-ก.6-admission-e2e.drawio`** — เสร็จ + **ผู้ใช้ชม "เยี่ยม" = format ผ่าน** ให้ใช้ format เดียวกันทำต่อ

## Format ทางการของ swimlane (ที่ "ผ่าน" แล้ว — ทำตัวต่อไปให้เหมือน)

ไฟล์ .drawio, 1 pool (`swimlane;horizontal=1;startSize=30`) + lanes ต่อ**ระบบ**ตามสั่งผู้ใช้ ("แบ่ง swim lane เป็นช่วงตามระบบที่มีอยู่"), เลเบล lane ระบุไอดี UC ในวงเล็บ, node style:
- กิจกรรม = `rounded=1;arcSize=40` ขาวดำ, ตัดสินใจ = `rhombus`, เริ่ม/จบ = `ellipse` (มี "เริ่ม:"/"จบ:" นำหน้า)
- uxFlow ปกติ = เส้นทึบ + label `labelBackgroundColor=#ffffff`; **dashed=1 = loop กลับ (ไม่ครบเอกสาร / สมัครซ้ำ)**
- ป้ายในกล่องใช้ HTML: `<b>UC-ADM-06</b><br/>เนื้อหาไทย` (value ต้อง escape `&lt;` `&gt;` และ `&#8211;` สำหรับ dash)
- สไตล์ ref ข้อความ: อ้างไอดี UC + กฎธุรกิจ (BR-05/BR-06/BR-07/BR-02) — ศัพท์ตาม CONTEXT.md (ใบสมัคร=log, มอบตัว, ระดับชั้น vs ช่วงชั้น, ประวัติห้อง, รอบรับสมัคร, รหัสใบสมัคร/รหัสนักเรียนอัตโนมัติ = BR-02)

ตัวอย่างหนึ่งมี 4 lanes: ระบบตั้งค่า (SET-04) / ผู้สมัคร–พอร์ทัล (ADM-06) / ฝ่ายทะเบียน–ระบบรับสมัคร (ADM-01..05) / ระบบทะเบียนนักเรียน (REG-01/02), 1 เริ่ม + 2 จบ (ไม่ผ่านคัดเลือก / กลายเป็นนักเรียน), 44 mxCell

## ⚠️ ประเด็นเส้นตาย (งานค้างในขั้นวาด — โดน interrupt ตรงจุดนี้)

สั่งผู้ใช้เปลี่ยนมา (คำเดิม: "ลบไฟล์ที่ใช้วาด swimlane เสร็จแล้วออก โดยไม่ลบ swimlane-ก.6-admission-e2e.drawio") = **ลบ `tmp_full.md` และ `tmp_brief.md`** ใน `materials\doc\usecase\` ให้เสร็จได้ทันทีเมื่อ session ถัดไปเริ่ม — สร้างด้วย pandoc (`pandoc -f docx -t markdown --wrap=none`) วาดเสร็จทิ้งได้ **แต่ยังไม่ลบเพราะกำลังใช้อ่านตาราง REG-04/05/06 ที่ถอดใหม่เอาไปวาด lane ตัวที่ 2**
- ห้ามลบ `project1 documentation.docx` (7MB ยังมีใน dir — ผู้ใช้วางมาเองล่าสุด ยังไม่ถูกแตะ; โอกาสหน้าถามผู้ใช้ว่าต้องการให้งานอะไรกับไฟล์นี้)
- temp checker ยังอยู่นอกที่ทำงาน: `C:\Users\noey\AppData\Local\Temp\opencode\swimlane_check.py` — ใช้ซ้ำได้ (เที่ยวเช้าลบไฟล์ขยะใน `usecase\` ไปแล้วเหลือ 9 ไฟล์ ดูรายชื่อใน section "หน้าตา dir" ด้านล่าง)

## Swimlane ตัวที่ 2 (งานถัดไปที่ user รออยู่)

**กลุ่มทะเบียนนักเรียน** — แผนวาดที่ร่างไว้กลางคัน (สร้างเป็นไฟล์ใหม่ เช่น `swimlane-ก.10-ก.11-reg-lifecycle.drawio`):
- ครอบคลุม UC-REG-03 (แก้ไขข้อมูลนักเรียน), UC-REG-04 (ย้ายห้องเรียน·เลื่อนชั้น), UC-REG-05 (จัดการนักเรียนลาออก), ฝั่งเรียกดู = UC-REG-06 (ดูข้อมูลนักเรียน/ศิษย์เก่า)
- โครง lanes ที่ร่างไว้ 4 ช่อง:
  1. **ฝ่ายวิชาการ/ผู้มีอำนาจอนุมัติ** — อนุมัติผลการเรียนปลายปี (pre เลื่อนชั้น) + อนุมัติคำร้องจำหน่าย (pre REG-05)
  2. **ฝ่ายทะเบียน — ระบบทะเบียนนักเรียน** — คอลัมน์ 1 แก้ไขข้อมูล (เลือกแถว → ระบบแสดงฟอร์มตามค่าปัจจุบัน → ตรวจสอบ → บันทึก), คอลัมน์ 2 ย้ายห้อง/เลื่อนชั้น, คอลัมน์ 3 จำหน่าย (ย้ายสถานศึกษา/ลาออก/พักการเรียน/พ้นสภาพ + สถานศึกษาปลายทาง + เหตุผล + วันที่มีผล)
  3. **ระบบทะเบียนนักเรียน — สถานะ/ประวัติ** — บันทึกแถวประวัติห้อง เปลี่ยนสถานะ (กำลังศึกษา → สำเร็จการศึกษา(ศิษย์เก่า) หรือพ้นสภาพ) + BR-05 (ย้ายห้องต้องเท่าระดับชั้น) / BR-06 (เลื่อนชั้นโดยปริยาย) / BR-07 (ปีสุดท้าย→สำเร็จการศึกษา)
  4. **ผู้ใช้ข้อมูล (ครูประจำชั้น/ฝ่ายวิชาการ)** — ดูข้อมูลที่อัปเดตผ่าน UC-REG-06 (อ้าง pre-condition "ครูประจำชั้นเห็นเฉพาะห้องที่ตนรับผิดชอบ")
- Exceptions ควรมี: ยกเว้นทั้งหมดจนไม่มีรายชื่อ (REG-04 จะไม่บันทึก) / เลือกข้ามระดับชั้นในย้ายห้อง = ปฏิเสธ (BR-05) / ยังไม่เลือกนักเรียน (REG-05)
- สร้างเสร็จ → **validate ด้วย swimlane_check.py (แก้ path ไฟล์ให้ตรงไฟล์ใหม่)** → ตรวจสอบว่าทุก box ใช้คำ "ฝ่ายทะเบียน" ไม่ใช่คำเก่า → รายงานผู้ใช้ให้เปิดเช็คใน draw.io

จากนั้น (ถ้าตัวที่ 2 ผ่าน) ทำกลุ่มที่เหลือ: SET-01..04 + STF-01..03 — รวม lane เดียวหรือแยกไฟล์ให้ถามผู้ใช้ตอนนั้น

## จุดเสี่ยง/คำเตือนสำคัญสำหรับ swimlane (จากสอนรอบแรก)

- **ไฟล์ .drawio ต้องเป็น XML ที่ parse ผ่าน**: ครั้งแรกใส่ `y="86"??` ค้างใน mxGeometry → ทำ draw.io เปิดไฟล์ไม่ได้ แก้ด้วย generate ใหม่แบบเขียนครบแทน patching

- **validate ต้องเทียบ overlap เฉพาะ node พ่อเดียวกัน** — mxGeometry ของลูก node อยู่พิกัดสัมพัทธ์ parent ตนเอง เทียบข้าม lane ได้ false positive ทั้งตาราง — แก้แล้วใน `Temp\opencode\swimlane_check.py` เอาสโคปซ้ำไปใช้ได้
- พารามิเตอร์เลย์เอาต์ที่ใช้จริง: `startSize` pool = 30, lane = 24, node กว้าง ~200±30 สูง 50–66, ตรวจ node ไม่ล้น lane ด้วย `y + h ≤ lane height` ใน checker
- `ET.parse` กับพาธที่มีไทย (ก.6) — ต้องต่อ `io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')` เสมอ

- ล่าสุด `swimlane-ก.6-admission-e2e.drawio` = PASSED checker และ**ผู้ใช้ยืนยันแล้ว** ("เยี่ยม" + บอกให้ Claude วาดต่อเอง) → ทำตัวที่ 2 ต่อได้ทันทีไม่ต้องรอ

## หน้าตา dir `materials\doc\usecase\` ปัจจุบัน (ยังอยู่ทั้งหมด)

- `full-one-table.docx` (deliverable 22 ตารางฉบับสุดท้าย — **อย่า overwrite มั่ว ผู้ใช้แก้เองล่าสุด**)
- `swimlane-ก.6-admission-e2e.drawio` (ผลงานที่ชม — **ห้ามลบ**)
- `usecase-merge-all.drawio` (131KB ผู้ใช้ update จากเดิม 96KB—แตะไม่ได้นอกจากผู้ใช้ขอ)
- `fill_one_tpl.py` + `full.zip` (generate ตาราง — เสร็จจบแล้วไม่ต้องยุ่ง ผู้ใช้ยึดไว้แก้เองได้: `python fill_one_tpl.py full-one-table.docx`)
- `ucpart1/2/3.py` (เนื้อหา 22 UCs — แก้เนื้อหาที่นี่ แล้ว rerun generator)
- `brief-use-case-description-by-opencode.docx`, `old-use-case-description.docx` (ต้นฉบับ)
- `project1 documentation.docx` (ใหม่ ผู้ใช้วาง — ตอนนี้ยังไม่รู้ปลายทาง อย่าลบ; ในโอกาสถัดไปถามผู้ใช้ว่าต้องการให้งานอะไรกับไฟล์นี้)
- `tmp_full.md`, `tmp_brief.md` (**ลบตามติดสั่ง หลังวาด lane 2 เสร็จ**)

## Suggested Skills (สำหรับ session ถัดไป)

- วาด/แก้ .drawio ต่อ (งานหลัก): **ไม่มี skill ใน session นี้ที่ตรงโดยตรง** — ทำได้โดยเผยกรอบ factories เขียน .drawio ตาม style ตัวอย่าง; ถ้าลง deferred skill `bahayonghang/drawio-skills@drawio` ตาม section เที่ยวเช้าแล้วใช้ตัวนั้น
- ถ้าผู้ใช้ขอ "เอา swimlane ลง Word" หรือ export ภาพเป็น .docx/.pdf: ต้องใช้ **`docx`** skill — `C:\Users\noey\.claude\skills\synced\a0e7a290-3252-436e-b139-45ae3250ef01_067b48f4-0bdc-4a86-93f4-a1b1c37bb5c2\docx\SKILL.md`
- ถ้าผู้ใช้ขอ review คุณภาพ use case/swimlane ระบบข้อ: ใช้ **`code-review`** skill แล้ว focus ว่า "review against CONTEXT.md vocabulary" — ย้ำหลักที่ตกลงกัน: **session ใหม่/agent อื่นตรวจดีกว่าให้ตัวผู้เขียนตรวจตัวเอง**

## สิ่งที่ได้จากการทำงานช่วงบ่ายนี้ (ไว้จำ)

- นิสัยผู้ใช้ของวันนี้: ตัดสินใจเร็วด้วยเหตุผลสั้น ("เยี่ยม", "ให้ claude วาดน่าจะดีกว่า") — จากช่วงเช้าที่ถาม "ควรให้ตรวจไหม" กลางวันถาม "ทำ swimlane ได้ไหม" ตกบ่ายอนุมัติตัวอย่างแรกทันที
- "ไฟล์ขยะ": เที่ยงเช้าสั่งเคลียร์จนเหลือ 9 ไฟล์, บ่ายสั่ง "ลบไฟล์ที่ใช้วาด swimlane เสร็จแล้วออก" — **เก็บกวาดไฟล์พัก (tmp/scratch) ทุกรอบหลังงานเสร็จ** ตามนิสัยนี้เสมอ
- คำสั่งติดเงื่อนไขที่ต้องยึด: **"โดยแผนภาพนั้นต้องเป็นทางการนะ ถูกหลัก swim lane ใน document"** — ตัวอย่างแรกที่ได้คำว่า "เยี่ยม" คือฝาแก้ว เลย์เอาต์/สไตล์/ศัพท์ **ต้องถอดลอกจากมัน**
