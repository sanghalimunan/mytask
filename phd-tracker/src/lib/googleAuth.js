const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const SCOPES = [
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ')

const SESSION_KEY = 'phd-tracker:gtoken'
const CLIENT_ID_KEY = 'phd-tracker:google-client-id'

let gisLoadPromise = null
let tokenClient = null

// Client ID lives in this browser's localStorage (set via the in-app Settings
// panel), not baked into the built HTML/JS. Falls back to a build-time env
// var only for local dev convenience.
export function getStoredClientId() {
  return localStorage.getItem(CLIENT_ID_KEY) || ''
}

export function setStoredClientId(clientId) {
  const trimmed = clientId.trim()
  if (trimmed) {
    localStorage.setItem(CLIENT_ID_KEY, trimmed)
  } else {
    localStorage.removeItem(CLIENT_ID_KEY)
  }
  tokenClient = null // force re-init with the new client id
}

export function getClientId() {
  return getStoredClientId() || import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
}

export function isGoogleConfigured() {
  return Boolean(getClientId())
}

function loadGisScript() {
  if (gisLoadPromise) return gisLoadPromise

  gisLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = GIS_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Gagal memuatkan Google Identity Services'))
    document.head.appendChild(script)
  })

  return gisLoadPromise
}

function readStoredToken() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw)
    if (!stored.accessToken || !stored.expiresAt || Date.now() >= stored.expiresAt) return null
    return stored
  } catch {
    return null
  }
}

function storeToken(accessToken, expiresInSeconds) {
  const stored = {
    accessToken,
    expiresAt: Date.now() + expiresInSeconds * 1000 - 60_000,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored))
  return stored
}

function clearStoredToken() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function getValidAccessToken() {
  const stored = readStoredToken()
  return stored?.accessToken || null
}

async function ensureTokenClient() {
  await loadGisScript()
  const clientId = getClientId()
  if (!clientId) {
    throw new Error('Google Client ID belum ditetapkan. Buka Settings untuk masukkannya.')
  }
  if (!tokenClient) {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: () => {},
    })
  }
  return tokenClient
}

export async function requestAccessToken({ prompt = '' } = {}) {
  const client = await ensureTokenClient()

  return new Promise((resolve, reject) => {
    client.callback = (response) => {
      if (response.error) {
        reject(new Error(response.error_description || response.error))
        return
      }
      resolve(storeToken(response.access_token, response.expires_in).accessToken)
    }
    client.error_callback = (error) => {
      reject(new Error(error?.message || 'Login Google gagal atau dibatalkan'))
    }
    client.requestAccessToken({ prompt })
  })
}

export async function fetchUserProfile(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Gagal mendapatkan profil pengguna Google')
  return res.json()
}

export function signOut(accessToken) {
  clearStoredToken()
  if (accessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken, () => {})
  }
}
