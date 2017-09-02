var map;
var geocoder;
var info = {
	clientId: 'SSYNT1OJ1S0G44S211LRDRBAY530BAYWZYQXCXDUDN4DYAYK',
	start: {},
	coordinates: []
	}
 
// This function is the foursquare api call for results
function getResponse(section, query, nearMe) {
	let URL = `https://api.foursquare.com/v2/venues/explore?client_id=${info.clientId}
																 &client_secret=SKWPCMJ3315543VFGOUCQD5XEKKA1NKDJ2GRURT5EURRXUQA
																 &query=${query}
																 &ll=${info.start.lat},${info.start.lng}
																 &section=${section}
																 &limit=100
																 &radius=40000&v=20170323`
	// Checks if user is using lat lng or input a location
	/*if (info.start.lat && info.start.lng ){
		URL = `https://api.foursquare.com/v2/venues/explore?client_id=${info.clientId}
																 &client_secret=SKWPCMJ3315543VFGOUCQD5XEKKA1NKDJ2GRURT5EURRXUQA
																 &query=${query}
																 &ll=${info.start.lat},${info.start.lng}
																 &section=${section}
																 &limit=100
																 &radius=40000&v=20170323`;
	}
	else{
		 URL = `https://api.foursquare.com/v2/venues/explore?client_id=${info.clientId}
																 &client_secret=SKWPCMJ3315543VFGOUCQD5XEKKA1NKDJ2GRURT5EURRXUQA
																 &near=${nearMe}
																 &query=${query}
																 &section=${section}
																 &limit=100
																 &radius=40000&v=20170323`;
		}*/
	$.ajax({
		method: 'GET',
		url: URL,
		success: function(data) {
			createList(data);
			createLatLng(data);
			initMap();
			addMarkers();
			
		}

	});
};

$(function handleStart(document) {
	navigator.geolocation.getCurrentPosition(success, failure);
	handleQuery();
	handleButtons();
	searchAgain();
});


// Handles search and passes value in search bar to query for api call
// The section arg is undefined because it will override a query

function handleQuery() {
	$('.search').on('click', '.submit', function(e) {
		e.preventDefault();
		let query = $('.searchbar').val();
		let nearMe = $('#locationBar').val()
		// Prevents user from empty search
		if (query){
			getCoords(nearMe);
			setTimeout(function() {getResponse(undefined, query, nearMe);}, 1000);
			displayResults();
		}
		else{
			alert('Search field is empty')
		}	
	});
};

// Handles food, drinks, and fun button and passes 'food, drinks, or entertainment' to the section arg

function handleButtons() {
	$('#buttons').on('click', '#food', function() {
		displayResults();
		let section = 'food';
		let nearMe = $('#locationBar').val(); 
		getCoords(nearMe);
		setTimeout(function() {getResponse(section, undefined, nearMe);}, 1000);
		//getResponse(section,undefined, nearMe);
		
	});
	$('#buttons').on('click', '#drinks', function() {
		displayResults();
		let section = 'drinks';
		let nearMe = $('#locationBar').val();
		getCoords(nearMe);
		setTimeout(function() {getResponse(section, undefined, nearMe);}, 1000);
		//getResponse(section,undefined, nearMe);
	});
	$('#buttons').on('click', '#entertainment', function() {
		displayResults();
		let section = 'arts';
		let nearMe = $('#locationBar').val();
		getCoords(nearMe);
		setTimeout(function() {getResponse(section, undefined, nearMe);}, 1000);
		//getResponse(section,undefined, nearMe);
		
	});
};

// This creates list element for each item returned

