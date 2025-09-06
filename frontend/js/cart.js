// Cart functionality for EcoFinds
async function loadCart() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartContainer) return;

    try {
        const response = await window.ecofindsApi.cart.get();
        const { items, total } = response.data;

        if (items.length === 0) {
            cartContainer.parentElement.classList.add('hidden');
            if (emptyCart) emptyCart.classList.remove('hidden');
            if (cartTotal) cartTotal.textContent = formatPrice(0);
            if (cartSubtotal) cartSubtotal.textContent = formatPrice(0);
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        // Show cart items and hide empty message
        cartContainer.parentElement.classList.remove('hidden');
        if (emptyCart) emptyCart.classList.add('hidden');

        cartContainer.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image_url || 'img/placeholder.png'}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p class="item-price">${formatPrice(item.price)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeItem(${item.id})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Update totals
        if (cartTotal) cartTotal.textContent = formatPrice(total);
        if (cartSubtotal) cartSubtotal.textContent = formatPrice(total);
        if (checkoutBtn) checkoutBtn.disabled = false;

        // Update cart count in navigation
        updateCartCount();

    } catch (error) {
        console.error('Error loading cart:', error);
        cartContainer.innerHTML = `
            <div class="error-message">
                <p><i class="fas fa-exclamation-circle"></i> Failed to load cart items</p>
                <button onclick="loadCart()" class="btn btn-primary">Try Again</button>
            </div>
        `;
    }
}

async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;

    try {
        await window.ecofindsApi.cart.update(itemId, newQuantity);
        loadCart();
        updateCartCount();
        showMessage('Quantity updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating quantity:', error);
        showMessage('Failed to update quantity', 'error');
    }
}

async function removeItem(itemId) {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
        return;
    }

    try {
        await window.ecofindsApi.cart.remove(itemId);
        loadCart();
        updateCartCount();
        showMessage('Item removed from cart', 'success');
    } catch (error) {
        console.error('Error removing item:', error);
        showMessage('Failed to remove item', 'error');
    }
}

async function addToCart(productId, quantity = 1) {
    try {
        const response = await window.ecofindsApi.cart.add({ product_id: productId, quantity });
        if (response.status === 'success') {
            updateCartCount();
            return response;
        } else {
            throw new Error(response.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

async function updateCartCount() {
    try {
        const response = await window.ecofindsApi.cart.get();
        const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
        const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = totalItems;
                element.style.display = totalItems > 0 ? 'inline' : 'none';
            }
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
