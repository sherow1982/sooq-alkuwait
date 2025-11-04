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
            "image": "https://ecomerg.com/uploads/products_images/3711/VGYHOWKJV1B2EQDm1AbQxrUkvYMQQdpzpbSxaIdC.jpg",
            "category": "أطفال",
            "availability": "متوفر",
            "description": "حصالة صراف آلي أوتوماتيكية بتصميم كرتوني للأطفال\n\n✨ مواصفات المنتج:\n• مادة آمنة وعالية الجودة\n• تصميم جذاب للأطفال\n• سهل الاستخدام\n• ينمي المهارات\n• مناسب من 3 سنوات\n\n🚚 توصيل مجاني الكويت\n💰 الدفع عند الاستلام"
        },
        {
            "id": 2,
            "title": "صفاية سلطة دوّارة متعددة الوظائف",
            "price": 18.0,
            "sale_price": 13.0,
            "image": "https://via.placeholder.com/300x300?text=صفاية",
            "category": "مطبخ",
            "availability": "متوفر",
            "description": "صفاية سلطة دوّارة متعددة الوظائف\n\n✨ مواصفات المنتج:\n• مواد غذائية آمنة\n• سهل التنظيف\n• متين وعملي\n• يوفر الوقت\n• تصميم مريح\n\n🚚 توصيل مجاني الكويت\n💰 الدفع عند الاستلام"
        }
    ];
    filteredProducts = products;
    displayProducts();
    console.log('تم إنشاء منتجات تجريبية');
}

// Create product URL for dedicated page
function createProductURL(product) {
    // إنشاء slug بسيط للمنتج
    let slug = product.title.toLowerCase()
        .replace(/حصالة/g, 'piggy-bank')
        .replace(/أطفال/g, 'kids')
        .replace(/صراف آلي/g, 'electronic')
        .replace(/كرتوني/g, 'cartoon')
        .replace(/صفاية/g, 'spinner')
        .replace(/سلطة/g, 'salad')
        .replace(/مطبخ/g, 'kitchen')
        .replace(/شورت/g, 'shorts')
        .replace(/ملابس/g, 'clothes')
        .replace(/نسائي/g, 'womens')
        .replace(/[^\w\s-]/g, '') // إزالة الرموز
        .replace(/\s+/g, '-') // استبدال المسافات بشرطات
        .replace(/-+/g, '-') // إزالة الشرطات المتعددة
        .substring(0, 50) // تحديد الطول
        .replace(/^-+|-+$/g, ''); // إزالة الشرطات من البداية والنهاية
    
    // تحديد الفئة الإنجليزية
    let categoryFolder = 'products';
    if (product.category === 'أطفال') categoryFolder = 'atfal';
    else if (product.category === 'مطبخ') categoryFolder = 'matbakh';
    else if (product.category === 'ملابس') categoryFolder = 'malabis';
    else if (product.category === 'إلكترونيات') categoryFolder = 'electronics';
    else if (product.category === 'تجميل') categoryFolder = 'tajmil';
    else if (product.category === 'منزل') categoryFolder = 'manzil';
    
    return `${categoryFolder}/${slug}/${product.id}.html`;
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
    if (loadMoreBtn) {
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    console.log(`تم عرض ${productsToShow.length} منتج`);
}

// Create product card - بدون مودال، فتح مباشر في تبويب جديد
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    const productURL = createProductURL(product);
    
    card.innerHTML = `
        <div class="product-image" onclick="window.open('${productURL}', '_blank')" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x300?text=صورة+غير+متوفرة'">
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
    
    // جعل البطاقة كلها clickable
    card.style.cursor = 'pointer';
    card.onclick = function(e) {
        // تجنب فتح الصفحة عند النقر على الأزرار
        if (!e.target.closest('.product-actions')) {
            window.open(productURL, '_blank');
        }
    };
    
    return card;
}

// Contact via WhatsApp for specific product
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
    const targetBtn = document.querySelector(`[data-category="${category}"]`) || document.querySelector(`[onclick="filterProducts('${category}')"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    console.log(`تم تطبيق فلتر: ${category} - عدد النتائج: ${filteredProducts.length}`);
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
    console.log(`نتائج البحث عن "${query}": ${filteredProducts.length} منتج`);
}

// Load more products
function loadMore() {
    currentPage += 1;
    displayProducts();
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show checkout form
function showCheckout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة');
        return;
    }
    
    closeModal('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'block';
        displayCheckoutItems();
    }
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems || !checkoutTotal) return;
    
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
    const customerName = document.getElementById('customerName')?.value;
    const customerPhone = document.getElementById('customerPhone')?.value;
    const customerAddress = document.getElementById('customerAddress')?.value;
    const orderNotes = document.getElementById('orderNotes')?.value;
    
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
    
    orderText += `\n🛍️ *تفاصيل الطلب:*\n`;
    orderText += `────────────────────────────\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.sale_price * item.quantity;
        total += itemTotal;
        const productURL = createProductURL(item);
        const fullURL = `${window.location.origin}/${productURL}`;
        
        orderText += `${index + 1}. *${item.title}*\n`;
        orderText += `   الكمية: ${item.quantity}\n`;
        orderText += `   السعر: ${item.sale_price} د.ك\n`;
        orderText += `   المجموع: ${itemTotal.toFixed(2)} د.ك\n`;
        orderText += `   الرابط: ${fullURL}\n\n`;
    });
    
    orderText += `────────────────────────────\n`;
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
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--kuwait-green);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 3000;
        font-family: 'Cairo', sans-serif;
        box-shadow: 0 5px 15px rgba(0,166,81,0.3);
        font-weight: 600;
    `;
    document.body.appendChild(notification);
    setTimeout(() => { 
        if (notification.parentNode) {
            notification.remove(); 
        }
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
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
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterProducts(btn.dataset.category);
        });
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    }
    
    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) cartModal.style.display = 'block';
        });
    }
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    console.log('تم تحميل المتجر بنجاح - صفحات منتجات منفصلة');
});