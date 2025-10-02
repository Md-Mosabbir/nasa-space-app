"use client"
interface AISummaryButtonProps {
  label?: string
  onClick?: () => void
  className?: string
}

export function AISummaryButton({ label = "Summarise with AI", onClick, className }: AISummaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        `relative inline-flex items-center justify-center px-10 py-5 rounded-full text-white text-xl font-semibold ` +
        `overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-fuchsia-400 ` +
        `transition-transform duration-200 active:scale-95 ` +
        (className ?? "")
      }
      style={{
        background: "linear-gradient(135deg, #ff7a18, #af39ff)",
      }}
    >
      <span className="relative z-10">{label}</span>
      <span
        aria-hidden
        className="absolute inset-0 animate-[pulseGradient_4s_ease_infinite]"
        style={{
          background: "conic-gradient(from 0deg, rgba(255,255,255,0.12) 0%, transparent 25%, rgba(255,255,255,0.12) 50%, transparent 75%, rgba(255,255,255,0.12) 100%)",
          mixBlendMode: "overlay",
        }}
      />
      <style jsx>{`
        @keyframes pulseGradient {
          0% { opacity: 0.7; filter: saturate(1); }
          50% { opacity: 1; filter: saturate(1.2); }
          100% { opacity: 0.7; filter: saturate(1); }
        }
      `}</style>
    </button>
  )
} 