"""plan 267: (1) แท็บ Copy of 2 บุคลากร: แตกกล่องพนักงานราชการเป็น 6 กลุ่มงาน + ย้ายลูกจ้างประจำเป็นคอลัมน์ 4
(2) ไฟล์ staff-record-flow: เพิ่มแท็บ 'วงจรบุคลากร · ตั้งแต่เข้าจนออก' (swimlane)  · รันได้ครั้งเดียว (มี assert)"""
import re, sys, html
sys.stdout.reconfigure(encoding="utf-8")
D = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present"
F1 = D + r"\2026-11-11-thai-school-staff-structure.drawio"
F2 = D + r"\2026-11-15-staff-record-flow.drawio"
esc = lambda s: html.escape(s, quote=True)

# ---------- (1) ----------
t = open(F1, encoding="utf-8").read()
m = re.search(r'<diagram name="Copy of 2 บุคลากร · 16:9 \(ตัวอย่าง\)".*?</diagram>', t, re.S)
b = m.group(0)
P = "HTJSzHwCnoFfS68xTGCr-"
assert "grp6-0" not in b, "already done"
def cell(i):
    return re.search(r'<mxCell id="' + P + i + r'".*?</mxCell>', b, re.S)
def setgeo(raw, **kv):
    for k, v in kv.items():
        raw = re.sub(r'(<mxGeometry[^>]*\b' + k + r'=")[^"]*(")', r'\g<1>' + str(v) + r'\g<2>', raw, count=1)
    return raw
# move ลูกจ้างประจำ (7) + ลูก (8) to column 4
for i, y in (("7", 160), ("8", 280)):
    c = cell(i).group(0)
    b = b.replace(c, setgeo(c, x=1600, y=y))
c = cell("15").group(0)
b = b.replace(c, re.sub(r'<Array as="points">.*?</Array>', "", c, flags=re.S))
# header box (5) -> yellow heading style
c = cell("5").group(0)
c2 = re.sub(r'style="[^"]*"', 'style="rounded=1;whiteSpace=wrap;html=1;fontFamily=TH SarabunPSK;fontSize=30;fillColor=#fff2cc;strokeColor=#d6b656;"', c, count=1)
c2 = c2.replace('value="ทั่วไป / พิเศษ 6 กลุ่มงาน"', 'value="ทั่วไป / พิเศษ · 6 กลุ่มงาน"')
c2 = setgeo(c2, height=56)
b = b.replace(c, c2)
GROUPS = ["บริการ", "เทคนิค", "บริหารทั่วไป", "วิชาชีพเฉพาะ", "เชี่ยวชาญเฉพาะ", "เชี่ยวชาญพิเศษ"]
new = []
BOX = "rounded=1;whiteSpace=wrap;html=1;fontFamily=TH SarabunPSK;fontSize=30;fillColor=#ffffff;strokeColor=#999999;"
EDGE = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeColor=#666666;exitX=0.08;exitY=1;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
for k, g in enumerate(GROUPS):
    new.append(f'<mxCell id="grp6-{k}" parent="{P}1" style="{BOX}" value="{esc("<b>" + g + "</b>")}" vertex="1"><mxGeometry height="56" width="272" x="956" y="{356 + 66 * k}" as="geometry" /></mxCell>')
    new.append(f'<mxCell id="grp6-e{k}" edge="1" parent="{P}1" source="{P}5" target="grp6-{k}" style="{EDGE}"><mxGeometry relative="1" as="geometry" /></mxCell>')
i = b.rindex("</root>")
b = b[:i] + "\n        ".join(new) + "\n      " + b[i:]
t = t[:m.start()] + b + t[m.end():]
open(F1, "w", encoding="utf-8", newline="").write(t)
print("(1) ok")

# ---------- (2) ----------
d = open(F2, encoding="utf-8").read()
TAB = "วงจรบุคลากร · ตั้งแต่เข้าจนออก"
assert f'name="{TAB}"' not in d
F = "fontFamily=TH SarabunPSK;fontSize=30;html=1;whiteSpace=wrap;"
cells = []
def v(id_, val, x, y, w, h, style):
    cells.append(f'<mxCell id="lc-{id_}" value="{esc(val)}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>')
