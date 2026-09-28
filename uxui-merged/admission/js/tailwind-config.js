/* ======================================================================
 *  tailwind-config.js — ตั้งค่า Tailwind กลางของทั้ง admission/ (Custom
 *  Tailwind Config to match original OKLCH theme)
 *
 *  เดิมบล็อกนี้ถูก copy-paste เป็น inline <script> ซ้ำกันทุกไฟล์ (11 หน้า)
 *  ทุกหน้าตรงกันทุกตัวอักษร — ย้ายมารวมไว้ที่เดียว โหลดคู่กับ
 *  <script src="https://cdn.tailwindcss.com"> เสมอ (ก่อน unpkg lucide)
 *
 *  ค่าสี success/warning/info/destructive เข้มขึ้นจากของเดิม (ของเดิม
 *  #10b981/#f59e0b/#0284c7/#ef4444 อ่อนเกินไป คอนทราสต์บนพื้นขาวต่ำกว่า 4.5:1)
 *  ใช้ค่าเดียวกับ parent/js/tailwind-config.js ที่ปรับไปแล้ว (2026-09-27)
 *  เพื่อให้ badge สถานะ/ตัวเลขสถิติอ่านง่ายขึ้นและสีตรงกันข้ามระบบ
 * ====================================================================== */
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
