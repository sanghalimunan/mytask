import { useEffect, useMemo, useRef, useState } from 'react'
import { dummyData } from '../data/dummyData.js'
import {
  fetchUserProfile,
  getValidAccessToken,
  isGoogleConfigured,
  requestAccessToken,
  signOut as googleSignOut,
} from '../lib/googleAuth.js'
import { loadOrInitData, saveData } from '../lib/driveStorage.js'

const MS_PER_DAY = 1000 * 60 * 60 * 24
const SAVE_DEBOUNCE_MS = 1500

export function usePhdData() {
  const [data, setData] = useState(dummyData)
  const [fileId, setFileId] = useState(null)
  const [auth, setAuth] = useState({ status: 'signed-out', user: null, error: null })
  const [sync, setSync] = useState({ status: 'idle', lastSyncedAt: null, error: null })

  const accessTokenRef = useRef(null)
  const skipNextSaveRef = useRef(true)
  const saveTimerRef = useRef(null)

  // Try to restore a still-valid session silently on first load.
  useEffect(() => {
    const token = getValidAccessToken()
    if (!token) return

    setAuth((prev) => ({ ...prev, status: 'restoring' }))
    accessTokenRef.current = token
    ;(async () => {
      try {
        const [user, loaded] = await Promise.all([
          fetchUserProfile(token),
          loadOrInitData(token, dummyData),
        ])
        skipNextSaveRef.current = true
        setData(loaded.data)
        setFileId(loaded.fileId)
        setAuth({ status: 'signed-in', user, error: null })
      } catch (err) {
        accessTokenRef.current = null
        setAuth({ status: 'signed-out', user: null, error: null })
      }
    })()
  }, [])

  const timeline = useMemo(() => {
    const start = new Date(data.profile.programStart)
    const totalDays = data.profile.targetMonths * 30
    const elapsedDays = Math.max(
      0,
      Math.floor((Date.now() - start.getTime()) / MS_PER_DAY),
    )
    const currentDay = Math.min(elapsedDays, totalDays)
    const daysRemaining = Math.max(0, totalDays - currentDay)
    const gbtProgress = Math.min(100, Math.round((elapsedDays / totalDays) * 1000) / 10)
    const targetEnd = new Date(start.getTime() + totalDays * MS_PER_DAY)

    return { totalDays, currentDay, daysRemaining, gbtProgress, targetEnd }
  }, [data.profile.programStart, data.profile.targetMonths])

  // Auto-save to Drive whenever data changes while signed in, debounced.
  useEffect(() => {
    if (auth.status !== 'signed-in' || !fileId) return
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }

    setSync((prev) => ({ ...prev, status: 'saving' }))
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveData(accessTokenRef.current, fileId, data)
        setSync({ status: 'saved', lastSyncedAt: new Date(), error: null })
      } catch (err) {
        setSync({ status: 'error', lastSyncedAt: null, error: err.message })
      }
    }, SAVE_DEBOUNCE_MS)

    return () => clearTimeout(saveTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, auth.status, fileId])

  async function signIn() {
    if (!isGoogleConfigured()) {
      setAuth((prev) => ({
        ...prev,
        status: 'error',
        error: 'VITE_GOOGLE_CLIENT_ID belum ditetapkan. Rujuk .env.example.',
      }))
      return
    }

    setAuth((prev) => ({ ...prev, status: 'signing-in', error: null }))
    try {
      const token = await requestAccessToken()
      accessTokenRef.current = token
      const [user, loaded] = await Promise.all([
        fetchUserProfile(token),
        loadOrInitData(token, data),
      ])
      skipNextSaveRef.current = true
      setData(loaded.data)
      setFileId(loaded.fileId)
      setAuth({ status: 'signed-in', user, error: null })
      setSync({ status: 'saved', lastSyncedAt: new Date(), error: null })
    } catch (err) {
      setAuth({ status: 'error', user: null, error: err.message })
    }
  }

  function signOut() {
    googleSignOut(accessTokenRef.current)
    accessTokenRef.current = null
    setFileId(null)
    skipNextSaveRef.current = true
    setData(dummyData)
    setAuth({ status: 'signed-out', user: null, error: null })
    setSync({ status: 'idle', lastSyncedAt: null, error: null })
  }

  function addTDR(entry) {
    setData((prev) => ({ ...prev, tdr_daily: [entry, ...prev.tdr_daily] }))
  }

  function addTM168(entry) {
    setData((prev) => ({ ...prev, tm168_weekly: [entry, ...prev.tm168_weekly] }))
  }

  function addFOWFOD(entry) {
    setData((prev) => ({ ...prev, fow_fod: [entry, ...prev.fow_fod] }))
  }

  function addSVConsultation(entry) {
    setData((prev) => ({ ...prev, svConsultations: [entry, ...prev.svConsultations] }))
  }

  return {
    data,
    timeline,
    addTDR,
    addTM168,
    addFOWFOD,
    addSVConsultation,
    auth,
    sync,
    signIn,
    signOut,
  }
}
