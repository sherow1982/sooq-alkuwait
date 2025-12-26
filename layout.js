// layout.js - (محدث: إضافة البحث في الهيدر)

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith("index.html") || currentPath.endsWith("/") || currentPath.endsWith("sooq-alkuwait/"); // تعديل لضمان التعرف على الرئيسية
    const isActive = (path) => currentPath.includes(path) ? "text-primary font-extrabold" : "text-gray-600 hover:text-primary";

    // --- 1. الهيدر (Header) ---
    const headerHTML = `
        <!-- Top Bar -->
        <div class="bg-gray-900 text-gray-300 text-[10px] md:text-xs py-2 px-4 text-center md:flex justify-between items-center font-tajawal relative z-50">
            <div class="mb-1 md:mb-0 flex justify-center gap-3">
                <span><i class="fa-solid fa-truck text-secondary"></i> شحن مجاني</span>
                <span class="text-gray-600">|</span>
                <span><i class="fa-solid fa-rotate-left text-secondary"></i> استرجاع 14 يوم</span>
            </div>
            <div class="hidden md:block">
                <a href="https://wa.me/201110760081" target="_blank" class="hover:text-white transition flex items-center gap-1">
                    <i class="fa-brands fa-whatsapp"></i> خدمة العملاء
                </a>
            </div>
        </div>

        <!-- Navbar -->
        <nav class="bg-white shadow-md sticky top-0 z-[100] border-b border-gray-100 font-tajawal">
            <div class="container mx-auto px-4 py-3 md:py-4">
                <div class="flex flex-wrap justify-between items-center gap-4">
                    
                    <!-- Logo -->
                    <a href="index.html" class="text-xl md:text-2xl font-extrabold text-primary flex items-center gap-2 group shrink-0">
                        <div class="w-8 h-8 md:w-10 md:h-10 bg-primary text-white rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-bag-shopping text-sm md:text-lg"></i>
                        </div>
                        <span class="hidden md:inline">سوق الكويت</span>
                        <span class="md:hidden">سوق الكويت</span>
                    </a>

                    <!-- ✅ Search Bar (Desktop) -->
                    <div class="hidden md:flex flex-grow max-w-xl mx-4 relative">
                        <input type="text" id="global-search-desktop" placeholder="ابحث عن منتج..." class="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 transition-all">
                        <button onclick="executeSearch('global-search-desktop')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                            <i class="fa-solid fa-search"></i>
                        </button>
                    </div>

                    <!-- Icons & Mobile Button -->
                    <div class="flex items-center gap-3 md:gap-4 shrink-0">
                        <!-- Desktop Links -->
                         <div class="hidden md:flex gap-4 text-sm font-bold items-center ml-2">
                            <a href="index.html" class="${isActive('index')} transition">الرئيسية</a>
                            <a href="contact.html" class="${isActive('contact')} transition">اتصل</a>
                        </div>

                        <a href="cart.html" class="relative p-2 text-gray-600 hover:text-primary transition group">
                            <i class="fa-solid fa-cart-shopping text-xl md:text-2xl group-hover:scale-110 transition-transform"></i>
                            <span id="cart-count" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center hidden animate-bounce">0</span>
                        </a>
                        <button id="mobile-menu-btn" class="md:hidden text-gray-600 text-2xl focus:outline-none p-1">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 mt-3 pt-2 bg-gray-50 rounded-lg p-4 transition-all duration-300">
                    
                    <!-- ✅ Search Bar (Mobile) -->
                    <div class="relative mb-4">
                        <input type="text" id="global-search-mobile" placeholder="ابحث..." class="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:border-primary bg-white">
                        <button onclick="executeSearch('global-search-mobile')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <i class="fa-solid fa-search"></i>
                        </button>
                    </div>

                    <div class="flex flex-col gap-3 text-sm font-bold text-gray-700">
                        <a href="index.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-house w-5 text-center"></i> الرئيسية</a>
                        <a href="about.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-users w-5 text-center"></i> من نحن</a>
                        <a href="contact.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-phone w-5 text-center"></i> اتصل بنا</a>
                        <a href="shipping-policy.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-truck w-5 text-center"></i> الشحن</a>
                        <a href="return-policy.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-rotate-left w-5 text-center"></i> الاسترجاع</a>
                        <a href="https://wa.me/201110760081" target="_blank" class="flex items-center gap-3 p-2 rounded text-green-600 bg-green-50 border border-green-200 mt-2"><i class="fa-brands fa-whatsapp w-5 text-center text-lg"></i> تواصل واتساب</a>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // --- 2. Footer (نفس القديم) ---
    const footerHTML = `
        <footer class="bg-gray-900 text-gray-400 py-10 md:py-12 border-t border-gray-800 mt-auto text-sm font-tajawal relative z-10">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-location-dot text-secondary"></i> تواصل معنا</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start gap-3"><span class="mt-1 text-gray-500"><i class="fa-solid fa-map-pin"></i></span><span>شكو ماكو، 9XFC+7PJ<br>مدينة الكويت، العاصمة 35020</span></li>
                            <li class="flex items-center gap-3"><span class="text-gray-500"><i class="fa-solid fa-envelope"></i></span><a href="mailto:sherow1982@gmail.com" class="hover:text-white transition break-all">sherow1982@gmail.com</a></li>
                            <li class="flex items-center gap-3"><span class="text-green-500 text-lg"><i class="fa-brands fa-whatsapp"></i></span><a href="https://wa.me/201110760081" target="_blank" class="hover:text-white transition font-bold text-lg dir-ltr">+201110760081</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4">روابط سريعة</h3>
                        <ul class="space-y-2">
                            <li><a href="index.html" class="hover:text-secondary transition block py-1">الرئيسية</a></li>
                            <li><a href="about.html" class="hover:text-secondary transition block py-1">من نحن</a></li>
                            <li><a href="shipping-policy.html" class="hover:text-secondary transition block py-1">سياسة الشحن</a></li>
                            <li><a href="return-policy.html" class="hover:text-secondary transition block py-1">سياسة الاسترجاع</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4">طرق الدفع</h3>
                        <p class="mb-4 text-xs leading-relaxed opacity-80 text-white font-bold">طرق دفع آمنة ومتاح الدفع عند الاستلام</p>
                        <div class="flex gap-4 text-3xl text-gray-500 items-center">
                            <div class="flex flex-col items-center gap-1 group cursor-pointer">
                                <i class="fa-solid fa-hand-holding-dollar text-secondary group-hover:text-white transition transform group-hover:scale-110"></i>
                                <span class="text-[10px] font-bold">كاش</span>
                            </div>
                            <span class="border-r border-gray-700 h-8 mx-2"></span>
                            <i class="fa-brands fa-cc-visa hover:text-white transition transform hover:scale-110 cursor-pointer"></i>
                            <i class="fa-brands fa-cc-mastercard hover:text-white transition transform hover:scale-110 cursor-pointer"></i>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-10 pt-6 text-center text-xs flex flex-col md:flex-row justify-between items-center gap-2">
                    <p>&copy; 2025 سوق الكويت. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML("afterbegin", headerHTML);
    document.body.insertAdjacentHTML("beforeend", footerHTML);

    // تفعيل الموبايل منيو
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = menuBtn.querySelector('i');
            icon.className = mobileMenu.classList.contains('hidden') ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
        });
    }

    // تحديث السلة
    if (typeof updateCartCount === 'function') setTimeout(updateCartCount, 100);

    // ==========================================
    // ✅ منطق البحث الجديد (Global Search Logic)
    // ==========================================
    
    // تعريف دالة البحث العالمية
    window.executeSearch = function(inputId) {
        const input = document.getElementById(inputId);
        const query = input.value.trim();
        if (query) {
            // إذا كنا في الرئيسية، نفلتر فوراً
            if (isHomePage && typeof filterProductsBySearch === 'function') {
                filterProductsBySearch(query);
                // تمرير الشاشة للمنتجات
                document.getElementById('products-grid')?.scrollIntoView({behavior: 'smooth'});
            } else {
                // إذا كنا في صفحة أخرى، نذهب للرئيسية مع الاستعلام
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
        }
    };

    // ربط زر Enter بالبحث
    ['global-search-desktop', 'global-search-mobile'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') window.executeSearch(id);
            });
            
            // Live Search (فقط في الرئيسية)
            if (isHomePage) {
                input.addEventListener('input', (e) => {
                    if(typeof filterProductsBySearch === 'function') {
                        filterProductsBySearch(e.target.value);
                    }
                });
            }
        }
    });
});
