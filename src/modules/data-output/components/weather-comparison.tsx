import React from "react"

type Metric = {
  label: string
  icon?: React.ReactNode
  originLabel?: string
  destinationLabel?: string
  originValue: string
  destinationValue: string
  destinationEmphasisClass?: string
}

interface WeatherComparisonProps {
  title?: string
  metrics?: Metric[]
}

export function WeatherComparison({ title = "Weather Comparison", metrics }: WeatherComparisonProps) {
  const defaultMetrics: Metric[] = [
    {
      label: "Temperature",
      originLabel: "Origin",
      destinationLabel: "Destination",
      originValue: "23.4°C",
      destinationValue: "-24.3°C",
      destinationEmphasisClass: "text-sky-400",
    },
    {
      label: "Humidity",
      originLabel: "Origin",
      destinationLabel: "Destination",
      originValue: "68.0%",
      destinationValue: "88.8%",
      destinationEmphasisClass: "text-fuchsia-400",
    },
    {
      label: "Wind Speed",
      originLabel: "Origin",
      destinationLabel: "Destination",
      originValue: "5.8 m/s",
      destinationValue: "5.6 m/s",
      destinationEmphasisClass: "text-orange-400",
    },
    {
      label: "Precipitation",
      originLabel: "Origin Probability",
      destinationLabel: "Destination Probability",
      originValue: "49%",
      destinationValue: "79%",
      destinationEmphasisClass: "text-red-400",
    },
  ]

  const items = metrics ?? defaultMetrics

  return (
    <section className="space-y-6">
      <h2 className="text-white text-4xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {items.map((m) => (
          <div key={m.label} className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-200 text-lg font-medium mb-6">
              {m.icon}
              <span>{m.label}</span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-zinc-400 text-sm">{m.originLabel ?? "Origin"}</div>
                <div className="text-white text-3xl font-semibold">{m.originValue}</div>
              </div>

              <div>
                <div className="text-zinc-400 text-sm">{m.destinationLabel ?? "Destination"}</div>
                <div className={`text-3xl font-semibold ${m.destinationEmphasisClass ?? "text-white"}`}>
                  {m.destinationValue}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 