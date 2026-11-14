import re, sys
import xml.etree.ElementTree as ET
src, out = sys.argv[1], sys.argv[2]
X0, Y0, X1, Y1 = [float(v) for v in sys.argv[3:7]] if len(sys.argv) > 6 else (-1250, 150, 100, 750)
t = ET.parse(src)
d = t.getroot().findall("diagram")[0]
root = d.find("mxGraphModel/root")
cells = list(root)
par = {c.get("id"): c.get("parent") for c in cells}
def top(i):
    while par.get(i) not in (None, "0", "1"):
        i = par[i]
    return i
keep = set()
for c in cells:
    if c.get("parent") == "1" and c.get("vertex") == "1":
        g = c.find("mxGeometry")
        if g is None: continue
        x, y = float(g.get("x", 0)), float(g.get("y", 0))
        w, h = float(g.get("width", 0)), float(g.get("height", 0))
        if x < X1 and x + w > X0 and y < Y1 and y + h > Y0:
            keep.add(c.get("id"))
for c in cells:
    i = c.get("id")
    if i in ("0", "1"): continue
    if c.get("edge") == "1":
        ok = top(c.get("source") or "") in keep and top(c.get("target") or "") in keep
    else:
        ok = top(i) in keep
    if not ok:
        root.remove(c)
mf = t.getroot()
for extra in mf.findall("diagram")[1:]:
    mf.remove(extra)
t.write(out, encoding="utf-8")
