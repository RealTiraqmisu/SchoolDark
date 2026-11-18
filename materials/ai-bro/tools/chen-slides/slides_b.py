"""สไลด์ 3a (ปีการศึกษา) · 3b (ระดับชั้น/ห้อง) · 3c (ที่อยู่ เอกสาร ตั้งค่าระบบ)"""
from chenlib import *

def s3a1():
    S = Slide("s3a1", "สไลด์ 3a ตั้งค่าโรงเรียน · ปีการศึกษา", "3.4.3 กลุ่มตารางการตั้งค่าโรงเรียน (1/3) · ปีการศึกษา", "4 ตาราง",
              [("กลุ่มนี้เก็บอะไร", "ปีการศึกษา ภาคเรียน ปฏิทิน และเวลาเรียนรายภาค ที่ทุกกลุ่มอ้างถึง"),
               ("ตารางหลัก", "• AcademicYears — ปีการศึกษา<br>• Semesters — ภาคเรียน<br>• SchoolCalendar — ปฏิทิน"),
               ("จุดออกแบบ", "มีปีที่ใช้งานอยู่ปีเดียว และภาคเรียนที่ 1 กับ 2 ห้ามซ้ำในปีเดียวกัน"),
               ("เชื่อมกลุ่มอื่น", "รอบรับสมัคร ห้องเรียน และครูประจำชั้น อ้างปีการศึกษาจากที่นี่")])
    Y_A, Y_D1, Y_K, Y_D2, Y_E = 150, 330, 480, 600, 730
    spec = [("SEM", "Semesters", "ent", "", 132, "มีภาคเรียน"), ("CAL", "SchoolCalendar", "ent", "", 187, "มีปฏิทิน"),
            ("AR", "AdmissionRound", "oth", "(รับสมัคร)", 187, "ปีของรอบ"), ("CLS", "Classroom", "oth", "(ทะเบียนนักเรียน)", 190, "ปีของห้อง"),
            ("CHT", "ClassroomHomeroomTeacher", "oth", "(ทะเบียนนักเรียน)", 300, "ปีที่ประจำชั้น")]
    x, cs = 100, {}
    for k, lab, kind, sub, w, rl in spec:
        cs[k] = x + w / 2; x += w + 75
    S.ent("AY", "AcademicYears", (cs["SEM"] + cs["CHT"]) / 2, Y_A, "ker")
    for k, lab, kind, sub, w, rl in spec:
        S.rel("d" + k, rl, cs[k], Y_D1); S.ent(k, lab, cs[k], Y_K, kind, sub, w=w)
        S.tree("AY", "d" + k, k, l1=0.8, l2=-0.6)
    S.rel("dSCH", "มีตารางเวลา", cs["SEM"], Y_D2 + 12); S.ent("SCH", "SchoolSchedule", cs["SEM"], Y_E)
    S.link("SEM", "dSCH", DN, "1", 0.5); S.link("dSCH", "SCH", DN, "N", -0.5)
    return S

