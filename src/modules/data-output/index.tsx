import { ComfortScore } from "./components/comfort-score"
import { RiskScore } from "./components/risk-score"
import { WeatherComparison } from "./components/weather-comparison"
import { AISummaryButton } from "./components/ai-summary-button"
import { GraphsSection } from "./components/graphs-section"

// Dummy data structure
const activities = [
  {
    name: "Hiking",
    comfortScore: 50,
    comfortColor: "green" as const,
    concerns: ["Precipitation"],
    riskFactors: [
      { name: "Cold", percentage: 10, color: "red" as const },
      { name: "Heat", percentage: 10, color: "red" as const },
      { name: "Rain", percentage: 80, color: "yellow" as const },
      { name: "Wind", percentage: 60, color: "red" as const },
    ],
  },
  {
    name: "Fishing",
    comfortScore: 20,
    comfortColor: "yellow" as const,
    concerns: ["Precipitation"],
    riskFactors: [
      { name: "Cold", percentage: 10, color: "red" as const },
      { name: "Heat", percentage: 10, color: "red" as const },
      { name: "Rain", percentage: 80, color: "yellow" as const },
      { name: "Wind", percentage: 60, color: "red" as const },
    ],
  },
]

export default function DataOutput() {
  return (
    <div className="min-h-screen bg-black">


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-12">

          {activities.map((activity) => (
            <div key={activity.name} className="border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-white text-3xl font-bold mb-8">{activity.name}</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <ComfortScore
                  score={activity.comfortScore}
                  concerns={activity.concerns}
                  color={activity.comfortColor}
                />

                <RiskScore factors={activity.riskFactors} />
              </div>
            </div>
          ))}


          <WeatherComparison />

          <div className="flex items-center justify-center py-8">
            <AISummaryButton />
          </div>

          <GraphsSection />
        </div>
      </main>
    </div>
  )
}
