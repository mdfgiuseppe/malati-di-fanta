const CACHE_VERSION = '20260509_0918';
const CACHE_NAME = 'mdf-' + CACHE_VERSION;

// Installa subito senza aspettare che le vecchie tab si chiudano
self.addEventListener('install', () => self.skipWaiting());

// Prendi il controllo di tutte le tab immediatamente, cancella cache vecchie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Per navigazioni HTML: sempre rete, mai cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }
  // Per tutto il resto: network first, poi cache come fallback offline
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});

