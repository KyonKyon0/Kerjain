export const sendOtpEmail = async (to: string, otp: string, recipientName?: string) => {
  const apiKey = process.env.RESEND_API_KEY || '';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Kerjain <onboarding@resend.dev>';
  const name = recipientName || 'Pengguna Kerjain';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kode OTP Reset Kata Sandi - Kerjain</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0f172a;
          margin: 0;
          padding: 0;
          color: #f8fafc;
        }
        .container {
          max-width: 540px;
          margin: 40px auto;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
          padding: 36px 36px 20px 36px;
          text-align: center;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15));
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .brand {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          background: linear-gradient(90deg, #10b981, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }
        .title {
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }
        .content {
          padding: 36px;
        }
        .greeting {
          font-size: 15px;
          color: #cbd5e1;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .otp-box {
          background: rgba(16, 185, 129, 0.08);
          border: 2px dashed #10b981;
          border-radius: 18px;
          padding: 24px 16px;
          text-align: center;
          margin: 28px 0;
        }
        .otp-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: 12px;
          color: #34d399;
          margin: 0;
          padding-left: 12px;
        }
        .expiry-badge {
          display: inline-block;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-top: 12px;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .warning {
          background: rgba(239, 68, 68, 0.08);
          border-left: 4px solid #ef4444;
          padding: 14px 16px;
          border-radius: 8px;
          font-size: 13px;
          color: #fca5a5;
          margin-top: 24px;
          line-height: 1.5;
        }
        .footer {
          padding: 24px 36px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer a {
          color: #38bdf8;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">⚡ Kerjain</div>
          <h1 class="title">Reset Kata Sandi Akun</h1>
        </div>
        <div class="content">
          <p class="greeting">
            Halo <strong>${name}</strong>,<br>
            Kami menerima permintaan untuk mengatur ulang kata sandi akun Kerjain Anda. Gunakan kode One-Time Password (OTP) berikut untuk melanjutkan:
          </p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="expiry-badge">⏱️ Berlaku Selama 5 Menit</div>
          </div>

          <div class="warning">
            ⚠️ <strong>Keamanan:</strong> Jangan berikan kode ini kepada siapa pun termasuk pihak yang mengatasnamakan Kerjain. Jika Anda tidak meminta reset kata sandi, abaikan email ini.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Kerjain Platform. Seluruh hak cipta dilindungi.<br>
          Butuh bantuan? Kunjungi <a href="https://kerjain.id/help">Pusat Bantuan Kerjain</a>
        </div>
      </div>
    </body>
    </html>
  `;

  // Direct REST API Call (Zero runtime dependency, 100% compatible with Vercel, aaPanel, Edge, & Node.js)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: `[Kerjain] ${otp} adalah Kode OTP Reset Kata Sandi Anda`,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend REST API response error:', data);
      return { error: { message: data.message || `Resend HTTP error ${res.status}` } };
    }
    return { data, error: null };
  } catch (fetchError: any) {
    console.error('Resend fetch failed:', fetchError);
    return { error: { message: fetchError.message || 'Gagal terhubung ke API Resend' } };
  }
};
