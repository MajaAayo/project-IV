        const bookListWrapper = document.querySelector('.book-list-wrapper');
        const bookList = document.querySelector('.book-list');
        const listItems = document.querySelectorAll('.book-list li');
        const prevArrow = document.getElementById('prev-arrow');
        const nextArrow = document.getElementById('next-arrow');
        const itemWidth = 230;
        const minVisibleItems = 5;

        let isAnimating = false;

        function adjustBookListWidth() {
            const visibleCount = Math.max(minVisibleItems, listItems.length);
            bookList.style.width = `${visibleCount * itemWidth}px`;
        }

        adjustBookListWidth();

        prevArrow.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const lastItem = bookList.querySelector('li:last-child');
            bookList.insertBefore(lastItem, bookList.firstChild);
            bookList.style.transition = `transform 0.7s ease-in-out`;
            bookList.style.transform = `translateX(${itemWidth}px)`;
            setTimeout(() => {
                bookList.style.transition = 'none';
                bookList.style.transform = 'translateX(0)';
                setTimeout(()=> {
                    bookList.style.transition = 'transform 0.7s ease-in-out';
                    isAnimating = false;
                }, 10)
            }, 300);
        });

        nextArrow.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            bookList.style.transition = `transform 0.7s ease-in-out`;
            bookList.style.transform = `translateX(${-itemWidth}px)`;
            setTimeout(() => {
                const firstItem = bookList.querySelector('li:first-child');
                bookList.appendChild(firstItem);
                bookList.style.transition = 'none';
                bookList.style.transform = 'translateX(0px)';
                setTimeout(()=> {
                    bookList.style.transition = 'transform 0.7s ease-in-out';
                    isAnimating = false;
                }, 10)
            }, 300);
        });

        listItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.dataset.title;
                const author = item.dataset.author;
                window.location.href = `explore.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
            });
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