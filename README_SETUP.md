# MyTaSK Vercel Edition v1.1 Debug

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


## OAuth origins untuk projek ini

Masukkan origins ini dalam Google Cloud Console > OAuth Client ID > Authorized JavaScript origins:

- https://mytask-arkideska.vercel.app
- https://mytask-arkideska-e5xrvx05o-arkideska.vercel.app

Nota:
- Jangan letak slash `/` di hujung.
- `mytask-arkideska.vercel.app` ialah production domain yang lebih stabil.
- URL yang ada kod panjang seperti `e5xrvx05o` biasanya preview/deployment URL dan boleh berubah.

## v1.3 Import Fixed

- Fixed import JSON daripada versi Apps Script / Google Sheet.
- Import sekarang merge task terus ke Google Drive JSON database.
- Settings/category daripada backup turut boleh dibawa masuk.
- Apps Script tidak digunakan.

## v1.4 Undo + Auto Login

- Tambah button Undo pada mobile header dan desktop actions.
- Undo menyokong add/edit/delete/toggle done/import/clear completed/settings.
- Selepas login berjaya, app simpan flag auto-login dalam browser.
- Bila app dibuka semula, MyTaSK cuba reconnect Google secara senyap.
- Nota: OAuth browser tidak memberi refresh token kekal. Jika sesi Google tamat, browser block cookies, incognito, atau permission reset, user masih perlu klik Sign in semula.

## v1.5 AI Text Planner

- Tambah panel AI Planner.
- User boleh taip arahan kerja dalam ayat biasa.
- AI pulangkan task, due date, category, priority dan note.
- User perlu review dan klik `Apply to Calendar`.
- Tambah Vercel API route `/api/ai-plan-task`.
- Letakkan API key sebagai Environment Variable di Vercel: `OPENAI_API_KEY`.
- Optional model override: `OPENAI_MODEL`.
- Jika `OPENAI_API_KEY` belum diset, app guna fallback planner ringkas.

## v1.6 ChatGPT Import Automate

- Tambah modal `Import from ChatGPT`.
- Boleh paste JSON terus daripada ChatGPT.
- Ada button `Paste from Clipboard`.
- Tidak perlu upload fail JSON secara manual.
- Sokong format:
  - `{"tasks":[...]}`
  - `[...]`
  - fenced code block ```json ... ```
- Task terus apply ke calendar dan save ke Google Drive.
