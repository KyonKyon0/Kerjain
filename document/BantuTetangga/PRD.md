# Product Requirements Document: 

**Nama Produk:** Kerjain  
**Jenis Produk:** Platform web layanan bantuan berbasis lokasi  
**Versi Dokumen:** 1.0  
**Status:** Draft untuk MVP kompetisi  
**Bahasa Produk:** Bahasa Indonesia  

## 1. Ringkasan Produk

Kerjain adalah platform web berbasis lokasi yang mempertemukan **Konsumen**, yaitu pengguna yang membutuhkan bantuan untuk menyelesaikan pekerjaan sehari-hari, dengan **Mitra**, yaitu pengguna yang bersedia membantu dan berada di sekitar lokasi pekerjaan.

Konsumen dapat mengunggah pekerjaan seperti mengangkat galon, membantu pindahan rumah, mengantre, mengantar barang, membersihkan halaman, atau pekerjaan ringan lainnya. Setiap pekerjaan memuat lokasi, deskripsi, waktu pelaksanaan, kategori atau kata kunci, serta bentuk imbalan yang ditawarkan. Mitra dapat menemukan pekerjaan terdekat, melihat detailnya, lalu menerima pekerjaan tersebut. Setelah pekerjaan diterima, status pesanan diperbarui secara langsung dan Konsumen mendapat informasi mengenai Mitra yang mengambil pekerjaan.

Platform menyediakan peta, pencarian berdasarkan jarak dan kata kunci, notifikasi, percakapan antara Konsumen dan Mitra, pelacakan status pekerjaan, serta pembayaran imbalan. Produk ini mengadopsi pengalaman penggunaan layanan transportasi daring, tetapi berfokus pada bantuan pekerjaan sehari-hari di lingkungan sekitar.

---

## 2. Problem Statement

Banyak orang membutuhkan bantuan untuk pekerjaan sederhana, mendesak, atau bersifat lokal, tetapi kesulitan menemukan orang yang tersedia, dapat dipercaya, dan berada di dekat lokasi mereka. Kebutuhan tersebut dapat muncul ketika pengguna memiliki keterbatasan waktu, tenaga, kendaraan, kemampuan fisik, atau akses terhadap penyedia jasa formal.

Di sisi lain, terdapat orang-orang di sekitar lokasi yang memiliki waktu, tenaga, dan keterampilan untuk membantu, tetapi belum memiliki saluran yang efektif untuk menemukan pekerjaan lokal. Proses pencarian bantuan yang saat ini bergantung pada grup percakapan, media sosial, atau komunikasi dari mulut ke mulut memiliki beberapa kelemahan:

1. Informasi pekerjaan tidak terstruktur dan sulit disaring.
2. Pengguna tidak mengetahui calon penolong yang berada paling dekat.
3. Status pekerjaan tidak diperbarui secara jelas sehingga beberapa orang dapat merespons pekerjaan yang sama.
4. Konsumen dan Mitra tidak memiliki ruang komunikasi yang terhubung langsung dengan pekerjaan.
5. Kesepakatan mengenai imbalan sering tidak transparan sejak awal.
6. Tidak tersedia riwayat pekerjaan dan bukti penyelesaian yang terorganisasi.

Kerjain menyelesaikan masalah tersebut melalui sistem pencocokan bantuan berbasis lokasi, status pekerjaan secara real-time, komunikasi dalam aplikasi, dan kesepakatan imbalan yang dicantumkan sebelum pekerjaan diterima.

---

## 3. Product Vision

Menjadi platform bantuan lokal yang cepat, transparan, aman, dan mudah digunakan untuk menghubungkan orang yang membutuhkan bantuan dengan orang terdekat yang bersedia membantu.

---

## 4. Goals

### 4.1 Business Goals

1. Mempercepat proses mempertemukan Konsumen dengan Mitra yang berada di sekitar lokasi pekerjaan.
2. Membangun ekosistem gotong royong digital yang tetap memungkinkan pemberian imbalan secara transparan.
3. Membuka peluang pendapatan tambahan bagi Mitra melalui pekerjaan lokal dan fleksibel.
4. Meningkatkan keberhasilan penyelesaian pekerjaan melalui alur pemesanan, komunikasi, dan status yang terstruktur.
5. Menghasilkan MVP yang dapat didemonstrasikan secara utuh, mulai dari publikasi pekerjaan hingga penyelesaian dan pembayaran.

### 4.2 User Goals

#### Konsumen

- Mendapatkan bantuan dengan cepat dari Mitra terdekat.
- Menjelaskan kebutuhan, lokasi, waktu, dan imbalan secara jelas.
- Mengetahui status pekerjaan dan identitas Mitra yang menerimanya.
- Berkomunikasi dengan Mitra tanpa berpindah aplikasi.
- Membayar imbalan dengan cara yang sederhana dan tercatat.

#### Mitra

- Menemukan pekerjaan yang relevan dan berjarak dekat.
- Menyaring pekerjaan berdasarkan kategori, kata kunci, jarak, waktu, dan imbalan.
- Mengetahui detail pekerjaan sebelum menerimanya.
- Berkomunikasi dengan Konsumen setelah pekerjaan diterima.
- Mendapatkan imbalan dan riwayat pekerjaan secara transparan.

### 4.3 MVP Goals

MVP harus dapat mendemonstrasikan alur berikut:

