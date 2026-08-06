import { useState } from 'react'

const today = () => new Date().toISOString().slice(0, 10)

export default function FOWFODLog({ entries, onAdd }) {
  const [date, setDate] = useState(today())
  const [type, setType] = useState('FOW')
  const [content, setContent] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    onAdd({ date, type, content: content.trim() })
    setContent('')
  }

  return (
    <div className="card">
      <div className="card-title">FOW / FOD Log</div>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          <select className="input w-28" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="FOW">FOW</option>
            <option value="FOD">FOD</option>
          </select>
        </div>
        <textarea
          className="input"
          rows={2}
          placeholder="Catatan..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="btn-primary w-full">
          Tambah Entri
        </button>
      </form>
      <ul className="max-h-56 space-y-2 overflow-y-auto text-sm">
        {entries.map((entry, idx) => (
          <li key={`${entry.date}-${idx}`} className="rounded-lg bg-neutral-800/60 p-2">
            <div className="mb-1 flex items-center gap-2 text-xs">
              <span
                className={
                  entry.type === 'FOW'
                    ? 'rounded bg-maroon-600/30 px-1.5 py-0.5 text-maroon-300'
                    : 'rounded bg-neutral-700 px-1.5 py-0.5 text-neutral-300'
                }
              >
                {entry.type}
              </span>
              <span className="text-neutral-500">{entry.date}</span>
            </div>
            <p className="text-neutral-300">{entry.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
