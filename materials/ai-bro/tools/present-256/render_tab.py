import sys, re, subprocess, os
src, name, out = sys.argv[1], sys.argv[2], sys.argv[3]
txt = open(src, encoding="utf-8").read()
head = txt[:txt.index("<diagram")]
blocks = re.findall(r"<diagram\b.*?</diagram>", txt, re.S)
b = [x for x in blocks if f'name="{name}"' in x]
if not b:
    print("not found"); sys.exit(1)
tmp = out + ".drawio"
open(tmp, "w", encoding="utf-8").write(head + b[0] + "\n</mxfile>\n")
subprocess.run([r"C:\Program Files\draw.io\draw.io.exe", "-x", "-f", "png", "-s", "1", "-o", out, tmp], check=False)
print(out, os.path.exists(out))
