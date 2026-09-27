tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3e63dd',
          foreground: '#ffffff',
          hover: '#2f51c7'
        },
        secondary: {
          DEFAULT: '#f1f3f9',
          foreground: '#1e293b'
        },
        // success/warning/destructive/info: เข้มกว่าเดิม (2026-09-27) ให้ข้อความสีเหล่านี้บนพื้นขาว
        // (เช่น statusBadge, ตัวเลขสถิติ) ผ่านคอนทราสต์ 4.5:1 ตาม modern-web-guidance — ค่าเดิมอ่อนเกินไป
        success: {
          DEFAULT: '#047857',
          foreground: '#ffffff'
        },
        warning: {
          DEFAULT: '#b45309',
          foreground: '#78350f'
        },
        info: {
          DEFAULT: '#0369a1',
          foreground: '#ffffff'
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#64748b'
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a'
        },
        border: '#e2e8f0'
      },
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
      }
    }
  }
}
