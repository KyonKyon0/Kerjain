# ?? Kerjain - Fullstack Local Service Marketplace

**Kerjain** adalah platform marketplace jasa lokal yang menghubungkan konsumen dengan mitra pekerja di sekitarnya. Proyek ini dibangun menggunakan Next.js (Frontend) dan FastAPI (Backend) dengan database PostgreSQL.

---

## ??? Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript, Zustand, React Query.
- **Backend**: FastAPI, Python 3.12, SQLAlchemy, Pydantic, Alembic.
- **Database**: PostgreSQL (via Supabase).
- **Deployment**: Vercel (Frontend) & Railway (Backend).

---

## ?? Folder Structure
`	ext
Kerjain/
+-- frontend/          # Aplikasi Next.js App Router
¦   +-- src/           # Source code frontend (app, components, lib, hooks)
¦   +-- .env.example   # Template environment frontend
¦   +-- package.json   # Dependencies frontend
+-- backend/           # API FastAPI
    +-- app/           # Core API, routing, models, schemas
    +-- alembic/       # Database migrations
    +-- .env.example   # Template environment backend
    +-- railway.json   # Konfigurasi deploy Railway
    +-- requirements.txt # Dependencies backend
`

---

## ?? Environment Variables

### Frontend (rontend/.env)
Ganti nama .env.example menjadi .env atau .env.local:
`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME="Kerjain"
NODE_ENV=development
`
*(Untuk production, ubah NEXT_PUBLIC_API_URL menjadi URL Railway Anda)*

### Backend (ackend/.env)
Ganti nama .env.example menjadi .env:
`env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
SECRET_KEY="generate-your-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,https://kerjain.vercel.app"
PROJECT_NAME="Kerjain API"
ENVIRONMENT="development"
`

---

## ?? Installation & Run

### 1. Run Backend (FastAPI)
`ash
cd backend
python -m venv venv
source venv/Scripts/activate  # (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
`
API akan berjalan di: http://localhost:8000
API Documentation (Swagger UI): http://localhost:8000/api/docs

### 2. Run Frontend (Next.js)
`ash
cd frontend
npm install
npm run dev
`
Aplikasi akan berjalan di: http://localhost:3000

---

## ?? Deploy Instructions

### Deploy Database (Supabase)
1. Buat proyek baru di [Supabase](https://supabase.com/).
2. Dapatkan DATABASE_URL dari tab Settings > Database.
3. Jalankan migrasi Alembic dari backend: lembic upgrade head.

### Deploy Backend (Railway)
1. Hubungkan repository GitHub ke [Railway](https://railway.app/).
2. Buat layanan baru dari repository ini.
3. Atur *Root Directory* ke /backend.
4. Tambahkan Environment Variables dari .env.example (terutama DATABASE_URL dan SECRET_KEY).
5. Railway akan otomatis menggunakan konfigurasi ailway.json.

### Deploy Frontend (Vercel)
1. Hubungkan repository GitHub ke [Vercel](https://vercel.com/).
2. Atur *Framework Preset* ke Next.js.
3. Atur *Root Directory* ke rontend.
4. Tambahkan Environment Variables:
   - NEXT_PUBLIC_API_URL (Arahkan ke domain Railway).
5. Deploy!

---
*© 2026 Kerjain. All rights reserved.*
