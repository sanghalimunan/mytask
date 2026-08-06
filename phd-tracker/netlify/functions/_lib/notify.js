// Secrets (bot token, Twilio auth token) are read from Netlify's server-side
// environment only — never accepted from the request body, never sent to the browser.

export async function sendTelegram(chatId, message) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN belum ditetapkan di Netlify')
  if (!chatId) throw new Error('chatId diperlukan')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  })
  const data = await res.json()
  if (!res.ok || !data.ok) throw new Error(data.description || 'Telegram API gagal')
  return data
}

export async function sendWhatsapp(to, message) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  if (!sid || !authToken || !from) throw new Error('Twilio env vars belum ditetapkan di Netlify')
  if (!to) throw new Error('Nombor WhatsApp (to) diperlukan')

  const body = new URLSearchParams({
    From: `whatsapp:${from}`,
    To: `whatsapp:${to}`,
    Body: message,
  })

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Twilio API gagal')
  return data
}
