"""plan 257: แท็บ 10.1 เติมกิ่ง 'เจ้าหน้าที่ฝ่ายอื่น' + ขยายแถบบุคลากร (แตะเฉพาะ cell ของ plan 256/257)"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
SRC = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-11-thai-school-staff-structure.drawio"
NAME = "10.1 org chart · ทีม B"
t = open(SRC, encoding="utf-8").read()
m = re.search(r'<diagram[^>]*name="' + re.escape(NAME) + r'".*?</diagram>', t, re.S)
b = m.group(0)
assert "p10b-oth" not in b

def style_of(cid):
    return re.search(r'<mxCell id="' + cid + r'"[^>]*style="([^"]*)"', b).group(1)

vph = style_of("p10b-vph")
regs = style_of("p10b-regs")
e_vph = style_of("p10b-e-dir-vph")
gen = re.sub(r"entryX=[0-9.]+;", "", style_of("p10b-e-gen-regs"))
tree = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeColor=#666666;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"

new = [
    f'<mxCell id="p10b-vpo" value="รองผู้อำนวยการ&lt;br&gt;ฝ่ายบริหารงบประมาณ · ฝ่ายบริหารทั่วไป" style="{vph}" vertex="1" parent="1"><mxGeometry x="1290" y="178" width="290" height="106" as="geometry" /></mxCell>',
    f'<mxCell id="p10b-e-dir-vpo" style="{e_vph}" edge="1" parent="1" source="p10b-dir" target="p10b-vpo"><mxGeometry relative="1" as="geometry" /></mxCell>',
    f'<mxCell id="p10b-oth" value="&lt;b&gt;เจ้าหน้าที่ฝ่ายอื่น&lt;/b&gt;&lt;br&gt;การเงิน พัสดุ ธุรการ ฯลฯ&lt;br&gt;สิทธิ์เฉพาะของบุคลากร" style="{regs}" vertex="1" parent="1"><mxGeometry x="1290" y="520" width="290" height="144" as="geometry" /></mxCell>',
    f'<mxCell id="p10b-e-vpo-oth" style="{tree}" edge="1" parent="1" source="p10b-vpo" target="p10b-oth"><mxGeometry relative="1" as="geometry" /></mxCell>',
    f'<mxCell id="p10b-e-gen-oth" style="{gen}entryX=0.9058;" edge="1" parent="1" source="p10b-oth" target="p10b-staff"><mxGeometry relative="1" as="geometry" /></mxCell>',
]
nb = b
# widen bar
nb, n = re.subn(r'(<mxCell id="p10b-staff"[^>]*><mxGeometry x="40" y="720" width=")1196(")', r"\g<1>1540\g<2>", nb)
assert n == 1
for cid, ex in [("regs", "0.0766"), ("tch", "0.2844"), ("hrs", "0.4922")]:
    nb, n = re.subn(r'(<mxCell id="p10b-e-gen-' + cid + r'" style="[^"]*entryX=)[0-9.]+;', r"\g<1>" + ex + ";", nb)
    assert n == 1, cid
i = nb.rindex("</root>")
nb = nb[:i] + "\n".join(new) + "\n" + nb[i:]
open(SRC, "w", encoding="utf-8", newline="").write(t[:m.start()] + nb + t[m.end():])
print("ok")
