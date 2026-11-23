# Panduan Akses, SOP Deployment & Arsitektur Server aaPanel (kerjain.simgun.my.id)

Dokumen ini adalah **referensi teknis resmi** untuk pengguna dan **AI Agent Antigravity** agar dapat mengakses, mengelola, dan men-deploy pembaruan aplikasi **Kerjain** ke server aaPanel secara instan, aman, dan tanpa *downtime*, tanpa mencoba mendiagnosis ulang hal-hal yang sudah dipetakan.

---

## 1. Spesifikasi Server & Kredensial Akses

| Parameter | Nilai / Konfigurasi | Keterangan |
| :--- | :--- | :--- |
| **Host / IP LAN** | `192.168.1.111` | Server Linux VM (Ubuntu / Proxmox VE) |
| **SSH User** | `aapanel` | User default SSH |
| **SSH / Sudo Password** | `0$Car070311` | Karakter `$` jangan sampai ter-evaluasi sebagai variabel bash! |
| **User Web Engine** | `www:www` | Semua file web & service Node.js dijalankan oleh user `www` |
| **Port Internal Kerjain** | **`3002`** | Port dedicated Next.js App Router untuk Kerjain |
| **Domain Publik** | **`kerjain.simgun.my.id`** | Dikelola via Cloudflare Tunnel |

---

## 2. Pemetaan Port & Isolasi Multi-Tenant (JANGAN DILANGGAR)

Server ini menampung beberapa aplikasi aktif. **HANYA sentuh port 3002 dan direktori Kerjain!**

| Port | Domain / Aplikasi | Engine / Runner | Status & Larangan |
| :---: | :--- | :--- | :--- |
| **3000** | `oscartambunan.my.id` | aaPanel Node Daemon (`www`) | **JANGAN DISENTUH** |
| **3001** | `mertha.oscartambunan.dev` | Node Daemon | **JANGAN DISENTUH** |
| **3002** | **`kerjain.simgun.my.id`** | **Next.js Daemon (`www`)** | **PROYEK INI (KERJAIN)** |
| **3003** | `saringopini.simgun.my.id` | PM2 Service (`www`) | **JANGAN DISENTUH (Dilarang `pm2 kill`)** |

> [!CAUTION]
> **DILARANG KERAS** menjalankan `killall node`, `pm2 kill`, atau `fuser -k` selain pada port `3002/tcp`.

---

## 3. Arsitektur Database: Supabase Cloud (BUKAN LOKAL!)

> [!IMPORTANT]
> **Tidak ada PostgreSQL lokal yang berjalan di server ini.**
> Database Kerjain sepenuhnya di-host di **Supabase Cloud Managed PostgreSQL**:
> - **Host:** `aws-0-ap-northeast-1.pooler.supabase.com` (AWS Tokyo)
> - **Port 6543 (Runtime):** Supabase Transaction Pooler (PgBouncer) via `DATABASE_URL`
> - **Port 5432 (Migration):** Direct Session via `DIRECT_URL`
> 
> **JANGAN PERNAH** mencoba menjalankan `systemctl start postgresql`, `apt-get install postgresql`, atau mencari container Postgres lokal di server!

---

## 4. Konfigurasi Cloudflare Tunnel & Syarat Manual DNS

Routing dari domain publik `kerjain.simgun.my.id` ke server lokal ditangani oleh **Cloudflare Tunnel (`cloudflared`)**.

### A. Konfigurasi di Sisi Server (Sudah Aktif)
File `/etc/cloudflared/config.yml` sudah memiliki rule ingress:
```yaml
  - hostname: kerjain.simgun.my.id
    service: http://127.0.0.1:3002
    originRequest:
      connectTimeout: 10s
      keepAliveTimeout: 90s
      keepAliveConnections: 50
```
Layanan server: `systemctl status cloudflared` (Active: running).

### B. Konfigurasi Manual di Cloudflare Dashboard (Wajib 1x Saja)
Cloudflare Tunnel tidak bisa otomatis menambahkan record DNS ke domain pengguna jika token bersifat lokal. Pengguna **harus menambahkan record DNS secara manual di Dashboard Cloudflare**:
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Pilih domain **`simgun.my.id`**.
2. Masuk ke tab **DNS** -> **Records** -> Klik **Add record**:
   - **Type:** `CNAME`
   - **Name:** `kerjain`
   - **Target:** `e2007e54-b5bd-4887-8e5f-e5fb15d49c5c.cfargotunnel.com`
   - **Proxy status:** **Proxied** (Awan Oranye)
   - **TTL:** Auto
