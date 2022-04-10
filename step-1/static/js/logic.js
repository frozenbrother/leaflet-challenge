// store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a map tile  layer

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Grab the data with d3

d3.json(queryUrl, function(response) {
  var response = response.features

  function getColor(d) {
    return d > 5  ? '#800026' :
           d > 4  ? '#FC4E2A' :
           d > 3   ? '#FD8D3C' :
           d > 2  ? '#FEB24C' :
           d > 1   ? '#CBFFDD' :
                      '#6DFF3E';
  }
 
  // Loop through the cities create markers for each city object

  for (var i = 0; i < response.length; i++) {
    var latitude = response[i].geometry.coordinates[1];
    var longitude = response[i].geometry.coordinates[0];

    // Add markers to map

    L.circle([latitude, longitude], {
      fillOpacity: 0.6,
      color: "black",
      fillColor: getColor(response[i].properties.mag),

      // Adjust radius

      radius: response[i].properties.mag*8000,
      weight: 1
    }).bindPopup("<h1>" + response[i].properties.place + "</h1> <hr> <h3>Magnitude: " + response[i].properties.mag + "</h3>").addTo(myMap).on('mouseover',function(ev) {
      ev.target.openPopup();
    });
  }
 
  // Add legend

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (myMap) {

		var div = L.DomUtil.create('div', 'info legend'),
			mhis = [0, 1, 2, 3, 4, 5],
			labels = [],
			from, to;

		for (var i = 0; i < mhis.length; i++) {
			from = mhis[i];
			to = mhis[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(myMap);  


});