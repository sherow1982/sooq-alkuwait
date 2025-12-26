// layout.js - المسئول عن بناء القوائم والفوتر

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
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
                <div class="flex justify-between items-center">
                    
                    <!-- Logo -->
                    <a href="index.html" class="text-xl md:text-2xl font-extrabold text-primary flex items-center gap-2 group shrink-0">
                        <div class="w-8 h-8 md:w-10 md:h-10 bg-primary text-white rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-bag-shopping text-sm md:text-lg"></i>
                        </div>
                        <span>سوق الكويت</span>
                    </a>

                    <!-- Desktop Menu -->
                    <div class="hidden md:flex gap-6 text-sm font-bold items-center">
                        <a href="index.html" class="${isActive('index')} transition">الرئيسية</a>
                        <a href="contact.html" class="${isActive('contact')} transition">اتصل بنا</a>
                        <a href="shipping-policy.html" class="${isActive('shipping')} transition">سياسة الشحن</a>
                        <a href="return-policy.html" class="${isActive('return')} transition">الاسترجاع</a>
                    </div>

                    <!-- Icons & Mobile Button -->
                    <div class="flex items-center gap-4">
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
                    <div class="flex flex-col gap-3 text-sm font-bold text-gray-700">
                        <a href="index.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-house w-5 text-center"></i> الرئيسية</a>
                        <a href="contact.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-phone w-5 text-center"></i> اتصل بنا</a>
                        <a href="shipping-policy.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-truck w-5 text-center"></i> سياسة الشحن</a>
                        <a href="return-policy.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-rotate-left w-5 text-center"></i> سياسة الاسترجاع</a>
                        <a href="privacy-policy.html" class="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-primary"><i class="fa-solid fa-shield-halved w-5 text-center"></i> السياسة والخصوصية</a>
                        <a href="https://wa.me/201110760081" target="_blank" class="flex items-center gap-3 p-2 rounded text-green-600 bg-green-50 border border-green-200 mt-2"><i class="fa-brands fa-whatsapp w-5 text-center text-lg"></i> تواصل واتساب</a>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // --- 2. الفوتر (Footer) ---
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
                            <li><a href="contact.html" class="hover:text-secondary transition block py-1">اتصل بنا</a></li>
                            <li><a href="shipping-policy.html" class="hover:text-secondary transition block py-1">سياسة الشحن</a></li>
                            <li><a href="return-policy.html" class="hover:text-secondary transition block py-1">سياسة الاسترجاع</a></li>
                            <li><a href="terms.html" class="hover:text-secondary transition block py-1">الشروط والأحكام</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4">طرق الدفع</h3>
                        <p class="mb-4 text-xs leading-relaxed opacity-80">نوفر لكم خيارات دفع آمنة ومتعددة.</p>
                        <div class="flex gap-4 text-3xl text-gray-600">
                            <i class="fa-brands fa-cc-visa hover:text-white transition"></i>
                            <i class="fa-brands fa-cc-mastercard hover:text-white transition"></i>
                            <i class="fa-solid fa-money-bill-wave hover:text-white transition"></i>
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

    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = menuBtn.querySelector('i');
            icon.className = mobileMenu.classList.contains('hidden') ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
        });
    }

    if (typeof updateCartCount === 'function') setTimeout(updateCartCount, 100);
});
