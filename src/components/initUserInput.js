import { initDateInput } from "./datePicker.js";
import { initLocationInput } from "./locationPicker.js";
import { renderRiskAnalysis } from "./riskAnalysis.js";

export function initUserInput({
  dateContainerId = "date-input-container",
  locationContainerId = "location-input-container",
  dateDisplayId = "selected-date",
  locationDisplayId = "selected-location",
  analyzeBtnId = "analyze-btn",
  riskDivId = "risk-assessment",
  errorDivId = "error-msg",
} = {}) {
  let selectedDate = null;
  let selectedLocation = null;

  const dateDisplay = document.getElementById(dateDisplayId);
  const locationDisplay = document.getElementById(locationDisplayId);
  const analyzeBtn = document.getElementById(analyzeBtnId);
  const riskDiv = document.getElementById(riskDivId);
  const errorDiv = document.getElementById(errorDivId);
  const errorText = errorDiv.querySelector("p");

  function updateDateDisplay(date) {
    selectedDate = date;
    dateDisplay.textContent = `Selected: ${date}`;
  }

  function updateLocationDisplay(loc) {
    selectedLocation = loc;
    if (loc.name) locationDisplay.textContent = `Selected: ${loc.name}`;
    else if (loc.lat !== undefined && loc.lon !== undefined)
      locationDisplay.textContent = `Selected: ${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)}`;
  }

  function handleAnalyzeClick() {
    if (!selectedDate || !selectedLocation) {
      errorText.textContent = "Please select both location and date.";
      errorDiv.classList.remove("hidden");
      return;
    }
    errorDiv.classList.add("hidden");
    riskDiv.classList.add("hidden");

    analyzeBtn.disabled = true;
    analyzeBtn.querySelector("span").textContent = "Analyzing Weather Data...";

    setTimeout(() => {
      renderRiskAnalysis({
        container: riskDiv,
        date: selectedDate,
        location: selectedLocation,
      });
      riskDiv.classList.remove("hidden");
      analyzeBtn.disabled = false;
      analyzeBtn.querySelector("span").textContent = "Check Weather Risk";
    }, 1000);
  }

  initDateInput(dateContainerId, updateDateDisplay);
  initLocationInput(locationContainerId, updateLocationDisplay);

  analyzeBtn.addEventListener("click", handleAnalyzeClick);
}