def e(id_, s, tg, style, label=""):
    cells.append(f'<mxCell id="lc-{id_}" value="{esc(label)}" style="{style}" edge="1" parent="1" source="lc-{s}" target="lc-{tg}"><mxGeometry relative="1" as="geometry" /></mxCell>')

LANES = ["หัวหน้างานบุคคล", "เจ้าหน้าที่งานบุคคล", "ผู้ดูแลระบบ", "ครู / ครูประจำชั้น", "ทีม A<br>(นอกขอบเขตทีม B)", "ระบบ<br>(ข้อมูลชุดเดียว)"]
X0, HW, LH, TOP = 20, 260, 190, 110
BW, BH, PITCH, CX0 = 300, 170, 360, 400
NC = 8
colx = lambda k: CX0 + PITCH * (k - 1)
BODY_W = colx(NC) + BW + 120 - (X0 + HW)
LY = [TOP + LH * i for i in range(len(LANES))]
for i, name in enumerate(LANES):
    sysl, other = i == 5, i == 4
    hs = "fillColor=#b9e0a5;strokeColor=#82b366;" if sysl else ("fillColor=#eeeeee;strokeColor=#999999;fontColor=#777777;" if other else "fillColor=#f5f5f5;strokeColor=#999999;")
    bs = "fillColor=#d5e8d4;strokeColor=#82b366;" if sysl else ("fillColor=#fafafa;strokeColor=#999999;dashed=1;" if other else "fillColor=#ffffff;strokeColor=#999999;")
    v(f"ln{i}-h", f"<b>{name}</b>", X0, LY[i], HW, LH, "rounded=0;" + F + hs)
    v(f"ln{i}-b", "", X0 + HW, LY[i], BODY_W, LH, "rounded=0;html=1;" + bs)
# phase header
PH = "rounded=0;fillColor=#1f3a5f;strokeColor=#1f3a5f;fontColor=#ffffff;fontStyle=1;" + F
phases = [(1, 1, "ก่อนเริ่ม"), (2, 2, "เข้ามาทำงาน"), (3, 3, "จัดเข้ากลุ่มสาระ"), (4, 6, "เริ่มใช้ระบบ"), (7, 7, "ระหว่างทำงาน"), (8, 8, "ออก")]
for a, z, name in phases:
    x1, x2 = colx(a) - 30, colx(z) + BW + 30
    v(f"ph{a}", name, x1, 30, x2 - x1, 60, PH)
