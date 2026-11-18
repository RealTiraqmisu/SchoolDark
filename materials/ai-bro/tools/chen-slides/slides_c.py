"""สไลด์ 4a (บุคลากร) · 4b (ตั้งค่าบุคลากร)"""
from chenlib import *

def drop(S, rel, chi, ratio, lvl, lab="N", pos=-0.6):
    x, y, w, h = S.geo[chi]; ex = x + ratio * w; dc = S.cx(rel)
    S.link(rel, chi, "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=%g;entryY=0;entryDx=0;entryDy=0;" % ratio, lab, pos, pts=None if abs(dc - ex) < 3 else [(dc, lvl), (ex, lvl)])

def s4a():
    S = Slide("s4a", "สไลด์ 4a บุคลากร", "3.4.4 กลุ่มตารางงานบุคลากร · ข้อมูลบุคลากร", "9 ตาราง",
              [("กลุ่มนี้เก็บอะไร", "ข้อมูลของบุคลากรและครู เป็นต้นทางข้อมูลครูให้ฝั่งทะเบียนเลือกเป็นครูประจำชั้น"),
               ("ตารางหลัก", "• Employees — บุคลากร<br>• JobDetails — ข้อมูลงานและตำแหน่ง"),
               ("จุดออกแบบ", "ประวัติแยกเป็นตารางย่อย 1 คนมีได้หลายแถว เช่น การศึกษา อบรม ใบอนุญาต"),
               ("เชื่อมกลุ่มอื่น", "ประเภท ตำแหน่ง แผนก อยู่ในกลุ่มตั้งค่าบุคลากร")])
    R1, D2, R3, D4, R5 = 150, 266, 396, 562, 692
    S.ent("DEP", "Department", 130, R1, "oth", "(ตั้งค่าบุคลากร)", w=170); S.ent("POS", "Position", 315, R1, "oth", "(ตั้งค่าบุคลากร)", w=170)
    S.ent("STT", "StaffType", 505, R1, "oth", "(ตั้งค่าบุคลากร)", w=170)
    S.ent("EMP", "Employees", 740, R1, "ker", w=150)
    S.ent("CTY", "Countries", 1040, R1, "oth", "(ตั้งค่าโรงเรียน)", w=170); S.ent("SUB", "SubDistricts", 1235, R1, "oth", "(ตั้งค่าโรงเรียน)", w=170)
    S.ent("JOB", "JobDetails", 350, R3, "ent", w=150); S.ent("ADD", "Address", 1030, R3, "ent", w=125)
    for rid, lab, par, cx in [("dDEP", "สังกัด", "DEP", 130), ("dPOS", "ตำแหน่ง", "POS", 315), ("dSTT", "ประเภท", "STT", 505),
                              ("dCTY", "ประเทศ", "CTY", 1040), ("dSUB", "ตำบล", "SUB", 1235)]:
        S.rel(rid, lab, cx, D2); S.link(par, rid, DN, "1", 0.55)
    S.rel("dEJ", "มีข้อมูลงาน", 645, D2); S.link("EMP", "dEJ", "exitX=0.1;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.7, pts=[(680, 236), (645, 236)])
    S.rel("dEA", "มีที่อยู่", 885, D2); S.link("EMP", "dEA", "exitX=0.9;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.7, pts=[(800, 236), (885, 236)])
    drop(S, "dDEP", "JOB", 0.1, 350); drop(S, "dPOS", "JOB", 0.35, 356); drop(S, "dSTT", "JOB", 0.62, 352); drop(S, "dEJ", "JOB", 0.88, 368)
    drop(S, "dEA", "ADD", 0.12, 350); drop(S, "dCTY", "ADD", 0.55, 360); drop(S, "dSUB", "ADD", 0.9, 368)
    kids = [("EDU", "Education", "จบการศึกษา"), ("ROY", "RoyalDecorations", "ได้รับ"), ("LIC", "License", "ถือ"),
            ("TOE", "ToeicScore", "สอบ"), ("TRN", "Training", "เข้ารับ"), ("FAM", "FamilyMember", "มีครอบครัว")]
    x = 60
    for k, lab, rl in kids:
        w = ew(lab); cx = x + w / 2; S.ent(k, lab, cx, R5, "ent"); S.rel("d" + k, rl, cx, D4)
        S.link("EMP", "d" + k, DN + "", "1", 0.8, pts=[(740, 500), (cx, 500)]); S.link("d" + k, k, DN, "N", -0.5); x += w + 55
    return S

def s4b():
    S = Slide("s4b", "สไลด์ 4b ตั้งค่าบุคลากร", "3.4.5 กลุ่มตารางการตั้งค่างานบุคลากร", "11 ตาราง",
              [("กลุ่มนี้เก็บอะไร", "ค่าตั้งต้นของงานบุคคล ได้แก่ ประเภท ตำแหน่ง แผนก เวลาทำงาน กะ บัญชีผู้ใช้ สิทธิ์ และผู้ลงนาม"),
               ("ตารางหลัก", "• User — บัญชีผู้ใช้<br>• Permission — สิทธิ์<br>• Department — แผนก"),
               ("จุดออกแบบ", "บุคลากร 1 คนมีบัญชีได้ 1 บัญชี และกำหนดสิทธิ์รายคนผ่าน UserPermission"),
               ("เชื่อมกลุ่มอื่น", "JobDetails (บุคลากร) อ้างประเภท ตำแหน่ง แผนก จากที่นี่")])
    R1, D2, R3, D4, R5 = 150, 266, 396, 520, 650
    S.ent("EMP", "Employees", 360, R1, "oth", "(บุคลากร)", w=160)
    S.ent("SIG", "Signatory", 140, R3, "ent", w=140); S.ent("USR", "User", 350, R3, "ker", w=125); S.ent("DEP", "Department", 570, R3, "ker", w=150)
    for rid, lab, ch, cx in [("dSIG", "เป็นผู้ลงนาม", "SIG", 140), ("dUSR", "มีบัญชี", "USR", 350), ("dDEP", "เป็นหัวหน้า", "DEP", 570)]:
        S.rel(rid, lab, cx, D2); S.link("EMP", rid, DN, "1", 0.8); S.link(rid, ch, DN, "N", -0.55)
    S.ent("DOC", "DocSignatory", 140, R5, "ent", w=170); S.rel("dDOC", "ลงนามเอกสาร", 140, D4); S.tree("SIG", "dDOC", "DOC")
    S.ent("UPM", "UserPermission", 350, R5, "ent", w=195); S.rel("dUPM", "ได้รับสิทธิ์", 350, D4); S.tree("USR", "dUPM", "UPM")
    S.rel("dPRM", "มอบให้", 565, R5 - 7); S.ent("PRM", "Permission", 730, R5, "ker", w=150)
    S.chain("PRM", "dPRM", "UPM", direction="L")
    S.ent("STT", "StaffType", 900, R1, "ker", w=150); S.ent("POS", "Position", 1180, R1, "ker", w=140)
    S.ent("PST", "PositionStaffType", 1040, R3, "ent", w=225)
    S.rel("dST", "ใช้ตำแหน่ง", 900, D2); S.link("STT", "dST", DN, "1", 0.55); drop(S, "dST", "PST", 0.15, 360)
    S.rel("dPS", "อยู่ในประเภท", 1180, D2); S.link("POS", "dPS", DN, "1", 0.55); drop(S, "dPS", "PST", 0.85, 360)
    S.box("note", "ตารางตั้งค่าที่ไม่มีความสัมพันธ์กับตารางอื่น", 900, 610, 480, 34, "text;html=1;align=left;verticalAlign=middle;fontFamily=TH SarabunPSK;fontSize=22;fontStyle=2;fontColor=#475569;")
    S.ent("SWT", "StaffWorkTime", 1000, 660, "ent", w=185); S.ent("SHF", "Shift", 1230, 660, "ent", w=125)
    return S
