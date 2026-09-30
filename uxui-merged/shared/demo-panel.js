/* ======================================================================
 *  demo-panel.js — แผงสาธิตลอย (ลากได้ / หุบได้) สำหรับหน้าฝั่งเจ้าหน้าที่
 *
 *  หน้าที่:
 *    1) สลับ "บทบาทจำลอง" (actor) — admin / ผู้อำนวยการ / เจ้าหน้าที่บุคคล /
 *       เจ้าหน้าที่ทะเบียน / ครู — มีผลกับเมนู sidebar และป้ายผู้ใช้ท้าย sidebar
 *       เท่านั้น (ยังไม่ผูกกับ logic ในหน้า) ข้อมูล actor อยู่ที่ CrossNav.ACTORS
 *    2) รวมปุ่ม "กรอกข้อมูลตัวอย่าง" ของแต่ละหน้าไว้ที่เดียว
 *
 *  โหลดโดย shared/cross-nav.js อัตโนมัติ (ทุกหน้าที่โหลด cross-nav ยกเว้นหน้า hub)
 *  ไม่พึ่ง Tailwind/Lucide — สไตล์อยู่ในไฟล์นี้ (คลาสขึ้นต้น xdemo-)
 *
 *  Storage:
 *    localStorage   xdemo_actor       key ของ actor ที่เลือก (เขียนผ่าน CrossNav.setActor)
 *    localStorage   xdemo_panel_pos   ตำแหน่งที่ลากไว้ {x,y}
 *    sessionStorage xdemo_panel_open  '1' = กางแผง / '0' = หุบเป็นปุ่ม
 *
 *  API สำหรับสคริปต์ของหน้า (window.XDemo นิยามใน cross-nav.js):
 *    window.XDemo?.register({
 *      id: 'unique-id',                 // id ซ้ำ = แทนตัวเดิม
 *      label: '⚡ กรอกข้อมูลตัวอย่าง',   // ข้อความบนปุ่ม
 *      run: function () { ... },        // ทำงานเมื่อกดปุ่ม
 *      when: function () { return true; } // (ไม่บังคับ) คืน false = ซ่อนปุ่มตอนนั้น
 *    });
 *    window.XDemo?.refresh();           // เรียกเมื่อเงื่อนไข when() เปลี่ยน → แผงวาดใหม่
 * ====================================================================== */
