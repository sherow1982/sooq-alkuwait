/**
 * 🚀 محسّن SEO تلقائي - سوق الكويت
 * يحسّن الصفحات تلقائياً لمحركات البحث
 */

const SEO_CONFIG = {
    siteName: 'سوق الكويت',
    siteUrl: 'https://sooq-alkuwait.arabsad.com',
    defaultDescription: 'أفضل متجر إلكتروني في الكويت مع أكثر من 1977 منتج. توصيل مجاني ودفع عند الاستلام.',
    defaultImage: 'https://raw.githubusercontent.com/sherow1982/sooq-alkuwait/main/images/logo.png',
    keywords: 'سوق الكويت, تسوق إلكتروني الكويت, توصيل مجاني, دفع عند الاستلام'
};

/**
 * تحسين عناوين الصفحات
 */
function optimizePageTitle() {
    const currentTitle = document.title;
    
    // إذا لم يحتوي على اسم الموقع
    if (!currentTitle.includes(SEO_CONFIG.siteName)) {
        document.title = `${currentTitle} | ${SEO_CONFIG.siteName}`;
    }
    
    // إضافة emoji إذا لم يكن موجوداً
    if (!currentTitle.includes('🇰🇼')) {
        document.title = `🇰🇼 ${document.title}`;
    }
}

/**
 * إضافة أو تحديث Meta Tags
 */
function optimizeMetaTags() {
    // تحسين Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = SEO_CONFIG.defaultDescription;
        document.head.appendChild(metaDesc);
    }
    
    // إضافة Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        metaKeywords.content = SEO_CONFIG.keywords;
        document.head.appendChild(metaKeywords);
    }
    
    // إضافة robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        metaRobots.content = 'index, follow, max-image-preview:large';
        document.head.appendChild(metaRobots);
    }
    
    // إضافة canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        linkCanonical.href = window.location.href.split('?')[0];
        document.head.appendChild(linkCanonical);
    }
}

/**
 * إضافة Open Graph Tags
 */
function addOpenGraphTags() {
    const ogTags = [
        { property: 'og:site_name', content: SEO_CONFIG.siteName },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:locale', content: 'ar_KW' }
    ];
    
    ogTags.forEach(tag => {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('property', tag.property);
            metaTag.content = tag.content;
            document.head.appendChild(metaTag);
        }
    });
}

/**
 * تحسين الصور للسيو
 */
function optimizeImages() {
    const images = document.querySelectorAll('img:not([alt])');
    
    images.forEach(img => {
        // إضافة alt إذا لم يكن موجوداً
        if (!img.alt) {
            const src = img.src;
            const fileName = src.split('/').pop().split('.')[0];
            img.alt = `${fileName} - ${SEO_CONFIG.siteName}`;
        }
        
        // إضافة loading="lazy"
        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
    
    console.log(`✅ تم تحسين ${images.length} صورة`);
}

/**
 * إضافة عناوين H1 إذا لم تكن موجودة
 */
function ensureH1Tag() {
    const h1 = document.querySelector('h1');
    if (!h1) {
        const mainHeading = document.createElement('h1');
        mainHeading.textContent = document.title.split('|')[0].trim();
        mainHeading.style.cssText = 'position: absolute; left: -9999px;'; // SEO only
        document.body.insertBefore(mainHeading, document.body.firstChild);
    }
}

/**
 * إضافة Structured Data للمنتجات
 */
function addProductStructuredData() {
    // فقط في صفحات المنتجات
    if (!window.location.pathname.includes('product')) {
        return;
    }
    
    // التحقق من عدم وجوده مسبقاً
    if (document.querySelector('script[type="application/ld+json"]')) {
        return;
    }
    
    // استخراج بيانات المنتج
    const productName = document.querySelector('h1, .product-title')?.textContent || 'منتج';
    const productPrice = document.querySelector('.sale-price, .price-current-pro')?.textContent.replace(/[^\d.]/g, '') || '0';
    const productImage = document.querySelector('.product-image, img')?.src || SEO_CONFIG.defaultImage;
    const productRating = document.querySelector('.star-rating')?.textContent.split('(')[1]?.split(')')[0] || '5.0';
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productName,
        "image": productImage,
        "description": document.querySelector('meta[name="description"]')?.content || SEO_CONFIG.defaultDescription,
        "brand": {
            "@type": "Brand",
            "name": SEO_CONFIG.siteName
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "KWD",
            "price": productPrice,
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": productRating,
            "reviewCount": "10"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
    
    console.log('✅ تم إضافة Structured Data للمنتج');
}

/**
 * تحسين الروابط الداخلية
 */
function optimizeInternalLinks() {
    const links = document.querySelectorAll('a[href^="/"], a[href^="."]');
    
    links.forEach(link => {
        // إضافة title إذا لم يكن موجوداً
        if (!link.title && link.textContent.trim()) {
            link.title = link.textContent.trim();
        }
    });
}

/**
 * إضافة FAQ Schema
 */
function addFAQSchema() {
    const faqSection = document.querySelector('.faq, .faq-pro');
    if (!faqSection) return;
    
    const faqItems = faqSection.querySelectorAll('.faq-item, .faq-item-pro');
    if (faqItems.length === 0) return;
    
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    };
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question, .faq-question-pro')?.textContent.trim();
        const answer = item.querySelector('.faq-answer, .faq-answer-pro')?.textContent.trim();
        
        if (question && answer) {
            faqData.mainEntity.push({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answer
                }
            });
        }
    });
    
    if (faqData.mainEntity.length > 0) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(faqData, null, 2);
        document.head.appendChild(script);
        
        console.log(`✅ تم إضافة FAQ Schema لـ ${faqData.mainEntity.length} سؤال`);
    }
}

