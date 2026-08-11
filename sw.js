// Service Worker بسيط: بيخزن نسخة من التطبيق عشان يشتغل بدون إنترنت
// ملحوظة: تطبيق الأندرويد أصلاً بيحمل الملفات جوه الـ APK فمش محتاج إنترنت،
// الملف ده مفيد بس لو حد فتح النسخة كـ PWA من المتصفح.
const CACHE_NAME = 'academic-assistant-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const fresh = await fetch(event.request);
        cache.put(event.request, fresh.clone());
        return fresh;
      } catch (err) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        throw err;
      }
    })
  );
});
