// script.js

// إعدادات المتجر
const STORE_CONFIG = {
    whatsappNumber: "201110760081", // رقم الواتساب الخاص بك
    currency: "KWD"
};

let allProducts = [];
let cart = [];
let currentFilteredProducts = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 12;

// جلب البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCart();
    
    // تفعيل البحث
    document.getElementById('search-input').addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });
});

// دالة جلب المنتجات من ملف JSON
async function fetchProducts() {
    try {
        // نفترض أن اسم الملف هو products_data_cleaned.json كما تم الاتفاق عليه
        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) throw new Error('فشل تحميل البيانات');
        
        allProducts = await response.json();
        
        // تهيئة الفئات وعرض المنتجات
        setupCategories();
        renderProducts(allProducts);

        // فتح المنتج مباشرة إذا كان الرابط يحتوي على معرف المنتج (لإعلانات جوجل)
        const urlParams = new URLSearchParams(window.location.search);
        const productSlug = urlParams.get('product');
        if (productSlug) {
            const product = allProducts.find(p => p.slug === productSlug);
            if (product) {
                openProductModal(product.id);
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('products-grid').innerHTML = `
            <div class="col-span-full text-center text-red-500 py-10">
                <p>عذراً، حدث خطأ أثناء تحميل المنتجات.</p>
                <p class="text-sm text-gray-500">${error.message}</p>
            </div>
        `;
    }
}

// عرض المنتجات في الشبكة
function renderProducts(products) {
    currentFilteredProducts = products;
    displayedCount = 0;
    const grid = document.getElementById('products-grid');
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
        const displayPrice = product.sale_price > 0 ? product.sale_price : product.regular_price;
        const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;

        // تغيير العنصر من div إلى a ليفتح في تبويب جديد
        const card = document.createElement('a');
        card.href = `?product=${product.slug}`;
        card.target = '_blank';
        card.className = 'product-card bg-white rounded-xl overflow-hidden group relative cursor-pointer block';
        
        card.innerHTML = `
            <div class="product-image-container bg-gray-100">
                <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" loading="lazy">
                ${hasDiscount ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">خصم</span>` : ''}
            </div>
            <div class="p-4">
                <div class="text-xs text-gray-500 mb-1">${product.category}</div>
                <h3 class="font-bold text-gray-800 mb-2 truncate group-hover:text-primary">${product.name}</h3>
                <div class="flex justify-between items-center mt-3">
                    <div class="flex flex-col">
                        <span class="text-lg font-bold text-primary">${displayPrice} ${STORE_CONFIG.currency}</span>
                        ${hasDiscount ? `<span class="text-xs text-gray-400 line-through">${product.regular_price} ${STORE_CONFIG.currency}</span>` : ''}
                    </div>
                    <button onclick="addToCart(event, ${product.id})" class="bg-secondary text-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition shadow-sm z-10" title="أضف للسلة">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
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

// إعداد أزرار الفئات
function setupCategories() {
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('category-filters');
    
    // إبقاء زر "الكل" فقط وإزالة الباقي لإعادة بنائهم
    container.innerHTML = '<button class="filter-btn active px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:shadow-md transition" onclick="filterByCategory(\'all\')">الكل</button>';

    categories.forEach(cat => {
        if (cat === 'all') return;
        const btn = document.createElement('button');
        btn.className = 'filter-btn px-4 py-2 rounded-full bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md transition';
        btn.textContent = cat;
        btn.onclick = () => filterByCategory(cat);
        container.appendChild(btn);
    });
}

// فلترة حسب الفئة
function filterByCategory(category) {
    // تحديث ستايل الأزرار
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent === category || (category === 'all' && btn.textContent === 'الكل')) {
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-600');
        } else {
            btn.classList.remove('active', 'bg-primary', 'text-white');
            btn.classList.add('bg-white', 'text-gray-600');
        }
    });

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// فلترة حسب البحث
function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
    );
    renderProducts(filtered);
}

// --- وظائف السلة ---

