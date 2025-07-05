// --- Data ---
// Array containing product information, including ID, name, price, image, description, and features.
const productsData = [
    {
        id: 1,
        name: 'Quantum Processor X1',
        price: 1299.99,
        image: 'https://placehold.co/400x300/1a202c/e2e8f0?text=Quantum+X1',
        description: 'The next-generation quantum processor, capable of billions of operations per nanosecond. Ideal for advanced AI and simulation tasks.',
        features: ['1024 Qubits', 'Neural Net Integration', 'Cryogenic Cooling Required', 'Self-repairing architecture'],
    },
    {
        id: 2,
        name: 'Aetherial VR Headset',
        price: 799.99,
        image: 'https://placehold.co/400x300/1a202c/e2e8f0?text=Aetherial+VR',
        description: 'Immerse yourself in hyper-realistic virtual worlds with the Aetherial VR Headset. Featuring retinal projection and haptic feedback.',
        features: ['24K Resolution', '180-degree FOV', 'Haptic Feedback Gloves', 'Wireless Connectivity'],
    },
    {
        id: 3,
        name: 'Chrono-Stabilizer Unit',
        price: 2499.99,
        image: 'https://placehold.co/400x300/1a202c/e2e8f0?text=Chrono+Unit',
        description: 'Maintain temporal integrity in your personal space. Prevents minor causality distortions and ensures optimal workflow.',
        features: ['Temporal Flux Compensation', 'Personal Bubble Range', 'Energy Shielding', 'Zero-point energy source'],
    },
    {
        id: 4,
        name: 'Bio-Luminescent Plant Pod',
        price: 149.99,
        image: 'https://placehold.co/400x300/1a202c/e2e8f0?text=Plant+Pod',
        description: 'Bring life and light into your futuristic dwelling. Emits a soft, calming glow and purifies the air.',
        features: ['Self-watering System', 'Photosynthetic Enhancer', 'Adaptive Light Spectrum', 'Non-allergenic spores'],
    },
    {
        id: 5,
        name: 'Sonic Pulse Speaker',
        price: 349.99,
        image: 'https://placehold.co/400x300/1a202c/e2e8f0?text=Sonic+Speaker',
        description: 'Experience sound like never before. The Sonic Pulse Speaker delivers immersive 3D audio with vibrational feedback.',
        features: ['Directional Audio', 'Sub-sonic Bass', 'Holographic Display', 'AI-driven sound optimization'],
    },
    {
        id: 6,
        name: 'Automated Drone Butler',
        price: 999.99,
        image: 'https://placehold.co/400x300/1a202c/e2e8f0?text=Drone+Butler',
        description: 'Your personal aerial assistant for all daily tasks. From fetching items to security surveillance.',
        features: ['Autonomous Navigation', 'Voice Command Interface', 'Integrated Scanner', 'Long-range battery life'],
    },
];

// --- Global State ---
let cartItems = []; // Stores items currently in the shopping cart
let currentPage = 'home'; // Tracks the current page view ('home', 'productDetail', 'cart')
let selectedProductId = null; // Stores the ID of the product being viewed in detail
let currentSearchTerm = ''; // Stores the current search query for products
let currentSortBy = 'default'; // Stores the current sorting preference ('default', 'price-asc', etc.)

// --- DOM Elements ---
const appRoot = document.getElementById('app-root'); // The main root element for the application
const modalContainer = document.getElementById('modal-container'); // Container for modal pop-ups
const toastContainer = document.getElementById('toast-container'); // Container for toast notifications
const initialLoading = document.getElementById('initial-loading'); // The initial loading screen element

// --- Helper Functions ---

/**
 * Formats a given price into a currency string (e.g., $1299.99).
 * @param {number} price - The price to format.
 * @returns {string} The formatted price string.
 */
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

/**
 * Updates the displayed count of items in the cart icon.
 * Applies a subtle bounce animation when the count changes.
 */
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-item-count');
    if (cartCountElement) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.classList.remove('hidden');
            // Trigger reflow to restart animation
            cartCountElement.classList.remove('animate-bounce-subtle');
            void cartCountElement.offsetWidth;
            cartCountElement.classList.add('animate-bounce-subtle');
        } else {
            cartCountElement.classList.add('hidden');
            cartCountElement.classList.remove('animate-bounce-subtle');
        }
    }
}

