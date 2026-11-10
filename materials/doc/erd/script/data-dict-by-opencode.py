from docx import Document
import re
import shutil

SRC = "C:/Users/noey/Desktop/SchoolDark/materials/doc/darft-erd/erd-types.md"
DST_TMP = "C:/Users/noey/Desktop/SchoolDark/materials/doc/darft-erd/_tmp_data-dict.docx"
DST = "C:/Users/noey/Desktop/SchoolDark/materials/doc/darft-erd/data-dict-by-opencode.docx"

text = open(SRC, encoding="utf-8").read()
lines = text.split("\n")

tables = []
cur = None
header = []
rows = []
mode = "head"

for ln in lines:
    s = ln.strip()
    if s.startswith("### "):
        if cur is not None:
            cur["rows"] = rows
            tables.append(cur)
        cur = {"name": s[4:].strip(), "rows": []}
        header = []
        rows = []
        mode = "head"
        continue
    if cur is None:
        continue
    if s.startswith("|"):
        cells = [c.strip() for c in s.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c != ""):
            mode = "row"
            continue
        if mode == "head":
            header = cells
            mode = "row"
        elif mode == "row":
            rows.append((list(header), list(cells)))
    else:
        continue

if cur is not None:
    cur["rows"] = rows
    tables.append(cur)

doc = Document()

for i, t in enumerate(tables, start=1):
    title = "ตารางที่ ก." + str(i) + " " + t["name"]
    if t["name"] == "StaffType":
        title = "ตารางที่ ก." + str(i) + " " + t["name"] + " (บุคลากร)"
    doc.add_heading(title, level=1)
    for header, cells in t["rows"]:
        col = cells[0] if len(cells) > 0 else ""
        key = cells[1] if len(cells) > 1 else ""
        typ = cells[2] if len(cells) > 2 else ""
        desc = cells[3] if len(cells) > 3 else ""
        doc.add_paragraph()
        doc.add_paragraph("- column name: " + col)
        doc.add_paragraph("- key: " + key)
        doc.add_paragraph("- types: " + typ)
        doc.add_paragraph(("- description: " + desc) if desc else "- description: ")

for p in doc.paragraphs:
    for r in p.runs:
        r.font.name = "Sarabun"

doc.save(DST_TMP)
shutil.copyfile(DST_TMP, DST)

out = []
for i, t in enumerate(tables, start=1):
    out.append("TABLE " + str(i) + " " + t["name"])
    for header, cells in t["rows"]:
        out.append("  COL " + cells[0] + " KEY=" + cells[1] + " TYPE=" + cells[2])
with open("C:/Users/noey/Desktop/SchoolDark/materials/doc/darft-erd/_tmp_verify.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("OK tables=", len(tables))
