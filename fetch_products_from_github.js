/**
 * GitHub Product Pages Fetcher
 * يقوم بسحب صفحات المنتجات من مجلد products-pages في الريبوزتري
 * ويقوم بتحديث الموقع بآخر المنتجات
 */

const GITHUB_API_BASE = 'https://api.github.com/repos/sherow1982/sooq-alkuwait';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/sherow1982/sooq-alkuwait/main';
const PRODUCTS_FOLDER = 'products-pages';

/**
 * جلب قائمة بجميع ملفات المنتجات من GitHub
 */
async function fetchProductsList() {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/contents/${PRODUCTS_FOLDER}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch products list: ${response.statusText}`);
        }
        
        const files = await response.json();
        
        // تصفية الملفات HTML فقط
        const productFiles = files.filter(file => 
            file.type === 'file' && 
            file.name.endsWith('.html')
        );
        
        console.log(`✅ تم العثور على ${productFiles.length} صفحة منتج`);
        return productFiles;
        
    } catch (error) {
        console.error('❌ خطأ في جلب قائمة المنتجات:', error);
        return [];
    }
}

/**
 * جلب محتوى صفحة منتج واحدة
 */
async function fetchProductPage(fileName) {
    try {
        const response = await fetch(`${GITHUB_RAW_BASE}/${PRODUCTS_FOLDER}/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);
        }
        
        const content = await response.text();
        return {
            fileName,
            content,
            size: content.length
        };
        
    } catch (error) {
        console.error(`❌ خطأ في جلب ${fileName}:`, error);
        return null;
    }
}

/**
 * استخراج معلومات المنتج من محتوى HTML
 */
function extractProductInfo(htmlContent, fileName) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // استخراج المعلومات الأساسية
    const title = doc.querySelector('h1')?.textContent || 
                 doc.querySelector('title')?.textContent || 
                 fileName.replace('.html', '').replace(/-/g, ' ');
    
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 
                       doc.querySelector('.description')?.textContent || 
                       doc.querySelector('p')?.textContent?.substring(0, 200) || '';
    
    const price = doc.querySelector('.price')?.textContent || 
                 doc.querySelector('[data-price]')?.textContent || 
                 extractPriceFromText(htmlContent);
    
    const images = Array.from(doc.querySelectorAll('img')).map(img => img.src).filter(Boolean);
    
    const productId = fileName.match(/product-(\d+)/) ? fileName.match(/product-(\d+)/)[1] : 
                     fileName.match(/(\d+)/) ? fileName.match(/(\d+)/)[0] : 
                     Math.random().toString(36).substr(2, 9);
    
    return {
        id: productId,
        title: title.trim(),
        description: description.trim().substring(0, 300),
        price: price || 'غير محدد',
        images: images.slice(0, 5), // أول 5 صور فقط
        fileName,
        url: `/${PRODUCTS_FOLDER}/${fileName}`,
        lastUpdated: new Date().toISOString()
    };
}

/**
 * استخراج السعر من النص
 */
function extractPriceFromText(text) {
    const pricePatterns = [
        /([\d,]+)\s*د\.ك/g,        // دينار كويتي
        /KWD\s*([\d,]+)/g,        // KWD
        /([\d,]+)\s*ريال/g,       // ريال
        /([\d,]+)\s*درهم/g,       // درهم
        /\$([\d,]+)/g,           // دولار
        /([\d,]+)\s*جنيه/g        // جنيه
    ];
    
    for (let pattern of pricePatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0];
        }
    }
    
    return null;
}

/**
 * تحديث كتالوج المنتجات في الصفحة الرئيسية
 */
