// توليد التقييمات ومزايا المنتجات تلقائياً لكل صفحات المنتجات
(function() {
  // مزايا عامة للمنتجات
  const productFeatures = [
    {
      icon: 'fas fa-shipping-fast',
      title: 'شحن مجاني سريع',
      desc: 'توصيل مجاني لكل الكويت فوق 100 د.ك خلال 24 ساعة'
    },
    {
      icon: 'fas fa-money-bill-wave',
      title: 'دفع آمن',
      desc: 'دفع عند الاستلام، كي نت، أو بطاقة ائتمان آمنة'
    },
    {
      icon: 'fas fa-shield-check',
      title: 'ضمان شامل',
      desc: 'ضمان الجودة واستبدال مجاني خلال 14 يوم'
    },
    {
      icon: 'fas fa-headset',
      title: 'دعم 24/7',
      desc: 'خدمة عملاء متميزة عبر الواتساب والهاتف'
    },
    {
      icon: 'fas fa-award',
      title: 'جودة ممتازة',
      desc: 'منتجات مفحوصة بدقة لضمان أفضل جودة'
    },
    {
      icon: 'fas fa-heart',
      title: 'رضا العملاء',
      desc: 'أكثر من 95% من عملائنا راضون عن منتجاتنا'
    }
  ];

  function generateFeatures() {
    const container = document.querySelector('#auto-features-section');
    if (!container) return;

    // اختيار 4 مزايا عشوائية
    const selectedFeatures = [...productFeatures]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    let html = '<h2>✨ مميزات التسوق معنا</h2>';
    html += '<div class="feat-grid">';
    
    selectedFeatures.forEach(feature => {
      html += `
        <div class="feat">
          <div class="feat-icon">
            <i class="${feature.icon}"></i>
          </div>
          <div class="feat-text">
            <strong>${feature.title}</strong>
            <small>${feature.desc}</small>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
  }

  function generateRating() {
    const starsContainer = document.getElementById('avg-stars');
    const textContainer = document.getElementById('avg-text');
    
    if (!starsContainer || !textContainer) return;

    // تقييم عشوائي بين 4.3 - 5.0
    const ratings = [4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
    const avgRating = ratings[Math.floor(Math.random() * ratings.length)];
    
    // عدد عشوائي من المراجعات
    const reviewCount = Math.floor(Math.random() * 150) + 30; // 30-179

    // عرض النجوم
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 !== 0;
    let starsHtml = '';
    
    // نجوم مملوءة
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // نجمة نصف مملوءة
    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // نجوم فارغة
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }
    
    starsContainer.innerHTML = starsHtml;
    textContainer.textContent = `${avgRating} (${reviewCount} مراجعة)`;
  }

  // تشغيل عند تحميل الصفحة
  document.addEventListener('DOMContentLoaded', () => {
    generateFeatures();
    generateRating();
  });
})();