function createList(data){	
	console.log(data);
	let list = "";
	if (data.response.totalResults !== 0){
		data.response.groups[0].items.forEach(item => {
			let i = data.response.groups[0].items.indexOf(item) + 1;
			// Checks to make sure there is data for each location to prevent displaying undefined
			let address = "";
			if (item.venue.location.address !== undefined) {
				address = item.venue.location.address;
			}
			let city = "";
			if (item.venue.location.city !== undefined) {
				city = item.venue.location.city;
			}
			let state = "";
			if (item.venue.location.state !== undefined) {
				state = item.venue.location.state;
			}
			let postalCode = "";
			if (item.venue.location.postalCode !== undefined) {
				postalCode = item.venue.location.postalCode;
			}
			let rating = "";
			// Creates the rating div for each item
			if (item.venue.rating !== undefined) {
				rating = `
				<div class="rating">
					<div class="score" style="background-color: #${item.venue.ratingColor};">
						${item.venue.rating}
					</div>
				</div>`
			}
			// Creates the result list for each item
			list = list.concat(`<li class="itemResult">
									<div class="info">
										<div class="venueName">
											${i}) ${item.venue.name}
										</div>
										<div class="location">
											${address} ${city}, ${state} ${postalCode}
										</div>
										<div class="moreInfo">
											<a href="https://foursquare.com/v/${item.venue.id}?ref=${info.clientId}" target="blank">More Info</a>
										</div>
									</div>
									${rating}
								</li>`)
		})
		// Adds a ul element with the list created in for loop
		$('#results').append(`<ul id="resultsList">
								${list}
							  </ul>`);	
	}	
	else{
		$('#results').append(`<ul id="resultsList" class="noResults">
								<li>No Results Found</li>
							  </ul>`)
	}
}

// This creates a lat long object for each item returned and pushes to array

function createLatLng(data) {
	data.response.groups[0].items.forEach(item => {
		let i = data.response.groups[0].items.indexOf(item) + 1;
		let obj = {lat: item.venue.location.lat,
				   lng: item.venue.location.lng,
				   name: item.venue.name,
				   index: i};		
		info.coordinates.push(obj);
	});
}

// Creates map in #map div with map centered on lat long

function getCoords(nearMe) {
	geocoder = new google.maps.Geocoder();
    $.ajax({
		method: 'GET',
		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${nearMe}&key=AIzaSyBZmXH7T-f4iTw8avMgTIhXbQj0Sx213Bo`,
		success: function(results) {
			if (results.status == 'OK') {
		        console.log(results.status);
		        console.log(results.results[0].geometry.location)
		        let lat = results.results[0].geometry.location.lat
		        let lng = results.results[0].geometry.location.lng
		        info.start.lat = lat;
				info.start.lng = lng;
		     } 
		     else {
		       	alert('Geocode was not successful for the following reason: ' + results.status);
		     }	
		}
	});
}

// Creates map in #map div with map centered on lat long


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
  		zoom: 12,
  		center: new google.maps.LatLng(info.start.lat,info.start.lng),
  		mapTypeId: 'roadmap'
		});
}

// Adds markers to the map from the coordinates array (data from foursquare lat long)

function addMarkers() {
	for (let i = 0; i < info.coordinates.length; i++) {
        let coords = info.coordinates[i];
        let latLng = new google.maps.LatLng(coords.lat,coords.lng);
        let marker = new google.maps.Marker({
            								position: latLng,
            								map: map,
            								title: `${coords.name}`
          									});
        // Creates info window for each marker showing name and index number

        let infoWindow = new google.maps.InfoWindow({
        	content: `${coords.index}) ${coords.name}`
        });
        marker.addListener('click', function() {
        	infoWindow.open(map, marker);
        });
    };
}

// Handles Search again button on the results page 

function searchAgain(){
	$('#nav').on('click', '.searchAgain', function(){
		$('#homepage').removeClass('js-hide-display');
		$('#container').addClass('js-hide-display');
		$('.mainContent').addClass('js-hide-display');
		$('#nav').addClass('js-hide-display');
		removeMarkers();
		$('.searchbar').val('');
	})
};

// Removes markers from map for new search

function removeMarkers() {
	info.coordinates = [];
};

// Adds and removes js-hide-display to display results

function displayResults() {
	$('#results').html('');
	$('#homepage').addClass('js-hide-display');
	$('#container').removeClass('js-hide-display');
	$('.mainContent').removeClass('js-hide-display');
	$('#nav').removeClass('js-hide-display');
	$('#map').removeClass('js-hide-display');
}

// Sets users location when geolocation is allowed by user

function success(position) {
	let lat = position.coords.latitude;
	let lng = position.coords.longitude;
	info.start.lat = lat;
	info.start.lng = lng;
}

// Alerts user that geolocation was blocked

function failure() {
	$('#location').removeClass('js-hide-display')
}
