// Shopping cart state
let cart = [];

// DOM elements
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Add to cart function
window.addToCart = (productId) => {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    const productName = productCard.querySelector('.product-title').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (quantity <= 0 || isNaN(quantity)) {
        alert('Please enter a valid quantity.');
        return;
    }

    for (let i = 0; i < quantity; i++) {
        cart.push({ id: productId, name: productName, price: productPrice });
    }

    alert(`${quantity} ${productName}(s) added to cart!`);
    updateCart();
};

// Update cart display
function updateCart() {
    cartCount.textContent = cart.length;
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total.toFixed(2);
}

// Event listeners
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your purchase!');
    cart = [];
    updateCart();
    cartModal.classList.remove('active');
});

// Initialize the cart
updateCart();