"""plan 260: เปลี่ยนกล่องกลุ่ม use case เป็น UML package (มียึก) + กรอบระบบ ในไฟล์ ver-present/2026-11-17-usecase-package.drawio
รันได้ครั้งเดียว: ถ้าเจอ sys-boundary ในแท็บใดแล้วจะหยุด"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-17-usecase-package.drawio"
TAB_H = 30
SYS_B = "ระบบบริหารจัดการข้อมูลหลักและงานทะเบียนโรงเรียน (Service B)"
SYS_ALL = "ระบบบริหารจัดการข้อมูลหลักและงานทะเบียนโรงเรียน (รวม 3 กลุ่มงาน A · B · C)"
TABS = {
    "เล่มรายงาน (A4) รวม actor": (["v3-v2-1", "v3-v2-28", "v3-v2-59", "v3-v2-41"], SYS_B),
    "use case · งานรับสมัครนักเรียน": (["v3-v2-28"], SYS_B),
    "use case · งานทะเบียนนักเรียน": (["v3-v2-1"], SYS_B),
    "use case · งานฝ่ายบุคคล": (["v3-v2-59"], SYS_B),
    "use case · การตั้งค่า": (["v3-v2-41"], SYS_B),
    "all": (["eZbcZcb6FxW7OA3qbCNx-2", "eZbcZcb6FxW7OA3qbCNx-1", "dDfqINMt6-CSADoH_1uA-60", "dDfqINMt6-CSADoH_1uA-37",
             "IWZWGF7JnsLCTGTGX0jP-75", "IWZWGF7JnsLCTGTGX0jP-1", "IWZWGF7JnsLCTGTGX0jP-12", "IWZWGF7JnsLCTGTGX0jP-48",
             "dDfqINMt6-CSADoH_1uA-1", "KuX_XRmJswBCCZbQ4_-T-4", "KuX_XRmJswBCCZbQ4_-T-26"], None),
}
CELL_RE = re.compile(r"<mxCell\b(?:[^>]*/>|[^>]*>.*?</mxCell>)", re.S)

def attr(s, k):
    m = re.search(r'\b' + k + r'="([^"]*)"', s)
    return m.group(1) if m else None

def set_attr(s, k, val):
    if re.search(r'\b' + k + r'="[^"]*"', s):
        return re.sub(r'\b' + k + r'="[^"]*"', f'{k}="{val}"', s, count=1)
    return s

def sget(style, k):
    m = re.search(r'(?:^|;)' + k + r'=([^;]*)', style)
    return m.group(1) if m else None

def fmt(n):
    return str(int(n)) if float(n).is_integer() else str(round(n, 2))

class Cell:
    def __init__(self, raw):
        self.raw = raw
        self.head = re.match(r"<mxCell\b[^>]*>", raw).group(0)
        self.id = attr(self.head, "id")
        self.style = attr(self.head, "style") or ""
        self.vertex = 'vertex="1"' in self.head
        self.edge = 'edge="1"' in self.head
        self.value = attr(self.head, "value") or ""
        g = re.search(r"<mxGeometry\b[^>]*>", raw)
        self.geo = g.group(0) if g else None
        if self.vertex and self.geo:
            self.x = float(attr(self.geo, "x") or 0); self.y = float(attr(self.geo, "y") or 0)
            self.w = float(attr(self.geo, "width") or 0); self.h = float(attr(self.geo, "height") or 0)

    def write_geo(self):
        geo = self.geo
        for k, val in (("x", self.x), ("y", self.y), ("width", self.w), ("height", self.h)):
            if re.search(r'\b' + k + r'="', geo):
                geo = set_attr(geo, k, fmt(val))
            else:
                geo = geo.replace("<mxGeometry", f'<mxGeometry {k}="{fmt(val)}"', 1)
        self.raw = self.raw.replace(self.geo, geo, 1); self.geo = geo

    def set_style(self, st):
        newhead = set_attr(self.head, "style", st)
        self.raw = self.raw.replace(self.head, newhead, 1); self.head = newhead; self.style = st

def shift_points(cell, line, d):
    def rep(m):
        y = float(m.group(2))
        return m.group(1) + (fmt(y + d) if y >= line else m.group(2)) + m.group(3)
    cell.raw = re.sub(r'(<mxPoint\b[^>]*\by=")([-0-9.]+)(")', rep, cell.raw)

def process(block, pkg_ids, sysname):
    assert "sys-boundary" not in block and "shape=folder;tabPosition=left;tabHeight=30" not in block, "already processed"
    cells = [Cell(m.group(0)) for m in CELL_RE.finditer(block)]
    byid = {c.id: c for c in cells}
    pk = [byid[i] for i in pkg_ids]
    orig = {c.id: (c.y, c.h) for c in pk}
    # 1) folder shape
    for c in pk:
        fs = float(sget(c.style, "fontSize") or 12)
        name = re.sub(r"<[^>]+>|&[a-z]+;", "", c.value)
        tabw = max(90, int((len(name) * fs * 0.6 + 30 + 9) // 10 * 10))
        fill = sget(c.style, "fillColor") or "none"
        stroke = sget(c.style, "strokeColor") or "#666666"
        st = (f"shape=folder;tabPosition=left;tabHeight={TAB_H};tabWidth={tabw};whiteSpace=wrap;html=1;verticalAlign=top;align=left;"
              f"spacingLeft=10;spacingTop=2;fontStyle=1;fillColor={fill};strokeColor={stroke};")
        for k in ("fontFamily", "fontSize"):
            if sget(c.style, k):
                st += f"{k}={sget(c.style, k)};"
        c.set_style(st)
        c.y -= TAB_H; c.h += TAB_H; c.write_geo()

    def inside(a, b):  # a nested inside b (body area)
        return a is not b and a.x >= b.x - 1 and a.x + a.w <= b.x + b.w + 1 and a.y >= b.y - 1 and a.y + a.h <= b.y + b.h + 1

    def shift_below(line, d):
        for c in cells:
            if c.vertex and c.geo and c.y >= line:
                c.y += d; c.write_geo()
            if c.edge:
                shift_points(c, line, d)

    # 2a) nested: child tab must clear parent's tab
    for _ in range(20):
        changed = False
        for ch in pk:
            for par in pk:
                if inside(ch, par) and ch.y - par.y < TAB_H + 8:
                    d = TAB_H + 8 - (ch.y - par.y)
                    top, bot, l, r = ch.y, ch.y + ch.h, ch.x, ch.x + ch.w
                    for c in cells:
                        if c.vertex and c.geo and c is not par and c.x >= l - 1 and c.x + c.w <= r + 1 and c.y >= top - 1 and c.y < bot:
                            c.y += d; c.write_geo()
                    par.h += d; par.write_geo(); changed = True
        if not changed:
            break
    # 2b) stacked packages: keep >= 20 gap
    for _ in range(20):
        hit = None
        for q in sorted(pk, key=lambda c: c.y):
            for p in pk:
                if p is q or inside(q, p) or inside(p, q):
                    continue
                xo = min(p.x + p.w, q.x + q.w) - max(p.x, q.x)
                gap = q.y - (p.y + p.h)
                if xo > 0 and p.y < q.y and gap < 20:
                    hit = (q.y - 5, 20 - gap); break
            if hit:
                break
        if not hit:
            break
        shift_below(*hit)
    # 3) boundary (แท็บ all ไม่ใส่: actor อยู่กลางผัง ต้องจัดผังใหม่ด้วยมือ)
    if sysname is None:
        return rebuild(block, cells, None), []
    L = min(c.x for c in pk) - 30; T = min(c.y for c in pk) - 60
    R = max(c.x + c.w for c in pk) + 30; B = max(c.y + c.h for c in pk) + 30
    fs = float(sget(pk[0].style, "fontSize") or 12) + 4
    moved = []
    for c in cells:
        if c.vertex and "umlActor" in c.style:
            if c.x < R and c.x + c.w > L and c.y < B and c.y + c.h > T:
                cx, cy = c.x + c.w / 2, c.y + c.h / 2
                if cy > B - 40:
                    c.y = B + 40
                elif cx < (L + R) / 2:
                    c.x = L - c.w - 60
                else:
                    c.x = R + 60
                c.write_geo(); moved.append(c.id)
    for c in cells:
        if c.edge and (attr(c.head, "source") in moved or attr(c.head, "target") in moved):
            c.raw = re.sub(r'<Array as="points">.*?</Array>', "", c.raw, flags=re.S)
    bnd = (f'<mxCell id="sys-boundary" value="{sysname}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#666666;'
           f'verticalAlign=top;align=center;spacingTop=8;fontStyle=1;fontFamily=TH SarabunPSK;fontSize={fmt(fs)};" vertex="1" parent="1">'
           f'<mxGeometry x="{fmt(L)}" y="{fmt(T)}" width="{fmt(R - L)}" height="{fmt(B - T)}" as="geometry" /></mxCell>')
    return rebuild(block, cells, bnd, R, B), moved

def rebuild(block, cells, bnd, R=0, B=0):
    pos = 0; parts = []
    for m, c in zip(CELL_RE.finditer(block), cells):
        parts.append(block[pos:m.start()]); parts.append(c.raw)
        if c.id == "1" and bnd:
            parts.append(bnd)
        pos = m.end()
    parts.append(block[pos:])
    out = "".join(parts)
    # page size
    xs = [c.x + c.w for c in cells if c.vertex and c.geo] + [R]; ys = [c.y + c.h for c in cells if c.vertex and c.geo] + [B]
    out = re.sub(r'pageWidth="\d+"', f'pageWidth="{int(max(xs) + 40)}"', out, count=1)
    out = re.sub(r'pageHeight="\d+"', f'pageHeight="{int(max(ys) + 40)}"', out, count=1)
    return out

t = open(F, encoding="utf-8").read()
for name, (ids, sysname) in TABS.items():
    m = re.search(r'<diagram[^>]*name="' + re.escape(name) + r'".*?</diagram>', t, re.S)
    nb, moved = process(m.group(0), ids, sysname)
    t = t[:m.start()] + nb + t[m.end():]
    print(name, "| moved actors:", moved)
open(F, "w", encoding="utf-8", newline="").write(t)
print("ok")
