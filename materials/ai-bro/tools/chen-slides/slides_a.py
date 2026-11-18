"""สไลด์ 2a (ทะเบียน · นักเรียน) และ 2b (ทะเบียน · ห้องเรียนและครูประจำชั้น)"""
from chenlib import *

def s2a():
    S = Slide("s2a", "สไลด์ 2a ทะเบียน · นักเรียน", "3.4.2 กลุ่มตารางงานทะเบียนนักเรียน (1/2) · ข้อมูลนักเรียน", "6 ตาราง",
              [("กลุ่มนี้เก็บอะไร", "ข้อมูลของคนที่มอบตัวแล้ว ได้แก่ ข้อมูลตัวบุคคลและสถานะการเป็นนักเรียน"),
               ("ตารางหลัก", "• Student — นักเรียน<br>• StudentStatusHistory — ประวัติสถานะ"),
               ("จุดออกแบบ", "นักเรียนคัดลอกข้อมูลจากใบสมัครตอนมอบตัว และเก็บว่ามาจากใบสมัครใบไหน"),
               ("เชื่อมกลุ่มอื่น", "Application → Student<br>ที่อยู่ เอกสาร อ้างตารางกลาง")])
    Y_CH, Y_D1, Y_K, Y_D2, Y_E = 150, 346, 506, 666, 826
    kids = [("ADD", "StudentAddress", "มีที่อยู่"), ("HEA", "StudentHealth", "มีสุขภาพ"), ("GUA", "StudentGuardian", "มีผู้ปกครอง"),
            ("DOC", "StudentDocument", "มีเอกสาร"), ("HIS", "StudentStatusHistory", "มีประวัติสถานะ")]
    x, cs = 40, {}
    for k, lab, rl in kids:
        w = ew(lab); cs[k] = x + w / 2; x += w + 70
    stu = (cs["ADD"] + cs["HIS"]) / 2
    S.ent("STU", "Student", stu, Y_CH, "ker")
    stl = stu - ew("Student") / 2
    S.rel("d0", "มอบตัวแล้วเป็น", stl - 70 - rw("มอบตัวแล้วเป็น") / 2, Y_CH - 7)
    S.ent("APP", "Application", S.cx("d0") - rw("มอบตัวแล้วเป็น") / 2 - 70 - ew("Application") / 2, Y_CH, "oth", "(รับสมัคร)")
    S.chain("APP", "d0", "STU")
    for k, lab, rl in kids:
        S.rel("d" + k, rl, cs[k], Y_D1); S.ent(k, lab, cs[k], Y_K)
        S.link("STU", "d" + k, DN, "1", 0.8); S.link("d" + k, k, DN, "N", -0.6)
    S.ent("SUB", "SubDistricts", cs["ADD"], Y_E, "oth", "(ตั้งค่าโรงเรียน)"); S.rel("dS", "ตั้งอยู่ใน", cs["ADD"], Y_D2)
    S.up("SUB", "dS", "ADD")
    S.ent("FLD", "FieldDefinition", cs["DOC"], Y_E, "oth", "(ตั้งค่าโรงเรียน)"); S.rel("dF", "ชนิดเอกสาร", cs["DOC"], Y_D2)
    S.up("FLD", "dF", "DOC")
    return S

def s2b():
    S = Slide("s2b", "สไลด์ 2b ทะเบียน · ห้องเรียนและครูประจำชั้น", "3.4.2 กลุ่มตารางงานทะเบียนนักเรียน (2/2) · ห้องเรียน", "3 ตาราง",
              [("กลุ่มนี้เก็บอะไร", "ห้องเรียนในแต่ละปี ครูประจำชั้นของห้อง และประวัติห้องของนักเรียน"),
               ("ตารางหลัก", "• Classroom — ห้องเรียน<br>• StudentClassHistory — ประวัติห้อง<br>• ClassroomHomeroomTeacher<br>&nbsp;&nbsp;— ครูประจำชั้น"),
               ("จุดออกแบบ", "เก็บประวัติห้องแยกตาราง ย้อนดูได้ว่าปีไหนอยู่ห้องไหน และห้องหนึ่งมีครูประจำชั้นได้หลายคน"),
               ("เชื่อมกลุ่มอื่น", "ClassroomHomeroomTeacher<br>→ Employees")])
    R1, D2, R3, D4, R5 = 150, 266, 456, 620, 790
    S.ent("EL", "EducationLevels", 200, R1, "oth", "(ตั้งค่าโรงเรียน)")
    S.ent("SP", "StudyProgram", 430, R1, "oth", "(ตั้งค่าโรงเรียน)")
    S.ent("SR", "SchoolRoom", 640, R1, "oth", "(ตั้งค่าโรงเรียน)")
    S.ent("AY", "AcademicYears", 880, R1, "oth", "(ตั้งค่าโรงเรียน)", w=200)
    S.ent("EMP", "Employees", 1290, R1, "oth", "(บุคลากร)", w=140)
    S.ent("CLS", "Classroom", 620, R3, "ker", w=140)
    S.ent("CHT", "ClassroomHomeroomTeacher", 1150, R3, "ent", w=300)
    for r, lab, par, cx in [("rEL", "ระดับชั้นของห้อง", "EL", 200), ("rSP", "แผนของห้อง", "SP", 430), ("rSR", "ใช้ห้องจริง", "SR", 640)]:
        S.rel(r, lab, cx, D2); S.link(par, r, DN, "1", 0.55)
    S.rel("rAY1", "ปีของห้อง", 796, D2); S.link("AY", "rAY1", "exitX=0.08;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.55)
    S.rel("rAY2", "ปีที่ประจำชั้น", 964, D2); S.link("AY", "rAY2", "exitX=0.92;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;", "1", 0.55)
    S.rel("rEMP", "ประจำชั้น", 1290, D2); S.link("EMP", "rEMP", DN, "1", 0.55)
    S.into("rSP", "CLS", 0.35, 366); S.into("rEL", "CLS", 0.1, 384); S.into("rSR", "CLS", 0.643, 400); S.into("rAY1", "CLS", 0.9, 366)
    S.into("rAY2", "CHT", 0.1, 380); S.into("rEMP", "CHT", 0.9, 380)
    S.rel("rCH", "มีครูประจำชั้น", 845, R3 - 7); S.chain("CLS", "rCH", "CHT")
    S.rel("rN", "มีนักเรียน", 620, D4); S.link("CLS", "rN", DN, "1", 0.55)
    S.ent("SCH", "StudentClassHistory", 620, R5, "ent", w=245); S.link("rN", "SCH", DN, "N", -0.55)
    S.ent("STU", "Student", 115, R5, "oth", "(หน้าก่อน)", w=140)
    S.rel("rH", "มีประวัติห้อง", 341, R5 - 7); S.chain("STU", "rH", "SCH")
    return S
