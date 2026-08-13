# 🚀 Kerjain - Fullstack Local Service Marketplace

**Kerjain** adalah platform marketplace jasa lokal yang menghubungkan konsumen (Penerbit) dengan pekerja (Mitra) di sekitarnya. Proyek ini dibangun sebagai aplikasi full-stack monolitik menggunakan Next.js (App Router) dan Prisma ORM dengan database PostgreSQL.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand, React Query
- **Database & ORM**: PostgreSQL, Prisma ORM
- **UI Components**: Radix UI / Base UI / Lucide React

---

## 📁 Folder Structure
```text
Kerjain/
├── frontend/          # Aplikasi Full-stack Next.js
│   ├── prisma/        # Skema database & migrasi (Prisma)
│   ├── public/        # Aset statis (gambar, dll)
│   ├── src/
│   │   ├── app/       # Frontend pages & API Routes (app/api/v1)
│   │   ├── components/# Komponen UI dan layout
│   │   ├── hooks/     # Custom React Hooks
│   │   ├── lib/       # Konfigurasi utility (Prisma client, cn, dll)
│   │   ├── store/     # State management (Zustand)
│   │   └── types/     # Definisi tipe TypeScript
│   ├── .env           # Environment variables
│   └── package.json   # Dependencies
```

---

## ⚙️ Environment Variables

Buat file `.env` di dalam folder `frontend/` berdasarkan template yang dibutuhkan:
```env
# Koneksi ke Database PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"

# URL Utama Aplikasi
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"
```

---

## 🚀 Installation & Run (Local Development)

1. **Masuk ke folder frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Database (Prisma):**
   Pastikan Anda sudah mengatur `DATABASE_URL` di dalam `.env`.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di: `http://localhost:3000`

---

## 🌐 Deployment Instructions

Karena proyek ini menggunakan arsitektur full-stack Next.js (dimana backend menggunakan API Routes), maka seluruh kode berada pada folder `frontend/`.

### Opsi 1: Deploy ke Vercel (Paling Direkomendasikan)
1. Hubungkan repository GitHub ke [Vercel](https://vercel.com/).
2. Atur **Framework Preset** ke `Next.js`.
3. Atur **Root Directory** ke `frontend`.
4. Tambahkan Environment Variable `DATABASE_URL` di pengaturan Vercel.
5. Pada bagian **Build Command**, pastikan menjalankan: `npx prisma generate && next build`.
6. Klik Deploy!

### Opsi 2: Deploy ke VPS / aaPanel (Node.js)
1. Clone repository ke dalam VPS / aaPanel Anda.
2. Atur website menggunakan **Node.js Manager** (PM2) di aaPanel.
3. Arahkan *Document Root* ke folder `frontend`.
4. Tambahkan `.env` pada folder root `frontend`.
5. Jalankan perintah instalasi dan build:
   ```bash
   cd frontend
   npm install
   npx prisma generate
   npm run build
   ```
6. Jalankan server production (menggunakan PM2):
   ```bash
   npm run start
   ```
7. Atur Reverse Proxy pada domain Anda (misal: Nginx) untuk mengarahkan port 80/443 ke port Next.js (default: 3000).

---
*© 2026 Kerjain. All rights reserved.*
