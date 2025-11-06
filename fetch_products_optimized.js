/**
 * Optimized GitHub Products Fetcher for Large Repositories
 * نظام محسن لسحب المنتجات من المجلدات الكبيرة
 */

const GITHUB_CONFIG = {
    OWNER: 'sherow1982',
    REPO: 'sooq-alkuwait',
    PRODUCTS_FOLDER: 'products-pages',
    API_BASE: 'https://api.github.com/repos/sherow1982/sooq-alkuwait',
    RAW_BASE: 'https://raw.githubusercontent.com/sherow1982/sooq-alkuwait/main'
};

const OPTIMIZATION_CONFIG = {
    BATCH_SIZE: 20,           // عدد الملفات في كل دفعة
    DELAY_BETWEEN_BATCHES: 1000, // تأخير بين الدفعات (ملي ثانية)
    MAX_PRODUCTS: 100,        // حد أقصى للمنتجات
    USE_TREE_API: true,       // استخدام Tree API للمجلدات الكبيرة
    ENABLE_PAGINATION: true,  // تفعيل التصفح بالصفحات
    CACHE_DURATION: 4         // مدة Cache بالساعات
};

/**
 * جلب قائمة الملفات باستخدام Git Trees API (للمجلدات الكبيرة)
 */
async function fetchProductsListOptimized() {
    try {
        console.log('🔍 جلب قائمة المنتجات باستخدام Tree API...');
        
        // الحصول على SHA الخاص بالفرع الرئيسي
        const mainBranchResponse = await fetch(`${GITHUB_CONFIG.API_BASE}/branches/main`);
        if (!mainBranchResponse.ok) {
            throw new Error('فشل في الحصول على معلومات الفرع الرئيسي');
        }
        
        const branchData = await mainBranchResponse.json();
        const treeSha = branchData.commit.commit.tree.sha;
        
        // جلب شجرة الملفات
        const treeResponse = await fetch(`${GITHUB_CONFIG.API_BASE}/git/trees/${treeSha}?recursive=1`);
        if (!treeResponse.ok) {
            throw new Error('فشل في جلب شجرة الملفات');
        }
        
        const treeData = await treeResponse.json();
        
        // تصفية ملفات المنتجات
        const productFiles = treeData.tree
            .filter(item => 
                item.type === 'blob' && 
                item.path.startsWith(GITHUB_CONFIG.PRODUCTS_FOLDER + '/') && 
                item.path.endsWith('.html')
            )
            .map(item => ({
                name: item.path.split('/').pop(),
                path: item.path,
                sha: item.sha,
                size: item.size || 0
            }))
            .slice(0, OPTIMIZATION_CONFIG.MAX_PRODUCTS); // تحديد العدد الأقصى
        
        console.log(`✅ تم العثور على ${productFiles.length} ملف منتج`);
        return productFiles;
        
    } catch (error) {
        console.error('❌ خطأ في جلب قائمة المنتجات:', error);
        return [];
    }
}

/**
 * جلب محتوى الملفات على دفعات
 */
async function fetchProductsBatched(productFiles) {
    const products = [];
    const totalBatches = Math.ceil(productFiles.length / OPTIMIZATION_CONFIG.BATCH_SIZE);
    
    console.log(`📦 معالجة ${productFiles.length} منتج في ${totalBatches} دفعة`);
    
    for (let i = 0; i < totalBatches; i++) {
        const batchStart = i * OPTIMIZATION_CONFIG.BATCH_SIZE;
        const batchEnd = Math.min(batchStart + OPTIMIZATION_CONFIG.BATCH_SIZE, productFiles.length);
        const batch = productFiles.slice(batchStart, batchEnd);
        
        console.log(`⏳ معالجة الدفعة ${i + 1}/${totalBatches} (${batch.length} ملف)`);
        
        // معالجة الدفعة الحالية بالتوازي
        const batchPromises = batch.map(async (file) => {
            try {
                const content = await fetchSingleProductOptimized(file);
                if (content) {
                    return extractProductInfo(content, file.name);
                }
                return null;
            } catch (error) {
                console.warn(`⚠️ خطأ في معالجة ${file.name}:`, error.message);
                return null;
            }
        });
        
        const batchResults = await Promise.allSettled(batchPromises);
        const successfulProducts = batchResults
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value);
        
        products.push(...successfulProducts);
        
        // تحديث شريط التقدم
        updateProgressBar(i + 1, totalBatches, products.length);
        
        // تأخير بين الدفعات لتجنب حدود API
        if (i < totalBatches - 1) {
            await delay(OPTIMIZATION_CONFIG.DELAY_BETWEEN_BATCHES);
        }
    }
    
    console.log(`🎉 تم معالجة ${products.length} منتج بنجاح`);
    return products;
}