1. Pengguna membuat akun dan memilih peran Konsumen atau Mitra.
2. Konsumen membuat dan menerbitkan pekerjaan berbasis lokasi.
3. Mitra melihat pekerjaan di peta atau daftar berdasarkan jarak terdekat.
4. Mitra mencari atau menyaring pekerjaan menggunakan kata kunci.
5. Mitra menerima satu pekerjaan yang masih tersedia.
6. Konsumen menerima notifikasi dan melihat Mitra yang mengambil pekerjaan.
7. Konsumen dan Mitra berkomunikasi melalui fitur chat.
8. Status pekerjaan berubah dari dipublikasikan sampai selesai.
9. Konsumen mengonfirmasi penyelesaian dan pembayaran imbalan.

### 4.4 Non-Goals untuk MVP

Fitur berikut tidak menjadi target utama MVP dan dapat dimasukkan ke roadmap:

- Aplikasi native Android atau iOS.
- Pelacakan lokasi Mitra secara terus-menerus di latar belakang.
- Sistem lelang atau penawaran harga antar-Mitra.
- Pekerjaan dengan banyak Mitra dalam satu pesanan.
- Langganan premium.
- Dompet digital internal yang menyimpan saldo pengguna.
- Pencairan dana otomatis yang kompleks.
- Verifikasi identitas tingkat lanjut dan pemeriksaan latar belakang otomatis.
- Optimasi rute untuk banyak pekerjaan sekaligus.

---

## 5. Target Users

### 5.1 Konsumen

Pengguna yang membutuhkan bantuan untuk pekerjaan harian, lokal, dan memiliki ruang lingkup yang jelas.

**Contoh profil:**

- Mahasiswa yang membutuhkan bantuan pindahan indekos.
- Pekerja yang tidak sempat mengantre atau mengambil barang.
- Penghuni rumah yang membutuhkan bantuan mengangkat galon atau barang berat.
- Pelaku UMKM yang membutuhkan bantuan singkat untuk mengemas atau mengantar barang.
- Pengguna lanjut usia atau pengguna dengan keterbatasan mobilitas yang membutuhkan bantuan ringan dan aman.

**Kebutuhan utama:** cepat, mudah, transparan, dapat berkomunikasi, dan mengetahui siapa yang membantu.

### 5.2 Mitra

Pengguna yang bersedia mengambil pekerjaan lokal berdasarkan waktu, jarak, kemampuan, dan imbalan yang sesuai.

**Contoh profil:**

- Mahasiswa yang mencari pendapatan tambahan.
- Pekerja lepas dengan waktu fleksibel.
- Warga sekitar yang ingin memKerjain.
- Penyedia jasa informal yang ingin memperoleh pekerjaan lokal.

**Kebutuhan utama:** menemukan pekerjaan relevan, mengetahui informasi sebelum menerima, navigasi lokasi, komunikasi, dan kepastian imbalan.

### 5.3 Administrator

Pengelola platform yang menjaga keamanan dan kualitas layanan.

**Kebutuhan utama:** memantau pengguna dan pekerjaan, menangani laporan, menonaktifkan konten bermasalah, serta melihat aktivitas dasar sistem.

> Catatan: Antarmuka Administrator dapat dibuat minimal pada MVP, tetapi kebutuhan datanya harus sudah dipertimbangkan dalam rancangan sistem.

---

## 6. Roles and Permissions

### 6.1 Konsumen

Konsumen dapat:

- Membuat dan mengelola profil.
- Mengunggah pekerjaan.
- Menentukan kategori, kata kunci, lokasi, jadwal, dan imbalan.
- Melihat status pekerjaan yang dibuat.
- Melihat profil Mitra yang menerima pekerjaan.
- Mengobrol dengan Mitra setelah pekerjaan diterima.
- Membatalkan pekerjaan sesuai aturan pembatalan.
- Mengonfirmasi bahwa pekerjaan telah selesai.
- Melakukan atau mengonfirmasi pembayaran.
- Memberikan rating dan ulasan.

Konsumen tidak dapat:

- Menerima pekerjaan sebagai Mitra ketika menggunakan mode Konsumen.
- Mengubah detail utama pekerjaan setelah diterima Mitra, kecuali melalui persetujuan kedua pihak.
- Menandai pekerjaan selesai sebelum diterima Mitra.

### 6.2 Mitra

Mitra dapat:

- Membuat dan mengelola profil Mitra.
- Mengaktifkan atau menonaktifkan status siap menerima pekerjaan.
- Melihat pekerjaan yang masih tersedia.
- Mengurutkan pekerjaan berdasarkan jarak.
- Mencari dan menyaring pekerjaan.
- Melihat detail pekerjaan sebelum menerima.
- Menerima satu pekerjaan yang masih tersedia.
- Mengobrol dengan Konsumen setelah menerima pekerjaan.
- Membuka petunjuk arah menuju lokasi.
- Memperbarui status pelaksanaan pekerjaan.
- Melihat riwayat pekerjaan dan imbalan.
- Memberikan rating dan ulasan kepada Konsumen.

Mitra tidak dapat:

- Mengubah detail pekerjaan milik Konsumen.
- Menerima pekerjaan yang sudah diambil Mitra lain.
- Mengakses alamat lengkap sebelum pekerjaan diterima apabila kebijakan privasi menggunakan lokasi tersamarkan.

### 6.3 Administrator

Administrator dapat:

- Melihat dan menonaktifkan akun.
- Melihat, menyembunyikan, atau menghapus pekerjaan yang melanggar aturan.
- Meninjau laporan dari pengguna.
- Melihat data transaksi dan status pekerjaan untuk penyelesaian sengketa.
- Mengelola kategori dan daftar kata kunci yang disarankan.

---

## 7. User Stories

