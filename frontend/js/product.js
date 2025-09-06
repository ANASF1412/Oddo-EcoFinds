// Product logic for EcoFinds frontend
let currentProducts = [];
let currentFilters = {
    search: '',
    category: '',
    sort: 'newest'
};

// Format price with currency
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="card product-card">
            <img src="${product.image_url || 'img/placeholder.png'}" alt="${product.title}" class="card-img">
            <div class="card-body">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-text">${product.description.substring(0, 100)}...</p>
                <div class="card-footer">
                    <span class="card-price">${formatPrice(product.price)}</span>
                    <button class="btn" onclick="viewProduct(${product.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load and display products
async function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    try {
        productGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
        
        const response = await window.ecofindsApi.products.getAll(currentFilters);
        currentProducts = response.data.products;

        if (currentProducts.length === 0) {
            productGrid.innerHTML = '<div class="no-results">No products found</div>';
            return;
        }

        productGrid.innerHTML = currentProducts.map(createProductCard).join('');
    } catch (error) {
        productGrid.innerHTML = '<div class="error">Error loading products</div>';
        console.error('Error loading products:', error);
    }
}

// Handle product creation
if (document.getElementById('addProductForm')) {
    document.getElementById('addProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const productData = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            image_url: formData.get('image_url')
        };

        try {
            const response = await window.ecofindsApi.products.create(productData);
            if (response.status === 'success') {
                window.location.href = 'my_listings.html';
            }
        } catch (error) {
            showMessage(error.message);
        }
    });
}

// Handle product search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
        currentFilters.search = e.target.value;
        loadProducts();
    }, 300));
}

// Handle category filter
const categoryFilter = document.getElementById('categoryFilter');
if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        loadProducts();
    });
}

// Handle sort options
const sortBy = document.getElementById('sortBy');
if (sortBy) {
    sortBy.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        loadProducts();
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// View product details
function viewProduct(productId) {
    window.location.href = `product_detail.html?id=${productId}`;
}

// Load product details on product detail page
async function loadProductDetails() {
    const productContainer = document.getElementById('productDetails');
    if (!productContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await window.ecofindsApi.products.getById(productId);
        const product = response.data.product;

        productContainer.innerHTML = `
            <div class="product-detail">
                <img src="${product.image_url || 'img/placeholder.png'}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h1>${product.title}</h1>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-price">${formatPrice(product.price)}</span>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <button class="btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        productContainer.innerHTML = '<div class="error">Product not found</div>';
    }
}

// Add product to cart
async function addToCart(productId) {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    try {
        await window.ecofindsApi.cart.add({
            product_id: productId,
            quantity: 1
        });
        showMessage('Product added to cart', 'success');
        updateCartCount();
    } catch (error) {
        showMessage(error.message);
    }
}

// Update cart count in navbar
async function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;

    try {
        const response = await window.ecofindsApi.cart.get();
        cartCount.textContent = response.data.items.length;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Initialize product-related features
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadProductDetails();
    updateCartCount();
});
