/**
 * عداد تنازلي احترافي مبهر - سوق الكويت
 */
class CountdownTimer {
    constructor() {
        this.timers = new Map();
        this.addStyles();
    }

    // عداد يومي متجدد
    startDaily(selector, config = {}) {
        const element = document.querySelector(selector);
        if (!element) return null;
        
        const update = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow - now;
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            element.textContent = display;
            
            // تأثير مرئي عند اقتراب النهاية
            if (timeLeft < 3600000) {
                element.classList.add('urgent');
            } else {
                element.classList.remove('urgent');
            }
            
            if (config.onUpdate) config.onUpdate({ hours, minutes, seconds });
        };
        
        const id = Date.now().toString();
        const interval = setInterval(update, 1000);
        update(); // تحديث فوري
        
        this.timers.set(id, { interval, element });
        return id;
    }

    // عداد بفترة زمنية محددة
    startDuration(selector, minutes, config = {}) {
        const element = document.querySelector(selector);
        if (!element) return null;
        
        const endTime = Date.now() + (minutes * 60 * 1000);
        
        const update = () => {
            const timeLeft = endTime - Date.now();
            
            if (timeLeft <= 0) {
                element.textContent = '00:00:00';
                element.classList.add('expired');
                this.stop(id);
                if (config.onComplete) config.onComplete();
                return;
            }
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            element.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            if (timeLeft < 300000) element.classList.add('urgent');
        };
        
        const id = Date.now().toString();
        const interval = setInterval(update, 1000);
        update();
        
        this.timers.set(id, { interval, element });
        return id;
    }

    // إيقاف عداد
    stop(id) {
        const timer = this.timers.get(id);
        if (timer) {
            clearInterval(timer.interval);
            this.timers.delete(id);
        }
    }

    // إضافة أنماط CSS مبهرة
    addStyles() {
        if (document.getElementById('countdown-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'countdown-styles';
        style.textContent = `
            .countdown-timer {
                font-family: 'Courier New', monospace;
                font-weight: 900;
                font-size: 1.8rem;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                letter-spacing: 2px;
                transition: all 0.3s ease;
                filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
            }
            
            .countdown-timer.urgent {
                animation: countdown-glow 1s infinite alternate;
                transform: scale(1.05);
            }
            
            .countdown-timer.expired {
                background: linear-gradient(45deg, #666, #999);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                opacity: 0.6;
            }
            
            @keyframes countdown-glow {
                0% {
                    filter: drop-shadow(0 0 5px #ff0000) drop-shadow(0 0 10px #ff0000);
                    text-shadow: 0 0 20px #ff0000;
                }
                100% {
                    filter: drop-shadow(0 0 20px #ff0000) drop-shadow(0 0 30px #ff0000);
                    text-shadow: 0 0 40px #ff0000;
                }
            }
            
            .countdown-container {
                background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9));
                border: 2px solid #FFD700;
                border-radius: 15px;
                padding: 1.5rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            
            .countdown-container::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: conic-gradient(from 0deg, transparent, #FFD700, transparent);
                animation: countdown-spin 3s linear infinite;
                opacity: 0.1;
            }
            
            @keyframes countdown-spin {
                to { transform: rotate(360deg); }
            }
            
            .countdown-label {
                color: #FFD700;
                font-weight: 700;
                font-size: 1.1rem;
                margin-bottom: 0.5rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// تهيئة عامة
if (typeof window !== 'undefined') {
    window.CountdownTimer = CountdownTimer;
    
    // تشغيل تلقائي عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        const countdown = new CountdownTimer();
        
        // بحث عن عدادات يومية وتشغيلها
        document.querySelectorAll('.daily-countdown, .hero-countdown').forEach(el => {
            countdown.startDaily(`.${el.className.split(' ')[0]}`);
        });
        
        // تصدير عام
        window.countdownManager = countdown;
    });
}