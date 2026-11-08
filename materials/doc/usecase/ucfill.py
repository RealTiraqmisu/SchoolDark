# -*- coding: utf-8 -*-
"""Fill `full-use-case-description-by-opencode.docx`:
   - จำนวนย่อหน้าคงเดิม (preview/caption of table 3.22 + heading)
   - แทนที่ body ด้วย caption + ตาราง 21 UC (สี: ส้ม = ก้อปของเดิม, น้ำเงิน = เขียนใหม่)
   - จากนั้น zip กลับเป็น .docx
Usage:
   python ucfill.py --docx <target.docx>    (read from unpacked_full/, write result to target)
"""
import zipfile, shutil, sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ucpart1 import DATA as DATA1
from ucpart2 import DATA as DATA2
from ucpart3 import DATA as DATA3
ALL = DATA1 + DATA2 + DATA3
assert len(ALL) == 22, "expect 22 UC, got %d" % len(ALL)

ORANGE = '<w:color w:val="E97132" w:themeColor="accent2"/>'
BLUE = '<w:color w:val="0070C0"/>'
BORDERS = ('<w:tcBorders><w:top w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
           '<w:left w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
           '<w:bottom w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
           '<w:right w:val="single" w:sz="8" w:space="0" w:color="auto"/></w:tcBorders>')
TCMAR = ('<w:tcMar><w:top w:w="57" w:type="dxa"/><w:start w:w="57" w:type="dxa"/>'
         '<w:bottom w:w="57" w:type="dxa"/><w:end w:w="57" w:type="dxa"/></w:tcMar>')

FONT_SAR = '<w:rFonts w:ascii="TH SarabunPSK" w:hAnsi="TH SarabunPSK" w:eastAsia="TH SarabunPSK"/>'
SZ16 = '<w:sz w:val="32"/><w:szCs w:val="32"/>'


def esc(s):
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    s = s.replace('"', "&quot;")
    return s


def color_of(is_new):
    return BLUE if is_new else ORANGE


def run(text, color, bold):
    rpr = ('<w:rPr>%s%s%s%s</w:rPr>'
           % (FONT_SAR, color, SZ16, '<w:b/><w:bCs/>' if bold else ''))
    return ('<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r>' % (rpr, esc(text)))


def p(items, is_new, ind=False):
    """items: list of (text,bold) หรือ str -> 1 ย่อหน้าต่อ 1 รายการ"""
    c = color_of(is_new)
    ps = []
    for i, it in enumerate(items):
        t, b = it if isinstance(it, tuple) else (it, False)
        ppr = ('<w:pPr><w:adjustRightInd w:val="0"/><w:snapToGrid w:val="0"/>'
               '<w:spacing w:after="120" w:line="240" w:lineRule="auto"/>'
               '%s<w:jc w:val="both"/></w:pPr>'
               % ('<w:ind w:start="430"/>' if (ind and i > 0) else ''))
        ps.append('<w:p>%s%s</w:p>' % (ppr, run(t, c, b)))
    return ''.join(ps)


def items_to_p(items, is_new, ind=False):
    return p(items, is_new, ind)


def paras_cells(items, is_new):
    """คือ p() ที่รับ list"""
    return items_to_p(items, is_new)


def label_cell(text):
    rpr_small = ('<w:rPr>%s%s%s<w:b/><w:bCs/></w:rPr>' % (FONT_SAR, ORANGE, SZ16))
    return ('<w:p><w:pPr><w:adjustRightInd w:val="0"/>'
            '<w:snapToGrid w:val="0"/><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>'
            '<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r></w:p>' % (rpr_small, esc(text)))


def tcell(width, body, spans=1, h_rule=None, va='center'):
    tcpr = ['<w:tcPr><w:tcW w:w="%d" w:type="dxa"/>' % width]
    if spans > 1:
        tcpr.append('<w:gridSpan w:val="%d"/>' % spans)
    tcpr.append(BORDERS)
    tcpr.append(TCMAR)
    tcpr.append('<w:vAlign w:val="%s"/>' % va)
    tcpr.append('</w:tcPr>')
    return '<w:tc>%s%s</w:tc>' % (''.join(tcpr), body)


def trp(h):
    height = h
    return '<w:trPr><w:trHeight w:val="%d" w:hRule="atLeast"/></w:trPr>' % height


