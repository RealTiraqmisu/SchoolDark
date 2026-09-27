/* ======================================================================
 *  parent-nav.js — navbar บนของพอร์ทัลผู้ปกครอง (parent/) + window.ParentUI
 *
 *  ทำงานทันทีตอนโหลด (guard เรื่อง session ต้องเกิดก่อนหน้าอื่นเรนเดอร์)
 *  1) หาไฟล์ปัจจุบัน
 *  2) ถ้าไม่ใช่ login.html และยังไม่ login -> เด้งไป login.html ทันที
 *  3) เรนเดอร์ navbar เข้า #parent-nav ถ้ามี element นี้ในหน้า
 *
 *  window.ParentUI ถูก export เสมอไม่ว่าจะ redirect หรือไม่ เพราะบางหน้า
 *  (เช่น login.html) ต้องใช้ utility พวกนี้โดยไม่มี #parent-nav
 * ====================================================================== */

(function () {
  'use strict';

  var PARENT_PAGES = [
    { file: 'index.html', label: 'หน้าหลัก', icon: 'house' },
    { file: 'timetable.html', label: 'ตารางเรียน', icon: 'calendar-clock' },
    { file: 'calendar.html', label: 'ปฏิทิน', icon: 'calendar-days' },
    { file: 'reports.html', label: 'รายงาน', icon: 'file-bar-chart' },
    { id: 'services', label: 'บริการอื่น ๆ', icon: 'layout-grid', children: [
      { file: 'leave.html', alsoActive: ['leave-history.html'], label: 'แจ้งลาเรียน', icon: 'file-pen-line', desc: 'แจ้งลาเรียนแทนบุตรและดูประวัติคำขอลา' },
      { file: 'sdq.html', label: 'แบบประเมิน SDQ', icon: 'clipboard-list', desc: 'แบบประเมินพฤติกรรมเด็ก ฉบับผู้ปกครองและนักเรียน' },
      { file: 'home-visit.html', label: 'การเยี่ยมบ้าน', icon: 'house-heart', desc: 'ข้อมูลการเยี่ยมบ้านนักเรียนโดยครูที่ปรึกษา' }
    ] }
  ];

  var THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  var THAI_MONTHS_LONG = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  var THAI_WEEKDAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  /* ---------------------------------------------------------------------
   * ParentUI — utility ที่ใช้ได้ทุกหน้า (แม้ไม่มี #parent-nav)
   * ------------------------------------------------------------------- */

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseIso(iso) {
    var p = iso.split('-');
    return { y: parseInt(p[0], 10), m: parseInt(p[1], 10), d: parseInt(p[2], 10) };
  }

  function fmtDate(iso, withWeekday) {
    if (!iso) return '';
    var p = parseIso(iso);
    var out = p.d + ' ' + THAI_MONTHS_SHORT[p.m - 1] + ' ' + (p.y + 543);
    if (withWeekday === true) {
      var dow = new Date(p.y, p.m - 1, p.d).getDay();
      out = THAI_WEEKDAYS_SHORT[dow] + ' ' + out;
    }
    return out;
  }

  function fmtDateLong(iso) {
    if (!iso) return '';
    var p = parseIso(iso);
    return p.d + ' ' + THAI_MONTHS_LONG[p.m - 1] + ' ' + (p.y + 543);
  }

  function toast(msg, type) {
    type = type || 'success';
    var bg = type === 'error' ? 'bg-destructive' : (type === 'info' ? 'bg-info' : 'bg-success');
    var el = document.createElement('div');
    el.className = 'fixed bottom-4 right-4 z-50 ' + bg + ' text-white rounded-lg shadow-lg px-4 py-3 text-sm transition-opacity duration-300';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.style.opacity = '0';
    el.textContent = msg;
    // ถ้ามี <dialog> เปิดอยู่ (modal จาก createDialog/confirm) ให้แปะ toast ไว้ข้างในตัวที่เปิดล่าสุด
    // ไม่งั้น toast จะถูกบัง top layer ของ dialog
    var openDialogs = document.querySelectorAll('dialog[open]');
    var host = openDialogs.length ? openDialogs[openDialogs.length - 1] : document.body;
    host.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = '1'; });
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 3000);
  }

  /* ---------------------------------------------------------------------
   * createDialog / confirm — มาตรฐานกลางสำหรับ modal ทุกหน้าใน parent/
   * ใช้ <dialog> แทน div.fixed ที่เขียนเอง — ได้ focus trap, คืน focus,
   * และ Esc ปิดฟรีจากเบราว์เซอร์ ไม่ต้องเขียน keydown listener เอง
   * ------------------------------------------------------------------- */

  function createDialog(opts) {
    opts = opts || {};
    var dialog = document.createElement('dialog');
    if (opts.id) dialog.id = opts.id;
    dialog.className = 'p-0 border-0 rounded-xl shadow-lg bg-card text-card-foreground backdrop:bg-black/40' +
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

    // fallback: เบราว์เซอร์ที่ไม่รู้จัก closedby (เช่น Safari ปัจจุบัน) จะไม่ปิดเองตอนคลิก backdrop
    // ต้องเช็คเองว่าคลิกอยู่นอกกรอบเนื้อหาจริงหรือไม่ (คลิกที่ <dialog> เองเท่ากับคลิก backdrop)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', function (e) {
        if (e.target !== dialog) return;
        var r = dialog.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) dialog.close();
      });
    }

    dialog.showModal();
    return dialog;
  }

  function confirmDialog(message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var msgId = 'confirm-msg-' + Math.random().toString(36).slice(2, 9);
      var confirmCls = opts.danger
        ? 'bg-destructive hover:bg-destructive/90 text-white'
        : 'bg-primary hover:bg-primary-hover text-primary-foreground';
      var html =
        '<form method="dialog" class="p-5 w-[min(28rem,calc(100vw-2rem))]">' +
          '<p id="' + msgId + '" class="text-sm text-card-foreground mb-4">' + escapeHtml(message) + '</p>' +
          '<div class="flex items-center justify-end gap-2">' +
            '<button type="submit" value="cancel" autofocus class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium">ยกเลิก</button>' +
            '<button type="submit" value="confirm" class="' + confirmCls + ' rounded-lg px-4 py-2 text-sm font-medium">' + escapeHtml(opts.confirmText || 'ยืนยัน') + '</button>' +
          '</div>' +
        '</form>';
      var dialog = createDialog({ labelledBy: msgId, className: 'max-w-md', html: html });
      dialog.addEventListener('close', function () {
        resolve(dialog.returnValue === 'confirm');
      }, { once: true });
    });
  }

  function statusBadge(status) {
    var label = status;
    if (window.ParentStore && window.ParentStore.STATUS_LABEL && window.ParentStore.STATUS_LABEL[status]) {
      label = window.ParentStore.STATUS_LABEL[status];
    }
    var cls = 'bg-muted text-muted-foreground';
    if (status === 'อนุมัติ' || status === 'present') cls = 'bg-success/10 text-success';
    else if (status === 'รอตรวจสอบ' || status === 'late') cls = 'bg-warning/10 text-warning';
    else if (status === 'ไม่อนุมัติ' || status === 'absent') cls = 'bg-destructive/10 text-destructive';
    else if (status === 'ยกเลิก') cls = 'bg-muted text-muted-foreground';
    else if (status === 'leave') cls = 'bg-info/10 text-info';
    return '<span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + cls + '">' + escapeHtml(label) + '</span>';
  }

  function initials(name) {
    if (!name) return '';
    var s = String(name).trim();
    return s.slice(0, 2);
  }

  function schoolName() {
    try {
      return (localStorage.getItem('sd_school_name_th') || '').trim() || 'โรงเรียนสาธิต SchoolDark';
    } catch (e) {
      return 'โรงเรียนสาธิต SchoolDark';
    }
  }

  window.ParentUI = {
    escapeHtml: escapeHtml,
    fmtDate: fmtDate,
    fmtDateLong: fmtDateLong,
    toast: toast,
    createDialog: createDialog,
    confirm: confirmDialog,
    statusBadge: statusBadge,
    initials: initials,
    schoolName: schoolName,
    SERVICES: (PARENT_PAGES.filter(function (p) { return p.id === 'services'; })[0] || {}).children || []
  };

  /* ---------------------------------------------------------------------
   * Session guard — ต้องเกิดก่อนอย่างอื่นทั้งหมด
   * ------------------------------------------------------------------- */

  var currentFile = location.pathname.split('/').pop() || 'index.html';

  if (currentFile !== 'login.html') {
    var hasSession = false;
    try { hasSession = !!(window.ParentStore && window.ParentStore.getSession()); } catch (e) { hasSession = false; }
    if (!hasSession) {
      location.replace('login.html');
      return; // หยุดการทำงานที่เหลือของไฟล์นี้ทันที — หน้าใหม่กำลังจะถูกโหลดแทน (ถูกต้องเพราะทั้งไฟล์อยู่ใน IIFE)
    }
  }

  /* ---------------------------------------------------------------------
   * ปุ่มย้อนกลับ: <a data-back href="fallback.html"> — ใช้ history.back() เมื่อแท็บนี้เคยเปิด
   * หน้าอื่นใน parent/ มาก่อน ไม่งั้น fallback ไปตาม href เดิม (กันเคสเปิดแท็บใหม่/deep-link ตรง ๆ)
   * ------------------------------------------------------------------- */

  var cameFromParentPage = false;
  try {
    cameFromParentPage = sessionStorage.getItem('parent_nav_seen') === '1';
    sessionStorage.setItem('parent_nav_seen', '1');
  } catch (e) {}

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-back]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (cameFromParentPage && history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });

  // ย้อนกลับมาจาก bfcache = หน้าค้างสถานะเก่า (เช่น เปลี่ยนบุตร/ยกเลิกคำขอลาในหน้าถัดไป) → โหลดใหม่
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) location.reload();
  });

  /* ---------------------------------------------------------------------
   * Navbar rendering
   * ------------------------------------------------------------------- */

  function childAvatarHtml(child, extraClass) {
    return '<span class="' + (extraClass || '') + ' inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold">' +
      escapeHtml(initials(child.nickname || child.firstName)) + '</span>';
  }

  function buildChildSwitcherHtml(children, activeChild) {
    if (!children.length) return '';
    if (children.length === 1) {
      var only = children[0];
      return '<div class="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary/60">' +
        childAvatarHtml(only) +
        '<span class="hidden sm:flex flex-col leading-tight text-left">' +
        '<span class="text-sm font-medium text-card-foreground">' + escapeHtml(only.nickname) + '</span>' +
        '<span class="text-xs text-muted-foreground">' + escapeHtml(only.classroom) + '</span>' +
        '</span></div>';
    }

    var items = children.map(function (c) {
      var isActive = activeChild && c.id === activeChild.id;
      return '<button type="button" data-child-id="' + escapeHtml(c.id) + '" class="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary rounded-lg' +
        (isActive ? ' bg-secondary/70' : '') + '">' +
        childAvatarHtml(c) +
        '<span class="flex flex-col leading-tight">' +
        '<span class="text-sm font-medium text-card-foreground">' + escapeHtml(c.nickname) + '</span>' +
        '<span class="text-xs text-muted-foreground">' + escapeHtml(c.classroom) + '</span>' +
        '</span></button>';
    }).join('');

    return '<div class="relative" data-dropdown="child">' +
      '<button type="button" data-dropdown-toggle="child" aria-expanded="false" aria-haspopup="true" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary">' +
      childAvatarHtml(activeChild) +
      '<span class="hidden sm:flex flex-col leading-tight text-left">' +
      '<span class="text-sm font-medium text-card-foreground">' + escapeHtml(activeChild.nickname) + '</span>' +
      '<span class="text-xs text-muted-foreground">' + escapeHtml(activeChild.classroom) + '</span>' +
      '</span>' +
      '<i data-lucide="chevron-down" class="w-4 h-4 text-muted-foreground"></i>' +
      '</button>' +
      '<div data-dropdown-menu="child" class="hidden absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg p-1 z-50">' +
      items +
      '</div></div>';
  }

  function buildUserMenuHtml(parent) {
    var fullName = (parent.prefix || '') + (parent.firstName || '') + ' ' + (parent.lastName || '');
    var avatarHtml = parent.avatar
      ? '<img src="' + escapeHtml(parent.avatar) + '" alt="" class="w-full h-full object-cover">'
      : escapeHtml(initials(parent.firstName));
    return '<div class="relative" data-dropdown="user">' +
      '<button type="button" data-dropdown-toggle="user" aria-expanded="false" aria-haspopup="true" aria-label="บัญชีผู้ใช้" class="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold overflow-hidden">' +
      avatarHtml +
      '</button>' +
      '<div data-dropdown-menu="user" class="hidden absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-1 z-50">' +
      '<div class="px-3 py-2">' +
      '<div class="text-sm font-semibold text-card-foreground">' + escapeHtml(fullName) + '</div>' +
      '<div class="text-xs text-muted-foreground">' + escapeHtml(parent.relation || '') + '</div>' +
      '</div>' +
      '<div class="h-px bg-border my-1"></div>' +
      '<a href="profile.html" class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary text-card-foreground">' +
      '<i data-lucide="user" class="w-4 h-4"></i> โปรไฟล์</a>' +
      '<a href="settings.html" class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary text-card-foreground">' +
      '<i data-lucide="settings" class="w-4 h-4"></i> ตั้งค่าบัญชี</a>' +
      '<a href="../index.html" class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary text-card-foreground">' +
      '<i data-lucide="arrow-left-right" class="w-4 h-4"></i> กลับหน้ารวมระบบ (โปรโตไทป์)</a>' +
      '<div class="h-px bg-border my-1"></div>' +
      '<button type="button" data-action="logout" class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive text-left">' +
      '<i data-lucide="log-out" class="w-4 h-4"></i> ออกจากระบบ</button>' +
      '</div></div>';
  }

  function pageHref(p) {
    return p.file + (p.hash ? ('#' + p.hash) : '');
  }

  function matchesCurrentFile(c) {
    return c.file === currentFile || (c.alsoActive || []).indexOf(currentFile) !== -1;
  }

  function isItemActive(c) {
    if (!matchesCurrentFile(c)) return false;
    if (!c.hash) return true;
    return location.hash.replace('#', '') === c.hash;
  }

  function isGroupActive(group) {
    return group.children.some(function (c) { return matchesCurrentFile(c); });
  }

  function buildDesktopGroupHtml(group) {
    var active = isGroupActive(group);
    var cls = active
      ? 'bg-primary/10 text-primary font-semibold'
      : 'text-secondary-foreground hover:bg-secondary';
    var items = group.children.map(function (c) {
      var itemActive = isItemActive(c);
      return '<a href="' + pageHref(c) + '"' + (itemActive ? ' aria-current="page"' : '') + ' class="flex items-start gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary' + (itemActive ? ' bg-secondary/70' : '') + '">' +
        '<i data-lucide="' + c.icon + '" class="w-4 h-4 mt-0.5 text-primary"></i>' +
        '<span class="flex flex-col"><span class="text-card-foreground font-medium">' + escapeHtml(c.label) + '</span>' +
        (c.desc ? '<span class="text-xs text-muted-foreground">' + escapeHtml(c.desc) + '</span>' : '') +
        '</span></a>';
    }).join('');
    return '<div class="relative" data-dropdown="' + group.id + '">' +
      '<button type="button" data-dropdown-toggle="' + group.id + '" aria-expanded="false" aria-haspopup="true" class="rounded-lg px-3 py-2 text-sm flex items-center gap-2 ' + cls + '">' +
        '<i data-lucide="' + group.icon + '" class="w-4 h-4"></i><span>' + escapeHtml(group.label) + '</span>' +
        '<i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>' +
      '</button>' +
      '<div data-dropdown-menu="' + group.id + '" class="hidden absolute left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-1 z-50">' +
        items +
      '</div></div>';
  }

  function buildMobileGroupHtml(group) {
    var items = group.children.map(function (c) {
      var itemActive = isItemActive(c);
      var cls = itemActive ? 'bg-primary/10 text-primary font-semibold' : 'text-secondary-foreground hover:bg-secondary';
      return '<a href="' + pageHref(c) + '"' + (itemActive ? ' aria-current="page"' : '') + ' class="rounded-lg pl-7 pr-3 py-2 text-sm flex items-center gap-2 w-full ' + cls + '">' +
        '<i data-lucide="' + c.icon + '" class="w-4 h-4"></i><span>' + escapeHtml(c.label) + '</span></a>';
    }).join('');
    return '<div class="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">' + escapeHtml(group.label) + '</div>' + items;
  }

  function buildNavLinksHtml(vertical) {
    return PARENT_PAGES.map(function (p) {
      if (p.children) {
        return vertical ? buildMobileGroupHtml(p) : buildDesktopGroupHtml(p);
      }
      var active = p.file === currentFile;
      var cls = active
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-secondary-foreground hover:bg-secondary';
      var extra = vertical ? ' w-full' : '';
      return '<a href="' + pageHref(p) + '"' + (active ? ' aria-current="page"' : '') + ' class="rounded-lg px-3 py-2 text-sm flex items-center gap-2' + extra + ' ' + cls + '">' +
        '<i data-lucide="' + p.icon + '" class="w-4 h-4"></i><span>' + escapeHtml(p.label) + '</span></a>';
    }).join('');
  }

  function renderNavbar() {
    var mount = document.getElementById('parent-nav');
    if (!mount) return;

    var parent = window.ParentStore.getParent();
    var children = window.ParentStore.getChildren();
    var activeChild = window.ParentStore.getActiveChild();

    // skip link ต้องรู้ id ของ <main> ก่อนสร้าง navbar — ใส่ id/tabindex ให้ <main> ถ้ายังไม่มี
    var mainEl = document.querySelector('main');
    var mainId = (mainEl && mainEl.id) || 'main-content';
    if (mainEl) {
      mainEl.id = mainId;
      mainEl.setAttribute('tabindex', '-1');
    }

    var html =
      '<a href="#' + mainId + '" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-card text-primary px-3 py-2 rounded-lg shadow">ข้ามไปเนื้อหาหลัก</a>' +
      '<header class="sticky top-0 z-40 bg-card border-b border-border shadow-sm">' +
      '<div class="h-16 flex items-center">' +
      '<div class="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4 w-full">' +
        '<a href="index.html" class="flex items-center gap-3 shrink-0">' +
          '<span class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">' +
            '<i data-lucide="graduation-cap" class="w-5 h-5 text-white"></i>' +
          '</span>' +
          '<span class="hidden sm:flex flex-col leading-tight">' +
            '<span class="text-sm font-bold text-card-foreground">' + escapeHtml(schoolName()) + '</span>' +
            '<span class="text-xs text-muted-foreground">พอร์ทัลผู้ปกครอง</span>' +
          '</span>' +
        '</a>' +
        '<nav aria-label="เมนูหลัก" class="hidden md:flex items-center gap-1">' + buildNavLinksHtml(false) + '</nav>' +
        '<div class="flex items-center gap-2">' +
          buildChildSwitcherHtml(children, activeChild) +
          buildUserMenuHtml(parent) +
          '<button type="button" data-action="toggle-mobile-menu" aria-expanded="false" aria-controls="parent-mobile-menu" aria-label="เมนู" class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary text-card-foreground">' +
            '<i data-lucide="menu" class="w-5 h-5"></i>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '</div>' +
      '<nav id="parent-mobile-menu" aria-label="เมนูหลัก (มือถือ)" data-mobile-menu class="hidden md:hidden border-t border-border px-4 py-2 flex flex-col gap-1">' +
        buildNavLinksHtml(true) +
      '</nav>' +
      '</header>';

    mount.innerHTML = html;

    if (window.lucide) lucide.createIcons();

    bindNavbarEvents(mount);
  }

  function closeAllDropdowns(mount) {
    mount.querySelectorAll('[data-dropdown-menu]').forEach(function (el) {
      el.classList.add('hidden');
    });
    mount.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  function bindNavbarEvents(mount) {
    var mobileToggle = mount.querySelector('[data-action="toggle-mobile-menu"]');
    var mobileMenu = mount.querySelector('[data-mobile-menu]');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        mobileToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }

    mount.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var key = btn.getAttribute('data-dropdown-toggle');
        var menu = mount.querySelector('[data-dropdown-menu="' + key + '"]');
        if (!menu) return;
        var wasHidden = menu.classList.contains('hidden');
        closeAllDropdowns(mount);
        if (wasHidden) {
          menu.classList.remove('hidden');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    mount.querySelectorAll('[data-child-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-child-id');
        window.ParentStore.setActiveChild(id);
        location.reload();
      });
    });

    var logoutBtn = mount.querySelector('[data-action="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        window.ParentStore.logout();
        location.href = 'login.html';
      });
    }

    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-dropdown]')) return;
      closeAllDropdowns(mount);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeAllDropdowns(mount);
    });
  }

  /* ---------------------------------------------------------------------
   * Demo panel — เลือกวันที่จำลองสำหรับ demo/test (parent_demo_today)
   * ไม่ใช้กับ login.html (ยังไม่มี session/ข้อมูลบุตรให้อ้างอิง)
   * ------------------------------------------------------------------- */

  var DEMO_SHORTCUTS = [
    { label: 'วันเปิดเทอม 1', date: '2025-05-19' },
    { label: 'สัปดาห์สอบกลางภาค', date: '2025-08-25' },
    { label: 'วันเริ่มเทอม 2', date: '2025-11-03' }
  ];

  function demoPanelOpen() {
    try { return sessionStorage.getItem('parent_demo_panel_open') === '1'; } catch (e) { return false; }
  }

  function setDemoPanelOpen(open) {
    try { sessionStorage.setItem('parent_demo_panel_open', open ? '1' : '0'); } catch (e) {}
  }

  function renderDemoPanel() {
    if (currentFile === 'login.html') return;
    if (!window.ParentStore) return;
    if (document.getElementById('demo-panel')) return;

    var today = window.ParentStore.today();
    var realToday = window.ParentStore.realToday();
    var demoOverride = window.ParentStore.getDemoToday();
    var isOverridden = !!demoOverride;
    var open = demoPanelOpen();

    var toneCls = isOverridden ? 'border-warning text-warning' : 'border-border text-card-foreground';
    var sourceLabel = isOverridden
      ? 'ตั้งเอง'
      : (today === realToday ? 'วันจริง' : 'ค่าเริ่มต้น (วันจริงอยู่นอกปีการศึกษา)');

    var shortcutsHtml = DEMO_SHORTCUTS.map(function (s) {
      return '<button type="button" data-demo-set="' + s.date + '" class="rounded-lg bg-secondary hover:bg-secondary/70 text-secondary-foreground text-xs px-2 py-1.5 text-left">' +
        escapeHtml(s.label) + '</button>';
    }).join('') +
      '<button type="button" data-demo-set="' + realToday + '" class="rounded-lg bg-secondary hover:bg-secondary/70 text-secondary-foreground text-xs px-2 py-1.5 text-left">' +
      'วันจริง (' + escapeHtml(fmtDate(realToday)) + ')</button>';

    var el = document.createElement('div');
    el.id = 'demo-panel';
    el.className = 'fixed bottom-4 left-4 z-40';
    el.innerHTML =
      '<button type="button" data-demo-toggle class="flex items-center gap-2 rounded-full bg-card border shadow-lg px-3 py-2 text-xs font-medium ' + toneCls + (open ? ' hidden' : '') + '">' +
        '<i data-lucide="flask-conical" class="w-3.5 h-3.5"></i>' +
        '<span>Demo · ' + escapeHtml(fmtDate(today)) + '</span>' +
      '</button>' +
      '<div data-demo-card class="bg-card rounded-xl border border-border shadow-lg p-4 w-72' + (open ? '' : ' hidden') + '">' +
        '<div class="flex items-center justify-between mb-2">' +
          '<span class="text-sm font-semibold text-card-foreground">โหมดทดสอบ: วันที่จำลอง</span>' +
          '<button type="button" data-demo-close aria-label="ปิด" class="text-muted-foreground hover:text-card-foreground"><i data-lucide="x" class="w-4 h-4"></i></button>' +
        '</div>' +
        '<div class="text-sm text-card-foreground">วันที่ที่ระบบใช้: ' + escapeHtml(fmtDate(today, true)) + '</div>' +
        '<div class="text-xs text-muted-foreground mb-3">ที่มา: ' + escapeHtml(sourceLabel) + '</div>' +
        '<div class="flex items-center gap-2 mb-3">' +
          '<input type="date" data-demo-input value="' + escapeHtml(today) + '" class="flex-1 rounded-lg border border-border px-2 py-1.5 text-sm">' +
          '<button type="button" data-demo-apply class="rounded-lg bg-primary text-primary-foreground text-sm px-3 py-1.5">ใช้วันนี้</button>' +
        '</div>' +
        '<div class="grid grid-cols-1 gap-1 mb-2">' + shortcutsHtml + '</div>' +
        '<button type="button" data-demo-clear class="text-xs text-muted-foreground hover:text-card-foreground underline">ล้างค่า (กลับค่าเริ่มต้น)</button>' +
      '</div>';

    document.body.appendChild(el);
    if (window.lucide) lucide.createIcons();
    bindDemoPanelEvents(el);
  }

  function bindDemoPanelEvents(el) {
    var toggleBtn = el.querySelector('[data-demo-toggle]');
    var closeBtn = el.querySelector('[data-demo-close]');
    var card = el.querySelector('[data-demo-card]');
    var input = el.querySelector('[data-demo-input]');
    var applyBtn = el.querySelector('[data-demo-apply]');
    var clearBtn = el.querySelector('[data-demo-clear]');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        toggleBtn.classList.add('hidden');
        card.classList.remove('hidden');
        setDemoPanelOpen(true);
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        card.classList.add('hidden');
        toggleBtn.classList.remove('hidden');
        setDemoPanelOpen(false);
      });
    }
    if (applyBtn && input) {
      applyBtn.addEventListener('click', function () {
        if (!input.value) return;
        window.ParentStore.setDemoToday(input.value);
        location.reload();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        window.ParentStore.setDemoToday(null);
        location.reload();
      });
    }
    el.querySelectorAll('[data-demo-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.ParentStore.setDemoToday(btn.getAttribute('data-demo-set'));
        location.reload();
      });
    });
  }

  function init() {
    renderNavbar();
    renderDemoPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
