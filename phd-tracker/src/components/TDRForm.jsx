import { useState } from 'react'

const today = () => new Date().toISOString().slice(0, 10)

export default function TDRForm({ onAdd }) {
  const [date, setDate] = useState(today())
  const [focus, setFocus] = useState('')
  const [activitiesText, setActivitiesText] = useState('')
  const [hoursSpent, setHoursSpent] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!focus.trim()) return

    onAdd({
      date,
      focus: focus.trim(),
      activities: activitiesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      hoursSpent: Number(hoursSpent) || 0,
    })

    setFocus('')
    setActivitiesText('')
    setHoursSpent('')
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div className="card-title">Isi TDR Harian</div>
      <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
      <input
        className="input"
        placeholder="Fokus hari ini"
        value={focus}
        onChange={(e) => setFocus(e.target.value)}
      />
      <textarea
        className="input"
        rows={3}
        placeholder="Aktiviti (satu baris satu aktiviti)"
        value={activitiesText}
        onChange={(e) => setActivitiesText(e.target.value)}
      />
      <input
        type="number"
        min="0"
        step="0.5"
        className="input"
        placeholder="Jumlah jam"
        value={hoursSpent}
        onChange={(e) => setHoursSpent(e.target.value)}
      />
      <button type="submit" className="btn-primary w-full">
        Simpan TDR
      </button>
    </form>
  )
}
