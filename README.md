# 📖 Panduan Upload SafeTrack ke Google Sites

## File yang Tersedia (11 halaman)

| No | File | Halaman Google Sites |
|----|------|---------------------|
| 01 | 01_dashboard.html | Dashboard |
| 02 | 02_inspeksi_apar.html | Inspeksi → APAR |
| 03 | 03_inspeksi_hydrant.html | Inspeksi → Hydrant |
| 04 | 04_inspeksi_p3k.html | Inspeksi → P3K |
| 05 | 05_inspeksi_peralatan.html | Inspeksi → Peralatan Kerja |
| 06 | 06_permit_kerja.html | Permit & JSA → Permit Kerja |
| 07 | 07_jsa.html | Permit & JSA → JSA |
| 08 | 08_kondisi_tidak_aman.html | Pelaporan → Kondisi Tidak Aman |
| 09 | 09_request_apd.html | Pelaporan → Request APD |
| 10 | 10_saran_lainnya.html | Pelaporan → Saran Lainnya |
| 11 | 11_admin_kelola_laporan.html | Admin → Kelola Laporan |

---

## Langkah-langkah Upload ke Google Sites

### STEP 1 – Upload file HTML ke Google Drive
1. Buka **Google Drive** (drive.google.com)
2. Buat folder baru, misalnya: `SafeTrack Pages`
3. Upload semua 11 file HTML ke folder tersebut
4. Klik kanan tiap file → **"Get link"** → ubah ke **"Anyone with the link"**

### STEP 2 – Dapatkan URL embed tiap file
Setelah di-share, URL file HTML di Drive akan seperti ini:
```
https://drive.google.com/file/d/[FILE_ID]/view
```
Ubah jadi URL embed:
```
https://drive.google.com/file/d/[FILE_ID]/preview
```
Ganti `/view` → `/preview`

### STEP 3 – Buat halaman di Google Sites
1. Buka **Google Sites** (sites.google.com)
2. Buat site baru atau buka yang sudah ada
3. Tambahkan halaman-halaman sesuai struktur:
   - Dashboard
   - Inspeksi APAR
   - Inspeksi Hydrant
   - Inspeksi P3K
   - Inspeksi Peralatan
   - Permit Kerja
   - JSA
   - Kondisi Tidak Aman
   - Request APD
   - Saran Lainnya
   - Admin Panel *(batasi aksesnya)*

### STEP 4 – Embed tiap halaman HTML
Di setiap halaman Google Sites:
1. Klik **Insert** (tombol +)
2. Pilih **Embed** → **By URL**
3. Masukkan URL preview dari Google Drive:
   ```
   https://drive.google.com/file/d/[FILE_ID]/preview
   ```
4. Klik **Insert**
5. Resize iframe sesuai kebutuhan *(disarankan tinggi ≥ 700px)*

---

## Cara Alternatif: Hosting Gratis (Lebih Andal)

### Opsi A – GitHub Pages (GRATIS, tanpa CORS masalah)
1. Buat akun GitHub di github.com
2. Buat repository baru (misalnya: `safetrack`)
3. Upload semua 11 file HTML
4. Aktifkan **GitHub Pages**: Settings → Pages → Source: main branch
5. URL jadi: `https://[username].github.io/safetrack/01_dashboard.html`
6. Embed URL langsung di Google Sites dengan **Embed → By URL**

### Opsi B – Netlify Drop (Paling Mudah, GRATIS)
1. Buka **netlify.com/drop** (atau app.netlify.com)
2. Drag & drop semua file HTML sekaligus ke halaman tersebut
3. Netlify otomatis deploy dan beri URL seperti:
   `https://[random-name].netlify.app/01_dashboard.html`
4. Embed tiap URL di Google Sites

---

## ⚠️ Catatan Penting

### Tentang Sinkronisasi Data
- Semua halaman **berbagi data** lewat `localStorage` di browser yang sama
- Data otomatis **tersinkron ke Google Sheets** setiap ada laporan baru
- Admin dapat melihat semua laporan dari Google Sheets atau halaman Admin

### Tentang Google Drive Embed
- Google Drive preview terkadang memblokir JavaScript → gunakan GitHub Pages atau Netlify
- Jika menggunakan Drive dan form tidak berfungsi, pindah ke Netlify/GitHub Pages

### Tentang Password Admin
- Password default: **admin123**
- Untuk ganti password, edit baris di file `11_admin_kelola_laporan.html`:
  ```javascript
  const ADMIN_PASS='admin123';  // ← Ganti ini
  ```

### Ukuran Iframe yang Disarankan
- Dashboard: **tinggi 900px**
- Halaman form: **tinggi 700px**
- Admin Panel: **tinggi 800px**

---

## Struktur Navigasi Google Sites yang Disarankan

```
SafeTrack K3
├── 🏠 Dashboard
├── 📋 Inspeksi
│   ├── 🧯 APAR
│   ├── 🚒 Hydrant
│   ├── 🩹 P3K
│   └── 🔧 Peralatan Kerja
├── 📄 Permit & JSA
│   ├── 📋 Permit Kerja
│   └── ⚠️ JSA
├── 🚨 Pelaporan
│   ├── 🚨 Kondisi Tidak Aman
│   ├── 🦺 Request APD
│   └── 💬 Saran Lainnya
└── ⚙️ Admin (Batasi Akses)
    └── Kelola Laporan
```
