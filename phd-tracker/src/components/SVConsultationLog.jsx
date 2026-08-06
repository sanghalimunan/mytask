import { useState } from 'react'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = { date: today(), topic: '', comment: '', action: '', deadline: '' }

export default function SVConsultationLog({ entries, onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.topic.trim()) return
    onAdd(form)
    setForm({ ...emptyForm, date: today() })
  }

  return (
    <div className="card">
      <div className="card-title">SV Consultation Log</div>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
          <input
            type="date"
            className="input"
            value={form.deadline}
            onChange={(e) => handleChange('deadline', e.target.value)}
            placeholder="Deadline"
          />
        </div>
        <input
          className="input"
          placeholder="Topik"
          value={form.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
        />
        <textarea
          className="input"
          rows={2}
          placeholder="Komen SV"
          value={form.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
        />
        <input
          className="input"
          placeholder="Tindakan"
          value={form.action}
          onChange={(e) => handleChange('action', e.target.value)}
        />
        <button type="submit" className="btn-primary w-full">
          Tambah Konsultasi
        </button>
      </form>
      <ul className="max-h-56 space-y-2 overflow-y-auto text-sm">
        {entries.map((entry, idx) => (
          <li key={`${entry.date}-${idx}`} className="rounded-lg bg-neutral-800/60 p-2">
            <div className="mb-1 flex justify-between text-xs text-neutral-500">
              <span>{entry.date}</span>
              <span>Deadline: {entry.deadline || '—'}</span>
            </div>
            <p className="font-medium text-neutral-200">{entry.topic}</p>
            <p className="text-neutral-400">{entry.comment}</p>
            {entry.action && (
              <p className="mt-1 text-maroon-300">→ {entry.action}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