/**
 * جلب محتوى منتج واحد
 */
async function fetchSingleProductOptimized(file) {
    try {
        const response = await fetch(`${GITHUB_CONFIG.RAW_BASE}/${file.path}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const content = await response.text();
        return content;
        
    } catch (error) {
        console.warn(`⚠️ فشل في جلب ${file.name}:`, error.message);
        return null;
    }
}

/**
 * استخراج معلومات المنتج المحسن
 */
function extractProductInfo(htmlContent, fileName) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // استخراج العنوان
    const title = doc.querySelector('h1')?.textContent?.trim() ||
                 doc.querySelector('title')?.textContent?.trim() ||
                 doc.querySelector('.product-title')?.textContent?.trim() ||
                 fileName.replace(/^product-/, '').replace('.html', '').replace(/-/g, ' ');
    
    // استخراج الوصف
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ||
                       doc.querySelector('.product-description')?.textContent?.trim() ||
                       doc.querySelector('.description')?.textContent?.trim() ||
                       doc.querySelector('p')?.textContent?.trim() || '';
    
    // استخراج السعر المحسن
    const price = extractAdvancedPrice(htmlContent, doc);
    
    // استخراج الصور
    const images = Array.from(doc.querySelectorAll('img'))
        .map(img => img.src || img.getAttribute('data-src'))
        .filter(Boolean)
        .slice(0, 3); // أول 3 صور فقط
    
    // استخراج معرف المنتج
    const productId = extractProductId(fileName, htmlContent);
    
    // استخراج الفئة
    const category = extractCategory(title, description);
    
    return {
        id: productId,
        title: title.substring(0, 100), // تحديد طول العنوان
        description: description.substring(0, 200), // تحديد طول الوصف
        price: price,
        category: category,
        images: images,
        fileName: fileName,
        url: `/${GITHUB_CONFIG.PRODUCTS_FOLDER}/${fileName}`,
        lastUpdated: new Date().toISOString(),
        size: htmlContent.length
    };
}

/**
 * استخراج السعر المتقدم
 */
function extractAdvancedPrice(htmlContent, doc) {
    // البحث في العناصر المحددة أولاً
    const priceSelectors = [
        '.price', '.product-price', '.cost', '[data-price]',
        '.amount', '.value', '.currency'
    ];
    
    for (const selector of priceSelectors) {
        const element = doc.querySelector(selector);
        if (element) {
            const price = element.textContent || element.getAttribute('data-price');
            if (price && price.match(/[\d,]+/)) {
                return price.trim();
            }
        }
    }
    
    // البحث بالنماذج النصية
    const pricePatterns = [
        /([0-9,]+\.?[0-9]*)\s*(د\.ك|دينار كويتي|KWD)/gi,
        /([0-9,]+\.?[0-9]*)\s*(ريال|SAR)/gi,
        /([0-9,]+\.?[0-9]*)\s*(درهم|AED)/gi,
        /([0-9,]+\.?[0-9]*)\s*(جنيه|EGP)/gi,
        /\$([0-9,]+\.?[0-9]*)/gi,
        /([0-9,]+\.?[0-9]*)\s*(دولار)/gi
    ];
    
    for (const pattern of pricePatterns) {
        const match = htmlContent.match(pattern);
        if (match) {
            return match[0];
        }
    }
    
    return 'غير محدد';
}

/**
 * استخراج معرف المنتج
 */
function extractProductId(fileName, htmlContent) {
    // محاولة استخراج من اسم الملف
    let id = fileName.match(/product-(\d+)/i);
    if (id) return id[1];
    
    id = fileName.match(/(\d+)/);
    if (id) return id[0];
    
    // محاولة استخراج من المحتوى
    id = htmlContent.match(/id["\s]*[:=]["\s]*(\w+)/i);
    if (id) return id[1];
    
    // إنشاء معرف من hash اسم الملف
    return btoa(fileName).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
}

/**
 * استخراج الفئة
 */
function extractCategory(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    const categories = {
        'إلكترونيات': ['هاتف', 'جوال', 'كمبيوتر', 'لابتوب', 'تلفزيون', 'شاشة'],
        'أزياء': ['ملابس', 'قميص', 'بنطال', 'فستان', 'حذاء', 'حقيبة'],
        'منزل': ['أثاث', 'طاولة', 'كرسي', 'سرير', 'مطبخ', 'حمام'],
        'رياضة': ['رياضة', 'تمرين', 'لياقة', 'كرة', 'دراجة'],
        'جمال': ['تجميل', 'عطر', 'شامبو', 'كريم', 'مكياج']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    
    return 'عام';
}

/**
 * عرض شريط التقدم
 */
function updateProgressBar(current, total, productsLoaded) {
    const percentage = Math.round((current / total) * 100);
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }
    
    if (progressText) {
        progressText.textContent = `معالجة: ${current}/${total} دفعة (${productsLoaded} منتج)`;
    }
    
    console.log(`📊 التقدم: ${percentage}% (${productsLoaded} منتج محمل)`);
}

/**
 * إنشاء شريط التقدم
 */
function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.id = 'progress-container';
    progressContainer.innerHTML = `
        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
            <h4 style="margin-bottom: 15px; color: #333;">🔄 جاري تحميل المنتجات...</h4>
            <div style="background: #e9ecef; border-radius: 25px; height: 25px; overflow: hidden; position: relative;">
                <div id="progress-bar" style="background: linear-gradient(90deg, #28a745, #20c997); height: 100%; width: 0%; transition: width 0.3s ease; border-radius: 25px;"></div>
            </div>
            <p id="progress-text" style="margin-top: 10px; color: #666; font-size: 14px;">بدء التحميل...</p>
        </div>
    `;
    
    return progressContainer;
}

/**
 * تأخير التنفيذ
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * تحسين عرض المنتجات مع التصفح
 */
function displayProductsPaginated(products, page = 1, itemsPerPage = 20) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);
    
    // عرض المنتجات
    updateProductCatalog(pageProducts);
    
    // إنشاء أزرار التصفح
    createPagination(products.length, page, itemsPerPage);
    
    // عرض معلومات الصفحة
    showPageInfo(startIndex + 1, Math.min(endIndex, products.length), products.length);
}

/**
 * إنشاء أزرار التصفح
 */
function createPagination(totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        paginationContainer.style.cssText = `
            text-align: center;
            margin: 30px 0;
            padding: 20px;
        `;
        
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid && productsGrid.parentNode) {
            productsGrid.parentNode.insertBefore(paginationContainer, productsGrid.nextSibling);
        }
    }
    
    let paginationHTML = '<div class="pagination-buttons" style="display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center;">';
    
    // زر الصفحة السابقة
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})" class="page-btn">← السابق</button>`;
    }
    
    // أزرار الصفحات
    const maxButtons = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)" class="page-btn">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span style="padding: 8px;">...</span>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'active' : '';
        paginationHTML += `<button onclick="changePage(${i})" class="page-btn ${isActive}">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span style="padding: 8px;">...</span>';
        }
        paginationHTML += `<button onclick="changePage(${totalPages})" class="page-btn">${totalPages}</button>`;
    }
    
    // زر الصفحة التالية
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})" class="page-btn">التالي →</button>`;
    }
    
    paginationHTML += '</div>';
    
    paginationContainer.innerHTML = paginationHTML;
    
    // إضافة أنماط CSS
    addPaginationStyles();
}

