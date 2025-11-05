// عداد تنازلي للعروض والتخفيضات - 24 ساعة
(function() {
  function createCountdownTimer() {
    const timerHtml = `
      <div id="countdown-banner" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: linear-gradient(135deg, #dc2626, #991b1b);
        color: white;
        text-align: center;
        padding: 8px 12px;
        font-weight: 700;
        font-size: clamp(11px, 2.8vw, 14px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border-bottom: 2px solid #FFD700;
      ">
        🔥 عروض محدودة لمدة 24 ساعة فقط! ينتهي خلال: 
        <span id="countdown-display" style="
          background: rgba(0,0,0,0.3);
          padding: 4px 8px;
          border-radius: 6px;
          margin: 0 8px;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        ">--:--:--</span>
        ⚡ لا تفوت الفرصة!
      </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', timerHtml);
    
    // إزاحة المحتوى للأسفل لتجنب تداخل البانر
    document.body.style.paddingTop = '50px';
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
      return;
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    display.textContent = 
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0');
  }

  document.addEventListener('DOMContentLoaded', () => {
    createCountdownTimer();
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
})();