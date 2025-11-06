/**
 * نظام السلة المحسن لموقع سوق الكويت
 * Enhanced Cart System for Sooq AlKuwait
 * Version 4.0 - GitHub Direct Integration
 */

// إعدادات النظام
const CART_CONFIG = {
    storage: 'sooq-cart',
    currency: 'د.ك',
    whatsappNumber: '201110760081'
};

// حالة السلة
let cart = JSON.parse(localStorage.getItem(CART_CONFIG.storage)) || [];

// تحميل النظام عند بدء الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 تحميل نظام السلة v4.0');
    updateCartCounter();
    updateCartDisplay();
    console.log('✅ نظام السلة جاهز!');
});

/**
 * إضافة منتج إلى السلة
 */
function addToCart(id, title, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`✅ تم زيادة الكمية إلى ${existingItem.quantity}`);
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            image: image || 'https://via.placeholder.com/100x100/00843d/ffffff?text=منتج',
            quantity: 1
        });
        showNotification(`✅ تم إضافة "${title}" إلى السلة`);
    }
    
    saveCart();
    updateCartCounter();
    updateCartDisplay();
    
    console.log(`➕ أضيف منتج ${id}: ${title}`);
}

/**
 * إزالة منتج من السلة
 */
function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        const removedItem = cart.splice(index, 1)[0];
        saveCart();
        updateCartCounter();
        updateCartDisplay();
        showNotification(`🗑️ تم حذف "${removedItem.title}"`);
    }
}

/**
 * تحديث كمية منتج
 */
function updateQuantity(id, newQuantity) {
    const item = cart.find(item => item.id == id);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCounter();
            updateCartDisplay();
        }
    }
}

/**
 * حفظ السلة
 */
function saveCart() {
    localStorage.setItem(CART_CONFIG.storage, JSON.stringify(cart));
}

/**
 * تحديث عداد السلة
 */
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counters = document.querySelectorAll('#cart-count, .cart-count');
    
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}

