interface RiskFactor {
  name: string
  percentage: number
  color: "red" | "green" | "yellow"
}

interface RiskScoreProps {
  factors: RiskFactor[]
}

export function RiskScore({ factors }: RiskScoreProps) {
  const colorClasses = {
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
  }

  return (
    <div className="bg-zinc-800/50 rounded-2xl p-8">
      <h3 className="text-white font-medium text-lg mb-6">Risk Score</h3>

      <div className="space-y-5">
        {factors.map((factor) => (
          <div key={factor.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-300">{factor.name}</span>
              <span className="text-white font-medium">{factor.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClasses[factor.color]} transition-all duration-500`}
                style={{ width: `${factor.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
