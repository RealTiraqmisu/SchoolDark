"""plan 273: คัดลอกแท็บ '10.1 org chart · ทีม B' เป็นแท็บใหม่ แล้วทำกล่องเจ้าหน้าที่ฝ่ายอื่นเป็นกล่องจาง (ใช้ระบบในฐานะบุคลากร)
รันซ้ำไม่ได้ (assert) · สร้างใหม่ให้รันกับ backup-2026-11-17/2026-11-11-thai-school-staff-structure.before-273.drawio"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\Users\noey\Desktop\SchoolDark\materials\doc\ver-present\2026-11-11-thai-school-staff-structure.drawio"
SRC = "10.1 org chart · ทีม B"
NEW = "10.1 org chart · ทีม B · ฝ่ายอื่นจาง"
d = open(F, encoding="utf-8").read()
assert f'name="{NEW}"' not in d and 'id="p10c"' not in d and '"p10c-' not in d
i = d.index(f'<diagram id="p10b" name="{SRC}"'); j = d.index("</diagram>", i) + len("</diagram>")
t = d[i:j]
t = t.replace(f'<diagram id="p10b" name="{SRC}"', f'<diagram id="p10c" name="{NEW}"')
t = t.replace('"p10b-', '"p10c-').replace('"3ohlKxpuJ_SUGxPm4Krd-', '"p10c-x')
old = 'style="rounded=1;whiteSpace=wrap;html=1;fontFamily=TH SarabunPSK;fontSize=30;fillColor=#ffffff;strokeColor=#999999;" value="&lt;b&gt;เจ้าหน้าที่ฝ่ายอื่น&lt;/b&gt;&lt;br&gt;การเงิน พัสดุ ธุรการ ฯลฯ&lt;br&gt;สิทธิ์เฉพาะของบุคลากร"'
new = 'style="rounded=1;whiteSpace=wrap;html=1;fontFamily=TH SarabunPSK;fontSize=30;fillColor=#ffffff;strokeColor=#999999;opacity=40;textOpacity=50;" value="&lt;b&gt;เจ้าหน้าที่ฝ่ายอื่น&lt;/b&gt;&lt;br&gt;การเงิน พัสดุ ธุรการ ฯลฯ&lt;br&gt;ใช้ระบบในฐานะบุคลากร"'
assert t.count(old) == 1
t = t.replace(old, new)
d = d[:j] + "\n  " + t + d[j:]
open(F, "w", encoding="utf-8", newline="").write(d)
print("ok")
