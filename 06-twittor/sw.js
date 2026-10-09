const CACHE_NAME = 'twittor-v1';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './css/animate.css',
    './css/style.css',
    './js/libs/jquery.js',
    './js/app.js',
    './img/favicon.ico',
    './img/avatars/spiderman.jpg',
    './img/avatars/ironman.jpg',
    './img/avatars/hulk.jpg',
    './img/avatars/thor.jpg',
    './img/avatars/wolverine.jpg',
    './img/no-image.png',
    './img/icons/icon-72x72.png', 
    './img/icons/icon-96x96.png',
    './img/icons/icon-128x128.png',
    './img/icons/icon-144x144.png',
    './img/icons/152x152.png',
    './img/icons/icon-192x192.png',
    './img/icons/icon-384x384.png',
    './img/icons/icon-512x512.png',
    

];

self.addEventListener('install', (e) => {
    const cache = caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL));
    e.waitUntil(cache); // va a esperar a la instalacion de los recusos 
    self.skipWaiting(); // 
});

self.addEventListener('activate', (e) => {
    const activate = caches.keys().then((keys) => {
        return Promise.all(keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)));
    });
    e.waitUntil(activate);
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse;
        }

        return fetch(e.request).then((response) => {
            const requestUrl = new URL(e.request.url);
            if (e.request.method === 'GET' && requestUrl.origin === self.location.origin && response.ok) {
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, response.clone()));
            }
            return response;
        }).catch(() => {
            if (e.request.destination === 'image') {
                return caches.match('./img/no-image.png');
            }
            return Response.error();
        });
    }));
});