// --- Cart Logic ---

/**
 * Adds a product to the cart or increments its quantity if already present.
 * Shows a toast notification and re-renders the cart if on the cart page.
 * @param {object} product - The product object to add to the cart.
 */
function addToCart(product) {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    if (currentPage === 'cart') {
        renderCart(document.querySelector('main')); // Re-render cart if currently viewing it
    }
    showToast('success', `${product.name} added to cart!`);
}

/**
 * Removes a product entirely from the cart.
 * Shows a toast notification and re-renders the cart.
 * @param {number} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
    const removedItem = cartItems.find(item => item.id === productId);
    cartItems = cartItems.filter((item) => item.id !== productId);
    updateCartCount();
    renderCart(document.querySelector('main')); // Re-render cart after removal
    if (removedItem) {
        showToast('info', `${removedItem.name} removed from cart.`);
    }
}

/**
 * Updates the quantity of a specific product in the cart.
 * If newQuantity is 0 or less, the item is removed.
 * @param {number} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the product.
 */
function updateQuantity(productId, newQuantity) {
    const item = cartItems.find((i) => i.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
        }
    }
    updateCartCount();
    renderCart(document.querySelector('main')); // Re-render cart after quantity update
}

/**
 * Clears all items from the shopping cart.
 * Re-renders the cart page to reflect the empty state.
 */
function clearCart() {
    cartItems = [];
    updateCartCount();
    renderCart(document.querySelector('main')); // Re-render cart after clearing
}

// --- Modal Logic ---
let currentModalTimeout = null; // Holds the timeout ID for auto-closing modals

/**
 * Displays a custom modal message to the user.
 * @param {string} title - The title of the modal.
 * @param {string} message - The main message content of the modal.
 * @param {boolean} [isSuccess=false] - If true, styles the modal for a success message.
 * @param {number} [autoClose=5000] - Duration in milliseconds after which the modal automatically closes. Set to 0 to disable auto-close.
 */
function showModal(title, message, isSuccess = false, autoClose = 5000) {
    modalContainer.innerHTML = `
        <div class="bg-gray-800 rounded-xl shadow-2xl p-8 text-center border border-gray-700 max-w-sm sm:max-w-md w-full mx-4 animate-fade-in">
            <h3 class="text-2xl sm:text-3xl font-bold ${isSuccess ? 'text-green-400' : 'text-teal-300'} mb-4">${title}</h3>
            <p class="text-gray-300 text-base sm:text-lg mb-6">${message}</p>
            <button id="modal-ok-btn" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg w-full">
                OK
            </button>
        </div>
    `;
    modalContainer.classList.remove('hidden');

    document.getElementById('modal-ok-btn').addEventListener('click', () => {
        closeModal();
        if (isSuccess) {
            navigateTo('home'); // Redirect to home after successful action
        }
    });

    // Clear any existing auto-close timeout
    if (currentModalTimeout) {
        clearTimeout(currentModalTimeout);
    }
    // Set new auto-close timeout if duration is greater than 0
    if (autoClose > 0) {
        currentModalTimeout = setTimeout(closeModal, autoClose);
    }
}

/**
 * Hides the currently displayed modal.
 */
function closeModal() {
    if (modalContainer) {
        modalContainer.classList.add('hidden');
        modalContainer.innerHTML = ''; // Clear content to prevent lingering elements
    }
    if (currentModalTimeout) {
        clearTimeout(currentModalTimeout);
        currentModalTimeout = null;
    }
}

// --- Toast Notification Logic ---
/**
 * Displays a small, ephemeral toast notification.
 * @param {'success'|'error'|'info'} type - The type of toast (determines color and icon).
 * @param {string} message - The message to display in the toast.
 * @param {number} [duration=3000] - How long the toast should be visible in milliseconds.
 */
function showToast(type, message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type} animate-slide-in-right`; // Apply initial animation class
    toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 ${ // flex-shrink-0 to prevent icon from shrinking
            type === 'success' ? 'text-green-400' :
            type === 'error' ? 'text-red-400' :
            'text-blue-400'
        }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' :
              type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />' :
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'}
        </svg>
        <span class="text-sm sm:text-base">${message}</span>
    `;
    toastContainer.appendChild(toast);

    // Set timeout to remove the toast with an exit animation
    setTimeout(() => {
        toast.classList.remove('animate-slide-in-right');
        toast.classList.add('animate-slide-out-right');
        toast.addEventListener('animationend', () => toast.remove()); // Remove from DOM after animation
    }, duration);
}

