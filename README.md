# ⚡ Kerjain - Modern Hyperlocal Service Marketplace Platform

<div align="center">

![Version](https://img.shields.io/badge/Version-v3.170826.21.21-emerald?style=for-the-badge&logo=rocket&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js%2016-Turbopack-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript%205-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma%207-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL%20/%20Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**Platform marketplace jasa dan bantuan mikro lokal terpercaya yang menghubungkan Konsumen dengan Mitra kerja terdekat secara instan, aman, dan transparan.**

</div>

---

## 🚀 Catatan Rilis & Pembaruan Versi (`v3.170826.21.21`)

- **Optimasi Performa & Efisiensi Memori**:
  - Penerapan memoization pada komponen daftar pekerjaan, obrolan pesan, riwayat transaksi, dan notifikasi untuk meminimalkan beban render ulang pada perangkat mobile.
  - Pengurangan alokasi memori berulang pada komponen navigasi dan dashboard pengguna.
- **Formulir Pembuatan Pekerjaan**:
  - Penyesuaian tata letak tombol aksi dan kartu ringkasan pekerjaan agar tetap proporsional dan tidak terpotong pada berbagai ukuran layar ponsel.
- **Obrolan & Pratinjau Foto Layar Penuh (*In-App Lightbox*)**:
  - Penambahan modal pratinjau foto interaktif layar penuh di ruang obrolan dengan fitur zoom, unduh, dan penutupan cepat tanpa membuka tab baru (mencegah isu halaman kosong).
  - Implementasi pemuatan gambar asinkron dan lazy loading pada lampiran foto untuk menghemat penggunaan data dan memori.
- **Dompet & Grafik Keuangan**:
  - Perbaikan kalkulasi kurva pendapatan mitra dan sinkronisasi data transaksi QRIS serta tunai secara berkala.
- **Profil & Akun**:
  - Penambahan panel informasi pembaruan aplikasi yang dapat ditutup permanen di halaman akun pengguna.
  - Peningkatan kestabilan fitur pemotongan foto profil dan sinkronisasi informasi status akun.

---

## 📖 Ringkasan Proyek

**Kerjain** adalah platform ekonomi sirkular dan pasar jasa on-demand yang dirancang untuk membantu masyarakat menyelesaikan berbagai kebutuhan sehari-hari (seperti pertukangan, kebersihan, angkat barang, kurir mikro, hingga reparasi) melalui tenaga mitra kerja lokal terverifikasi.

Aplikasi ini dibangun menggunakan arsitektur monorepo modern berbasis **Next.js 16 (App Router & Serverless API)**, **Prisma ORM**, dan **Supabase / PostgreSQL**, dengan estetika antarmuka *Liquid Glassmorphism* yang responsif dan performa animasi 60fps (*Framer Motion*).

---

## ✨ Fitur Utama

### 🛍️ Sisi Konsumen (Pencari Bantuan)
- **Posting Pekerjaan Cepat**: Formulir bertahap (5 langkah) dengan kompresi foto otomatis di sisi klien (HTML5 Canvas JPEG) sebelum diunggah ke database.
- **Deteksi Lokasi GPS & Jarak**: Integrasi geocoding & reverse geocoding via Geoapify API untuk menghitung jarak presisi antara pemosting dan mitra.
- **Sistem Pembayaran Escrow (Rekber)**: Dana tersimpan aman dan baru dicairkan ke saldo mitra setelah pekerjaan dikonfirmasi selesai.
- **Pemantauan Progres Real-Time**: Galeri progres foto langsung dari lapangan dan slider konfirmasi penyelesaian (*Swipe to Confirm*).
- **Penilaian & Review**: Sistem ulasan transparan untuk menjaga kualitas komunitas.

### 🛵 Sisi Mitra Kerja (Pemberi Bantuan)
- **Tombol Radar Zap Energy**: Toggle status online/offline dengan animasi pengumpulan energi partikel saat mengaktifkan radar order.
- **Filter & Radar Job Terdekat**: Menampilkan pekerjaan publik di sekitar dengan estimasi waktu, imbalan, dan jarak aktual.
- **Update Progres & Upload Foto**: Mitra dapat mengirimkan foto bukti tahapan kerja langsung ke galeri timeline pekerjaan.
- **Dompet Digital & Grafik Finansial**: Akumulasi saldo imbalan dari pekerjaan selesai dengan grafik performa QRIS vs Tunai dan fitur penarikan dana instan ke rekening bank.

### 💬 Komunikasi & Notifikasi
- **Live In-App Chat**: Pertukaran pesan real-time antar pengguna dengan penanda status terbaca (*read status*).
- **Sinkronisasi Lonceng Notifikasi**: Polling otomatis dan *instant query invalidation* saat terjadi penerimaan job, pembaruan status, pesan baru, atau pencairan dana.

### 👤 Profil & Autentikasi
- **Selektor Peran & Gender**: Tombol peran berdampingan (Konsumen / Mitra) dan selektor jenis kelamin (Wanita / Pria) yang terintegrasi langsung saat registrasi dan profil.
- **Koleksi Avatar Karakter & Custom Crop**: Generator avatar dinamis dan pemotong foto profil melingkar berkualitas tinggi.
- **Pemulihan Kata Sandi (OTP)**: Pengiriman kode OTP 6-digit instan via integrasi Resend Email API dengan template HTML gelap premium.

### 📱 Navigasi Dock Mobile Modern
- **Bilah Navigasi Kaca Mengambang (*Floating Liquid Glass Dock*)**: 5 kolom simetris dengan indikator kaca aktif *spring physics* yang presisi di tengah.
- **Aksen Kurung Lengkung Kontras `( )`**: Tombol aksi utama **Buat** diapit kurung lengkung bercahaya hijau emerald yang membentang dari atas hingga bawah kartu.

---

## 🏗️ Struktur Direktori

```text
Kerjain/
├── frontend/                     # Full-stack Next.js Application
│   ├── prisma/
│   │   └── schema.prisma         # Skema Database PostgreSQL (User, Job, Payment, dll)
│   ├── public/
│   │   ├── Logo_Here/            # Aset Logo Vektor & Typography
│   │   └── ...
│   ├── src/
│   │   ├── app/                  # Next.js App Router (Halaman & API Routes)
│   │   │   ├── api/v1/           # REST API Endpoints
│   │   │   │   ├── auth/         # Login, Register, Forgot & Reset Password
│   │   │   │   ├── jobs/         # CRUD Jobs, Actions (accept, start, finish, progress)
│   │   │   │   ├── messages/     # Chat Messaging & Read Status
│   │   │   │   ├── notifications/# Realtime Notifications API
│   │   │   │   ├── payments/     # Payment Processing & QRIS
│   │   │   │   ├── reviews/      # Rating & Review Submissions
│   │   │   │   ├── users/        # User Profile & Realtime Stats
│   │   │   │   └── wallet/       # Partner Wallet Balance, Stats & Withdrawals
│   │   │   ├── dashboard/        # Halaman Dashboard Konsumen & Mitra
│   │   │   ├── profile/          # Halaman Manajemen Profil & Crop Foto
│   │   │   ├── register/         # Halaman Registrasi Interaktif
│   │   │   ├── login/            # Halaman Masuk
│   │   │   ├── help/             # Pusat Bantuan 24/7
│   │   │   └── layout.tsx        # Root Layout dengan Theme Provider
│   │   ├── components/           # Komponen UI Reusable
│   │   │   ├── dashboard/        # Komponen Dashboard, Wallet & FinancialEarningsChart
│   │   │   ├── jobs/             # JobCard, JobTimeline, ProgressGallery, DistanceBadge
│   │   │   ├── layouts/          # TopNav, MobileNav, Sidebar, DashboardLayout
│   │   │   ├── maps/             # LocationPicker & MapViewer
│   │   │   ├── notifications/    # NotificationDropdown & Badge
│   │   │   ├── profile/          # ImageCropModal
│   │   │   └── ui/               # Base UI Buttons, Modals, Dialogs, SmoothDropdown
│   │   ├── features/             # Modul Fitur (Auth, Jobs, Dashboard)
│   │   ├── hooks/                # Custom React Hooks (useJobs, useNotifications, useWallet)
│   │   ├── lib/                  # Utilities (Prisma Client, Axios Instance, Distance, Resend)
│   │   ├── store/                # Global State (Zustand Auth Store)
│   │   └── types/                # Definisi Tipe TypeScript
│   ├── package.json
│   └── vercel.json               # Konfigurasi Deployment Frontend
├── vercel.json                   # Konfigurasi Monorepo Deployment Vercel
├── package.json                  # Root Monorepo Runner
└── README.md
```

---

## 📋 Skema Database (Prisma ORM)

Platform Kerjain menggunakan model relasional yang ketat:
- **`User`**: Data pengguna, email terverifikasi, kata sandi ter-hash (Bcrypt), peran (`consumer`/`partner`), jenis kelamin (`MALE`/`FEMALE`), dan avatar URL.
- **`Job`**: Entitas pekerjaan, judul, deskripsi, alamat, koordinat latitude/longitude, foto pekerjaan, imbalan, dan status siklus (`PUBLISHED`, `ACCEPTED`, `WORKING`, `WAITING_CONFIRMATION`, `COMPLETED`, dll).
- **`JobProgress`**: Log rekam jejak tahapan kerja yang dilengkapi catatan teks dan lampiran foto langsung dari mitra.
- **`Payment`**: Transaksi pembayaran dengan metode `CASH` atau `QRIS` beserta status pembayaran.
- **`Review`**: Ulasan dan rating bintang (1-5) antara konsumen dan mitra kerja.
- **`Notification`**: Notifikasi terdistribusi untuk berbagai aksi sistem.
- **`Wallet` & `Withdrawal`**: Saldo mitra dan riwayat penarikan dana ke rekening bank.

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env.local` atau `.env` di dalam direktori `frontend/`:

```env
# Koneksi Database PostgreSQL / Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require"

# JWT Secret untuk Autentikasi
JWT_SECRET="rahasia_jwt_super_aman_kerjain_2026"

# URL Endpoint API
NEXT_PUBLIC_API_URL="/api/v1"

# Geoapify API Key untuk Pencarian Lokasi & Peta
NEXT_PUBLIC_GEOAPIFY_API_KEY="your_geoapify_api_key"

# Resend API Key untuk Pengiriman OTP Reset Password
RESEND_API_KEY="re_your_resend_api_key"
RESEND_FROM_EMAIL="Kerjain <onboarding@resend.dev>"
```

---

## 🚀 Panduan Menjalankan (Local Development)

### 1. Kloning Repositori
```bash
git clone https://github.com/KyonKyon0/Kerjain.git
cd Kerjain
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Sinkronisasi Database
```bash
cd frontend
npx prisma generate
npx prisma db push
cd ..
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:3000`.

---

## ☁️ Panduan Deployment Produksi

### Opsi 1: Vercel (Rekomendasi)
Repositori ini telah dikonfigurasi secara optimal untuk Vercel:
1. Hubungkan repositori GitHub ke [Vercel Dashboard](https://vercel.com).
2. Konfigurasi `DATABASE_URL`, `JWT_SECRET`, dan variabel lingkungan lainnya pada tab **Settings > Environment Variables**.
3. Vercel akan otomatis mengeksekusi `prisma generate && next build` melalui skrip `postinstall` dan `build`.

### Opsi 2: aaPanel / VPS / Server Node.js
1. Pasang Node.js (v20+) dan PM2 pada server.
2. Jalankan perintah instalasi dan build:
   ```bash
   cd Kerjain/frontend
   npm install --production=false
   npx prisma generate
   npm run build
   ```
3. Jalankan service menggunakan PM2:
   ```bash
   pm2 start npm --name "kerjain" -- run start
   ```
4. Arahkan reverse proxy Nginx ke port `3000`.

---

## 📄 Lisensi & Hak Cipta

© 2026 **Kerjain Platform** by **KyonKyon0**. Seluruh hak cipta dilindungi undang-undang.
