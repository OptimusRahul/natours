/* eslint-disable*/

console.log('Hello from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja2VyYWh1bCIsImEiOiJjazQ3OWViOWYwY2puM21xbGs4c2t6NDN1In0.uDPl4qKaa-Cp9FO9fxJlHQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rockerahul/ck479qzyw0y021cqmkao90z15',
    scrollZoom: false
    // center: [-118.2018498,34.184593],
    // zoom: 10,
    // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    }).setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});