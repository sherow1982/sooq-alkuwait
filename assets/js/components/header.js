/**
 * هيدر مخصص ألوان علم الكويت لجميع الصفحات القانونية وروابطها.
 */
class HeaderComponent {
  constructor() { this.isMenuOpen=false; this.init(); }
  init() { this.render(); this.styles(); this.events(); this.updateCartCount(); }
  render() {
    const root = document.getElementById('site-header');
    if (!root) return;
    root.innerHTML = `
      <header class="kw-flag-header" role="banner">
        <div class="kw-flag-bar"></div>
        <div class="container">
          <div class="nav-wrapper kw-flag-nav">
            <div class="logo"><span class="kw-flag-logo">🇰🇼</span><span class="site-name">سوق الكويت</span></div>
            <nav class="nav kw-flag-links" aria-label="روابط رئيسية">
              <a href="index.html" class="nav-link">الرئيسية</a>
              <a href="about.html" class="nav-link">من نحن</a>
              <a href="contact.html" class="nav-link">اتصل بنا</a>
              <a href="privacy.html" class="nav-link">سياسة الخصوصية</a>
              <a href="terms.html" class="nav-link">الشروط والأحكام</a>
              <a href="refund.html" class="nav-link">سياسة الاسترجاع</a>
              <a href="shipping.html" class="nav-link">الشحن والتوصيل</a>
            </nav>
            <button class="kw-flag-burger" onclick="headerComponent.toggle()" aria-label="قائمة الجوال" aria-controls="kw-mobile-nav" aria-expanded="false"><span></span><span></span><span></span></button>
          </div>
        </div>
        <aside class="kw-mobile-drawer" id="kw-mobile-nav" aria-hidden="true">
          <nav aria-label="القائمة الجانبية">
            <a href="index.html" onclick="headerComponent.close()">الرئيسية</a>
            <a href="about.html" onclick="headerComponent.close()">من نحن</a>
            <a href="contact.html" onclick="headerComponent.close()">اتصل بنا</a>
            <a href="privacy.html" onclick="headerComponent.close()">سياسة الخصوصية</a>
            <a href="terms.html" onclick="headerComponent.close()">الشروط والأحكام</a>
            <a href="refund.html" onclick="headerComponent.close()">سياسة الاسترجاع</a>
            <a href="shipping.html" onclick="headerComponent.close()">الشحن والتوصيل</a>
          </nav>
        </aside>
      </header>`;
  }
  styles() {
    const style = document.createElement('style');
    style.id = 'kw-flag-header-style';
    style.textContent = `
      .kw-flag-header {
        background: linear-gradient(to bottom, #009344 0 30%, #fff 30% 65%, #e92429 65% 100%);
        box-shadow: 0 6px 24px rgba(0,0,0,0.12);
        position: sticky; top:0; z-index:1000;
        min-height:80px; margin:0;
      }
      .kw-flag-bar {
        width:100vw; height:7px;
        background: linear-gradient(90deg, black 0 20%, #009344 20% 50%, white 50% 80%, red 80%);
        box-shadow:0 4px 20px rgba(0,0,0,.11); margin-bottom:0.5rem;
      }
      .kw-flag-nav {display: flex; align-items: center; justify-content: space-between;}
      .kw-flag-logo {font-size: 2rem; margin-left: .6rem;}
      .site-name {font-weight:900;font-size:1.25rem;background:linear-gradient(45deg,#009344,#fff,#e92429);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
      .kw-flag-links {display:flex;gap:.7rem;align-items:center;}
      .kw-flag-links .nav-link {
        color:#111;background:rgba(255,255,255,.80);padding:.43rem 1.1rem;border-radius:13px;font-weight:800;text-decoration:none;transition:all .22s;border:2px solid transparent;font-size:1.02rem;box-shadow:0 3px 9px rgba(0,0,0,.06);
      }
      .kw-flag-links .nav-link.active, .kw-flag-links .nav-link:hover {
        background: linear-gradient(90deg, #009344 40%, #e92429 80%);
        color:#fff; border-color:#ffd600; box-shadow:0 6px 18px rgba(0,147,68,.13);
        transform: scale(1.07);
      }
      .kw-flag-burger {display:none; flex-direction:column;gap:4px;background:rgba(0,147,68,.13);border-radius:10px;border:none;cursor:pointer; padding:8px; }
      .kw-flag-burger span {display:block;width:24px;height:3px;background:#111;border-radius:2px;}
      @media (max-width: 1024px) { .kw-flag-links { display: none; } .kw-flag-burger { display: flex; } }
      .kw-mobile-drawer { position: fixed; top: 0; right: -100vw; width: min(330px, 90vw); height: 100vh; background: linear-gradient(to bottom, #009344, #fff, #e92429); box-shadow: -12px 0 26px rgba(0,0,0,0.13); z-index: 2000; transition: right 0.32s; display: flex; flex-direction: column; padding: 2rem 1.5rem; }
      .kw-mobile-drawer.active { right: 0; }
      .kw-mobile-drawer nav { display: flex; flex-direction: column; gap: 1.5rem; }
      .kw-mobile-drawer nav a { font-weight: 800; color: #009344; background: #fff; border-radius: 11px; padding: 1.1rem 1.2rem; text-decoration: none; font-size: 1.2rem; box-shadow: 0 3px 12px rgba(0,0,0,0.07); transition: all .22s; }
      .kw-mobile-drawer nav a:active, .kw-mobile-drawer nav a:hover { color: #fff; background: #009344; }
      @media (max-width: 690px) { .kw-flag-logo {font-size:1.3rem;} .site-name {font-size:.87rem;}}
    `;
    const old = document.getElementById('kw-flag-header-style');
    if (old) old.remove();
    document.head.appendChild(style);
  }
  events() {
    /* burger show/hide drawer */
    const header = this;
    let last = window.scrollY, ticking = false;
    const handleScroll = () => {
      const h = document.querySelector('.kw-flag-header');
      if (!h) return;
      const y = window.scrollY;
      h.classList.toggle('scrolled', y>40);
      if (y>last && y>120 && !header.isMenuOpen) {
        h.style.transform='translateY(-100%)';
      } else {
        h.style.transform='translateY(0)';
      }
      last = y; ticking = false;
    };
    window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(handleScroll);ticking=true;}}, {passive:true});
    document.addEventListener('click',e=>{
      const d=document.getElementById('kw-mobile-nav');
      const b=document.querySelector('.kw-flag-burger');
      if(this.isMenuOpen&&d&&!d.contains(e.target)&&(!b||!b.contains(e.target)))this.close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.isMenuOpen)this.close();});
    this.setActive();
  }
  setActive() {
    const links=document.querySelectorAll('.kw-flag-links .nav-link');
    links.forEach(a=>a.classList.remove('active'));
    const path=location.pathname.split('/').pop();
    links.forEach(a=>{const href=a.getAttribute('href');if(href && href.endsWith(path)){a.classList.add('active');}});
  }
  toggle(){const d=document.getElementById('kw-mobile-nav');if(!d)return;this.isMenuOpen=!this.isMenuOpen;d.classList.toggle('active',this.isMenuOpen);d.setAttribute('aria-hidden',(!this.isMenuOpen).toString());const b=document.querySelector('.kw-flag-burger');if(b)b.setAttribute('aria-expanded',this.isMenuOpen.toString());document.body.style.overflow=this.isMenuOpen?'hidden':''}
  close(){const d=document.getElementById('kw-mobile-nav');if(!d)return;this.isMenuOpen=false;d.classList.remove('active');d.setAttribute('aria-hidden','true');const b=document.querySelector('.kw-flag-burger');if(b)b.setAttribute('aria-expanded','false');document.body.style.overflow=''}
  updateCartCount(){}
}
if(typeof module!=='undefined'&&module.exports){module.exports=HeaderComponent}else{window.HeaderComponent=HeaderComponent}
