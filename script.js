// Global variables
let products = [];
let filteredProducts = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 12;
const WHATSAPP_NUMBER = "201110760081";

// Advanced Arabic Router - يحل مشكلة عرض المنتجات
class SmartArabicRouter {
    constructor() {
        this.products = [];
        this.initRouter();
    }

    async initRouter() {
        await this.loadProducts();
        const currentPath = this.getCurrentPath();
        
        if (this.isProductPath(currentPath)) {
            console.log('🔍 البحث عن منتج للرابط:', currentPath);
            const product = this.findProductByPath(currentPath);
            
            if (product) {
                console.log('✅ تم العثور على المنتج:', product.title);
                this.renderProductPage(product);
            } else {
                console.log('❌ لم يتم العثور على المنتج');
                this.renderNotFound();
            }
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/products.json');
            this.products = await response.json();
            console.log(`📦 تم تحميل ${this.products.length} منتج للراوتر`);
        } catch (error) {
            console.error('❌ خطأ تحميل المنتجات:', error);
        }
    }

    getCurrentPath() {
        const params = new URLSearchParams(window.location.search);
        return params.get('path') || window.location.pathname;
    }

    isProductPath(path) {
        const productPaths = ['/اطفال/', '/مطبخ/', '/ملابس/', '/الكترونيات/', '/تجميل/', '/منتجات/'];
        return productPaths.some(p => path.startsWith(p));
    }

    findProductByPath(targetPath) {
        // بحث مباشر
        let product = this.products.find(p => p.seo_url === targetPath);
        
        if (!product) {
            // بحث ذكي - يبحث عن روابط تبدأ بنفس النص
            product = this.products.find(p => 
                targetPath.startsWith(p.seo_url) || 
                p.seo_url.startsWith(targetPath)
            );
        }
        
        if (!product) {
            // بحث بالـ ID إذا كان الرابط يحتوي رقم
            const idMatch = targetPath.match(/\d+/);
            if (idMatch) {
                const id = parseInt(idMatch[0]);
                product = this.products.find(p => p.id === id);
            }
        }
        
        return product;
    }

    renderProductPage(product) {
        const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
        
        // تحديث العنوان
        document.title = `${product.title} - سوق الكويت`;
        
        // HTML صفحة المنتج
        const productHTML = `
            <div class="container" style="margin-top: 120px; padding: 2rem 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
                    <div class="product-image-detail">
                        <img src="${product.image}" alt="${product.title}" 
                             style="width: 100%; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.15);"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQ2Fpcm8sQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Yp9mE2LXZiNix2Kkg2LrZitixINmF2KrYp9it2Kk8L3RleHQ+PC9zdmc+'">
                    </div>
                    <div class="product-info-detail">
                        <div style="background: var(--soft-gray); padding: 1.5rem; border-radius: 15px; margin-bottom: 1rem;">
                            <span style="background: var(--kuwait-green); color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">${product.category}</span>
                        </div>
                        
                        <h1 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--kuwait-black); line-height: 1.3;">${product.title}</h1>
                        
                        <div style="background: linear-gradient(135deg, var(--kuwait-green), #00a651); color: white; padding: 2rem; border-radius: 20px; margin: 2rem 0; text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem;">${product.sale_price} د.ك</div>
                            ${product.price > product.sale_price ? `
                                <div style="opacity: 0.9; font-size: 1.2rem;">
                                    <span style="text-decoration: line-through;">${product.price} د.ك</span>
                                    <span style="background: var(--kuwait-red); padding: 0.2rem 0.8rem; border-radius: 10px; margin-right: 1rem; font-weight: 700;">وفّر ${discount}%</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div style="background: white; padding: 2rem; border-radius: 15px; margin: 2rem 0; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                            <div style="line-height: 1.8; white-space: pre-line; color: var(--dark-gray);">${product.description}</div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin: 2rem 0;">
                            <button onclick="addToCartProduct(${product.id})" 
                                    style="flex: 1; background: linear-gradient(135deg, var(--kuwait-green), #008a44); color: white; border: none; padding: 1.2rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.2rem; cursor: pointer; box-shadow: 0 6px 20px rgba(0,166,81,0.3);">
                                <i class="fas fa-shopping-cart"></i> أضف للسلة واطلب الآن
                            </button>
                            <button onclick="contactWhatsAppProduct(${product.id})" 
                                    style="flex: 1; background: #25D366; color: white; border: none; padding: 1.2rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.2rem; cursor: pointer; box-shadow: 0 6px 20px rgba(37,211,102,0.3);">
                                <i class="fab fa-whatsapp"></i> اسأل عبر واتساب
                            </button>
                        </div>
                        
                        <div style="text-align: center; margin: 2rem 0;">
                            <a href="/" style="background: var(--dark-gray); color: white; padding: 1rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
                                <i class="fas fa-arrow-right"></i> العودة للمتجر
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // استبدال محتوى الصفحة
        const main = document.querySelector('main') || document.querySelector('.products-section') || document.querySelector('.hero');
        if (main) {
            main.innerHTML = productHTML;
        } else {
            document.body.innerHTML = productHTML;
            this.addBasicHeader();
        }
        
        // إضافة منتج للذاكرة المحلية
        localStorage.setItem('currentViewedProduct', JSON.stringify(product));
    }

