/* سوق الكويت - واتساب JS */
function quickOrder(id,title,price,sale){
const msg=`🛒 ${title}\n💰 ${sale} د.ك (وفر ${price-sale} د.ك)\n🆔 SOOQ-${id.toString().padStart(4,'0')}\n\nالعنوان:`;
window.open(`https://wa.me/201110760081?text=${encodeURIComponent(msg)}`,'_blank');
}
document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('[href*="tel:"]').forEach(el=>el.href='tel:+201110760081');
document.querySelectorAll('[href*="wa.me"]:not([href*="text="])').forEach(el=>el.href='https://wa.me/201110760081');
});