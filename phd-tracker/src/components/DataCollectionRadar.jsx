import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

export default function DataCollectionRadar({ weekly }) {
  const latest = weekly[0]
  if (!latest) return null

  const data = Object.keys(latest.target).map((key) => ({
    metric: key,
    Target: latest.target[key],
    Actual: latest.actual[key],
  }))

  return (
    <div className="card">
      <div className="card-title">TM168 — Target vs Actual (Minggu {latest.weekOf})</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="metric" stroke="#888" fontSize={11} />
            <PolarRadiusAxis stroke="#555" fontSize={10} />
            <Radar name="Target" dataKey="Target" stroke="#e0637f" fill="#e0637f" fillOpacity={0.15} />
            <Radar name="Actual" dataKey="Actual" stroke="#c41e3a" fill="#c41e3a" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-maroon-300">
        {latest.percentComplete}% selesai minggu ini
      </div>
    </div>
  )
}
