# -*- coding: utf-8 -*-
import zipfile, re
d = zipfile.ZipFile('full-one-table.docx').read('word/document.xml').decode('utf-8')
# แยกช่วงตารางแต่ละต้น
tbls = [(m.start(), m.end()) for m in re.finditer(r'<w:tbl>.*?</w:tbl>', d, re.S)]
caps = [m for m in re.finditer(r'ตารางที่ ก\.(\d+) UC-([A-Z]+-\d+)', d)]
print('tables:', len(tbls), 'captions:', len(caps))
for c, (s, e) in zip(caps, tbls):
    seg = d[s:e]
    blue = seg.count('0070C0')
    orange = seg.count('E97132')
    print('ก.%s %s -> blue_run=%d orange_ref=%d' % (c.group(1), c.group(2), blue, orange))
