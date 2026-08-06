# PhD Tracker (StrategiSK)

Dashboard React + Vite + Tailwind + Recharts untuk pemantauan program PhD 2.5 tahun (30 bulan), dengan Google Drive sebagai storage (rujuk blueprint asal untuk perancangan penuh).

## Status

- **Fasa 1 (siap):** dashboard frontend dengan data dummy.
- **Fasa 2 (siap):** login Google OAuth + storage Google Drive (`appDataFolder`).
- **Fasa 3 (siap):** reminder Telegram/WhatsApp melalui Netlify Functions, ditambah panel Settings dalam app.

## Setup

```bash
npm install
```

### Google OAuth + Drive

1. Pergi https://console.cloud.google.com → cipta project baharu.
2. **APIs & Services → Library** → aktifkan **Google Drive API**.
3. **APIs & Services → Credentials** → Create Credentials → OAuth Client ID → jenis "Web application".
4. Authorized JavaScript origins: `http://localhost:5173` (untuk dev) dan URL deploy awak nanti.
5. Salin **Client ID** tu.

**Letak kat mana:** buka app, klik butang **⚙ Settings** kat header, dan paste Client ID dalam ruang "Google OAuth Client ID". Ia disimpan hanya dalam `localStorage` browser tu sahaja — tak ditulis dalam `.env`, tak dibundle dalam HTML/JS yang dibina, dan tak dikomit ke repo. (`VITE_GOOGLE_CLIENT_ID` dalam `.env.example` masih ada sebagai fallback pilihan untuk dev tempatan kalau awak tak nak masukkan semula setiap kali clear browser storage, tapi panel Settings adalah cara utama.)

Nota: Client ID Google OAuth sebenarnya bukan rahsia sulit — dokumentasi Google sendiri kata ia memang direka untuk didedahkan dalam client-side app. Mengelakkannya daripada masuk dalam build tetap amalan baik dan itu yang diminta di sini; cuma ia bukan melindungi apa-apa yang sensitif dengan sendirinya.

Tiada rahsia server/backend diperlukan untuk login — app ni guna Google Identity Services (implicit token flow) terus dari browser, minta scope `drive.appdata` sahaja supaya boleh baca/tulis fail `phd-tracker-data.json` yang private dalam App Data Folder tersembunyi Google Drive akaun awak sendiri. Tak nampak dalam Drive biasa awak dan tiada app lain boleh baca fail tu.

Kalau Client ID belum ditetapkan, app akan jalan dalam mod tetamu guna data dummy tempatan — ada banner kat header yang bagitahu, dengan pautan ke Settings.

### Notifikasi Telegram + WhatsApp (rahsia sebenar — server-side sahaja)

Berbeza dengan Client ID Google, benda-benda ni **memang rahsia sebenar** dan tak boleh sampai ke browser langsung. Ia ditetapkan sebagai **environment variable Netlify** (Site settings → Environment variables), dibaca hanya dalam `netlify/functions/*.js`, dan tak sekali-kali terdedah dalam client bundle atau dimasukkan dalam panel Settings.

1. **Telegram**: mesej `@BotFather` dalam Telegram, taip `/newbot`, salin bot token → environment variable Netlify `TELEGRAM_BOT_TOKEN`. Hantar mesej ke bot awak dulu, pastu buka `https://api.telegram.org/bot<TOKEN>/getUpdates` untuk dapatkan chat ID awak.
2. **WhatsApp (Twilio)**: daftar di https://www.twilio.com/whatsapp, aktifkan sandbox, salin **Account SID** dan **Auth Token** → environment variable Netlify `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`, dan nombor WhatsApp sandbox tu → `TWILIO_WHATSAPP_FROM`.
3. Destinasi fallback pilihan untuk reminder berjadual yang jalan sendiri (bukan rahsia, cuma chat ID / nombor awak sendiri): `TELEGRAM_CHAT_ID`, `TWILIO_WHATSAPP_TO`.

Dalam panel Settings app, awak boleh tetapkan Telegram Chat ID / nombor WhatsApp **awak sendiri** (disimpan bersama data PhD awak dalam Drive, bukan rahsia) dan klik "Uji Telegram" / "Uji WhatsApp" untuk hantar satu mesej ujian melalui Netlify Functions yang telah dideploy — ni hanya berfungsi selepas deploy ke Netlify, bukan dalam `npm run dev` tempatan.

`netlify/functions/scheduled-reminder.js` jalan setiap jam (Netlify Scheduled Functions) dan, pada jam 8 malam waktu Malaysia, hantar reminder TDR (dan reminder TM168 sekali kalau hari Ahad) ke destinasi `TELEGRAM_CHAT_ID` / `TWILIO_WHATSAPP_TO`. Sebab akses Drive dalam app ni browser-only sahaja (tiada refresh token disimpan di server), cron yang jalan sendiri tu tak boleh cari tetapan reminder pengguna tertentu yang login dari Drive — ia sentiasa target destinasi env-var yang tetap tu, yang okay untuk tracker peribadi satu pengguna macam ni. Netlify Scheduled Functions perlukan plan berbayar; alternatif percuma ialah ping URL function tu dari https://cron-job.org.

## Jalankan

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Sambungkan site Netlify ke repo ni dengan **Base directory** ditetapkan sebagai `phd-tracker`. `netlify.toml` di sini uruskan build command, publish directory, dan Functions directory.
