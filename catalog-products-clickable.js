// 🔥 نظام كاتالوج المنتجات - البطاقة كلها قابلة للنقر

let allProducts = [];
let displayedProducts = [];
let currentPage = 1;
const productsPerPage = 24;

async function loadProductsData() {
    try {
        const response = await fetch('products_data.json');
        const data = await response.json();
        allProducts = data;

        console.log('تم تحميل ' + allProducts.length + ' منتج');
        displayProducts(allProducts, 1);
        updateLoadMoreButton();

    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        document.getElementById('products-container').innerHTML = 
            '<div class="error-message">خطأ في تحميل المنتجات</div>';
    }
}

function displayProducts(products, page = 1, append = false) {
    const container = document.getElementById('products-container');
    if (!container) return;

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = products.slice(startIndex, endIndex);

    const productsHTML = productsToShow.map(product => {
        const imageUrl = product.image_link && product.image_link.trim() !== '' 
            ? product.image_link 
            : 'https://via.placeholder.com/400x300/667eea/ffffff?text=Product';

        const discountPercent = product.price > product.sale_price 
            ? Math.round(((product.price - product.sale_price) / product.price) * 100)
            : 0;

        return '<div class="product-card" data-id="' + product.id + '" onclick="openProduct(\'' + product.product_link + '\')" style="cursor: pointer;">' +
            '<div class="product-image">' +
                '<img src="' + imageUrl + '" alt="' + product.title + '" loading="lazy" onerror="this.src=\'https://via.placeholder.com/400x300/667eea/ffffff?text=Product\'">' +
                (discountPercent > 0 ? '<span class="discount-badge">خصم ' + discountPercent + '%</span>' : '') +
                (product.availability === 'in stock' ? '<span class="stock-badge">متوفر</span>' : '') +
            '</div>' +
            '<div class="product-info">' +
                '<h3 class="product-title">' + product.title + '</h3>' +
                '<p class="product-description">' + product.description + '</p>' +
                '<div class="product-price">' +
                    (product.price > product.sale_price ? '<span class="price-old">' + product.price.toFixed(2) + ' د.ك</span>' : '') +
                    '<span class="price-current">' + product.sale_price.toFixed(2) + ' د.ك</span>' +
                '</div>' +
            '</div>' +
            '<div class="product-actions" onclick="event.stopPropagation();">' +
                '<button class="btn-view-details" onclick="openProduct(\'' + product.product_link + '\')">' +
                    '<i class="fas fa-eye"></i> شاهد التفاصيل' +
                '</button>' +
                '<button class="btn-whatsapp" onclick="orderViaWhatsApp(' + product.id + ')">' +
                    '<i class="fab fa-whatsapp"></i> واتساب' +
                '</button>' +
            '</div>' +
        '</div>';
    }).join('');

    if (append) {
        container.innerHTML += productsHTML;
    } else {
        container.innerHTML = productsHTML;
    }

    displayedProducts = append ? [...displayedProducts, ...productsToShow] : productsToShow;
}

// فتح صفحة المنتج في تبويب جديد
function openProduct(productLink) {
    window.open(productLink, '_blank', 'noopener,noreferrer');
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    const totalProducts = allProducts.length;
    const displayedCount = currentPage * productsPerPage;

    if (displayedCount >= totalProducts) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        const remaining = totalProducts - displayedCount;
        loadMoreBtn.innerHTML = '<i class="fas fa-plus-circle"></i> تحميل المزيد (' + remaining + ' منتج)';
    }

    const counterEl = document.getElementById('products-counter');
    if (counterEl) {
        counterEl.textContent = 'عرض ' + Math.min(displayedCount, totalProducts) + ' من ' + totalProducts + ' منتج';
    }
}

function loadMoreProducts() {
    currentPage++;
    displayProducts(allProducts, currentPage, true);
    updateLoadMoreButton();
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    currentPage = 1;

    if (!searchTerm) {
        displayProducts(allProducts, 1);
        updateLoadMoreButton();
        return;
    }

    const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.id.toString().includes(searchTerm)
    );

    displayProducts(filtered, 1);

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';

    const counterEl = document.getElementById('products-counter');
    if (counterEl) counterEl.textContent = 'نتائج البحث: ' + filtered.length + ' منتج';
}

function filterByCategory(category) {
    currentPage = 1;

    if (!category || category === 'all') {
        displayProducts(allProducts, 1);
        updateLoadMoreButton();
        return;
    }

    const filtered = allProducts.filter(product => 
        product.category && product.category.toLowerCase().includes(category.toLowerCase())
    );

    displayProducts(filtered, 1);

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';

    const counterEl = document.getElementById('products-counter');
    if (counterEl) counterEl.textContent = category + ': ' + filtered.length + ' منتج';
}

function setActiveBtn(btn) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function orderViaWhatsApp(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        alert('خطأ: المنتج غير موجود!');
        return;
    }

    const message = 'طلب منتج جديد\n\n' +
        'المنتج: ' + product.title + '\n' +
        'رقم المنتج: ' + product.id + '\n' +
        'السعر: ' + product.sale_price.toFixed(2) + ' د.ك\n' +
        'الرابط: ' + window.location.origin + '/' + product.product_link + '\n\n' +
        'بيانات المشتري:\n' +
        'الاسم: \n' +
        'العنوان: \n' +
        'الهاتف: \n' +
        'الكمية: ';

    const whatsappLink = 'https://wa.me/201110760081?text=' + encodeURIComponent(message);
    window.open(whatsappLink, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductsData();

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreProducts);

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', (e) => searchProducts(e.target.value));
});
