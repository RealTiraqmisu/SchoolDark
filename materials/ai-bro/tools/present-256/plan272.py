"""plan 272: คัดลอกแท็บ 'เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง' เป็นแท็บใหม่ ชิดกล่อง (ช่องว่าง 60) + กล่องกลับหน้าหลักระบบทะเบียน · ป้าย 9 ขั้น
รันซ้ำไม่ได้ (assert) · ถ้าจะสร้างใหม่ให้รันกับไฟล์สำรอง backup-2026-11-17/2026-11-15-user-journey-old-vs-new.before-272.drawio"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-15-user-journey-old-vs-new.drawio"
NEW = "เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง (ชิดกัน)"
d = open(F, encoding="utf-8").read()
assert f'name="{NEW}"' not in d
i = d.index('<diagram id="uj4"'); j = d.index("</diagram>", i) + len("</diagram>")
t = d[i:j]
t = t.replace('<diagram id="uj4" name="เดิม vs ใหม่ · ส่งออกรายชื่อไปแข่ง"', f'<diagram id="uj5" name="{NEW}"')
t = t.replace('"u4', '"u5')

def setgeo(cid, x=None, y=None, w=None):
    global t
    m = re.search(r'(<mxCell id="' + re.escape(cid) + r'".*?<mxGeometry )([^>]*)(/?>)', t, re.S)
    assert m, cid
    g = m.group(2)
    for k, v in (("x", x), ("y", y), ("width", w)):
        if v is not None:
            g = re.sub(r'\b' + k + r'="[^"]*"', f'{k}="{v}"', g)
    t = t[:m.start(2)] + g + t[m.end(2):]

P = 320  # 260 กล่อง + 60 ช่องว่าง
col = lambda k: 30 + P * k
for cid, k in [("u5o-s", 0), ("u5o-o1", 1), ("u5o-o2", 3), ("u5o-o3", 4), ("u5o-f1", 5), ("u5o-x1", 6),
               ("u5o-f2", 5), ("u5o-x2", 6), ("u5o-xl", 7), ("u5o-end", 8),
               ("u5n-s", 0), ("u5n-o1", 1), ("u5n-f", 5), ("u5n-x", 6), ("u5n-end", 8)]:
    setgeo(cid, x=col(k))
LANE_W = col(8) + 260 + 30
setgeo("u5o", w=LANE_W); setgeo("u5n", w=LANE_W)
BX = 20 + LANE_W + 40
setgeo("u5o-badge", x=BX); setgeo("u5n-badge", x=BX)
setgeo("u5-note", w=BX + 300 - 20); setgeo("u5-src", w=BX + 300 - 20)
t = re.sub(r'pageWidth="\d+"', f'pageWidth="{BX + 300 + 40}"', t, count=1)
t = t.replace('value="8 ขั้น&lt;br&gt;เปิด 3 หน้าจอ', 'value="9 ขั้น&lt;br&gt;เปิด 3 หน้าจอ')
assert "9 ขั้น" in t

# กล่องกลับหน้าหลัก + เส้น
o1 = re.search(r'<mxCell id="u5o-o1".*?</mxCell>', t, re.S).group(0)
back = (o1.replace('id="u5o-o1"', 'id="u5o-back"')
          .replace(re.search(r'value="[^"]*"', o1).group(0), 'value="&lt;b&gt;กลับหน้าหลัก&lt;/b&gt;&lt;br&gt;ระบบทะเบียน"')
          .replace(f'x="{col(1)}"', f'x="{col(2)}"'))
t = t.replace(o1, o1 + "\n        " + back)
e1 = re.search(r'<mxCell id="u5o-e1".*?</mxCell>', t, re.S).group(0)
e1a = e1.replace('target="u5o-o2"', 'target="u5o-back"')
e1b = e1.replace('id="u5o-e1"', 'id="u5o-e1b"').replace('source="u5o-o1"', 'source="u5o-back"')
t = t.replace(e1, e1a + "\n        " + e1b)

d = d[:j] + "\n  " + t + d[j:]
open(F, "w", encoding="utf-8", newline="").write(d)
print("ok lane", LANE_W, "badge x", BX)
