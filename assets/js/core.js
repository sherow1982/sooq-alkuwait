// Core JavaScript للتطبيق - سوق الكويت
// تحسين الأداء والتنظيم

/**
 * متغيرات وثوابت عامة
 */
const CONFIG = {
    WHATSAPP_NUMBER: '201110760081',
    CURRENCY: 'د.ك',
    FREE_SHIPPING_THRESHOLD: 100,
    ANIMATION_DURATION: 300,
    ITEMS_PER_PAGE: 12
};

/**
 * فئة إدارة المنتجات
 */
class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.isLoading = false;
    }

    async loadProducts() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showLoading(true);
            
            const response = await fetch('products_data.json');
            if (!response.ok) throw new Error('فشل في تحميل المنتجات');
            
            this.products = await response.json();
            this.filteredProducts = [...this.products];
            
            this.renderProducts();
            this.showLoading(false);
        } catch (error) {
            console.error('خطأ في تحميل المنتجات:', error);
            this.showError('فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.');
        } finally {
            this.isLoading = false;
        }
    }

    renderProducts(page = 1) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const startIndex = (page - 1) * CONFIG.ITEMS_PER_PAGE;
        const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (page === 1) {
            grid.innerHTML = '';
        }

        productsToShow.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.style.animationDelay = `${index * 0.1}s`;
            productCard.classList.add('fade-in');
            grid.appendChild(productCard);
        });

        this.updateLoadMoreButton();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        const discount = product.price > product.sale_price 
            ? Math.round(((product.price - product.sale_price) / product.price) * 100)
            : 0;

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image_link}" alt="${product.title}" loading="lazy">
                ${discount > 0 ? `<span class="discount">خصم ${discount}%</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title" onclick="goToProduct('${this.generateProductUrl(product)}')">
                    ${product.title}
                </h3>
                <div class="product-price">
                    <span class="current-price">${product.sale_price} ${CONFIG.CURRENCY}</span>
                    ${product.price > product.sale_price ? 
                        `<span class="original-price">${product.price} ${CONFIG.CURRENCY}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="cartManager.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                    <button class="btn-whatsapp" onclick="contactWhatsApp('${product.title}', '${product.sale_price}')">
                        <i class="fab fa-whatsapp"></i> واتساب
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    generateProductUrl(product) {
        const translations = {
            'حصالة': 'piggy-bank',
            'صراف': 'atm',
            'أوتوماتيكية': 'automatic',
            'صفاية': 'strainer',
            'سلطة': 'salad',
            'شورت': 'shorts',
            'نسائي': 'women',
            'محول': 'converter',
            'كهرباء': 'electric',
            'شامبو': 'shampoo',
            'سيروم': 'serum',
            'روبوت': 'robot',
            'قهوة': 'coffee'
        };

        const cleanTitle = product.title.replace(/[^\w\s\u0600-\u06FF]/g, ' ').trim();
        const words = cleanTitle.split(/\s+/).slice(0, 4);
        const englishWords = [];

        words.forEach(word => {
            for (const [arabic, english] of Object.entries(translations)) {
                if (word.includes(arabic)) {
                    englishWords.push(english);
                    break;
                }
            }
        });

        const slug = (englishWords.length ? englishWords.join('-') : 'product') + '-' + product.id;
        return `/products-pages/${slug.toLowerCase().replace(/[^a-z0-9\-]/g, '')}.html`;
    }

    filterProducts(searchTerm = '') {
        if (!searchTerm.trim()) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => 
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        this.currentPage = 1;
        this.renderProducts();
    }

    updateLoadMoreButton() {
        const loadMoreContainer = document.querySelector('.load-more-container');
        if (!loadMoreContainer) return;

        const totalPages = Math.ceil(this.filteredProducts.length / CONFIG.ITEMS_PER_PAGE);
        const hasMore = this.currentPage < totalPages;

        if (hasMore) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }

    loadMore() {
        this.currentPage++;
        this.renderProducts(this.currentPage);
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        const grid = document.getElementById('products-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button onclick="productManager.loadProducts()" class="btn-retry">
                        إعادة المحاولة
                    </button>
                </div>
            `;
        }
    }
}

/**
 * فئة إدارة السلة
 */
class CartManager {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.updateCartDisplay();
    }

    addToCart(productId) {
        const product = productManager.products.find(p => p.id == productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id == productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: productId,
                title: product.title,
                price: product.price,
                sale_price: product.sale_price,
                image: product.image_link,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showAddToCartAnimation();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id != productId);
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id == productId);
        if (item && quantity > 0) {
            item.quantity = quantity;
        } else if (item && quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (parseFloat(item.sale_price) * item.quantity);
        }, 0);
    }

    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartBadge = document.querySelector('.cart-count');
        const count = this.getCartItemCount();

        if (cartCount) cartCount.textContent = count;
        if (cartBadge) {
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    showAddToCartAnimation() {
        // إنشاء إشعار مؤقت
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>تم إضافة المنتج إلى السلة</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    loadCartFromStorage() {
        try {
            const saved = localStorage.getItem('sooq_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('خطأ في تحميل السلة:', error);
            return [];
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('sooq_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('خطأ في حفظ السلة:', error);
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
    }
}

/**
 * فئة إدارة العد التنازلي
 */
class CountdownManager {
    constructor() {
        this.timers = new Map();
    }

    startCountdown(element, endTime, options = {}) {
        const timerId = this.generateTimerId();
        
        const timer = {
            element,
            endTime,
            options: {
                showDays: options.showDays || false,
                format: options.format || 'HH:MM:SS',
                onComplete: options.onComplete || (() => {}),
                labels: options.labels || {
                    days: 'يوم',
                    hours: 'ساعة',
                    minutes: 'دقيقة',
                    seconds: 'ثانية'
                }
            },
            interval: null
        };

        timer.interval = setInterval(() => {
            this.updateTimer(timerId, timer);
        }, 1000);

        this.timers.set(timerId, timer);
        this.updateTimer(timerId, timer); // تحديث فوري
        
        return timerId;
    }

    updateTimer(timerId, timer) {
        const now = new Date().getTime();
        const timeLeft = timer.endTime - now;

        if (timeLeft <= 0) {
            this.stopTimer(timerId);
            timer.element.textContent = '00:00:00';
            timer.options.onComplete();
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        let display = '';
        if (timer.options.showDays && days > 0) {
            display += String(days).padStart(2, '0') + ':';
        }
        display += String(hours).padStart(2, '0') + ':';
        display += String(minutes).padStart(2, '0') + ':';
        display += String(seconds).padStart(2, '0');

        timer.element.textContent = display;

        // إضافة تأثير نبض عندما يقل الوقت عن ساعة
        if (timeLeft < 3600000) {
            timer.element.classList.add('urgent');
        }
    }

    stopTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (timer && timer.interval) {
            clearInterval(timer.interval);
            this.timers.delete(timerId);
        }
    }

    generateTimerId() {
        return 'timer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // عداد تنازلي يومي (يعيد التعيين في منتصف الليل)
    startDailyCountdown(element) {
        const updateDaily = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            return this.startCountdown(element, tomorrow.getTime(), {
                onComplete: () => {
                    setTimeout(() => updateDaily(), 1000);
                }
            });
        };
        
        return updateDaily();
    }
}

/**
 * الوظائف المساعدة العامة
 */
function goToProduct(url) {
    window.location.href = url;
}

function contactWhatsApp(productTitle, price) {
    const message = encodeURIComponent(
        `مرحباً! أريد الاستفسار عن: ${productTitle} - السعر: ${price} ${CONFIG.CURRENCY}`
    );
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        productManager.filterProducts(searchInput.value);
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

// تهيئة التطبيق عند تحميل الصفحة
let productManager;
let cartManager;
let countdownManager;

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة المدراء
    productManager = new ProductManager();
    cartManager = new CartManager();
    countdownManager = new CountdownManager();
    
    // تحميل المنتجات
    productManager.loadProducts();
    
    // تهيئة العد التنازلي للصفحة الرئيسية
    const heroCountdown = document.querySelector('.hero-countdown');
    if (heroCountdown) {
        countdownManager.startDailyCountdown(heroCountdown);
    }
    
    // تهيئة البحث
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts();
            }, 300);
        });
    }
    
    // إغلاق القائمة المحمولة عند النقر خارجها
    document.addEventListener('click', (e) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // تحسين الأداء - lazy loading للصور
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// تصدير للاستخدام العام
window.productManager = productManager;
window.cartManager = cartManager;
window.countdownManager = countdownManager;
window.goToProduct = goToProduct;
window.contactWhatsApp = contactWhatsApp;
window.searchProducts = searchProducts;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;