<?php
header('Content-Type: application/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://sooq-alkuwait.arabsad.com/</loc><lastmod><?= date('Y-m-d') ?></lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
<?php
// فئات
$categories = ["electronics", "kitchen", "clothing", "toys", "beauty", "sports", "auto"];
foreach($categories as $cat) {
    echo "<url><loc>https://sooq-alkuwait.arabsad.com/category/$cat/</loc><lastmod>" . date('Y-m-d') . "</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n";
}

// منتجات
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

$categories_ar = ["إلكترونيات", "مطبخ", "ملابس", "ألعاب", "تجميل", "رياضة", "سيارات"];
$categories_en = ["Electronics", "Kitchen", "Clothing", "Toys", "Beauty", "Sports", "Auto"];

// توليد 1977 منتج
for ($i = 1; $i <= 1977; $i++) {
    $base_idx = ($i - 1) % count($products);
    $cat_idx = ($i - 1) % count($categories_ar);
    
    // تنويع اسم المنتج
    if ($i <= count($products)) {
        $name = $products[$base_idx];
    } else {
        $variant = intval(($i - 1) / count($products)) + 1;
        $name = $products[$base_idx] . " موديل " . $variant;
    }
    
    $category_ar = $categories_ar[$cat_idx];
    $category_en = $categories_en[$cat_idx];
    $clean_name = str_replace([" ", "،"], ["-", ""], $name);
    $price = 15 + (($i - 1) % 45);
    $sale_price = max(10, $price - 5);
    
    echo "<item>\n";
    echo "<g:id>SOOQ-" . str_pad($i, 4, "0", STR_PAD_LEFT) . "</g:id>\n";
    echo "<g:title>$name</g:title>\n";
    echo "<g:description>$name من سوق الكويت - $category_ar</g:description>\n";
    echo "<g:link>https://sooq-alkuwait.arabsad.com/product-$i-$clean_name.html</g:link>\n";
    echo "<g:image_link>https://via.placeholder.com/400x400/2d5230/fff?text=" . urlencode($category_ar) . "</g:image_link>\n";
    echo "<g:condition>new</g:condition>\n";
    echo "<g:availability>in stock</g:availability>\n";
    echo "<g:price>$price KWD</g:price>\n";
    echo "<g:sale_price>$sale_price KWD</g:sale_price>\n";
    echo "<g:brand>سوق الكويت</g:brand>\n";
    echo "<g:product_category>$category_en</g:product_category>\n";
    echo "<g:custom_label_0>$category_ar</g:custom_label_0>\n";
    echo "<g:gtin>12345" . str_pad($i, 7, "0", STR_PAD_LEFT) . "</g:gtin>\n";
    echo "<g:mpn>SOOQ-MPN-" . str_pad($i, 4, "0", STR_PAD_LEFT) . "</g:mpn>\n";
    echo "<g:shipping><g:country>KW</g:country><g:service>Standard</g:service><g:price>0 KWD</g:price></g:shipping>\n";
    echo "</item>\n";
}
?>
</channel>
</rss>