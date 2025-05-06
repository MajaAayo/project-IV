const bookmarkCountSpan = document.querySelector('.bookmark-count');
const playStoreBtn = document.getElementById('play-store-btn');
const appStoreBtn = document.getElementById('app-store-btn');
const comingSoonMessage = document.getElementById('comingSoonMessage');
const overlay = document.getElementById('overlay');
const closeMessage = document.getElementById('closeMessage');

function updateBookmarkCount() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarkCountSpan.textContent = `(${bookmarks.length})`;
}

// Show coming soon message
function showComingSoon() {
    overlay.style.display = 'block';
    comingSoonMessage.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide coming soon message
function hideComingSoon() {
    overlay.style.display = 'none';
    comingSoonMessage.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners for download buttons
playStoreBtn.addEventListener('click', showComingSoon);
appStoreBtn.addEventListener('click', showComingSoon);
closeMessage.addEventListener('click', hideComingSoon);
overlay.addEventListener('click', hideComingSoon);

updateBookmarkCount();

window.addEventListener('storage', (event) => {
    if (event.key === 'bookmarks') {
        updateBookmarkCount();
    }
});
