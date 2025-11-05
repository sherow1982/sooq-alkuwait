// محمل الجزئيات - تحميل الهيدر والفوتر تلقائياً
(function() {
  async function loadPartial(elementId, partialPath) {
    try {
      const response = await fetch(partialPath);
      if (response.ok) {
        const content = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = content;
        }
      } else {
        console.log(`Failed to load ${partialPath}:`, response.status);
      }
    } catch (error) {
      console.log(`Error loading ${partialPath}:`, error);
      createFallbackContent(elementId);
    }
  }

  function createFallbackContent(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (elementId === 'site-header') {
      element.innerHTML = `
        <header style="
          background: linear-gradient(135deg, #007A3D 0%, #00a651 50%, #FFD700 100%);
          color: white;
          padding: 16px;
          text-align: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        ">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900;">
            <a href="../index.html" style="color: #FFD700; text-decoration: none;">
              🛍️ سوق الكويت
            </a>
          </h1>
          <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">متجرك الموثوق في الكويت 🇰🇼</p>
          <nav style="margin-top: 12px;">
            <a href="../index.html" style="color: white; margin: 0 12px; text-decoration: none;">الرئيسية</a>
            <a href="../cart.html" style="color: white; margin: 0 12px; text-decoration: none; position: relative;">
              🛒 السلة
              <span id="cart-count" style="
                position: absolute; top: -8px; right: -8px;
                background: #dc2626; color: white; border-radius: 50%;
                width: 18px; height: 18px; font-size: 10px;
                display: none; align-items: center; justify-content: center;
              ">0</span>
            </a>
          </nav>
        </header>
      `;
    } else if (elementId === 'site-footer') {
      element.innerHTML = `
        <footer style="
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          padding: 30px 16px;
          margin-top: 40px;
          text-align: center;
        ">
          <h3 style="color: #FFD700; margin-bottom: 12px;">سوق الكويت 🇰🇼</h3>
          <p style="opacity: 0.9; margin-bottom: 16px;">متجرك الإلكتروني الموثوق للمنتجات عالية الجودة</p>
          <div style="margin-bottom: 16px;">
            <a href="https://wa.me/201110760081" target="_blank" style="color: #25D366; font-size: 24px; margin: 0 8px;">
              📱 واتساب
            </a>
          </div>
          <p style="font-size: 12px; opacity: 0.7; margin: 0;">
            © 2025 سوق الكويت. جميع الحقوق محفوظة.
          </p>
        </footer>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // تحديد المسار النسبي للجزئيات
    const currentPath = window.location.pathname;
    const isInProductsFolder = currentPath.includes('/products-pages/');
    const partialsPath = isInProductsFolder ? '../partials' : './partials';

    // تحميل الهيدر والفوتر
    await Promise.all([
      loadPartial('site-header', `${partialsPath}/header.html`),
      loadPartial('site-footer', `${partialsPath}/footer.html`)
    ]);

    // تحديث عداد السلة بعد تحميل الهيدر
    setTimeout(() => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badge = document.getElementById('cart-count');
        
        if (badge && totalItems > 0) {
          badge.textContent = totalItems;
          badge.style.display = 'flex';
        }
      } catch (e) {
        console.log('Cart update error:', e);
      }
    }, 200);
  });
})();