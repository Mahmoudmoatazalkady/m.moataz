// --- Sliding Banner Functionality ---
const heroBanners = [
  {
    image: 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: {
      en: 'Discover Your Signature Style with ALQADY',
      ar: 'اكتشف أسلوبك المميز مع القاضي'
    },
    desc: {
      en: 'Explore our curated collection of premium fashion, designed for elegance and comfort.',
      ar: 'استكشف مجموعتنا المنسقة من الأزياء الفاخرة، المصممة للأناقة والراحة.'
    },
    cta: {
      en: 'Shop Best Sellers',
      ar: 'تسوق الأكثر مبيعًا'
    },
    ctaLink: '#best-selling'
  },
  {
    image: 'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: {
      en: 'New Arrivals for Summer',
      ar: 'وصل حديثاً لصيف أنيق'
    },
    desc: {
      en: 'Bright colors, light fabrics, and fresh looks for the season.',
      ar: 'ألوان زاهية، أقمشة خفيفة، وإطلالات جديدة لهذا الموسم.'
    },
    cta: {
      en: 'Shop Women',
      ar: 'تسوق النساء'
    },
    ctaLink: 'women.html'
  },
  {
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: {
      en: 'Men’s Premium Collection',
      ar: 'مجموعة الرجال الفاخرة'
    },
    desc: {
      en: 'Sophisticated style for the modern gentleman.',
      ar: 'أسلوب راقي للرجل العصري.'
    },
    cta: {
      en: 'Shop Men',
      ar: 'تسوق الرجال'
    },
    ctaLink: 'men.html'
  }
  // Add more banners here as needed
];

function renderHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  slider.innerHTML = '';
  heroBanners.forEach((banner, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url('${banner.image}')`;
    // No overlay, no text, just the image
    slider.appendChild(slide);
  });
}

let heroCurrent = 0;
let heroInterval = null;

function showHeroSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });
  heroCurrent = idx;
}

function nextHeroSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  showHeroSlide((heroCurrent + 1) % slides.length);
}

function prevHeroSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  showHeroSlide((heroCurrent - 1 + slides.length) % slides.length);
}

function startHeroAutoSlide() {
  if (heroInterval) clearInterval(heroInterval);
  heroInterval = setInterval(nextHeroSlide, 2500);
}

function stopHeroAutoSlide() {
  if (heroInterval) clearInterval(heroInterval);
}

function setupHeroSliderEvents() {
  const left = document.querySelector('.hero-arrow-left');
  const right = document.querySelector('.hero-arrow-right');
  if (left) left.onclick = () => { stopHeroAutoSlide(); prevHeroSlide(); startHeroAutoSlide(); };
  if (right) right.onclick = () => { stopHeroAutoSlide(); nextHeroSlide(); startHeroAutoSlide(); };
}

window.addEventListener('DOMContentLoaded', function() {
  renderHeroSlider();
  setupHeroSliderEvents();
  startHeroAutoSlide();
});
// ALQADY Fashion E-commerce - Enhanced JavaScript with Comprehensive RTL Support

// Global variables
let currentLanguage = localStorage.getItem('alqady_language') || 'en';
let cart = [];
let wishlist = [];
let products = [];
let currentFilter = 'all';
let currentSort = 'featured';
let displayedProducts = 12;
let currentProduct = null;
let selectedOptions = {};

// Enhanced translation object with comprehensive coverage
const translations = {
    en: {
        'form_submitted': 'Message sent successfully!',
        'newsletter_success': 'Successfully subscribed to newsletter!',
        'checkout_success': 'Order placed successfully!',
        'added_to_cart': 'Added to cart!',
        'added_to_wishlist': 'Added to wishlist!',
        'removed_from_cart': 'Removed from cart',
        'removed_from_wishlist': 'Removed from wishlist',
        'moved_to_cart': 'Moved to cart!',
        'select_options': 'Please select all required options',
        'out_of_stock': 'This item is out of stock',
        'payment_processing': 'Processing payment...',
        'order_confirmed': 'Order confirmed! You will receive a confirmation email shortly.',
        'fill_required_fields': 'Please fill in all required fields',
        'invalid_phone': 'Please enter a valid phone number',
        'invalid_email': 'Please enter a valid email address',
        'menu_opened': 'Menu opened',
        'menu_closed': 'Menu closed',
        'loading': 'Loading...',
        'error_occurred': 'An error occurred. Please try again.',
        'item_already_in_wishlist': 'Item already in wishlist',
        'cart_is_empty': 'Cart is empty',
        'wishlist_is_empty': 'Wishlist is empty'
    },
    ar: {
        'form_submitted': 'تم إرسال الرسالة بنجاح!',
        'newsletter_success': 'تم الاشتراك في النشرة الإخبارية بنجاح!',
        'checkout_success': 'تم تأكيد الطلب بنجاح!',
        'added_to_cart': 'تم إضافة المنتج إلى السلة!',
        'added_to_wishlist': 'تم إضافة المنتج إلى المفضلة!',
        'removed_from_cart': 'تم حذف المنتج من السلة',
        'removed_from_wishlist': 'تم حذف المنتج من المفضلة',
        'moved_to_cart': 'تم نقل المنتج إلى السلة!',
        'select_options': 'يرجى اختيار جميع الخيارات المطلوبة',
        'out_of_stock': 'هذا المنتج غير متوفر',
        'payment_processing': 'جاري معالجة الدفع...',
        'order_confirmed': 'تم تأكيد الطلب! ستتلقى رسالة تأكيد بالبريد الإلكتروني قريباً.',
        'fill_required_fields': 'يرجى ملء جميع الحقول المطلوبة',
        'invalid_phone': 'يرجى إدخال رقم هاتف صحيح',
        'invalid_email': 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        'menu_opened': 'تم فتح القائمة',
        'menu_closed': 'تم إغلاق القائمة',
        'loading': 'جاري التحميل...',
        'error_occurred': 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        'item_already_in_wishlist': 'المنتج موجود بالفعل في المفضلة',
        'cart_is_empty': 'السلة فارغة',
        'wishlist_is_empty': 'قائمة المفضلة فارغة'
    }
};

// Enhanced sample products data with better RTL support
const sampleProducts = [
    {
        id: 1,
        name: "Elegant Evening Dress",
        nameAr: "فستان سهرة أنيق",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=400",
        images: [
            "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400"
        ],
        category: "dresses",
        categories: ["women", "dresses"],
        description: "A stunning evening dress perfect for special occasions.",
        descriptionAr: "فستان سهرة رائع مثالي للمناسبات الخاصة.",
        rating: 4.8,
        reviewCount: 124,
        stock: 15,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["#000000", "#000080", "#800020"],
        colorNames: ["Black", "Navy", "Burgundy"],
        colorNamesAr: ["أسود", "كحلي", "عنابي"],
        materials: ["Silk", "Polyester"],
        materialsAr: ["حرير", "بوليستر"],
        isNew: true,
        isOnSale: true
    },
    {
        id: 2,
        name: "Classic Business Suit",
        nameAr: "بدلة عمل كلاسيكية",
        price: 599.99,
        image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
        images: [
            "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400"
        ],
        category: "suits",
        categories: ["men", "suits"],
        description: "Professional business suit for the modern gentleman.",
        descriptionAr: "بدلة عمل احترافية للرجل العصري.",
        rating: 4.6,
        reviewCount: 89,
        stock: 8,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["#36454F", "#000080", "#000000"],
        colorNames: ["Charcoal", "Navy", "Black"],
        colorNamesAr: ["فحمي", "كحلي", "أسود"],
        materials: ["Wool", "Cotton"],
        materialsAr: ["صوف", "قطن"],
        isNew: false,
        isOnSale: false
    },
    {
        id: 3,
        name: "Kids Colorful T-Shirt",
        nameAr: "تيشيرت ملون للأطفال",
        price: 29.99,
        image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
        images: [
            "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400"
        ],
        category: "tops",
        categories: ["kids", "tops"],
        description: "Comfortable and fun t-shirt for active kids.",
        descriptionAr: "تيشيرت مريح وممتع للأطفال النشطين.",
        rating: 4.9,
        reviewCount: 156,
        stock: 25,
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["#FF0000", "#0000FF", "#008000", "#FFFF00"],
        colorNames: ["Red", "Blue", "Green", "Yellow"],
        colorNamesAr: ["أحمر", "أزرق", "أخضر", "أصفر"],
        materials: ["Cotton"],
        materialsAr: ["قطن"],
        isNew: true,
        isOnSale: false
    },
    {
        id: 4,
        name: "Casual Chic Blouse",
        nameAr: "بلوزة شيك كاجوال",
        price: 89.99,
        image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400",
        images: [
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400"
        ],
        category: "tops",
        categories: ["women", "tops"],
        description: "Versatile blouse perfect for work or casual outings.",
        descriptionAr: "بلوزة متعددة الاستخدامات مثالية للعمل أو النزهات.",
        rating: 4.4,
        reviewCount: 67,
        stock: 12,
        sizes: ["XS", "S", "M", "L"],
        colors: ["#FFFFFF", "#F5F5DC", "#ADD8E6"],
        colorNames: ["White", "Cream", "Light Blue"],
        colorNamesAr: ["أبيض", "كريمي", "أزرق فاتح"],
        materials: ["Cotton", "Polyester"],
        materialsAr: ["قطن", "بوليستر"],
        isNew: false,
        isOnSale: true
    },
    {
        id: 5,
        name: "Designer Handbag",
        nameAr: "حقيبة يد مصممة",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=400",
        images: [
            "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=400"
        ],
        category: "accessories",
        categories: ["women", "accessories"],
        description: "Elegant designer handbag for the sophisticated woman.",
        descriptionAr: "حقيبة يد مصممة أنيقة للمرأة الراقية.",
        rating: 4.7,
        reviewCount: 203,
        stock: 6,
        sizes: [],
        colors: ["#000000", "#8B4513", "#D2B48C"],
        colorNames: ["Black", "Brown", "Tan"],
        colorNamesAr: ["أسود", "بني", "بيج"],
        materials: ["Leather"],
        materialsAr: ["جلد"],
        isNew: false,
        isOnSale: true
    }
];

// Initialize products
products = sampleProducts;

// Enhanced translation function
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Enhanced validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Enhanced language switching with comprehensive RTL support
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('alqady_language', lang);
    
    // Update HTML attributes for proper RTL support
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update body class for additional styling hooks
    document.body.classList.toggle('rtl', lang === 'ar');
    
    // Update active language button for both desktop and mobile
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        const key = lang === 'ar' ? 'data-ar' : 'data-en';
        if (element.hasAttribute(key)) {
            element.textContent = element.getAttribute(key);
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach(element => {
        const key = lang === 'ar' ? 'data-ar-placeholder' : 'data-en-placeholder';
        if (element.hasAttribute(key)) {
            element.placeholder = element.getAttribute(key);
        }
    });
    
    // Update select options
    document.querySelectorAll('select option[data-en]').forEach(option => {
        const key = lang === 'ar' ? 'data-ar' : 'data-en';
        if (option.hasAttribute(key)) {
            option.textContent = option.getAttribute(key);
        }
    });
    
    // Re-render products and hero slider to update language
    renderProducts();
    renderBestSellingProducts();
    renderHeroSlider();
    
    // Announce language change to screen readers
    announceToScreenReader(lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English');
}

// Screen reader announcement function
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Enhanced modal functions with accessibility
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Update cart/wishlist content when opening
        if (modalId === 'cartModal') {
            updateCartDisplay();
        } else if (modalId === 'wishlistModal') {
            updateWishlistDisplay();
        }
        
        // Announce modal opening to screen readers
        const modalTitle = modal.querySelector('.modal-header h3');
        if (modalTitle) {
            announceToScreenReader(modalTitle.textContent);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to trigger element if available
        const triggerElement = document.querySelector(`[data-modal-trigger="${modalId}"]`);
        if (triggerElement) {
            triggerElement.focus();
        }
        
        // Clean up dynamic modals
        if (modalId === 'orderConfirmationModal' && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }
}

// Enhanced toast notifications with RTL support
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove toast after 4 seconds (increased for better accessibility)
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Enhanced loading functions with accessibility
function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
        spinner.setAttribute('aria-label', t('loading'));
        announceToScreenReader(t('loading'));
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Product filtering and sorting
function getFilteredProducts() {
    let filtered = products;
    
    // Filter by current page if set
    if (window.currentPage) {
        filtered = filtered.filter(product => 
            product.categories.includes(window.currentPage)
        );
    }
    
    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(product => 
            product.category === currentFilter || 
            product.categories.includes(currentFilter)
        );
    }
    
    // Sort products
    switch (currentSort) {
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        default: // featured
            // Keep original order
            break;
    }
    
    return filtered;
}

// Enhanced render products with better RTL support
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const filteredProducts = getFilteredProducts();
    const productsToShow = filteredProducts.slice(0, displayedProducts);
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>${currentLanguage === 'ar' ? 'لا توجد منتجات متاحة' : 'No products available'}</p>
            </div>
        `;
        return;
    }
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;
        productCard.setAttribute('role', 'article');
        productCard.setAttribute('aria-label', currentLanguage === 'ar' ? product.nameAr : product.name);
        const productName = currentLanguage === 'ar' ? product.nameAr : product.name;
        const stockText = product.stock > 10 ? 
            (currentLanguage === 'ar' ? 'متوفر' : 'In Stock') : 
            product.stock > 0 ? 
            (currentLanguage === 'ar' ? 'كمية محدودة' : 'Low Stock') : 
            (currentLanguage === 'ar' ? 'غير متوفر' : 'Out of Stock');
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${productName}" loading="lazy">
                <div class="product-badges">
                    ${product.isNew ? `<span class="badge new">${currentLanguage === 'ar' ? 'جديد' : 'New'}</span>` : ''}
                    ${product.isOnSale ? `<span class="badge sale">${currentLanguage === 'ar' ? 'تخفيض' : 'Sale'}</span>` : ''}
                </div>
                <div class="product-overlay">
                    <button class="btn btn-primary quick-view-btn" data-product-id="${product.id}" aria-label="${currentLanguage === 'ar' ? 'عرض سريع لـ' : 'Quick view for'} ${productName}">
                        ${currentLanguage === 'ar' ? 'عرض سريع' : 'Quick View'}
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${productName}</h3>
                <div class="product-rating" aria-label="${currentLanguage === 'ar' ? 'تقييم' : 'Rating'} ${product.rating} ${currentLanguage === 'ar' ? 'من 5' : 'out of 5'}">
                    <div class="stars" aria-hidden="true">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="original-price" aria-label="${currentLanguage === 'ar' ? 'السعر الأصلي' : 'Original price'}">ج.م${product.originalPrice}</span>` : ''}
                    <span class="current-price" aria-label="${currentLanguage === 'ar' ? 'السعر الحالي' : 'Current price'}">ج.م${product.price}</span>
                </div>
                <div class="stock-status ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}" aria-label="${currentLanguage === 'ar' ? 'حالة المخزون' : 'Stock status'}">
                    ${stockText}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''} aria-label="${currentLanguage === 'ar' ? 'أضف إلى السلة' : 'Add to cart'} ${productName}">
                        ${currentLanguage === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                    </button>
                    <button class="btn btn-secondary add-to-wishlist-btn" data-product-id="${product.id}" aria-label="${currentLanguage === 'ar' ? 'أضف إلى المفضلة' : 'Add to wishlist'} ${productName}">
                        ♡
                    </button>
                </div>
            </div>
        `;
        fragment.appendChild(productCard);
    });
    
    productsGrid.innerHTML = '';
    productsGrid.appendChild(fragment);
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedProducts >= filteredProducts.length ? 'none' : 'block';
    }
}

