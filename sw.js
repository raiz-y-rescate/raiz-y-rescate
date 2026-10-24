const CACHE = "ryr-v10-repairs-20261023"; 

const ASSETS = [
  "/raiz-y-rescate/",
  "/raiz-y-rescate/index.html",
  "/raiz-y-rescate/styles.css",
  "/raiz-y-rescate/app.js",
  "/raiz-y-rescate/manifest.webmanifest",

  "/raiz-y-rescate/about/",
  "/raiz-y-rescate/about/index.html",

  "/raiz-y-rescate/learning/",
  "/raiz-y-rescate/learning/index.html",

  "/raiz-y-rescate/structures/",
  "/raiz-y-rescate/structures/index.html",

  "/raiz-y-rescate/land-water/",
  "/raiz-y-rescate/land-water/index.html",

  "/raiz-y-rescate/shift/",
  "/raiz-y-rescate/shift/index.html",

  "/raiz-y-rescate/remains-changes/",
  "/raiz-y-rescate/remains-changes/index.html",

  "/raiz-y-rescate/library/",
  "/raiz-y-rescate/library/index.html",

  "/raiz-y-rescate/prototypes/",
  "/raiz-y-rescate/prototypes/index.html"
];

// INSTALL — pre-cache known assets
self.addEventListener("install", (event) => {
  self.skipWaiting(); // activate new SW ASAP
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

// ACTIVATE — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key.startsWith("ryr-") && key !== CACHE ? caches.delete(key) : null)))
    )
  );
  self.clients.claim(); // take control immediately
});

// FETCH — HTML = network-first, assets = cache-first
self.addEventListener("fetch", (event) => {
  const request = event.request;

  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith("/raiz-y-rescate/")) return;

  const accept = request.headers.get("accept") || "";
  const isHTML = accept.includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache with fresh HTML
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: serve cached HTML if available
          return caches.match(request).then((cached) => cached || caches.match("/raiz-y-rescate/index.html"));
        })
    );
  } else {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

