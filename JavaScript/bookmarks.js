// Frontend/JavaScript/setting.js
document.addEventListener('DOMContentLoaded', () => {
    const bookmarkCountSpan = document.querySelector('.bookmark-count');
    const bookmarkBtn = document.querySelector('.bookmark-btn');

    // Debug navigation
    bookmarkBtn.addEventListener('click', (e) => {
        console.log('Bookmark button clicked, navigating to bookmarks.html');
        // Remove e.preventDefault() to allow default link behavior
        window.location.href = 'bookmarks.html';
    });

    // Function to update bookmark count
    async function updateBookmarkCount() {
        const token = localStorage.getItem('userToken');
        console.log('Updating bookmark count, token:', token ? 'Present' : 'Missing');
        if (!token) {
            bookmarkCountSpan.textContent = '(0)';
            return;
        }

        try {
            console.log('Fetching bookmarks from /api/bookmarks');
            const response = await fetch('http://localhost:5000/api/bookmarks', {
                headers: { 'Authorization': token }
            });
            const bookmarks = await response.json();
            if (response.ok) {
                console.log('Bookmarks fetched:', bookmarks);
                bookmarkCountSpan.textContent = `(${bookmarks.length})`;
            } else {
                console.error('API error:', bookmarks.error);
                bookmarkCountSpan.textContent = '(0)';
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error.message);
            bookmarkCountSpan.textContent = '(0)';
        }
    }

    // Update username
    document.getElementById('update-username-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert('Please log in.');
            window.location.href = 'signlog.html';
            return;
        }
        const username = document.getElementById('new-username').value;
        try {
            const response = await fetch('http://localhost:5000/api/users/update-username', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('username', username);
                alert('Username updated successfully!');
                window.location.href = 'profile.html';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error updating username:', error);
            alert('An error occurred');
        }
    });

    // Update password
    document.getElementById('update-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert('Please log in.');
            window.location.href = 'signlog.html';
            return;
        }
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/update-password', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Password updated successfully! Please log in again.');
                localStorage.removeItem('userToken');
                localStorage.removeItem('username');
                window.location.href = 'signlog.html';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('An error occurred');
        }
    });

    // Delete account
    document.getElementById('delete-account-btn').addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert('Please log in.');
            window.location.href = 'signlog.html';
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/users/delete-account', {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('username');
                alert('Account deleted successfully!');
                window.location.href = 'front.html';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred');
        }
    });

    // Initial load
    console.log('Settings page loaded, initializing bookmark count');
    updateBookmarkCount();
});