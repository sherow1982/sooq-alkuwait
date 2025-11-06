/**
 * JSON-Based Products Fetcher - الحل الأمثل للمجلدات الكبيرة
 * يستخدم ملف products_data.json بدلاً من معالجة آلاف ملفات HTML
 */

const JSON_CONFIG = {
    JSON_URL: 'https://raw.githubusercontent.com/sherow1982/sooq-alkuwait/main/products_data.json',
    CACHE_KEY: 'jsonProductsCache',
    CACHE_DURATION: 3, // ساعات
    DEFAULT_IMAGE: 'assets/images/placeholder.jpg',
    ITEMS_PER_PAGE: 24,
    SEARCH_DEBOUNCE: 300
};

/**
 * جلب المنتجات من ملف JSON
 */
async function fetchProductsFromJSON() {
    try {
        console.log('📥 جلب المنتجات من ملف JSON...');
        
        // عرض مؤشر التحميل
        showLoadingIndicator();
        
        const response = await fetch(JSON_CONFIG.JSON_URL);
        if (!response.ok) {
            throw new Error(`فشل في جلب ملف JSON: ${response.status}`);
        }
        
        const jsonData = await response.text();
        
        // تحليل البيانات وتنظيفها
        const products = parseProductsJSON(jsonData);
        
        console.log(`✅ تم جلب ${products.length} منتج من JSON`);
        return products;
        
    } catch (error) {
        console.error('❌ خطأ في جلب المنتجات من JSON:', error);
        throw error;
    } finally {
        hideLoadingIndicator();
    }
}

/**
 * تحليل وتنظيف بيانات JSON
 */
function parseProductsJSON(jsonText) {
    try {
        // إزالة الأحرف غير الضرورية وتنظيف النص
        const cleanedText = jsonText
            .replace(/description \. \. \. \. \. ,/g, '"description":"",') // إزالة الوصف الفارغ
            .replace(/id (\d+),/g, '"id":"$1",') // تنسيق ID
            .replace(/title ([^,]+),/g, '"title":"$1",') // تنسيق العنوان
            .replace(/price ([\d.]+),/g, '"price":"$1",') // تنسيق السعر
            .replace(/saleprice ([\d.]+),/g, '"saleprice":"$1",') // تنسيق سعر التخفيض
            .replace(/imagelink ([^,\s]+)/g, '"imagelink":"$1"'); // تنسيق رابط الصورة
        
        // محاولة استخراج البيانات بنمط regex
        const productPattern = /id (\d+), title ([^,]*), price ([\d.]+), saleprice ([\d.]+), imagelink ([^,\s]+)/g;
        const products = [];
        let match;
        let counter = 1;
        
        while ((match = productPattern.exec(jsonText)) !== null && products.length < 1000) {
            const [, id, title, price, saleprice, imagelink] = match;
            
            // تنظيف البيانات
            const cleanedProduct = {
                id: id || counter.toString(),
                title: cleanTitle(title || `منتج ${counter}`),
                price: formatPrice(price),
                saleprice: formatPrice(saleprice),
                originalPrice: parseFloat(price) || 0,
                salePrice: parseFloat(saleprice) || 0,
                discount: calculateDiscount(price, saleprice),
                image: cleanImageURL(imagelink),
                category: extractCategory(title),
                description: generateDescription(title),
                url: `/product-${id || counter}`,
                inStock: true,
                featured: parseFloat(saleprice) < parseFloat(price) * 0.7, // المنتجات المخفضة بأكثر من 30%
                rating: generateRating(),
                lastUpdated: new Date().toISOString()
            };
            
            products.push(cleanedProduct);
            counter++;
        }
        
        console.log(`🔧 تم تحليل ${products.length} منتج من البيانات الخام`);
        return products.filter(p => p.title && p.price); // إزالة المنتجات غير المكتملة
        
    } catch (error) {
        console.error('❌ خطأ في تحليل JSON:', error);
        return [];
    }
}

/**
 * تنظيف العنوان
 */
function cleanTitle(title) {
    return title
        .trim()
        .replace(/^\s*,\s*/, '') // إزالة الفواصل في البداية
        .replace(/\s+/g, ' ') // دمج المسافات المتعددة
        .substring(0, 100) || 'منتج بدون عنوان';
}

/**
 * تنسيق السعر
 */
function formatPrice(price) {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) return 'غير محدد';
    return `${numPrice.toFixed(2)} د.ك`;
}

