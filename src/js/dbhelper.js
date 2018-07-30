
// idb library
"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function t(t,n,o){var r,i=new Promise(function(i,u){e(r=t[n].apply(t,o)).then(i,u)});return i.request=r,i}function n(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return t(this[n],r,arguments)})})}function r(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return this[t][o].apply(this[t],arguments)})})}function i(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return e=this[n],(o=t(e,r,arguments)).then(function(e){if(e)return new c(e,o.request)});var e,o})})}function u(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function p(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function a(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new p(n)}function f(e){this._db=e}n(u,"_index",["name","keyPath","multiEntry","unique"]),o(u,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(u,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,o=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,o),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),s.prototype.createIndex=function(){return new u(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new u(this._store.index.apply(this._store,arguments))},n(s,"_store",["name","keyPath","indexNames","autoIncrement"]),o(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),r(s,"_store",IDBObjectStore,["deleteIndex"]),p.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},n(p,"_tx",["objectStoreNames","mode"]),r(p,"_tx",IDBTransaction,["abort"]),a.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},n(a,"_db",["name","version","objectStoreNames"]),r(a,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new p(this._db.transaction.apply(this._db,arguments))},n(f,"_db",["name","version","objectStoreNames"]),r(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[s,u].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),o=n[n.length-1],r=this._store||this._index,i=r[e].apply(r,n.slice(0,-1));i.onsuccess=function(){o(i.result)}})})}),[u,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,o=[];return new Promise(function(r){n.iterateCursor(e,function(e){e?(o.push(e.value),void 0===t||o.length!=t?e.continue():r(o)):r(o)})})})});var d={open:function(e,n,o){var r=t(indexedDB,"open",[e,n]),i=r.request;return i&&(i.onupgradeneeded=function(e){o&&o(new a(i.result,e.oldVersion,i.transaction))}),r.then(function(e){return new f(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=d,module.exports.default=module.exports):self.idb=d}();
//# sourceMappingURL=maps/idb.js.map



/**
 * Common database helper functions.
 */

 class DBHelper {

	/**
	 * Database URL.
	 * Change this to restaurants.json file location on your server.
	 */
	 static get DATABASE_URL() {
		// const port = 8000 // Change this to your server port
		// return `http://localhost:${port}/data/restaurants.json`;

		// AJX via fetch
		const port = 1337 // Change this to your server port
		return `http://localhost:${port}/restaurants`;
	}

	/**
	 * Create indexedDb database
	 */
	 static get dbPromise(){
	 	if (!navigator.serviceWorker) {
	 		return Promise.resolve();
	 	} else {
	 		return idb.open('restaurants', 1, function (upgradeDb) {
	 			upgradeDb.createObjectStore('restaurant-data', { keyPath: 'id' });
	 		});
	 	}
	 }


	/**
	 * Fetch all restaurants.
	 */
	 static fetchRestaurants(callback) {
	 	let url = DBHelper.DATABASE_URL;
		// Try to pull data from indexedDb
		DBHelper.dbPromise.then(db => {
			const tx = db.transaction('restaurant-data');
			const objStore = tx.objectStore('restaurant-data');

			// If the indexedDb is empty send a network request and populate the indexedDb database
			objStore.getAll().then(objects => {
				if(objects.length === 0) {
					fetch(url)
					.then(res => res.json()) 
					.then(function(restaurants){ 
						// enable 'readwrite' to add objects to indexedDb 
						const tx = db.transaction('restaurant-data', 'readwrite');
						const objStore = tx.objectStore('restaurant-data');
						restaurants.map(res => objStore.put(res));
						// return restaurant objects from network request
						return callback(null, restaurants);
					}).catch(error => callback(error, null))
				} else {
					// return reswtaurant objects from indexedDb
					return callback(null, objects)
				}
			});
		});
	}

	/**
	 * Fetch a restaurant by its ID.
	 */
	 static fetchRestaurantById(id, callback) {
		// fetch all restaurants with proper error handling.
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const restaurant = restaurants.find(r => r.id == id);
				if (restaurant) { // Got the restaurant
					callback(null, restaurant);
				} else { // Restaurant does not exist in the database
					callback('Restaurant does not exist', null);
				}
			}
		});
	}

	/**
	 * Fetch restaurants by a cuisine type with proper error handling.
	 */
	 static fetchRestaurantByCuisine(cuisine, callback) {
		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given cuisine type
				const results = restaurants.filter(r => r.cuisine_type == cuisine);
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch restaurants by a neighborhood with proper error handling.
	 */
	 static fetchRestaurantByNeighborhood(neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given neighborhood
				const results = restaurants.filter(r => r.neighborhood == neighborhood);
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
	 */
	 static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				let results = restaurants
				if (cuisine != 'all') { // filter by cuisine
					results = results.filter(r => r.cuisine_type == cuisine);
				}
				if (neighborhood != 'all') { // filter by neighborhood
					results = results.filter(r => r.neighborhood == neighborhood);
				}
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch all neighborhoods with proper error handling.
	 */
	 static fetchNeighborhoods(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all neighborhoods from all restaurants
				const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
				// Remove duplicates from neighborhoods
				const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
				callback(null, uniqueNeighborhoods);
			}
		});
	}

	/**
	 * Fetch all cuisines with proper error handling.
	 */
	 static fetchCuisines(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all cuisines from all restaurants
				const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
				// Remove duplicates from cuisines
				const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
				callback(null, uniqueCuisines);
			}
		});
	}

	/**
	 * Restaurant page URL.
	 */
	 static urlForRestaurant(restaurant) {
	 	return (`./restaurant.html?id=${restaurant.id}`);
	 }

	/**
	 * Restaurant image URL.
	 */
	 static imageUrlForRestaurant(restaurant) {
	 	return (`/img/${restaurant.photograph}.jpg`);
	 }

	/**
	 * Map marker for a restaurant.
	 */
	 static mapMarkerForRestaurant(restaurant, map) {
		// https://leafletjs.com/reference-1.3.0.html#marker  
		const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
			{title: restaurant.name,
				alt: restaurant.name,
				url: DBHelper.urlForRestaurant(restaurant)
			})
		marker.addTo(newMap);
		return marker;
	} 
	/* static mapMarkerForRestaurant(restaurant, map) {
		const marker = new google.maps.Marker({
			position: restaurant.latlng,
			title: restaurant.name,
			url: DBHelper.urlForRestaurant(restaurant),
			map: map,
			animation: google.maps.Animation.DROP}
		);
		return marker;
	} */

	/**
 *Toggle favourite
 */
 static faveToggle(restaurant, isFave) {
 	console.log(isFave);
 	fetch(`${DBHelper.DATABASE_URL}/${restaurant.id}/?is_favorite=${isFave}`, {
 		method: 'PUT'
 	})
 	.then(res => res.json())
 	.then(data => {
 		console.log(data);
 		DBHelper.dbPromise.then(db => {
 			const tx = db.transaction('restaurant-data', 'readwrite');
 			const store = tx.objectStore('restaurant-data');
 			store.put(data)
 		});
 		return data;
 	})
 	.catch(error => {
 		restaurant.is_favorite = isFave;
 		DBHelper.dbPromise.then(db => {
 			const tx = db.transaction('restaurant-data', 'readwrite');
 			const store = tx.objectStore('restaurant-data');
 			store.put(restaurant);
 		}).catch(error => {
 			console.log(error);
 			return;
 		})
 	});
 }

}