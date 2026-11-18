import re, sys, json, hashlib
sys.stdout.reconfigure(encoding="utf-8")
out = sys.argv[1]
files = sys.argv[2:]
res = {}
for f in files:
    t = open(f, encoding="utf-8").read()
    d = {}
    for b in re.findall(r"<diagram\b.*?</diagram>", t, re.S):
        name = re.search(r'name="([^"]*)"', b).group(1)
        d[name] = hashlib.sha256(b.encode("utf-8")).hexdigest()
    res[f.replace("\\", "/").split("/")[-1]] = d
json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k, v in res.items():
    print(k, len(v), "tabs")
