let restaurant;
var newMap;
const review_form = document.getElementById("review-form");
/**
 * Initialize map as soon as the page is loaded.
 */
 document.addEventListener('DOMContentLoaded', (event) => {  
 	initMap();

 });


/**
 * Initialize leaflet map
 */
 initMap = () => {
 	fetchRestaurantFromURL((error, restaurant) => {
		if (error) { // Got an error!
			console.error(error);
		} else {      
			self.newMap = L.map('map', {
				center: [restaurant.latlng.lat, restaurant.latlng.lng],
				zoom: 16,
				scrollWheelZoom: false
			});
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
				mapboxToken: 'pk.eyJ1IjoiYmFpbGxpZW8iLCJhIjoiY2pqc3o4ZXNsMGVwMTNwbzZsM21yaDd2dCJ9.HO3p2IIO48Tir6PGL7u8mA',
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
				'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				id: 'mapbox.streets'    
			}).addTo(newMap);
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
		}
	});
 }  
 
/* window.initMap = () => {
	fetchRestaurantFromURL((error, restaurant) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			self.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 16,
				center: restaurant.latlng,
				scrollwheel: false
			});
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
		}
	});
} */

/**
 * Get current restaurant from page URL.
 */
 fetchRestaurantFromURL = (callback) => {
	if (self.restaurant) { // restaurant already fetched!
		callback(null, self.restaurant)
		return;
	}
	const id = getParameterByName('id');
	if (!id) { // no id found in URL
		error = 'No restaurant id in URL'
		callback(error, null);
	} else {
		DBHelper.fetchRestaurantById(id, (error, restaurant) => {
			self.restaurant = restaurant;
			if (!restaurant) {
				console.error(error);
				return;
			}
			DBHelper.fetchRestaurantReviews(self.restaurant, (error, reviews) => {
				self.restaurant.reviews = reviews;
				if (!reviews) {
					console.error(error);
				}
				fillRestaurantHTML();
				callback(null, restaurant)
			});
		});
	}
}

/**
 * Create restaurant HTML and add it to the webpage
 */
 fillRestaurantHTML = (restaurant = self.restaurant) => {
 	const name = document.getElementById('restaurant-name');
 	name.innerHTML = restaurant.name;

	// Import checkbox details whilst the restaurant is being rendered
	const faveCon = document.getElementById('faveCon');
	const faveBox = faveCon.childNodes[1];
	faveBox.dataset.check = restaurant.is_favorite;
	if(faveBox.dataset.check === "false"){
		faveBox.style.backgroundColor = "#f3f3f3";
		faveBox.setAttribute('aria-checked', 'false');
	} else {
		faveBox.style.backgroundColor = "black";
		faveBox.setAttribute('aria-checked', 'true');
	}

	faveCon.addEventListener('click', function(){
		if(faveBox.dataset.check === "false"){
			faveBox.dataset.check = true;
			faveBox.style.backgroundColor = "black";
			faveBox.setAttribute('aria-checked', true);
		} else {
			faveBox.dataset.check = false;
			faveBox.style.backgroundColor = "#f3f3f3";
			faveBox.setAttribute('aria-checked', false);
		}
		DBHelper.faveToggle(restaurant, faveBox.dataset.check)
	})

	const address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;

	const image = document.getElementById('restaurant-img');
	image.className = 'restaurant-img'
	image.src = DBHelper.imageUrlForRestaurant(restaurant);
	image.alt = `Image of ${restaurant.name} Restaurant` ;

	const cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	
	// fill reviews
	fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
 fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
 	const hours = document.getElementById('restaurant-hours');
 	for (let key in operatingHours) {
 		const row = document.createElement('tr');

 		const day = document.createElement('td');
 		day.innerHTML = key;
 		row.appendChild(day);

 		const time = document.createElement('td');
 		time.innerHTML = operatingHours[key];
 		row.appendChild(time);

 		hours.appendChild(row);
 	}
 }

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews, restaurant = self.restaurant) => {
	const container = document.getElementById('reviews-container');
	
	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		noReviews.setAttribute('tabindex', 0);
		container.appendChild(noReviews);
		return;
	}
	const ul = document.getElementById('reviews-list');
	console.log(reviews.filter(res => res.restaurant_id === restaurant.id))
	reviews.filter(res => res.restaurant_id === restaurant.id).forEach(review => {
		ul.appendChild(createReviewHTML(review));
	});
}


/**
 * Create review HTML and add it to the webpage.
 */
 createReviewHTML = (review) => {
 	const li = document.createElement('li');
 	li.setAttribute('aria-label', 'review');

 	const name = document.createElement('p');
 	name.setAttribute('aria-label', 'Reviewer\'s name');
 	name.innerHTML = review.name;
 	name.tabIndex = 0;


 	const date = document.createElement('p');
 	date.setAttribute('aria-label', 'Review date');
 	date.innerHTML = new Date().toDateString();
 	date.tabIndex = 0;

 	const rating = document.createElement('p');
 	rating.setAttribute('aria-label', 'Review rating');
 	rating.innerHTML = `Rating: ${review.rating}`;
 	rating.tabIndex = 0;

 	const comments = document.createElement('p');
 	comments.setAttribute('aria-label', 'Review comments');
 	comments.innerHTML = review.comments;
 	comments.tabIndex = 0;

 	li.appendChild(name);
 	li.appendChild(date);
 	li.appendChild(rating);
 	li.appendChild(comments);

 	return li;
 }

/**
 * Submitting review form
 */


 review_form.addEventListener("submit", function (event) {
 	event.preventDefault();
 	const data = new FormData(review_form);
 	let review = {"restaurant_id": self.restaurant.id};
	// Reverse values
	for (var [key, value] of data.entries()) {
		review[key] = value;
	}
	DBHelper.submitReview(review)
	.then(data => {
		const ul = document.getElementById('reviews-list');
		ul.appendChild(createReviewHTML(review));
		review_form.reset();
	})
	.catch(error => console.error(error))
});



/**
 * Add restaurant name to the breadcrumb navigation menu
 */
 fillBreadcrumb = (restaurant=self.restaurant) => {
 	const breadcrumb = document.getElementById('breadcrumb');
 	const li = document.createElement('li');
 	li.innerHTML = restaurant.name;
 	li.setAttribute('aria-current', 'Page');
 	breadcrumb.appendChild(li);
 }

/**
 * Get a parameter by name from page URL.
 */
 getParameterByName = (name, url) => {
 	if (!url)
 		url = window.location.href;
 	name = name.replace(/[\[\]]/g, '\\$&');
 	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
 	results = regex.exec(url);
 	if (!results)
 		return null;
 	if (!results[2])
 		return '';
 	return decodeURIComponent(results[2].replace(/\+/g, ' '));
 }

