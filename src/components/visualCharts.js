// src/components/visualCharts.js
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export function initRiskCharts() {
  const riskChartsDiv = document.getElementById("risk-charts");

  // Event delegation since the button is injected dynamically
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "show-details-btn") {
      // Toggle chart visibility
      if (!riskChartsDiv.classList.contains("hidden")) {
        riskChartsDiv.classList.add("hidden");
        return;
      }

      riskChartsDiv.classList.remove("hidden");
      riskChartsDiv.classList.add("flex", "justify-center");

      // Clear previous chart if any
      riskChartsDiv.innerHTML = `<canvas id="weeklyRiskChart" class="w-full h-80"></canvas>`;

      const ctx = document.getElementById("weeklyRiskChart").getContext("2d");

      // Dummy weekly data
      const weeklyData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Temperature (°C)",
            data: [28, 30, 32, 31, 29, 27, 26],
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,0.2)",
            tension: 0.4,
          },
          {
            label: "Humidity (%)",
            data: [55, 60, 65, 58, 52, 50, 48],
            borderColor: "rgba(54,162,235,1)",
            backgroundColor: "rgba(54,162,235,0.2)",
            tension: 0.4,
          },
          {
            label: "Wind Speed (km/h)",
            data: [10, 12, 8, 15, 9, 7, 6],
            borderColor: "rgba(255,206,86,1)",
            backgroundColor: "rgba(255,206,86,0.2)",
            tension: 0.4,
          },
        ],
      };

      new Chart(ctx, {
        type: "line",
        data: weeklyData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Weekly Weather Trend",
              font: {
                size: 18,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    }
  });
}
