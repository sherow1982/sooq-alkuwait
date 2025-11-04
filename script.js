// Global variables
let products = [];
let filteredProducts = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 12;
const WHATSAPP_NUMBER = "201110760081";

// Arabic Router for Beautiful URLs
class ArabicProductRouter {
    constructor() {
        this.products = [];
        this.checkAndRoute();
    }

    async checkAndRoute() {
        // Check if we're on a product page
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);
        const pathFromQuery = params.get('path');
        
        const targetPath = pathFromQuery || path;
        
        // If homepage, don't route
        if (targetPath === '/' || targetPath === '/index.html') {
            return;
        }
        
        // Load products and find matching product
        await this.loadProducts();
        const product = this.products.find(p => p.seo_url === targetPath);
        
        if (product) {
            this.displayProductPage(product);
        } else {
            this.redirect404();
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/products.json');
            this.products = await response.json();
        } catch (error) {
            console.error('خطأ في تحميل المنتجات للروتر:', error);
        }
    }

    displayProductPage(product) {
        const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
        document.title = `${product.title} - سوق الكويت`;
        
        const main = document.querySelector('main') || document.querySelector('.products-section') || document.body;
        
        main.innerHTML = `
            <div class="container" style="margin-top: 120px; padding: 2rem 0;">
                <div class="product-detail" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
                    <div class="product-detail-image">
                        <img src="${product.image}" alt="${product.title}" style="width: 100%; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQ2Fpcm8sIEFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+الصورة غير متاحة</text></svg>'">
                    </div>
                    <div class="product-detail-info">
                        <h1 style="font-size: 1.8rem; margin-bottom: 1rem; color: var(--kuwait-black);">${product.title}</h1>
                        <div class="product-price" style="margin: 2rem 0;">
                            <span style="font-size: 2rem; font-weight: 900; color: var(--kuwait-green);">${product.sale_price} د.ك</span>
                            <span style="font-size: 1.2rem; color: #999; text-decoration: line-through; margin-right: 1rem;">${product.price} د.ك</span>
                            <span style="background: var(--kuwait-red); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-weight: 700;">وفّر ${discount}%</span>
                        </div>
                        <div style="margin: 2rem 0; line-height: 1.8; white-space: pre-line;">${product.description}</div>
                        <div style="display: flex; gap: 1rem; margin: 2rem 0;">
                            <button onclick="addToCartAndGo(${product.id})" style="flex: 1; background: var(--kuwait-green); color: white; border: none; padding: 1rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.1rem; cursor: pointer;">
                                <i class="fas fa-shopping-cart"></i> أضف للسلة
                            </button>
                            <button onclick="contactWhatsAppProduct(${product.id})" style="flex: 1; background: #25D366; color: white; border: none; padding: 1rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.1rem; cursor: pointer;">
                                <i class="fab fa-whatsapp"></i> واتساب
                            </button>
                        </div>
                        <div style="text-align: center; margin: 2rem 0;">
                            <a href="/" style="background: var(--dark-gray); color: white; padding: 0.8rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600;">
                                <i class="fas fa-arrow-right"></i> العودة للمتجر
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    redirect404() {
        window.location.href = '/index.html';
    }
}

// Load products data
async function loadProducts() {
    try {
        const response = await fetch('/products.json');
        products = await response.json();
        filteredProducts = products;
        displayProducts();
        updateCartUI();
        console.log(`تم تحميل ${products.length} منتج`);
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
    }
}

// Create product URL - SEO Arabic clean URLs
function createProductURL(product) {
    if (product.seo_url) {
        return product.seo_url;
    }
    return `منتجات/منتج-${product.id}`;
}

// Display products
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
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    const productURL = createProductURL(product);
    
    card.innerHTML = `
        <div class="product-image">
            <a href="${productURL}" style="display: block; text-decoration: none; color: inherit;">
                <img src="${product.image}" alt="${product.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; height: 100%; background: #f0f0f0; align-items: center; justify-content: center; color: #666; font-size: 0.9rem;">تحميل الصورة...</div>
            </a>
        </div>
        <div class="product-info">
            <a href="${productURL}" style="text-decoration: none; color: inherit;">
                <h3 class="product-title">${product.title}</h3>
            </a>
            <div class="product-price">
                <span class="current-price">${product.sale_price} د.ك</span>
                <span class="original-price">${product.price} د.ك</span>
                <span class="discount">-${discount}%</span>
            </div>
            <div class="product-actions">
                <button class="btn-cart" onclick="addToCartAndGo(${product.id}); event.stopPropagation();" title="أضف للسلة">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="btn-whatsapp" onclick="contactWhatsApp(${product.id}); event.stopPropagation();" title="اسأل عبر واتساب">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <a href="${productURL}" class="btn-details" title="صفحة المنتج" style="display: flex; align-items: center; justify-content: center; text-decoration: none; color: inherit;">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Add to cart and redirect to cart page
function addToCartAndGo(productId) {
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
    
    // الانتقال فوراً للسلة بعد الإضافة
    window.location.href = '/cart.html';
}

// Regular add to cart (without redirect)
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
    showNotification('تم إضافة المنتج للسلة');
}