### 7.1 Authentication and Onboarding

- Sebagai pengguna baru, saya ingin mendaftar menggunakan email atau nomor telepon agar dapat menggunakan platform.
- Sebagai pengguna baru, saya ingin memilih peran Konsumen atau Mitra agar fitur yang muncul sesuai kebutuhan saya.
- Sebagai pengguna, saya ingin masuk dan keluar dari akun dengan aman agar data saya terlindungi.
- Sebagai pengguna, saya ingin mengatur ulang kata sandi agar dapat memulihkan akses akun.
- Sebagai pengguna, saya ingin memberikan izin lokasi secara sadar agar sistem dapat menampilkan layanan berbasis jarak.

### 7.2 Consumer Stories

- Sebagai Konsumen, saya ingin membuat pekerjaan dengan judul dan deskripsi agar Mitra memahami bantuan yang dibutuhkan.
- Sebagai Konsumen, saya ingin memilih kategori dan menambahkan kata kunci agar pekerjaan mudah ditemukan.
- Sebagai Konsumen, saya ingin menentukan lokasi melalui peta atau alamat agar Mitra mengetahui area pekerjaan.
- Sebagai Konsumen, saya ingin menentukan waktu pelaksanaan agar Mitra dapat menilai ketersediaannya.
- Sebagai Konsumen, saya ingin memilih imbalan nominal tetap atau seikhlasnya agar bentuk apresiasi diketahui sejak awal.
- Sebagai Konsumen, saya ingin melihat pratinjau sebelum menerbitkan pekerjaan agar dapat memperbaiki informasi.
- Sebagai Konsumen, saya ingin menerima notifikasi ketika pekerjaan diambil agar mengetahui perkembangan pesanan.
- Sebagai Konsumen, saya ingin melihat nama, foto, rating, dan informasi ringkas Mitra yang mengambil pekerjaan agar merasa lebih yakin.
- Sebagai Konsumen, saya ingin mengobrol dengan Mitra agar detail pelaksanaan dapat dikoordinasikan.
- Sebagai Konsumen, saya ingin melihat perubahan status pekerjaan agar mengetahui progres bantuan.
- Sebagai Konsumen, saya ingin mengonfirmasi penyelesaian agar pekerjaan dapat ditutup dan pembayaran diproses.
- Sebagai Konsumen, saya ingin memberi rating dan ulasan agar kualitas Mitra terdokumentasi.

### 7.3 Partner Stories

- Sebagai Mitra, saya ingin melihat daftar pekerjaan terdekat agar waktu dan biaya perjalanan dapat diminimalkan.
- Sebagai Mitra, saya ingin melihat pekerjaan pada peta agar dapat memahami persebaran lokasi.
- Sebagai Mitra, saya ingin mencari kata kunci seperti `angkat galon` atau `pindahan rumah` agar cepat menemukan pekerjaan yang sesuai.
- Sebagai Mitra, saya ingin memfilter pekerjaan berdasarkan kategori, jarak, waktu, dan jenis imbalan agar hasil lebih relevan.
- Sebagai Mitra, saya ingin melihat estimasi jarak dan imbalan sebelum menerima agar dapat membuat keputusan.
- Sebagai Mitra, saya ingin menerima pekerjaan yang tersedia agar pekerjaan tersebut ditugaskan kepada saya.
- Sebagai Mitra, saya ingin mendapatkan informasi apabila pekerjaan sudah diambil orang lain agar tidak terjadi penerimaan ganda.
- Sebagai Mitra, saya ingin mengubah status menjadi menuju lokasi, tiba, dikerjakan, dan selesai agar Konsumen mengetahui progres.
- Sebagai Mitra, saya ingin membuka navigasi menuju area pekerjaan agar lebih mudah mencapai lokasi.
- Sebagai Mitra, saya ingin mengobrol dengan Konsumen agar dapat meminta informasi tambahan.
- Sebagai Mitra, saya ingin melihat status pembayaran agar imbalan tercatat dengan jelas.
- Sebagai Mitra, saya ingin melihat riwayat pekerjaan agar dapat memantau aktivitas saya.

### 7.4 Safety and Support Stories

- Sebagai pengguna, saya ingin melaporkan pekerjaan, pesan, atau akun yang mencurigakan agar platform lebih aman.
- Sebagai pengguna, saya ingin membatalkan pekerjaan dengan alasan yang jelas agar perubahan tercatat.
- Sebagai pengguna, saya ingin alamat lengkap hanya dibagikan ketika diperlukan agar privasi lokasi terlindungi.
- Sebagai Administrator, saya ingin meninjau laporan agar dapat mengambil tindakan terhadap pelanggaran.

---

## 8. Functional Requirements

### FR-01: Registration and Login

1. Sistem harus menyediakan pendaftaran akun dengan email atau nomor telepon.
2. Sistem harus meminta pengguna memilih peran utama: Konsumen atau Mitra.
3. Sistem harus menyediakan login, logout, dan pengaturan ulang kata sandi.
4. Sistem harus mencegah akses ke fitur yang tidak sesuai dengan peran aktif.
5. Sistem harus meminta persetujuan syarat penggunaan dan kebijakan privasi.

**Acceptance criteria:**

- Pengguna dengan data valid dapat membuat akun dan masuk.
- Kredensial yang salah menghasilkan pesan kesalahan yang jelas.
- Pengguna yang belum masuk diarahkan ke halaman login ketika membuka halaman terlindungi.

### FR-02: User Profile

