// components/datePicker.js
/**
 * Initialize a date picker inside a container
 * @param {string} containerId - ID of container div
 * @param {function} onDateChange - Callback when the date changes
 */
export function initDateInput(
  containerId = "date-input-container",
  onDateChange = (date) => {},
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Build HTML structure
  container.innerHTML = `
    <input
      type="date"
      id="event-date"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    />
    <div id="quick-selects" class="flex flex-wrap gap-2 mt-2"></div>
  `;

  const input = container.querySelector("#event-date");
  const quickSelectsDiv = container.querySelector("#quick-selects");

  // -------------------
  // Helper Functions
  // -------------------
  function formatDateToISO(date) {
    return date.toISOString().split("T")[0];
  }

  function getDaysUntilWeekend() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 ? 6 : 6 - dayOfWeek; // Saturday
  }

  function createQuickSelectOptions() {
    return [
      { label: "Today", days: 0 },
      { label: "Tomorrow", days: 1 },
      { label: "This Weekend", days: getDaysUntilWeekend() },
      { label: "Next Week", days: 7 },
    ];
  }

  function setDate(value) {
    input.value = value;
    onDateChange(value);
  }

  // -------------------
  // Render Quick Selects
  // -------------------
  quickSelectsDiv.innerHTML = "";
  createQuickSelectOptions().forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.className =
      "px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors";
    btn.addEventListener("click", () => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + opt.days);
      setDate(formatDateToISO(targetDate));
    });
    quickSelectsDiv.appendChild(btn);
  });

  // Input change listener
  input.addEventListener("change", (e) => setDate(e.target.value));
}
