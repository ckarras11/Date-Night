let clientId = "SSYNT1OJ1S0G44S211LRDRBAY530BAYWZYQXCXDUDN4DYAYK"
let clientSecret = "SKWPCMJ3315543VFGOUCQD5XEKKA1NKDJ2GRURT5EURRXUQA"
let coordinates = [];
let map;
//const URL = `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&ll=41.715624,-70.032247&query=restaurant&limit=100&radius=200000&v=20170323`;

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
			$("#nav").append('<h2>Search Again</h2>')
			//This creates list element for each item returned
			let list = ""
			data.response.groups[0].items.forEach(item => {
				list = list.concat(`<li class="itemResult">${item.venue.name}</li>`)
			})
			//This creates a lat long object for each item returned and pushes to array
			data.response.groups[0].items.forEach(item => {
				let obj = {lat: item.venue.location.lat,
						   lng: item.venue.location.lng};
				
				coordinates.push(obj);
			});
			//Initializes map after succesful api call
			initMap();
			//Loops through each item in coordinates array and creates a marker on the map
			console.log(coordinates.length);
			for (let i = 0; i < coordinates.length; i++) {
        		console.log(coordinates[i]);
          		let coords = coordinates[i];
          		let latLng = new google.maps.LatLng(coords.lat,coords.lng);
          		let marker = new google.maps.Marker({
            		position: latLng,
            		map: map
          			});
        	}
        	//Adds a ul element with the list created in for loop
			$('#results').append(`<ul id="resultsList">
									${list}
								  </ul>`);
			
		}

	});
};

//Handles search and passes value in search bar to query for api call
//The section arg is undefined because it will override a query

function handleQuery(){
	$('.search').on('click', '.submit', function(e){
		$('#results').html('');
		e.preventDefault();
		console.log('click')
		let query = $('.searchbar').val();
		console.log(query);
		$('#homepage').addClass("js-hide-display");
		getResponse(undefined, query);
		
	});
};

//Handles food button and passes 'food' to the section arg

function handleButtons(){
	$('#buttons').on('click', '#food', function(){
		$('#results').html('');
		$('#homepage').addClass("js-hide-display");
		let section = 'food';
		getResponse(section);
	});
};

//Creates map in #map div with map centered on lat long

function initMap() {
	console.log('initMap')
	map = new google.maps.Map(document.getElementById('map'), {
  		zoom: 12,
  		center: new google.maps.LatLng(41.715624,-70.032247),
  		mapTypeId: 'roadmap'
		});
}

$(handleQuery);
$(handleButtons);