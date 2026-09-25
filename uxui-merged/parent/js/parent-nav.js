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
      { file: 'leave.html', label: 'แจ้งลาเรียน', icon: 'file-pen-line', desc: 'แจ้งลาเรียนแทนบุตรและดูประวัติคำขอลา' },
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
    el.style.opacity = '0';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = '1'; });
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 3000);
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
      '<button type="button" data-dropdown-toggle="child" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary">' +
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
    return '<div class="relative" data-dropdown="user">' +
      '<button type="button" data-dropdown-toggle="user" class="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">' +
      escapeHtml(initials(parent.firstName)) +
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

  function isItemActive(c) {
    if (c.file !== currentFile) return false;
    if (!c.hash) return true;
    return location.hash.replace('#', '') === c.hash;
  }

  function isGroupActive(group) {
    return group.children.some(function (c) { return c.file === currentFile; });
  }

  function buildDesktopGroupHtml(group) {
    var active = isGroupActive(group);
    var cls = active
      ? 'bg-primary/10 text-primary font-semibold'
      : 'text-secondary-foreground hover:bg-secondary';
    var items = group.children.map(function (c) {
      var itemActive = isItemActive(c);
      return '<a href="' + pageHref(c) + '" class="flex items-start gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary' + (itemActive ? ' bg-secondary/70' : '') + '">' +
        '<i data-lucide="' + c.icon + '" class="w-4 h-4 mt-0.5 text-primary"></i>' +
        '<span class="flex flex-col"><span class="text-card-foreground font-medium">' + escapeHtml(c.label) + '</span>' +
        (c.desc ? '<span class="text-xs text-muted-foreground">' + escapeHtml(c.desc) + '</span>' : '') +
        '</span></a>';
    }).join('');
    return '<div class="relative" data-dropdown="' + group.id + '">' +
      '<button type="button" data-dropdown-toggle="' + group.id + '" class="rounded-lg px-3 py-2 text-sm flex items-center gap-2 ' + cls + '">' +
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
      return '<a href="' + pageHref(c) + '" class="rounded-lg pl-7 pr-3 py-2 text-sm flex items-center gap-2 w-full ' + cls + '">' +
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
      return '<a href="' + pageHref(p) + '" class="rounded-lg px-3 py-2 text-sm flex items-center gap-2' + extra + ' ' + cls + '">' +
        '<i data-lucide="' + p.icon + '" class="w-4 h-4"></i><span>' + escapeHtml(p.label) + '</span></a>';
    }).join('');
  }

  function renderNavbar() {
    var mount = document.getElementById('parent-nav');
    if (!mount) return;

    var parent = window.ParentStore.getParent();
    var children = window.ParentStore.getChildren();
    var activeChild = window.ParentStore.getActiveChild();

    var html =
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
        '<nav class="hidden md:flex items-center gap-1">' + buildNavLinksHtml(false) + '</nav>' +
        '<div class="flex items-center gap-2">' +
          buildChildSwitcherHtml(children, activeChild) +
          buildUserMenuHtml(parent) +
          '<button type="button" data-action="toggle-mobile-menu" class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary text-card-foreground">' +
            '<i data-lucide="menu" class="w-5 h-5"></i>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '</div>' +
      '<div data-mobile-menu class="hidden md:hidden border-t border-border px-4 py-2 flex flex-col gap-1">' +
        buildNavLinksHtml(true) +
      '</div>' +
      '</header>';

    mount.innerHTML = html;

    if (window.lucide) lucide.createIcons();

    bindNavbarEvents(mount);
  }

  function closeAllDropdowns(mount) {
    mount.querySelectorAll('[data-dropdown-menu]').forEach(function (el) {
      el.classList.add('hidden');
    });
  }

  function bindNavbarEvents(mount) {
    var mobileToggle = mount.querySelector('[data-action="toggle-mobile-menu"]');
    var mobileMenu = mount.querySelector('[data-mobile-menu]');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
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
        if (wasHidden) menu.classList.remove('hidden');
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

  function init() {
    renderNavbar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
