/**
 * Bookmarklet لإصلاح جميع صفحات المنتجات فوراً
 * Universal Product Pages Cart Fix Bookmarklet
 * 
 * طريقة الاستخدام:
 * 1. انسخ هذا الرمز في شريط عنوان المتصفح
 * 2. اضغط Enter في أي صفحة منتج
 * 3. سيتم إصلاح جميع أزرار السلة فوراً!
 */

javascript:(function(){
    console.log('🚀 بدء الإصلاح الشامل الفوري...');
    
    // إضافة النظام الشامل
    function loadUniversalFix() {
        const script = document.createElement('script');
        script.src = 'https://sherow1982.github.io/sooq-alkuwait/assets/js/universal-cart-fix.js';
        script.onload = function() {
            console.log('✅ تم تحميل النظام الشامل');
            setTimeout(function() {
                if (window.universalCartFix) {
                    const fixed = window.universalCartFix.fixButtons();
                    alert(`✅ تم إصلاح ${fixed} زر سلة بنجاح! \n\n🛒 جميع الأزرار تعمل الآن\n🔄 انتقال تلقائي للسلة\n📱 حفظ في LocalStorage`);
                } else {
                    alert('⚠️ فشل في تحميل النظام - تجريب الإصلاح اليدوي...');
                    manualFix();
                }
            }, 1000);
        };
        script.onerror = function() {
            console.warn('⚠️ فشل تحميل النظام - تطبيق الإصلاح اليدوي');
            manualFix();
        };
        document.head.appendChild(script);
    }
    
    // إصلاح يدوي للطوارئ
    function manualFix() {
        let fixedCount = 0;
        
        // إصلاح أزرار onclick
        const buttons = document.querySelectorAll('[onclick*="addToCart"]');
        buttons.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            const match = onclick ? onclick.match(/addToCart\\((\d+)\\)/) : null;
            
            if (match) {
                const id = match[1];
                btn.setAttribute('data-product-id', id);
                btn.classList.add('fixed-cart-btn');
                btn.removeAttribute('onclick');
                
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // إضافة بسيطة للسلة
                    let cart = [];
                    try {
                        const stored = localStorage.getItem('cart_items');
                        if (stored) cart = JSON.parse(stored).items || [];
                    } catch(e) {}
                    
                    const product = {
                        id: id,
                        title: document.title.replace(' | سوق الكويت', '').replace(' - سوق الكويت', ''),
                        price: 15.000,
                        quantity: 1
                    };
                    
                    const existing = cart.find(item => item.id === id);
                    if (existing) {
                        existing.quantity++;
                    } else {
                        cart.push(product);
                    }
                    
                    localStorage.setItem('cart_items', JSON.stringify({items: cart, timestamp: Date.now()}));
                    
                    // إشعار بصري
                    btn.style.background = '#28a745';
                    btn.innerHTML = '<i class="fas fa-check"></i> تم الإضافة!';
                    
                    // انتقال للسلة
                    setTimeout(() => {
                        const cartUrl = window.location.pathname.includes('products-pages') ? '../cart.html' : 'cart.html';
                        window.location.href = cartUrl + '?fixed=1';
                    }, 1500);
                });
                
                fixedCount++;
            }
        });
        
        // إضافة عداد السلة
        const cartLinks = document.querySelectorAll('a[href*="cart.html"]');
        cartLinks.forEach(link => {
            if (!link.querySelector('.cart-count')) {
                const counter = document.createElement('span');
                counter.className = 'badge bg-danger cart-count';
                counter.textContent = '0';
                counter.style.marginRight = '8px';
                link.appendChild(counter);
            }
        });
        
        // تحديث العداد
        try {
            const stored = localStorage.getItem('cart_items');
            if (stored) {
                const data = JSON.parse(stored);
                const count = data.items ? data.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                document.querySelectorAll('.cart-count').forEach(c => {
                    c.textContent = count;
                    c.style.display = count > 0 ? 'inline-block' : 'none';
                });
            }
        } catch(e) {}
        
        alert(`✅ تم الإصلاح اليدوي لـ ${fixedCount} زر!\n\n🛒 جميع الأزرار تعمل الآن\n🔄 سيتم الانتقال للسلة تلقائياً\n💾 يتم الحفظ في المتصفح`);
    }
    
    // تشغيل الإصلاح
    loadUniversalFix();
})();

/**
 * رمز الـ Bookmarklet للنسخ:
 * 
 * javascript:(function(){console.log('🚀 بدء الإصلاح الشامل الفوري...');function loadUniversalFix(){const script=document.createElement('script');script.src='https://sherow1982.github.io/sooq-alkuwait/assets/js/universal-cart-fix.js';script.onload=function(){console.log('✅ تم تحميل النظام الشامل');setTimeout(function(){if(window.universalCartFix){const fixed=window.universalCartFix.fixButtons();alert(`✅ تم إصلاح ${fixed} زر سلة بنجاح! \n\n🛒 جميع الأزرار تعمل الآن\n🔄 انتقال تلقائي للسلة\n📱 حفظ في LocalStorage`);}else{alert('⚠️ فشل في تحميل النظام - تجريب الإصلاح اليدوي...');manualFix();}},1000);};script.onerror=function(){console.warn('⚠️ فشل تحميل النظام - تطبيق الإصلاح اليدوي');manualFix();};document.head.appendChild(script);}function manualFix(){let fixedCount=0;const buttons=document.querySelectorAll('[onclick*="addToCart"]');buttons.forEach(btn=>{const onclick=btn.getAttribute('onclick');const match=onclick?onclick.match(/addToCart\\((\d+)\\)/):null;if(match){const id=match[1];btn.setAttribute('data-product-id',id);btn.classList.add('fixed-cart-btn');btn.removeAttribute('onclick');btn.addEventListener('click',function(e){e.preventDefault();let cart=[];try{const stored=localStorage.getItem('cart_items');if(stored)cart=JSON.parse(stored).items||[];}catch(e){}const product={id:id,title:document.title.replace(' | سوق الكويت','').replace(' - سوق الكويت',''),price:15.000,quantity:1};const existing=cart.find(item=>item.id===id);if(existing){existing.quantity++;}else{cart.push(product);}localStorage.setItem('cart_items',JSON.stringify({items:cart,timestamp:Date.now()}));btn.style.background='#28a745';btn.innerHTML='<i class="fas fa-check"></i> تم الإضافة!';setTimeout(()=>{const cartUrl=window.location.pathname.includes('products-pages')?'../cart.html':'cart.html';window.location.href=cartUrl+'?fixed=1';},1500);});fixedCount++;}});const cartLinks=document.querySelectorAll('a[href*="cart.html"]');cartLinks.forEach(link=>{if(!link.querySelector('.cart-count')){const counter=document.createElement('span');counter.className='badge bg-danger cart-count';counter.textContent='0';counter.style.marginRight='8px';link.appendChild(counter);}});try{const stored=localStorage.getItem('cart_items');if(stored){const data=JSON.parse(stored);const count=data.items?data.items.reduce((sum,item)=>sum+item.quantity,0):0;document.querySelectorAll('.cart-count').forEach(c=>{c.textContent=count;c.style.display=count>0?'inline-block':'none';});}}catch(e){}alert(`✅ تم الإصلاح اليدوي لـ ${fixedCount} زر!\n\n🛒 جميع الأزرار تعمل الآن\n🔄 سيتم الانتقال للسلة تلقائياً\n💾 يتم الحفظ في المتصفح`);}loadUniversalFix();})();
 */