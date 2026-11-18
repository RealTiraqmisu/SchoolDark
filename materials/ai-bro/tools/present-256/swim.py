import sys, html, os
sys.stdout.reconfigure(encoding="utf-8")
OUT = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-17-staff-teacher-swimlane.drawio"
pass
F = "fontFamily=TH SarabunPSK;fontSize=30;html=1;whiteSpace=wrap;"
cells = []
esc = lambda s: html.escape(s, quote=True)
def v(id_, val, x, y, w, h, style):
    cells.append(f'<mxCell id="{id_}" value="{esc(val)}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>')
def e(id_, s, t, style, label=""):
    cells.append(f'<mxCell id="{id_}" value="{esc(label)}" style="{style}" edge="1" parent="1" source="{s}" target="{t}"><mxGeometry relative="1" as="geometry" /></mxCell>')

LANES = ["เจ้าหน้าที่งานบุคคล", "ผู้ดูแลระบบ", "เจ้าหน้าที่งานทะเบียน", "ครูประจำชั้น", "ครู", "ระบบ<br>(ข้อมูลชุดเดียว)"]
LH, X0, HW, BODY_W = 190, 20, 260, 2760
LY = [20 + LH * i for i in range(6)]
for i, name in enumerate(LANES):
    sysl = i == 5
    v(f"ln{i}-h", f"<b>{name}</b>", X0, LY[i], HW, LH,
      "rounded=0;" + F + ("fillColor=#b9e0a5;strokeColor=#82b366;" if sysl else "fillColor=#f5f5f5;strokeColor=#999999;"))
    v(f"ln{i}-b", "", X0 + HW, LY[i], BODY_W, LH,
      "rounded=0;html=1;" + ("fillColor=#d5e8d4;strokeColor=#82b366;" if sysl else "fillColor=#ffffff;strokeColor=#999999;"))

BW, BH, PITCH, CX0 = 300, 170, 360, 400
colx = lambda k: CX0 + PITCH * (k - 1)
STEP = "rounded=1;spacing=12;fillColor=#ffffff;strokeColor=#000000;" + F
REF = '<br><font style="font-size:24px" color="#666666">{}</font>'
steps = [
    (1, 0, "เพิ่มข้อมูลครูใหม่", "UC-STF-02"),
    (2, 1, "ตั้งค่าข้อมูลโรงเรียน: แท็บครูประจำชั้น (เลือกจากรายชื่อบุคลากร)", "UC-SET-01"),
    (3, 2, "เปลี่ยนสถานะผู้สมัครเป็นมอบตัว → ระบบออกรหัสนักเรียน", "UC-ADM-03"),
    (4, 2, "ย้ายห้อง/เลื่อนชั้นนักเรียนหลายคนพร้อมกัน · ตรวจผลก่อนยืนยัน", "UC-REG-04"),
    (5, 3, "แก้ข้อมูลนักเรียนได้เฉพาะห้องตน", "UC-REG-03"),
    (6, 4, "ดูและส่งออกรายชื่อนักเรียน", "UC-REG-06 · 07"),
    (7, 2, "ส่งออก ปพ.1 และ ปพ.2", "UC-REG-09"),
]
# raw HTML label: build manually (escape whole string once)
for k, lane, txt, ref in steps:
    v(f"s{k}", txt + REF.format(ref), colx(k), LY[lane] + (LH - BH) // 2, BW, BH, STEP)

v("start", "", 310, LY[0] + LH // 2 - 25, 50, 50, "ellipse;fillColor=#000000;strokeColor=#000000;html=1;")
v("end", "", colx(7) + BW + 50, LY[2] + LH // 2 - 25, 50, 50, "ellipse;shape=doubleEllipse;fillColor=#000000;strokeColor=#000000;html=1;")
FLOW = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=block;endFill=1;strokeColor=#000000;strokeWidth=2;"
seq = ["start"] + [f"s{k}" for k in range(1, 8)] + ["end"]
for i in range(len(seq) - 1):
    e(f"f{i}", seq[i], seq[i + 1], FLOW + "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;")

# system lane data boxes
DB = "shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=12;fillColor=#ffffff;strokeColor=#82b366;" + F
DY, DH = LY[5] + 25, 140
v("d-staff", "ข้อมูลบุคลากร", colx(1), DY, BW, DH, DB)
v("d-room", "ข้อมูลห้องเรียนและครูประจำชั้น", colx(2), DY, BW, DH, DB)
sx, sw = colx(3), colx(7) + BW - colx(3)
v("d-stu", "ข้อมูลนักเรียน", sx, DY, sw, DH, DB)
DATA = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;dashed=1;endArrow=open;endSize=12;strokeColor=#2d7600;strokeWidth=2;"
DOWN = "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryY=0;entryDx=0;entryDy=0;"
UP = "exitY=0;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;"
e("w1", "s1", "d-staff", DATA + DOWN + "entryX=0.5;")
e("w2", "s2", "d-room", DATA + DOWN + "entryX=0.5;")
e("r2", "d-staff", "d-room", DATA + "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;")
rel = lambda k: round((colx(k) + BW / 2 - sx) / sw, 4)
for k in (3, 4, 5):
    e(f"w{k}", f"s{k}", "d-stu", DATA + DOWN + f"entryX={rel(k)};")
for k in (6, 7):
    e(f"r{k}", "d-stu", f"s{k}", DATA + UP + f"exitX={rel(k)};")

TY = LY[5] + LH + 30
TXT = "text;align=left;verticalAlign=top;" + F
v("legend", "เส้นทึบ = ลำดับงาน (เรียงให้อ่านง่าย) · เส้นประสีเขียว = บันทึกลง/อ่านจากข้อมูลชุดเดียว", X0, TY, 3000, 45, TXT)
v("benefit", "<b>กรอกครั้งเดียว ทุกฝ่ายใช้ข้อมูลชุดเดียวกัน · ครูดูและส่งออกรายชื่อนักเรียนได้เอง · ครูประจำชั้นแก้ได้เฉพาะห้องตน</b>", X0, TY + 50, 3000, 45, TXT)
v("src", "ที่มา: เล่ม B 3.3.4 (รหัส use case) · UC-ADM-03 และภาคผนวก ก.3 (ระบบออกรหัสนักเรียนเมื่อสถานะเป็นมอบตัว) · 4.5.1 หน้าตั้งค่าข้อมูลโรงเรียน (แท็บครูประจำชั้น) · หมวดข้อมูลบุคลากร (เป็นต้นทางข้อมูลครูให้ฝั่งทะเบียนเลือกเป็นครูประจำชั้น)", X0, TY + 100, 3000, 90, TXT)

PW, PH = 3060, TY + 200
xml = ('<mxfile host="Electron">\n  <diagram id="stsw1" name="ครูและบุคลากรใช้ระบบ · ต้นปีการศึกษา">\n'
       f'    <mxGraphModel dx="2438" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{PW}" pageHeight="{PH}" math="0" shadow="0">\n'
       '      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        '
       + "\n        ".join(cells) + '\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n')
open(OUT, "w", encoding="utf-8", newline="").write(xml)
print("ok", len(cells))
