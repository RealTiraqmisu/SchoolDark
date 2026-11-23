"""plan 272 รอบ 3: คัดลอกแท็บ '(ชิดกัน)' (uj5) เป็นแท็บใหม่ '(กล่องสูง)' (uj7)
คงเลนเดิม/ใหม่ขนานกัน คอลัมน์ตรงกัน · กล่องแคบลงแต่สูงขึ้น · ฟอนต์ 30 -> 40 · ไม่แตะแท็บเดิม
รันซ้ำไม่ได้ (assert) · สร้างใหม่ให้รันกับ backup-2026-11-17/2026-11-15-user-journey-old-vs-new.before-272c.drawio"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-15-user-journey-old-vs-new.drawio"
SRC = "เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง (ชิดกัน)"
NEW = "เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง (กล่องสูง)"
BW, BH, GAP, RGAP = 190, 280, 40, 70   # กล่องกว้าง สูง ช่องว่างแนวนอน ช่องว่างระหว่างแถว
FS = 40
d = open(F, encoding="utf-8").read()
assert f'name="{NEW}"' not in d
i = d.index('<diagram id="uj5"'); j = d.index("</diagram>", i) + len("</diagram>")
t = d[i:j]
t = t.replace(f'<diagram id="uj5" name="{SRC}"', f'<diagram id="uj7" name="{NEW}"')
t = t.replace('"u5', '"u7')
t = t.replace("fontSize=30;", f"fontSize={FS};")

def setgeo(cid, **kw):
    global t
    m = re.search(r'(<mxCell id="' + re.escape(cid) + r'".*?<mxGeometry )([^>]*)(/?>)', t, re.S)
    assert m, cid
    g = m.group(2)
    for k, v in kw.items():
        g = re.sub(r'\b' + k + r'="[^"]*"', f'{k}="{v}"', g)
    t = t[:m.start(2)] + g + t[m.end(2):]

P = BW + GAP
cx = lambda k: 30 + P * k
ry = lambda r: 80 + (BH + RGAP) * r
CELLS = {"u7o-s": (0, 0), "u7o-o1": (1, 0), "u7o-back": (2, 0), "u7o-o2": (3, 0), "u7o-o3": (4, 0),
         "u7o-f1": (5, 0), "u7o-x1": (6, 0), "u7o-f2": (5, 1), "u7o-x2": (6, 1), "u7o-xl": (7, 1),
         "u7o-end": (8, 1),
         "u7n-s": (0, 0), "u7n-o1": (1, 0), "u7n-f": (5, 0), "u7n-x": (6, 0), "u7n-end": (8, 0)}
for cid, (c, r) in CELLS.items():
    setgeo(cid, x=cx(c), y=ry(r), width=BW, height=BH)

LANE_W = cx(8) + BW + 30
OLD_H = ry(1) + BH + 30
NEW_H = ry(0) + BH + 30
setgeo("u7o", x=20, y=20, width=LANE_W, height=OLD_H)
NY = 20 + OLD_H + 40
setgeo("u7n", x=20, y=NY, width=LANE_W, height=NEW_H)
BX = 20 + LANE_W + 40
BADGE_W = 260
setgeo("u7o-badge", x=BX, y=20 + 50 + 30, width=BADGE_W, height=OLD_H - 110)
setgeo("u7n-badge", x=BX, y=NY + 50 + 30, width=BADGE_W, height=NEW_H - 110)
W = BX + BADGE_W - 20
NOTE_Y = NY + NEW_H + 30
setgeo("u7-note", y=NOTE_Y, width=W, height=60)
setgeo("u7-src", y=NOTE_Y + 60, width=W, height=60)
t = re.sub(r'pageWidth="\d+"', f'pageWidth="{BX + BADGE_W + 40}"', t, count=1)
t = re.sub(r'pageHeight="\d+"', f'pageHeight="{NOTE_Y + 130}"', t, count=1)

# ตัดบรรทัดเองให้เข้ากับกล่องแคบ (คำเดิมทุกคำ แค่ย้ายจุดขึ้นบรรทัด)
B = lambda x: "&lt;b&gt;" + x + "&lt;/b&gt;"
BR = "&lt;br&gt;"
VALUES = {
    "u7o-s": BR.join(["เริ่ม:", "ส่งออก", "รายชื่อนักเรียน", "ไปแข่ง"]),
    "u7n-s": BR.join(["เริ่ม:", "ส่งออก", "รายชื่อนักเรียน", "ไปแข่ง"]),
    "u7o-f1": BR.join([B("เลือกนักเรียน"), "กรองตามห้อง", "ของคนที่ 1", "(เลือกรายคน", "ไม่ได้)"]),
    "u7o-f2": BR.join([B("เลือกนักเรียน"), "ล้างตัวกรอง", "แล้วกรองห้อง", "ของคนที่ 2"]),
    "u7o-xl": BR.join([B("คัดรายชื่อ" + BR + "ใน Excel"), "เปิด 2 ไฟล์", "ดึงเฉพาะ", "คนที่ต้องการเอง"]),
    "u7n-end": BR.join(["จบ: ได้รายชื่อ", "ตรงตาม", "ต้องการ", "ไม่ต้องเปิด", "Excel"]),
}
for cid, val in VALUES.items():
    m = re.search(r'(<mxCell id="' + re.escape(cid) + r'"[^>]*?value=")([^"]*)(")', t, re.S)
    assert m, cid
    t = t[:m.start(2)] + val + t[m.end(2):]

d = d[:j] + "\n  " + t + d[j:]
open(F, "w", encoding="utf-8", newline="").write(d)
print("ok page", BX + BADGE_W + 40, "x", NOTE_Y + 130)
