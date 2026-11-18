"""plan 259: Subject Area Diagram ของฐานข้อมูล 5 กลุ่ม (เล่ม 3.4) · สร้างไฟล์ใหม่ (ไม่ทับถ้ามีอยู่แล้ว ยกเว้นส่ง --force)"""
import sys, html, os
sys.stdout.reconfigure(encoding="utf-8")
OUT = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-17-db-subject-areas.drawio"
if os.path.exists(OUT) and "--force" not in sys.argv:
    sys.exit("file exists (use --force only if นายยังไม่ได้แก้ไฟล์ด้วยมือ)")
FF = "fontFamily=TH SarabunPSK;html=1;whiteSpace=wrap;"
cells = []
esc = lambda s: html.escape(s, quote=True)
def v(id_, val, x, y, w, h, style):
    cells.append(f'<mxCell id="{id_}" value="{esc(val)}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>')
def e(id_, s, t, label, extra):
    st = ("edgeStyle=orthogonalEdgeStyle;rounded=0;endArrow=block;endFill=1;endSize=12;strokeColor=#333333;strokeWidth=2;"
          "labelBackgroundColor=#ffffff;fontSize=26;fontFamily=TH SarabunPSK;html=1;" + extra)
    cells.append(f'<mxCell id="{id_}" value="{esc(label)}" style="{st}" edge="1" parent="1" source="{s}" target="{t}"><mxGeometry relative="1" as="geometry" /></mxCell>')

GW, GH, GAP, TOPY = 560, 400, 300, 140
GX = [40 + (GW + GAP) * i for i in range(4)]
TBL = "rounded=1;fillColor=#ffffff;strokeColor=#999999;fontSize=26;" + FF
MORE = "text;align=center;verticalAlign=middle;fontColor=#666666;fontSize=24;" + FF
groups = [
    ("g1", GX[0], "กลุ่มตารางงานรับสมัครนักเรียน", 8, ["AdmissionRound (รอบรับสมัคร)", "AdmissionCoursePlan (แผนที่เปิดรับ)", "Application (ใบสมัคร)"], 5, "#dae8fc", "#6c8ebf"),
    ("g2", GX[1], "กลุ่มตารางงานทะเบียนนักเรียนและการตั้งค่าทะเบียน", 9, ["Student (นักเรียน)", "Classroom (ห้องเรียนต่อปี)", "StudentClassHistory (ประวัติห้อง)", "ClassroomHomeroomTeacher (ครูประจำชั้น)"], 5, "#d5e8d4", "#82b366"),
    ("g3", GX[2], "กลุ่มตารางงานบุคลากร", 9, ["Employees (บุคลากร)", "JobDetails (รายละเอียดงาน)", "Address (ที่อยู่)"], 6, "#ffe6cc", "#d79b00"),
    ("g4", GX[3], "กลุ่มตารางการตั้งค่างานบุคลากร", 11, ["StaffType (ประเภทบุคลากร)", "Position (ตำแหน่ง)", "Department (แผนก)", "User (บัญชีผู้ใช้)"], 7, "#fff2cc", "#d6b656"),
]
for gid, x, name, n, tables, more, fill, stroke in groups:
    v(gid, "", x, TOPY, GW, GH, f"rounded=1;arcSize=6;fillColor={fill};strokeColor={stroke};strokeWidth=2;" + FF)
    v(gid + "-t", f"<b>{name}</b>", x + 10, TOPY + 10, GW - 20, 80, "text;align=center;verticalAlign=middle;fontSize=30;" + FF)
    v(gid + "-n", f"({n} ตาราง)", x + 10, TOPY + 88, GW - 20, 30, "text;align=center;verticalAlign=middle;fontSize=26;" + FF)
    for i, tb in enumerate(tables):
        v(f"{gid}-tb{i}", tb, x + 40, TOPY + 128 + i * 58, GW - 80, 48, TBL)
    v(gid + "-m", f"และอีก {more} ตาราง", x + 10, TOPY + 128 + len(tables) * 58 + 4, GW - 20, 30, MORE)

