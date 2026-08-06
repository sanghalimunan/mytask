export default function TimelineChart({ phases, currentDay }) {
  const currentMonth = currentDay / 30

  return (
    <div className="card">
      <div className="card-title">Timeline GBT — 30 Bulan</div>
      <div className="space-y-3">
        {phases.map((phase, idx) => {
          const [startStr, endStr] = phase.range.replace(' Bln', '').split('-')
          const start = Number(startStr)
          const end = Number(endStr)
          const isCurrent = currentMonth >= start && currentMonth <= end

          return (
            <div key={phase.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={isCurrent ? 'font-semibold text-maroon-300' : 'text-neutral-300'}>
                  {phase.name}
                  {isCurrent && ' • anda di sini'}
                </span>
                <span className="text-neutral-500">{phase.range} — {phase.progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${phase.progress}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
