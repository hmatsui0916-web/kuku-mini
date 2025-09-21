/* offline-first service worker */
// 旧: const CACHE = "kuku-mini-v1";
const CACHE = "kuku-mini-v2";

const CORE = ["/", "/index.html", "/manifest.webmanifest"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const isHTML = req.headers.get("accept")?.includes("text/html");
  if (isHTML) {
    e.respondWith(fetch(req).then((res)=>{caches.open(CACHE).then((c)=>c.put(req,res.clone()));return res;})
      .catch(()=>caches.match(req).then((r)=>r||caches.match("/"))));
  } else {
    e.respondWith(caches.match(req).then((hit)=>hit||fetch(req).then((res)=>{caches.open(CACHE).then((c)=>c.put(req,res.clone()));return res;})));
  }
});
