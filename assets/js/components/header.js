/**
 * هيدر احترافي مع قائمة صفحات كاملة على الديسكتوب، وقائمة جانبية على الموبايل/التابلت
 * دون المساس بالألوان الأساسية، مع تحسين تباين الألوان وإضافة حالة active
 */
class HeaderComponent{
  constructor(){this.isMenuOpen=false;this.init();}
  init(){this.render();this.styles();this.events();this.updateCartCount();}
  render(){const root=document.getElementById('site-header');if(!root)return;root.innerHTML=`
  <header class="hk-header" role="banner">
    <div class="hk-wrap">
      <a class="hk-brand" href="index.html" aria-label="سوق الكويت">
        <span class="hk-flag">🇰🇼</span>
        <span class="hk-name">سوق الكويت</span>
      </a>
      <!-- قائمة الديسكتوب الكاملة -->
      <nav class="hk-desktop-nav" aria-label="القائمة الرئيسية">
        <a href="#home" class="nav-link">الرئيسية</a>
        <a href="#products" class="nav-link">المنتجات</a>
        <a href="cart.html" class="nav-link">السلة</a>
        <a href="about.html" class="nav-link">من نحن</a>
        <a href="contact.html" class="nav-link">اتصل بنا</a>
        <a href="shipping.html" class="nav-link">الشحن والتوصيل</a>
        <a href="privacy.html" class="nav-link">سياسة الخصوصية</a>
        <a href="terms.html" class="nav-link">الشروط والأحكام</a>
        <a href="refund.html" class="nav-link">سياسة الاسترجاع</a>
      </nav>
      <div class="hk-actions">
        <button class="hk-cart" onclick="location.href='cart.html'" aria-label="السلة">
          <i class="fas fa-shopping-cart"></i>
          <span class="hk-badge" id="cart-count">0</span>
        </button>
        <button class="hk-burger" onclick="headerComponent.toggle()" aria-label="فتح القائمة" aria-controls="hk-mobile" aria-expanded="false">
          <span class="b1"></span><span class="b2"></span><span class="b3"></span>
        </button>
      </div>
    </div>
    <!-- قائمة الموبايل -->
    <aside class="hk-drawer" id="hk-mobile" aria-hidden="true">
      <div class="hk-drawer-head">
        <div class="hk-brand mini"><span class="hk-flag">🇰🇼</span><span class="hk-name">سوق الكويت</span></div>
        <button class="hk-close" onclick="headerComponent.close()" aria-label="إغلاق"><i class="fas fa-times"></i></button>
      </div>
      <nav class="hk-nav" aria-label="قائمة الجوال">
        <a href="#home" onclick="headerComponent.close()"><i class="fas fa-home"></i> الرئيسية</a>
        <a href="#products" onclick="headerComponent.close()"><i class="fas fa-shopping-bag"></i> المنتجات</a>
        <a href="cart.html" onclick="headerComponent.close()"><i class="fas fa-shopping-cart"></i> السلة</a>
        <a href="about.html" onclick="headerComponent.close()"><i class="fas fa-info-circle"></i> من نحن</a>
        <a href="contact.html" onclick="headerComponent.close()"><i class="fas fa-phone"></i> اتصل بنا</a>
        <hr>
        <a href="shipping.html" onclick="headerComponent.close()"><i class="fas fa-truck"></i> الشحن والتوصيل</a>
        <a href="privacy.html" onclick="headerComponent.close()"><i class="fas fa-shield-alt"></i> سياسة الخصوصية</a>
        <a href="terms.html" onclick="headerComponent.close()"><i class="fas fa-file-contract"></i> الشروط والأحكام</a>
        <a href="refund.html" onclick="headerComponent.close()"><i class="fas fa-undo"></i> سياسة الاسترجاع</a>
      </nav>
    </aside>
  </header>`}
  styles(){const s=document.createElement('style');s.id='hk-header-styles';s.textContent=`
    .hk-header{position:sticky;top:0;z-index:1000;background:linear-gradient(135deg,var(--kuwait-green) 0%, #0c8b4f 60%, #087341 100%);box-shadow:0 6px 18px rgba(0,0,0,.15)}
    .hk-wrap{max-width:1200px;margin:0 auto;padding:8px 14px;display:flex;align-items:center;gap:14px}
    .hk-brand{display:flex;align-items:center;gap:.5rem;text-decoration:none}
    .hk-flag{filter:drop-shadow(0 0 4px rgba(255,215,0,.35))}
    .hk-name{font-weight:900;font-size:clamp(1rem,2.2vw,1.25rem);background:linear-gradient(45deg,var(--luxury-gold),#fff,var(--luxury-gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    /* قائمة الديسكتوب */
    .hk-desktop-nav{display:flex;align-items:center;gap:.6rem;margin-inline-start:auto}
    .hk-desktop-nav .nav-link{color:#f2f7f3;text-decoration:none;padding:.45rem .8rem;border-radius:10px;font-weight:700;letter-spacing:.2px;position:relative;transition:all .25s ease;border:1px solid rgba(255,255,255,.08)}
    .hk-desktop-nav .nav-link:hover{color:#111;background:linear-gradient(135deg,#ffd54a,#ffc107);box-shadow:0 6px 16px rgba(255,193,7,.35)}
    .hk-desktop-nav .nav-link.active{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.35)}
    /* تحسين التباين لسهولة القراءة */
    .hk-header, .hk-desktop-nav .nav-link{text-shadow:0 1px 1px rgba(0,0,0,.12)}
    /* أزرار الإجراءات */
    .hk-actions{display:flex;align-items:center;gap:.5rem;margin-inline-start:.5rem}
    .hk-cart{width:42px;height:42px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--luxury-gold),#ffbf00);color:#000;box-shadow:0 8px 20px rgba(255,215,0,.35);position:relative;cursor:pointer}
    .hk-badge{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:var(--kuwait-red);color:#fff;font-size:.7rem;font-weight:800;display:none;align-items:center;justify-content:center}
    .hk-burger{display:none;width:44px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.12);backdrop-filter:blur(6px);cursor:pointer;align-items:center;justify-content:center}
    .hk-burger .b1,.hk-burger .b2,.hk-burger .b3{display:block;width:18px;height:2px;background:#fff;border-radius:2px;margin:2px 0}
    /* Drawer للموبايل */
    .hk-drawer{position:fixed;top:0;right:-100%;width:min(320px,85vw);height:100vh;background:linear-gradient(180deg,#0f5132,var(--kuwait-green));color:#fff;box-shadow:-12px 0 30px rgba(0,0,0,.35);transition:right .35s ease;display:flex;flex-direction:column}
    .hk-drawer.active{right:0}
    .hk-drawer-head{display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid rgba(255,255,255,.15)}
    .hk-close{background:rgba(255,255,255,.15);color:#fff;border:none;border-radius:10px;width:36px;height:36px;cursor:pointer}
    .hk-nav{display:flex;flex-direction:column;padding:8px}
    .hk-nav a{display:flex;align-items:center;gap:.6rem;padding:12px;border-radius:10px;color:#fff;text-decoration:none;transition:all .25s ease}
    .hk-nav a:hover{background:rgba(255,255,255,.1);transform:translateX(-4px)}
    .hk-nav hr{border:none;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);margin:8px 0}
    /* استجابة: زر الهامبرجر يظهر تحت 1024px */
    @media(max-width:1023.98px){.hk-burger{display:flex}.hk-desktop-nav{display:none}}
  `;const old=document.getElementById('hk-header-styles');if(old)old.remove();document.head.appendChild(s)}
  events(){// تحديد الرابط النشط
    const setActive=()=>{const links=document.querySelectorAll('.hk-desktop-nav .nav-link');links.forEach(a=>a.classList.remove('active'));const path=location.pathname.split('/').pop();links.forEach(a=>{const href=a.getAttribute('href');if(href && href.endsWith(path)){a.classList.add('active');}});};setActive();
    let last=window.scrollY,ticking=false;const run=()=>{const y=window.scrollY;const h=document.querySelector('.hk-header');if(!h)return;h.classList.toggle('scrolled',y>40);if(y>last&&y>140&&!this.isMenuOpen){h.style.transform='translateY(-100%)'}else{h.style.transform='translateY(0)'}last=y;ticking=false};window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(run);ticking=true}}, {passive:true});document.addEventListener('click',e=>{const d=document.getElementById('hk-mobile');const b=document.querySelector('.hk-burger');if(this.isMenuOpen&&d&&!d.contains(e.target)&&(!b||!b.contains(e.target)))this.close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.isMenuOpen)this.close();});}
  toggle(){const d=document.getElementById('hk-mobile');if(!d)return;this.isMenuOpen=!this.isMenuOpen;d.classList.toggle('active',this.isMenuOpen);d.setAttribute('aria-hidden',(!this.isMenuOpen).toString());const b=document.querySelector('.hk-burger');if(b)b.setAttribute('aria-expanded',this.isMenuOpen.toString());document.body.style.overflow=this.isMenuOpen?'hidden':''}
  close(){const d=document.getElementById('hk-mobile');if(!d)return;this.isMenuOpen=false;d.classList.remove('active');d.setAttribute('aria-hidden','true');const b=document.querySelector('.hk-burger');if(b)b.setAttribute('aria-expanded','false');document.body.style.overflow=''}
  updateCartCount(){setTimeout(()=>{if(typeof cartManager!=='undefined'&&cartManager.getCartItemCount){const n=cartManager.getCartItemCount();const el=document.getElementById('cart-count');if(el){el.textContent=n;el.style.display=n>0?'flex':'none';}}},120)}
}
if(typeof module!=='undefined'&&module.exports){module.exports=HeaderComponent}else{window.HeaderComponent=HeaderComponent}