/**
 * حساب نسبة الخصم
 */
function calculateDiscount(originalPrice, salePrice) {
    const orig = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);
    
    if (isNaN(orig) || isNaN(sale) || orig <= sale) return 0;
    
    return Math.round(((orig - sale) / orig) * 100);
}

/**
 * تنظيف رابط الصورة
 */
function cleanImageURL(imagelink) {
    if (!imagelink || imagelink === 'undefined') {
        return JSON_CONFIG.DEFAULT_IMAGE;
    }
    
    // إصلاح الروابط المكسورة
    let cleanURL = imagelink
        .replace(/^https?\s*:?\s*\/?\/?/, 'https://')
        .replace(/\.([a-z]{3,4}).*$/, '.$1'); // إزالة النص الإضافي بعد امتداد الملف
    
    // التحقق من صحة الرابط
    try {
        new URL(cleanURL);
        return cleanURL;
    } catch {
        return JSON_CONFIG.DEFAULT_IMAGE;
    }
}

/**
 * استخراج الفئة من العنوان
 */
function extractCategory(title) {
    const titleLower = title.toLowerCase();
    
    const categories = {
        'إلكترونيات': ['phone', 'iphone', 'samsung', 'tv', 'laptop', 'tablet', 'speaker', 'headphone', 'airpods', 'led'],
        'جمال وعناية': ['cream', 'serum', 'mask', 'beauty', 'skin', 'hair', 'shampoo', 'perfume'],
        'أدوات منزلية': ['kitchen', 'home', 'cleaning', 'tool', 'bottle', 'cup'],
        'ملابس': ['shirt', 'dress', 'bag', 'clothes', 'fashion'],
        'رياضة': ['sport', 'fitness', 'exercise', 'gym']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => titleLower.includes(keyword))) {
            return category;
        }
    }
    
    return 'عام';
}

/**
 * إنشاء وصف تلقائي
 */
function generateDescription(title) {
    const category = extractCategory(title);
    return `${title} - منتج عالي الجودة من فئة ${category}. متوفر بأفضل الأسعار.`;
}

/**
 * إنشاء تقييم عشوائي واقعي
 */
function generateRating() {
    return (Math.random() * 2 + 3).toFixed(1); // تقييم بين 3.0 و 5.0
}

/**
 * عرض المنتجات مع التصفح
 */
function displayProductsWithPagination(products, page = 1) {
    const startIndex = (page - 1) * JSON_CONFIG.ITEMS_PER_PAGE;
    const endIndex = startIndex + JSON_CONFIG.ITEMS_PER_PAGE;
    const pageProducts = products.slice(startIndex, endIndex);
    
    displayProducts(pageProducts);
    createPaginationControls(products.length, page);
    updateProductStats(products, pageProducts.length, page);
}

/**
 * عرض المنتجات
 */