// Render best selling products (top 4 by rating and review count)
function renderBestSellingProducts() {
    const bestSellingGrid = document.getElementById('bestSellingGrid');
    if (!bestSellingGrid) return;
    // Sort by rating * reviewCount for best sellers
    const bestSellers = [...products]
        .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
        .slice(0, 4);
    const fragment = document.createDocumentFragment();
    bestSellers.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;
        const productName = currentLanguage === 'ar' ? product.nameAr : product.name;
        const stockText = product.stock > 10 ? 
            (currentLanguage === 'ar' ? 'متوفر' : 'In Stock') : 
            product.stock > 0 ? 
            (currentLanguage === 'ar' ? 'كمية محدودة' : 'Low Stock') : 
            (currentLanguage === 'ar' ? 'غير متوفر' : 'Out of Stock');
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${productName}" loading="lazy">
                <div class="product-badges">
                    ${product.isNew ? `<span class="badge new">${currentLanguage === 'ar' ? 'جديد' : 'New'}</span>` : ''}
                    ${product.isOnSale ? `<span class="badge sale">${currentLanguage === 'ar' ? 'تخفيض' : 'Sale'}</span>` : ''}
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${productName}</h3>
                <div class="product-rating">
                    <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="original-price">ج.م${product.originalPrice}</span>` : ''}
                    <span class="current-price">ج.م${product.price}</span>
                </div>
                <div class="stock-status ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
                    ${stockText}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>${currentLanguage === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}</button>
                    <button class="btn btn-secondary add-to-wishlist-btn" data-product-id="${product.id}">♡</button>
                </div>
            </div>
        `;
        fragment.appendChild(productCard);
    });
    bestSellingGrid.innerHTML = '';
    bestSellingGrid.appendChild(fragment);
}

