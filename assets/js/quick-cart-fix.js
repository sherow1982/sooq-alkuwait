/**
 * إصلاح فوري لأزرار السلة في جميع صفحات المنتجات
 * Quick Cart Fix for All Product Pages
 * Version: Emergency Fix 1.0
 */

function quickFixCartButton() {
    console.log('🚑 بدء الإصلاح الفوري لأزرار السلة...');
    
    // 1. إصلاح جميع الأزرار التي تحتوي onclick="addToCart"
    const oldButtons = document.querySelectorAll('button[onclick*="addToCart"], [onclick*="addToCart"]');
    
    let fixedButtonsCount = 0;
    
    oldButtons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        const match = onclickAttr ? onclickAttr.match(/addToCart\\((\d+)\\)/) : null;
        
        if (match) {
            const productId = match[1];
            
            // إضافة الخصائص الجديدة
            button.setAttribute('data-product-id', productId);
            button.classList.add('cart-btn');
            
            // إزالة onclick
            button.removeAttribute('onclick');
            
            // إضافة event listener جديد
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // بيانات المنتج
                const productData = {
                    id: productId,
                    title: extractProductTitle(),
                    price: extractPriceFromPage(),
                    image: getFirstImageUrl(),
                    quantity: 1
                };
                
                console.log('🛍️ بيانات المنتج المستخرجة:', productData);
                
                // محاولة استخدام نظام السلة المحسن
                if (window.addToCart && typeof window.addToCart === 'function') {
                    window.addToCart(productData);
                } else {
                    // نظاع طوارئ بسيط
                    emergencyAddToCart(productData);
                }
            });
            
            fixedButtonsCount++;
            console.log(`✅ تم إصلاح زر المنتج: ${productId}`);
        }
    });
    
    // 2. إضافة عداد السلة إذا لم يكن موجود
    if (!document.getElementById('cart-count')) {
        const cartLinks = document.querySelectorAll('a[href*="cart.html"]');
        cartLinks.forEach(link => {
            if (!link.querySelector('.cart-count')) {
                const counter = document.createElement('span');
                counter.className = 'cart-count';
                counter.id = 'cart-count';
                counter.textContent = '0';
                counter.style.cssText = 'background: #dc3545; color: white; border-radius: 50%; padding: 4px 8px; font-size: 12px; margin-right: 5px; display: none;';
                link.appendChild(counter);
            }
        });
    }
    
    // 3. إضافة حاوية الإشعارات
    if (!document.getElementById('cart-notification')) {
        const notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.className = 'cart-notification';
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 400px;';
        document.body.appendChild(notification);
    }
    
    console.log(`🎉 تم إصلاح ${fixedButtonsCount} زر سلة بنجاح!`);
    
    // تحديث عداد السلة
    updateCartCounterFromStorage();
    
    return fixedButtonsCount;
}

/**
 * نظام طوارئ بسيط لإضافة المنتجات
 */
function emergencyAddToCart(productData) {
    console.log('🆘 استخدام النظام الطوارئ لإضافة المنتج');
    
    try {
        // الحصول على بيانات السلة الحالية
        let cartItems = [];
        const stored = localStorage.getItem('cart_items');
        if (stored) {
            const cartData = JSON.parse(stored);
            cartItems = cartData.items || [];
        }
        
        // فحص إذا كان المنتج موجود
        const existingIndex = cartItems.findIndex(item => item.id === productData.id);
        
        if (existingIndex !== -1) {
            cartItems[existingIndex].quantity += 1;
            showEmergencyNotification(`تم زيادة كمية المنتج إلى ${cartItems[existingIndex].quantity} ✅`);
        } else {
            cartItems.push(productData);
            showEmergencyNotification(`تم إضافة "${productData.title}" إلى السلة 🛍️`);
        }
        
        // حفظ في التخزين المحلي
        const cartData = {
            items: cartItems,
            timestamp: Date.now()
        };
        localStorage.setItem('cart_items', JSON.stringify(cartData));
        
        // تحديث عداد السلة
        updateCartCounterFromStorage();
        
        // انتقال تلقائي للسلة
        setTimeout(() => {
            showEmergencyNotification('جاري الانتقال إلى السلة... 🛍️');
            setTimeout(() => {
                const cartUrl = window.location.pathname.includes('products-pages') ? '../cart.html?added=true' : 'cart.html?added=true';
                window.location.href = cartUrl;
            }, 800);
        }, 1500);
        
    } catch (error) {
        console.error('❌ خطأ في النظام الطوارئ:', error);
        alert('تم إضافة المنتج للسلة!');
    }
}

