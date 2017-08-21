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
				let address = `${item.venue.location.address} 
							   ${item.venue.location.city}, 
							   ${item.venue.location.state} 
							   ${item.venue.location.postalCode}`
				let rating;
				if (item.venue.rating !== undefined){
					rating = `
					<div class="rating">
						<div class="score" style="background-color: #${item.venue.ratingColor};">
							${item.venue.rating}
						</div>
					</div>`
				}
				else{
					rating = "";
				}
				list = list.concat(`<li class="itemResult">
										<div class="info">
											<div class="venueName">
												${item.venue.name}
											</div>
											<div class="location">
												${address}
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
				let obj = {lat: item.venue.location.lat,
						   lng: item.venue.location.lng,
						   name: item.venue.name};
				
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
		$('#results').html('');
		e.preventDefault();
		let query = $('.searchbar').val();
		$('#homepage').addClass("js-hide-display");
		$('#container').removeClass("js-hide-display");
		getResponse(undefined, query);
		
	});
});

//Handles food button and passes 'food' to the section arg

$(function handleButtons(document){
	$('#buttons').on('click', '#food', function(){
		$('#results').html('');
		$('#homepage').addClass("js-hide-display");
		$('#container').removeClass("js-hide-display");
		let section = 'food';
		getResponse(section);
	});
	$('#buttons').on('click', '#drinks', function(){
		$('#results').html('');
		$('#homepage').addClass("js-hide-display");
		$('#container').removeClass("js-hide-display");
		let section = 'drinks';
		getResponse(section);
	});
	$('#buttons').on('click', '#entertainment', function(){
		$('#results').html('');
		$('#homepage').addClass("js-hide-display");
		$('#container').removeClass("js-hide-display");
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
    }
}

//Handles Search again button on the results page

$(function searchAgain(document){
	$("#nav").on('click', '.searchAgain', function(){
		$('#homepage').removeClass("js-hide-display");
		$('#container').addClass("js-hide-display");
		removeMarkers();
		$(".searchbar").val("");


	})
});

function removeMarkers(){
	coordinates = [];
};

function toggleBounce(){
	$('#results').on('click', 'li', function(){
		console.log('click');
	})
}; 