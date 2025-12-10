/**
 * نظام إدارة الروابط الداخلية - سوق الكويت
 * تحسين SEO عن طريق الربط التلقائي بين الصفحات
 */

// خريطة الروابط الداخلية لكل صفحة
const internalLinksConfig = {
    'index.html': {
        relatedPages: [
            { title: 'تصفح جميع المنتجات', url: '/products-catalog.html', icon: 'shopping-bag' },
            { title: 'الفئات والأقسام', url: '/categories.html', icon: 'th-large' },
            { title: 'العروض والخصومات', url: '/offers.html', icon: 'tags' },
            { title: 'من نحن', url: '/about.html', icon: 'info-circle' }
        ],
        keywords: {
            'منتجات': '/products-catalog.html',
            'تسوق': '/products-catalog.html',
            'شحن': '/shipping.html',
            'توصيل': '/delivery.html',
            'دفع': '/checkout.html',
            'الكويت': '/about.html',
            'عروض': '/offers.html',
            'خصومات': '/offers.html',
            'تواصل': '/contact.html'
        }
    },
    
    'products-catalog.html': {
        relatedPages: [
            { title: 'الصفحة الرئيسية', url: '/', icon: 'home' },
            { title: 'الفئات', url: '/categories.html', icon: 'th-large' },
            { title: 'العروض الخاصة', url: '/offers.html', icon: 'star' },
            { title: 'سلة المشتريات', url: '/cart.html', icon: 'shopping-cart' }
        ],
        keywords: {
            'فئة': '/categories.html',
            'قسم': '/categories.html',
            'عرض': '/offers.html',
            'سعر': '/offers.html',
            'شراء': '/cart.html',
            'سلة': '/cart.html'
        }
    },
    
    'categories.html': {
        relatedPages: [
            { title: 'جميع المنتجات', url: '/products-catalog.html', icon: 'shopping-bag' },
            { title: 'المنزل والديكور', url: '/products-catalog.html?category=home', icon: 'home' },
            { title: 'الإلكترونيات', url: '/products-catalog.html?category=electronics', icon: 'laptop' },
            { title: 'الأزياء', url: '/products-catalog.html?category=fashion', icon: 'tshirt' }
        ],
        keywords: {
            'منتج': '/products-catalog.html',
            'عرض': '/offers.html',
            'شراء': '/cart.html'
        }
    },
    
    'about.html': {
        relatedPages: [
            { title: 'تواصل معنا', url: '/contact.html', icon: 'phone' },
            { title: 'الشحن والتوصيل', url: '/shipping.html', icon: 'truck' },
            { title: 'سياسة الإرجاع', url: '/return-policy.html', icon: 'undo' },
            { title: 'الشروط والأحكام', url: '/terms-conditions.html', icon: 'file-contract' }
        ],
        keywords: {
            'منتجات': '/products-catalog.html',
            'شحن': '/shipping.html',
            'توصيل': '/delivery.html',
            'إرجاع': '/return-policy.html',
            'استرجاع': '/refund.html'
        }
    },
    
    'cart.html': {
        relatedPages: [
            { title: 'إتمام الشراء', url: '/checkout.html', icon: 'credit-card' },
            { title: 'مواصلة التسوق', url: '/products-catalog.html', icon: 'shopping-bag' },
            { title: 'العروض المميزة', url: '/offers.html', icon: 'tags' },
            { title: 'معلومات الشحن', url: '/shipping.html', icon: 'truck' }
        ],
        keywords: {
            'دفع': '/checkout.html',
            'شراء': '/checkout.html',
            'منتج': '/products-catalog.html'
        }
    },
    
    'checkout.html': {
        relatedPages: [
            { title: 'معلومات الشحن', url: '/shipping.html', icon: 'truck' },
            { title: 'سياسة الإرجاع', url: '/return-policy.html', icon: 'undo' },
            { title: 'الدفع الآمن', url: '/privacy-policy.html', icon: 'shield-alt' },
            { title: 'تواصل معنا', url: '/contact.html', icon: 'phone' }
        ],
        keywords: {
            'شحن': '/shipping.html',
            'توصيل': '/delivery.html',
            'إرجاع': '/return-policy.html',
            'سياسة': '/privacy-policy.html'
        }
    },
    
    'shipping.html': {
        relatedPages: [
            { title: 'سياسة الإرجاع', url: '/return-policy.html', icon: 'undo' },
            { title: 'التوصيل السريع', url: '/delivery.html', icon: 'shipping-fast' },
            { title: 'تتبع الطلب', url: '/contact.html', icon: 'map-marked-alt' },
            { title: 'الأسئلة الشائعة', url: '/about.html', icon: 'question-circle' }
        ],
        keywords: {
            'منتج': '/products-catalog.html',
            'إرجاع': '/return-policy.html',
            'توصيل': '/delivery.html'
        }
    },
    
    'contact.html': {
        relatedPages: [
            { title: 'من نحن', url: '/about.html', icon: 'info-circle' },
            { title: 'الشحن والتوصيل', url: '/shipping.html', icon: 'truck' },
            { title: 'سياسة الخصوصية', url: '/privacy-policy.html', icon: 'shield-alt' },
            { title: 'تصفح المنتجات', url: '/products-catalog.html', icon: 'shopping-bag' }
        ],
        keywords: {
            'منتج': '/products-catalog.html',
            'شحن': '/shipping.html',
            'دعم': '/about.html'
        }
    },
    
    'offers.html': {
        relatedPages: [
            { title: 'جميع المنتجات', url: '/products-catalog.html', icon: 'shopping-bag' },
            { title: 'الفئات', url: '/categories.html', icon: 'th-large' },
            { title: 'المفضلة لديك', url: '/products-catalog.html?sort=popular', icon: 'heart' },
            { title: 'الأحدث', url: '/products-catalog.html?sort=new', icon: 'star' }
        ],
        keywords: {
            'منتج': '/products-catalog.html',
            'فئة': '/categories.html',
            'شراء': '/cart.html'
        }
    }
};

