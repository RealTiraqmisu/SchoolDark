"""plan 261: (1) กรอบระบบ use case -> SakooSite (5 แท็บ B) (2) แท็บ Subject Area แบบครบทุกตาราง ต่อท้ายไฟล์"""
import re, sys, html
sys.stdout.reconfigure(encoding="utf-8")
UC = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-17-usecase-package.drawio"
DB = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-17-db-subject-areas.drawio"
BOOK = r"C:\Users\noey\Desktop\SchoolDark\materials\ai-bro\final-report.md"
OLDNAME = "ระบบบริหารจัดการข้อมูลหลักและงานทะเบียนโรงเรียน (Service B)"

# (1) rename boundary
t = open(UC, encoding="utf-8").read()
n = t.count(f'id="sys-boundary" value="{OLDNAME}"')
assert n == 5, n
t = t.replace(f'id="sys-boundary" value="{OLDNAME}"', 'id="sys-boundary" value="SakooSite"')
open(UC, "w", encoding="utf-8", newline="").write(t)
print("renamed", n)

# (2) full-table tab
book = open(BOOK, encoding="utf-8").read().split("\n")
def tables(a, b):
    return [m.group(1) for l in book[a - 1:b] for m in [re.match(r"^\| ([A-Za-z]+) \|", l)] if m]
G = {"g1": tables(789, 805), "g2": tables(842, 859), "g5": tables(903, 930), "g3": tables(971, 988), "g4": tables(1028, 1047)}
total = sum(len(v) for v in G.values())
allnames = [x for v in G.values() for x in v]
assert total == 56 and len(set(allnames)) == 56, (total, len(set(allnames)))
KEY = {"AdmissionRound", "AdmissionCoursePlan", "Application", "Student", "Classroom", "StudentClassHistory", "ClassroomHomeroomTeacher",
       "Employees", "JobDetails", "Address", "StaffType", "Position", "Department", "User",
       "AcademicYears", "EducationLevels", "StudyProgram", "SchoolRoom", "SubDistricts", "FieldDefinition"}

TAB = "ภาพรวมกลุ่มตาราง · ครบทุกตาราง"
d = open(DB, encoding="utf-8").read()
assert f'name="{TAB}"' not in d
FF = "fontFamily=TH SarabunPSK;html=1;whiteSpace=wrap;"
cells = []
esc = lambda s: html.escape(s, quote=True)
def v(id_, val, x, y, w, h, style):
    cells.append(f'<mxCell id="f-{id_}" value="{esc(val)}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>')
def e(id_, s, tg, label, extra):
    st = ("edgeStyle=orthogonalEdgeStyle;rounded=0;endArrow=block;endFill=1;endSize=12;strokeColor=#333333;strokeWidth=2;"
          "labelBackgroundColor=#ffffff;fontSize=26;fontFamily=TH SarabunPSK;html=1;" + extra)
    cells.append(f'<mxCell id="f-{id_}" value="{esc(label)}" style="{st}" edge="1" parent="1" source="f-{s}" target="f-{tg}"><mxGeometry relative="1" as="geometry" /></mxCell>')

GW, GAP, TOPY = 560, 300, 140
GX = [40 + (GW + GAP) * i for i in range(4)]
ROWH, TH = 46, 38
TBL = "rounded=1;fillColor=#ffffff;strokeColor=#999999;fontSize=22;" + FF
meta = [("g1", 0, "กลุ่มตารางงานรับสมัครนักเรียน", "#dae8fc", "#6c8ebf"),
        ("g2", 1, "กลุ่มตารางงานทะเบียนนักเรียนและการตั้งค่าทะเบียน", "#d5e8d4", "#82b366"),
        ("g3", 2, "กลุ่มตารางงานบุคลากร", "#ffe6cc", "#d79b00"),
        ("g4", 3, "กลุ่มตารางการตั้งค่างานบุคลากร", "#fff2cc", "#d6b656")]
