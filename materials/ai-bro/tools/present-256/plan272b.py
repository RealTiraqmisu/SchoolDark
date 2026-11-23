"""plan 272 รอบ 2: คัดลอกแท็บ '(ชิดกัน)' (uj5) เป็นแท็บใหม่ '(16:9)' (uj6) จัดแบบงูเลื้อย 5 คอลัมน์ · ไม่แตะแท็บเดิม
รันซ้ำไม่ได้ (assert) · ถ้าจะสร้างใหม่ให้รันกับไฟล์สำรอง backup-2026-11-17/2026-11-15-user-journey-old-vs-new.before-272b.drawio"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-15-user-journey-old-vs-new.drawio"
SRC = "เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง (ชิดกัน)"
NEW = "เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง (16:9)"
d = open(F, encoding="utf-8").read()
assert f'name="{NEW}"' not in d
i = d.index('<diagram id="uj5"'); j = d.index("</diagram>", i) + len("</diagram>")
t = d[i:j]
t = t.replace(f'<diagram id="uj5" name="{SRC}"', f'<diagram id="uj6" name="{NEW}"')
t = t.replace('"u5', '"u6')

def setgeo(cid, **kw):
    global t
    m = re.search(r'(<mxCell id="' + re.escape(cid) + r'".*?<mxGeometry )([^>]*)(/?>)', t, re.S)
    assert m, cid
    g = m.group(2)
    for k, v in kw.items():
        g = re.sub(r'\b' + k + r'="[^"]*"', f'{k}="{v}"', g)
    t = t[:m.start(2)] + g + t[m.end(2):]

def edge(cid, extra):
    global t
    m = re.search(r'(<mxCell id="' + re.escape(cid) + r'"[^>]*?style=")([^"]*)(")', t, re.S)
    assert m, cid
    s = re.sub(r'(exit|entry)(X|Y|Dx|Dy)=[^;]*;', '', m.group(2)) + extra
    t = t[:m.start(2)] + s + t[m.end(2):]

P = 320
cx = lambda k: 30 + P * k
ry = lambda r: 80 + 200 * r
OLD = {"u6o-s": (0, 0), "u6o-o1": (1, 0), "u6o-back": (2, 0), "u6o-o2": (3, 0), "u6o-o3": (4, 0),
       "u6o-f1": (4, 1), "u6o-x1": (3, 1), "u6o-f2": (2, 1), "u6o-x2": (1, 1), "u6o-xl": (0, 1),
       "u6o-end": (0, 2)}
for cid, (c, r) in OLD.items():
    setgeo(cid, x=cx(c), y=ry(r))
NEWL = {"u6n-s": 0, "u6n-o1": 1, "u6n-f": 2, "u6n-x": 3, "u6n-end": 4}
for cid, c in NEWL.items():
    setgeo(cid, x=cx(c), y=ry(0))

L2R = "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
R2L = "exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;"
DOWN = "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
for e in ["u6o-e0", "u6o-e1", "u6o-e1b", "u6o-e2"]:
    edge(e, L2R)
edge("u6o-e3", DOWN)
for e in ["u6o-e4", "u6o-e5", "u6o-e6", "u6o-e7"]:
    edge(e, R2L)
edge("u6o-e8", DOWN)
for e in ["u6n-e0", "u6n-e1", "u6n-e2", "u6n-e3"]:
    edge(e, L2R)

LANE_W = cx(4) + 260 + 30          # 1600
OLD_H = ry(2) + 130 + 30           # 640
setgeo("u6o", x=20, y=20, width=LANE_W, height=OLD_H)
NY = 20 + OLD_H + 40
setgeo("u6n", x=20, y=NY, width=LANE_W, height=250)
BX = 20 + LANE_W + 40
setgeo("u6o-badge", x=BX, y=20 + (OLD_H - 240) // 2)
setgeo("u6n-badge", x=BX, y=NY + 25)
W = BX + 300 - 20
NOTE_Y = NY + 250 + 30
setgeo("u6-note", y=NOTE_Y, width=W)
setgeo("u6-src", y=NOTE_Y + 50, width=W)
t = re.sub(r'pageWidth="\d+"', f'pageWidth="{BX + 300 + 40}"', t, count=1)
t = re.sub(r'pageHeight="\d+"', f'pageHeight="{NOTE_Y + 110}"', t, count=1)

d = d[:j] + "\n  " + t + d[j:]
open(F, "w", encoding="utf-8", newline="").write(d)
print("ok", BX + 340, NOTE_Y + 110)
