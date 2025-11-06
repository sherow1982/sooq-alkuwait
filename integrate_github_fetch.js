/**
 * Integration Script for GitHub Products Fetcher
 * سكربت لدمج جالب المنتجات من GitHub في الموقع الرئيسي
 */

// إعدادات التكامل
const INTEGRATION_CONFIG = {
    AUTO_LOAD: true,           // تحميل تلقائي عند فتح الصفحة
    CACHE_DURATION: 2,         // مدة صلاحية Cache بالساعات  
    MAX_PRODUCTS: 50,          // أقصى عدد منتجات للتحميل
    ENABLE_SEARCH: true,       // تفعيل البحث
    ENABLE_STATS: true,        // تفعيل الإحصائيات
    RESPONSIVE_GRID: true      // شبكة متجاوبة
};

/**
 * تحميل وتشغيل جالب المنتجات من GitHub
 */
async function initializeGitHubFetcher() {
    try {
        console.log('🚀 تهيئة نظام جلب المنتجات من GitHub...');
        
        // التحقق من توفر السكربت
        if (typeof fetchAndDisplayProducts === 'undefined') {
            console.log('📥 تحميل سكربت جالب المنتجات...');
            await loadGitHubFetcherScript();
        }
        
        // إعداد الواجهة
        setupUI();
        
        // تحميل المنتجات إذا كان مفعلاً
        if (INTEGRATION_CONFIG.AUTO_LOAD) {
            await loadProductsAutomatically();
        }
        
        console.log('✅ تم تهيئة نظام جلب المنتجات بنجاح!');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة نظام جلب المنتجات:', error);
        showErrorMessage(error.message);
    }
}

/**
 * تحميل سكربت جالب المنتجات
 */
function loadGitHubFetcherScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'fetch_products_from_github.js';
        script.onload = () => {
            console.log('✅ تم تحميل سكربت جالب المنتجات');
            resolve();
        };
        script.onerror = () => {
            reject(new Error('فشل في تحميل سكربت جالب المنتجات'));
        };
        document.head.appendChild(script);
    });
}

/**
 * إعداد واجهة المستخدم
 */
function setupUI() {
    // إنشاء حاوي رئيسي للمنتجات إذا لم يكن موجوداً
    let productsContainer = document.getElementById('products-grid');
    if (!productsContainer) {
        productsContainer = document.createElement('div');
        productsContainer.id = 'products-grid';
        productsContainer.className = 'products-grid';
        
        // البحث عن مكان مناسب لإدراج الحاوي
        const targetElement = document.querySelector('main') || 
                            document.querySelector('.container') || 
                            document.querySelector('.content') ||
                            document.body;
        
        targetElement.appendChild(productsContainer);
    }
    
    // إضافة شريط التحكم
    if (INTEGRATION_CONFIG.ENABLE_SEARCH || INTEGRATION_CONFIG.ENABLE_STATS) {
        addControlPanel();
    }
    
    // إضافة أنماط CSS المحسنة
    addEnhancedStyles();
}

/**
 * إضافة شريط التحكم
 */
function addControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'github-control-panel';
    controlPanel.className = 'github-control-panel';
    
    let controlsHTML = `
        <div class="control-header">
            <h3>🛍️ إدارة المنتجات</h3>
        </div>
        <div class="control-buttons">
            <button id="refresh-products" class="control-btn primary">
                🔄 تحديث المنتجات
            </button>
            <button id="clear-cache" class="control-btn secondary">
                🗑️ مسح الذاكرة المؤقتة
            </button>
        </div>
    `;
    
    if (INTEGRATION_CONFIG.ENABLE_SEARCH) {
        controlsHTML += `
            <div class="search-section">
                <input type="text" id="main-search" placeholder="🔍 ابحث في المنتجات..." class="search-input">
            </div>
        `;
    }
    
    controlPanel.innerHTML = controlsHTML;
    
    // إدراج شريط التحكم
    const productsContainer = document.getElementById('products-grid');
    if (productsContainer && productsContainer.parentNode) {
        productsContainer.parentNode.insertBefore(controlPanel, productsContainer);
    }
    
    // إضافة أحداث الأزرار
    setupControlEvents();
}

/**
 * إعداد أحداث شريط التحكم
 */
