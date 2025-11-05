// تحميل الهيدر والفوتر لجميع صفحات المنتجات دون تغيير الاستايل
(function() {
  async function loadPartial(selector, url) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return;
      const html = await res.text();
      const container = document.querySelector(selector);
      if (container) container.innerHTML = html;
    } catch (e) { /* تجاهل الخطأ */ }
  }

  // تحديد المسارات النسبية من صفحات المنتجات داخل products-pages
  const base = '../partials/';
  document.addEventListener('DOMContentLoaded', () => {
    // حاويات إدراج الهيدر والفوتر (ضع div#site-header و div#site-footer في كل صفحة منتج)
    loadPartial('#site-header', base + 'header.html');
    loadPartial('#site-footer', base + 'footer.html');
  });
})();