// --- Navigation ---
/**
 * Navigates to a different "page" within the single-page application.
 * Updates the URL using history.pushState if pushState is true.
 * @param {string} page - The target page ('home', 'productDetail', 'cart').
 * @param {number|null} [productId=null] - The product ID if navigating to productDetail.
 * @param {boolean} [pushState=true] - Whether to add a new entry to the browser's history.
 */
function navigateTo(page, productId = null, pushState = true) {
    currentPage = page;
    selectedProductId = productId;

    let path = '';
    // Determine the URL path based on the target page
    if (page === 'home') {
        path = '/';
        // Add search and sort parameters to the URL if present
        const params = new URLSearchParams();
        if (currentSearchTerm) params.set('search', currentSearchTerm);
        if (currentSortBy !== 'default') params.set('sort', currentSortBy);
        const queryString = params.toString();
        if (queryString) path += `?${queryString}`;
    } else if (page === 'productDetail' && productId) {
        path = `/product/${productId}`;
    } else if (page === 'cart') {
        path = '/cart';
    }

    // Update browser history if pushState is enabled
    if (pushState) {
        history.pushState({ currentPage, selectedProductId, currentSearchTerm, currentSortBy }, '', path);
    }
    renderPage(); // Re-render the entire page content
}

// Handle browser's back/forward buttons using popstate event
window.addEventListener('popstate', (event) => {
    // Restore state from history if available
    if (event.state) {
        currentPage = event.state.currentPage || 'home';
        selectedProductId = event.state.selectedProductId || null;
        currentSearchTerm = event.state.currentSearchTerm || '';
        currentSortBy = event.state.currentSortBy || 'default';
    } else {
        // Fallback for initial load or if state is null (e.g., direct URL access)
        const path = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);

        if (path.startsWith('/product/')) {
            const id = parseInt(path.split('/')[2]);
            if (!isNaN(id)) {
                currentPage = 'productDetail';
                selectedProductId = id;
            } else {
                currentPage = 'home';
            }
        } else if (path === '/cart') {
            currentPage = 'cart';
        } else {
            currentPage = 'home';
        }
        currentSearchTerm = urlParams.get('search') || '';
        currentSortBy = urlParams.get('sort') || 'default';
    }
    renderPage(); // Re-render the page based on the restored state
});


// --- Component Rendering Functions ---

/**
 * Renders the navigation bar HTML.
 * @returns {string} The HTML string for the navbar.
 */
function renderNavbar() {
    // Responsive adjustments:
    // - `flex-col sm:flex-row`: Stacks items vertically on small screens, horizontally on larger.
    // - `text-center sm:text-left`: Centers text on small screens.
    // - `space-y-2 sm:space-x-6 sm:space-y-0`: Adjusts spacing.
    const navbarHtml = `
        <nav class="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-40">
            <div class="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <h1 id="home-nav-link" class="text-3xl font-extrabold text-teal-400 cursor-pointer hover:text-teal-300 transition-colors mb-2 sm:mb-0">
                    FutureMart
                </h1>
                <div class="flex items-center space-x-4 sm:space-x-6">
                    <button id="products-nav-link" class="text-lg font-semibold hover:text-teal-400 transition-colors relative">
                        Products
                    </button>
                    <button id="cart-nav-link" class="text-lg font-semibold hover:text-teal-400 transition-colors relative">
                        Cart
                        <span id="cart-item-count" class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${cartItems.length === 0 ? 'hidden' : ''}" aria-live="polite" aria-atomic="true">
                            ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    `;
    return navbarHtml;
}

/**
 * Renders the hero section HTML for the home page.
 * @returns {string} The HTML string for the hero section.
 */
