# -*- coding: utf-8 -*-
"""สร้างไฟล์ตารางเดียว (UC-ADM-01) โดยใช้ XML ของเทมเพลตเดิมจาก full.zip ทุกส่วน
   - เทมเพลตตาราง (tblPr/tcPr/tcBorders/tcMar/trHeight/tblLook) ถูก copy มาแบบตรงตัว
   - เพียงแทนข้อความในช่องว่างด้วยเนื้อหาของ UC
   - สีเนื้อหา: เหมือนเทมเพลตเดิม (ของเก่า = ส้ม E97132, เขียนใหม่ = น้ำเงิน 0070C0)
Usage: python fill_one_tpl.py UC-XXX-NN out.docx [ตารางที่ N]
"""
import zipfile, sys, os, codecs, re

SRC = 'full.zip'

ORANGE = '<w:color w:val="E97132" w:themeColor="accent2"/>'
BLUE = '<w:color w:val="0070C0"/>'


def esc(s):
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
    return s


def tmpl_p(text, color, bold=False):
    """ย่อหน้า content ที่เลียนรูปแบบเทมเพลตเดิม (ind firstLine=0 + rPr สี)"""
    b = '<w:b/><w:bCs/>' if bold else ''
    return ('<w:p><w:pPr><w:ind w:firstLine="0"/><w:rPr>%s</w:rPr></w:pPr>'
            '<w:r><w:rPr>%s%s</w:rPr><w:t xml:space="preserve">%s</w:t></w:r></w:p>'
            % (color, b, color, esc(text)))


def caption_p(idx, uc_id, name, color):
    return ('<w:p><w:pPr><w:ind w:firstLine="0"/><w:rPr>%s<w:b/><w:bCs/></w:rPr></w:pPr>'
            '<w:r><w:rPr>%s<w:b/><w:bCs/></w:rPr>'
            '<w:t xml:space="preserve">\u0e15\u0e32\u0e23\u0e32\u0e07\u0e17\u0e35\u0e48 \u0e01.%s UC-%s %s</w:t></w:r></w:p>'
            % (color, color, esc(idx), esc(uc_id), esc(name)))


def fill_uc(tpl_table, u, idx, after):
    """tpl_table: XML ตารางเทมเพลต 1 ต้น (ยังไม่เติมเนื้อหา)  คืน caption + ตารางที่เติมแล้ว
       after: XML ที่อยู่หลังตาราง (ใช้ตอนตารางสุดท้ายเท่านั้น)"""
    color = ORANGE if not u['new'] else BLUE
    cap = caption_p(idx, u['id'].replace('UC-', ''), u['name'], color)
    table = tpl_table

    # --- Row 1: ช่องที่ 2 (กริด 210) -> ชื่อ UC; ช่องที่ 3 (5116) -> "ID: UC-..." ---
    row1 = re.search(r'<w:tr .*?</w:tr>', table, re.S).group(0)
    cells = re.findall(r'<w:tc>.*?</w:tc>', row1, re.S)
    assert len(cells) == 3, 'row1 expected 3 cells, got %d' % len(cells)
    name_inner = ('<w:p><w:pPr><w:ind w:firstLine="0"/><w:rPr>%s</w:rPr></w:pPr>'
                  '<w:r><w:rPr>%s</w:rPr><w:t xml:space="preserve">%s</w:t></w:r></w:p>'
                  % (color, color, esc(u['name'])))
    id_inner = tmpl_p('ID: ' + u['id'], color)
    name_cell = cells[1].replace(
        re.search(r'<w:p .*?<w:pPr><w:ind w:firstLine="0"/><w:rPr>.*?</w:rPr></w:pPr></w:p>', cells[1], re.S).group(0),
        name_inner)
    id_cell = cells[2].replace(
        re.search(r'<w:p .*?<w:pPr><w:ind w:firstLine="0"/><w:rPr>.*?</w:rPr></w:pPr>(<w:r .*?</w:r>)?</w:p>', cells[2], re.S).group(0),
        id_inner)
    row1_new = row1.replace(cells[1], name_cell).replace(cells[2], id_cell)
    table = table.replace(row1, row1_new)

    # --- Rows 2..8: ช่องเนื้อหา (5326, gridSpan 2) → ยัดย่อหน้า content ---
    spec = [(u['brief'], False), (u['actor'], False), (u['stake'], False),
            (u['pre'], True), (u['post'], True), (u['basic'], True), (u['alt'], True)]
    content_cells = re.findall(r'<w:tc><w:tcPr><w:tcW w:w="5326" w:type="dxa"/><w:gridSpan w:val="2"/>.*?</w:tc>', table, re.S)
    assert len(content_cells) == 7, 'expected 7 content cells, got %d' % len(content_cells)
    for cell, (items, ind) in zip(content_cells, spec):
        paras = ''.join(tmpl_p(it if isinstance(it, str) else it[0], color,
                               isinstance(it, tuple) and it[1]) for it in items)
        old_p = re.search(r'<w:p .*?<w:pPr><w:ind w:firstLine="0"/><w:rPr>.*?</w:rPr></w:pPr></w:p>', cell, re.S).group(0)
        table = table.replace(cell, cell.replace(old_p, paras))

    return cap + table + after


def build_all():
    """สร้าง body เต็ม: caption + ตารางของทุก UC เรียงลำดับ + trailing (empty p + sectPr)"""
    d = zipfile.ZipFile(SRC).read('word/document.xml').decode('utf-8')
    i = d.find('<w:body>') + 8
    j = d.find('</w:body>')
    body = d[i:j]
    tbl = re.search(r'<w:tbl>.*</w:tbl>', body, re.S).group(0)
    after = body[body.find('</w:tbl>') + len('</w:tbl>'):]

    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from ucpart1 import DATA as DATA1
    from ucpart2 import DATA as DATA2
    from ucpart3 import DATA as DATA3
    ALL = DATA1 + DATA2 + DATA3

    out = []
    for k, u in enumerate(ALL, start=1):
        out.append(fill_uc(tbl, u, '%d' % k, after if k == len(ALL) else ''))
    return d[:i] + ''.join(out) + d[j:]


def main():
    args = sys.argv[1:]
    out = args[0] if len(args) > 0 else 'full-one-table.docx'

    new_doc = build_all()

    path = os.path.join('unpacked_full', 'word', 'document.xml')
    with codecs.open(path, 'w', encoding='utf-8') as f:
        f.write(new_doc)
    print('wrote %s (%d chars)' % (path, len(new_doc)))

    tmp = out + '.tmp'
    if os.path.exists(tmp):
        os.remove(tmp)
    zf = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    base = os.path.abspath('unpacked_full')
    for root, dirs, files in os.walk(base):
        for fn in files:
            if fn.endswith('.tmp'):
                continue
            full = os.path.join(root, fn)
            rel = os.path.relpath(full, base).replace('\\', '/')
            zf.write(full, rel)
    zf.close()
    if os.path.exists(out):
        try:
            os.remove(out)
        except PermissionError:
            print('!! %s is locked (opened in Word?) -> please close and rerun' % out)
            return
    os.rename(tmp, out)
    print('zipped -> %s' % out)


if __name__ == '__main__':
    main()