// Contact via WhatsApp from product page
function contactWhatsAppProduct(productId) {
    const product = products.find(p => p.id === productId) || 
                   JSON.parse(localStorage.getItem('currentProduct') || '{}');
    if (!product) return;
    
    const message = `مرحباً! 🛍\n\nأريد الاستفسار عن هذا المنتج:\n\n*${product.title}*\n\nالسعر: ${product.sale_price} د.ك\n\nشكراً لكم 🙏`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Contact via WhatsApp
function contactWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productURL = createProductURL(product);
    const fullURL = `https://sooq-alkuwait.arabsad.com${productURL}`;
    
    const message = `مرحباً! 🛍\n\nأريد الاستفسار عن هذا المنتج:\n\n*${product.title}*\n\nالسعر: ${product.sale_price} د.ك\nالرابط: ${fullURL}\n\nشكراً لكم 🙏`;
    
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
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: var(--kuwait-green);
        color: white; padding: 15px 20px; border-radius: 10px; z-index: 3000;
        font-family: 'Cairo', sans-serif; box-shadow: 0 5px 15px rgba(0,166,81,0.3);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Load more products
function loadMore() {
    currentPage++;
    displayProducts();
}

// Display products
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
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    const productURL = createProductURL(product);
    
    card.innerHTML = `
        <div class="product-image">
            <a href="${productURL}" style="display: block; text-decoration: none; color: inherit;">
                <img src="${product.image}" alt="${product.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; height: 100%; background: #f0f0f0; align-items: center; justify-content: center; color: #666; font-size: 0.9rem;">تحميل الصورة...</div>
            </a>
        </div>
        <div class="product-info">
            <a href="${productURL}" style="text-decoration: none; color: inherit;">
                <h3 class="product-title">${product.title}</h3>
            </a>
            <div class="product-price">
                <span class="current-price">${product.sale_price} د.ك</span>
                <span class="original-price">${product.price} د.ك</span>
                <span class="discount">-${discount}%</span>
            </div>
            <div class="product-actions">
                <button class="btn-cart" onclick="addToCartAndGo(${product.id}); event.stopPropagation();" title="أضف للسلة">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="btn-whatsapp" onclick="contactWhatsApp(${product.id}); event.stopPropagation();" title="اسأل عبر واتساب">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <a href="${productURL}" class="btn-details" title="صفحة المنتج" style="display: flex; align-items: center; justify-content: center; text-decoration: none; color: inherit;">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if we need to route to a product page
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const pathFromQuery = params.get('path');
    
    if (pathFromQuery || (path !== '/' && path !== '/index.html' && !path.includes('.html'))) {
        new ArabicProductRouter();
        return;
    }
    
    // Normal homepage loading
    loadProducts();
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput) searchProducts(searchInput.value);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value);
            }
        });
    }
    
    console.log('سوق الكويت - تم التحميل مع Router عربي');
});