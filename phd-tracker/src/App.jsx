import { useState } from 'react'
import { usePhdData } from './hooks/usePhdData.js'
import AuthPanel from './components/AuthPanel.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import DaysRemainingCards from './components/DaysRemainingCards.jsx'
import TimelineChart from './components/TimelineChart.jsx'
import ChapterProgress from './components/ChapterProgress.jsx'
import TodaySchedule from './components/TodaySchedule.jsx'
import DraftTracker from './components/DraftTracker.jsx'
import DataCollectionRadar from './components/DataCollectionRadar.jsx'
import WeeklyMonthlyTarget from './components/WeeklyMonthlyTarget.jsx'
import TDRForm from './components/TDRForm.jsx'
import TM168Form from './components/TM168Form.jsx'
import FOWFODLog from './components/FOWFODLog.jsx'
import SVConsultationLog from './components/SVConsultationLog.jsx'

export default function App() {
  const {
    data,
    timeline,
    addTDR,
    addTM168,
    addFOWFOD,
    addSVConsultation,
    updateReminders,
    auth,
    sync,
    signIn,
    signOut,
  } = usePhdData()

  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-maroon-900/10 pb-16">
      <header className="border-b border-maroon-900/40 bg-neutral-950/80 px-4 py-5 backdrop-blur sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-maroon-300 sm:text-2xl">PhD Tracker — StrategiSK</h1>
            <p className="text-sm text-neutral-400">
              {data.profile.name} • Mula {data.profile.programStart} • Target {data.profile.targetMonths} bulan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AuthPanel
              auth={auth}
              sync={sync}
              onSignIn={signIn}
              onSignOut={signOut}
              onOpenSettings={() => setShowSettings(true)}
            />
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              title="Settings"
              className="rounded-lg border border-neutral-700 px-2.5 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
            >
              ⚙
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="pt-6">
          <SettingsPanel
            reminders={data.reminders}
            onUpdateReminders={updateReminders}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
        <DaysRemainingCards timeline={timeline} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TimelineChart phases={data.milestones.phases} currentDay={timeline.currentDay} />
          </div>
          <DraftTracker draftTracker={data.draftTracker} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChapterProgress chapters={data.chapters} />
          <DataCollectionRadar weekly={data.tm168_weekly} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TodaySchedule latestTDR={data.tdr_daily[0]} />
          <WeeklyMonthlyTarget weeklyTarget={data.weeklyTarget} monthlyTarget={data.monthlyTarget} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TDRForm onAdd={addTDR} />
          <TM168Form onAdd={addTM168} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FOWFODLog entries={data.fow_fod} onAdd={addFOWFOD} />
          <SVConsultationLog entries={data.svConsultations} onAdd={addSVConsultation} />
        </div>
      </main>
    </div>
  )
}
