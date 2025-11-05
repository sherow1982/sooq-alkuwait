// نظام السلة المحسن - سوق الكويت
// إصلاح شامل لزر السلة في جميع صفحات المنتجات

class SooqAlkuwaitCart {
    constructor() {
        this.storageKey = 'sooq-cart';
        this.init();
    }

    init() {
        // تحقق من تحميل DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPage());
        } else {
            this.setupPage();
        }
    }

    setupPage() {
        try {
            // تحديث عداد السلة
            this.updateCartCount();
            
            // إضافة معالج أحداث لأزرار الشراء
            this.attachBuyButtonListeners();
            
            console.log('✅ نظام السلة جاهز للعمل');
        } catch (error) {
            console.error('❌ خطأ في تهيئة نظام السلة:', error);
        }
    }

    attachBuyButtonListeners() {
        // البحث عن أزرار الشراء بطرق متعددة
        const buyButtons = [
            ...document.querySelectorAll('.buy-button'),
            ...document.querySelectorAll('button[onclick*="addToCart"]'),
            ...document.querySelectorAll('button:contains("اشتري")'),
            ...document.querySelectorAll('button:contains("أضف للسلة")'),
            ...document.querySelectorAll('a[onclick*="addToCart"]')
        ];

        buyButtons.forEach(button => {
            if (!button.hasAttribute('data-cart-fixed')) {
                button.setAttribute('data-cart-fixed', 'true');
                
                // إزالة معالجات الأحداث القديمة
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // إضافة معالج الحدث الجديد
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // استخراج معرف المنتج
                    const productId = this.extractProductId(newButton);
                    if (productId) {
                        this.addToCart(productId);
                    } else {
                        this.showNotification('❌ خطأ: لم يتم العثور على معرف المنتج', 'error');
                    }
                });
                
                console.log('🔧 تم إصلاح زر:', newButton);
            }
        });
    }

    extractProductId(button) {
        // طرق متعددة لاستخراج معرف المنتج
        
        // من onclick attribute
        const onClickAttr = button.getAttribute('onclick') || '';
        const onClickMatch = onClickAttr.match(/addToCart\((\d+)\)/);
        if (onClickMatch) {
            return parseInt(onClickMatch[1]);
        }
        
        // من data attributes
        const dataId = button.getAttribute('data-product-id');
        if (dataId) {
            return parseInt(dataId);
        }
        
        // من URL الصفحة الحالية
        const urlMatch = window.location.pathname.match(/product-(\d+)/);
        if (urlMatch) {
            return parseInt(urlMatch[1]);
        }
        
        // من عنوان الصفحة
        const titleMatch = document.title.match(/(\d+)/);
        if (titleMatch) {
            return parseInt(titleMatch[1]);
        }
        
        console.warn('⚠️ لم يتم العثور على معرف المنتج');
        return null;
    }

    addToCart(productId) {
        try {
            // إنشاء كائن المنتج من بيانات الصفحة
            const product = this.extractProductData(productId);
            
            if (!product) {
                this.showNotification('❌ خطأ في استخراج بيانات المنتج', 'error');
                return;
            }

            // قراءة السلة الحالية
            let cart = this.getCart();
            
            // تحقق من وجود المنتج
            const existingIndex = cart.findIndex(item => item.id === productId);
            
            if (existingIndex !== -1) {
                // زيادة الكمية
                cart[existingIndex].quantity += 1;
                cart[existingIndex].updated_at = new Date().toISOString();
            } else {
                // إضافة منتج جديد
                cart.push({
                    ...product,
                    quantity: 1,
                    added_at: new Date().toISOString()
                });
            }
            
            // حفظ السلة
            this.saveCart(cart);
            
            // تحديث واجهة المستخدم
            this.updateCartCount();
            this.animateButton();
            
            // إشعار النجاح
            this.showNotification(`✅ تم إضافة "${product.title}" للسلة بنجاح!`, 'success');
            
            // توجيه للسلة (اختياري)
            setTimeout(() => {
                if (confirm('تم إضافة المنتج للسلة. هل تريد الانتقال لصفحة السلة؟')) {
                    window.location.href = '../cart.html';
                }
            }, 2000);
            
        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            this.showNotification('❌ حدث خطأ أثناء إضافة المنتج', 'error');
        }
    }

    extractProductData(productId) {
        try {
            // استخراج العنوان
            const titleElement = document.querySelector('h1') || 
                                document.querySelector('.product-title') ||
                                document.querySelector('[class*="title"]');
            
            // استخراج الصورة
            const imageElement = document.querySelector('.product-image') || 
                                document.querySelector('img[alt*="منتج"]') ||
                                document.querySelector('img[src*="ecomerg"]') ||
                                document.querySelector('img');
            
            // استخراج السعر
            const priceElement = document.querySelector('.sale-price') || 
                                document.querySelector('.price') ||
                                document.querySelector('[class*="price"]');
            
            if (!titleElement || !priceElement) {
                throw new Error('عناصر المنتج الأساسية مفقودة');
            }
            
            // تنظيف وتحويل السعر
            const priceText = priceElement.textContent.replace(/[^\d.]/g, '');
            const price = parseFloat(priceText);
            
            if (isNaN(price) || price <= 0) {
                throw new Error('سعر المنتج غير صالح');
            }
            
            return {
                id: productId,
                title: titleElement.textContent.trim(),
                image_link: imageElement ? imageElement.src : '',
                sale_price: price,
                product_link: window.location.href,
                category: this.extractCategory()
            };
            
        } catch (error) {
            console.error('خطأ في استخراج بيانات المنتج:', error);
            return null;
        }
    }

    extractCategory() {
        // استخراج الفئة من breadcrumb أو رابط الفئة
        const breadcrumbs = document.querySelectorAll('.breadcrumb a, nav a');
        for (let link of breadcrumbs) {
            if (link.href.includes('categories/')) {
                return link.textContent.trim();
            }
        }
        return 'منتجات متنوعة';
    }

    getCart() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (error) {
            console.error('خطأ في قراءة السلة:', error);
            return [];
        }
    }

    saveCart(cart) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cart));
        } catch (error) {
            console.error('خطأ في حفظ السلة:', error);
            throw error;
        }
    }

    updateCartCount() {
        try {
            const cart = this.getCart();
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            
            // تحديث عدادات السلة
            const countElements = [
                ...document.querySelectorAll('.cart-count'),
                ...document.querySelectorAll('[data-cart-count]'),
                ...document.querySelectorAll('#cart-count')
            ];
            
            countElements.forEach(element => {
                element.textContent = totalItems;
                element.style.display = totalItems > 0 ? 'inline-block' : 'none';
            });
            
            // تحديث روابط السلة
            const cartLinks = document.querySelectorAll('a[href*="cart.html"]');
            cartLinks.forEach(link => {
                const icon = '<i class="fas fa-shopping-cart me-1"></i>';
                link.innerHTML = totalItems > 0 ? 
                    `${icon}السلة (${totalItems})` : 
                    `${icon}السلة`;
            });
            
        } catch (error) {
            console.error('خطأ في تحديث عداد السلة:', error);
        }
    }

    animateButton() {
        const buttons = document.querySelectorAll('.buy-button, button[data-cart-fixed]');
        
        buttons.forEach(button => {
            if (button.hasAttribute('data-animating')) return;
            
            button.setAttribute('data-animating', 'true');
            const originalText = button.innerHTML;
            const originalStyle = button.style.cssText;
            
            // مرحلة التحميل
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإضافة...';
            button.disabled = true;
            button.style.background = 'linear-gradient(45deg, #6c757d, #495057)';
            
            setTimeout(() => {
                // مرحلة النجاح
                button.innerHTML = '<i class="fas fa-check me-2"></i>تمت الإضافة!';
                button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
                
                setTimeout(() => {
                    // العودة للحالة الأصلية
                    button.innerHTML = originalText;
                    button.style.cssText = originalStyle;
                    button.disabled = false;
                    button.removeAttribute('data-animating');
                }, 2000);
            }, 1000);
        });
    }

    showNotification(message, type = 'success') {
        // إزالة الإشعارات السابقة
        document.querySelectorAll('.sooq-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'sooq-notification';
        
        const colors = {
            success: 'linear-gradient(135deg, #28a745, #20c997)',
            error: 'linear-gradient(135deg, #dc3545, #c82333)',
            info: 'linear-gradient(135deg, #17a2b8, #007bff)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 350px;
            font-family: 'Cairo', Arial, sans-serif;
            font-size: 14px;
            direction: rtl;
        `;
        
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 50);
        
        // إخفاء الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // دالة مساعدة للتوافق مع الكود القديم
    static addToCart(productId) {
        if (window.sooqCart) {
            window.sooqCart.addToCart(productId);
        }
    }
}

// إنشاء مثيل عام للسلة
window.sooqCart = new SooqAlkuwaitCart();

// دالة عامة للتوافق مع الكود الحالي
function addToCart(productId) {
    if (window.sooqCart) {
        window.sooqCart.addToCart(productId);
    } else {
        console.error('❌ نظام السلة غير مُحمل');
    }
}

// تصدير للوحدات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SooqAlkuwaitCart;
}

console.log('🛒 تم تحميل نظام السلة المحسن - إصدار 2.0');