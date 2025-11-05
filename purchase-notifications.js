// رسائل منبثقة عن عمليات شراء وهمية كل دقيقة
(function() {
  // أسماء كويتية عشوائية
  const kuwaitiNames = [
    'فاطمة العتيبي', 'أحمد الصباح', 'مريم المطيري', 'خالد الأنصاري',
    'نورا الهاجري', 'محمد الرشيد', 'هند الشمري', 'عبدالله العجمي',
    'سارة الدوسري', 'فيصل الخالد', 'جواهر العسعوسي', 'بدر الزعبي',
    'دانة الكندري', 'يوسف الحربي', 'شيخة الصالح', 'راشد البذال',
    'لطيفة القطان', 'طلال المنصور', 'ريم الجاسم', 'عمار العوضي',
    'ماجد السبيعي', 'أمل الخرافي', 'جاسم الياقوت', 'ليلى البغلي',
    'حمد الفليج', 'وضحا المرزوق', 'منيرة الرمضان', 'نوف العنزي',
    'عبدالرحمن الفهد', 'سعد العازمي'
  ];
  
  // أسماء منتجات عشوائية مع روابطها - محدثة لتشمل جميع المنتجات
  const productLinks = [
    {name: 'حصالة صراف آلي', url: '/products-pages/piggy-bank-atm-auto-1.html'},
    {name: 'صفاية سلطة دوارة', url: '/products-pages/strainer-salad-2.html'},
    {name: 'شورت نسائي لشد الجسم', url: '/products-pages/shorts-women-shape-4.html'},
    {name: 'محول كهرباء 220 فولت', url: '/products-pages/converter-electric-5.html'},
    {name: 'ريشة تين شورت', url: '/products-pages/product-3.html'},
    {name: 'شامبو طبيعي للعناية', url: '/products-pages/shampoo-6.html'},
    {name: 'سيروم طبيعي للبشرة', url: '/products-pages/serum-7.html'},
    {name: 'جهاز إلكتروني ذكي', url: '/products-pages/device-8.html'},
    {name: 'قهوة عربية أصيلة', url: '/products-pages/coffee-9.html'},
    {name: 'روبوت ذكي تفاعلي', url: '/products-pages/robot-10.html'},
    {name: 'حصالة أوتوماتيكية للأطفال', url: '/products-pages/piggy-bank-atm-auto-automatic-1.html'},
    {name: 'حصالة أطفال تلقائية', url: '/products-pages/piggy-bank-automatic-kids-1.html'},
    {name: 'صندوق ادخار ATM', url: '/products-pages/savings-box-atm-automatic-wtwmaty-1.html'}
  ];

  function getRandomName() {
    return kuwaitiNames[Math.floor(Math.random() * kuwaitiNames.length)];
  }
  
  function getRandomProduct() {
    return productLinks[Math.floor(Math.random() * productLinks.length)];
  }
  
  function getRandomTimeAgo() {
    const minutes = Math.floor(Math.random() * 60) + 1; // 1-60 دقيقة
    return minutes === 1 ? 'دقيقة واحدة' : `${minutes} دقيقة`;
  }

  function showPurchaseNotification() {
    const name = getRandomName();
    const product = getRandomProduct();
    const timeAgo = getRandomTimeAgo();
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      max-width: 320px;
      font-size: 14px;
      font-weight: 600;
      border: 2px solid #fff;
      animation: slideInLeft 0.6s ease, fadeOut 0.6s ease 4.4s;
      line-height: 1.4;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        ">🎉</div>
        <div>
          <div style="margin-bottom: 4px;">
            اشترى <strong>${name}</strong>
          </div>
          <div style="margin-bottom: 4px;">
            <a href="${product.url}" style="color: #FFD700; text-decoration: underline; font-weight: 700;">${product.name}</a>
          </div>
          <div style="font-size: 12px; opacity: 0.9;">
            منذ ${timeAgo}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // إضافة الأنيميشن
    if (!document.querySelector('#purchase-animations')) {
      const style = document.createElement('style');
      style.id = 'purchase-animations';
      style.textContent = `
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // بدء عرض الإشعارات كل دقيقة
  document.addEventListener('DOMContentLoaded', () => {
    // أول إشعار بعد 10 ثوان من تحميل الصفحة
    setTimeout(showPurchaseNotification, 10000);
    
    // ثم كل دقيقة (60 ثانية)
    setInterval(showPurchaseNotification, 60000);
  });
})();