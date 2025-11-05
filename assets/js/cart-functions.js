// ملف JavaScript لوظائف السلة - سوق الكويت
// يستخدم في جميع صفحات المنتجات لضمان عمل زر السلة

function addToCart(productId) {
    try {
        // الحصول على بيانات المنتج من صفحة HTML الحالية
        const titleElement = document.querySelector('h1');
        const imageElement = document.querySelector('.product-image');
        const priceElement = document.querySelector('.sale-price');
        
        if (!titleElement || !imageElement || !priceElement) {
            console.error('عناصر المنتج غير موجودة في الصفحة');
            showNotification('❌ خطأ في تحميل بيانات المنتج', 'error');
            return;
        }
        
        // استخراج السعر (إزالة النصوص والرموز)
        const priceText = priceElement.innerText.replace(/[^\d.]/g, '');
        const salePrice = parseFloat(priceText) || 0;
        
        if (salePrice === 0) {
            console.error('سعر المنتج غير صالح');
            showNotification('❌ خطأ في سعر المنتج', 'error');
            return;
        }
        
        // بناء بيانات المنتج
        const productData = {
            id: productId,
            title: titleElement.innerText.trim(),
            image_link: imageElement.src,
            sale_price: salePrice,
            quantity: 1,
            added_date: new Date().toISOString()
        };

        // قراءة السلة الحالية من localStorage
        let cart = JSON.parse(localStorage.getItem('sooq-cart')) || [];
        
        // تحقق من وجود المنتج في السلة
        const existingIndex = cart.findIndex(item => item.id === productId);
        if (existingIndex !== -1) {
            // زيادة الكمية إذا كان المنتج موجود
            cart[existingIndex].quantity += 1;
        } else {
            // إضافة المنتج الجديد
            cart.push(productData);
        }
        
        // حفظ السلة المحدثة
        localStorage.setItem('sooq-cart', JSON.stringify(cart));
        
        // تحديث عداد السلة في الصفحة (إذا كان موجود)
        updateCartCount();

        // تأثيرات بصرية للزر
        animateButton();
        
        // إشعار نجاح
        showNotification(`✅ تم إضافة "${productData.title}" للسلة بنجاح!`, 'success');
        
        console.log('تمت إضافة المنتج للسلة:', productData);
        
    } catch (error) {
        console.error('خطأ في إضافة المنتج للسلة:', error);
        showNotification('❌ حدث خطأ أثناء إضافة المنتج', 'error');
    }
}

function animateButton() {
    const button = document.querySelector('.buy-button');
    if (!button) return;
    
    const originalText = button.innerHTML;
    const originalBackground = button.style.background || 'linear-gradient(45deg, #007bff, #0056b3, #004085)';
    
    // مرحلة التحميل
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإضافة...';
    button.disabled = true;
    button.style.background = 'linear-gradient(45deg, #6c757d, #495057)';
    
    setTimeout(() => {
        // مرحلة النجاح
        button.innerHTML = '<i class="fas fa-check me-2"></i>تم إضافة المنتج للسلة!';
        button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        
        setTimeout(() => {
            // العودة للحالة الأصلية
            button.innerHTML = originalText;
            button.style.background = originalBackground;
            button.disabled = false;
        }, 2000);
    }, 1000);
}

function showNotification(message, type = 'success') {
    // إزالة الإشعارات السابقة
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    
    const bgColor = type === 'success' ? 
        'linear-gradient(135deg, #28a745, #20c997)' : 
        'linear-gradient(135deg, #dc3545, #c82333)';
    
    notification.style.cssText = `
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: ${bgColor};
        color: white; 
        padding: 15px 25px; 
        border-radius: 12px; 
        z-index: 1001; 
        font-weight: bold;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
        font-family: 'Cairo', Arial, sans-serif;
    `;
    
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    // تحريك الإشعار للداخل
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // إخفاء الإشعار تلقائياً
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('sooq-cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // تحديث عداد السلة في الـ navbar (إذا كان موجود)
        const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count]');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
        
        // تحديث نص رابط السلة
        const cartLinks = document.querySelectorAll('a[href*="cart.html"]');
        cartLinks.forEach(link => {
            if (totalItems > 0) {
                link.innerHTML = `<i class="fas fa-shopping-cart me-1"></i>السلة (${totalItems})`;
            } else {
                link.innerHTML = `<i class="fas fa-shopping-cart me-1"></i>السلة`;
            }
        });
        
    } catch (error) {
        console.error('خطأ في تحديث عداد السلة:', error);
    }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 تهيئة وظائف السلة...');
    
    // تحديث عداد السلة
    updateCartCount();
    
    // إضافة معالج أحداث للزر إذا كان موجود
    const buyButton = document.querySelector('.buy-button');
    if (buyButton && !buyButton.hasAttribute('data-cart-initialized')) {
        buyButton.setAttribute('data-cart-initialized', 'true');
        console.log('✅ زر السلة جاهز للعمل');
    }
});

// تحديث عداد السلة عند تغيير localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'sooq-cart') {
        updateCartCount();
    }
});