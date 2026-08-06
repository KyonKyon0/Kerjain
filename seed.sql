-- ==============================================================================
-- DATABASE SEED UNTUK BANTUTETANGGA (PostgreSQL / Supabase)
-- ==============================================================================

-- Bersihkan data lama jika perlu (Hati-hati, query ini akan mereset table)
-- DELETE FROM notifications;
-- DELETE FROM messages;
-- DELETE FROM reviews;
-- DELETE FROM payments;
-- DELETE FROM jobs;
-- DELETE FROM users;

-- ==============================================================================
-- 1. USERS
-- ==============================================================================
-- Consumer 1 & 2
INSERT INTO users (id, name, email, password_hash, phone, address, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Budi Consumer', 'budi@consumer.com', '$2b$12$R.P.xWdJqW0j6E1G6G3bQeXJ/2v/8v.lK1Tj2Y4bF7kFjM2Y8yD3K', '081111111111', 'Jl. Merdeka No. 1, Jakarta', 'consumer'),
('11111111-1111-1111-1111-111111111112', 'Ani Consumer', 'ani@consumer.com', '$2b$12$R.P.xWdJqW0j6E1G6G3bQeXJ/2v/8v.lK1Tj2Y4bF7kFjM2Y8yD3K', '081111111112', 'Jl. Sudirman No. 2, Jakarta', 'consumer');

-- Partner 1 & 2
INSERT INTO users (id, name, email, password_hash, phone, address, role) VALUES
('22222222-2222-2222-2222-222222222221', 'Agus Partner', 'agus@partner.com', '$2b$12$R.P.xWdJqW0j6E1G6G3bQeXJ/2v/8v.lK1Tj2Y4bF7kFjM2Y8yD3K', '082222222221', 'Jl. Thamrin No. 1, Jakarta', 'partner'),
('22222222-2222-2222-2222-222222222222', 'Siti Partner', 'siti@partner.com', '$2b$12$R.P.xWdJqW0j6E1G6G3bQeXJ/2v/8v.lK1Tj2Y4bF7kFjM2Y8yD3K', '082222222222', 'Jl. Gatot Subroto No. 2, Jakarta', 'partner');


-- ==============================================================================
-- 2. JOBS
-- ==============================================================================
-- 10 Jobs Published (Tanpa Partner)
INSERT INTO jobs (id, consumer_id, partner_id, title, description, category, address, latitude, longitude, reward_type, reward_amount, status) VALUES
('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111111', NULL, 'Bantu Angkat Galon', 'Tolong angkat 2 galon air ke lantai 2.', 'Angkat Barang', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 15000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111111', NULL, 'Bersihkan Halaman', 'Halaman depan banyak daun kering.', 'Bersih-bersih', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 30000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111111', NULL, 'Perbaiki Genteng Bocor', 'Ada 2 genteng yang bocor di ruang tamu.', 'Perbaikan', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 50000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111111', NULL, 'Pindahkan Lemari', 'Pindah lemari kayu dari kamar ke ruang keluarga.', 'Angkat Barang', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 40000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111111', NULL, 'Jaga Kucing 2 Jam', 'Tolong jagakan kucing saya selama saya ke pasar.', 'Penjagaan', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FLEXIBLE', 0, 'PUBLISHED'),

('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111112', NULL, 'Bantu Beli Sayur', 'Tolong belikan sayur sop di warung depan.', 'Lain-lain', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FIXED', 10000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333307', '11111111-1111-1111-1111-111111111112', NULL, 'Ganti Lampu Teras', 'Lampu teras putus, bohlam sudah ada.', 'Perbaikan', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FIXED', 15000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333308', '11111111-1111-1111-1111-111111111112', NULL, 'Sapu Jalanan Depan', 'Sapu jalanan depan rumah yang kotor.', 'Bersih-bersih', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FIXED', 20000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333309', '11111111-1111-1111-1111-111111111112', NULL, 'Jaga Rumah 1 Hari', 'Tolong cek keadaan rumah saat saya dinas.', 'Penjagaan', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FIXED', 100000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333310', '11111111-1111-1111-1111-111111111112', NULL, 'Angkat Jemuran', 'Tolong angkat jemuran kalau hujan turun.', 'Lain-lain', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FLEXIBLE', 0, 'PUBLISHED');

-- 5 Jobs Accepted (Partner 1 dan Partner 2 sedang mengerjakan)
INSERT INTO jobs (id, consumer_id, partner_id, title, description, category, address, latitude, longitude, reward_type, reward_amount, status) VALUES
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Pasar Pipa Paralon', 'Pasang pipa air ke mesin cuci.', 'Perbaikan', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 45000, 'ACCEPTED'),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Bantu Pindahan Kos', 'Bantu bawa barang dari kos lama ke kos baru.', 'Angkat Barang', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 150000, 'ON_THE_WAY'),
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222221', 'Potong Rumput', 'Rumput di halaman sudah panjang.', 'Bersih-bersih', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FIXED', 75000, 'ARRIVED'),
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'Cat Ulang Pagar', 'Pagar depan rumah perlu dicat ulang.', 'Perbaikan', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FIXED', 120000, 'WORKING'),
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222221', 'Jaga Anak 3 Jam', 'Bantu temani anak main sore ini.', 'Penjagaan', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FLEXIBLE', 0, 'WAITING_CONFIRMATION');

