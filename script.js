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

// Create product URL - FIXED: Direct link to product page
function createProductURL(product) {
    // تحويل التصنيف للإنجليزية للـ SEO
    let categoryFolder = 'products';
    if (product.category === 'أطفال') categoryFolder = 'kids';
    else if (product.category === 'مطبخ') categoryFolder = 'kitchen';
    else if (product.category === 'ملابس') categoryFolder = 'fashion';
    else if (product.category === 'إلكترونيات') categoryFolder = 'electronics';
    else if (product.category === 'تجميل') categoryFolder = 'beauty';
    else if (product.category === 'منزل') categoryFolder = 'home';
    
    // إنشاء slug بسيط من ID والعنوان
    const slug = `product-${product.id}`;
    
    // المسار الصحيح: /{category}/{slug}.html
    return `${categoryFolder}/${slug}.html`;
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
    
    console.log(`تم عرض ${productsToShow.length} منتج`);
}

// Create product card - Fixed to open correct product page
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    const productURL = createProductURL(product);
    
    card.innerHTML = `
        <div class="product-image" onclick="window.open('${productURL}', '_blank')" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x300/cccccc/666666?text=صورة'">
            <div class="product-overlay">
                <i class="fas fa-external-link-alt"></i>
                <span>عرض المنتج</span>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title" onclick="window.open('${productURL}', '_blank')" style="cursor: pointer;">${product.title}</h3>
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
                <button class="btn-details" onclick="window.open('${productURL}', '_blank'); event.stopPropagation();" title="صفحة المنتج">
                    <i class="fas fa-external-link-alt"></i>
                </button>
            </div>
        </div>
    `;
    
    // Make entire card clickable
    card.style.cursor = 'pointer';
    card.onclick = function(e) {
        if (!e.target.closest('.product-actions')) {
            window.open(productURL, '_blank');
        }
    };
    
    return card;
}

// Contact via WhatsApp
function contactWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productURL = createProductURL(product);
    const fullURL = `${window.location.origin}/${productURL}`;
    
    const message = `مرحباً! 👋\n\nأريد الاستفسار عن هذا المنتج:\n\n*${product.title}*\n\nالسعر: ${product.sale_price} د.ك\nالرابط: ${fullURL}\n\nشكراً لكم 🙏`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification('تم إضافة المنتج للسلة');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    updateCartModal();
}

// Update cart modal
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فارغة</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.sale_price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/80x80?text=صورة'">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="cart-item-price">${itemTotal.toFixed(2)} د.ك</span>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total.toFixed(2);
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
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
    
    // Cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
    
    console.log('سوق الكويت - تم التحميل بنجاح');
});