/* eslint-disable no-restricted-globals */

// handle push notification event receiver
self.addEventListener('push', event => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://dashboard.servistory.com/servistory.png',
        requireInteraction: true
    });
});

// handle notification click event
self.addEventListener('notificationclick', (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();
    let url = 'https://dashboard.servistory.com/';

    event.waitUntil(
        self.clients.matchAll().then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});