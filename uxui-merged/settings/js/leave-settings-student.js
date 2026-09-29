/* =====================================================================
 * settings/leave.html › แท็บ "ตั้งค่าการลาเรียนนักเรียน" (#tab=student)
 * ย้ายมาจาก schooldark/leave-features.html (#view-student-leave-settings) + leave-features.js
 * วิซาร์ด 5 ขั้น: ปีการศึกษา · ประเภทการลา · ผู้ตรวจสอบ/อนุมัติ · โควตาวันลา · เงื่อนไขเพิ่มเติม
 * (มี live preview ต่อขั้น, ปุ่ม "ประวัติการตั้งค่า", บันทึกพร้อมวันที่มีผลบังคับใช้)
 *
 * เลย์เอาต์/ข้อความ/ไอคอนเป็นของ care แต่เขียนด้วย Tailwind + พาเลต sd-*
 * ข้อมูล: SdSettings.studentLeaveVersions() / studentLeaveForm() (คีย์ sd_student_leave_versions / sd_student_leave_form)
 * ต้องโหลดหลัง js/sd-settings-store.js และ js/leave-settings.js (window.LeaveSettings.helpers)
 * classic script — ทำงานบน file:///
 * ===================================================================== */
(function () {
  'use strict';

  window.LeaveSettings = window.LeaveSettings || { tabs: {} };
  window.LeaveSettings.tabs = window.LeaveSettings.tabs || {};

  var SAVED_BY = 'สมปอง ทองดี';   // = CURRENT_APPROVER_NAME ของ care
  var ROLE_IDS = ['sett-role-teacher-1', 'sett-role-teacher-2', 'sett-role-head', 'sett-role-dean'];
  var ROLE_FIELD = { 'sett-role-teacher-1': 'roleTeacher1', 'sett-role-teacher-2': 'roleTeacher2', 'sett-role-head': 'roleHead', 'sett-role-dean': 'roleDean' };
  var ROLE_NAME = { 'sett-role-teacher-1': 'ครูประจำชั้น', 'sett-role-teacher-2': 'ครูที่ปรึกษา', 'sett-role-head': 'หัวหน้าระดับสายชั้น', 'sett-role-dean': 'ฝ่ายปกครอง' };
  var TOTAL_STEPS = 5;
  var MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  var COLOR_HEX = { danger: '#f87171', warning: '#fb923c', primary: '#60a5fa', success: '#4ade80' };
  var COLOR_GRAD = {
    danger: 'linear-gradient(135deg, hsl(350 74% 48%), #ef4444)',
    warning: 'linear-gradient(135deg, hsl(38 92% 40%), #f97316)',
    primary: 'linear-gradient(135deg, hsl(250 75% 55%), #3b82f6)',
    success: 'linear-gradient(135deg, hsl(142 76% 36%), #22c55e)'
  };

  // ---- icons: <symbol> ของ sprite ใน leave-features.html (path ตรงตัว) ----
  var ICON = {
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    ticket: '<path d="M3 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6"/>',
    trending: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    table: '<path d="M3 5h18v14H3zM3 10h18M3 15h18M9 5v14M15 5v14"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>'
  };
  function ic(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + (cls || 'w-4 h-4') + '">' + ICON[name] + '</svg>';
  }

  // ---- shared class strings (จาก personnel-settings.js / app.css ของ care) ----
  var C = {
    card: 'bg-white border border-sd-border rounded-[20px] p-4 sm:p-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]',
    cardHead: 'flex items-center justify-between gap-3 flex-wrap mb-3 pb-3.5 border-b border-sd-border',
    cardTitle: 'font-heading text-base font-semibold flex items-center gap-2.5 text-sd-text',
    cardIcon: 'w-[18px] h-[18px] text-sd-primary shrink-0',
    cardDesc: 'text-[13px] text-sd-text-2 mb-4 leading-relaxed',
    group: 'flex flex-col gap-1.5',
    label: 'text-[12.5px] font-medium text-sd-text-2',
    req: 'text-sd-danger ml-0.5',
    input: 'w-full bg-white/50 border border-sd-border rounded-[14px] px-3.5 py-2.5 text-sm text-sd-text outline-none transition-colors focus:border-sd-primary focus:bg-white/80 focus:ring-[3px] focus:ring-[hsla(250,85%,55%,0.4)]',
    btn: 'inline-flex items-center justify-center gap-2 rounded-[14px] text-sm font-semibold cursor-pointer whitespace-nowrap border border-transparent transition-colors outline-none disabled:opacity-40 disabled:cursor-not-allowed',
    primary: 'bg-sd-primary text-white shadow-[0_4px_14px_hsla(250,75%,55%,0.1)] hover:bg-sd-primary-hover',
    secondary: 'bg-white !border-sd-border text-sd-text hover:bg-black/5 hover:border-sd-text-2',
    danger: 'bg-sd-danger-bg text-sd-danger hover:bg-sd-danger hover:text-white',
    md: 'px-[22px] py-2.5',
    sm: 'px-3 py-1 text-[12px] rounded-lg',
    tableWrap: 'overflow-x-auto rounded-[14px] border border-sd-border',
    table: 'w-full border-collapse text-[13.5px] [&_th]:px-4 [&_th]:py-[11px] [&_th]:text-left [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.8px] [&_th]:text-sd-muted [&_th]:bg-black/[0.03] [&_th]:border-b [&_th]:border-sd-border [&_th]:whitespace-nowrap [&_td]:px-4 [&_td]:py-[11px] [&_td]:border-b [&_td]:border-sd-border [&_tr:last-child_td]:border-b-0 [&_tbody_tr:hover_td]:bg-black/[0.015]',
    badge: 'inline-flex items-center justify-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold whitespace-nowrap',
    toggleRow: 'flex items-center justify-between gap-4 px-4 py-3.5 rounded-[14px] bg-black/[0.02] border border-sd-border hover:bg-black/[0.035] transition-colors',
    previewLabel: 'text-[11px] text-sd-muted uppercase tracking-wide',
    previewBox: 'bg-black/[0.02] border border-sd-border rounded-lg p-3'
  };
  function btn(kind, size) { return C.btn + ' ' + C[kind] + ' ' + (size === 'sm' ? C.sm : C.md); }

  function badgeFor(color) {
    var m = { danger: 'bg-sd-danger-bg text-sd-danger', warning: 'bg-sd-warning-bg text-sd-warning', primary: 'bg-sd-info-bg text-sd-info', success: 'bg-sd-success-bg text-sd-success' };
    return C.badge + ' ' + (m[color] || 'bg-black/5 text-sd-muted');
  }
  function statusBadge(status) {
    if (status === 'active') return '<span class="' + C.badge + ' bg-sd-success-bg text-sd-success">ใช้งานอยู่</span>';
    if (status === 'scheduled') return '<span class="' + C.badge + ' bg-sd-info-bg text-sd-info">รอมีผลในอนาคต</span>';
    return '<span class="' + C.badge + ' bg-black/5 text-sd-muted">ในอดีต</span>';
  }

  // ---- utils ----
  function esc(t) {
    var h = window.LeaveSettings.helpers;
    if (h && h.esc) return h.esc(t);
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function H() { return window.LeaveSettings.helpers; }
  function $(id) { return document.getElementById(id); }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function thaiDate(s) {
    if (!s) return '-';
    var p = String(s).split('-');
    if (p.length < 3) return s;
    return parseInt(p[2], 10) + ' ' + MONTHS_SHORT[parseInt(p[1], 10) - 1] + ' ' + (parseInt(p[0], 10) + 543);
  }
  function fmtDate(s) {
    if (!s) return '-';
    var p = s.split('-');
    return p[2] + '/' + p[1] + '/' + (parseInt(p[0], 10) + 543);
  }

  // ---- state (สร้างใหม่ทุกครั้งที่ render) ----
  var st = null;

  function activeVersion(versions) {
    for (var i = 0; i < versions.length; i++) if (versions[i].status === 'active') return versions[i];
    return null;
  }

  // ---------------------------------------------------------------- markup
  function stepNav() {
    var labels = ['ปีการศึกษา', 'ประเภทการลา', 'ผู้ตรวจสอบ/อนุมัติ', 'โควตาวันลา', 'เงื่อนไขเพิ่มเติม'];
    return '<div class="relative flex justify-between px-2.5 mb-6">' +
      '<div class="absolute left-2.5 right-2.5 top-5 h-0.5 bg-sd-border z-0"></div>' +
      labels.map(function (l, i) {
        return '<div class="relative z-10 flex flex-col items-center gap-2 cursor-pointer group" data-act="step" data-step="' + (i + 1) + '" id="setting-step-nav-' + (i + 1) + '">' +
          '<div class="lss-node w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors">' + (i + 1) + '</div>' +
          '<div class="lss-label text-xs font-medium text-center whitespace-nowrap">' + l + '</div></div>';
      }).join('') + '</div>';
  }
  function styleStepNav() {
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var nav = $('setting-step-nav-' + i);
      if (!nav) continue;
      var node = nav.querySelector('.lss-node'), label = nav.querySelector('.lss-label');
      var base = 'lss-node w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors ';
      var lbase = 'lss-label text-xs text-center whitespace-nowrap ';
      if (i === st.step) {
        node.className = base + 'bg-sd-primary border-sd-primary text-white shadow-[0_0_10px_hsla(250,75%,55%,0.1)]';
        label.className = lbase + 'font-semibold text-sd-text';
      } else if (i < st.step) {
        node.className = base + 'bg-sd-success border-sd-success text-white';
        label.className = lbase + 'font-medium text-sd-success';
      } else {
        node.className = base + 'bg-white border-sd-border text-sd-muted group-hover:border-sd-text-2 group-hover:text-sd-text';
        label.className = lbase + 'font-medium text-sd-muted';
      }
      nav.setAttribute('aria-current', i === st.step ? 'step' : 'false');
    }
  }

  function toggle(id, title, desc) {
    return '<div class="' + C.toggleRow + '"><div class="flex flex-col gap-0.5 max-w-[80%]"><span class="text-[13.5px] font-medium text-sd-text">' + title + '</span>' +
      '<span class="text-xs text-sd-muted">' + desc + '</span></div>' +
      '<label class="relative inline-block w-11 h-6 shrink-0 cursor-pointer"><input type="checkbox" id="' + id + '" data-input="preview" class="peer sr-only">' +
      '<span class="absolute inset-0 rounded-full border border-sd-border bg-black/10 transition-colors peer-checked:bg-sd-primary before:content-[\'\'] before:absolute before:h-4 before:w-4 before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:shadow-[0_1px_3px_rgba(0,0,0,0.4)] before:transition-transform peer-checked:before:translate-x-5"></span></label></div>';
  }
  function roleCard(id, title, desc) {
    return '<label class="lss-role flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-sd-border bg-black/[0.02] cursor-pointer transition-colors hover:bg-black/[0.04]" data-role-card="' + id + '">' +
      '<input type="checkbox" id="' + id + '" data-input="role" class="w-4 h-4 accent-[hsl(250,75%,55%)] shrink-0">' +
      '<div class="text-[13px]"><strong class="block">' + title + '</strong><span class="block text-[11px] text-sd-muted">' + desc + '</span></div></label>';
  }
  function grid(formInner, previewIcon, previewTitle, previewId) {
    return '<div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">' +
      '<div class="min-w-0"><div class="' + C.card + '">' + formInner + '</div></div>' +
      '<div class="order-first lg:order-none lg:sticky lg:top-[92px]"><div class="bg-white border border-sd-border rounded-[20px] overflow-hidden shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">' +
      '<div class="bg-black/[0.03] px-4 py-3 text-[13px] font-semibold text-sd-text border-b border-sd-border flex items-center gap-2">' + ic(previewIcon, 'w-4 h-4 text-sd-primary') + previewTitle + '</div>' +
      '<div class="p-4 min-h-[220px]" id="' + previewId + '"></div></div></div></div>';
  }
  function head(icon, title, right) {
    return '<div class="' + C.cardHead + '"><h3 class="' + C.cardTitle + '">' + ic(icon, C.cardIcon) + title + '</h3>' + (right || '') + '</div>';
  }
  function field(label, inner, extraCls, req) {
    return '<div class="' + C.group + (extraCls ? ' ' + extraCls : '') + '"><label class="' + C.label + '">' + label + (req ? ' <span class="' + C.req + '">*</span>' : '') + '</label>' + inner + '</div>';
  }
  function hint(t) { return '<span class="text-[11px] text-sd-muted block">' + t + '</span>'; }

  function pane(n, inner) {
    return '<div class="lss-pane ' + (n === 1 ? '' : 'hidden') + '" id="setting-step-pane-' + n + '">' + inner + '</div>';
  }

  function buildPanel() {
    var step1 = grid(
      head('calendar', 'ขั้นตอนที่ 1: กำหนดปีการศึกษาและช่วงเวลาภาคเรียน') +
      '<p class="' + C.cardDesc + '">ตั้งค่าปีการศึกษาปัจจุบันและช่วงเวลาของภาคเรียนที่ 1 และ 2 เพื่อกำหนดขอบเขตและโควตาการลาเรียน</p>' +
      '<div class="flex flex-col gap-3.5">' +
      field('ปีการศึกษาปัจจุบัน', '<select id="sett-acad-year" data-input="preview" class="' + C.input + '"><option value="2569">2569</option><option value="2570">2570</option><option value="2571">2571</option></select>', 'max-w-[320px]') +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
      field('ภาคเรียนที่ 1 (เริ่ม)', '<input type="date" id="sett-term1-start" data-input="preview" class="' + C.input + '">') +
      field('ภาคเรียนที่ 1 (สิ้นสุด)', '<input type="date" id="sett-term1-end" data-input="preview" class="' + C.input + '">') + '</div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
      field('ภาคเรียนที่ 2 (เริ่ม)', '<input type="date" id="sett-term2-start" data-input="preview" class="' + C.input + '">') +
      field('ภาคเรียนที่ 2 (สิ้นสุด)', '<input type="date" id="sett-term2-end" data-input="preview" class="' + C.input + '">') + '</div></div>',
      'calendar', 'ปีการศึกษาและภาคเรียน', 'preview-setting-1');

    var step2 = grid(
      head('list', 'ขั้นตอนที่ 2: จัดการประเภทการลาเรียน', '<button type="button" data-act="add-type" class="' + btn('primary', 'sm') + '">+ เพิ่มประเภท</button>') +
      '<p class="' + C.cardDesc + '">จัดการรายการประเภทการลาเรียนสำหรับนักเรียนในสถานศึกษา (เพิ่ม, แก้ไข, ลบ)</p>' +
      '<div class="' + C.tableWrap + ' max-h-[350px] overflow-y-auto"><table class="' + C.table + '"><thead><tr>' +
      '<th>ชื่อประเภทลา</th><th>คำอธิบาย</th><th class="!text-center w-20">สี</th><th class="!text-right w-[110px]">จัดการ</th></tr></thead>' +
      '<tbody id="sett-leave-types-tbody"></tbody></table></div>',
      'ticket', 'ตัวอย่างการ์ดตัวเลือกการลา', 'preview-setting-2');

    var step3 = grid(
      head('users', 'ขั้นตอนที่ 3: กำหนดลำดับขั้นผู้ตรวจสอบ/อนุมัติ') +
      '<p class="' + C.cardDesc + '">เลือกบทบาทที่จะต้องตรวจสอบและอนุมัติใบลาเรียนของนักเรียน โดยระบบจะดึงรายชื่อครูและห้องเรียนมาเชื่อมโยงโดยอัตโนมัติ</p>' +
      '<div class="flex flex-col gap-3.5">' +
      field('จำนวนผู้ตรวจสอบขั้นต่ำ (คน)', '<input type="number" id="sett-approver-count" data-input="count" min="1" max="4" class="' + C.input + '">', 'max-w-[250px]') +
      '<div class="' + C.group + '"><label class="' + C.label + '">บทบาทผู้ตรวจสอบที่มีสิทธิ์อนุมัติ</label><div class="flex flex-col gap-2.5 mt-1.5">' +
      roleCard('sett-role-teacher-1', 'ครูประจำชั้น', 'ตรวจสอบระดับแรกของชั้นเรียนนักเรียน (ดึงข้อมูลอัตโนมัติ)') +
      roleCard('sett-role-teacher-2', 'ครูที่ปรึกษา / ร่วมประจำชั้น', 'ตรวจสอบร่วมกันในห้องเรียน (ดึงข้อมูลอัตโนมัติ)') +
      roleCard('sett-role-head', 'หัวหน้าระดับสายชั้น', 'ครูหัวหน้า ม.1 - ม.6') +
      roleCard('sett-role-dean', 'ฝ่ายปกครอง / กิจการนักเรียน', 'รองผู้อำนวยการฝ่ายกิจการนักเรียน หรือหัวหน้าคณะปกครอง') + '</div></div>' +
      toggle('sett-approver-sequence', 'บังคับตรวจสอบตามลำดับขั้น', 'หากเปิดใช้ ครูที่ปรึกษาจะตรวจได้ต่อเมื่อครูประจำชั้นผ่านการตรวจสอบแล้วเท่านั้น') + '</div>',
      'trending', 'ลำดับขั้นตอนการตรวจสอบ (Flow)', 'preview-setting-3');

    var step4 = grid(
      head('table', 'ขั้นตอนที่ 4: ตั้งค่าโควตาจำนวนวันลาเรียน') +
      '<p class="' + C.cardDesc + '">กำหนดสิทธิ์จำนวนครั้ง/วันสูงสุดในการขอลาเรียนของนักเรียนต่อ 1 ปีการศึกษา</p>' +
      '<div class="flex flex-col gap-3.5" id="sett-quota-inputs-container"></div>',
      'list', 'โควตาที่กำหนดประจำปี', 'preview-setting-4');

    var step5 = grid(
      head('file', 'ขั้นตอนที่ 5: เงื่อนไขและการแจ้งเตือนเพิ่มเติม') +
      '<p class="' + C.cardDesc + '">กำหนดเงื่อนไขเพิ่มเติมของนโยบายการลาของโรงเรียน และการเชื่อมโยงระบบแจ้งเตือนภายนอก</p>' +
      '<div class="flex flex-col gap-3.5">' +
      toggle('sett-sick-doc-required', 'บังคับแนบใบรับรองแพทย์', 'เมื่อลาป่วยติดต่อกันเกินจำนวนวันที่กำหนด (เช่น 3 วันขึ้นไป)') +
      field('จำนวนวันลาป่วยขั้นต่ำที่ต้องแนบเอกสาร (วัน)', '<input type="number" id="sett-sick-doc-days" data-input="preview" min="1" class="' + C.input + '">', 'max-w-[250px]') +
      toggle('sett-alert-parent', 'แจ้งเตือนผู้ปกครองอัตโนมัติ', 'ส่ง LINE Notify / SMS หาผู้ปกครองทันทีที่ใบลาได้รับการอนุมัติสมบูรณ์') +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
      field('เวลาจำกัดในการส่งใบลาภายในวัน (น.)', '<input type="time" id="sett-deadline-time" data-input="preview" class="' + C.input + '">' + hint('ระบบจะไม่รับใบลาของวันนี้หากยื่นเลยเวลาที่กำหนด')) +
      field('เตือนล่วงหน้าเมื่อถึงสัดส่วนโควตา (%)', '<input type="number" id="sett-quota-warning-percent" data-input="preview" min="50" max="100" class="' + C.input + '">' + hint('แจ้งเตือนครูเมื่อนักเรียนลาใกล้ครบโควตาประจำปี')) + '</div></div>',
      'refresh', 'สรุปเงื่อนไขในระบบ', 'preview-setting-5');

    return '<div class="flex justify-end mb-3"><button type="button" data-act="history" class="' + btn('secondary', 'sm') + '">' + ic('history', 'w-4 h-4') + ' ประวัติการตั้งค่า</button></div>' +
      stepNav() + pane(1, step1) + pane(2, step2) + pane(3, step3) + pane(4, step4) + pane(5, step5) +
      '<div class="flex mt-6 bg-white p-4 sm:px-6 rounded-[14px] border border-sd-border">' +
      '<button type="button" id="sett-prev-btn" data-act="prev" class="' + btn('secondary') + ' min-w-[120px]">← ย้อนกลับ</button>' +
      '<button type="button" id="sett-next-btn" data-act="next" class="' + btn('primary') + ' min-w-[140px] ml-auto">ขั้นตอนถัดไป →</button></div>';
  }

  function buildModals() {
    var modalCard = 'bg-white text-sd-text w-full max-h-[85vh] overflow-y-auto rounded-[20px] p-5 sm:p-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-sd-border';
    var closeBtn = function (id) { return '<button type="button" data-act="close" data-modal="' + id + '" class="p-1 rounded-lg text-sd-muted hover:text-sd-text hover:bg-black/5 cursor-pointer">' + ic('x', 'w-5 h-5') + '</button>'; };
    var wrap = document.createElement('div');
    wrap.id = 'lss-modals';
    wrap.innerHTML =
      // เพิ่ม/แก้ประเภทการลา
      '<div id="modal-leave-type" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/65 p-4"><div class="' + modalCard + ' max-w-[440px]">' +
      '<div class="flex items-center justify-between mb-5 pb-3.5 border-b border-sd-border"><h3 id="leave-type-modal-title" class="font-heading text-base font-semibold">เพิ่มประเภทการลาเรียน</h3>' + closeBtn('modal-leave-type') + '</div>' +
      '<div class="flex flex-col gap-3.5"><input type="hidden" id="leave-type-edit-idx" value="">' +
      field('ชื่อประเภทการลา', '<input type="text" id="lt-modal-name" class="' + C.input + '" placeholder="เช่น ลาบวช, ลาไปแข่งขัน">', '', true) +
      field('คำอธิบายสั้น', '<input type="text" id="lt-modal-desc" class="' + C.input + '" placeholder="คำอธิบายที่อธิบายเหตุผลการลาได้ชัดเจน">') +
      field('สี Badge', '<select id="lt-modal-color" class="' + C.input + '"><option value="danger">สีแดง (ด่วน/เจ็บป่วย)</option><option value="warning">สีส้ม (กิจธุระ)</option><option value="primary">สีน้ำเงิน (ทั่วไป)</option><option value="success">สีเขียว (กิจกรรมโรงเรียน)</option></select>') + '</div>' +
      '<div class="flex justify-end gap-2.5 mt-5 pt-3.5 border-t border-sd-border"><button type="button" data-act="close" data-modal="modal-leave-type" class="' + btn('secondary') + '">ยกเลิก</button>' +
      '<button type="button" data-act="save-type" class="' + btn('primary') + '">บันทึก</button></div></div></div>' +

      // บันทึกพร้อมวันที่มีผลบังคับใช้
      '<div id="settings-save-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/65 p-4"><div class="' + modalCard + ' max-w-[480px]">' +
      '<div class="flex items-center justify-between mb-5 pb-3.5 border-b border-sd-border"><h3 class="font-heading text-base font-semibold">บันทึกการตั้งค่าการลาเรียน</h3>' + closeBtn('settings-save-modal') + '</div>' +
      '<div class="flex flex-col gap-3.5">' +
      field('วันที่มีผลบังคับใช้', '<input type="date" id="settings-save-effective-date" class="' + C.input + '">' + hint('เลือกวันนี้หรือวันที่ผ่านมาแล้วเพื่อให้มีผลทันที หรือเลือกวันในอนาคตเพื่อบันทึกไว้ล่วงหน้า')) +
      field('หมายเหตุการเปลี่ยนแปลง (ถ้ามี)', '<textarea id="settings-save-note" rows="3" class="' + C.input + ' resize-y" placeholder="เช่น ปรับเพิ่มโควตาลาป่วย, เพิ่มประเภทการลาใหม่..."></textarea>') + '</div>' +
      '<div class="flex justify-end gap-2.5 mt-5 pt-3.5 border-t border-sd-border"><button type="button" data-act="close" data-modal="settings-save-modal" class="' + btn('secondary') + ' flex-1">ยกเลิก</button>' +
      '<button type="button" data-act="confirm-save" class="' + btn('primary') + ' flex-1">บันทึก</button></div></div></div>' +

      // ประวัติการตั้งค่า (drawer ขวา)
      '<div id="drawer-settings-history" class="fixed inset-0 z-50 hidden justify-end bg-black/45">' +
      '<aside class="bg-white w-[460px] max-w-[94vw] h-full overflow-y-auto p-6 border-l border-sd-border shadow-2xl">' +
      '<div class="flex items-center justify-between mb-5 pb-3.5 border-b border-sd-border"><h3 id="drawer-history-title" class="font-heading text-base font-semibold">ประวัติการตั้งค่าการลาเรียน</h3>' + closeBtn('drawer-settings-history') + '</div>' +
      '<div id="drawer-history-body"></div></aside></div>';
    return wrap;
  }

  // ---------------------------------------------------------------- state <-> DOM
  function loadForm() {
    var f = window.SdSettings.studentLeaveForm();
    $('sett-acad-year').value = String(f.acadYear);
    if ($('sett-acad-year').value !== String(f.acadYear)) {   // ปีที่ไม่อยู่ในรายการ → เพิ่มตัวเลือก
      var o = document.createElement('option'); o.value = o.textContent = String(f.acadYear); $('sett-acad-year').appendChild(o);
      $('sett-acad-year').value = String(f.acadYear);
    }
    $('sett-term1-start').value = f.term1Start || '';
    $('sett-term1-end').value = f.term1End || '';
    $('sett-term2-start').value = f.term2Start || '';
    $('sett-term2-end').value = f.term2End || '';
    $('sett-approver-count').value = f.approverCount;
    $('sett-role-teacher-1').checked = !!f.roleTeacher1;
    $('sett-role-teacher-2').checked = !!f.roleTeacher2;
    $('sett-role-head').checked = !!f.roleHead;
    $('sett-role-dean').checked = !!f.roleDean;
    $('sett-approver-sequence').checked = !!f.approverSequence;
    $('sett-sick-doc-required').checked = !!f.sickDocRequired;
    $('sett-sick-doc-days').value = f.sickDocDays;
    $('sett-alert-parent').checked = !!f.alertParent;
    $('sett-deadline-time').value = f.deadlineTime || '';
    $('sett-quota-warning-percent').value = f.quotaWarningPercent;
    st.roleOrder = ROLE_IDS.filter(function (id) { return $(id).checked; });
    enforceRoleLimit();
    syncRoleCards();
  }
  function readForm() {
    return {
      acadYear: $('sett-acad-year').value,
      term1Start: $('sett-term1-start').value, term1End: $('sett-term1-end').value,
      term2Start: $('sett-term2-start').value, term2End: $('sett-term2-end').value,
      approverCount: getLimit(),
      roleTeacher1: $('sett-role-teacher-1').checked, roleTeacher2: $('sett-role-teacher-2').checked,
      roleHead: $('sett-role-head').checked, roleDean: $('sett-role-dean').checked,
      approverSequence: $('sett-approver-sequence').checked,
      sickDocRequired: $('sett-sick-doc-required').checked,
      sickDocDays: parseInt($('sett-sick-doc-days').value, 10) || 1,
      alertParent: $('sett-alert-parent').checked,
      deadlineTime: $('sett-deadline-time').value,
      quotaWarningPercent: parseInt($('sett-quota-warning-percent').value, 10) || 80
    };
  }

  // ---------------------------------------------------------------- approver roles
  function syncRoleCards() {
    ROLE_IDS.forEach(function (id) {
      var input = $(id), card = input.closest('[data-role-card]');
      var on = input.checked;
      card.classList.toggle('border-sd-primary', on);
      card.classList.toggle('bg-sd-primary-glow', on);
      card.classList.toggle('border-sd-border', !on);
      card.querySelector('strong').classList.toggle('text-sd-primary', on);
    });
  }
  function getLimit() {
    var v = parseInt($('sett-approver-count').value, 10);
    return Math.max(1, Math.min(4, v || 2));
  }
  function enforceRoleLimit(latestId) {
    var checked = ROLE_IDS.filter(function (id) { return $(id).checked; });
    checked.forEach(function (id) { if (st.roleOrder.indexOf(id) < 0) st.roleOrder.push(id); });
    st.roleOrder = st.roleOrder.filter(function (id) { return checked.indexOf(id) >= 0; });
    if (latestId && checked.indexOf(latestId) >= 0) {
      st.roleOrder = st.roleOrder.filter(function (id) { return id !== latestId; });
      st.roleOrder.push(latestId);
    }
    var limit = getLimit();
    while (st.roleOrder.length > limit) {
      var removed = st.roleOrder.shift();
      if ($(removed)) $(removed).checked = false;
    }
  }

  // ---------------------------------------------------------------- tables / inputs
  function renderTypesTable() {
    var tbody = $('sett-leave-types-tbody');
    if (!tbody) return;
    if (!st.types.length) { tbody.innerHTML = '<tr><td colspan="4" class="text-center text-sd-muted py-6">ยังไม่มีประเภทการลา</td></tr>'; return; }
    tbody.innerHTML = st.types.map(function (t, idx) {
      return '<tr><td><strong>' + esc(t.name) + '</strong></td>' +
        '<td><span class="text-sd-muted text-xs">' + esc(t.desc || '-') + '</span></td>' +
        '<td class="text-center"><span class="inline-block w-3.5 h-3.5 rounded-full border border-black/10" style="background:' + (COLOR_HEX[t.color] || '#9ca3af') + '"></span></td>' +
        '<td><div class="flex gap-1 justify-end">' +
        '<button type="button" data-act="edit-type" data-idx="' + idx + '" class="' + btn('secondary', 'sm') + '">แก้ไข</button>' +
        '<button type="button" data-act="delete-type" data-idx="' + idx + '" class="' + btn('danger', 'sm') + '">ลบ</button></div></td></tr>';
    }).join('');
  }
  function renderQuotaInputs() {
    var box = $('sett-quota-inputs-container');
    if (!box) return;
    if (!st.types.length) { box.innerHTML = '<div class="text-center text-sd-muted text-sm py-6">ยังไม่มีประเภทการลา — เพิ่มได้ที่ขั้นตอนที่ 2</div>'; return; }
    box.innerHTML = st.types.map(function (t, idx) {
      return '<div class="flex flex-col items-start gap-2 text-left"><div class="w-full"><strong class="text-[13.5px] text-sd-text">' + esc(t.name) + '</strong>' +
        '<span class="block text-[11px] text-sd-muted">' + esc(t.desc || '-') + '</span></div>' +
        '<div class="flex items-center gap-2 w-full"><input type="number" id="quota-val-' + idx + '" data-input="quota" data-idx="' + idx + '" value="' + (t.quota == null ? 10 : t.quota) + '" min="0" class="' + C.input + ' !w-[100px]">' +
        '<span class="text-xs text-sd-text-2">วัน/ปี</span></div></div>';
    }).join('');
  }

  // ---------------------------------------------------------------- previews
  function updatePreview() {
    var step = st.step, el = $('preview-setting-' + step), h = '';
    if (!el) return;
    if (step === 1) {
      h = '<div class="flex flex-col gap-3 w-full"><div class="' + C.previewBox + ' text-center"><span class="' + C.previewLabel + '">ปีการศึกษาที่เลือก</span>' +
        '<h4 class="font-heading text-xl font-bold text-sd-primary mt-1">พ.ศ. ' + esc($('sett-acad-year').value) + '</h4></div>' +
        '<div class="flex flex-col gap-2 text-[12.5px]">' +
        '<div class="flex justify-between border-b border-black/5 pb-1"><span class="text-sd-muted">ภาคเรียนที่ 1:</span><strong>' + fmtDate($('sett-term1-start').value) + ' - ' + fmtDate($('sett-term1-end').value) + '</strong></div>' +
        '<div class="flex justify-between border-b border-black/5 pb-1"><span class="text-sd-muted">ภาคเรียนที่ 2:</span><strong>' + fmtDate($('sett-term2-start').value) + ' - ' + fmtDate($('sett-term2-end').value) + '</strong></div></div></div>';
    } else if (step === 2) {
      h = '<div class="flex flex-col gap-2 w-full"><span class="' + C.previewLabel + ' mb-1">การ์ดเลือกประเภทในฟอร์มลาเรียน:</span><div class="flex flex-col gap-2">' +
        (st.types.length ? st.types.map(function (t) {
          return '<div class="flex items-center gap-2.5 px-3 py-2.5 border-[1.5px] border-sd-border rounded-[14px]">' +
            '<div class="w-7 h-7 rounded-md grid place-items-center shrink-0" style="background:' + (COLOR_GRAD[t.color] || '#e2e8f0') + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" class="w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>' +
            '<div class="flex-1 min-w-0"><div class="text-xs font-semibold">' + esc(t.name) + '</div>' +
            '<div class="text-[10.5px] text-sd-muted truncate mt-0.5">' + esc(t.desc || '-') + '</div></div></div>';
        }).join('') : '<div class="text-center text-sd-muted text-xs py-5">ยังไม่มีประเภทการลา</div>') + '</div></div>';
    } else if (step === 3) {
      var list = ROLE_IDS.filter(function (id) { return $(id).checked; }).map(function (id) { return ROLE_NAME[id]; });
      var seq = $('sett-approver-sequence').checked;
      if (!list.length) { el.innerHTML = '<div class="text-center text-sd-muted text-xs p-5">กรุณาเลือกบทบาทผู้ตรวจสอบอย่างน้อย 1 บทบาท</div>'; return; }
      h = '<div class="flex flex-col gap-2 w-full"><span class="' + C.previewLabel + ' mb-1">แผนภาพเส้นทางการอนุมัติ:</span><div class="flex flex-col gap-2.5">' +
        list.map(function (name, i) {
          return '<div class="flex items-center gap-2.5 ' + C.previewBox + ' !py-2">' +
            '<div class="w-5 h-5 rounded-full bg-sd-primary text-white text-[10px] font-bold grid place-items-center shrink-0">' + (i + 1) + '</div>' +
            '<div class="flex-1 text-xs font-semibold">' + name + '</div></div>' +
            (i < list.length - 1 ? '<div class="text-center -my-1 text-sd-muted text-[11px]">' + (seq ? '↓ (ลำดับขั้น)' : '⇅ (อนุมัติพร้อมกัน)') + '</div>' : '');
        }).join('') +
        '<div class="flex items-center gap-2.5 rounded-lg border border-[#22c55e] bg-[rgba(74,222,128,0.08)] px-3 py-2 mt-1">' +
        '<div class="w-5 h-5 rounded-full bg-[#22c55e] text-white text-[10px] font-bold grid place-items-center shrink-0">✓</div>' +
        '<div><div class="text-xs font-semibold text-[#22c55e]">อนุมัติสำเร็จ</div><span class="text-[10px] text-sd-muted">ใบลาได้รับการบันทึกลงระบบเสร็จสิ้น</span></div></div></div></div>';
    } else if (step === 4) {
      h = '<div class="flex flex-col gap-2.5 w-full"><span class="' + C.previewLabel + '">สรุปโควตาการลาเรียน:</span><div class="flex flex-col gap-2">' +
        (st.types.length ? st.types.map(function (t) {
          return '<div class="' + C.previewBox + ' flex justify-between items-center text-xs"><strong>' + esc(t.name) + '</strong>' +
            '<span class="text-sd-primary font-semibold">โควตา: ' + (t.quota || 0) + ' วัน/ปี</span></div>';
        }).join('') : '<div class="text-center text-sd-muted text-xs py-5">ยังไม่มีประเภทการลา</div>') + '</div></div>';
    } else if (step === 5) {
      var sickDoc = $('sett-sick-doc-required').checked, alertP = $('sett-alert-parent').checked;
      var dot = function (c) { return '<span class="text-sm leading-none" style="color:' + c + '">●</span>'; };
      h = '<div class="flex flex-col gap-2.5 text-xs w-full"><span class="' + C.previewLabel + '">สรุปเงื่อนไขเพิ่มเติม:</span>' +
        '<div class="' + C.previewBox + ' !p-3 flex flex-col gap-2.5">' +
        '<div class="flex items-start gap-2">' + dot(sickDoc ? '#22c55e' : 'hsl(215 15% 55%)') + '<div><strong>ใบรับรองแพทย์:</strong> ' + (sickDoc ? 'บังคับแนบเมื่อลาป่วยตั้งแต่ <strong>' + esc($('sett-sick-doc-days').value) + ' วัน</strong> ขึ้นไป' : 'ไม่บังคับแนบ') + '</div></div>' +
        '<div class="flex items-start gap-2">' + dot(alertP ? '#22c55e' : 'hsl(215 15% 55%)') + '<div><strong>การแจ้งเตือนผู้ปกครอง:</strong> ' + (alertP ? 'เปิดใช้งาน (ส่ง SMS/LINE ทันทีเมื่ออนุมัติสำเร็จ)' : 'ปิดใช้งาน') + '</div></div>' +
        '<div class="flex items-start gap-2">' + dot('hsl(250 75% 55%)') + '<div><strong>เวลาตัดรอบประจำวัน:</strong> ไม่ให้ยื่นภายในวันนี้หลังเวลา <strong>' + esc($('sett-deadline-time').value) + ' น.</strong></div></div>' +
        '<div class="flex items-start gap-2">' + dot('hsl(250 75% 55%)') + '<div><strong>เตือนสัดส่วนโควตา:</strong> เตือนครูเมื่อนักเรียนใช้โควตาเกิน <strong>' + esc($('sett-quota-warning-percent').value) + '%</strong></div></div>' +
        '</div></div>';
    }
    el.innerHTML = h;
  }

  // ---------------------------------------------------------------- wizard nav
  function goStep(step) {
    st.step = step;
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var p = $('setting-step-pane-' + i);
      if (p) p.classList.toggle('hidden', i !== step);
    }
    styleStepNav();
    $('sett-prev-btn').disabled = (step === 1);
    $('sett-next-btn').textContent = step === TOTAL_STEPS ? 'บันทึกการตั้งค่า' : 'ขั้นตอนถัดไป →';
    if (step === 2) renderTypesTable();
    if (step === 4) renderQuotaInputs();
    if (step === 3) syncRoleCards();
    updatePreview();
  }
  function navigate(dir) {
    var target = st.step + dir;
    if (target < 1) return;
    if (target > TOTAL_STEPS) { openSaveModal(); return; }
    goStep(target);
  }

  // ---------------------------------------------------------------- leave type CRUD
  function openTypeModal(idx) {
    var t = idx == null ? null : st.types[idx];
    $('leave-type-modal-title').textContent = t ? 'แก้ไขประเภทการลาเรียน' : 'เพิ่มประเภทการลาเรียน';
    $('leave-type-edit-idx').value = t ? idx : '';
    $('lt-modal-name').value = t ? t.name : '';
    $('lt-modal-desc').value = t ? (t.desc || '') : '';
    $('lt-modal-color').value = t ? t.color : 'primary';
    H().openModal('modal-leave-type');
    $('lt-modal-name').focus();
  }
  function saveType() {
    var name = $('lt-modal-name').value.trim(), desc = $('lt-modal-desc').value.trim(), color = $('lt-modal-color').value;
    var idxVal = $('leave-type-edit-idx').value;
    if (!name) { H().toast('กรุณาระบุชื่อประเภทการลา', 'error'); return; }
    if (idxVal === '') st.types.push({ name: name, desc: desc, color: color, quota: 10 });
    else { var t = st.types[parseInt(idxVal, 10)]; t.name = name; t.desc = desc; t.color = color; }
    H().closeModal('modal-leave-type');
    renderTypesTable();
    updatePreview();
  }
  function deleteType(idx) {
    H().confirm('คุณต้องการลบประเภทการลานี้ใช่หรือไม่?', { danger: true, confirmText: 'ลบ' }).then(function (ok) {
      if (!ok) return;
      st.types.splice(idx, 1);
      renderTypesTable();
      updatePreview();
    });
  }

  // ---------------------------------------------------------------- save
  function openSaveModal() {
    $('settings-save-effective-date').value = todayStr();
    $('settings-save-note').value = '';
    H().openModal('settings-save-modal');
  }
  function confirmSave() {
    var effectiveDate = $('settings-save-effective-date').value;
    if (!effectiveDate) { H().toast('กรุณาเลือกวันที่มีผลบังคับใช้', 'error'); return; }
    var note = $('settings-save-note').value.trim();
    var today = todayStr();
    var S = window.SdSettings;
    var versions = S.studentLeaveVersions();
    var candidate = clone(st.types);
    var isFuture = effectiveDate > today;
    var newId = 'CFG-' + String(versions.length + 1).padStart(4, '0');
    var active = activeVersion(versions);
    var msg;

    if (isFuture) {
      // ยังไม่มีผลตอนนี้ — บันทึกเป็นเวอร์ชันรอมีผล แล้วคืนค่าที่แก้ระหว่างวิซาร์ดกลับเป็นเวอร์ชันที่ใช้งานอยู่จริง
      if (active) st.types = clone(active.leaveTypes);
      versions.push({ id: newId, effectiveDate: effectiveDate, savedDate: today, savedBy: SAVED_BY, note: note || 'ตั้งค่าล่วงหน้าสำหรับอนาคต', status: 'scheduled', leaveTypes: candidate });
      msg = 'บันทึกการตั้งค่าไว้ล่วงหน้าเรียบร้อยแล้ว จะมีผลวันที่ ' + thaiDate(effectiveDate);
    } else {
      if (active) active.status = 'past';
      versions.push({ id: newId, effectiveDate: effectiveDate, savedDate: today, savedBy: SAVED_BY, note: note || 'บันทึกการตั้งค่าระบบการลาเรียนของนักเรียน', status: 'active', leaveTypes: candidate });
      msg = 'บันทึกการตั้งค่าระบบการลาเรียนของนักเรียนเสร็จสิ้น!';
    }
    S.saveStudentLeaveVersions(versions);
    S.saveStudentLeaveForm(readForm());
    H().closeModal('settings-save-modal');
    renderTypesTable();
    renderQuotaInputs();
    goStep(1);
    H().toast(msg, 'success');
  }

  // ---------------------------------------------------------------- history drawer
  function openHistory() {
    var versions = window.SdSettings.studentLeaveVersions();
    var sorted = versions.slice().sort(function (a, b) { return new Date(b.effectiveDate) - new Date(a.effectiveDate); });
    $('drawer-history-title').textContent = 'ประวัติการตั้งค่าการลาเรียน';
    $('drawer-history-body').innerHTML =
      '<p class="text-[12.5px] text-sd-muted mb-3.5">รายการตั้งค่า "ประเภทการลา/โควตา" ที่เคยบันทึกไว้ ทั้งที่ใช้งานอยู่ ในอดีต และที่ตั้งไว้ล่วงหน้าสำหรับอนาคต คลิกแต่ละรายการเพื่อดูรายละเอียด</p>' +
      '<div class="flex flex-col gap-2">' + sorted.map(function (v) {
        var d = new Date(v.effectiveDate);
        return '<div class="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-sd-border rounded-[14px] cursor-pointer transition-transform hover:translate-x-1 hover:bg-black/[0.02]" data-act="history-detail" data-id="' + esc(v.id) + '">' +
          '<div class="flex flex-col items-center justify-center bg-black/[0.04] rounded-lg p-2 min-w-[60px]"><span class="text-[11px] text-sd-text-2">' + MONTHS_SHORT[d.getMonth()] + '</span>' +
          '<span class="text-base font-semibold text-sd-text">' + pad(d.getDate()) + '</span></div>' +
          '<div class="flex-1 min-w-0"><div class="text-sm font-medium text-sd-text mb-1">มีผลบังคับใช้ ' + thaiDate(v.effectiveDate) + '</div>' +
          '<div class="text-xs text-sd-muted">' + esc(v.note) + '</div></div>' + statusBadge(v.status) + '</div>';
      }).join('') + '</div>';
    H().openModal('drawer-settings-history');
  }
  function openHistoryDetail(id) {
    var versions = window.SdSettings.studentLeaveVersions(), v = null;
    for (var i = 0; i < versions.length; i++) if (versions[i].id === id) v = versions[i];
    if (!v) return;
    var row = function (l, val) { return '<div class="flex justify-between gap-3 py-3 border-b border-sd-border"><span class="text-[13px] text-sd-muted">' + l + '</span><span class="text-[13px] font-medium text-right">' + val + '</span></div>'; };
    $('drawer-history-title').textContent = 'รายละเอียดการตั้งค่า: ' + thaiDate(v.effectiveDate);
    $('drawer-history-body').innerHTML =
      '<div class="mb-4">' +
      row('วันที่มีผลบังคับใช้:', thaiDate(v.effectiveDate)) +
      row('บันทึกเมื่อ:', thaiDate(v.savedDate) + ' โดย ' + esc(v.savedBy)) +
      row('สถานะ:', statusBadge(v.status)) +
      '<div class="py-3"><div class="text-[13px] text-sd-muted mb-1">หมายเหตุ:</div><div class="text-[13px]">' + esc(v.note) + '</div></div></div>' +
      '<div class="text-[11px] font-semibold uppercase tracking-[0.8px] text-sd-muted mb-2.5">ประเภทการลาและโควตาในเวอร์ชันนี้</div>' +
      '<div class="' + C.tableWrap + '"><table class="' + C.table + '"><thead><tr><th>ประเภทการลา</th><th>คำอธิบาย</th><th class="!text-center">โควตา</th></tr></thead><tbody>' +
      v.leaveTypes.map(function (t) {
        return '<tr><td><span class="' + badgeFor(t.color) + '">' + esc(t.name) + '</span></td><td>' + esc(t.desc || '-') + '</td><td class="text-center">' + t.quota + ' วัน/ปี</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="mt-4"><button type="button" data-act="history" class="' + btn('secondary') + ' w-full">← กลับไปดูรายการทั้งหมด</button></div>';
  }

  // ---------------------------------------------------------------- render (tab entry)
  function render(panelEl) {
    var versions = window.SdSettings.studentLeaveVersions();
    var act = activeVersion(versions);
    st = { step: 1, types: act ? clone(act.leaveTypes) : [], roleOrder: [] };

    panelEl.innerHTML = buildPanel();
    var modals = buildModals();
    var root = $('modal-root') || document.body;
    root.appendChild(modals);

    function onAction(e) {
      var el = e.target.closest('[data-act]');
      if (!el) return;
      var act = el.getAttribute('data-act');
      if (act === 'step') goStep(parseInt(el.getAttribute('data-step'), 10));
      else if (act === 'prev') navigate(-1);
      else if (act === 'next') navigate(1);
      else if (act === 'add-type') openTypeModal(null);
      else if (act === 'edit-type') openTypeModal(parseInt(el.getAttribute('data-idx'), 10));
      else if (act === 'delete-type') deleteType(parseInt(el.getAttribute('data-idx'), 10));
      else if (act === 'save-type') saveType();
      else if (act === 'confirm-save') confirmSave();
      else if (act === 'history') openHistory();
      else if (act === 'history-detail') openHistoryDetail(el.getAttribute('data-id'));
      else if (act === 'close') H().closeModal(el.getAttribute('data-modal'));
    }
    function onInput(e) {
      var kind = e.target.getAttribute && e.target.getAttribute('data-input');
      if (!kind) return;
      if (kind === 'quota') {
        var idx = parseInt(e.target.getAttribute('data-idx'), 10);
        if (st.types[idx]) st.types[idx].quota = parseInt(e.target.value, 10) || 0;
      } else if (kind === 'count') {
        enforceRoleLimit(); syncRoleCards();
      } else if (kind === 'role') {
        if (e.target.checked) enforceRoleLimit(e.target.id);
        else st.roleOrder = st.roleOrder.filter(function (id) { return id !== e.target.id; });
        syncRoleCards();
      }
      updatePreview();
    }
    panelEl.addEventListener('click', onAction);
    panelEl.addEventListener('input', onInput);
    panelEl.addEventListener('change', onInput);
    modals.addEventListener('click', function (e) {
      onAction(e);
      // คลิกฉากหลัง (นอกการ์ด) = ปิด
      if (e.target.id === 'modal-leave-type' || e.target.id === 'settings-save-modal' || e.target.id === 'drawer-settings-history') H().closeModal(e.target.id);
    });
    modals.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.target.id === 'lt-modal-name' || e.target.id === 'lt-modal-desc')) { e.preventDefault(); saveType(); }
    });

    loadForm();
    goStep(1);
  }

  window.LeaveSettings.tabs.student = {
    title: 'ตั้งค่าการลาเรียนนักเรียน',
    desc: 'ประเภทการลา ผู้อนุมัติ โควตา',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">' + ICON.users + '</svg>',
    render: render
  };
})();
