// Kuwait Modern Theme Countdown System
class KuwaitCountdown {
    constructor() {
        this.updateAllTimers();
        setInterval(() => this.updateAllTimers(), 1000);
    }
    
    updateAllTimers() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24*60*60*1000);
        tomorrow.setHours(0,0,0,0);
        
        const diff = tomorrow - now;
        
        if (diff > 0) {
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // تحديث جميع العدادات في الموقع
            const timerSelectors = ['#heroTimer', '#main-countdown', '[id^="timer-"]'];
            timerSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(timer => {
                    if (selector === '[id^="timer-"]') {
                        timer.innerHTML = `⏰ العرض ينتهي خلال: ${timeString}`;
                    } else {
                        timer.textContent = timeString;
                    }
                });
            });
        }
    }
}

// تشغيل العداد عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new KuwaitCountdown();
});