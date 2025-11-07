/**
 * 📱 نظام واتساب شامل - سوق الكويت
 * يعمل على جميع الصفحات تلقائياً
 * التاريخ: 2025-11-07
 */

const WHATSAPP_CONFIG = {
    number: '201110760081',
    defaultMessage: 'مرحباً! أريد الاستفسار عن منتجات سوق الكويت',
    storeInfo: {
        name: 'سوق الكويت',
        website: 'https://sooq-alkuwait.arabsad.com',
        phone: '+201110760081',
        email: 'info@sooq-alkuwait.com'
    }
};

/**
 * إنشاء رسالة واتساب حسب نوع الصفحة
 */
function createWhatsAppMessage(pageType, data = {}) {
    let message = `🛍️ *طلب من ${WHATSAPP_CONFIG.storeInfo.name}*\n\n`;
    
    switch(pageType) {
        case 'product':
            message += `📦 *المنتج:* ${data.name || 'غير محدد'}\n`;
            message += `💰 *السعر:* ${data.price || 'غير محدد'}`;
            if (data.originalPrice && data.discount) {
                message += ` (كان ${data.originalPrice} - وفرت ${data.discount}!)`;
            }
            message += `\n🏷️ *الفئة:* ${data.category || 'غير محدد'}\n`;
            message += `\n🔗 *رابط المنتج:* ${window.location.href}\n`;
            if (data.image) {
                message += `\n📸 *صورة:* ${data.image}\n`;
            }
            message += `\n-------------------\n`;
            message += `\n✨ أرغب في الطلب والاستفسار عن هذا المنتج`;
            break;
            
        case 'cart':
            const cart = data.items || [];
            if (cart.length === 0) {
                message = WHATSAPP_CONFIG.defaultMessage;
            } else {
                cart.forEach((item, index) => {
                    message += `${index + 1}. *${item.name}*\n`;
                    message += `   • السعر: ${item.price}\n`;
                    message += `   • الكمية: ${item.quantity}\n\n`;
                });
                message += `-------------------\n`;
                message += `💰 *الإجمالي:* ${data.total || '0.00'} د.ك\n`;
                message += `🚚 *الشحن:* مجاني\n\n`;
                message += `✨ أرغب في إتمام الطلب`;
            }
            break;
            
        case 'general':
        default:
            message = WHATSAPP_CONFIG.defaultMessage;
    }
    
    return encodeURIComponent(message);
}

/**
 * فتح واتساب مع رسالة مخصصة
 */
function openWhatsApp(pageType = 'general', data = {}) {
    const message = createWhatsAppMessage(pageType, data);
    const whatsappURL = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // تتبع الحدث (اختياري)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'engagement',
            'event_label': pageType,
            'value': 1
        });
    }
    
    console.log('📱 تم فتح واتساب:', pageType);
}

/**
 * إضافة زر واتساب عائم تلقائياً
 */
function addFloatingWhatsAppButton() {
    // التحقق من عدم وجوده مسبقاً
    if (document.querySelector('.whatsapp-float-pro')) {
        return;
    }
    
    const floatingBtn = document.createElement('a');
    floatingBtn.href = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage)}`;
    floatingBtn.target = '_blank';
    floatingBtn.className = 'whatsapp-float-pro';
    floatingBtn.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span class="whatsapp-text-pro">طلب عبر واتساب</span>
    `;
    
    document.body.appendChild(floatingBtn);
    console.log('✅ تم إضافة زر واتساب عائم');
}

/**
 * إضافة Action Bar للموبايل
 */
function addMobileActionBar() {
    // التحقق من عدم وجوده مسبقاً
    if (document.querySelector('.mobile-action-bar-pro')) {
        return;
    }
    
    const actionBar = document.createElement('div');
    actionBar.className = 'mobile-action-bar-pro';
    actionBar.innerHTML = `
        <button class="mobile-action-btn-pro mobile-btn-cart-pro" onclick="window.location.href='cart-enhanced.html'">
            <i class="fas fa-shopping-cart"></i>
            السلة
        </button>
        <button class="mobile-action-btn-pro mobile-btn-whatsapp-pro" onclick="openWhatsApp('general')">
            <i class="fab fa-whatsapp"></i>
            واتساب
        </button>
        <button class="mobile-action-btn-pro mobile-btn-call-pro" onclick="window.location.href='tel:+${WHATSAPP_CONFIG.number}'">
            <i class="fas fa-phone"></i>
            اتصل
        </button>
    `;
    
    document.body.appendChild(actionBar);
    console.log('✅ تم إضافة Action Bar للموبايل');
}

/**
 * تحديث جميع روابط واتساب في الصفحة
 */
