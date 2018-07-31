// Installation
var Cache = 'restaurant-cache';
var urlsToCache = [
  '/',
  'index.html',
  'restaurant.html',
  'css/maps/styles.css.map',
  'css/styles.css',
  'css/images/layers-2x.png',
  'css/images/marker-icon-2x.png',
  'css/images/marker-icon.png',
  'css/images/marker-shadow.png',
  'css/images/layers.png',
  'js/maps/leaflet.js.map',
  'js/maps/dbhelper.js.map',
  'js/maps/main.js.map',
  'js/maps/restaurant_info.js.map',
  'js/leaflet.js',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'data/restaurants.json',
  'manifest.json',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
];

// Initialise the service worker
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(Cache)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

// Retrieve assests from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
    .catch(err => console.log(err, event.request))
  );
});