(function () {
  'use strict';

  if (!window.CrossNav || document.getElementById('xdemo-panel')) return;

  var OPEN_KEY = 'xdemo_panel_open';
  var POS_KEY = 'xdemo_panel_pos';
  var DRAG_THRESHOLD = 4;

  function esc(t) { return window.CrossNav.escapeHtml(t); }

  function readOpen() {
    try { return sessionStorage.getItem(OPEN_KEY) === '1'; } catch (e) { return false; }
  }
  function writeOpen(v) {
    try { sessionStorage.setItem(OPEN_KEY, v ? '1' : '0'); } catch (e) {}
  }
  function readPos() {
    try {
      var p = JSON.parse(localStorage.getItem(POS_KEY));
      if (p && typeof p.x === 'number' && typeof p.y === 'number') return p;
    } catch (e) {}
    return null;
  }
  function writePos(p) {
    try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch (e) {}
  }

  var CSS =
    '#xdemo-panel{position:fixed;z-index:950;right:16px;bottom:16px;font-family:inherit;font-size:13px;color:#0f172a;line-height:1.4}' +
    '#xdemo-panel *{box-sizing:border-box;font-family:inherit}' +
    '.xdemo-pill{display:inline-flex;align-items:center;gap:4px;padding:8px 14px;background:#ffffff;color:#0f172a;border:1px solid #e2e8f0;border-radius:999px;box-shadow:0 10px 30px rgba(15,23,42,.15);font-size:13px;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none}' +
    '.xdemo-pill:hover{border-color:#3e63dd}' +
    '.xdemo-card{width:280px;max-width:calc(100vw - 24px);background:#ffffff;color:#0f172a;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 10px 30px rgba(15,23,42,.15);overflow:hidden}' +
    '.xdemo-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #e2e8f0;cursor:move;touch-action:none;user-select:none;-webkit-user-select:none}' +
    '.xdemo-title{font-weight:600;font-size:13px}' +
    '.xdemo-collapse{width:26px;height:26px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;color:#64748b;cursor:pointer;font-size:14px;line-height:1;padding:0}' +
    '.xdemo-collapse:hover{color:#0f172a;border-color:#3e63dd}' +
    '.xdemo-body{padding:10px 12px 12px;max-height:calc(100vh - 100px);overflow-y:auto}' +
    '.xdemo-section{margin-top:10px}' +
    '.xdemo-section:first-child{margin-top:0}' +
    '.xdemo-label{margin:0 0 6px;font-size:11px;font-weight:600;color:#64748b;letter-spacing:.02em}' +
    '.xdemo-actors{display:flex;flex-direction:column;gap:4px}' +
    '.xdemo-actor{display:flex;align-items:center;gap:8px;width:100%;padding:6px 8px;background:#ffffff;color:#0f172a;border:1px solid #e2e8f0;border-radius:10px;cursor:pointer;text-align:left;font-size:13px}' +
    '.xdemo-actor:hover{border-color:#3e63dd}' +
    '.xdemo-actor[aria-pressed="true"]{border-color:#3e63dd;background:rgba(62,99,221,.08)}' +
    '.xdemo-avatar{flex:none;width:28px;height:28px;border-radius:50%;background:#3e63dd;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600}' +
    '.xdemo-actor-info{display:flex;flex-direction:column;min-width:0}' +
    '.xdemo-actor-name{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.xdemo-actor-role{font-size:11px;color:#64748b}' +
    '.xdemo-warn{margin:8px 0 0;font-size:11px;color:#b45309}' +
    '.xdemo-tools{display:flex;flex-direction:column;gap:6px}' +
    '.xdemo-tool{width:100%;padding:8px 10px;background:#3e63dd;color:#ffffff;border:0;border-radius:10px;cursor:pointer;font-size:13px;text-align:left}' +
    '.xdemo-tool:hover{filter:brightness(1.08)}' +
    '.xdemo-muted{margin:0;font-size:12px;color:#64748b}';

  var panel = null;
  var open = readOpen();
  var justDragged = false;

  function hasActiveMenu() {
    return !!document.querySelector('.sidebar a.menu-item.active, .sidebar a.submenu-link.active, .sidebar a.submenu-item.active');
  }

  function render() {
    if (!panel) return;
    var cn = window.CrossNav;
    var actor = cn.currentActor();
    if (!open) {
      panel.innerHTML = '<button type="button" class="xdemo-pill" aria-label="เปิดแผงสาธิต">🧪 สาธิต · ' + esc(actor.role) + '</button>';
      clampToViewport();
      return;
    }
    var actions = (window.XDemo && window.XDemo.actions || []).filter(function (a) {
      try { return !a.when || a.when(); } catch (e) { return false; }
    });
    var html =
      '<div class="xdemo-card" role="region" aria-label="แผงสาธิต">' +
      '<div class="xdemo-head"><span class="xdemo-title">แผงสาธิต</span>' +
      '<button type="button" class="xdemo-collapse" aria-label="หุบแผงสาธิต">–</button></div>' +
      '<div class="xdemo-body">' +
      '<div class="xdemo-section"><p class="xdemo-label">สวมบทบาทเป็น</p><div class="xdemo-actors">' +
      cn.ACTORS.map(function (a) {
        return '<button type="button" class="xdemo-actor" data-actor="' + esc(a.key) + '" aria-pressed="' + (a.key === actor.key ? 'true' : 'false') + '">' +
          '<span class="xdemo-avatar">' + esc(a.avatar) + '</span>' +
          '<span class="xdemo-actor-info"><span class="xdemo-actor-name">' + esc(a.name) + '</span>' +
          '<span class="xdemo-actor-role">' + esc(a.role) + '</span></span></button>';
      }).join('') +
      '</div>' +
      (hasActiveMenu() ? '' : '<p class="xdemo-warn">บทบาทนี้ปกติไม่มีเมนูของหน้านี้</p>') +
      '</div>' +
      '<div class="xdemo-section"><p class="xdemo-label">เครื่องมือของหน้านี้</p>' +
      (actions.length
        ? '<div class="xdemo-tools">' + actions.map(function (a, i) {
            return '<button type="button" class="xdemo-tool" data-action="' + i + '">' + esc(a.label) + '</button>';
          }).join('') + '</div>'
        : '<p class="xdemo-muted">หน้านี้ไม่มีเครื่องมือกรอกข้อมูล</p>') +
      '</div></div></div>';
    panel.innerHTML = html;
    panel._actions = actions;
    clampToViewport();
  }

  function setOpen(v) {
    open = v;
    writeOpen(v);
    render();
  }

  // ---------------------------------------------------------------
  // ตำแหน่ง / ลาก
  // ---------------------------------------------------------------
  var dragged = false; // เคยสลับเป็น left/top แล้วหรือยัง
  function applyLeftTop(x, y) {
    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    dragged = true;
  }
  function clamp(x, y) {
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var maxX = Math.max(0, window.innerWidth - w);
    var maxY = Math.max(0, window.innerHeight - h);
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  }
  function clampToViewport() {
    if (!panel || !dragged) return;
    var r = panel.getBoundingClientRect();
    var p = clamp(r.left, r.top);
    applyLeftTop(p.x, p.y);
  }

  var drag = null;
  function onPointerDown(e) {
    var handle = e.target.closest('.xdemo-pill, .xdemo-head');
    if (!handle || !panel.contains(handle)) return;
    if (e.button !== undefined && e.button !== 0) return;
    var btn = e.target.closest('button');
    if (btn && btn.classList.contains('xdemo-collapse')) return; // ปุ่มในหัวแผงต้องกดได้ ไม่เริ่มลาก
    var r = panel.getBoundingClientRect();
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, moved: false, handle: handle };
    try { handle.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.sqrt(dx * dx + dy * dy) <= DRAG_THRESHOLD) return;
    drag.moved = true;
    var p = clamp(drag.ox + dx, drag.oy + dy);
    applyLeftTop(p.x, p.y);
    e.preventDefault();
  }
  function onPointerUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag;
    drag = null;
    try { d.handle.releasePointerCapture(e.pointerId); } catch (err) {}
    if (d.moved) {
      var r = panel.getBoundingClientRect();
      writePos({ x: Math.round(r.left), y: Math.round(r.top) });
      // กัน click ที่เบราว์เซอร์ยิงต่อจากการลาก (บนปุ่ม pill)
      justDragged = true;
      setTimeout(function () { justDragged = false; }, 0);
    }
  }

  function onClick(e) {
    if (justDragged) { e.preventDefault(); e.stopPropagation(); return; }
    var t = e.target;
    if (!t.closest) return;
    if (t.closest('.xdemo-pill')) { setOpen(true); return; }
    if (t.closest('.xdemo-collapse')) { setOpen(false); return; }
    var actorBtn = t.closest('.xdemo-actor');
    if (actorBtn) {
      var key = actorBtn.getAttribute('data-actor');
      if (key !== window.CrossNav.currentActor().key) window.CrossNav.setActor(key);
      return;
    }
    var toolBtn = t.closest('.xdemo-tool');
    if (toolBtn && panel._actions) {
      var a = panel._actions[parseInt(toolBtn.getAttribute('data-action'), 10)];
      if (a && typeof a.run === 'function') a.run();
    }
  }

  function init() {
    if (document.getElementById('xdemo-panel')) return;
    if (!document.getElementById('xdemo-style')) {
      var style = document.createElement('style');
      style.id = 'xdemo-style';
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    panel = document.createElement('div');
    panel.id = 'xdemo-panel';
    document.body.appendChild(panel);

    panel.addEventListener('pointerdown', onPointerDown);
    panel.addEventListener('pointermove', onPointerMove);
    panel.addEventListener('pointerup', onPointerUp);
    panel.addEventListener('pointercancel', onPointerUp);
    panel.addEventListener('click', onClick, true);

    var saved = readPos();
    render();
    if (saved) {
      var p = clamp(saved.x, saved.y);
      applyLeftTop(p.x, p.y);
    }

    document.addEventListener('xdemo:change', render);
    window.addEventListener('resize', clampToViewport);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
