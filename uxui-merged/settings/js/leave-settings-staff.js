/* =====================================================================
 * settings/leave.html#tab=staff — ตั้งค่าการลาบุคลากร (wizard 6 ขั้น)
 * ย้ายมาจาก schooldark/app.html #view-leave-settings + schooldark/index.js (renderSettingsView, addApprover, removeApprover,
 * saveSettingsFromDOM, saveAllSettings, goToSettingsStep, ensureStaffTypeQuotaSeeded, renderStaffTypeQuotaTable, updatePreviewStep1..6)
 *
 * เลย์เอาต์/ข้อความ/ไอคอนเป็นของ care (stepper คลิกได้, ฟอร์ม + พรีวิวสดฝั่งขวา) เขียนด้วย Tailwind + พาเลต sd-*
 * ข้อมูล: SdSettings.leaveSettings() / saveLeaveSettings(obj) (คีย์ schooldark_settings), ประเภทบุคลากร: SdSettings.get('sd_staff_types')
 * ต่างจากของ care: ปุ่มลบผู้อนุมัติใช้ LeaveSettings.helpers.confirm แทน App.showConfirm; ผู้รับแจ้งเตือน (recipients) โหลด/บันทึกจริง
 * ต้องโหลดหลัง js/leave-settings.js (ลงทะเบียน LeaveSettings.tabs.staff)
 * ===================================================================== */
