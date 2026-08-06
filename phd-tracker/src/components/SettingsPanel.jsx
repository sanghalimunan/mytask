import { useState } from 'react'
import { getStoredClientId, isGoogleConfigured, setStoredClientId } from '../lib/googleAuth.js'
import { sendTelegramTest, sendWhatsappTest } from '../lib/notifications.js'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function SettingsPanel({ reminders, onUpdateReminders, onClose }) {
  const [clientIdInput, setClientIdInput] = useState(getStoredClientId())
  const [clientIdSaved, setClientIdSaved] = useState(isGoogleConfigured())

  const [form, setForm] = useState({
    telegramChatId: reminders.telegramChatId || '',
    whatsappNumber: reminders.whatsappNumber || '',
    dailyReminderTime: reminders.dailyReminderTime || '20:00',
    weeklyReminderDay: reminders.weeklyReminderDay || 'Sunday',
  })

  const [telegramTest, setTelegramTest] = useState('idle')
  const [whatsappTest, setWhatsappTest] = useState('idle')

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSaveClientId(e) {
    e.preventDefault()
    setStoredClientId(clientIdInput)
    setClientIdSaved(Boolean(clientIdInput.trim()))
  }

  function handleClearClientId() {
    setStoredClientId('')
    setClientIdInput('')
    setClientIdSaved(false)
  }

  function handleSaveReminders(e) {
    e.preventDefault()
    onUpdateReminders(form)
  }

  async function handleTestTelegram() {
    setTelegramTest('sending')
    try {
      await sendTelegramTest(form.telegramChatId, 'Ujian PhD Tracker: notifikasi Telegram berfungsi ✅')
      setTelegramTest('success')
    } catch {
      setTelegramTest('error')
    }
  }

  async function handleTestWhatsapp() {
    setWhatsappTest('sending')
    try {
      await sendWhatsappTest(form.whatsappNumber, 'Ujian PhD Tracker: notifikasi WhatsApp berfungsi ✅')
      setWhatsappTest('success')
    } catch {
      setWhatsappTest('error')
    }
  }

  return (
    <div className="card mx-4 mb-6 sm:mx-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="card-title mb-0">Settings / Admin</div>
        <button onClick={onClose} className="text-xs text-neutral-400 hover:text-neutral-200">
          Tutup ✕
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-neutral-200">Google OAuth Client ID</h3>
          <p className="mb-3 text-xs leading-relaxed text-neutral-500">
            Disimpan hanya dalam browser ini (localStorage) — bukan dalam kod sumber atau fail
            .env yang dikomit ke repo. Client ID Google memang direka untuk didedahkan di
            client-side, tapi cara ini elak ia "hardcoded" terus dalam build/HTML.
          </p>
          <form onSubmit={handleSaveClientId} className="space-y-2">
            <input
              className="input"
              placeholder="xxxxx.apps.googleusercontent.com"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                Simpan
              </button>
              <button
                type="button"
                onClick={handleClearClientId}
                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
              >
                Padam
              </button>
            </div>
          </form>
          <p className="mt-2 text-xs">
            Status:{' '}
            <span className={clientIdSaved ? 'text-emerald-400' : 'text-neutral-500'}>
              {clientIdSaved ? 'Ditetapkan' : 'Belum ditetapkan'}
            </span>
          </p>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-neutral-200">
            Notifikasi Telegram &amp; WhatsApp
          </h3>
          <p className="mb-3 text-xs leading-relaxed text-neutral-500">
            Bot Token Telegram dan Auth Token Twilio ialah rahsia sebenar — ditetapkan sebagai
            environment variable di Netlify (server-side sahaja), <strong>bukan</strong> di sini.
            Ruang ini hanya untuk ID/nombor destinasi anda, disimpan bersama data PhD anda di
            Google Drive.
          </p>
          <form onSubmit={handleSaveReminders} className="space-y-2">
            <input
              className="input"
              placeholder="Telegram Chat ID"
              value={form.telegramChatId}
              onChange={(e) => updateField('telegramChatId', e.target.value)}
            />
            <input
              className="input"
              placeholder="Nombor WhatsApp (cth. +60123456789)"
              value={form.whatsappNumber}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="time"
                className="input"
                value={form.dailyReminderTime}
                onChange={(e) => updateField('dailyReminderTime', e.target.value)}
              />
              <select
                className="input"
                value={form.weeklyReminderDay}
                onChange={(e) => updateField('weeklyReminderDay', e.target.value)}
              >
                {WEEKDAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">
              Simpan Tetapan Notifikasi
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={telegramTest === 'sending'}
              className="rounded-lg border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800 disabled:opacity-50"
            >
              {telegramTest === 'sending' ? 'Menghantar...' : 'Uji Telegram'}
            </button>
            {telegramTest === 'success' && <span className="text-xs text-emerald-400">✓ dihantar</span>}
            {telegramTest === 'error' && <span className="text-xs text-red-400">Gagal</span>}

            <button
              type="button"
              onClick={handleTestWhatsapp}
              disabled={whatsappTest === 'sending'}
              className="rounded-lg border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800 disabled:opacity-50"
            >
              {whatsappTest === 'sending' ? 'Menghantar...' : 'Uji WhatsApp'}
            </button>
            {whatsappTest === 'success' && <span className="text-xs text-emerald-400">✓ dihantar</span>}
            {whatsappTest === 'error' && <span className="text-xs text-red-400">Gagal</span>}
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            Butang ujian hanya berfungsi selepas app dideploy ke Netlify dengan Functions
            aktif — tidak berfungsi dalam `npm run dev` tempatan.
          </p>
        </section>
      </div>
    </div>
  )
}
