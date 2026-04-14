export let map = L.map('map');
map.setView([59.325441, 18.071614], 13);

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


// easy button external plugin
// L.easyButton('fa-solid fa-slider', function () {
//     // window.location.href = NEW_DOCS_LOCATION;
//     window.location.href = "index.html";
// }).addTo(map);

//filter sunlight for plants
L.control.tagFilterButton({
    data: ['Ljusnivå: låg', 'Ljusnivå: medium', 'Ljusnivå: hög'],
    icon: '<i class="fa-solid fa-sun"></i>',
    filterOnEveryClick: true
}).addTo(map);

//filter plants type
L.control.tagFilterButton({
    data: ['Växt: kaktus', 'Växt: orkidé', 'Växt: monstera'],
    icon: '<i class="fa-solid fa-filter"></i>',
    filterOnEveryClick: true
}).addTo(map);

    
    L.marker([59.423183, 17.837015], { tags: ['Växt: kaktus', 'Ljusnivå: hög'] }).bindPopup('Växt: kaktus, Ljusnivå: hög, Ägs av: Jasmine').addTo(map); 

    L.marker([59.336440, 18.073259], { tags: ['Växt: kaktus', 'Ljusnivå: hög'] }).bindPopup('Växt: kaktus, Ljusnivå: hög, Ägs av: Maja').addTo(map); 
    L.marker([59.341474, 18.061715], { tags: ['Växt: kaktus', 'Ljusnivå: hög'] }).bindPopup('Växt: kaktus, Ljusnivå: hög, Ägs av: Anders').addTo(map);
    L.marker([59.454435, 17.807011], { tags: ['Växt: kaktus', 'Ljusnivå: hög'] }).bindPopup('Växt: kaktus, Ljusnivå: hög, Ägs av: Eman').addTo(map);
    L.marker([59.297004, 18.052816], { tags: ['Växt: orkidé', 'Ljusnivå: medium'] }).bindPopup('Växt: orkidé, Ljusnivå: medium, Ägs av: Bertil').addTo(map);
    L.marker([59.321276, 17.987813], { tags: ['Växt: orkidé', 'Ljusnivå: medium'] }).bindPopup('Växt: orkidé, Ljusnivå: medium, Ägs av: Ing-Marie').addTo(map);
    L.marker([59.360204, 18.006290], { tags: ['Växt: monstera', 'Ljusnivå: låg'] }).bindPopup('Växt: monstera, Ljusnivå: låg, Ägs av: Pontus').addTo(map);
    L.marker([59.401562, 18.090409], { tags: ['Växt: monstera', 'Ljusnivå: låg'] }).bindPopup('Växt: monstera, Ljusnivå: låg, Ägs av: Waraporn').addTo(map);

// display none on filter container if clicked another
// document.querySelectorAll('.easy-button-button').forEach(function (button) {
//     button.addEventListener('click', function () {
//         const targets = Array.from(document.querySelectorAll('.easy-button-button'))
//             .filter(el => el !== this);

//         targets.forEach(target => {
//             const container = target.parentElement.querySelector('.tag-filter-tags-container');
//             if (container) {
//                 container.style.display = 'none';
//             }
//         });
//     });
// });

jQuery('.easy-button-button').click(function () {
    let target = jQuery('.easy-button-button').not(this);
    target.parent().find('.tag-filter-tags-container').css({
        'display': 'none',
    });
});

    
document.querySelectorAll(".easy-button-button").forEach(function (button) {
    button.addEventListener("toggle", function () {
        let targets = Array.from(document.querySelectorAll('.easy-button-button'))
            .filter(el => el !== this);

        targets.forEach(target => {
            const container = target.parentElement.querySelector('.tag-filter-tags-container');
            if (container) {
                container.style.display = 'none';
            }
        });
    });
});

map.addEventListener("load", () => {
    console.log("Map is ready");
})