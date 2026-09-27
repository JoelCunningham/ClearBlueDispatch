const CACHE_NAME = "clear-blue-dispatch-v4";
const STATIC_ASSETS = ["/", "/icons/logo-192.png", "/icons/logo-512.png", "/icons/logo-square.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames.filter(cacheName => cacheName !== CACHE_NAME).map(cacheName => caches.delete(cacheName))))
  );
  self.clients.claim();
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/data/")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then(response => {
          if (!response || response.status !== 200) return response;

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));

          return response;
        });
      })
    );

    return;
  }

  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then(response => {
          if (!response || response.status !== 200) return response;

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));

          return response;
        });
      })
    );
    return;
  }
});