    renderNotFound() {
        const notFoundHTML = `
            <div class="container" style="margin-top: 120px; text-align: center; padding: 4rem 0;">
                <div style="background: white; padding: 3rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h1 style="font-size: 4rem; color: var(--kuwait-red); margin-bottom: 1rem;">404</h1>
                    <h2 style="margin-bottom: 2rem; color: var(--kuwait-black);">المنتج غير موجود</h2>
                    <p style="margin-bottom: 3rem; color: #666; font-size: 1.1rem;">عذراً، المنتج المطلوب غير متاح حالياً أو تم نقله</p>
                    <a href="/" style="background: linear-gradient(135deg, var(--kuwait-green), #008a44); color: white; padding: 1.2rem 3rem; border-radius: 25px; text-decoration: none; font-weight: 700; font-size: 1.1rem; display: inline-block; box-shadow: 0 6px 20px rgba(0,166,81,0.3);">
                        <i class="fas fa-home"></i> العودة للرئيسية
                    </a>
                </div>
            </div>
        `;
        
        const main = document.querySelector('main') || document.querySelector('.products-section');
        if (main) {
            main.innerHTML = notFoundHTML;
        }
    }

    addBasicHeader() {
        const header = `
            <header class="header">
                <div class="container">
                    <div class="nav-wrapper">
                        <div class="logo">
                            <h1><a href="/" style="color: var(--luxury-gold); text-decoration: none;"><i class="fas fa-shopping-bag"></i> سوق الكويت</a></h1>
                        </div>
                    </div>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', header);
    }
}

// Load products data for homepage
async function loadProducts() {
    try {
        const response = await fetch('/products.json');
        products = await response.json();
        filteredProducts = products;
        displayProducts();
        updateCartUI();
        console.log(`✅ تم تحميل ${products.length} منتج للصفحة الرئيسية`);
    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
    }
}

// Add to cart from product page
function addToCartProduct(productId) {
    // محاولة الحصول على المنتج من عدة مصادر
    let product = products.find(p => p.id === productId);
    
    if (!product) {
        // من الذاكرة المحلية إذا كنا في صفحة منتج
        const stored = localStorage.getItem('currentViewedProduct');
        if (stored) {
            product = JSON.parse(stored);
        }
    }
    
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('تم إضافة المنتج للسلة بنجاح! 🛒');
    
    // الانتقال للسلة
    setTimeout(() => {
        window.location.href = '/cart.html';
    }, 1000);
}

// Contact WhatsApp from product page
function contactWhatsAppProduct(productId) {
    const stored = localStorage.getItem('currentViewedProduct');
    const product = stored ? JSON.parse(stored) : products.find(p => p.id === productId);
    
    if (!product) return;
    
    const message = `مرحباً! 🛍\\n\\nأريد الاستفسار عن هذا المنتج:\\n\\n*${product.title}*\\n\\nالسعر: ${product.sale_price} د.ك\\n\\nشكراً لكم 🙏`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Create product URL
function createProductURL(product) {
    return product.seo_url || `/منتجات/منتج-${product.id}`;
}

// Display products for homepage
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(0, endIndex);
    
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= filteredProducts.length ? 'none' : 'block';
    }
}

// Create product card for homepage
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    const productURL = createProductURL(product);
    
    card.innerHTML = `
        <div class="product-image">
            <a href="${productURL}" style="display: block; text-decoration: none; color: inherit;">
                <img src="${product.image}" alt="${product.title}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQ2Fpcm8sQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Yp9mE2LXZiNix2Kkg2LrZitixINmF2KrYp9it2KU8L3RleHQ+PC9zdmc+'">
            </a>
        </div>
        <div class="product-info">
            <a href="${productURL}" style="text-decoration: none; color: inherit;">
                <h3 class="product-title">${product.title}</h3>
            </a>
            <div class="product-price">
                <span class="current-price">${product.sale_price} د.ك</span>
                ${product.price > product.sale_price ? `<span class="original-price">${product.price} د.ك</span>` : ''}
                ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="btn-cart" onclick="addToCart(${product.id}); event.stopPropagation();" title="أضف للسلة">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="btn-whatsapp" onclick="contactWhatsApp(${product.id}); event.stopPropagation();" title="اسأل عبر واتساب">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <a href="${productURL}" class="btn-details" title="صفحة المنتج" 
                   style="display: flex; align-items: center; justify-content: center; text-decoration: none; color: inherit; background: var(--luxury-gold);">
                    <i class="fas fa-eye"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Add to cart (homepage)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification('تم إضافة المنتج للسلة ✅');
}

// Contact WhatsApp (homepage)
function contactWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productURL = createProductURL(product);
    const fullURL = `https://sooq-alkuwait.arabsad.com${productURL}`;
    
