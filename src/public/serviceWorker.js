self.addEventListener('install', (event) => {
  console.log(`[Service Workers] Installing Service Worker, ${event}`);
  event.waitUntil(
    caches.open('static').then((cache) => {
      console.log('Static cache is open');
      cache.addAll([
        '/',
        '/main',
        '/css/style.css',
        '/js/main.js',
        '/js/index.js',
        '/js/anime.min.js',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log(`[Service Workers] Service Worker is active, ${event}`);
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((res) => {
          return caches.open('dynamic').then((cache) => {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
