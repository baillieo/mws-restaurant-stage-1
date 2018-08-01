let restaurant;var newMap;const review_form=document.getElementById("review-form");document.addEventListener("DOMContentLoaded",e=>{initMap()}),initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.newMap=L.map("map",{center:[t.latlng.lat,t.latlng.lng],zoom:16,scrollWheelZoom:!1}),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1IjoiYmFpbGxpZW8iLCJhIjoiY2pqc3o4ZXNsMGVwMTNwbzZsM21yaDd2dCJ9.HO3p2IIO48Tir6PGL7u8mA",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',id:"mapbox.streets"}).addTo(newMap),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.newMap))})}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,r)=>{self.restaurant=r,r?DBHelper.fetchRestaurantReviews(self.restaurant,(t,a)=>{self.restaurant.reviews=a,a||console.error(t),fillRestaurantHTML(),e(null,r)}):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name;const t=document.getElementById("faveCon"),r=t.childNodes[1];r.dataset.check=e.is_favorite,"false"===r.dataset.check?(r.style.backgroundColor="#f3f3f3",r.setAttribute("aria-checked","false")):(r.style.backgroundColor="black",r.setAttribute("aria-checked","true")),t.addEventListener("click",function(){"false"===r.dataset.check?(r.dataset.check=!0,r.style.backgroundColor="black",r.setAttribute("aria-checked",!0)):(r.dataset.check=!1,r.style.backgroundColor="#f3f3f3",r.setAttribute("aria-checked",!1)),DBHelper.faveToggle(e,r.dataset.check)}),document.getElementById("restaurant-address").innerHTML=e.address;const a=document.getElementById("restaurant-img");a.className="restaurant-img",a.src=DBHelper.imageUrlForRestaurant(e),a.alt=`Image of ${e.name} Restaurant`,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let r in e){const a=document.createElement("tr"),n=document.createElement("td");n.innerHTML=r,a.appendChild(n);const s=document.createElement("td");s.innerHTML=e[r],a.appendChild(s),t.appendChild(a)}}),fillReviewsHTML=((e=self.restaurant.reviews,t=self.restaurant)=>{const r=document.getElementById("reviews-container");if(!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",e.setAttribute("tabindex",0),void r.appendChild(e)}const a=document.getElementById("reviews-list");console.log(e.filter(e=>e.restaurant_id===t.id)),e.filter(e=>e.restaurant_id===t.id).forEach(e=>{a.appendChild(createReviewHTML(e))})}),createReviewHTML=(e=>{const t=document.createElement("li");t.setAttribute("aria-label","review");const r=document.createElement("p");r.setAttribute("aria-label","Reviewer's name"),r.innerHTML=e.name;const a=document.createElement("p");a.setAttribute("aria-label","Review date"),a.innerHTML=(new Date).toDateString();const n=document.createElement("p");n.setAttribute("aria-label","Review rating"),n.innerHTML=`Rating: ${e.rating}`;const s=document.createElement("p");return s.setAttribute("aria-label","Review comments"),s.innerHTML=e.comments,t.appendChild(r),t.appendChild(a),t.appendChild(n),t.appendChild(s),t}),review_form.addEventListener("submit",function(e){e.preventDefault();const t=new FormData(review_form);let r={restaurant_id:self.restaurant.id};for(var[a,n]of t.entries())r[a]=n;DBHelper.submitReview(r).then(e=>{document.getElementById("reviews-list").appendChild(createReviewHTML(r)),review_form.reset()}).catch(e=>console.error(e))}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),r=document.createElement("li");r.innerHTML=e.name,r.setAttribute("aria-current","Page"),t.appendChild(r)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const r=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null});
//# sourceMappingURL=maps/restaurant_info.js.map
