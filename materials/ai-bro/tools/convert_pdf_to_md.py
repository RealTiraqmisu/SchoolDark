# Convert a digital (text-layer) PDF report to Markdown, mirroring the
# docx converter conventions used in this repo.
#
# Usage:
#   python materials/ai-bro/tools/convert_pdf_to_md.py <input.pdf> <output.md> [images_dir]
#
# - Heading hierarchy via section numbering (บทที่ N / x.y / x.y.z) plus
#   per-file automatic font-size detection for unnumbered headings
# - Images extracted to images_dir (deduped), referenced by relative path
# - Tables via pymupdf find_tables(); tables continuing across pages are
#   stitched into one table
# - Skips original TOC pages ("สารบัญ...") and regenerates a TOC from headings
# - Thai-aware line joining (no space inside Thai word boundaries)

import sys
import re
import hashlib
from pathlib import Path

import pymupdf

H1_PATTERNS = [
    # NOTE: บทที่ / ภาคผนวก handled by CHAPTER_RE with a size gate —
    # body-size mentions like "อ้างในบทที่4" must not become headings
    r"^คำนิยาม",
    r"^บทคัดย่อ",
    r"^abstract\b",
    r"^กิตติกรรม",
    r"^บรรณานุกรม",
    r"^ประวัติผู้เขียน",
    r"^ใบรับรอง",
]

NUM_HEADING = re.compile(r"^(\d+(?:\.\d+)+)[.\s]*(.+)$")
CHAPTER_RE = re.compile(r"^(บทที่\s*\d+|ภาคผนวก\s*[ก-ฮ]?)")
CAPTION_RE = re.compile(r"^(รูปที่|ตารางที่)")


def thai_join(prev: str, nxt: str) -> str:
    """Join PDF lines: space only at an ASCII word boundary, Thai glues directly."""
    if not prev:
        return nxt
    if not nxt:
        return prev
    if re.search(r"[A-Za-z0-9,.;:!?\)\]%\"']$", prev) or re.match(
        r"[A-Za-z0-9\(\[\"']", nxt
    ):
        return prev + " " + nxt
    return prev + nxt


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip()


def detect_sizes(doc):
    """Body size = mode; heading sizes = distinct sizes above body (desc)."""
    from collections import Counter

    c = Counter()
    for page in doc:
        d = page.get_text("dict")
        for block in d["blocks"]:
            if block["type"] != 0:
                continue
            for line in block["lines"]:
                for span in line["spans"]:
                    t = span["text"].strip()
                    if t:
                        c[round(span["size"], 1)] += len(t)
    body = c.most_common(1)[0][0]
    above = sorted([s for s in c if s > body + 0.8], reverse=True)
    return body, above


def is_h1_special(text: str) -> bool:
    low = text.lower()
    return any(re.match(p, low) for p in H1_PATTERNS)


def sanitize_cell(text) -> str:
    return clean(text).replace("|", "\\|")


