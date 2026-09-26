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
      '  body.export-printing #export-modal { position: static !important; background: none !important; padding: 0 !important; }' +
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
    return clone;
  }

  function open(opts) {
    opts = opts || {};
    var node = prepareNode(opts.node);
    if (!node) {
      if (window.ParentUI) ParentUI.toast('ไม่พบเนื้อหาที่จะพิมพ์', 'error');
      return;
    }
    var orientation = opts.orientation === 'landscape' ? 'landscape' : 'portrait';
    var filename = opts.filename || 'เอกสาร';
    var esc = (window.ParentUI && ParentUI.escapeHtml) || function (s) { return s; };

    ensurePrintStyle();
    closeExisting();

    var paperWidth = orientation === 'landscape' ? '1123px' : '794px';

    var overlay = document.createElement('div');
    overlay.id = 'export-modal';
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center';

    overlay.innerHTML =
      '<div data-export-close class="export-chrome absolute inset-0 bg-black/40"></div>' +
      '<div class="relative bg-card rounded-xl shadow-lg max-w-5xl w-[calc(100%-2rem)] max-h-[90vh] flex flex-col">' +
        '<div class="export-chrome flex items-center justify-between px-5 py-3 border-b border-border">' +
          '<span class="font-semibold text-card-foreground">ตัวอย่างก่อนพิมพ์ / ดาวน์โหลด</span>' +
          '<button type="button" data-export-close class="text-muted-foreground hover:text-card-foreground"><i data-lucide="x" class="w-5 h-5"></i></button>' +
        '</div>' +
        '<div class="export-chrome flex-1 overflow-auto bg-muted p-4">' +
          '<div id="export-paper" class="bg-white shadow mx-auto p-8" style="width:' + paperWidth + '">' +
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
          '<button type="button" data-export-download class="bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">' +
            '<i data-lucide="download" class="w-4 h-4"></i> ดาวน์โหลด PDF</button>' +
          '<button type="button" data-export-print class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">' +
            '<i data-lucide="printer" class="w-4 h-4"></i> พิมพ์</button>' +
          '<button type="button" data-export-close class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium">ปิด</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    overlay.querySelector('#export-content').appendChild(node);

    if (window.lucide) lucide.createIcons();

    function close() {
      document.removeEventListener('keydown', onKeydown);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    function onKeydown(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKeydown);

    overlay.querySelectorAll('[data-export-close]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    overlay.querySelector('[data-export-print]').addEventListener('click', function () {
      ensurePageStyle(orientation);
      document.body.classList.add('export-printing');
      window.addEventListener('afterprint', function onAfterPrint() {
        document.body.classList.remove('export-printing');
        window.removeEventListener('afterprint', onAfterPrint);
      });
      window.print();
    });

    overlay.querySelector('[data-export-download]').addEventListener('click', function () {
      var btn = overlay.querySelector('[data-export-download]');
      var originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> กำลังสร้างไฟล์…';
      if (window.lucide) lucide.createIcons();

      loadHtml2Pdf().then(function () {
        return window.html2pdf().set({
          margin: 10,
          filename: filename + '.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 2, windowWidth: 1200, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: orientation }
        }).from(overlay.querySelector('#export-paper')).save();
      }).then(function () {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        if (window.lucide) lucide.createIcons();
      }).catch(function () {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        if (window.lucide) lucide.createIcons();
        if (window.ParentUI) ParentUI.toast('ดาวน์โหลดไม่สำเร็จ ลองใช้ปุ่มพิมพ์ แล้วเลือก Save as PDF', 'error');
      });
    });
  }

  function closeExisting() {
    var existing = document.getElementById('export-modal');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  return { open: open };
})();