-- 2 Jobs Completed (Telah Selesai)
INSERT INTO jobs (id, consumer_id, partner_id, title, description, category, address, latitude, longitude, reward_type, reward_amount, status) VALUES
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Cuci Motor', 'Tolong cuci motor matic saya.', 'Bersih-bersih', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 25000, 'COMPLETED'),
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'Pasang Gas Elpiji', 'Bantu pasangkan tabung gas 3kg.', 'Lain-lain', 'Jl. Sudirman No. 2', -6.210000, 106.820000, 'FIXED', 10000, 'COMPLETED');


-- ==============================================================================
-- 3. PAYMENTS
-- ==============================================================================
-- Untuk Job yang COMPLETED
INSERT INTO payments (id, job_id, consumer_id, partner_id, amount, method, status, paid_at) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 25000, 'QRIS', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('66666666-6666-6666-6666-666666666602', '55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 10000, 'CASH', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Untuk Job WAITING_CONFIRMATION (Belum dibayar)
INSERT INTO payments (id, job_id, consumer_id, partner_id, amount, method, status, paid_at) VALUES
('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222221', 50000, NULL, 'UNPAID', NULL);


-- ==============================================================================
-- 4. REVIEWS
-- ==============================================================================
-- Consumer 1 memberikan review ke Partner 1 (Untuk job 5555...01)
INSERT INTO reviews (id, job_id, reviewer_id, target_id, rating, comment) VALUES
('77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 5, 'Mas Agus bersih cucinya, mantap!'),
('77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 5, 'Pak Budi ramah sekali, terima kasih');

-- Consumer 2 memberikan review ke Partner 2 (Untuk job 5555...02)
INSERT INTO reviews (id, job_id, reviewer_id, target_id, rating, comment) VALUES
('77777777-7777-7777-7777-777777777703', '55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 4, 'Cepat dan tepat, thanks Mba Siti.'),
('77777777-7777-7777-7777-777777777704', '55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111112', 5, 'Proses pembayaran lancar.');


-- ==============================================================================
-- 5. MESSAGES
-- ==============================================================================
-- Chat antara Consumer 1 dan Partner 1 (Job Pindah Kos - ON_THE_WAY)
INSERT INTO messages (id, job_id, sender_id, content, type, read) VALUES
('88888888-8888-8888-8888-888888888801', '44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', 'Halo Pak, sudah sampai mana?', 'TEXT', true),
('88888888-8888-8888-8888-888888888802', '44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222222', 'Sebentar lagi sampai gang depan Pak Budi.', 'TEXT', false),
('88888888-8888-8888-8888-888888888803', '44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', 'Siap, saya tunggu di pagar ya.', 'TEXT', false);


-- ==============================================================================
-- 6. NOTIFICATIONS
-- ==============================================================================
-- Notifikasi untuk Consumer 1 (Job Accepted)
INSERT INTO notifications (id, user_id, title, description, type, link, read) VALUES
('99999999-9999-9999-9999-999999999901', '11111111-1111-1111-1111-111111111111', 'Tawaran Diterima!', 'Agus Partner menerima pekerjaan "Pasar Pipa Paralon" Anda.', 'JOB_ACCEPTED', '/dashboard/jobs/44444444-4444-4444-4444-444444444401', false),
('99999999-9999-9999-9999-999999999902', '11111111-1111-1111-1111-111111111111', 'Pesan Baru', 'Siti Partner mengirim pesan baru untuk pekerjaan Pindahan Kos.', 'NEW_MESSAGE', '/dashboard/jobs/44444444-4444-4444-4444-444444444402/chat', false);

-- Notifikasi untuk Partner 2 (Job Baru Terdekat)
INSERT INTO notifications (id, user_id, title, description, type, link, read) VALUES
('99999999-9999-9999-9999-999999999903', '22222222-2222-2222-2222-222222222222', 'Peluang Baru di Sekitar Anda', 'Pekerjaan "Jaga Rumah 1 Hari" baru saja ditambahkan di dekat lokasi Anda.', 'NEW_JOB', '/dashboard/jobs/33333333-3333-3333-3333-333333333309', true);
