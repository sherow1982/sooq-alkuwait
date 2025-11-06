/**
 * نظام السلة المحدث لموقع سوق الكويت - إصدار محسن
 * Cart System for Sooq AlKuwait - Enhanced Version
 * Version 3.0 - Complete Solution
 */

// إعدادات النظام
const CART_CONFIG = {
    storage: 'cart_items',
    currency: 'د.ك',
    shippingFee: 0, // الشحن مجاني
    taxRate: 0, // بدون ضرائب
    maxItems: 99,
    animations: true,
    redirectToCart: true, // الانتقال التلقائي للسلة
    autoRedirectDelay: 1500, // تأخير الانتقال (مللي ثانية)
    whatsappNumber: '201110760081' // رقم واتساب
};

// حالة السلة العامة
let cart = {
    items: [],
    total: 0,
    count: 0
};

// تحميل بيانات السلة عند بدء الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 تم تحميل نظام السلة المحسن v3.0');
    
    // تحميل بيانات السلة من التخزين المحلي
    loadCartFromStorage();
    
    // تحديث عرض السلة
    updateCartDisplay();
    
    // ربط الأحداث
    bindCartEvents();
    
    // تحديث عداد السلة في كل الصفحات
    updateCartCounter();
    
    console.log('✅ نظام السلة المحسن جاهز للعمل');
});

/**
 * تحميل بيانات السلة من التخزين المحلي
 */
function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem(CART_CONFIG.storage);
        if (stored) {
            const cartData = JSON.parse(stored);
            cart.items = cartData.items || [];
            cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cart.total = calculateTotal();
            
            console.log(`📦 تم تحميل ${cart.count} منتج من السلة`);
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل بيانات السلة:', error);
        cart = { items: [], total: 0, count: 0 };
    }
}

/**
 * حفظ بيانات السلة في التخزين المحلي
 */
function saveCartToStorage() {
    try {
        const cartData = {
            items: cart.items,
            timestamp: Date.now()
        };
        localStorage.setItem(CART_CONFIG.storage, JSON.stringify(cartData));
        console.log('💾 تم حفظ بيانات السلة');
    } catch (error) {
        console.error('❌ خطأ في حفظ بيانات السلة:', error);
    }
}

/**
 * ربط أحداث الأزرار والعناصر
 */
function bindCartEvents() {
    // ربط أزرار إضافة إلى السلة
    const cartButtons = document.querySelectorAll('.cart-btn, [data-product-id]');
    cartButtons.forEach(button => {
        button.removeEventListener('click', handleAddToCart);
        button.addEventListener('click', handleAddToCart);
    });
    
    // ربط أزرار إزالة من السلة
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', handleRemoveFromCart);
    });
    
    // ربط أزرار تحديث الكمية
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', handleQuantityChange);
    });
}

/**
 * معالجة إضافة منتج إلى السلة
 */
function handleAddToCart(event) {
    event.preventDefault();
    
    const button = event.target.closest('button');
    if (!button) return;
    
    let productId = button.getAttribute('data-product-id');
    
    // بديل للنظام القديم
    if (!productId) {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/addToCart\\((\\d+)\\)/);
            if (match) {
                productId = match[1];
            }
        }
    }
    
    if (!productId) {
        showNotification('خطأ: لا يمكن تحديد المنتج', 'error');
        return;
    }
    
    const productData = extractProductData(productId);
    
    if (productData) {
        addToCart(productData);
        animateButton(button);
        
        // الانتقال التلقائي لصفحة السلة
        if (CART_CONFIG.redirectToCart) {
            setTimeout(() => {
                showNotification('جاري الانتقال إلى السلة... 🛒', 'info');
                setTimeout(() => {
                    const cartUrl = window.location.pathname.includes('products-pages') 
                        ? '../cart.html?added=true' 
                        : 'cart.html?added=true';
                    window.location.href = cartUrl;
                }, 500);
            }, CART_CONFIG.autoRedirectDelay);
        }
    } else {
        showNotification('خطأ في تحميل بيانات المنتج', 'error');
    }
}

/**
 * استخراج بيانات المنتج من صفحة HTML
 */
