# 📖 Panduan Setup SafeMe

## File yang Tersedia (12 file)

| No | File | Halaman |
|----|------|---------|
| –  | `Code.gs` | **Google Apps Script** (backend) |
| 01 | `01_dashboard.html` | Dashboard |
| 02 | `02_inspeksi_apar.html` | Inspeksi → APAR |
| 03 | `03_inspeksi_hydrant.html` | Inspeksi → Hydrant |
| 04 | `04_inspeksi_p3k.html` | Inspeksi → P3K |
| 05 | `05_inspeksi_peralatan.html` | Inspeksi → Peralatan Kerja |
| 06 | `06_permit_kerja.html` | Permit & JSA → Permit Kerja |
| 07 | `07_jsa.html` | Permit & JSA → JSA |
| 08 | `08_kondisi_tidak_aman.html` | Pelaporan → Kondisi Tidak Aman *(+ foto upload)* |
| 09 | `09_request_apd.html` | Pelaporan → Request APD |
| 10 | `10_saran_lainnya.html` | Pelaporan → Saran Lainnya |
| 11 | `11_admin_kelola_laporan.html` | Admin → Kelola Laporan |

---

## STEP 1 – Setup Google Apps Script

1. Buka **Google Sheets** baru di sheets.google.com
2. Klik **Extensions → Apps Script**
3. Hapus semua kode default yang ada
4. Copy-paste seluruh isi file `Code.gs` ke editor
5. Klik **💾 Save**
6. Klik **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Klik **Deploy** → Copy URL deployment yang muncul
   - URL akan terlihat seperti:
     `https://script.google.com/macros/s/XXXXXXX/exec`

---

## STEP 2 – Ganti URL di semua file HTML

Buka setiap file HTML dan cari baris:
```javascript
const API = 'YOUR_SAFEME_APPS_SCRIPT_URL';
```
Ganti `YOUR_SAFEME_APPS_SCRIPT_URL` dengan URL deployment dari STEP 1.

Cara cepat (menggunakan text editor seperti VS Code):
- Buka semua 11 file
- Find & Replace: `YOUR_SAFEME_APPS_SCRIPT_URL`
- Replace with: `https://script.google.com/macros/s/XXXXXXX/exec`

---

## STEP 3 – Deploy ke GitHub Pages atau Netlify (Disarankan)

### Opsi A – Netlify (Paling Mudah, GRATIS)
1. Buka **netlify.com/drop**
2. Drag & drop semua 11 file HTML (tanpa Code.gs) ke halaman tersebut
3. Netlify deploy otomatis → beri URL seperti:
   `https://random-name.netlify.app/01_dashboard.html`
4. Embed URL tersebut di Google Sites

### Opsi B – GitHub Pages (GRATIS)
1. Buat akun di github.com
2. Buat repository baru (contoh: `safeme`)
3. Upload semua 11 file HTML
4. Settings → Pages → Source: main branch
5. URL: `https://[username].github.io/safeme/01_dashboard.html`

---

## STEP 4 – Embed di Google Sites

1. Buka **sites.google.com**, buat site baru
2. Untuk setiap halaman:
   - Klik **Insert (+) → Embed → By URL**
   - Masukkan URL file dari Netlify/GitHub Pages
   - Klik **Insert**
   - Resize iframe: disarankan tinggi ≥ 700px (Admin: 800px)

---

## Fitur Foto Upload (Kondisi Tidak Aman)

File `08_kondisi_tidak_aman.html` mendukung upload foto dengan dua cara:

| Tombol | Fungsi |
|--------|--------|
| **📷 Ambil Foto** | Membuka kamera langsung (belakang) di HP |
| **🖼️ Pilih dari Galeri** | Membuka file picker untuk memilih foto dari galeri/penyimpanan |

**Alur foto:**
1. User ambil/pilih foto → preview ditampilkan di form
2. Saat submit, foto (base64) dikirim bersama laporan ke Apps Script
3. Apps Script menyimpan foto ke **Google Drive** (folder `SafeMe_Photos`)
4. URL publik Drive disimpan di sheet kolom `photo_url`
5. Admin dapat melihat foto langsung dari panel admin (klik "📷 Lihat Foto")

**Batas ukuran foto:** 5 MB per foto
**Format yang didukung:** JPG, PNG, WEBP

---

## Tentang Data

- Data disimpan di `localStorage` browser (`safeme_reports`)
- Data otomatis sync ke Google Sheets setiap ada laporan baru
- Semua halaman berbagi data lewat localStorage yang sama (dalam domain yang sama)
- Admin dapat melihat semua laporan dari halaman Admin Panel

---

## Ganti Password Admin

Buka `11_admin_kelola_laporan.html`, cari dan ganti:
```javascript
const PASS = 'admin123';  // ← Ganti ini
```

---

## Struktur Navigasi Google Sites

```
SafeMe K3
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
│   ├── 🚨 Kondisi Tidak Aman  ← 📷 Foto Upload
│   ├── 🦺 Request APD
│   └── 💬 Saran Lainnya
└── ⚙️ Admin (Batasi Akses)
    └── Kelola Laporan
```
