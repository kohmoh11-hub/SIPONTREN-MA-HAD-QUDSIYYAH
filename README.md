# 🕌 Sistem Terpadu Pondok Pesantren (SIPONTREN)

Selamat datang di repositori **Sistem Terpadu Pondok Pesantren (SIPONTREN)**. Aplikasi ini dirancang sebagai platform terpadu untuk mendigitalisasi operasional internal pesantren secara modern, responsif, dan siap dideploy ke **Vercel** dengan basis data **Google Sheets** dan API **Google Apps Script** secara gratis (serverless)!

---

## 📂 Struktur Folder Final Project

Berikut adalah arsitektur direktori hasil build statis Anda:

```text
/
├── index.html            # Dasbor Utama (Ringkasan KPI & Visualisasi Chart.js)
├── login.html            # Portal Keamanan Akun Multi-Role (5 Peran Berbeda)
├── dashboard.html        # Snippet Statis Dasbor Statistik
├── izin.html             # Modul Keizinan Santri Keluar Pondok (Makhraj)
├── sarpras.html          # Laporan Masalah & Kerusakan Sarana Prasarana (Sarpras)
├── pembelajaran.html     # Jurnal Kelas Harian & Absensi Guru
├── Code.gs               # Kode API Script untuk ditaruh di Google Apps Script
├── config.js             # Berkas Konfigurasi Endpoint URL
├── services/
│   └── api.js            # Service Request Fetch API (GET, POST, dll.)
└── assets/
    ├── css/
    │   └── style.css     # Kustomisasi UI Modern & Variabel Hijau-Emas Pesantren
    └── js/
        └── app.js        # Logika Autentikasi, Guarding, & Inisialisasi Grafik
```

---

## 🛠️ Panduan Langkah-demi-Langkah Setup Serverless

### 1. Membuat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com) lalu buat Spreadsheet baru berlabel **Spreadsheet SIPONTREN**.
2. Buat **4 buah Sheet (Tab bawah)** dengan penulisan kapital persis seperti berikut:
   - **USERS**
     - Kolom headers baris pertama: `id`, `nama`, `username`, `password`, `role`, `status`
   - **IZIN**
     - Kolom headers baris pertama: `id`, `tanggal`, `nama`, `nis`, `kelas`, `kamar`, `tujuan`, `alasan`, `keluar`, `kembali`, `noHpwali`, `status`
   - **SARPRAS**
     - Kolom headers baris pertama: `id`, `tanggal`, `pelapor`, `kelas`, `lokasi`, `kategori`, `deskripsi`, `foto`, `status`
   - **PEMBELAJARAN**
     - Kolom headers baris pertama: `id`, `tanggal`, `guru`, `mapel`, `kelas`, `materi`, `metode`, `kehadiran`, `catatan`, `dokumentasi`

---

### 2. Membuat Google Apps Script
1. Masuk ke Google Spreadsheet Anda.
2. Klik menu **Ekstensi (Extensions)** &rarr; **Apps Script**.
3. Silakan salin (copy) seluruh isi file `Code.gs` (baik yang berada pada folder `/vanilla_project/Code.gs` atau tab di aplikasi) dan tempelkan (paste) semuanya langsung ke halaman editor tersebut menggantikan fungsi `myFunction` bawaan.
4. Ganti nilai konstanta `const SPREADSHEET_ID = "MASUKKAN_ID_SPREADSHEET_ANDA_DI_SINI";` dengan ID unik spreadsheet Anda (ID ini terletak pada URL browser Anda di antara `/d/` dan `/edit`).

---

### 3. Deploy sebagai Aplikasi Web (Web App)
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Terapkan (Deploy)** &rarr; **Penerapan baru (New deployment)**.
2. Pilih jenis penerapan dengan mengklik ikon ruji gerigi di kiri atas &rarr; pilih **Aplikasi web (Web app)**.
3. Konfigurasikan bidang parameter:
   - **Keterangan (Description)**: *SIPONTREN API v1*
   - **Jalankan sebagai (Execute as)**: *Saya sendiri (Me / Email Anda)*
   - **Siapa yang memiliki akses (Who has access)**: *Siapa saja (Anyone)* **(PENTING!)**
