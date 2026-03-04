const CACHE_NAME = 'guardxfly-cache-v8';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/i18n.js',
  '/PP.html',
  '/blog.html',
  'https://i.pinimg.com/736x/b5/a3/ce/b5a3cee5b352bb717ade0f1ec03dab97.jpg',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Amiri:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