function updateProductCatalog(products) {
    const catalogContainer = document.getElementById('products-grid') || 
                           document.querySelector('.products-grid') ||
                           document.querySelector('.product-list');
    
    if (!catalogContainer) {
        console.warn('⚠️  لم يتم العثور على حاوي المنتجات');
        return;
    }
    
    // إنشاء HTML للمنتجات
    const productsHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                ${product.images.length > 0 ? 
                    `<img src="${product.images[0]}" alt="${product.title}" onerror="this.src='assets/images/placeholder.jpg'">` :
                    `<div class="no-image">📦</div>`
                }
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description.substring(0, 100)}...</p>
                <div class="product-price">${product.price}</div>
                <div class="product-actions">
                    <a href="${product.url}" class="btn btn-primary">عرض التفاصيل</a>
                    <button class="btn btn-cart" onclick="addToCart('${product.id}')">
                        🛒 إضافة للسلة
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    catalogContainer.innerHTML = productsHTML;
    
    // إضافة تأثيرات CSS إذا لم تكن موجودة
    addProductStyles();
    
    console.log(`✅ تم تحديث الكتالوج مع ${products.length} منتج`);
}

/**
 * إضافة أنماط CSS للمنتجات
 */
function addProductStyles() {
    if (document.getElementById('product-styles')) return;
    
    const styles = `
        <style id="product-styles">
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }
        
        .product-card {
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            background: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .product-image {
            text-align: center;
            margin-bottom: 10px;
        }
        
        .product-image img {
            max-width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
        }
        
        .no-image {
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        
        .product-title {
            font-size: 18px;
            margin: 10px 0;
            color: #333;
            line-height: 1.4;
        }
        
        .product-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        
        .product-price {
            font-size: 20px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 15px;
        }
        
        .product-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }
        
        .btn-primary {
            background: #3498db;
            color: white;
            flex: 1;
        }
        
        .btn-primary:hover {
            background: #2980b9;
        }
        
        .btn-cart {
            background: #27ae60;
            color: white;
            flex: 1;
        }
        
        .btn-cart:hover {
            background: #219a52;
        }
        
        @media (max-width: 768px) {
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
            }
            
            .product-actions {
                flex-direction: column;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

/**
 * البحث في المنتجات
 */
function searchProducts(products, searchTerm) {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase().trim();
    return products.filter(product => 
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.price.toLowerCase().includes(term)
    );
}

/**
 * إنشاء مؤشر البحث
 */
function createSearchIndex(products) {
    return products.reduce((index, product) => {
        const words = (product.title + ' ' + product.description)
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        words.forEach(word => {
            if (!index[word]) index[word] = [];
            index[word].push(product.id);
        });
        
        return index;
    }, {});
}

/**
 * إضافة وظائف البحث للصفحة
 */
function addSearchFunctionality(products) {
    const searchContainer = document.querySelector('.search-container') || 
                          document.querySelector('#search');
    
    if (searchContainer) {
        const searchInput = searchContainer.querySelector('input') || 
                           document.createElement('input');
        
        searchInput.type = 'text';
        searchInput.placeholder = 'البحث في المنتجات...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 20px;
            font-size: 16px;
            border: 2px solid #ddd;
            border-radius: 25px;
            margin-bottom: 20px;
        `;
        
        if (!searchInput.parentNode) {
            searchContainer.appendChild(searchInput);
        }
        
        // إضافة مستمع البحث
        searchInput.addEventListener('input', (e) => {
            const filteredProducts = searchProducts(products, e.target.value);
            updateProductCatalog(filteredProducts);
        });
        
        console.log('✅ تم إضافة وظيفة البحث');
    }
}

/**
 * الوظيفة الرئيسية
 */