1. Profil wajib memuat nama, foto opsional, nomor kontak terverifikasi, dan area domisili.
2. Profil Mitra harus menampilkan status ketersediaan, kategori bantuan yang diminati, rating, dan jumlah pekerjaan selesai.
3. Sistem harus memungkinkan pengguna memperbarui informasi profil.
4. Informasi sensitif tidak boleh ditampilkan di profil publik.

### FR-03: Location Permission and Mapping

1. Sistem harus meminta izin sebelum membaca lokasi perangkat.
2. Konsumen dapat menentukan lokasi pekerjaan melalui posisi perangkat, pencarian alamat, atau pin pada peta.
3. Mitra dapat melihat pekerjaan dalam tampilan daftar dan peta.
4. Sistem harus menghitung estimasi jarak Mitra ke pekerjaan.
5. Sistem harus menyediakan tombol untuk membuka petunjuk arah.
6. Sebelum pekerjaan diterima, sistem dapat menampilkan lokasi perkiraan, bukan alamat lengkap.

### FR-04: Create a Job

Konsumen harus dapat membuat pekerjaan dengan data berikut:

- Judul pekerjaan.
- Deskripsi kebutuhan.
- Kategori.
- Satu atau beberapa kata kunci.
- Foto pendukung opsional.
- Lokasi pekerjaan.
- Tanggal dan waktu pelaksanaan.
- Estimasi durasi opsional.
- Jenis imbalan.
- Nominal imbalan jika menggunakan nominal tetap.
- Catatan atau persyaratan khusus.

Sistem harus menyediakan dua jenis imbalan:

1. **Nominal tetap:** Konsumen memasukkan nilai imbalan yang dijanjikan.
2. **Seikhlasnya:** Konsumen tidak menentukan nominal awal, tetapi sistem menampilkan dengan jelas bahwa nilai akhir akan ditentukan Konsumen. Sebelum penyelesaian, Konsumen harus memasukkan nominal final atau menandai bahwa bantuan bersifat sukarela tanpa pembayaran, sesuai persetujuan Mitra.

**Validation rules:**

- Judul, deskripsi, kategori, lokasi, waktu, dan jenis imbalan wajib diisi.
- Nominal harus lebih besar dari nol apabila tipe imbalan adalah nominal tetap.
- Waktu pekerjaan tidak boleh berada di masa lalu.
- Konsumen harus menyetujui bahwa pekerjaan tidak mengandung aktivitas berbahaya, melanggar hukum, atau di luar cakupan platform.

### FR-05: Categories and Keywords

Sistem harus menyediakan kategori awal berikut:

- Angkat dan pindah barang
- Belanja dan antre
- Antar atau ambil barang
- Kebersihan ringan
- Perawatan rumah ringan
- Bantuan acara
- Bantuan teknologi
- Bantuan hewan peliharaan
- Lainnya

Sistem harus menyediakan kata kunci yang dapat dipilih atau ditulis pengguna, misalnya:

- `angkat galon`
- `pindahan rumah`
- `angkat barang`
- `antar barang`
- `ambil paket`
- `belanja kebutuhan`
- `antre`
- `bersihkan halaman`
- `rapikan gudang`
- `pasang perabot`
- `bantu acara`
- `bantuan komputer`

Persyaratan pencarian:

1. Konsumen dapat memilih lebih dari satu kata kunci.
2. Mitra dapat mencari berdasarkan judul, deskripsi, kategori, dan kata kunci.
3. Sistem harus mendukung filter kategori, radius, waktu pelaksanaan, dan jenis imbalan.
4. Hasil dapat diurutkan berdasarkan jarak terdekat, terbaru, waktu tercepat, atau imbalan tertinggi.
5. Pencarian tidak membedakan huruf besar dan kecil.

### FR-06: Job Discovery

1. Sistem harus hanya menampilkan pekerjaan berstatus `Dipublikasikan` pada halaman pencarian Mitra.
2. Kartu pekerjaan harus menampilkan judul, kategori, kata kunci utama, estimasi jarak, waktu, jenis atau nilai imbalan, dan waktu publikasi.
3. Mitra dapat membuka halaman detail sebelum menerima pekerjaan.
4. Sistem harus menampilkan pesan khusus ketika tidak ada pekerjaan dalam radius yang dipilih.
5. Sistem dapat menyarankan pelebaran radius jika hasil kosong.

### FR-07: Accepting a Job

1. Mitra dapat menerima pekerjaan yang masih berstatus `Dipublikasikan`.
2. Satu pekerjaan hanya dapat diterima oleh satu Mitra pada MVP.
3. Sistem harus memproses penerimaan secara atomik agar dua Mitra tidak dapat memperoleh pekerjaan yang sama.
4. Setelah diterima, status berubah menjadi `Sudah Diambil`.
5. Pekerjaan harus segera hilang dari daftar pekerjaan tersedia untuk Mitra lain.
6. Konsumen harus menerima notifikasi yang memuat identitas ringkas Mitra.
7. Mitra harus memperoleh akses ke chat dan detail lokasi yang diperlukan.

### FR-08: Job Status Lifecycle

Status pekerjaan terdiri dari:

1. `Draf`
2. `Dipublikasikan`
3. `Sudah Diambil`
4. `Menuju Lokasi`
5. `Tiba di Lokasi`
6. `Sedang Dikerjakan`
7. `Menunggu Konfirmasi Selesai`
8. `Selesai`
9. `Dibatalkan`
10. `Dilaporkan`

Aturan utama:

