import { useState } from 'react'

const today = () => new Date().toISOString().slice(0, 10)

const emptyMetrics = { draftPages: '', readingArticles: '', dataCollectionHours: '', meetings: '' }

export default function TM168Form({ onAdd }) {
  const [weekOf, setWeekOf] = useState(today())
  const [target, setTarget] = useState(emptyMetrics)
  const [actual, setActual] = useState(emptyMetrics)

  function handleSubmit(e) {
    e.preventDefault()

    const toNumbers = (obj) =>
      Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, Number(value) || 0]))

    const numericTarget = toNumbers(target)
    const numericActual = toNumbers(actual)
    const targetTotal = Object.values(numericTarget).reduce((a, b) => a + b, 0)
    const actualTotal = Object.values(numericActual).reduce((a, b) => a + b, 0)
    const percentComplete = targetTotal > 0 ? Math.round((actualTotal / targetTotal) * 100) : 0

    onAdd({ weekOf, target: numericTarget, actual: numericActual, percentComplete })

    setTarget(emptyMetrics)
    setActual(emptyMetrics)
  }

  const fields = [
    { key: 'draftPages', label: 'Muka Draft' },
    { key: 'readingArticles', label: 'Artikel Dibaca' },
    { key: 'dataCollectionHours', label: 'Jam Kutip Data' },
    { key: 'meetings', label: 'Mesyuarat' },
  ]

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div className="card-title">Isi TM168 Mingguan</div>
      <input
        type="date"
        className="input"
        value={weekOf}
        onChange={(e) => setWeekOf(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="font-semibold text-neutral-400">Target</div>
        <div className="font-semibold text-neutral-400">Actual</div>
        {fields.map((field) => (
          <div key={field.key} className="contents">
            <input
              type="number"
              min="0"
              className="input"
              placeholder={field.label}
              value={target[field.key]}
              onChange={(e) => setTarget((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
            <input
              type="number"
              min="0"
              className="input"
              placeholder={field.label}
              value={actual[field.key]}
              onChange={(e) => setActual((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <button type="submit" className="btn-primary w-full">
        Simpan TM168
      </button>
    </form>
  )
}
