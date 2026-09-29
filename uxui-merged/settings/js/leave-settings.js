/* =====================================================================
 * settings/leave.html — ตั้งค่าการลา (ย้ายมาจาก schooldark/ : ตั้งค่าการลาบุคลากร + ตั้งค่าการลาเรียนนักเรียน)
 * ไฟล์นี้ = helpers กลาง + router ของแท็บ (ไม่มี logic ของแท็บเอง)
 *
 * CONTRACT (ไฟล์แท็บอื่นพึ่งพาส่วนนี้ — อย่าเปลี่ยนโดยไม่แจ้ง)
 *   window.LeaveSettings = {
 *     tabs: {},          // ไฟล์แท็บลงทะเบียนเอง: LeaveSettings.tabs.<key> = { title, desc, iconSvg, render(panelEl) }
 *                        //   key ที่ router รู้จัก: 'staff' (leave-settings-staff.js), 'student' (leave-settings-student.js)
 *                        //   title/desc = ข้อความหัวหน้า + breadcrumb, iconSvg = สตริง <svg ...> เต็ม (แสดงในไทล์ไอคอน)
 *                        //   render(panelEl) สร้าง markup ลง panelEl เอง (router เคลียร์ panel และ #modal-root ก่อนเรียกทุกครั้ง)
 *                        //   โมดัล/ drawer ของแท็บให้ append ลง #modal-root  (อย่า bind listener ซ้ำบน panelEl —
 *                        //   panelEl เป็น element เดิมทุกครั้ง; ให้สร้าง root div ลูกแล้ว bind บนนั้น)
 *     helpers: {
 *       esc(text)                          // escape HTML
 *       toast(msg, type)                   // type: 'success'(default) | 'error' | 'warning' | 'info'
 *       openModal(id) / closeModal(id)     // สลับคลาส Tailwind `hidden` <-> `flex` บน element id นั้น
 *       confirm(msg, {danger, confirmText, title, cancelText}) -> Promise<boolean>   // true = ยืนยัน, false = ยกเลิก/Esc/คลิกฉากหลัง
 *       debounce(fn, ms)
 *       svg(name, cls)                     // ไอคอนเล็กๆ (x, warn, info, checkCircle, xCircle, plus, trash, check, save, chevronLeft, chevronRight); cls default 'w-4 h-4'
 *     }
 *   }
 *   - router เรนเดอร์ตอน DOMContentLoaded (ไฟล์แท็บที่โหลดหลังไฟล์นี้จึงทันเสมอ)
 *   - ถ้า tabs.<key> ยังไม่มี -> แสดง placeholder "ยังไม่พร้อม" (ไม่ crash); ถ้า render() โยน error -> แสดงข้อความ error ใน panel
 *   - Esc ปิดโมดัลที่เปิดอยู่ใน #modal-root (`.fixed.flex`) และ confirm dialog
 *   - โบนัส: ปุ่มใดก็ได้ที่มี data-act="close" data-modal="<id>" จะปิดโมดัลนั้นให้อัตโนมัติ (delegated ที่ document)
 *   - hash `#tab=staff|student` (default staff); คลิก tab pill ที่ active อยู่แล้ว = render ใหม่
 *
 * classic script (ไม่ใช้ module) — ทำงานบน file:///
 * ===================================================================== */
