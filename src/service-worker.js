import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Precaching automático con el manifiesto generado por webpack
precacheAndRoute(self.__WB_MANIFEST);

// 1. Cache para chunks de JavaScript (solución principal para tu error)
registerRoute(
  /\/js\/.*\.js/,  // Expresión regular para todos los archivos JS en la carpeta /js/
  new CacheFirst({
    cacheName: 'js-chunks',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
      })
    ]
  })
);

// 2. Cache para imágenes (versión mejorada)
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,  // Más específico que request.destination
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

// 3. Cache para navegación (HTML)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-cache'
  })
);

// 4. Cache para API (versión mejorada)
registerRoute(
  /\/api\/.*/,  // Más específico para endpoints de API
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutos para datos frescos
      })
    ]
  })
);

// Evento de instalación optimizado
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('js-chunks').then(cache => {
      // Precaching inicial de chunks críticos
      return cache.addAll([
        // Webpack ya maneja esto a través del manifiesto
      ]).then(() => self.skipWaiting());
    })
  );
});

// Evento de activación mejorado
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!['js-chunks', 'images', 'html-cache', 'api-cache'].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Sistema de mensajes para precachear chunks dinámicamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'precache') {
    event.waitUntil(
      caches.open('js-chunks').then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});