// Profile management functionality
document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    
    await loadUserProfile();
    await loadUserStats();
    setupAvatarUpload();
    setupFormListeners();
});

async function loadUserProfile() {
    try {
        const response = await window.ecofindsApi.auth.getProfile();
        const user = response.data.user;

        // Fill form fields
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('bio').value = user.bio || '';
        
        if (user.profile_image) {
            document.getElementById('avatarPreview').src = user.profile_image;
        }
    } catch (error) {
        showMessage('Error loading profile');
        console.error('Error loading profile:', error);
    }
}

async function loadUserStats() {
    try {
        const [listings, sales, purchases] = await Promise.all([
            window.ecofindsApi.products.getByUser('me'),
            window.ecofindsApi.products.getByUser('me?status=sold'),
            window.ecofindsApi.orders.getAll()
        ]);

        document.getElementById('listingsCount').textContent = 
            listings.data.products.filter(p => p.status === 'active').length;
        document.getElementById('salesCount').textContent = 
            sales.data.products.length;
        document.getElementById('purchasesCount').textContent = 
            purchases.data.orders.length;
    } catch (error) {
        console.error('Error loading user stats:', error);
    }
}

function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatarInput');
    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showMessage('Please select an image file');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch('/api/auth/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();
            if (data.status === 'success') {
                document.getElementById('avatarPreview').src = data.data.profile_image;
                showMessage('Profile picture updated successfully', 'success');
            }
        } catch (error) {
            showMessage('Error uploading profile picture');
            console.error('Error:', error);
        }
    });
}

function setupFormListeners() {
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const profileData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            bio: document.getElementById('bio').value
        };

        try {
            const response = await window.ecofindsApi.auth.updateProfile(profileData);
            if (response.status === 'success') {
                showMessage('Profile updated successfully', 'success');
            }
        } catch (error) {
            showMessage(error.message);
        }
    });

    // Password change form submission
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            showMessage('New passwords do not match');
            return;
        }

        try {
            const response = await window.ecofindsApi.auth.changePassword({
                currentPassword,
                newPassword
            });
            
            if (response.status === 'success') {
                showMessage('Password updated successfully', 'success');
                e.target.reset();
            }
        } catch (error) {
            showMessage(error.message);
        }
    });
}
