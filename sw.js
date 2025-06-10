const CACHE_NAME = 'kgv705-v3';
const ASSETS_TO_CACHE = [
  '/KGV705/',
  '/KGV705/index.html',
  '/KGV705/manifest.json',
  '/KGV705/icon.png'
  // ggf. weitere Assets: CSS, JS etc.
];

// Install-Event: Initiale Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate-Event: Alte Caches aufräumen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch-Event: Erst aus dem Cache, dann aus dem Netz
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