- Konsumen membuat draf dan memublikasikan pekerjaan.
- Mitra mengubah status operasional setelah menerima pekerjaan.
- Mitra mengajukan status selesai.
- Konsumen mengonfirmasi penyelesaian.
- Setiap perubahan status harus memiliki waktu pencatatan dan ditampilkan pada timeline pekerjaan.

### FR-09: Real-Time Notifications

Sistem harus mengirim notifikasi dalam aplikasi untuk peristiwa berikut:

- Pekerjaan berhasil dipublikasikan.
- Pekerjaan diterima Mitra.
- Status pekerjaan berubah.
- Pesan chat baru diterima.
- Mitra mengajukan penyelesaian.
- Konsumen mengonfirmasi penyelesaian.
- Pembayaran berhasil atau gagal.
- Pekerjaan dibatalkan.

Notifikasi pekerjaan diterima harus menunjukkan:

- Nama dan foto Mitra.
- Rating Mitra jika tersedia.
- Waktu penerimaan pekerjaan.
- Tombol menuju detail pekerjaan dan chat.

### FR-10: In-App Chat

1. Chat hanya tersedia antara Konsumen dan Mitra yang terhubung pada pekerjaan yang sama.
2. Chat aktif setelah pekerjaan diterima.
3. Pengguna dapat mengirim pesan teks.
4. Pesan harus menampilkan pengirim dan waktu pengiriman.
5. Sistem harus menampilkan jumlah pesan yang belum dibaca.
6. Riwayat chat harus terkait dengan ID pekerjaan.
7. Pengguna dapat melaporkan pesan yang tidak pantas.
8. Pengiriman gambar dapat dijadikan fitur lanjutan apabila waktu pengembangan terbatas.

### FR-11: Payment and Reward

1. Sistem harus menampilkan jenis dan nilai imbalan secara jelas sebelum Mitra menerima pekerjaan.
2. Untuk nominal tetap, nilai tidak dapat diubah sepihak setelah pekerjaan diterima.
3. Untuk imbalan seikhlasnya, nominal final harus dicatat sebelum pembayaran.
4. Sistem harus menyediakan opsi pembayaran nontunai melalui payment gateway pada versi produksi.
5. Untuk MVP kompetisi, sistem dapat memakai mode sandbox atau simulasi pembayaran yang diberi label dengan jelas.
6. Sistem harus menyimpan status pembayaran: `Belum Dibayar`, `Menunggu Pembayaran`, `Berhasil`, `Gagal`, atau `Dikembalikan`.
7. Sistem harus menyediakan ringkasan pembayaran dan bukti transaksi.
8. Sistem tidak boleh menyimpan data kartu pembayaran secara langsung.
9. Jika pembayaran dilakukan tunai, kedua pihak harus dapat mengonfirmasi bahwa pembayaran sudah dilakukan.

### FR-12: Ratings and Reviews

1. Setelah pekerjaan selesai, Konsumen dan Mitra dapat saling memberi rating 1 sampai 5.
2. Ulasan teks bersifat opsional.
3. Satu pengguna hanya dapat memberi satu ulasan untuk satu pekerjaan.
4. Rating agregat ditampilkan pada profil.
5. Pengguna dapat melaporkan ulasan yang melanggar aturan.

### FR-13: Job History

1. Konsumen dapat melihat pekerjaan aktif, selesai, dan dibatalkan.
2. Mitra dapat melihat pekerjaan yang diterima, sedang berlangsung, selesai, dan dibatalkan.
3. Setiap riwayat menampilkan status, waktu, pihak terkait, lokasi ringkas, dan imbalan.
4. Halaman detail riwayat harus menampilkan timeline status.

### FR-14: Cancellation

1. Konsumen dapat membatalkan pekerjaan sebelum diterima tanpa persetujuan Mitra.
2. Setelah pekerjaan diterima, pembatalan harus meminta alasan.
3. Mitra dapat membatalkan pekerjaan yang telah diterima dengan memberikan alasan.
4. Kedua pihak harus menerima notifikasi pembatalan.
5. Riwayat pembatalan harus disimpan untuk moderasi dan evaluasi.
6. Kebijakan biaya pembatalan tidak termasuk cakupan MVP.

### FR-15: Reporting and Moderation

1. Pengguna dapat melaporkan akun, pekerjaan, chat, atau ulasan.
2. Laporan memuat kategori alasan dan deskripsi tambahan.
3. Administrator dapat melihat antrean laporan dan status penanganannya.
4. Administrator dapat menyembunyikan pekerjaan atau menonaktifkan akun.
5. Pekerjaan yang melibatkan aktivitas ilegal, berbahaya, eksploitasi, atau layanan yang dilarang harus ditolak atau dihapus.

### FR-16: Admin Dashboard

Dashboard minimum harus menyediakan:

- Jumlah pengguna berdasarkan peran.
- Daftar pekerjaan dan statusnya.
- Daftar transaksi dan status pembayaran.
- Daftar laporan pengguna.
- Tindakan menonaktifkan akun atau pekerjaan.
- Pengelolaan kategori dan kata kunci.

---

## 9. Non-Functional Requirements

### NFR-01: Performance

- Halaman utama dan daftar pekerjaan harus tampil dalam waktu maksimal 3 detik pada koneksi seluler yang wajar.
- Hasil pencarian dan filter ditargetkan tampil kurang dari 2 detik.
- Pembaruan status dan notifikasi dalam aplikasi ditargetkan diterima dalam waktu kurang dari 5 detik.
- Sistem harus menggunakan pagination atau infinite scroll untuk daftar pekerjaan.

### NFR-02: Availability and Reliability

