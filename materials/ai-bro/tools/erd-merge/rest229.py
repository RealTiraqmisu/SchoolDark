import re, sys
sys.stdout.reconfigure(encoding="utf-8")
F = sys.argv[1]
DRY = len(sys.argv) > 2 and sys.argv[2] == "dry"
s = open(F, encoding="utf-8", newline="").read()
m = re.search(r'(<diagram [^>]*id="pg-master-v3"[^>]*>)(.*?)(</diagram>)', s, re.S)
head, p0, tail = m.group(1), m.group(2), m.group(3)
p = p0

JOBS = [
    dict(key="Semesters", title="Semesters", label="+ isCurrent", rows=[
        ("", "isCurrent", "ภาคปัจจุบัน (มีได้ภาคเดียว)", None)]),
    dict(key="school_room", title="SchoolRoom", label="", force=(-280, 1260, "ซ้าย"), note=" · ตารางจริงเพิ่ม 5 คอลัมน์", rows=[
        ("UK", "roomCode", "รหัสห้อง ห้ามซ้ำ", "#7c3aed"),
        ("", "shortName", "ชื่อย่อ", None),
        ("", "roomType", "ประเภทห้อง (รอ B5)", None),
        ("", "maxClasses", "จำนวนห้องเรียนสูงสุด ⚠️", None),
        ("", "isActive", "ยังใช้งานอยู่", None)]),
]

def sub1(pat, rep, txt):
    t, n = re.subn(pat, rep, txt, count=1, flags=re.S)
    assert n == 1, pat
    return t
def geo(c):
    g = re.search(r'<mxGeometry ([^>]*)', c)
    a = dict(re.findall(r'(\w+)="([^"]*)"', g.group(1))) if g else {}
    return [float(a.get(k, 0)) for k in ("x", "y", "width", "height")]
def tops(txt, skip):
    out = []
    for c in re.finditer(r'<mxCell id="([^"]*)"[^>]*parent="1"[^>]*vertex="1"[^>]*>.*?</mxCell>', txt, re.S):
        if c.group(1) in skip: continue
        x, y, w, h = geo(c.group(0))
        if w and h: out.append((c.group(1), x, y, w, h))
    return out
def hits(T, x, y, w, h, pad=20):
    return [t[0] for t in T if not (x + w + pad <= t[1] or t[1] + t[3] + pad <= x or y + h + pad <= t[2] or t[2] + t[4] + pad <= y)]
esc = lambda v: v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

EST = ("edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;dashed=1;strokeColor=#999999;fontColor=#777777;fontSize=10;"
       "endArrow=open;endFill=0;startArrow=none;labelBackgroundColor=#ffffff;")
SIDE = {"ขวา": "exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;",
        "ซ้าย": "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;",
        "ล่าง": "exitX=0.5;exitY=0;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;",
        "บน": "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"}

