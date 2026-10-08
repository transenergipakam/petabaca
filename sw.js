/* Peta Baca: cache kerangka aplikasi supaya bisa dibuka tanpa jaringan.
   Berkas data/*.json TIDAK di-cache di sini (disimpan aplikasi di IndexedDB). */
var VERSI='petabaca-v1';
var INTI=['./','./index.html','./manifest.webmanifest',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSI).then(function(c){return c.addAll(INTI)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!=VERSI}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var u=e.request.url;
  if(e.request.method!='GET')return;
  if(u.indexOf('/data/')>=0||u.indexOf('openstreetmap.org')>=0||u.indexOf('google.com')>=0)return; /* selalu jaringan */
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){
    var f=fetch(e.request).then(function(n){if(n&&n.ok){var cp=n.clone();caches.open(VERSI).then(function(c){c.put(e.request,cp)})}return n}).catch(function(){return r});
    return r||f}))});
