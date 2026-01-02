// Very small offline cache (safe starter)
const CACHE = "ryr-v1";
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

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
