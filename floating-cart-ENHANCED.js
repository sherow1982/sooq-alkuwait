// 🛒 نظام السلة العائمة - مع التحويل التلقائي

function renderFloatingCart() {
    let cartCount = 0;
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    } catch (e) {
        console.error('خطأ في قراءة السلة:', e);
    }

    const floatingCartHTML = '<div class="floating-cart" id="floating-cart">' +
        '<a href="/cart.html" class="cart-button">' +
            '<i class="fas fa-shopping-cart"></i>' +
            '<span class="cart-count" id="cart-count">' + cartCount + '</span>' +
        '</a>' +
    '</div>';

    document.body.insertAdjacentHTML('beforeend', floatingCartHTML);
    window.addEventListener('storage', updateCartCount);
}

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = count;
            cartCountEl.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountEl.style.transform = 'scale(1)';
            }, 300);
        }
    } catch (e) {
        console.error('خطأ في تحديث عداد السلة:', e);
    }
}

// إضافة منتج للسلة - مع خيار التحويل التلقائي
function addToCart(productId, autoRedirect = false) {
    console.log('🛒 محاولة إضافة المنتج:', productId);

    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let product = null;

        // البحث في allProducts
        if (typeof allProducts !== 'undefined' && allProducts.length > 0) {
            product = allProducts.find(p => p.id === productId);
        }

        // استخراج من الصفحة
        if (!product) {
            product = extractProductFromPage(productId);
        }

        if (!product) {
            console.error('❌ المنتج غير موجود:', productId);
            showNotification('المنتج غير موجود!', 'error');
            return;
        }

        console.log('✅ تم العثور على المنتج:', product.title);

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
            console.log('✅ زيادة الكمية إلى:', existingItem.quantity);
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: parseFloat(product.sale_price) || parseFloat(product.price) || 0,
                image: product.image_link || '',
                link: product.product_link || '',
                quantity: 1
            });
            console.log('✅ إضافة منتج جديد');
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('✅ تم حفظ السلة. العدد:', cart.length);

        updateCartCount();
        showNotification('✅ تم إضافة المنتج للسلة!', 'success');

        // التحويل التلقائي للسلة بعد ثانيتين
        if (autoRedirect) {
            setTimeout(() => {
                window.location.href = '/cart.html';
            }, 1500);
        }

    } catch (e) {
        console.error('❌ خطأ في إضافة المنتج:', e);
        showNotification('حدث خطأ، حاول مرة أخرى', 'error');
    }
}

// إضافة منتج والذهاب للسلة مباشرة
function addToCartAndGo(productId) {
    addToCart(productId, true);
}

function extractProductFromPage(productId) {
    try {
        const titleEl = document.querySelector('h1.display-6, h1');
        const priceEl = document.querySelector('.sale-price, .price-current');
        const imageEl = document.querySelector('.product-image img, img.product-image');

        if (titleEl && priceEl) {
            const title = titleEl.textContent.trim();
            const priceText = priceEl.textContent.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceText) || 0;
            const image = imageEl ? imageEl.src : '';
            const link = window.location.pathname;

            return {
                id: productId,
                title: title,
                price: price,
                sale_price: price,
                image_link: image,
                product_link: link
            };
        }
    } catch (e) {
        console.error('خطأ في استخراج البيانات:', e);
    }

    return null;
}

function showNotification(message, type = 'success') {
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;

    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    notification.innerHTML = '<i class="fas fa-' + icon + '"></i> <span>' + message + '</span>';

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function clearCart() {
    try {
        localStorage.removeItem('cart');
        updateCartCount();
        showNotification('تم مسح السلة', 'success');

        // إعادة تحميل الصفحة إذا كنا في صفحة السلة
        if (window.location.pathname.includes('cart')) {
            setTimeout(() => location.reload(), 500);
        }
    } catch (e) {
        console.error('خطأ في مسح السلة:', e);
    }
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
        console.error('خطأ في قراءة السلة:', e);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 تهيئة السلة العائمة...');
    renderFloatingCart();
    console.log('✅ السلة جاهزة');
});
