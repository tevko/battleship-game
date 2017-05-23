// The files we want to cache
const CACHE_NAME = 'site-cache-v3';

const urlsToCache = [
	'/',
	'game.js',
	'style.css',
	'img/3048380730_85bbe428a7.jpg',
	'img/avatar_99757c17548a_128.png',
	'img/e4cb77a6ded005906bda2cef36b7234e.jpg',
	'img/gaming_gta_5_lifeboat.jpg',
	'img/20160817-tera-squirt.jpg',
	'img/411ChPj4WVL._SL256_.jpg',
 ];

self.addEventListener('install', (event) => {
    // Perform install steps
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache =>
        Promise.all(
             urlsToCache.map((url) => {
                const request = new Request(url);
                return fetch(request).then(response => cache.put(request, response));
            })
        )
    ))
});

// respond with matches from cache
self.addEventListener('fetch', (event) => {
    if (urlsToCache.some(url => event.request.url.indexOf(url) !== -1)) {
        event.respondWith(caches.match(event.request).then(response => {
            if (!response) {
                const request = new Request(event.request.url);
                return fetch(request)
            }
            return response;
        }));
    }
});

// remove old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(caches.keys()
    .then(keyList =>
        Promise.all(keyList.map(key =>
            cacheWhitelist.indexOf(key) === -1 ? caches.delete(key) : false))));
});