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
        const response = await fetch('products.json');
        products = await response.json();
        filteredProducts = products;
        displayProducts();
        updateCartUI();
        console.log(`تم تحميل ${products.length} منتج`);
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
    }
}

// Create product URL using Arabic SEO URLs
function createProductURL(product) {
    // استخدام الـ seo_url المحفوظ في البيانات مباشرة
    if (product.seo_url) {
        return product.seo_url + '.html';
    }
    
    // Fallback للمنتجات القديمة
    return `product-${product.id}.html`;
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
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

// Create product card - Fixed popup issue
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
                <button class="btn-cart" onclick="addToCart(${product.id}); event.stopPropagation();" title="أضف للسلة">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="btn-whatsapp" onclick="contactWhatsApp(${product.id}); event.stopPropagation();" title="اسأل عبر واتساب">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <a href="${productURL}" target="_blank" class="btn-details" title="صفحة المنتج" style="display: flex; align-items: center; justify-content: center; text-decoration: none; color: inherit;">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Contact via WhatsApp
function contactWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productURL = createProductURL(product);
    const fullURL = `${window.location.origin}/${productURL}`;
    
    const message = `مرحباً! 🖐\n\nأريد الاستفسار عن هذا المنتج:\n\n*${product.title}*\n\nالسعر: ${product.sale_price} د.ك\nالرابط: ${fullURL}\n\nشكراً لكم 🙏`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add to cart
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
    
    // Update filter buttons
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    // Search functionality
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
    
    console.log('سوق الكويت - تم التحميل بنجاح مع روابط SEO عربية');
});