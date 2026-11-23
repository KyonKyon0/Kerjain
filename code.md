# 📘 DOKUMENTASI & ANALISIS KESELURUHAN CODEBASE KERJAIN
> **Dokumen Teknis Komprehensif Arsitektur, Teknologi, Alur Bisnis, Skema Data, API, dan Panduan Operasional Platform Kerjain**  
> *Versi Rilis Saat Ini: `v3.170826.22.40`*  
> *Target Dokumen: Referensi Utama Arsitektur, Analisis Kode Mendalam, & Landasan Prompting AI Agent*

---

## 1. RINGKASAN EKSEKUTIF & IDENTITAS PROYEK

### 1.1 Profil Proyek
* **Nama Platform:** **Kerjain** (sebelumnya dikembangkan dalam dokumen inisiasi sebagai *BantuTetangga*).
* **Definisi Produk:** *Hyperlocal On-Demand Peer-to-Peer Service Marketplace* — platform pasar jasa mikro dan bantuan harian lokal yang menghubungkan dua jenis pengguna:
  1. **Konsumen (Consumer):** Warga/pengguna yang membutuhkan bantuan tenaga fisik, jasa ringan, atau reparasi harian (misal: angkat galon, pindahan kos, cuci motor, bersihkan halaman, kurir mikro, servis genteng, perbaikan pipa).
  2. **Mitra (Partner):** Individu lokal di sekitar lokasi pemosting yang memiliki waktu luang, keterampilan praktis, atau kendaraan untuk memberikan bantuan dan menerima imbalan finansial secara instan.
* **Format Repositori:** **Monorepo** berbasis `npm workspaces` dengan direktori root mengontrol aplikasi inti di dalam direktori `frontend/`.
* **Prinsip Desain:** Mobile-First, Liquid Glassmorphism, Zero-Trust Authorization, Ultra-Low Latency Database Pooling, dan In-App Photo Timeline Escrow.

### 1.2 Masalah Nyata yang Diselesaikan
1. **Ketiadaan Saluran Terstruktur untuk Bantuan Mikro:** Sebelumnya, kebutuhan bantuan lokal hanya disebarkan melalui grup WhatsApp/Facebook warga atau mulut ke mulut tanpa ada kepastian tarif, jarak, atau pelacakan status.
2. **Ketiadaan Jaminan Keamanan Dana (Escrow):** Konsumen ragu membayar di awal, sedangkan mitra takut bekerja tanpa dibayar. Kerjain menerapkan mekanisme penahanan dana (escrow QRIS/Tunai) yang baru dicairkan setelah kedua pihak mengonfirmasi pekerjaan selesai.
3. **Pencarian Pekerjaan Berbasis Jarak Real-Time:** Menghitung jarak presisi dengan formula Haversine dan estimasi waktu tempuh motor urban sehingga mitra hanya mengambil pekerjaan yang relevan dan terjangkau secara fisik.

---

## 2. ARSITEKTUR SISTEM & POLA DESAIN (ARCHITECTURE PATTERNS)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT / BROWSER                              │
│  - React 19 (Server & Client Components) + Framer Motion (60fps)        │
│  - Zustand Persisted Store (Auth State, LocalStorage)                   │
│  - TanStack React Query v5 (Auto-polling, Caching, Mutation Lifecycle)   │
│  - Leaflet Map / HTML5 Geolocation API                                  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / REST JSON / FormData
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16 APP ROUTER (FULLSTACK)                     │
│  ┌──────────────────────────────┐    ┌────────────────────────────────┐ │
│  │     Client-Facing Pages      │    │    API Route Handlers (v1)     │ │
│  │ (/dashboard, /login, /jobs)  │    │ (/api/v1/jobs, /auth, /wallet) │ │
│  └──────────────┬───────────────┘    └───────────────┬────────────────┘ │
│                 │                                    │                  │
│                 │               ┌────────────────────┴────────────────┐ │
│                 │               │ In-Memory User Auth Cache (15s TTL) │ │
│                 │               └────────────────────┬────────────────┘ │
│                 │                                    │                  │
│                 ▼                                    ▼                  │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                       Prisma ORM 7 Engine                          │ │
│  │        (@prisma/adapter-pg over connection-pooled pg.Pool)         │ │
│  └─────────────────────────────────┬──────────────────────────────────┘ │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴────────────────────────┐
           ▼                                                  ▼
