# -*- coding: utf-8 -*-
d = open('unpacked_full/word/document.xml', encoding='utf-8').read()
print('TH SarabunPSK refs:', d.count('TH SarabunPSK'))
print('Trebuchet:', d.count('Trebuchet'), 'Tahoma:', d.count('Tahoma'), 'Calibri:', d.count('Calibri'))
print('sz22:', d.count('"22'), 'sz24:', d.count('"24'), 'sz32:', d.count('w:val="32"'))
print('Heading styles:', d.count('Heading'))
print('numPr:', d.count('<w:numPr>'))
