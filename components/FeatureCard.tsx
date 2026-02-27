interface FeatureCardProps {
  children: React.ReactNode
  className?: string
}

export default function FeatureCard({ children, className }: FeatureCardProps) {
  return (
    <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/5 p-8 ${className ?? ''}`}>
      {children}
    </div>
  )
}