/**
 * إضافة Breadcrumb Schema
 */
function addBreadcrumbSchema() {
    const breadcrumb = document.querySelector('.breadcrumb, .breadcrumb-pro, nav[aria-label="breadcrumb"]');
    if (!breadcrumb) return;
    
    const links = breadcrumb.querySelectorAll('a');
    if (links.length === 0) return;
    
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
    };
    
    links.forEach((link, index) => {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": index + 1,
            "name": link.textContent.trim(),
            "item": link.href
        });
    });
    
    // إضافة الصفحة الحالية
    const currentPage = breadcrumb.querySelector('.active, .breadcrumb-item:last-child');
    if (currentPage && !currentPage.querySelector('a')) {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": links.length + 1,
            "name": currentPage.textContent.trim(),
            "item": window.location.href
        });
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbData, null, 2);
    document.head.appendChild(script);
    
    console.log('✅ تم إضافة Breadcrumb Schema');
}

/**
 * تحسين عناوين H tags
 */
function optimizeHeadings() {
    // التأكد من وجود H1 واحد فقط
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
        ensureH1Tag();
    } else if (h1Tags.length > 1) {
        // تحويل الباقي لـ H2
        h1Tags.forEach((h1, index) => {
            if (index > 0) {
                const h2 = document.createElement('h2');
                h2.innerHTML = h1.innerHTML;
                h2.className = h1.className;
                h1.parentNode.replaceChild(h2, h1);
            }
        });
        console.log('⚠️ تم تصحيح H1 tags');
    }
}

function ensureH1Tag() {
    const h1 = document.querySelector('h1');
    if (!h1) {
        const mainHeading = document.createElement('h1');
        mainHeading.textContent = document.title.split('|')[0].trim();
        mainHeading.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;';
        document.body.insertBefore(mainHeading, document.body.firstChild);
    }
}

/**
 * تحسين سرعة الصفحة
 */
function optimizePageSpeed() {
    // Defer للسكريبتات غير الأساسية
    const scripts = document.querySelectorAll('script[src]:not([defer]):not([async])');
    scripts.forEach(script => {
        if (!script.src.includes('jquery') && !script.src.includes('bootstrap')) {
            script.defer = true;
        }
    });
    
    // Preconnect للموارد الخارجية
    const preconnectDomains = [
        'https://cdn.jsdelivr.net',
        'https://cdnjs.cloudflare.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    
    preconnectDomains.forEach(domain => {
        if (!document.querySelector(`link[href="${domain}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        }
    });
}

/**
 * تحسين روابط واتساب للسيو
 */
function optimizeWhatsAppLinksForSEO() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        // إضافة rel="nofollow" لروابط واتساب
        if (!link.rel) {
            link.rel = 'nofollow noopener';
        }
        
        // إضافة aria-label
        if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', 'تواصل عبر واتساب');
        }
    });
}

/**
 * تهيئة شاملة للسيو
 */
function initSEOOptimizer() {
    console.log('🚀 بدء تحسين SEO...');
    
    try {
        optimizePageTitle();
        optimizeMetaTags();
        addOpenGraphTags();
        optimizeImages();
        optimizeHeadings();
        addProductStructuredData();
        addBreadcrumbSchema();
        addFAQSchema();
        optimizeInternalLinks();
        optimizeWhatsAppLinksForSEO();
        optimizePageSpeed();
        
        console.log('✅ تم تحسين SEO بنجاح!');
    } catch (error) {
        console.error('❌ خطأ في تحسين SEO:', error);
    }
}

// تشغيل تلقائي
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSEOOptimizer);
} else {
    initSEOOptimizer();
}

// تصدير
window.SEOOptimizer = {
    init: initSEOOptimizer,
    config: SEO_CONFIG,
    optimizeImages,
    addProductSchema: addProductStructuredData
};

console.log('🚀 محسّن SEO جاهز!');
