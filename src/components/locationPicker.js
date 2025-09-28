// locationPicker.js - Enhanced with Leaflet Maps and OpenCage Geocoding
import L from "leaflet";

// Your OpenCage API key
const OPENCAGE_KEY = import.meta.env.VITE_OPENCAGE_KEY;

export function initLocationInput(
  containerId = "location-input-container",
  onLocationChange = (loc) => {},
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let searchTerm = "";
  let coordinates = { lat: "", lon: "" };
  let inputMode = "search"; // 'search' | 'coordinates' | 'map'
  let map = null;
  let marker = null;
  let searchTimeout = null;

  // Fix Leaflet default icon paths
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  // Render HTML
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex space-x-2">
        <button id="search-btn" class="px-3 py-1 text-sm rounded-lg transition-colors bg-blue-100 text-blue-700">Search</button>
        <button id="map-btn" class="px-3 py-1 text-sm rounded-lg transition-colors text-gray-500 hover:text-gray-700">Map</button>
        <button id="coords-btn" class="px-3 py-1 text-sm rounded-lg transition-colors text-gray-500 hover:text-gray-700">Coordinates</button>
      </div>

      <div id="search-mode" class="space-y-3">
        <div class="relative">
          <i class="fas fa-magnifying-glass absolute left-3 top-3 w-5 h-5 text-gray-400"></i>
          <input type="text" id="search-input" placeholder="Search for a city or location..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          <div id="search-loading" class="absolute right-3 top-3 hidden">
            <i class="fas fa-spinner animate-spin w-5 h-5 text-gray-400"></i>
          </div>
        </div>
        <div id="search-results" class="space-y-2 max-h-48 overflow-y-auto hidden"></div>
        <button id="current-location-btn" class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
          <i class="fas fa-map-pin w-4 h-4"></i>
          <span class="text-sm">Use Current Location</span>
        </button>
      </div>

      <div id="map-mode" class="space-y-3 hidden">
        <div class="text-sm text-gray-600 mb-2">Click on the map to select a location</div>
        <div id="map-container" class="w-full h-64 rounded-lg border border-gray-300"></div>
        <div id="map-coordinates" class="text-sm text-gray-500"></div>
      </div>

      <div id="coords-mode" class="space-y-3 hidden">
        <div class="grid grid-cols-2 gap-3">
          <input type="number" id="lat-input" placeholder="Latitude (-90 to 90)"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" step="0.000001" min="-90" max="90"/>
          <input type="number" id="lon-input" placeholder="Longitude (-180 to 180)"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" step="0.000001" min="-180" max="180"/>
        </div>
        <button id="set-coords-btn" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Set Location</button>
      </div>
    </div>
  `;

  // Elements
  const searchBtn = container.querySelector("#search-btn");
  const mapBtn = container.querySelector("#map-btn");
  const coordsBtn = container.querySelector("#coords-btn");
  const searchModeDiv = container.querySelector("#search-mode");
  const mapModeDiv = container.querySelector("#map-mode");
  const coordsModeDiv = container.querySelector("#coords-mode");
  const searchInput = container.querySelector("#search-input");
  const searchResults = container.querySelector("#search-results");
  const searchLoading = container.querySelector("#search-loading");
  const currentBtn = container.querySelector("#current-location-btn");
  const mapContainer = container.querySelector("#map-container");
  const mapCoordinates = container.querySelector("#map-coordinates");
  const latInput = container.querySelector("#lat-input");
  const lonInput = container.querySelector("#lon-input");
  const setCoordsBtn = container.querySelector("#set-coords-btn");

  // Mode switcher
  function switchMode(mode) {
    inputMode = mode;
    [searchBtn, mapBtn, coordsBtn].forEach((btn) => {
      btn.classList.remove("bg-blue-100", "text-blue-700");
      btn.classList.add("text-gray-500");
    });
    [searchModeDiv, mapModeDiv, coordsModeDiv].forEach((div) =>
      div.classList.add("hidden"),
    );

    if (mode === "search") {
      searchModeDiv.classList.remove("hidden");
      searchBtn.classList.add("bg-blue-100", "text-blue-700");
      searchBtn.classList.remove("text-gray-500");
    } else if (mode === "map") {
      mapModeDiv.classList.remove("hidden");
      mapBtn.classList.add("bg-blue-100", "text-blue-700");
      mapBtn.classList.remove("text-gray-500");
      initializeMap();
    } else if (mode === "coordinates") {
      coordsModeDiv.classList.remove("hidden");
      coordsBtn.classList.add("bg-blue-100", "text-blue-700");
      coordsBtn.classList.remove("text-gray-500");
    }
  }

  // Initialize Leaflet map
  function initializeMap() {
    if (map) map.remove();
    map = L.map(mapContainer).setView([40.7128, -74.006], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", async (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lon]).addTo(map);
      mapCoordinates.textContent = `Selected: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      const name = await reverseGeocode(lat, lon);
      onLocationChange({ lat, lon, name });
    });

    if (coordinates.lat && coordinates.lon) {
      const lat = parseFloat(coordinates.lat);
      const lon = parseFloat(coordinates.lon);
      map.setView([lat, lon], 13);
      marker = L.marker([lat, lon]).addTo(map);
      mapCoordinates.textContent = `Selected: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
  }

  // OpenCage forward geocoding
  async function geocodeSearch(query) {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_KEY}&limit=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.results.map((r) => ({
        name: r.formatted,
        lat: r.geometry.lat,
        lon: r.geometry.lng,
      }));
    } catch (e) {
      console.error("Geocoding error:", e);
      throw e;
    }
  }

  // OpenCage reverse geocoding
  async function reverseGeocode(lat, lon) {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_KEY}&no_annotations=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return (
        data.results[0]?.formatted || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      );
    } catch (e) {
      console.error("Reverse geocoding error:", e);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  function displaySearchResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="p-3 text-gray-500 text-sm">No results found.</div>';
      searchResults.classList.remove("hidden");
      return;
    }
    searchResults.innerHTML = results
      .map(
        (r) => `
      <button class="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors search-result-btn" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}">
        <div class="font-medium text-gray-900 text-sm">${r.name.split(",")[0]}</div>
        <div class="text-xs text-gray-500">${r.name}</div>
        <div class="text-xs text-gray-400 mt-1">${r.lat.toFixed(4)}, ${r.lon.toFixed(4)}</div>
      </button>`,
      )
      .join("");

    searchResults.querySelectorAll(".search-result-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const lat = parseFloat(e.currentTarget.dataset.lat);
        const lon = parseFloat(e.currentTarget.dataset.lon);
        const name = e.currentTarget.dataset.name;
        handleLocationSelect({ lat, lon, name });
        searchResults.classList.add("hidden");
      });
    });
    searchResults.classList.remove("hidden");
  }

  function handleLocationSelect(location) {
    coordinates = { lat: location.lat, lon: location.lon };
    if (inputMode === "search")
      searchInput.value =
        location.name ||
        `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`;
    onLocationChange(location);
  }

  function handleCoordinatesSubmit() {
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      alert(
        "Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)",
      );
      return;
    }
    coordinates = { lat, lon };
    reverseGeocode(lat, lon).then((name) => {
      onLocationChange({ lat, lon, name });
    });
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          reverseGeocode(location.lat, location.lon).then((name) => {
            location.name = name;
            searchInput.value = "Current Location";
            handleLocationSelect(location);
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to retrieve your location. Check browser settings.");
        },
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  }

  // Event listeners
  searchBtn.addEventListener("click", () => switchMode("search"));
  mapBtn.addEventListener("click", () => switchMode("map"));
  coordsBtn.addEventListener("click", () => switchMode("coordinates"));
  currentBtn.addEventListener("click", getCurrentLocation);
  setCoordsBtn.addEventListener("click", handleCoordinatesSubmit);

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    searchTerm = query;
    if (searchTimeout) clearTimeout(searchTimeout);
    if (query.length < 2) {
      searchResults.classList.add("hidden");
      return;
    }
    searchLoading.classList.remove("hidden");
    searchTimeout = setTimeout(async () => {
      try {
        const results = await geocodeSearch(query);
        displaySearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        searchResults.innerHTML =
          '<div class="p-3 text-red-600 text-sm">Search error. Try map or coordinates.</div>';
        searchResults.classList.remove("hidden");
      } finally {
        searchLoading.classList.add("hidden");
      }
    }, 300);
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) searchResults.classList.add("hidden");
  });
}