function addToCart(event, productId) {
    event.preventDefault(); // منع الرابط من الفتح عند الضغط على زر الإضافة
    event.stopPropagation(); // منع فتح المودال عند الضغط على زر الإضافة
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    saveCart();
    
    // تأثير بصري بسيط
    const btn = event.target.closest('button');
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => btn.innerHTML = originalHTML, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function updateQty(productId, change) {
    const item = cart.find(item => item.id === productId);
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
    
    // تحديث العداد
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    countBadge.textContent = totalCount;
    countBadge.style.display = totalCount > 0 ? 'flex' : 'none';

    // تحديث القائمة
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
            const price = item.sale_price > 0 ? item.sale_price : item.regular_price;
            const itemTotal = price * item.qty;
            totalPrice += itemTotal;

            cartContainer.innerHTML += `
                <div class="flex gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <img src="${item.image}" class="w-16 h-16 object-cover rounded" alt="${item.name}">
                    <div class="flex-1">
                        <h4 class="text-sm font-bold text-gray-800 line-clamp-1">${item.name}</h4>
                        <div class="text-primary font-bold text-sm mt-1">${price} ${STORE_CONFIG.currency}</div>
                        <div class="flex items-center justify-between mt-2">
                            <div class="flex items-center gap-2 bg-gray-100 rounded px-2">
                                <button onclick="updateQty(${item.id}, -1)" class="text-gray-500 hover:text-red-500">-</button>
                                <span class="text-sm font-medium w-4 text-center">${item.qty}</span>
                                <button onclick="updateQty(${item.id}, 1)" class="text-gray-500 hover:text-green-500">+</button>
                            </div>
                            <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 text-xs">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    totalEl.textContent = totalPrice.toFixed(2) + ' ' + STORE_CONFIG.currency;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const panel = document.getElementById('cart-panel');
    
    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        // تأخير بسيط للسماح للـ display:block بالتطبيق قبل التحويل
        setTimeout(() => {
            sidebar.classList.add('open');
            panel.classList.remove('-translate-x-full');
        }, 10);
    } else {
        panel.classList.add('-translate-x-full');
        sidebar.classList.remove('open');
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

// --- وظيفة الطلب عبر واتساب ---

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    let message = "*مرحباً، أود طلب المنتجات التالية من سوق الكويت:*\n\n";
    let total = 0;

    cart.forEach(item => {
        const price = item.sale_price > 0 ? item.sale_price : item.regular_price;
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

// --- نافذة تفاصيل المنتج ---

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    const price = product.sale_price > 0 ? product.sale_price : product.regular_price;
    const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;

    // إنشاء معرض صور إضافية
    let imageGalleryHTML = '';
    if (product.images && product.images.length > 0) {
        // دمج الصورة الرئيسية مع الصور الإضافية مع التأكد من عدم تكرارها
        const allImages = [product.image, ...product.images.filter(img => img !== product.image)];
        imageGalleryHTML = `
            <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
                ${allImages.map(img => `
                    <img src="${img || 'https://via.placeholder.com/300'}" alt="صورة إضافية" class="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-primary transition" onclick="document.getElementById('main-modal-image').src='${img}'">
                `).join('')}
            </div>
        `;
    }

    content.innerHTML = `
        <div class="md:col-span-1">
            <div class="flex items-center justify-center bg-gray-100 rounded-lg p-4">
                <img id="main-modal-image" src="${product.image || 'https://via.placeholder.com/400'}" alt="${product.name}" class="max-h-[400px] object-contain">
            </div>
            ${imageGalleryHTML}
        </div>
        <div class="md:col-span-1">
            <div class="text-sm text-primary font-bold mb-2">${product.category}</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">${product.name}</h2>
            <div class="flex items-baseline gap-3 mb-6">
                <span class="text-3xl font-bold text-primary">${price} ${STORE_CONFIG.currency}</span>
                ${hasDiscount ? `<span class="text-lg text-gray-400 line-through">${product.regular_price} ${STORE_CONFIG.currency}</span>` : ''}
            </div>
            <div class="prose text-gray-600 mb-8 max-h-40 overflow-y-auto" dir="auto">
                ${(product.description || '').replace(/\n/g, '<br>')}
            </div>
            <div class="flex gap-4">
                <button onclick="addToCart(event, ${product.id}); closeModal();" class="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-cart-plus"></i>
                    إضافة للسلة
                </button>
                <button onclick="closeModal()" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    إغلاق
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// إغلاق المودال عند النقر خارجه
document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') closeModal();
});