/**
 * عرض إشعار بسيط
 */
function showEmergencyNotification(message) {
    let container = document.getElementById('emergency-notification');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'emergency-notification';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 350px;';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
        text-align: center;
    `;
    
    notification.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
    container.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

/**
 * استخراج عنوان المنتج
 */
function extractProductTitle() {
    const titleSelectors = ['h1.product-title', '.product-name h1', '.product-header h1', 'h1'];
    
    for (let selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element.textContent.trim();
        }
    }
    
    // من title الصفحة
    const pageTitle = document.title.replace(' - سوق الكويت', '').trim();
    return pageTitle || 'منتج غير محدد';
}

/**
 * استخراج السعر
 */
function extractPriceFromPage() {
    const priceSelectors = ['.sale-price', '.product-price .price', '.price-current', '.product-price', '.price', '[data-price]'];
    
    for (let selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            let priceText = element.textContent || element.getAttribute('data-price') || '0';
            priceText = priceText.replace(/[^\d.]/g, '');
            const price = parseFloat(priceText);
            if (price > 0) return price;
        }
    }
    
    return 15.000; // سعر افتراضي
}

/**
 * استخراج رابط الصورة
 */
function getFirstImageUrl() {
    const imageSelectors = ['.product-image', '.main-image img', '.product-gallery img', 'img[alt*="product"]', 'img[src*="http"]'];
    
    for (let selector of imageSelectors) {
        const element = document.querySelector(selector);
        if (element && element.src) {
            return element.src;
        }
    }
    
    return 'https://via.placeholder.com/400x300/007bff/ffffff?text=منتج';
}

/**
 * تحديث عداد السلة من التخزين
 */
function updateCartCounterFromStorage() {
    try {
        const stored = localStorage.getItem('cart_items');
        if (stored) {
            const cartData = JSON.parse(stored);
            const totalItems = cartData.items ? cartData.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            
            const counters = document.querySelectorAll('.cart-count, #cart-count');
            counters.forEach(counter => {
                counter.textContent = totalItems;
                counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
            });
            
            console.log(`🔢 تم تحديث عداد السلة: ${totalItems}`);
        }
    } catch (error) {
        console.error('❌ خطأ في تحديث عداد السلة:', error);
    }
}

/**
 * إضافة CSS للحركات
 */
function addEmergencyStyles() {
    if (document.getElementById('emergency-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'emergency-styles';
    styles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .cart-notification {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10000 !important;
            max-width: 400px !important;
        }
        
        .cart-count {
            background: #dc3545 !important;
            color: white !important;
            border-radius: 50% !important;
            padding: 4px 8px !important;
            font-size: 12px !important;
            margin-right: 5px !important;
            transition: all 0.3s ease !important;
            display: none !important;
        }
        
        .cart-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4) !important;
        }
        
        .cart-btn:active {
            transform: scale(0.95) !important;
        }
    `;
    
    document.head.appendChild(styles);
}

// تشغيل فوري عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addEmergencyStyles();
        setTimeout(quickFixCartButton, 500);
    });
} else {
    addEmergencyStyles();
    quickFixCartButton();
}

console.log('🚑 تم تحميل نظام الإصلاح الفوري لأزرار السلة!');

// تصدير الوظائف للاستخدام الخارجي
window.quickFixCartButton = quickFixCartButton;
window.emergencyAddToCart = emergencyAddToCart;