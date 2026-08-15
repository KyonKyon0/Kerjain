"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PaymentMethodCard } from "@/components/payment/PaymentMethodCard";
import { useJobDetail, useCancelJob } from "@/hooks/useJobs";
import { usePaymentDetail, useProcessPayment, useProcessQris, useCheckPaymentStatus } from "@/hooks/usePayment";
import { PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowLeft, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  FileText, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Plus
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";

const PAYMENT_TIMEOUT_SECONDS = 10 * 60; // 10 minutes

export default function PaymentPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = React.use(params);
  const router = useRouter();
  
  if (jobId === "[object Object]" || jobId === "%5Bobject%20Object%5D" || decodeURIComponent(jobId) === "[object Object]") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }
  
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [qrisData, setQrisData] = useState<string | null>(null);
  const [qrisAmount, setQrisAmount] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(PAYMENT_TIMEOUT_SECONDS);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const { role } = useAuthStore();
  
  const { data: job, isLoading: loadingJob, refetch: refetchJob } = useJobDetail(jobId as string);
  const { data: payment, isLoading: loadingPayment, refetch: refetchPayment } = usePaymentDetail(jobId as string);
  const processPayment = useProcessPayment();
  const processQris = useProcessQris();
  const checkStatus = useCheckPaymentStatus();
  const cancelJob = useCancelJob();
  
  const autoQrisTriggered = useRef(false);
  const autoCancelled = useRef(false);

  // Set method from payment
  useEffect(() => {
    if (payment?.method) {
      setMethod(payment.method as PaymentMethod);
    }
  }, [payment]);

  // Check if job is already cancelled
  useEffect(() => {
    if (job?.status === "CANCELLED") {
      setIsExpired(true);
    }
  }, [job?.status]);

  // Calculate elapsed time from payment creation & run 10-minute countdown
  useEffect(() => {
    if (!payment || payment.status === "SUCCESS" || isExpired || job?.status === "CANCELLED") return;

    const createdAtTime = new Date(payment.createdAt || (payment as any).created_at || Date.now()).getTime();
    const expiresAt = createdAtTime + PAYMENT_TIMEOUT_SECONDS * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diffInSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
      
      setTimeLeft(diffInSeconds);

      if (diffInSeconds <= 0) {
        setIsExpired(true);
        if (!autoCancelled.current) {
          autoCancelled.current = true;
          cancelJob.mutate(jobId as string);
          toast.error("Batas waktu pembayaran 10 menit telah habis. Pekerjaan dibatalkan.");
        }
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [payment, isExpired, job?.status, jobId, cancelJob]);

  // Auto-generate QRIS if method is QRIS and not yet generated
  useEffect(() => {
    if (payment?.method === "QRIS" && !qrisData && !autoQrisTriggered.current && !isExpired && payment.status !== "SUCCESS") {
      autoQrisTriggered.current = true;
      processQris.mutateAsync({ jobId: jobId as string })
        .then((res) => {
          if (res.payment_number) {
            setQrisData(res.payment_number);
            if (res.total_payment) {
              setQrisAmount(res.total_payment);
            }
          }
        })
        .catch(() => {
          autoQrisTriggered.current = false;
        });
    }
  }, [payment, qrisData, isExpired, jobId, processQris]);

  // Fast polling to detect instant payment verification from Pakasir gateway
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (qrisData && payment?.status !== "SUCCESS" && !isExpired) {
      interval = setInterval(async () => {
        try {
          const res = await paymentService.checkStatus(jobId as string);
          if (res.status === 'SUCCESS') {
            checkStatus.mutate({ jobId: jobId as string });
            refetchPayment();
            refetchJob();
          }
        } catch (e) {}
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [qrisData, payment?.status, isExpired, jobId, checkStatus, refetchPayment, refetchJob]);
  
  const loading = loadingJob || loadingPayment;
  const isSuccess = payment?.status === "SUCCESS" || job?.status === "PUBLISHED";
  
  const partnerName = job ? (role === "consumer" 
    ? (job.partnerName || (job as any).partner?.name) 
    : (job.consumerName || (job as any).consumer?.name)) : "-";
    
  const baseAmount = payment ? (payment.amount > 0 ? payment.amount : (job?.rewardAmount ?? (job as any)?.reward_amount ?? 0)) : 0;
  const displayAmount = qrisAmount || baseAmount;

  const handlePay = async () => {
    if (!method || isExpired) return;
    try {
      if (method === "QRIS") {
        const res = await processQris.mutateAsync({ jobId: jobId as string });
        if (res.payment_number) {
          setQrisData(res.payment_number);
          if (res.total_payment) {
            setQrisAmount(res.total_payment);
          }
          return;
        }
      } else {
        await processPayment.mutateAsync({ jobId: jobId as string, method });
        window.scrollTo(0, 0);
      }
    } catch {
      // Error handled by hook
    }
  };

  const formatMinutesSeconds = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job || !payment) return null;

  // EXPIRED STATE
  if (isExpired || job.status === "CANCELLED") {
    return (
      <DashboardLayout>
        <PageContainer className="max-w-md items-center text-center pt-12 pb-24">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center mb-6 mx-auto animate-in zoom-in duration-300">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-extrabold mb-2 text-foreground">Waktu Pembayaran Habis</h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Batas waktu pembayaran 10 menit untuk pekerjaan &quot;<span className="font-bold text-foreground">{job.title}</span>&quot; telah kedaluwarsa. Pekerjaan dibatalkan secara otomatis demi keamanan transaksi.
          </p>
          
          <div className="space-y-3 w-full">
            <Link href="/dashboard/jobs/create">
              <Button className="w-full rounded-2xl h-14 font-extrabold shadow-md bg-primary hover:bg-emerald-600">
                <Plus className="w-5 h-5 mr-2" /> Buat Pekerjaan Baru
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full rounded-2xl h-12 font-bold">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  // SUCCESS STATE
  if (isSuccess) {
    return (
      <DashboardLayout>
        <PageContainer className="max-w-md items-center text-center pt-12 pb-24">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mb-6 mx-auto animate-in zoom-in duration-500 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <h1 className="text-2xl font-black mb-2 text-foreground">Pembayaran Diterima!</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Terima kasih, pembayaran untuk pekerjaan &quot;<span className="font-bold text-foreground">{job.title}</span>&quot; telah berhasil diverifikasi. Pekerjaan Anda sekarang sudah aktif dan dapat diambil oleh Mitra terdekat.
          </p>
          
          <DashboardCard className="text-left mb-8 w-full border-dashed border-2 bg-muted/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
            <div className="flex items-center gap-2 text-primary font-bold mb-4">
              <FileText className="w-4 h-4" /> Bukti Pembayaran Resmi
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Transaksi</span>
                <span className="font-mono font-bold">{payment.id.slice(0, 18)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-bold text-foreground">{payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between font-extrabold text-base">
                <span>Total Bayar</span>
                <span className="text-emerald-600 dark:text-emerald-400">Rp {displayAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </DashboardCard>

          <div className="space-y-3 w-full">
            <Link href={`/dashboard/jobs/${job.id}`}>
              <Button className="w-full rounded-2xl h-14 font-extrabold shadow-md bg-primary hover:bg-emerald-600">
                Lihat Detail Pekerjaan
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full rounded-2xl h-12 font-bold">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  // ACTIVE PAYMENT STATE WITH 10-MINUTE TIMER & QRIS DISPLAY
  return (
    <DashboardLayout>
      <PageContainer className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-foreground">Pembayaran QRIS</h1>
            <p className="text-xs text-muted-foreground">Selesaikan pembayaran untuk mempublikasikan pekerjaan Anda</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            
            {/* 10-Minute Countdown Banner */}
            <div className={`w-full rounded-2xl p-4 border flex items-center justify-between shadow-sm transition-colors ${
              timeLeft <= 120 
                ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300" 
                : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${timeLeft <= 120 ? "bg-red-500/20 text-red-600" : "bg-amber-500/20 text-amber-600"}`}>
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="font-extrabold text-xs">Sisa Waktu Pembayaran</p>
                  <p className="text-[11px] opacity-80">Otomatis batal jika waktu habis</p>
                </div>
              </div>
              <div className={`font-mono font-black text-lg px-3 py-1 rounded-xl shadow-sm border ${
                timeLeft <= 120 
                  ? "bg-red-500 text-white border-red-600" 
                  : "bg-amber-500 text-white border-amber-600"
              }`}>
                {formatMinutesSeconds(timeLeft)}
              </div>
            </div>

            {qrisData ? (
              <section className="animate-in fade-in zoom-in-95 duration-300">
                <DashboardCard className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <h2 className="text-lg font-extrabold mb-1">Scan Kode QRIS</h2>
                  <p className="text-xs text-muted-foreground mb-6 max-w-sm">
                    Buka aplikasi e-wallet atau m-banking (Gopay, OVO, Dana, BCA, Mandiri, dll) dan pindai barcode berikut:
                  </p>
                  
                  <div className="bg-white p-4 rounded-3xl shadow-md border-2 border-primary/30 mb-6 relative group">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrisData)}`} 
                      alt="QRIS Code"
                      className="w-[220px] h-[220px] object-contain rounded-xl"
                    />
                  </div>

                  <div className="bg-muted/40 border border-border/80 rounded-2xl p-3.5 w-full max-w-sm mb-6 text-left space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Total Tagihan:</span>
                      <span className="font-bold text-foreground">Rp {displayAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Menunggu Pembayaran
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full max-w-sm">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-2xl h-12 font-bold" 
                      onClick={() => {
                        cancelJob.mutate(jobId as string);
                        router.push("/dashboard");
                      }}
                    >
                      Batalkan
                    </Button>
                    <Button 
                      className="flex-1 rounded-2xl h-12 font-bold bg-primary hover:bg-emerald-600 shadow-md" 
                      onClick={() => checkStatus.mutate({ jobId: jobId as string })}
                      disabled={checkStatus.isPending}
                    >
                      {checkStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1.5" />}
                      Cek Status
                    </Button>
                  </div>
                </DashboardCard>
              </section>
            ) : (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  {payment?.method ? "Metode Pembayaran" : "Pilih Metode"}
                </h2>
                <div className="space-y-3">
                  <PaymentMethodCard 
                    id="QRIS" 
                    name="QRIS (Gopay, OVO, Dana, M-Banking)" 
                    icon={<QrCode className="w-5 h-5" />} 
                    selected={method === "QRIS"}
                    onSelect={() => setMethod("QRIS")}
                  />
                  <PaymentMethodCard 
                    id="CASH" 
                    name="Uang Tunai (Cash Langsung di Tempat)" 
                    icon={<Banknote className="w-5 h-5" />} 
                    selected={method === "CASH"}
                    onSelect={() => setMethod("CASH")}
                  />
                </div>
              </section>
            )}
          </div>

          <div className="md:col-span-1">
            <DashboardCard className="sticky top-24 border-primary/20 bg-primary/5 shadow-sm">
              <h3 className="font-extrabold mb-4 text-foreground">Ringkasan Pesanan</h3>
              <div className="space-y-3 text-sm mb-6">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold">Pekerjaan</p>
                  <p className="font-bold text-foreground line-clamp-2 leading-snug">{job.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold">Kategori</p>
                  <p className="font-medium text-foreground">{job.category || "Umum"}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary/15">
                <p className="text-muted-foreground text-xs font-semibold mb-1">Total Biaya Imbalan</p>
                <p className="text-2xl font-black text-primary mb-2">
                  Rp {displayAmount.toLocaleString("id-ID")}
                </p>
                
                <p className="text-[11px] text-muted-foreground mb-6 leading-relaxed">
                  *Dana Anda terjamin aman di rekening bersama (*escrow*) Kerjain sampai pekerjaan tuntas.
                </p>
                
                {!qrisData && (
                  <Button 
                    className="w-full rounded-2xl h-14 font-extrabold shadow-md bg-primary hover:bg-emerald-600" 
                    size="lg"
                    disabled={!method || processPayment.isPending || processQris.isPending}
                    onClick={handlePay}
                  >
                    {processPayment.isPending || processQris.isPending ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Menyiapkan QRIS...</>
                    ) : (
                      "Lanjutkan ke Pembayaran"
                    )}
                  </Button>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
