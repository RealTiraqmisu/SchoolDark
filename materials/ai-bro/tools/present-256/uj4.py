"""plan 257: เพิ่มแท็บ user journey 'เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง' ต่อท้ายไฟล์ (ไม่แตะแท็บเดิม)"""
import sys, html
sys.stdout.reconfigure(encoding="utf-8")
SRC = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-15-user-journey-old-vs-new.drawio"
TAB = "เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง"

F = "fontFamily=TH SarabunPSK;fontSize=30;html=1;whiteSpace=wrap;"
COL = {"เปิดหน้าจอ": "#dae8fc", "เลือกนักเรียน": "#fff2cc", "ส่งออกไฟล์": "#ffe6cc", "คัดรายชื่อใน Excel": "#f8cecc"}
W, H = 260, 130
X = [30 + 310 * i for i in range(8)]
cells = []
esc = lambda s: html.escape(s, quote=True)

def v(id_, val, x, y, w, h, style, parent="1"):
    cells.append(f'<mxCell id="{id_}" value="{esc(val)}" style="{style}" vertex="1" parent="{parent}"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>')

def e(id_, s, t, parent, extra="", label=""):
    st = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=block;endFill=1;strokeColor=#000000;fontFamily=TH SarabunPSK;fontSize=26;" + extra
    cells.append(f'<mxCell id="{id_}" value="{esc(label)}" style="{st}" edge="1" parent="{parent}" source="{s}" target="{t}"><mxGeometry relative="1" as="geometry" /></mxCell>')

def step(id_, kind, detail, x, y, parent):
    v(id_, f"<b>{kind}</b><br>{detail}", x, y, W, H, f"rounded=0;fillColor={COL[kind]};strokeColor=#000000;" + F, parent)

TERM = "shape=mxgraph.flowchart.terminator;fillColor=#FFFFFF;strokeColor=#000000;" + F
LANE = "swimlane;startSize=50;swimlaneFillColor=#FFFFFF;fontStyle=1;container=1;collapsible=0;" + F
LW = X[7] + W + 30

# old
R1, R2 = 80, 270
OLD_H = R2 + H + 40
v("u4o", "ระบบเดิม (ส่งออกรายชื่อนักเรียน 2 คน ต่างระดับชั้น)", 20, 20, LW, OLD_H, LANE + "fillColor=#f8cecc;strokeColor=#b85450;")
v("u4o-s", "เริ่ม: ส่งออกรายชื่อ<br>นักเรียนไปแข่ง", X[0], R1, W, H, TERM, "u4o")
step("u4o-o1", "เปิดหน้าจอ", "หน้าข้อมูลนักเรียน<br>(ดูรายชื่อทั้งหมด)", X[1], R1, "u4o")
step("u4o-o2", "เปิดหน้าจอ", "หน้ารายงานนักเรียน", X[2], R1, "u4o")
step("u4o-o3", "เปิดหน้าจอ", "หน้ารายชื่อนักเรียน", X[3], R1, "u4o")
step("u4o-f1", "เลือกนักเรียน", "กรองตามห้องของคนที่ 1<br>(เลือกรายคนไม่ได้)", X[4], R1, "u4o")
step("u4o-x1", "ส่งออกไฟล์", "ไฟล์ที่ 1<br>(ได้ทั้งห้อง)", X[5], R1, "u4o")
step("u4o-f2", "เลือกนักเรียน", "ล้างตัวกรอง แล้ว<br>กรองห้องของคนที่ 2", X[4], R2, "u4o")
step("u4o-x2", "ส่งออกไฟล์", "ไฟล์ที่ 2<br>(ได้ทั้งห้อง)", X[5], R2, "u4o")
step("u4o-xl", "คัดรายชื่อใน Excel", "เปิด 2 ไฟล์ ดึงเฉพาะ<br>คนที่ต้องการเอง", X[6], R2, "u4o")
v("u4o-end", "จบ: ได้รายชื่อ<br>(หลังคัดเอง)", X[7], R2, W, H, TERM, "u4o")
e("u4o-e0", "u4o-s", "u4o-o1", "u4o")
e("u4o-e1", "u4o-o1", "u4o-o2", "u4o", label="ออก")
e("u4o-e2", "u4o-o2", "u4o-o3", "u4o")
e("u4o-e3", "u4o-o3", "u4o-f1", "u4o")
e("u4o-e4", "u4o-f1", "u4o-x1", "u4o")
e("u4o-e5", "u4o-x1", "u4o-f2", "u4o", "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;")
e("u4o-e6", "u4o-f2", "u4o-x2", "u4o")
e("u4o-e7", "u4o-x2", "u4o-xl", "u4o")
e("u4o-e8", "u4o-xl", "u4o-end", "u4o")

