// تحسين تحميل الصور لجميع الصفحات
(function() {
    'use strict';
    
    // إضافة معالج للصور الفاشلة
    function setupImageErrorHandlers() {
        const images = document.querySelectorAll('img[data-product-image], amp-img');
        
        images.forEach(img => {
            if (img.tagName === 'IMG') {
                img.addEventListener('error', function() {
                    console.warn('❌ فشل تحميل الصورة:', this.src);
                    this.src = 'https://via.placeholder.com/360x260/007A3D/FFFFFF?text=سوق+الكويت';
                }, { once: true });
            }
        });
    }
    
    // تشغيل عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupImageErrorHandlers);
    } else {
        setupImageErrorHandlers();
    }
    
    // إعادة التشغيل عند إضافة محتوى ديناميكي
    const observer = new MutationObserver(setupImageErrorHandlers);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ تم تفعيل معالج تحميل الصور');
})();