function renderHeroSection() {
    // Responsive adjustments:
    // - `py-16 md:py-20`: Adjusts vertical padding.
    // - `text-5xl md:text-6xl lg:text-7xl`: Adjusts font sizes.
    // - `max-w-xl md:max-w-2xl`: Adjusts max width for paragraph.
    // - `px-8 py-4 md:px-10 md:py-5`: Adjusts button padding.
    // - `text-xl md:text-2xl`: Adjusts button font size.
    return `
        <section class="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-20 px-4 text-center shadow-inner-lg animate-fade-in">
            <div class="container mx-auto">
                <h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-md text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                    Discover Tomorrow's Tech, Today.
                </h2>
                <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-xl md:max-w-2xl mx-auto">
                    Immerse yourself in a curated collection of futuristic devices and innovations that will redefine your reality.
                </p>
                <button id="shop-now-btn" class="px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-bold text-xl md:text-2xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-xl transform hover:-translate-y-2 inline-flex items-center justify-center space-x-3 group">
                    <span>Shop Now</span>
                    <svg class="h-6 w-6 md:h-8 md:w-8 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
            </div>
        </section>
    `;
}

/**
 * Renders a single product card HTML.
 * @param {object} product - The product object to render.
 * @returns {string} The HTML string for a product card.
 */
function renderProductCard(product) {
    // Responsive adjustments:
    // - `h-48 object-cover`: Fixed height for image, but `object-cover` ensures it scales.
    // - `text-xl`: Consistent font size for product name.
    // - `text-lg`: Consistent font size for price.
    return `
        <div class="bg-gray-800 rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-teal-500 product-card animate-fade-in" data-product-id="${product.id}">
            <img
                src="${product.image}"
                alt="${product.name}"
                class="w-full h-48 object-cover object-center rounded-t-xl"
                onerror="this.onerror=null; this.src='https://placehold.co/400x300/1a202c/e2e8f0?text=${encodeURIComponent(product.name)}';"
                loading="lazy"
            />
            <div class="p-4 sm:p-6">
                <h3 class="text-lg sm:text-xl font-semibold text-teal-300 mb-2">${product.name}</h3>
                <p class="text-gray-300 text-base sm:text-lg mb-4">${formatPrice(product.price)}</p>
                <button
                    class="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1 add-to-cart-btn"
                    data-product-id="${product.id}"
                    aria-label="Add ${product.name} to cart"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

/**
 * Renders a skeleton loading card for products.
 * @returns {string} The HTML string for a skeleton product card.
 */
function renderProductCardSkeleton() {
    return `
        <div class="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 animate-fade-in">
            <div class="skeleton-image skeleton-loader w-full h-48 rounded-t-xl"></div>
            <div class="p-4 sm:p-6">
                <div class="skeleton-text skeleton-loader w-3/4 h-6 mb-2"></div>
                <div class="skeleton-text skeleton-loader w-1/2 h-5 mb-4"></div>
                <div class="skeleton-loader h-10 sm:h-12 w-full rounded-lg"></div>
            </div>
        </div>
    `;
}

/**
 * Renders the product list page, including hero, search, sort, and product grid.
 * @param {HTMLElement} mainContentElement - The main element where content will be rendered.
 */
function renderProductList(mainContentElement) {
    // Responsive adjustments:
    // - `flex-col md:flex-row`: Stacks search/sort vertically on small screens, horizontally on medium+.
    // - `w-full md:w-1/2`: Search input takes full width on small, half on medium+.
    // - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`: Responsive grid columns.
    mainContentElement.innerHTML = `
        ${renderHeroSection()}
        <div class="container mx-auto px-4 py-8 md:py-12">
            <div class="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
                <div class="relative w-full md:w-1/2">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search products..."
                        class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-teal-500 focus:border-teal-500 text-base"
                        value="${currentSearchTerm}"
                        aria-label="Search products"
                    />
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div class="w-full md:w-auto flex items-center space-x-2">
                    <label for="sort-by" class="text-gray-300 text-base">Sort by:</label>
                    <select
                        id="sort-by"
                        class="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-teal-500 focus:border-teal-500 text-base"
                        aria-label="Sort products by"
                    >
                        <option value="default" ${currentSortBy === 'default' ? 'selected' : ''}>Default</option>
                        <option value="price-asc" ${currentSortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                        <option value="price-desc" ${currentSortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                        <option value="name-asc" ${currentSortBy === 'name-asc' ? 'selected' : ''}>Name: A-Z</option>
                        <option value="name-desc" ${currentSortBy === 'name-desc' ? 'selected' : ''}>Name: Z-A</option>
                    </select>
                </div>
            </div>

            <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            </div>
        </div>
    `;

    // Event listener for Shop Now button in Hero
    document.getElementById('shop-now-btn').addEventListener('click', () => {
        // Smooth scroll to the product grid section, accounting for navbar height
        const navbarHeight = document.querySelector('nav').offsetHeight;
        const targetOffset = mainContentElement.querySelector('.container.mx-auto.px-4.py-8').offsetTop;
        window.scrollTo({ top: targetOffset - navbarHeight, behavior: 'smooth' });
    });


    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const sortBySelect = document.getElementById('sort-by');

    // Filter and Sort Logic
    const applyFiltersAndSort = () => {
        let filteredProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );

        switch (currentSortBy) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'default':
            default:
                filteredProducts.sort((a,b) => a.id - b.id); // Sort by original ID
                break;
        }

        productGrid.innerHTML = ''; // Clear existing products
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = `
                <div class="col-span-full text-center text-gray-400 text-lg sm:text-2xl py-10">
                    No products found matching your criteria.
                </div>
            `;
        } else {
            filteredProducts.forEach(product => {
                productGrid.insertAdjacentHTML('beforeend', renderProductCard(product));
            });
        }
        attachProductCardListeners(); // Re-attach listeners after rendering
    };

    // Initial render with skeletons to show loading state
    for (let i = 0; i < 8; i++) {
        productGrid.insertAdjacentHTML('beforeend', renderProductCardSkeleton());
    }

    // Simulate network delay and then render actual products
    setTimeout(() => {
        applyFiltersAndSort();
    }, 500);

    // Event Listeners for Filter/Sort
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        applyFiltersAndSort();
        navigateTo('home', null, false); // Update URL state without full page reload
    });

    sortBySelect.addEventListener('change', (e) => {
        currentSortBy = e.target.value;
        applyFiltersAndSort();
        navigateTo('home', null, false); // Update URL state without full page reload
    });

    /**
     * Attaches click listeners to product cards and "Add to Cart" buttons.
     */
    function attachProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Navigate to product detail only if the click wasn't on the "Add to Cart" button
                if (!e.target.closest('.add-to-cart-btn')) {
                    const productId = parseInt(card.dataset.productId);
                    navigateTo('productDetail', productId);
                }
            });
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event from firing
                const productId = parseInt(e.target.dataset.productId);
                const product = productsData.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            });
        });
    }
}