function setupControlEvents() {
    // زر تحديث المنتجات
    const refreshBtn = document.getElementById('refresh-products');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '⏳ جاري التحديث...';
            
            try {
                await fetchAndDisplayProducts();
                showSuccessMessage('✅ تم تحديث المنتجات بنجاح!');
            } catch (error) {
                showErrorMessage('❌ فشل في تحديث المنتجات: ' + error.message);
            } finally {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '🔄 تحديث المنتجات';
            }
        });
    }
    
    // زر مسح الذاكرة المؤقتة
    const clearBtn = document.getElementById('clear-cache');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('cachedProducts');
            showSuccessMessage('✅ تم مسح الذاكرة المؤقتة');
            
            // مسح العرض الحالي
            const grid = document.getElementById('products-grid');
            const stats = document.getElementById('product-stats');
            if (grid) grid.innerHTML = '';
            if (stats) stats.remove();
        });
    }
    
    // إعداد البحث
    if (INTEGRATION_CONFIG.ENABLE_SEARCH) {
        setupSearchFunctionality();
    }
}

/**
 * إعداد وظيفة البحث
 */
function setupSearchFunctionality() {
    const searchInput = document.getElementById('main-search');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            performSearch(searchTerm);
        }, 300);
    });
}

/**
 * تنفيذ البحث
 */
