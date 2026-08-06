import { useMemo, useState } from 'react'
import { dummyData } from '../data/dummyData.js'

const MS_PER_DAY = 1000 * 60 * 60 * 24

export function usePhdData() {
  const [data, setData] = useState(dummyData)

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

  return { data, timeline, addTDR, addTM168, addFOWFOD, addSVConsultation }
}
