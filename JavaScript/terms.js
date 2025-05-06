
const bookmarkCountSpan = document.querySelector('.bookmark-count');

function updateBookmarkCount() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarkCountSpan.textContent = `(${bookmarks.length})`;
}

updateBookmarkCount();

window.addEventListener('storage', (event) => {
    if (event.key === 'bookmarks') {
        updateBookmarkCount();
    }
});
