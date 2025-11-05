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
    ITEMS_PER_PAGE: 1977  // تم تغيير العدد لعرض جميع المنتجات
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
            
            // تحميل من المسار الجديد الصحيح
            const response = await fetch('https://raw.githubusercontent.com/sherow1982/sooq-alkuwait/main/products_data.json');
            if (!response.ok) {
                // محاولة تحميل من المسار المحلي كخطة احتياطية
                const fallbackResponse = await fetch('products_data.json');
                if (!fallbackResponse.ok) throw new Error('فشل في تحميل المنتجات');
                this.products = await fallbackResponse.json();
            } else {
                this.products = await response.json();
            }
            
            this.filteredProducts = [...this.products];
            
            console.log(`تم تحميل ${this.products.length} منتج بنجاح من الملف الجديد`);
            
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

        // عرض جميع المنتجات دفعة واحدة
        const startIndex = (page - 1) * CONFIG.ITEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + CONFIG.ITEMS_PER_PAGE, this.filteredProducts.length);
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (page === 1) {
            grid.innerHTML = '';
        }

        // إضافة شريط تقدم للتحميل
        const progressBar = this.createProgressBar();
        if (page === 1) grid.appendChild(progressBar);

        // تحميل المنتجات بشكل تدريجي لتحسين الأداء
        const batchSize = 50; // تحميل 50 منتج في كل دفعة
        let currentBatch = 0;
        
        const loadBatch = () => {
            const batchStart = currentBatch * batchSize;
            const batchEnd = Math.min(batchStart + batchSize, productsToShow.length);
            const batch = productsToShow.slice(batchStart, batchEnd);
            
            batch.forEach((product, index) => {
                const productCard = this.createProductCard(product);
                productCard.style.animationDelay = `${(batchStart + index) * 0.02}s`;
                productCard.classList.add('fade-in');
                grid.appendChild(productCard);
            });
            
            // تحديث شريط التقدم
            const progress = ((batchEnd) / productsToShow.length) * 100;
            this.updateProgressBar(progress);
            
            currentBatch++;
            
            if (batchEnd < productsToShow.length) {
                setTimeout(loadBatch, 100); // تأخير قصير بين الدفعات
            } else {
                // إزالة شريط التقدم عند الانتهاء
                setTimeout(() => {
                    if (progressBar && progressBar.parentNode) {
                        progressBar.remove();
                    }
                }, 1000);
            }
        };
        
        loadBatch();
        this.updateLoadMoreButton();
    }

    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'loading-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <p>جاري تحميل المنتجات...</p>
        `;
        return progressContainer;
    }

    updateProgressBar(percentage) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        const discount = product.price > product.sale_price 
            ? Math.round(((product.price - product.sale_price) / product.price) * 100)
            : 0;

        // التأكد من وجود رابط الصورة الحقيقي من الملف المحدث
        const imageUrl = product.image_link || 'assets/img/placeholder-300x220.jpg';
        const productTitle = product.title || 'منتج غير محدد';
        const productDescription = product.description || 'وصف غير متوفر';
        const currentPrice = product.sale_price || product.price || 0;
        const originalPrice = product.price || currentPrice;

        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${productTitle}" loading="lazy" onerror="this.src='assets/img/placeholder-300x220.jpg'">
                ${discount > 0 ? `<span class="discount">خصم ${discount}%</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title" onclick="goToProduct('${this.generateProductUrl(product)}')">
                    ${productTitle}
                </h3>
                <p class="product-description">${productDescription.substring(0, 100)}${productDescription.length > 100 ? '...' : ''}</p>
                <div class="product-price">
                    <span class="current-price">${currentPrice} ${CONFIG.CURRENCY}</span>
                    ${originalPrice > currentPrice ? 
                        `<span class="original-price">${originalPrice} ${CONFIG.CURRENCY}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="cartManager.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                    <button class="btn-whatsapp" onclick="contactWhatsApp('${productTitle.replace(/'/g, '\\\'').replace(/"/g, '\\"')}', '${currentPrice}')">
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
            'قهوة': 'coffee',
            'جهاز': 'device',
            'منتج': 'product',
            'كريم': 'cream',
            'زيت': 'oil',
            'عطر': 'perfume',
            'لعبة': 'toy',
            'ماكينة': 'machine',
            'مروحة': 'fan',
            'مصباح': 'lamp',
            'حقيبة': 'bag',
            'ساعة': 'watch',
            'كاميرا': 'camera',
            'سيارة': 'car',
            'طائرة': 'plane',
            'مكنسة': 'vacuum',
            'خلاط': 'blender',
            'كشاف': 'flashlight'
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
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        this.currentPage = 1;
        this.renderProducts();
        
        console.log(`تمت فلترة ${this.filteredProducts.length} منتج من أصل ${this.products.length}`);
        
        // عرض رسالة في حالة عدم وجود نتائج
        if (this.filteredProducts.length === 0) {
            const grid = document.getElementById('products-grid');
            if (grid) {
                grid.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>لا توجد منتجات مطابقة</h3>
                        <p>جرب كلمات بحث أخرى</p>
                    </div>
                `;
            }
        }
    }

    updateLoadMoreButton() {
        // إخفاء زر "تحميل المزيد" لأننا نعرض جميع المنتجات
        const loadMoreContainer = document.querySelector('.load-more-container');
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }
    }

    loadMore() {
        // لا حاجة لهذه الوظيفة لأننا نعرض جميع المنتجات
        return;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'flex' : 'none';
            if (show) {
                loading.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>جاري تحميل ${this.products.length || 1977} منتج...</p>
                    </div>
                `;
            }
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
        this.showAddToCartAnimation(product.title);
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
            return total + (parseFloat(item.sale_price || item.price) * item.quantity);
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

    showAddToCartAnimation(productTitle = 'المنتج') {
        // إنشاء إشعار مؤقت
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>تم إضافة "${productTitle}" إلى السلة</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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
 * وظائف مساعدة
 */
function goToProduct(url) {
    if (url && url !== '#') {
        window.location.href = url;
    }
}

function contactWhatsApp(productName, price) {
    const message = `مرحباً، أود الاستفسار عن: ${productName} بسعر ${price} ${CONFIG.CURRENCY}`;
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function showCart() {
    // إظهار نافذة السلة
    console.log('عرض السلة');
}

// تهيئة المدراء عند تحميل الصفحة
let productManager, cartManager;

document.addEventListener('DOMContentLoaded', function() {
    productManager = new ProductManager();
    cartManager = new CartManager();
    
    // تحميل المنتجات إذا كان هناك شبكة منتجات
    if (document.getElementById('products-grid')) {
        productManager.loadProducts();
        
        // إضافة عداد المنتجات في الواجهة
        const productsHeader = document.querySelector('.products-header');
        if (productsHeader) {
            const counter = document.createElement('div');
            counter.className = 'products-counter';
            counter.innerHTML = `<span id="products-count">جاري التحميل...</span>`;
            productsHeader.appendChild(counter);
            
            // تحديث العداد بعد تحميل المنتجات
            setTimeout(() => {
                const countElement = document.getElementById('products-count');
                if (countElement) {
                    countElement.textContent = `إجمالي المنتجات: ${productManager.products.length || 1977}`;
                }
            }, 2000);
        }
    }
    
    // إعداد البحث
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            productManager.filterProducts(this.value);
            
            // تحديث عداد المنتجات المفلترة
            setTimeout(() => {
                const countElement = document.getElementById('products-count');
                if (countElement) {
                    const filteredCount = productManager.filteredProducts.length;
                    const totalCount = productManager.products.length;
                    if (this.value.trim()) {
                        countElement.textContent = `عرض ${filteredCount} من أصل ${totalCount} منتج`;
                    } else {
                        countElement.textContent = `إجمالي المنتجات: ${totalCount}`;
                    }
                }
            }, 100);
        });
    }
    
    // إعداد زر تحميل المزيد (مخفي الآن)
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none'; // إخفاء الزر لأننا نعرض جميع المنتجات
    }
    
    console.log('تم تهيئة التطبيق بنجاح - جاهز لعرض جميع المنتجات البالغ عددها 1977');
});

// تصدير المدراء للاستخدام العام
window.productManager = productManager;
window.cartManager = cartManager;
window.goToProduct = goToProduct;
window.contactWhatsApp = contactWhatsApp;
window.showCart = showCart;