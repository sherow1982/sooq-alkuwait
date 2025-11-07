/**
 * نظام إدارة سلة التسوق المحسّن لسوق الكويت
 * مع زر واتساب مباشر لطلب المنتجات
 * تاريخ: 2025-11-07
 */

// رقم واتساب المتجر
const WHATSAPP_NUMBER = '201110760081';

// تخزين بيانات المنتج الحالي
let currentProduct = {
    id: null,
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    discount: ''
};

/**
 * استخراج بيانات المنتج من الصفحة
 */
function extractProductData() {
    try {
        // استخراج اسم المنتج من العنوان الرئيسي
        const productTitle = document.querySelector('h1.display-6, h1');
        if (productTitle) {
            currentProduct.name = productTitle.textContent.trim();
        }

        // استخراج السعر بعد الخصم
        const salePrice = document.querySelector('.sale-price');
        if (salePrice) {
            currentProduct.price = salePrice.textContent.trim();
        }

        // استخراج السعر الأصلي
        const originalPrice = document.querySelector('.original-price');
        if (originalPrice) {
            currentProduct.originalPrice = originalPrice.textContent.trim();
        }

        // استخراج رابط الصورة
        const productImage = document.querySelector('.product-image');
        if (productImage) {
            currentProduct.image = productImage.src;
        }

        // استخراج الفئة من breadcrumb
        const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
        if (breadcrumbItems.length >= 2) {
            currentProduct.category = breadcrumbItems[1].textContent.trim();
        }

        // استخراج نسبة الخصم
        const discountBadge = document.querySelector('.discount-badge');
        if (discountBadge) {
            const discountText = discountBadge.textContent;
            const discountMatch = discountText.match(/(\d+)%/);
            if (discountMatch) {
                currentProduct.discount = discountMatch[1] + '%';
            }
        }

        // استخراج معرف المنتج من اسم الملف
        const pathname = window.location.pathname;
        const productMatch = pathname.match(/product-(\d+)-/);
        if (productMatch) {
            currentProduct.id = productMatch[1];
        }

        console.log('بيانات المنتج المستخرجة:', currentProduct);
    } catch (error) {
        console.error('خطأ في استخراج بيانات المنتج:', error);
    }
}

/**
 * إنشاء رسالة واتساب منسقة
 */
function createWhatsAppMessage() {
    let message = `🛍️ *طلب من سوق الكويت*\n\n`;
    message += `📦 *المنتج:* ${currentProduct.name}\n`;
    message += `💰 *السعر:* ${currentProduct.price}`;
    
    if (currentProduct.originalPrice && currentProduct.discount) {
        message += ` (كان ${currentProduct.originalPrice} - وفرت ${currentProduct.discount}!)`;
    }
    
    message += `\n🏷️ *الفئة:* ${currentProduct.category}\n`;
    message += `\n🔗 *رابط المنتج:* ${window.location.href}\n`;
    message += `\n📸 *صورة المنتج:* ${currentProduct.image}\n`;
    message += `\n-------------------\n`;
    message += `\n✨ أرغب في الطلب والاستفسار عن هذا المنتج`;
    
    return encodeURIComponent(message);
}

/**
 * فتح واتساب مع رسالة الطلب
 */
function orderViaWhatsApp() {
    const message = createWhatsAppMessage();
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // تتبع الحدث
    console.log('تم فتح واتساب للطلب');
}

/**
 * إضافة المنتج للسلة (localStorage)
 */
