// layout.js - إدارة الهيدر والفوتر لجميع الصفحات

document.addEventListener("DOMContentLoaded", function () {
    // 1. حقن Top Bar & Navbar
    const headerContainer = document.createElement("div");
    headerContainer.innerHTML = `
        <!-- Top Bar -->
        <div class="bg-gray-900 text-gray-300 text-xs py-2 px-4 text-center md:flex justify-between items-center font-tajawal">
            <div class="mb-1 md:mb-0">
                <span class="mx-2"><i class="fa-solid fa-truck text-secondary"></i> شحن مجاني خلال 1-3 أيام</span>
                <span class="mx-2 hidden md:inline">|</span>
                <span class="mx-2"><i class="fa-solid fa-rotate-left text-secondary"></i> استرجاع خلال 14 يوم</span>
            </div>
            <div>
                <a href="https://wa.me/201110760081" class="hover:text-white transition"><i class="fa-brands fa-whatsapp"></i> خدمة العملاء</a>
            </div>
        </div>

        <!-- Navbar -->
        <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 font-tajawal">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href="index.html" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                    <i class="fa-solid fa-bag-shopping text-secondary"></i> <span>سوق الكويت</span>
                </a>
                
                <!-- Desktop Links -->
                <div class="hidden md:flex gap-6 text-sm font-bold text-gray-600">
                    <a href="index.html" class="hover:text-primary transition">الرئيسية</a>
                    <a href="contact.html" class="hover:text-primary transition">اتصل بنا</a>
                </div>

                <!-- Cart Icon -->
                <div class="flex items-center gap-4">
                    <a href="cart.html" class="relative p-2 text-gray-600 hover:text-primary transition group">
                        <i class="fa-solid fa-cart-shopping text-xl"></i>
                        <span id="cart-count" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
                    </a>
                </div>
            </div>
        </nav>
    `;
    document.body.prepend(headerContainer);

    // 2. حقن Footer
    const footerContainer = document.createElement("footer");
    footerContainer.className = "bg-gray-900 text-gray-400 py-12 border-t border-gray-800 mt-auto text-sm font-tajawal";
    footerContainer.innerHTML = `
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <!-- Contact Info -->
                <div>
                    <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-headset text-secondary"></i> تواصل معنا</h3>
                    <ul class="space-y-3">
                        <li class="flex items-start gap-3">
                            <i class="fa-solid fa-location-dot mt-1 text-gray-500"></i>
                            <span>شكو ماكو، 9XFC+7PJ<br>مدينة الكويت، العاصمة 35020</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <i class="fa-solid fa-envelope text-gray-500"></i>
                            <a href="mailto:sherow1982@gmail.com" class="hover:text-white transition">sherow1982@gmail.com</a>
                        </li>
                        <li class="flex items-center gap-3">
                            <i class="fa-brands fa-whatsapp text-green-500 text-lg"></i>
                            <a href="https://wa.me/201110760081" target="_blank" class="hover:text-white transition font-bold">201110760081+</a>
                        </li>
                    </ul>
                </div>

                <!-- Links -->
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">روابط وسياسات</h3>
                    <ul class="space-y-2">
                        <li><a href="index.html" class="hover:text-secondary transition">الرئيسية</a></li>
                        <li><a href="contact.html" class="hover:text-secondary transition">اتصل بنا</a></li>
                        <li><a href="shipping-policy.html" class="hover:text-secondary transition">سياسة الشحن والاسترجاع</a></li>
                        <li><a href="privacy-policy.html" class="hover:text-secondary transition">سياسة الخصوصية</a></li>
                        <li><a href="terms.html" class="hover:text-secondary transition">الشروط والأحكام</a></li>
                    </ul>
                </div>

                <!-- Trust -->
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">تسوق بثقة</h3>
                    <p class="mb-4 text-xs leading-relaxed">نضمن لكم تجربة تسوق آمنة مع خيارات دفع متعددة وخدمة استرجاع مرنة خلال 14 يوم.</p>
                    <div class="flex gap-3 text-2xl text-gray-600 mb-6">
                        <i class="fa-brands fa-cc-visa hover:text-white transition"></i>
                        <i class="fa-brands fa-cc-mastercard hover:text-white transition"></i>
                        <i class="fa-solid fa-money-bill-wave hover:text-white transition"></i>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
                &copy; 2025 سوق الكويت. جميع الحقوق محفوظة.
            </div>
        </div>
    `;
    
    // إضافة الفوتر قبل إغلاق السكربتات (أو في نهاية الـ body)
    // نبحث عن السكربتات ونضيفه قبلها ليكون هو آخر عنصر مرئي
    const scripts = document.querySelectorAll('script');
    if(scripts.length > 0) {
        document.body.insertBefore(footerContainer, scripts[0]);
    } else {
        document.body.appendChild(footerContainer);
    }

    // 3. تحديث عداد السلة (لأنه تم إنشاؤه ديناميكياً الآن)
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});