function updateAllWhatsAppLinks() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    
    whatsappLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        
        // تحديث الرقم إذا لم يكن محدثاً
        if (!currentHref.includes(WHATSAPP_CONFIG.number)) {
            // استخراج الرسالة الحالية إن وجدت
            const textMatch = currentHref.match(/text=([^&]*)/i);
            const message = textMatch ? decodeURIComponent(textMatch[1]) : WHATSAPP_CONFIG.defaultMessage;
            
            // تحديث الرابط
            const newHref = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(message)}`;
            link.setAttribute('href', newHref);
        }
        
        // إضافة target="_blank" إذا لم يكن موجوداً
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
    });
    
    console.log(`✅ تم تحديث ${whatsappLinks.length} رابط واتساب`);
}

/**
 * إضافة أزرار واتساب للمنتجات في ال Grid
 */
function addWhatsAppToProductCards() {
    const productCards = document.querySelectorAll('.product-card, .product-card-pro');
    
    productCards.forEach(card => {
        // التحقق من عدم وجود زر واتساب مسبقاً
        if (card.querySelector('.whatsapp-quick-btn')) {
            return;
        }
        
        // استخراج بيانات المنتج
        const productName = card.querySelector('.product-title, .product-title-pro, h3, h5')?.textContent || 'منتج';
        const productPrice = card.querySelector('.price-current, .price-current-pro, .sale-price')?.textContent || 'غير محدد';
        const productLink = card.querySelector('a')?.href || window.location.href;
        
        // إنشاء زر واتساب سريع
        const whatsappBtn = document.createElement('button');
        whatsappBtn.className = 'whatsapp-quick-btn';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp me-1"></i>طلب فوري';
        whatsappBtn.style.cssText = `
            background: linear-gradient(45deg, #25D366, #128C7E);
            border: none;
            padding: 0.6rem 1rem;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            width: 100%;
            cursor: pointer;
            margin-top: 0.5rem;
            transition: all 0.3s ease;
        `;
        
        whatsappBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openWhatsApp('product', {
                name: productName,
                price: productPrice,
                link: productLink
            });
        };
        
        // إضافة الزر للبطاقة
        const actionsDiv = card.querySelector('.product-actions, .product-actions-pro');
        if (actionsDiv) {
            actionsDiv.appendChild(whatsappBtn);
        } else {
            card.appendChild(whatsappBtn);
        }
    });
    
    console.log(`✅ تم إضافة أزرار واتساب لـ ${productCards.length} بطاقة`);
}

/**
 * تحديث عداد السلة في جميع الصفحات
 */
function updateUniversalCartBadge() {
    try {
        const cart = JSON.parse(localStorage.getItem('sooq_alkuwait_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // تحديث جميع العدادات
        const badges = document.querySelectorAll('.cart-badge-pro, #cartBadge, .cart-badge');
        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('خطأ في تحديث عداد السلة:', error);
    }
}

/**
 * إضافة أيقونة واتساب في النافبار إذا لم تكن موجودة
 */
function ensureNavbarWhatsApp() {
    const navbar = document.querySelector('.navbar, .navbar-pro, nav');
    if (!navbar) return;
    
    // التحقق من وجود رابط واتساب
    const existingWhatsApp = navbar.querySelector('a[href*="wa.me"]');
    if (existingWhatsApp) {
        // تحديث الرقم فقط
        existingWhatsApp.href = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage)}`;
        return;
    }
    
    // إضافة أيقونة جديدة
    const whatsappIcon = document.createElement('a');
    whatsappIcon.href = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage)}`;
    whatsappIcon.target = '_blank';
    whatsappIcon.style.cssText = 'color: #25D366; font-size: 2rem; margin: 0 1rem; transition: 0.3s;';
    whatsappIcon.innerHTML = '<i class="fab fa-whatsapp"></i>';
    
    whatsappIcon.onmouseenter = () => {
        whatsappIcon.style.transform = 'scale(1.2)';
        whatsappIcon.style.filter = 'drop-shadow(0 0 10px #25D366)';
    };
    
    whatsappIcon.onmouseleave = () => {
        whatsappIcon.style.transform = 'scale(1)';
        whatsappIcon.style.filter = 'none';
    };
    
    // إضافة للنافبار
    const navbarContent = navbar.querySelector('.navbar-content, .container, .navbar-collapse');
    if (navbarContent) {
        navbarContent.appendChild(whatsappIcon);
    }
}

/**
 * تهيئة عامة عند تحميل الصفحة
 */
function initUniversalWhatsApp() {
    console.log('🚀 بدء تهيئة نظام واتساب الشامل...');
    
    // 1. تحديث جميع الروابط
    updateAllWhatsAppLinks();
    
    // 2. إضافة الزر العائم
    addFloatingWhatsAppButton();
    
    // 3. إضافة Action Bar للموبايل
    addMobileActionBar();
    
    // 4. إضافة واتساب للنافبار
    ensureNavbarWhatsApp();
    
    // 5. إضافة أزرار للمنتجات
    addWhatsAppToProductCards();
    
    // 6. تحديث عداد السلة
    updateUniversalCartBadge();
    
    console.log('✅ تم تهيئة نظام واتساب بنجاح!');
}

/**
 * مساعد للصفحات القديمة - يعمل مع onclick
 */
function orderViaWhatsApp(productData = {}) {
    openWhatsApp('product', productData);
}

/**
 * طلب سلة كاملة
 */
function orderCartViaWhatsApp() {
    const cart = JSON.parse(localStorage.getItem('sooq_alkuwait_cart') || '[]');
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
        return sum + (price * item.quantity);
    }, 0);
    
    openWhatsApp('cart', {
        items: cart,
        total: total.toFixed(2)
    });
}

/**
 * تصدير للاستخدام العام
 */
window.WhatsAppSooq = {
    open: openWhatsApp,
    orderProduct: orderViaWhatsApp,
    orderCart: orderCartViaWhatsApp,
    config: WHATSAPP_CONFIG,
    updateLinks: updateAllWhatsAppLinks,
    updateBadge: updateUniversalCartBadge
};

// تهيئة تلقائية عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUniversalWhatsApp);
} else {
    initUniversalWhatsApp();
}

// تحديث عداد السلة عند التغيير
window.addEventListener('storage', (e) => {
    if (e.key === 'sooq_alkuwait_cart') {
        updateUniversalCartBadge();
    }
});

console.log('📱 نظام واتساب الشامل جاهز - +201110760081');
