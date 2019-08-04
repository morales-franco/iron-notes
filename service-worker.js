const STATIC_CACHE = "static-cache-v1";
//const DYNAMIC_CACHE = "dynamic-cache-v1"; We don't use at the momente because that is to cache dynamic url & interact with indexdDb
const IMMUTABLE_CACHE = "immutable-cache-v1";

//urls to cache - App shell with url own of our app - making for us
const APP_SHELL = [
  // "/",
  "index.html",
  "views/note.html",
  "css/style.css",
  "img/iron_login.svg",
  "js/iron-service.js",
  "js/app.js",
  "js/home.js",
  "js/note.js",
  "img/favicon.ico"
];

//urls which never changes
const APP_SHELL_IMMUTABLE = [
  "css/bootstrap.min.css",
  "js/libs/plugins/mdtoast.min.css",
  "js/libs/plugins/mdtoast.min.js",
  "js/libs/jquery.min.js",
  "js/libs/popper.min.js",
  "js/libs/bootstrap.min.js"
];

//1 - Install SW
//Load caches with resources
self.addEventListener("install", event => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL));

  const cacheImmutable = caches
    .open(IMMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_IMMUTABLE));

  event.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

//2- Activate
//Remove old caches
//Alghoritm works only for static & immutable cache
self.addEventListener("activate", event => {
  const cleanCache = caches.keys().then(cacheNameList => {
    return Promise.all(
      cacheNameList.map(cacheName => {
        if (cacheName !== STATIC_CACHE && cacheName !== IMMUTABLE_CACHE) {
          console.log("delete", cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });

  event.waitUntil(cleanCache);
});

//3 - Fetch
//override request to server
self.addEventListener("fetch", event => {

  //We only cache GET REQUEST 
  if(event.request.method !== "GET") 
  return;

  //Don't cache entities from the backend
  if(event.request.url.includes("/api/"))
    return;

    //Check if the resource is in the CACHE
    //If it is not ==> retrieve the resource from server

    let resourceResponse = caches
    .match(event.request)
    .then(response => {
      return response || fetch(event.request);
    });

    event.respondWith(resourceResponse);

});
