const CACHE = "ryr-v9";

const ASSETS = [
  "/raiz-y-rescate/",
  "/raiz-y-rescate/index.html",
  "/raiz-y-rescate/styles.css",
  "/raiz-y-rescate/app.js",

  "/raiz-y-rescate/shift/",
  "/raiz-y-rescate/shift/index.html",

  "/raiz-y-rescate/remains-changes/",
  "/raiz-y-rescate/remains-changes/index.html",

  "/raiz-y-rescate/structures/",
  "/raiz-y-rescate/structures/index.html",

  "/raiz-y-rescate/learning/",
  "/raiz-y-rescate/learning/index.html",

  "/raiz-y-rescate/land-water/",
  "/raiz-y-rescate/land-water/index.html",

  "/raiz-y-rescate/prototypes/",
  "/raiz-y-rescate/prototypes/index.html",

  "/raiz-y-rescate/about/",
  "/raiz-y-rescate/about/index.html",

  "/raiz-y-rescate/library/",
  "/raiz-y-rescate/library/index.html",


];

// INSTALL — pre-cache known assets
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
          if (key !== CACHE) return caches.delete(key);
        })
      )
    )
  );
});

// FETCH — HTML = network-first, assets = cache-first
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const accept = request.headers.get("accept") || "";
  const isHTML = accept.includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

