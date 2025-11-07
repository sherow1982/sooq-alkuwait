/**
 * فوتر متناسق مع الهيدر (KF: Kuwait Footer)
 * - نفس تباين الألوان والتدرجات
 * - روابط كاملة + حالة Active مماثلة
 * - تخطيط مرن للديسكتوب والموبايل
 */
class FooterComponent{
  constructor(){this.init();}
  init(){this.render();this.styles();this.events();this.setActive();}
  render(){const root=document.getElementById('site-footer');if(!root)return;const y=new Date().getFullYear();root.innerHTML=`
  <footer class="kf" role="contentinfo">
    <div class="kf-wrap">
      <div class="kf-col brand">
        <a class="kf-brand" href="index.html" aria-label="سوق الكويت">
          <span class="flag">🇰🇼</span><span class="name">سوق الكويت</span>
        </a>
        <p class="desc">متجرك الإلكتروني الموثوق للمنتجات عالية الجودة، بخدمة عملاء 24/7 داخل الكويت.</p>
        <div class="social">
          <a href="#" aria-label="Facebook" class="s fb"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram" class="s ig"><i class="fab fa-instagram"></i></a>
          <a href="https://wa.me/201110760081" target="_blank" aria-label="WhatsApp" class="s wa"><i class="fab fa-whatsapp"></i></a>
          <a href="#" aria-label="TikTok" class="s tk"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>
      <nav class="kf-col links" aria-label="روابط سريعة">
        <h4>روابط سريعة</h4>
        <a href="index.html" class="f-link">الرئيسية</a>
        <a href="#products" class="f-link">المنتجات</a>
        <a href="cart.html" class="f-link">السلة</a>
        <a href="checkout.html" class="f-link">إتمام الطلب</a>
      </nav>
      <nav class="kf-col legal" aria-label="الصفحات القانونية">
        <h4>الصفحات القانونية</h4>
        <a href="about.html" class="f-link">من نحن</a>
        <a href="privacy.html" class="f-link">سياسة الخصوصية</a>
        <a href="terms.html" class="f-link">الشروط والأحكام</a>
        <a href="refund.html" class="f-link">سياسة الاسترجاع</a>
        <a href="shipping.html" class="f-link">الشحن والتوصيل</a>
      </nav>
      <div class="kf-col contact">
        <h4>تواصل معنا</h4>
        <a href="tel:+201110760081" class="ct"><i class="fas fa-phone"></i><span dir="ltr">+20 111 076 0081</span></a>
        <a href="mailto:support@sooq-alkuwait.com" class="ct"><i class="fas fa-envelope"></i> support@sooq-alkuwait.com</a>
        <div class="ct"><i class="fas fa-clock"></i> متاح 24/7</div>
      </div>
    </div>
    <div class="kf-bar">
      <div class="feats">
        <span><i class="fas fa-shield-alt"></i> مدفوعات آمنة</span>
        <span><i class="fas fa-truck"></i> توصيل مجاني</span>
        <span><i class="fas fa-undo"></i> ارتجاع مجاني</span>
        <span><i class="fas fa-headset"></i> دعم 24/7</span>
      </div>
      <div class="copy">© ${y} سوق الكويت — جميع الحقوق محفوظة</div>
      <button class="to-top" onclick="footerComponent.scrollTop()" aria-label="العودة لأعلى"><i class="fas fa-arrow-up"></i></button>
    </div>
  </footer>`}
  styles(){const s=document.createElement('style');s.id='kf-styles';s.textContent=`
    .kf{margin-top:3rem;background:linear-gradient(135deg,#0b0b0b 0%, #111 45%, var(--kuwait-green) 100%);color:#e9f6ef}
    .kf-wrap{max-width:1200px;margin:0 auto;padding:28px 14px;display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:24px}
    .kf-brand{display:flex;align-items:center;gap:.5rem;text-decoration:none}
    .flag{filter:drop-shadow(0 0 4px rgba(255,215,0,.4))}
    .name{font-weight:900;font-size:1.2rem;background:linear-gradient(45deg,var(--luxury-gold),#fff,var(--luxury-gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .desc{opacity:.9;line-height:1.7;margin-top:8px}
    .social{display:flex;gap:10px;margin-top:12px}
    .s{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;text-decoration:none;transition:transform .25s, box-shadow .25s}
    .fb{background:#1877f2}.ig{background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)}.wa{background:#25d366}.tk{background:#000}
    .s:hover{transform:translateY(-4px);box-shadow:0 10px 20px rgba(0,0,0,.25)}
    .links h4,.legal h4,.contact h4{color:var(--luxury-gold);margin:0 0 10px}
    .f-link,.ct{color:#dbe7e2;text-decoration:none;padding:6px 0;border-radius:8px;transition:background .25s,color .25s}
    .f-link:hover,.ct:hover{background:rgba(255,255,255,.08);color:#fff}
    .ct i{color:var(--kuwait-green)}
    .kf-bar{border-top:1px solid rgba(255,255,255,.15);padding:14px 12px;background:rgba(0,0,0,.25);backdrop-filter:blur(6px)}
    .feats{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-bottom:6px}
    .feats span{display:flex;align-items:center;gap:6px;opacity:.95}
    .copy{text-align:center;opacity:.9}
    .to-top{position:fixed;bottom:18px;left:18px;width:46px;height:46px;border:none;border-radius:50%;background:linear-gradient(135deg,var(--luxury-gold),#ffbf00);color:#111;box-shadow:0 10px 24px rgba(255,215,0,.35);cursor:pointer;display:none}
    @media(max-width:1024px){.kf-wrap{grid-template-columns:1fr 1fr}}
    @media(max-width:768px){.kf-wrap{grid-template-columns:1fr;text-align:center}.social{justify-content:center}}
  `;const old=document.getElementById('kf-styles');if(old)old.remove();document.head.appendChild(s)}
  events(){window.addEventListener('scroll',()=>{const b=document.querySelector('.to-top');if(!b)return;b.style.display=window.scrollY>300?'block':'none'},{passive:true});}
  scrollTop(){window.scrollTo({top:0,behavior:'smooth'})}
  setActive(){const path=location.pathname.split('/').pop();document.querySelectorAll('.kf a.f-link').forEach(a=>{a.classList.toggle('active',(a.getAttribute('href')||'').endsWith(path));});}
}
if(typeof module!=='undefined'&&module.exports){module.exports=FooterComponent}else{window.FooterComponent=FooterComponent}
