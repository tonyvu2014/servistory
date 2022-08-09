/* eslint-disable no-restricted-globals */

// Any other custom service worker logic can go here.
self.addEventListener('push', event => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://dashboard.servistory.com/servistory.png',
        requireInteraction: true
    });
});