function extractProductData(productId) {
    try {
        // عنوان المنتج
        const titleSelectors = [
            'h1.product-title',
            '.product-name h1',
            '.product-header h1',
            'h1'
        ];
        
        let title = 'منتج غير محدد';
        for (let selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                title = element.textContent.trim();
                break;
            }
        }
        
        // سعر المنتج
        const priceSelectors = [
            '.sale-price',
            '.product-price .price',
            '.price-current',
            '.product-price',
            '.price',
            '[data-price]'
        ];
        
        let price = 0;
        for (let selector of priceSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                let priceText = element.textContent || element.getAttribute('data-price') || '0';
                priceText = priceText.replace(/[^\\d.]/g, '');
                price = parseFloat(priceText) || 0;
                if (price > 0) break;
            }
        }
        
        // صورة المنتج
        const imageSelectors = [
            '.product-image',
            '.main-image img',
            '.product-gallery img',
            'img[alt*="product"]',
            'img'
        ];
        
        let image = 'https://via.placeholder.com/100x100/28a745/ffffff?text=منتج';
        for (let selector of imageSelectors) {
            const element = document.querySelector(selector);
            if (element && element.src) {
                image = element.src;
                break;
            }
        }
        
        return {
            id: productId,
            title: title,
            price: price,
            image: image,
            quantity: 1
        };
        
    } catch (error) {
        console.error('خطأ في استخراج بيانات المنتج:', error);
        return null;
    }
}

/**
 * إضافة منتج إلى السلة
 */
function addToCart(productData) {
    console.log('➕ إضافة منتج:', productData);
    
    const existingIndex = cart.items.findIndex(item => item.id === productData.id);
    
    if (existingIndex !== -1) {
        const newQuantity = cart.items[existingIndex].quantity + 1;
        
        if (newQuantity <= CART_CONFIG.maxItems) {
            cart.items[existingIndex].quantity = newQuantity;
            showNotification(`تم زيادة كمية المنتج إلى ${newQuantity} ✅`, 'success');
        } else {
            showNotification(`الحد الأقصى ${CART_CONFIG.maxItems} قطعة لكل منتج ⚠️`, 'warning');
            return;
        }
    } else {
        cart.items.push({
            id: productData.id,
            title: productData.title,
            price: productData.price,
            image: productData.image,
            quantity: 1
        });
        showNotification(`تم إضافة "${productData.title}" إلى السلة 🛒`, 'success');
    }
    
    updateCartStats();
    saveCartToStorage();
    updateCartDisplay();
    updateCartCounter();
}

/**
 * إزالة منتج من السلة
 */
function removeFromCart(productId) {
    const index = cart.items.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        const removedItem = cart.items.splice(index, 1)[0];
        updateCartStats();
        saveCartToStorage();
        updateCartDisplay();
        updateCartCounter();
        
        showNotification(`تم حذف "${removedItem.title}" من السلة 🗑️`, 'info');
        console.log('🗑️ تم حذف المنتج:', removedItem);
    }
}

function handleRemoveFromCart(event) {
    event.preventDefault();
    const button = event.target.closest('button');
    const productId = button.getAttribute('data-product-id');
    
    if (productId) {
        if (confirm('هل تريد حذف هذا المنتج من السلة؟')) {
            removeFromCart(productId);
        }
    }
}

function handleQuantityChange(event) {
    const input = event.target;
    const productId = input.getAttribute('data-product-id');
    const newQuantity = parseInt(input.value) || 1;
    
    if (productId) {
        updateQuantity(productId, newQuantity);
    }
}

function updateQuantity(productId, newQuantity) {
    const index = cart.items.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= CART_CONFIG.maxItems) {
            cart.items[index].quantity = newQuantity;
            updateCartStats();
            saveCartToStorage();
            updateCartDisplay();
            updateCartCounter();
            
            console.log(`📊 تم تحديث كمية المنتج ${productId} إلى ${newQuantity}`);
        } else {
            showNotification(`الحد الأقصى ${CART_CONFIG.maxItems} قطعة لكل منتج`, 'warning');
        }
    }
}

