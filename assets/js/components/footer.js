/**
 * مكون التذييل المحسن (Footer) - إزالة زر Robots.txt من التذييل
 */
class FooterComponent {
    constructor() { this.init(); }
    init() { this.createFooterHTML(); this.addFooterStyles(); this.bindEvents(); }
    createFooterHTML() {
        const footerContainer = document.getElementById('site-footer');
        if (!footerContainer) return;
        const currentYear = new Date().getFullYear();
        footerContainer.innerHTML = `
            <footer class="footer enhanced-footer">
                <div class="container">
                    <div class="footer-main">
                        <div class="footer-content">
                            <div class="footer-section brand-section">
                                <div class="footer-logo">
                                    <h3><span class="kuwait-flag">🇰🇼</span> سوق الكويت</h3>
                                </div>
                                <p class="brand-description">متجرك الإلكتروني الموثوق للمنتجات عالية الجودة. نخدم عملاءنا بشغف وحب منذ عام 2024.</p>
                                <div class="social-links-enhanced">
                                    <a href="#" aria-label="فيسبوك" class="social-btn facebook"><i class="fab fa-facebook-f"></i></a>
                                    <a href="#" aria-label="إنستغرام" class="social-btn instagram"><i class="fab fa-instagram"></i></a>
                                    <a href="https://wa.me/201110760081" target="_blank" aria-label="واتساب" class="social-btn whatsapp"><i class="fab fa-whatsapp"></i></a>
                                    <a href="#" aria-label="تيك توك" class="social-btn tiktok"><i class="fab fa-tiktok"></i></a>
                                </div>
                            </div>
                            <div class="footer-section">
                                <h4>روابط سريعة</h4>
                                <ul class="footer-links">
                                    <li><a href="index.html"><i class="fas fa-home"></i> الرئيسية</a></li>
                                    <li><a href="#products"><i class="fas fa-shopping-bag"></i> المنتجات</a></li>
                                    <li><a href="cart.html"><i class="fas fa-shopping-cart"></i> السلة</a></li>
                                    <li><a href="checkout.html"><i class="fas fa-credit-card"></i> إتمام الطلب</a></li>
                                </ul>
                            </div>
                            <div class="footer-section">
                                <h4>الصفحات القانونية</h4>
                                <ul class="footer-links">
                                    <li><a href="about.html"><i class="fas fa-info-circle"></i> من نحن</a></li>
                                    <li><a href="privacy.html"><i class="fas fa-shield-alt"></i> سياسة الخصوصية</a></li>
                                    <li><a href="terms.html"><i class="fas fa-file-contract"></i> الشروط والأحكام</a></li>
                                    <li><a href="refund.html"><i class="fas fa-undo"></i> سياسة الاسترجاع</a></li>
                                    <li><a href="shipping.html"><i class="fas fa-truck"></i> الشحن والتوصيل</a></li>
                                </ul>
                            </div>
                            <div class="footer-section contact-section">
                                <h4>تواصل معنا</h4>
                                <div class="contact-info-enhanced">
                                    <a href="tel:+201110760081" class="contact-item"><i class="fas fa-phone"></i><div class="contact-details"><span class="contact-label">هاتف</span><span class="contact-value" dir="ltr">+20 111 076 0081</span></div></a>
                                    <a href="https://wa.me/201110760081" target="_blank" class="contact-item whatsapp-item"><i class="fab fa-whatsapp"></i><div class="contact-details"><span class="contact-label">واتساب</span><span class="contact-value">اتصل الآن</span></div></a>
                                    <a href="mailto:support@sooq-alkuwait.com" class="contact-item"><i class="fas fa-envelope"></i><div class="contact-details"><span class="contact-label">إيميل</span><span class="contact-value">support@sooq-alkuwait.com</span></div></a>
                                    <div class="contact-item"><i class="fas fa-clock"></i><div class="contact-details"><span class="contact-label">ساعات العمل</span><span class="contact-value">24/7 طوال الأسبوع</span></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="footer-features-bar">
                        <div class="feature-highlight"><i class="fas fa-shield-alt"></i><span>مدفوعات آمنة</span></div>
                        <div class="feature-highlight"><i class="fas fa-truck"></i><span>توصيل مجاني</span></div>
                        <div class="feature-highlight"><i class="fas fa-undo"></i><span>ارتجاع مجاني</span></div>
                        <div class="feature-highlight"><i class="fas fa-headset"></i><span>دعم 24/7</span></div>
                        <div class="feature-highlight"><i class="fas fa-certificate"></i><span>منتجات أصلية</span></div>
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <div class="copyright">
                                <p>&copy; ${currentYear} سوق الكويت. جميع الحقوق محفوظة.</p>
                                <p class="made-in-kuwait">🇰🇼 صنع بحب في الكويت</p>
                            </div>
                            <div class="footer-actions">
                                <div class="footer-links-inline">
                                    <a href="sitemap.xml" class="footer-link-btn">خريطة الموقع</a>
                                    <!-- تمت إزالة رابط robots.txt بناء على طلب العميل -->
                                </div>
                                <button onclick="footerComponent.scrollToTop()" class="scroll-top-btn enhanced-scroll-btn" title="العودة لأعلى"><i class="fas fa-rocket"></i><span class="scroll-text">أعلى</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-background-animation"></div>
            </footer>`;
    }
    addFooterStyles(){/* تبقى كما هي - الأنماط محمّلة سابقاً */}
    bindEvents(){this.setupScrollToTop();this.setupScrollAnimation();this.enhanceSocialLinks();}
    setupScrollToTop(){let btn=document.querySelector('.enhanced-scroll-btn');if(!btn)return;let v=false;window.addEventListener('scroll',()=>{const s=window.scrollY>300;if(s&&!v){btn.style.opacity='1';btn.style.pointerEvents='auto';btn.style.transform='scale(1)';v=true;}else if(!s&&v){btn.style.opacity='0.7';btn.style.transform='scale(0.9)';v=false;}},{passive:true});}
    scrollToTop(){window.scrollTo({top:0,behavior:'smooth'});const b=document.querySelector('.enhanced-scroll-btn');if(b){b.style.transform='scale(0.9)';setTimeout(()=>b.style.transform='',200);}}
    setupScrollAnimation(){const f=document.querySelector('.enhanced-footer');if(!f)return;const o=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('footer-animate-in');const ss=e.target.querySelectorAll('.footer-section');ss.forEach((s,i)=>{setTimeout(()=>{s.style.animation='slideInUp .6s ease-out'},i*200);});}});},{threshold:.1,rootMargin:'0px 0px -50px 0px'});o.observe(f);}
    enhanceSocialLinks(){document.querySelectorAll('.social-btn').forEach(l=>{l.addEventListener('mouseenter',()=>{if(navigator.vibrate)navigator.vibrate(50);});});}
}
if(typeof module!=='undefined'&&module.exports){module.exports=FooterComponent}else{window.FooterComponent=FooterComponent}