    const message = `مرحباً! 🛍\\n\\nأريد الاستفسار عن هذا المنتج:\\n\\n*${product.title}*\\n\\nالسعر: ${product.sale_price} د.ك\\nالرابط: ${fullURL}\\n\\nشكراً لكم 🙏`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Update cart UI
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Filter products
function filterProducts(category) {
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => 
            product.category.includes(category) || 
            product.title.includes(category)
        );
    }
    
    currentPage = 1;
    displayProducts();
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="filterProducts('${category}')"]`)?.classList.add('active');
}

// Search products
function searchProducts(query) {
    if (!query.trim()) {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    currentPage = 1;
    displayProducts();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed; top: 120px; right: 20px; background: var(--kuwait-green);
        color: white; padding: 15px 25px; border-radius: 15px; z-index: 3000;
        font-family: 'Cairo', sans-serif; box-shadow: 0 8px 25px rgba(0,166,81,0.4);
        font-weight: 600; animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Load more products
function loadMore() {
    currentPage++;
    displayProducts();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تشغيل سوق الكويت...');
    
    // تحقق من الرابط الحالي
    const currentPath = new URLSearchParams(window.location.search).get('path') || window.location.pathname;
    
    // إذا كان رابط منتج، فعّل الراوتر
    if (currentPath !== '/' && currentPath !== '/index.html' && currentPath.includes('/')) {
        console.log('🔄 تفعيل الراوتر للرابط:', currentPath);
        new SmartArabicRouter();
        return;
    }
    
    // الصفحة الرئيسية العادية
    loadProducts();
    
    // إضافة مستمعات الأحداث
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => searchProducts(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchProducts(searchInput.value);
        });
    }
    
    // إغلاق القائمة المحمولة عند النقر خارجها
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('mobileMenu');
        const btn = document.querySelector('.mobile-menu-btn');
        
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
    
    console.log('✅ سوق الكويت جاهز مع الراوتر العربي المحسن!');
});