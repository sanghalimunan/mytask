import { isGoogleConfigured } from '../lib/googleAuth.js'

const SYNC_LABELS = {
  idle: '',
  saving: 'Menyimpan ke Drive...',
  saved: 'Tersimpan ke Google Drive',
  error: 'Ralat menyimpan',
}

export default function AuthPanel({ auth, sync, onSignIn, onSignOut, onOpenSettings }) {
  if (!isGoogleConfigured()) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-maroon-900/50 bg-maroon-950/30 px-3 py-2 text-xs text-neutral-400">
        <span>Mod tetamu (data tempatan). Google belum disambung.</span>
        <button onClick={onOpenSettings} className="font-medium text-maroon-300 hover:text-maroon-200">
          Buka Settings →
        </button>
      </div>
    )
  }

  if (auth.status === 'signed-in') {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {auth.user?.picture && (
          <img src={auth.user.picture} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
        )}
        <span className="text-neutral-300">{auth.user?.email}</span>
        <span
          className={
            sync.status === 'error' ? 'text-red-400' : 'text-neutral-500'
          }
        >
          {SYNC_LABELS[sync.status]}
        </span>
        <button onClick={onSignOut} className="rounded-lg border border-neutral-700 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800">
          Log keluar
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      {auth.status === 'error' && <span className="text-red-400">{auth.error}</span>}
      <button
        onClick={onSignIn}
        disabled={auth.status === 'signing-in' || auth.status === 'restoring'}
        className="btn-primary"
      >
        {auth.status === 'signing-in' || auth.status === 'restoring'
          ? 'Menyambung...'
          : 'Sign in dengan Google'}
      </button>
    </div>
  )
}