def iter_page_lines(page):
    d = page.get_text("dict")
    lines = []
    for block in d["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            spans = [s for s in line["spans"] if s["text"].strip()]
            if not spans:
                continue
            text = "".join(s["text"] for s in line["spans"])
            size = max(s["size"] for s in spans)
            bold = bool(spans[0]["flags"] & 16)
            y0 = line["bbox"][1]
            x0 = line["bbox"][0]
            lines.append((y0, x0, round(size, 1), bold, text))
    lines.sort(key=lambda t: (round(t[0], 1), t[1]))
    return lines


def page_tables(page):
    tables = []
    try:
        found = page.find_tables()
        for t in found.tables:
            tables.append((t.bbox, t.extract()))
    except Exception:
        pass
    tables.sort(key=lambda tb: tb[0][1])
    return tables


def table_to_md(rows):
    rows = [[sanitize_cell(c) for c in r] for r in rows]
    if not rows:
        return ""
    ncols = max(len(r) for r in rows)
    for r in rows:
        while len(r) < ncols:
            r.append("")
    # drop columns that are empty in every row (table detectors often pad)
    keep = [j for j in range(ncols) if any(r[j] for r in rows)]
    rows = [[r[j] for j in keep] for r in rows]
    ncols = len(keep)
    if ncols == 0:
        return ""
    out = ["| " + " | ".join(rows[0]) + " |", "|" + "|".join([" --- "] * ncols) + "|"]
    for r in rows[1:]:
        out.append("| " + " | ".join(r) + " |")
    return "\n".join(out)


def looks_like_page_number(text: str, y0: float, page_h: float) -> bool:
    return bool(re.fullmatch(r"[-–—\s]*\d{1,3}[-–—\s]*", text.strip())) and y0 > page_h - 72


def is_toc_page(lines) -> bool:
    # a real TOC page has a "สารบัญ" line near the top
    for (y0, _x0, _size, _bold, text) in lines[:4]:
        if clean(text).startswith("สารบัญ") and y0 < 220:
            return True
    return False


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    src = Path(sys.argv[1])
    out_md = Path(sys.argv[2])
    stem = src.stem
    images_dir = Path(sys.argv[3]) if len(sys.argv) > 3 else out_md.parent / f"{stem}-images"

    doc = pymupdf.open(str(src))
    body_size, above = detect_sizes(doc)
    h1_size = above[0] if above else body_size + 4
    mid_size = above[1] if len(above) > 1 else h1_size - 2
    print(f"{src.name}: body={body_size} heading sizes={above}")

    images_dir.mkdir(parents=True, exist_ok=True)
    seen_images: dict = {}
    img_count = 0
    rel_prefix = images_dir.name  # referenced relative to out_md.parent

    # detect running headers/footers: same (text,size,y) on 3+ pages -> furniture
    from collections import Counter

    furniture = Counter()
    for pno in range(len(doc)):
        page = doc[pno]
        ph = page.rect.height
        for (y0, _x0, size, _bold, text) in iter_page_lines(page):
            t = clean(text)
            if not t or looks_like_page_number(t, y0, ph):
                continue
            furniture[(t, size, round(y0 / 4))] += 1
    furniture = {k for k, v in furniture.items() if v >= 3 and len(k[0]) < 80}

    out_lines: list[str] = []
    headings: list[tuple[int, str]] = []
    open_table = None  # rows being stitched across pages

    para_text = ""

    def flush_para():
        nonlocal para_text
        text = para_text.strip()
        if text:
            if CAPTION_RE.match(text):
                out_lines.append(f"*{text}*")
            else:
                out_lines.append(text)
            out_lines.append("")
        para_text = ""

    def flush_table():
        nonlocal open_table
        if open_table:
            md = table_to_md(open_table)
            if md:
                out_lines.append(md)
                out_lines.append("")
            open_table = None

    last_h1_page = -1

    def record_heading(level: int, text: str):
        nonlocal last_h1_page
        flush_para()
        text = clean(text)
        if headings and headings[-1][1] == text:
            return  # duplicate heading (repeated cover page etc.)
        # merge consecutive unnumbered H1 lines on the same page (cover pages)
        if (
            level == 1
            and last_h1_page == pno
            and not NUM_HEADING.match(text)
            and not CHAPTER_RE.match(text)
            and len(headings) > 0
            and headings[-1][0] == 1
            and out_lines
            and out_lines[-1] == ""
            and len(out_lines) >= 2
            and out_lines[-2].startswith("# ")
        ):
            merged = thai_join(headings[-1][1], text)
            headings[-1] = (1, merged)
            out_lines[-2] = "# " + merged
            return
        headings.append((level, text))
        out_lines.append("#" * level + " " + text)
        out_lines.append("")
        if level == 1:
            last_h1_page = pno

    for pno in range(len(doc)):
        page = doc[pno]
        page_h = page.rect.height
        lines = iter_page_lines(page)

        if is_toc_page(lines):
            continue

        tables = page_tables(page)
        table_bboxes = [tb for (tb, _r) in tables]

        def in_table(y: float) -> bool:
            for tb in table_bboxes:
                if tb[1] - 2 <= y <= tb[3] + 2:
                    return True
            return False

        events: list[tuple] = []
        for bbox, rows in tables:
            events.append((bbox[1], "table", rows))
        d = page.get_text("dict")
        for block in d["blocks"]:
            if block["type"] == 1:
                events.append((block["bbox"][1], "image", block))
        for (y0, _x0, size, bold, text) in lines:
            t = clean(text)
            if not t or looks_like_page_number(t, y0, page_h) or in_table(y0):
                continue
            if re.fullmatch(r"\d{1,3}", t):
                continue  # bare page number anywhere is furniture
            if (t, size, round(y0 / 4)) in furniture:
                continue  # running header/footer
            events.append((y0, "line", (size, bold, t)))
        events.sort(key=lambda e: e[0])

        new_open_table = None
        i = 0
        while i < len(events):
            y, kind, payload = events[i]

            if kind == "image":
                flush_para()
                block = payload
                blob = block.get("image")
                if blob:
                    h = hashlib.sha1(blob).hexdigest()[:12]
                    if h not in seen_images:
                        ext = block.get("ext", "png")
                        fname = f"{stem}-p{pno:03d}-{len(seen_images)+1:03d}-{h}.{ext}"
                        (images_dir / fname).write_bytes(blob)
                        seen_images[h] = fname
                    img_count += 1
                    out_lines.append(f"![{stem}-p{pno:03d}]({rel_prefix}/{seen_images[h]})")
                    out_lines.append("")
                i += 1
                continue

            if kind == "table":
                flush_para()
                rows = payload
                continuing = (
                    open_table is not None
                    and y < 110
                    and len(rows[0]) == len(open_table[0])
                )
                if continuing:
                    if [sanitize_cell(c) for c in rows[0]] == [sanitize_cell(c) for c in open_table[0]]:
                        open_table.extend(rows[1:])
                    else:
                        open_table.extend(rows)
                else:
                    flush_table()
                    open_table = rows
                if y > page_h - 130:  # ends near page bottom; may continue next page
                    new_open_table = open_table
                    open_table = None
                else:
                    flush_table()
                i += 1
                continue

            size, bold, t = payload

            # page-continuation headings like "บรรณานุกรม(ต่อ)" are furniture
            if re.search(r"\(ต่อ\)\s*$", t):
                i += 1
                continue

            # chapter/appendix marker: must be heading-sized (body-size mentions
            # like "บทที่4" inside sentences must NOT become headings)
            if CHAPTER_RE.match(t) and size >= mid_size - 0.5:
                title = ""
                if i + 1 < len(events):
                    ny, nk, np_ = events[i + 1]
                    if nk == "line":
                        nsize, nbold, nt = np_
                        nt2 = clean(nt)
                        if (
                            nsize >= mid_size - 0.5
                            and not NUM_HEADING.match(nt2)
                            and not is_h1_special(nt2)
                            and not CHAPTER_RE.match(nt2)
                            and len(nt2) < 120
                        ):
                            title = nt2
                            i += 1
                record_heading(1, thai_join(t, title))
                i += 1
                continue

            if is_h1_special(t):
                record_heading(1, t)
                i += 1
                continue

            m = NUM_HEADING.match(t)
            if m and size >= body_size + 0.8 and len(t) < 150:
                dots = m.group(1).count(".")
                level = min(1 + dots, 4)  # x.y -> H2, x.y.z -> H3
                record_heading(level, t)
                i += 1
                continue

            if size >= h1_size - 0.6 and len(t) < 120:
                record_heading(1, t)
                i += 1
                continue

            if CAPTION_RE.match(t):
                flush_para()
                out_lines.append(f"*{t}*")
                out_lines.append("")
                i += 1
                continue

            para_text = thai_join(para_text, t)
            i += 1

        flush_para()
        flush_table()
        open_table = new_open_table

    # ---- regenerate TOC from collected headings
    toc = ["## Table of Contents", ""]
    for level, text in headings:
        indent = "  " * (level - 1)
        anchor = text.lower()
        anchor = re.sub(r"[^\w\u0E00-\u0E7F\s-]", "", anchor)
        anchor = re.sub(r"\s+", "-", anchor.strip())
        toc.append(f"{indent}- [{text}](#{anchor})")
    toc.append("")

    front = [
        f"<!-- AUTO-GENERATED from '{src.name}' (PDF, digital text layer) -->",
        "<!-- Reference material from another team (Team A / Team C) - for AI cross-team scope awareness, not the SSOT. -->",
        "<!-- Team B SSOT is materials/doc/final-report.md -->",
        "<!-- Regenerate with: python materials/ai-bro/tools/convert_pdf_to_md.py \"<input.pdf>\" \"<output.md>\" -->",
        "",
    ]

    content = "\n".join(out_lines).replace("\n\n\n", "\n\n")
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_md.write_text(
        "\n".join(front) + "\n" + "\n".join(toc) + "\n" + content, encoding="utf-8"
    )
    print(
        f"Wrote {out_md} ({out_md.stat().st_size} bytes), "
        f"{len(headings)} headings, {img_count} image blocks, {len(seen_images)} unique images"
    )


if __name__ == "__main__":
    main()