┌────────────────────────────────────┐    ┌───────────────────────────────────┐
│       POSTGRESQL / SUPABASE        │    │       EXTERNAL THIRD-PARTY        │
│ - Transaction Pooling (PgBouncer)  │    │ - Pakasir API (QRIS Gateway)      │
│ - Strict Schema & Foreign Keys     │    │ - Resend Email API (6-digit OTP)  │
│ - Auto-triggers updated_at         │    │ - LocationIQ / Geoapify (Maps)    │
└────────────────────────────────────┘    └───────────────────────────────────┘
```

### 2.1 Fullstack Monorepo Runner
Proyek menggunakan root `package.json` yang mendeklarasikan workspace `"frontend"`. Next.js 16 bertindak ganda sebagai penyedia frontend visual (React Server Components + Client Components) sekaligus API Gateway serverless melalui rute `/api/v1/*`. Ini meniadakan ketergantungan pada backend terpisah (seperti FastAPI di fase draft awal) sehingga arsitektur menjadi jauh lebih ringkas, hemat resource, dan mudah di-deploy pada VPS aaPanel maupun Vercel.

### 2.2 Pola Database Connection Pooling (Supabase Resilience)
Salah satu optimasi paling krusial di file `frontend/src/lib/prisma.ts`:
* Supabase Transaction Mode memiliki batas koneksi bersama (PgBouncer) yang sangat ketat (maksimal 15 koneksi paralel).
* Menggunakan `@prisma/adapter-pg` yang dibungkus `pg.Pool` dengan konfigurasi defensif:
  ```typescript
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 2,                        // Membatasi pool per instance serverless
    idleTimeoutMillis: 1000,       // Langsung lepaskan koneksi nganggur
    connectionTimeoutMillis: 5000,
    allowExitOnIdle: true,
  });
  ```
* Didukung dengan *fallback otomatis* antara `DIRECT_URL` (koneksi direct PostgreSQL port 5432 untuk migrasi/dev) dan `DATABASE_URL` (koneksi pooled port 6543 untuk runtime serverless).

### 2.3 In-Memory User Auth Caching (Zero-Lag Serverless)
Pada setiap request API yang terotentikasi, fungsi `getCurrentUser(request)` di `frontend/src/lib/current-user.ts` menerapkan *In-Memory LRU Cache*:
* **TTL:** 15 detik.
* **Mekanisme:** Token JWT yang telah diverifikasi dipetakan ke objek pengguna di memori. Jika klien melakukan 5 panggilan API secara paralel saat membuka dashboard (misal: get user, get jobs, get notifications, get wallet, get chat), hanya 1 query SQL `SELECT * FROM users` yang ditembakkan ke Supabase, sedangkan 4 panggilan lainnya memperoleh data seketika (0ms hit latency).

### 2.4 Zero-Trust Endpoint Authorization Pattern
Setiap endpoint tindakan (`frontend/src/app/api/v1/jobs/[id]/[action]/route.ts`) menerapkan verifikasi kepemilikan dan hak akses yang ketat:
* Konsumen tidak bisa mengambil pekerjaannya sendiri.
* Mitra tidak bisa mengonfirmasi penyelesaian pekerjaan (hanya konsumen pemilik yang sah).
* Mitra hanya dapat mengirim update status/progress jika `job.partner_id === user.id`.
* Chat dan notifikasi diisolasi: pengguna luar yang bukan pemilik atau mitra pekerjaan dilarang membaca atau mengirim pesan (`403 Forbidden`).

---

## 3. DAFTAR LENGKAP TEKNOLOGI & DEPENDENSI (TECH STACK MATRIX)

| Kategori | Teknologi / Pustaka | Versi | Peran & Alasan Penggunaan |
| :--- | :--- | :--- | :--- |
| **Framework Utama** | Next.js | `16.3.0` | App Router, Serverless Route Handlers, Turbopack, Image Optimization |
| **Library UI** | React / React DOM | `19.2.8` | Core UI engine, Concurrent Features, React Action hooks |
| **Bahasa Pemrograman** | TypeScript | `^5.0.0` | Strict static typing, definisi kontrak API dan schema interface |
| **Styling & Theme** | Tailwind CSS | `^4.0.0` | Utility-first CSS generasi terbaru berbasis CSS variables & OKLCH |
| **Animasi & Transisi** | Framer Motion | `^13.0.0` | Animasi 60fps, spring physics pada floating dock, modal lightbox |
| **Komponen UI Primitif** | Shadcn UI & Base UI | `@base-ui/react ^1.7.0`, `shadcn ^4.16.1` | Headless, accessible modal, dialog, dropdown, sheet, tooltip |
| **ORM & Database Client** | Prisma Client & CLI | `^7.9.1` | Type-safe SQL query generation, skema deklaratif, relasi foreign key |
| **Database Driver** | `@prisma/adapter-pg` & `pg` | `^7.9.1` / `^8.23.0` | Driver native PostgreSQL dengan pooling terkontrol untuk Supabase |
| **Penyedia Database** | PostgreSQL / Supabase | v15+ | Relational cloud database berkecepatan tinggi dengan UUID support |
| **State Global Client** | Zustand | `^5.0.14` | Micro-state management dengan middleware persistensi (`localStorage`) |
| **Data Fetching Server** | TanStack React Query | `^5.101.4` | Server-state caching, automatic refetching, background data sync |
| **Keamanan & Kriptografi** | `jose` & `bcrypt` | `jose ^6.2.8`, `bcrypt ^6.0.0` | JWT verification berbasis Web Crypto standards & blowfish password hashing |
| **Validasi Formulir** | Zod & React Hook Form | `zod ^3.25.76`, `react-hook-form ^7.84.0` | Validasi skema input login, registrasi, pembuatan job bertahap |
| **Email Gateway (OTP)** | Resend SDK | `^6.20.0` | Pengiriman email transaksi OTP pemulihan sandi via SMTP/API REST |
| **Payment Gateway** | Pakasir API | REST Integration | Pembuatan dynamic invoice QRIS dan pemantauan status transaksi |
| **Peta & Geocoding** | Leaflet & Geoapify / LocationIQ | `leaflet ^1.9.4`, `@types/leaflet ^1.9.22` | Render peta interaktif, reverse-geocoding koordinat GPS ke nama jalan |
| **Kompresi Gambar Klien** | `browser-image-compression` | `^2.0.2` | Kompresi foto job/progress sebelum upload agar payload base64 ringan |
| **Ikonografi & Notifikasi** | Lucide React & Sonner | `lucide-react ^1.28.0`, `sonner ^2.0.7` | Set ikon modern SVG & toast banner interaktif |
| **Export Canvas ke Gambar** | `html-to-image` | `^1.11.13` | Pengambilan snapshot bukti penyelesaian atau struk transaksi digital |

---

## 4. POHON DIREKTORI & ANATOMI STRUKTUR FILE (DIRECTORY ANATOMY)

```text
D:\Codinge_Here\Kerjain/
├── .vscode/                               # Konfigurasi workspace VSCode
├── document/
│   └── BantuTetangga/                     # Dokumen inisiasi awal produk (PRD, API, Business Rules, DB)
│       ├── API_SPEC.md                    # Draf spesifikasi REST API awal
│       ├── BUSINESS_RULES.md              # Aturan main hak akses & status job
│       ├── DB_SCHEMA.md                   # Catatan model data konseptual
│       ├── MVP_SCOPE.md                   # Batasan fitur Minimum Viable Product
│       ├── PRD.md                         # Product Requirements Document komprehensif
│       ├── TECH_STACK.md                  # Pilihan teknologi inisial
│       └── USER_FLOW.md                   # Diagram alur Konsumen dan Mitra
├── frontend/                              # APLIKASI UTAMA (Next.js Monorepo Workspace)
│   ├── .next/                             # Direktori build output & runtime Next.js
│   ├── prisma/
│   │   └── schema.prisma                  # Skema database produksi resmi (10 model & 7 enum)
│   ├── public/                            # File statis publik
│   │   ├── Logo_Here/                     # Brand logo & SVG aset
│   │   ├── Demo_Konsumer/                 # Tangkapan layar alur pengguna konsumen
│   │   ├── Demo_Mitra/                    # Tangkapan layar alur pengguna mitra
│   │   └── demo sdg_asta cita/            # Aset ilustrasi SDGs dan dampak sosial
│   ├── scripts/
│   │   └── clean-supabase.js              # Skrip darurat pembersihan data transaksi database
│   ├── src/
│   │   ├── app/                           # Next.js App Router (Halaman & REST API)
│   │   │   ├── api/v1/                    # Seluruh Endpoint REST API Serverless
│   │   │   │   ├── auth/                  # /login, /register, /forgot-password, /reset-password
│   │   │   │   ├── jobs/                  # CRUD Pekerjaan, pencarian, dan action router ([action])
│   │   │   │   ├── messages/              # Obrolan / chat per pekerjaan & read marker
│   │   │   │   ├── notifications/         # Pengambilan & penandaan baca notifikasi
│   │   │   │   ├── payments/              # Pembayaran tunai & pembuatan dynamic QRIS Pakasir
│   │   │   │   ├── reviews/               # Pengiriman rating bintang 1-5 & ulasan
│   │   │   │   ├── users/profile/         # Profil akun pengguna & metrik statistik real-time
│   │   │   │   └── wallet/                # Saldo dompet mitra, ledger transaksi, & withdraw
│   │   │   ├── choose-role/               # Seleksi peran Konsumen vs Mitra
│   │   │   ├── dashboard/                 # Area kerja utama pengguna terotentikasi
│   │   │   │   ├── account/               # Pengaturan profil, crop foto, info versi
│   │   │   │   ├── chat/                  # Ruang percakapan per pekerjaan ([jobId])
│   │   │   │   ├── history/               # Riwayat pesanan & pekerjaan selesai
│   │   │   │   ├── jobs/                  # List pekerjaan, buat pekerjaan 5-step, detail job
│   │   │   │   ├── notifications/         # Halaman pusat pemberitahuan
│   │   │   │   ├── payment/               # Layar pembayaran QRIS & konfirmasi escrow
│   │   │   │   ├── payments/              # Layar dompet finansial mitra & grafik laba
│   │   │   │   └── review/                # Formulir pemberian ulasan
│   │   │   ├── forgot-password/           # Layar request OTP email
│   │   │   ├── help/                      # Pusat bantuan & FAQ
│   │   │   ├── login/                     # Halaman login modern
│   │   │   ├── profile/                   # Manajemen profil pengguna & avatar
│   │   │   ├── register/                  # Halaman registrasi interaktif
│   │   │   ├── globals.css                # Konfigurasi Tailwind 4 & CSS theme variables (OKLCH)
│   │   │   ├── layout.tsx                 # Root layout dengan Theme, Query, & Auth providers
│   │   │   └── page.tsx                   # Landing page interaktif dengan Bauhaus Doodles
│   │   ├── components/                    # Komponen UI modular
│   │   │   ├── chat/                      # ChatBubble, ChatInput, In-App Lightbox modal
│   │   │   ├── dashboard/                 # ActivityCard, StatisticCard, PageContainer
│   │   │   │   ├── partner/               # ZapEnergyToggle (Animasi radar pencari order)
│   │   │   │   └── wallet/                # FinancialEarningsChart (Grafik QRIS vs Tunai)
│   │   │   ├── history/                   # HistoryCard
│   │   │   ├── jobs/                      # JobCard, JobTimeline, JobProgressGallery, SlideToConfirm
│   │   │   ├── landing/                   # HeroSection, CTASection, ProblemSection, Footer
│   │   │   ├── layouts/                   # Topbar, TopNav, Sidebar, MobileNav (Floating Dock)
│   │   │   ├── maps/                      # InteractiveMap, LocationPicker, MapViewer
│   │   │   ├── navigation/                # ProtectedRoute (Auth & Role Guard)
│   │   │   ├── notifications/             # NotificationCard, NotificationDropdown
│   │   │   ├── payment/                   # PaymentMethodCard, QRIS modal viewer
│   │   │   ├── profile/                   # ImageCropModal (Circular profile cropper)
│   │   │   ├── providers/                 # ThemeProvider, ClientBootstrap
│   │   │   └── ui/                        # Button, Dialog, Card, Input, Sonner, Badge, Slider
│   │   ├── features/                      # Logika spesifik domain bisnis
│   │   │   ├── auth/                      # Zod validation schemas autentikasi
│   │   │   ├── dashboard/                 # ConsumerDashboard & PartnerDashboard components
│   │   │   └── jobs/                      # Wizard pembuatan job 5-tahap (Step 1 s/d Step 5)
│   │   ├── hooks/                         # React custom hooks
│   │   │   ├── useAuth.ts                 # Wrapper hook otentikasi
│   │   │   ├── useChat.ts                 # Polling obrolan pesan per pekerjaan
│   │   │   ├── useJobs.ts                 # Hook pekerjaan (my jobs, partner jobs, detail)
│   │   │   ├── useNotifications.ts        # Polling lonceng notifikasi & auto-invalidation
│   │   │   ├── usePayment.ts              # Transaksi & status check QRIS
│   │   │   ├── useReviews.ts              # Pengiriman ulasan
│   │   │   ├── useUserLocation.ts         # Hook GPS browser real-time
│   │   │   └── useWallet.ts               # Mutasi & query dompet mitra
│   │   ├── lib/                           # Pustaka utilitas inti
│   │   │   ├── auth.ts                    # Hash password bcrypt & verify token jose
│   │   │   ├── axios.ts                   # Axios client dengan auto-attach Bearer token
│   │   │   ├── current-user.ts            # Resolver user aktif dengan 15-detik in-memory cache
│   │   │   ├── distance.ts                # Rumus Haversine & estimasi waktu tempuh motor
│   │   │   ├── prisma.ts                  # Singleton instance Prisma dengan pg.Pool
│   │   │   ├── resend.ts                  # Template HTML OTP & pengiriman email Resend
│   │   │   └── utils.ts                   # Format mata uang Rupiah, date formatting, cn helper
│   │   ├── providers/                     # QueryProvider TanStack React Query
│   │   ├── services/                      # Axios service abstraction layer (job, chat, wallet)
│   │   ├── store/                         # Zustand store (auth.store.ts, create-job.store.ts)
│   │   └── types/                         # Interface TypeScript terpusat
│   ├── .env.local                         # Variabel lingkungan rahasia server
│   ├── components.json                    # Konfigurasi CLI Shadcn UI
│   ├── next.config.ts                     # Konfigurasi Next.js (security headers, images, dev origins)
│   ├── package.json                       # Dependensi frontend & skrip npm
│   ├── tsconfig.json                      # Konfigurasi kompilasi TypeScript
│   └── vercel.json                        # Konfigurasi build pipeline Vercel frontend
├── .gitignore                             # Aturan ignorasi Git (node_modules, .env, .next)
├── aapanel.md                             # SOP Resmi Deployment aaPanel Server Linux VM
├── database.sql                           # DDL SQL PostgreSQL murni / schema awal
├── package.json                           # Root monorepo workspace runner
├── README.md                              # Dokumentasi ringkas repositori GitHub
├── seed.sql                               # Kumpulan data pengujian (dummy user, jobs, payments)
└── vercel.json                            # Konfigurasi deployment monorepo Vercel
```

---

## 5. SKEMA DATABASE, ERD & MODEL DATA RELASIONAL

Aplikasi Kerjain menggunakan PostgreSQL (di-host pada Supabase). Model database didefinisikan secara deklaratif di `frontend/prisma/schema.prisma`.

### 5.1 Diagram Entitas Relasional (ERD)

```mermaid
erDiagram
    User ||--o{ Job : "Membuat (Consumer)"
    User ||--o{ Job : "Mengambil (Partner)"
    User ||--o{ Message : "Mengirim"
    User ||--o{ notifications : "Menerima"
    User ||--o{ Payment : "Membayar"
    User ||--o{ Payment : "Menerima Dana"
    User ||--o{ Review : "Menulis Review"
    User ||--o{ Review : "Menerima Rating"
    User ||--o| Wallet : "Memiliki Saldo"
    User ||--o{ Withdrawal : "Mengajukan Pencairan"

    Job ||--o{ JobProgress : "Memiliki Log Progres"
    Job ||--o{ Message : "Memiliki Percakapan"
    Job ||--o{ Payment : "Memiliki Transaksi"
    Job ||--o{ Review : "Memiliki Review"

    User {
        uuid id PK
        string name
        string email UK
        string hashed_password
        string phone
        string address
        string avatar_url
        string gender
        enum role
        datetime created_at
        datetime updated_at
    }

    Job {
        uuid id PK
        uuid consumer_id FK
        uuid partner_id FK
        string title
        text description
        string category
        text address
        float lat
        float lng
        text photo_url
        enum reward_type
        decimal reward_amount
        enum status
        datetime created_at
        datetime updated_at
    }

    JobProgress {
        string id PK
        uuid job_id FK
        string status_snapshot
        string note
        string photo_url
        datetime created_at
    }

    Payment {
        uuid id PK
        uuid job_id FK
        uuid consumer_id FK
        uuid partner_id FK
        decimal amount
        enum method
        enum status
        datetime paid_at
        datetime created_at
    }

    Message {
        uuid id PK
        uuid job_id FK
        uuid sender_id FK
        text content
        enum type
        boolean read
        datetime created_at
    }

    Review {
        uuid id PK
        uuid job_id FK
        uuid reviewer_id FK
        uuid target_id FK
        int rating
        text comment
        datetime created_at
    }

    Wallet {
        uuid id PK
        uuid user_id FK
        float balance
        datetime updated_at
    }

    Withdrawal {
        uuid id PK
        uuid user_id FK
        float amount
        string status
        string bank_name
        string bank_account
        datetime created_at
    }
```

### 5.2 Rincian Tabel & Model Data

#### 1. `users` (`User`)
* Menyimpan identitas akun konsumen dan mitra.
* Kunci Unik: `email`.
* Kolom penting: `id` (UUIDv4), `name`, `email`, `hashed_password` (Bcrypt), `phone`, `address`, `avatar_url`, `gender` (`MALE`/`FEMALE`), `role` (`consumer`/`partner`).
* Indeks: `idx_users_email`, `idx_users_role`.

#### 2. `jobs` (`Job`)
* Entitas sentral transaksi jasa.
* Relasi: `consumer_id` (FK -> `users.id` cascade), `partner_id` (FK -> `users.id` nullable).
* Kolom penting: `title`, `description`, `category` (misal: *Angkat Barang*, *Bersih-bersih*, *Perbaikan*, *Penjagaan*), `address`, `lat`, `lng` (koordinat geospasial), `photo_url` (foto panduan/kondisi awal), `reward_type` (`FIXED`/`FLEXIBLE`), `reward_amount` (Rupiah), `status` (JobStatus).
* Indeks: `idx_jobs_category`, `idx_jobs_consumer_id`, `idx_jobs_partner_id`, `idx_jobs_status`.

#### 3. `job_progress_logs` (`JobProgress`)
* Merekam linimasa aktivitas fisik yang dikerjakan mitra secara langsung di lapangan.
* Kolom: `id` (UUID), `job_id` (FK -> `jobs.id`), `status_snapshot` (misal: `ON_THE_WAY`, `ARRIVED`, `WORKING`, `WAITING_CONFIRMATION`), `note` (catatan mitra), `photo_url` (foto bukti pekerjaan), `created_at`.

#### 4. `payments` (`Payment`)
* Rekam transaksi escrow.
* Kolom: `id` (UUID), `job_id` (FK), `consumer_id` (FK), `partner_id` (FK), `amount` (nominal imbalan), `method` (`VA`, `QRIS`, `TRANSFER`, `CASH`), `status` (`UNPAID`, `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`), `paid_at`.

#### 5. `messages` (`Message`)
* Pesan instan di dalam ruang obrolan pekerjaan tertentu.
* Kolom: `id` (UUID), `job_id` (FK), `sender_id` (FK), `content` (teks atau data URL gambar base64), `type` (`TEXT`, `SYSTEM`), `read` (boolean), `created_at`.

#### 6. `reviews` (`Review`)
* Ulasan timbal balik antara Konsumen dan Mitra.
* Constraint Unik: `@@unique([job_id, reviewer_id])` — mencegah ulasan ganda untuk satu pekerjaan.
* Kolom: `id`, `job_id`, `reviewer_id`, `reviewee_id` (target ulasan), `rating` (1 hingga 5 bintang), `comment`.

#### 7. `notifications` (`notifications`)
* Notifikasi sistem berbasis akun.
* Kolom: `id`, `user_id` (FK), `title`, `description`, `type` (`NEW_JOB`, `JOB_ACCEPTED`, `STATUS_CHANGED`, `NEW_MESSAGE`, `PAYMENT`, `JOB_COMPLETED`, `SYSTEM`), `link` (URL tujuan di dalam aplikasi), `read` (boolean).

#### 8. `wallets` (`Wallet`) & `withdrawals` (`Withdrawal`)
* **`Wallet`**: Saldo mitra dari akumulasi pekerjaan berstatus `COMPLETED` bermetode `QRIS`.
* **`Withdrawal`**: Log penarikan dana ke rekening bank mitra dengan status `PENDING`, `COMPLETED`, atau `REJECTED`.

#### 9. `password_resets` (Dynamic Table)
* Tabel yang dibuat otomatis di runtime PostgreSQL oleh endpoint `/forgot-password`:
* Kolom: `id` (UUID), `email`, `otp` (kode 6 digit angka), `expires_at` (kedaluwarsa 5 menit), `used` (boolean), `created_at`.

---

## 6. ALUR BISNIS & MESIN KEADAAN (BUSINESS LOGIC & STATE MACHINE)

### 6.1 Mesin Keadaan Pekerjaan (Job State Machine)

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Konsumen Mengisi Form
    DRAFT --> WAITING_PAYMENT : Pilih Metode QRIS
    WAITING_PAYMENT --> PUBLISHED : Scan QRIS & Pembayaran Berhasil
    DRAFT --> PUBLISHED : Pilih Metode CASH (Bayar Langsung)
    
    PUBLISHED --> ACCEPTED : Mitra Menerima Pekerjaan
    PUBLISHED --> CANCELLED : Konsumen Membatalkan
    
    ACCEPTED --> ON_THE_WAY : Mitra Berangkat Menuju Lokasi
    ON_THE_WAY --> ARRIVED : Mitra Sampai di Titik Lokasi
    ARRIVED --> WORKING : Mitra Memulai Pekerjaan
    
    WORKING --> WAITING_CONFIRMATION : Mitra Menandai Selesai (+ Upload Foto Bukti)
    
    WAITING_CONFIRMATION --> WORKING : Konsumen Minta Revisi (Action 'revise')
    WAITING_CONFIRMATION --> COMPLETED : Konsumen Konfirmasi Selesai (Action 'confirm')
    
    COMPLETED --> [*] : Dana Cair ke Dompet Mitra + Sesi Rating
    CANCELLED --> [*]
```

### 6.2 Perjalanan Pengguna: Sisi Konsumen (Consumer Journey)
1. **Registrasi / Masuk:** Mendaftar akun dengan peran `consumer`, mengisi nama, email, nomor ponsel, alamat, dan jenis kelamin.
2. **Formulir Pembuatan Job (5-Step Wizard):**
   * *Langkah 1 (Info Dasar):* Judul pekerjaan, deskripsi rinci tugas, dan unggah foto referensi (terkompresi otomatis).
   * *Langkah 2 (Kategori):* Memilih kategori tugas (*Angkat Barang, Bersih-bersih, Perbaikan, dll.*).
   * *Langkah 3 (Lokasi):* Deteksi koordinat GPS atau pencarian alamat via Geoapify/LocationIQ.
   * *Langkah 4 (Imbalan):* Memilih tipe imbalan (`FIXED` nominal Rupiah atau `FLEXIBLE` seikhlasnya) dan metode pembayaran (`CASH` atau `QRIS`).
   * *Langkah 5 (Review & Publikasi):* Pratinjau keseluruhan data sebelum dipublikasikan ke radar publik.
3. **Penyimpanan Escrow:** Jika memilih QRIS, sistem menahan job di status `WAITING_PAYMENT` sampai konsumen memindai kode QRIS dinamis Pakasir. Begitu terbayar, job otomatis beralih ke `PUBLISHED`.
4. **Monitoring & Obrolan:** Ketika mitra mengambil order, konsumen menerima notifikasi instan dan dapat membuka ruang obrolan langsung untuk koordinasi.
5. **Konfirmasi & Pencairan Dana:** Setelah mitra menyelesaikan pekerjaan dan mengunggah foto lapangan, konsumen meninjau hasilnya dan menggeser slider konfirmasi (*Swipe/Slide to Confirm*). Dana otomatis diteruskan ke saldo dompet mitra.
6. **Ulasan:** Konsumen memberikan rating bintang 1-5 dan testimoni tertulis.

### 6.3 Perjalanan Pengguna: Sisi Mitra (Partner Journey)
1. **Aktivasi Radar:** Menyalakan tombol *Zap Energy Toggle* di dashboard untuk mengubah status menjadi siap menerima pekerjaan.
2. **Eksplorasi Job Terdekat:** Sistem menghitung jarak relatif antara GPS mitra dengan lokasi pekerjaan menggunakan rumus Haversine, menampilkan badge jarak (misal: `1,2 km`) dan estimasi waktu tempuh motor (misal: `± 5 menit perjalanan`).
3. **Pengambilan Order:** Mitra menekan tombol *Ambil Pekerjaan*. Sistem memvalidasi apakah pekerjaan masih berstatus `PUBLISHED` dan belum diambil oleh mitra lain.
4. **Pembaruan Tahapan (Progress Logs):** Mitra memperbarui status secara berkala (`ON_THE_WAY` -> `ARRIVED` -> `WORKING`) serta mengunggah foto tahapan ke galeri progres.
5. **Permintaan Konfirmasi:** Menekan tombol *Selesaikan Pekerjaan* yang mengubah status menjadi `WAITING_CONFIRMATION`.
6. **Pencairan Saldo & Penarikan (Withdrawal):** Saldo yang masuk ke dompet digital dapat ditarik (*withdraw*) ke nomor rekening bank mitra melalui form penarikan dana di menu Keuangan.

---

## 7. SISTEM AUTENTIKASI, OTORISASI & KEAMANAN (AUTH & SECURITY)

### 7.1 Mekanisme Token JWT
* **Library:** `jose` (menggunakan Web Crypto API native yang kompatibel dengan serverless Edge dan Node.js runtime).
* **Algoritma:** `HS256`.
* **Masa Berlaku:** 24 jam (`expiresIn: '24h'`).
* **Payload:** `{ sub: user.id, email: user.email, role: user.role }`.
* **Transport:** Header HTTP standar: `Authorization: Bearer <token>`.

### 7.2 Hashing Sandi
* Menggunakan `bcrypt` dengan faktor garam `saltRounds = 10`.
* Password mentah tidak pernah disimpan di database atau dikembalikan dalam respon JSON endpoint mana pun (`userWithoutPassword` filter).

### 7.3 Perlindungan Rute Klien (`ProtectedRoute.tsx`)
* Komponen pelindung rute membungkus root aplikasi di `frontend/src/components/navigation/ProtectedRoute.tsx`.
* Memeriksa kondisi otentikasi di Zustand store (`auth-storage` di `localStorage`).
* Mengarahkan pengguna tak terotentikasi ke `/login`.
* Mengisolasi halaman khusus konsumen dan halaman khusus mitra berdasarkan `user.role`.

### 7.4 Keamanan HTTP Header di `next.config.ts`
Setiap respon HTTP dari server Next.js disisipkan header keamanan protektif:
```typescript
{ key: 'X-Content-Type-Options', value: 'nosniff' },
{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
{ key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' }
```

### 7.5 Alur Reset Sandi Berbasis OTP (Anti-Bruteforce & Zero-Leak)
1. Pengguna memasukkan email terdaftar di `/forgot-password`.
2. Endpoint `/api/v1/auth/forgot-password` memvalidasi keberadaan email, membatalkan OTP aktif sebelumnya (`used = true`), membuat kode acak 6-digit angka, dan menyimpannya di tabel `password_resets` dengan masa aktif persis 5 menit.
3. Resend API mengirimkan email dengan template HTML bernuansa gelap (*emerald gradient brand identity*).
4. Saat pengguna mengirimkan OTP dan kata sandi baru ke `/api/v1/auth/reset-password`:
   * Sistem memeriksa apakah OTP cocok, belum pernah digunakan (`used = false`), dan `expires_at > NOW()`.
   * Minimal panjang kata sandi baru diverifikasi (minimal 8 karakter).
   * OTP ditandai `used = true`, dan sandi baru di-hash ulang via bcrypt.

---

## 8. SPESIFIKASI LENGKAP REST API ENDPOINTS

Seluruh endpoint bernaung di bawah prefix base URL `/api/v1`.

### 8.1 Modul Autentikasi (`/api/v1/auth`)
| Method | Endpoint | Hak Akses | Deskripsi & Payload Utama | Respon Sukses |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Publik | Mendaftarkan akun baru. Body: `name`, `email`, `password`, `role`, `phone`, `address`, `gender`. | `200/201` Data user tanpa password |
| `POST` | `/auth/login` | Publik | Masuk ke sistem. Mendukung JSON maupun Form-Data: `username`/`email`, `password`. | `200` Token JWT, role, & data user |
| `POST` | `/auth/forgot-password` | Publik | Meminta kode OTP 6-digit pemulihan sandi. Body: `email`. | `200` Pesan konfirmasi pengiriman |
| `POST` | `/auth/reset-password` | Publik | Verifikasi OTP dan set sandi baru. Body: `email`, `otp`, `new_password`. | `200` Pesan keberhasilan reset |

### 8.2 Modul Pekerjaan (`/api/v1/jobs`)
| Method | Endpoint | Hak Akses | Deskripsi & Parameter |
| :--- | :--- | :--- | :--- |
| `GET` | `/jobs` | Terotentikasi | Mengambil daftar pekerjaan publik atau terfilter. Query: `keyword`, `category`, `status`, `type` (`my-jobs` / `partner-jobs`). |
| `POST` | `/jobs` | Konsumen | Menerbitkan pekerjaan baru. Body: `title`, `description`, `address`, `lat`, `lng`, `category`, `rewardType`, `rewardAmount`, `paymentMethod`, `photoUrl`. |
| `GET` | `/jobs/[id]` | Terotentikasi | Mengambil detail lengkap 1 pekerjaan beserta data konsumen, mitra, log progres, dan pembayaran. |
| `GET` | `/jobs/my` | Konsumen | Mengambil seluruh pekerjaan yang dibuat oleh konsumen yang sedang login. |
| `GET` | `/jobs/assigned` | Mitra | Mengambil daftar pekerjaan yang telah diambil oleh mitra yang sedang login. |
| `GET` | `/jobs/[id]/timeline` | Terotentikasi | Mengambil riwayat log progres pekerjaan dari tabel `job_progress_logs`. |
| `POST/PATCH` | `/jobs/[id]/[action]` | Terotentikasi | **Action Router Inti**: Mengeksekusi transisi status pekerjaan berdasarkan `[action]`. |

#### Rincian Action Router (`/jobs/[id]/[action]`):
* **`action = 'accept'`** *(Role: Mitra)*: Mengambil pekerjaan publik (`PUBLISHED` -> `ACCEPTED`). Menautkan `partner_id` dan mengirim notifikasi ke konsumen.
* **`action = 'start'`** *(Role: Mitra yang ditugaskan)*: Mengubah status menjadi `WORKING`.
* **`action = 'finish'`** *(Role: Mitra yang ditugaskan)*: Mengubah status menjadi `WAITING_CONFIRMATION` untuk menunggu verifikasi konsumen.
* **`action = 'confirm'`** *(Role: Konsumen pemilik)*: Mengubah status menjadi `COMPLETED`. Jika pekerjaan menggunakan QRIS sukses, sistem otomatis menambah saldo dompet mitra via `prisma.wallet.upsert`.
* **`action = 'revise'`** *(Role: Konsumen pemilik)*: Mengembalikan status ke `WORKING` dan mencatat alasan revisi di log.
* **`action = 'cancel'`** *(Role: Konsumen atau Mitra terkait)*: Membatalkan pekerjaan (`CANCELLED`) asalkan belum selesai.
* **`action = 'progress'`** *(Role: Mitra)*: Menambahkan entri log progres baru dengan catatan (`note`) dan foto bukti lapangan (`photoUrl`).

### 8.3 Modul Obrolan / Pesan (`/api/v1/messages`)
| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/messages/[jobId]` | Anggota Job | Mengambil riwayat pesan berurutan kronologis untuk pekerjaan tertentu. |
| `POST` | `/messages/[jobId]` | Anggota Job | Mengirim pesan teks atau foto (base64 image). Otomatis mengirim notifikasi ke lawan bicara. |
| `PUT` | `/messages/[jobId]/read` | Anggota Job | Menandai seluruh pesan dari lawan bicara sebagai telah dibaca (`read = true`). |
| `GET` | `/messages/chats` | Terotentikasi | Mengambil daftar ringkasan seluruh obrolan aktif pengguna (inbox list). |

### 8.4 Modul Pembayaran & QRIS (`/api/v1/payments`)
| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/payments/[job_id]` | Anggota Job | Mengambil status pembayaran untuk pekerjaan terkait. |
| `POST` | `/payments/[job_id]/pay` | Konsumen | Memproses simulasi pembayaran tunai (CASH) saat pekerjaan dikonfirmasi. |
| `POST` | `/payments/[job_id]/qris` | Konsumen | Menghubungi Pakasir API untuk menerbitkan `payment_number` (string kode QRIS dinamis) dan nominal total. |
| `POST` | `/payments/[job_id]/check` | Konsumen | Melakukan polling ke endpoint Pakasir untuk mengecek apakah pembayaran QRIS sudah sukses di kasir bank. |

### 8.5 Modul Dompet Mitra & Penarikan (`/api/v1/wallet`)
| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/wallet` | Mitra | Mengambil saldo dompet aktif, riwayat ledger (QRIS vs CASH), statistik performa, dan data deret waktu grafik pendapatan. |
| `POST` | `/wallet/withdraw` | Mitra | Mengajukan penarikan saldo ke rekening bank. Body: `amount`, `bank_name`, `bank_account`. Mengurangi saldo dompet secara atomik dalam transaksi Prisma. |

### 8.6 Modul Notifikasi & Profil
* `GET /api/v1/notifications`: Mengambil daftar notifikasi pengguna dengan status unread badge.
* `PUT /api/v1/notifications/read-all`: Menandai semua notifikasi telah dibaca.
* `PUT /api/v1/notifications/[id]/read`: Menandai 1 notifikasi spesifik telah dibaca.
* `POST /api/v1/reviews`: Mengirimkan penilaian bintang 1-5 dan testimoni untuk pekerjaan selesai.
* `GET /api/v1/users/profile`: Mengambil profil pengguna terotentikasi beserta kompilasi metrik agregasi (total belanja konsumen, total pendapatan mitra, rating rata-rata, tingkat penyelesaian pesanan).

---

## 9. INTEGRASI LAYANAN PIHAK KETIGA (THIRD-PARTY INTEGRATIONS)

### 9.1 Gateway Pembayaran QRIS (Pakasir)
* **Penyedia:** Pakasir Payment Gateway (`https://app.pakasir.com/api`).
* **Kredensial:** Disuplai via `PAKASIR_API_KEY` dan `PAKASIR_SLUG`.
* **Alur Integrasi:**
  1. Konsumen membuat order dengan metode `QRIS`.
  2. Endpoint `/payments/[job_id]/qris` memanggil `POST /transactioncreate/qris` dengan payload `project`, `order_id` (ID Pembayaran internal), `amount`, dan `api_key`.
  3. Respon mengembalikan `payment_number` (string format QRIS). Frontend merendernya menjadi gambar kode QR yang dapat dipindai oleh semua aplikasi e-wallet (GoPay, OVO, Dana, BCA, Livin).
  4. Halaman pembayaran melakukan polling otomatis ke `/payments/[job_id]/check` yang mengecek status transaksi ke `GET /transactiondetail` Pakasir. Begitu status menjadi `completed`, sistem mengalihkan order ke status `PUBLISHED`.

### 9.2 Pengiriman Email Transaksional (Resend API)
* **Penyedia:** Resend (`https://resend.com`).
* **Kredensial:** `RESEND_API_KEY` dan `RESEND_FROM_EMAIL`.
* **Penggunaan:** Pengiriman kode OTP 6-digit untuk alur lupa kata sandi. Email dikirim dengan header responsif dan template dark glassmorphism yang serasi dengan identitas visual Kerjain.

### 9.3 Layanan Peta & Geospasial (LocationIQ / Geoapify & Leaflet)
* **Komponen:** `interactive-map.tsx`, `location-picker.tsx`, `map-viewer.tsx`.
* **Fitur:**
  * Penjemputan koordinat GPS perangkat via browser Geolocation API (`navigator.geolocation.getCurrentPosition`).
  * Autocomplete pencarian nama tempat/alamat dan reverse geocoding koordinat lintang/bujur menjadi teks alamat jalan.
  * Formula Haversine di `distance.ts` menghitung jarak busur bumi antara dua pasang koordinat dalam satuan meter/kilometer.
  * Estimasi waktu tempuh motor dihitung dengan rasio kecepatan urban rata-rata (25 km/jam atau ~400 meter per menit ditambah buffer waktu 2 menit).

### 9.4 Pembangkit Avatar Dinamis (DiceBear API)
* Jika pengguna belum mengunggah foto profil kustom, sistem memanfaatkan endpoint `https://api.dicebear.com` untuk membuat avatar ilustrasi personal berbasis inisial atau email pengguna.
* Didaftarkan di `next.config.ts` di bawah `remotePatterns` untuk keamanan pemuatan gambar Next.js.

---

## 10. DESAIN ANTARMUKA, SISTEM DESAIN & UX MOBILE-FIRST

### 10.1 Filosofi Visual: Liquid Glassmorphism Dark Modern
* **Palet Warna Inti (OKLCH Color Space):**
  * `Background`: Charcoal Slate gelap (`oklch(0.12 0.015 250)`) — nyaman di mata dan ramah layar OLED/AMOLED.
  * `Surface / Card`: Dark Slate kaya kedalaman (`oklch(0.16 0.018 250)`).
  * `Primary Accent`: Hijau Zamrud Lembut (*Subtle Emerald*) (`oklch(0.60 0.10 160)`).
  * `Border & Divider`: Soft slate stroke (`oklch(0.23 0.02 250)`).
* **Tipografi:** Google Font *Plus Jakarta Sans* dengan skala hierarki yang tegas dan nyaman dibaca pada perangkat layar sentuh.
* **Aksen Grafis Bauhaus Doodles:** Ikon siluet geometris SVG minimalis di landing page (panah doodle, bintang retro, lampu bohlam, pensil) yang memberi kesan ramah, bersahabat, dan lokal.

### 10.2 Komponen Interaktif Unggulan

#### 1. Floating Liquid Glass Dock (`MobileNav.tsx`)
* Bilah navigasi melayang 5-kolom di bagian bawah layar ponsel.
* Dilengkapi indikator aktif dengan pegas fisik (*spring physics*) yang bergeser mulus mengikuti halaman aktif.
* Khusus peran Konsumen: Tombol tengah **Buat** berukuran lebih menonjol dengan aksen kurung siku kontras bercahaya hijau emerald yang mempermudah penerbitan order hanya dengan satu sentuhan ibu jari.

#### 2. Tombol Radar Zap Energy (`ZapEnergyToggle.tsx`)
* Sakelar interaktif khusus mitra di dashboard untuk menyalakan/mematikan kesiapan menerima order di sekitar.
* Diiringi animasi partikel cahaya dan getaran haptik visual saat diaktifkan.

#### 3. Slider Konfirmasi Penyelesaian (`SlideToConfirm.tsx`)
* Mencegah salah klik tidak sengaja pada konfirmasi pencairan dana. Pengguna harus menggeser gagang slider dari ujung kiri ke kanan untuk memvalidasi penyelesaian pekerjaan.

#### 4. In-App Photo Lightbox Modal (`JobProgressGallery.tsx` & Obrolan Chat)
* Memungkinkan peninjauan foto bukti kerja atau lampiran obrolan secara layar penuh di dalam aplikasi tanpa membuka tab baru (mencegah isu *blank screen* pada webview mobile).
* Dilengkapi fitur zoom, rotasi, dan tombol unduh langsung.

#### 5. Pemotong Foto Profil Melingkar (`ImageCropModal.tsx`)
* Menggunakan HTML5 Canvas di sisi klien untuk memotong foto profil menjadi rasio lingkaran 1:1 sebelum diunggah ke server.

---

## 11. MATRIKS KONFIGURASI & VARIABEL LINGKUNGAN (.ENV)

Berikut adalah daftar variabel lingkungan yang dibutuhkan oleh platform Kerjain di file `.env.local` pada direktori `frontend/`:

| Nama Variabel | Wajib/Opsional | Deskripsi & Format Nilai | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Wajib** | URL koneksi PostgreSQL Supabase (Transaction Pooler port 6543) | `postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require` |
| `DIRECT_URL` | **Wajib (Dev/Migrate)** | URL koneksi langsung PostgreSQL Supabase (Session direct port 5432) | `postgresql://postgres:[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `SECRET_KEY` | **Wajib** | Kunci rahasia enkripsi tanda tangan JWT | `super_secret_jwt_key_kerjain_prod_2026` |
| `NEXT_PUBLIC_API_URL` | **Wajib** | Prefix endpoint API publik untuk Axios di frontend | `/api/v1` |
| `NEXT_PUBLIC_APP_NAME`| Opsional | Nama aplikasi yang ditampilkan di header | `Kerjain` |
| `NEXT_PUBLIC_LOCATIONIQ_API_KEY` | Opsional | Kunci API LocationIQ / Geoapify untuk pencarian peta | `pk.a1b2c3d4e5f6g7h8...` |
| `PAKASIR_API_URL` | Opsional | Base URL API gateway pembayaran Pakasir | `https://app.pakasir.com/api` |
| `PAKASIR_SLUG` | Opsional | Slug proyek merchant di Pakasir | `yuku-store` |
| `PAKASIR_API_KEY` | Opsional | Kunci API otentikasi merchant Pakasir | `8E5kymEMfwjvUjOeTHJomL1p4lBZvDIu` |
| `PAKASIR_METHOD` | Opsional | Metode transaksi default Pakasir | `qris` |
| `RESEND_API_KEY` | Opsional | Kunci API pengiriman email Resend | `re_1234567890abcdef...` |
| `RESEND_FROM_EMAIL` | Opsional | Alamat pengirim email transaksi OTP | `Kerjain <onboarding@resend.dev>` |
| `CORS_ORIGINS` | Opsional | Daftar origin yang diizinkan untuk CORS | `http://localhost:3000,https://kerjain.id` |

---

## 12. PANDUAN OPERASIONAL, MAINTENANCE & DEVOPS (SOP AAPANEL & VERCEL)

### 12.1 Panduan Menjalankan di Komputer Lokal (Local Dev)
1. Kloning repositori dan pasang dependensi monorepo:
   ```bash
   git clone https://github.com/KyonKyon0/Kerjain.git
   cd Kerjain
   npm install
   ```
2. Sinkronkan skema database dengan Supabase:
   ```bash
   cd frontend
   npx prisma generate
   npx prisma db push
   cd ..
   ```
3. Jalankan server lokal Next.js dengan HTTPS experimental (diperlukan untuk Geolocation GPS):
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `https://localhost:3000` (atau IP LAN yang diizinkan di `allowedDevOrigins`).

### 12.2 Skrip Pemeliharaan Database (`clean-supabase.js`)
Direktori `frontend/scripts/clean-supabase.js` menyediakan skrip darurat transaksi SQL:
* **Fungsi:** Mengosongkan data transaksi uji coba (`jobs`, `messages`, `payments`, `reviews`, `notifications`, `withdrawals`, dan mereset saldo `wallets` ke 0).
* **Fitur Keselamatan:** Data seluruh akun pengguna (`users`) **tetap dipertahankan 100% utuh**, sehingga akun login konsumen dan mitra tidak hilang.
* **Cara Eksekusi:**
  ```bash
  cd frontend
  node scripts/clean-supabase.js
  ```

### 12.3 SOP Deployment ke Vercel (Produksi Cloud)
Repositori telah memiliki `vercel.json` di root dan frontend:
1. Hubungkan branch GitHub ke Vercel Dashboard.
2. Tambahkan Environment Variables (`DATABASE_URL`, `DIRECT_URL`, `SECRET_KEY`, dll).
3. Vercel secara otomatis memicu skrip `postinstall` (`prisma generate`) dan `build` (`prisma generate && next build`).

### 12.4 SOP Deployment ke Server aaPanel / VPS Linux VM (`aapanel.md`)
Berdasarkan dokumen resmi `aapanel.md`, berikut adalah runbook kepatuhan tinggi untuk deploy ke server aaPanel Linux (`192.168.1.111` / domain `oscartambunan.my.id`):
* **Node.js Resmi Server:** Node.js v26 di `/www/server/nodejs/v26.7.0/bin/node`.
* **User Web Engine:** Seluruh file web wajib dimiliki oleh user `www:www`.
* **Port Target:** Port internal `3000` (Reverse Proxy Nginx).
* **Workaround SSH Windows AI Agent:**
  * Gunakan helper script `askpass.bat` (`set SSH_ASKPASS=askpass.bat` & `set SSH_ASKPASS_REQUIRE=force`) untuk melewati proteksi interaktif OpenSSH Windows tanpa hang.
  * Gunakan piping stdin via Python `subprocess.run(..., input="0$Car070311\n")` untuk perintah `sudo -S` agar karakter `$` pada password tidak hilang dievaluasi bash.
* **Aturan Keselamatan Server Multi-Tenant (PANTANGAN MUTLAK):**
  * Dilarang menjalankan `pm2 kill` atau `killall node` karena server menampung website lain (`SaringOpini`, `pesonatari.site`, dll).
  * Hanya matikan proses port 3000 secara spesifik:
    ```bash
    fuser -k 3000/tcp 2>/dev/null || true
    ```
  * Selalu jalankan `chown -R www:www /www/wwwroot/oscartambunan_portofolio_web` setelah deployment agar proses Node.js tidak mengalami *Permission Denied*.

---

## 13. ANALISIS KRITIS, TITIK KRUSIAL & TECHNICAL DEBT

### 13.1 Keunggulan Arsitektur Saat Ini
1. **Unifikasi Monorepo Serverless:** Menghilangkan overhead pemeliharaan backend terpisah; API dan UI tersinkronisasi dalam satu codebase TypeScript dengan verifikasi tipe data ujung-ke-ujung (*end-to-end type safety*).
2. **Defensive Supabase Pooling:** Penggunaan `pg.Pool` dengan `max: 2` dan `idleTimeoutMillis: 1000` adalah keputusan arsitektur yang sangat tepat untuk mencegah lonjakan error `FATAL: remaining connection slots are reserved for non-replication superuser connections` pada Supabase.
3. **In-Memory User Caching:** Memangkas lebih dari 80% beban kueri database pada saat dashboard pertama kali dimuat.
4. **UX Responsif Kualitas Tinggi:** Estetika antarmuka *Liquid Glassmorphism* yang konsisten di semua breakpoint layar, navigasi dock yang ergonomis, serta feedback visual instan menggunakan sonner toast dan skeleton loading.

### 13.2 Batasan & Area Peningkatan untuk Skala Produksi Skala Besar
1. **Penyimpanan Foto Obrolan Berbasis Base64:**
   * *Kondisi Saat Ini:* Foto yang dikirim dalam ruang obrolan disimpan langsung sebagai string base64 (`data:image/...`) di dalam kolom teks `messages.content`.
   * *Dampak:* String base64 berukuran ~33% lebih besar daripada binary asli dan dapat memperbesar ukuran tabel database PostgreSQL secara eksponensial.
   * *Rekomendasi:* Migrasikan unggahan foto obrolan ke object storage (Supabase Storage Bucket, Cloudflare R2, atau AWS S3) dan simpan URL publiknya saja di database.
2. **Obrolan Realtime Menggunakan Polling:**
   * *Kondisi Saat Ini:* Fitur obrolan chat dan lonceng notifikasi bergantung pada polling berkala (polling interval React Query) serta cache invalidation.
   * *Rekomendasi:* Terapkan WebSocket murni atau Supabase Realtime Channels (`supabase.channel('messages')`) untuk mengurangi jumlah request HTTP dan menghadirkan pengalaman chat instan tanpa latensi polling.
3. **Penyimpanan Kode OTP Pemulihan Kata Sandi:**
   * *Kondisi Saat Ini:* Kode OTP 6-digit disimpan dalam bentuk plaintext di tabel `password_resets`.
   * *Rekomendasi:* Lakukan hashing (misal menggunakan SHA-256) pada kode OTP sebelum disimpan ke database agar jika database terekspos, kode OTP tidak dapat dibaca langsung.
4. **Validasi File Upload di Sisi Server:**
   * *Kondisi Saat Ini:* Kompresi gambar dilakukan di sisi klien melalui browser.
   * *Rekomendasi:* Tambahkan validasi ukuran payload dan magic bytes MIME type di sisi serverless route handler untuk mencegah injeksi file berbahaya.

---

## 14. KESIMPULAN

Codebase **Kerjain** adalah platform marketplace jasa hiperlokal modern yang dibangun secara matang, memiliki arsitektur yang bersih (*clean separation of concerns*), performa tinggi, dan kepatuhan penuh terhadap standar pengembangan web modern (Next.js 16, React 19, Prisma 7, Tailwind 4). Seluruh dokumentasi di atas menyajikan gambaran menyeluruh yang dapat Anda gunakan sebagai acuan dasar untuk melakukan analisis lanjutan, audit keamanan, optimasi fitur, maupun pemberian prompt instruksi selanjutnya kepada AI Agent.
