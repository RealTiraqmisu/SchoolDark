"""plan 258: ขยายระยะห่างกล่องในแท็บ 'เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง' โดยแปลงพิกัดในที่เดิม (ไม่สร้างใหม่)
รันได้ครั้งเดียว: เช็กว่าเลน u4o ยังกว้างเท่าเดิม (2490) ก่อนแปลง"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
SRC = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-15-user-journey-old-vs-new.drawio"
TAB = "เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง"
OLD_P, NEW_P, X0 = 310, 400, 30
ROW2_OLD, DY = 270, 60

t = open(SRC, encoding="utf-8").read()
m = re.search(r'<diagram[^>]*name="' + re.escape(TAB) + r'".*?</diagram>', t, re.S)
b = m.group(0)

def geo(cid, blk):
    return re.search(r'(<mxCell id="' + re.escape(cid) + r'"[^>]*>\s*<mxGeometry )([^>]*)(>)', blk)

def attrs(s):
    return dict(re.findall(r'(\w+)="([^"]*)"', s))

def set_attrs(blk, cid, **kw):
    g = geo(cid, blk)
    a = g.group(2)
    for k, val in kw.items():
        a = re.sub(r'\b' + k + r'="[^"]*"', f'{k}="{val}"', a)
    return blk[:g.start(2)] + a + blk[g.end(2):]

lane_o = attrs(geo("u4o", b).group(2))
assert lane_o["width"] == "2490", "already transformed? lane width " + lane_o["width"]

# children of lanes
for cid, parent in re.findall(r'<mxCell id="([^"]+)"[^>]*parent="(u4o|u4n)"[^>]*vertex="1"', b) + \
                   re.findall(r'<mxCell id="([^"]+)"[^>]*vertex="1"[^>]*parent="(u4o|u4n)"', b):
    a = attrs(geo(cid, b).group(2))
    x, y = float(a["x"]), float(a["y"])
    nx = round(X0 + (x - X0) * NEW_P / OLD_P)
    ny = y + DY if (parent == "u4o" and y == ROW2_OLD) else y
    b = set_attrs(b, cid, x=nx, y=int(ny))

# lanes
last_col_right = X0 + 7 * NEW_P + 260
lw = last_col_right + 30
b = set_attrs(b, "u4o", width=lw, height=int(lane_o["height"]) + DY)
ln = attrs(geo("u4n", b).group(2))
b = set_attrs(b, "u4n", width=lw, y=int(ln["y"]) + DY)
# badges
bx = 20 + lw + 40
b = set_attrs(b, "u4o-badge", x=bx)
nb = attrs(geo("u4n-badge", b).group(2))
b = set_attrs(b, "u4n-badge", x=bx, y=int(nb["y"]) + DY)
# footer
for cid in ("u4-note", "u4-src"):
    a = attrs(geo(cid, b).group(2))
    b = set_attrs(b, cid, y=int(a["y"]) + DY, width=bx + 300)
# page
pw = bx + 340
ph = int(attrs(geo("u4-src", b).group(2))["y"]) + 70
b = re.sub(r'pageWidth="\d+"', f'pageWidth="{pw}"', b, count=1)
b = re.sub(r'pageHeight="\d+"', f'pageHeight="{ph}"', b, count=1)

open(SRC, "w", encoding="utf-8", newline="").write(t[:m.start()] + b + t[m.end():])
print("ok", lw, pw, ph)
