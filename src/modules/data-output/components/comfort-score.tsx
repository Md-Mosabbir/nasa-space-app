import { Badge } from "@/components/ui/badge"

interface ComfortScoreProps {
  score: number // 0-100
  concerns: string[]
  color: "green" | "yellow" | "red"
}

export function ComfortScore({ score, concerns, color }: ComfortScoreProps) {
  const getRating = (score: number) => {
    if (score >= 70) return "Excellent"
    if (score >= 50) return "Good"
    if (score >= 30) return "Fair"
    return "Poor"
  }

  const colorClasses = {
    green: "stroke-green-500",
    yellow: "stroke-yellow-400",
    red: "stroke-red-500",
  }

  const dotColorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
  }

  const radius = 70
  const strokeWidth = 12
  const centerX = 100
  const centerY = 120 // slightly more space at bottom

  const rotationOffset = -90
  const startAngle = -135 + rotationOffset
  const endAngle = 135 + rotationOffset
  const totalAngle = endAngle - startAngle

  const polarToCartesian = (angle: number) => {
    const angleRad = (angle * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad),
    }
  }

  const start = polarToCartesian(startAngle)
  const end = polarToCartesian(endAngle)
  const progressAngle = startAngle + (score / 100) * totalAngle
  const progress = polarToCartesian(progressAngle)
  const largeArcFlag = score > 50 ? 1 : 0

  const backgroundPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`
  const progressPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${progress.x} ${progress.y}`

  return (
    <div className="bg-zinc-800/50 rounded-2xl p-7 relative w-full min-w-[320px] flex flex-col sm:flex-row sm:items-start sm:gap-6">
      <div className={`absolute top-6 right-6 w-4 h-4 rounded-full ${dotColorClasses[color]}`} />

      {/* Main score area - flex-grow to take priority */}
      <div className="lg:-ml-[80px] flex flex-col items-center flex-grow">
        <div className="relative w-full h-[180px]">
          <svg className="w-full h-full scale-[1.3] -mt-[35px]" viewBox="0 0 200 180">
            <path
              d={backgroundPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="text-zinc-700"
            />
            <path
              d={progressPath}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className={colorClasses[color]}
              style={{ transition: "d 0.5s ease, stroke 0.3s ease" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-white -mt-2">{score}%</div>
            <div className="text-lg text-zinc-300 mt-1">{getRating(score)}</div>
          </div>
        </div>

        <div className="flex justify-around w-full text-sm text-zinc-400 px-4">
          <span>0%</span>
          <span>100%</span>
        </div>

        <div className="text-white text-xl font-bold text-center mt-4">Comfort Score</div>
      </div>

      {/* Concerns section */}
      <div className=" sm:flex-shrink-0 flex flex-col sm:items-start  gap-2 w-full sm:w-auto mt-16">
        <Badge variant="secondary" className="text-2xl bg-[#282828] text-white">
          Concerns
        </Badge>
        <div className="text-white font-medium   text-left">
          {concerns.length > 0 ? concerns.join(", ") : "None"}
        </div>
      </div>
    </div>
  )
}
