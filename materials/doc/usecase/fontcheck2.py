# -*- coding: utf-8 -*-
import re, collections
d = open('unpacked_full/word/document.xml', encoding='utf-8').read()
hits = re.findall(r'<w:(\w+) w:val="24"', d)
print(collections.Counter(hits))
for m in list(re.finditer(r'<w:t[ >][^<]{0,40}', d))[:0]:
    pass
m = re.search(r'(<wtrás?[^>]*>)', d)
i = d.find('w:val="24"')
print(d[max(0, i-200):i+120])
