// API integration for EcoFinds frontend
const API_URL = 'http://localhost:3000/api';

// Helper function to handle API calls
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`API Error: ${endpoint}`, error);
        throw error;
    }
}

// Auth API calls
const auth = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    register: (userData) => apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    getProfile: () => apiCall('/auth/me')
};

// Products API calls
const products = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/products?${queryString}`);
    },

    getById: (id) => apiCall(`/products/${id}`),

    create: (productData) => apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    }),

    update: (id, productData) => apiCall(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    }),

    delete: (id) => apiCall(`/products/${id}`, {
        method: 'DELETE'
    }),

    getByUser: (userId) => apiCall(`/products/user/${userId}`)
};

// Cart API calls
const cart = {
    get: () => apiCall('/cart'),

    add: (item) => apiCall('/cart', {
        method: 'POST',
        body: JSON.stringify(item)
    }),

    update: (id, quantity) => apiCall(`/cart/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
    }),

    remove: (id) => apiCall(`/cart/${id}`, {
        method: 'DELETE'
    }),

    clear: () => apiCall('/cart', {
        method: 'DELETE'
    })
};

// Orders API calls
const orders = {
    create: () => apiCall('/orders', {
        method: 'POST'
    }),

    getAll: () => apiCall('/orders'),

    getById: (id) => apiCall(`/orders/${id}`)
};

// Export API modules
window.ecofindsApi = {
    auth,
    products,
    cart,
    orders
};
