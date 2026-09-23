/* ======================================================================
 *  cross-nav.js — เมนูรวมของโปรโตไทป์ทั้ง 2 ระบบในโฟลเดอร์ uxui-merged
 *
 *  ไฟล์นี้คือ "แหล่งข้อมูลเมนูจุดเดียว" ของทั้งโปรเจกต์
 *  เพิ่ม/ลบ/เปลี่ยนชื่อหน้าใด ๆ ต้องมาแก้ที่ NAV_SYSTEMS ด้านล่างนี้ที่เดียว
 *  แล้วทุกหน้าจะอัปเดตตามเอง (หน้า hub, sidebar ฝั่ง schooldark, header ฝั่ง admission)
 *
 *  วิธีใช้ในหน้าเว็บ:
 *    ฝั่ง schooldark  →  <li id="cross-nav-sidebar"></li>  ท้าย <ul class="sidebar-menu">
 *    ฝั่ง admission   →  <span id="cross-nav-topbar"></span>  ใน <header>
 *    หน้า hub (root)  →  <div id="cross-nav-hub"></div>
 *  แล้วตามด้วย <script src="../shared/cross-nav.js"></script> (หน้า hub ใช้ "shared/cross-nav.js")
 *
 *  ทั้ง 2 ระบบยังคงดีไซน์ของตัวเองไว้ (schooldark = custom CSS ธีมมืด/สว่าง,
 *  admission = Tailwind ธีมขาว) ตัว render จึงแยกกันคนละชุด ไม่ยัด CSS ข้ามฝั่ง
 * ====================================================================== */

