export default function TodaySchedule({ latestTDR }) {
  if (!latestTDR) {
    return (
      <div className="card">
        <div className="card-title">Fokus Terkini</div>
        <p className="text-sm text-neutral-500">Belum ada entri TDR.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-title">Fokus Terkini — {latestTDR.date}</div>
      <p className="mb-3 text-sm text-neutral-200">{latestTDR.focus}</p>
      <ul className="mb-3 space-y-1 text-sm text-neutral-400">
        {latestTDR.activities.map((activity) => (
          <li key={activity} className="flex gap-2">
            <span className="text-maroon-400">•</span>
            <span>{activity}</span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-neutral-500">Jumlah masa: {latestTDR.hoursSpent} jam</div>
    </div>
  )
}
