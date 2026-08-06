const DATA_FILE_NAME = 'phd-tracker-data.json'
const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files'
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files'

async function driveFetch(url, accessToken, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Drive API error (${res.status}): ${body || res.statusText}`)
  }
  return res
}

async function findDataFile(accessToken) {
  const params = new URLSearchParams({
    spaces: 'appDataFolder',
    q: `name = '${DATA_FILE_NAME}' and trashed = false`,
    fields: 'files(id, modifiedTime)',
    pageSize: '1',
  })
  const res = await driveFetch(`${DRIVE_FILES_URL}?${params}`, accessToken)
  const { files } = await res.json()
  return files?.[0] || null
}

async function createDataFile(accessToken, data) {
  const metadata = { name: DATA_FILE_NAME, parents: ['appDataFolder'] }
  const boundary = 'phd_tracker_boundary'
  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    'Content-Type: application/json\r\n\r\n' +
    `${JSON.stringify(data)}\r\n` +
    `--${boundary}--`

  const res = await driveFetch(
    `${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id`,
    accessToken,
    {
      method: 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body,
    },
  )
  return res.json()
}

async function updateDataFile(accessToken, fileId, data) {
  await driveFetch(`${DRIVE_UPLOAD_URL}/${fileId}?uploadType=media`, accessToken, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

async function readDataFile(accessToken, fileId) {
  const res = await driveFetch(`${DRIVE_FILES_URL}/${fileId}?alt=media`, accessToken)
  return res.json()
}

export async function loadOrInitData(accessToken, fallbackData) {
  const existing = await findDataFile(accessToken)
  if (existing) {
    const data = await readDataFile(accessToken, existing.id)
    return { fileId: existing.id, data }
  }
  const created = await createDataFile(accessToken, fallbackData)
  return { fileId: created.id, data: fallbackData }
}

export async function saveData(accessToken, fileId, data) {
  await updateDataFile(accessToken, fileId, data)
}