/**
 * Renders the product detail page for a specific product.
 * @param {HTMLElement} mainContentElement - The main element where content will be rendered.
 * @param {number} productId - The ID of the product to display.
 */
function renderProductDetail(mainContentElement, productId) {
    const product = productsData.find(p => p.id === productId);

    // If product not found, display an error message and a back button
    if (!product) {
        mainContentElement.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white flex-col px-4">
                <p class="text-2xl sm:text-3xl font-bold text-red-400 mb-4 text-center">Product not found.</p>
                <button id="back-to-products-btn" class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 text-base sm:text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Products
                </button>
            </div>
        `;
        document.getElementById('back-to-products-btn').addEventListener('click', () => navigateTo('home'));
        return;
    }

    // Responsive adjustments:
    // - `lg:flex lg:space-x-10`: Uses flexbox for large screens, stacks vertically otherwise.
    // - `lg:w-1/2`: Each section takes half width on large screens.
    // - `w-full max-w-sm sm:max-w-md lg:max-w-lg`: Responsive image width.
    // - `text-3xl sm:text-4xl`: Responsive heading font size.
    // - `text-base sm:text-xl`: Responsive description font size.
    // - `text-2xl sm:text-3xl`: Responsive price font size.
    // - `text-xl sm:text-2xl`: Responsive features heading font size.
    // - `text-base sm:text-lg`: Responsive feature list item font size.
    mainContentElement.innerHTML = `
        <div class="container mx-auto px-4 py-8 md:py-12 min-h-screen animate-fade-in">
            <button id="back-to-products-btn" class="mb-6 sm:mb-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 text-base sm:text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Products
            </button>
            <div class="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:flex lg:space-x-10 border border-gray-700">
                <div class="lg:w-1/2 flex justify-center items-center mb-8 lg:mb-0">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="w-full max-w-sm sm:max-w-md lg:max-w-lg h-auto rounded-lg shadow-lg border border-gray-600"
                        onerror="this.onerror=null; this.src='https://placehold.co/600x450/1a202c/e2e8f0?text=${encodeURIComponent(product.name)}';"
                        loading="lazy"
                    />
                </div>
                <div class="lg:w-1/2 text-white">
                    <h2 class="text-3xl sm:text-4xl font-extrabold text-teal-300 mb-4">${product.name}</h2>
                    <p class="text-gray-300 text-base sm:text-xl mb-6">${product.description}</p>
                    <p class="text-2xl sm:text-3xl font-bold text-green-400 mb-6">${formatPrice(product.price)}</p>

                    <div class="mb-8">
                        <h3 class="text-xl sm:text-2xl font-semibold text-white mb-3">Key Features:</h3>
                        <ul class="list-disc list-inside text-gray-400 space-y-2 text-base sm:text-lg">
                            ${product.features.map(feature => `
                                <li class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                                    </svg>
                                    ${feature}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <button id="add-to-cart-detail-btn" class="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-xl transform hover:-translate-y-1" aria-label="Add ${product.name} to cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('back-to-products-btn').addEventListener('click', () => navigateTo('home'));
    document.getElementById('add-to-cart-detail-btn').addEventListener('click', () => addToCart(product));
}

/**
 * Renders the shopping cart page.
 * @param {HTMLElement} mainContentElement - The main element where content will be rendered.
 */
function renderCart(mainContentElement) {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Responsive adjustments:
    // - `text-4xl sm:text-5xl`: Responsive heading font size.
    // - `flex-col sm:flex-row`: Stacks cart items vertically on small, horizontally on medium+.
    // - `w-full sm:w-auto`: Item details take full width on small, auto on medium+.
    // - `mb-4 sm:mb-0`: Margin adjustments.
    // - `text-base sm:text-xl`: Responsive text sizes.
    // - `text-lg sm:text-2xl`: Responsive total font size.
    mainContentElement.innerHTML = `
        <div class="container mx-auto px-4 py-8 md:py-12 min-h-screen animate-fade-in">
            <h2 class="text-4xl sm:text-5xl font-extrabold text-center text-white mb-8 sm:mb-12 drop-shadow-lg animate-fade-in">
                Your Shopping Cart
            </h2>

            ${cartItems.length === 0 ? `
                <div class="text-center text-gray-400 text-lg sm:text-2xl py-10">
                    Your cart is empty. Start adding some amazing tech!
                    <button id="go-to-products-btn" class="block mx-auto mt-6 sm:mt-8 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-bold text-base sm:text-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                        Go to Products
                    </button>
                </div>
            ` : `
                <div class="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700">
                    ${cartItems.map(item => `
                        <div class="flex flex-col sm:flex-row items-center justify-between border-b border-gray-700 py-4 sm:py-6 last:border-b-0 animate-fade-in">
                            <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto mb-4 sm:mb-0">
                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                    class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-600 flex-shrink-0"
                                    onerror="this.onerror=null; this.src='https://placehold.co/100x100/1a202c/e2e8f0?text=${encodeURIComponent(item.name)}';"
                                    loading="lazy"
                                />
                                <div class="text-center sm:text-left">
                                    <h3 class="text-lg sm:text-xl font-semibold text-teal-300">${item.name}</h3>
                                    <p class="text-gray-400 text-sm sm:text-base">${formatPrice(item.price)} each</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 sm:space-x-4 mt-4 sm:mt-0 w-full justify-center sm:justify-end">
                                <div class="flex items-center bg-gray-700 rounded-lg">
                                    <button class="px-2 py-1 sm:px-3 sm:py-1 text-white text-lg sm:text-xl hover:bg-gray-600 rounded-l-lg transition-colors quantity-minus-btn" data-product-id="${item.id}" aria-label="Decrease quantity of ${item.name}">
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value="${item.quantity}"
                                        class="w-12 sm:w-16 text-center bg-transparent text-white text-base sm:text-lg border-none focus:ring-0 appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none quantity-input"
                                        data-product-id="${item.id}"
                                        aria-label="Quantity of ${item.name}"
                                    />
                                    <button class="px-2 py-1 sm:px-3 sm:py-1 text-white text-lg sm:text-xl hover:bg-gray-600 rounded-r-lg transition-colors quantity-plus-btn" data-product-id="${item.id}" aria-label="Increase quantity of ${item.name}">
                                        +
                                    </button>
                                </div>
                                <p class="text-white text-base sm:text-lg font-bold w-20 sm:w-24 text-right">${formatPrice(item.price * item.quantity)}</p>
                                <button class="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors remove-from-cart-btn flex-shrink-0" data-product-id="${item.id}" aria-label="Remove ${item.name} from cart">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}

                    <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700 text-white">
                        <div class="flex justify-between text-base sm:text-xl mb-2">
                            <span>Subtotal:</span>
                            <span>${formatPrice(subtotal)}</span>
                        </div>
                        <div class="flex justify-between text-base sm:text-xl mb-4">
                            <span>Tax (${taxRate * 100}%):</span>
                            <span>${formatPrice(tax)}</span>
                        </div>
                        <div class="flex justify-between text-xl sm:text-3xl font-bold text-teal-400 mb-6">
                            <span>Total:</span>
                            <span>${formatPrice(total)}</span>
                        </div>
                        <button id="checkout-btn" class="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-xl transform hover:-translate-y-1">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            `}
        </div>
    `;

    // Attach event listeners for cart interactions
    if (cartItems.length === 0) {
        document.getElementById('go-to-products-btn').addEventListener('click', () => navigateTo('home'));
    } else {
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                removeFromCart(productId);
            });
        });

        document.querySelectorAll('.quantity-minus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                const item = cartItems.find(i => i.id === productId);
                if (item) updateQuantity(productId, item.quantity - 1);
            });
        });

        document.querySelectorAll('.quantity-plus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                const item = cartItems.find(i => i.id === productId);
                if (item) updateQuantity(productId, item.quantity + 1);
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const newQuantity = parseInt(e.target.value);
                if (!isNaN(newQuantity) && newQuantity >= 0) {
                    updateQuantity(productId, newQuantity);
                } else {
                    // Revert to previous quantity if invalid input
                    const item = cartItems.find(i => i.id === productId);
                    e.target.value = item ? item.quantity : 1;
                }
            });
            // Prevent non-numeric or special characters in quantity input
            input.addEventListener('keypress', (e) => {
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === '.') {
                    e.preventDefault();
                }
            });
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (cartItems.length === 0) {
                showModal('Cart Empty', 'Your cart is empty. Please add items before checking out.', false, 3000);
                return;
            }
            clearCart();
            showModal('Order Placed!', 'Thank you for your purchase! Your order has been placed. You will be redirected to the home page.', true);
        });
    }
}

