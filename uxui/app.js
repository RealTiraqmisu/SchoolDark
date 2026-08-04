/**
 * =============================================================================
 * APP.JS — SchoolDark Unified Single-Page Application Router
 * ระบบ router หลักที่ควบคุมการสลับ module/view และ shared utilities
 * =============================================================================
 */

/* ============================================================
   MODULE: App Router & Navigation
   ============================================================ */
const App = (() => {

    // --- State ---
    let currentModule = 'dashboard';
    let currentView   = 'dashboard-main';

    // Map of module -> default view
    const MODULE_DEFAULT_VIEWS = {
        dashboard : 'dashboard-main',
        leave     : 'leave-settings',
        personnel : 'directory',
        settings  : 'general',
    };

    // Map of view -> page title (Thai)
    const VIEW_TITLES = {
        'dashboard-main'  : { title: 'แดชบอร์ดภาพรวม',           crumb: 'SchoolDark / ภาพรวม' },
        'leave-settings'  : { title: 'ตั้งค่าการลา',              crumb: 'ระบบการลา / ตั้งค่า' },
        'leave-form'      : { title: 'ฟอร์มการลา (ผู้ใช้)',        crumb: 'ระบบการลา / ยื่นใบลา' },
        'leave-approve'   : { title: 'อนุมัติการลา',              crumb: 'ระบบการลา / อนุมัติ' },
        'directory'       : { title: 'รายชื่อบุคลากร',             crumb: 'บุคลากร / รายชื่อ' },
        'basic-info'      : { title: 'ข้อมูลพื้นฐานบุคลากร',       crumb: 'บุคลากร / ข้อมูลพื้นฐาน' },
        'education'       : { title: 'ข้อมูลการศึกษา & อบรม',     crumb: 'บุคลากร / การศึกษา' },
        'job-license'     : { title: 'ตำแหน่ง & ใบประกอบฯ',       crumb: 'บุคลากร / ตำแหน่ง' },
        'import-hub'      : { title: 'นำเข้าข้อมูลบุคลากร',        crumb: 'บุคลากร / นำเข้าข้อมูล' },
        'print-studio'    : { title: 'พิมพ์บาร์โค้ด & QR Studio', crumb: 'บุคลากร / พิมพ์ & QR' },
        'general'         : { title: 'การตั้งค่าทั่วไป',            crumb: 'ตั้งค่าระบบ / ทั่วไป' },
        'schedule'        : { title: 'ตั้งค่าวันเวลาเข้าออก',       crumb: 'ตั้งค่าระบบ / วันเวลา' },
        'permissions'     : { title: 'สิทธิ์ผู้ใช้งาน',             crumb: 'ตั้งค่าระบบ / สิทธิ์' },
        'signatories'     : { title: 'ผู้ลงนามเอกสาร',             crumb: 'ตั้งค่าระบบ / ผู้ลงนาม' },
    };

    // --- DOM helpers ---
    function qs(sel, parent = document) { return parent.querySelector(sel); }
    function qsa(sel, parent = document) { return [...parent.querySelectorAll(sel)]; }

    // --- Navigate ---
    function navigate(moduleName, viewName) {
        if (!viewName) viewName = MODULE_DEFAULT_VIEWS[moduleName] || moduleName;

        // 1. Hide all module sections
        qsa('.module-section').forEach(s => s.classList.remove('active'));

        // 2. Show target module
        const moduleEl = qs(`#module-${moduleName}`);
        if (moduleEl) moduleEl.classList.add('active');

        // 3. Hide all views in target module, show target view
        if (moduleEl) {
            qsa('.view-section', moduleEl).forEach(v => v.classList.remove('active'));
            const viewEl = qs(`#view-${viewName}`, moduleEl);
            if (viewEl) viewEl.classList.add('active');
        }

        // 4. Update sidebar active state
        qsa('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.module === moduleName && item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // 5. Update header title / breadcrumb
        const meta = VIEW_TITLES[viewName] || { title: viewName, crumb: '' };
        const titleEl = qs('#current-view-title');
        const crumbEl = qs('#page-breadcrumb');
        if (titleEl) titleEl.textContent = meta.title;
        if (crumbEl) crumbEl.textContent = meta.crumb;

        // 6. Toggle header contextual buttons
        const roleSwitcher        = qs('#role-switcher-wrapper');
        const addPersonnelBtn     = qs('#header-add-personnel-btn');
        if (roleSwitcher)    roleSwitcher.style.display    = moduleName === 'leave' ? 'flex' : 'none';
        if (addPersonnelBtn) addPersonnelBtn.style.display = moduleName === 'personnel' ? '' : 'none';

        // 7. Update state
        currentModule = moduleName;
        currentView   = viewName;

        // 8. Scroll to top
        const contentBody = qs('.content-body');
        if (contentBody) contentBody.scrollTop = 0;

        // 9. Fire module-specific init callbacks
        fireModuleInit(moduleName, viewName);
    }

    // --- Module init callbacks (called after showing a view) ---
    function fireModuleInit(mod, view) {
        if (mod === 'dashboard') {
            initDashboard();
        }

        // Integration with Leave module (index.js)
        if (mod === 'leave') {
            const cleanView = view.replace('leave-', '');
            if (typeof syncUserJourneySteps === 'function') {
                syncUserJourneySteps(cleanView);
            }
            if (cleanView === 'settings' && typeof renderSettingsView === 'function') {
                renderSettingsView();
            } else if (cleanView === 'form' && typeof renderFormView === 'function') {
                renderFormView();
            } else if (cleanView === 'approve' && typeof renderApprovalView === 'function') {
                renderApprovalView();
            }
        }

        // Integration with Personnel module (personnel.js)
        if (mod === 'personnel') {
            if (view === 'directory' && typeof populateDirectoryTable === 'function') {
                const searchInput = document.getElementById('directory-search');
                const statusSelect = document.getElementById('directory-filter-status');
                populateDirectoryTable(searchInput ? searchInput.value : '', statusSelect ? statusSelect.value : 'all');
                if (typeof updateMetrics === 'function') updateMetrics();
            }
            if ((view === 'basic-info' || view === 'education' || view === 'job-license') && typeof editTeacherProfile === 'function') {
                if (typeof selectedTeacherId !== 'undefined' && selectedTeacherId) {
                    editTeacherProfile(selectedTeacherId);
                } else if (typeof createNewBlankForm === 'function') {
                    createNewBlankForm();
                }
            }
            if (view === 'print-studio' && typeof populatePrintDropdown === 'function') {
                populatePrintDropdown();
            }
        }

        // Integration with Settings module (settings.js)
        if (mod === 'settings') {
            if (typeof renderViewData === 'function') {
                renderViewData(view);
            }
        }
    }

    // --- Quick nav cards (Settings overview) ---
    function bindQuickNavCards() {
        qsa('[data-goto-module]').forEach(card => {
            card.addEventListener('click', () => {
                navigate(card.dataset.gotoModule, card.dataset.gotoView);
            });
        });
    }

    // --- Sidebar menu clicks ---
    function bindSidebarMenu() {
        qsa('.menu-item[data-module]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(item.dataset.module, item.dataset.view);
            });
        });
    }

    // --- Sidebar toggle collapse ---
    function bindSidebarToggle() {
        const sidebar   = qs('#sidebar');
        const toggleBtn = qs('#sidebar-toggle-btn');
        if (!toggleBtn || !sidebar) return;
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // --- Theme toggle (dark/light) ---
    function bindThemeToggle() {
        const btn  = qs('#theme-toggle');
        const icon = qs('#theme-icon');
        if (!btn) return;

        const saved = localStorage.getItem('schooldark-theme') || 'dark';
        applyTheme(saved, icon);

        btn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            const next   = isDark ? 'light' : 'dark';
            applyTheme(next, icon);
            localStorage.setItem('schooldark-theme', next);
        });
    }

    function applyTheme(theme, iconEl) {
        const body = document.body;
        if (theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            if (iconEl) iconEl.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            if (iconEl) iconEl.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        }
    }

    // --- Dashboard init (mock data) ---
    function initDashboard() {
        const dateEl = qs('#dashboard-today-date');
        if (dateEl) {
            const now = new Date();
            const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('th-TH', opts);
        }
    }

    // --- Modal open/close ---
    function openModal(id) {
        const el = qs(`#${id}`);
        if (el) {
            el.classList.add('active');
            el.style.display = 'flex';
        }
    }

    function closeModal(id) {
        const el = qs(`#${id}`);
        if (el) {
            el.classList.remove('active');
            el.style.display = 'none';
        }
    }

    // Bind generic data-close buttons inside modals
    function bindModalCloseButtons() {
        qsa('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.dataset.close));
        });
        // Click backdrop to close
        qsa('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                    overlay.classList.remove('active');
                }
            });
        });
    }

    // --- Toast Notification ---
    function showToast(message, type = 'success', duration = 3000) {
        const container = qs('#toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = {
            success : '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error   : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning : '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info    : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        };
        toast.innerHTML = `${icons[type] || ''}<span>${message}</span>`;
        container.appendChild(toast);
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // --- Header Add Personnel button ---
    function bindHeaderBtns() {
        const addBtn = qs('#header-add-personnel-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                // Navigate to basic-info (new form mode)
                navigate('personnel', 'basic-info');
            });
        }
        const importBtn = qs('#btn-relocated-import');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                // Navigate to bulk import hub
                navigate('personnel', 'import-hub');
            });
        }
    }

    // --- Sidebar approval badge update ---
    function updateApprovalBadge(count) {
        const badge = qs('#sidebar-approval-badge');
        if (!badge) return;
        if (count > 0) {
            badge.style.display = '';
            badge.textContent   = count;
        } else {
            badge.style.display = 'none';
        }
    }

    // --- Init ---
    function init() {
        bindSidebarMenu();
        bindSidebarToggle();
        bindThemeToggle();
        bindModalCloseButtons();
        bindQuickNavCards();
        bindHeaderBtns();

        // Default view
        navigate('dashboard', 'dashboard-main');

        // Mock: set pending badge
        updateApprovalBadge(8);
    }

    // Public API
    return {
        navigate,
        openModal,
        closeModal,
        showToast,
        updateApprovalBadge,
        init,
    };
})();


/* ============================================================
   MODULE: Sub-tab Navigation (shared across Personnel & Settings forms)
   ============================================================ */
const SubTabs = (() => {
    function bindAll() {
        document.querySelectorAll('.form-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const subtabId = btn.dataset.subtab;
                if (!subtabId) return;

                // Deactivate siblings in same nav
                const navRow = btn.closest('.form-tab-nav');
                if (navRow) navRow.querySelectorAll('.form-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Find parent panel and toggle sub-tab panels
                const form = btn.closest('.glass-card, .view-section');
                if (form) {
                    form.querySelectorAll('.sub-tab-panel').forEach(panel => {
                        panel.classList.toggle('active', panel.id === `subtab-${subtabId}`);
                    });
                }
            });
        });
    }
    return { bindAll };
})();


/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    SubTabs.bindAll();
});
