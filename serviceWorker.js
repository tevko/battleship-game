// The files we want to cache
const CACHE_NAME = 'site-cache-v1';

const urlsToCache = [
	'/',
	'/game.js',
	'/style.css',
	'https://c1.staticflickr.com/4/3034/3048380730_85bbe428a7.jpg',
	'https://68.media.tumblr.com/avatar_99757c17548a_128.png',
	'https://s-media-cache-ak0.pinimg.com/736x/e4/cb/77/e4cb77a6ded005906bda2cef36b7234e.jpg',
	'http://i2.cdnds.net/12/45/618x328/gaming_gta_5_lifeboat.jpg',
	'http://teratalks.com/images/uploads/2016/08/20160817-tera-squirt.jpg',
	'http://ecx.images-amazon.com/images/I/411ChPj4WVL._SL256_.jpg',
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