async function fetchAndDisplayProducts() {
    console.log('🔄 بدء جلب المنتجات من GitHub...');
    
    // عرض مؤشر التحميل
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-products';
    loadingDiv.innerHTML = `
        <div style="text-align: center; padding: 50px; font-size: 18px;">
            ⏳ جاري تحميل المنتجات من GitHub...
            <div style="margin-top: 20px;">
                <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    const catalogContainer = document.getElementById('products-grid') || 
                           document.querySelector('.products-grid') ||
                           document.body;
    
    catalogContainer.appendChild(loadingDiv);
    
    try {
        // جلب قائمة الملفات
        const productFiles = await fetchProductsList();
        if (productFiles.length === 0) {
            throw new Error('لم يتم العثور على أي منتجات');
        }
        
        // جلب محتوى الصفحات (أول 50 منتج لتجنب التحميل الزائد)
        const maxProducts = Math.min(productFiles.length, 50);
        const products = [];
        
        for (let i = 0; i < maxProducts; i++) {
            const file = productFiles[i];
            console.log(`📄 جلب منتج ${i + 1}/${maxProducts}: ${file.name}`);
            
            const productPage = await fetchProductPage(file.name);
            if (productPage) {
                const productInfo = extractProductInfo(productPage.content, file.name);
                products.push(productInfo);
            }
            
            // توقف قصير لتجنب الضغط على API
            if (i < maxProducts - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        // إزالة مؤشر التحميل
        loadingDiv.remove();
        
        if (products.length === 0) {
            throw new Error('فشل في معالجة المنتجات');
        }
        
        // تحديث الواجهة
        updateProductCatalog(products);
        addSearchFunctionality(products);
        
        // حفظ البيانات في التخزين المحلي للاستخدام السريع
        localStorage.setItem('cachedProducts', JSON.stringify({
            products,
            timestamp: Date.now()
        }));
        
        console.log(`🎉 تم تحميل ${products.length} منتج بنجاح!`);
        
        // إظهار إحصائيات
        showProductStats(products);
        
    } catch (error) {
        console.error('❌ خطأ في جلب المنتجات:', error);
        loadingDiv.innerHTML = `
            <div style="text-align: center; padding: 50px; color: red;">
                ❌ حدث خطأ في تحميل المنتجات: ${error.message}
                <br><br>
                <button onclick="fetchAndDisplayProducts()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 إعادة المحاولة
                </button>
            </div>
        `;
    }
}

/**
 * عرض إحصائيات المنتجات
 */
function showProductStats(products) {
    const statsDiv = document.createElement('div');
    statsDiv.id = 'product-stats';
    statsDiv.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
    `;
    
    const totalProducts = products.length;
    const withImages = products.filter(p => p.images.length > 0).length;
    const withPrices = products.filter(p => p.price !== 'غير محدد').length;
    
    statsDiv.innerHTML = `
        <h3 style="margin: 0 0 15px 0;">📊 إحصائيات المنتجات</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div>
                <div style="font-size: 24px; font-weight: bold;">${totalProducts}</div>
                <div style="font-size: 14px; opacity: 0.9;">إجمالي المنتجات</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: bold;">${withImages}</div>
                <div style="font-size: 14px; opacity: 0.9;">منتج بصور</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: bold;">${withPrices}</div>
                <div style="font-size: 14px; opacity: 0.9;">منتج بأسعار</div>
            </div>
        </div>
    `;
    
    const catalogContainer = document.getElementById('products-grid') || 
                           document.querySelector('.products-grid');
    
    if (catalogContainer && catalogContainer.parentNode) {
        catalogContainer.parentNode.insertBefore(statsDiv, catalogContainer);
    }
}

/**
 * التحقق من وجود cache واستخدامه إذا كان حديثاً
 */
function loadCachedProducts() {
    try {
        const cached = localStorage.getItem('cachedProducts');
        if (cached) {
            const data = JSON.parse(cached);
            const hoursSinceCache = (Date.now() - data.timestamp) / (1000 * 60 * 60);
            
            if (hoursSinceCache < 2) { // Cache صالح لساعتين
                console.log('📦 تم تحميل المنتجات من Cache');
                updateProductCatalog(data.products);
                addSearchFunctionality(data.products);
                showProductStats(data.products);
                return true;
            }
        }
    } catch (error) {
        console.warn('⚠️  خطأ في تحميل Cache:', error);
    }
    return false;
}

/**
 * تشغيل الوظائف عند تحميل الصفحة
 */
if (typeof window !== 'undefined') {
    // تشغيل عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        if (!loadCachedProducts()) {
            fetchAndDisplayProducts();
        }
    });
    
    // إضافة وظائف للنطاق العام
    window.fetchAndDisplayProducts = fetchAndDisplayProducts;
    window.searchProducts = searchProducts;
    
    console.log('✅ تم تحميل GitHub Products Fetcher');
}

// Export functions for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchProductsList,
        fetchProductPage,
        extractProductInfo,
        updateProductCatalog,
        searchProducts,
        fetchAndDisplayProducts
    };
}