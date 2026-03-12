const OPENTRIPMAP_KEY = "DEIN_OPENTRIPMAP_API_KEY";

async function getRecommendations(){
  const city = document.getElementById("city").value.trim();
  const interestsInput = document.getElementById("interests").value.toLowerCase();
  const timeInput = document.getElementById("time").value;

  const interests = interestsInput ? interestsInput.split(",").map(i=>i.trim()) : [];
  const maxTime = timeInput ? timeInput*60 : 9999;

  if(!city){
    alert("Bitte Stadt eingeben");
    return;
  }

  // 1️⃣ Stadt Koordinaten holen
  const geoResp = await fetch(`https://api.opentripmap.com/0.1/de/places/geoname?name=${encodeURIComponent(city)}&apikey=${OPENTRIPMAP_KEY}`);
  const geoData = await geoResp.json();
  const lat = geoData.lat;
  const lon = geoData.lon;

  // Map zentrieren
  map.setCenter({lat:lat, lng:lon});
  map.setZoom(12);

  // Marker löschen
  markers.forEach(m=>m.setMap(null));
  markers = [];

  // 2️⃣ Sehenswürdigkeiten holen
  const radius = 5000; // 5km
  const kinds = interests.length > 0 ? interests.join(",") : "interesting_places";
  const placesResp = await fetch(`https://api.opentripmap.com/0.1/de/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&apikey=${OPENTRIPMAP_KEY}&kinds=${kinds}&limit=50`);
  const placesData = await placesResp.json();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML="";

  let usedTime=0;

  for(let place of placesData.features){
    const name = place.properties.name;
    const category = place.properties.kinds.split(",")[0];
    const dist = place.properties.dist;

    const visitTime = 60; // Default 1h pro Ort

    if(usedTime + visitTime > maxTime) continue;

    usedTime += visitTime;

    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `<h3>${name}</h3><p>Kategorie: ${category}</p><p>Distanz zum Zentrum: ${Math.round(dist)} m</p>`;
    resultsDiv.appendChild(card);

    addMarker(place.geometry.coordinates[1], place.geometry.coordinates[0], name);
  }

}
