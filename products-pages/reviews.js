// تحميل بيانات التقييمات الكويتية وعرضها في صفحات المنتجات
(async function(){
  async function fetchJSON(url){
    const res = await fetch(url, {cache:'no-cache'});
    if(!res.ok) throw new Error('failed to load '+url);
    return res.json();
  }

  function renderStars(rating){
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let html = '';
    for(let i=0;i<full;i++) html += '<i class="fas fa-star" aria-hidden="true"></i>';
    if(half) html += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    for(let i=full+(half?1:0); i<5; i++) html += '<i class="far fa-star" aria-hidden="true"></i>';
    return html;
  }

  // حدد productId من وسم داخل الصفحة <meta name="product-id" content="X">
  const pidMeta = document.querySelector('meta[name="product-id"]');
  if(!pidMeta) return;
  const productId = pidMeta.getAttribute('content');
  if(!productId) return;

  try{
    const data = await fetchJSON('../kuwaiti_reviews.json');
    const reviews = data[productId] || [];
    if(!reviews.length) return;

    const container = document.querySelector('#reviews-section');
    if(!container) return;

    const avg = (reviews.reduce((s,r)=>s+Number(r.rating),0)/reviews.length).toFixed(2);
    const count = reviews.length;

    let html = '';
    html += '<div class="reviews-summary">';
    html += '<div class="avg-rating"><span class="score">'+avg+'</span>/5</div>';
    html += '<div class="stars">'+renderStars(parseFloat(avg))+'</div>';
    html += '<div class="count">('+count+' تقييم)</div>';
    html += '</div>';

    html += '<ul class="reviews-list">';
    for(const r of reviews){
      html += '<li class="review-item">';
      html += '<div class="review-head">';
      html += '<strong class="reviewer">'+r.name+'</strong>';
      html += '<span class="date">'+r.date+'</span>';
      html += '<span class="stars">'+renderStars(parseFloat(r.rating))+'</span>';
      html += r.verified ? '<span class="badge">مشتري موثّق</span>' : '';
      html += '</div>';
      html += '<p class="comment">'+r.comment+'</p>';
      html += '</li>';
    }
    html += '</ul>';

    container.innerHTML = html;
  }catch(err){ /* تجاهل */ }
})();
