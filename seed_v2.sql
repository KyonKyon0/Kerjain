-- ==============================================================================
-- DATABASE SEED V2 UNTUK KERJAIN (PostgreSQL Self-Hosted)
-- ==============================================================================

TRUNCATE TABLE withdrawals, wallets, notifications, messages, reviews, payments, job_progress_logs, jobs, users CASCADE;

-- 1. USERS (Password default: "password123" atau "$2b$12$R.P.xWdJqW0j6E1G6G3bQeXJ/2v/8v.lK1Tj2Y4bF7kFjM2Y8yD3K")
INSERT INTO users (id, name, email, hashed_password, phone, address, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Budi Consumer', 'budi@consumer.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Xh.E8wPsu', '081111111111', 'Jl. Merdeka No. 1, Jakarta', 'consumer'),
('11111111-1111-1111-1111-111111111112', 'Ani Consumer', 'ani@consumer.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Xh.E8wPsu', '081111111112', 'Jl. Sudirman No. 2, Jakarta', 'consumer'),
('22222222-2222-2222-2222-222222222221', 'Agus Partner', 'agus@partner.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Xh.E8wPsu', '082222222221', 'Jl. Thamrin No. 1, Jakarta', 'partner'),
('22222222-2222-2222-2222-222222222222', 'Siti Partner', 'siti@partner.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Xh.E8wPsu', '082222222222', 'Jl. Gatot Subroto No. 2, Jakarta', 'partner');

-- 2. WALLETS
INSERT INTO wallets (id, user_id, balance, created_at, updated_at) VALUES
(gen_random_uuid(), '22222222-2222-2222-2222-222222222221', 150000, NOW(), NOW()),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 250000, NOW(), NOW());

-- 3. JOBS
INSERT INTO jobs (id, consumer_id, partner_id, title, description, category, address, lat, lng, reward_type, reward_amount, status) VALUES
('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111111', NULL, 'Bantu Angkat Galon', 'Tolong angkat 2 galon air ke lantai 2.', 'Angkat Barang', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 15000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111111', NULL, 'Bersihkan Halaman', 'Halaman depan banyak daun kering.', 'Bersih-bersih', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 30000, 'PUBLISHED'),
('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111111', NULL, 'Perbaiki Genteng Bocor', 'Ada 2 genteng yang bocor di ruang tamu.', 'Perbaikan', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 50000, 'PUBLISHED'),
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Pasar Pipa Paralon', 'Pasang pipa air ke mesin cuci.', 'Perbaikan', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 45000, 'ACCEPTED'),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Bantu Pindahan Kos', 'Bantu bawa barang dari kos lama ke kos baru.', 'Angkat Barang', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 150000, 'ON_THE_WAY'),
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Cuci Motor', 'Tolong cuci motor matic saya.', 'Bersih-bersih', 'Jl. Merdeka No. 1', -6.200000, 106.816666, 'FIXED', 25000, 'COMPLETED');

-- 4. PAYMENTS
INSERT INTO payments (id, job_id, consumer_id, partner_id, amount, method, status, paid_at) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 25000, 'QRIS', 'SUCCESS', NOW() - INTERVAL '2 days'),
('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 45000, 'CASH', 'PENDING', NULL);

-- 5. REVIEWS
INSERT INTO reviews (id, job_id, reviewer_id, target_id, rating, comment) VALUES
('77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 5, 'Mas Agus pekerjaannya rapi dan cepat!'),
('77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 5, 'Terima kasih atas kepercayaannya Pak Budi!');

-- 6. MESSAGES
INSERT INTO messages (id, job_id, sender_id, content, type, read) VALUES
('88888888-8888-8888-8888-888888888801', '44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', 'Halo Kak Siti, sudah jalan menuju lokasi?', 'TEXT', true),
('88888888-8888-8888-8888-888888888802', '44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222222', 'Sudah Pak Budi, perkiraan sampai 10 menit lagi.', 'TEXT', false);

-- 7. NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, description, type, link, read) VALUES
('99999999-9999-9999-9999-999999999901', '11111111-1111-1111-1111-111111111111', 'Pekerjaan Diterima!', 'Agus Partner menerima pekerjaan "Pasar Pipa Paralon" Anda.', 'JOB_ACCEPTED', '/dashboard/jobs/44444444-4444-4444-4444-444444444401', false),
('99999999-9999-9999-9999-999999999902', '22222222-2222-2222-2222-222222222221', 'Pembayaran Selesai', 'Pembayaran sebesar Rp 25.000 untuk "Cuci Motor" telah masuk.', 'PAYMENT', '/dashboard/payments', true);
