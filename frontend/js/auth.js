// Auth logic for EcoFinds frontend
function showMessage(message, type = 'error') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.classList.remove('hidden');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    } else {
        // Fallback for pages without message div
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            setTimeout(() => alertDiv.remove(), 5000);
        } else {
            alert(message); // Final fallback
        }
    }
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
                if (loginLink) loginLink.classList.add('hidden');
                if (dashboardLink) dashboardLink.classList.remove('hidden');
                if (cartLink) cartLink.classList.remove('hidden');
                if (addProductBtn) addProductBtn.classList.remove('hidden');
                return true;
            }
        } catch (error) {
            localStorage.removeItem('token');
        }
    }

    if (loginLink) loginLink.classList.remove('hidden');
    if (dashboardLink) dashboardLink.classList.add('hidden');
    if (cartLink) cartLink.classList.add('hidden');
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
                showMessage('Login successful! Redirecting to home...', 'success');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message || 'Login failed. Please check your credentials.');
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
                showMessage('Account created successfully! Redirecting to home...', 'success');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage(error.message || 'Registration failed. Please try again.');
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
