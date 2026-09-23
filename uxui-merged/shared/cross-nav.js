/* ======================================================================
 *  cross-nav.js — sidebar เมนูรวมจุดเดียวของทั้ง 2 ระบบใน uxui-merged
 *
 *  ไฟล์นี้คือ "แหล่งข้อมูลเมนูจุดเดียว" ของทั้งโปรเจกต์ — sidebar ทั้งอัน
 *  (โลโก้ / กลุ่มเมนู / เมนูย่อย / badge / user footer) ถูกสร้างจากที่นี่
 *  ที่เดียว แล้วฝัง (inject) เข้าไปในทุกหน้า ไม่ว่าจะเป็น schooldark/* หรือ
 *  admission/* — เพิ่ม/ลบ/แก้เมนูใด ๆ ให้แก้ที่ NAV_GROUPS ด้านล่างนี้ที่เดียว
 *
 *  วิธีใช้ในหน้าเว็บ:
 *    - หน้า schooldark (app.html / leave-features.html): วางสคริปต์นี้
 *      "แทนที่" เนื้อหาเดิมข้างใน <aside class="sidebar" id="sidebar"> — สคริปต์
 *      จะ insert เมนูเข้าไปในตำแหน่งของตัวเอง (เป็นลูกของ aside เดิม) แล้วปล่อยให้
 *      app.js / อินไลน์สคริปต์ท้ายไฟล์ (ของเพื่อน) bind การคลิกเมนูภายในหน้าเดียวกัน
 *      เหมือนเดิมทุกอย่าง (data-module/data-view/data-step/data-tab/data-subtab)
 *    - หน้า admission/*: วางสคริปต์นี้เป็นสิ่งแรกหลัง <body> — ไม่มี <aside> อยู่ก่อน
 *      สคริปต์จะสร้าง <aside class="sidebar" id="sidebar"> ให้เองแบบ fixed ทางซ้าย
 *      แล้วเลื่อนเนื้อหาเดิมของหน้าด้วย CSS (ดู cross-nav.css)
 *
 *  ทุกหน้าที่ใช้สคริปต์นี้ต้องโหลด shared/cross-nav.css คู่กันด้วยเสมอ
 *  (ดูวิธีต่อหน้าใหม่ในคอมเมนต์ท้ายไฟล์นี้)
 * ====================================================================== */