for J in JOBS:
    P = "v3-tb-pg-master-" + J["key"]
    OLD = "v3-old-" + J["key"]
    blocks = list(re.finditer(r'[ \t]*<mxCell id="(%s(?:-[^"]*)?)"[^>]*?(?:/>|>.*?</mxCell>)\n?' % re.escape(P), p, re.S))
    orig = "".join(b.group(0) for b in blocks)
    gx, gy, gw, gh = geo(blocks[0].group(0))
    k = len(J["rows"])
    T = tops(p, {P + "-grp"})
    # real table grows
    print(J["title"], "ขยายแล้วทับ:", hits(T, gx, gy, gw, gh + 20 * k))
    pos = None
    for x, y, side in [(gx + gw + 180, gy, "ขวา"), (gx - 180 - gw, gy, "ซ้าย"), (gx, gy + gh + 20 * k + 120, "ล่าง"), (gx, gy - gh - 120, "บน")]:
        h = hits(T, x, y, gw, gh)
        print("  ", side, x, y, "ทับ:", h)
        if not h and pos is None: pos = (x, y, side)
    if J.get("force"): pos = J["force"]
    print("  วางที่:", pos)
    if DRY or pos is None:
        continue

    # ---- old copy
    old = orig.replace(P, OLD)
    old = old.replace('value="%s"' % J["title"], 'value="(เดิม) %s"' % J["title"])
    old = sub1(r'(<mxCell id="%s" [^>]*?)fillColor=#ffe6cc;strokeColor=#d79b00;' % OLD,
               r'\1fillColor=#ffe6cc;strokeColor=#d79b00;dashed=1;fontColor=#777777;', old)
    old = re.sub(r'(<mxCell id="%s-r\d+c\d" [^>]*?)fillColor=#d5e8d4;' % OLD, r'\1fillColor=none;', old)
    old = re.sub(r'(<mxCell id="%s-r\d+c\d" [^>]*?)strokeColor=#[0-9a-f]{6};' % OLD, r'\1strokeColor=#cccccc;fontColor=#888888;', old)
    old = old.replace("fontColor=#444444;", "")
    old = sub1(r'(<mxCell id="%s-desc" [^>]*?)fillColor=#[0-9a-f]{6};' % OLD, r'\1fillColor=#f5f5f5;', old)
    old = sub1(r'(<mxCell id="%s-desc" [^>]*?value=")[^"]*"' % OLD, r'\1ฉบับเดิมก่อนตกลงกับทีม A (2026-11-11) · เก็บไว้ดูเทียบ ไม่มีเส้นอื่นต่อ' + J.get("note", "") + '"', old)
    old = sub1(r'(<mxCell id="%s-grp".*?<mxGeometry [^>]*?)x="%g" y="%g"' % (OLD, gx, gy), r'\1x="%d" y="%d"' % (pos[0], pos[1]), old)

    # ---- real table: black header, white rows
    q = p
    q = sub1(r'(<mxCell id="%s" [^>]*?)fillColor=#ffe6cc;strokeColor=#d79b00;' % P,
             r'\1fillColor=#1a1a1a;strokeColor=#000000;fontColor=#ffffff;', q)
    q = sub1(r'(<mxCell id="%s-desc" [^>]*?)fillColor=#[0-9a-f]{6};' % P, r'\1fillColor=#e6e6e6;', q)
    q = re.sub(r'(<mxCell id="%s-r\d+c\d" [^>]*?)fillColor=none;' % P, r'\1fillColor=#ffffff;', q)
    q = re.sub(r'(<mxCell id="%s-r\d+c\d" [^>]*?)strokeColor=#(?:e6d9a8|b6c9e8);' % P, r'\1strokeColor=#999999;', q)

    # ---- new rows (template = last row)
    nrow = len(re.findall(r'<mxCell id="%s-r\d+" ' % P, q))
    last = re.search(r'[ \t]*<mxCell id="%s-r%d" .*?(?=[ \t]*<mxCell id="(?!%s-r%dc))' % (P, nrow - 1, P, nrow - 1), q, re.S).group(0)
    ry = 30 + 20 * nrow
    new = ""
    for j, (lab, name, desc, col) in enumerate(J["rows"]):
        r = nrow + j
        b = last.replace("%s-r%d" % (P, nrow - 1), "%s-r%d" % (P, r))
        b = re.sub(r'(<mxCell id="%s-r%d" .*?<mxGeometry [^>]*?)y="\d+"' % (P, r), r'\1y="%d"' % (ry + 20 * j), b, count=1, flags=re.S)
        for c, v in (("c0", lab), ("c1", name), ("c2", desc)):
            b = re.sub(r'(<mxCell id="%s-r%d%s" [^>]*?value=")[^"]*"' % (P, r, c), r'\g<1>%s"' % esc(v), b, count=1)
            b = re.sub(r'(<mxCell id="%s-r%d%s" [^>]*?)fillColor=[^;]*;' % (P, r, c), r'\1fillColor=#d5e8d4;', b, count=1)
        if col:
            b = re.sub(r'(<mxCell id="%s-r%dc0" [^>]*?style=")' % (P, r), r'\1fontColor=%s;fontStyle=0;' % col, b, count=1)
        new += b
    lastend = q.index(last) + len(last)
    q = q[:lastend] + new + q[lastend:]
    q = sub1(r'(<mxCell id="%s" [^>]*>\s*<mxGeometry )height="(\d+)"' % P, lambda mm: mm.group(1) + 'height="%d"' % (int(mm.group(2)) + 20 * k), q)
    q = sub1(r'(<mxCell id="%s-grp"[^>]*>\s*<mxGeometry )height="(\d+)"' % P, lambda mm: mm.group(1) + 'height="%d"' % (int(mm.group(2)) + 20 * k), q)

    # ---- insert old box + edge after real group's last cell
    allb = list(re.finditer(r'<mxCell id="%s(?:-[^"]*)?"[^>]*?(?:/>|>.*?</mxCell>)\n?' % P, q, re.S))
    end = allb[-1].end()
    edge = ('                <mxCell id="%s-e1" edge="1" parent="1" source="%s" target="%s" style="%s%s" value="%s">\n'
            '                    <mxGeometry relative="1" as="geometry"><mxPoint y="-10" as="offset"/></mxGeometry>\n                </mxCell>\n'
            ) % (OLD, OLD, P, EST, SIDE[pos[2]], esc(J["label"]))
    q = q[:end] + old + edge + q[end:]
    p = q
    print("  done", J["title"])

if not DRY:
    # legend
    p = sub1(r'(value="สี: ฟ้า = เนยสด[^"]*?)(")',
             r'\1 · ดำ = ตารางที่แก้ตามข้อตกลงกับทีม A (แถวเขียว = ที่เปลี่ยน) · หัวส้มเส้นประ &quot;(เดิม)&quot; = ฉบับก่อนแก้ 2026-11-11 เก็บไว้เทียบ\2', p)
    s2 = s.replace(head + p0 + tail, head + p + tail, 1)
    open(F, "w", encoding="utf-8", newline="").write(s2)
    print("written")