function displayProducts(products) {
    const container = document.getElementById('products-grid') || createProductsContainer();
    
    const productsHTML = products.map(product => `
        <div class="product-card ${product.featured ? 'featured' : ''}" data-product-id="${product.id}">
            <div class="product-badge-container">
                ${product.discount > 0 ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                ${product.featured ? '<span class="featured-badge">مميز</span>' : ''}
            </div>
            
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" 
                     onerror="this.src='${JSON_CONFIG.DEFAULT_IMAGE}'" 
                     loading="lazy">
            </div>
            
            <div class="product-info">
                <h3 class="product-title" title="${product.title}">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                
                <div class="product-rating">
                    <span class="stars">★★★★☆</span>
                    <span class="rating-value">(${product.rating})</span>
                </div>
                
                <div class="product-pricing">
                    ${product.discount > 0 ? 
                        `<span class="original-price">${product.price}</span>
                         <span class="sale-price">${product.saleprice}</span>` :
                        `<span class="current-price">${product.price}</span>`
                    }
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="viewProduct('${product.id}')">
                        👁️ عرض التفاصيل
                    </button>
                    <button class="btn btn-cart" onclick="addToCart('${product.id}')">
                        🛒 أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productsHTML;
    
    // إضافة التأثيرات البصرية
    addProductAnimations();
}

/**
 * إنشاء حاوي المنتجات
 */
function createProductsContainer() {
    const container = document.createElement('div');
    container.id = 'products-grid';
    container.className = 'products-grid';
    document.body.appendChild(container);
    return container;
}

/**
 * إنشاء أدوات التصفح
 */
function createPaginationControls(totalProducts, currentPage) {
    const totalPages = Math.ceil(totalProducts / JSON_CONFIG.ITEMS_PER_PAGE);
    
    let paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        paginationContainer.className = 'pagination-container';
        
        const gridContainer = document.getElementById('products-grid');
        gridContainer.parentNode.insertBefore(paginationContainer, gridContainer.nextSibling);
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // زر الصفحة السابقة
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">« السابق</button>`;
    }
    
    // أرقام الصفحات
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
                                   onclick="goToPage(${i})">${i}</button>`;
    }
    
    // زر الصفحة التالية
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">التالي »</button>`;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

/**
 * تحديث إحصائيات المنتجات
 */
function updateProductStats(allProducts, displayedCount, currentPage) {
    let statsContainer = document.getElementById('product-stats');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.id = 'product-stats';
        statsContainer.className = 'product-stats';
        
        const gridContainer = document.getElementById('products-grid');
        gridContainer.parentNode.insertBefore(statsContainer, gridContainer);
    }
    
    const totalProducts = allProducts.length;
    const featuredProducts = allProducts.filter(p => p.featured).length;
    const discountedProducts = allProducts.filter(p => p.discount > 0).length;
    const categories = [...new Set(allProducts.map(p => p.category))].length;
    
    const startItem = ((currentPage - 1) * JSON_CONFIG.ITEMS_PER_PAGE) + 1;
    const endItem = startItem + displayedCount - 1;
    
    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${totalProducts}</div>
                <div class="stat-label">إجمالي المنتجات</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${featuredProducts}</div>
                <div class="stat-label">منتج مميز</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${discountedProducts}</div>
                <div class="stat-label">منتج مخفض</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${categories}</div>
                <div class="stat-label">فئة مختلفة</div>
            </div>
        </div>
        <div class="display-info">
            عرض ${startItem} - ${endItem} من أصل ${totalProducts} منتج
        </div>
    `;
}

/**
 * البحث في المنتجات
 */
function searchProducts(products, searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return products;
    
    const term = searchTerm.toLowerCase().trim();
    return products.filter(product => 
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
}

/**
 * فلترة المنتجات حسب الفئة
 */
function filterByCategory(products, category) {
    if (!category || category === 'all') return products;
    return products.filter(product => product.category === category);
}

/**
 * ترتيب المنتجات
 */
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-asc':
            return sortedProducts.sort((a, b) => a.salePrice - b.salePrice);
        case 'price-desc':
            return sortedProducts.sort((a, b) => b.salePrice - a.salePrice);
        case 'name':
            return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        case 'discount':
            return sortedProducts.sort((a, b) => b.discount - a.discount);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        default:
            return sortedProducts;
    }
}

/**
 * الانتقال لصفحة معينة
 */
function goToPage(page) {
    const cachedData = getCachedProducts();
    if (cachedData && cachedData.products) {
        displayProductsWithPagination(cachedData.products, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * عرض مؤشر التحميل
 */
function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'loading-indicator';
    indicator.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>📦 جاري تحميل المنتجات من JSON...</p>
            </div>
        </div>
    `;
    document.body.appendChild(indicator);
}

/**
 * إخفاء مؤشر التحميل
 */
function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) indicator.remove();
}

/**
 * إضافة التأثيرات البصرية
 */
function addProductAnimations() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

/**
 * حفظ في Cache
 */
function saveToCache(products) {
    const cacheData = {
        products,
        timestamp: Date.now(),
        version: '3.0'
    };
    localStorage.setItem(JSON_CONFIG.CACHE_KEY, JSON.stringify(cacheData));
    console.log(`💾 تم حفظ ${products.length} منتج في Cache`);
}

/**
 * جلب من Cache
 */
