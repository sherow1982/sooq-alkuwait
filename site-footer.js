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
                <h3>الصفحات</h3>
                <a href="/index.html"><i class="fas fa-home"></i> الرئيسية</a>
                <a href="/products-catalog.html"><i class="fas fa-shopping-bag"></i> المنتجات</a>
                <a href="/about.html"><i class="fas fa-info-circle"></i> من نحن</a>
                <a href="/contact.html"><i class="fas fa-envelope"></i> اتصل بنا</a>
            </div>
            
            <div class="footer-links">
                <h3>السياسات</h3>
                <a href="/privacy-policy.html"><i class="fas fa-shield-alt"></i> سياسة الخصوصية</a>
                <a href="/return-policy.html"><i class="fas fa-undo"></i> سياسة الاسترجاع</a>
                <a href="/shipping-policy.html"><i class="fas fa-shipping-fast"></i> سياسة الشحن</a>
                <a href="/terms-conditions.html"><i class="fas fa-file-contract"></i> الشروط والأحكام</a>
                <a href="/warranty-policy.html"><i class="fas fa-shield-alt"></i> سياسة الضمان</a>
            </div>
            
            <div class="footer-contact">
                <h3>اتصل بنا</h3>
                <p><i class="fas fa-phone"></i> واتساب: <a href="https://wa.me/201110760081" target="_blank" style="color:white">+201110760081</a></p>
                <p><i class="fas fa-envelope"></i> البريد: <a href="mailto:sherow1982@gmail.com" style="color:white">sherow1982@gmail.com</a></p>
                <p><i class="fas fa-map-marker-alt"></i> الكويت - توصيل لجميع المناطق</p>
                <p><i class="fas fa-clock"></i> ساعات العمل: 24/7</p>
            </div>
            
            <div class="social-links">
                <a href="https://wa.me/201110760081" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <a href="#" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>
                <a href="#" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
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
