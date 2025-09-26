// components/UserInput.js
import { initDateInput } from "./datePicker.js";
import { initLocationInput } from "./locationPicker.js";

export function initUserInput({
  dateContainerId = "date-input-container",
  locationContainerId = "location-input-container",
  dateDisplayId = "selected-date",
  locationDisplayId = "selected-location",
  analyzeBtnId = "analyze-btn",
  riskDivId = "risk-assessment",
  errorDivId = "error-msg",
} = {}) {
  // State
  let selectedDate = null;
  let selectedLocation = null;

  // DOM Elements
  const dateDisplay = document.getElementById(dateDisplayId);
  const locationDisplay = document.getElementById(locationDisplayId);
  const analyzeBtn = document.getElementById(analyzeBtnId);
  const riskDiv = document.getElementById(riskDivId);
  const errorDiv = document.getElementById(errorDivId);
  const errorText = errorDiv.querySelector("p");

  // Update helpers
  function updateDateDisplay(date) {
    selectedDate = date;
    dateDisplay.textContent = `Selected: ${date}`;
    console.log("Selected date:", date);
  }

  function updateLocationDisplay(loc) {
    selectedLocation = loc;
    if (loc.name) {
      locationDisplay.textContent = `Selected: ${loc.name}`;
      console.log("Selected location:", loc.name);
    } else if (loc.lat !== undefined && loc.lon !== undefined) {
      locationDisplay.textContent = `Selected: ${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)}`;
    }
  }

  // Handle analyze
  function handleAnalyzeClick() {
    if (!selectedDate || !selectedLocation) {
      console.log(selectedDate, selectedLocation, "Missing input");
      errorText.textContent = "Please select both location and date.";
      errorDiv.classList.remove("hidden");
      return;
    }
    errorDiv.classList.add("hidden");
    riskDiv.classList.add("hidden");

    analyzeBtn.disabled = true;
    analyzeBtn.querySelector("span").textContent = "Analyzing Weather Data...";

    // Fake API call simulation
    setTimeout(() => {
      const locText =
        selectedLocation.name ||
        `${selectedLocation.lat.toFixed(3)}, ${selectedLocation.lon.toFixed(3)}`;
      riskDiv.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p class="text-green-700">Weather Risk is LOW for ${selectedDate} at ${locText}</p>
        </div>
      `;
      riskDiv.classList.remove("hidden");
      analyzeBtn.disabled = false;
      analyzeBtn.querySelector("span").textContent = "Check Weather Risk";
    }, 1000);
  }

  // Initialize pickers
  initDateInput(dateContainerId, updateDateDisplay);
  initLocationInput(locationContainerId, updateLocationDisplay);

  // Event
  analyzeBtn.addEventListener("click", handleAnalyzeClick);
}