3. Klik **Save**. Domain langsung aktif dan terenkripsi SSL.

---

## 5. Solusi Teknis SSH Non-Interactive (Anti TTY Hang)

Untuk menghindari program `ssh.exe` macet saat menunggu password di shell AI Agent Windows:
1. Buat skrip pembantu `askpass.bat`:
   ```bat
   @echo 0$Car070311
   ```
2. Set variabel lingkungan sebelum memanggil `ssh` atau `scp`:
   - `set SSH_ASKPASS=path\to\askpass.bat`
   - `set SSH_ASKPASS_REQUIRE=force`
3. Untuk perintah `sudo`, gunakan `sudo -S -p '' <perintah>` dengan input stdin `0$Car070311\n` via Python `subprocess.run()`.

---

## 6. SOP Cepat Deployment / Update Kode (Fast Runbook)

Jika ada pembaruan kode di repositori lokal dan ingin di-deploy ke server, cukup ikuti langkah ringkas ini:

### Langkah 1: Push Perubahan ke GitHub
```powershell
git add .
git commit -m "feat/fix: deskripsi pembaruan"
git push origin main
```

### Langkah 2: Tarik & Build di Server aaPanel
Jalankan skrip eksekusi remote via Python runner:
```python
import subprocess, os

# Setup askpass
env = os.environ.copy()
env["SSH_ASKPASS"] = os.path.abspath("askpass.bat")
env["SSH_ASKPASS_REQUIRE"] = "force"

# Perintah update & build
remote_sh = """#!/bin/bash
set -e
export PATH=/www/server/nodejs/v26.7.0/bin:$PATH
cd /www/wwwroot/kerjain.simgun.my.id

echo "=== GIT PULL ==="
git pull origin main

echo "=== BUILD FRONTEND ==="
cd frontend
npx prisma generate
npm run build

echo "=== RESTART PORT 3002 ==="
fuser -k 3002/tcp 2>/dev/null || true
sleep 1
sudo -u www bash /www/server/nodejs/vhost/scripts/kerjain_simgun_my_id.sh
sleep 3

echo "=== HEALTH CHECK ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3002/
"""

# SCP dan Jalankan
subprocess.run(['scp', '-o', 'StrictHostKeyChecking=no', 'deploy.sh', 'aapanel@192.168.1.111:/tmp/deploy.sh'], env=env, check=True)
subprocess.run([
    'ssh', '-o', 'StrictHostKeyChecking=no', 'aapanel@192.168.1.111',
    'sudo -S -p "" bash /tmp/deploy.sh'
], input="0$Car070311\n", text=True, env=env, check=True)
```

---

## 7. Direktori & File Penting Kerjain di Server

```
/www/
├── wwwroot/
│   └── kerjain.simgun.my.id/                 <-- Root Monorepo
│       ├── frontend/                         <-- Workspace Next.js
│       │   ├── .env.local                    <-- Kredensial Supabase, Pakasir, Resend
│       │   ├── .next/                        <-- Artifact Hasil Build
│       │   └── prisma/schema.prisma
│       └── node_modules/                     <-- Hoisted packages
│
├── server/
│   ├── nodejs/
│   │   ├── v26.7.0/bin/node                  <-- Binary Node.js v26
│   │   ├── v26.7.0/bin/npm                   <-- Binary NPM
│   │   └── vhost/
│   │       ├── pids/kerjain_simgun_my_id.pid <-- File PID aktif port 3002
│   │       └── scripts/kerjain_simgun_my_id.sh <-- Skrip start resmi
│   └── wwwlogs/
│       └── nodejs/kerjain_simgun_my_id.log   <-- Log output runtime
│
└── etc/cloudflared/config.yml                <-- Konfigurasi ingress tunnel port 3002
```

---

## 8. Panduan Troubleshooting Cepat

1. **Port 3002 tidak merespons (502 Bad Gateway):**
   ```bash
   sudo fuser -k 3002/tcp
   sudo -u www bash /www/server/nodejs/vhost/scripts/kerjain_simgun_my_id.sh
   tail -n 30 /www/wwwlogs/nodejs/kerjain_simgun_my_id.log
   ```
2. **Domain `kerjain.simgun.my.id` return 1033 / DNS Error:**
   - Cek apakah CNAME di dashboard Cloudflare sudah dibuat sesuai Bagian 4B.
   - Pastikan tunnel server berjalan: `systemctl status cloudflared`.
3. **Database Prisma connection limit exceeded (`max: 2`):**
   - Pastikan di `.env.local`, `DATABASE_URL` menggunakan port `6543` dengan flag `?pgbouncer=true`.
