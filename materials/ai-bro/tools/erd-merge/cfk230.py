import re, sys
sys.stdout.reconfigure(encoding="utf-8")
L = open(sys.argv[1], encoding="utf-8").read().split("\n")[3887:4970]
cur = None
own = set()
rows = []
for ln in L:
    m = re.search(r'id="tab:dd-([a-z0-9]+)"', ln)
    if m:
        cur = m.group(1); own.add(cur); continue
    if ln.startswith("| ") and "rightarrow" in ln:
        cells = [c.strip() for c in ln.strip("|").split("|")]
        tgt = re.search(r'rightarrow`\$ *([A-Za-z_]+)', cells[2])
        rows.append((cur, cells[0], tgt.group(1) if tgt else "?", cells[3][:60]))
shared = {}
for t, col, tgt, d in rows:
    if tgt.replace("_", "") not in own:
        shared.setdefault(tgt, []).append("%s.%s" % (t, col))
for k, v in sorted(shared.items(), key=lambda x: -len(x[1])):
    print(k, len(v), ":", ", ".join(v))
