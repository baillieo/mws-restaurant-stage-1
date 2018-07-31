"use strict";!function(){function e(e){return new Promise(function(t,r){e.onsuccess=function(){t(e.result)},e.onerror=function(){r(e.error)}})}function t(t,r,n){var o,i=new Promise(function(i,a){e(o=t[r].apply(t,n)).then(i,a)});return i.request=o,i}function r(e,t,r){r.forEach(function(r){Object.defineProperty(e.prototype,r,{get:function(){return this[t][r]},set:function(e){this[t][r]=e}})})}function n(e,r,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return t(this[r],o,arguments)})})}function o(e,t,r,n){n.forEach(function(n){n in r.prototype&&(e.prototype[n]=function(){return this[t][n].apply(this[t],arguments)})})}function i(e,r,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return e=this[r],(n=t(e,o,arguments)).then(function(e){if(e)return new s(e,n.request)});var e,n})})}function a(e){this._index=e}function s(e,t){this._cursor=e,this._request=t}function c(e){this._store=e}function u(e){this._tx=e,this.complete=new Promise(function(t,r){e.oncomplete=function(){t()},e.onerror=function(){r(e.error)},e.onabort=function(){r(e.error)}})}function l(e,t,r){this._db=e,this.oldVersion=t,this.transaction=new u(r)}function f(e){this._db=e}r(a,"_index",["name","keyPath","multiEntry","unique"]),n(a,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(a,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(s,"_cursor",["direction","key","primaryKey","value"]),n(s,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(s.prototype[t]=function(){var r=this,n=arguments;return Promise.resolve().then(function(){return r._cursor[t].apply(r._cursor,n),e(r._request).then(function(e){if(e)return new s(e,r._request)})})})}),c.prototype.createIndex=function(){return new a(this._store.createIndex.apply(this._store,arguments))},c.prototype.index=function(){return new a(this._store.index.apply(this._store,arguments))},r(c,"_store",["name","keyPath","indexNames","autoIncrement"]),n(c,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(c,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),o(c,"_store",IDBObjectStore,["deleteIndex"]),u.prototype.objectStore=function(){return new c(this._tx.objectStore.apply(this._tx,arguments))},r(u,"_tx",["objectStoreNames","mode"]),o(u,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new c(this._db.createObjectStore.apply(this._db,arguments))},r(l,"_db",["name","version","objectStoreNames"]),o(l,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new u(this._db.transaction.apply(this._db,arguments))},r(f,"_db",["name","version","objectStoreNames"]),o(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[c,a].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,r=(t=arguments,Array.prototype.slice.call(t)),n=r[r.length-1],o=this._store||this._index,i=o[e].apply(o,r.slice(0,-1));i.onsuccess=function(){n(i.result)}})})}),[a,c].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var r=this,n=[];return new Promise(function(o){r.iterateCursor(e,function(e){e?(n.push(e.value),void 0===t||n.length!=t?e.continue():o(n)):o(n)})})})});var h={open:function(e,r,n){var o=t(indexedDB,"open",[e,r]),i=o.request;return i&&(i.onupgradeneeded=function(e){n&&n(new l(i.result,e.oldVersion,i.transaction))}),o.then(function(e){return new f(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=h,module.exports.default=module.exports):self.idb=h}();class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/"}static get dbPromise(){return navigator.serviceWorker?idb.open("restaurants",1,function(e){e.createObjectStore("restaurant-data",{keyPath:"id"}),e.createObjectStore("restaurant-reviews",{keyPath:"id"}),e.createObjectStore("restaurant-reviews-offline",{keyPath:"createdAt"})}):Promise.resolve()}static fetchRestaurants(e){let t=`${DBHelper.DATABASE_URL}restaurants`;DBHelper.dbPromise.then(r=>{r.transaction("restaurant-data").objectStore("restaurant-data").getAll().then(n=>{if(0!==n.length)return e(null,n);fetch(t).then(e=>e.json()).then(function(t){const n=r.transaction("restaurant-data","readwrite").objectStore("restaurant-data");return t.map(e=>n.put(e)),e(null,t)}).catch(t=>e(t,null))})})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.find(t=>t.id==e);r?t(null,r):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.cuisine_type==e);t(null,r)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.neighborhood==e);t(null,r)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,r){DBHelper.fetchRestaurants((n,o)=>{if(n)r(n,null);else{let n=o;"all"!=e&&(n=n.filter(t=>t.cuisine_type==e)),"all"!=t&&(n=n.filter(e=>e.neighborhood==t)),r(null,n)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,r)=>{if(t)e(t,null);else{const t=r.map((e,t)=>r[t].neighborhood),n=t.filter((e,r)=>t.indexOf(e)==r);e(null,n)}})}static fetchRestaurantReviews(e,t){DBHelper.dbPromise.then(r=>{r.transaction("restaurant-reviews").objectStore("restaurant-reviews").getAll().then(r=>{r.filter(t=>t.restaurant_id===e.id).length>0?t(null,r):fetch(`${DBHelper.DATABASE_URL}reviews/?restaurant_id=${e.id}`).then(e=>e.json()).then(e=>{this.dbPromise.then(t=>{const r=t.transaction("restaurant-reviews","readwrite").objectStore("restaurant-reviews");e.map(e=>r.put(e))}),t(null,e)}).catch(e=>{t(e,null)})})})}static submitReview(e){return fetch(`${DBHelper.DATABASE_URL}reviews`,{body:JSON.stringify(e),credentials:"same-origin",cache:"no-cache",headers:{"content-type":"application/json"},mode:"cors",method:"POST",referrer:"no-referrer",redirect:"follow"}).then(e=>{e.json().then(e=>(this.dbPromise.then(t=>{t.transaction("restaurant-reviews","readwrite").objectStore("restaurant-reviews").put(e)}),e))}).catch(t=>{e.updatedAt=(new Date).getTime(),this.dbPromise.then(t=>{t.transaction("restaurant-reviews-offline","readwrite").objectStore("restaurant-reviews-offline").put(e),console.log("Review stored offline")})})}static submitOfflineReviews(){DBHelper.dbPromise.then(e=>{if(!e)return;e.transaction("restaurant-reviews-offline").objectStore("restaurant-reviews-offline").getAll().then(e=>{console.log(e),e.forEach(e=>{DBHelper.submitReview(e)}),DBHelper.resetOfflineReviews()})})}static resetOfflineReviews(){DBHelper.dbPromise.then(e=>{e.transaction("offline-reviews","readwrite").objectStore("offline-reviews").clear()})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,r)=>{if(t)e(t,null);else{const t=r.map((e,t)=>r[t].cuisine_type),n=t.filter((e,r)=>t.indexOf(e)==r);e(null,n)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.photograph}.jpg`}static mapMarkerForRestaurant(e,t){const r=new L.marker([e.latlng.lat,e.latlng.lng],{title:e.name,alt:e.name,url:DBHelper.urlForRestaurant(e)});return r.addTo(newMap),r}static faveToggle(e,t){console.log(t),fetch(`${DBHelper.DATABASE_URL}restaurants/${e.id}/?is_favorite=${t}`,{method:"PUT"}).then(e=>e.json()).then(e=>(console.log(e),DBHelper.dbPromise.then(t=>{t.transaction("restaurant-data","readwrite").objectStore("restaurant-data").put(e)}),e)).catch(r=>{e.is_favorite=t,DBHelper.dbPromise.then(t=>{t.transaction("restaurant-data","readwrite").objectStore("restaurant-data").put(e)}).catch(e=>{console.log(e)})})}}
//# sourceMappingURL=maps/dbhelper.js.map