def build_table(u):
    rows = []
    # Row 1: "Use Case Name" | (เว้น) | ชื่อ Use Case | ID: UC-xxx  (แยกคอลัมน์ชื่อกับ ID ให้ตรงตามเอกสารเก่า)
    label_p1 = ('<w:p><w:pPr><w:adjustRightInd w:val="0"/>'
                '<w:snapToGrid w:val="0"/><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>'
                '<w:r><w:rPr>%s%s%s<w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">Use Case Name</w:t></w:r></w:p>') % (FONT_SAR, ORANGE, SZ16)
    spacer = ('<w:p><w:pPr><w:adjustRightInd w:val="0"/>'
              '<w:snapToGrid w:val="0"/><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>'
              '<w:r><w:rPr>%s%s</w:rPr><w:t xml:space="preserve">&#160;</w:t></w:r></w:p>') % (FONT_SAR, SZ16)
    name_p = ('<w:p><w:pPr><w:adjustRightInd w:val="0"/>'
              '<w:snapToGrid w:val="0"/><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>'
              '<w:r><w:rPr>%s%s%s</w:rPr><w:t xml:space="preserve">%s</w:t></w:r></w:p>'
              % (FONT_SAR, color_of(u['new']), SZ16, esc(u['name'])))
    id_p = ('<w:p><w:pPr><w:adjustRightInd w:val="0"/>'
            '<w:snapToGrid w:val="0"/><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>'
            '<w:r><w:rPr>%s%s%s</w:rPr><w:t xml:space="preserve">ID: %s</w:t></w:r></w:p>'
            % (FONT_SAR, color_of(u['new']), SZ16, esc(u['id'])))
    rows.append('<w:tr>' + trp(530) +
                tcell(2886, label_p1) +
                tcell(210, spacer) +
                tcell(2063, name_p) +
                tcell(3053, id_p) + '</w:tr>')

    rows_spec = [
        ("Brief Description", 'paras', u['brief'], 830),
        ("Actor(s)", 'paras', u['actor'], 530),
        ("Stakeholders", 'paras', u['stake'], 530),
        ("Pre-Conditions", 'items', u['pre'], 830),
        ("Post-Conditions", 'items', u['post'], 1430),
        ("Basic Flow of Events", 'items', u['basic'], 3530),
        ("Alternate/Exception Flows", 'items', u['alt'], 3185),
    ]
    for label, kind, content, h in rows_spec:
        if kind == 'paras':
            body = paras_cells(content, u['new'])
        else:
            body = p(content, u['new'], ind=True)
        if h in (830, 1430, 3530, 3185):
            va = 'top' if h in (1430, 3530, 3185) else 'top'
        rows.append('<w:tr>' + trp(h) + tcell(2886, label_cell(label)) +
                    tcell(5326, body, spans=3) + '</w:tr>')

    return ('<w:tbl><w:tblPr><w:tblW w:w="8212" w:type="dxa"/>'
            '<w:tblBorders><w:top w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
            '<w:left w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
            '<w:bottom w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
            '<w:right w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
            '<w:insideH w:val="single" w:sz="8" w:space="0" w:color="auto"/>'
            '<w:insideV w:val="single" w:sz="8" w:space="0" w:color="auto"/></w:tblBorders>'
            '<w:tblLayout w:type="fixed"/>'
            '<w:tblCellMar><w:top w:w="57" w:type="dxa"/><w:start w:w="57" w:type="dxa"/>'
            '<w:bottom w:w="57" w:type="dxa"/><w:end w:w="57" w:type="dxa"/></w:tblCellMar></w:tblPr>'
            '<w:tblGrid><w:gridCol w:w="2886"/><w:gridCol w:w="210"/><w:gridCol w:w="2063"/>'
            '<w:gridCol w:w="3053"/></w:tblGrid>'
            + ''.join(rows) + '</w:tbl>')


def build_caption(idx, u):
    c = color_of(u['new'])
    return ('<w:p><w:pPr><w:adjustRightInd w:val="0"/><w:snapToGrid w:val="0"/>'
            '<w:spacing w:after="120" w:line="240" w:lineRule="auto"/></w:pPr>'
            '<w:r><w:rPr>%s%s%s</w:rPr>'
            '<w:t xml:space="preserve">\u0e15\u0e32\u0e23\u0e32\u0e07\u0e17\u0e35\u0e48 3.%d UC-%s %s</w:t></w:r></w:p>'
            % (FONT_SAR, c, SZ16, idx, esc(u['id'].replace('UC-', '')), esc(u['name'])))


def build_docs():
    out = []
    for i, u in enumerate(ALL, start=1):
        out.append(build_caption(i, u))
        out.append(build_table(u))
        out.append('<w:p/>')
    return ''.join(out)


def main():
    if '--only-smoke' in sys.argv:
        xml = build_docs()
        print('smoke: total xml chars=%d' % len(xml))
        return
    docx = [a for a in sys.argv[1:] if a.endswith('.docx')]
    if not docx:
        print('usage: python ucfill.py <target.docx>')
        sys.exit(2)
    docx = docx[0]
    src = os.path.join(os.path.dirname(os.path.abspath(__file__)).replace('\\', '/') + '/unpacked_full')
    docdir = os.path.join(os.path.abspath(src))
    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, 'shell_head.xml'), encoding='utf-8') as f:
        head = f.read()
    with open(os.path.join(here, 'shell_tail.xml'), encoding='utf-8') as f:
        tail = f.read()
    new_doc = head + build_docs() + tail
    # เขียน document.xml ลง unpacked_full แล้ว zip กลับ
    path = os.path.join(docdir, 'word', 'document.xml')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_doc)
    print('wrote %s (%d chars)' % (path, len(new_doc)))
    # zip (exclude tmp)
    tmp = docx + '.tmp'
    if os.path.exists(tmp):
        os.remove(tmp)
    zf = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    for root, dirs, files in os.walk(docdir):
        for fn in files:
            if fn.endswith('.tmp'):
                continue
            full = os.path.join(root, fn)
            rel = os.path.relpath(full, docdir).replace('\\', '/')
            zf.write(full, rel)
    zf.close()
    if os.path.exists(docx):
        os.remove(docx)
    os.rename(tmp, docx)
    print('zipped -> %s' % docx)


if __name__ == '__main__':
    main()
