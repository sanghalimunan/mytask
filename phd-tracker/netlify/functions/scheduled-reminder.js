import { sendTelegram, sendWhatsapp } from './_lib/notify.js'

const MYT_OFFSET_HOURS = 8
const REMINDER_HOUR_MYT = 20 // 8:00pm waktu Malaysia

// This app has no server-side database of per-user OAuth tokens (Drive access
// is browser-only), so the scheduled cron can't read each user's personal
// reminders.telegramChatId/whatsappNumber from Drive. It sends to a single
// fixed destination configured via Netlify env vars instead — fine for a
// personal single-user tracker. Use the Settings panel's "Uji" buttons to
// test delivery to those same destinations on demand.
async function notifyAll(message) {
  const chatId = process.env.TELEGRAM_CHAT_ID
  const to = process.env.TWILIO_WHATSAPP_TO

  const results = await Promise.allSettled([
    chatId ? sendTelegram(chatId, message) : Promise.resolve(null),
    to ? sendWhatsapp(to, message) : Promise.resolve(null),
  ])

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('Reminder gagal dihantar:', result.reason?.message)
    }
  })
}

export default async () => {
  const now = new Date()
  const mytDate = new Date(now.getTime() + MYT_OFFSET_HOURS * 60 * 60 * 1000)
  const mytHour = mytDate.getUTCHours()
  const mytDay = mytDate.getUTCDay() // 0 = Ahad

  if (mytHour !== REMINDER_HOUR_MYT) {
    return new Response('skip: bukan waktu reminder')
  }

  await notifyAll('📝 Peringatan: jangan lupa isi TDR harian anda dalam PhD Tracker.')

  if (mytDay === 0) {
    await notifyAll('📊 Peringatan: jangan lupa isi TM168 mingguan anda dalam PhD Tracker.')
  }

  return new Response('ok')
}

export const config = { schedule: '0 * * * *' }
