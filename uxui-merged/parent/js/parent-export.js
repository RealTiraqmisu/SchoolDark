/* ======================================================================
 *  parent-export.js — โมดูลกลาง "พิมพ์ / ดาวน์โหลด PDF" ของพอร์ทัลผู้ปกครอง
 *  ใช้ร่วมกันได้ทุกหน้าที่มีตาราง (timetable.html, calendar.html ฯลฯ)
 *
 *  วิธีใช้: window.ParentExport.open({ title, subtitle, filename, node, orientation })
 *  - node: DOM element ที่ต้องการแสดงใน preview (โมดูลจะ clone เองก่อนแสดง ไม่แก้ node เดิม)
 *  - title/subtitle: หัวกระดาษ (ชื่อโรงเรียนใส่ให้อัตโนมัติจาก ParentUI.schoolName())
 *  - filename: ชื่อไฟล์ (ไม่ต้องใส่ .pdf)
 *  - orientation: 'portrait' (ค่าเริ่มต้น) หรือ 'landscape'
 *
 *  ก่อนแสดงผล จะลบ element ที่มีคลาส .no-export ออกจาก clone และถอดคลาส responsive
 *  ที่ทำให้บางส่วนถูกซ่อนบนจอเล็ก (hidden ที่มากับ md:/sm: breakpoint) เพื่อให้เนื้อหา
 *  เต็มเสมอไม่ว่าจะเปิดจากจอขนาดไหน
 * ====================================================================== */