- Target ketersediaan versi produksi adalah minimal 99,5% per bulan.
- Perubahan status pekerjaan dan transaksi harus tersimpan secara konsisten.
- Sistem harus mencegah satu pekerjaan diterima oleh lebih dari satu Mitra.
- Operasi penting harus bersifat idempotent untuk mencegah duplikasi akibat klik atau permintaan berulang.

### NFR-03: Security

- Seluruh komunikasi harus menggunakan HTTPS.
- Kata sandi harus disimpan dalam bentuk hash yang aman.
- Sistem harus menerapkan otorisasi berbasis peran.
- Endpoint harus memvalidasi kepemilikan resource, bukan hanya status login.
- Input pengguna harus divalidasi dan disanitasi.
- Sistem harus membatasi percobaan login dan tindakan berulang yang mencurigakan.
- Rahasia API tidak boleh disimpan pada kode frontend atau repository publik.
- Integrasi pembayaran harus menggunakan penyedia pembayaran dan mode sandbox selama pengembangan.

### NFR-04: Privacy

- Sistem hanya boleh meminta data yang diperlukan.
- Lokasi harus diakses setelah pengguna memberikan izin.
- Alamat lengkap tidak ditampilkan secara publik.
- Konsumen harus memahami kapan lokasi dibagikan kepada Mitra.
- Pengguna harus dapat meminta penghapusan akun dan data sesuai kebijakan yang berlaku.
- Sistem harus memiliki kebijakan retensi untuk chat, lokasi, dan transaksi.

### NFR-05: Usability

- Antarmuka harus responsif pada desktop dan perangkat seluler.
- Alur penerbitan pekerjaan maksimal terdiri dari tiga tahap utama.
- Label status harus konsisten dan mudah dipahami.
- Pesan kesalahan harus menjelaskan masalah dan tindakan perbaikan.
- Tombol tindakan utama harus mudah ditemukan dan tidak ambigu.

### NFR-06: Accessibility

- Kontras warna harus memadai.
- Seluruh input harus memiliki label.
- Navigasi utama harus dapat digunakan dengan keyboard.
- Informasi status tidak boleh hanya mengandalkan warna.
- Elemen interaktif harus memiliki focus state yang terlihat.
- Gambar penting harus memiliki teks alternatif.

### NFR-07: Scalability

- Arsitektur harus memisahkan data pengguna, pekerjaan, chat, status, notifikasi, dan pembayaran secara logis.
- Pencarian lokasi harus mendukung indeks geospasial.
- Sistem harus memungkinkan penambahan wilayah tanpa perubahan besar pada alur produk.
- Layanan notifikasi dan chat dapat dipisahkan jika volume penggunaan meningkat.

### NFR-08: Compatibility

- Aplikasi harus mendukung dua versi terbaru Chrome, Edge, Firefox, dan Safari.
- Tampilan minimum harus berfungsi pada lebar layar 360 piksel.
- Fitur lokasi harus memiliki fallback pemilihan alamat manual jika geolocation gagal.

### NFR-09: Observability and Auditability

- Sistem harus mencatat error aplikasi tanpa menyimpan data sensitif secara berlebihan.
- Perubahan status, penerimaan pekerjaan, pembatalan, dan pembayaran harus memiliki audit trail.
- Administrator harus dapat menelusuri ID pekerjaan dan ID transaksi ketika menangani laporan.

### NFR-10: Maintainability

- Kode harus menggunakan struktur modular dan konvensi penamaan yang konsisten.
- Konfigurasi lingkungan harus dipisahkan dari kode sumber.
- Komponen UI yang berulang harus dapat digunakan kembali.
- Fitur utama harus memiliki dokumentasi singkat dan pengujian untuk alur kritis.

---

## 10. Core User Flows

### 10.1 Konsumen Membuat Pekerjaan

1. Konsumen login.
2. Konsumen memilih **Buat Pekerjaan**.
3. Konsumen mengisi judul, deskripsi, kategori, dan kata kunci.
4. Konsumen menentukan lokasi pada peta.
5. Konsumen menentukan jadwal dan bentuk imbalan.
6. Konsumen melihat pratinjau.
7. Konsumen menerbitkan pekerjaan.
8. Sistem menampilkan status `Dipublikasikan`.
9. Sistem membuat pekerjaan tersedia bagi Mitra dalam radius pencarian.

### 10.2 Mitra Menerima Pekerjaan

1. Mitra login dan mengaktifkan status siap membantu.
2. Sistem meminta izin lokasi.
3. Mitra melihat daftar atau peta pekerjaan terdekat.
4. Mitra mencari atau memfilter pekerjaan.
5. Mitra membuka detail pekerjaan.
6. Mitra memilih **Terima Pekerjaan**.
7. Sistem memeriksa bahwa pekerjaan masih tersedia.
8. Sistem menetapkan Mitra dan mengubah status menjadi `Sudah Diambil`.
9. Konsumen menerima notifikasi identitas Mitra.
10. Chat dan detail lokasi yang diperlukan menjadi tersedia.

### 10.3 Pelaksanaan hingga Penyelesaian

1. Mitra mengubah status menjadi `Menuju Lokasi`.
2. Mitra mengubah status menjadi `Tiba di Lokasi`.
3. Mitra mengubah status menjadi `Sedang Dikerjakan`.
4. Mitra memilih **Ajukan Selesai**.
5. Konsumen memeriksa hasil pekerjaan.
6. Konsumen mengonfirmasi penyelesaian.
7. Pembayaran atau konfirmasi pembayaran dilakukan.
8. Status berubah menjadi `Selesai`.
9. Kedua pihak dapat memberikan rating dan ulasan.

