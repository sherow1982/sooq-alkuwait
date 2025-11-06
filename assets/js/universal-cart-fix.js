/**
 * إصلاح شامل وفوري لجميع صفحات المنتجات
 * Universal Cart Fix for All Product Pages
 * Version: Universal Emergency 2.0
 * يعمل على أي صفحة بمجرد إضافة هذا الملف
 */

(function() {
    'use strict';
    
    console.log('🚀 تم تحميل نظام الإصلاح الشامل v2.0');
    
    // إعدادات النظام
    const CONFIG = {
        cartStorage: 'cart_items',
        currency: 'د.ك',
        whatsappNumber: '201110760081',
        redirectDelay: 1200,
        autoRedirect: true
    };
    
    // حالة السلة
    let cartState = {
        items: [],
        count: 0,
        total: 0
    };
    
    /**
     * تحميل بيانات السلة
     */
    function loadCart() {
        try {
            const stored = localStorage.getItem(CONFIG.cartStorage);
            if (stored) {
                const data = JSON.parse(stored);
                cartState.items = data.items || [];
                updateCartStats();
                console.log(`📦 تم تحميل ${cartState.count} منتج من السلة`);
            }
        } catch (e) {
            console.warn('⚠️ خطأ في تحميل بيانات السلة:', e);
            cartState = { items: [], count: 0, total: 0 };
        }
    }
    
    /**
     * حفظ بيانات السلة
     */
    function saveCart() {
        try {
            const data = {
                items: cartState.items,
                timestamp: Date.now()
            };
            localStorage.setItem(CONFIG.cartStorage, JSON.stringify(data));
            console.log('📦 تم حفظ بيانات السلة');
        } catch (e) {
            console.error('❌ خطأ في حفظ بيانات السلة:', e);
        }
    }
    
    /**
     * تحديث إحصائيات السلة
     */
    function updateCartStats() {
        cartState.count = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
        cartState.total = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    /**
     * عرض إشعار
     */
    function showNotification(message, type = 'success') {
        let container = document.getElementById('universal-notifications');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'universal-notifications';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                max-width: 350px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        const colors = {
            success: { bg: '#28a745', icon: 'fas fa-check-circle' },
            error: { bg: '#dc3545', icon: 'fas fa-exclamation-circle' },
            info: { bg: '#17a2b8', icon: 'fas fa-info-circle' }
        };
        
        const color = colors[type] || colors.success;
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: linear-gradient(135deg, ${color.bg}, ${color.bg}dd);
            color: white;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            font-weight: 600;
            text-align: center;
            pointer-events: auto;
            border: 2px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
        `;
        
        notification.innerHTML = `<i class="${color.icon} me-2"></i>${message}`;
        container.appendChild(notification);
        
        // عرض الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // إخفاء الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }, 3500);
    }
    
    /**
     * تحديث عداد السلة
     */
    function updateCartCounter() {
        const counters = document.querySelectorAll('.cart-count, #cart-count, [class*="cart-count"]');
        
        counters.forEach(counter => {
            counter.textContent = cartState.count;
            counter.style.display = cartState.count > 0 ? 'inline-block' : 'none';
            
            // تأثير بصري
            if (cartState.count > 0) {
                counter.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    counter.style.animation = '';
                }, 500);
            }
        });
        
        console.log(`🔢 تم تحديث عداد السلة: ${cartState.count}`);
    }
    
    /**
     * استخراج بيانات المنتج
     */
    function extractProductData(productId) {
        // عنوان المنتج
        const titleSelectors = ['h1', '.product-title', '.product-name', 'title'];
        let title = 'منتج غير محدد';
        
        for (let selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const text = (element.textContent || element.innerText || '').trim();
                if (text && text.length > 3) {
                    title = text.replace(' | سوق الكويت', '').replace(' - سوق الكويت', '').trim();
                    break;
                }
            }
        }
        
        // سعر المنتج
        const priceSelectors = ['.sale-price', '.price', '.product-price', '[data-price]'];
        let price = 15.000;
        
        for (let selector of priceSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const priceText = element.textContent || element.getAttribute('data-price') || '';
                const extractedPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
                if (extractedPrice > 0) {
                    price = extractedPrice;
                    break;
                }
            }
        }
        
        // صورة المنتج
        const imageSelectors = ['.product-image', 'img[alt*="product"]', 'img[src*="ecomerg"]', 'img[src*="http"]'];
        let image = 'https://via.placeholder.com/300x300/007bff/ffffff?text=منتج';
        
        for (let selector of imageSelectors) {
            const element = document.querySelector(selector);
            if (element && element.src && element.src.startsWith('http')) {
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
    }
    
    /**
     * إضافة منتج للسلة
     */
    function addProductToCart(productData) {
        console.log('➕ إضافة منتج للسلة:', productData);
        
        const existingIndex = cartState.items.findIndex(item => item.id === productData.id);
        
        if (existingIndex !== -1) {
            cartState.items[existingIndex].quantity += 1;
            showNotification(`تم زيادة كمية المنتج إلى ${cartState.items[existingIndex].quantity} ✅`);
        } else {
            cartState.items.push(productData);
            showNotification(`تم إضافة المنتج للسلة 🛍️`);
        }
        
        updateCartStats();
        saveCart();
        updateCartCounter();
        
        // انتقال تلقائي
        if (CONFIG.autoRedirect) {
            setTimeout(() => {
                showNotification('جاري الانتقال إلى السلة... 🛍️', 'info');
                
                setTimeout(() => {
                    const currentPath = window.location.pathname;
                    let cartUrl = 'cart.html?success=1';
                    
                    if (currentPath.includes('products-pages')) {
                        cartUrl = '../cart.html?success=1';
                    } else if (currentPath.includes('categories')) {
                        cartUrl = '../cart.html?success=1';
                    }
                    
                    console.log(`🔄 انتقال إلى: ${cartUrl}`);
                    window.location.href = cartUrl;
                }, 700);
            }, CONFIG.redirectDelay);
        }
    }
    
    /**
     * إصلاح أزرار السلة
     */
    function fixCartButtons() {
        let fixedCount = 0;
        
        // إصلاح أزرار onclick
        const onclickButtons = document.querySelectorAll('[onclick*="addToCart"]');
        onclickButtons.forEach(button => {
            const onclick = button.getAttribute('onclick');
            const match = onclick ? onclick.match(/addToCart\\((\d+)\\)/) : null;
            
            if (match) {
                const productId = match[1];
                
                // تحديث الخصائص
                button.setAttribute('data-product-id', productId);
                button.classList.add('universal-cart-btn');
                button.removeAttribute('onclick');
                
                // إضافة معالج جديد
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const productData = extractProductData(productId);
                    addProductToCart(productData);
                    
                    // تأثير بصري
                    button.style.background = '#28a745';
                    button.innerHTML = '<i class="fas fa-check me-2"></i>تم الإضافة!';
                    
                    setTimeout(() => {
                        button.style.background = '';
                        button.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>أضف للسلة';
                    }, 1500);
                });
                
                fixedCount++;
                console.log(`✅ تم إصلاح زر المنتج ${productId}`);
            }
        });
        
        // إصلاح أزرار data-product-id الموجودة
        const dataButtons = document.querySelectorAll('[data-product-id]:not(.universal-cart-btn)');
        dataButtons.forEach(button => {
            const productId = button.getAttribute('data-product-id');
            if (productId) {
                button.classList.add('universal-cart-btn');
                
                // إزالة معالجات قديمة
                button.removeAttribute('onclick');
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // إضافة معالج جديد
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const productData = extractProductData(productId);
                    addProductToCart(productData);
                    
                    // تأثير بصري
                    newButton.style.background = '#28a745';
                    const originalText = newButton.innerHTML;
                    newButton.innerHTML = '<i class="fas fa-check me-2"></i>تم الإضافة!';
                    
                    setTimeout(() => {
                        newButton.style.background = '';
                        newButton.innerHTML = originalText;
                    }, 1500);
                });
                
                fixedCount++;
                console.log(`✅ تم تحسين زر المنتج ${productId}`);
            }
        });
        
        return fixedCount;
    }
    
    /**
     * إضافة عداد السلة
     */
    function addCartCounter() {
        const cartLinks = document.querySelectorAll('a[href*="cart.html"]');
        let addedCounters = 0;
        
        cartLinks.forEach(link => {
            if (!link.querySelector('.cart-count, #cart-count')) {
                const counter = document.createElement('span');
                counter.className = 'badge bg-danger cart-count';
                counter.id = 'cart-count';
                counter.textContent = '0';
                counter.style.display = 'none';
                counter.style.marginRight = '5px';
                
                link.appendChild(counter);
                addedCounters++;
            }
        });
        
        if (addedCounters > 0) {
            console.log(`🔢 تم إضافة ${addedCounters} عداد سلة`);
        }
    }
    
    /**
     * إضافة CSS محسن
     */
    function addUniversalStyles() {
        if (document.getElementById('universal-cart-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'universal-cart-styles';
        styles.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .universal-cart-btn {
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                position: relative;
                overflow: hidden;
            }
            
            .universal-cart-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important;
            }
            
            .universal-cart-btn:active {
                transform: scale(0.95) !important;
            }
            
            .cart-count {
                background: #dc3545 !important;
                color: white !important;
                border-radius: 50% !important;
                padding: 4px 8px !important;
                font-size: 0.75em !important;
                font-weight: bold !important;
                min-width: 20px !important;
                text-align: center !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin-right: 8px !important;
            }
            
            #universal-notifications {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 999999 !important;
                max-width: 350px !important;
                pointer-events: none !important;
            }
            
            @media (max-width: 768px) {
                #universal-notifications {
                    right: 10px !important;
                    left: 10px !important;
                    max-width: none !important;
                }
            }
        `;
        
        document.head.appendChild(styles);
        console.log('🎨 تم إضافة CSS محسن');
    }
    
    /**
     * الإعداد الرئيسي
     */
    function initUniversalCartFix() {
        console.log('🚀 بدء الإصلاح الشامل...');
        
        // 1. تحميل بيانات السلة
        loadCart();
        
        // 2. إضافة CSS
        addUniversalStyles();
        
        // 3. إضافة عدادات السلة
        addCartCounter();
        
        // 4. إصلاح الأزرار
        const fixedButtons = fixCartButtons();
        
        // 5. تحديث عداد السلة
        updateCartCounter();
        
        console.log(`🎉 تم إصلاح ${fixedButtons} زر بنجاح!`);
        showNotification(`تم إصلاح ${fixedButtons} زر سلة بنجاح! ✨`, 'success');
        
        // 6. معالجة معامل URL (إضافة ناجحة)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === '1' || urlParams.get('added') === 'true') {
            setTimeout(() => {
                showNotification('مرحباً! تم إضافة المنتج بنجاح 🎉', 'success');
            }, 800);
        }
    }
    
    /**
     * تشغيل عند استعداد الصفحة
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initUniversalCartFix, 300);
        });
    } else {
        setTimeout(initUniversalCartFix, 100);
    }
    
    /**
     * معالجة تغييرات DOM ديناميكية
     */
    const observer = new MutationObserver(function(mutations) {
        let shouldRefix = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const hasCartButtons = node.querySelectorAll && node.querySelectorAll('[onclick*="addToCart"], [data-product-id]').length > 0;
                        if (hasCartButtons) {
                            shouldRefix = true;
                        }
                    }
                });
            }
        });
        
        if (shouldRefix) {
            console.log('🔄 إعادة إصلاح بعد تغيير DOM...');
            setTimeout(() => {
                const newFixed = fixCartButtons();
                if (newFixed > 0) {
                    console.log(`✅ تم إصلاح ${newFixed} زر إضافي`);
                }
            }, 100);
        }
    });
    
    // مراقبة تغييرات DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // تصدير الوظائف للاستخدام الخارجي
    window.universalCartFix = {
        addToCart: addProductToCart,
        fixButtons: fixCartButtons,
        getCartState: () => cartState,
        config: CONFIG
    };
    
    console.log('✨ نظام الإصلاح الشامل جاهز للعمل!');
    
})();