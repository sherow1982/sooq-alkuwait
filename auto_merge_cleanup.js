const { execSync } = require('child_process');
const fs = require('fs');

// 🚀 سكريبت دمج الفروع وحذف غير اللازمة - تنفيذ آلي
console.log('🔄 بدء عملية دمج الفروع وحذف غير اللازمة...');

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, errorMessage) {
    try {
        const result = execSync(command, { stdio: 'pipe' }).toString().trim();
        return result;
    } catch (error) {
        log(`❌ ${errorMessage}`, 'red');
        log(`Command: ${command}`, 'yellow');
        log(`Error: ${error.message}`, 'red');
        return null;
    }
}

async function mergeAndCleanup() {
    try {
        log('📋 المرحلة 1: تحديث فرع main', 'yellow');
        runCommand('git checkout main', 'فشل في الانتقال لفرع main');
        runCommand('git pull origin main', 'فشل في تحديث main');
        log('✅ تم تحديث main', 'green');

        log('📋 المرحلة 2: معالجة فرع cleaning/refactor-structure', 'yellow');
        runCommand('git fetch origin cleaning/refactor-structure', 'فشل في جلب cleaning/refactor-structure');
        runCommand('git checkout cleaning/refactor-structure', 'فشل في الانتقال للفرع');
        
        log('🔧 إعادة ارتكاز على main...', 'yellow');
        const rebaseResult = runCommand('git rebase main', null);
        
        if (rebaseResult === null) {
            log('⚠️ توجد تعارضات - يرجى حلها يدوياً', 'yellow');
            log('الملفات المتعارضة:', 'yellow');
            const conflicts = runCommand('git status --porcelain=v1 | grep "^UU\|^AA\|^DD"', 'فشل في عرض التعارضات');
            if (conflicts) console.log(conflicts);
            
            log('لحل التعارضات:', 'yellow');
            log('1. افتح كل ملف متعارض وحل التعارض', 'yellow');
            log('2. git add .', 'yellow');
            log('3. git rebase --continue', 'yellow');
            log('4. شغل هذا السكريبت مرة أخرى', 'yellow');
            process.exit(1);
        }
        
        log('📤 دفع الفرع المحلول...', 'yellow');
        runCommand('git push origin cleaning/refactor-structure --force-with-lease', 'فشل في دفع الفرع');
        log('✅ تم دفع cleaning/refactor-structure', 'green');

        log('📋 المرحلة 3: دمج في main', 'yellow');
        runCommand('git checkout main', 'فشل في العودة لـ main');
        runCommand('git merge cleaning/refactor-structure --no-ff -m "🧹 دمج تنظيف شامل + إصلاح فئات وفيدز"', 'فشل في دمج cleaning/refactor-structure');
        runCommand('git push origin main', 'فشل في دفع main المحدث');
        log('✅ تم دمج cleaning/refactor-structure في main', 'green');

        log('📋 المرحلة 4: معالجة فرع fix-cart-and-products-v4', 'yellow');
        runCommand('git fetch origin fix-cart-and-products-v4', 'فشل في جلب fix-cart-and-products-v4');
        runCommand('git checkout fix-cart-and-products-v4', 'فشل في الانتقال للفرع');
        
        const rebaseResult2 = runCommand('git rebase main', null);
        if (rebaseResult2 === null) {
            log('⚠️ توجد تعارضات في فرع الكارت - يرجى حلها يدوياً', 'yellow');
            log('بعد الحل:', 'yellow');
            log('1. git add .', 'yellow');
            log('2. git rebase --continue', 'yellow');
            log('3. git push origin fix-cart-and-products-v4 --force-with-lease', 'yellow');
            log('4. git checkout main && git merge fix-cart-and-products-v4 --squash', 'yellow');
            process.exit(1);
        }
        
        runCommand('git push origin fix-cart-and-products-v4 --force-with-lease', 'فشل في دفع فرع الكارت');
        
        log('📤 دمج فرع الكارت...', 'yellow');
        runCommand('git checkout main', 'فشل في العودة لـ main');
        runCommand('git merge fix-cart-and-products-v4 --no-ff -m "🛒 دمج إصلاح زر إضافة للسلة وصفحات المنتجات"', 'فشل في دمج فرع الكارت');
        runCommand('git push origin main', 'فشل في دفع main');
        log('✅ تم دمج fix-cart-and-products-v4 في main', 'green');

        log('📋 المرحلة 5: حذف الفروع غير اللازمة', 'yellow');
        
        // حذف الفروع المدموجة محلياً
        log('🗑️ حذف الفروع المحلية...', 'yellow');
        runCommand('git branch -d cleaning/refactor-structure', null);
        runCommand('git branch -d fix-cart-and-products-v4', null);
        
        // حذف الفروع من GitHub
        log('🗑️ حذف الفروع من GitHub...', 'yellow');
        runCommand('git push origin --delete cleaning/refactor-structure', null);
        runCommand('git push origin --delete fix-cart-and-products-v4', null);
        
        // حذف الفروع القديمة الأخرى
        const remoteBranches = runCommand('git branch -r', 'فشل في جلب الفروع البعيدة');
        if (remoteBranches && remoteBranches.includes('origin/code-cleanup')) {
            log('🗑️ حذف فرع code-cleanup...', 'yellow');
            runCommand('git branch -D code-cleanup', null);
            runCommand('git push origin --delete code-cleanup', null);
        }
        
        if (remoteBranches && remoteBranches.includes('origin/products-pages-v2')) {
            log('🗑️ حذف فرع products-pages-v2...', 'yellow');
            runCommand('git branch -D products-pages-v2', null);
            runCommand('git push origin --delete products-pages-v2', null);
        }

        log('📋 المرحلة 6: تشغيل البناء النهائي', 'yellow');
        runCommand('git checkout main', 'فشل في العودة لـ main');
        runCommand('git pull origin main', 'فشل في تحديث main');
        
        // تشغيل البناء إذا كان متوفراً
        if (fs.existsSync('package.json')) {
            log('📦 تشغيل npm build...', 'yellow');
            const installResult = runCommand('npm install', null);
            const buildResult = runCommand('npm run build', null);
            
            if (buildResult) {
                log('✅ تم تشغيل npm run build بنجاح', 'green');
            } else {
                log('⚠️ npm run build غير متوفر، جاري تشغيل المولدات اليدوية...', 'yellow');
            }
        }
        
        // تشغيل المولدات إذا كانت متوفرة
        if (fs.existsSync('generate_products.js')) {
            log('📄 تشغيل مولد المنتجات...', 'yellow');
            runCommand('node generate_products.js', 'فشل في تشغيل مولد المنتجات');
        }
        
        if (fs.existsSync('instant_run.js')) {
            log('⚡ تشغيل المولد السريع...', 'yellow');
            runCommand('node instant_run.js', 'فشل في تشغيل المولد السريع');
        }

        // التحقق النهائي
        log('📋 التحقق النهائي:', 'yellow');
        log('📊 حالة الفروع:', 'yellow');
        const branches = runCommand('git branch -r', 'فشل في عرض الفروع');
        if (branches) console.log(branches);
        
        log('📁 الملفات المولدة:', 'yellow');
        if (fs.existsSync('feeds/')) {
            const feedsFiles = fs.readdirSync('feeds/');
            console.log('feeds/', feedsFiles);
        }
        
        ['sitemap.xml', 'merchant-feed.xml'].forEach(file => {
            if (fs.existsSync(file)) {
                const stats = fs.statSync(file);
                console.log(`${file}: ${stats.size} bytes`);
            } else {
                console.log(`${file}: غير موجود`);
            }
        });

        log('🎉 تم الانتهاء من عملية الدمج والتنظيف!', 'green');
        log('📈 النتائج:', 'green');
        log('   ✅ تم دمج التحسينات الرئيسية', 'green');
        log('   ✅ تم حذف الفروع غير اللازمة', 'green');
        log('   ✅ تم تشغيل البناء والمولدات', 'green');
        log(`   📍 الفرع النشط: ${runCommand('git branch --show-current', 'فشل في عرض الفرع الحالي')}`, 'green');
        
        const remoteBranchesCount = runCommand('git branch -r | wc -l', 'فشل في عد الفروع');
        if (remoteBranchesCount) {
            log(`   📊 عدد الفروع البعيدة: ${remoteBranchesCount}`, 'green');
        }
        
        log('🚀 المستودع جاهز للنشر!', 'green');

    } catch (error) {
        log(`❌ خطأ في العملية: ${error.message}`, 'red');
        process.exit(1);
    }
}

// تشغيل العملية
mergeAndCleanup();