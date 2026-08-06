import { sendTelegram } from './_lib/notify.js'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { chatId, message } = await req.json()
    const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID
    if (!message) {
      return new Response(JSON.stringify({ error: 'message diperlukan' }), { status: 400 })
    }
    const data = await sendTelegram(targetChatId, message)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