function performSearch(searchTerm) {
    try {
        const cached = JSON.parse(localStorage.getItem('cachedProducts') || '{}');
        if (!cached.products) {
            showErrorMessage('❌ لا توجد منتجات محملة للبحث فيها');
            return;
        }
        
        let filteredProducts;
        if (typeof searchProducts === 'function') {
            filteredProducts = searchProducts(cached.products, searchTerm);
        } else {
            // بحث بسيط إذا لم تكن الوظيفة متوفرة
            filteredProducts = cached.products.filter(product => 
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // تحديث العرض
        if (typeof updateProductCatalog === 'function') {
            updateProductCatalog(filteredProducts);
        }
        
        // عرض نتائج البحث
        const resultMsg = searchTerm ? 
            `🔍 تم العثور على ${filteredProducts.length} منتج` : 
            `📦 عرض جميع المنتجات (${filteredProducts.length})`;
        
        showInfoMessage(resultMsg);
        
    } catch (error) {
        console.error('خطأ في البحث:', error);
        showErrorMessage('❌ حدث خطأ أثناء البحث');
    }
}

/**
 * تحميل المنتجات تلقائياً
 */
async function loadProductsAutomatically() {
    try {
        console.log('🔄 تحميل المنتجات تلقائياً...');
        
        // التحقق من وجود منتجات محفوظة حديثة
        const cachedProducts = getCachedProducts();
        if (cachedProducts) {
            console.log('📦 استخدام المنتجات المحفوظة');
            displayCachedProducts(cachedProducts);
            return;
        }
        
        // جلب منتجات جديدة
        console.log('🌐 جلب منتجات جديدة من GitHub...');
        if (typeof fetchAndDisplayProducts === 'function') {
            await fetchAndDisplayProducts();
        } else {
            throw new Error('وظيفة جلب المنتجات غير متوفرة');
        }
        
    } catch (error) {
        console.error('خطأ في التحميل التلقائي:', error);
        showErrorMessage('❌ فشل في تحميل المنتجات تلقائياً: ' + error.message);
    }
}

/**
 * الحصول على المنتجات المحفوظة
 */
function getCachedProducts() {
    try {
        const cached = localStorage.getItem('cachedProducts');
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const hoursSinceCache = (Date.now() - data.timestamp) / (1000 * 60 * 60);
        
        if (hoursSinceCache < INTEGRATION_CONFIG.CACHE_DURATION) {
            console.log(`📦 استخدام البيانات المحفوظة (عمر: ${Math.round(hoursSinceCache * 60)} دقيقة)`);
            return data.products;
        }
        
        console.log('⏰ البيانات المحفوظة قديمة');
        return null;
        
    } catch (error) {
        console.warn('خطأ في قراءة البيانات المحفوظة:', error);
        return null;
    }
}

/**
 * عرض المنتجات المحفوظة
 */
function displayCachedProducts(products) {
    if (typeof updateProductCatalog === 'function') {
        updateProductCatalog(products);
    }
    
    if (INTEGRATION_CONFIG.ENABLE_STATS && typeof showProductStats === 'function') {
        showProductStats(products);
    }
    
    showSuccessMessage(`📦 تم عرض ${products.length} منتج من الذاكرة المؤقتة`);
}

/**
 * إضافة أنماط CSS محسنة
 */
function addEnhancedStyles() {
    if (document.getElementById('github-integration-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'github-integration-styles';
    styles.textContent = `
        /* شريط التحكم */
        .github-control-panel {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            color: white;
        }
        
        .control-header h3 {
            margin: 0 0 15px 0;
            text-align: center;
            font-size: 1.4em;
        }
        
        .control-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .control-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .control-btn.primary {
            background: #27ae60;
            color: white;
        }
        
        .control-btn.primary:hover {
            background: #219a52;
            transform: translateY(-2px);
        }
        
        .control-btn.secondary {
            background: #e74c3c;
            color: white;
        }
        
        .control-btn.secondary:hover {
            background: #c0392b;
            transform: translateY(-2px);
        }
        
        .control-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .search-section {
            text-align: center;
        }
        
        .search-input {
            width: 100%;
            max-width: 400px;
            padding: 12px 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.8);
        }
        
        .search-input:focus {
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.2);
        }
        
        /* رسائل التنبيه */
        .integration-message {
            padding: 12px 20px;
            border-radius: 8px;
            margin: 10px 0;
            font-weight: bold;
            text-align: center;
            animation: slideIn 0.3s ease;
        }
        
        .integration-message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .integration-message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .integration-message.info {
            background: #cce7ff;
            color: #004085;
            border: 1px solid #b3d7ff;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* تحسين شبكة المنتجات */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        /* استجابة للأجهزة المحمولة */
        @media (max-width: 768px) {
            .control-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .control-btn {
                width: 200px;
            }
            
            .search-input {
                font-size: 16px; /* منع التكبير في iOS */
            }
            
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

/**
 * عرض رسالة نجاح
 */
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

/**
 * عرض رسالة خطأ
 */
function showErrorMessage(message) {
    showMessage(message, 'error');
}

/**
 * عرض رسالة معلومات
 */
function showInfoMessage(message) {
    showMessage(message, 'info');
}

/**
 * عرض رسالة
 */
function showMessage(message, type) {
    // إزالة الرسائل السابقة
    const existingMessages = document.querySelectorAll('.integration-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `integration-message ${type}`;
    messageDiv.textContent = message;
    
    // إدراج الرسالة
    const controlPanel = document.getElementById('github-control-panel');
    const targetElement = controlPanel || 
                          document.getElementById('products-grid') ||
                          document.body.firstElementChild;
    
    if (targetElement && targetElement.parentNode) {
        targetElement.parentNode.insertBefore(messageDiv, targetElement.nextSibling);
    }
    
    // إزالة الرسالة تلقائياً
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

/**
 * تحقق من جاهزية DOM
 */
function isDOMReady() {
    return document.readyState === 'complete' || 
           document.readyState === 'interactive';
}

/**
 * تشغيل التكامل
 */
function startIntegration() {
    if (isDOMReady()) {
        initializeGitHubFetcher();
    } else {
        document.addEventListener('DOMContentLoaded', initializeGitHubFetcher);
    }
}

// إضافة وظائف للنطاق العام للاستخدام الخارجي
if (typeof window !== 'undefined') {
    window.GitHubProductsIntegration = {
        init: initializeGitHubFetcher,
        refresh: () => {
            if (typeof fetchAndDisplayProducts === 'function') {
                return fetchAndDisplayProducts();
            }
            throw new Error('وظيفة التحديث غير متوفرة');
        },
        search: performSearch,
        clearCache: () => {
            localStorage.removeItem('cachedProducts');
            console.log('✅ تم مسح الذاكرة المؤقتة');
        },
        config: INTEGRATION_CONFIG
    };
    
    // تشغيل تلقائي
    startIntegration();
    
    console.log('✅ تم تحميل نظام تكامل GitHub Products');
}

// Export للوحدات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeGitHubFetcher,
        loadProductsAutomatically,
        performSearch,
        INTEGRATION_CONFIG
    };
}