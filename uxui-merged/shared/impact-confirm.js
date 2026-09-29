/* ============================================================
   ImpactConfirm — ป๊อปอัปยืนยันก่อน "แก้ไข / ลบ / ปิดใช้งาน / บันทึก / นำกลับมาใช้" การตั้งค่า
   บอกให้ชัดว่าจะเกิดอะไร และส่งผลกับหน้าไหน/ส่วนไหนของระบบบ้าง
   ใช้ได้ทุกหน้า (schooldark / settings) — สร้าง DOM + <style> เองทั้งหมด ไม่ต้องแก้ HTML ของหน้า
   สีอ่านจาก CSS variable ของหน้า (ถ้ามี) พร้อมค่า fallback

   ImpactConfirm.show({
     title:        'แก้ไขประเภทบัตร',            // หัวข้อ
     tone:         'warning' | 'danger' | 'info', // สีของไอคอน/ปุ่มยืนยัน (ค่าเริ่มต้น 'warning')
     summary:      'ข้อความสั้น ๆ ว่ากำลังทำอะไร (HTML ได้)',
     changes:      [{ label: 'ชื่อ', before: 'เดิม', after: 'ใหม่' }],  // ไม่บังคับ — ตาราง "เดิม → ใหม่"
     impacts:      ['หน้า ... : ...', { where: 'หน้า ...', detail: '...' }], // "ส่งผลกับ"
     note:         'หมายเหตุท้ายป๊อปอัป (ไม่บังคับ)',
     confirmLabel: 'ยืนยัน', cancelLabel: 'ยกเลิก',
     onConfirm() {}, onCancel() {}
   })
   ============================================================ */
