export default function DaysRemainingCards({ timeline }) {
  const items = [
    { label: 'Hari Berlalu', value: timeline.currentDay },
    { label: 'Hari Berbaki', value: timeline.daysRemaining },
    { label: 'Jumlah Hari Program', value: timeline.totalDays },
    { label: 'GBT Progress', value: `${timeline.gbtProgress}%` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card text-center">
          <div className="text-2xl font-bold text-maroon-300 sm:text-3xl">{item.value}</div>
          <div className="mt-1 text-xs text-neutral-400">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
