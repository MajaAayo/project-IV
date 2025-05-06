// Frontend/JavaScript/utils.js
async function updateBookmarkCount() {
    const bookmarkCountSpan = document.querySelector('.bookmark-count');
    if (!bookmarkCountSpan) return;

    const token = localStorage.getItem('userToken');
    if (!token) {
        bookmarkCountSpan.textContent = '(0)';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/bookmarks', {
            headers: {
                'Authorization': token
            }
        });
        const bookmarks = await response.json();
        if (response.ok) {
            bookmarkCountSpan.textContent = `(${bookmarks.length})`;
        } else {
            bookmarkCountSpan.textContent = '(0)';
        }
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        bookmarkCountSpan.textContent = '(0)';
    }
}

// Export the function (for use in other scripts)
window.updateBookmarkCount = updateBookmarkCount;