(function () {
  'use strict';

  var thisScript = document.currentScript;
  if (!thisScript) return; // ไม่รองรับการโหลดแบบ async/defer

  var COLLAPSE_KEY = 'xnav-collapsed';
  var SCROLL_KEY = 'xnav-sidebar-scroll';

  // ------------------------------------------------------------------
  // ตำแหน่งปัจจุบัน: คำนวณจาก URL เทียบกับ root ของ uxui-merged เสมอ
  // คืนค่า เช่น 'schooldark/app.html', 'admission/students.html', 'index.html'
  // ------------------------------------------------------------------
  function currentPage() {
    var path = location.pathname.replace(/\\/g, '/');
    var file = path.split('/').pop() || 'index.html';
    if (/\/schooldark\//.test(path)) return 'schooldark/' + file;
    if (/\/admission\//.test(path)) return 'admission/' + file;
    if (/\/settings\//.test(path)) return 'settings/' + file;
    return file; // หน้า hub ที่ root
  }
  var CURRENT = currentPage();
  var CURRENT_DIR = CURRENT.indexOf('/') !== -1 ? CURRENT.split('/')[0] : '';
  var IS_SCHOOLDARK = CURRENT_DIR === 'schooldark';
  var IS_ADMISSION = CURRENT_DIR === 'admission';
  // หน้า hub ที่ root (index.html) มีดีไซน์การ์ดกลางหน้าของตัวเองอยู่แล้ว — ไม่ต้อง
  // แปะ sidebar ทับ ให้แค่เติมการ์ดผ่าน #cross-nav-hub เหมือนเดิม
  var IS_HUB = !CURRENT_DIR && CURRENT === 'index.html';

  // หน้าย่อยของ admission ที่เข้าถึงจากเมนู "ข้อมูลนักเรียน" (ไม่มีเมนูของตัวเอง)
  var ADMISSION_ALIAS = {
    'profile.html': 'students.html', 'edit.html': 'students.html', 'notify.html': 'students.html',
    'apply.html': 'index.html' // เปิดจากปุ่ม "ลงทะเบียนผู้สมัครใหม่" บนบอร์ดรับสมัคร
  };

  // ------------------------------------------------------------------
  // คำนวณ relative href จากหน้าปัจจุบันไปหน้าเป้าหมาย (ทุกหน้าลึก 0-1 ชั้นจาก root)
  // ------------------------------------------------------------------
  function hrefTo(targetPage) {
    var targetDir = targetPage.indexOf('/') !== -1 ? targetPage.split('/')[0] : '';
    if (targetDir === CURRENT_DIR) {
      // อยู่โฟลเดอร์เดียวกัน (รวมถึงกรณี root-to-root) — ใช้ path แบบเดิมได้เลย
      return CURRENT_DIR ? targetPage.split('/')[1] : targetPage;
    }
    if (!CURRENT_DIR) return targetPage; // จาก root ไปโฟลเดอร์ย่อย
    if (!targetDir) return '../' + targetPage; // จากโฟลเดอร์ย่อยไป root
    return '../' + targetPage; // จากโฟลเดอร์ย่อยหนึ่งไปอีกโฟลเดอร์ย่อยหนึ่ง
  }

  function hashFor(item, child) {
    var parts = [];
    if (item.module) parts.push('m=' + item.module);
    if (item.view) parts.push('v=' + item.view);
    if (child) {
      if (child.step) parts.push('step=' + child.step);
      if (child.tab) parts.push('tab=' + child.tab);
      if (child.subtab) parts.push('subtab=' + child.subtab);
    }
    return parts.length ? '#' + parts.join('&') : '';
  }

  // ------------------------------------------------------------------
  // ไอคอน — ชุดเดียวกันทั้งแอป (สไตล์ feather/lucide outline, ใช้ path จาก
  // ไอคอนเดิมของ schooldark/app.html เป็นหลัก เพิ่มบางตัวให้ครบฝั่ง admission)
  // ------------------------------------------------------------------
  var ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    graduation: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    idcard: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    tag: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    inbox: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    ticket: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1.5"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
    clipboardList: '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/>',
    doorOpen: '<path d="M13 4v16"/><path d="M13 4l6 2v14"/><path d="M19 20H5V6l8-4"/>',
    chevron: '<polyline points="6 9 12 15 18 9"/>'
  };
  function svg(name, cls) {
    return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || '') + '</svg>';
  }

  // ------------------------------------------------------------------
  // NAV_GROUPS — แหล่งข้อมูลเมนูจุดเดียวของทั้งโปรเจกต์
  // แต่ละ item: { id?, icon, label, page, module?, view?, badgeId?, children?, hubOnly?,
  //               anchor?, shortcut?, section? }
  // children: [{ label, step? | tab? | subtab? }]           — เมนูย่อยในหน้าเดียวกัน (SPA)
  //        หรือ [{ label, page, module?, view?, hash?, desc? }] — เมนูย่อยที่ลิงก์ไปคนละไฟล์
  //             (ถ้ามี view + page ตรงกับหน้าปัจจุบัน จะกลายเป็น submenu-item แบบ SPA แทน)
  // hubOnly: true = แสดงแค่ในการ์ดหน้า hub ไม่แสดงใน sidebar
  // anchor: item เป็นทางลัด (shortcut) ไปหน้า `page` แบบมี hash ต่อท้าย (#<anchor>) —
  //         ไม่นับเป็น "หน้าปัจจุบัน" ของ item นี้ (ไม่ทำให้ item ไฮไลต์)
  // shortcut: true = ใส่คลาส .menu-shortcut (สไตล์เส้นประจาง ๆ) ให้ดูรู้ว่าเป็นทางลัด
  // section: id ของ <section> ในหน้า settings/index.html ที่ item นี้ตรงกับหมวดไหน
  // desc: คำอธิบายสั้น ๆ ใต้ label ของ child ตอนแสดงในการ์ดหน้า settings/index.html
  // ------------------------------------------------------------------
  var SD_APP = 'schooldark/app.html';
  var SD_LEAVE = 'schooldark/leave-features.html';

  var NAV_GROUPS = [
    {
      label: 'ภาพรวมระบบ',
      items: [
        { id: 'menu-dashboard', icon: 'dashboard', label: 'แดชบอร์ดภาพรวม', page: SD_APP, module: 'dashboard', view: 'dashboard-main' }
      ]
    },
    {
      label: 'ระบบบริหารการลา',
      items: [
        { id: 'menu-leave-form', icon: 'fileText', label: 'ยื่นคำขอลา', page: SD_APP, module: 'leave', view: 'leave-form' },
        {
          id: 'menu-leave-approve', icon: 'checkCircle', label: 'อนุมัติการลา', page: SD_APP, module: 'leave', view: 'leave-approve',
          badgeId: 'sidebar-approval-badge', badgeClass: 'badge-pending',
          children: [
            { label: 'รายการคำขอ', tab: 'requests' },
            { label: 'ประวัติการลารายบุคคล', tab: 'profile' }
          ]
        },
        // shortcut → ศูนย์รวมการตั้งค่า (คง id เดิมไว้ เพราะ schooldark/index.js:264 ซ่อน/แสดงตาม role)
        { id: 'menu-leave-settings', icon: 'gear', label: 'ตั้งค่าการลา', page: 'settings/index.html', anchor: 'leave', shortcut: true }
      ]
    },
    {
      label: 'ระบบบุคลากร',
      items: [
        { id: 'menu-directory', icon: 'users', label: 'รายชื่อบุคลากร', page: SD_APP, module: 'personnel', view: 'directory' },
        {
          id: 'menu-basic-info', icon: 'user', label: 'ข้อมูลพื้นฐาน', page: SD_APP, module: 'personnel', view: 'basic-info',
          children: [
            { label: 'ประวัติส่วนตัว', subtab: 'personal-profile' },
            { label: 'ที่อยู่ตามทะเบียนบ้าน', subtab: 'registered-address' },
            { label: 'ที่อยู่ติดต่อได้', subtab: 'contact-address' },
            { label: 'ข้อมูลครอบครัว', subtab: 'family-info' }
          ]
        },
        {
          id: 'menu-education', icon: 'graduation', label: 'การศึกษา & อบรม', page: SD_APP, module: 'personnel', view: 'education',
          children: [
            { label: 'ข้อมูลการศึกษา', subtab: 'edu-background' },
            { label: 'ข้อมูลเกียรติคุณ', subtab: 'edu-honors' },
            { label: 'ประวัติอบรม ดูงาน', subtab: 'edu-training' },
            { label: 'คะแนน TOEIC / อื่นๆ', subtab: 'edu-toeic' }
          ]
        },
        {
          id: 'menu-job-license', icon: 'idcard', label: 'ตำแหน่ง & ใบประกอบฯ', page: SD_APP, module: 'personnel', view: 'job-license',
          children: [
            { label: 'ข้อมูลตำแหน่งงาน', subtab: 'job-position-tab' },
            { label: 'ใบอนุญาตประกอบวิชาชีพ', subtab: 'professional-license-tab' },
            { label: 'ประวัติรับเครื่องราชฯ', subtab: 'royal-decoration-tab' }
          ]
        },
        {
          id: 'menu-import-hub', icon: 'upload', label: 'นำเข้าข้อมูล', page: SD_APP, module: 'personnel', view: 'import-hub',
          children: [
            { label: 'อัพโหลดไฟล์ Excel', subtab: 'import-excel-tab' },
            { label: 'อัพโหลดรูปภาพประจำตัวบุคลากร', subtab: 'import-photo-tab' }
          ]
        },
        { id: 'menu-print-studio', icon: 'printer', label: 'พิมพ์ & QR Studio', page: SD_APP, module: 'personnel', view: 'print-studio' },
        { icon: 'gear', label: 'ตั้งค่าบุคลากร', page: 'settings/index.html', anchor: 'personnel', shortcut: true }
      ]
    },
    {
      label: 'การอนุมัติ',
      items: [
        {
          icon: 'checkCircle', label: 'อนุมัติการลานักเรียน', page: SD_LEAVE, view: 'approve',
          badgeId: 'sidebar-approve-badge', badgeClass: 'danger',
          children: [
            { label: 'รายการคำขอ', tab: 'requests' },
            { label: 'ประวัติการลา', tab: 'leave-history' }
          ]
        }
      ]
    },
    {
      label: 'รายงาน & บัตรอนุญาต',
      items: [
        {
          icon: 'ticket', label: 'ยื่นบัตรขออนุญาต', page: SD_LEAVE, view: 'leave-card',
          children: [
            { label: '1. ค้นหานักเรียน', step: '1' },
            { label: '2. เลือกประเภท', step: '2' },
            { label: '3. กรอกรายละเอียด', step: '3' }
          ]
        },
        {
          icon: 'calendar', label: 'รายการบัตรขออนุญาต', page: SD_LEAVE, view: 'ticket-calendar',
          badgeId: 'sidebar-ticket-badge', badgeClass: 'danger',
          children: [
            { label: 'รายการบัตรขออนุญาตของนักเรียน', tab: 'tk-list' },
            { label: 'ประวัติรายบุคคล', tab: 'personal' },
            { label: 'สรุปรวมตามชั้นเรียน', tab: 'summary' }
          ]
        },
        { icon: 'users', label: 'รายชื่อบุคลากรและอาจารย์', page: SD_LEAVE, view: 'employees' }
      ]
    },
    {
      label: 'การลาเรียนของนักเรียน',
      items: [
        {
          icon: 'fileText', label: 'ยื่นขอลาของนักเรียน', page: SD_LEAVE, view: 'sl-submit',
          children: [
            { label: '1. ค้นหานักเรียน', step: '1' },
            { label: '2. เลือกประเภทการลา', step: '2' },
            { label: '3. กรอกรายละเอียด', step: '3' }
          ]
        },
        { icon: 'gear', label: 'ตั้งค่าการลาเรียน', page: 'settings/index.html', anchor: 'leave', shortcut: true }
      ]
    },
    {
      label: 'รับสมัคร & ทะเบียนนักเรียน',
      items: [
        { icon: 'clipboardList', label: 'บอร์ดรับสมัคร', page: 'admission/index.html' },
        { icon: 'users', label: 'ข้อมูลนักเรียน', page: 'admission/students.html' },
        { icon: 'gear', label: 'ตั้งค่ารับสมัคร', page: 'settings/index.html', anchor: 'admission', shortcut: true },
        // hubOnly: แสดงเฉพาะการ์ดในหน้า hub ไม่แสดงใน sidebar (เข้าได้จากปุ่มบนบอร์ดรับสมัครอยู่แล้ว)
        { icon: 'userPlus', label: 'พอร์ทัลสมัครเรียน', page: 'admission/apply.html', hubOnly: true },
        { icon: 'search', label: 'ตรวจสอบสถานะผู้สมัคร', page: 'admission/status.html' }
      ]
    },
    {
      id: 'settings',
      label: 'การตั้งค่า',
      items: [
        { icon: 'dashboard', label: 'ศูนย์รวมการตั้งค่า', page: 'settings/index.html' },
        {
          icon: 'home', label: 'ตั้งค่าโรงเรียน', page: 'settings/index.html', anchor: 'school', section: 'school',
          children: [
            { label: 'ข้อมูลโรงเรียน & ตั้งค่าระบบ', page: SD_APP, module: 'settings', view: 'general', desc: 'ชื่อโรงเรียน รหัส ที่อยู่ ปีการศึกษาปัจจุบัน' },
            { label: 'ข้อมูลปีการศึกษา', page: 'settings/school.html', hash: 'tab=years', desc: 'ปีการศึกษาและช่วงภาคเรียน' },
            { label: 'ข้อมูลระดับการศึกษา', page: 'settings/school.html', hash: 'tab=levels', desc: 'ระดับชั้นและช่วงชั้น' },
            { label: 'ข้อมูลสาขางาน-สาขาวิชา', page: 'settings/school.html', hash: 'tab=majors', desc: 'แผนการเรียน สาขาวิชา สาขางาน' },
            { label: 'ข้อมูลห้องเรียน', page: 'settings/school.html', hash: 'tab=classrooms', desc: 'ห้องเรียน อาคาร ความจุ' },
            { label: 'ปฏิทินโรงเรียน', page: 'settings/school.html', hash: 'tab=calendar', desc: 'วันหยุด กิจกรรม วันสอบ' },
            { label: 'ข้อมูลครูประจำชั้น', page: SD_APP, module: 'settings', view: 'homeroom', desc: 'ครูประจำชั้น/ที่ปรึกษาแต่ละห้อง' }
          ]
        },
        {
          icon: 'users', label: 'ตั้งค่าบุคลากร', page: 'settings/index.html', anchor: 'personnel', section: 'personnel',
          children: [
            { label: 'วันเวลาเข้าออก', page: SD_APP, module: 'settings', view: 'schedule', desc: 'เวลาทำงาน กะ วันหยุด' },
            { label: 'สิทธิ์ผู้ใช้งาน', page: SD_APP, module: 'settings', view: 'permissions', desc: 'บทบาทและสิทธิ์การเข้าถึงระบบ' },
            { label: 'ผู้ลงนามเอกสาร', page: SD_APP, module: 'settings', view: 'signatories', desc: 'รายชื่อผู้มีสิทธิ์ลงนามเอกสาร' },
            { label: 'ตั้งค่าประเภทบุคลากร', page: SD_APP, module: 'settings', view: 'staff-types', desc: 'ข้าราชการ/ครูอัตราจ้าง/ผู้บริหาร ฯลฯ' },
            { label: 'ตั้งค่าตำแหน่ง', page: SD_APP, module: 'settings', view: 'positions', desc: 'ตำแหน่งงานของบุคลากร' },
            { label: 'ตั้งค่าแผนก/กลุ่มสาระฯ', page: SD_APP, module: 'settings', view: 'departments', desc: 'กลุ่มสาระการเรียนรู้และแผนก' }
          ]
        },
        {
          icon: 'calendar', label: 'ตั้งค่าการลา', page: 'settings/index.html', anchor: 'leave', section: 'leave',
          children: [
            { label: 'ตั้งค่าการลาบุคลากร', page: SD_APP, module: 'leave', view: 'leave-settings', desc: 'รอบปี ผู้อนุมัติ โควตา เงื่อนไข' },
            { label: 'ตั้งค่าการลาเรียนนักเรียน', page: SD_LEAVE, view: 'student-leave-settings', desc: 'ประเภทการลา ผู้อนุมัติ โควตา' }
          ]
        },
        {
          icon: 'clipboardList', label: 'ตั้งค่ารับสมัคร', page: 'settings/index.html', anchor: 'admission', section: 'admission',
          children: [
            { label: 'ตั้งค่าฟอร์มรับสมัคร', page: 'admission/settings.html', desc: 'ฟิลด์ฟอร์มรับสมัครออนไลน์' },
            { label: 'ตั้งค่าแผนการเรียน & กำหนดการ', page: 'admission/course_settings.html', desc: 'แผนการเรียนและกำหนดการรับสมัคร' },
            { label: 'ตั้งค่าห้องสอบ', page: 'admission/room_exam_settings.html', desc: 'จัดห้องสอบคัดเลือก' },
            { label: 'ตั้งค่าคอลัมน์ตาราง', page: 'admission/student_field_settings.html', desc: 'คอลัมน์ตารางข้อมูลนักเรียน' }
          ]
        }
      ]
    }
  ];

  var HUB = { label: 'หน้าแรก (รวมทุกระบบ)', page: 'index.html' };

  // ------------------------------------------------------------------
  // active state ของ item หนึ่ง ๆ เทียบกับหน้าปัจจุบัน
  // (ฝั่ง schooldark: JS ของแต่ละหน้าเป็นคนจัดการ active state เองต่อจากนี้
  //  เราแค่ให้ "active เริ่มต้น" ตอน render ครั้งแรกเพื่อกันหน้าเปล่าตอนโหลด)
  // ------------------------------------------------------------------
  function isCurrentPage(pageName) {
    if (pageName === CURRENT) return true;
    if (IS_ADMISSION) {
      var file = CURRENT.split('/')[1];
      return ADMISSION_ALIAS[file] && ('admission/' + ADMISSION_ALIAS[file]) === pageName;
    }
    return false;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ------------------------------------------------------------------
  // Render: สร้าง <li> หนึ่งตัวสำหรับ item (+ children ถ้ามี)
  // ------------------------------------------------------------------
  function renderItem(item) {
    var samePage = item.page === CURRENT; // อยู่หน้าเดียวกันเป๊ะ ๆ (ไม่ใช่แค่ alias)
    var hasChildren = !!(item.children && item.children.length);
    // item หลักถือว่า active ถ้าหน้าปัจจุบันเป็นหน้าของมันเอง หรือเป็นหน้าของเมนูย่อยตัวไหนก็ได้
    // (item.anchor = ทางลัด ไม่นับหน้าเป้าหมายเป็น "หน้าปัจจุบัน" ของตัวเอง; child.view = SPA
    // view ของ schooldark ก็ไม่นับ ไม่งั้นกลุ่มตั้งค่าจะกางค้างทุกครั้งที่อยู่ใน app.html)
    var isActive = (!item.anchor && isCurrentPage(item.page)) || (hasChildren && item.children.some(function (c) {
      return c.page && !c.view && isCurrentPage(c.page);
    }));

    // attribute สำหรับ item ที่อยู่หน้าเดียวกัน (ให้ JS เดิมของหน้านั้น bind SPA switching)
    var attrs = '';
    var href = '';
    if (item.anchor) {
      // ทางลัด (shortcut) → ไปศูนย์รวมการตั้งค่าที่หมวดนั้นเลย ไม่ใช่ SPA item
      href = hrefTo(item.page) + '#' + item.anchor;
    } else if (samePage && (item.module || item.view)) {
      if (item.module) attrs += ' data-module="' + item.module + '"';
      if (item.view) attrs += ' data-view="' + item.view + '"';
      href = 'javascript:void(0)';
    } else {
      href = hrefTo(item.page) + hashFor(item, null);
    }

    var badge = item.badgeId
      ? '<span id="' + item.badgeId + '" class="badge ' + item.badgeClass + '" style="margin-left:auto;padding:2px 8px;font-size:10px;display:none;">0</span>'
      : '';

    var idAttr = item.id ? ' id="' + item.id + '"' : '';
    var itemCls = 'menu-item' + (isActive ? ' active' : '') + (item.shortcut ? ' menu-shortcut' : '');
    var linkOpen = '<a class="' + itemCls + '" href="' + escapeHtml(href) + '"' + attrs + idAttr + '>';
    var linkInner = svg(item.icon) + '<span>' + escapeHtml(item.label) + '</span>' + badge;

    if (!hasChildren) {
      return '<li>' + linkOpen + linkInner + '</a></li>';
    }

    var childLinks = item.children.map(function (child) {
      if (child.page) {
        if (child.view && child.page === CURRENT) {
          // view ของ schooldark ในหน้าเดียวกัน → ให้ app.js / leave-features bind แบบ SPA เดิม
          var vattrs = (child.module ? ' data-module="' + child.module + '"' : '') + ' data-view="' + child.view + '"';
          return '<li><a class="submenu-item" href="javascript:void(0)"' + vattrs + '>' + escapeHtml(child.label) + '</a></li>';
        }
        // เมนูย่อยที่ลิงก์ไปคนละไฟล์จริง ๆ — เป็น .submenu-link เสมอ (ห้ามเป็น .submenu-item
        // เพราะ app.js / leave-features.html จะดัก click แล้ว preventDefault ทุกตัว)
        var chash = child.hash ? '#' + child.hash : hashFor(child, null);
        var cActive = !child.view && isCurrentPage(child.page) && (!child.hash || location.hash === '#' + child.hash);
        return '<li><a class="submenu-link' + (cActive ? ' active' : '') + '" href="' + escapeHtml(hrefTo(child.page) + chash) + '">' + escapeHtml(child.label) + '</a></li>';
      }
      if (samePage) {
        var cattrs = '';
        if (item.module) cattrs += ' data-module="' + item.module + '"';
        if (item.view) cattrs += ' data-view="' + item.view + '"';
        if (child.step) cattrs += ' data-step="' + child.step + '"';
        if (child.tab) cattrs += ' data-tab="' + child.tab + '"';
        if (child.subtab) cattrs += ' data-subtab="' + child.subtab + '"';
        return '<li><a class="submenu-item" href="javascript:void(0)"' + cattrs + '>' + escapeHtml(child.label) + '</a></li>';
      }
      // ลิงก์ข้ามหน้า: ใช้ class ต่างจาก submenu-item โดยตั้งใจ — ทั้ง app.js (bindSubmenus)
      // และสคริปต์ท้าย leave-features.html ดัก .submenu-item ทุกตัวด้วย preventDefault()
      // ถ้าใช้ class เดิม ลิงก์ข้ามหน้าจะกดไม่ไปไหนเลย (ดู ../CLAUDE.md)
      var chref = hrefTo(item.page) + hashFor(item, child);
      return '<li><a class="submenu-link" href="' + escapeHtml(chref) + '">' + escapeHtml(child.label) + '</a></li>';
    }).join('');

    return (
      '<li class="menu-item-group' + (isActive ? ' expanded' : '') + '">' +
      '<div class="menu-item-row">' + linkOpen + linkInner + '</a>' +
      '<button type="button" class="submenu-toggle" aria-label="แสดงหัวข้อย่อย" aria-expanded="' + (isActive ? 'true' : 'false') + '">' + svg('chevron') + '</button>' +
      '</div>' +
      '<ul class="submenu">' + childLinks + '</ul>' +
      '</li>'
    );
  }

  function renderGroups() {
    return NAV_GROUPS.map(function (group, gi) {
      var itemsHtml = group.items.filter(function (it) { return !it.hubOnly; }).map(renderItem).join('');
      return (gi ? '<div class="sidebar-divider"></div>' : '') +
        '<li><p class="menu-label">' + escapeHtml(group.label) + '</p></li>' + itemsHtml;
    }).join('');
  }

  function renderHomeLink() {
    var href = hrefTo(HUB.page);
    return '<li><a class="menu-item' + (CURRENT === HUB.page ? ' active' : '') + '" href="' + escapeHtml(href) + '">' + svg('home') + '<span>' + escapeHtml(HUB.label) + '</span></a></li>';
  }

  // ------------------------------------------------------------------
  // Footer (ป้ายผู้ใช้งาน) — คง id เดิมของ schooldark ไว้เผื่อสคริปต์ของเพื่อน
  // (index.js) อ่าน/เขียนค่าเวลาสลับ role จำลอง; หน้าอื่นใช้ค่าเริ่มต้นเฉย ๆ
  // ------------------------------------------------------------------
  function renderFooter() {
    var avatar = 'AD', name = 'แอดมิน ระบบ', role = 'ผู้ดูแลระบบ';
    if (IS_SCHOOLDARK && CURRENT.indexOf('leave-features') !== -1) {
      avatar = 'สท'; name = 'สมปอง ทองดี'; role = 'เจ้าหน้าที่บุคคล';
    } else if (IS_ADMISSION) {
      avatar = 'รบ'; name = 'ระบบรับสมัคร'; role = 'Admitify Spark';
    } else if (CURRENT_DIR === 'settings') {
      avatar = 'ตค'; name = 'ศูนย์ตั้งค่า'; role = 'ทุกระบบ';
    }
    return (
      '<div class="sidebar-footer">' +
      '<div class="user-profile-badge">' +
      '<div class="user-avatar" id="avatar-display">' + avatar + '</div>' +
      '<div class="user-info">' +
      '<div class="user-name" id="username-display">' + escapeHtml(name) + '</div>' +
      '<div class="user-role" id="userrole-display">' + escapeHtml(role) + '</div>' +
      '</div></div></div>'
    );
  }

  function logoHref() {
    return IS_SCHOOLDARK ? (CURRENT.indexOf('app.html') !== -1 ? 'javascript:void(0)' : hrefTo(SD_APP)) : hrefTo(HUB.page);
  }

  function renderSidebarInner() {
    var collapsed = false;
    try { collapsed = localStorage.getItem(COLLAPSE_KEY) === '1'; } catch (e) {}
    var asideClass = 'sidebar' + (collapsed ? ' collapsed' : '');

    var logo =
      '<div class="sidebar-logo">' +
      '<a href="' + logoHref() + '" class="logo-group" style="text-decoration:none;color:inherit;">' +
      '<svg class="logo-icon" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>' +
      '<div><h1>SchoolDark</h1><span>ระบบบริหารโรงเรียน</span></div>' +
      '</a>' +
      '<button class="sidebar-toggle-btn" id="sidebar-toggle-btn" title="ย่อ/ขยายเมนู">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
      '</button></div>';

    var menu = '<ul class="sidebar-menu">' + renderGroups() + renderHomeLink() + '</ul>';

    return { html: logo + menu + renderFooter(), asideClass: asideClass, collapsed: collapsed };
  }

  // ------------------------------------------------------------------
  // Inject: สอง scenario — (A) สคริปต์อยู่ใน <aside id="sidebar"> อยู่แล้ว
  // (schooldark) (B) สคริปต์เป็นลูกแรกของ <body> (admission/หน้าที่ไม่มี aside)
  // (ข้ามทั้งบล็อกนี้บนหน้า hub — ดู IS_HUB ด้านบน)
  // ------------------------------------------------------------------
  if (!IS_HUB) {
  var built = renderSidebarInner();
  var hostAside = thisScript.closest('aside.sidebar');
  var sidebarEl;

  if (hostAside) {
    hostAside.innerHTML = built.html;
    if (built.collapsed) hostAside.classList.add('collapsed');
    sidebarEl = hostAside;
  } else {
    sidebarEl = document.createElement('aside');
    sidebarEl.className = built.asideClass;
    sidebarEl.id = 'sidebar';
    sidebarEl.innerHTML = built.html;
    thisScript.insertAdjacentElement('afterend', sidebarEl);
    document.documentElement.classList.add('xnav-fixed-layout');
    if (built.collapsed) document.documentElement.classList.add('xnav-collapsed');
  }

  // ------------------------------------------------------------------
  // Interactivity ที่ cross-nav.js ต้องดูแลเอง (หน้าที่ไม่มี app.js/leave-features
  // คอยรัน bindSubmenus/bindSidebarToggle ให้ — คือทุกหน้านอก schooldark/*)
  // ------------------------------------------------------------------
  if (!IS_SCHOOLDARK) {
    sidebarEl.querySelectorAll('.submenu-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var group = btn.closest('.menu-item-group');
        if (group) group.classList.toggle('expanded');
      });
    });
    var toggleBtn = sidebarEl.querySelector('#sidebar-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var nowCollapsed = sidebarEl.classList.toggle('collapsed');
        document.documentElement.classList.toggle('xnav-collapsed', nowCollapsed);
        try { localStorage.setItem(COLLAPSE_KEY, nowCollapsed ? '1' : '0'); } catch (e) {}
      });
    }
  } else {
    // schooldark: ปุ่มย่อ/ขยายถูก toggle โดย app.js/index.js/settings.js เองอยู่แล้ว
    // เราแค่ "จำ" สถานะหลังจากนั้นไว้ใช้ตอนโหลดหน้าใหม่
    var sdToggleBtn = sidebarEl.querySelector('#sidebar-toggle-btn');
    if (sdToggleBtn) {
      sdToggleBtn.addEventListener('click', function () {
        setTimeout(function () {
          try { localStorage.setItem(COLLAPSE_KEY, sidebarEl.classList.contains('collapsed') ? '1' : '0'); } catch (e) {}
        }, 0);
      });
    }
  }

  // จำ/คืนตำแหน่ง scroll ของเมนู ระหว่างเปลี่ยนหน้า
  var menuEl = sidebarEl.querySelector('.sidebar-menu');
  if (menuEl) {
    try {
      var savedScroll = sessionStorage.getItem(SCROLL_KEY);
      if (savedScroll !== null) menuEl.scrollTop = parseInt(savedScroll, 10) || 0;
    } catch (e) {}
    menuEl.querySelectorAll('a.menu-item, a.submenu-link, a.submenu-item').forEach(function (a) {
      a.addEventListener('click', function () {
        try { sessionStorage.setItem(SCROLL_KEY, String(menuEl.scrollTop)); } catch (e) {}
      });
    });
  }

  // ------------------------------------------------------------------
  // Deep-link: ถ้าเปิดหน้า schooldark มาพร้อม hash (#m=..&v=..&step=..) ให้จำลอง
  // คลิกเมนู/เมนูย่อยที่ตรงกัน เพื่อสลับไป view นั้นทันที (ไม่แก้ JS ของเพื่อนเลย)
  // ------------------------------------------------------------------
  if (IS_SCHOOLDARK && location.hash.length > 1) {
    var hashParams = {};
    location.hash.slice(1).split('&').forEach(function (pair) {
      var kv = pair.split('=');
      if (kv[0]) hashParams[kv[0]] = decodeURIComponent(kv[1] || '');
    });
    setTimeout(function () {
      var view = hashParams.v;
      var mod = hashParams.m;
      if (!view) return;
      var sub = hashParams.step ? '[data-step="' + hashParams.step + '"]'
        : hashParams.tab ? '[data-tab="' + hashParams.tab + '"]'
        : hashParams.subtab ? '[data-subtab="' + hashParams.subtab + '"]'
        : '';
      var modSel = mod ? '[data-module="' + mod + '"]' : '';
      var target = sub
        ? document.querySelector('.submenu-item[data-view="' + view + '"]' + modSel + sub)
        : document.querySelector('.menu-item[data-view="' + view + '"]' + modSel);
      if (!target && !sub) {
        // view ที่ย้ายไปอยู่ใต้กลุ่ม "การตั้งค่า" เป็น submenu-item ที่ไม่มี step/tab/subtab
        target = document.querySelector('.submenu-item[data-view="' + view + '"]' + modSel + ':not([data-step]):not([data-tab]):not([data-subtab])');
      }
      if (target) target.click();
    }, 0);
  }

  // scrollIntoView ให้เมนูที่ active เห็นตั้งแต่แรก (ถ้าไม่มีตำแหน่ง scroll ที่จำไว้)
  try {
    if (sessionStorage.getItem(SCROLL_KEY) === null) {
      var activeEl = sidebarEl.querySelector('.menu-item.active, .menu-item-group.expanded');
      if (activeEl && activeEl.scrollIntoView) activeEl.scrollIntoView({ block: 'nearest' });
    }
  } catch (e) {}
  } // end if (!IS_HUB)

  // ------------------------------------------------------------------
  // Hub การ์ด (index.html ที่ root) — คงพฤติกรรมเดิม (การ์ดกลางหน้า ไม่ใช่ sidebar)
  // ใช้ NAV_GROUPS ชุดเดียวกันเป็นแหล่งข้อมูล
  // ------------------------------------------------------------------
  var hubMount = document.getElementById('cross-nav-hub');
  if (hubMount) {
    var bySystemLabel = { schooldark: 'บุคลากร & การลา', admission: 'รับสมัคร & ทะเบียนนักเรียน', settings: 'การตั้งค่า' };
    var seen = {};
    var cards = [];
    NAV_GROUPS.forEach(function (group) {
      group.items.forEach(function (item) {
        if (item.shortcut) return; // ทางลัดในหมวดอื่นซ้ำกับที่อยู่ในหมวด "การตั้งค่า" อยู่แล้ว
        var sys = group.id === 'settings' ? 'settings' : (item.page.indexOf('schooldark/') === 0 ? 'schooldark' : 'admission');
        if (!seen[sys]) { seen[sys] = { label: bySystemLabel[sys], links: [] }; cards.push(seen[sys]); }
        var pageChildren = (item.children || []).filter(function (c) { return c.page; });
        if (pageChildren.length) {
          // เช่น "ตั้งค่ารับสมัคร" → แสดงหน้าย่อยทั้งหมดเป็นลิงก์แยกกันในการ์ด
          pageChildren.forEach(function (c) { seen[sys].links.push({ label: c.label, href: c.page + (c.hash ? '#' + c.hash : hashFor(c, null)) }); });
        } else {
          seen[sys].links.push({ label: item.label, href: item.page });
        }
      });
    });
    hubMount.innerHTML = cards.map(function (card) {
      return '<section class="hub-card"><h2>' + escapeHtml(card.label) + '</h2><ul>' +
        card.links.map(function (l) { return '<li><a href="' + escapeHtml(l.href) + '">' + escapeHtml(l.label) + '</a></li>'; }).join('') +
        '</ul></section>';
    }).join('');
  }

  // ให้หน้า settings/index.html (ศูนย์รวมการตั้งค่า) อ่านข้อมูลเมนูชุดเดียวกันนี้ไปเรนเดอร์การ์ดเอง
  window.CrossNav = { NAV_GROUPS: NAV_GROUPS, hrefTo: hrefTo, hashFor: hashFor, svg: svg, escapeHtml: escapeHtml };
})();