def s3a2():
    S = Slide("s3a2", "สไลด์ 3b ตั้งค่าโรงเรียน · ระดับชั้นและห้อง", "3.4.3 กลุ่มตารางการตั้งค่าโรงเรียน (2/3) · ระดับชั้น แผนการเรียน ห้อง", "5 ตาราง",
              [("กลุ่มนี้เก็บอะไร", "ช่วงชั้น ระดับชั้น แผนการเรียน อาคาร และห้องจริงของโรงเรียน"),
               ("ตารางหลัก", "• EducationLevels — ระดับชั้น<br>• StudyProgram — แผนการเรียน<br>• SchoolRoom — ห้องจริง"),
               ("จุดออกแบบ", "ระดับชั้นแถวละชั้น ชี้ไปชั้นถัดไปได้ ใช้ตอนเลื่อนชั้น"),
               ("เชื่อมกลุ่มอื่น", "Classroom (ทะเบียน) และ AdmissionCoursePlan (รับสมัคร) อ้างตารางเหล่านี้")])
    R1, D1, R2, D3, R3 = 150, 266, 396, 562, 722
    S.ent("BLD", "Building", 126, R1, "ent", w=130); S.ent("STG", "EducationStage", 545, R1, "ent", w=187)
    S.rel("rBR", "มีห้อง", 126, D1); S.ent("SR", "SchoolRoom", 126, R2, "ent", w=143)
    S.rel("rSL", "มีระดับชั้น", 329, D1); S.ent("EL", "EducationLevels", 329, R2, "ker", w=198)
    S.rel("rSP", "มีแผนการเรียน", 762, D1); S.ent("SP", "StudyProgram", 762, R2, "ker", w=165)
    S.link("BLD", "rBR", DN, "1", 0.55); S.link("rBR", "SR", DN, "N", -0.55)
    S.link("STG", "rSL", DN, "1", 0.8); S.link("rSL", "EL", DN, "N", -0.55)
    S.link("STG", "rSP", DN, "1", 0.8); S.link("rSP", "SP", DN, "N", -0.55)
    S.rel("rNX", "ชั้นถัดไป", 553, R2 - 7)
    S.link("EL", "rNX", HR, "1", 0.5)
    S.link("rNX", "EL", "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.9;entryY=1;entryDx=0;entryDy=0;", "N", -0.4, pts=[(553, 490), (230 + 0.9 * 198, 490)])
    S.rel("rAC", "เปิดรับเป็น", 985, R2 - 7); S.ent("ACP", "AdmissionCoursePlan", 1245, R2, "oth", "(รับสมัคร)", w=250)
    S.chain("SP", "rAC", "ACP")
    S.ent("CLS", "Classroom", 450, R3, "oth", "(ทะเบียนนักเรียน)", w=190)
    S.rel("rCR", "ใช้ห้องจริง", 126, D3); S.link("SR", "rCR", DN, "1", 0.5)
    S.rel("rCL", "ระดับชั้นของห้อง", 319, D3); S.link("EL", "rCL", "exitX=0.45;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.55)
    S.rel("rCP", "แผนของห้อง", 729, D3); S.link("SP", "rCP", "exitX=0.3;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.55)
    S.into("rCL", "CLS", 0.3, 662); S.into("rCR", "CLS", 0.05, 684); S.into("rCP", "CLS", 0.9, 670)
    return S

def s3b():
    S = Slide("s3b", "สไลด์ 3c ตั้งค่าโรงเรียน · ที่อยู่ เอกสาร ตั้งค่าระบบ", "3.4.3 กลุ่มตารางการตั้งค่าโรงเรียน (3/3) · ที่อยู่ เอกสาร ตั้งค่าระบบ", "10 ตาราง",
              [("กลุ่มนี้เก็บอะไร", "ตารางที่อยู่ของประเทศไทย ข้อมูลโรงเรียน ช่องในฟอร์ม และค่าตั้งค่าระบบ"),
               ("ตารางหลัก", "• SubDistricts — ตำบล<br>• SchoolData — ข้อมูลโรงเรียน<br>• FieldDefinition — ช่องในฟอร์ม"),
               ("จุดออกแบบ", "ใช้ตำบลหาอำเภอ จังหวัด และรหัสไปรษณีย์ ตารางเดียวใช้ร่วมทุกฝั่ง"),
               ("เชื่อมกลุ่มอื่น", "ที่อยู่ของบุคลากร นักเรียน และผู้สมัคร อ้างตำบลจากที่นี่")])
    R1, D1, R2 = 150, 296, 426
    x = 40; cs = {}
    for k, lab, kind, w in [("CTY", "Countries", "ent", 140), ("PRV", "Provinces", "ent", 140), ("DST", "Districts", "ent", 140), ("SUB", "SubDistricts", "ker", 165)]:
        cs[k] = x + w / 2; S.ent(k, lab, cs[k], R1, kind, w=w); x += w
        if k != "SUB":
            rl = {"CTY": "มีจังหวัด", "PRV": "มีอำเภอ", "DST": "มีตำบล"}[k]; rwid = rw(rl); x += 55
            S.rel("r" + k, rl, x + rwid / 2, R1 - 7); x += rwid + 55
    for a, r, b in [("CTY", "rCTY", "PRV"), ("PRV", "rPRV", "DST"), ("DST", "rDST", "SUB")]: S.chain(a, r, b)
    kids = [("ADD", "Address", "oth", "(บุคลากร)", 115, 150), ("SDA", "SchoolData", "ent", "", 411, 143),
            ("STA", "StudentAddress", "oth", "(ทะเบียนนักเรียน)", 635, 190), ("APA", "ApplicantAddress", "oth", "(รับสมัคร)", 894, 208)]
    for k, lab, kind, sub, cx, w in kids: S.ent(k, lab, cx, R2, kind, sub, w=w)
    S.rel("dCTY", "ประเทศ", cs["CTY"], D1); S.link("CTY", "dCTY", DN, "1", 0.5); S.link("dCTY", "ADD", DN, "N", -0.5)
    sx = S.geo["SUB"][0]; sw = S.geo["SUB"][2]
    for (k, lab, kind, sub, cx, w), ratio, lvl in zip(kids, (0.1, 0.3, 0.6, 0.9), (226, 242, 258, 274)):
        rid = {"ADD": "dTB", "SDA": "dSD", "STA": "dST", "APA": "dAP"}[k]; rlab = {"ADD": "ตำบล", "SDA": "ที่ตั้ง", "STA": "ตั้งอยู่ใน", "APA": "ตั้งอยู่ใน"}[k]
        rc = 255 if k == "ADD" else cx
        S.rel(rid, rlab, rc, D1)
        S.link("SUB", rid, "exitX=%g;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" % ratio, "1", 0.8, pts=[(sx + ratio * sw, lvl), (rc, lvl)])
        if k == "ADD": S.link(rid, k, "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.85;entryY=0;entryDx=0;entryDy=0;", "N", -0.5)
        else: S.link(rid, k, DN, "N", -0.5)
    FY = 570
    S.ent("FLD", "FieldDefinition", 1180, FY, "ker", w=210)
    S.rel("dF1", "ชนิดเอกสาร", 985, FY + 126); S.rel("dF2", "ชนิดเอกสาร", 1275, FY + 126)
    S.ent("SDO", "StudentDocument", 985, FY + 256, "oth", "(ทะเบียนนักเรียน)", w=210); S.ent("ADO", "ApplicationDocument", 1275, FY + 256, "oth", "(รับสมัคร)", w=250)
    S.link("FLD", "dF1", "exitX=0.2;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.7); S.link("dF1", "SDO", DN, "N", -0.5)
    S.link("FLD", "dF2", "exitX=0.8;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.7); S.link("dF2", "ADO", DN, "N", -0.5)
    S.box("note", "ตารางตั้งค่าที่ไม่มีความสัมพันธ์กับตารางอื่น", 40, 590, 700, 34, "text;html=1;align=left;verticalAlign=middle;fontFamily=TH SarabunPSK;fontSize=22;fontStyle=2;fontColor=#475569;")
    S.ent("SCS", "StudentColumnSetting", 166, 640, "ent", w=252); S.ent("EMT", "EmailTemplate", 425, 640, "ent", w=176)
    S.ent("SYS", "SystemSetting", 128, 730, "ent", w=176); S.ent("ACT", "ActivityLog", 338, 730, "ent", w=154)
    return S
