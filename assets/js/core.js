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
 * تحميل استايل bulk للألوان الوطنية على جميع الصفحات
 */
(function(){
  try{
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/css/bulk-kuwait-flag.css';
    document.head.appendChild(link);

    var boot=document.createElement('script');
    boot.src='assets/js/boot-bulk-header-footer.js';
    boot.defer=true;document.head.appendChild(boot);
  }catch(e){console&&console.warn('bulk style load error',e)}
})();

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
class CountdownManager { /* كما هو */ }

/** وظائف المساعدة وباقي الكود كما هو بدون تغيير **/
