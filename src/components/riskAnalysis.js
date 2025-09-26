// components/riskAnalysis.js
export function renderRiskAnalysis({ container, date, location }) {
  if (!container) return;

  // Dummy data (replace later with API-driven data)
  const dummyAssessment = {
    hot: { level: "safe", score: 1, description: "Minimal heat risk" },
    cold: { level: "caution", score: 3, description: "Some cold exposure" },
    windy: { level: "safe", score: 1, description: "Wind is light" },
    wet: { level: "risky", score: 4, description: "Heavy rain expected" },
    Comfort: {
      level: "caution",
      score: 2,
      description: "Some discomfort possible",
    },
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case "safe":
        return { text: "🟢 Safe", class: "bg-green-100 text-green-800" };
      case "caution":
        return { text: "🟡 Caution", class: "bg-yellow-100 text-yellow-800" };
      case "risky":
        return { text: "🔴 Risky", class: "bg-red-100 text-red-800" };
    }
  };

  const overallRisk = (() => {
    const riskyCount = Object.values(dummyAssessment).filter(
      (r) => r.level === "risky",
    ).length;
    const cautionCount = Object.values(dummyAssessment).filter(
      (r) => r.level === "caution",
    ).length;
    if (riskyCount > 0) return "risky";
    if (cautionCount > 1) return "caution";
    return "safe";
  })();

  const overallBadge = getRiskBadge(overallRisk);

  container.innerHTML = `
    <div class="space-y-6">
      <div class="p-6 rounded-2xl border-2 ${
        overallRisk === "safe"
          ? "border-green-200 bg-green-50"
          : overallRisk === "caution"
            ? "border-yellow-200 bg-yellow-50"
            : "border-red-200 bg-red-50"
      }">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold">Weather Risk Analysis</h3>
          <span class="px-4 py-2 rounded-full text-sm font-semibold ${overallBadge.class}">
            ${overallBadge.text}
          </span>
        </div>
        <div class="grid md:grid-cols-2 gap-2 text-sm mb-2">
          <div>📅 Date: ${new Date(date).toLocaleDateString()}</div>
          <div>📍 Location: ${location.name || `${location.lat.toFixed(3)}, ${location.lon.toFixed(3)}`}</div>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          ${Object.entries(dummyAssessment)
            .map(([key, risk]) => {
              const badge = getRiskBadge(risk.level);
              return `
              <div class="bg-white rounded-xl p-4 shadow hover:shadow-md">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-semibold capitalize">${key} Risk</h4>
                  <span class="px-2 py-1 rounded-full text-xs font-semibold ${badge.class}">
                    ${badge.text.split(" ")[1]}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">${risk.description}</p>
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full ${
                      risk.level === "safe"
                        ? "bg-green-500"
                        : risk.level === "caution"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }" style="width: ${Math.min(risk.score * 25, 100)}%"></div>
                  </div>
                  <span class="text-xs font-semibold text-gray-500">${risk.score}</span>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>

        <!-- See Details Button -->
        <div class="mt-4 flex justify-center">
          <button id="show-details-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            See Details
          </button>
        </div>

      </div>
    </div>
  `;
}
