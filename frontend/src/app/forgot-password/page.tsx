"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles 
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 5 Minutes Countdown (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Masukkan alamat email yang valid");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      toast.success("Kode OTP 6-digit berhasil dikirim ke email Anda!");
      setStep(2);
      setTimeLeft(300); // 5 minutes reset
      setTimerActive(true);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim kode OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 270) {
      toast.info("Harap tunggu beberapa detik sebelum meminta kode baru.");
      return;
    }

    setResending(true);
    try {
      await authService.forgotPassword(email.trim());
      toast.success("Kode OTP baru telah dikirimkan ke email Anda!");
      setTimeLeft(300);
      setTimerActive(true);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim ulang kode OTP");
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Masukkan 6 digit kode OTP yang dikirimkan ke email");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });

      toast.success("Kata sandi berhasil diatur ulang!");
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "Gagal mereset kata sandi. Pastikan OTP valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-4 flex justify-start">
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl hover:bg-card/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border border-border/60 shadow-2xl shadow-primary/5 rounded-3xl backdrop-blur-xl bg-card/95 overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 text-center border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary shadow-inner mb-3">
              {step === 1 && <Mail className="w-7 h-7" />}
              {step === 2 && <KeyRound className="w-7 h-7" />}
              {step === 3 && <Sparkles className="w-7 h-7 text-emerald-500" />}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {step === 1 && "Lupa Kata Sandi"}
              {step === 2 && "Verifikasi Kode OTP"}
              {step === 3 && "Kata Sandi Diperbarui!"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {step === 1 && "Masukkan email terdaftar untuk menerima 6-digit kode verifikasi."}
              {step === 2 && `Kode telah dikirim ke ${email}. Masukkan kode dan sandi baru.`}
              {step === 3 && "Akun Anda kini aman. Anda dapat masuk dengan kata sandi baru."}
            </p>

          </div>

          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: INPUT EMAIL */}
              {step === 1 && (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="reset-email">
                      Email Akun Kerjain
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-xl text-base bg-muted/40 focus:bg-background border-border/70"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Kode OTP akan dikirim via email dan berlaku selama <strong className="text-foreground">maksimal 5 menit</strong>.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim Kode...
                      </>
                    ) : (
                      "Kirim Kode OTP (5 Menit)"
                    )}
                  </Button>
                </motion.form>
              )}

              {/* STEP 2: ENTER OTP & NEW PASSWORD */}
              {step === 2 && (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleResetPassword}
                  className="space-y-4"
                >
                  {/* Timer Banner */}
                  <div className="flex items-center justify-between p-3 bg-muted/60 rounded-2xl border">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                      <span className="text-xs font-semibold text-muted-foreground">Masa Berlaku OTP:</span>
                    </div>
                    <span className={`font-mono font-bold text-sm ${timeLeft < 60 ? 'text-destructive' : 'text-primary'}`}>
                      {formatTimer(timeLeft)}
                    </span>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="otp-input">
                      6-Digit Kode OTP
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp-input"
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="pl-10 h-12 rounded-xl font-mono text-xl tracking-[8px] font-bold text-center bg-muted/40 focus:bg-background"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Resend button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resending || timeLeft > 270}
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:hover:no-underline cursor-pointer"
                    >
                      {resending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3 h-3" />
                      )}
                      Kirim Ulang Kode
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="new-password">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-xl text-base bg-muted/40 focus:bg-background"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="confirm-password">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ulangi kata sandi baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12 rounded-xl text-base bg-muted/40 focus:bg-background"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || timeLeft === 0}
                    className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memperbarui...
                      </>
                    ) : (
                      "Simpan Kata Sandi Baru"
                    )}
                  </Button>
                </motion.form>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-4 space-y-5"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Berhasil Diperbarui!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Kata sandi akun Anda telah sukses diubah. Silakan masuk menggunakan kata sandi baru.
                    </p>
                  </div>

                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                  >
                    Masuk ke Akun Sekarang
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-center p-4 bg-muted/20 border-t border-border/40 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-primary" />
            Dilindungi oleh Sistem Enkripsi Kerjain
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