# new
NY = 20 + OLD_H + 40
NEW_H = 50 + 30 + H + 40
v("u4n", "ระบบใหม่ (ส่งออกรายชื่อนักเรียน 2 คน ต่างระดับชั้น)", 20, NY, LW, NEW_H, LANE + "fillColor=#d5e8d4;strokeColor=#82b366;")
v("u4n-s", "เริ่ม: ส่งออกรายชื่อ<br>นักเรียนไปแข่ง", X[0], 80, W, H, TERM, "u4n")
step("u4n-o1", "เปิดหน้าจอ", "หน้าทะเบียนนักเรียน", X[1], 80, "u4n")
step("u4n-f", "เลือกนักเรียน", "ติ๊ก checkbox<br>คนที่ 1 และ 2", X[4], 80, "u4n")
step("u4n-x", "ส่งออกไฟล์", "ไฟล์เดียว<br>เฉพาะคนที่เลือก", X[5], 80, "u4n")
v("u4n-end", "จบ: ได้รายชื่อตรงตาม<br>ต้องการ ไม่ต้องเปิด Excel", X[7], 80, W, H, TERM, "u4n")
seq = ["u4n-s", "u4n-o1", "u4n-f", "u4n-x", "u4n-end"]
for i in range(len(seq) - 1):
    e(f"u4n-e{i}", seq[i], seq[i + 1], "u4n")

BADGE = "rounded=1;fontStyle=1;align=center;verticalAlign=middle;" + F
BX = 20 + LW + 40
v("u4o-badge", "8 ขั้น<br>เปิด 3 หน้าจอ<br>ส่งออก 2 ไฟล์<br>ต้องคัดใน Excel", BX, 100, 300, 240, BADGE + "fillColor=#f8cecc;strokeColor=#b85450;")
v("u4n-badge", "3 ขั้น<br>เปิด 1 หน้าจอ<br>ส่งออก 1 ไฟล์<br>ไม่ต้องใช้ Excel", BX, NY + 40, 300, 200, BADGE + "fillColor=#d5e8d4;strokeColor=#82b366;")

FY = NY + NEW_H + 30
TXT = "text;align=left;verticalAlign=top;" + F
v("u4-note", "ตัวอย่างนักเรียน 2 คน · ถ้านักเรียน N คนอยู่ N ห้อง ระบบเดิมต้องกรองและส่งออก N รอบ แล้วคัดใน Excel ส่วนระบบใหม่ยังเป็น 3 ขั้นเท่าเดิม", 20, FY, BX + 300, 50, TXT)
v("u4-src", "ที่มา: ขั้นตอนระบบเดิมจากประสบการณ์ใช้งานของคณะผู้จัดทำ · ระบบใหม่ตามเล่ม B 4.3.3 (แถบคำสั่งเมื่อเลือกนักเรียน) · UC-REG-07 ส่งออกรายชื่อนักเรียน", 20, FY + 50, BX + 300, 50, TXT)

PW, PH = BX + 340, FY + 120
diagram = (f'  <diagram id="uj4" name="{TAB}">\n'
           f'    <mxGraphModel dx="2438" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{PW}" pageHeight="{PH}" math="0" shadow="0">\n'
           '      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        '
           + "\n        ".join(cells) + '\n      </root>\n    </mxGraphModel>\n  </diagram>\n')
t = open(SRC, encoding="utf-8").read()
assert f'name="{TAB}"' not in t, "tab already exists"
i = t.rindex("</mxfile>")
open(SRC, "w", encoding="utf-8", newline="").write(t[:i] + diagram + t[i:])
print("ok", len(cells))
