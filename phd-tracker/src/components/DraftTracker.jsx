import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export default function DraftTracker({ draftTracker }) {
  const { currentDraft, targetDraft, lastUpdated } = draftTracker
  const percent = Math.min(100, Math.round((currentDraft / targetDraft) * 100))
  const chartData = [
    { name: 'Siap', value: currentDraft },
    { name: 'Baki', value: Math.max(0, targetDraft - currentDraft) },
  ]

  return (
    <div className="card">
      <div className="card-title">Draft Tracker</div>
      <div className="relative mx-auto h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill="#c41e3a" />
              <Cell fill="#2a2a2a" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-maroon-300">
            {currentDraft}/{targetDraft}
          </span>
          <span className="text-xs text-neutral-400">{percent}%</span>
        </div>
      </div>
      <div className="mt-3 text-center text-xs text-neutral-500">
        Kemaskini terakhir: {lastUpdated}
      </div>
    </div>
  )
}