# group 5 (bottom, central reference tables)
G5X, G5Y, G5W, G5H = GX[0], 800, GX[2] + GW - GX[0], 320
v("g5", "", G5X, G5Y, G5W, G5H, "rounded=1;arcSize=6;fillColor=#f5f5f5;strokeColor=#666666;strokeWidth=2;" + FF)
v("g5-t", "<b>กลุ่มตารางการตั้งค่าโรงเรียนและตารางที่เกี่ยวข้อง</b>", G5X + 10, G5Y + 10, G5W - 20, 50, "text;align=center;verticalAlign=middle;fontSize=30;" + FF)
v("g5-n", "(19 ตาราง) · ตารางอ้างอิงกลางที่ทุกกลุ่มใช้ร่วมกัน", G5X + 10, G5Y + 60, G5W - 20, 30, "text;align=center;verticalAlign=middle;fontSize=26;" + FF)
t5 = ["AcademicYears (ปีการศึกษา)", "EducationLevels (ระดับชั้น)", "StudyProgram (แผนการเรียน)", "SchoolRoom (ห้องจริง)", "SubDistricts (ตำบล)", "FieldDefinition (ชนิดเอกสาร/ช่องฟอร์ม)"]
TW, TG = 340, 30
sx = G5X + (G5W - (len(t5) * TW + (len(t5) - 1) * TG)) // 2
for i, tb in enumerate(t5):
    v(f"g5-tb{i}", tb, sx + i * (TW + TG), G5Y + 120, TW, 80, TBL)
v("g5-m", "และอีก 13 ตาราง", G5X + 10, G5Y + 220, G5W - 20, 30, MORE)

v("title", "<b>ภาพรวมกลุ่มตารางฐานข้อมูล (Subject Area Diagram) · 5 กลุ่ม 56 ตาราง</b>", 40, 30, GX[3] + GW - 40, 70, "text;align=center;verticalAlign=middle;fontSize=40;" + FF)

H = "exitX={ex};exitY={ey};exitDx=0;exitDy=0;entryX={nx};entryY={ny};entryDx=0;entryDy=0;"
e("r1", "g2", "g1", "นักเรียนมา<br>จากใบสมัคร", H.format(ex=0, ey=0.5, nx=1, ny=0.5))
e("r2", "g2", "g3", "เลือกครูประจำชั้น<br>จากบุคลากร", H.format(ex=1, ey=0.5, nx=0, ny=0.5))
e("r3", "g3", "g4", "ระบุประเภท<br>ตำแหน่ง แผนก", H.format(ex=1, ey=0.3, nx=0, ny=0.3))
e("r4", "g4", "g3", "บัญชีผู้ใช้ ผู้ลงนาม<br>หัวหน้าแผนก เป็นบุคลากร", H.format(ex=0, ey=0.75, nx=1, ny=0.75))
for rid, gid, gx, lab in [("r5", "g1", GX[0], "ปีการศึกษา แผนการเรียน<br>ที่อยู่ ชนิดเอกสาร"),
                          ("r6", "g2", GX[1], "ปี ระดับชั้น แผนการเรียน ห้องจริง<br>ที่อยู่ ชนิดเอกสาร"),
                          ("r7", "g3", GX[2], "ตำบลและประเทศ<br>ของที่อยู่")]:
    nx = round((gx + GW / 2 - G5X) / G5W, 4)
    e(rid, gid, "g5", lab, H.format(ex=0.5, ey=1, nx=nx, ny=0))

FY = G5Y + G5H + 30
NOTE = "text;align=left;verticalAlign=top;fontColor=#666666;fontSize=24;" + FF
v("note1", "ลูกศร = กลุ่มต้นทางมีตารางที่อ้างอิง (FK) ไปยังตารางในกลุ่มปลายทาง · แสดงเฉพาะตารางหลัก รายละเอียดทุกตารางอยู่ในเล่ม 3.4.1–3.4.5 และ Data Dictionary 3.4.6", 40, FY, GX[3] + GW - 40, 40, NOTE)
v("note2", "ที่มา: เล่ม B หัวข้อ 3.4 (ตารางที่ 3, 5, 7, 9, 11 \"ตารางจากหมวดอื่นที่เกี่ยวข้อง\")", 40, FY + 40, GX[3] + GW - 40, 40, NOTE)

PW, PH = GX[3] + GW + 40, FY + 100
xml = ('<mxfile host="Electron">\n  <diagram id="dbsa1" name="ภาพรวมกลุ่มตาราง">\n'
       f'    <mxGraphModel dx="2438" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{PW}" pageHeight="{PH}" math="0" shadow="0">\n'
       '      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        '
       + "\n        ".join(cells) + '\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n')
open(OUT, "w", encoding="utf-8", newline="").write(xml)
print("ok", len(cells), PW, PH)
