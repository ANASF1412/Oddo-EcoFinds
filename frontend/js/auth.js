// Auth logic for EcoFinds frontend
function showMessage(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('loginLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const cartLink = document.getElementById('cartLink');
    const addProductBtn = document.getElementById('addProductBtn');

    if (token) {
        try {
            const response = await window.ecofindsApi.auth.getProfile();
            if (response.status === 'success') {
                loginLink.classList.add('hidden');
                dashboardLink.classList.remove('hidden');
                cartLink.classList.remove('hidden');
                if (addProductBtn) addProductBtn.classList.remove('hidden');
                return true;
            }
        } catch (error) {
            localStorage.removeItem('token');
        }
    }

    loginLink.classList.remove('hidden');
    dashboardLink.classList.add('hidden');
    cartLink.classList.add('hidden');
    if (addProductBtn) addProductBtn.classList.add('hidden');
    return false;
}

// Handle login form submission
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await window.ecofindsApi.auth.login({ email, password });
            if (response.status === 'success') {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            showMessage(error.message);
        }
    });
}

// Handle registration form submission
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('Passwords do not match');
            return;
        }

        try {
            const response = await window.ecofindsApi.auth.register({
                username,
                email,
                password
            });
            
            if (response.status === 'success') {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            showMessage(error.message);
        }
    });
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Update UI based on authentication status
document.addEventListener('DOMContentLoaded', checkAuthStatus);