---

## 11. Data Requirements

### User

- User ID
- Role
- Name
- Email or phone number
- Password hash or authentication provider ID
- Profile photo URL
- Verification status
- Rating summary
- Created time
- Account status

### Job

- Job ID
- Consumer ID
- Partner ID, nullable
- Title
- Description
- Category ID
- Keywords or tags
- Supporting image URLs
- Approximate and precise location data
- Scheduled time
- Estimated duration
- Reward type
- Reward amount, nullable
- Status
- Created and updated time

### Job Status History

- History ID
- Job ID
- Previous status
- New status
- Changed by user ID
- Timestamp
- Optional note

### Chat Message

- Message ID
- Job ID
- Sender ID
- Message body
- Sent time
- Read time
- Report status

### Payment

- Payment ID
- Job ID
- Payer ID
- Recipient ID
- Amount
- Method
- Provider reference
- Payment status
- Created and updated time

### Review

- Review ID
- Job ID
- Reviewer ID
- Reviewee ID
- Rating
- Review text
- Created time
- Report status

### Notification

- Notification ID
- Recipient ID
- Type
- Related resource ID
- Title
- Message
- Read status
- Created time

---

## 12. Business Rules

1. Satu akun memiliki satu peran aktif pada MVP.
2. Hanya Konsumen yang dapat membuat pekerjaan.
3. Hanya Mitra yang dapat menerima pekerjaan.
4. Satu pekerjaan hanya memiliki satu Mitra pada MVP.
5. Pekerjaan yang sudah diambil tidak boleh diterima Mitra lain.
6. Chat pekerjaan hanya dapat diakses pihak yang terlibat dan Administrator berwenang untuk penanganan laporan.
7. Imbalan harus diinformasikan sebelum Mitra menerima pekerjaan.
8. Perubahan imbalan setelah pekerjaan diterima membutuhkan persetujuan kedua pihak.
9. Detail alamat penuh dibagikan hanya pada tahap yang diperlukan.
10. Pembayaran dinyatakan berhasil hanya setelah memperoleh konfirmasi dari payment gateway atau konfirmasi kedua pihak untuk pembayaran tunai.
11. Pekerjaan yang melanggar hukum, berbahaya, atau mengeksploitasi pihak lain dilarang.
12. Sistem harus menyimpan riwayat perubahan status dan transaksi.

---

## 13. Success Metrics

### Product Metrics

- Persentase pekerjaan yang berhasil diterima Mitra.
- Median waktu dari pekerjaan dipublikasikan sampai diterima.
- Persentase pekerjaan yang mencapai status selesai.
- Tingkat pembatalan oleh Konsumen dan Mitra.
- Jumlah pekerjaan yang ditemukan melalui pencarian kata kunci.
- Rata-rata jarak Mitra dari lokasi pekerjaan.
- Persentase pembayaran berhasil.
- Rating rata-rata Konsumen dan Mitra.

### MVP Validation Targets

Target awal untuk pengujian terbatas, bukan janji kinerja produksi:

- Minimal 80% penguji dapat membuat pekerjaan tanpa bantuan fasilitator.
- Minimal 80% penguji Mitra dapat menemukan dan menerima pekerjaan.
- Tidak terjadi penerimaan ganda pada skenario pengujian bersamaan.
- Notifikasi perubahan status tampil pada kedua akun dalam skenario demo.
- Alur utama dari publikasi sampai selesai dapat dilakukan tanpa error kritis.
- Minimal 90% tugas uji pencarian kata kunci menghasilkan pekerjaan yang sesuai.

---

## 14. MVP Prioritization

### Must Have

- Registrasi, login, dan role Konsumen atau Mitra.
- Profil pengguna dasar.
- Pembuatan pekerjaan.
- Kategori dan kata kunci.
- Lokasi berbasis peta.
- Daftar pekerjaan berdasarkan jarak.
- Pencarian dan filter pekerjaan.
- Penerimaan pekerjaan tanpa duplikasi.
- Status pekerjaan.
- Notifikasi dalam aplikasi.
- Chat teks.
- Riwayat pekerjaan.
- Simulasi atau sandbox pembayaran.
- Konfirmasi penyelesaian.

### Should Have

- Rating dan ulasan.
- Foto pendukung pekerjaan.
- Navigasi ke aplikasi peta.
- Pembayaran tunai dengan konfirmasi kedua pihak.
- Laporan akun atau pekerjaan.
- Dashboard Administrator sederhana.

### Could Have

- Push notification atau email notification.
- Favorit kategori pekerjaan.
- Rekomendasi pekerjaan berdasarkan riwayat.
- Berbagi posisi Mitra secara real-time selama perjalanan.
- Promo atau referral.
- Badge Mitra.

### Won't Have in MVP

- Penawaran harga.
- Banyak Mitra untuk satu pekerjaan.
- Dompet saldo internal.
- Paket langganan.
- Aplikasi mobile native.
- Rute multi-stop.

---

## 15. Risks and Mitigations

### Risiko Penerimaan Ganda

**Risiko:** Dua Mitra menerima pekerjaan pada waktu hampir bersamaan.  
**Mitigasi:** Gunakan transaksi basis data atau atomic conditional update pada status dan Partner ID.

### Risiko Privasi Lokasi

**Risiko:** Alamat rumah Konsumen terlihat oleh semua Mitra.  
**Mitigasi:** Tampilkan area perkiraan sebelum penerimaan dan alamat lebih rinci hanya kepada Mitra terpilih.