(function () {
  'use strict';

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
      t = setTimeout(function () { fn.apply(self, args); }, wait == null ? 200 : wait);
    };
  }

  // ไอคอน (พาธเดียวกับ care / personnel-settings.js)
  var ICON = {
    warn: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
    chevronRight: '<polyline points="9 18 15 12 9 6"/>'
  };
  function svg(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="' + (cls || 'w-4 h-4') + '">' + (ICON[name] || '') + '</svg>';
  }

  // ---------------------------------------------------------------- toast
  var toastTimer = null;
  function toast(msg, type) {
    var el = $('toast');
    if (!el) return;
    $('toast-message').textContent = msg;
    var color = type === 'error' ? 'text-red-500' : (type === 'warning' ? 'text-amber-500' : (type === 'info' ? 'text-sky-500' : 'text-emerald-500'));
    var icon = type === 'error' ? ICON.xCircle : (type === 'warning' ? ICON.warn : (type === 'info' ? ICON.info : ICON.checkCircle));
    $('toast-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 ' + color + '">' + icon + '</svg>';
    el.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none'); }, 2600);
  }

  // ---------------------------------------------------------------- modals
  function openModal(id) { var m = $(id); if (m) { m.classList.remove('hidden'); m.classList.add('flex'); } }
  function closeModal(id) { var m = $(id); if (m) { m.classList.add('hidden'); m.classList.remove('flex'); } }

  // confirm dialog: อยู่นอก #modal-root (router เคลียร์ #modal-root ทุกครั้งที่เปลี่ยนแท็บ) จึงสร้างครั้งเดียวที่ท้าย <body>
  var BTN = 'inline-flex items-center justify-center gap-2 rounded-[14px] text-sm font-semibold cursor-pointer whitespace-nowrap border border-transparent transition-colors outline-none px-[22px] py-2.5';
  var BTN_PRIMARY = 'bg-sd-primary text-white shadow-[0_4px_14px_hsla(250,75%,55%,0.1)] hover:bg-sd-primary-hover';
  var BTN_DANGER = 'bg-sd-danger text-white hover:opacity-90';
  var BTN_SECONDARY = 'bg-white border-sd-border text-sd-text hover:bg-black/5 hover:border-sd-text-2';
  var confirmResolve = null;

  function buildConfirm() {
    if ($('leave-confirm')) return;
    var root = document.createElement('div');
    root.id = 'leave-confirm';
    root.className = 'fixed inset-0 z-[60] hidden items-center justify-center bg-black/65 p-4';
    root.innerHTML =
      '<div class="bg-white text-sd-text w-full max-w-[440px] rounded-[20px] p-5 sm:p-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] border border-sd-border">' +
      '<h3 id="leave-confirm-title" class="font-heading text-base font-semibold mb-3"></h3>' +
      '<p id="leave-confirm-message" class="text-[13.5px] text-sd-text-2 leading-relaxed"></p>' +
      '<div class="flex justify-end gap-2.5 mt-5 pt-3.5 border-t border-sd-border">' +
      '<button type="button" id="leave-confirm-cancel" class="' + BTN + ' ' + BTN_SECONDARY + '">ยกเลิก</button>' +
      '<button type="button" id="leave-confirm-ok" class="' + BTN + '">ยืนยัน</button></div></div>';
    document.body.appendChild(root);
    $('leave-confirm-ok').addEventListener('click', function () { settleConfirm(true); });
    $('leave-confirm-cancel').addEventListener('click', function () { settleConfirm(false); });
    root.addEventListener('click', function (e) { if (e.target === root) settleConfirm(false); });
  }
  function settleConfirm(val) {
    closeModal('leave-confirm');
    var r = confirmResolve; confirmResolve = null;
    if (r) r(val);
  }
  function confirmDialog(msg, opts) {
    opts = opts || {};
    buildConfirm();
    if (confirmResolve) settleConfirm(false);   // มี confirm ค้างอยู่ -> ยกเลิกอันเก่า
    $('leave-confirm-title').textContent = opts.title || (opts.danger ? 'ยืนยันการลบ' : 'ยืนยัน');
    $('leave-confirm-message').textContent = msg;
    var ok = $('leave-confirm-ok');
    ok.textContent = opts.confirmText || 'ยืนยัน';
    ok.className = BTN + ' ' + (opts.danger ? BTN_DANGER : BTN_PRIMARY);
    $('leave-confirm-cancel').textContent = opts.cancelText || 'ยกเลิก';
    return new Promise(function (resolve) {
      confirmResolve = resolve;
      openModal('leave-confirm');
    });
  }

  // ---------------------------------------------------------------- router
  var META = {
    staff: { title: 'ตั้งค่าการลาบุคลากร', desc: 'กำหนดรอบปี ผู้อนุมัติ โควตา เงื่อนไข และการแจ้งเตือนการลาของบุคลากร' },
    student: { title: 'ตั้งค่าการลาเรียนนักเรียน', desc: 'กำหนดประเภทการลา โควตา และผู้อนุมัติการลาเรียนของนักเรียน' }
  };
  var PLACEHOLDER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  var currentTab = 'staff';

  function getTabFromHash() {
    var m = /tab=([a-z-]+)/.exec(location.hash.replace('#', ''));
    return (m && META[m[1]]) ? m[1] : 'staff';
  }
  function switchTab(tab) {
    tab = META[tab] ? tab : 'staff';
    if (location.hash !== '#tab=' + tab) location.hash = 'tab=' + tab;   // hashchange จะเรียก render()
    else { currentTab = tab; render(); }
  }
  function render() {
    var def = LS.tabs[currentTab];
    var meta = META[currentTab];
    var title = (def && def.title) || meta.title;
    document.title = 'ตั้งค่าการลา — ศูนย์รวมการตั้งค่า';
    $('tab-title').textContent = title;
    $('tab-desc').textContent = (def && def.desc) || meta.desc;
    $('crumb-tab').textContent = title;
    $('tab-icon-tile').innerHTML = (def && def.iconSvg) || PLACEHOLDER_ICON;
    document.querySelectorAll('.tab-pill').forEach(function (a) {
      var active = a.getAttribute('data-tab-link') === currentTab;
      a.className = 'tab-pill flex-1 text-center py-2 px-3 rounded-lg text-xs transition-colors whitespace-nowrap ' +
        (active ? 'font-bold bg-sd-primary text-white shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-700');
    });
    var panel = $('panel');
    panel.innerHTML = '';
    $('modal-root').innerHTML = '';
    if (confirmResolve) settleConfirm(false);
    if (!def || typeof def.render !== 'function') {
      panel.innerHTML = '<div class="bg-white border border-sd-border rounded-[20px] p-8 text-center text-sd-muted text-sm">' +
        '<div class="font-heading text-base font-semibold text-sd-text-2 mb-1">ยังไม่พร้อม</div>แท็บ "' + esc(title) + '" ยังไม่ถูกโหลด</div>';
      return;
    }
    try {
      def.render(panel);
    } catch (err) {
      panel.innerHTML = '<div class="bg-sd-danger-bg border border-sd-danger rounded-[20px] p-6 text-sd-danger text-sm">แสดงแท็บนี้ไม่สำเร็จ: ' + esc(err && err.message) + '</div>';
      if (window.console) console.error(err);
    }
  }

  var LS = window.LeaveSettings = {
    tabs: {},
    helpers: { esc: esc, toast: toast, openModal: openModal, closeModal: closeModal, confirm: confirmDialog, debounce: debounce, svg: svg },
    switchTab: switchTab
  };

  document.addEventListener('DOMContentLoaded', function () {
    buildConfirm();
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-act="close"][data-modal]') : null;
      if (el) closeModal(el.getAttribute('data-modal'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (confirmResolve) { settleConfirm(false); return; }
      document.querySelectorAll('#modal-root .fixed.flex').forEach(function (m) { if (m.id) closeModal(m.id); });
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
})();
