import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ChapterProgress({ chapters }) {
  return (
    <div className="card">
      <div className="card-title">Progress Bab Thesis</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chapters} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#888" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="#888" fontSize={12} width={110} />
            <Tooltip
              contentStyle={{ background: '#1a1a1a', border: '1px solid #861226', borderRadius: 8 }}
              formatter={(value) => [`${value}%`, 'Progress']}
            />
            <Bar dataKey="progress" fill="#c41e3a" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