STEP = "rounded=1;spacing=12;fillColor=#ffffff;strokeColor=#000000;" + F
REF = '<br><font style="font-size:24px" color="#666666">{}</font>'
steps = [
    (1, 0, "ตั้งค่าประเภทบุคลากร ตำแหน่ง แผนก/กลุ่มสาระ", "UC-SET-02"),
    (2, 1, "เพิ่มข้อมูลบุคลากร 3 ขั้น (พื้นฐาน · การศึกษา · ตำแหน่ง)", "UC-STF-02"),
    (3, 1, "<b>ระบุแผนก/กลุ่มสาระ</b> ตำแหน่ง ประเภท และวันเริ่มงาน", "UC-STF-02 · JobDetails"),
    (4, 0, "ออกบัญชีผู้ใช้ และกำหนดสิทธิ์ตามบทบาท", "UC-SET-02"),
    (5, 2, "ถ้าเป็นครูประจำชั้น: เลือกเป็นครูประจำชั้นของห้อง", "UC-SET-01"),
    (6, 3, "เข้าระบบ เห็นเมนูตามบทบาท · ครูประจำชั้นแก้ข้อมูลนักเรียนห้องตน", "UC-REG-03"),
    (7, 1, "แก้ข้อมูล อบรม ใบอนุญาต ย้ายกลุ่มสาระ · พิมพ์แฟ้มประวัติ", "UC-STF-02 · 03"),
    (8, 1, "ลาออก ย้าย หรือเกษียณ: แก้สถานะเป็น \"ออกแล้ว\" ข้อมูลเดิมยังเก็บไว้", "UC-STF-02 · workStatus"),
]
for k, lane, txt, ref in steps:
    v(f"s{k}", txt + REF.format(ref), colx(k), LY[lane] + (LH - BH) // 2, BW, BH, STEP)
v("ta", "ใช้ข้อมูลกลุ่มสาระไปจัดครูเข้าสอน", colx(7), LY[4] + (LH - BH) // 2, BW, BH,
  "rounded=1;spacing=12;fillColor=#f5f5f5;strokeColor=#999999;dashed=1;fontColor=#777777;" + F)
v("start", "", 310, LY[0] + LH // 2 - 25, 50, 50, "ellipse;fillColor=#000000;strokeColor=#000000;html=1;")
v("end", "", colx(8) + BW + 50, LY[1] + LH // 2 - 25, 50, 50, "ellipse;shape=doubleEllipse;fillColor=#000000;strokeColor=#000000;html=1;")
FLOW = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=block;endFill=1;strokeColor=#000000;strokeWidth=2;fontFamily=TH SarabunPSK;fontSize=24;labelBackgroundColor=#ffffff;"
H = "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
seq = ["start"] + [f"s{k}" for k in range(1, 9)] + ["end"]
for i in range(len(seq) - 1):
    lab = "บรรจุหรือจ้างบุคลากรใหม่" if seq[i] == "s1" else ""
    e(f"f{i}", seq[i], seq[i + 1], FLOW + H, lab)
DB = "shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=12;fillColor=#ffffff;strokeColor=#82b366;" + F
DY, DHH = LY[5] + 25, 140
v("d-set", "ข้อมูลตั้งค่า (ประเภท ตำแหน่ง แผนก/กลุ่มสาระ)", colx(1), DY, BW, DHH, DB)
sx, sw = colx(2), colx(8) + BW - colx(2)
v("d-staff", "ข้อมูลบุคลากร: ประวัติ · ตำแหน่ง · กลุ่มสาระ · สถานะทำงาน · บัญชีผู้ใช้ · ครูประจำชั้น", sx, DY, sw, DHH, DB)
DATA = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;dashed=1;endArrow=open;endSize=12;strokeColor=#2d7600;strokeWidth=2;"
DOWN = "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryY=0;entryDx=0;entryDy=0;"
UP = "exitY=0;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;"
rel = lambda k: round((colx(k) + BW / 2 - sx) / sw, 4)
e("w1", "s1", "d-set", DATA + DOWN + "entryX=0.5;")
e("rs", "d-set", "d-staff", DATA + "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;")
for k in (2, 3, 4, 5, 8):
    e(f"w{k}", f"s{k}", "d-staff", DATA + DOWN + f"entryX={rel(k)};")
e("r6", "d-staff", "s6", DATA + UP + f"exitX={rel(6)};")
e("ra", "d-staff", "ta", DATA.replace("#2d7600", "#999999") + UP + f"exitX={rel(7)};")
TY = LY[5] + LH + 30
TXT = "text;align=left;verticalAlign=top;" + F
W = X0 + HW + BODY_W
v("legend", "เส้นทึบ = ลำดับเหตุการณ์ · เส้นประสีเขียว = บันทึกลง/อ่านจากข้อมูลชุดเดียว · กล่องเทาเส้นประ = งานของทีมอื่น", X0, TY, W, 45, TXT)
v("src", "ที่มา: เล่ม B 4.4.2 (เพิ่มบุคลากร 3 ขั้น) · 4.5.1 (แท็บครูประจำชั้น) · 4.5.2 (ตั้งค่างานบุคลากร) · Data Dictionary ตาราง JobDetails (departmentID, startDate, workStatus) และ User · 1.3.1 (ขอบเขตทีม A)", X0, TY + 50, W, 90, TXT)
PW, PHH = W + 40, TY + 160
diagram = (f'  <diagram id="lifecycle" name="{TAB}">\n'
           f'    <mxGraphModel dx="2438" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{PW}" pageHeight="{PHH}" math="0" shadow="0">\n'
           '      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        '
           + "\n        ".join(cells) + '\n      </root>\n    </mxGraphModel>\n  </diagram>\n')
j = d.rindex("</mxfile>")
open(F2, "w", encoding="utf-8", newline="").write(d[:j] + diagram + d[j:])
print("(2) ok", len(cells))