// Event delegation for best selling section
function setupBestSellingEvents() {
    const bestSellingGrid = document.getElementById('bestSellingGrid');
    if (!bestSellingGrid) return;
    bestSellingGrid.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const productId = btn.getAttribute('data-product-id');
        if (btn.classList.contains('add-to-cart-btn')) {
            addToCart(productId);
        } else if (btn.classList.contains('add-to-wishlist-btn')) {
            addToWishlist(productId);
        }
    });
}

// Call on DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {
    renderBestSellingProducts();
    setupBestSellingEvents();
});

// Enhanced cart functions with better error handling
function addToCart(productId, options = {}) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        showToast(t('error_occurred'), 'error');
        return;
    }
    
    if (product.stock === 0) {
        showToast(t('out_of_stock'), 'error');
        return;
    }
    
    // Check if required options are selected
    const requiredOptions = [];
    if (product.sizes && product.sizes.length > 0) requiredOptions.push('size');
    if (product.colors && product.colors.length > 0) requiredOptions.push('color');
    
    for (const option of requiredOptions) {
        if (!options[option]) {
            showToast(t('select_options'), 'warning');
            return;
        }
    }
    
    const existingItem = cart.find(item => 
        item.id === product.id && 
        JSON.stringify(item.options) === JSON.stringify(options)
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            image: product.image,
            options: options,
            quantity: 1
        });
    }
    
    updateCartStorage();
    updateCartDisplay();
    showToast(t('added_to_cart'), 'success');
}

function removeFromCart(productId, options = {}) {
    cart = cart.filter(item => 
        !(item.id === parseInt(productId) && 
          JSON.stringify(item.options) === JSON.stringify(options))
    );
    updateCartStorage();
    updateCartDisplay();
    showToast(t('removed_from_cart'), 'info');
}

function updateCartQuantity(productId, options, newQuantity) {
    const item = cart.find(item => 
        item.id === parseInt(productId) && 
        JSON.stringify(item.options) === JSON.stringify(options)
    );
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, options);
        } else {
            item.quantity = newQuantity;
            updateCartStorage();
            updateCartDisplay();
        }
    }
}

function updateCartStorage() {
    localStorage.setItem('alqady_cart', JSON.stringify(cart));
}