/**
 * إضافة أنماط التصفح
 */
function addPaginationStyles() {
    if (document.getElementById('pagination-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'pagination-styles';
    styles.textContent = `
        .page-btn {
            padding: 8px 12px;
            border: 2px solid #dee2e6;
            background: white;
            color: #495057;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            min-width: 40px;
        }
        
        .page-btn:hover {
            background: #e9ecef;
            border-color: #adb5bd;
        }
        
        .page-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
        }
        
        .page-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    
    document.head.appendChild(styles);
}

/**
 * عرض معلومات الصفحة
 */
function showPageInfo(start, end, total) {
    let infoContainer = document.getElementById('page-info');
    if (!infoContainer) {
        infoContainer = document.createElement('div');
        infoContainer.id = 'page-info';
        infoContainer.style.cssText = `
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            color: #666;
            font-size: 14px;
        `;
        
        const pagination = document.getElementById('pagination');
        if (pagination && pagination.parentNode) {
            pagination.parentNode.insertBefore(infoContainer, pagination);
        }
    }
    
    infoContainer.innerHTML = `
        📄 عرض ${start} إلى ${end} من أصل ${total} منتج
    `;
}

/**
 * تغيير الصفحة
 */
function changePage(page) {
    const cachedData = JSON.parse(localStorage.getItem('cachedProducts') || '{}');
    if (cachedData.products) {
        displayProductsPaginated(cachedData.products, page);
        
        // التمرير إلى الأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * الوظيفة الرئيسية المحسنة
 */
async function fetchAndDisplayProductsOptimized() {
    try {
        console.log('🚀 بدء النظام المحسن لجلب المنتجات...');
        
        // إزالة المحتوى السابق
        const grid = document.getElementById('products-grid');
        if (grid) grid.innerHTML = '';
        
        // عرض شريط التقدم
        const progressBar = createProgressBar();
        const targetElement = grid || document.body;
        targetElement.appendChild(progressBar);
        
        // جلب قائمة الملفات
        const productFiles = await fetchProductsListOptimized();
        if (productFiles.length === 0) {
            throw new Error('لم يتم العثور على أي ملفات منتجات');
        }
        
        // جلب محتوى المنتجات على دفعات
        const products = await fetchProductsBatched(productFiles);
        
        // إزالة شريط التقدم
        progressBar.remove();
        
        if (products.length === 0) {
            throw new Error('فشل في معالجة المنتجات');
        }
        
        // حفظ في Cache
        localStorage.setItem('cachedProducts', JSON.stringify({
            products,
            timestamp: Date.now(),
            version: '2.0'
        }));
        
        // عرض المنتجات مع التصفح
        displayProductsPaginated(products);
        
        // إضافة وظيفة البحث
        addSearchFunctionality(products);
        
        // عرض الإحصائيات
        if (typeof showProductStats === 'function') {
            showProductStats(products);
        }
        
        console.log('✅ تم تحميل النظام المحسن بنجاح!');
        return products;
        
    } catch (error) {
        console.error('❌ خطأ في النظام المحسن:', error);
        
        // إزالة شريط التقدم في حالة الخطأ
        const progressBar = document.getElementById('progress-container');
        if (progressBar) progressBar.remove();
        
        // عرض رسالة الخطأ
        showErrorMessage('حدث خطأ في تحميل المنتجات: ' + error.message);
        throw error;
    }
}

// إضافة للنطاق العام
if (typeof window !== 'undefined') {
    window.fetchAndDisplayProductsOptimized = fetchAndDisplayProductsOptimized;
    window.changePage = changePage;
    
    console.log('✅ تم تحميل النظام المحسن للمجلدات الكبيرة');
}

// Export للوحدات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchAndDisplayProductsOptimized,
        fetchProductsListOptimized,
        fetchProductsBatched,
        displayProductsPaginated
    };
}