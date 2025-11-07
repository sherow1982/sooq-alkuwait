// 📋 Footer Component - يستخدم في جميع صفحات الموقع

function renderFooter() {
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-brand">
                <h2><i class="fas fa-store"></i> سوق الكويت</h2>
                <p>متجرك الإلكتروني الموثوق لأفضل المنتجات بأسعار تنافسية</p>
            </div>
            
            <div class="footer-links">
                <a href="/index.html"><i class="fas fa-home"></i> الرئيسية</a>
                <a href="/products-catalog.html"><i class="fas fa-shopping-bag"></i> المنتجات</a>
                <a href="/categories.html"><i class="fas fa-tags"></i> الفئات</a>
                <a href="#"><i class="fas fa-undo"></i> سياسة الإرجاع</a>
                <a href="#"><i class="fas fa-shipping-fast"></i> الشحن والتوصيل</a>
                <a href="#"><i class="fas fa-shield-alt"></i> الضمان</a>
                <a href="https://wa.me/201110760081" target="_blank"><i class="fas fa-headset"></i> خدمة العملاء</a>
            </div>
            
            <div class="footer-contact">
                <p><i class="fas fa-phone"></i> +201110760081 | واتساب متاح 24/7</p>
                <p><i class="fas fa-envelope"></i> info@sooq-alkuwait.com</p>
                <p><i class="fas fa-map-marker-alt"></i> الكويت - توصيل لجميع المناطق</p>
                <p><i class="fas fa-clock"></i> ساعات العمل: 9 صباحاً - 9 مساءً (7 أيام)</p>
            </div>
            
            <div class="social-links">
                <a href="#" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>
                <a href="#" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="https://wa.me/201110760081" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <a href="#" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                <a href="#" target="_blank" title="Snapchat"><i class="fab fa-snapchat"></i></a>
                <a href="#" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 سوق الكويت. جميع الحقوق محفوظة.</p>
                <p style="margin-top: 10px;">
                    صُنع بـ <i class="fas fa-heart" style="color: #ff4757;"></i> في الكويت
                </p>
            </div>
        </div>
    </footer>
    `;
    
    const footerPlaceholder = document.getElementById('site-footer');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

document.addEventListener('DOMContentLoaded', renderFooter);
