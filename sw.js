self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open('TenderFrozenOpration-cache-v2.1.8')
    .then((cache) => {
      return cache.addAll([
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/index.html',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/pos.html',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/products.html',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/acc.html',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/tf-navigation.js',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/icons/icon1.png',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/icons/icon2.png',
        'https://abdulrahmanroston.github.io/TenderFrozenOpration/icons/icon1.png'
      ]).then(() => {
        console.log('Service Worker: Cached all files successfully');
      }).catch((error) => {
        console.error('Service Worker: Cache failed:', error);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = ['TenderFrozenOpration-cache-v2.1.8'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('Service Worker: Activated and old caches cleaned');
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      if (response) {
        // Return cached response, but also check for updates  
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open('TenderFrozenOpration-cache-v2.1.8').then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open('TenderFrozenOpration-cache-v2').then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch((error) => {
      console.error('Service Worker: Fetch failed:', error);
    })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