function calculateTotal() {
    return cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function updateCartStats() {
    cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total = calculateTotal();
}

function updateCartCounter() {
    const counters = document.querySelectorAll('#cart-count, .cart-count');
    
    counters.forEach(counter => {
        if (counter) {
            counter.textContent = cart.count;
            counter.style.display = cart.count > 0 ? 'inline-block' : 'none';
            
            if (CART_CONFIG.animations) {
                counter.classList.add('updated');
                setTimeout(() => {
                    counter.classList.remove('updated');
                }, 300);
            }
        }
    });
    
    console.log(`🔢 تم تحديث عداد السلة: ${cart.count}`);
}

/**
 * تحديث عرض السلة (في صفحة cart.html)
 */
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('empty-cart-message');
    
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    if (cart.items.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        cartContainer.innerHTML = `
            <div class="empty-cart text-center p-5">
                <div style="font-size: 80px; margin-bottom: 20px; color: #ffc107;">🛒</div>
                <h3 style="color: #28a745;">السلة فارغة!</h3>
                <p style="margin-bottom: 30px;">لم تقم بإضافة أي منتجات بعد.</p>
                <a href="products-catalog.html" class="btn btn-primary btn-lg">
                    🛍️ تصفح المنتجات
                </a>
            </div>
        `;
    } else {
        if (emptyMessage) emptyMessage.style.display = 'none';
        
        // عرض المنتجات
        cart.items.forEach(item => {
            const itemElement = createCartItemElement(item);
            cartContainer.appendChild(itemElement);
        });
        
        // إضافة قسم إتمام الطلب
        const checkoutSection = document.createElement('div');
        checkoutSection.innerHTML = `
            <div style="background: linear-gradient(135deg, #25d366, #128c7e); color: white; padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);">
                <h4 style="margin-bottom: 20px; font-size: 1.5em;">
                    <i class="fab fa-whatsapp me-2"></i>إتمام الطلب عبر واتساب
                </h4>
                <p style="margin-bottom: 25px; opacity: 0.9; font-size: 1.1em;">
                    اضغط على الزر أدناه لإرسال طلبك مباشرة عبر واتساب<br>
                    وسنقوم بالتواصل معك فوراً لتأكيد الطلب
                </p>
                <button onclick="proceedToWhatsAppCheckout()" class="btn btn-light btn-lg" 
                        style="color: #25d366; font-weight: bold; padding: 18px 50px; border-radius: 30px; font-size: 1.3em; box-shadow: 0 5px 15px rgba(255,255,255,0.3); transition: all 0.3s ease;">
                    <i class="fab fa-whatsapp me-2"></i>إرسال الطلب عبر واتساب
                </button>
            </div>
        `;
        cartContainer.appendChild(checkoutSection);
    }
    
    // تحديث ملخص المجموع
    if (cartTotal && cart.items.length > 0) {
        cartTotal.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <span style="font-weight: 600; color: #333;">عدد المنتجات:</span>
                    <span style="font-weight: 600; color: #007bff;">${cart.count} قطعة</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <span style="font-weight: 600; color: #333;">المجموع الفرعي:</span>
                    <span style="font-weight: 600; color: #28a745;">${cart.total.toFixed(3)} ${CART_CONFIG.currency}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #28a745; font-weight: 600;">🚚 الشحن:</span>
                    <span style="color: #28a745; font-weight: bold;">مجاني</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 20px 0; padding: 20px 0; border-top: 3px solid #007bff; font-size: 1.4em;">
                    <strong style="color: #007bff;">💵 المجموع النهائي:</strong>
                    <strong style="color: #007bff;">${cart.total.toFixed(3)} ${CART_CONFIG.currency}</strong>
                </div>
            </div>
        `;
    }
    
    bindCartEvents();
}

/**
 * إنشاء عنصر منتج في السلة - محسن
 */
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.style.cssText = `
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 25px;
        background: white;
        border-radius: 15px;
        margin: 20px 0;
        box-shadow: 0 3px 15px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    `;
    
    div.innerHTML = `
        <div class="item-image" style="flex-shrink: 0;">
            <img src="${item.image}" alt="${item.title}" loading="lazy" 
                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; border: 2px solid #e9ecef;"
                 onerror="this.src='https://via.placeholder.com/100x100/28a745/ffffff?text=منتج'">
        </div>
        <div class="item-details" style="flex: 1;">
            <h5 style="color: #007bff; margin: 0 0 10px 0; font-weight: bold; font-size: 1.2em;">${item.title}</h5>
            <p style="color: #28a745; font-weight: bold; font-size: 1.1em; margin: 5px 0;">
                💰 السعر: ${item.price.toFixed(3)} ${CART_CONFIG.currency}
            </p>
            <small style="color: #666;">🏷️ رقم المنتج: SOOQ-${item.id.toString().padStart(4, '0')}</small>
        </div>
        <div class="item-controls" style="text-align: center;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; justify-content: center;">
                <button type="button" onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                        style="width: 40px; height: 40px; border: 2px solid #007bff; background: #f8f9fa; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2em; color: #007bff; transition: all 0.2s ease;">
                    <i class="fas fa-minus"></i>
                </button>
                <span style="font-weight: bold; font-size: 1.3em; min-width: 50px; background: #e3f2fd; padding: 10px 15px; border-radius: 10px; border: 2px solid #90caf9; color: #1976d2;">
                    ${item.quantity}
                </span>
                <button type="button" onclick="updateQuantity('${item.id}', ${item.quantity + 1})"
                        style="width: 40px; height: 40px; border: 2px solid #007bff; background: #f8f9fa; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2em; color: #007bff; transition: all 0.2s ease;">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button type="button" onclick="removeFromCart('${item.id}')" 
                    style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: bold;">
                <i class="fas fa-trash me-1"></i>حذف
            </button>
        </div>
        <div style="text-align: center; color: #007bff; font-weight: bold; font-size: 1.3em; background: #e3f2fd; padding: 15px; border-radius: 10px; border: 2px solid #90caf9;">
            💰 ${(item.price * item.quantity).toFixed(3)} ${CART_CONFIG.currency}
        </div>
    `;
    
    return div;
}

/**
 * إتمام الطلب عبر واتساب - محسن
 */
function proceedToWhatsAppCheckout() {
    if (cart.items.length === 0) {
        showNotification('السلة فارغة! أضف بعض المنتجات أولاً 🛒', 'warning');
        return;
    }
    
    console.log('📞 بدء عملية إتمام الطلب عبر واتساب...');
    
    let total = 0;
    let cartDetails = cart.items.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `${index + 1}. ${item.title}%0A   📦 الكمية: ${item.quantity}%0A   💰 السعر: ${item.price.toFixed(3)} د.ك%0A   🧮 المجموع: ${itemTotal.toFixed(3)} د.ك%0A   🏷️ رقم: SOOQ-${item.id.toString().padStart(4, '0')}%0A`;
    }).join('%0A');
    
    const orderNumber = 'ORD-' + Date.now();
    const currentTime = new Date().toLocaleString('ar-EG');
    
    const orderSummary = `🛒 طلب جديد من سوق الكويت:%0A%0A📋 رقم الطلب: ${orderNumber}%0A⏰ التاريخ: ${currentTime}%0A%0A📦 تفاصيل المنتجات:%0A${cartDetails}%0A━━━━━━━━━━━━━━━━━━━━━━%0A%0A💰 ملخص الطلب:%0A📊 عدد المنتجات: ${cart.count} قطعة%0A💵 المجموع الفرعي: ${total.toFixed(3)} د.ك%0A🚚 الشحن: مجاني%0A💵 المجموع النهائي: ${total.toFixed(3)} د.ك%0A%0A📍 معلومات إضافية:%0A✅ شحن مجاني لجميع أنحاء الكويت%0A⏱️ التوصيل خلال 24-48 ساعة%0A📞 خدمة العملاء متاحة 24/7%0A🛡️ ضمان جودة 100%25%0A%0A📱 يرجى تأكيد الطلب وإرسال عنوان التوصيل بالتفصيل`;
    
    const whatsappUrl = `https://wa.me/${CART_CONFIG.whatsappNumber}?text=${orderSummary}`;
    
    showNotification('جاري فتح واتساب لإتمام الطلب... 📞', 'success');
    
    // فتح واتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');
    
    console.log('✅ تم إرسال الطلب إلى واتساب');
}

function animateButton(button) {
    if (!CART_CONFIG.animations) return;
    
    button.style.background = '#28a745';
    button.style.transform = 'scale(0.95)';
    
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check me-2"></i>تم الإضافة! جاري الانتقال...';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        button.style.transform = '';
    }, 1000);
}

