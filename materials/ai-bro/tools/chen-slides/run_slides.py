"""สร้างสไลด์ Chen ทีละหน้าเพื่อตรวจ: python -I run_slides.py s2a s4b ...
เขียน test_<ชื่อ>.drawio และ render test_<ชื่อ>.png ลงโฟลเดอร์ CHEN_OUT (ค่าเริ่มต้น = โฟลเดอร์นี้)
ไม่แตะไฟล์ใน ver-present · ประกอบชุดจริงต้องสร้างไฟล์ใหม่เสมอ ห้ามทับ"""
import io, os, sys, subprocess, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.stdout.reconfigure(encoding="utf-8")
SC = os.environ.get("CHEN_OUT", HERE)
fns = {}
for mod in ("slides_a", "slides_b", "slides_c"):
    m = importlib.import_module(mod)
    for n in dir(m):
        if n.startswith("s") and callable(getattr(m, n)) and n[1:2].isdigit():
            fns[n] = getattr(m, n)
for n in sys.argv[1:]:
    print("==", n)
    x = '<mxfile host="drawio">' + fns[n]().xml() + "</mxfile>"
    d = os.path.join(SC, "test_%s.drawio" % n)
    io.open(d, "w", encoding="utf-8", newline="").write(x)
    subprocess.run([r"C:\Program Files\draw.io\draw.io.exe", "-x", "-f", "png", "-s", "1", "-o", d[:-7] + ".png", d], capture_output=True)