// إضافة قسم الروابط ذات الصلة في أسفل كل صفحة
function addRelatedLinksSection() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const config = internalLinksConfig[currentPage];
    
    if (!config || !config.relatedPages) return;
    
    // إنشاء قسم الروابط ذات الصلة
    const relatedSection = document.createElement('section');
    relatedSection.className = 'related-pages-section';
    relatedSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">صفحات قد تهمك</h2>
            <nav class="related-pages-grid" aria-label="صفحات ذات صلة">
                ${config.relatedPages.map(page => `
                    <a href="${page.url}" class="related-page-card">
                        <i class="fas fa-${page.icon}" aria-hidden="true"></i>
                        <span>${page.title}</span>
                    </a>
                `).join('')}
            </nav>
        </div>
    `;
    
    // إدراج القسم قبل الفوتر
    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.parentNode.insertBefore(relatedSection, footer);
    }
}

// ربط الكلمات المفتاحية تلقائياً في المحتوى
function linkifyKeywords() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const config = internalLinksConfig[currentPage];
    
    if (!config || !config.keywords) return;
    
    // اختيار العناصر المناسبة للربط
    const contentElements = document.querySelectorAll('p, li, .feature-desc, .testimonial-text');
    
    contentElements.forEach(element => {
        let html = element.innerHTML;
        let modified = false;
        
        // البحث عن الكلمات المفتاحية وربطها (مرة واحدة فقط لكل كلمة)
        Object.keys(config.keywords).forEach(keyword => {
            const url = config.keywords[keyword];
            const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*>|[^<>]*<\/)`, 'i');
            
            if (regex.test(html)) {
                html = html.replace(regex, `<a href="${url}" class="contextual-link" title="المزيد عن ${keyword}">$1</a>`);
                modified = true;
            }
        });
        
        if (modified) {
            element.innerHTML = html;
        }
    });
}

