export default function WeeklyMonthlyTarget({ weeklyTarget, monthlyTarget }) {
  return (
    <div className="card">
      <div className="card-title">Target Mingguan &amp; Bulanan</div>
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-xs text-neutral-300">
            <span>Minggu {weeklyTarget.period}</span>
            <span>{weeklyTarget.percentComplete}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${weeklyTarget.percentComplete}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-neutral-300">
            <span>Bulan {monthlyTarget.month}</span>
            <span>{monthlyTarget.percentComplete}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${monthlyTarget.percentComplete}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
