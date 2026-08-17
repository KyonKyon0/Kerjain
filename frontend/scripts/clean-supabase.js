const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    value = value.trim().replace(/^["']|["']$/g, '');
    env[match[1]] = value;
  }
});

const connectionString = env.DIRECT_URL || env.DATABASE_URL;

async function main() {
  console.log("Connecting to Supabase PostgreSQL database...");
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  console.log("Connected successfully.\n");

  try {
    // 1. Check existing counts
    const usersCount = (await client.query("SELECT COUNT(*) FROM users")).rows[0].count;
    const jobsCount = (await client.query("SELECT COUNT(*) FROM jobs")).rows[0].count;
    const paymentsCount = (await client.query("SELECT COUNT(*) FROM payments")).rows[0].count;
    const messagesCount = (await client.query("SELECT COUNT(*) FROM messages")).rows[0].count;
    const reviewsCount = (await client.query("SELECT COUNT(*) FROM reviews")).rows[0].count;
    const notifsCount = (await client.query("SELECT COUNT(*) FROM notifications")).rows[0].count;
    const progressCount = (await client.query("SELECT COUNT(*) FROM job_progress_logs")).rows[0].count;
    const withdrawalsCount = (await client.query("SELECT COUNT(*) FROM withdrawals")).rows[0].count;
    const walletsCount = (await client.query("SELECT COUNT(*) FROM wallets")).rows[0].count;

    console.log("--- Current Database Counts ---");
    console.log(`👤 Users (TETAP AMAN & TIDAK DIHAPUS): ${usersCount}`);
    console.log(`💼 Jobs: ${jobsCount}`);
    console.log(`📝 Job Progress: ${progressCount}`);
    console.log(`💳 Payments: ${paymentsCount}`);
    console.log(`💬 Messages: ${messagesCount}`);
    console.log(`⭐ Reviews: ${reviewsCount}`);
    console.log(`🔔 Notifications: ${notifsCount}`);
    console.log(`💸 Withdrawals: ${withdrawalsCount}`);
    console.log(`👛 Wallets: ${walletsCount}`);
    console.log("-------------------------------\n");

    // 2. Perform safe cleanup in transaction
    await client.query("BEGIN");

    console.log("Cleaning job_progress_logs...");
    await client.query("DELETE FROM job_progress_logs");

    console.log("Cleaning messages...");
    await client.query("DELETE FROM messages");

    console.log("Cleaning reviews...");
    await client.query("DELETE FROM reviews");

    console.log("Cleaning payments...");
    await client.query("DELETE FROM payments");

    console.log("Cleaning jobs...");
    await client.query("DELETE FROM jobs");

    console.log("Cleaning notifications...");
    await client.query("DELETE FROM notifications");

    console.log("Cleaning withdrawals...");
    await client.query("DELETE FROM withdrawals");

    console.log("Resetting wallet balances to 0...");
    await client.query("UPDATE wallets SET balance = 0");

    await client.query("COMMIT");
    console.log("\n✅ BERHASIL MEMBERSIHKAN DATA TRANSAKSI SUPABASE!");

    // 3. Verify final counts
    const finalUsers = (await client.query("SELECT COUNT(*) FROM users")).rows[0].count;
    const finalJobs = (await client.query("SELECT COUNT(*) FROM jobs")).rows[0].count;
    const finalPayments = (await client.query("SELECT COUNT(*) FROM payments")).rows[0].count;
    const finalNotifs = (await client.query("SELECT COUNT(*) FROM notifications")).rows[0].count;
    const finalWallets = (await client.query("SELECT COUNT(*) FROM wallets")).rows[0].count;

    console.log("\n--- Status Akhir Database ---");
    console.log(`👤 Akun Pengguna: ${finalUsers} user (Seluruh data login, akun, email, password UTUH)`);
    console.log(`💼 Pekerjaan / Lowongan: ${finalJobs}`);
    console.log(`💳 Pembayaran: ${finalPayments}`);
    console.log(`🔔 Notifikasi: ${finalNotifs}`);
    console.log(`👛 Dompet Aktif: ${finalWallets} (Seluruh saldo kembali Rp 0)`);
    console.log("-----------------------------\n");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error cleaning database:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