function addToCart(productId) {
    try {
        // الحصول على السلة الحالية
        let cart = JSON.parse(localStorage.getItem('sooq_alkuwait_cart') || '[]');
        
        // البحث عن المنتج في السلة
        const existingIndex = cart.findIndex(item => item.id === currentProduct.id);
        
        if (existingIndex >= 0) {
            // زيادة الكمية إذا كان المنتج موجوداً
            cart[existingIndex].quantity += 1;
        } else {
            // إضافة المنتج الجديد
            cart.push({
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                originalPrice: currentProduct.originalPrice,
                image: currentProduct.image,
                category: currentProduct.category,
                discount: currentProduct.discount,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        // حفظ السلة
        localStorage.setItem('sooq_alkuwait_cart', JSON.stringify(cart));
        
        // تحديث عداد السلة
        updateCartCounter();
        
        // عرض رسالة النجاح
        showSuccessMessage();
        
        console.log('تم إضافة المنتج للسلة:', currentProduct);
        
        return true;
    } catch (error) {
        console.error('خطأ في إضافة المنتج للسلة:', error);
        return false;
    }
}

/**
 * عرض رسالة النجاح عند إضافة المنتج
 */
function showSuccessMessage() {
    const button = document.querySelector('.buy-button');
    if (!button) return;
    
    const originalText = button.innerHTML;
    
    // مرحلة 1: جاري الإضافة
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإضافة...';
    button.disabled = true;
    
    setTimeout(() => {
        // مرحلة 2: تم الإضافة
        button.innerHTML = '<i class="fas fa-check me-2"></i>تم إضافة المنتج للسلة!';
        button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        
        setTimeout(() => {
            // مرحلة 3: العودة للحالة الأصلية
            button.innerHTML = originalText;
            button.style.background = 'linear-gradient(45deg, #007bff, #0056b3, #004085)';
            button.disabled = false;
        }, 2000);
    }, 1000);
}

/**
 * تحديث عداد السلة في الـ navbar
 */
function updateCartCounter() {
    try {
        const cart = JSON.parse(localStorage.getItem('sooq_alkuwait_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // البحث عن أيقونة السلة وإضافة العداد
        const cartLinks = document.querySelectorAll('a[href*="cart.html"]');
        cartLinks.forEach(link => {
            // إزالة العداد القديم إن وجد
            const oldBadge = link.querySelector('.cart-badge');
            if (oldBadge) oldBadge.remove();
            
            // إضافة عداد جديد
            if (totalItems > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = totalItems;
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -10px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: bold;
                `;
                link.style.position = 'relative';
                link.appendChild(badge);
            }
        });
    } catch (error) {
        console.error('خطأ في تحديث عداد السلة:', error);
    }
}

/**
 * إضافة زر واتساب للطلب المباشر
 */
function addWhatsAppButton() {
    // البحث عن زر الشراء الأساسي
    const buyButton = document.querySelector('.buy-button');
    if (!buyButton) return;
    
    // إنشاء زر واتساب
    const whatsappButton = document.createElement('button');
    whatsappButton.className = 'whatsapp-order-button';
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp me-2"></i>اطلب عبر واتساب مباشرة';
    whatsappButton.onclick = orderViaWhatsApp;
    
    // تصميم الزر
    whatsappButton.style.cssText = `
        background: linear-gradient(45deg, #25D366, #20b858);
        border: none;
        padding: 18px 40px;
        font-size: 1.3em;
        font-weight: 600;
        border-radius: 50px;
        color: white;
        width: 100%;
        margin: 10px 0;
        cursor: pointer;
        transition: all 0.4s ease;
        box-shadow: 0 5px 20px rgba(37, 211, 102, 0.3);
    `;
    
    // إضافة تأثير hover
    whatsappButton.onmouseenter = function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.5)';
    };
    
    whatsappButton.onmouseleave = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 20px rgba(37, 211, 102, 0.3)';
    };
    
    // إدراج الزر بعد زر الشراء
    buyButton.parentNode.insertBefore(whatsappButton, buyButton.nextSibling);
}

/**
 * تحديث زر الشراء ليضيف للسلة ثم يعرض خيار واتساب
 */
function enhanceBuyButton() {
    const buyButton = document.querySelector('.buy-button');
    if (!buyButton) return;
    
    // إزالة الـ onclick القديم
    buyButton.removeAttribute('onclick');
    
    // إضافة وظيفة جديدة
    buyButton.addEventListener('click', function() {
        // إضافة للسلة
        if (addToCart(currentProduct.id)) {
            // عرض خيار الانتقال للسلة أو واتساب
            setTimeout(() => {
                const proceed = confirm('تم إضافة المنتج للسلة!\n\nاختر:\nموافق = متابعة التسوق\nإلغاء = الطلب عبر واتساب الآن');
                if (!proceed) {
                    orderViaWhatsApp();
                }
            }, 2500);
        }
    });
}

/**
 * تهيئة العداد التنازلي
 */
function initCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const endTime = now + (24 * 60 * 60 * 1000);
        
        const timer = setInterval(function() {
            const currentTime = new Date().getTime();
            const timeLeft = endTime - currentTime;
            
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            if (timeLeft < 0) {
                const countdownTimer = document.getElementById('countdown-timer');
                if (countdownTimer) {
                    countdownTimer.innerHTML = '<div class="text-center"><h5><i class="fas fa-clock me-2"></i>انتهى العرض!</h5></div>';
                }
                clearInterval(timer);
            }
        }, 1000);
    }
    
    updateCountdown();
}

/**
 * إضافة تأثيرات تفاعلية للمراجعات
 */
function enhanceReviews() {
    const reviewItems = document.querySelectorAll('.review-item');
    reviewItems.forEach(item => {
        item.style.transition = 'transform 0.3s ease';
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

/**
 * إنشاء زر واتساب عائم
 */
function createFloatingWhatsAppButton() {
    const floatingBtn = document.createElement('a');
    floatingBtn.href = '#';
    floatingBtn.className = 'floating-whatsapp-btn';
    floatingBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatingBtn.onclick = function(e) {
        e.preventDefault();
        orderViaWhatsApp();
    };
    
    // تصميم الزر العائم
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: linear-gradient(45deg, #25D366, #20b858);
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.5);
        z-index: 9999;
        text-decoration: none;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    `;
    
    // تأثير hover
    floatingBtn.onmouseenter = function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 30px rgba(37, 211, 102, 0.7)';
    };
    
    floatingBtn.onmouseleave = function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.5)';
    };
    
    // إضافة animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @media (max-width: 768px) {
            .floating-whatsapp-btn {
                bottom: 20px !important;
                left: 20px !important;
                width: 50px !important;
                height: 50px !important;
                font-size: 1.5rem !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(floatingBtn);
}

/**
 * الحصول على محتوى السلة
 */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('sooq_alkuwait_cart') || '[]');
    } catch (error) {
        console.error('خطأ في قراءة السلة:', error);
        return [];
    }
}

/**
 * حساب إجمالي السلة
 */
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
        return total + (price * item.quantity);
    }, 0);
}

/**
 * تهيئة الصفحة عند التحميل
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة نظام المنتجات المحسّن...');
    
    // استخراج بيانات المنتج
    extractProductData();
    
    // تهيئة العداد التنازلي
    initCountdown();
    
    // تحسين زر الشراء
    enhanceBuyButton();
    
    // إضافة زر واتساب
    addWhatsAppButton();
    
    // إنشاء زر واتساب عائم
    createFloatingWhatsAppButton();
    
    // تحسين تأثيرات المراجعات
    enhanceReviews();
    
    // تحديث عداد السلة
    updateCartCounter();
    
    console.log('✅ تم تهيئة جميع الوظائف بنجاح');
});

/**
 * تصدير الوظائف للاستخدام الخارجي
 */
window.sooqAlkuwait = {
    addToCart,
    orderViaWhatsApp,
    getCart,
    getCartTotal,
    currentProduct
};
