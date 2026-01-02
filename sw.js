const CACHE = "ryr-v4";

const ASSETS = [
  "/raiz-y-rescate/",
  "/raiz-y-rescate/index.html",
  "/raiz-y-rescate/styles.css",
  "/raiz-y-rescate/app.js",
  "/raiz-y-rescate/escuela/",
  "/raiz-y-rescate/escuela/index.html",
  "/raiz-y-rescate/escuela/curriculum/",
  "/raiz-y-rescate/escuela/curriculum/index.html"
];

// INSTALL — cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

// ACTIVATE — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// FETCH — serve cached first, then network
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const accept = req.headers.get("accept") || "";
  const isHTML = accept.includes("text/html");

  // For HTML pages: NETWORK FIRST (fresh pages), fallback to cache
  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // For CSS/JS/images: CACHE FIRST (fast + offline)
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
