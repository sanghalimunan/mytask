# PhD Tracker (StrategiSK)

React + Vite + Tailwind + Recharts dashboard for tracking a 30-month PhD program, with Google Drive as storage (see the top-level blueprint for the full plan).

## Status

- **Phase 1 (done):** frontend dashboard with dummy data.
- **Phase 2 (done):** Google OAuth login + Google Drive (`appDataFolder`) persistence.
- **Phase 3 (todo):** Telegram/WhatsApp reminders via Netlify Functions.

## Setup

```bash
npm install
cp .env.example .env
```

### Google OAuth + Drive

1. Go to https://console.cloud.google.com → create a project.
2. **APIs & Services → Library** → enable **Google Drive API**.
3. **APIs & Services → Credentials** → Create Credentials → OAuth Client ID → type "Web application".
4. Authorized JavaScript origins: `http://localhost:5173` (dev) and your deployed URL later.
5. Copy the **Client ID** into `.env` as `VITE_GOOGLE_CLIENT_ID`.

No backend/server secret is needed — the app only uses the public Client ID with Google Identity Services (implicit token flow) directly from the browser, requesting the `drive.appdata` scope so it can read/write a private `phd-tracker-data.json` file inside your own Google Drive's hidden App Data folder. Nothing here is visible in your regular Drive UI and no other app can read it.

Without `VITE_GOOGLE_CLIENT_ID` set, the app runs in guest mode against local dummy data — a banner in the header says so.

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```
