// Menu data
const menuData = {
    pizza: [
        {
            name: 'Margherita Classic',
            description: 'Fresh mozzarella, tomato sauce, basil, extra virgin olive oil',
            price: '$16.99',
            image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: '15-20 min'
        },
        {
            name: 'Pepperoni Supreme',
            description: 'Premium pepperoni, mozzarella cheese, tomato sauce',
            price: '$19.99',
            image: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: true,
            time: '15-20 min'
        },
        {
            name: 'Quattro Stagioni',
            description: 'Ham, mushrooms, olives, artichokes, mozzarella',
            price: '$22.99',
            image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: '20-25 min'
        },
        {
            name: 'Spicy Diavola',
            description: 'Spicy salami, chili peppers, mozzarella, tomato sauce',
            price: '$20.99',
            image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: true,
            time: '15-20 min'
        }
    ],
    appetizers: [
        {
            name: 'Bruschetta Trio',
            description: 'Three varieties: classic tomato, olive tapenade, goat cheese',
            price: '$12.99',
            image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: '10-15 min'
        },
        {
            name: 'Antipasto Platter',
            description: 'Cured meats, cheeses, olives, roasted vegetables',
            price: '$18.99',
            image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: '5-10 min'
        }
    ],
    beverages: [
        {
            name: 'Italian Soda',
            description: 'San Pellegrino - Orange, Lemon, or Blood Orange',
            price: '$3.99',
            image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: 'Instant'
        },
        {
            name: 'Fresh Lemonade',
            description: 'House-made with fresh lemons and mint',
            price: '$4.99',
            image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: 'Instant'
        }
    ],
    desserts: [
        {
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee and mascarpone',
            price: '$8.99',
            image: 'https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: '5 min'
        },
        {
            name: 'Cannoli Siciliani',
            description: 'Crispy shells filled with sweet ricotta and chocolate chips',
            price: '$7.99',
            image: 'https://images.pexels.com/photos/8969289/pexels-photo-8969289.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            spicy: false,
            time: '5 min'
        }
    ]
};

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuItemsContainer = document.getElementById('menu-items');
const categoryButtons = document.querySelectorAll('.category-btn');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 1 second
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000);

    // Initialize menu with pizza category if on main page
    if (menuItemsContainer) {
        displayMenuItems('pizza');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Update cart count on page load
    updateCartCount();
});

// Setup all event listeners
function setupEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Category buttons
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            switchCategory(category);
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// Handle scroll effects
function handleScroll() {
    const scrolled = window.scrollY > 50;
    if (header) {
        header.classList.toggle('scrolled', scrolled);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
    hamburgers.forEach((line, index) => {
        if (mobileMenu.classList.contains('active')) {
            if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) line.style.opacity = '0';
            if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            line.style.transform = 'none';
            line.style.opacity = '1';
        }
    });
}

// Switch menu category
function switchCategory(category) {
    // Update active button
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Display menu items for selected category
    displayMenuItems(category);
}

// Display menu items
function displayMenuItems(category) {
    if (!menuItemsContainer) return;
    
    const items = menuData[category] || [];
    
    menuItemsContainer.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="menu-item-badges">
                    ${item.spicy ? `
                        <span class="badge spicy">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                            </svg>
                            Spicy
                        </span>
                    ` : ''}
                    <span class="badge time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        ${item.time}
                    </span>
                </div>
            </div>
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">${item.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart('${item.name}', '${item.price}', '${item.image}', '${item.description}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add animation delay to items
    const menuItems = menuItemsContainer.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Add to cart function
function addToCart(itemName, price, image = '', description = '') {
    // Get or create cart from localStorage
    let cart = JSON.parse(localStorage.getItem('alqady-pizza-cart') || '[]');
    
    // Check if item already exists
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: price,
            image: image || 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            description: description || 'Delicious pizza made with fresh ingredients',
            quantity: 1,
            id: Date.now() + Math.random()
        });
    }
    
    // Save to localStorage
    localStorage.setItem('alqady-pizza-cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${itemName} added to cart!`);
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;
    
    const cart = JSON.parse(localStorage.getItem('alqady-pizza-cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature, .contact-item, .menu-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Smooth reveal animations for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (sectionTop < windowHeight - revealPoint) {
            section.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealSections);
revealSections(); // Initial check

// Add CSS for section reveals
const style = document.createElement('style');
style.textContent = `
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero {
        opacity: 1;
        transform: none;
    }
`;
document.head.appendChild(style);