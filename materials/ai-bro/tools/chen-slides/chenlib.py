"""ไลบรารีสไลด์ Chen 16:9 (projector) — หัวข้อบน · ผังซ้าย · แผงคำอธิบายขวา · แบบเดียวกับสไลด์ตัวอย่างหน้า 1 ที่นายอนุมัติ"""
import io, re, sys
from xml.sax.saxutils import escape
sys.stdout.reconfigure(encoding="utf-8")
SRC = io.open(r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-doc\erd-hierarchical-chen-a4.drawio", encoding="utf-8").read()
def _style(tab, cid):
    d = re.search(r'<diagram id="%s".*?</diagram>' % tab, SRC, re.S).group(0)
    m = re.search(r'id="%s"[^>]*?style="([^"]*)"' % cid, d) or re.search(r'style="([^"]*)"[^>]*?id="%s"' % cid, d)
    return ";".join(p for p in m.group(1).split(";") if p and p.split("=")[0] not in ("fontSize", "fontFamily", "fontColor"))
KER = _style("pg-chen-hier-staff", "c-Employees")
ENT = _style("pg-chen-hier-staff", "c-Education")
OTH = _style("pg-chen-hier-staff", "c-ClassroomHomeroomTeacher")
REL = _style("pg-chen-hier-staff", "c-r1")
FONT = ";fontFamily=TH SarabunPSK;html=1;whiteSpace=wrap;"
EDGE = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeColor=#555555;strokeWidth=2;fontStyle=1;fontSize=22;fontFamily=TH SarabunPSK;labelBackgroundColor=#ffffff;"
DN = "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
UPW = "exitX=0.5;exitY=0;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;"
HR = "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
HL = "exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;"
COMB = set(range(0x0E31, 0x0E32)) | set(range(0x0E34, 0x0E3B)) | set(range(0x0E47, 0x0E4F))
def ew(label): return max(125, round(len(label) * 10.9 + 34))
def rw(label): return max(115, round(sum(1 for ch in label if ord(ch) not in COMB) * 10.5 + 70))
class Slide:
    def __init__(s, tabid, tabname, title, count, panel):
        s.cells, s.geo, s.tabid, s.tabname, s.title, s.count, s.panel = [], {}, tabid, tabname, title, count, panel
    def ent(s, i, label, cx, y, kind="ent", sub="", w=None):
        w = w or ew(label)
        st = {"ker": KER, "ent": ENT, "oth": OTH}[kind] + FONT + "fontSize=24;" + ("fontColor=#666666;" if kind == "oth" else "")
        val = label + ("<br><font style=\"font-size:17px\">%s</font>" % sub if sub else "")
        s.cells.append('<mxCell id="%s" value="%s" style="%s" vertex="1" parent="1"><mxGeometry x="%g" y="%g" width="%g" height="56" as="geometry"/></mxCell>' % (i, escape(val, {'"': "&quot;"}), st, cx - w / 2, y, w))
        s.geo[i] = (cx - w / 2, y, w, 56)
    def rel(s, i, label, cx, y, w=None):
        w = w or rw(label)
        s.cells.append('<mxCell id="%s" value="%s" style="%s" vertex="1" parent="1"><mxGeometry x="%g" y="%g" width="%g" height="70" as="geometry"/></mxCell>' % (i, escape(label), REL + FONT + "fontSize=22;", cx - w / 2, y, w))
        s.geo[i] = (cx - w / 2, y, w, 70)
    def link(s, a, b, ex="", lab="", pos=0.0, pts=None):
        g = '<mxGeometry relative="1" x="%g" as="geometry">%s</mxGeometry>' % (pos, "" if not pts else '<Array as="points">%s</Array>' % "".join('<mxPoint x="%g" y="%g"/>' % p for p in pts))
        s.cells.append('<mxCell id="e-%s-%s-%d" value="%s" style="%s" edge="1" parent="1" source="%s" target="%s">%s</mxCell>' % (a, b, len(s.cells), lab, EDGE + ex, a, b, g))
    def cx(s, i): x, y, w, h = s.geo[i]; return x + w / 2
    def tree(s, par, rel, chi, pex=DN, cex=None, l1=0.55, l2=-0.55):   # พ่อ → ◇ → ลูก (แนวตั้ง)
        s.link(par, rel, pex, "1", l1); s.link(rel, chi, cex or DN, "N", l2)
    def chain(s, par, rel, chi, direction="R"):                       # พ่อ → ◇ → ลูก (แนวนอน)
        ex = HR if direction == "R" else HL
        s.link(par, rel, ex, "1", 0.55); s.link(rel, chi, ex, "N", -0.55)
    def up(s, par, rel, chi):                                         # พ่ออยู่ล่าง ลูกอยู่บน
        s.link(par, rel, UPW, "1", 0.5); s.link(rel, chi, UPW, "N", -0.5)
    def into(s, rel, chi, ratio, lvl):                                # ◇ ลงมาเข้าลูกที่ตำแหน่ง ratio ผ่านระดับ lvl
        x, y, w, h = s.geo[chi]; ex = x + ratio * w; dc = s.cx(rel)
        s.link(rel, chi, "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=%g;entryY=0;entryDx=0;entryDy=0;" % ratio, "N", -0.6, pts=None if abs(dc - ex) < 3 else [(dc, lvl), (ex, lvl)])
    def box(s, i, t, x, y, w, h, st):
        s.cells.append('<mxCell id="%s" value="%s" style="%s" vertex="1" parent="1"><mxGeometry x="%g" y="%g" width="%g" height="%g" as="geometry"/></mxCell>' % (i, escape(t, {'"': "&quot;"}), st, x, y, w, h))
    def xml(s):
        pre = []
        def b(i, t, x, y, w, h, st): pre.append((i, t, x, y, w, h, st))
        TXT = "text;html=1;align=left;verticalAlign=middle;fontFamily=TH SarabunPSK;"
        s.box("bg", "", 0, 0, 1920, 1080, "rounded=0;fillColor=#ffffff;strokeColor=none;")
        s.box("band", "", 0, 0, 1920, 100, "rounded=0;fillColor=#1f3a5f;strokeColor=none;")
        s.box("title", "<b>%s</b>" % s.title, 40, 14, 1500, 72, TXT + "fontSize=48;fontColor=#ffffff;")
        s.box("tcount", s.count, 1620, 14, 260, 72, "text;html=1;align=right;verticalAlign=middle;fontFamily=TH SarabunPSK;fontSize=32;fontColor=#fde68a;")
        s.box("panel", "", 1420, 130, 460, 910, "rounded=1;arcSize=3;fillColor=#f8fafc;strokeColor=#cbd5e1;strokeWidth=2;")
        P = "<br><br>".join("<font color='#1f3a5f'><b>%s</b></font><br>%s" % (h, t) for h, t in s.panel)
        s.box("ptxt", P, 1445, 150, 410, 660, "text;html=1;whiteSpace=wrap;align=left;verticalAlign=top;fontFamily=TH SarabunPSK;fontSize=30;fontColor=#1e293b;")
        ly = 830
        s.box("lgh", "<b>สัญลักษณ์</b>", 1445, ly, 300, 30, TXT + "fontSize=24;fontColor=#1f3a5f;")
        for n, (st, t) in enumerate([(KER, "ตารางหลัก"), (ENT, "ตารางรายละเอียด"), (OTH, "ตารางจากหมวดอื่น")]):
            s.box("lgs%d" % n, "", 1445, ly + 36 + n * 44, 70, 30, st + FONT)
            s.box("lgt%d" % n, t, 1530, ly + 34 + n * 44, 300, 34, TXT + "fontSize=22;")
        s.box("lgr", "1 / N = ฝั่งแม่ : ฝั่งลูก", 1445, ly + 36 + 3 * 44 - 4, 300, 30, TXT + "fontSize=22;fontColor=#475569;")
        front = [c for c in s.cells if any(('id="%s"' % k) in c for k in ("bg", "band", "panel"))]
        cells = front + [c for c in s.cells if c not in front]
        for i, (x, y, w, h) in s.geo.items():
            if x < 38 or x + w > 1408 or y + h > 1042: print("  ⚠ นอกพื้นที่:", i, round(x), round(y), round(x + w), round(y + h))
        return ('<diagram id="%s" name="%s"><mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1920" pageHeight="1080" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>%s</root></mxGraphModel></diagram>'
                % (s.tabid, escape(s.tabname, {'"': "&quot;"}), "".join(cells)))
