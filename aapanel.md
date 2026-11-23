# Panduan Akses & SOP Deployment aaPanel Server (oscartambunan.my.id)

Dokumen ini adalah **referensi teknis resmi** untuk pengguna dan **AI Agent Antigravity** di masa mendatang agar dapat mengakses, mengelola, dan men-deploy pembaruan ke server aaPanel secara otomatis, aman, dan tanpa *downtime*, tanpa mengganggu website lain di server yang sama.

---

## 1. Spesifikasi Server & Kredensial Akses

| Parameter | Nilai / Konfigurasi | Keterangan |
| :--- | :--- | :--- |
| **Host / IP LAN** | `192.168.1.111` | Server Linux VM (Ubuntu / Proxmox VE) |
| **SSH User** | `aapanel` | User default SSH |
| **SSH Password** | `0$Car070311` | Digunakan untuk SSH & SCP |
| **Sudo Password** | `0$Car070311` | User `aapanel` memiliki akses `sudo` penuh |
| **User Web Engine** | `www:www` | Semua file web & service Node.js dijalankan oleh user `www` |
| **Port Internal Node** | `3000` | Port default Next.js App Router |
| **Domain Publik** | `oscartambunan.my.id` | Alias: `www.oscartambunan.my.id` |

---

## 2. Pemetaan Direktori & Arsitektur Sistem di aaPanel

```
/www/
├── wwwroot/
│   ├── oscartambunan_portofolio_web/  <-- DIREKTORI UTAMA WEBSITE INI
│   │   ├── .next/                     <-- Hasil build Next.js (SSG/SSR)
│   │   ├── src/                       <-- Source code React/Next.js
│   │   ├── public/                    <-- Media statis (foto, video, pdf)
│   │   ├── .env.local                 <-- API Key Resend & env server
│   │   └── package.json
│   ├── SaringOpini/                   <-- JANGAN DISENTUH (Web lain)
│   ├── pesonatari.site/               <-- JANGAN DISENTUH (Web lain)
│   ├── realfoodku.store/              <-- JANGAN DISENTUH (Web lain)
│   └── mertha.oscartambunan.dev/      <-- JANGAN DISENTUH (Web lain)
│
├── server/
│   ├── nodejs/
│   │   ├── v26.7.0/bin/node           <-- Node.js binary resmi server (v26)
│   │   ├── v26.7.0/bin/npm            <-- NPM binary resmi server
│   │   └── vhost/
│   │       ├── pids/oscartambunan_portofolio_web.pid  <-- File PID aktif
│   │       └── scripts/oscartambunan_portofolio_web.sh <-- Skrip start resmi aaPanel
│   └── panel/vhost/nginx/
│       ├── node_oscartambunan_portofolio_web.conf     <-- Konfigurasi Reverse Proxy Nginx
│       └── node_oscartambunan_portofolio_web.conf.bak <-- Backup konfigurasi
```

---

## 3. Masalah Utama SSH pada AI Agent & Solusi Teknisnya

### Tantangan:
1. **Interactive TTY Hang:** Program OpenSSH di Windows (`ssh.exe` dan `scp.exe`) secara default menolak menerima password melalui *pipe* (`echo pass | ssh ...`) jika dijalankan di *non-interactive shell* (seperti terminal AI Agent). Akibatnya, proses akan macet (*hang indefinitely*) menunggu input terminal interaktif.
2. **Bash Variable Expansion ($):** Password `0$Car070311` memiliki karakter dollar (`$Car070311`). Jika dipassing langsung di string bash tanpa proteksi, bash akan menganggapnya sebagai variabel lingkungan yang kosong sehingga password yang terkirim keliru (`0`).

### Solusi Antigravity:
1. **Gunakan `SSH_ASKPASS` Bawaan OpenSSH:**
   Buat file batch kecil sementara (misal `askpass.bat`) yang mencetak password, lalu set environment variable:
   * `set SSH_ASKPASS=path\to\askpass.bat`
   * `set SSH_ASKPASS_REQUIRE=force`
   Dengan cara ini, baik `ssh.exe` maupun `scp.exe` di Windows akan mengambil password secara otomatis tanpa membuka prompt TTY.
2. **Piping Stdin pada Python untuk `sudo`:**
   Jalankan perintah sudo via Python `subprocess.run(..., input="0$Car070311\n")` dengan opsi `sudo -S -p '' <perintah>`. Ini menjamin karakter `$` tidak dievaluasi oleh shell lokal maupun remote.

---

## 4. Skrip Eksekusi Otomatis (Helper Script)

Untuk sesi Antigravity baru, buat skrip runner python berikut di folder scratch atau direktori kerja:

### A. Skrip `askpass.bat`
```bat
@echo 0$Car070311
```

