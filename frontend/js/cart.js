// Cart functionality for EcoFinds
async function loadCart() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartContainer) return;

    try {
        const response = await window.ecofindsApi.cart.get();
        const { items, total } = response.data;

        if (items.length === 0) {
            cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = formatPrice(0);
            return;
        }

        cartContainer.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image_url || 'img/placeholder.png'}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p class="item-price">${formatPrice(item.price)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})"
                                ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        cartTotal.textContent = formatPrice(total);
    } catch (error) {
        cartContainer.innerHTML = '<div class="error">Error loading cart</div>';
        console.error('Error loading cart:', error);
    }
}

async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;

    try {
        await window.ecofindsApi.cart.update(itemId, newQuantity);
        loadCart();
        updateCartCount();
    } catch (error) {
        showMessage(error.message);
    }
}

async function removeItem(itemId) {
    try {
        await window.ecofindsApi.cart.remove(itemId);
        loadCart();
        updateCartCount();
    } catch (error) {
        showMessage(error.message);
    }
}

async function checkout() {
    try {
        const response = await window.ecofindsApi.orders.create();
        if (response.status === 'success') {
            showMessage('Order placed successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'purchases.html';
            }, 2000);
        }
    } catch (error) {
        showMessage(error.message);
    }
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    loadCart();
});