(function () {
  'use strict';

  // --- แหล่งข้อมูลเมนู: path อ้างจาก root ของ uxui-merged เสมอ --------------
  const NAV_SYSTEMS = [
    {
      id: 'schooldark',
      label: 'บุคลากร & การลา',
      items: [
        { label: 'แดชบอร์ด / บุคลากร / ตั้งค่า', href: 'schooldark/app.html' },
        { label: 'บัตรขออนุญาต & การลาเรียน', href: 'schooldark/leave-features.html' },
      ],
    },
    {
      id: 'admission',
      label: 'รับสมัคร & ทะเบียนนักเรียน',
      items: [
        { label: 'บอร์ดรับสมัคร', href: 'admission/index.html' },
        { label: 'ข้อมูลนักเรียน', href: 'admission/students.html' },
        { label: 'ตั้งค่าฟอร์มรับสมัคร', href: 'admission/settings.html' },
        { label: 'ตั้งค่าแผนการเรียน', href: 'admission/course_settings.html' },
        { label: 'ตั้งค่าห้องสอบ', href: 'admission/room_exam_settings.html' },
        { label: 'ตั้งค่าคอลัมน์ตาราง', href: 'admission/student_field_settings.html' },
        { label: 'พอร์ทัลสมัครเรียน', href: 'admission/apply.html' },
        { label: 'ตรวจสอบสถานะผู้สมัคร', href: 'admission/status.html' },
      ],
    },
  ];

  const HUB = { label: 'หน้าแรก (รวมทุกระบบ)', href: 'index.html' };

  // --- ตัวช่วย -------------------------------------------------------------

  // หน้าในระบบย่อยอยู่ลึก 1 ชั้น (schooldark/, admission/) จึงต้องถอยขึ้น 1 ชั้น
  // ส่วนหน้า hub อยู่ที่ root เลยไม่ต้องเติมอะไร
  function prefixFor(systemId) {
    return systemId ? '../' : '';
  }

  // ระบบที่หน้าปัจจุบันสังกัด — ดูจาก path ของ URL (ไม่ใช่จาก placeholder)
  function currentSystemId() {
    const path = location.pathname.replace(/\\/g, '/');
    const found = NAV_SYSTEMS.find((s) => path.indexOf('/' + s.id + '/') !== -1);
    return found ? found.id : null;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // --- Render แบบที่ 1: sidebar ฝั่ง schooldark (สไตล์ app.css) --------------
  function renderSidebar(mount, currentId) {
    const prefix = prefixFor(currentId);
    // โชว์เฉพาะระบบอื่น — ระบบที่หน้านี้สังกัดอยู่มีเมนูของตัวเองอยู่แล้ว
    const others = NAV_SYSTEMS.filter((s) => s.id !== currentId);

    const groups = others.map((system) => `
      <li><div class="sidebar-divider" style="height:1px;background:var(--border-color);margin:8px 14px;opacity:.5;"></div></li>
      <li><p class="menu-label">${escapeHtml(system.label)}</p></li>
      ${system.items.map((item) => `
        <li><a class="menu-item" href="${prefix}${item.href}">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>
          <span>${escapeHtml(item.label)}</span>
        </a></li>
      `).join('')}
    `).join('');

    const hubLink = `
      <li><a class="menu-item" href="${prefix}${HUB.href}">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/></svg>
        <span>${escapeHtml(HUB.label)}</span>
      </a></li>`;

    // mount เป็น <li> ตัวหนึ่งใน <ul class="sidebar-menu"> จึงต้องแทนที่ตัวเองด้วย <li> หลายตัว
    mount.outerHTML = groups + hubLink;
  }

  // --- Render แบบที่ 2: dropdown "ระบบอื่น" ฝั่ง admission (สไตล์ Tailwind) ---
  function renderTopbar(mount, currentId) {
    const prefix = prefixFor(currentId);
    const others = NAV_SYSTEMS.filter((s) => s.id !== currentId);

    const sections = others.map((system) => `
      <div class="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">${escapeHtml(system.label)}</div>
      ${system.items.map((item) => `
        <a href="${prefix}${item.href}" class="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
          <i data-lucide="arrow-right" class="h-3.5 w-3.5 text-slate-400"></i> ${escapeHtml(item.label)}
        </a>
      `).join('')}
    `).join('');

    mount.innerHTML = `
      <span class="relative inline-block">
        <button type="button" id="cross-nav-toggle"
          class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-650 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <i data-lucide="grid-3x3" class="h-3.5 w-3.5"></i> ระบบอื่น
          <i data-lucide="chevron-down" class="h-3 w-3"></i>
        </button>
        <div id="cross-nav-menu"
          class="hidden absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          ${sections}
          <div class="my-1 border-t border-slate-100"></div>
          <a href="${prefix}${HUB.href}" class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <i data-lucide="home" class="h-3.5 w-3.5 text-slate-400"></i> ${escapeHtml(HUB.label)}
          </a>
        </div>
      </span>`;

    const toggle = document.getElementById('cross-nav-toggle');
    const menu = document.getElementById('cross-nav-menu');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== toggle) menu.classList.add('hidden');
    });
  }

  // --- Render แบบที่ 3: การ์ดบนหน้า hub ------------------------------------
  function renderHub(mount) {
    mount.innerHTML = NAV_SYSTEMS.map((system) => `
      <section class="hub-card">
        <h2>${escapeHtml(system.label)}</h2>
        <ul>
          ${system.items.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join('')}
        </ul>
      </section>
    `).join('');
  }

  // --- เริ่มทำงาน ----------------------------------------------------------
  function init() {
    const currentId = currentSystemId();

    const sidebarMount = document.getElementById('cross-nav-sidebar');
    if (sidebarMount) renderSidebar(sidebarMount, currentId);

    const topbarMount = document.getElementById('cross-nav-topbar');
    if (topbarMount) renderTopbar(topbarMount, currentId);

    const hubMount = document.getElementById('cross-nav-hub');
    if (hubMount) renderHub(hubMount);

    // ไอคอน Lucide ของฝั่ง admission ถูกแทรกหลังหน้าโหลด จึงต้องสั่งวาดซ้ำ
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
