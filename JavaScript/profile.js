import { makeApiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = 'signlog.html';
    return;
  }

  try {
    // Fetch user data
    const userData = await makeApiRequest('/users/me');
    displayUserProfile(userData);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    alert('Failed to load profile data');
  }
});

function displayUserProfile(user) {
  document.getElementById('profile-username').textContent = user.username;
  document.getElementById('profile-email').textContent = user.email;
  // Update other profile fields as needed
}


     
     
     const bookmarkCountSpan = document.querySelector('.bookmark-count');
      const bookmarksList = document.querySelector('.bookmarks-list');
      const readingHistoryList = document.querySelector('.reading-history-list');
      const profileInfoDiv = document.getElementById('profile-info');
      const subscriptionTimerDiv = document.getElementById('subscription-timer');
      const noSubscriptionDiv = document.getElementById('no-subscription');
  
      function updateBookmarkDisplay() {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        bookmarkCountSpan.textContent = `(${bookmarks.length})`;
  
        bookmarksList.innerHTML = ''; // Clear existing bookmarks
  
        if (bookmarks.length === 0) {
          const noBookmarksItem = document.createElement('li');
          noBookmarksItem.classList.add('no-bookmarks');
          noBookmarksItem.textContent = 'No bookmarks yet.';
          bookmarksList.appendChild(noBookmarksItem);
        } else {
          bookmarks.forEach(book => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<i class="fa-regular fa-bookmark list-icon"></i> ${book.title}`;
            listItem.onclick = function() {
              window.location.href = book.url;
            };
            bookmarksList.appendChild(listItem);
          });
        }
      }
  
      function displayReadingHistory() {
        let readingHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
        readingHistoryList.innerHTML = ''; // Clear existing history
  
        if (readingHistory.length === 0) {
          const noHistoryItem = document.createElement('li');
          noHistoryItem.classList.add('no-history');
          noHistoryItem.textContent = 'No reading history yet.';
          readingHistoryList.appendChild(noHistoryItem);
        } else {
          readingHistory.forEach((book) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <div class="book-details">
                <i class="fas fa-book-open list-icon completed-icon"></i>
                <span class="book-title">${book.title}</span>
                ${book.author ? `<span class="book-author">by ${book.author}</span>` : ''}
              </div>
              <span class="completion-date">Completed on: ${book.completionDate}</span>
            `;
            listItem.addEventListener('click', () => {
              window.location.href = book.bookUrl;
            });
            readingHistoryList.appendChild(listItem);
          });
        }
      }
  
      function checkUserLoggedIn() {
        // Replace this with your actual logic to check if the user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn'); // Example: using a localStorage flag
        if (isLoggedIn) {
          // Fetch and display user profile information here
          profileInfoDiv.innerHTML = `
            <label>Username: ${localStorage.getItem('username') || 'N/A'}</label><br>
            <label>Email: ${localStorage.getItem('email') || 'N/A'}</label><br>
            <label>Member Since: ${localStorage.getItem('memberSince') || 'N/A'}</label>
          `;
        } else {
          profileInfoDiv.innerHTML = `
            <p>Please <a href="signlog.html">sign up</a> or <a href="signlog.html">log in</a> to view your profile information.</p>
          `;
        }
      }
  
      function checkSubscriptionStatus() {
        // Replace this with your actual logic to check for an active subscription
        const subscriptionEndDate = localStorage.getItem('subscriptionEndDate');
  
        if (subscriptionEndDate) {
          const endDate = new Date(subscriptionEndDate);
          const now = new Date();
  
          if (endDate > now) {
            subscriptionTimerDiv.style.display = 'block';
            noSubscriptionDiv.style.display = 'none';
            updateSubscriptionTimer(endDate); // Call timer function with the end date
            setInterval(() => updateSubscriptionTimer(endDate), 1000);
          } else {
            subscriptionTimerDiv.style.display = 'none';
            noSubscriptionDiv.style.display = 'block';
            noSubscriptionDiv.innerHTML = '<h3>Subscription Status:</h3><p>Your subscription has expired.</p>';
          }
        } else {
          subscriptionTimerDiv.style.display = 'none';
          noSubscriptionDiv.style.display = 'block';
        }
      }
  
      function updateSubscriptionTimer(endDate) {
        const now = new Date();
        const timeLeft = endDate.getTime() - now.getTime();
  
        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
          document.getElementById('subscription-days').textContent = String(days).padStart(2, '0');
          document.getElementById('subscription-hours').textContent = String(hours).padStart(2, '0');
          document.getElementById('subscription-minutes').textContent = String(minutes).padStart(2, '0');
          document.getElementById('subscription-seconds').textContent = String(seconds).padStart(2, '0');
        } else {
          subscriptionTimerDiv.innerHTML = '<h3 style="color: darkred;">Subscription Expired</h3>';
          noSubscriptionDiv.style.display = 'block';
          noSubscriptionDiv.innerHTML = '<h3>Subscription Status:</h3><p>Your subscription has expired.</p>';
        }
      }
  
      // Initial calls
      updateBookmarkDisplay();
      displayReadingHistory();
      checkUserLoggedIn();
      checkSubscriptionStatus();
  
      window.addEventListener('storage', (event) => {
        if (event.key === 'bookmarks') {
          updateBookmarkDisplay();
        } else if (event.key === 'readingHistory') {
          displayReadingHistory();
        } else if (event.key === 'isLoggedIn' || event.key === 'username' || event.key === 'email' || event.key === 'memberSince') {
          checkUserLoggedIn();
        } else if (event.key === 'subscriptionEndDate') {
          checkSubscriptionStatus();
        }
      });