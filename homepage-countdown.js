// عداد تنازلي للصفحة الرئيسية على بطاقات المنتجات
(function() {
  function createHomepageCountdowns() {
    // البحث عن بطاقات المنتجات في الصفحة الرئيسية
    const productCards = document.querySelectorAll('.product-card, .card, [data-product-id]');
    
    productCards.forEach(card => {
      const priceElement = card.querySelector('.price, .current-price, .sale-price');
      if (priceElement && !card.querySelector('.homepage-countdown')) {
        createCardCountdown(card, priceElement);
      }
    });
  }

  function createCardCountdown(card, priceElement) {
    const countdownHtml = `
      <div class="homepage-countdown" style="
        background: linear-gradient(135deg, #dc2626, #991b1b);
        color: white;
        text-align: center;
        padding: 6px 10px;
        font-weight: 700;
        font-size: 11px;
        border-radius: 6px;
        margin-top: 6px;
        border: 1px solid #FFD700;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(45deg, transparent 70%, rgba(255,215,0,0.1) 100%);
        "></div>
        <div style="position: relative; z-index: 2;">
          🔥 العرض ينتهي خلال: 
          <span class="countdown-display" style="
            background: rgba(0,0,0,0.3);
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 4px;
            font-family: 'Courier New', monospace;
            color: #FFD700;
            font-weight: 900;
          ">--:--:--</span>
        </div>
      </div>
    `;
    
    priceElement.insertAdjacentHTML('afterend', countdownHtml);
  }

  function updateHomepageCountdowns() {
    const displays = document.querySelectorAll('.homepage-countdown .countdown-display');
    
    displays.forEach(display => {
      // حساب الوقت المتبقي (24 ساعة من بداية اليوم التالي)
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeLeft = tomorrow - now;
      
      if (timeLeft <= 0) {
        display.textContent = '00:00:00';
        return;
      }
      
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      display.textContent = 
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // إنشاء العدادات للبطاقات الموجودة
    createHomepageCountdowns();
    
    // تحديث كل ثانية
    setInterval(updateHomepageCountdowns, 1000);
    
    // مراقبة إضافة بطاقات جديدة ديناميكياً
    const observer = new MutationObserver(() => {
      createHomepageCountdowns();
    });
    
    const productsContainer = document.getElementById('products-grid');
    if (productsContainer) {
      observer.observe(productsContainer, { childList: true, subtree: true });
    }
  });
})();