/* =====================================================================
 * settings/personnel.html — ตั้งค่าบุคลากร (ย้ายมาจาก schooldark/app.html หมวด "ตั้งค่าระบบ")
 * 6 แท็บ: schedule · permissions · signatories · staff-types · positions · departments
 * ข้อมูลอ่าน/เขียนผ่าน window.SdSettings (คีย์ sd_* เดิมของ care ไม่เปลี่ยน)
 *
 * เลย์เอาต์/สี/ไอคอนเป็นของ care (ไอคอน SVG คัดลอกจาก app.html) แต่เขียนด้วย Tailwind + พาเลต sd-*
 * การบันทึก: ฟอร์มที่มีปุ่ม "บันทึก" ของตัวเอง (เวลาทำงาน) ยังบันทึกเมื่อกดปุ่ม
 *            ส่วนเพิ่ม/แก้/ลบ/เลื่อนลำดับ/เปิด-ปิดใช้งาน จะเขียนลง localStorage ทันที (ไม่มีแบบร่างแล้ว)
 * classic script (ไม่ใช้ module) — ทำงานบน file:///
 * ===================================================================== */
(function () {
  'use strict';

  var S = window.SdSettings;

  // ---------------------------------------------------------------- helpers
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(id) { return document.getElementById(id); }
  function debounce(fn, wait) {
    var t;
    return function () {
      var self = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait || 200);
    };
  }
  function formatThaiDate(dateString) {
    if (!dateString) return '';
    var date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    var months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + String(date.getFullYear() + 543).substring(2);
  }
  // id ใหม่ = เลขสูงสุดที่มีอยู่ + 1 (กัน id ซ้ำหลังลบ; ถ้าไม่มีการลบจะได้ค่าเดียวกับของเดิม)
  function nextId(prefix, list, width) {
    var max = 0;
    list.forEach(function (x) {
      var m = new RegExp('^' + prefix + '(\\d+)$').exec(x.id || '');
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + String(Math.max(max, list.length) + 1).padStart(width, '0');
  }

  // ---------------------------------------------------------------- icons (care's inline SVG paths, verbatim)
  var ICON = {
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    warn: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    layers: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    user: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    sliders: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    up: '<polyline points="18 15 12 9 6 15"/>',
    down: '<polyline points="6 9 12 15 18 9"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    chevronRight: '<polyline points="9 18 15 12 9 6"/>'
  };
  function svg(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="' + (cls || 'w-4 h-4') + '">' + ICON[name] + '</svg>';
  }

  // ---------------------------------------------------------------- shared class strings (translated from care's app.css)
  var CLS = {
    card: 'bg-white border border-sd-border rounded-[20px] p-4 sm:p-6 mb-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]',
    cardHead: 'flex items-center justify-between gap-3 flex-wrap mb-5 pb-3.5 border-b border-sd-border',
    cardTitle: 'font-heading text-base font-semibold flex items-center gap-2.5 text-sd-text',
    cardIcon: 'w-[18px] h-[18px] text-sd-primary shrink-0',
    cardDesc: 'text-[13px] text-sd-text-2 mb-4 leading-relaxed',
    statRow: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6',
    statCard: 'flex items-center gap-3.5 px-[18px] py-4 rounded-[20px] bg-white border border-sd-border shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]',
    statIcon: 'w-11 h-11 rounded-xl shrink-0 flex items-center justify-center',
    statLabel: 'text-[11px] text-sd-muted font-medium',
    statValue: 'font-heading text-xl font-bold mt-0.5',
    formGroup: 'flex flex-col gap-1.5 mb-4',
    label: 'text-[12.5px] font-medium text-sd-text-2',
    req: 'text-sd-danger ml-0.5',
    input: 'w-full bg-white/50 border border-sd-border rounded-[14px] px-3.5 py-2.5 text-sm text-sd-text outline-none transition-colors focus:border-sd-primary focus:bg-white/80 focus:ring-[3px] focus:ring-[hsla(250,85%,55%,0.4)]',
    btn: 'inline-flex items-center justify-center gap-2 rounded-[14px] text-sm font-semibold cursor-pointer whitespace-nowrap border border-transparent transition-colors outline-none',
    btnPrimary: 'bg-sd-primary text-white shadow-[0_4px_14px_hsla(250,75%,55%,0.1)] hover:bg-sd-primary-hover',
    btnSecondary: 'bg-white border-sd-border text-sd-text hover:bg-black/5 hover:border-sd-text-2',
    sm: 'px-3.5 py-[7px] text-[13px] rounded-lg',
    md: 'px-[22px] py-2.5',
    iconBtn: 'flex items-center justify-center p-1.5 rounded-lg text-sd-muted cursor-pointer transition-colors hover:text-sd-text hover:bg-black/5',
    iconBtnDanger: 'flex items-center justify-center p-1.5 rounded-lg text-sd-muted cursor-pointer transition-colors hover:text-sd-danger hover:bg-sd-danger-bg',
    tableWrap: 'overflow-x-auto rounded-[14px] border border-sd-border',
    table: 'w-full border-collapse text-[13.5px] [&_th]:px-4 [&_th]:py-[11px] [&_th]:text-left [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.8px] [&_th]:text-sd-muted [&_th]:bg-black/[0.03] [&_th]:border-b [&_th]:border-sd-border [&_th]:whitespace-nowrap [&_td]:px-4 [&_td]:py-[11px] [&_td]:border-b [&_td]:border-sd-border [&_tr:last-child_td]:border-b-0 [&_tbody_tr:hover_td]:bg-black/[0.015]',
    badge: 'inline-flex items-center justify-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold whitespace-nowrap',
    badgeAdmin: 'bg-sd-primary-glow text-sd-primary',
    badgeActive: 'bg-sd-success-bg text-sd-success',
    badgeInactive: 'bg-sd-danger-bg text-sd-danger',
    docTag: 'px-2 py-0.5 rounded-md text-[11px] bg-black/[0.04] text-sd-muted border border-sd-border',
    tableControls: 'flex items-center justify-between gap-4 flex-wrap mb-4',
    banner: 'flex items-start gap-3 px-[18px] py-3.5 rounded-[14px] bg-sd-info-bg border border-[rgba(14,165,233,0.25)] text-sd-text-2 text-[13px] leading-normal mb-5',
    emptyCell: 'text-center text-sd-muted py-6'
  };
  function btn(kind, size) { return CLS.btn + ' ' + (kind === 'primary' ? CLS.btnPrimary : CLS.btnSecondary) + ' ' + (size === 'sm' ? CLS.sm : CLS.md); }
  function iconBtn(act, id, title, icon, danger) {
    return '<button type="button" class="' + (danger ? CLS.iconBtnDanger : CLS.iconBtn) + '" title="' + title + '" data-act="' + act + '" data-id="' + esc(id) + '">' + svg(icon, 'w-[15px] h-[15px]') + '</button>';
  }
  function moveBtns(act, id) {
    var c = CLS.iconBtn + ' !w-[22px] !h-[22px] !p-0';
    return '<button type="button" class="' + c + '" title="เลื่อนขึ้น" data-act="' + act + '" data-id="' + esc(id) + '" data-dir="-1">' + svg('up', 'w-3 h-3') + '</button>' +
           '<button type="button" class="' + c + '" title="เลื่อนลง" data-act="' + act + '" data-id="' + esc(id) + '" data-dir="1">' + svg('down', 'w-3 h-3') + '</button>';
  }
  function switchToggle(act, id, checked, title) {
    return '<label class="relative inline-block w-11 h-6 shrink-0 cursor-pointer" title="' + title + '">' +
      '<input type="checkbox" class="peer sr-only" data-change="' + act + '" data-id="' + esc(id) + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="absolute inset-0 rounded-full border border-sd-border bg-black/10 transition-colors peer-checked:bg-sd-primary before:content-[\'\'] before:absolute before:h-4 before:w-4 before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:shadow-[0_1px_3px_rgba(0,0,0,0.4)] before:transition-transform peer-checked:before:translate-x-5"></span></label>';
  }
  function field(label, inner, req, forId) {
    return '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '"' + (forId ? ' for="' + forId + '"' : '') + '>' + label + (req ? ' <span class="' + CLS.req + '">*</span>' : '') + '</label>' + inner + '</div>';
  }
  function cardHeader(icon, title, right) {
    return '<div class="' + CLS.cardHead + '"><h3 class="' + CLS.cardTitle + '">' + svg(icon, CLS.cardIcon) + title + '</h3>' + (right || '') + '</div>';
  }
  function banner(strong, text) {
    return '<div class="' + CLS.banner + '">' + svg('info', 'w-5 h-5 text-sd-info shrink-0 mt-px') + '<div><strong class="text-sd-info">' + strong + '</strong><span>' + text + '</span></div></div>';
  }
  function statCard(iconName, tone, label, valueId, value) {
    var tones = {
      primary: 'bg-sd-primary-glow text-sd-primary', success: 'bg-sd-success-bg text-sd-success',
      warning: 'bg-sd-warning-bg text-sd-warning', info: 'bg-sd-info-bg text-sd-info', danger: 'bg-sd-danger-bg text-sd-danger'
    };
    return '<div class="' + CLS.statCard + '"><div class="' + CLS.statIcon + ' ' + tones[tone] + '">' + svg(iconName, 'w-5 h-5') + '</div>' +
      '<div><div class="' + CLS.statLabel + '">' + label + '</div><div class="' + CLS.statValue + '" id="' + valueId + '">' + value + '</div></div></div>';
  }
  function searchBox(id, placeholder) {
    return '<div class="relative grow max-w-[360px] min-w-[200px]">' + svg('search', 'absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-sd-muted pointer-events-none') +
      '<input type="text" id="' + id + '" class="' + CLS.input + ' !pl-9" placeholder="' + placeholder + '"></div>';
  }
  function statusSelect(id, w) {
    return '<select id="' + id + '" class="' + CLS.input + ' !w-[150px]"><option value="all">ทุกสถานะ</option><option value="active">เปิดใช้งาน</option><option value="inactive">ปิดใช้งาน</option></select>';
  }
  var SEL_COLOR_OPTS = '<option value="primary">น้ำเงิน (Primary)</option><option value="success">เขียว (Success)</option><option value="warning">ส้ม (Warning)</option><option value="danger">แดง (Danger)</option><option value="info">ฟ้า (Info)</option>';
  var COLOR_HEX = { danger: '#f87171', warning: '#fb923c', primary: '#60a5fa', success: '#4ade80', info: '#38bdf8' };

  // แถบ outline (เดิม setupSettingsOutlines) — แถบลิงก์เลื่อนไปยังการ์ดในหน้า
  function outline(items) {
    return '<nav class="sticky top-[76px] z-10 w-fit max-w-full mb-6 flex flex-wrap gap-1.5 p-4 rounded-[20px] bg-white border border-sd-border">' +
      items.map(function (it, i) {
        return '<button type="button" data-act="outline" data-target="' + it[0] + '" class="outline-link flex items-center gap-2 px-3 py-2 rounded-md text-[13px] border-l-2 cursor-pointer transition-colors ' +
          (i === 0 ? 'bg-sd-primary-glow text-sd-primary border-sd-primary font-medium' : 'border-transparent text-sd-text-2 hover:bg-black/[0.02] hover:text-sd-primary') + '">' + it[1] + '</button>';
      }).join('') + '</nav>';
  }
  var OUTLINE_ON = ['bg-sd-primary-glow', 'text-sd-primary', 'border-sd-primary', 'font-medium'];
  var OUTLINE_OFF = ['border-transparent', 'text-sd-text-2'];

  // ---------------------------------------------------------------- toast + modals
  var toastTimer = null;
  function showToast(msg, type) {
    var el = $('toast');
    $('toast-message').textContent = msg;
    var color = type === 'error' ? 'text-red-500' : (type === 'warning' ? 'text-amber-500' : (type === 'info' ? 'text-sky-500' : 'text-emerald-500'));
    var icon = type === 'error' ? ICON.xCircle : (type === 'warning' ? ICON.warn : (type === 'info' ? ICON.info : ICON.checkCircle));
    $('toast-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 ' + color + '">' + icon + '</svg>';
    el.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none'); }, 2600);
  }

  function openModal(id) { var m = $(id); if (m) { m.classList.remove('hidden'); m.classList.add('flex'); } }
  function closeModal(id) { var m = $(id); if (m) { m.classList.add('hidden'); m.classList.remove('flex'); } }

  function modal(id, titleId, title, body, confirmId, confirmLabel, z) {
    return '<div id="' + id + '" class="fixed inset-0 ' + (z || 'z-50') + ' hidden items-center justify-center bg-black/65 p-4">' +
      '<div class="bg-white text-sd-text w-full max-w-[520px] max-h-[85vh] overflow-y-auto rounded-[20px] p-5 sm:p-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-sd-border">' +
      '<div class="flex items-center justify-between mb-5 pb-3.5 border-b border-sd-border"><h3 id="' + titleId + '" class="font-heading text-base font-semibold">' + title + '</h3>' +
      '<button type="button" data-act="close" data-modal="' + id + '" class="p-1 rounded-lg text-sd-muted hover:text-sd-text hover:bg-black/5 cursor-pointer">' + svg('x', 'w-5 h-5') + '</button></div>' +
      body +
      '<div class="flex justify-end gap-2.5 mt-5 pt-3.5 border-t border-sd-border">' +
      '<button type="button" data-act="close" data-modal="' + id + '" class="' + btn('secondary') + '">ยกเลิก</button>' +
      '<button type="button" id="' + confirmId + '" class="' + btn('primary') + '">' + confirmLabel + '</button></div></div></div>';
  }
  function input(id, type, ph, extra) {
    return '<input type="' + type + '" id="' + id + '" class="' + CLS.input + '"' + (ph ? ' placeholder="' + ph + '"' : '') + (extra || '') + '>';
  }
  function select(id, opts) { return '<select id="' + id + '" class="' + CLS.input + '">' + opts + '</select>'; }

  var ROLES = ['ผู้อำนวยการ', 'รองผู้อำนวยการ', 'ผู้ดูแลระบบ', 'ครู'];
  var ROLE_OPTS = ROLES.map(function (r) { return '<option value="' + r + '">' + r + '</option>'; }).join('');
  var USER_PERMS = [
    ['view_dashboard', 'ดูหน้าแดชบอร์ดภาพรวม (view_dashboard)'],
    ['view_personnel', 'ดูระบบรายชื่อบุคลากร (view_personnel)'],
    ['edit_personnel', 'เพิ่ม/แก้ไขข้อมูลบุคลากร (edit_personnel)'],
    ['view_leave', 'เข้าใช้งานระบบบริหารการลา (view_leave)'],
    ['approve_leave', 'อนุมัติคำขอการลา (approve_leave)'],
    ['edit_settings', 'เข้าตั้งค่าระบบ & วันเวลา (edit_settings)']
  ];
  var DOC_TYPES = ['ใบลา', 'หนังสือรับรอง', 'เอกสารทั่วไป', 'ใบผ่านงาน'];

  function buildModals() {
    var g2 = 'grid grid-cols-1 sm:grid-cols-2 gap-x-4';
    var html = '';
    html += modal('modal-shift', 'modal-shift-title', 'เพิ่มกะงาน',
      field('ชื่อกะ', input('shift-name', 'text', 'เช่น กะเช้า, กะบ่าย'), true, 'shift-name') +
      '<div class="' + g2 + '">' + field('เวลาเริ่ม', input('shift-start', 'time', '', ' value="08:00"'), false, 'shift-start') +
      field('เวลาสิ้นสุด', input('shift-end', 'time', '', ' value="17:00"'), false, 'shift-end') + '</div>',
      'btn-confirm-shift', 'บันทึกกะ');
    html += modal('modal-holiday', 'modal-holiday-title', 'เพิ่มวันหยุด',
      field('วันที่', input('holiday-date', 'date'), true, 'holiday-date') +
      field('ชื่อวันหยุด', input('holiday-name', 'text', 'เช่น วันสงกรานต์'), true, 'holiday-name') +
      field('ประเภท', select('holiday-type', '<option value="national">วันหยุดนักขัตฤกษ์</option><option value="school">วันหยุดของโรงเรียน</option><option value="special">วันหยุดพิเศษ</option>'), false, 'holiday-type'),
      'btn-confirm-holiday', 'เพิ่มวันหยุด');
    html += modal('modal-user-role', 'modal-user-role-title', 'แก้ไขบทบาทและสิทธิ์ผู้ใช้งาน',
      field('ชื่อผู้ใช้งาน', input('modal-user-name', 'text', '', ' disabled').replace('bg-white/50', 'bg-black/[0.04] text-sd-muted')) +
      field('บทบาทในระบบ', select('modal-user-role-select', ROLE_OPTS), true, 'modal-user-role-select') +
      field('สถานะบัญชี', select('modal-user-status', '<option value="active">เปิดใช้งาน</option><option value="inactive">ปิดใช้งาน</option>'), false, 'modal-user-status') +
      '<div class="' + CLS.formGroup + '"><label class="text-[12.5px] font-semibold text-sd-text-2">กำหนดสิทธิ์เข้าใช้งานเพิ่มเติม (รายบุคคล/ตำแหน่ง)</label>' +
      '<div id="modal-user-permissions-list" class="flex flex-col gap-2.5 p-3 bg-white border border-sd-border rounded-[14px] max-h-[180px] overflow-y-auto">' +
      USER_PERMS.map(function (p) {
        return '<label class="flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer"><input type="checkbox" value="' + p[0] + '" class="accent-[hsl(250,75%,55%)]"><span class="text-[12.5px] text-sd-text">' + p[1] + '</span></label>';
      }).join('') + '</div></div>',
      'btn-confirm-user-role', 'บันทึก');
    html += modal('modal-signatory', 'modal-sign-title', 'เพิ่มผู้ลงนาม',
      field('คำนำหน้า', select('sign-prefix', '<option>นาย</option><option>นาง</option><option>นางสาว</option><option>ดร.</option>'), false, 'sign-prefix') +
      field('ชื่อ-นามสกุล', input('sign-fullname', 'text', 'ชื่อ-นามสกุล'), true, 'sign-fullname') +
      field('ตำแหน่ง', input('sign-position', 'text', 'เช่น ผู้อำนวยการโรงเรียน'), true, 'sign-position') +
      field('ลำดับการลงนาม', select('sign-order', '<option value="1">ลำดับที่ 1 (ผู้ลงนามหลัก)</option><option value="2">ลำดับที่ 2</option><option value="3">ลำดับที่ 3</option>'), false, 'sign-order') +
      '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '">ประเภทเอกสารที่รับผิดชอบ</label><div id="sign-doc-types" class="grid grid-cols-2 gap-2.5">' +
      DOC_TYPES.map(function (d) {
        return '<label class="relative cursor-pointer"><input type="checkbox" value="' + d + '" class="peer absolute opacity-0 w-0 h-0">' +
          '<span class="flex items-center justify-center p-2.5 rounded-[14px] border border-sd-border text-[13px] font-medium text-sd-text-2 text-center transition-colors hover:bg-black/[0.03] peer-checked:bg-sd-primary-glow peer-checked:border-sd-primary peer-checked:text-sd-text">' + d + '</span></label>';
      }).join('') + '</div></div>',
      'btn-confirm-signatory', 'บันทึก');
    html += modal('modal-staff-type', 'modal-staff-type-title', 'เพิ่มประเภทบุคลากร',
      field('ชื่อประเภทบุคลากร', input('stt-modal-name', 'text', 'เช่น ครูอัตราจ้าง'), true, 'stt-modal-name') +
      '<div class="' + g2 + '">' + field('รหัส', input('stt-modal-code', 'text', 'เช่น HIRE', ' style="text-transform:uppercase"'), false, 'stt-modal-code') +
      field('สีประจำประเภท', select('stt-modal-color', SEL_COLOR_OPTS), false, 'stt-modal-color') + '</div>' +
      field('คำอธิบาย', '<textarea id="stt-modal-desc" rows="2" class="' + CLS.input + '" placeholder="อธิบายลักษณะของบุคลากรกลุ่มนี้"></textarea>', false, 'stt-modal-desc'),
      'btn-confirm-staff-type', 'บันทึก');
    html += modal('modal-position', 'modal-position-title', 'เพิ่มตำแหน่ง',
      field('ชื่อตำแหน่ง', input('pos-modal-name', 'text', 'เช่น ครู (คศ.1)'), true, 'pos-modal-name') +
      field('รหัส', input('pos-modal-code', 'text', 'เช่น T1', ' style="text-transform:uppercase"'), false, 'pos-modal-code') +
      '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '">สังกัดประเภทบุคลากร <span class="' + CLS.req + '">*</span></label><div id="pos-modal-types-list" class="flex flex-wrap gap-2"></div></div>',
      'btn-confirm-position', 'บันทึก');
    html += modal('modal-department', 'modal-department-title', 'เพิ่มแผนก/กลุ่มสาระการเรียนรู้',
      field('ชื่อแผนก/กลุ่มสาระการเรียนรู้', input('dep-modal-name', 'text', 'เช่น วิทยาศาสตร์และเทคโนโลยี'), true, 'dep-modal-name') +
      '<div class="' + g2 + '">' + field('รหัส', input('dep-modal-code', 'text', 'เช่น SCI', ' style="text-transform:uppercase"'), false, 'dep-modal-code') +
      field('สีประจำแผนก', select('dep-modal-color', SEL_COLOR_OPTS), false, 'dep-modal-color') + '</div>' +
      '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '" for="dep-modal-head">หัวหน้าแผนก</label>' + select('dep-modal-head', '<option value="">-- ไม่ระบุ --</option>') +
      '<span class="text-[11px] text-sd-muted mt-1 block">เลือกจากรายชื่อบุคลากรที่มีอยู่ในระบบ (ไม่บังคับ)</span></div>' +
      field('คำอธิบาย', '<textarea id="dep-modal-desc" rows="2" class="' + CLS.input + '" placeholder="อธิบายลักษณะของแผนก/กลุ่มสาระฯ นี้"></textarea>', false, 'dep-modal-desc'),
      'btn-confirm-department', 'บันทึก');
    // confirm / error dialog (แทน App.showConfirm)
    html += '<div id="modal-confirm" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/65 p-4">' +
      '<div class="bg-white text-sd-text w-full max-w-[440px] rounded-[20px] p-5 sm:p-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] border border-sd-border">' +
      '<h3 id="confirm-title" class="font-heading text-base font-semibold mb-3"></h3>' +
      '<p id="confirm-message" class="text-[13.5px] text-sd-text-2 leading-relaxed"></p>' +
      '<div class="flex justify-end gap-2.5 mt-5 pt-3.5 border-t border-sd-border">' +
      '<button type="button" id="confirm-cancel" data-act="close" data-modal="modal-confirm" class="' + btn('secondary') + '">ยกเลิก</button>' +
      '<button type="button" id="confirm-ok" class="' + btn('primary') + '">ยืนยัน</button></div></div></div>';
    $('modal-root').innerHTML = html;
  }

  var confirmCb = null;
  function showConfirm(o) {
    $('confirm-title').textContent = o.title;
    $('confirm-message').textContent = o.message;
    $('confirm-ok').textContent = o.confirmLabel || 'ยืนยัน';
    confirmCb = o.onConfirm || null;
    openModal('modal-confirm');
  }

  // ---------------------------------------------------------------- tab: schedule
  var DAYS = [['sun', 'อา'], ['mon', 'จ'], ['tue', 'อ'], ['wed', 'พ'], ['thu', 'พฤ'], ['fri', 'ศ'], ['sat', 'ส']];
  function workdaysLabel(arr) {
    var idx = DAYS.map(function (d) { return d[0]; });
    var sel = DAYS.filter(function (d) { return arr.indexOf(d[0]) !== -1; });
    if (!sel.length) return '-';
    var contiguous = sel.every(function (d, i) { return i === 0 || idx.indexOf(d[0]) === idx.indexOf(sel[i - 1][0]) + 1; });
    return contiguous && sel.length > 1 ? sel[0][1] + '–' + sel[sel.length - 1][1] : sel.map(function (d) { return d[1]; }).join(', ');
  }

  function scheduleHtml() {
    var ws = S.get('sd_work_start'), we = S.get('sd_work_end'), lt = S.get('sd_late_threshold'), wd = S.get('sd_workdays');
    var g4 = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4';
    var g3 = 'grid grid-cols-1 md:grid-cols-3 gap-x-4';
    var unit = function (id, val) {
      return '<div class="flex items-center gap-2">' + input(id, 'number', '', ' value="' + val + '" min="1" max="60"') + '<span class="text-[13px] text-sd-muted whitespace-nowrap">นาที</span></div>';
    };
    return outline([['section-schedule-stats', '📊 ภาพรวมวันทำงาน'], ['section-schedule-normal', '⏰ เวลาทำงานปกติ'], ['section-schedule-shifts', '🗓️ จัดการกะพิเศษ'], ['section-schedule-holidays', '🏖️ วันหยุดโรงเรียน']]) +
      '<div id="section-schedule-stats" class="' + CLS.statRow + '">' +
      statCard('clock', 'primary', 'เวลาเข้างานปกติ', 'display-start-time', esc(ws) + ' น.') +
      statCard('clock', 'success', 'เวลาเลิกงานปกติ', 'display-end-time', esc(we) + ' น.') +
      statCard('warn', 'warning', 'ขีดจำกัดสาย', 'display-late-threshold', esc(lt) + ' นาที') +
      statCard('cal', 'info', 'วันทำงาน', 'display-workdays', esc(workdaysLabel(wd))) + '</div>' +

      '<div id="section-schedule-normal" class="' + CLS.card + '">' +
      cardHeader('clock', 'เวลาทำงานหลัก (กะปกติ)', '<button type="button" id="btn-save-hours" data-act="save-hours" class="' + btn('primary', 'sm') + '">บันทึก</button>') +
      '<div class="' + g4 + '">' +
      field('เวลาเข้างาน', input('work-start', 'time', '', ' value="' + esc(ws) + '"'), true, 'work-start') +
      field('เวลาเลิกงาน', input('work-end', 'time', '', ' value="' + esc(we) + '"'), true, 'work-end') +
      field('เวลาพักกลางวัน (เริ่ม)', input('lunch-start', 'time', '', ' value="' + esc(S.get('sd_lunch_start')) + '"'), false, 'lunch-start') +
      field('เวลาพักกลางวัน (สิ้นสุด)', input('lunch-end', 'time', '', ' value="' + esc(S.get('sd_lunch_end')) + '"'), false, 'lunch-end') + '</div>' +
      '<div class="h-px bg-sd-border my-5"></div>' +
      '<div class="' + g3 + '">' +
      field('นาทีที่ถือว่า "มาสาย" (นาที)', unit('late-threshold', S.get('sd_late_threshold')), false, 'late-threshold') +
      field('นาทีที่ถือว่า "กลับก่อน" (นาที)', unit('early-out-threshold', S.get('sd_early_out_threshold')), false, 'early-out-threshold') +
      field('เวลาเริ่มนับ OT (หลังเลิกงาน)', input('ot-start', 'time', '', ' value="' + esc(S.get('sd_ot_start')) + '"'), false, 'ot-start') + '</div></div>' +

      '<div class="' + CLS.card + '">' + cardHeader('cal', 'กำหนดวันทำงานประจำสัปดาห์') +
      '<p class="' + CLS.cardDesc + '">เลือกวันที่นับเป็นวันทำงาน (วันที่ไม่ได้เลือกจะถือว่าเป็นวันหยุด)</p>' +
      '<div id="weekday-selector" class="flex flex-wrap gap-2.5">' +
      DAYS.map(function (d) {
        return '<label class="relative cursor-pointer"><input type="checkbox" value="' + d[0] + '" class="peer absolute opacity-0 w-0 h-0"' + (wd.indexOf(d[0]) !== -1 ? ' checked' : '') + '>' +
          '<span class="flex items-center justify-center w-[46px] h-[46px] rounded-xl text-sm font-semibold border-[1.5px] border-sd-border text-sd-text-2 transition-colors hover:bg-black/5 hover:text-sd-text peer-checked:bg-sd-primary peer-checked:border-sd-primary peer-checked:text-white peer-checked:shadow-[0_0_12px_hsla(250,75%,55%,0.25)]">' + d[1] + '</span></label>';
      }).join('') + '</div></div>' +

      '<div id="section-schedule-shifts" class="' + CLS.card + '">' +
      cardHeader('layers', 'กะพิเศษ / กะนักเรียน', '<button type="button" id="btn-add-shift" data-act="add-shift" class="' + btn('secondary', 'sm') + '">' + svg('plus', 'w-3.5 h-3.5') + 'เพิ่มกะ</button>') +
      '<div id="shifts-list" class="flex flex-col gap-2.5"></div></div>' +

      '<div id="section-schedule-holidays" class="' + CLS.card + '">' +
      cardHeader('checkCircle', 'วันหยุดนักขัตฤกษ์ / วันหยุดพิเศษ', '<button type="button" id="btn-add-holiday" data-act="add-holiday" class="' + btn('secondary', 'sm') + '">' + svg('plus', 'w-3.5 h-3.5') + 'เพิ่มวันหยุด</button>') +
      '<div class="' + CLS.tableWrap + '"><table id="holiday-table" class="' + CLS.table + '"><thead><tr><th>วันที่</th><th>ชื่อวันหยุด</th><th>ประเภท</th><th class="!text-center w-20">จัดการ</th></tr></thead><tbody id="holiday-table-body"></tbody></table></div></div>';
  }

  function renderShifts() {
    var el = $('shifts-list'); if (!el) return;
    var shifts = S.get('sd_shifts');
    if (!shifts.length) { el.innerHTML = '<div class="text-center text-sd-muted text-[13px] p-4">ยังไม่มีการตั้งกะงานพิเศษ</div>'; return; }
    el.innerHTML = shifts.map(function (s) {
      return '<div class="flex items-center justify-between gap-3 px-4 py-3 rounded-[14px] bg-black/[0.02] border border-sd-border transition-colors hover:bg-black/[0.04]">' +
        '<div class="flex items-center gap-x-4 gap-y-1 flex-wrap min-w-0"><span class="text-sm font-semibold">' + esc(s.name) + '</span><span class="text-xs text-sd-muted">' + esc(s.start) + ' น. - ' + esc(s.end) + ' น.</span></div>' +
        '<div class="flex gap-2 shrink-0">' + iconBtn('edit-shift', s.id, 'แก้ไข', 'edit') + iconBtn('delete-shift', s.id, 'ลบ', 'trash', true) + '</div></div>';
    }).join('');
  }
  var HOLIDAY_TYPES = {
    national: ['วันหยุดราชการ/นักขัตฤกษ์', 'bg-sd-danger-bg text-sd-danger'],
    school: ['วันหยุดทั่วไป', 'bg-sd-info-bg text-sd-info'],
    special: ['วันหยุดกรณีพิเศษ', 'bg-sd-warning-bg text-sd-warning']
  };
  function renderHolidays() {
    var body = $('holiday-table-body'); if (!body) return;
    var list = S.get('sd_holidays');
    if (!list.length) { body.innerHTML = '<tr><td colspan="4" class="' + CLS.emptyCell + '">ไม่พบรายการวันหยุด</td></tr>'; return; }
    body.innerHTML = list.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).map(function (h) {
      var t = HOLIDAY_TYPES[h.type] || HOLIDAY_TYPES.school;
      return '<tr><td class="whitespace-nowrap">' + esc(formatThaiDate(h.date)) + '</td><td class="font-medium">' + esc(h.name) + '</td>' +
        '<td><span class="inline-flex px-2 py-[3px] rounded-md text-[11px] font-semibold whitespace-nowrap ' + t[1] + '">' + t[0] + '</span></td>' +
        '<td class="text-center"><div class="flex justify-center">' + iconBtn('delete-holiday', h.date, 'ลบ', 'trash', true) + '</div></td></tr>';
    }).join('');
  }
  function refreshScheduleStats() {
    var set = function (id, v) { var e = $(id); if (e) e.textContent = v; };
    set('display-start-time', S.get('sd_work_start') + ' น.');
    set('display-end-time', S.get('sd_work_end') + ' น.');
    set('display-late-threshold', S.get('sd_late_threshold') + ' นาที');
    set('display-workdays', workdaysLabel(S.get('sd_workdays')));
  }
  function saveHours() {
    S.set('sd_work_start', $('work-start').value);
    S.set('sd_work_end', $('work-end').value);
    S.set('sd_lunch_start', $('lunch-start').value);
    S.set('sd_lunch_end', $('lunch-end').value);
    S.set('sd_late_threshold', parseInt($('late-threshold').value, 10) || 15);
    S.set('sd_early_out_threshold', parseInt($('early-out-threshold').value, 10) || 15);
    S.set('sd_ot_start', $('ot-start').value);
    var days = [];
    document.querySelectorAll('#weekday-selector input').forEach(function (cb) { if (cb.checked) days.push(cb.value); });
    S.set('sd_workdays', days);
    refreshScheduleStats();
    showToast('บันทึกการตั้งค่าวันเวลา วันหยุด และกะงานเรียบร้อยแล้ว', 'success');
  }

  var editingShiftId = null;
  function openShiftModal(id) {
    editingShiftId = id || null;
    var s = id ? S.get('sd_shifts').filter(function (x) { return x.id === id; })[0] : null;
    if (id && !s) return;
    $('modal-shift-title').textContent = s ? 'แก้ไขกะงานพิเศษ' : 'เพิ่มกะงานพิเศษ';
    $('shift-name').value = s ? s.name : '';
    $('shift-start').value = s ? s.start : '08:00';
    $('shift-end').value = s ? s.end : '17:00';
    openModal('modal-shift');
  }
  function confirmShift() {
    var name = $('shift-name').value.trim(), start = $('shift-start').value, end = $('shift-end').value;
    if (!name) { showToast('กรุณากรอกชื่อกะงาน', 'error'); return; }
    var list = S.get('sd_shifts');
    if (editingShiftId) {
      var s = list.filter(function (x) { return x.id === editingShiftId; })[0];
      if (s) { s.name = name; s.start = start; s.end = end; }
      showToast('แก้ไขกะงานเรียบร้อยแล้ว', 'success');
    } else {
      list.push({ id: nextId('S', list, 3), name: name, start: start, end: end });
      showToast('เพิ่มกะงานพิเศษเรียบร้อยแล้ว', 'success');
    }
    S.set('sd_shifts', list);
    closeModal('modal-shift');
    renderShifts();
  }
  function deleteShift(id) {
    var s = S.get('sd_shifts').filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    showConfirm({
      title: 'ยืนยันการลบ', message: 'ต้องการลบกะงาน "' + s.name + '" ใช่หรือไม่?', confirmLabel: 'ลบ',
      onConfirm: function () {
        S.set('sd_shifts', S.get('sd_shifts').filter(function (x) { return x.id !== id; }));
        renderShifts();
        showToast('ลบกะงานแล้ว', 'warning');
      }
    });
  }
  function openHolidayModal() {
    $('holiday-date').value = ''; $('holiday-name').value = ''; $('holiday-type').value = 'national';
    openModal('modal-holiday');
  }
  function confirmHoliday() {
    var date = $('holiday-date').value, name = $('holiday-name').value.trim(), type = $('holiday-type').value;
    if (!date || !name) { showToast('กรุณากรอกข้อมูลวันหยุดให้ครบถ้วน', 'error'); return; }
    var list = S.get('sd_holidays');
    if (list.some(function (h) { return h.date === date; })) { showToast('มีวันหยุดในวันที่เลือกนี้อยู่แล้ว', 'error'); return; }
    list.push({ date: date, name: name, type: type });
    S.set('sd_holidays', list);
    closeModal('modal-holiday');
    renderHolidays();
    showToast('เพิ่มวันหยุดพิเศษแล้ว', 'success');
  }
  function deleteHoliday(date) {
    var h = S.get('sd_holidays').filter(function (x) { return x.date === date; })[0];
    if (!h) return;
    showConfirm({
      title: 'ยืนยันการลบ', message: 'ต้องการลบวันหยุด "' + h.name + '" (' + formatThaiDate(h.date) + ') ใช่หรือไม่?', confirmLabel: 'ลบ',
      onConfirm: function () {
        S.set('sd_holidays', S.get('sd_holidays').filter(function (x) { return x.date !== date; }));
        renderHolidays();
        showToast('ลบวันหยุดแล้ว', 'warning');
      }
    });
  }

  // ---------------------------------------------------------------- tab: permissions
  var ROLE_CARDS = [
    ['ผอ.', 'ผู้อำนวยการ', 'ผู้อำนวยการ', 'count-director', 'linear-gradient(135deg,hsl(350,84%,55%),hsl(350,84%,40%))'],
    ['รอง', 'รองผู้อำนวยการ', 'รองผู้อำนวยการ', 'count-vp', 'linear-gradient(135deg,hsl(38,92%,50%),hsl(38,92%,35%))'],
    ['ผท.', 'ผู้ดูแลระบบ (HR)', 'ผู้ดูแลระบบ', 'count-admin', 'linear-gradient(135deg,hsl(250,85%,65%),hsl(250,85%,50%))'],
    ['ครู', 'ครู / อาจารย์', 'ครู', 'count-teacher', 'linear-gradient(135deg,hsl(199,89%,48%),hsl(199,89%,35%))']
  ];
  var PERM_MATRIX = [
    ['📋 ระบบการลา', [['ดูใบลาทั้งหมด', 'aaad'], ['ยื่นใบลา', 'aaaa'], ['อนุมัติ/ปฏิเสธใบลา', 'aadd'], ['ตั้งค่าการลา', 'adad']]],
    ['👤 ระบบบุคลากร', [['ดูข้อมูลบุคลากร', 'aaap'], ['แก้ไขข้อมูลบุคลากร', 'adad'], ['นำเข้าข้อมูล (Import)', 'adad']]],
    ['⚙️ การตั้งค่าระบบ', [['การตั้งค่าทั่วไป', 'adad'], ['จัดการสิทธิ์ผู้ใช้', 'addd']]]
  ];
  function dot(k) {
    var m = { a: ['bg-sd-success-bg text-sd-success', '✓'], d: ['bg-sd-danger-bg text-sd-danger', '✕'], p: ['bg-sd-warning-bg text-sd-warning', '~'] }[k];
    return '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ' + m[0] + '">' + m[1] + '</span>';
  }

  function permissionsHtml() {
    var matrixRows = PERM_MATRIX.map(function (g) {
      return '<tr><td colspan="5" class="!text-xs !font-bold !text-sd-muted !bg-black/[0.02] !py-2 tracking-[0.5px]">' + g[0] + '</td></tr>' +
        g[1].map(function (r) {
          return '<tr><td class="text-sd-text-2">' + r[0] + '</td>' + r[1].split('').map(function (k) { return '<td class="text-center">' + dot(k) + '</td>'; }).join('') + '</tr>';
        }).join('');
    }).join('');
    var permTable = '<table class="' + CLS.table.replace('[&_th]:text-left', '[&_th]:text-left') + '"><thead><tr><th>ฟีเจอร์ / โมดูล</th><th class="!text-center w-20">ผอ.</th><th class="!text-center w-20">รองผอ.</th><th class="!text-center w-20">ผท.ระบบ</th><th class="!text-center w-20">ครู</th></tr></thead><tbody>' + matrixRows + '</tbody></table>';
    return outline([['section-permissions-matrix', '🛡️ ตารางสิทธิ์เข้าถึง'], ['section-permissions-users', '👥 บทบาทรายบุคคล']]) +
      '<div class="' + CLS.statRow + '">' + ROLE_CARDS.map(function (r) {
        return '<div class="flex items-center gap-3.5 p-4 rounded-[20px] bg-white border border-sd-border shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">' +
          '<div class="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-[13px] font-heading" style="background:' + r[4] + '">' + r[0] + '</div>' +
          '<div class="grow"><div class="text-[13px] font-semibold">' + r[1] + '</div><div class="text-xs text-sd-muted mt-0.5" id="' + r[3] + '">0 คน</div></div></div>';
      }).join('') + '</div>' +
      '<div id="section-permissions-matrix" class="' + CLS.card + '">' + cardHeader('lock', 'สิทธิ์การเข้าถึงตามบทบาท (Role Matrix)') +
      '<div class="' + CLS.tableWrap + '">' + permTable + '</div>' +
      '<div class="flex flex-wrap gap-x-5 gap-y-2 mt-3.5 pt-3 border-t border-sd-border text-xs text-sd-muted"><span class="flex items-center gap-1.5">' + dot('a') + ' มีสิทธิ์</span><span class="flex items-center gap-1.5">' + dot('d') + ' ไม่มีสิทธิ์</span><span class="flex items-center gap-1.5">' + dot('p') + ' สิทธิ์จำกัด (เฉพาะข้อมูลตัวเอง)</span></div></div>' +
      '<div id="section-permissions-users" class="' + CLS.card + '">' +
      cardHeader('user', 'จัดการบทบาทผู้ใช้งานรายบุคคล',
        '<div class="flex gap-2 items-center flex-wrap"><div class="relative">' + svg('search', 'absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sd-muted pointer-events-none') +
        '<input type="text" id="user-search" class="' + CLS.input + ' !pl-8 !py-1.5 !w-[200px]" placeholder="ค้นหาชื่อ..."></div>' +
        '<select id="filter-role" class="' + CLS.input + ' !w-[140px] !py-1.5 !text-[13px]"><option value="">ทุกบทบาท</option>' + ROLE_OPTS + '</select></div>') +
      '<div class="' + CLS.tableWrap + '"><table class="' + CLS.table + '"><thead><tr><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th>บทบาทในระบบ</th><th>สถานะ</th><th class="!text-center w-[100px]">จัดการ</th></tr></thead><tbody id="user-role-table-body"></tbody></table></div></div>';
  }
  function renderUserCounts() {
    var users = S.get('sd_users');
    ROLE_CARDS.forEach(function (r) {
      var n = users.filter(function (u) { return u.role === r[2] && u.status === 'active'; }).length;
      var e = $(r[3]); if (e) e.textContent = n + ' คน';
    });
  }
  function renderUsers() {
    var body = $('user-role-table-body'); if (!body) return;
    renderUserCounts();
    var q = ($('user-search').value || '').toLowerCase(), role = $('filter-role').value;
    var list = S.get('sd_users').filter(function (u) {
      return ((u.name || '').toLowerCase().indexOf(q) !== -1 || (u.position || '').toLowerCase().indexOf(q) !== -1) && (!role || u.role === role);
    });
    if (!list.length) { body.innerHTML = '<tr><td colspan="5" class="' + CLS.emptyCell + '">ไม่พบข้อมูลผู้ใช้</td></tr>'; return; }
    body.innerHTML = list.map(function (u) {
      var active = u.status === 'active';
      return '<tr><td class="font-semibold text-sd-text">' + esc(u.name) + '</td><td>' + esc(u.position) + '</td>' +
        '<td><span class="' + CLS.badge + ' ' + CLS.badgeAdmin + '">' + esc(u.role) + '</span></td>' +
        '<td><span class="' + CLS.badge + ' ' + (active ? CLS.badgeActive : CLS.badgeInactive) + '">' + (active ? 'เปิดใช้งาน' : 'ปิดใช้งาน') + '</span></td>' +
        '<td class="text-center"><button type="button" class="' + btn('secondary', 'sm') + '" data-act="edit-user" data-id="' + esc(u.id) + '">' + svg('pencil', 'w-[13px] h-[13px]') + 'สิทธิ์</button></td></tr>';
    }).join('');
  }
  var editingUserId = null;
  function openUserRoleModal(id) {
    var u = S.get('sd_users').filter(function (x) { return x.id === id; })[0];
    if (!u) return;
    editingUserId = id;
    $('modal-user-name').value = u.name;
    $('modal-user-role-select').value = u.role;
    $('modal-user-status').value = u.status === 'inactive' ? 'inactive' : 'active';
    var perms = u.perms || [];
    document.querySelectorAll('#modal-user-permissions-list input').forEach(function (cb) { cb.checked = perms.indexOf(cb.value) !== -1; });
    openModal('modal-user-role');
  }
  function confirmUserRole() {
    var list = S.get('sd_users');
    var u = list.filter(function (x) { return x.id === editingUserId; })[0];
    if (!u) return;
    u.role = $('modal-user-role-select').value;
    u.status = $('modal-user-status').value;
    u.perms = [];
    document.querySelectorAll('#modal-user-permissions-list input').forEach(function (cb) { if (cb.checked) u.perms.push(cb.value); });
    S.set('sd_users', list);
    closeModal('modal-user-role');
    renderUsers();
    showToast('บันทึกบทบาทและสิทธิ์ของ "' + u.name + '" เรียบร้อยแล้ว', 'success');
  }

  // ---------------------------------------------------------------- tab: signatories
  function signatoriesHtml() {
    return outline([['section-signatories-cards', '✍️ ผู้ลงนามหลัก'], ['section-signatories-docs', '📄 กำหนดตามเอกสาร']]) +
      banner('ผู้ลงนามในเอกสาร', ' — กำหนดรายชื่อบุคคลที่ปรากฏเป็นผู้ลงนามในใบลา, หนังสือรับรอง และเอกสารราชการต่างๆ ที่ออกโดยโรงเรียน') +
      '<div id="section-signatories-cards" class="' + CLS.card + '">' +
      cardHeader('shield', 'รายชื่อผู้ลงนาม', '<button type="button" id="btn-add-signatory" data-act="add-signatory" class="' + btn('primary', 'sm') + '">' + svg('plus', 'w-3.5 h-3.5') + 'เพิ่มผู้ลงนาม</button>') +
      '<div id="signatory-grid" class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4"></div></div>' +
      '<div id="section-signatories-docs" class="' + CLS.card + '">' + cardHeader('file', 'กำหนดผู้ลงนามตามประเภทเอกสาร') + '<div id="doc-sign-list" class="flex flex-col gap-3"></div></div>';
  }
  function renderSignatoryCards() {
    var grid = $('signatory-grid'); if (!grid) return;
    var list = S.get('sd_signatories');
    if (!list.length) { grid.innerHTML = '<div class="col-span-full text-center text-sd-muted p-8">ยังไม่มีรายชื่อผู้ลงนามหลัก</div>'; return; }
    grid.innerHTML = list.map(function (s) {
      return '<div class="group relative p-5 rounded-[20px] bg-black/[0.02] border border-sd-border overflow-hidden transition-colors hover:border-sd-primary hover:bg-sd-primary-glow">' +
        '<div class="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity" style="background:linear-gradient(90deg,hsl(250 75% 55%),hsl(199 89% 40%))"></div>' +
        '<div class="absolute top-3.5 right-3.5 flex gap-1">' + iconBtn('edit-signatory', s.id, 'แก้ไข', 'edit') + iconBtn('delete-signatory', s.id, 'ลบ', 'trash', true) + '</div>' +
        '<div class="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-bold text-lg font-heading mb-3.5" style="background:linear-gradient(135deg,hsl(250 75% 55%),hsl(199 89% 40%))">' + esc((s.name || '').substring(0, 2)) + '</div>' +
        '<div class="text-[15px] font-semibold mb-1">' + esc((s.prefix || '') + s.name) + '</div>' +
        '<div class="text-xs text-sd-muted mb-2.5">' + esc(s.position) + '</div>' +
        '<div class="inline-flex px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-sd-primary-glow text-sd-primary mb-3">ผู้ลงนามลำดับที่ ' + esc(s.order) + '</div>' +
        '<div class="flex flex-wrap gap-1.5">' + (s.docTypes || []).map(function (t) { return '<span class="' + CLS.docTag + '">' + esc(t) + '</span>'; }).join('') + '</div></div>';
    }).join('');
  }
  function renderDocSignatories() {
    var box = $('doc-sign-list'); if (!box) return;
    var sigs = S.get('sd_signatories');
    box.innerHTML = S.get('sd_doc_signatories').map(function (item, i) {
      var ids = item.signatoryIds || (item.signatoryId ? [item.signatoryId] : []);   // seed ครั้งแรกยังเป็น signatoryId เดี่ยว
      return '<div class="flex items-center justify-between gap-4 flex-wrap px-4 py-3 rounded-[14px] bg-black/[0.02] border border-sd-border">' +
        '<div class="font-semibold text-sm flex-1 min-w-[120px]">' + esc(item.docType) + '</div>' +
        '<div class="flex flex-wrap gap-3 grow max-w-[550px]">' + sigs.map(function (s) {
          return '<label class="inline-flex items-center gap-1.5 text-[12.5px] cursor-pointer px-2 py-1 bg-black/[0.02] border border-sd-border rounded-md min-w-[180px]">' +
            '<input type="checkbox" class="accent-[hsl(250,75%,55%)]" data-change="assign-doc-sig" data-doc="' + esc(item.docType) + '" data-id="' + esc(s.id) + '"' + (ids.indexOf(s.id) !== -1 ? ' checked' : '') + '>' +
            '<span class="text-sd-text-2">' + esc((s.prefix || '') + s.name) + '</span></label>';
        }).join('') + '</div></div>';
    }).join('');
  }
  var editingSigId = null;
  function openSignatoryModal(id) {
    var s = id ? S.get('sd_signatories').filter(function (x) { return x.id === id; })[0] : null;
    if (id && !s) return;
    editingSigId = id || null;
    $('modal-sign-title').textContent = s ? 'แก้ไขข้อมูลผู้ลงนาม' : 'เพิ่มผู้ลงนามหลัก';
    $('sign-prefix').value = s ? (s.prefix || 'นาย') : 'นาย';
    $('sign-fullname').value = s ? s.name : '';
    $('sign-position').value = s ? s.position : '';
    $('sign-order').value = s ? s.order : '1';
    document.querySelectorAll('#sign-doc-types input').forEach(function (cb) { cb.checked = !!s && (s.docTypes || []).indexOf(cb.value) !== -1; });
    openModal('modal-signatory');
  }
  function confirmSignatory() {
    var prefix = $('sign-prefix').value, name = $('sign-fullname').value.trim(), position = $('sign-position').value.trim();
    var order = parseInt($('sign-order').value, 10) || 1;
    if (!name || !position) { showToast('กรุณากรอกข้อมูลผู้ลงนามให้ครบถ้วน', 'error'); return; }
    var docTypes = [];
    document.querySelectorAll('#sign-doc-types input').forEach(function (cb) { if (cb.checked) docTypes.push(cb.value); });
    var list = S.get('sd_signatories');
    if (editingSigId) {
      var s = list.filter(function (x) { return x.id === editingSigId; })[0];
      if (s) { s.prefix = prefix; s.name = name; s.position = position; s.order = order; s.docTypes = docTypes; }
      showToast('แก้ไขข้อมูลผู้ลงนามแล้ว', 'success');
    } else {
      list.push({ id: nextId('SIG', list, 3), prefix: prefix, name: name, position: position, order: order, docTypes: docTypes });
      showToast('เพิ่มผู้ลงนามใหม่แล้ว', 'success');
    }
    S.set('sd_signatories', list);
    closeModal('modal-signatory');
    renderSignatoryCards();
    renderDocSignatories();
  }
  function deleteSignatory(id) {
    var s = S.get('sd_signatories').filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    showConfirm({
      title: 'ยืนยันการลบ', message: 'ต้องการลบผู้ลงนาม "' + (s.prefix || '') + s.name + '" ใช่หรือไม่?', confirmLabel: 'ลบ',
      onConfirm: function () {
        S.set('sd_signatories', S.get('sd_signatories').filter(function (x) { return x.id !== id; }));
        var docs = S.get('sd_doc_signatories');
        docs.forEach(function (item) {
          if (item.signatoryId === id) item.signatoryId = '';
          if (item.signatoryIds) item.signatoryIds = item.signatoryIds.filter(function (x) { return x !== id; });
        });
        S.set('sd_doc_signatories', docs);
        renderSignatoryCards();
        renderDocSignatories();
        showToast('ลบรายชื่อผู้ลงนามแล้ว', 'warning');
      }
    });
  }
  function assignDocSignatory(docType, sigId, checked) {
    var docs = S.get('sd_doc_signatories');
    var target = docs.filter(function (i) { return i.docType === docType; })[0];
    if (!target) return;
    if (!target.signatoryIds) target.signatoryIds = target.signatoryId ? [target.signatoryId] : [];
    if (checked) { if (target.signatoryIds.indexOf(sigId) === -1) target.signatoryIds.push(sigId); }
    else target.signatoryIds = target.signatoryIds.filter(function (x) { return x !== sigId; });
    S.set('sd_doc_signatories', docs);
  }

  // ---------------------------------------------------------------- shared list helpers (staff types / positions / departments)
  function sortedByOrder(list) { return list.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }); }
  function moveItem(key, id, dir) {
    var list = S.get(key), sorted = sortedByOrder(list);
    var idx = sorted.findIndex(function (x) { return x.id === id; }), swap = idx + dir;
    if (idx === -1 || swap < 0 || swap >= sorted.length) return false;
    var a = sorted[idx], b = sorted[swap], tmp = a.order; a.order = b.order; b.order = tmp;
    S.set(key, list);
    return true;
  }
  function toggleActive(key, id, isActive) {
    var list = S.get(key), it = list.filter(function (x) { return x.id === id; })[0];
    if (!it) return null;
    it.active = isActive; S.set(key, list);
    return it;
  }
  function tools(searchId, searchPh, extraFilters) {
    return '<div class="' + CLS.tableControls + '">' + searchBox(searchId, searchPh) + '<div class="flex gap-2.5 flex-wrap">' + extraFilters + '</div></div>';
  }
  function listHeaderButtons(saveId, saveAct, addId, addAct, addLabel) {
    return '<div class="flex gap-2"><button type="button" id="' + saveId + '" data-act="' + saveAct + '" class="' + btn('secondary', 'sm') + '">' + svg('save', 'w-3.5 h-3.5') + 'บันทึก</button>' +
      '<button type="button" id="' + addId + '" data-act="' + addAct + '" class="' + btn('primary', 'sm') + '">' + svg('plus', 'w-3.5 h-3.5') + addLabel + '</button></div>';
  }
  function countStats(prefix, iconName, totalLabel) {
    return '<div class="' + CLS.statRow + '">' + statCard(iconName, 'primary', totalLabel, prefix + '-count-total', 0) +
      statCard('check', 'success', 'เปิดใช้งานอยู่', prefix + '-count-active', 0) + statCard('xCircle', 'danger', 'ปิดใช้งานอยู่', prefix + '-count-inactive', 0) + '</div>';
  }
  function setCounts(prefix, list) {
    $(prefix + '-count-total').textContent = list.length;
    $(prefix + '-count-active').textContent = list.filter(function (x) { return x.active; }).length;
    $(prefix + '-count-inactive').textContent = list.filter(function (x) { return !x.active; }).length;
  }
  function statusMatch(statusVal, active) { return statusVal === 'all' || (statusVal === 'active' ? active : !active); }
  function rowActions(idPrefix, x, toggleAct, editAct, delAct) {
    return '<div class="flex items-center justify-center gap-2.5">' + switchToggle(toggleAct, x.id, x.active, x.active ? 'ปิดใช้งาน' : 'เปิดใช้งาน') +
      iconBtn(editAct, x.id, 'แก้ไข', 'edit') + iconBtn(delAct, x.id, 'ลบ', 'trash', true) + '</div>';
  }
  var HEAD_CODE = 'font-heading text-sd-muted';

  // personnel lookups (teachers จาก schooldark_personnel_teachers)
  function countPersonnel(field, id) { return S.teachers().filter(function (t) { return t.job && t.job[field] === id; }).length; }
  function headCandidates() {
    return S.teachers().map(function (t) {
      return { id: t.id, name: ((t.prefix || '') + (t.firstname || '') + ' ' + (t.lastname || '')).trim() || t.id };
    });
  }
  function headName(id) {
    if (!id) return '';
    var f = headCandidates().filter(function (t) { return t.id === id; })[0];
    return f ? f.name : '(ไม่พบบุคลากร ' + id + ')';
  }
  function countPositionsForType(typeId) {
    return S.get('sd_positions').filter(function (p) { return p.typeIds && p.typeIds.indexOf(typeId) !== -1; }).length;
  }

  // blocked-delete flow ร่วมกัน (เดิมใช้ App.showConfirm ชวน "ปิดใช้งานแทน")
  function deleteOrDeactivate(o) {
    if (o.blockedReasons.length) {
      showConfirm({
        title: o.blockedTitle, message: o.blockedMessage, confirmLabel: 'ปิดใช้งานแทน',
        onConfirm: function () {
          toggleActive(o.key, o.id, false); o.rerender();
          showToast('ปิดใช้งาน "' + o.name + '" แทนการลบแล้ว', 'warning');
        }
      });
      return;
    }
    showConfirm({
      title: 'ยืนยันการลบ', message: o.confirmMessage, confirmLabel: 'ลบ',
      onConfirm: function () {
        S.set(o.key, S.get(o.key).filter(function (x) { return x.id !== o.id; }));
        o.rerender();
        showToast(o.doneMessage, 'warning');
      }
    });
  }

  // ---------------------------------------------------------------- tab: staff types
  function staffTypesHtml() {
    return banner('ประเภทบุคลากร', ' — ใช้จัดกลุ่มบุคลากร (เช่น ข้าราชการ, อัตราจ้าง) เพื่อกำหนดว่า "ตำแหน่ง" ใดสังกัดประเภทใด และตั้งโควตาวันลาประจำปีแยกตามประเภทได้ที่ ระบบบริหารการลา → ตั้งค่าการลา → ขั้นตอนที่ 3') +
      countStats('stt', 'sliders', 'ประเภทบุคลากรทั้งหมด') +
      '<div class="' + CLS.card + '">' + cardHeader('sliders', 'รายการประเภทบุคลากร', listHeaderButtons('btn-save-staff-types', 'save-list', 'btn-add-staff-type', 'add-staff-type', 'เพิ่มประเภทบุคลากร')) +
      tools('staff-type-search', 'ค้นหาชื่อ หรือรหัสประเภทบุคลากร...', statusSelect('staff-type-filter-status')) +
      '<div class="' + CLS.tableWrap + '"><table class="' + CLS.table + '"><thead><tr><th class="w-14"></th><th>ชื่อประเภทบุคลากร</th><th>รหัส</th><th class="!text-center">ตำแหน่งที่สังกัด</th><th class="!text-center">บุคลากรที่ใช้</th><th class="!text-center w-[140px]">สถานะ / จัดการ</th></tr></thead><tbody id="staff-types-table-body"></tbody></table></div></div>';
  }
  function renderStaffTypes() {
    var tbody = $('staff-types-table-body'); if (!tbody) return;
    var list = S.get('sd_staff_types');
    setCounts('stt', list);
    var q = ($('staff-type-search').value || '').trim().toLowerCase(), st = $('staff-type-filter-status').value;
    var rows = sortedByOrder(list).filter(function (t) {
      return (!q || t.name.toLowerCase().indexOf(q) !== -1 || (t.code || '').toLowerCase().indexOf(q) !== -1) && statusMatch(st, t.active);
    });
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="6" class="' + CLS.emptyCell + '">ไม่พบประเภทบุคลากรที่ค้นหา</td></tr>'; return; }
    tbody.innerHTML = rows.map(function (t) {
      var posCount = countPositionsForType(t.id), used = countPersonnel('staffTypeId', t.id);
      return '<tr class="' + (t.active ? '' : 'opacity-[.55]') + '"><td class="text-center whitespace-nowrap">' + moveBtns('move-staff-type', t.id) + '</td>' +
        '<td><div class="flex items-center gap-2"><span class="inline-block w-3 h-3 rounded-full shrink-0" style="background:' + (COLOR_HEX[t.color] || '#9ca3af') + '"></span>' +
        '<div><div class="font-semibold text-sd-text">' + esc(t.name) + '</div><div class="text-[11px] text-sd-muted">' + esc(t.desc || '-') + '</div></div></div></td>' +
        '<td class="' + HEAD_CODE + '">' + esc(t.code || '-') + '</td>' +
        '<td class="text-center"><span class="' + CLS.badge + ' ' + CLS.badgeAdmin + (posCount ? ' cursor-pointer hover:brightness-95' : '') + '"' + (posCount ? ' data-act="goto-positions"' : '') + ' title="ตำแหน่งที่สังกัดประเภทนี้">' + posCount + ' ตำแหน่ง</span></td>' +
        '<td class="text-center text-sd-text-2">' + used + ' คน</td>' +
        '<td class="text-center">' + rowActions('stt', t, 'toggle-staff-type', 'edit-staff-type', 'delete-staff-type') + '</td></tr>';
    }).join('');
  }
  var editingSttId = null;
  function openStaffTypeModal(id) {
    var t = id ? S.get('sd_staff_types').filter(function (x) { return x.id === id; })[0] : null;
    if (id && !t) return;
    editingSttId = id || null;
    $('modal-staff-type-title').textContent = t ? 'แก้ไขประเภทบุคลากร' : 'เพิ่มประเภทบุคลากร';
    $('stt-modal-name').value = t ? t.name : '';
    $('stt-modal-code').value = t ? (t.code || '') : '';
    $('stt-modal-desc').value = t ? (t.desc || '') : '';
    $('stt-modal-color').value = t ? (t.color || 'primary') : 'primary';
    openModal('modal-staff-type');
  }
  function confirmStaffType() {
    var name = $('stt-modal-name').value.trim(), code = $('stt-modal-code').value.trim(), desc = $('stt-modal-desc').value.trim(), color = $('stt-modal-color').value;
    if (!name) { showToast('กรุณาระบุชื่อประเภทบุคลากร', 'error'); return; }
    var list = S.get('sd_staff_types');
    if (list.some(function (t) { return t.name.trim().toLowerCase() === name.toLowerCase() && t.id !== editingSttId; })) { showToast('มีประเภทบุคลากรชื่อนี้อยู่แล้ว', 'error'); return; }
    if (editingSttId) {
      var t = list.filter(function (x) { return x.id === editingSttId; })[0];
      t.name = name; t.code = code; t.desc = desc; t.color = color;
      showToast('แก้ไขประเภทบุคลากรแล้ว', 'success');
    } else {
      var maxOrder = list.reduce(function (m, t) { return Math.max(m, t.order || 0); }, 0);
      list.push({ id: nextId('ST', list, 2), name: name, code: code, desc: desc, color: color, active: true, order: maxOrder + 1 });
      showToast('เพิ่มประเภทบุคลากรใหม่แล้ว', 'success');
    }
    S.set('sd_staff_types', list);
    closeModal('modal-staff-type');
    renderStaffTypes();
  }
  function deleteStaffType(id) {
    var t = S.get('sd_staff_types').filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    var used = countPersonnel('staffTypeId', id), pos = countPositionsForType(id), reasons = [];
    if (used > 0) reasons.push('มีบุคลากร ' + used + ' คน');
    if (pos > 0) reasons.push('มีตำแหน่ง ' + pos + ' ตำแหน่งสังกัดอยู่');
    deleteOrDeactivate({
      key: 'sd_staff_types', id: id, name: t.name, blockedReasons: reasons, rerender: renderStaffTypes,
      blockedTitle: 'ลบประเภทบุคลากรไม่ได้',
      blockedMessage: '"' + t.name + '" ' + reasons.join(' และ ') + ' — กรุณาย้ายบุคลากร/ตำแหน่งเหล่านั้นไปประเภทอื่นก่อน หรือกด "ปิดใช้งาน" แทนการลบ',
      confirmMessage: 'ต้องการลบประเภทบุคลากร "' + t.name + '" ใช่หรือไม่?', doneMessage: 'ลบประเภทบุคลากรแล้ว'
    });
  }

  // ---------------------------------------------------------------- tab: positions
  function positionsHtml() {
    return banner('ตำแหน่ง', ' — รายการตำแหน่งที่ใช้ในฟอร์มข้อมูลตำแหน่งงานของบุคลากร แต่ละตำแหน่งต้องผูกกับประเภทบุคลากรอย่างน้อย 1 ประเภท เพื่อให้ระบบกรองตัวเลือกในฟอร์มให้ตรงกัน') +
      countStats('pos', 'award', 'ตำแหน่งทั้งหมด') +
      '<div class="' + CLS.card + '">' + cardHeader('award', 'รายการตำแหน่ง', listHeaderButtons('btn-save-positions', 'save-list', 'btn-add-position', 'add-position', 'เพิ่มตำแหน่ง')) +
      tools('position-search', 'ค้นหาชื่อ หรือรหัสตำแหน่ง...',
        '<select id="position-filter-type" class="' + CLS.input + ' !w-[190px]"><option value="">ทุกประเภทบุคลากร</option></select>' + statusSelect('position-filter-status')) +
      '<div class="' + CLS.tableWrap + '"><table class="' + CLS.table + '"><thead><tr><th class="w-14"></th><th>ชื่อตำแหน่ง</th><th>รหัส</th><th>สังกัดประเภทบุคลากร</th><th class="!text-center">บุคลากรที่ใช้</th><th class="!text-center w-[140px]">สถานะ / จัดการ</th></tr></thead><tbody id="positions-table-body"></tbody></table></div></div>';
  }
  function renderPositions() {
    var tbody = $('positions-table-body'); if (!tbody) return;
    var types = S.get('sd_staff_types'), list = S.get('sd_positions');
    setCounts('pos', list);
    var fsel = $('position-filter-type');
    if (fsel.dataset.rendered !== String(types.length)) {
      var cur = fsel.value;
      fsel.innerHTML = '<option value="">ทุกประเภทบุคลากร</option>' + types.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.name) + '</option>'; }).join('');
      fsel.value = cur; fsel.dataset.rendered = String(types.length);
    }
    var q = ($('position-search').value || '').trim().toLowerCase(), st = $('position-filter-status').value, tv = fsel.value;
    var rows = sortedByOrder(list).filter(function (p) {
      return (!q || p.name.toLowerCase().indexOf(q) !== -1 || (p.code || '').toLowerCase().indexOf(q) !== -1) && statusMatch(st, p.active) && (!tv || (p.typeIds || []).indexOf(tv) !== -1);
    });
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="6" class="' + CLS.emptyCell + '">ไม่พบตำแหน่งที่ค้นหา</td></tr>'; return; }
    tbody.innerHTML = rows.map(function (p) {
      var tags = (p.typeIds || []).map(function (tid) {
        var t = types.filter(function (x) { return x.id === tid; })[0];
        return t ? '<span class="' + CLS.docTag + '">' + esc(t.name) + '</span>' : '';
      }).join('');
      return '<tr class="' + (p.active ? '' : 'opacity-[.55]') + '"><td class="text-center whitespace-nowrap">' + moveBtns('move-position', p.id) + '</td>' +
        '<td class="font-semibold text-sd-text">' + esc(p.name) + '</td><td class="' + HEAD_CODE + '">' + esc(p.code || '-') + '</td>' +
        '<td><div class="flex flex-wrap gap-1 max-w-[260px]">' + (tags || '<span class="text-sd-muted text-[11px]">ยังไม่ระบุ</span>') + '</div></td>' +
        '<td class="text-center text-sd-text-2">' + countPersonnel('positionId', p.id) + ' คน</td>' +
        '<td class="text-center">' + rowActions('pos', p, 'toggle-position', 'edit-position', 'delete-position') + '</td></tr>';
    }).join('');
  }
  function renderPositionTypeCheckboxes(checkedIds) {
    var box = $('pos-modal-types-list');
    var types = sortedByOrder(S.get('sd_staff_types'));
    if (!types.length) { box.innerHTML = '<div class="text-xs text-sd-muted">ยังไม่มีประเภทบุคลากรในระบบ กรุณาไปเพิ่มที่หน้า "ตั้งค่าประเภทบุคลากร" ก่อน</div>'; return; }
    box.innerHTML = types.map(function (t) {
      return '<label class="inline-flex items-center gap-1.5 text-[12.5px] cursor-pointer px-2 py-1 bg-black/[0.02] border border-sd-border rounded-md"><input type="checkbox" class="accent-[hsl(250,75%,55%)]" value="' + esc(t.id) + '"' +
        (checkedIds.indexOf(t.id) !== -1 ? ' checked' : '') + (!t.active ? ' disabled' : '') + '><span class="text-sd-text-2">' + esc(t.name) + (!t.active ? ' (ปิดใช้งาน)' : '') + '</span></label>';
    }).join('');
  }
  var editingPosId = null;
  function openPositionModal(id) {
    var p = id ? S.get('sd_positions').filter(function (x) { return x.id === id; })[0] : null;
    if (id && !p) return;
    editingPosId = id || null;
    $('modal-position-title').textContent = p ? 'แก้ไขตำแหน่ง' : 'เพิ่มตำแหน่ง';
    $('pos-modal-name').value = p ? p.name : '';
    $('pos-modal-code').value = p ? (p.code || '') : '';
    renderPositionTypeCheckboxes(p ? (p.typeIds || []) : []);
    openModal('modal-position');
  }
  function confirmPosition() {
    var name = $('pos-modal-name').value.trim(), code = $('pos-modal-code').value.trim(), typeIds = [];
    document.querySelectorAll('#pos-modal-types-list input:checked').forEach(function (cb) { typeIds.push(cb.value); });
    if (!name) { showToast('กรุณาระบุชื่อตำแหน่ง', 'error'); return; }
    if (!typeIds.length) { showToast('กรุณาเลือกอย่างน้อย 1 ประเภทบุคลากรที่สังกัดตำแหน่งนี้', 'error'); return; }
    var list = S.get('sd_positions');
    if (list.some(function (p) { return p.name.trim().toLowerCase() === name.toLowerCase() && p.id !== editingPosId; })) { showToast('มีตำแหน่งชื่อนี้อยู่แล้ว', 'error'); return; }
    if (editingPosId) {
      var p = list.filter(function (x) { return x.id === editingPosId; })[0];
      p.name = name; p.code = code; p.typeIds = typeIds;
      showToast('แก้ไขตำแหน่งแล้ว', 'success');
    } else {
      var maxOrder = list.reduce(function (m, p) { return Math.max(m, p.order || 0); }, 0);
      list.push({ id: nextId('POS', list, 2), name: name, code: code, typeIds: typeIds, active: true, order: maxOrder + 1 });
      showToast('เพิ่มตำแหน่งใหม่แล้ว', 'success');
    }
    S.set('sd_positions', list);
    closeModal('modal-position');
    renderPositions();
  }
  function deletePosition(id) {
    var p = S.get('sd_positions').filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var used = countPersonnel('positionId', id);
    deleteOrDeactivate({
      key: 'sd_positions', id: id, name: p.name, blockedReasons: used > 0 ? ['x'] : [], rerender: renderPositions,
      blockedTitle: 'ลบตำแหน่งไม่ได้',
      blockedMessage: '"' + p.name + '" มีบุคลากร ' + used + ' คนใช้ตำแหน่งนี้อยู่ — กรุณาย้ายบุคลากรเหล่านั้นไปตำแหน่งอื่นก่อน หรือกด "ปิดใช้งาน" แทนการลบ',
      confirmMessage: 'ต้องการลบตำแหน่ง "' + p.name + '" ใช่หรือไม่?', doneMessage: 'ลบตำแหน่งแล้ว'
    });
  }

  // ---------------------------------------------------------------- tab: departments
  function departmentsHtml() {
    return banner('แผนก / กลุ่มสาระการเรียนรู้', ' — ใช้เป็นตัวเลือก "กลุ่มสาระการเรียนรู้" ในฟอร์มข้อมูลตำแหน่งงานของบุคลากร (ไม่ผูกกับประเภทบุคลากรหรือตำแหน่ง)') +
      countStats('dep', 'book', 'แผนก/กลุ่มสาระฯ ทั้งหมด') +
      '<div class="' + CLS.card + '">' + cardHeader('book', 'รายการแผนก/กลุ่มสาระการเรียนรู้', listHeaderButtons('btn-save-departments', 'save-list', 'btn-add-department', 'add-department', 'เพิ่มแผนก/กลุ่มสาระฯ')) +
      tools('department-search', 'ค้นหาชื่อ หรือรหัสแผนก/กลุ่มสาระฯ...', statusSelect('department-filter-status')) +
      '<div class="' + CLS.tableWrap + '"><table class="' + CLS.table + '"><thead><tr><th class="w-14"></th><th>ชื่อแผนก/กลุ่มสาระการเรียนรู้</th><th>รหัส</th><th>หัวหน้าแผนก</th><th class="!text-center">บุคลากรที่ใช้</th><th class="!text-center w-[140px]">สถานะ / จัดการ</th></tr></thead><tbody id="departments-table-body"></tbody></table></div></div>';
  }
  function renderDepartments() {
    var tbody = $('departments-table-body'); if (!tbody) return;
    var list = S.get('sd_departments');
    setCounts('dep', list);
    var q = ($('department-search').value || '').trim().toLowerCase(), st = $('department-filter-status').value;
    var rows = sortedByOrder(list).filter(function (d) {
      return (!q || d.name.toLowerCase().indexOf(q) !== -1 || (d.code || '').toLowerCase().indexOf(q) !== -1) && statusMatch(st, d.active);
    });
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="6" class="' + CLS.emptyCell + '">ไม่พบแผนก/กลุ่มสาระการเรียนรู้ที่ค้นหา</td></tr>'; return; }
    tbody.innerHTML = rows.map(function (d) {
      var hn = headName(d.headTeacherId);
      return '<tr class="' + (d.active ? '' : 'opacity-[.55]') + '"><td class="text-center whitespace-nowrap">' + moveBtns('move-department', d.id) + '</td>' +
        '<td><div class="flex items-center gap-2"><span class="inline-block w-3 h-3 rounded-full shrink-0" style="background:' + (COLOR_HEX[d.color] || '#9ca3af') + '"></span>' +
        '<div><div class="font-semibold text-sd-text">' + esc(d.name) + '</div><div class="text-[11px] text-sd-muted">' + esc(d.desc || '-') + '</div></div></div></td>' +
        '<td class="' + HEAD_CODE + '">' + esc(d.code || '-') + '</td>' +
        '<td>' + (hn ? '<span class="text-sd-text">' + esc(hn) + '</span>' : '<span class="text-sd-muted text-[11px]">ยังไม่ระบุ</span>') + '</td>' +
        '<td class="text-center text-sd-text-2">' + countPersonnel('departmentId', d.id) + ' คน</td>' +
        '<td class="text-center">' + rowActions('dep', d, 'toggle-department', 'edit-department', 'delete-department') + '</td></tr>';
    }).join('');
  }
  function populateHeadSelect(selectedId) {
    var c = headCandidates(), sel = $('dep-modal-head');
    sel.innerHTML = '<option value="">-- ไม่ระบุ --</option>' + c.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.name) + '</option>'; }).join('');
    sel.value = (selectedId && c.some(function (t) { return t.id === selectedId; })) ? selectedId : '';
  }
  var editingDepId = null;
  function openDepartmentModal(id) {
    var d = id ? S.get('sd_departments').filter(function (x) { return x.id === id; })[0] : null;
    if (id && !d) return;
    editingDepId = id || null;
    $('modal-department-title').textContent = d ? 'แก้ไขแผนก/กลุ่มสาระการเรียนรู้' : 'เพิ่มแผนก/กลุ่มสาระการเรียนรู้';
    $('dep-modal-name').value = d ? d.name : '';
    $('dep-modal-code').value = d ? (d.code || '') : '';
    $('dep-modal-desc').value = d ? (d.desc || '') : '';
    $('dep-modal-color').value = d ? (d.color || 'primary') : 'primary';
    populateHeadSelect(d ? d.headTeacherId : null);
    openModal('modal-department');
  }
  function confirmDepartment() {
    var name = $('dep-modal-name').value.trim(), code = $('dep-modal-code').value.trim(), desc = $('dep-modal-desc').value.trim();
    var color = $('dep-modal-color').value, head = $('dep-modal-head').value || null;
    if (!name) { showToast('กรุณาระบุชื่อแผนก/กลุ่มสาระการเรียนรู้', 'error'); return; }
    var list = S.get('sd_departments');
    if (list.some(function (d) { return d.name.trim().toLowerCase() === name.toLowerCase() && d.id !== editingDepId; })) { showToast('มีแผนก/กลุ่มสาระการเรียนรู้ชื่อนี้อยู่แล้ว', 'error'); return; }
    if (editingDepId) {
      var d = list.filter(function (x) { return x.id === editingDepId; })[0];
      d.name = name; d.code = code; d.desc = desc; d.color = color; d.headTeacherId = head;
      showToast('แก้ไขแผนก/กลุ่มสาระการเรียนรู้แล้ว', 'success');
    } else {
      var maxOrder = list.reduce(function (m, d) { return Math.max(m, d.order || 0); }, 0);
      list.push({ id: nextId('DEP', list, 2), name: name, code: code, desc: desc, color: color, headTeacherId: head, active: true, order: maxOrder + 1 });
      showToast('เพิ่มแผนก/กลุ่มสาระการเรียนรู้ใหม่แล้ว', 'success');
    }
    S.set('sd_departments', list);
    closeModal('modal-department');
    renderDepartments();
  }
  function deleteDepartment(id) {
    var d = S.get('sd_departments').filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    var used = countPersonnel('departmentId', id);
    deleteOrDeactivate({
      key: 'sd_departments', id: id, name: d.name, blockedReasons: used > 0 ? ['x'] : [], rerender: renderDepartments,
      blockedTitle: 'ลบแผนก/กลุ่มสาระการเรียนรู้ไม่ได้',
      blockedMessage: '"' + d.name + '" มีบุคลากร ' + used + ' คนสังกัดอยู่ — กรุณาย้ายบุคลากรเหล่านั้นไปแผนกอื่นก่อน หรือกด "ปิดใช้งาน" แทนการลบ',
      confirmMessage: 'ต้องการลบแผนก/กลุ่มสาระการเรียนรู้ "' + d.name + '" ใช่หรือไม่?', doneMessage: 'ลบแผนก/กลุ่มสาระการเรียนรู้แล้ว'
    });
  }

  // ---------------------------------------------------------------- tabs
  var TABS = {
    schedule: {
      title: 'ตั้งค่าวันเวลาเข้าออก', desc: 'เวลาทำงาน กะ วันหยุด', icon: 'cal', html: scheduleHtml,
      init: function () { renderShifts(); renderHolidays(); }
    },
    permissions: {
      title: 'สิทธิ์ผู้ใช้งาน', desc: 'บทบาทและสิทธิ์การเข้าถึงระบบ', icon: 'users', html: permissionsHtml,
      init: function () {
        renderUsers();
        $('user-search').addEventListener('input', debounce(renderUsers, 200));
        $('filter-role').addEventListener('change', renderUsers);
      }
    },
    signatories: {
      title: 'ผู้ลงนามเอกสาร', desc: 'รายชื่อผู้มีสิทธิ์ลงนามเอกสาร', icon: 'shield', html: signatoriesHtml,
      init: function () { renderSignatoryCards(); renderDocSignatories(); }
    },
    'staff-types': {
      title: 'ตั้งค่าประเภทบุคลากร', desc: 'ข้าราชการ/ครูอัตราจ้าง/ผู้บริหาร ฯลฯ', icon: 'sliders', html: staffTypesHtml,
      init: function () {
        renderStaffTypes();
        $('staff-type-search').addEventListener('input', debounce(renderStaffTypes, 200));
        $('staff-type-filter-status').addEventListener('change', renderStaffTypes);
      }
    },
    positions: {
      title: 'ตั้งค่าตำแหน่ง', desc: 'ตำแหน่งงานของบุคลากร', icon: 'award', html: positionsHtml,
      init: function () {
        renderPositions();
        $('position-search').addEventListener('input', debounce(renderPositions, 200));
        $('position-filter-status').addEventListener('change', renderPositions);
        $('position-filter-type').addEventListener('change', renderPositions);
      }
    },
    departments: {
      title: 'ตั้งค่าแผนก/กลุ่มสาระฯ', desc: 'กลุ่มสาระการเรียนรู้และแผนก', icon: 'book', html: departmentsHtml,
      init: function () {
        renderDepartments();
        $('department-search').addEventListener('input', debounce(renderDepartments, 200));
        $('department-filter-status').addEventListener('change', renderDepartments);
      }
    }
  };
  var currentTab = 'schedule';

  function getTabFromHash() {
    var m = /tab=([a-z-]+)/.exec(location.hash.replace('#', ''));
    return (m && TABS[m[1]]) ? m[1] : 'schedule';
  }
  function switchTab(tab) {
    tab = TABS[tab] ? tab : 'schedule';
    if (location.hash !== '#tab=' + tab) location.hash = 'tab=' + tab;   // hashchange จะเรียก render()
    else { currentTab = tab; render(); }
  }
  function render() {
    var def = TABS[currentTab];
    document.title = 'ตั้งค่าบุคลากร — ศูนย์รวมการตั้งค่า';
    $('tab-title').textContent = def.title;
    $('tab-desc').textContent = def.desc;
    $('crumb-tab').textContent = def.title;
    $('tab-icon-tile').innerHTML = svg(def.icon, 'h-6 w-6');
    document.querySelectorAll('.tab-pill').forEach(function (a) {
      var active = a.getAttribute('data-tab-link') === currentTab;
      a.className = 'tab-pill flex-1 text-center py-2 px-3 rounded-lg text-xs transition-colors whitespace-nowrap ' +
        (active ? 'font-bold bg-sd-primary text-white shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-700');
    });
    $('panel').innerHTML = def.html();
    def.init();
  }

  // ---------------------------------------------------------------- events (delegated)
  var ACTIONS = {
    'close': function (el) { closeModal(el.getAttribute('data-modal')); },
    'outline': function (el) {
      var target = $(el.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var nav = el.parentNode;
      nav.querySelectorAll('.outline-link').forEach(function (l) { l.classList.remove.apply(l.classList, OUTLINE_ON); l.classList.add.apply(l.classList, OUTLINE_OFF); });
      el.classList.remove.apply(el.classList, OUTLINE_OFF); el.classList.add.apply(el.classList, OUTLINE_ON);
    },
    'save-hours': saveHours,
    'add-shift': function () { openShiftModal(null); },
    'edit-shift': function (el) { openShiftModal(el.getAttribute('data-id')); },
    'delete-shift': function (el) { deleteShift(el.getAttribute('data-id')); },
    'add-holiday': openHolidayModal,
    'delete-holiday': function (el) { deleteHoliday(el.getAttribute('data-id')); },
    'edit-user': function (el) { openUserRoleModal(el.getAttribute('data-id')); },
    'add-signatory': function () { openSignatoryModal(null); },
    'edit-signatory': function (el) { openSignatoryModal(el.getAttribute('data-id')); },
    'delete-signatory': function (el) { deleteSignatory(el.getAttribute('data-id')); },
    'save-list': function () {
      var msg = { 'staff-types': 'บันทึกประเภทบุคลากรเรียบร้อยแล้ว', positions: 'บันทึกตำแหน่งเรียบร้อยแล้ว', departments: 'บันทึกแผนก/กลุ่มสาระการเรียนรู้เรียบร้อยแล้ว' }[currentTab];
      showToast(msg, 'success');   // ข้อมูลถูกเขียนลง localStorage ทุกครั้งที่แก้ไขอยู่แล้ว — ปุ่มนี้แค่ยืนยัน
    },
    'add-staff-type': function () { openStaffTypeModal(null); },
    'edit-staff-type': function (el) { openStaffTypeModal(el.getAttribute('data-id')); },
    'delete-staff-type': function (el) { deleteStaffType(el.getAttribute('data-id')); },
    'move-staff-type': function (el) { if (moveItem('sd_staff_types', el.getAttribute('data-id'), parseInt(el.getAttribute('data-dir'), 10))) renderStaffTypes(); },
    'goto-positions': function () { switchTab('positions'); },
    'add-position': function () { openPositionModal(null); },
    'edit-position': function (el) { openPositionModal(el.getAttribute('data-id')); },
    'delete-position': function (el) { deletePosition(el.getAttribute('data-id')); },
    'move-position': function (el) { if (moveItem('sd_positions', el.getAttribute('data-id'), parseInt(el.getAttribute('data-dir'), 10))) renderPositions(); },
    'add-department': function () { openDepartmentModal(null); },
    'edit-department': function (el) { openDepartmentModal(el.getAttribute('data-id')); },
    'delete-department': function (el) { deleteDepartment(el.getAttribute('data-id')); },
    'move-department': function (el) { if (moveItem('sd_departments', el.getAttribute('data-id'), parseInt(el.getAttribute('data-dir'), 10))) renderDepartments(); }
  };
  var CHANGES = {
    'toggle-staff-type': function (el) {
      var t = toggleActive('sd_staff_types', el.getAttribute('data-id'), el.checked);
      if (t) { renderStaffTypes(); showToast((el.checked ? 'เปิด' : 'ปิด') + 'ใช้งาน "' + t.name + '" แล้ว', 'info'); }
    },
    'toggle-position': function (el) {
      var p = toggleActive('sd_positions', el.getAttribute('data-id'), el.checked);
      if (p) { renderPositions(); showToast((el.checked ? 'เปิด' : 'ปิด') + 'ใช้งาน "' + p.name + '" แล้ว', 'info'); }
    },
    'toggle-department': function (el) {
      var d = toggleActive('sd_departments', el.getAttribute('data-id'), el.checked);
      if (d) { renderDepartments(); showToast((el.checked ? 'เปิด' : 'ปิด') + 'ใช้งาน "' + d.name + '" แล้ว', 'info'); }
    },
    'assign-doc-sig': function (el) { assignDocSignatory(el.getAttribute('data-doc'), el.getAttribute('data-id'), el.checked); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    buildModals();
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-act]') : null;
      if (el && ACTIONS[el.getAttribute('data-act')]) { ACTIONS[el.getAttribute('data-act')](el); }
    });
    document.addEventListener('change', function (e) {
      var el = e.target.closest ? e.target.closest('[data-change]') : null;
      if (el && CHANGES[el.getAttribute('data-change')]) CHANGES[el.getAttribute('data-change')](el);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('#modal-root > div.flex').forEach(function (m) { closeModal(m.id); });
    });
    $('btn-confirm-shift').addEventListener('click', confirmShift);
    $('btn-confirm-holiday').addEventListener('click', confirmHoliday);
    $('btn-confirm-user-role').addEventListener('click', confirmUserRole);
    $('btn-confirm-signatory').addEventListener('click', confirmSignatory);
    $('btn-confirm-staff-type').addEventListener('click', confirmStaffType);
    $('btn-confirm-position').addEventListener('click', confirmPosition);
    $('btn-confirm-department').addEventListener('click', confirmDepartment);
    $('confirm-ok').addEventListener('click', function () {
      var cb = confirmCb; confirmCb = null;
      closeModal('modal-confirm');
      if (cb) cb();
    });
    document.querySelectorAll('.tab-pill').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); switchTab(a.getAttribute('data-tab-link')); });
    });
    window.addEventListener('hashchange', function () {
      var t = getTabFromHash();
      if (t !== currentTab) { currentTab = t; render(); }
    });
    currentTab = getTabFromHash();
    render();
  });

  window.PersonnelSettings = { switchTab: switchTab };
})();
