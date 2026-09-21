// Service Worker for ReviewTayo (reviewtayo.online)
// Provides full offline study support for drills, guides, and mistake reviews.

// Bump on every deploy that changes app code: the activate handler purges any
// cache whose name doesn't match, so clients drop stale chunks and HTML.
// (Next.js static chunks are content-hashed, but precached HTML can keep
// referencing them long after a deploy — a fresh cache name is the reset.)
const CACHE_NAME = "csereviewph-v3";

const PRECACHE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon.svg",
  "/dashboard",
  "/dashboard/mistakes",
  "/dashboard/bookmarks",
  "/practice",
  "/guides",
  "/articles",
  "/cse/exam-guide",
  "/exams/professional/quick",
  "/exams/subprofessional/quick",
  "/settings",
  "/faq",
];

// Install: precache essential app shell routes and offline assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn("[SW] Precache failed, continuing:", err);
      })
  );
});

// Activate: purge stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Allow the app to force-activate a waiting SW immediately after a deploy
// (call: navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" }))
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch: Network First with Cache Fallback for navigation, Cache First for static chunks
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests, API endpoints, and external third-party requests
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Static Assets (_next/static, images, icons): Cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML Page Navigation: Network-first with Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          // If offline and specific page is uncached, fall back to cached dashboard or root
          const fallback = (await caches.match("/dashboard")) || (await caches.match("/"));
          if (fallback) return fallback;

          return new Response(
            "<html><body><h1>Offline Mode</h1><p>You are currently offline. Please reconnect to load new pages.</p></body></html>",
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // All other GET requests: Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
