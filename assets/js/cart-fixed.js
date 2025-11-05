
// نظام إدارة السلة المحسن - الإصدار الجديد
console.log('🔄 تحميل نظام السلة المحسن...');

class CartManager {
    constructor() {
        this.storageKey = 'sooq_cart';
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.bindEvents();
        console.log('✅ تم تهيئة نظام السلة بنجاح');
    }
    
    getCart() {
        try {
            const cart = localStorage.getItem(this.storageKey);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('خطأ في قراءة السلة:', error);
            return [];
        }
    }
    
    saveCart(cart) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cart));
            this.updateCartCount();
            this.dispatchCartUpdate();
            return true;
        } catch (error) {
            console.error('خطأ في حفظ السلة:', error);
            return false;
        }
    }
    
    addToCart(id, title, price, image) {
        try {
            let cart = this.getCart();
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: parseInt(id),
                    title: title,
                    price: parseFloat(price),
                    image: image,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            
            if (this.saveCart(cart)) {
                this.showMessage('تم إضافة المنتج للسلة بنجاح!', 'success');
                
                // إعادة توجيه للسلة بعد ثانيتين
                setTimeout(() => {
                    if (window.location.pathname.includes('products-pages')) {
                        window.location.href = '../cart.html';
                    } else {
                        window.location.href = 'cart.html';
                    }
                }, 1500);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('خطأ في إضافة المنتج للسلة:', error);
            this.showMessage('حدث خطأ، يرجى المحاولة مرة أخرى', 'error');
            return false;
        }
    }
    
    removeFromCart(id) {
        try {
            let cart = this.getCart();
            cart = cart.filter(item => item.id !== parseInt(id));
            this.saveCart(cart);
            this.showMessage('تم حذف المنتج من السلة', 'success');
            return true;
        } catch (error) {
            console.error('خطأ في حذف المنتج:', error);
            return false;
        }
    }
    
    updateQuantity(id, quantity) {
        try {
            let cart = this.getCart();
            const item = cart.find(item => item.id === parseInt(id));
            
            if (item) {
                if (quantity > 0) {
                    item.quantity = parseInt(quantity);
                } else {
                    cart = cart.filter(item => item.id !== parseInt(id));
                }
                this.saveCart(cart);
                return true;
            }
            return false;
        } catch (error) {
            console.error('خطأ في تحديث الكمية:', error);
            return false;
        }
    }
    
    clearCart() {
        try {
            localStorage.removeItem(this.storageKey);
            this.updateCartCount();
            this.dispatchCartUpdate();
            this.showMessage('تم مسح السلة بنجاح', 'success');
            return true;
        } catch (error) {
            console.error('خطأ في مسح السلة:', error);
            return false;
        }
    }
    
    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getCartItemsCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    updateCartCount() {
        const count = this.getCartItemsCount();
        const cartCountElements = document.querySelectorAll('.cart-count, #cart-count');
        
        cartCountElements.forEach(element => {
            if (count > 0) {
                element.textContent = count;
                element.style.display = 'inline';
            } else {
                element.style.display = 'none';
            }
        });
    }
    
    dispatchCartUpdate() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                cart: this.getCart(),
                count: this.getCartItemsCount(),
                total: this.getCartTotal()
            }
        });
        document.dispatchEvent(event);
    }
    
    bindEvents() {
        // ربط أزرار إضافة للسلة
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-button, .buy-button[data-product-id]')) {
                e.preventDefault();
                const button = e.target;
                const productId = button.getAttribute('data-product-id') || button.dataset.productId;
                const productTitle = button.getAttribute('data-product-title') || button.dataset.productTitle;
                const productPrice = button.getAttribute('data-product-price') || button.dataset.productPrice;
                const productImage = button.getAttribute('data-product-image') || button.dataset.productImage;
                
                if (productId && productTitle && productPrice) {
                    button.disabled = true;
                    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإضافة...';
                    
                    setTimeout(() => {
                        this.addToCart(productId, productTitle, productPrice, productImage);
                        button.disabled = false;
                        button.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>أضف للسلة - شحن مجاني';
                    }, 500);
                } else {
                    console.error('بيانات المنتج غير مكتملة');
                    this.showMessage('خطأ في بيانات المنتج', 'error');
                }
            }
        });
        
        // ربط أزرار حذف من السلة
        document.addEventListener('click', (e) => {
            if (e.target.matches('.remove-from-cart')) {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                if (productId && this.removeFromCart(productId)) {
                    location.reload();
                }
            }
        });
        
        // ربط تحديث الكميات
        document.addEventListener('change', (e) => {
            if (e.target.matches('.quantity-input')) {
                const productId = e.target.dataset.productId;
                const quantity = e.target.value;
                if (productId && this.updateQuantity(productId, quantity)) {
                    location.reload();
                }
            }
        });
    }
    
    showMessage(message, type = 'success') {
        // إنشاء رسالة تنبيه
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type === 'success' ? 'success' : 'danger'} cart-message`;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: none;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(messageElement);
        
        // إظهار الرسالة
        setTimeout(() => messageElement.style.transform = 'translateX(0)', 100);
        
        // إخفاء الرسالة تلقائياً
        setTimeout(() => {
            messageElement.style.transform = 'translateX(400px)';
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }
}

// تهيئة نظام السلة عند تحميل الصفحة
let cartManager;
document.addEventListener('DOMContentLoaded', function() {
    cartManager = new CartManager();
    
    // دوال عامة للتوافق مع الأكواد القديمة
    window.addToCart = function(id, title, price, image) {
        return cartManager.addToCart(id, title, price, image);
    };
    
    window.removeFromCart = function(id) {
        return cartManager.removeFromCart(id);
    };
    
    window.updateQuantity = function(id, quantity) {
        return cartManager.updateQuantity(id, quantity);
    };
    
    window.clearCart = function() {
        return cartManager.clearCart();
    };
    
    window.getCart = function() {
        return cartManager.getCart();
    };
    
    console.log('✅ نظام السلة المحسن جاهز للعمل');
});

// تصدير الفئة للاستخدام المتقدم
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
