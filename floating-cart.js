// 🛒 نظام السلة العائمة - النسخة المحسّنة

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

function addToCart(productId, autoRedirect = false) {
    console.log('🛒 إضافة المنتج:', productId);
    
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let product = null;
        
        if (typeof allProducts !== 'undefined' && allProducts.length > 0) {
            product = allProducts.find(p => p.id === productId);
        }
        
        if (!product) {
            product = extractProductFromPage(productId);
        }
        
        if (!product) {
            console.error('❌ المنتج غير موجود:', productId);
            showNotification('المنتج غير موجود!', 'error');
            return;
        }
        
        console.log('✅ المنتج:', product.title);
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: parseFloat(product.sale_price) || parseFloat(product.price) || 0,
                image: product.image_link || '',
                link: product.product_link || '',
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('✅ تم الحفظ. العدد:', cart.length);
        
        updateCartCount();
        showNotification('✅ تم إضافة المنتج للسلة!', 'success');
        
        if (autoRedirect) {
            setTimeout(() => {
                window.location.href = '/cart.html';
            }, 1500);
        }
        
    } catch (e) {
        console.error('❌ خطأ:', e);
        showNotification('حدث خطأ، حاول مرة أخرى', 'error');
    }
}

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
