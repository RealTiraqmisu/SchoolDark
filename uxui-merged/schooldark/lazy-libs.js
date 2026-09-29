/* =============================================================
   lazy-libs.js — ตัวช่วยโหลดไลบรารีภายนอกแบบ "โหลดตอนใช้จริง" (ใช้ร่วม app.html + leave-features.html)
   เดิม xlsx (~900KB) และ Chart.js ถูกใส่ <script> แบบ sync ใน <head> → จอขาวจนกว่าจะโหลดเสร็จ
   ตอนนี้โหลดครั้งแรกตอนกด export Excel / เปิดกราฟ แล้วจำไว้ (โหลดซ้ำไม่เกิน 1 ครั้ง)

   ใช้: loadScriptOnce(LAZY_LIBS.xlsx).then(() => { ...ใช้ XLSX... })
   ต้องโหลดไฟล์นี้ก่อนสคริปต์อื่นของหน้า (ไม่มี dependency)
   ============================================================= */
const LAZY_LIBS = {
    xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    chart: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
};

const _lazyScriptPromises = {};
function loadScriptOnce(src) {
    if (!_lazyScriptPromises[src]) {
        _lazyScriptPromises[src] = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = () => resolve();
            s.onerror = () => { delete _lazyScriptPromises[src]; reject(new Error('load failed: ' + src)); };
            document.head.appendChild(s);
        });
    }
    return _lazyScriptPromises[src];
}

// หน่วงการเรียกฟังก์ชันที่ผูกกับ event 'input' ของช่องค้นหา (พิมพ์รัว ๆ จะไม่ render ตารางทุกตัวอักษร)
function debounce(fn, wait = 200) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}
