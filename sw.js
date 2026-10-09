/* Peta Baca (BARAKUDA) - simpanan offline. Jaringan dulu, cadangan simpanan. */
var VERSI='petabaca-v2';
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!=VERSI}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var u=e.request.url;
  if(e.request.method!='GET')return;
  if(u.indexOf('tile.openstreetmap.org')>=0||u.indexOf('google.com')>=0)return;
  e.respondWith(fetch(e.request).then(function(n){
      if(n&&n.ok&&n.type!='opaque'){var cp=n.clone();caches.open(VERSI).then(function(c){c.put(e.request,cp)})}
      return n}).catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(r){
        return r||new Response('<h2 style="font-family:sans-serif;padding:20px">Tidak ada jaringan dan halaman ini belum pernah dibuka di HP ini.</h2>',{headers:{'Content-Type':'text/html;charset=utf-8'}})})}))});
