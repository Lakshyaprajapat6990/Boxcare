// Simple PWA Service Worker - Cache first strategy
const CACHE_NAME = 'boxcare-v1';
const urlsToCache = [
  '/',
  '/products',
  '/gallery',
  '/reviews',
  '/contact',
  '/manifest.json',
  '/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