### Risiko Pekerjaan Berbahaya atau Ilegal

**Risiko:** Pengguna mengunggah pekerjaan di luar cakupan dan membahayakan.  
**Mitigasi:** Terapkan aturan konten, persetujuan sebelum publikasi, pelaporan, moderasi, serta daftar kategori pekerjaan yang dilarang.

### Risiko Perselisihan Imbalan Seikhlasnya

**Risiko:** Mitra dan Konsumen memiliki ekspektasi berbeda.  
**Mitigasi:** Tampilkan label yang jelas, minta persetujuan Mitra sebelum menerima, dan catat nominal final atau kesepakatan sukarela sebelum penutupan pekerjaan.

### Risiko Pembayaran

**Risiko:** Pembayaran ganda, gagal, atau status tidak sinkron.  
**Mitigasi:** Gunakan payment gateway sandbox untuk MVP, webhook terverifikasi, idempotency key, dan audit trail transaksi.

### Risiko Penyalahgunaan Chat

**Risiko:** Spam, pelecehan, atau pertukaran informasi sensitif.  
**Mitigasi:** Sediakan pelaporan, pemblokiran, batas laju pesan, dan pedoman penggunaan.

### Risiko Ruang Lingkup Terlalu Besar

**Risiko:** Semua fitur layanan ojek online dicoba sekaligus sehingga MVP tidak stabil.  
**Mitigasi:** Prioritaskan alur publikasi, pencarian, penerimaan, status, chat, dan simulasi pembayaran. Fitur real-time tracking penuh ditempatkan pada roadmap.

---

## 16. Assumptions and Dependencies

### Assumptions

- Pengguna memiliki perangkat dengan browser modern dan koneksi internet.
- Pengguna bersedia memberikan izin lokasi atau memasukkan alamat secara manual.
- Pada MVP, satu pekerjaan hanya membutuhkan satu Mitra.
- Pembayaran digital pada demo menggunakan mode sandbox atau simulasi.
- Jangkauan awal dapat dibatasi pada satu kota atau area pengujian.

### Dependencies

- Layanan peta dan geocoding.
- Layanan autentikasi.
- Basis data dengan dukungan query lokasi atau perhitungan jarak.
- Layanan real-time untuk chat, notifikasi, dan perubahan status.
- Penyimpanan gambar.
- Payment gateway untuk pembayaran produksi atau sandbox.

---

## 17. Open Questions

1. Apakah satu akun dapat berganti antara mode Konsumen dan Mitra setelah MVP?
2. Berapa radius awal pencarian pekerjaan, misalnya 3 km, 5 km, atau 10 km?
3. Pada status apa alamat lengkap Konsumen dibuka kepada Mitra?
4. Apakah jenis pekerjaan tertentu memerlukan verifikasi Mitra tambahan?
5. Apakah imbalan seikhlasnya boleh bernilai nol, dan bagaimana persetujuannya dicatat?
6. Apakah pembayaran tunai diperbolehkan pada versi produksi?
7. Siapa yang menanggung biaya payment gateway?
8. Bagaimana aturan pembatalan setelah Mitra tiba di lokasi?
9. Berapa lama chat dan data lokasi disimpan?
10. Apakah platform menerima pekerjaan terjadwal untuk hari lain atau hanya pekerjaan segera?
11. Apakah nomor telepon disembunyikan dan seluruh komunikasi wajib melalui chat?
12. Kategori pekerjaan apa saja yang secara eksplisit dilarang?

---

## 18. Recommended Demo Scenario

Untuk demo kompetisi, gunakan satu skenario utama:

1. Konsumen bernama **Rina** login dan mengunggah pekerjaan **Bantu Angkat Dua Galon ke Lantai 2**.
2. Rina memilih kategori **Angkat dan Pindah Barang**, kata kunci `angkat galon`, lokasi pada peta, jadwal hari ini, dan imbalan tetap.
3. Mitra bernama **Budi** login dari lokasi terdekat.
4. Budi menggunakan filter radius dan kata kunci `angkat galon`.
5. Budi membuka detail lalu menerima pekerjaan.
6. Akun Rina menerima notifikasi bahwa pekerjaan diambil Budi.
7. Rina dan Budi berkomunikasi melalui chat.
8. Budi memperbarui status dari menuju lokasi sampai menunggu konfirmasi selesai.
9. Rina mengonfirmasi hasil dan menyelesaikan pembayaran sandbox.
10. Kedua pihak memberikan rating.

Skenario ini menunjukkan nilai utama produk, pemanfaatan lokasi, pencarian kata kunci, pembaruan secara real-time, chat, status pekerjaan, dan pembayaran dalam satu alur yang singkat.

---

## 19. Definition of Done for MVP

MVP dinyatakan siap didemonstrasikan apabila:

- Seluruh fitur kategori **Must Have** dapat diakses melalui aplikasi web ter-deploy.
- Dua akun dengan peran berbeda dapat menjalankan alur utama secara bersamaan.
- Pekerjaan dapat dibuat, ditemukan berdasarkan lokasi dan kata kunci, lalu diterima tepat satu Mitra.
- Konsumen menerima informasi siapa yang mengambil pekerjaan.
- Chat dan pembaruan status dapat digunakan.
- Pembayaran sandbox atau simulasi ditandai dengan jelas dan dapat menyelesaikan alur.
- Aplikasi dapat digunakan pada layar desktop dan seluler.
- Tidak ada error kritis pada skenario demo utama.
- Source code, dokumentasi prompt, dan instruksi menjalankan aplikasi tersedia.
