# Convert a .docx report to Markdown (single-source-of-truth doc for AI agents).
#
# Usage:
#   python materials/ai-bro/tools/convert_docx_to_md.py <input.docx> <output.md> [images_dir]
#
# - Preserves heading hierarchy (Heading 1-4 -> # .. ####)
# - Extracts embedded images to images_dir and references them by relative path
# - Converts tables to GitHub-flavored Markdown tables
# - Converts bullet/numbered list paragraphs to Markdown lists
# - Skips the Word "table of figures" field and regenerates a TOC from headings

import sys
import re
from pathlib import Path

import docx
from docx.oxml.ns import qn

HEADING_MAP = {
    "Heading 1": "#",
    "Heading 2": "##",
    "Heading 3": "###",
    "Heading 4": "####",
    "Heading 5": "#####",
    "Heading 6": "######",
    "Title": "#",
    "Subtitle": "##",
}

LIST_STYLES = {"List Paragraph", "Bullet for Heading 3", "List Bullet", "List Number"}


def slugify(text: str) -> str:
    s = re.sub(r"[^\w\u0E00-\u0E7F\s-]", "", text.strip(), flags=re.UNICODE)
    s = re.sub(r"[\s]+", "-", s)
    return s.strip("-").lower()[:80]


def sanitize_cell(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\n", "<br>")
    return text.replace("|", "\\|").strip()


def run_is_bold(run) -> bool:
    if run.bold:
        return True
    rpr = run._element.find(qn("w:rPr"))
    if rpr is not None and rpr.find(qn("w:b")) is not None:
        return True
    return False


def paragraph_runs_md(p, images_dir: Path, seen_images: dict) -> str:
    """Render paragraph runs to inline markdown, extracting any embedded images."""
    # merge adjacent runs with identical (bold, italic) state so we don't
    # emit broken sequences like **a****b**
    merged: list[list] = []
    blip_rids: list[str] = []
    for run in p.runs:
        blips = run._element.xpath(".//a:blip")
        for blip in blips:
            rid = blip.get(qn("r:embed"))
            if rid:
                blip_rids.append(rid)
        text = run.text
        if not text:
            continue
        bold = run_is_bold(run)
        italic = bool(run.italic)
        if merged and merged[-1][0] == bold and merged[-1][1] == italic:
            merged[-1][2] += text
        else:
            merged.append([bold, italic, text])

    parts = []
    for rid in blip_rids:
        img_md = extract_image(p, rid, images_dir, seen_images)
        if img_md:
            parts.append(img_md + " ")
    for bold, italic, text in merged:
        stripped = text.strip()
        if not stripped:
            parts.append(" " if bold or italic else text)
        elif bold:
            parts.append(f"**{stripped}**")
            if text.endswith((" ", "\t")):
                parts.append(" ")
        elif italic:
            parts.append(f"*{stripped}*")
            if text.endswith((" ", "\t")):
                parts.append(" ")
        else:
            parts.append(text)
    return "".join(parts)


def extract_image(p, rid: str, images_dir: Path, seen_images: dict) -> str | None:
    try:
        part = p.part.related_parts[rid]
    except KeyError:
        return None
    target = Path(part.partname).name  # e.g. image42.png
    images_dir.mkdir(parents=True, exist_ok=True)
    out_path = images_dir / target
    if target not in seen_images:
        out_path.write_bytes(part.blob)
        seen_images[target] = out_path
    # markdown lives in materials/ai-bro/, images in materials/ai-bro/images/
    return f"![{target}](images/{target})"


def table_to_md(tbl) -> str:
    rows = []
    for tr in tbl.rows:
        cells = [sanitize_cell(c.text) for c in tr.cells]
        rows.append(cells)
    if not rows:
        return ""
    # normalize column count
    ncols = max(len(r) for r in rows)
    for r in rows:
        while len(r) < ncols:
            r.append("")
    lines = []
    header = rows[0]
    lines.append("| " + " | ".join(header) + " |")
    lines.append("|" + "|".join([" --- "] * ncols) + "|")
    for r in rows[1:]:
        lines.append("| " + " | ".join(r) + " |")
    return "\n".join(lines)


def iter_block_items(doc):
    body = doc.element.body
    for child in body.iterchildren():
        if child.tag == qn("w:p"):
            from docx.text.paragraph import Paragraph
            yield Paragraph(child, doc)
        elif child.tag == qn("w:tbl"):
            from docx.table import Table
            yield Table(child, doc)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    src = Path(sys.argv[1])
    out_md = Path(sys.argv[2])
    images_dir = Path(sys.argv[3]) if len(sys.argv) > 3 else out_md.parent / "images"

    doc = docx.Document(str(src))
    seen_images: dict = {}
    headings: list[tuple[int, str]] = []

    # First pass: collect headings for TOC (skip the Word TOC field itself)
    for block in iter_block_items(doc):
        if not isinstance(block, docx.text.paragraph.Paragraph):
            continue
        style = block.style.name
        text = " ".join(block.text.split())
        if style in HEADING_MAP and text:
            level = len(HEADING_MAP[style])
            if level <= 3:
                headings.append((level, text))

    # TOC
    toc_lines = ["## Table of Contents", ""]
    for level, text in headings:
        indent = "  " * (level - 1)
        anchor = text.lower()
        # GitHub anchor: keep unicode word chars, spaces -> -, strip punctuation
        anchor = re.sub(r"[^\w\u0E00-\u0E7F\s-]", "", anchor, flags=re.UNICODE)
        anchor = re.sub(r"\s+", "-", anchor.strip())
        toc_lines.append(f"{indent}- [{text}](#{anchor})")
    toc_lines.append("")
    toc = "\n".join(toc_lines)

    # Second pass: render
    out_lines: list[str] = []
    prev_was_table = False
    for block in iter_block_items(doc):
        if isinstance(block, docx.table.Table):
            md = table_to_md(block)
            if md:
                if out_lines and out_lines[-1].strip() != "":
                    out_lines.append("")
                out_lines.append(md)
                out_lines.append("")
            prev_was_table = True
            continue

        prev_was_table = False
        p = block
        style = p.style.name
        text = p.text.strip()

        # skip Word's generated table-of-figures field
        if style == "table of figures":
            continue

        # images may live inside otherwise-empty paragraphs
        blips = p._element.xpath(".//a:blip")

        if style in HEADING_MAP:
            collapsed = " ".join(text.split())
            if not collapsed:
                continue
            prefix = HEADING_MAP[style]
            out_lines.append(f"{prefix} {collapsed}")
            out_lines.append("")
            # images embedded in a heading paragraph get their own block below
            if blips:
                img_md = paragraph_runs_md(p, images_dir, seen_images)
                if img_md:
                    out_lines.append(img_md)
                    out_lines.append("")
        elif style == "Caption" or (text.startswith("รูปที่") or text.startswith("ตารางที่") or text.startswith("ภาพประกอบ")) and len(text) < 300:
            body = paragraph_runs_md(p, images_dir, seen_images) or text
            out_lines.append(f"*{body.strip()}*")
            out_lines.append("")
        elif style in LIST_STYLES or p._element.xpath(".//w:numPr"):
            body = paragraph_runs_md(p, images_dir, seen_images) or text
            if not body.strip():
                continue
            # keep an explicit leading number if the text already carries one
            m = re.match(r"^(\d+)[.)]\s*(.*)", body.strip())
            if m:
                out_lines.append(f"{m.group(1)}. {m.group(2)}")
            else:
                out_lines.append(f"- {body.strip()}")
        elif blips:
            img_md = paragraph_runs_md(p, images_dir, seen_images)
            if img_md:
                out_lines.append(img_md)
                out_lines.append("")
        else:
            body = paragraph_runs_md(p, images_dir, seen_images) or text
            if not body.strip():
                continue
            out_lines.append(body.strip())
            out_lines.append("")

    content = "\n".join(out_lines).replace("\n\n\n", "\n\n")

    import datetime
    src_mtime = datetime.datetime.fromtimestamp(src.stat().st_mtime).strftime("%Y-%m-%d %H:%M")
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    front = [
        f"<!-- AUTO-GENERATED from '{src.name}' (docx last modified {src_mtime}) · converted {now} -->",
        "<!-- Do not hand-edit: this file is the single source of truth (SRS / project documentation) for AI agents working in the SchoolDark repo. Edit the Word file instead. -->",
        "<!-- Source rule: every .docx in materials/ai-bro/doc/ is a project file; convert the NEWEST one (sort by last modified, skip ~$ lock files). -->",
        "<!-- Regenerate with: python materials/ai-bro/tools/convert_docx_to_md.py \"materials/ai-bro/doc/<newest>.docx\" materials/ai-bro/final-report.md materials/ai-bro/images -->",
        "",
        toc,
        "",
    ]

    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_md.write_text("\n".join(front) + "\n" + content, encoding="utf-8")

    print(f"Wrote {out_md} ({out_md.stat().st_size} bytes), images extracted: {len(seen_images)}")


if __name__ == "__main__":
    main()