function getCachedProducts() {
    try {
        const cached = localStorage.getItem(JSON_CONFIG.CACHE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const hoursSinceCache = (Date.now() - data.timestamp) / (1000 * 60 * 60);
        
        if (hoursSinceCache < JSON_CONFIG.CACHE_DURATION) {
            console.log(`📦 استخدام البيانات المحفوظة (عمر: ${Math.round(hoursSinceCache * 60)} دقيقة)`);
            return data;
        }
        
        console.log('⏰ انتهت صلاحية Cache، سيتم جلب بيانات جديدة');
        return null;
        
    } catch (error) {
        console.warn('⚠️ خطأ في قراءة Cache:', error);
        return null;
    }
}

/**
 * الوظيفة الرئيسية
 */
async function initJSONProductsSystem() {
    try {
        console.log('🚀 بدء نظام المنتجات المبني على JSON...');
        
        // محاولة جلب من Cache أولاً
        let cachedData = getCachedProducts();
        let products;
        
        if (cachedData && cachedData.products) {
            products = cachedData.products;
            console.log(`📦 تم تحميل ${products.length} منتج من Cache`);
        } else {
            // جلب من JSON إذا لم يتوفر Cache
            products = await fetchProductsFromJSON();
            saveToCache(products);
        }
        
        if (products.length === 0) {
            throw new Error('لم يتم العثور على أي منتجات');
        }
        
        // عرض المنتجات
        displayProductsWithPagination(products);
        
        // إضافة أدوات البحث والفلترة
        setupSearchAndFilters(products);
        
        // إضافة الأنماط CSS
        addJSONSystemStyles();
        
        console.log('✅ تم تشغيل نظام JSON بنجاح!');
        return products;
        
    } catch (error) {
        console.error('❌ فشل في تشغيل نظام JSON:', error);
        showErrorMessage('فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.');
        throw error;
    }
}

/**
 * إعداد البحث والفلترة
 */
function setupSearchAndFilters(products) {
    // إنشاء شريط البحث والفلاتر
    let controlsContainer = document.getElementById('products-controls');
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'products-controls';
        controlsContainer.className = 'products-controls';
        
        const statsContainer = document.getElementById('product-stats');
        if (statsContainer && statsContainer.parentNode) {
            statsContainer.parentNode.insertBefore(controlsContainer, statsContainer.nextSibling);
        }
    }
    
    // الحصول على فئات فريدة
    const categories = ['all', ...new Set(products.map(p => p.category))];
    
    controlsContainer.innerHTML = `
        <div class="search-filter-row">
            <div class="search-box">
                <input type="text" id="product-search" placeholder="🔍 ابحث في المنتجات..." />
            </div>
            <div class="filter-box">
                <select id="category-filter">
                    ${categories.map(cat => 
                        `<option value="${cat}">${cat === 'all' ? 'جميع الفئات' : cat}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="sort-box">
                <select id="sort-products">
                    <option value="default">الترتيب الافتراضي</option>
                    <option value="price-asc">السعر: من الأقل للأعلى</option>
                    <option value="price-desc">السعر: من الأعلى للأقل</option>
                    <option value="name">الاسم أبجدياً</option>
                    <option value="discount">حسب الخصم</option>
                    <option value="rating">حسب التقييم</option>
                </select>
            </div>
        </div>
    `;
    
    // إضافة مستمعات الأحداث
    setupControlsEvents(products);
}

/**
 * إعداد أحداث التحكم
 */
function setupControlsEvents(allProducts) {
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-products');
    
    let searchTimeout;
    
    function applyFilters() {
        const searchTerm = searchInput.value;
        const selectedCategory = categoryFilter.value;
        const sortBy = sortSelect.value;
        
        let filteredProducts = [...allProducts];
        
        // تطبيق البحث
        filteredProducts = searchProducts(filteredProducts, searchTerm);
        
        // تطبيق فلتر الفئة
        filteredProducts = filterByCategory(filteredProducts, selectedCategory);
        
        // تطبيق الترتيب
        filteredProducts = sortProducts(filteredProducts, sortBy);
        
        // عرض النتائج
        displayProductsWithPagination(filteredProducts);
        
        console.log(`🔍 تم العثور على ${filteredProducts.length} منتج`);
    }
    
    // البحث مع تأخير
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, JSON_CONFIG.SEARCH_DEBOUNCE);
    });
    
    // فلترة الفئات
    categoryFilter.addEventListener('change', applyFilters);
    
    // الترتيب
    sortSelect.addEventListener('change', applyFilters);
}

/**
 * إضافة أنماط CSS للنظام
 */
function addJSONSystemStyles() {
    if (document.getElementById('json-system-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'json-system-styles';
    styles.textContent = `
        /* مؤشر التحميل */
        .loading-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .loading-spinner {
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px; height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* شبكة المنتجات */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }
        
        /* بطاقة المنتج */
        .product-card {
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 15px;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .product-card.featured {
            border-color: #f39c12;
            box-shadow: 0 4px 15px rgba(243,156,18,0.3);
        }
        
        /* شارات المنتج */
        .product-badge-container {
            position: absolute;
            top: 10px; right: 10px;
            z-index: 5;
        }
        
        .discount-badge, .featured-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 5px;
        }
        
        .discount-badge {
            background: #e74c3c; color: white;
        }
        
        .featured-badge {
            background: #f39c12; color: white;
        }
        
        /* صورة المنتج */
        .product-image {
            text-align: center;
            margin-bottom: 15px;
        }
        
        .product-image img {
            width: 100%; height: 200px;
            object-fit: cover;
            border-radius: 8px;
        }
        
        /* معلومات المنتج */
        .product-title {
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0 5px;
            color: #333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .product-category {
            font-size: 12px;
            color: #3498db;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .product-description {
            font-size: 14px;
            color: #666;
            line-height: 1.4;
            margin-bottom: 10px;
        }
        
        /* التقييم */
        .product-rating {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .stars {
            color: #f1c40f;
            margin-left: 5px;
        }
        
        .rating-value {
            font-size: 14px;
            color: #666;
        }
        
        /* الأسعار */
        .product-pricing {
            margin: 15px 0;
        }
        
        .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 14px;
            margin-left: 8px;
        }
        
        .sale-price, .current-price {
            color: #e74c3c;
            font-size: 18px;
            font-weight: bold;
        }
        
        /* أزرار المنتج */
        .product-actions {
            display: flex;
            gap: 8px;
        }
        
        .btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.3s ease;
        }
        
        .btn-primary {
            background: #3498db; color: white;
        }
        
        .btn-primary:hover {
            background: #2980b9;
        }
        
        .btn-cart {
            background: #27ae60; color: white;
        }
        
        .btn-cart:hover {
            background: #219a52;
        }
        
        /* الإحصائيات */
        .product-stats {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .stat-card {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 12px;
            opacity: 0.9;
        }
        
        .display-info {
            text-align: center;
            font-size: 14px;
            opacity: 0.8;
        }
        
        /* أدوات التحكم */
        .products-controls {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .search-filter-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 15px;
            align-items: center;
        }
        
        .search-box input,
        .filter-box select,
        .sort-box select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        }
        
        .search-box input:focus,
        .filter-box select:focus,
        .sort-box select:focus {
            border-color: #3498db;
            outline: none;
        }
        
        /* التصفح */
        .pagination-container {
            margin: 30px 0;
            text-align: center;
        }
        
        .pagination {
            display: inline-flex;
            gap: 5px;
        }
        
        .page-btn {
            padding: 10px 15px;
            border: 2px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .page-btn:hover {
            background: #3498db;
            color: white;
            border-color: #3498db;
        }
        
        .page-btn.active {
            background: #3498db;
            color: white;
            border-color: #3498db;
        }
        
        /* التأثيرات */
        .fade-in {
            opacity: 0;
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* الاستجابة */
        @media (max-width: 768px) {
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 15px;
            }
            
            .search-filter-row {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .product-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

/**
 * عرض رسالة خطأ
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 20px;
        border-radius: 10px;
        margin: 20px;
        text-align: center;
        border: 1px solid #f5c6cb;
    `;
    errorDiv.innerHTML = `❌ ${message}`;
    document.body.appendChild(errorDiv);
}

/**
 * وظائف للاستخدام الخارجي
 */
function viewProduct(productId) {
    console.log(`👁️ عرض تفاصيل المنتج: ${productId}`);
    // يمكن إضافة منطق عرض التفاصيل هنا
}

function addToCart(productId) {
    console.log(`🛒 إضافة المنتج للسلة: ${productId}`);
    // يمكن إضافة منطق السلة هنا
}

// إضافة للنطاق العام
if (typeof window !== 'undefined') {
    window.initJSONProductsSystem = initJSONProductsSystem;
    window.goToPage = goToPage;
    window.viewProduct = viewProduct;
    window.addToCart = addToCart;
    
    console.log('✅ تم تحميل نظام المنتجات المبني على JSON');
}

// التشغيل التلقائي
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initJSONProductsSystem().catch(console.error);
    });
}

// Export للوحدات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initJSONProductsSystem,
        fetchProductsFromJSON,
        parseProductsJSON,
        searchProducts,
        filterByCategory,
        sortProducts
    };
}