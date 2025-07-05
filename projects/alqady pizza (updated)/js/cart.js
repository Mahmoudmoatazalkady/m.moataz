// Cart functionality
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.deliveryFee = 3.99;
        this.taxRate = 0.08;
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
        this.loadRecommendedItems();
        
        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1000);
    }

    setupEventListeners() {
        // Clear cart button
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Promo code
        const applyPromoBtn = document.getElementById('apply-promo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                this.animateHamburger(mobileMenuBtn, mobileMenu.classList.contains('active'));
            });
        }

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (header) {
                header.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
    }

    animateHamburger(btn, isActive) {
        const hamburgers = btn.querySelectorAll('.hamburger');
        hamburgers.forEach((line, index) => {
            if (isActive) {
                if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) line.style.opacity = '0';
                if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                line.style.transform = 'none';
                line.style.opacity = '1';
            }
        });
    }

    loadCart() {
        const savedCart = localStorage.getItem('alqady-pizza-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('alqady-pizza-cart', JSON.stringify(this.cart));
    }

    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.name === item.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1,
                id: Date.now() + Math.random()
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification(item.name);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartContent = document.getElementById('cart-content');
        const emptyCart = document.getElementById('empty-cart');
        const cartCount = document.getElementById('cart-count');
        const recommendedSection = document.getElementById('recommended-section');

        // Update cart count
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        if (this.cart.length === 0) {
            // Show empty cart state
            if (cartContent) cartContent.classList.add('hidden');
            if (emptyCart) emptyCart.classList.remove('hidden');
            if (recommendedSection) recommendedSection.classList.add('hidden');
            return;
        }

        // Show cart content
        if (cartContent) cartContent.classList.remove('hidden');
        if (emptyCart) emptyCart.classList.add('hidden');
        if (recommendedSection) recommendedSection.classList.remove('hidden');

        // Render cart items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <h3 class="cart-item-name">${item.name}</h3>
                            <button class="remove-item-btn" onclick="cartManager.removeFromCart(${item.id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18"/>
                                    <path d="M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <p class="cart-item-description">${item.description}</p>
                        <div class="cart-item-footer">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <span class="cart-item-price">$${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Update summary
        this.updateOrderSummary();
    }

    updateOrderSummary() {
        const subtotal = this.cart.reduce((sum, item) => {
            return sum + (parseFloat(item.price.replace('$', '')) * item.quantity);
        }, 0);

        const tax = subtotal * this.taxRate;
        const total = subtotal + this.deliveryFee + tax;

        // Update DOM elements
        const subtotalEl = document.getElementById('subtotal');
        const deliveryFeeEl = document.getElementById('delivery-fee');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkout');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (deliveryFeeEl) deliveryFeeEl.textContent = `$${this.deliveryFee.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

        // Enable/disable checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promo-input');
        if (!promoInput) return;

        const promoCode = promoInput.value.trim().toUpperCase();
        
        // Simple promo code logic (in real app, this would be server-side)
        const validCodes = {
            'PIZZA10': 0.10,
            'WELCOME20': 0.20,
            'STUDENT15': 0.15
        };

        if (validCodes[promoCode]) {
            const discount = validCodes[promoCode];
            this.showNotification(`Promo code applied! ${(discount * 100)}% discount`, 'success');
            promoInput.value = '';
            // In a real app, you'd apply the discount to the total
        } else if (promoCode) {
            this.showNotification('Invalid promo code', 'error');
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) return;

        const checkoutBtn = document.getElementById('checkout');
        if (checkoutBtn) {
            checkoutBtn.classList.add('loading');
            checkoutBtn.disabled = true;
        }

        // Simulate checkout process
        setTimeout(() => {
            this.showNotification('Redirecting to checkout...', 'success');
            
            // In a real app, you'd redirect to a payment processor
            setTimeout(() => {
                alert('Thank you for your order! This is a demo - no actual payment was processed.');
                if (checkoutBtn) {
                    checkoutBtn.classList.remove('loading');
                    checkoutBtn.disabled = false;
                }
            }, 2000);
        }, 1500);
    }

    loadRecommendedItems() {
        const recommendedContainer = document.getElementById('recommended-items');
        if (!recommendedContainer) return;

        // Sample recommended items (in real app, this would come from an API)
        const recommendedItems = [
            {
                name: 'Garlic Bread',
                price: '$6.99',
                image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                description: 'Crispy garlic bread with herbs'
            },
            {
                name: 'Caesar Salad',
                price: '$9.99',
                image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                description: 'Fresh romaine with parmesan and croutons'
            },
            {
                name: 'Chocolate Cake',
                price: '$7.99',
                image: 'https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                description: 'Rich chocolate cake with ganache'
            }
        ];

        recommendedContainer.innerHTML = recommendedItems.map(item => `
            <div class="recommended-item">
                <div class="recommended-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="recommended-item-content">
                    <h3 class="recommended-item-name">${item.name}</h3>
                    <p class="recommended-item-price">${item.price}</p>
                    <button class="add-recommended-btn" onclick="cartManager.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    showAddToCartNotification(itemName) {
        this.showNotification(`${itemName} added to cart!`, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '25px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Global function to add items to cart (called from other pages)
window.addToCart = function(itemName, price, image = '', description = '') {
    if (!window.cartManager) {
        window.cartManager = new CartManager();
    }
    
    const item = {
        name: itemName,
        price: price,
        image: image || 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        description: description || 'Delicious pizza made with fresh ingredients'
    };
    
    window.cartManager.addToCart(item);
};