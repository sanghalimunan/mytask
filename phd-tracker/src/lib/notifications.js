async function callFunction(path, payload) {
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Fungsi ${path} gagal (status ${res.status})`)
  }
  return data
}

export function sendTelegramTest(chatId, message) {
  return callFunction('send-telegram', { chatId, message })
}

export function sendWhatsappTest(to, message) {
  return callFunction('send-whatsapp', { to, message })
}
