const STATIC_CACHE = 'static_v3';

self.addEventListener('install', (event) => {
  console.log(`[Service Workers] Installing Service Worker, ${event}`);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
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
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE) {
            console.log(key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('isOnline: ', self.navigator.onLine);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('From cache');
        return response;
      } else {
        return fetch(event.request)
          .then((res) => {
            return caches.open('dynamic').then((cache) => {
              cache.put(event.request.url, res.clone());
              console.log('From cache');

              return res;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
  );
});
