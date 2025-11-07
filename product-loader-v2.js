// ═══════════════════════════════════════════════════════════════════
// 📦 نظام تحميل بيانات المنتجات الديناميكي - سوق الكويت
// يقوم بسحب البيانات من products_data.json وملء الصفحة تلقائياً
// ═══════════════════════════════════════════════════════════════════

async function loadProductData() {
    try {
        const currentPage = window.location.pathname;
        const match = currentPage.match(/product-(\d+)-/);
        
        if (!match) {
            console.error('❌ لم يتم العثور على معرف المنتج في URL');
            return;
        }
        
        const productId = parseInt(match[1]);
        console.log(`🔍 تحميل المنتج رقم: ${productId}`);
        
        const response = await fetch('../products_data.json');
        if (!response.ok) throw new Error('فشل تحميل البيانات');
        
        const products = await response.json();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            console.error(`❌ المنتج ${productId} غير موجود`);
            return;
        }
        
        console.log(`✅ تم العثور على: ${product.title}`);
        updatePageData(product);
        
    } catch (error) {
        console.error('❌ خطأ:', error);
    }
}

function updatePageData(product) {
    const discountPercent = Math.round(((product.price - product.sale_price) / product.price) * 100);
    
    // تحديث Meta Tags
    document.title = `${product.title} | سوق الكويت`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = `${product.title}، متوفر الآن في سوق الكويت مع شحن مجاني`;
    
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = window.location.href;
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = product.title;
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = `${product.title}، متوفر الآن`;
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = product.image_link;
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = window.location.href;
    
    // تحديث صورة المنتج
    const productImage = document.querySelector('.product-image-container img');
    if (productImage) {
        productImage.src = product.image_link;
        productImage.alt = product.title;
    }
    
    // تحديث عنوان المنتج
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.textContent = product.title;
    }
    
    // تحديث السعر
    const newPrice = document.querySelector('.new-price');
    if (newPrice) {
        newPrice.textContent = `${product.sale_price.toFixed(2)} د.ك`;
    }
    
    // إضافة السعر القديم والخصم
    const priceBox = document.querySelector('.price-box');
    if (priceBox && product.price !== product.sale_price) {
        if (!priceBox.querySelector('.old-price')) {
            const oldPriceDiv = document.createElement('div');
            oldPriceDiv.className = 'old-price';
            oldPriceDiv.textContent = `${product.price.toFixed(2)} د.ك`;
            priceBox.insertBefore(oldPriceDiv, newPrice);
            
            const discountBadge = document.createElement('div');
            discountBadge.className = 'discount-badge';
            discountBadge.textContent = `وفّر ${discountPercent}%`;
            priceBox.appendChild(discountBadge);
        }
    }
    
    // تحديث الوصف
    if (product.description && product.description.trim() !== '') {
        let descriptionBox = document.querySelector('.description-box');
        
        if (!descriptionBox) {
            descriptionBox = document.createElement('div');
            descriptionBox.className = 'description-box';
            
            const heading = document.createElement('h4');
            heading.textContent = '📋 وصف المنتج';
            heading.style.marginBottom = '15px';
            heading.style.fontWeight = '700';
            heading.style.color = '#2c3e50';
            
            const descText = document.createElement('p');
            descText.textContent = product.description;
            descText.style.margin = '0';
            descText.style.color = '#555';
            descText.style.lineHeight = '1.8';
            
            descriptionBox.appendChild(heading);
            descriptionBox.appendChild(descText);
            
            const whatsappSection = document.querySelector('.whatsapp-section');
            if (whatsappSection) {
                whatsappSection.parentNode.insertBefore(descriptionBox, whatsappSection);
            }
        }
    }
    
    // تحديث روابط الواتساب
    const productUrl = window.location.href;
    const whatsappText = encodeURIComponent(
        `مرحباً! 👋\n\n` +
        `أرغب بطلب المنتج التالي:\n` +
        `━━━━━━━━━━━━━━━\n` +
        `📦 المنتج: ${product.title}\n` +
        `💰 السعر: ${product.sale_price.toFixed(2)} د.ك\n` +
        `🔗 الرابط: ${productUrl}\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `برجاء إرسال البيانات لإتمام الطلب:\n` +
        `✅ اسمك:\n` +
        `✅ عنوانك:\n` +
        `✅ عدد القطع:\n` +
        `✅ رقم هاتف آخر (إن وجد):\n\n` +
        `شكراً 🌟`
    );
    
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href="#"]');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/201110760081?text=${whatsappText}`;
    });
    
    // تحديث الفئة
    const ratingBadge = document.querySelector('.rating-badge');
    if (ratingBadge && product.category) {
        ratingBadge.innerHTML = `⭐ 4.9 (5 تقييم) - ${product.category}`;
    }
    
    console.log('✨ اكتمل تحميل المنتج بنجاح!');
}

document.addEventListener('DOMContentLoaded', loadProductData);