/**
 * Renders the footer HTML.
 * @returns {string} The HTML string for the footer.
 */
function renderFooter() {
    // Responsive adjustments:
    // - `text-base sm:text-lg`: Responsive text size.
    // - `space-x-4 sm:space-x-6`: Responsive spacing for links.
    // - `text-xl sm:text-2xl`: Responsive icon size.
    return `
        <footer class="bg-gray-900 text-gray-400 p-6 sm:p-8 text-center mt-auto shadow-inner-top">
            <div class="container mx-auto">
                <p class="text-base sm:text-lg mb-4">&copy; ${new Date().getFullYear()} FutureMart. All rights reserved.</p>
                <div class="flex flex-wrap justify-center space-x-4 sm:space-x-6 mb-4 text-sm sm:text-base">
                    <a href="#" class="hover:text-teal-400 transition-colors whitespace-nowrap">Privacy Policy</a>
                    <span class="text-gray-600 hidden sm:inline">|</span>
                    <a href="#" class="hover:text-teal-400 transition-colors whitespace-nowrap">Terms of Service</a>
                    <span class="text-gray-600 hidden sm:inline">|</span>
                    <a href="#" class="hover:text-teal-400 transition-colors whitespace-nowrap">Contact Us</a>
                </div>
                <div class="flex justify-center space-x-4 sm:space-x-6 text-xl sm:text-2xl">
                    <a href="#" class="hover:text-teal-400 transition-colors" aria-label="FutureMart on Twitter">
                        <svg class="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6c-.85.38-1.77.63-2.73.74.98-.59 1.74-1.52 2.09-2.61-.92.55-1.94.95-3 1.18-.87-.93-2.1-1.52-3.46-1.52-2.62 0-4.75 2.13-4.75 4.75 0 .37.04.73.11 1.07-3.95-.2-7.46-2.09-9.81-4.96-.41.71-.64 1.54-.64 2.44 0 1.65.84 3.1 2.12 3.96-.78-.03-1.5-.24-2.13-.59v.06c0 2.3 1.64 4.22 3.81 4.66-.4.1-.8.15-1.22.15-.3 0-.59-.03-.87-.08.6 1.88 2.34 3.25 4.39 3.29-1.63 1.28-3.69 2.05-5.92 2.05-.38 0-.76-.02-1.13-.07 2.11 1.35 4.62 2.15 7.33 2.15 8.8 0 13.58-7.3 13.58-13.58 0-.21-.01-.42-.01-.63.93-.67 1.74-1.5 2.38-2.45z"/></svg>
                    </a>
                    <a href="#" class="hover:text-teal-400 transition-colors" aria-label="FutureMart on Facebook">
                        <svg class="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.65 9.12 8.44 9.87v-7.74H7.07V12h3.37V9.3c0-3.37 2.06-5.2 5.06-5.2 1.46 0 2.72.11 3.09.16v3.35h-2.08c-1.63 0-1.95.77-1.95 1.91V12h3.76l-.6 3.87h-3.16v7.74C18.35 21.12 22 16.99 22 12z"/></svg>
                    </a>
                    <a href="#" class="hover:text-teal-400 transition-colors" aria-label="FutureMart on Instagram">
                        <svg class="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2.5v1.6h1.6V4.5H7.6zm8.8 0h1.6v1.6h-1.6V4.5zM12 9a3 3 0 100 6 3 3 0 000-6zm-6 2c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4zm10.7-5.5h1.6v1.6h-1.6V5.5z"/></svg>
                    </a>
                </div>
            </div>
        </footer>
    `;
}

