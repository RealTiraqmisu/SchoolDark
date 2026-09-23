/* ======================================================================
 *  school-store.js — ข้อมูล "master data" ของโรงเรียน สำหรับหน้าตั้งค่าโรงเรียน
 *  (settings/school.html) เก็บใน localStorage คนละ key จาก schooldark (sd_*)
 *  และ admission (admitify_*) โดยตั้งใจ — ยังไม่เชื่อมกับข้อมูลเดิมของ 2 ระบบนั้น
 *  (เช่น ห้องเรียนที่สร้างที่นี่ยังไม่ถูกใช้ใน schooldark/app.html view "homeroom"
 *  หรือแผนการเรียนของ admission/course_settings.html) — เป็น mockup ให้ใช้งาน/
 *  ดูตัวอย่างได้ก่อน เชื่อมข้อมูลจริงทีหลัง
 *
 *  ใช้แบบเดียวกับ AdmitifyStore ของฝั่ง admission: get/save/reset ต่อ key เดียว
 * ====================================================================== */

window.SchoolStore = (function () {
  'use strict';

  function seedLevels() {
    var short = ['ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'];
    var stage = ['มัธยมศึกษาตอนต้น', 'มัธยมศึกษาตอนต้น', 'มัธยมศึกษาตอนต้น', 'มัธยมศึกษาตอนปลาย', 'มัธยมศึกษาตอนปลาย', 'มัธยมศึกษาตอนปลาย'];
    return short.map(function (s, i) {
      return { id: 'lv' + (i + 1), short: s, name: 'มัธยมศึกษาปีที่ ' + (i + 1), stage: stage[i], order: i + 1 };
    });
  }

  function seedMajors() {
    return [
      { id: 'mj1', code: 'SCI-MATH', name: 'วิทย์-คณิต', type: 'แผนการเรียน', levelRange: 'ม.4-ม.6', note: 'เน้นวิทยาศาสตร์และคณิตศาสตร์' },
      { id: 'mj2', code: 'ART-MATH', name: 'ศิลป์-คำนวณ', type: 'แผนการเรียน', levelRange: 'ม.4-ม.6', note: '' },
      { id: 'mj3', code: 'ART-LANG', name: 'ศิลป์-ภาษา', type: 'แผนการเรียน', levelRange: 'ม.4-ม.6', note: '' },
      { id: 'mj4', code: 'GEN', name: 'ทั่วไป', type: 'แผนการเรียน', levelRange: 'ม.1-ม.6', note: 'แผนการเรียนพื้นฐานทั่วไป' },
      { id: 'mj5', code: 'COMPUTER', name: 'คอมพิวเตอร์', type: 'แผนการเรียน', levelRange: 'ม.4-ม.6', note: '' }
    ];
  }

  function seedAcademicYears() {
    return [
      { id: 'y2567', year: '2567', term1Start: '2024-05-16', term1End: '2024-10-11', term2Start: '2024-11-01', term2End: '2025-03-31', isCurrent: false },
      { id: 'y2568', year: '2568', term1Start: '2025-05-16', term1End: '2025-10-10', term2Start: '2025-11-01', term2End: '2026-03-31', isCurrent: true },
      { id: 'y2569', year: '2569', term1Start: '2026-05-18', term1End: '2026-10-09', term2Start: '2026-11-02', term2End: '2027-03-31', isCurrent: false }
    ];
  }

  function seedClassrooms() {
    var levels = seedLevels();
    var majorByRoom = { 1: 'วิทย์-คณิต', 2: 'ศิลป์-คำนวณ', 3: 'ศิลป์-ภาษา', 4: 'ทั่วไป', 5: 'คอมพิวเตอร์' };
    var rows = [];
    levels.forEach(function (lv, li) {
      var isUpper = lv.order >= 4; // ม.4-ม.6 มีสาขาแยกตามห้อง, ม.1-3 = ทั่วไปหมด
      var building = 'อาคาร ' + Math.ceil((li + 1) / 2);
      for (var room = 1; room <= 5; room++) {
        rows.push({
          id: 'cr' + lv.order + '-' + room,
          level: lv.short,
          room: room,
          major: isUpper ? majorByRoom[room] : 'ทั่วไป',
          building: building,
          capacity: 40,
          homeroom: ''
        });
      }
    });
    return rows;
  }

  function seedCalendar() {
    return [
      { id: 'ca1', date: '2025-05-16', endDate: '', title: 'เปิดภาคเรียนที่ 1', type: 'term' },
      { id: 'ca2', date: '2025-06-12', endDate: '', title: 'วันไหว้ครู', type: 'event' },
      { id: 'ca3', date: '2025-07-28', endDate: '', title: 'วันเฉลิมพระชนมพรรษา ร.10', type: 'holiday' },
      { id: 'ca4', date: '2025-08-12', endDate: '', title: 'วันแม่แห่งชาติ', type: 'holiday' },
      { id: 'ca5', date: '2025-08-25', endDate: '2025-08-29', title: 'สอบกลางภาคเรียนที่ 1', type: 'exam' },
      { id: 'ca6', date: '2025-10-10', endDate: '', title: 'ปิดภาคเรียนที่ 1', type: 'term' },
      { id: 'ca7', date: '2025-10-13', endDate: '', title: 'วันคล้ายวันสวรรคต ร.9', type: 'holiday' },
      { id: 'ca8', date: '2025-10-23', endDate: '', title: 'วันปิยมหาราช', type: 'holiday' },
      { id: 'ca9', date: '2025-11-01', endDate: '', title: 'เปิดภาคเรียนที่ 2', type: 'term' },
      { id: 'ca10', date: '2025-12-05', endDate: '', title: 'วันพ่อแห่งชาติ', type: 'holiday' },
      { id: 'ca11', date: '2026-01-01', endDate: '', title: 'วันขึ้นปีใหม่', type: 'holiday' },
      { id: 'ca12', date: '2026-01-16', endDate: '', title: 'กีฬาสีประจำปี', type: 'event' },
      { id: 'ca13', date: '2026-02-16', endDate: '2026-02-20', title: 'สอบปลายภาคเรียนที่ 2', type: 'exam' },
      { id: 'ca14', date: '2026-03-31', endDate: '', title: 'ปิดภาคเรียนที่ 2', type: 'term' }
    ];
  }

  var SEEDS = {
    school_levels: seedLevels,
    school_majors: seedMajors,
    school_academic_years: seedAcademicYears,
    school_classrooms: seedClassrooms,
    school_calendar: seedCalendar
  };

  function get(key) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    var seedFn = SEEDS[key];
    return seedFn ? seedFn() : [];
  }

  function save(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) {}
  }

  function reset(key) {
    try { localStorage.removeItem(key); } catch (e) {}
    return get(key);
  }

  function uid(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  }

  return { get: get, save: save, reset: reset, uid: uid };
})();