// إضافة Breadcrumb Navigation
function addBreadcrumb() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // تجاهل الصفحة الرئيسية
    if (currentPage === 'index.html' || currentPage === '') return;
    
    const breadcrumbMap = {
        'products-catalog.html': ['المنتجات'],
        'categories.html': ['الفئات'],
        'about.html': ['من نحن'],
        'contact.html': ['اتصل بنا'],
        'cart.html': ['سلة المشتريات'],
        'checkout.html': ['الدفع'],
        'shipping.html': ['الشحن والتوصيل'],
        'offers.html': ['العروض الخاصة'],
        'return-policy.html': ['سياسة الإرجاع'],
        'terms-conditions.html': ['الشروط والأحكام'],
        'privacy-policy.html': ['سياسة الخصوصية']
    };
    
    const pageName = breadcrumbMap[currentPage];
    if (!pageName) return;
    
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'التنقل التفصيلي');
    breadcrumb.innerHTML = `
        <div class="container">
            <ol itemscope itemtype="https://schema.org/BreadcrumbList">
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <a href="/" itemprop="item">
                        <span itemprop="name">الرئيسية</span>
                    </a>
                    <meta itemprop="position" content="1" />
                </li>
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <span itemprop="name">${pageName[0]}</span>
                    <meta itemprop="position" content="2" />
                </li>
            </ol>
        </div>
    `;
    
    // إدراج Breadcrumb بعد الهيدر
    const header = document.getElementById('site-header');
    if (header && header.nextSibling) {
        header.parentNode.insertBefore(breadcrumb, header.nextSibling);
    }
}

// CSS للروابط الداخلية
function injectInternalLinksStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Related Pages Section */
        .related-pages-section {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 4rem 0;
            margin: 2rem 0 0;
        }
        
        .related-pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .related-page-card {
            background: white;
            padding: 1.8rem;
            border-radius: 1rem;
            text-align: center;
            text-decoration: none;
            color: #1e293b;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
        }
        
        .related-page-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .related-page-card i {
            font-size: 2rem;
            color: #667eea;
        }
        
        .related-page-card:hover i {
            color: white;
        }
        
        .related-page-card span {
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        /* Contextual Links */
        .contextual-link {
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px dashed #667eea;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        
        .contextual-link:hover {
            color: #764ba2;
            border-bottom-style: solid;
        }
        
        /* Breadcrumb */
        .breadcrumb {
            background: #f8fafc;
            padding: 1rem 0;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 1.5rem;
        }
        
        .breadcrumb ol {
            list-style: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .breadcrumb li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .breadcrumb li:not(:last-child)::after {
            content: '←';
            color: #94a3b8;
            margin-right: 0.5rem;
        }
        
        .breadcrumb a {
            color: #667eea;
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .breadcrumb a:hover {
            color: #764ba2;
            text-decoration: underline;
        }
        
        .breadcrumb li:last-child {
            color: #64748b;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            .related-pages-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
            
            .related-page-card {
                padding: 1.2rem;
            }
            
            .related-page-card i {
                font-size: 1.5rem;
            }
            
            .related-page-card span {
                font-size: 0.95rem;
            }
            
            .breadcrumb {
                font-size: 0.85rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// تهيئة نظام الروابط الداخلية
function initInternalLinks() {
    // إضافة الستايلات
    injectInternalLinksStyles();
    
    // إضافة Breadcrumb
    addBreadcrumb();
    
    // إضافة قسم الروابط ذات الصلة
    addRelatedLinksSection();
    
    // ربط الكلمات المفتاحية
    linkifyKeywords();
}

// تشغيل النظام عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInternalLinks);
} else {
    initInternalLinks();
}

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { internalLinksConfig, initInternalLinks };
}