// Enhanced cart display with better accessibility
function updateCartDisplay() {
    // Update cart count
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.setAttribute('aria-label', `${totalItems} ${currentLanguage === 'ar' ? 'عنصر في السلة' : 'items in cart'}`);
    }
    
    // Update cart modal content
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        if (cartItems) cartItems.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (cartItems) cartItems.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => {
        const itemName = currentLanguage === 'ar' ? item.nameAr : item.name;
        const optionsText = Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(', ');
        
        return `
            <div class="cart-item" role="article" aria-label="${itemName}">
                <img src="${item.image}" alt="${itemName}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${itemName}</h4>
                    <div class="cart-item-options">${optionsText}</div>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="quantity-controls" role="group" aria-label="${currentLanguage === 'ar' ? 'تحكم في الكمية' : 'Quantity controls'}">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${JSON.stringify(item.options).replace(/"/g, '&quot;')}, ${item.quantity - 1})" aria-label="${currentLanguage === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}">-</button>
                        <span class="quantity" aria-label="${currentLanguage === 'ar' ? 'الكمية' : 'Quantity'}">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${JSON.stringify(item.options).replace(/"/g, '&quot;')}, ${item.quantity + 1})" aria-label="${currentLanguage === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id}, ${JSON.stringify(item.options).replace(/"/g, '&quot;')})" aria-label="${currentLanguage === 'ar' ? 'حذف' : 'Remove'} ${itemName}">×</button>
            </div>
        `;
    }).join('');
    
    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartShipping) cartShipping.textContent = `$${shipping.toFixed(2)}`;
    if (cartTax) cartTax.textContent = `$${tax.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Enhanced wishlist functions
function addToWishlist(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        showToast(t('error_occurred'), 'error');
        return;
    }
    
    const existingItem = wishlist.find(item => item.id === product.id);
    if (existingItem) {
        showToast(t('item_already_in_wishlist'), 'info');
        return;
    }
    
    wishlist.push({
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        image: product.image
    });
    
    updateWishlistStorage();
    updateWishlistDisplay();
    showToast(t('added_to_wishlist'), 'success');
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== parseInt(productId));
    updateWishlistStorage();
    updateWishlistDisplay();
    showToast(t('removed_from_wishlist'), 'info');
}

function moveToCartFromWishlist(productId) {
    addToCart(productId);
    removeFromWishlist(productId);
    showToast(t('moved_to_cart'), 'success');
}

function updateWishlistStorage() {
    localStorage.setItem('alqady_wishlist', JSON.stringify(wishlist));
}

// Enhanced wishlist display with accessibility
function updateWishlistDisplay() {
    // Update wishlist count
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.setAttribute('aria-label', `${wishlist.length} ${currentLanguage === 'ar' ? 'عنصر في المفضلة' : 'items in wishlist'}`);
    }
    
    // Update wishlist modal content
    const wishlistItems = document.getElementById('wishlistItems');
    const emptyWishlist = document.getElementById('emptyWishlist');
    
    if (!wishlistItems) return;
    
    if (wishlist.length === 0) {
        if (wishlistItems) wishlistItems.style.display = 'none';
        if (emptyWishlist) emptyWishlist.style.display = 'block';
        return;
    }
    
    if (wishlistItems) wishlistItems.style.display = 'block';
    if (emptyWishlist) emptyWishlist.style.display = 'none';
    
    wishlistItems.innerHTML = wishlist.map(item => {
        const itemName = currentLanguage === 'ar' ? item.nameAr : item.name;
        
        return `
            <div class="wishlist-item" role="article" aria-label="${itemName}">
                <img src="${item.image}" alt="${itemName}" class="wishlist-item-image">
                <div class="wishlist-item-details">
                    <h4 class="wishlist-item-name">${itemName}</h4>
                    <p class="wishlist-item-price">$${item.price}</p>
                    <button class="btn btn-primary btn-sm" onclick="moveToCartFromWishlist(${item.id})" aria-label="${currentLanguage === 'ar' ? 'نقل إلى السلة' : 'Move to cart'} ${itemName}">
                        ${currentLanguage === 'ar' ? 'نقل إلى السلة' : 'Move to Cart'}
                    </button>
                </div>
                <button class="remove-btn" onclick="removeFromWishlist(${item.id})" aria-label="${currentLanguage === 'ar' ? 'حذف' : 'Remove'} ${itemName}">×</button>
            </div>
        `;
    }).join('');
}

// Enhanced product modal with RTL support
function openProductModal(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    currentProduct = product;
    selectedOptions = {};
    
    // Update modal content
    const modalTitle = document.getElementById('productModalTitle');
    const modalImage = document.getElementById('productModalMainImage');
    const modalPrice = document.getElementById('productModalPrice');
    const modalStars = document.getElementById('productModalStars');
    const modalRatingText = document.getElementById('productModalRatingText');
    const modalDescription = document.getElementById('productModalDescription');
    const modalStockStatus = document.getElementById('productModalStockStatus');
    
    const productName = currentLanguage === 'ar' ? product.nameAr : product.name;
    const productDescription = currentLanguage === 'ar' ? product.descriptionAr : product.description;
    
    if (modalTitle) modalTitle.textContent = productName;
    if (modalImage) {
        modalImage.src = product.image;
        modalImage.alt = productName;
    }
    if (modalPrice) modalPrice.textContent = `$${product.price}`;
    if (modalStars) {
        modalStars.innerHTML = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        modalStars.setAttribute('aria-label', `${currentLanguage === 'ar' ? 'تقييم' : 'Rating'} ${product.rating} ${currentLanguage === 'ar' ? 'من 5' : 'out of 5'}`);
    }
    if (modalRatingText) modalRatingText.textContent = `(${product.reviewCount} ${currentLanguage === 'ar' ? 'تقييم' : 'Reviews'})`;
    if (modalDescription) modalDescription.textContent = productDescription;
    
    if (modalStockStatus) {
        const stockText = product.stock > 10 ? 
            (currentLanguage === 'ar' ? 'متوفر' : 'In Stock') : 
            product.stock > 0 ? 
            (currentLanguage === 'ar' ? 'كمية محدودة' : 'Low Stock') : 
            (currentLanguage === 'ar' ? 'غير متوفر' : 'Out of Stock');
        
        modalStockStatus.textContent = stockText;
        modalStockStatus.className = `stock-status ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`;
    }
    
    // Update options
    updateProductOptions(product);
    
    openModal('productModal');
}

// Enhanced product options with RTL support
function updateProductOptions(product) {
    // Size options
    const sizeGroup = document.getElementById('sizeOptionGroup');
    const sizeOptions = document.getElementById('productModalSizes');
    if (sizeGroup && sizeOptions) {
        if (product.sizes && product.sizes.length > 0) {
            sizeGroup.style.display = 'block';
            sizeOptions.innerHTML = product.sizes.map(size => 
                `<button class="option-btn size-option" data-value="${size}" aria-label="${currentLanguage === 'ar' ? 'مقاس' : 'Size'} ${size}">${size}</button>`
            ).join('');
        } else {
            sizeGroup.style.display = 'none';
        }
    }
    
    // Color options with RTL support
    const colorGroup = document.getElementById('colorOptionGroup');
    const colorOptions = document.getElementById('productModalColors');
    if (colorGroup && colorOptions) {
        if (product.colors && product.colors.length > 0) {
            colorGroup.style.display = 'block';
            const colorNames = currentLanguage === 'ar' ? product.colorNamesAr : product.colorNames;
            colorOptions.innerHTML = product.colors.map((color, index) => 
                `<button class="option-btn color-option" data-value="${colorNames[index]}" style="background-color: ${color}" title="${colorNames[index]}" aria-label="${currentLanguage === 'ar' ? 'لون' : 'Color'} ${colorNames[index]}"></button>`
            ).join('');
        } else {
            colorGroup.style.display = 'none';
        }
    }
    
    // Material options with RTL support
    const materialGroup = document.getElementById('materialOptionGroup');
    const materialOptions = document.getElementById('productModalMaterials');
    if (materialGroup && materialOptions) {
        if (product.materials && product.materials.length > 0) {
            materialGroup.style.display = 'block';
            const materials = currentLanguage === 'ar' ? product.materialsAr : product.materials;
            materialOptions.innerHTML = materials.map(material => 
                `<button class="option-btn material-option" data-value="${material}" aria-label="${currentLanguage === 'ar' ? 'خامة' : 'Material'} ${material}">${material}</button>`
            ).join('');
        } else {
            materialGroup.style.display = 'none';
        }
    }
}

// Enhanced checkout function with validation
// --- Promo Code Logic ---
const promoCodes = {
    'SALE10': 10, // 10% off
    'ALQADY20': 20, // 20% off
    'SUMMER25': 25 // 25% off
};
let appliedPromo = null;
let appliedDiscount = 0;

function updateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    let discount = 0;
    if (appliedPromo && appliedDiscount > 0) {
        discount = ((subtotal + shipping + tax) * appliedDiscount / 100);
    }
    const total = subtotal + shipping + tax - discount;

    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutShipping = document.getElementById('checkoutShipping');
    const checkoutTax = document.getElementById('checkoutTax');
    const checkoutDiscount = document.getElementById('checkoutDiscount');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const discountLine = document.getElementById('discountLine');

    if (checkoutSubtotal) checkoutSubtotal.textContent = `ج.م${subtotal.toFixed(2)}`;
    if (checkoutShipping) checkoutShipping.textContent = `ج.م${shipping.toFixed(2)}`;
    if (checkoutTax) checkoutTax.textContent = `ج.م${tax.toFixed(2)}`;
    if (checkoutDiscount) checkoutDiscount.textContent = `- ج.م${discount.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `ج.م${total.toFixed(2)}`;
    if (discountLine) discountLine.style.display = discount > 0 ? '' : 'none';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast(t('cart_is_empty'), 'warning');
        return;
    }
    closeModal('cartModal');
    // Update checkout items
    const checkoutItems = document.getElementById('checkoutItems');
    if (checkoutItems) {
        checkoutItems.innerHTML = cart.map(item => {
            const itemName = currentLanguage === 'ar' ? item.nameAr : item.name;
            const optionsText = Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(', ');
            return `
                <div class="checkout-item">
                    <img src="${item.image}" alt="${itemName}" class="checkout-item-image">
                    <div class="checkout-item-details">
                        <h5 class="checkout-item-name">${itemName}</h5>
                        <div class="checkout-item-options">${optionsText}</div>
                        <p class="checkout-item-price">ج.م${item.price} x ${item.quantity}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
    // Reset promo code UI
    if (document.getElementById('promoCode')) {
        document.getElementById('promoCode').value = '';
        document.getElementById('promoFeedback').textContent = '';
        appliedPromo = null;
        appliedDiscount = 0;
    }
    updateCheckoutTotals();
    openModal('checkoutModal');
}
// Promo code apply logic
document.addEventListener('DOMContentLoaded', function() {
    const promoInput = document.getElementById('promoCode');
    const applyBtn = document.getElementById('applyPromoBtn');
    const feedback = document.getElementById('promoFeedback');
    if (applyBtn && promoInput) {
        applyBtn.addEventListener('click', function() {
            const code = promoInput.value.trim().toUpperCase();
            if (promoCodes[code]) {
                appliedPromo = code;
                appliedDiscount = promoCodes[code];
                feedback.textContent = currentLanguage === 'ar' ? `تم تطبيق كود الخصم (${code}) - خصم ${appliedDiscount}%` : `Promo code applied (${code}) - ${appliedDiscount}% off`;
                feedback.classList.remove('error');
                updateCheckoutTotals();
            } else {
                appliedPromo = null;
                appliedDiscount = 0;
                feedback.textContent = currentLanguage === 'ar' ? 'كود الخصم غير صالح' : 'Invalid promo code';
                feedback.classList.add('error');
                updateCheckoutTotals();
            }
        });
        promoInput.addEventListener('input', function() {
            if (!promoInput.value.trim()) {
                appliedPromo = null;
                appliedDiscount = 0;
                feedback.textContent = '';
                feedback.classList.remove('error');
                updateCheckoutTotals();
            }
        });
    }
});

// Enhanced form validation
function validateCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'checkoutEmail', 'phone', 'address', 'city', 'zipCode', 'governorate'];
    
    for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            showToast(t('fill_required_fields'), 'error');
            // Focus on the first empty field
            const fieldElement = form.querySelector(`[name="${field}"]`);
            if (fieldElement) fieldElement.focus();
            return false;
        }
    }
    
    // Email validation
    const email = formData.get('checkoutEmail');
    if (!validateEmail(email)) {
        showToast(t('invalid_email'), 'error');
        form.querySelector('[name="checkoutEmail"]').focus();
        return false;
    }
    
    // Phone validation
    const phone = formData.get('phone');
    if (!validatePhone(phone)) {
        showToast(t('invalid_phone'), 'error');
        form.querySelector('[name="phone"]').focus();
        return false;
    }
    
    return true;
}

// Enhanced payment processing
function processPayment(paymentMethod, formData) {
    showLoading();
    showToast(t('payment_processing'), 'info');
    setTimeout(() => {
        hideLoading();
        const orderNumber = 'ALQ' + Date.now().toString().slice(-6);
        cart = [];
        updateCartStorage();
        updateCartDisplay();
        closeModal('checkoutModal');
        showOrderConfirmation(orderNumber, paymentMethod, formData, appliedPromo, appliedDiscount);
        showToast(t('order_confirmed'), 'success');
        appliedPromo = null;
        appliedDiscount = 0;
    }, 2000);
}

// Enhanced order confirmation with accessibility
function showOrderConfirmation(orderNumber, paymentMethod, formData, promoCode, discountPercent) {
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal active';
    confirmationModal.id = 'orderConfirmationModal';
    confirmationModal.setAttribute('role', 'dialog');
    confirmationModal.setAttribute('aria-labelledby', 'confirmationTitle');
    confirmationModal.setAttribute('aria-modal', 'true');
    
    const paymentMethodText = paymentMethod === 'instapay' ? 
        (currentLanguage === 'ar' ? 'إنستاباي' : 'InstaPay') :
        (currentLanguage === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery');
    
    confirmationModal.innerHTML = `
        <div class="modal-content order-confirmation-content">
            <div class="modal-header">
                <h3 id="confirmationTitle">${currentLanguage === 'ar' ? 'تأكيد الطلب' : 'Order Confirmation'}</h3>
                <button class="close-btn" onclick="closeModal('orderConfirmationModal')" aria-label="${currentLanguage === 'ar' ? 'إغلاق' : 'Close'}">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-confirmation">
                    <div class="success-icon" aria-hidden="true">✓</div>
                    <h2>${currentLanguage === 'ar' ? 'تم تأكيد طلبك!' : 'Your Order is Confirmed!'}</h2>
                    <div class="order-details">
                        <p><strong>${currentLanguage === 'ar' ? 'رقم الطلب:' : 'Order Number:'}</strong> ${orderNumber}</p>
                        <p><strong>${currentLanguage === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</strong> ${paymentMethodText}</p>
                        <p><strong>${currentLanguage === 'ar' ? 'العنوان:' : 'Delivery Address:'}</strong> ${formData.get('address')}, ${formData.get('city')}</p>
                        <p><strong>${currentLanguage === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> ${formData.get('phone')}</p>
                        ${promoCode && discountPercent ? `<p><strong>${currentLanguage === 'ar' ? 'كود الخصم:' : 'Promo Code:'}</strong> ${promoCode} (${discountPercent}%)</p>` : ''}
                    </div>
                    <p class="confirmation-message">
                        ${currentLanguage === 'ar' ? 
                            'سيتم إرسال رسالة تأكيد إلى بريدك الإلكتروني. سيتم التواصل معك قريباً لتأكيد التسليم.' :
                            'A confirmation email will be sent to you. We will contact you soon to confirm delivery.'
                        }
                    </p>
                    <button class="btn btn-primary" onclick="closeModal('orderConfirmationModal')">
                        ${currentLanguage === 'ar' ? 'حسناً' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
    
    // Focus on the OK button
    const okButton = confirmationModal.querySelector('.btn-primary');
    if (okButton) {
        okButton.focus();
    }
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
        if (confirmationModal.parentNode) {
            confirmationModal.parentNode.removeChild(confirmationModal);
        }
    }, 15000);
}

// Enhanced search functionality with accessibility
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchProductsGrid = document.getElementById('searchProductsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        if (query === '') {
            if (searchProductsGrid) searchProductsGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'none';
            return;
        }
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            const searchResults = products.filter(product => {
                const name = currentLanguage === 'ar' ? product.nameAr : product.name;
                const description = currentLanguage === 'ar' ? product.descriptionAr : product.description;
                
                return name.toLowerCase().includes(query) ||
                       description.toLowerCase().includes(query) ||
                       product.category.toLowerCase().includes(query);
            });
            
            if (searchResults.length === 0) {
                if (searchProductsGrid) searchProductsGrid.innerHTML = '';
                if (noResults) noResults.style.display = 'block';
                announceToScreenReader(currentLanguage === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found');
            } else {
                if (noResults) noResults.style.display = 'none';
                if (searchProductsGrid) {
                    searchProductsGrid.innerHTML = searchResults.slice(0, 6).map(product => {
                        const productName = currentLanguage === 'ar' ? product.nameAr : product.name;
                        
                        return `
                            <div class="product-card" data-product-id="${product.id}" role="article" aria-label="${productName}">
                                <div class="product-image">
                                    <img src="${product.image}" alt="${productName}" loading="lazy">
                                </div>
                                <div class="product-info">
                                    <h3 class="product-name">${productName}</h3>
                                    <div class="product-price">
                                        <span class="current-price">$${product.price}</span>
                                    </div>
                                    <div class="product-actions">
                                        <button class="btn btn-primary btn-sm quick-view-btn" data-product-id="${product.id}" aria-label="${currentLanguage === 'ar' ? 'عرض' : 'View'} ${productName}">
                                            ${currentLanguage === 'ar' ? 'عرض' : 'View'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
                announceToScreenReader(`${searchResults.length} ${currentLanguage === 'ar' ? 'نتيجة' : 'results'} ${currentLanguage === 'ar' ? 'موجودة' : 'found'}`);
            }
        }, 300);
    });
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            if (searchProductsGrid) searchProductsGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'none';
            searchInput.focus();
        });
    }
}

// Enhanced image zoom functionality
function initializeImageZoom() {
    const mainImage = document.getElementById('productModalMainImage');
    const zoomOverlay = document.getElementById('imageZoomOverlay');
    const zoomedImage = document.getElementById('zoomedImage');
    
    if (mainImage && zoomOverlay && zoomedImage) {
        mainImage.addEventListener('click', () => {
            zoomedImage.src = mainImage.src;
            zoomedImage.alt = mainImage.alt;
            zoomOverlay.style.display = 'flex';
            zoomOverlay.focus();
        });
        
        zoomOverlay.addEventListener('click', () => {
            zoomOverlay.style.display = 'none';
            mainImage.focus();
        });
        
        // Keyboard support for zoom overlay
        zoomOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                zoomOverlay.style.display = 'none';
                mainImage.focus();
            }
        });
    }
}

// COMPREHENSIVE EVENT LISTENERS WITH RTL FIXES
function initializeEventListeners() {
    // Enhanced language switcher with accessibility
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-btn')) {
            e.preventDefault();
            const newLang = e.target.dataset.lang;
            switchLanguage(newLang);
        }
    });
    
    // CRITICAL FIX: Enhanced mobile menu for Arabic mode
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = hamburger.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            
            // Accessibility announcements
            const message = mobileNav.classList.contains('active') ? t('menu_opened') : t('menu_closed');
            announceToScreenReader(message);
            
            // Update ARIA attributes
            hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('active'));
            hamburger.setAttribute('aria-label', mobileNav.classList.contains('active') ? 
                (currentLanguage === 'ar' ? 'إغلاق القائمة' : 'Close menu') : 
                (currentLanguage === 'ar' ? 'فتح القائمة' : 'Open menu')
            );
        });
        
        // Enhanced outside click handling
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
                announceToScreenReader(t('menu_closed'));
            }
        });
        
        // Enhanced keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus();
                announceToScreenReader(t('menu_closed'));
            }
        });
    }
    
    // Enhanced mobile menu link handling
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            if (mobileNav) mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            announceToScreenReader(t('menu_closed'));
        });
    });
    
    // Enhanced modal controls with keyboard support
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Enhanced modal keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Enhanced header buttons with accessibility
    const searchBtn = document.getElementById('searchBtn');
    const cartBtn = document.getElementById('cartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchBtn.setAttribute('data-modal-trigger', 'searchModal');
            openModal('searchModal');
            setTimeout(() => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }, 100);
        });
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartBtn.setAttribute('data-modal-trigger', 'cartModal');
            openModal('cartModal');
        });
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistBtn.setAttribute('data-modal-trigger', 'wishlistModal');
            openModal('wishlistModal');
        });
    }
    
    // Enhanced product filters with accessibility
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentFilter = btn.dataset.filter;
            displayedProducts = 12;
            renderProducts();
            
            // Announce filter change
            const filterText = btn.textContent;
            announceToScreenReader(`${currentLanguage === 'ar' ? 'تم تطبيق فلتر' : 'Filter applied'}: ${filterText}`);
        });
    });
    
    // Enhanced sort dropdown
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
            
            // Announce sort change
            const sortText = e.target.options[e.target.selectedIndex].text;
            announceToScreenReader(`${currentLanguage === 'ar' ? 'تم تطبيق ترتيب' : 'Sort applied'}: ${sortText}`);
        });
    }
    
    // Enhanced load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            displayedProducts += 12;
            renderProducts();
            announceToScreenReader(currentLanguage === 'ar' ? 'تم تحميل المزيد من المنتجات' : 'More products loaded');
        });
    }
    
    // Enhanced checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            proceedToCheckout();
        });
    }
    
    // Enhanced product actions (using event delegation)
    document.addEventListener('click', (e) => {
        // Quick view
        if (e.target.closest('.quick-view-btn')) {
            e.preventDefault();
            const productId = e.target.closest('.quick-view-btn').dataset.productId;
            openProductModal(productId);
        }
        
        // Add to cart from product grid
        if (e.target.closest('.add-to-cart-btn')) {
            e.preventDefault();
            const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
            const product = products.find(p => p.id === parseInt(productId));
            
            // If product has options, open modal; otherwise add directly
            if ((product.sizes && product.sizes.length > 0) || 
                (product.colors && product.colors.length > 0) || 
                (product.materials && product.materials.length > 0)) {
                openProductModal(productId);
            } else {
                addToCart(productId);
            }
        }
        
        // Add to wishlist
        if (e.target.closest('.add-to-wishlist-btn')) {
            e.preventDefault();
            const productId = e.target.closest('.add-to-wishlist-btn').dataset.productId;
            addToWishlist(productId);
        }
        
        // Product option selection with accessibility
        if (e.target.classList.contains('option-btn')) {
            e.preventDefault();
            const optionType = e.target.classList.contains('size-option') ? 'size' :
                              e.target.classList.contains('color-option') ? 'color' :
                              e.target.classList.contains('material-option') ? 'material' : null;
            
            if (optionType) {
                // Remove active class and aria-pressed from siblings
                e.target.parentNode.querySelectorAll('.option-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                // Add active class and aria-pressed to clicked button
                e.target.classList.add('active');
                e.target.setAttribute('aria-pressed', 'true');
                // Update selected options
                selectedOptions[optionType] = e.target.dataset.value;
                
                // Announce selection
                announceToScreenReader(`${optionType} ${currentLanguage === 'ar' ? 'محدد' : 'selected'}: ${e.target.dataset.value}`);
            }
        }
    });
    
    // Enhanced product modal actions
    const addToCartModalBtn = document.getElementById('addToCartModalBtn');
    const addToWishlistModalBtn = document.getElementById('addToWishlistModalBtn');
    
    if (addToCartModalBtn) {
        addToCartModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentProduct) {
                addToCart(currentProduct.id, selectedOptions);
                closeModal('productModal');
            }
        });
    }
    
    if (addToWishlistModalBtn) {
        addToWishlistModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentProduct) {
                addToWishlist(currentProduct.id);
            }
        });
    }
    
    // Enhanced payment method toggle
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const instapayDetails = document.getElementById('instapayDetails');
            if (instapayDetails) {
                instapayDetails.style.display = e.target.value === 'instapay' ? 'block' : 'none';
            }
        });
    });
    
    // Enhanced forms with accessibility
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast(t('form_submitted'), 'success');
            e.target.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast(t('newsletter_success'), 'success');
            e.target.reset();
        });
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCheckoutForm()) {
                return;
            }
            
            const formData = new FormData(e.target);
            const paymentMethod = formData.get('payment');
            
            processPayment(paymentMethod, formData);
        });
    }
    
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focus management for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
}

// Enhanced initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Reset all user state to default on every page load
    localStorage.removeItem('alqady_language');
    localStorage.removeItem('alqady_cart');
    localStorage.removeItem('alqady_wishlist');
    // If you use sessionStorage or other keys, clear them here as well

    // Set defaults
    currentLanguage = 'en';
    cart = [];
    wishlist = [];

    // Apply default language
    switchLanguage(currentLanguage);

    // Initialize components
    initializeEventListeners();
    initializeSearch();
    initializeImageZoom();

    // Initial render
    renderProducts();
    renderBestSellingProducts();
    updateCartDisplay();
    updateWishlistDisplay();

    // Enhanced scroll effect to header with performance optimization
    let lastScrollTop = 0;
    let ticking = false;
    const header = document.querySelector('.header');

    if (header) {
        function updateHeader() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            header.classList.toggle('scrolled', scrollTop > 0);
            lastScrollTop = scrollTop;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // Initialize accessibility features
    initializeAccessibilityFeatures();
});

// Always reset language to English on page unload (so next visit defaults to English)
window.addEventListener('beforeunload', function() {
    localStorage.removeItem('alqady_language');
});

// Enhanced accessibility features
function initializeAccessibilityFeatures() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = currentLanguage === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.background = 'var(--primary-color)';
    skipLink.style.color = 'white';
    skipLink.style.padding = '8px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.zIndex = '10000';
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Enhance form labels and error handling
    document.querySelectorAll('input, textarea, select').forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                if (!label.id) {
                    label.id = `label-${input.id}`;
                }
            }
        }
    });
    
    // Add ARIA attributes to interactive elements
    document.querySelectorAll('button').forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            button.setAttribute('aria-label', currentLanguage === 'ar' ? 'زر' : 'Button');
        }
    });
    
    // Enhance focus management
    document.addEventListener('keydown', (e) => {
        // Trap focus in modals
        if (e.key === 'Tab') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                const focusableElements = activeModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Expose functions globally for inline event handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.moveToCartFromWishlist = moveToCartFromWishlist;
window.openModal = openModal;
window.closeModal = closeModal;
window.openProductModal = openProductModal;
window.proceedToCheckout = proceedToCheckout;
window.switchLanguage = switchLanguage;