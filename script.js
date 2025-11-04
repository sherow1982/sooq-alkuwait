// Global variables
let products = [];
let filteredProducts = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 12;
const WHATSAPP_NUMBER = "201110760081";

// Load products data
async function loadProducts() {
    try {
        const res = await fetch('/products.json?v=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        products = Array.isArray(data) ? data : [];
        filteredProducts = products;
        displayProducts();
        updateCartUI();
        console.log(`✅ تم تحميل ${products.length} منتج`);
    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
    }
}

// Display products مع دعم معرفات متعددة
function displayProducts() {
    const productsContainer = document.getElementById('products-container') || 
                             document.getElementById('productsGrid') || 
                             document.querySelector('.products-grid');
    
    if (!productsContainer) return;

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products" style="text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-box-open" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>لا توجد منتجات للعرض</h3>
                <p>يرجى المحاولة لاحقاً أو تصفح منتجات أخرى</p>
            </div>
        `;
        return;
    }

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const productsHTML = currentProducts.map(product => {
        const discount = product.price > product.sale_price 
            ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
            : 0;
        
        return `
            <div class="product-card" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease; cursor: pointer;" 
                 onclick="openProductInNewTab(${product.id})" itemscope itemtype="https://schema.org/Product">
                <div class="product-image" style="position: relative; overflow: hidden;">
                    <img src="${product.image}" alt="${product.title}" itemprop="image"
                         style="width: 100%; height: 250px; object-fit: cover; transition: transform 0.3s ease;"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQ2Fpcm8sQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Yp9mE2LXZiNix2Kkg2LrZitixINmF2KrYp9ir2Kk8L3RleHQ+PC9zdmc+'">
                    ${discount > 0 ? `<div class="discount-badge" style="position: absolute; top: 15px; right: 15px; background: var(--kuwait-red); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.9rem;">-${discount}%</div>` : ''}
                    <div class="product-category" style="position: absolute; bottom: 15px; left: 15px; background: rgba(0,0,0,0.8); color: white; padding: 0.3rem 1rem; border-radius: 15px; font-size: 0.8rem;" itemprop="category">${product.category}</div>
                </div>
                <div class="product-info" style="padding: 1.5rem;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 1rem; height: 50px; overflow: hidden; line-height: 1.4; color: var(--kuwait-black);" itemprop="name">${product.title}</h3>
                    <div class="price-section" style="margin-bottom: 1.5rem;" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <meta itemprop="availability" content="https://schema.org/InStock">
                        <meta itemprop="priceCurrency" content="KWD">
                        <div class="current-price" style="font-size: 1.5rem; font-weight: 900; color: var(--kuwait-green); margin-bottom: 0.3rem;" itemprop="price" content="${product.sale_price}">${product.sale_price} د.ك</div>
                        ${product.price > product.sale_price ? `<div class="old-price" style="text-decoration: line-through; color: #999; font-size: 1rem;">${product.price} د.ك</div>` : ''}
                    </div>
                    <div class="product-actions" style="display: flex; gap: 0.5rem;">
                        <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                                style="flex: 1; background: var(--kuwait-green); color: white; border: none; padding: 0.8rem 1rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.3s ease;"
                                aria-label="أضف ${product.title} للسلة">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                        <button onclick="event.stopPropagation(); contactWhatsApp(${product.id})" 
                                style="background: #25D366; color: white; border: none; padding: 0.8rem 1rem; border-radius: 10px; cursor: pointer; transition: background 0.3s ease;"
                                aria-label="استفسر عن ${product.title} عبر واتساب">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    productsContainer.innerHTML = productsHTML;
    displayPagination();
}

// FIX: Open product in new tab with direct Arabic URL
function openProductInNewTab(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.seo_url) {
        const productUrl = product.seo_url.startsWith('http')
            ? product.seo_url
            : `${window.location.origin}${product.seo_url}`;
        window.open(productUrl, '_blank', 'noopener,noreferrer');
        console.log(`🔗 فتح المنتج: ${product.title} في ${productUrl}`);
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification('تم إضافة المنتج للسلة', 'success');
}

// WhatsApp contact
function contactWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const message = `مرحباً، أريد الاستفسار عن هذا المنتج:\n${product.title}\nالسعر: ${product.sale_price} د.ك`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Pagination مع دعم معرفات متعددة
function displayPagination() {
    const paginationContainer = document.getElementById('pagination') || 
                               document.querySelector('.pagination') ||
                               document.querySelector('.load-more-container');
    
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="pagination-wrapper" style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem;">';
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button onclick="goToPage(${i})" 
                    style="padding: 0.8rem 1.2rem; border: 2px solid var(--kuwait-green); background: ${i === currentPage ? 'var(--kuwait-green)' : 'white'}; color: ${i === currentPage ? 'white' : 'var(--kuwait-green)'}; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;"
                    aria-label="الانتقال للصفحة ${i}">
                ${i}
            </button>
        `;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    displayProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update cart UI مع دعم معرفات متعددة
function updateCartUI() {
    const cartBadge = document.querySelector('.cart-badge') || 
                     document.querySelector('.cart-count') ||
                     document.querySelector('[class*="cart"]');
    
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: ${type === 'success' ? 'var(--kuwait-green)' : 'var(--kuwait-red)'};
        color: white; padding: 1rem 2rem; border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px); transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Search functionality مع دعم معرفات متعددة
function searchProducts() {
    const searchInput = document.getElementById('search-input') || 
                       document.getElementById('searchInput') ||
                       document.querySelector('input[type="text"]');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
    }
    
    currentPage = 1;
    displayProducts();
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    currentPage = 1;
    displayProducts();
}

// Legacy function support
function filterProducts(category) {
    filterByCategory(category);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    const hasProductsContainer = document.getElementById('products-container') || 
                                document.getElementById('productsGrid') || 
                                document.querySelector('.products-grid');
    
    if (hasProductsContainer) {
        loadProducts();
    }
});