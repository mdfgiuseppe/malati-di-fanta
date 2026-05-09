const CACHE_VERSION = '20260509_1033';
const CACHE_NAME = 'mdf-' + CACHE_VERSION;
const LOGO_CACHE = 'mdf-logo-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== LOGO_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

function _buildManifest(logoUrl) {
  var icons = [{src: '/malati-di-fanta/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable'}];
  if (logoUrl) icons.unshift({src: logoUrl, sizes: '512x512', purpose: 'any'});
  return JSON.stringify({
    name: 'Malati di Fanta', short_name: 'MdF',
    description: 'Fantacalcio Manageriale Continuativo',
    start_url: '/malati-di-fanta/', scope: '/malati-di-fanta/',
    display: 'standalone', orientation: 'portrait',
    theme_color: '#10b981', background_color: '#07090f',
    icons: icons
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  // Manifest dinamico: legge il logo URL dalla cache e lo inietta
  if (url.pathname === '/malati-di-fanta/manifest.json') {
    event.respondWith(
      caches.open(LOGO_CACHE)
        .then(c => c.match('/malati-di-fanta/_logo_url'))
        .then(r => r ? r.text() : null)
        .then(logoUrl => new Response(_buildManifest(logoUrl), {
          headers: {'Content-Type': 'application/manifest+json'}
        }))
    );
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

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
