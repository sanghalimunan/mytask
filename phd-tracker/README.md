# PhD Tracker (StrategiSK)

React + Vite + Tailwind + Recharts dashboard for tracking a 30-month PhD program, with Google Drive as storage (see the top-level blueprint for the full plan).

## Status

- **Phase 1 (done):** frontend dashboard with dummy data.
- **Phase 2 (done):** Google OAuth login + Google Drive (`appDataFolder`) persistence.
- **Phase 3 (done):** Telegram/WhatsApp reminders via Netlify Functions, plus an in-app Settings panel.

## Setup

```bash
npm install
```

### Google OAuth + Drive

1. Go to https://console.cloud.google.com → create a project.
2. **APIs & Services → Library** → enable **Google Drive API**.
3. **APIs & Services → Credentials** → Create Credentials → OAuth Client ID → type "Web application".
4. Authorized JavaScript origins: `http://localhost:5173` (dev) and your deployed URL later.
5. Copy the **Client ID**.

**Where it goes:** open the app, click the **⚙ Settings** button in the header, and paste the Client ID into "Google OAuth Client ID". It's saved to that browser's `localStorage` only — never written to `.env`, never bundled into the built HTML/JS, never committed to the repo. (`VITE_GOOGLE_CLIENT_ID` in `.env.example` still exists as an optional local-dev fallback if you'd rather not re-enter it every time you clear browser storage, but the Settings panel is the primary path.)

Note: a Google OAuth Client ID isn't a secret by design — Google's own docs say it's meant to be embedded in client-side apps. Keeping it out of the build is still good hygiene and is what was asked for here; it's not protecting anything sensitive by itself.

No backend/server secret is needed for auth — the app uses Google Identity Services (implicit token flow) directly from the browser, requesting only the `drive.appdata` scope so it can read/write a private `phd-tracker-data.json` file inside your own Google Drive's hidden App Data folder. Nothing here is visible in your regular Drive UI and no other app can read it.

Without a Client ID configured, the app runs in guest mode against local dummy data — a banner in the header says so, with a link to Settings.

### Telegram + WhatsApp notifications (real secrets — server-side only)

Unlike the Google Client ID, these **are** real secrets and must never reach the browser. They are set as **Netlify environment variables** (Site settings → Environment variables), read only inside `netlify/functions/*.js`, and are never exposed in the client bundle or entered into the Settings panel.

1. **Telegram**: message `@BotFather` on Telegram, `/newbot`, copy the bot token → Netlify env var `TELEGRAM_BOT_TOKEN`. Message your bot once, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your chat ID.
2. **WhatsApp (Twilio)**: sign up at https://www.twilio.com/whatsapp, activate the sandbox, copy **Account SID** and **Auth Token** → Netlify env vars `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`, and the sandbox's WhatsApp number → `TWILIO_WHATSAPP_FROM`.
3. Optional fallback destinations for the unattended scheduled reminder (not secret, just your own chat ID / number): `TELEGRAM_CHAT_ID`, `TWILIO_WHATSAPP_TO`.

In the app's Settings panel you can set **your own** Telegram Chat ID / WhatsApp number (stored with your PhD data in Drive, not secret) and click "Uji Telegram" / "Uji WhatsApp" to send a one-off test message through the deployed Netlify Functions — this only works after deploying to Netlify, not in local `npm run dev`.

`netlify/functions/scheduled-reminder.js` runs hourly (Netlify Scheduled Functions) and, at 8pm Malaysia time, sends a TDR reminder (and a TM168 reminder too if it's Sunday) to the `TELEGRAM_CHAT_ID` / `TWILIO_WHATSAPP_TO` destinations. Because Drive access is browser-only in this app (no stored refresh tokens server-side), the unattended cron can't look up a specific signed-in user's own reminder settings from Drive — it always targets those fixed env-var destinations, which is fine for a single-user personal tracker. Netlify Scheduled Functions require a paid plan; the free alternative is pinging a function URL from https://cron-job.org instead.

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Point a Netlify site at this repo with **Base directory** set to `phd-tracker`. `netlify.toml` here handles the build command, publish directory, and Functions directory.
