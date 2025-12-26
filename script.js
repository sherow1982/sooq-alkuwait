// script.js

// إعدادات المتجر
const STORE_CONFIG = {
    whatsappNumber: "201110760081", 
    currency: "KWD"
};

let allProducts = [];
let cart = [];
let currentFilteredProducts = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 12;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCart();
    
    document.getElementById('search-input').addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });
});

// --- التعديل الأساسي هنا ---
async function fetchProducts() {
    try {
        // 1. التأكد من اسم الملف (نفس الاسم اللي خرج من بايثون)
        const response = await fetch('products.json'); 
        if (!response.ok) throw new Error('فشل تحميل البيانات');
        
        const rawData = await response.json();
        
        // 2. مرحلة الـ Mapping (تحويل الهيكل المعقد إلى بسيط)
        allProducts = rawData.map(item => {
            return {
                id: item.id,
                // ربط العنوان بالاسم
                name: item.title, 
                // التعامل مع الوصف
                description: item.description,
                // استخراج الصورة الرئيسية من داخل كائن الميديا
                image: item.media?.main_image || 'https://via.placeholder.com/300',
                // التعامل مع الأسعار (تحويلها لأرقام لضمان العمليات الحسابية)
                regular_price: parseFloat(item.pricing?.regular || 0),
                sale_price: parseFloat(item.pricing?.sale || 0),
                // بما أن ملف الإكسل لا يحتوي على تصنيف، نضع تصنيف افتراضي
                category: item.category || 'عام', 
                // نستخدم الـ ID كـ Slug مؤقتاً
                slug: item.id 
            };
        });
        
        setupCategories();
        renderProducts(allProducts);
        
    } catch (error) {
        console.error('Error:', error);
        const grid = document.getElementById('products-grid');
        if(grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center text-red-500 py-10">
                    <p>عذراً، حدث خطأ أثناء تحميل المنتجات.</p>
                    <p class="text-sm text-gray-500">${error.message}</p>
                </div>
            `;
        }
    }
}

function renderProducts(products) {
    currentFilteredProducts = products;
    displayedCount = 0;
    const grid = document.getElementById('products-grid');
    if (!grid) return; 
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-10">لا توجد منتجات تطابق بحثك.</div>';
        updateLoadMoreButton();
        return;
    }

    appendProducts();
}

function appendProducts() {
    const grid = document.getElementById('products-grid');
    const nextBatch = currentFilteredProducts.slice(displayedCount, displayedCount + ITEMS_PER_PAGE);

    nextBatch.forEach(product => {
        // منطق السعر: إذا كان سعر الخصم موجوداً وأكبر من صفر وأقل من السعر العادي
        const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
        const displayPrice = hasDiscount ? product.sale_price : product.regular_price;

        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-xl overflow-hidden group relative border border-gray-100 hover:shadow-lg transition-all duration-300';
        
        card.innerHTML = `
            <a href="product.html?id=${product.id}" class="block cursor-pointer">
                <div class="product-image-container relative bg-gray-100 aspect-square overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
                    ${hasDiscount ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">خصم</span>` : ''}
                </div>
                <div class="p-4">
                    <div class="text-xs text-gray-500 mb-1">${product.category}</div>
                    <h3 class="font-bold text-gray-800 mb-2 truncate text-sm md:text-base group-hover:text-primary transition-colors">${product.name}</h3>
                    <div class="flex justify-between items-center mt-3">
                        <div class="flex flex-col">
                            <span class="text-lg font-bold text-primary">${displayPrice} ${STORE_CONFIG.currency}</span>
                            ${hasDiscount ? `<span class="text-xs text-gray-400 line-through">${product.regular_price} ${STORE_CONFIG.currency}</span>` : ''}
                        </div>
                    </div>
                </div>
            </a>
            <button onclick="addToCart(event, '${product.id}')" class="absolute bottom-4 left-4 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-90 transition shadow-md z-10 translate-y-12 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 duration-300" title="أضف للسلة">
                <i class="fa-solid fa-plus"></i>
            </button>
        `;
        grid.appendChild(card);
    });

    displayedCount += nextBatch.length;
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const btn = document.getElementById('load-more-btn');
    if (btn) {
        if (displayedCount >= currentFilteredProducts.length || currentFilteredProducts.length === 0) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'block';
        }
    }
}

function setupCategories() {
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('category-filters');
    if (!container) return;
    
    container.innerHTML = '<button class="filter-btn active px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:shadow-md transition text-sm font-medium" onclick="filterByCategory(\'all\')">الكل</button>';

    categories.forEach(cat => {
        if (cat === 'all') return;
        const btn = document.createElement('button');
        btn.className = 'filter-btn px-4 py-2 rounded-full bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md transition text-sm font-medium';
        btn.textContent = cat;
        btn.onclick = () => filterByCategory(cat);
        container.appendChild(btn);
    });
}

function filterByCategory(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent === category || (category === 'all' && btn.textContent === 'الكل')) {
            btn.classList.add('active', 'bg-primary', 'text-white', 'border-primary');
            btn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
        } else {
            btn.classList.remove('active', 'bg-primary', 'text-white', 'border-primary');
            btn.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
        }
    });

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allProducts.filter(p => 
        String(p.name).toLowerCase().includes(term) || 
        (p.description && String(p.description).toLowerCase().includes(term))
    );
    renderProducts(filtered);
}

// --- وظائف السلة ---

function addToCart(event, productId) {
    event.preventDefault();
    event.stopPropagation();
    
    // تحويل الـ ID لنفس النوع للمقارنة (string vs number)
    const product = allProducts.find(p => String(p.id) === String(productId));
    
    if (!product) return;
    
    // البحث في السلة
    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        // نأخذ نسخة من بيانات المنتج للسلة
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    saveCart();
    
    // Feedback visual
    const btn = event.currentTarget; // استخدام currentTarget لضمان الإشارة للزر نفسه وليس الأيقونة
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.classList.add('bg-green-500');
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('bg-green-500');
    }, 1000);
    
    // فتح السلة تلقائياً (اختياري)
    // toggleCart(); 
}

function removeFromCart(productId) {
    cart = cart.filter(item => String(item.id) !== String(productId));
    updateCartUI();
    saveCart();
}

function updateQty(productId, change) {
    const item = cart.find(item => String(item.id) === String(productId));
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const countBadge = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countBadge) {
        countBadge.textContent = totalCount;
        countBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (!cartContainer) return;

    cartContainer.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-gray-400">
                <i class="fa-solid fa-basket-shopping text-4xl mb-4"></i>
                <p>سلة المشتريات فارغة</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const hasDiscount = item.sale_price > 0 && item.sale_price < item.regular_price;
            const price = hasDiscount ? item.sale_price : item.regular_price;
            
            const itemTotal = price * item.qty;
            totalPrice += itemTotal;

            cartContainer.innerHTML += `
                <div class="flex gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-2">
                    <img src="${item.image}" class="w-16 h-16 object-cover rounded" alt="${item.name}">
                    <div class="flex-1">
                        <h4 class="text-sm font-bold text-gray-800 line-clamp-1">${item.name}</h4>
                        <div class="text-primary font-bold text-sm mt-1">${price} ${STORE_CONFIG.currency}</div>
                        <div class="flex items-center justify-between mt-2">
                            <div class="flex items-center gap-2 bg-gray-50 rounded px-2 border border-gray-200">
                                <button onclick="updateQty('${item.id}', -1)" class="text-gray-500 hover:text-red-500 w-6 h-6 flex items-center justify-center">-</button>
                                <span class="text-sm font-medium w-4 text-center">${item.qty}</span>
                                <button onclick="updateQty('${item.id}', 1)" class="text-gray-500 hover:text-green-500 w-6 h-6 flex items-center justify-center">+</button>
                            </div>
                            <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-600 text-xs p-2">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    if (totalEl) {
        totalEl.textContent = totalPrice.toFixed(2) + ' ' + STORE_CONFIG.currency;
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay'); // افترضت وجود overlay
    
    if (!sidebar) return;

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        setTimeout(() => {
            if(panel) panel.classList.remove('translate-x-full'); // تأكد من اتجاه الحركة حسب لغة الموقع (RTL/LTR)
            if(overlay) overlay.classList.remove('opacity-0');
        }, 10);
    } else {
        if(panel) panel.classList.add('translate-x-full');
        if(overlay) overlay.classList.add('opacity-0');
        setTimeout(() => {
            sidebar.classList.add('hidden');
        }, 300);
    }
}

function saveCart() {
    localStorage.setItem('souq_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('souq_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    let message = "*مرحباً، أود طلب المنتجات التالية:*\n\n";
    let total = 0;

    cart.forEach(item => {
        const hasDiscount = item.sale_price > 0 && item.sale_price < item.regular_price;
        const price = hasDiscount ? item.sale_price : item.regular_price;
        
        const subtotal = price * item.qty;
        total += subtotal;
        message += `▪️ ${item.name}\n   الكمية: ${item.qty} | السعر: ${price} ${STORE_CONFIG.currency}\n`;
    });

    message += `\n*الإجمالي الكلي: ${total.toFixed(2)} ${STORE_CONFIG.currency}*\n`;
    message += "\n------------------\n";
    message += "يرجى تأكيد الطلب.";

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(url, '_blank');
}
