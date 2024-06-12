self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('blackjack-pwa-v1').then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './styles.css',
                './scripts.js',
                './manifest.json',
                './icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
