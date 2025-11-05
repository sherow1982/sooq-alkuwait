// عداد تنازلي للعروض والتخفيضات ثابت تحت سعر المنتج مباشرة
(function() {
  function createCountdownTimer() {
    // البحث عن صندوق السعر في الصفحة
    const priceBox = document.querySelector('.price-box');
    if (!priceBox) return;

    const timerHtml = `
      <div id="countdown-banner" style="
        background: linear-gradient(135deg, #dc2626, #991b1b);
        color: white;
        text-align: center;
        padding: 12px 16px;
        font-weight: 700;
        font-size: clamp(12px, 3vw, 15px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border-radius: clamp(8px, 2vw, 12px);
        margin-top: clamp(8px, 2vw, 12px);
        border: 2px solid #FFD700;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 70%, rgba(255,215,0,0.1) 100%);
        "></div>
        <div style="position: relative; z-index: 2;">
          🔥 عرض محدود لمدة 24 ساعة فقط! ينتهي خلال: 
          <div id="countdown-display" style="
            background: rgba(0,0,0,0.4);
            padding: 6px 12px;
            border-radius: 8px;
            margin: 8px auto 0;
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
            font-size: clamp(14px, 3.5vw, 18px);
            font-weight: 900;
            color: #FFD700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            display: inline-block;
          ">--:--:--</div>
          <div style="
            font-size: clamp(10px, 2.5vw, 12px);
            margin-top: 4px;
            opacity: 0.9;
          ">⚡ لا تفوت الفرصة!</div>
        </div>
      </div>
    `;
    
    // إدراج العداد مباشرة بعد صندوق السعر
    priceBox.insertAdjacentHTML('afterend', timerHtml);
  }

  function updateCountdown() {
    const display = document.getElementById('countdown-display');
    if (!display) return;
    
    // حساب الوقت المتبقي (24 ساعة من بداية اليوم التالي)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow - now;
    
    if (timeLeft <= 0) {
      display.textContent = '00:00:00';
      // إعادة تعيين العداد لليوم التالي
      setTimeout(() => {
        location.reload();
      }, 2000);
      return;
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    display.textContent = 
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0');
    
    // إضافة تأثير وميض عندما يقل الوقت عن ساعة
    if (timeLeft < 3600000) { // أقل من ساعة
      display.style.animation = 'pulse 1s infinite';
    }
  }

  // إضافة تأثير النبض للحالات الطارئة
  function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded', () => {
    createCountdownTimer();
    addPulseAnimation();
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
})();