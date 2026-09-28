/* ======================================================================
 *  ui.js — UI กลางของ admission/ (modal / confirm / alert / toast)
 *
 *  แทนที่โค้ดที่เคย copy-paste ซ้ำกันหลายไฟล์ (showToast 5 แบบ, openModal/
 *  closeModal 3 ชุด, maskCid 2 แบบ) ด้วยชุดเดียว โมเดลตาม
 *  parent/js/parent-nav.js (ParentUI.createDialog/confirm) แต่ปรับสไตล์ให้
 *  ตรงกับดีไซน์ของ admission/ (bg-card, rounded-xl, ตัวอักษร text-xs/sm)
 *
 *  โหลดคู่กับ js/store.js เสมอ (หลัง store.js เพราะใช้ window.escapeHtml จากที่นั่น)
 *  ก่อนสคริปต์อินไลน์ท้ายไฟล์ของแต่ละหน้า
 *
 *  Export:
 *    window.AdmissionUI = { createDialog, confirm, alert, toast, teamCPlaceholder }
 *    window.openModal(id) / window.closeModal(id)  — compat กับ onclick เดิมในหน้า
 *    window.showToast(title, description, type, undoCallback) — compat กับโค้ดเดิม
 *    window.maskCid(cid)
 * ====================================================================== */
