"""plan 274: (1) staff-record-flow เพิ่มแท็บ 'เส้นทางบุคลากรหนึ่งคน · ข้าวหลามตัด' สไตล์เดียวกับ p4jd
(2) student-journey คัดลอก p4jd เป็นแท็บใหม่ ตัด '6 ขั้น' · ไม่แตะแท็บเดิม
รันซ้ำไม่ได้ (assert) · สร้างใหม่ให้เริ่มจาก backup-2026-11-17/*.before-274.drawio"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
V = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\\"
FS = V + "2026-11-15-staff-record-flow.drawio"
FJ = V + "2026-11-15-student-journey.drawio"

F = "fontFamily=TH SarabunPSK;fontSize=30;"
LANE = ("swimlane;rounded=1;arcSize=4;startSize=50;html=1;whiteSpace=wrap;align=left;spacingLeft=16;"
        "fillColor=#1f3a5f;strokeColor=#1f3a5f;strokeWidth=2;swimlaneFillColor=#ffffff;fontColor=#ffffff;fontStyle=1;" + F)
BOX = "rounded=0;whiteSpace=wrap;html=1;" + F + "fillColor=#ffffff;strokeColor=#b85450;strokeWidth=2;"
TERM = "shape=mxgraph.flowchart.terminator;whiteSpace=wrap;html=1;" + F + "fillColor=#ffffff;strokeColor=#b85450;strokeWidth=2;"
DIA = "rhombus;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#b85450;strokeWidth=2;" + F
DOC = "shape=mxgraph.flowchart.document;whiteSpace=wrap;html=1;" + F + "fillColor=#ffffff;strokeColor=#b85450;strokeWidth=2;"
TXT = "text;html=1;whiteSpace=wrap;align=center;verticalAlign=middle;" + F + "fontColor=#555555;"
EDGE = ("edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeColor=#666666;strokeWidth=2;"
        "labelBackgroundColor=#ffffff;" + F)

cells = []
def v(cid, parent, style, val, x, y, w, h):
    cells.append(f'<mxCell id="{cid}" parent="{parent}" style="{style}" value="{val}" vertex="1">'
                 f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>')
def e(cid, parent, s, t, val="", extra=""):
    cells.append(f'<mxCell id="{cid}" edge="1" parent="{parent}" source="{s}" target="{t}" style="{EDGE}{extra}" value="{val}">'
                 f'<mxGeometry relative="1" as="geometry" /></mxCell>')

# เลน A · ช่วงเข้าทำงาน (ซ้าย -> ขวา)
v("sj-A", "1", LANE, "ช่วงเข้าทำงาน · งานบุคคล", 20, 20, 1580, 230)
A = [("sj-a0", TERM, "บรรจุ / จ้าง / ย้ายเข้า"), ("sj-a1", BOX, "ส่งเอกสารประวัติ"),
     ("sj-a2", BOX, "ได้ประเภทและตำแหน่ง"), ("sj-a3", BOX, "สังกัดกลุ่มสาระ / แผนก")]
for k, (cid, st, val) in enumerate(A):
    v(cid, "sj-A", st, val, 20 + 413 * k, 107, 300, 56)
for k in range(3):
    e(f"sj-ea{k}", "sj-A", A[k][0], A[k + 1][0])

# เลน B · ช่วงทำงาน (ขวา -> ซ้าย)
BY = 310
v("sj-B", "1", LANE, "ช่วงทำงาน · งานบุคคล", 20, BY, 1580, 370)
v("sj-d1", "sj-B", DIA, "เป็นครูประจำชั้น?", 1260, 75, 300, 120)
v("sj-hr", "sj-B", BOX + "dashed=1;", "รับห้องประจำชั้น", 1310, 270, 200, 56)
v("sj-up", "sj-B", TXT, "↻ ทุกปีการศึกษา", 870, 55, 300, 46)
v("sj-tr", "sj-B", BOX, "อบรม / ต่อใบประกอบวิชาชีพ", 870, 107, 300, 56)
v("sj-d2", "sj-B", DIA, "เปลี่ยนตำแหน่ง?", 550, 80, 260, 110)
v("sj-mv", "sj-B", BOX + "dashed=1;", "ย้ายกลุ่มสาระ / เลื่อนตำแหน่ง", 530, 270, 300, 56)
v("sj-out", "sj-B", BOX + "fontStyle=1;", "ลาออก / ย้ายออก / เกษียณ", 250, 107, 250, 56)
v("sj-doc", "sj-B", DOC, "พิมพ์แฟ้มประวัติ", 20, 93, 200, 84)
e("sj-eb1", "sj-B", "sj-d1", "sj-tr", "ไม่")
e("sj-eb2", "sj-B", "sj-d1", "sj-hr", "ใช่", "dashed=1;")
e("sj-eb3", "sj-B", "sj-hr", "sj-tr", "", "dashed=1;exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;")
e("sj-eb4", "sj-B", "sj-tr", "sj-d2")
e("sj-eb5", "sj-B", "sj-d2", "sj-mv", "ใช่", "dashed=1;")
e("sj-eb6", "sj-B", "sj-d2", "sj-out")
e("sj-eb7", "sj-B", "sj-out", "sj-doc")
e("sj-ex", "1", "sj-a3", "sj-d1", "เริ่มปฏิบัติงาน")
v("sj-src", "1", TXT + "align=left;",
  "ทุกขั้นเป็นงานของทีม B · ที่มา: เล่มโครงงาน หัวข้อ 4.4 (งานบุคลากร) · ตาราง Training, License, JobDetails",
  30, BY + 370 + 30, 1640, 46)

NAME = "เส้นทางบุคลากรหนึ่งคน · ข้าวหลามตัด"
tab = (f'<diagram id="staffjd" name="{NAME}">\n    <mxGraphModel grid="1" gridSize="10" guides="1" tooltips="1" connect="1" '
       f'arrows="1" fold="1" page="1" pageScale="1" pageWidth="1680" pageHeight="{BY + 370 + 100}" math="0" shadow="0" '
       f'adaptiveColors="auto">\n      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        '
       + "\n        ".join(cells) + "\n      </root>\n    </mxGraphModel>\n  </diagram>")
d = open(FS, encoding="utf-8").read()
assert f'name="{NAME}"' not in d
k = d.rindex("</diagram>") + len("</diagram>")
d = d[:k] + "\n  " + tab + d[k:]
open(FS, "w", encoding="utf-8", newline="").write(d)
print("staff tab ok")

# (2) แท็บนักเรียนใหม่ ไม่มี 6 ขั้น
NEW = "4 เส้นทางนักเรียนหนึ่งคน · ข้าวหลามตัด (ไม่มี 6 ขั้น)"
d = open(FJ, encoding="utf-8").read()
assert f'name="{NEW}"' not in d
i = d.index('<diagram id="p4jd"'); j = d.index("</diagram>", i) + len("</diagram>")
t = d[i:j]
t = t.replace('<diagram id="p4jd" name="4 เส้นทางนักเรียนหนึ่งคน · ข้าวหลามตัด"', f'<diagram id="p4jd2" name="{NEW}"')
t = re.sub(r'\b(id|parent|source|target)="(?!0"|1")([^"]+)"', r'\1="n2-\2"', t)
assert 'value="สมัครออนไลน์ 6 ขั้น"' in t
t = t.replace('value="สมัครออนไลน์ 6 ขั้น"', 'value="สมัครออนไลน์"')
d = d[:j] + "\n  " + t + d[j:]
open(FJ, "w", encoding="utf-8", newline="").write(d)
print("student tab ok")
