// Frontend/JavaScript/reading-history.js
document.addEventListener('DOMContentLoaded', () => {
  const readingHistoryList = document.getElementById('reading-history-list');
  const noHistoryMessage = document.getElementById('no-history');

  // Function to fetch and display reading history
  async function displayReadingHistory() {
      const token = localStorage.getItem('userToken');
      if (!token) {
          alert('Please log in to view your reading history.');
          window.location.href = 'signlog.html';
          return;
      }

      try {
          const response = await fetch('http://localhost:5000/api/reading-history', {
              headers: {
                  'Authorization': token
              }
          });
          const history = await response.json();
          if (!response.ok) {
              throw new Error(history.error || 'Failed to load reading history');
          }

          // Clear any existing list items
          readingHistoryList.innerHTML = '';

          if (history.length === 0) {
              noHistoryMessage.style.display = 'block';
              readingHistoryList.style.display = 'none';
          } else {
              noHistoryMessage.style.display = 'none';
              readingHistoryList.style.display = 'block';
              history.forEach(item => {
                  const listItem = document.createElement('li');
                  listItem.innerHTML = `
                      <div class="book-details">
                          <i class="fas fa-book-open list-icon completed-icon"></i>
                          <span class="book-title">${item.title}</span>
                          ${item.author ? `<span class="book-author">by ${item.author}</span>` : ''}
                      </div>
                      <span class="completion-date">Last read on: ${new Date(item.last_read).toLocaleString()}</span>
                      <button class="delete-btn" onclick="deleteHistory(${item.id})">Delete</button>
                  `;
                  // Add click event to open the book PDF
                  listItem.addEventListener('click', async (e) => {
                      // Prevent the delete button click from triggering the book open
                      if (e.target.classList.contains('delete-btn')) return;
                      try {
                          const response = await fetch(`http://localhost:5000/api/books/read/${item.book_id}`, {
                              headers: { 'Authorization': token }
                          });
                          const data = await response.json();
                          if (response.ok) {
                              window.open(data.pdfUrl, '_blank');
                          } else {
                              alert(data.error);
                          }
                      } catch (error) {
                          console.error('Error opening book:', error);
                          alert('An error occurred while opening the book');
                      }
                  });
                  readingHistoryList.appendChild(listItem);
              });
          }
      } catch (error) {
          console.error('Failed to load history:', error);
          alert('Failed to load reading history: ' + error.message);
      }
  }

  // Function to delete a reading history entry
  window.deleteHistory = async (historyId) => {
      const token = localStorage.getItem('userToken');
      if (!token) {
          alert('Please log in to delete reading history.');
          window.location.href = 'signlog.html';
          return;
      }

      try {
          const response = await fetch(`http://localhost:5000/api/reading-history/${historyId}`, {
              method: ' UT DELETE',
              headers: {
                  'Authorization': token
              }
          });
          const data = await response.json();
          if (response.ok) {
              alert('Reading history entry deleted successfully!');
              displayReadingHistory(); // Refresh the list
              updateBookmarkCount(); // Update bookmark count
          } else {
              alert(data.error);
          }
      } catch (error) {
          console.error('Error deleting history:', error);
          alert('An error occurred while deleting the history entry');
      }
  };

  // Initial load
  displayReadingHistory();
  updateBookmarkCount();
});