(function () {
  'use strict';

  function esc(v) {
    return window.escapeHtml ? window.escapeHtml(v) : String(v == null ? '' : v);
  }

  /* ---------------------------------------------------------------------
   * teamCPlaceholder — กล่องเส้นประบอกว่าส่วนนี้รอข้อมูลจากทีมอื่น (ปพ.ต่าง ๆ ที่ต้องใช้
   * เกรดรายวิชาจาก Team C ซึ่งยังไม่มี backend ให้ดึงจริง) ใช้แทนใส่ตัวเลขปลอมในเอกสารทางการ
   * ใช้ร่วมกันทั้ง students.html (ปพ.1/3/7) และ profile.html (แท็บผลการเรียน)
   * ------------------------------------------------------------------- */
  function teamCPlaceholder(label) {
    return (
      '<div class="border border-dashed border-slate-300 rounded-lg p-4 flex items-center gap-2.5 text-slate-400 bg-slate-50">' +
      '<i data-lucide="database" class="h-4 w-4 shrink-0"></i>' +
      '<span>รอข้อมูลจาก Team C — ' + esc(label) + '</span>' +
      '</div>'
    );
  }

  /* ---------------------------------------------------------------------
   * maskCid — เลขบัตรประชาชนแบบ mask (รูปแบบเดียวกับที่ edit.html ใช้อยู่เดิม)
   * ------------------------------------------------------------------- */
  function maskCid(cid) {
    if (!cid) return '—';
    var clean = String(cid).replace(/\D/g, '');
    if (clean.length < 5) return cid;
    return clean.slice(0, 1) + '-XXXX-XXXXX-XX-' + clean.slice(-1);
  }

  /* ---------------------------------------------------------------------
   * createDialog / confirm / alert — <dialog> จริง แทน div.fixed เดิม
   * ได้ focus trap, คืน focus, Esc ปิดฟรีจากเบราว์เซอร์ (closedby="any")
   * ------------------------------------------------------------------- */
  function createDialog(opts) {
    opts = opts || {};
    var dialog = document.createElement('dialog');
    if (opts.id) dialog.id = opts.id;
    dialog.className = 'p-0 border-0 rounded-xl shadow-xl bg-card text-card-foreground backdrop:bg-black/40' +
      (opts.className ? ' ' + opts.className : '');
    if (opts.labelledBy) dialog.setAttribute('aria-labelledby', opts.labelledBy);
    dialog.setAttribute('closedby', 'any');
    dialog.innerHTML = opts.html || '';

    document.body.appendChild(dialog);

    dialog.addEventListener('close', function () {
      if (dialog.parentNode) dialog.parentNode.removeChild(dialog);
    });

    dialog.querySelectorAll('[data-dialog-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { dialog.close(); });
    });

    // fallback: เบราว์เซอร์ที่ไม่รู้จัก closedby จะไม่ปิดเองตอนคลิก backdrop
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', function (e) {
        if (e.target !== dialog) return;
        var r = dialog.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) dialog.close();
      });
    }

    if (window.lucide) window.lucide.createIcons();
    dialog.showModal();
    return dialog;
  }

  function confirmDialog(message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var msgId = 'ad-confirm-msg-' + Math.random().toString(36).slice(2, 9);
      var confirmCls = opts.danger
        ? 'bg-destructive hover:bg-destructive/90 text-white'
        : 'bg-primary hover:bg-primary-hover text-primary-foreground';
      var html =
        '<form method="dialog" class="p-5 w-[min(28rem,calc(100vw-2rem))]">' +
          '<p id="' + msgId + '" class="text-sm text-card-foreground mb-4">' + esc(message) + '</p>' +
          '<div class="flex items-center justify-end gap-2">' +
            '<button type="submit" value="cancel" autofocus class="border border-border text-card-foreground hover:bg-slate-50 rounded-lg px-4 py-2 text-xs font-semibold">ยกเลิก</button>' +
            '<button type="submit" value="confirm" class="' + confirmCls + ' rounded-lg px-4 py-2 text-xs font-semibold">' + esc(opts.confirmText || 'ยืนยัน') + '</button>' +
          '</div>' +
        '</form>';
      var dialog = createDialog({ labelledBy: msgId, className: 'max-w-md', html: html });
      dialog.addEventListener('close', function () {
        resolve(dialog.returnValue === 'confirm');
      }, { once: true });
    });
  }

  // แทนที่ alert() ของเบราว์เซอร์ (กล่องสีเทาไม่มีสไตล์) ด้วย dialog เดียวกัน มีปุ่มเดียว
  function alertDialog(message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var msgId = 'ad-alert-msg-' + Math.random().toString(36).slice(2, 9);
      var titleHtml = opts.title
        ? '<p class="text-sm font-bold text-card-foreground mb-1">' + esc(opts.title) + '</p>'
        : '';
      var html =
        '<form method="dialog" class="p-5 w-[min(28rem,calc(100vw-2rem))]">' +
          titleHtml +
          '<p id="' + msgId + '" class="text-sm text-card-foreground mb-4">' + esc(message) + '</p>' +
          '<div class="flex items-center justify-end">' +
            '<button type="submit" value="ok" autofocus class="bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg px-4 py-2 text-xs font-semibold">ตกลง</button>' +
          '</div>' +
        '</form>';
      var dialog = createDialog({ labelledBy: msgId, className: 'max-w-md', html: html });
      dialog.addEventListener('close', function () { resolve(); }, { once: true });
    });
  }

  /* ---------------------------------------------------------------------
   * openModal / closeModal — คง markup div.fixed.hidden เดิมทุกไฟล์ไว้ (ไม่ต้อง
   * ไล่แก้ทุกโมดัลเป็น <dialog>) แต่เสริม a11y ให้ครบ: role/aria-modal, คืน focus
   * ไปที่ปุ่มที่เปิดโมดัล, focus อยู่ในกรอบโมดัลด้วย Tab, Esc ปิดโมดัลบนสุด — ยกเว้น
   * โมดัลที่มี data-modal-static (เช่น #modal-notice ใน students.html ที่ตั้งใจให้
   * ปิดได้ทางเดียวคือกดปุ่มรับทราบเท่านั้น)
   * ------------------------------------------------------------------- */
  var modalStack = []; // [{ id, el, prevActive }] เรียงจากเปิดก่อน→เปิดหลัง รองรับโมดัลซ้อนกัน

  function focusablesIn(el) {
    return Array.prototype.filter.call(
      el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (n) { return n.offsetParent !== null; }
    );
  }

  function topModal() { return modalStack[modalStack.length - 1] || null; }

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var prevActive = document.activeElement;
    el.classList.remove('hidden');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    modalStack.push({ id: id, el: el, prevActive: prevActive });
    var focusables = focusablesIn(el);
    (focusables[0] || el).focus();
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
    var idx = -1;
    for (var i = modalStack.length - 1; i >= 0; i--) {
      if (modalStack[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return;
    var entry = modalStack.splice(idx, 1)[0];
    if (entry.prevActive && document.body.contains(entry.prevActive) && typeof entry.prevActive.focus === 'function') {
      entry.prevActive.focus();
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Tab') return;
    var top = topModal();
    if (!top) return;
    if (e.key === 'Escape') {
      if (top.el.hasAttribute('data-modal-static')) return;
      e.preventDefault();
      closeModal(top.id);
      return;
    }
    // Tab: วน focus อยู่ในกรอบโมดัลบนสุดเท่านั้น
    var f = focusablesIn(top.el);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------------------------------------------------------------------
   * toast — การ์ดมุมล่างขวา ใช้แทน showToast ที่เคย copy 5 แบบไว้ (title,
   * description, ไอคอนตามประเภท, ปุ่มย้อนกลับถ้ามี undo callback)
   * ------------------------------------------------------------------- */
  var TOAST_ICON = {
    success: '<i data-lucide="check-circle-2" class="h-5 w-5 text-success"></i>',
    info: '<i data-lucide="info" class="h-5 w-5 text-info"></i>',
    warning: '<i data-lucide="alert-triangle" class="h-5 w-5 text-warning"></i>',
    error: '<i data-lucide="alert-circle" class="h-5 w-5 text-destructive"></i>'
  };
  var TOAST_BORDER = {
    success: 'border-success/20',
    info: 'border-info/20',
    warning: 'border-warning/20',
    error: 'border-destructive/20'
  };

  function getToastContainer() {
    var c = document.getElementById('admission-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'admission-toast-container';
      c.className = 'fixed bottom-5 right-5 z-[100020] flex flex-col gap-2 max-w-sm w-full';
      c.setAttribute('role', 'status');
      c.setAttribute('aria-live', 'polite');
      document.body.appendChild(c);
    }
    return c;
  }

  function toast(title, description, opts) {
    opts = opts || {};
    var type = TOAST_ICON[opts.type] ? opts.type : 'success';
    var container = getToastContainer();
    var el = document.createElement('div');
    el.className = 'p-4 rounded-xl border shadow-lg bg-white flex gap-3 transition-all duration-300 transform translate-y-2 opacity-0 ' + TOAST_BORDER[type];
    var undoBtnHtml = typeof opts.undo === 'function'
      ? '<button type="button" data-toast-undo class="text-xs text-primary font-bold hover:underline shrink-0 ml-auto self-start">ย้อนกลับ</button>'
      : '';
    el.innerHTML =
      '<div class="shrink-0 mt-0.5">' + TOAST_ICON[type] + '</div>' +
      '<div class="space-y-0.5 flex-1 min-w-0">' +
        '<div class="text-xs font-bold text-slate-800">' + esc(title) + '</div>' +
        (description ? '<div class="text-[11px] text-slate-500">' + esc(description) + '</div>' : '') +
      '</div>' + undoBtnHtml;
    container.appendChild(el);
    if (window.lucide) window.lucide.createIcons();
    requestAnimationFrame(function () { el.classList.remove('translate-y-2', 'opacity-0'); });

    var timeoutId = setTimeout(dismiss, opts.undo ? 8000 : 5000);
    function dismiss() {
      el.classList.add('opacity-0');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    }
    var undoBtn = el.querySelector('[data-toast-undo]');
    if (undoBtn) {
      undoBtn.addEventListener('click', function () {
        clearTimeout(timeoutId);
        dismiss();
        opts.undo();
      });
    }
  }

  window.AdmissionUI = {
    createDialog: createDialog,
    confirm: confirmDialog,
    alert: alertDialog,
    toast: toast,
    teamCPlaceholder: teamCPlaceholder
  };

  // compat globals — เดิมทุกหน้ามีฟังก์ชันพวกนี้ประกาศเองซ้ำกัน (ลบไปแล้วตอนย้ายมาที่นี่)
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.maskCid = maskCid;
  window.showToast = function (title, description, type, undoCallback) {
    toast(title, description, { type: type, undo: undoCallback });
  };
})();
