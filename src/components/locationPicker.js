// locationInput.js
export function initLocationInput(
  containerId = "location-input-container",
  onLocationChange = (loc) => {},
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // State variables
  let searchTerm = "";
  let coordinates = { lat: "", lon: "" };
  let inputMode = "search"; // 'search' | 'coordinates'

  const popularLocations = [
    { name: "New York, NY", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles, CA", lat: 34.0522, lon: -118.2437 },
    { name: "London, UK", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
  ];

  // Render HTML
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex space-x-2">
        <button id="search-btn" class="px-3 py-1 text-sm rounded-lg transition-colors bg-blue-100 text-blue-700">Search</button>
        <button id="coords-btn" class="px-3 py-1 text-sm rounded-lg transition-colors text-gray-500 hover:text-gray-700">Coordinates</button>
      </div>

      <div id="search-mode" class="space-y-3">
        <div class="relative">
          <i class="fas fa-magnifying-glass absolute left-3 top-3 w-5 h-5 text-gray-400"></i>
          <input
            type="text"
            id="search-input"
            placeholder="Search for a city or location..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        <div id="popular-locations" class="flex flex-wrap gap-2"></div>
        <button id="current-location-btn" class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
          <i class="fas fa-map-pin w-4 h-4"></i>
          <span class="text-sm">Use Current Location</span>
        </button>
      </div>

      <div id="coords-mode" class="space-y-3 hidden">
        <div class="grid grid-cols-2 gap-3">
          <input
            type="number"
            id="lat-input"
            placeholder="Latitude (-90 to 90)"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.000001"
            min="-90"
            max="90"
          />
          <input
            type="number"
            id="lon-input"
            placeholder="Longitude (-180 to 180)"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.000001"
            min="-180"
            max="180"
          />
        </div>
        <button id="set-coords-btn" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Set Location</button>
      </div>
    </div>
  `;

  // Elements
  const searchBtn = container.querySelector("#search-btn");
  const coordsBtn = container.querySelector("#coords-btn");
  const searchModeDiv = container.querySelector("#search-mode");
  const coordsModeDiv = container.querySelector("#coords-mode");
  const searchInput = container.querySelector("#search-input");
  const popularDiv = container.querySelector("#popular-locations");
  const currentBtn = container.querySelector("#current-location-btn");
  const latInput = container.querySelector("#lat-input");
  const lonInput = container.querySelector("#lon-input");
  const setCoordsBtn = container.querySelector("#set-coords-btn");

  // Functions
  function switchMode(mode) {
    inputMode = mode;
    if (mode === "search") {
      searchModeDiv.classList.remove("hidden");
      coordsModeDiv.classList.add("hidden");
      searchBtn.classList.add("bg-blue-100", "text-blue-700");
      searchBtn.classList.remove("text-gray-500");
      coordsBtn.classList.remove("bg-blue-100", "text-blue-700");
      coordsBtn.classList.add("text-gray-500");
    } else {
      coordsModeDiv.classList.remove("hidden");
      searchModeDiv.classList.add("hidden");
      coordsBtn.classList.add("bg-blue-100", "text-blue-700");
      coordsBtn.classList.remove("text-gray-500");
      searchBtn.classList.remove("bg-blue-100", "text-blue-700");
      searchBtn.classList.add("text-gray-500");
    }
  }

  function handleLocationSelect(location) {
    searchTerm = location.name || "";
    searchInput.value = searchTerm;
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
    onLocationChange(coordinates);
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: "Current Location",
          };
          searchInput.value = "Current Location";
          onLocationChange(location);
        },
        () =>
          alert(
            "Unable to retrieve your location. Please enter coordinates manually.",
          ),
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  // Event Listeners
  searchBtn.addEventListener("click", () => switchMode("search"));
  coordsBtn.addEventListener("click", () => switchMode("coordinates"));
  currentBtn.addEventListener("click", getCurrentLocation);
  setCoordsBtn.addEventListener("click", handleCoordinatesSubmit);
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    onLocationChange({ name: searchTerm });
  });

  // Render popular locations
  popularDiv.innerHTML = "";
  popularLocations.forEach((loc) => {
    const btn = document.createElement("button");
    btn.textContent = loc.name;
    btn.className =
      "px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors";
    btn.addEventListener("click", () => handleLocationSelect(loc));
    popularDiv.appendChild(btn);
  });
}
