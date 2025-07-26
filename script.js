let map;
let marker;

function getLocation() {
  const output = document.getElementById('output');
  const mapDiv = document.getElementById('map');
  const btn = document.getElementById('locateBtn');

  btn.disabled = true;
  btn.innerText = "Locating... ";

  if (!navigator.geolocation) {
    output.innerText = "Geolocation is not supported by your browser.";
    resetButton();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      output.innerText = ` Latitude: ${lat.toFixed(5)}, Longitude: ${lon.toFixed(5)}`;

      mapDiv.classList.add("visible");

      if (!map) {
        map = L.map("map").setView([lat, lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);
      } else {
        map.setView([lat, lon], 13);
      }

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lon], {
        bounceOnAdd: true,
        bounceOnAddOptions: { duration: 500, height: 100 },
      })
        .addTo(map)
        .bindPopup("You are here! ")
        .openPopup();

      resetButton();
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          output.innerText = "Permission denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          output.innerText = "Location unavailable.";
          break;
        case error.TIMEOUT:
          output.innerText = "Request timed out.";
          break;
        default:
          output.innerText = "An unknown error occurred.";
      }
      resetButton();
    }
  );
}

function resetButton() {
  const btn = document.getElementById('locateBtn');
  btn.disabled = false;
  btn.innerText = "Find My Location";
}
