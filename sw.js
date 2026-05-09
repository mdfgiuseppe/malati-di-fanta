const CACHE_VERSION = '20260509_1041';
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

// Riceve logo URL dalla pagina, lo scarica e lo cacha come risorsa same-origin
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'setLogoUrl') {
    var logoUrl = event.data.url;
    caches.open(LOGO_CACHE).then(function(c) {
      c.put('/malati-di-fanta/_logo_url', new Response(logoUrl));
      fetch(logoUrl, {mode: 'no-cors'}).then(function(res) {
        if (res) c.put('/malati-di-fanta/_logo_img', res);
      }).catch(function(){});
    });
  }
});

function _buildManifest(hasLogo) {
  var icons = [{src: '/malati-di-fanta/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable'}];
  if (hasLogo) icons.unshift({src: '/malati-di-fanta/_logo_img', sizes: '512x512', purpose: 'any'});
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

  // Serve il logo come risorsa same-origin (proxy per manifest icon)
  if (url.pathname === '/malati-di-fanta/_logo_img') {
    event.respondWith(
      caches.open(LOGO_CACHE)
        .then(c => c.match('/malati-di-fanta/_logo_img'))
        .then(r => r || fetch('/malati-di-fanta/icon.svg'))
    );
    return;
  }

  // Manifest dinamico: usa _logo_img se disponibile in cache
  if (url.pathname === '/malati-di-fanta/manifest.json') {
    event.respondWith(
      caches.open(LOGO_CACHE)
        .then(c => c.match('/malati-di-fanta/_logo_img'))
        .then(r => new Response(_buildManifest(!!r), {
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