window.ParentExport = (function () {
  'use strict';

  var HTML2PDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
  var html2pdfPromise = null;

  function loadHtml2Pdf() {
    if (window.html2pdf) return Promise.resolve();
    if (html2pdfPromise) return html2pdfPromise;
    html2pdfPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = HTML2PDF_URL;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('โหลด html2pdf.js ไม่สำเร็จ')); };
      document.head.appendChild(script);
    });
    return html2pdfPromise;
  }

  function ensurePrintStyle() {
    if (document.getElementById('export-print-style')) return;
    var style = document.createElement('style');
    style.id = 'export-print-style';
    style.textContent =
      '@media print {' +
      '  body.export-printing > *:not(#export-modal) { display: none !important; }' +
      '  body.export-printing #export-modal { position: static !important; max-width: none !important; max-height: none !important; width: auto !important; margin: 0 !important; box-shadow: none !important; border: 0 !important; overflow: visible !important; }' +
      '  body.export-printing #export-modal::backdrop { display: none !important; }' +
      '  body.export-printing #export-modal .export-chrome { display: none !important; }' +
      '  body.export-printing #export-paper { box-shadow: none !important; width: auto !important; padding: 0 !important; margin: 0 !important; }' +
      '}';
    document.head.appendChild(style);
  }

  function ensurePageStyle(orientation) {
    var el = document.getElementById('export-page-style');
    if (!el) {
      el = document.createElement('style');
      el.id = 'export-page-style';
      document.head.appendChild(el);
    }
    el.textContent = '@page { size: A4 ' + (orientation === 'landscape' ? 'landscape' : '') + '; margin: 12mm; }';
  }

  // ลบ .no-export และเปิดเผยเนื้อหาที่ถูกซ่อนด้วย breakpoint (hidden md:block ฯลฯ)
  // + ถอดคลาสที่ระบุใน data-export-strip ออก (ใช้ลบไฮไลต์/ตกแต่งที่ไม่ต้องการในไฟล์ที่พิมพ์ออกมา)
  function prepareNode(node) {
    var clone = node.cloneNode(true);
    clone.querySelectorAll('.no-export').forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    if (clone.classList.contains('no-export')) return null;

    var all = [clone].concat(Array.prototype.slice.call(clone.querySelectorAll('*')));
    all.forEach(function (el) {
      if (!el.classList || !el.classList.contains('hidden')) return;
      var hasResponsiveShow = /(^|\s)(sm|md|lg|xl):(block|flex|grid|inline|inline-block|inline-flex|table)(\s|$)/.test(el.className);
      if (hasResponsiveShow) el.classList.remove('hidden');
    });

    var stripTargets = [clone].concat(Array.prototype.slice.call(clone.querySelectorAll('[data-export-strip]')));
    stripTargets.forEach(function (el) {
      var attr = el.getAttribute && el.getAttribute('data-export-strip');
      if (!attr) return;
      attr.split(/\s+/).forEach(function (c) { if (c) el.classList.remove(c); });
    });

    return clone;
  }

  var ORIENTATION_BTN_ACTIVE = 'bg-primary text-primary-foreground';
  var ORIENTATION_BTN_INACTIVE = 'bg-card text-card-foreground hover:bg-secondary';

  function open(opts) {
    opts = opts || {};
    var node = prepareNode(opts.node);
    if (!node) {
      if (window.ParentUI) ParentUI.toast('ไม่พบเนื้อหาที่จะพิมพ์', 'error');
      return;
    }
    // ใช้ตัวแปรนี้เก็บแนวกระดาษปัจจุบัน (ผู้ใช้สลับได้จากปุ่มแนวตั้ง/แนวนอนใน modal)
    var orientation = opts.orientation === 'landscape' ? 'landscape' : 'portrait';
    var filename = opts.filename || 'เอกสาร';
    var esc = (window.ParentUI && ParentUI.escapeHtml) || function (s) { return s; };

    ensurePrintStyle();
    closeExisting();

    var html =
      '<div class="export-chrome flex items-center justify-between px-5 py-3 border-b border-border gap-3">' +
        '<span id="export-title" class="font-semibold text-card-foreground">ตัวอย่างก่อนพิมพ์ / ดาวน์โหลด</span>' +
        '<div class="flex items-center gap-3">' +
          '<div data-export-orientation role="group" aria-label="แนวกระดาษ" class="inline-flex rounded-lg border border-border overflow-hidden shrink-0">' +
            '<button type="button" data-orientation-btn="portrait" aria-pressed="false" class="px-3 py-1.5 text-xs font-medium">แนวตั้ง</button>' +
            '<button type="button" data-orientation-btn="landscape" aria-pressed="false" class="px-3 py-1.5 text-xs font-medium border-l border-border">แนวนอน</button>' +
          '</div>' +
          '<button type="button" data-dialog-close aria-label="ปิด" class="text-muted-foreground hover:text-card-foreground"><i data-lucide="x" class="w-5 h-5"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="export-chrome flex-1 overflow-auto bg-muted p-4">' +
        '<div id="export-paper" class="bg-white shadow mx-auto p-8">' +
          '<div class="text-center mb-4">' +
            '<div class="font-bold text-lg">' + esc((window.ParentUI && ParentUI.schoolName()) || '') + '</div>' +
            (opts.title ? '<div class="font-semibold mt-1">' + esc(opts.title) + '</div>' : '') +
            (opts.subtitle ? '<div class="text-sm text-muted-foreground mt-0.5">' + esc(opts.subtitle) + '</div>' : '') +
            '<div class="text-xs text-muted-foreground mt-1">พิมพ์เมื่อ ' + esc((window.ParentUI && window.ParentStore) ? ParentUI.fmtDate(ParentStore.today(), true) : '') + '</div>' +
          '</div>' +
          '<div id="export-content"></div>' +
        '</div>' +
      '</div>' +
      '<div class="export-chrome flex items-center justify-end gap-2 px-5 py-3 border-t border-border">' +
        '<button type="button" data-export-download="pdf" class="bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">' +
          '<i data-lucide="download" class="w-4 h-4"></i> ดาวน์โหลด PDF</button>' +
        '<button type="button" data-export-download="jpg" class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">' +
          '<i data-lucide="image" class="w-4 h-4"></i> ดาวน์โหลด JPG</button>' +
        '<button type="button" data-export-print class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">' +
          '<i data-lucide="printer" class="w-4 h-4"></i> พิมพ์</button>' +
        '<button type="button" data-dialog-close class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium">ปิด</button>' +
      '</div>';

    // ใช้ <dialog> ผ่าน ParentUI.createDialog แทน div.fixed เดิม — ได้ focus trap/คืน focus/Esc
    // ปิดฟรีจากเบราว์เซอร์ (ดูคอมเมนต์ที่ createDialog ใน parent-nav.js)
    var dialog = ParentUI.createDialog({
      id: 'export-modal',
      labelledBy: 'export-title',
      className: 'max-w-5xl w-[calc(100%-2rem)] max-h-[90vh] flex flex-col',
      html: html
    });
    dialog.querySelector('#export-content').appendChild(node);

    var paperEl = dialog.querySelector('#export-paper');

    function applyOrientation() {
      paperEl.style.width = orientation === 'landscape' ? '1123px' : '794px';
      dialog.querySelectorAll('[data-orientation-btn]').forEach(function (btn) {
        var active = btn.getAttribute('data-orientation-btn') === orientation;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.className = 'px-3 py-1.5 text-xs font-medium' +
          (btn.getAttribute('data-orientation-btn') === 'landscape' ? ' border-l border-border' : '') +
          ' ' + (active ? ORIENTATION_BTN_ACTIVE : ORIENTATION_BTN_INACTIVE);
      });
    }
    applyOrientation();

    dialog.querySelectorAll('[data-orientation-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        orientation = btn.getAttribute('data-orientation-btn') === 'landscape' ? 'landscape' : 'portrait';
        applyOrientation();
      });
    });

    if (window.lucide) lucide.createIcons();

    dialog.querySelector('[data-export-print]').addEventListener('click', function () {
      ensurePageStyle(orientation);
      document.body.classList.add('export-printing');
      window.addEventListener('afterprint', function onAfterPrint() {
        document.body.classList.remove('export-printing');
        window.removeEventListener('afterprint', onAfterPrint);
      });
      window.print();
    });

    // ตั้งค่าปุ่มดาวน์โหลดให้เป็น loading ระหว่างสร้างไฟล์ แล้วคืนกลับเป็นปกติ (ใช้ร่วมกันทั้ง PDF/JPG)
    function withDownloadBusyState(btn, task) {
      var originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> กำลังสร้างไฟล์…';
      if (window.lucide) lucide.createIcons();

      function reset() {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        if (window.lucide) lucide.createIcons();
      }

      task().then(reset).catch(function () {
        reset();
        if (window.ParentUI) ParentUI.toast('ดาวน์โหลดไม่สำเร็จ ลองใช้ปุ่มพิมพ์ แล้วเลือก Save as PDF', 'error');
      });
    }

    dialog.querySelector('[data-export-download="pdf"]').addEventListener('click', function () {
      var btn = dialog.querySelector('[data-export-download="pdf"]');
      withDownloadBusyState(btn, function () {
        return loadHtml2Pdf().then(function () {
          return window.html2pdf().set({
            margin: 10,
            filename: filename + '.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, windowWidth: 1200, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: orientation }
          }).from(paperEl).save();
        });
      });
    });

    dialog.querySelector('[data-export-download="jpg"]').addEventListener('click', function () {
      var btn = dialog.querySelector('[data-export-download="jpg"]');
      withDownloadBusyState(btn, function () {
        return loadHtml2Pdf().then(function () {
          return window.html2pdf().set({
            html2canvas: { scale: 2, windowWidth: 1200, useCORS: true }
          }).from(paperEl).toCanvas().get('canvas').then(function (canvas) {
            var a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg', 0.95);
            a.download = filename + '.jpg';
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
        });
      });
    });
  }

  function closeExisting() {
    var existing = document.getElementById('export-modal');
    if (existing) existing.close();
  }

  return { open: open };
})();