(function () {
  'use strict';

  var LS = window.LeaveSettings;
  var S = window.SdSettings;
  var H = LS.helpers;
  var esc = H.esc;

  // ---------------------------------------------------------------- care's inline SVG (paths verbatim from app.html)
  var P = {
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    sliders: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    bellAlt: '<path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    alertOct: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    chevL: '<polyline points="15 18 9 12 15 6"/>',
    chevR: '<polyline points="9 18 15 12 9 6"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>'
  };
  function svg(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="' + (cls || 'w-4 h-4') + '">' + P[name] + '</svg>';
  }

  // ---------------------------------------------------------------- class strings (translated from care's app.css; same set as personnel-settings.js)
  var CLS = {
    card: 'bg-white border border-sd-border rounded-[20px] p-4 sm:p-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]',
    cardHead: 'flex items-center justify-between gap-3 flex-wrap mb-5 pb-3.5 border-b border-sd-border',
    cardTitle: 'font-heading text-base font-semibold flex items-center gap-2.5 text-sd-text',
    cardIcon: 'w-[18px] h-[18px] text-sd-primary shrink-0',
    cardDesc: 'text-[13px] text-sd-text-2 mb-4 leading-relaxed',
    formGroup: 'flex flex-col gap-1.5 mb-4',
    label: 'text-[12.5px] font-medium text-sd-text-2',
    input: 'w-full bg-white/50 border border-sd-border rounded-[14px] px-3.5 py-2.5 text-sm text-sd-text outline-none transition-colors focus:border-sd-primary focus:bg-white/80 focus:ring-[3px] focus:ring-[hsla(250,85%,55%,0.4)]',
    btn: 'inline-flex items-center justify-center gap-2 rounded-[14px] text-sm font-semibold cursor-pointer whitespace-nowrap border border-transparent transition-colors outline-none px-[22px] py-2.5',
    btnPrimary: 'bg-sd-primary text-white shadow-[0_4px_14px_hsla(250,75%,55%,0.1)] hover:bg-sd-primary-hover',
    btnSecondary: 'bg-white border-sd-border text-sd-text hover:bg-black/5 hover:border-sd-text-2',
    tableWrap: 'overflow-x-auto rounded-[14px] border border-sd-border',
    table: 'w-full border-collapse text-[13.5px] [&_th]:px-4 [&_th]:py-[11px] [&_th]:text-left [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.8px] [&_th]:text-sd-muted [&_th]:bg-black/[0.03] [&_th]:border-b [&_th]:border-sd-border [&_th]:whitespace-nowrap [&_td]:px-4 [&_td]:py-[11px] [&_td]:border-b [&_td]:border-sd-border [&_tr:last-child_td]:border-b-0 [&_tbody_tr:hover_td]:bg-black/[0.015]',
    sectionTitle: 'text-[13px] font-semibold text-sd-text',
    help: 'text-[11px] text-sd-muted mt-1 block'
  };
  var CARD_HINT = '<span class="cursor-help text-sd-muted">ⓘ</span>';

  // ---------------------------------------------------------------- static data (from care's HTML)
  var STEPS = [
    'ตัดรอบปีทำงาน', 'กำหนดผู้อนุมัติ', 'ตั้งโควตาลาปี', 'เงื่อนไขการลา', 'จำนวนวันล่วงหน้า', 'การแจ้งเตือน'
  ];
  var APPROVER_OPTIONS = [
    ['ครูวิชัย เรียนดี', 'ครูวิชัย เรียนดี (ผอ.โรงเรียน)'],
    ['ครูสุดา สอนดี', 'ครูสุดา สอนดี (ผู้ช่วยฝ่ายบริหาร)'],
    ['ครูประยูร จรรยา', 'ครูประยูร จรรยา (หัวหน้ากลุ่มสาระ)']
  ];
  var RECIPIENT_OPTIONS = ['หัวหน้าครูสมศรี', 'ผอ.วิชัย', 'รองสุดา'];

  // ---------------------------------------------------------------- view-state (per render)
  var st = null;          // working copy of leave settings (object saved via SdSettings.saveLeaveSettings)
  var root = null;        // element holding this tab's markup
  var step = 1;

  function q(id) { return document.getElementById(id); }
  function num(id, fallback) {
    var el = q(id);
    var v = el ? parseInt(el.value, 10) : NaN;
    return isNaN(v) ? fallback : v;
  }
  function activeStaffTypes() {
    var list = [];
    try { list = S.get('sd_staff_types'); } catch (e) {}
    return Array.isArray(list) ? list.filter(function (t) { return t.active; }) : [];
  }

  // ---------------------------------------------------------------- staff-type quota (ensureStaffTypeQuotaSeeded / renderStaffTypeQuotaTable)
  function ensureStaffTypeQuotaSeeded() {
    if (!st.staffTypeQuotaOverrides) st.staffTypeQuotaOverrides = {};
    activeStaffTypes().forEach(function (t) {
      if (!st.staffTypeQuotaOverrides[t.id]) {
        st.staffTypeQuotaOverrides[t.id] = { sick: st.quotaSick, vacation: st.quotaVacation, maternity: st.quotaMaternity };
      }
    });
  }
  function renderStaffTypeQuotaTable() {
    var tbody = q('staff-type-quota-tbody');
    if (!tbody) return;
    var overrides = st.staffTypeQuotaOverrides || {};
    var types = activeStaffTypes();
    if (!types.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-sd-muted py-4">ยังไม่มีประเภทบุคลากรในระบบ — ไปเพิ่มที่ ตั้งค่าบุคลากร &rarr; ประเภทบุคลากร</td></tr>';
      return;
    }
    var cell = function (id, key, v) {
      return '<td><input type="number" min="0" class="' + CLS.input + ' !w-[90px] !py-1.5" id="stq-' + esc(id) + '-' + key + '" value="' + esc(v) + '"></td>';
    };
    tbody.innerHTML = types.map(function (t) {
      var o = overrides[t.id] || { sick: st.quotaSick, vacation: st.quotaVacation, maternity: st.quotaMaternity };
      return '<tr><td class="font-semibold text-sd-text">' + esc(t.name) + '</td>' + cell(t.id, 'sick', o.sick) + cell(t.id, 'vacation', o.vacation) + cell(t.id, 'maternity', o.maternity) + '</tr>';
    }).join('');
  }

  // ---------------------------------------------------------------- approvers
  function renderApprovers() {
    var body = q('approver-table-body');
    if (!body) return;
    body.innerHTML = st.approvers.map(function (name, idx) {
      return '<tr><td class="font-medium text-sd-text">' + esc(name) + '</td><td class="text-center">' +
        '<button type="button" data-act="remove-approver" data-idx="' + idx + '" title="ลบ" class="inline-flex items-center justify-center w-7 h-7 rounded-md border border-sd-border bg-white text-sd-danger cursor-pointer transition-colors hover:bg-sd-danger-bg">' +
        svg('trash', 'w-3.5 h-3.5') + '</button></td></tr>';
    }).join('') || '<tr><td colspan="2" class="text-center text-sd-muted py-4">ยังไม่มีผู้อนุมัติ</td></tr>';
  }
  function addApprover() {
    var sel = q('new-approver-select');
    var name = sel.value;
    if (!name) { H.toast('กรุณาเลือกรายชื่อคุณครู', 'warning'); return; }
    if (st.approvers.indexOf(name) !== -1) { H.toast('คุณครูรายนี้อยู่ในรายการผู้อนุมัติอยู่แล้ว', 'warning'); return; }
    st.approvers.push(name);
    persist();
    renderApprovers();
    sel.value = '';
    updateAllPreviews();
    H.toast('เพิ่มผู้อนุมัติเรียบร้อย', 'success');
  }
  function removeApprover(idx) {
    H.confirm('แน่ใจหรือไม่? ชื่อนี้จะถูกลบออกจากรายการผู้อนุมัติ', { danger: true, confirmText: 'ลบ', title: 'ยืนยันการลบ' }).then(function (ok) {
      if (!ok || !q('approver-table-body')) return;
      st.approvers.splice(idx, 1);
      persist();
      renderApprovers();
      updateAllPreviews();
      H.toast('ลบรายชื่อผู้อนุมัติแล้ว', 'warning');
    });
  }

  // ---------------------------------------------------------------- read DOM -> st (saveSettingsFromDOM) and persist
  function collect() {
    st.cutoffDate = q('cutoff-date').value;
    st.quotaSick = num('quota-sick', 0);
    st.quotaVacation = num('quota-vacation', 0);
    st.quotaMaternity = num('quota-maternity', 0);
    if (!st.staffTypeQuotaOverrides) st.staffTypeQuotaOverrides = {};
    activeStaffTypes().forEach(function (t) {
      var a = q('stq-' + t.id + '-sick'), b = q('stq-' + t.id + '-vacation'), c = q('stq-' + t.id + '-maternity');
      if (a || b || c) {
        var prev = st.staffTypeQuotaOverrides[t.id] || {};
        st.staffTypeQuotaOverrides[t.id] = {
          sick: a ? (parseInt(a.value, 10) || 0) : (prev.sick != null ? prev.sick : st.quotaSick),
          vacation: b ? (parseInt(b.value, 10) || 0) : (prev.vacation != null ? prev.vacation : st.quotaVacation),
          maternity: c ? (parseInt(c.value, 10) || 0) : (prev.maternity != null ? prev.maternity : st.quotaMaternity)
        };
      }
    });
    st.ruleHalfDay = q('rule-half-day').checked;
    st.ruleSickDoc = q('rule-sick-doc').checked;
    st.ruleAdvanceDays = num('rule-advance-days', 0) || 0;
    st.ruleRollover = q('rule-rollover').checked;
    st.ruleRolloverMax = num('rule-rollover-max', 0) || 0;
    st.alertLate1 = num('alert-late-1', 0) || 0;
    st.alertLate2 = num('alert-late-2', 0) || 0;
    st.alertVisa = num('alert-visa', 0) || 0;
    st.alertWorkpermit = num('alert-workpermit', 0) || 0;
    st.alertLicense = num('alert-license', 0) || 0;
    st.recipients = Array.prototype.map.call(root.querySelectorAll('.recipient-checkbox:checked'), function (cb) { return cb.value; });
  }
  function persist() {
    collect();
    S.saveLeaveSettings(st);
  }

  // ---------------------------------------------------------------- markup
  function cardHeader(icon, title) {
    return '<div class="' + CLS.cardHead + '"><h3 class="' + CLS.cardTitle + '">' + svg(icon, CLS.cardIcon) + title + '</h3></div>';
  }
  function numField(id, label, value, min, extra) {
    return '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '" for="' + id + '">' + label + '</label>' +
      '<input type="number" id="' + id + '" class="' + CLS.input + '" value="' + esc(value) + '" min="' + min + '"' + (extra || '') + '></div>';
  }
  function toggleRow(id, title, tip, desc, checked) {
    return '<div class="flex items-center justify-between gap-3 px-4 py-3.5 rounded-[14px] bg-black/[0.02] border border-sd-border mb-2.5 transition-colors hover:bg-black/[0.04]">' +
      '<div class="flex flex-col gap-[3px] max-w-[80%]"><span class="text-[13.5px] font-medium text-sd-text" title="' + esc(tip) + '">' + title + ' ' + CARD_HINT + '</span>' +
      '<span class="text-xs text-sd-muted">' + desc + '</span></div>' +
      '<label class="relative inline-block w-11 h-6 shrink-0 cursor-pointer"><input type="checkbox" id="' + id + '" class="peer sr-only"' + (checked ? ' checked' : '') + '>' +
      '<span class="absolute inset-0 rounded-full border border-sd-border bg-black/10 transition-colors peer-checked:bg-sd-primary before:content-[\'\'] before:absolute before:h-4 before:w-4 before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:shadow-[0_1px_3px_rgba(0,0,0,0.4)] before:transition-transform peer-checked:before:translate-x-5"></span></label></div>';
  }
  function unitRow(inputHtml, unit) {
    return '<div class="flex items-center gap-3">' + inputHtml + '<span class="text-[13px] text-sd-text-2">' + unit + '</span></div>';
  }
  function previewCol(id, title) {
    return '<div class="order-first min-[901px]:order-none min-[901px]:sticky min-[901px]:top-[88px]">' +
      '<div class="bg-white border border-sd-border rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">' +
      '<div class="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-sd-text bg-black/[0.03] border-b border-sd-border">' + svg('eye', 'w-3.5 h-3.5') + ' ' + title + '</div>' +
      '<div id="' + id + '" class="relative flex items-center justify-center min-h-[200px] p-4"></div></div></div>';
  }
  function pane(n, formHtml, previewId, previewTitle) {
    return '<div data-pane="' + n + '" class="hidden"><div class="grid grid-cols-1 min-[901px]:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">' +
      '<div class="min-w-0 flex flex-col gap-6">' + formHtml + '</div>' + previewCol(previewId, previewTitle) + '</div></div>';
  }

  function buildHtml() {
    var s = st;
    var stepper = '<div class="' + CLS.card.replace('p-4 sm:p-6', 'px-2 py-5 sm:px-4') + ' mb-6 overflow-x-auto"><div class="relative flex justify-between items-start min-w-[560px] px-2.5">' +
      '<div class="absolute left-10 right-10 top-5 h-0.5 bg-sd-border z-[1]"></div>' +
      STEPS.map(function (label, i) {
        return '<button type="button" data-step="' + (i + 1) + '" class="journey-step relative z-[2] flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0 p-0 group">' +
          '<span class="step-node w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors">' + (i + 1) + '</span>' +
          '<span class="step-label text-xs text-center whitespace-nowrap transition-colors">' + label + '</span></button>';
      }).join('') + '</div></div>';

    // ---- step 1
    var p1 = '<div class="' + CLS.card + '">' + cardHeader('calendar', 'ขั้นตอนที่ 1: วันตัดรอบปีการทำงาน') +
      '<p class="' + CLS.cardDesc + '">เริ่มต้นตั้งค่าเส้นทางของระบบการลาของบุคลากรครู โดยกำหนดวันที่ตัดรอบปีทำงาน</p>' +
      '<div class="max-w-[400px] mt-2.5"><div class="flex flex-col gap-1.5">' +
      '<label class="' + CLS.label + '" for="cutoff-date" title="วันสุดท้ายของการทำงานในรอบปี">เลือกวันที่ตัดรอบข้อมูลการทำงานประจำปี ' + CARD_HINT + '</label>' +
      '<input type="date" id="cutoff-date" class="' + CLS.input + '" value="' + esc(s.cutoffDate) + '">' +
      '<span class="' + CLS.help + '">ระบบจะใช้วันที่นี้ในการล้างยอดวันลาสะสมและเริ่มโควตาปีถัดไป</span></div></div></div>';

    // ---- step 2
    var opts = '<option value="">-- เลือกคุณครูในระบบ --</option>' + APPROVER_OPTIONS.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join('');
    var p2 = '<div class="' + CLS.card + '">' + cardHeader('users', 'ขั้นตอนที่ 2: กำหนดรายชื่อผู้อนุมัติการลา') +
      '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '" for="new-approver-select" title="คุณครูที่เลือกจะมีสิทธิ์อนุมัติใบลา">เพิ่มรายชื่อผู้อนุมัติการลา ' + CARD_HINT + '</label>' +
      '<div class="flex gap-2.5 max-w-[500px]"><select id="new-approver-select" class="' + CLS.input + ' grow">' + opts + '</select>' +
      '<button type="button" id="add-approver-btn" data-act="add-approver" class="' + CLS.btn + ' ' + CLS.btnPrimary + ' !px-4">เพิ่ม</button></div></div>' +
      '<div class="' + CLS.tableWrap + ' mt-4 max-h-[250px] overflow-y-auto"><table class="' + CLS.table + '"><thead><tr><th>ชื่อผู้อนุมัติ</th><th class="!text-center w-20">จัดการ</th></tr></thead>' +
      '<tbody id="approver-table-body"></tbody></table></div></div>';

    // ---- step 3
    var p3 = '<div class="' + CLS.card + '">' + cardHeader('folder', 'ขั้นตอนที่ 3: ตั้งค่าสิทธิ์วันลาประจำปี') +
      '<p class="' + CLS.cardDesc + '">กำหนดจำนวนวันลาสูงสุดต่อปีการศึกษาตามประเภทต่างๆ</p>' +
      '<div class="' + CLS.sectionTitle + '" title="จำนวนรวมที่สามารถใช้ได้ในปีนี้">จำนวนวันที่สามารถลาได้ (วันต่อปี) ' + CARD_HINT + '</div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-2.5">' +
      numField('quota-sick', 'ลาป่วย', s.quotaSick, 0) + numField('quota-vacation', 'ลาพักผ่อน / ลากิจ', s.quotaVacation, 0) + numField('quota-maternity', 'ลาคลอดบุตร', s.quotaMaternity, 0) + '</div>' +
      '<span class="' + CLS.help + '">ค่าเริ่มต้นนี้จะถูกใช้กับทุกประเภทบุคลากรที่ยังไม่ได้ปรับแยกไว้ด้านล่าง</span></div>' +
      '<div class="' + CLS.card + '">' + cardHeader('sliders', 'โควตาแยกตามประเภทบุคลากร') +
      '<p class="' + CLS.cardDesc + '">ปรับจำนวนวันลาให้ต่างจากค่าเริ่มต้นด้านบนได้ต่อประเภทบุคลากร เช่น ครูอัตราจ้างอาจได้โควตาน้อยกว่าข้าราชการ (จัดการรายชื่อประเภทบุคลากรที่ ตั้งค่าบุคลากร &rarr; ประเภทบุคลากร)</p>' +
      '<div class="' + CLS.tableWrap + '"><table class="' + CLS.table + '"><thead><tr><th>ประเภทบุคลากร</th><th>ลาป่วย</th><th>ลาพักผ่อน / ลากิจ</th><th>ลาคลอดบุตร</th></tr></thead>' +
      '<tbody id="staff-type-quota-tbody"></tbody></table></div></div>';

    // ---- step 4
    var p4 = '<div class="' + CLS.card + '">' + cardHeader('lock', 'ขั้นตอนที่ 4: ตั้งค่าเงื่อนไขการลาเพิ่มเติม') +
      toggleRow('rule-half-day', 'อนุญาตให้ลาแบบครึ่งวัน (0.5 วัน) ได้', 'หากปิด ผู้ใช้จะยื่นลาได้เต็มวันเท่านั้น', 'สามารถยื่นลาครึ่งเช้าหรือครึ่งบ่ายได้ในแบบฟอร์มลา', s.ruleHalfDay) +
      toggleRow('rule-sick-doc', 'บังคับแนบเอกสารใบรับรองแพทย์เมื่อลาป่วยเกิน 3 วัน', 'ระบบจะไม่อนุญาตให้ยื่นคำขอถ้าขาดเอกสาร', 'ผู้ใช้จะไม่สามารถบันทึกฟอร์มลาได้หากไม่มีการแนบใบรับรองแพทย์ที่ถูกต้อง', s.ruleSickDoc) +
      '<div class="' + CLS.formGroup + ' mt-2.5 max-w-[450px]"><label class="' + CLS.label + '" for="rule-advance-days" title="ระยะเวลาที่ต้องบอกกล่าวล่วงหน้า">ข้อกำหนดการยื่นใบลาล่วงหน้า (วัน) ' + CARD_HINT + '</label>' +
      unitRow('<input type="number" id="rule-advance-days" class="' + CLS.input + ' !w-[100px]" value="' + esc(s.ruleAdvanceDays) + '" min="0">', 'วัน ก่อนเริ่มวันลา') + '</div>' +
      '<div class="mt-4">' + toggleRow('rule-rollover', 'การทบยอดสิทธิ์วันลาพักผ่อนสะสมที่เหลือ', 'ย้ายวันลาพักผ่อนที่เหลือไปใช้ปีหน้า', 'สิทธิ์ที่เหลือในปีนี้สามารถยกยอดไปสะสมต่อในปีงบประมาณถัดไปได้', s.ruleRollover) + '</div>' +
      '<div id="rollover-limit-group" class="' + CLS.formGroup + ' max-w-[450px]' + (s.ruleRollover ? '' : ' hidden') + '"><label class="' + CLS.label + '" for="rule-rollover-max">จำนวนวันทบสะสมสูงสุด (วัน)</label>' +
      unitRow('<input type="number" id="rule-rollover-max" class="' + CLS.input + ' !w-[100px]" value="' + esc(s.ruleRolloverMax) + '" min="1">', 'วัน') + '</div></div>';

    // ---- step 5
    var dayField = function (id, label, v) {
      return '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '" for="' + id + '">' + label + '</label>' +
        '<div class="flex items-center gap-1.5"><input type="number" id="' + id + '" class="' + CLS.input + '" value="' + esc(v) + '" min="0"><span class="text-xs text-sd-muted">วัน</span></div></div>';
    };
    var p5 = '<div class="' + CLS.card + '">' + cardHeader('bell', 'ขั้นตอนที่ 5: การแจ้งเตือนการมาสายและเอกสารสำคัญ') +
      '<div class="' + CLS.sectionTitle + '">แจ้งเตือนจำนวนการมาสายสะสม (ครั้ง)</div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mt-2.5 mb-5">' + numField('alert-late-1', 'เตือนครั้งที่ 1', s.alertLate1, 1) + numField('alert-late-2', 'เตือนครั้งที่ 2', s.alertLate2, 1) + '</div>' +
      '<div class="' + CLS.sectionTitle + '">เตือนก่อนวันหมดอายุเอกสาร (วันล่วงหน้า)</div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-2.5">' +
      dayField('alert-visa', 'วีซ่า (Visa)', s.alertVisa) + dayField('alert-workpermit', 'Work Permit', s.alertWorkpermit) + dayField('alert-license', 'ใบประกอบวิชาชีพ', s.alertLicense) + '</div></div>';

    // ---- step 6
    var recips = RECIPIENT_OPTIONS.slice();
    (s.recipients || []).forEach(function (r) { if (recips.indexOf(r) === -1) recips.push(r); });   // ค่าที่บันทึกไว้แต่ไม่อยู่ในตัวเลือกเดิม ไม่ให้หาย
    var p6 = '<div class="' + CLS.card + '">' + cardHeader('bellAlt', 'ขั้นตอนที่ 6: ผู้มีสิทธิ์รับการแจ้งเตือน') +
      '<div class="' + CLS.formGroup + '"><label class="' + CLS.label + '">ผู้รับการแจ้งเตือน (ฝ่ายบุคคล / ผู้บริหาร)</label>' +
      '<div class="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5 mt-2.5">' +
      recips.map(function (r) {
        return '<label class="relative cursor-pointer"><input type="checkbox" class="recipient-checkbox peer absolute opacity-0 w-0 h-0" value="' + esc(r) + '"' + ((s.recipients || []).indexOf(r) !== -1 ? ' checked' : '') + '>' +
          '<span class="flex items-center justify-center p-2.5 rounded-[14px] border border-sd-border bg-black/[0.02] text-[13px] font-medium text-sd-text-2 text-center transition-colors hover:bg-black/[0.05] hover:text-sd-text peer-checked:bg-sd-primary-glow peer-checked:border-sd-primary peer-checked:text-sd-text">' + esc(r) + '</span></label>';
      }).join('') + '</div></div></div>';

    var nav = '<div class="flex mt-6 bg-white px-6 py-4 rounded-[20px] border border-sd-border">' +
      '<button type="button" id="prev-settings-btn" data-act="prev" class="' + CLS.btn + ' ' + CLS.btnSecondary + ' min-w-[120px] disabled:opacity-40 disabled:cursor-not-allowed">' + svg('chevL', 'w-4 h-4') + 'ย้อนกลับ</button>' +
      '<button type="button" id="next-settings-btn" data-act="next" class="' + CLS.btn + ' ' + CLS.btnPrimary + ' min-w-[140px] ml-auto"></button></div>';

    return stepper +
      pane(1, p1, 'preview-step-1', 'รอบปีการทำงานในระบบ') +
      pane(2, p2, 'preview-step-2', 'ลำดับขั้นตอนอนุมัติใบลา') +
      pane(3, p3, 'preview-step-3', 'โควตาวันลาที่แสดงในหน้าแรก') +
      pane(4, p4, 'preview-step-4', 'ฟอร์มยื่นคำขอลาที่จะแสดงผล') +
      pane(5, p5, 'preview-step-5', 'ตัวอย่างการแจ้งเตือนในระบบ') +
      pane(6, p6, 'preview-step-6', 'ตัวอย่าง Email/ข้อความแจ้งเตือนถึงผู้บริหาร') + nav;
  }

  // ---------------------------------------------------------------- step control (goToSettingsStep / next / prev / save)
  var NODE_BASE = ['bg-white', 'border-sd-border', 'text-sd-muted'];
  var NODE_ACTIVE = ['bg-sd-primary', 'border-sd-primary', 'text-white', 'shadow-[0_0_10px_hsla(250,75%,55%,0.1)]'];
  var NODE_DONE = ['bg-sd-success', 'border-sd-success', 'text-white'];
  var LABEL_CLASSES = ['text-sd-muted', 'text-sd-text', 'font-medium', 'font-semibold', 'text-sd-success'];

  function showStep(n) {
    step = n;
    root.querySelectorAll('[data-pane]').forEach(function (p) {
      p.classList.toggle('hidden', parseInt(p.getAttribute('data-pane'), 10) !== n);
    });
    root.querySelectorAll('.journey-step').forEach(function (b) {
      var i = parseInt(b.getAttribute('data-step'), 10);
      var node = b.querySelector('.step-node'), label = b.querySelector('.step-label');
      node.classList.remove.apply(node.classList, NODE_BASE.concat(NODE_ACTIVE, NODE_DONE));
      label.classList.remove.apply(label.classList, LABEL_CLASSES);
      if (i === n) { node.classList.add.apply(node.classList, NODE_ACTIVE); label.classList.add('text-sd-text', 'font-semibold'); }
      else if (i < n) { node.classList.add.apply(node.classList, NODE_DONE); label.classList.add('text-sd-success', 'font-medium'); }
      else { node.classList.add.apply(node.classList, NODE_BASE); label.classList.add('text-sd-muted', 'font-medium'); }
    });
    q('prev-settings-btn').disabled = n === 1;
    q('next-settings-btn').innerHTML = n === 6
      ? 'บันทึกการตั้งค่าทั้งหมด ' + svg('save', 'w-4 h-4')
      : 'ขั้นตอนถัดไป ' + svg('chevR', 'w-4 h-4');
    updateAllPreviews();
  }
  function goToStep(n) {
    persist();          // care: goToSettingsStep เรียก saveSettingsFromDOM ก่อนเปลี่ยนขั้นเสมอ
    showStep(n);
  }
  function nextStep() {
    if (step < 6) { goToStep(step + 1); H.toast('บันทึกความคืบหน้าขั้นตอนที่ ' + (step - 1) + ' เรียบร้อยแล้ว', 'success'); }
    else saveAll();
  }
  function prevStep() {
    if (step > 1) { goToStep(step - 1); H.toast('ย้อนกลับมายังขั้นตอนที่ ' + step, 'info'); }
  }
  function saveAll() {
    persist();
    H.toast('บันทึกการตั้งค่าระบบลาทั้งหมดเรียบร้อยแล้ว', 'success');
    setTimeout(function () { if (root && root.isConnected && q('cutoff-date')) goToStep(1); }, 1000);
  }

  // ---------------------------------------------------------------- live previews (updatePreviewStep1..6, same output; care's CSS vars -> sd-* classes)
  function setHtml(id, html) { var el = q(id); if (el) el.innerHTML = html; }

  function updatePreviewStep1() {
    var cutoffInput = q('cutoff-date');
    var dateStr = cutoffInput ? cutoffInput.value : '2026-12-31';
    var cutoffDate = new Date(dateStr);
    var year = isNaN(cutoffDate.getFullYear()) ? 2026 : cutoffDate.getFullYear();
    var thaiYear = year + 543;
    var today = new Date();
    var startOfYear = new Date(year, 0, 1);
    var endOfYear = isNaN(cutoffDate.getTime()) ? new Date(year, 11, 31) : cutoffDate;
    var totalMs = Math.max(1, endOfYear.getTime() - startOfYear.getTime());
    var elapsedMs = Math.max(0, today.getTime() - startOfYear.getTime());
    var pct = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100))) || 65;
    var diffDays = Math.max(0, Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    setHtml('preview-step-1',
      '<div class="w-full text-left">' +
      '<div class="flex justify-between items-center mb-2"><span class="text-[13px] font-semibold text-sd-text">รอบปีการทำงาน ' + thaiYear + '</span>' +
      '<span class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-sd-success-bg text-sd-success">ผ่านไปแล้ว ' + pct + '%</span></div>' +
      '<div class="w-full h-2.5 bg-black/10 rounded-[5px] overflow-hidden mb-2.5"><div class="h-full bg-gradient-to-r from-sd-primary to-sd-info transition-[width] duration-300" style="width:' + pct + '%"></div></div>' +
      '<div class="flex justify-between text-[11px] text-sd-muted mb-3"><span>1 ม.ค. ' + thaiYear + '</span><span class="text-sd-warning font-semibold">📍 วันนี้</span><span>31 ธ.ค. ' + thaiYear + '</span></div>' +
      '<div class="bg-sd-primary-glow border border-[rgba(99,102,241,0.25)] px-3 py-2.5 rounded-md text-xs text-sd-text flex items-center gap-2">' +
      svg('clock', 'w-[18px] h-[18px] text-sd-primary shrink-0') +
      '<div><div><strong>วันล้างยอดสะสม:</strong> ' + endOfYear.getDate() + ' ธ.ค. ' + thaiYear + '</div>' +
      '<div class="text-[11px] text-sd-muted mt-0.5">(เหลืออีก ' + diffDays + ' วัน ก่อนเริ่มสิทธิ์โควตาปีถัดไป)</div></div></div></div>');
  }

  function updatePreviewStep2() {
    var approvers = st.approvers || ['ครูวิชัย เรียนดี'];
    if (!approvers.length) {
      setHtml('preview-step-2', '<div class="w-full text-center p-5 text-sd-danger bg-sd-danger-bg rounded-lg border border-dashed border-sd-danger">⚠️ ยังไม่ได้กำหนดผู้อนุมัติ (ครูจะไม่สามารถยื่นขอลาได้)</div>');
      return;
    }
    var stepsHtml = approvers.map(function (name, index) {
      return '<div class="flex items-center gap-2.5 bg-black/[0.03] px-3 py-2.5 rounded-lg border border-sd-border w-full">' +
        '<div class="w-6 h-6 rounded-full bg-sd-primary text-white text-xs font-bold flex items-center justify-center shrink-0">' + (index + 1) + '</div>' +
        '<div class="flex-1 min-w-0"><div class="text-[13px] font-semibold text-sd-text">' + esc(name) + '</div><div class="text-[11px] text-sd-muted">ผู้อนุมัติลำดับที่ ' + (index + 1) + '</div></div>' +
        '<span class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-sd-warning-bg text-sd-warning">พิจารณา</span></div>' +
        (index < approvers.length - 1 ? '<div class="w-0.5 h-3 bg-sd-border my-0.5 ml-[23px]"></div>' : '');
    }).join('');
    setHtml('preview-step-2',
      '<div class="w-full text-left"><div class="text-xs text-sd-muted mb-2.5">เส้นทางการอนุมัติคำขอลา (Approval Flow):</div>' +
      '<div class="flex flex-col items-start">' +
      '<div class="text-xs text-sd-text-2 mb-1.5 font-medium">🧑‍🏫 ครูยื่นคำขอลา</div>' +
      '<div class="w-0.5 h-2.5 bg-sd-primary mb-1.5 ml-[23px]"></div>' + stepsHtml +
      '<div class="w-0.5 h-2.5 bg-sd-success mt-1.5 mb-1 ml-[23px]"></div>' +
      '<div class="text-xs text-sd-success font-semibold">✅ ใบลาอนุมัติสำเร็จ</div></div></div>');
  }

  function updatePreviewStep3() {
    var qSick = num('quota-sick', 30), qVac = num('quota-vacation', 10), qMat = num('quota-maternity', 90);
    var card = function (bar, box, border, txt, name, val, track) {
      return '<div class="relative overflow-hidden p-3 rounded-lg border ' + box + '" style="border-color:' + border + '">' +
        '<div class="absolute top-0 inset-x-0 h-[3px] ' + bar + '"></div>' +
        '<div class="flex justify-between items-center"><span class="text-[13px] font-semibold ' + txt + '">' + name + '</span><strong class="text-lg ' + txt + '">' + val + ' วัน</strong></div>' +
        '<div class="w-full h-1.5 bg-black/10 rounded-[3px] mt-2 overflow-hidden"><div class="w-full h-full ' + track + '"></div></div>' +
        '<div class="text-[10px] text-sd-muted mt-1">สิทธิ์เริ่มต้นปีการศึกษา: ' + val + ' วัน</div></div>';
    };
    setHtml('preview-step-3',
      '<div class="w-full flex flex-col gap-2.5">' +
      card('bg-sd-warning', 'bg-sd-warning-bg', 'rgba(245,158,11,0.3)', 'text-sd-warning', '🤒 ลาป่วยคงเหลือ', qSick, 'bg-sd-warning') +
      card('bg-sd-primary', 'bg-sd-info-bg', 'rgba(14,165,233,0.3)', 'text-sd-info', '✈️ ลาพักผ่อน/ลากิจคงเหลือ', qVac, 'bg-sd-info') +
      card('bg-sd-danger', 'bg-sd-success-bg', 'rgba(16,185,129,0.3)', 'text-sd-success', '👶 ลาคลอดบุตรคงเหลือ', qMat, 'bg-sd-success') + '</div>');
  }

  function updatePreviewStep4() {
    var half = q('rule-half-day') && q('rule-half-day').checked;
    var sickDoc = q('rule-sick-doc') && q('rule-sick-doc').checked;
    var advance = num('rule-advance-days', 3);
    var roll = q('rule-rollover') && q('rule-rollover').checked;
    var rollMax = num('rule-rollover-max', 5);
    var pill = 'text-[11px] px-2 py-0.5 rounded-full font-semibold';
    var halfHtml = half
      ? '<div class="flex gap-1.5 mt-1 flex-wrap"><span class="' + pill + ' bg-sd-primary text-white">ทั้งวัน</span>' +
        '<span class="' + pill + ' bg-black/[0.03] border border-sd-border text-sd-text">ครึ่งเช้า (0.5 วัน)</span>' +
        '<span class="' + pill + ' bg-black/[0.03] border border-sd-border text-sd-text">ครึ่งบ่าย (0.5 วัน)</span></div>'
      : '<div class="text-[11px] text-sd-muted mt-1">(ยื่นลาได้เฉพาะเต็มวันเท่านั้น)</div>';
    var box = 'px-2.5 py-2 rounded-md text-[11px] mt-2 border ';
    var sickHtml = sickDoc ? '<div class="' + box + 'bg-sd-danger-bg text-sd-danger border-[rgba(239,68,68,0.3)]">⚠️ บังคับแนบใบรับรองแพทย์ เมื่อยื่นลาป่วยติดต่อกันเกิน 3 วัน</div>' : '';
    var advHtml = advance > 0 ? '<div class="' + box + 'bg-sd-warning-bg text-sd-warning border-[rgba(245,158,11,0.3)]">⏰ ต้องยื่นคำขอล่วงหน้าอย่างน้อย ' + advance + ' วันทำการ</div>' : '';
    var rollHtml = roll ? '<div class="' + box + 'bg-sd-info-bg text-sd-info border-[rgba(14,165,233,0.3)]">✈️ วันลาพักผ่อนคงเหลือ ทบสะสมไปปีถัดไปได้สูงสุด ' + rollMax + ' วัน</div>' : '';
    setHtml('preview-step-4',
      '<div class="w-full text-left bg-white border border-sd-border rounded-lg p-3.5">' +
      '<div class="text-xs font-semibold text-sd-primary mb-2">📝 ฟอร์มคำขอลา (มุมมองครู)</div>' +
      '<div class="mb-2.5"><span class="text-xs text-sd-muted">ช่วงเวลาการลา:</span>' + halfHtml + '</div>' + advHtml + sickHtml + rollHtml + '</div>');
  }

  function updatePreviewStep5() {
    var late1 = num('alert-late-1', 3), late2 = num('alert-late-2', 7);
    var visa = num('alert-visa', 30), wp = num('alert-workpermit', 30), lic = num('alert-license', 60);
    var head = 'flex items-center gap-2 text-xs font-semibold';
    setHtml('preview-step-5',
      '<div class="w-full flex flex-col gap-2.5 text-left">' +
      '<div class="bg-sd-warning-bg border border-[rgba(245,158,11,0.3)] rounded-lg p-3"><div class="' + head + ' text-sd-warning">' + svg('bell', 'w-4 h-4') + ' แจ้งเตือนมาสาย (ครั้งที่ 1)</div>' +
      '<div class="text-xs text-sd-text mt-1">🔔 ครูสมชาย ใจดี มาสายสะสมครบ <strong>' + late1 + ' ครั้ง</strong> แล้ว</div></div>' +
      '<div class="bg-sd-danger-bg border border-[rgba(239,68,68,0.3)] rounded-lg p-3"><div class="' + head + ' text-sd-danger">' + svg('alertOct', 'w-4 h-4') + ' แจ้งเตือนมาสาย (ครั้งที่ 2 - วิกฤต)</div>' +
      '<div class="text-xs text-sd-text mt-1">🚨 ครูสมชาย ใจดี มาสายสะสมครบ <strong>' + late2 + ' ครั้ง</strong> (ต้องรายงานผู้บริหาร)</div></div>' +
      '<div class="bg-sd-info-bg border border-[rgba(14,165,233,0.3)] rounded-lg p-3"><div class="' + head + ' text-sd-info">' + svg('file', 'w-4 h-4') + ' แจ้งเตือนวันหมดอายุเอกสาร</div>' +
      '<div class="text-[11px] text-sd-text-2 mt-1 leading-normal">• วีซ่า: เตือนล่วงหน้า <strong>' + visa + ' วัน</strong><br>• Work Permit: เตือนล่วงหน้า <strong>' + wp + ' วัน</strong><br>• ใบประกอบวิชาชีพ: เตือนล่วงหน้า <strong>' + lic + ' วัน</strong></div></div></div>');
  }

  function updatePreviewStep6() {
    var checked = Array.prototype.map.call(root.querySelectorAll('.recipient-checkbox:checked'), function (cb) { return cb.value; });
    var str = checked.length ? esc(checked.join(', ')) : '⚠️ ยังไม่ได้เลือกผู้รับการแจ้งเตือน';
    setHtml('preview-step-6',
      '<div class="w-full text-left bg-white border border-sd-border rounded-lg p-3.5">' +
      '<div class="flex items-center gap-2 text-[13px] font-semibold text-sd-primary mb-2.5 border-b border-sd-border pb-2">' + svg('mail', 'w-4 h-4') + ' ตัวอย่างอีเมล/ข้อความแจ้งเตือนอัตโนมัติ</div>' +
      '<div class="text-xs mb-1.5"><span class="text-sd-muted">ส่งถึง:</span> <strong class="ml-1 ' + (checked.length ? 'text-sd-success' : 'text-sd-danger') + '">' + str + '</strong></div>' +
      '<div class="bg-black/[0.03] p-2.5 rounded-md border border-sd-border text-[11px] mt-2">' +
      '<div class="font-semibold text-sd-text mb-1">[SchoolDark] คำขอลาใหม่: ครูสมชาย ใจดี</div>' +
      '<div class="text-sd-text-2">ประเภท: ลาป่วย (3 วัน) | เหตุผล: ผ่าตัดฟันคุดทันตกรรมตามแพทย์นัด</div>' +
      '<div class="flex gap-1.5 mt-2"><span class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-sd-success-bg text-sd-success">อนุมัติ</span>' +
      '<span class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-sd-danger-bg text-sd-danger">ไม่อนุมัติ</span></div></div>' +
      '<div class="text-[10px] text-sd-muted mt-2.5 text-right">มีผู้รับการแจ้งเตือนทั้งหมด ' + checked.length + ' คน</div></div>');
  }

  function updateAllPreviews() {
    updatePreviewStep1(); updatePreviewStep2(); updatePreviewStep3();
    updatePreviewStep4(); updatePreviewStep5(); updatePreviewStep6();
  }

  // ---------------------------------------------------------------- tab
  function renderTab(panelEl) {
    st = S.leaveSettings();
    if (!Array.isArray(st.approvers)) st.approvers = [];
    if (!Array.isArray(st.recipients)) st.recipients = [];
    panelEl.innerHTML = '';
    root = document.createElement('div');
    panelEl.appendChild(root);
    ensureStaffTypeQuotaSeeded();
    root.innerHTML = buildHtml();
    renderStaffTypeQuotaTable();
    renderApprovers();

    root.addEventListener('click', function (e) {
      var stepBtn = e.target.closest('.journey-step');
      if (stepBtn) { goToStep(parseInt(stepBtn.getAttribute('data-step'), 10)); return; }
      var el = e.target.closest('[data-act]');
      if (!el) return;
      var act = el.getAttribute('data-act');
      if (act === 'add-approver') addApprover();
      else if (act === 'remove-approver') removeApprover(parseInt(el.getAttribute('data-idx'), 10));
      else if (act === 'next') nextStep();
      else if (act === 'prev') prevStep();
    });
    var onEdit = function (e) {
      if (e.target && e.target.id === 'rule-rollover') q('rollover-limit-group').classList.toggle('hidden', !e.target.checked);
      updateAllPreviews();
    };
    root.addEventListener('input', onEdit);
    root.addEventListener('change', onEdit);

    showStep(1);
  }

  LS.tabs.staff = {
    title: 'ตั้งค่าการลาบุคลากร',
    desc: 'กำหนดรอบปี ผู้อนุมัติ โควตา เงื่อนไข และการแจ้งเตือนการลาของบุคลากร',
    iconSvg: svg('calendar', 'h-6 w-6'),
    render: renderTab
  };
})();