4. Klik **Terapkan (Deploy)**.
5. Setujui ijin autentikasi akun Google Anda jika diminta (Klik *Advanced* &rarr; *Go to Untitled Project (unsafe)* &rarr; *Allow*).
6. Salin **URL Aplikasi Web (Web App URL)** yang ditampilkan di bagian akhir. URL ini akan terlihat seperti: `https://script.google.com/macros/s/AKfycbz.../exec`.

---

### 4. Menghubungkan Frontend ke API
1. Buka file `/vanilla_project/config.js` di dalam direktori Anda.
2. Ganti nilai parameter URL di dalamnya:
   ```javascript
   const CONFIG = {
     API_URL: "TEMPEL_URL_HASIL_DEPLOY_APPS_SCRIPT_ANDA_DI_SINI",
     VERSI: "3.5.0",
     LEMBAGA: "Pondok Pesantren Komputer & IT"
   };
   ```
3. Selamat! File statis HTML Anda sekarang sudah siap berkomunikasi dengan Google Sheets Anda secara instan.

---

### 5. Deploy ke Vercel (Gratis & Cepat)
1. Buat akun gratis di [Vercel](https://vercel.com) jika belum memilikinya.
2. Simpan file-file statis Anda ke dalam repositori pribadi (seperti **GitHub**, **GitLab**, atau **Bitbucket**).
3. Di dasbor Vercel Anda, klik **Add New** &rarr; **Project**.
4. Import repositori Git yang berisi file-file statis pesantren Anda.
5. Pada bagian konfigurasi, biarkan pilihan default (Vercel otomatis mendeteksi konfigurasi web statis biasa jika tidak memiliki framework server) lalu klik tombol **Deploy**.
6. Web Anda akan online secara otomatis kurang dari 1 menit!

---

### 6. Konfigurasi Environment Variable (Opsional)
Jika Anda ingin menyembunyikan API URL dari pembacaan kode publik di GitHub:
1. Di dasbor project Vercel Anda, arahkan ke tab **Settings** &rarr; **Environment Variables**.
2. Tambahkan variabel baru:
   - **Key**: `VITE_PESANTREN_API_URL`
   - **Value**: `URL_Aplikasi_Web_Apps_Script_Anda`
3. Hal ini disarankan jika Anda menggunakan framework React/Vite modern. Untuk vanilla HTML statis murni, menaruhnya di `config.js` adalah pilihan termudah dan teraman selama spreadsheet Anda tidak dipublikasikan secara umum.

---

## 🔒 Hak Akses Multi-role untuk Simulasi Penggunaan

Aplikasi ini dilengkapi 5 role (peran) pengguna dengan kredensial instan di login screen untuk mempermudah pengujian:

| Role | Username | Sandi | Hak Akses Fitur |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Akses penuh 100% modul, melihat seluruh data, & manajemen akun user |
| **Pengasuh** | `pengasuh` | `pengasuh123` | Menyetujui/menolak izin santri keluar, tracking jam kembali |
| **Guru** | `guru` | `guru123` | Input jurnal ajar harian, mencatat absensi santri & evaluasi |
| **Petugas Sarpras** | `sarpras` | `sarpras123` | Memperbarui status kerusakan sarpras (Baru &rarr; Diproses &rarr; Selesai) |
| **Santri** | `santri` | `santri123` | Mengajukan izin makhraj baru, melaporkan kerusakan fasilitas dengan foto |

---
*Dibuat dengan dedikasi tinggi untuk modernisasi administrasi Pondok Pesantren di seluruh Indonesia. Selamat beramal saleh!*