rows_max = max((len(G[g]) + 1) // 2 for g, *_ in meta)
GH = 128 + rows_max * ROWH + 20
for gid, i, name, fill, stroke in meta:
    x = GX[i]
    v(gid, "", x, TOPY, GW, GH, f"rounded=1;arcSize=6;fillColor={fill};strokeColor={stroke};strokeWidth=2;" + FF)
    v(gid + "-t", f"<b>{name}</b>", x + 10, TOPY + 10, GW - 20, 80, "text;align=center;verticalAlign=middle;fontSize=30;" + FF)
    v(gid + "-n", f"({len(G[gid])} ตาราง)", x + 10, TOPY + 88, GW - 20, 30, "text;align=center;verticalAlign=middle;fontSize=26;" + FF)
    cw = (GW - 60 - 16) // 2
    for k, tb in enumerate(G[gid]):
        r, c = k // 2, k % 2
        lab = f"<b>{tb}</b>" if tb in KEY else tb
        v(f"{gid}-tb{k}", lab, x + 30 + c * (cw + 16), TOPY + 128 + r * ROWH, cw, TH, TBL)

G5X, G5Y = GX[0], TOPY + GH + 240
G5W = GX[2] + GW - GX[0]
cols = 5
cw5 = (G5W - 60 - (cols - 1) * 16) // cols
rows5 = (len(G["g5"]) + cols - 1) // cols
G5H = 110 + rows5 * ROWH + 20
v("g5", "", G5X, G5Y, G5W, G5H, "rounded=1;arcSize=6;fillColor=#f5f5f5;strokeColor=#666666;strokeWidth=2;" + FF)
v("g5-t", "<b>กลุ่มตารางการตั้งค่าโรงเรียนและตารางที่เกี่ยวข้อง</b>", G5X + 10, G5Y + 10, G5W - 20, 50, "text;align=center;verticalAlign=middle;fontSize=30;" + FF)
v("g5-n", "(19 ตาราง) · ตารางอ้างอิงกลางที่ทุกกลุ่มใช้ร่วมกัน", G5X + 10, G5Y + 60, G5W - 20, 30, "text;align=center;verticalAlign=middle;fontSize=26;" + FF)
for k, tb in enumerate(G["g5"]):
    r, c = k // cols, k % cols
    lab = f"<b>{tb}</b>" if tb in KEY else tb
    v(f"g5-tb{k}", lab, G5X + 30 + c * (cw5 + 16), G5Y + 110 + r * ROWH, cw5, TH, TBL)

v("title", "<b>ภาพรวมกลุ่มตารางฐานข้อมูล (Subject Area Diagram) · 5 กลุ่ม 56 ตาราง · ครบทุกตาราง</b>", 40, 30, GX[3] + GW - 40, 70, "text;align=center;verticalAlign=middle;fontSize=40;" + FF)
H = "exitX={ex};exitY={ey};exitDx=0;exitDy=0;entryX={nx};entryY={ny};entryDx=0;entryDy=0;"
e("r1", "g2", "g1", "นักเรียนมา<br>จากใบสมัคร", H.format(ex=0, ey=0.5, nx=1, ny=0.5))
e("r2", "g2", "g3", "เลือกครูประจำชั้น<br>จากบุคลากร", H.format(ex=1, ey=0.5, nx=0, ny=0.5))
e("r3", "g3", "g4", "ระบุประเภท<br>ตำแหน่ง แผนก", H.format(ex=1, ey=0.3, nx=0, ny=0.3))
e("r4", "g4", "g3", "บัญชีผู้ใช้ ผู้ลงนาม<br>หัวหน้าแผนก เป็นบุคลากร", H.format(ex=0, ey=0.75, nx=1, ny=0.75))
for rid, gid, gx, lab in [("r5", "g1", GX[0], "ปีการศึกษา แผนการเรียน<br>ที่อยู่ ชนิดเอกสาร"),
                          ("r6", "g2", GX[1], "ปี ระดับชั้น แผนการเรียน ห้องจริง<br>ที่อยู่ ชนิดเอกสาร"),
                          ("r7", "g3", GX[2], "ตำบลและประเทศ<br>ของที่อยู่")]:
    e(rid, gid, "g5", lab, H.format(ex=0.5, ey=1, nx=round((gx + GW / 2 - G5X) / G5W, 4), ny=0))
FY = G5Y + G5H + 30
NOTE = "text;align=left;verticalAlign=top;fontColor=#666666;fontSize=24;" + FF
v("note1", "ลูกศร = กลุ่มต้นทางมีตารางที่อ้างอิง (FK) ไปยังตารางในกลุ่มปลายทาง · ตัวหนา = ตารางหลักของกลุ่ม · รายละเอียดคอลัมน์อยู่ใน Data Dictionary 3.4.6", 40, FY, GX[3] + GW - 40, 40, NOTE)
v("note2", "ที่มา: เล่ม B หัวข้อ 3.4 (ตารางที่ 3, 5, 7, 9, 11 \"ตารางจากหมวดอื่นที่เกี่ยวข้อง\")", 40, FY + 40, GX[3] + GW - 40, 40, NOTE)
PW, PH = GX[3] + GW + 40, FY + 100
diagram = (f'  <diagram id="dbsa2" name="{TAB}">\n'
           f'    <mxGraphModel dx="2438" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{PW}" pageHeight="{PH}" math="0" shadow="0">\n'
           '      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        '
           + "\n        ".join(cells) + '\n      </root>\n    </mxGraphModel>\n  </diagram>\n')
i = d.rindex("</mxfile>")
open(DB, "w", encoding="utf-8", newline="").write(d[:i] + diagram + d[i:])
print("full tab ok", {k: len(v) for k, v in G.items()})
