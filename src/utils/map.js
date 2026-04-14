export let map = L.map('map');
map.setView([59.325441, 18.071614], 13);

/* map.addControl(new L.Control.FullScreen()); */

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// user navigation 
navigator.geolocation.watchPosition(success, error);

let marker, circle, zoomed;

function success(pos) {
    console.log(pos);

    const lat = pos.coords.latitude; 
    const lng = pos.coords.longitude; 
    const accuracy = pos.coords.accuracy;

    if(marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, lng]).addTo(map);

    circle = L.circle([lat, lng], {
        radius: accuracy,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
    }).addTo(map);

    if(!zoomed && circle) {
        zoomed = map.fitBounds(circle.getBounds());
    }

    map.setView([lat, lng]);
}

function error(err) {
    if(err.code === 1) {
        alert("Accept Plot Twist to access your current location");
    } else {
        alert("Cannot get current location");
    }
}

