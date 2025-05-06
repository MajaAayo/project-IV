        document.getElementById('contact-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }

            console.log('Form Data:', { name, email, subject, message });
            alert('Message sent successfully! (This is a demo)');

            document.getElementById('contact-form').reset();
        });

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