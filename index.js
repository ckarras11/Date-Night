let clientId = "SSYNT1OJ1S0G44S211LRDRBAY530BAYWZYQXCXDUDN4DYAYK"
let clientSecret = "SKWPCMJ3315543VFGOUCQD5XEKKA1NKDJ2GRURT5EURRXUQA"
let coordinates = [];
let map;

//This function is the intital api call

function getResponse(section, query){
	console.log('load')
	const URL = `https://api.foursquare.com/v2/venues/explore?client_id=${clientId}
															 &client_secret=${clientSecret}
															 &ll=41.715624,-70.032247
															 &query=${query}
															 &section=${section}
															 &limit=100
															 &radius=40000&v=20170323`;
	$.ajax({
		method: "GET",
		url: URL,
		success: function(data){
			console.log(data);
			//This creates list element for each item returned
			let list = "";
			data.response.groups[0].items.forEach(item => {
				let i = data.response.groups[0].items.indexOf(item) + 1;
				/*let address = `${item.venue.location.address} 
							   ${item.venue.location.city}, 
							   ${item.venue.location.state} 
							   ${item.venue.location.postalCode}`*/
				let address = "";
				if (item.venue.location.address !== undefined){
					address = item.venue.location.address;
				}
				let city = "";
				if (item.venue.location.city !== undefined){
					city = item.venue.location.city;
				}
				let state = "";
				if (item.venue.location.state !== undefined){
					state = item.venue.location.state;
				}
				let postalCode = "";
				if (item.venue.location.postalCode !== undefined){
					postalCode = item.venue.location.postalCode;
				}

				let rating = "";
				if (item.venue.rating !== undefined){
					rating = `
					<div class="rating">
						<div class="score" style="background-color: #${item.venue.ratingColor};">
							${item.venue.rating}
						</div>
					</div>`
				}
				list = list.concat(`<li class="itemResult">
										<div class="info">
											<div class="venueName">
												${i}) ${item.venue.name}
											</div>
											<div class="location">
												${address} ${city}, ${state} ${postalCode}
											</div>
											<div class="moreInfo">
												<a href="https://foursquare.com/v/${item.venue.id}?ref=${clientId}" target="blank">More Info</a>
											</div>
										</div>
										${rating}
									</li>`)
			})
			//This creates a lat long object for each item returned and pushes to array
			data.response.groups[0].items.forEach(item => {
				let i = data.response.groups[0].items.indexOf(item) + 1;
				let obj = {lat: item.venue.location.lat,
						   lng: item.venue.location.lng,
						   name: item.venue.name,
						   index: i};
				
				coordinates.push(obj);
			});
			initMap();
			addMarkers();
			

			

        	//Adds a ul element with the list created in for loop
			$('#results').append(`<ul id="resultsList">
									${list}
								  </ul>`);
			
		}

	});
};

//Handles search and passes value in search bar to query for api call
//The section arg is undefined because it will override a query

$(function handleQuery(document){
	$('.search').on('click', '.submit', function(e){
		e.preventDefault();
		let query = $('.searchbar').val();
		displayResults();
		getResponse(undefined, query);
		
	});
});

//Handles food button and passes 'food' to the section arg

$(function handleButtons(document){
	$('#buttons').on('click', '#food', function(){
		displayResults();
		let section = 'food';
		getResponse(section);
	});
	$('#buttons').on('click', '#drinks', function(){
		displayResults();
		let section = 'drinks';
		getResponse(section);
	});
	$('#buttons').on('click', '#entertainment', function(){
		displayResults();
		let section = 'arts';
		getResponse(section);
	});
});

//Creates map in #map div with map centered on lat long

function initMap() {
	console.log('initMap')
	map = new google.maps.Map(document.getElementById('map'), {
  		zoom: 12,
  		center: new google.maps.LatLng(41.715624,-70.032247),
  		mapTypeId: 'roadmap'
		});
}

//Adds markers to the map from the coordinates array (data from foursquare lat long)

function addMarkers(){
	for (let i = 0; i < coordinates.length; i++) {
        let coords = coordinates[i];
        let latLng = new google.maps.LatLng(coords.lat,coords.lng);
        let marker = new google.maps.Marker({
            								position: latLng,
            								map: map,
            								title: `${coords.name}`
          									});
        //Creates info window showing name and index

        let infoWindow = new google.maps.InfoWindow({
        	content: `${coords.index}) ${coords.name}`
        });
        marker.addListener('click', function(){
        	infoWindow.open(map, marker);
        });
    };
}

//Handles Search again button on the results page

$(function searchAgain(document){
	$("#nav").on('click', '.searchAgain', function(){
		$('#homepage').removeClass("js-hide-display");
		$('#container').addClass("js-hide-display");
		$('.mainContent').addClass("js-hide-display");
		$('#nav').addClass("js-hide-display");

		removeMarkers();
		$(".searchbar").val("");


	})
});

// Removes markers from map for new search

function removeMarkers(){
	coordinates = [];
};

//Adds and removes js-hide-display to display results

function displayResults(){
	$('#results').html('');
	$('#homepage').addClass("js-hide-display");
	$('#container').removeClass("js-hide-display");
	$('.mainContent').removeClass("js-hide-display");
	$('#nav').removeClass("js-hide-display");
}