<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Disaster App with Removal & Custom Disasters</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Mapbox GL JS -->
  <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
  <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />

  <!-- Mapbox GL Directions Plugin -->
  <script
    src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.js"></script>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.css"
    type="text/css"
  />

  <!-- Turf.js for geometry operations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Turf.js/6.5.0/turf.min.js"></script>

  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }
    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
    .ui-container {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 6px;
      padding: 16px;
      z-index: 2;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      width: 220px;
    }
    .ui-container h1 {
      margin: 0 0 1em 0;
      font-size: 1.2em;
      text-align: center;
    }
    .ui-button,
    .ui-input {
      display: block;
      width: 100%;
      margin: 0.5em 0;
      padding: 0.4em 0.6em;
      font-size: 1em;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    .ui-button {
      cursor: pointer;
      background-color: #f8f8f8;
      transition: background-color 0.2s;
    }
    .ui-button:hover {
      background-color: #eee;
    }
    .mapboxgl-ctrl-top-left {
      margin-top: 10px;
      margin-left: 10px;
    }
    .mapboxgl-popup-content {
      max-width: 320px;
    }
  </style>
</head>

<body>
  <!-- Map -->
  <div id="map"></div>

  <!-- UI Container -->
  <div class="ui-container">
    <h1>Disaster App</h1>

    <!-- Toggle Disaster Modes (Optional) -->
    <button id="toggleBlockBtn" class="ui-button">Enable Fire Mode</button>
    <button id="toggleFloodBtn" class="ui-button">Enable Flood Mode</button>
    <button id="toggleEarthquakeBtn" class="ui-button">Enable Earthquake Mode</button>

    <!-- Custom Disaster Controls -->
    <h3 style="margin-top:1em;">Add Custom Disaster</h3>
    <input id="customColorInput" class="ui-input" type="text" placeholder="Marker color (e.g. #FF0000)" />
    <input id="customTypeInput" class="ui-input" type="text" placeholder="Disaster Type Name" />
    <button id="startCustomBtn" class="ui-button">Start Adding Custom Disaster</button>

    <!-- Destination input -->
    <input
      id="destinationInput"
      class="ui-input"
      type="text"
      placeholder="Address or Lat,Lng..."
    />
    <button id="setDestBtn" class="ui-button">Set Destination</button>

    <!-- Focus user location -->
    <button id="focusMeBtn" class="ui-button">Focus on Me</button>
  </div>

  <script>
    'use strict';

    // ------------------------------------------
    // 1) BASIC MAP & DIRECTIONS
    // ------------------------------------------
    mapboxgl.accessToken =
      'pk.eyJ1IjoicmFsZHV0ZWsiLCJhIjoiY202MmR5MDViMHlmMjJucG5mcWw4emo4ZSJ9.Ox0uAsJ9O66fBpsEUOMXlw';

    // Default center = McMaster University
    const defaultCenter = [-79.9177, 43.2609];
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      interactive: false,
      controls: {
        inputs: false,
        instructions: true
      }
    });
    map.addControl(directions, 'top-left');

    // (Optional) set max bounds around Hamilton area, if desired
    const bounds = [
      [-80.3, 43.0],   // SW corner
      [-78.9, 44.0]    // NE corner
    ];
    map.setMaxBounds(bounds);

    // ------------------------------------------
    // 2) USER LOCATION
    // ------------------------------------------
    let userLocation = null;
    let userMarker = null;

    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          userLocation = [position.coords.longitude, position.coords.latitude];
          if (!userMarker) {
            userMarker = new mapboxgl.Marker({ color: 'green' })
              .setLngLat(userLocation)
              .addTo(map);
          } else {
            userMarker.setLngLat(userLocation);
          }
        },
        (err) => {
          console.warn('Geolocation error:', err);
          // No alert. Simply default to McMaster if we fail
          userLocation = defaultCenter;
          userMarker = new mapboxgl.Marker({ color: 'green' })
            .setLngLat(userLocation)
            .addTo(map);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // If geolocation not supported, default to McMaster
      userLocation = defaultCenter;
      userMarker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat(userLocation)
        .addTo(map);
    }

    document.getElementById('focusMeBtn').addEventListener('click', () => {
      if (userLocation) {
        map.flyTo({ center: userLocation, zoom: 14 });
      }
    });

    // ------------------------------------------
    // 3) LOAD SAFE HAVENS / FIRES FROM SERVER
    // (Example stubs; not strictly required)
    // ------------------------------------------
    let safeHavensData = [];
    let fireFeatures = [];
    let fireBuffers = [];

    map.on('load', () => {
      loadSafeHavens();
      loadFires();
    });

    async function loadSafeHavens() {
      try {
        const response = await fetch('/api/safe-havens');
        safeHavensData = await response.json();

        safeHavensData.forEach((haven) => {
          new mapboxgl.Marker({ color: 'yellow' })
            .setLngLat(haven.coords)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${haven.name}</h3><p>Safe Haven</p>`)
            )
            .addTo(map);
        });
      } catch (err) {
        console.error('Failed to load safe havens:', err);
      }
    }

    async function loadFires() {
      try {
        const response = await fetch('/api/fires');
        const fires = await response.json();

        fires.forEach((fire) => {
          const timePlaced = new Date().toLocaleString();
          const popupHTML = `
            <h3><a href="https://www.lioapplications.lrc.gov.on.ca/ForestFireInformationMap/index.html?viewer=FFIM.FFIM" target="_blank">
              Fire (Historical Data)
            </a></h3>
            <p>Time Placed: ${timePlaced}</p>
            <p>Blocked area due to Fire</p>
          `;
          new mapboxgl.Marker({ color: 'red' })
            .setLngLat(fire.coords)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
            .addTo(map);

          const firePoint = turf.point(fire.coords);
          const bufferPoly = turf.buffer(firePoint, 0.02, { units: 'kilometers' });
          fireFeatures.push(firePoint);
          fireBuffers.push(bufferPoly);
        });
      } catch (err) {
        console.error('Failed to load fires:', err);
      }
    }

    // ------------------------------------------
    // 4) DISASTER MODES (Fire/Flood/Earthquake)
    // ------------------------------------------
    let fireMode = false;
    let floodMode = false;
    let earthquakeMode = false;

    const toggleBlockBtn = document.getElementById('toggleBlockBtn');
    const toggleFloodBtn = document.getElementById('toggleFloodBtn');
    const toggleEarthquakeBtn = document.getElementById('toggleEarthquakeBtn');

    toggleBlockBtn.addEventListener('click', () => {
      fireMode = !fireMode;
      if (fireMode) {
        floodMode = false;
        earthquakeMode = false;
        toggleFloodBtn.textContent = 'Enable Flood Mode';
        toggleEarthquakeBtn.textContent = 'Enable Earthquake Mode';
      }
      toggleBlockBtn.textContent = fireMode ? 'Disable Fire Mode' : 'Enable Fire Mode';
    });

    toggleFloodBtn.addEventListener('click', () => {
      floodMode = !floodMode;
      if (floodMode) {
        fireMode = false;
        earthquakeMode = false;
        toggleBlockBtn.textContent = 'Enable Fire Mode';
        toggleEarthquakeBtn.textContent = 'Enable Earthquake Mode';
      }
      toggleFloodBtn.textContent = floodMode ? 'Disable Flood Mode' : 'Enable Flood Mode';
    });

    toggleEarthquakeBtn.addEventListener('click', () => {
      earthquakeMode = !earthquakeMode;
      if (earthquakeMode) {
        fireMode = false;
        floodMode = false;
        toggleBlockBtn.textContent = 'Enable Fire Mode';
        toggleFloodBtn.textContent = 'Enable Flood Mode';
      }
      toggleEarthquakeBtn.textContent = earthquakeMode
        ? 'Disable Earthquake Mode'
        : 'Enable Earthquake Mode';
    });

    // ------------------------------------------
    // 5) ADD CUSTOM DISASTER
    // ------------------------------------------
    let customAddMode = false;
    let customColor = '#000000';
    let customType = 'Custom';

    const customColorInput = document.getElementById('customColorInput');
    const customTypeInput = document.getElementById('customTypeInput');
    const startCustomBtn = document.getElementById('startCustomBtn');

    startCustomBtn.addEventListener('click', () => {
      const colorVal = customColorInput.value.trim() || '#000000';
      const typeVal = customTypeInput.value.trim() || 'Custom';
      customColor = colorVal;
      customType = typeVal;
      // Activate the "customAddMode"
      customAddMode = true;

      // Also disable any standard mode
      fireMode = false;
      floodMode = false;
      earthquakeMode = false;
      toggleBlockBtn.textContent = 'Enable Fire Mode';
      toggleFloodBtn.textContent = 'Enable Flood Mode';
      toggleEarthquakeBtn.textContent = 'Enable Earthquake Mode';

      alert('Click on the map to place your custom disaster marker.');
    });

    // ------------------------------------------
    // 6) CREATE/REMOVE MARKERS ON MAP CLICK
    // ------------------------------------------
    // We'll maintain a list of all "local" markers so we can remove them if needed
    const allMarkers = [];

    map.on('click', async (event) => {
      // If no standard or custom mode is active, do nothing
      if (!fireMode && !floodMode && !earthquakeMode && !customAddMode) {
        return;
      }

      if (!userLocation) {
        // If we still don't have user location, we won't proceed
        return;
      }

      const lngLat = [event.lngLat.lng, event.lngLat.lat];
      const timePlaced = new Date().toLocaleString();
      let markerColor = 'red';
      let disasterType = 'Fire';

      // If a custom mode is active, use the custom color & type
      if (customAddMode) {
        markerColor = customColor;
        disasterType = customType;
      } else {
        // Otherwise, use the toggles
        if (floodMode) {
          markerColor = 'blue';
          disasterType = 'Flood';
        } else if (earthquakeMode) {
          markerColor = 'brown';
          disasterType = 'Earthquake';
        }
      }

      // Generate appropriate link for historical data
      function getHistoricalLink(type) {
        if (type === 'Fire') {
          return 'https://www.lioapplications.lrc.gov.on.ca/ForestFireInformationMap/index.html?viewer=FFIM.FFIM';
        } else if (type === 'Flood') {
          return 'https://search.open.canada.ca/openmap/fe83a604-aa5a-4e46-903c-685f8b0cc33c';
        } else if (type === 'Earthquake') {
          return 'https://www.earthquakescanada.nrcan.gc.ca/stndon/NEDB-BNDS/bulletin-en.php';
        }
        // For custom disasters, we can show "No historical link" or just omit
        return '';
      }

      // Build the popup HTML
      const linkURL = getHistoricalLink(disasterType);
      const linkHTML = linkURL
        ? `<a href="${linkURL}" target="_blank">Historical Data on ${disasterType}</a>`
        : `<strong>${disasterType}</strong>`; // fallback

      // We'll store data for notes/edits
      const markerData = {
        marker: null, // will attach after creation
        disasterType,
        timePlaced,
        note: '',
        edits: []
      };

      function getPopupHTML() {
        const editsHTML = markerData.edits
          .map(e => `<li><strong>${e.time}:</strong> ${e.newNote}</li>`)
          .join('');
        const editHistory = editsHTML
          ? `<p><strong>Edit History:</strong></p><ul>${editsHTML}</ul>`
          : '';
        return `
          <h3>${linkHTML}</h3>
          <p><strong>Time Placed:</strong> ${markerData.timePlaced}</p>

          <label for="popupNoteInput">Note:</label>
          <textarea id="popupNoteInput" rows="2" style="width:100%;">${markerData.note}</textarea>
          <button id="saveNoteBtn">Save Note</button>
          <button id="removeMarkerBtn" style="margin-left:8px;">Remove Marker</button>

          ${editHistory}
        `;
      }

      const newMarker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat(lngLat)
        .addTo(map);

      // Attach to markerData so we can remove it later
      markerData.marker = newMarker;
      allMarkers.push(markerData);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(getPopupHTML());
      newMarker.setPopup(popup);

      function attachPopupListeners() {
        setTimeout(() => {
          const saveBtn = document.getElementById('saveNoteBtn');
          const removeBtn = document.getElementById('removeMarkerBtn');
          if (saveBtn) {
            saveBtn.addEventListener('click', () => {
              const textArea = document.getElementById('popupNoteInput');
              if (!textArea) return;
              const newNote = textArea.value.trim();
              if (newNote !== markerData.note) {
                markerData.edits.push({
                  time: new Date().toLocaleString(),
                  newNote
                });
                markerData.note = newNote;
              }
              popup.setHTML(getPopupHTML());
              attachPopupListeners();
            });
          }
          if (removeBtn) {
            removeBtn.addEventListener('click', () => {
              // Remove from map
              newMarker.remove();
              // Remove from our allMarkers array
              const idx = allMarkers.indexOf(markerData);
              if (idx > -1) {
                allMarkers.splice(idx, 1);
              }
            });
          }
        }, 0);
      }

      popup.on('open', () => {
        attachPopupListeners();
      });

      // If we were adding a custom marker, turn off customAddMode after 1 placement
      if (customAddMode) {
        customAddMode = false;
      }

      // If it's a standard "Fire", also create a small buffer
      if (disasterType === 'Fire') {
        const firePoint = turf.point(lngLat);
        const bufferPoly = turf.buffer(firePoint, 0.02, { units: 'kilometers' });
        fireFeatures.push(firePoint);
        fireBuffers.push(bufferPoly);
      }

      // --------------------------
      // 7) Send a "Warning" if <20km from user
      // --------------------------
      const distanceKm = turf.distance(turf.point(userLocation), turf.point(lngLat), {
        units: 'kilometers'
      });
      if (distanceKm <= 20) {
        // Get approximate direction
        const bearing = turf.bearing(turf.point(userLocation), turf.point(lngLat));
        const direction = bearingToCardinal(bearing);
        alert(
          `Warning: A ${disasterType} was placed ${distanceKm.toFixed(1)} km ` +
          `to your ${direction}!`
        );
      }
    });

    // Helper: convert bearing to a rough cardinal direction
    function bearingToCardinal(bearing) {
      // Normalize to 0-360
      const angle = (bearing + 360) % 360;
      if (angle >= 22.5 && angle < 67.5) return 'NE';
      if (angle >= 67.5 && angle < 112.5) return 'E';
      if (angle >= 112.5 && angle < 157.5) return 'SE';
      if (angle >= 157.5 && angle < 202.5) return 'S';
      if (angle >= 202.5 && angle < 247.5) return 'SW';
      if (angle >= 247.5 && angle < 292.5) return 'W';
      if (angle >= 292.5 && angle < 337.5) return 'NW';
      return 'N';
    }

    // ------------------------------------------
    // 8) DESTINATION INPUT
    // ------------------------------------------
    let customDestinationActive = false;
    const destinationInput = document.getElementById('destinationInput');
    const setDestBtn = document.getElementById('setDestBtn');

    setDestBtn.addEventListener('click', () => {
      const inputValue = destinationInput.value.trim();
      if (!inputValue) {
        alert('Please enter a destination (address or lat,lng).');
        return;
      }
      customDestinationActive = true;

      directions.setOrigin(userLocation || defaultCenter);

      // If user enters "lat,lng" or "lng,lat"
      const coords = inputValue.split(',');
      if (coords.length === 2) {
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          directions.setDestination([lng, lat]);
          return;
        }
      }
      // Otherwise, treat as an address/place name
      directions.setDestination(inputValue);
    });
  </script>
</body>
</html>