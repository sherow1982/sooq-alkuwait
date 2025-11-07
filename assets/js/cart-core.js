// Cart functionality for Kuwait Modern Theme
class KuwaitCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('kuwait-cart') || '[]');
        this.updateCartCount();
    }
    
    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.save();
        this.updateCartCount();
        this.showNotification(`تم إضافة ${product.title} للسلة`);
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartCount();
    }
    
    save() {
        localStorage.setItem('kuwait-cart', JSON.stringify(this.items));
    }
    
    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadge = document.getElementById('cart-count');
        if (cartBadge) cartBadge.textContent = count;
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white; padding: 15px 20px; border-radius: 10px;
            box-shadow: 0 6px 20px rgba(39,174,96,0.4);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
}

window.kuwaitCart = new KuwaitCart();