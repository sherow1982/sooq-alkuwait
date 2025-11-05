/* تحميل استايل الهيدر والفوتر bulk على جميع الصفحات تلقائياً */
(function(){
  try{
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/css/bulk-kuwait-flag.css';
    document.head.appendChild(link);
  }catch(e){console&&console.warn('bulk style load error',e)}
})();
