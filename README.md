# Date Night

## Overview
This app allows users to search for places to go on "Date Night".  When a user searches for something the results are displayed in a list as
well as on a map for visual representation.

## GeoLocation
When the page first loads it will ask you for permission to collect your location.    This is done using html geolocation.  This data is 
used for the api call to foursquare as well as centering the google map to your position.  If the user declines an alert will state 
``'geolocation not available'``.

![image](https://user-images.githubusercontent.com/30561347/29737745-5b6d2e14-89e1-11e7-9215-2b04af63c2a6.png)

## Home Page
This is the main screen for the app.  The three buttons below the title are for ``food``, ``drinks``, or ``entertainment``.  If a user clicks on one 
of these buttons it will send an api request to foursquare with the corresponding section.  The search field allows a user to enter a 
specific place or type of food.  This value is used in the api call to foursquare as a ``query``.

## Results Page Map
When a user clicks on a button or types in a query and searches the homepage is hidden with ``js-hide-display`` and the results are
unhidden.  The map will take the location data from the foursquare api call and create markers which are placed.  The map is centered on 
the user's location.  

![image](https://user-images.githubusercontent.com/30561347/29737978-2c9a02a6-89e6-11e7-8a0a-e13434e91775.png)

## Results
The list is generated with javascript and the data recieved from the foursquare api.  The more info link takes the user to foursquare for 
more information such as menu, pictures, and reviews.

## Search Again
At the top of the screen you are able to search again which unhides the home page and hides the result page.  Also the markers are cleared 
by clearing the ``coordinates []`` and the search bar value is reset.  When another search is performed the dom is resest by setting results 
to an empty string.

## Technologies Used
* HTML
* CSS
* Javascript
* jQuery
* Google Maps Api
* Foursquare Api

## Responsive Design
This page was made responsive using ``flexbox`` and ``@media querys``
