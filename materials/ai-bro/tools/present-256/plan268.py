"""plan 268: เพิ่มแท็บ 'เส้นทางบุคลากรหนึ่งคน · ภาพรวม' ในไฟล์ staff-record-flow (สไตล์เดียวกับ journey นักเรียน · ข้าวหลามตัด)"""
import sys, html
sys.stdout.reconfigure(encoding="utf-8")
F2 = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-15-staff-record-flow.drawio"
TAB = "เส้นทางบุคลากรหนึ่งคน · ภาพรวม"
d = open(F2, encoding="utf-8").read()
assert f'name="{TAB}"' not in d
esc = lambda s: html.escape(s, quote=True)
FF = "fontFamily=TH SarabunPSK;fontSize=30;"
RED = "fillColor=#ffffff;strokeColor=#b85450;strokeWidth=2;"
S_SEC = "swimlane;rounded=1;arcSize=4;startSize=50;html=1;whiteSpace=wrap;align=left;spacingLeft=16;fillColor=#1f3a5f;strokeColor=#1f3a5f;strokeWidth=2;swimlaneFillColor=#ffffff;fontColor=#ffffff;fontStyle=1;" + FF
S_TERM = "shape=mxgraph.flowchart.terminator;whiteSpace=wrap;html=1;" + FF + RED
S_BOX = "rounded=0;whiteSpace=wrap;html=1;" + FF + RED
S_BOLD = S_BOX + "fontStyle=1;"
S_DIA = "rhombus;whiteSpace=wrap;html=1;" + RED + FF
S_DOC = "shape=mxgraph.flowchart.document;whiteSpace=wrap;html=1;" + FF + RED
S_NOTE = "text;html=1;whiteSpace=wrap;align=center;verticalAlign=middle;" + FF + "fontColor=#555555;"
E = "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeColor=#666666;strokeWidth=2;labelBackgroundColor=#ffffff;" + FF
cells = []
def v(id_, val, x, y, w, h, style, parent="1"):
    cells.append(f'<mxCell id="jb-{id_}" value="{esc(val)}" style="{style}" vertex="1" parent="{"jb-" + parent if parent != "1" else "1"}"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>')
def e(id_, s, t, extra="", label="", parent="1"):
    cells.append(f'<mxCell id="jb-{id_}" value="{esc(label)}" style="{E + extra}" edge="1" parent="{"jb-" + parent if parent != "1" else "1"}" source="jb-{s}" target="jb-{t}"><mxGeometry relative="1" as="geometry" /></mxCell>')
L2R = "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
R2L = "exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;"

# ช่วงบน
v("A", "ช่วงเข้ามาทำงาน · งานบุคคล", 20, 20, 1580, 230, S_SEC)
A = [("a0", "บรรจุ / จ้าง / ย้ายเข้า", S_TERM), ("a1", "บันทึกประวัติ", S_BOX), ("a2", "กำหนดประเภทและตำแหน่ง", S_BOX),
     ("a3", "จัดเข้ากลุ่มสาระ", S_BOLD), ("a4", "ได้บัญชีผู้ใช้ตามบทบาท", S_BOX)]
for k, (i, t, s) in enumerate(A):
    v(i, t, 20 + 325 * k, 105, 240, 70, s, "A")
for k in range(4):
    e(f"ea{k}", A[k][0], A[k + 1][0], L2R, parent="A")

# ช่วงล่าง
v("B", "ช่วงทำงาน · จนออกจากงาน", 20, 310, 1580, 420, S_SEC)
v("k1", "เริ่มทำงานตามบทบาท", 1310, 106, 260, 70, S_BOX, "B")
v("d", "เป็นครูประจำชั้น?", 1000, 96, 220, 90, S_DIA, "B")
v("hr", "รับห้องประจำชั้น", 1010, 300, 200, 56, S_BOX + "dashed=1;", "B")
v("up", "↻ ทุกปีการศึกษา", 630, 50, 280, 46, S_NOTE, "B")
v("work", "ทำงาน · อัปเดตประวัติและอบรม", 630, 106, 280, 70, S_BOX, "B")
v("mv", "ย้ายกลุ่มสาระ / เปลี่ยนตำแหน่ง", 470, 300, 310, 56, S_TERM + "dashed=1;", "B")
v("out", "ลาออก / ย้าย / เกษียณ", 265, 106, 210, 70, S_BOLD, "B")
v("doc", "แฟ้มประวัติยังเก็บไว้", 20, 96, 200, 90, S_DOC, "B")
e("eb1", "k1", "d", R2L, parent="B")
e("eb2", "d", "work", R2L, "ไม่", parent="B")
e("eb3", "d", "hr", "dashed=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "ใช่", parent="B")
e("eb4", "hr", "work", "dashed=1;exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=0.85;entryY=1;entryDx=0;entryDy=0;", parent="B")
e("eb5", "work", "mv", "dashed=1;startArrow=block;startFill=1;exitX=0.15;exitY=1;exitDx=0;exitDy=0;entryX=0.6516;entryY=0;entryDx=0;entryDy=0;", parent="B")
e("eb6", "work", "out", R2L, "ออกจากงาน", parent="B")
e("eb7", "out", "doc", R2L, parent="B")
# ข้ามช่วง
e("ex", "a4", "k1", "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;")
v("src", "ภาพรวมระดับธุรกิจ · ที่มา: เล่มโครงงาน หัวข้อ 4.4 (งานบุคลากร) · 4.5.1 (แท็บครูประจำชั้น) · 4.5.2 (ตั้งค่างานบุคลากร) · ตาราง JobDetails (กลุ่มสาระ, สถานะทำงาน)",
  30, 760, 1640, 46, S_NOTE + "align=left;")
diagram = (f'  <diagram id="staffj" name="{TAB}">\n'
           '    <mxGraphModel dx="2438" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1680" pageHeight="830" math="0" shadow="0">\n'
           '      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        '
           + "\n        ".join(cells) + '\n      </root>\n    </mxGraphModel>\n  </diagram>\n')
j = d.rindex("</mxfile>")
open(F2, "w", encoding="utf-8", newline="").write(d[:j] + diagram + d[j:])
print("ok", len(cells))