function showNotification(message, type = 'info') {
    console.log(`📢 ${message}`);
    
    let notificationContainer = document.getElementById('cart-notification');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'cart-notification';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const colors = {
        success: { bg: '#d4edda', border: '#28a745', text: '#155724' },
        error: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' },
        warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
        info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        background: ${color.bg};
        color: ${color.text};
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 10px;
        border-left: 4px solid ${color.border};
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}" style="font-size: 1.2em;"></i>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 4000);
}

function clearCart() {
    if (confirm('هل تريد مسح جميع المنتجات من السلة؟')) {
        cart = { items: [], total: 0, count: 0 };
        saveCartToStorage();
        updateCartDisplay();
        updateCartCounter();
        showNotification('تم مسح السلة بالكامل 🧹', 'info');
        console.log('🗑️ تم مسح السلة بالكامل');
    }
}

// تصدير الوظائف للاستخدام الخارجي
window.cart = cart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToWhatsAppCheckout;
window.proceedToWhatsAppCheckout = proceedToWhatsAppCheckout;

// إضافة CSS محسن
const styles = `
<style>
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

.cart-count.updated {
    transform: scale(1.3) !important;
    background: #28a745 !important;
    display: inline-block !important;
}

.cart-item:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

@media (max-width: 768px) {
    .cart-notification {
        right: 10px !important;
        left: 10px !important;
        max-width: none !important;
    }
}
</style>
`;

if (!document.getElementById('cart-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'cart-styles';
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
}

console.log('🎉 تم تحميل نظام السلة المحسن v3.0 بنجاح!');