### B. Skrip `remote_exec.py` (Eksekutor Perintah Remote)
```python
import subprocess
import sys
import os

ASKPASS_BAT = os.path.abspath("askpass.bat")
SUDO_PASS = "0$Car070311"

def run_ssh(remote_cmd, use_sudo=False):
    env = os.environ.copy()
    env["SSH_ASKPASS"] = ASKPASS_BAT
    env["SSH_ASKPASS_REQUIRE"] = "force"
    
    if use_sudo:
        final_cmd = f"sudo -S -p '' {remote_cmd}"
        input_data = SUDO_PASS + "\n"
    else:
        final_cmd = remote_cmd
        input_data = None
        
    cmd = [
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ConnectTimeout=10",
        "aapanel@192.168.1.111",
        final_cmd
    ]
    res = subprocess.run(cmd, env=env, input=input_data, capture_output=True, text=True)
    return res.returncode, res.stdout, res.stderr

if __name__ == "__main__":
    use_sudo = "--sudo" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--sudo"]
    remote_cmd = " ".join(args) if args else "whoami"
    code, stdout, stderr = run_ssh(remote_cmd, use_sudo=use_sudo)
    if stdout:
        print("[STDOUT]\n" + stdout)
    if stderr:
        print("[STDERR]\n" + stderr)
    sys.exit(code)
```

---

## 5. SOP Deployment Standar (Step-by-Step Runbook)

Setiap kali ada pembaruan kode di lokal dan ingin di-deploy ke aaPanel, ikuti urutan standar berikut:

### Langkah 1: Validasi Build di Komputer Lokal
Pastikan tidak ada error tipe atau build di lokal:
```powershell
cmd /c "npx tsc --noEmit && npm run lint && npm run build"
```

### Langkah 2: Buat Patch Perubahan (UTF-8)
Gunakan python untuk membuat file patch agar format encoding UTF-8 valid:
```powershell
python -c "import subprocess; out = subprocess.check_output(['git', 'diff']); open('fresh.patch', 'wb').write(out)"
```

### Langkah 3: Transfer Patch via SCP
Kirim patch ke folder `/tmp` di server:
```powershell
python -c "
import subprocess, os
env = os.environ.copy()
env['SSH_ASKPASS'] = os.path.abspath('askpass.bat')
env['SSH_ASKPASS_REQUIRE'] = 'force'
subprocess.run(['scp', '-o', 'StrictHostKeyChecking=no', 'fresh.patch', 'aapanel@192.168.1.111:/tmp/fresh.patch'], env=env, check=True)
print('SCP SUCCESS')
"
```

### Langkah 4: Terapkan Patch & Build Ulang di Server
Jalankan kompilasi menggunakan Node.js v26 resmi server:
```powershell
python remote_exec.py --sudo "bash -c 'cd /www/wwwroot/oscartambunan_portofolio_web && git checkout -- . && git apply /tmp/fresh.patch && chown -R www:www /www/wwwroot/oscartambunan_portofolio_web && sudo -u www /www/server/nodejs/v26.7.0/bin/npm run build'"
```

### Langkah 5: Restart Service Port 3000 via Skrip Resmi aaPanel
Restart proses Next.js tanpa mematikan website lain:
```powershell
python remote_exec.py --sudo "bash -c '
OLD_PID=\$(cat /www/server/nodejs/vhost/pids/oscartambunan_portofolio_web.pid 2>/dev/null || true)
if [ -n \"\$OLD_PID\" ]; then
    kill -9 \"\$OLD_PID\" 2>/dev/null || true
fi
fuser -k 3000/tcp 2>/dev/null || true
sleep 2

sudo -u www bash /www/server/nodejs/vhost/scripts/oscartambunan_portofolio_web.sh
sleep 3
ss -tulpn | grep 3000
'"
```

### Langkah 6: Verifikasi Status & Kesehatan Server
Pastikan website target berjalan dan web lain tidak tersentuh:
```powershell
python remote_exec.py --sudo "bash -c '
echo \"=== PORT 3000 TEST ===\"
curl -s -o /dev/null -w \"HTTP %{http_code}\n\" http://127.0.0.1:3000/

echo \"=== NGINX HTTPS TEST ===\"
curl -s -k -o /dev/null -w \"HTTP %{http_code}\n\" -H \"Host: oscartambunan.my.id\" https://127.0.0.1/

echo \"=== CEK STATUS WEB LAIN ===\"
sudo -u www pm2 list

rm -f /tmp/fresh.patch
'"
```

---

## 6. Aturan Keselamatan Mutlak (Pantangan)

1. **DILARANG MENGHAPUS SEMBARANGAN:** Jangan pernah menjalankan `rm -rf` di `/www/wwwroot/` selain di dalam folder proyek sendiri.
2. **JANGAN MATIKAN PROSES WEB LAIN:** Website seperti `saringopini` berjalan via PM2 di bawah user `www` (port selain 3000). Jangan pernah menjalankan `pm2 kill` atau `killall node`. Hanya bunuh PID spesifik port 3000 (`fuser -k 3000/tcp` atau PID dari file `oscartambunan_portofolio_web.pid`).
3. **SELALU PERTAHANKAN OWNERSHIP `www:www`:** Setiap ada penambahan file atau clone di `/www/wwwroot/oscartambunan_portofolio_web`, pastikan hak akses dikembalikan ke user `www:www` (`chown -R www:www ...`) agar aaPanel Node Manager tidak mengalami error *Permission Denied*.

---

## 7. Template Prompt untuk Sesi Antigravity Baru

Jika di kemudian hari Anda membuka sesi percakapan baru di Antigravity dan ingin melakukan update/deployment, cukup ketik instruksi sederhana ini:

> *"Tolong baca file AAPANEL.md. Saya ingin melakukan update terbaru ke server aaPanel oscartambunan.my.id. Ikuti SOP deployment yang ada di AAPANEL.md secara presisi dan pastikan web lain tidak terganggu."*
