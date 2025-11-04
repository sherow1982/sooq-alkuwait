// Global variables
let products = [];
let filteredProducts = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 12;

// WhatsApp business number
const WHATSAPP_NUMBER = "201110760081";

// Load products data
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        filteredProducts = products;
        displayProducts();
        updateCartUI();
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        createSampleProducts();
    }
}

// Create sample products as fallback
function createSampleProducts() {
    products = [
        {
            "id": 1,
            "title": "حصالة صراف آلي أوتوماتيكية بتصميم كرتوني للأطفال",
            "price": 18.0,
            "sale_price": 13.0,
            "image": "https://via.placeholder.com/300x300?text=منتج+1",
            "category": "أطفال",
            "availability": "متوفر",
            "description": "حصالة صراف آلي أوتوماتيكية بتصميم كرتوني للأطفال"
        }
    ];
    filteredProducts = products;
    displayProducts();
}

// Display products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
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
    if (endIndex >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetails(product);
    
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x300?text=صورة+غير+متوفرة'">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">
                <span class="current-price">${product.sale_price} د.ك</span>
                <span class="original-price">${product.price} د.ك</span>
                <span class="discount">-${discount}%</span>
            </div>
            <div class="product-actions">
                <button class="btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">أضف للسلة</button>
            </div>
        </div>
    `;
    
    return card;
}

// Show product details in modal
function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    
    productDetails.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/400x400?text=صورة+غير+متوفرة'">
            </div>
            <div class="product-detail-info">
                <h2>${product.title}</h2>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">${product.sale_price} د.ك</span>
                    <span class="original-price">${product.price} د.ك</span>
                    <span class="discount">وفر ${discount}%</span>
                </div>
                <div class="product-status">
                    <span class="availability">${product.availability}</span>
                    <span class="category">القسم: ${product.category}</span>
                </div>
                <button class="btn-primary" onclick="addToCart(${product.id}); closeModal('productModal')">أضف للسلة</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
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
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    updateCartModal();
}

// Update cart modal
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
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
                <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
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
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
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

// Load more products
function loadMore() {
    currentPage += 1;
    displayProducts();
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Show checkout form
function showCheckout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة');
        return;
    }
    
    closeModal('cartModal');
    document.getElementById('checkoutModal').style.display = 'block';
    displayCheckoutItems();
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.sale_price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="checkout-item">
                <span class="item-name">${item.title}</span>
                <span class="item-quantity">x${item.quantity}</span>
                <span class="item-price">${itemTotal.toFixed(2)} د.ك</span>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = html;
    checkoutTotal.textContent = total.toFixed(2);
}

// Send WhatsApp order
function sendWhatsAppOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const orderNotes = document.getElementById('orderNotes').value;
    
    if (!customerName || !customerPhone || !customerAddress) {
        showNotification('يرجى ملء جميع البيانات المطلوبة');
        return;
    }
    
    let orderText = `🛍️ *طلب جديد من سوق الكويت*\n\n`;
    orderText += `👤 *اسم العميل:* ${customerName}\n`;
    orderText += `📞 *رقم الهاتف:* ${customerPhone}\n`;
    orderText += `📍 *العنوان:* ${customerAddress}\n`;
    
    if (orderNotes) {
        orderText += `📝 *ملاحظات:* ${orderNotes}\n`;
    }
    
    orderText += `\n🛒 *تفاصيل الطلب:*\n`;
    orderText += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.sale_price * item.quantity;
        total += itemTotal;
        
        orderText += `${index + 1}. *${item.title}*\n`;
        orderText += `   الكمية: ${item.quantity}\n`;
        orderText += `   السعر: ${item.sale_price} د.ك\n`;
        orderText += `   المجموع: ${itemTotal.toFixed(2)} د.ك\n`;
        orderText += `   الرابط: https://sherow1982.github.io/sooq-alkuwait/#product-${item.id}\n\n`;
    });
    
    orderText += `━━━━━━━━━━━━━━━━━━━━\n`;
    orderText += `💰 *إجمالي الطلب: ${total.toFixed(2)} د.ك*\n`;
    orderText += `💳 *طريقة الدفع: الدفع عند الاستلام*\n\n`;
    orderText += `شكراً لك على اختيار سوق الكويت! 🇰🇼`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;
    
    cart = [];
    updateCartUI();
    closeModal('checkoutModal');
    
    showNotification('تم إرسال الطلب! سيتم توجيهك لواتساب...');
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        font-family: 'Cairo', sans-serif;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', () => { searchProducts(searchInput.value); });
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { searchProducts(searchInput.value); } });
    document.querySelectorAll('.filter-btn').forEach(btn => { btn.addEventListener('click', () => { filterProducts(btn.dataset.category); }); });
    document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
    document.querySelector('.cart-icon').addEventListener('click', () => { document.getElementById('cartModal').style.display = 'block'; });
    document.querySelectorAll('.close').forEach(closeBtn => { closeBtn.addEventListener('click', (e) => { closeModal(e.target.closest('.modal').id); }); });
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) { e.target.style.display = 'none'; } });
});