/**
 * تحديث عرض السلة
 */
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 60px; background: white; border-radius: 15px; margin: 20px 0;">
                <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
                <h3 style="color: #00843d; margin-bottom: 15px;">السلة فارغة!</h3>
                <p style="color: #666; margin-bottom: 30px;">لم تقم بإضافة أي منتجات بعد.</p>
                <a href="products-catalog.html" style="background: #00843d; color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold;">
                    🛒 تصفح المنتجات
                </a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let itemsHtml = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHtml += `
            <div style="display: flex; align-items: center; gap: 20px; padding: 25px; background: white; border-radius: 15px; margin: 15px 0; box-shadow: 0 3px 10px rgba(0,0,0,0.1); border: 2px solid #e9ecef;">
                <img src="${item.image}" alt="${item.title}" loading="lazy" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;"
                     onerror="this.src='https://via.placeholder.com/80x80/00843d/ffffff?text=منتج'">
                
                <div style="flex: 1;">
                    <h5 style="color: #00843d; margin: 0 0 10px 0; font-weight: bold;">${item.title}</h5>
                    <p style="color: #ce1126; font-weight: bold; margin: 5px 0;">السعر: ${item.price.toFixed(2)} د.ك</p>
                    <small style="color: #666;">رقم المنتج: SOOQ-${item.id.toString().padStart(4, '0')}</small>
                </div>
                
                <div style="text-align: center;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                                style="width: 35px; height: 35px; border: 2px solid #00843d; background: white; cursor: pointer; border-radius: 50%; font-weight: bold; color: #00843d;">
                            -
                        </button>
                        <span style="font-weight: bold; font-size: 18px; min-width: 40px; background: #f0f8ff; padding: 8px 12px; border-radius: 8px; border: 2px solid #87ceeb; color: #00843d;">
                            ${item.quantity}
                        </span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})"
                                style="width: 35px; height: 35px; border: 2px solid #00843d; background: white; cursor: pointer; border-radius: 50%; font-weight: bold; color: #00843d;">
                            +
                        </button>
                    </div>
                    <button onclick="removeFromCart(${item.id})" 
                            style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: bold;">
                        🗑️ حذف
                    </button>
                </div>
                
                <div style="text-align: center; color: #00843d; font-weight: bold; font-size: 18px; background: #f0f8ff; padding: 15px; border-radius: 10px; border: 2px solid #87ceeb;">
                    ${itemTotal.toFixed(2)} د.ك
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = `
        ${itemsHtml}
        
        <div style="background: linear-gradient(135deg, #25d366, #128c7e); color: white; padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);">
            <h4 style="margin-bottom: 20px; font-size: 24px;">
                💬 إتمام الطلب عبر واتساب
            </h4>
            <p style="margin-bottom: 25px; font-size: 16px; opacity: 0.9;">
                اضغط على الزر لإرسال طلبك مباشرة عبر واتساب
            </p>
            <div style="background: white; color: #ce1126; padding: 15px; border-radius: 15px; margin: 20px 0; font-size: 20px; font-weight: bold;">
                💰 المجموع النهائي: ${total.toFixed(2)} د.ك
            </div>
            <button onclick="proceedToWhatsAppCheckout()" 
                    style="background: white; color: #25d366; border: none; padding: 20px 40px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.3s; box-shadow: 0 5px 15px rgba(255,255,255,0.3);">
                💬 إرسال الطلب عبر واتساب
            </button>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center; margin: 30px 0;">
            <button onclick="clearCart()" 
                    style="background: #dc3545; color: white; border: none; padding: 15px 25px; border-radius: 20px; cursor: pointer; font-weight: bold;">
                🗑️ مسح السلة
            </button>
            <a href="products-catalog.html" 
               style="background: #00843d; color: white; padding: 15px 25px; border-radius: 20px; text-decoration: none; font-weight: bold;">
                🛍️ إضافة منتجات
            </a>
        </div>
    `;
}

/**
 * مسح السلة
 */
function clearCart() {
    if (confirm('هل تريد مسح جميع المنتجات من السلة؟')) {
        cart = [];
        saveCart();
        updateCartCounter();
        updateCartDisplay();
        showNotification('✅ تم مسح السلة بالكامل');
    }
}

/**
 * إتمام الطلب عبر واتساب
 */
function proceedToWhatsAppCheckout() {
    if (cart.length === 0) {
        showNotification('❌ السلة فارغة! أضف بعض المنتجات أولاً');
        return;
    }
    
    console.log('📞 بدء عملية إتمام الطلب...');
    
    let total = 0;
    let cartDetails = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `${index + 1}. ${item.title}%0A   📦 الكمية: ${item.quantity}%0A   💰 السعر: ${item.price.toFixed(2)} د.ك%0A   📋 المجموع: ${itemTotal.toFixed(2)} د.ك%0A   🆔 رقم: SOOQ-${item.id.toString().padStart(4, '0')}%0A`;
    }).join('%0A');
    
    const orderNumber = 'ORD-' + Date.now();
    const currentTime = new Date().toLocaleString('ar-EG');
    
    const orderSummary = `🛒 طلب جديد من سوق الكويت:%0A%0A📋 رقم الطلب: ${orderNumber}%0A⏰ التاريخ: ${currentTime}%0A%0A📦 تفاصيل المنتجات:%0A${cartDetails}%0A───────────────%0A%0A💰 ملخص الطلب:%0A📊 عدد المنتجات: ${cart.reduce((sum, item) => sum + item.quantity, 0)} قطعة%0A🚚 الشحن: مجاني%0A💵 المجموع النهائي: ${total.toFixed(2)} د.ك%0A%0A📍 معلومات إضافية:%0A✅ شحن مجاني لجميع أنحاء الكويت%0A⏱️ التوصيل خلال 24-48 ساعة%0A📞 خدمة العملاء متاحة 24/7%0A🛱️ ضمان جودة 100%25%0A%0A📱 يرجى تأكيد الطلب وإرسال عنوان التوصيل بالتفصيل`;
    
    const whatsappUrl = `https://wa.me/${CART_CONFIG.whatsappNumber}?text=${orderSummary}`;
    
    showNotification('💬 جاري فتح واتساب...', 'success');
    window.open(whatsappUrl, '_blank');
}

/**
 * عرض إشعار
 */
function showNotification(message, type = 'info') {
    console.log(`📢 ${message}`);
    
    const notification = document.createElement('div');
    const colors = {
        success: { bg: '#d4edda', color: '#155724' },
        error: { bg: '#f8d7da', color: '#721c24' },
        info: { bg: '#d1ecf1', color: '#0c5460' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: ${color.color};
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// إضافة CSS للتأثيرات
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// تصدير الوظائف
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.proceedToWhatsAppCheckout = proceedToWhatsAppCheckout;
window.updateCartCounter = updateCartCounter;

console.log('🎉 نظام السلة v4.0 جاهز للعمل!');