/* ======================================================================
 *  วิธีต่อหน้าใหม่เข้ากับเมนูรวม (อ่านก่อนเพิ่มไฟล์ .html ใหม่):
 *
 *  1. เพิ่ม item ใน NAV_GROUPS ด้านบน (page ต้องเป็น path สัมพัทธ์จาก root
 *     ของ uxui-merged เช่น 'admission/new-page.html')
 *  2. ในหน้าใหม่: ใส่ <link rel="stylesheet" href="../shared/cross-nav.css">
 *     ใน <head> แล้ววาง <script src="../shared/cross-nav.js"></script>
 *     เป็นสิ่งแรกหลัง <body> (ห้ามใส่ async/defer — ต้องรันแบบ synchronous)
 *  3. ถ้าเป็นหน้าใหม่ในฝั่ง schooldark ที่มี <aside id="sidebar"> อยู่แล้ว
 *     (ก็อปโครง SPA มาจาก app.html) ให้วางสคริปต์ "แทนที่" เนื้อหาเดิมข้างใน
 *     aside นั้นแทน (ดูวิธีที่ app.html / leave-features.html ทำ)
 *  4. ห้ามใช้ class="submenu-item" กับลิงก์ที่ข้ามไปหน้าอื่น — ใช้ .submenu-link
 *     แทน (ดูเหตุผลในคอมเมนต์ของฟังก์ชัน renderItem ด้านบน)
 * ====================================================================== */
