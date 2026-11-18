"""plan 263: จัดแท็บ "ภาพรวมกลุ่มตาราง" (dbsa1) ใหม่เป็น 16:9 — ย้ายตำแหน่งอย่างเดียว ข้อความไม่เปลี่ยน
แถวบน g1 g2 g3 · แถวล่าง g5 (ซ้าย) g4 (ใต้ g3) · รันซ้ำได้ (ตั้งค่าตำแหน่งแบบกำหนดตายตัว)"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-17-db-subject-areas.drawio"
t = open(F, encoding="utf-8").read()
m = re.search(r'<diagram id="dbsa1".*?</diagram>', t, re.S)
b = m.group(0)

POS = {}
def put(i, x, y, w, h):
    POS[i] = (x, y, w, h)

TOP, BOT = 140, 760
def topgroup(g, x, y, ntb, m_y):
    put(g, x, y, 560, 400)
    put(g + "-t", x + 10, y + 10, 540, 80)
    put(g + "-n", x + 10, y + 88, 540, 30)
    for k in range(ntb):
        put(f"{g}-tb{k}", x + 40, y + 128 + 58 * k, 480, 48)
    put(g + "-m", x + 10, y + m_y, 540, 30)

topgroup("g1", 40, TOP, 3, 306)
topgroup("g2", 900, TOP, 4, 364)
topgroup("g3", 1760, TOP, 3, 306)
topgroup("g4", 1760, BOT, 4, 364)

G5X, G5W, G5H = 40, 1600, 400
put("g5", G5X, BOT, G5W, G5H)
put("g5-t", G5X + 10, BOT + 10, G5W - 20, 50)
put("g5-n", G5X + 10, BOT + 60, G5W - 20, 30)
cw = (G5W - 60 - 2 * 30) // 3
for k in range(6):
    r, c = divmod(k, 3)
    put(f"g5-tb{k}", G5X + 30 + c * (cw + 30), BOT + 120 + r * 100, cw, 80)
put("g5-m", G5X + 10, BOT + 330, G5W - 20, 30)

W = 2280
put("title", 40, 30, W, 70)
put("note1", 40, 1180, W, 40)
put("note2", 40, 1220, W, 40)

def ee(ex, ey, nx, ny):
    return dict(exitX=ex, exitY=ey, entryX=nx, entryY=ny)
EDGES = {
    "r1": ee(0, 0.5, 1, 0.5),
    "r2": ee(1, 0.5, 0, 0.5),
    "r3": ee(0.25, 1, 0.25, 0),
    "r4": ee(0.75, 0, 0.75, 1),
    "r5": ee(0.5, 1, round((320 - G5X) / G5W, 4), 0),
    "r6": ee(0.5, 1, round((1180 - G5X) / G5W, 4), 0),
    "r7": ee(0, 0.9, round((1580 - G5X) / G5W, 4), 0),
}

def fmt(v):
    return str(int(v)) if float(v).is_integer() else str(v)

seen = set()
def fix(cm):
    cell = cm.group(0)
    cid = re.match(r'<mxCell id="([^"]+)"', cell).group(1)
    if cid in POS:
        x, y, w, h = POS[cid]
        g = re.search(r"<mxGeometry\b[^>]*>", cell).group(0)
        ng = g
        for k, v in (("x", x), ("y", y), ("width", w), ("height", h)):
            ng = re.sub(r'\b' + k + r'="[^"]*"', f'{k}="{fmt(v)}"', ng, count=1)
        cell = cell.replace(g, ng, 1); seen.add(cid)
    if cid in EDGES:
        for k, v in EDGES[cid].items():
            cell, n = re.subn(r'\b' + k + r'=[^;"]*', f"{k}={fmt(v)}", cell, count=1)
            assert n == 1, (cid, k)
        seen.add(cid)
    return cell

nb = re.sub(r"<mxCell\b(?:[^>]*/>|[^>]*>.*?</mxCell>)", fix, b, flags=re.S)
missing = (set(POS) | set(EDGES)) - seen
assert not missing, missing
nb = re.sub(r'pageWidth="\d+"', 'pageWidth="2360"', nb, count=1)
nb = re.sub(r'pageHeight="\d+"', 'pageHeight="1328"', nb, count=1)
t = t[:m.start()] + nb + t[m.end():]
open(F, "w", encoding="utf-8", newline="").write(t)
print("ok", len(seen), "cells")
