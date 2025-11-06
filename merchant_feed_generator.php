<?php
header('Content-Type: application/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>سوق الكويت - 1977 منتج</title>
<link>https://sooq-alkuwait.arabsad.com/</link>
<description>1977 منتج عالي الجودة</description>
<language>ar</language>
<?php
// قائمة أسماء المنتجات
$products = [
    "شاحن لاسلكي", "ميزان الكتروني", "ميزان رقمي", "مضخة مياه", "مروحة رذاذ", "جهاز عناية اظافر",
    "ماكينة حلاقة", "مروحة محمولة", "حامل هاتف", "مصباح شمسي", "مصباح ليلي", "خطاف لاصق",
    "مروحة يدوية", "حقيبة سفر", "جهاز منع الشخير", "ممسحة ارضية", "كسارة جليد", "ضوء LED",
    "ماكينة تشذيب", "جهاز قياس حرارة", "جهاز تدليك", "كشاف يدوي", "مكنسة كهربائية", "شامبو طبيعي",
    "مروحة قابلة للطي", "كرسي قابل للنفخ", "خلاط يدوي", "ضوء سيارة", "سماعة بلوتوث", "مصباح يدوي",
    "حزام دعم ظهر", "مكبر صوت", "مسامير تثبيت", "سروال رياضي", "ضوء طوارئ", "مصباح سرير",
    "مظلة شمس", "رأس دش", "علبة مناديل", "مروحة مضيئة", "قلم ليزر", "عصارة محمولة", "ماكينة ثلج",
    "جرس باب", "حقيبة يد", "كريم مرمم", "مسدس فقاعات", "مبراة سكاكين", "حشو سيراميك",
    "صمام تحكم", "منبه", "مثقاب", "مكواة", "وسادة", "زجاجة ماء", "مرتبة", "روبوت", "غلاية"
];

for ($i = 1; $i <= 1977; $i++) {
    $base_idx = ($i - 1) % count($products);
    
    if ($i <= count($products)) {
        $name = $products[$base_idx];
    } else {
        $variant = intval(($i - 1) / count($products)) + 1;
        $name = $products[$base_idx] . " موديل " . $variant;
    }
    
    $clean_name = str_replace([" ", "،"], ["-", ""], $name);
    echo "<url><loc>https://sooq-alkuwait.arabsad.com/product-$i-$clean_name.html</loc><lastmod>" . date('Y-m-d') . "</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n";
}
?>
</urlset>