// Frontend/JavaScript/subscription.js
import { makeApiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkCountSpan = document.querySelector('.bookmark-count');
    const subscribeButtons = document.querySelectorAll('.subscribe-button');
    const popup = document.getElementById('subscription-popup');
    const overlay = document.getElementById('popup-overlay');
    const closePopupButton = document.getElementById('close-popup');

    // Function to update bookmark count in the navbar
    async function updateBookmarkCount() {
        try {
            const bookmarks = await makeApiRequest('/bookmarks');
            bookmarkCountSpan.textContent = `(${bookmarks.length})`;
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            bookmarkCountSpan.textContent = '(0)';
        }
    }

    // Function to update subscription UI
    async function updateSubscriptionUI() {
        try {
            const subscription = await makeApiRequest('/subscription');
            const statusElement = document.getElementById('subscription-status');
            if (subscription.active) {
                statusElement.textContent = `Active until ${subscription.endDate}`;
            } else {
                statusElement.textContent = 'Not subscribed';
            }
        } catch (error) {
            console.error('Failed to load subscription:', error);
            document.getElementById('subscription-status').textContent = 'Not subscribed';
        }
    }

    // Show popup when any subscribe button is clicked
    subscribeButtons.forEach(button => {
        button.addEventListener('click', () => {
            popup.classList.add('show');
            overlay.classList.add('show');
        });
    });

    // Close popup when "Got It" button is clicked
    closePopupButton.addEventListener('click', () => {
        popup.classList.remove('show');
        overlay.classList.remove('show');
    });

    // Close popup when clicking outside (on overlay)
    overlay.addEventListener('click', () => {
        popup.classList.remove('show');
        overlay.classList.remove('show');
    });

    // Initial load
    updateBookmarkCount();
    updateSubscriptionUI();
});