(function () {
  'use strict';

  var STYLE_ID = 'impact-confirm-style';
  var CSS = [
    '.ic-overlay{position:fixed;inset:0;z-index:2000;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .15s ease}',
    '.ic-overlay.ic-show{opacity:1}',
    '.ic-card{width:100%;max-width:520px;max-height:calc(100vh - 40px);overflow:auto;background:var(--bg-main,#fff);color:var(--text-primary,#111827);border:1px solid var(--border-color,#e5e7eb);border-radius:16px;box-shadow:0 24px 60px rgba(15,23,42,.25);font-family:inherit;transform:translateY(8px);transition:transform .15s ease}',
    '.ic-overlay.ic-show .ic-card{transform:none}',
    '.ic-head{display:flex;gap:14px;align-items:flex-start;padding:22px 24px 6px}',
    '.ic-icon{flex-shrink:0;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:20px;font-weight:800}',
    '.ic-warning .ic-icon{background:var(--warning-bg,#fef3c7);color:var(--warning,#d97706)}',
    '.ic-danger .ic-icon{background:var(--danger-bg,#fee2e2);color:var(--danger,#dc2626)}',
    '.ic-info .ic-icon{background:var(--info-bg,#e0f2fe);color:var(--info,#0284c7)}',
    '.ic-title{font-size:17px;font-weight:700;margin:2px 0 6px;line-height:1.35}',
    '.ic-summary{font-size:14px;line-height:1.65;color:var(--text-secondary,#374151)}',
    '.ic-body{padding:8px 24px 4px}',
    '.ic-section{margin-top:14px}',
    '.ic-section-title{font-size:12px;font-weight:700;letter-spacing:.3px;color:var(--text-muted,#6b7280);margin-bottom:8px}',
    '.ic-changes{width:100%;border-collapse:collapse;font-size:13px}',
    '.ic-changes td{padding:7px 8px;border-top:1px solid var(--border-color,#e5e7eb);vertical-align:top}',
    '.ic-changes tr:first-child td{border-top:0}',
    '.ic-changes .ic-label{color:var(--text-muted,#6b7280);white-space:nowrap;width:1%}',
    '.ic-before{color:var(--text-muted,#6b7280);text-decoration:line-through}',
    '.ic-after{font-weight:700}',
    '.ic-arrow{color:var(--text-muted,#9ca3af);padding:0 4px}',
    '.ic-impacts{list-style:none;margin:0;padding:12px 14px;display:flex;flex-direction:column;gap:9px;background:var(--bg-card,#f9fafb);border:1px solid var(--border-color,#e5e7eb);border-radius:12px}',
    '.ic-impacts li{display:flex;gap:10px;font-size:13.5px;line-height:1.55}',
    '.ic-impacts li::before{content:"";flex-shrink:0;width:7px;height:7px;margin-top:7px;border-radius:50%;background:var(--primary,#4f46e5)}',
    '.ic-where{font-weight:700}',
    '.ic-note{margin-top:12px;font-size:12.5px;line-height:1.55;color:var(--text-muted,#6b7280)}',
    '.ic-actions{display:flex;gap:10px;padding:18px 24px 22px}',
    '.ic-btn{flex:1;min-height:42px;border-radius:10px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;border:1px solid var(--border-color,#d1d5db);background:var(--bg-main,#fff);color:var(--text-primary,#111827)}',
    '.ic-btn:hover{filter:brightness(.97)}',
    '.ic-btn:focus-visible{outline:2px solid var(--primary,#4f46e5);outline-offset:2px}',
    '.ic-btn-confirm{border-color:transparent;color:#fff}',
    '.ic-warning .ic-btn-confirm{background:var(--primary,#4f46e5)}',
    '.ic-info .ic-btn-confirm{background:var(--primary,#4f46e5)}',
    '.ic-danger .ic-btn-confirm{background:var(--danger,#dc2626)}',
    '@media (max-width:480px){.ic-head{padding:18px 18px 4px}.ic-body{padding:6px 18px 2px}.ic-actions{padding:16px 18px 18px}}'
  ].join('\n');

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var ICON = { warning: '!', danger: '!', info: 'i' };
  var current = null;

  function close(cb) {
    if (!current) return;
    var el = current.el;
    document.removeEventListener('keydown', current.onKey, true);
    el.classList.remove('ic-show');
    current = null;
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 150);
    if (typeof cb === 'function') cb();
  }

  function show(opts) {
    opts = opts || {};
    ensureStyle();
    if (current) close();

    var tone = opts.tone === 'danger' || opts.tone === 'info' ? opts.tone : 'warning';
    var changes = (opts.changes || []).filter(function (c) { return c && String(c.before) !== String(c.after); });
    var impacts = opts.impacts || [];

    var html = '';
    html += '<div class="ic-card ic-' + tone + '" role="dialog" aria-modal="true" aria-labelledby="ic-title">';
    html += '<div class="ic-head"><div class="ic-icon" aria-hidden="true">' + ICON[tone] + '</div><div>';
    html += '<div class="ic-title" id="ic-title">' + esc(opts.title || 'ยืนยันการเปลี่ยนแปลง') + '</div>';
    if (opts.summary) html += '<div class="ic-summary">' + opts.summary + '</div>';
    html += '</div></div><div class="ic-body">';

    if (changes.length) {
      html += '<div class="ic-section"><div class="ic-section-title">สิ่งที่เปลี่ยน</div><table class="ic-changes">';
      changes.forEach(function (c) {
        html += '<tr><td class="ic-label">' + esc(c.label) + '</td><td>' +
          '<span class="ic-before">' + esc(c.before === '' ? '(ว่าง)' : c.before) + '</span>' +
          '<span class="ic-arrow">→</span><span class="ic-after">' + esc(c.after === '' ? '(ว่าง)' : c.after) + '</span></td></tr>';
      });
      html += '</table></div>';
    }

    if (impacts.length) {
      html += '<div class="ic-section"><div class="ic-section-title">ส่งผลกับ</div><ul class="ic-impacts">';
      impacts.forEach(function (it) {
        if (typeof it === 'string') html += '<li><span>' + it + '</span></li>';
        else html += '<li><span><span class="ic-where">' + esc(it.where) + '</span>' + (it.detail ? ' — ' + it.detail : '') + '</span></li>';
      });
      html += '</ul></div>';
    }

    if (opts.note) html += '<div class="ic-note">' + opts.note + '</div>';
    html += '</div><div class="ic-actions">';
    html += '<button type="button" class="ic-btn ic-btn-cancel">' + esc(opts.cancelLabel || 'ยกเลิก') + '</button>';
    html += '<button type="button" class="ic-btn ic-btn-confirm">' + esc(opts.confirmLabel || 'ยืนยัน') + '</button>';
    html += '</div></div>';

    var overlay = document.createElement('div');
    overlay.className = 'ic-overlay';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    var cancel = function () { close(opts.onCancel); };
    var confirm = function () { close(opts.onConfirm); };
    overlay.addEventListener('click', function (e) { if (e.target === overlay) cancel(); });
    overlay.querySelector('.ic-btn-cancel').addEventListener('click', cancel);
    overlay.querySelector('.ic-btn-confirm').addEventListener('click', confirm);
    var onKey = function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); cancel(); }
    };
    document.addEventListener('keydown', onKey, true);
    current = { el: overlay, onKey: onKey };

    requestAnimationFrame(function () {
      overlay.classList.add('ic-show');
      overlay.querySelector('.ic-btn-confirm').focus();
    });
  }

  window.ImpactConfirm = { show: show, close: function () { close(); } };
})();
