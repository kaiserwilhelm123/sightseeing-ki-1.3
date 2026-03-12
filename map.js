let map;
let markers = [];

function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:0, lng:0},
    zoom: 2
  });
}

function addMarker(lat, lng, name){
  let marker = new google.maps.Marker({
    position: {lat:lat, lng:lng},
    map: map,
    title: name
  });
  markers.push(marker);
}
