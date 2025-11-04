// التحقق الجغرافي والتحكم في الطلبات للكويت فقط
let geoIsKuwait = true;
let isKuwaitiPhone = false;

// التحقق من الموقع الجغرافي
async function checkGeoLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'KW') {
            geoIsKuwait = true;
            hideGeoWarning();
        } else {
            geoIsKuwait = false;
            showGeoWarning();
        }
    } catch (error) {
        geoIsKuwait = true; // Default to allow if geo check fails
        console.warn('فشل التحقق الجغرافي، السماح افتراضياً');
    }
}

// عرض تحذير للمقيمين خارج الكويت
function showGeoWarning() {
    const warning = document.createElement('div');
    warning.id = 'geoWarning';
    warning.innerHTML = `
        <div style="background: var(--kuwait-red); color: white; padding: 15px; text-align: center; font-weight: 700; position: fixed; top: 0; left: 0; right: 0; z-index: 2000; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            <i class="fas fa-exclamation-triangle"></i> عفواً، أنت مقيم خارج الكويت. لن يتم إرسال طلبك
        </div>
    `;
    document.body.insertBefore(warning, document.body.firstChild);
    
    // تعديل padding للمحتوى لتجنب التداخل
    document.querySelector('.header').style.marginTop = '50px';
}

// إخفاء التحذير الجغرافي
function hideGeoWarning() {
    const warning = document.getElementById('geoWarning');
    if (warning) warning.remove();
    
    // إعادة تعيين padding
    const header = document.querySelector('.header');
    if (header) header.style.marginTop = '0';
}

// التحقق من رقم الهاتف الكويتي
function validateKuwaitiPhone(phone) {
    // تنظيف الرقم من المسافات والشرطات والأقواس
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // التحقق من الصيغ الكويتية المقبولة
    const kuwaitiPatterns = [
        /^[569]\d{7}$/,           // 8 أرقام تبدأ بـ 5 أو 6 أو 9
        /^\+965[569]\d{7}$/,     // بكود الدولة
        /^965[569]\d{7}$/,       // بكود الدولة بدون +
        /^00965[569]\d{7}$/      // بكود دولي كامل
    ];
    
    return kuwaitiPatterns.some(pattern => pattern.test(cleanPhone));
}

// إضافة المنتج للسلة مع التحقق الجغرافي
function addToCartWithGeoCheck(productId) {
    if (!geoIsKuwait) {
        alert('عذراً، هذا المتجر متاح للمقيمين في الكويت فقط 🇰🇼');
        return false;
    }
    
    // إضافة عادية للسلة
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // انتقال فوري للسلة
    window.location.href = 'cart.html';
    return true;
}

// التحقق من صحة النموذج في checkout
function validateCheckoutForm() {
    const phone = document.getElementById('phone')?.value;
    
    if (!geoIsKuwait) {
        alert('عذراً، التوصيل متاح داخل الكويت فقط 🇰🇼');
        return false;
    }
    
    if (!phone || !validateKuwaitiPhone(phone)) {
        alert('الرجاء إدخال رقم هاتف كويتي صحيح (مثال: 55123456 أو +96555123456)');
        return false;
    }
    
    return true;
}

// تشغيل التحقق الجغرافي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', checkGeoLocation);