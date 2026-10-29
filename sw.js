/* Service worker do Level Up System: deixa o app abrir sem internet. */
var V='lus-v2';
var CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  /* Open Food Facts e outras APIs: sempre rede, sem cache */
  if(u.hostname.indexOf('openfoodfacts')>=0)return;
  /* páginas: rede primeiro, cache como reserva (assim atualizações chegam) */
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(function(res){var c=res.clone();caches.open(V).then(function(ch){ch.put('./index.html',c)});return res}).catch(function(){return caches.match('./index.html')}));return}
  /* demais arquivos e fontes: cache primeiro */
  e.respondWith(caches.match(r).then(function(h){return h||fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var c=res.clone();caches.open(V).then(function(ch){ch.put(r,c)})}return res})}));
});
