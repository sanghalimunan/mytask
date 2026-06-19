# MyTaSK Vercel Edition v1

Versi ini bukan lagi Apps Script Web App. Ia boleh diupload terus ke Vercel sebagai static web app.

## Apa yang berubah

- Paparan berjalan terus dari Vercel.
- Login guna Google OAuth.
- Data task/settings disimpan dalam Google Drive user sebagai fail JSON:
  `MyTaSK Database.json`
- Tiada `google.script.run`.
- Tiada `Code.gs`.
- Apps Script tidak diperlukan.

## Fail dalam ZIP

- `index.html`
- `vercel.json`
- `manifest.webmanifest`
- `README_SETUP.md`

## Setup Google OAuth Client ID

1. Buka Google Cloud Console.
2. Create project baru, contoh: `MyTaSK`.
3. Pergi `APIs & Services > Library`.
4. Enable:
   - Google Drive API
5. Pergi `APIs & Services > OAuth consent screen`.
6. Pilih External kalau untuk pengguna luar.
7. Isi app name: `MyTaSK`
8. Tambah scope:
   - `https://www.googleapis.com/auth/drive.file`
9. Pergi `APIs & Services > Credentials`.
10. Create Credentials > OAuth client ID.
11. Application type: Web application.
12. Authorized JavaScript origins:
    - `http://localhost:3000` untuk test local jika perlu
    - `https://NAMA-PROJECT.vercel.app`
    - domain custom kau nanti, contoh `https://mytask.arkideska.com`
13. Copy Client ID.

## Masukkan Client ID

Buka `index.html`, cari:

`PASTE_GOOGLE_OAUTH_CLIENT_ID_HERE.apps.googleusercontent.com`

Ganti dengan Client ID sebenar daripada Google Cloud Console.

Contoh:

`1234567890-abcxyz.apps.googleusercontent.com`

## Upload ke Vercel

1. Buka https://vercel.com/drop
2. Drag folder atau ZIP ini.
3. Deploy.
4. Buka URL Vercel.
5. Login Google.
6. Benarkan permission Google Drive.
7. MyTaSK akan cipta fail `MyTaSK Database.json` dalam Google Drive user.

## Nota penting

OAuth scope `drive.file` membenarkan app access fail yang dicipta/dibuka oleh app sahaja. Ia lebih sesuai daripada scope Drive penuh.

Kalau app mahu digunakan ramai orang awam, Google mungkin perlukan OAuth consent verification sebelum app nampak benar-benar professional.
