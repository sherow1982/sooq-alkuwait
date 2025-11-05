// تحسين صفحة الدفع بـ webhook احترافي لحفظ الطلبات
(function() {
  // إعدادات Webhook - يمكنك تغيير الرابط لحفظ الطلبات في قاعدة بياناتك
  const WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // غيّر هذا لـ Google Sheets
  const BACKUP_WEBHOOK = 'https://httpbin.org/post'; // نسخة احتياطية للاختبار

  async function submitOrder(orderData) {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // تغيير شكل الزر أثناء الإرسال
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إرسال الطلب...';
    submitBtn.style.opacity = '0.7';
    
    try {
      // محاولة الإرسال للـ webhook الرئيسي
      let response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      // في حالة فشل الرئيسي، استخدام الاحتياطي
      if (!response.ok) {
        response = await fetch(BACKUP_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });
      }
      
      if (response.ok) {
        showSuccessMessage();
        // فتح واتساب
        const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(orderData.whatsappMessage)}`;
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 1000);
        
        // مسح السلة
        localStorage.removeItem('cart');
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('cart:updated'));
        }
        
        // إعادة توجيه بعد 3 ثوانٍ
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 3000);
        
      } else {
        throw new Error('فشل في حفظ الطلب');
      }
      
    } catch (error) {
      console.log('Order submission error:', error);
      showErrorMessage();
      
      // إعادة تفعيل الزر
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      submitBtn.style.opacity = '1';
    }
  }

  function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 24px 32px;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      border: 3px solid #FFD700;
      animation: successPulse 0.6s ease;
    `;
    
    message.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
      <div>تم إرسال طلبك بنجاح!</div>
      <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">سنتواصل معك قريباً</div>
    `;
    
    document.body.appendChild(message);
    
    // إضافة الأنيميشن
    const style = document.createElement('style');
    style.textContent = `
      @keyframes successPulse {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      if (message.parentNode) message.remove();
      if (style.parentNode) style.remove();
    }, 4000);
  }

  function showErrorMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: linear-gradient(135deg, #dc2626, #991b1b);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      font-size: 14px;
      font-weight: 600;
      border: 2px solid #FFD700;
      animation: errorShake 0.6s ease;
    `;
    
    message.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 18px;"></i>
        <div>حدث خطأ في الإرسال، حاول مرة أخرى</div>
      </div>
    `;
    
    document.body.appendChild(message);
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      if (message.parentNode) message.remove();
      if (style.parentNode) style.remove();
    }, 4000);
  }

  // ربط مع نموذج الدفع إذا وُجد
  document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
          window.location.href = '../index.html';
          return;
        }
        
        // جمع بيانات النموذج
        const formData = new FormData(checkoutForm);
        const customerData = {
          name: formData.get('name'),
          phone: '+965' + formData.get('phone'),
          governorate: formData.get('governorate'),
          address: formData.get('address')
        };
        
        // حساب الإجمالي
        const total = cart.reduce((sum, item) => {
          return sum + ((item.sale_price || item.price) * (item.quantity || 1));
        }, 0);
        
        // إعداد رسالة واتساب
        let whatsappMessage = `طلب جديد من سوق الكويت 🛍️\n\n`;
        whatsappMessage += `👤 الاسم: ${customerData.name}\n`;
        whatsappMessage += `📞 الهاتف: ${customerData.phone}\n`;
        whatsappMessage += `🏙️ المحافظة: ${customerData.governorate}\n`;
        whatsappMessage += `📍 العنوان: ${customerData.address}\n\n`;
        whatsappMessage += `🛍️ تفاصيل الطلب:\n`;
        cart.forEach((item, index) => {
          whatsappMessage += `${index + 1}. ${item.title}\n`;
          whatsappMessage += `   الكمية: ${item.quantity || 1} | السعر: ${item.sale_price || item.price} د.ك\n\n`;
        });
        whatsappMessage += `💰 الإجمالي: ${total.toFixed(2)} د.ك\n`;
        whatsappMessage += `شكراً لاختياركم سوق الكويت! 🇰🇼`;
        
        // بيانات الطلب للـ webhook
        const orderData = {
          timestamp: new Date().toISOString(),
          customer: customerData,
          items: cart,
          total: total,
          whatsappMessage: whatsappMessage,
          source: 'sooq-alkuwait'
        };
        
        // إرسال الطلب
        await submitOrder(orderData);
      });
    }
  });

  function updateHomepageCountdowns() {
    const displays = document.querySelectorAll('.homepage-countdown .countdown-display');
    
    displays.forEach(display => {
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
    createHomepageCountdowns();
    setInterval(updateHomepageCountdowns, 1000);
    
    // مراقبة إضافة منتجات ديناميكياً في الصفحة الرئيسية
    const observer = new MutationObserver(() => {
      setTimeout(createHomepageCountdowns, 100);
    });
    
    const container = document.getElementById('products-grid');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }
  });
})();