// --- Main Render Function ---
/**
 * Renders the entire application page based on the current global state.
 * Clears existing content and builds the page from scratch.
 */
function renderPage() {
    appRoot.innerHTML = ''; // Clear previous content

    // Render Navbar first
    appRoot.insertAdjacentHTML('afterbegin', renderNavbar());

    // Add event listeners for Navbar navigation
    document.getElementById('home-nav-link').addEventListener('click', () => navigateTo('home'));
    document.getElementById('products-nav-link').addEventListener('click', () => navigateTo('home'));
    document.getElementById('cart-nav-link').addEventListener('click', () => navigateTo('cart'));

    // Create main content area and ensure it takes available vertical space
    const mainElement = document.createElement('main');
    mainElement.className = 'flex-grow';
    appRoot.appendChild(mainElement);

    // Render content specific to the current page
    if (currentPage === 'home') {
        renderProductList(mainElement);
    } else if (currentPage === 'productDetail') {
        renderProductDetail(mainElement, selectedProductId);
    } else if (currentPage === 'cart') {
        renderCart(mainElement);
    }

    // Render Footer last
    appRoot.insertAdjacentHTML('beforeend', renderFooter());

    updateCartCount(); // Ensure cart count is accurate on every render
}

// --- Initial Load ---
// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial state setup based on the current URL path and query parameters
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);

    if (path.startsWith('/product/')) {
        const id = parseInt(path.split('/')[2]);
        if (!isNaN(id)) {
            currentPage = 'productDetail';
            selectedProductId = id;
        } else {
            currentPage = 'home'; // Fallback if product ID is invalid
        }
    } else if (path === '/cart') {
        currentPage = 'cart';
    } else {
        currentPage = 'home'; // Default to home page
    }

    currentSearchTerm = urlParams.get('search') || '';
    currentSortBy = urlParams.get('sort') || 'default';


    // Hide initial loading screen after a brief moment and render the page
    setTimeout(() => {
        initialLoading.classList.add('hidden');
        renderPage();
    }, 100); // A small delay to ensure the loading animation is briefly visible
});
