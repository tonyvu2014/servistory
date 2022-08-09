/* eslint-disable no-restricted-globals */

// Any other custom service worker logic can go here.
self.addEventListener('push', event => {
    console.log('event received', event.data);
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: `${process.env.PUBLIC_URL}/servistory.png`
    });
});