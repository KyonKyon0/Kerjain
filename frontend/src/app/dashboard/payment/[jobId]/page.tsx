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
  Clock, 
  XCircle, 
  RefreshCw,
  Plus,
  ShieldCheck,
  Check,
  Receipt,
  Copy,
  Building2,
  ChevronDown,
  Image as ImageIcon,
  Share2
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toPng, toBlob } from "html-to-image";

const PAYMENT_TIMEOUT_SECONDS = 10 * 60; // 10 minutes

const QRIS_STATUS_STEPS = [
  { step: 1, title: "QRIS Terbit", desc: "Barcode terdaftar di gateway pembayaran" },
  { step: 2, title: "Menunggu Pemindaian", desc: "Buka BCA, Mandiri, BRI, BNI, Dana, GoPay, OVO" },
  { step: 3, title: "Verifikasi Jaringan", desc: "Memeriksa konfirmasi sinyal pembayaran" },
  { step: 4, title: "Switching Rekber Escrow", desc: "Mengamankan dana transaksi" },
  { step: 5, title: "Pembayaran Berhasil", desc: "Transaksi sukses & tugas disiarkan ke mitra" },
];

// Helper to parse standard EMVCo QRIS string
function parseQrisPayload(raw: string | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!raw || typeof raw !== 'string') return result;
  
  let i = 0;
  while (i < raw.length - 4) {
    const tag = raw.substring(i, i + 2);
    const len = parseInt(raw.substring(i + 2, i + 4), 10);
    if (isNaN(len) || i + 4 + len > raw.length) break;
    const val = raw.substring(i + 4, i + 4 + len);
    result[tag] = val;
    i += 4 + len;
  }
  return result;
}

export default function PaymentPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = React.use(params);
  const router = useRouter();
  const receiptCardRef = useRef<HTMLDivElement>(null);
  
  if (jobId === "[object Object]" || jobId === "%5Bobject%20Object%5D" || decodeURIComponent(jobId) === "[object Object]") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }
  
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [qrisData, setQrisData] = useState<string | null>(null);
  const [qrisAmount, setQrisAmount] = useState<number | null>(null);
  const [qrisFee, setQrisFee] = useState<number>(0);
  const [qrisMeta, setQrisMeta] = useState<Record<string, any> | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2); // 1-based, start at step 2 (Waiting scan)
  const [timeLeft, setTimeLeft] = useState<number>(PAYMENT_TIMEOUT_SECONDS);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showBankingDetails, setShowBankingDetails] = useState<boolean>(true);
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
          toast.error("Batas waktu pembayaran telah habis. Pekerjaan dibatalkan.");
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
        .then((res: any) => {
          if (res.payment_number) {
            setQrisData(res.payment_number);
            if (res.total_payment !== undefined) {
              setQrisAmount(Number(res.total_payment));
            }
            if (res.fee !== undefined) {
              setQrisFee(Number(res.fee));
            }
            setQrisMeta(res);
            setActiveStepIndex(2); // Step 2: Menunggu scan
          }
        })
        .catch(() => {
          autoQrisTriggered.current = false;
        });
    }
  }, [payment, qrisData, isExpired, jobId, processQris]);

  // Dynamic status animation simulator and polling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (qrisData && payment?.status !== "SUCCESS" && !isExpired) {
      interval = setInterval(async () => {
        try {
          setActiveStepIndex(3); // Step 3: Checking gateway network
          const res = await paymentService.checkStatus(jobId as string);
          
          if (res.status === 'SUCCESS') {
            setActiveStepIndex(4); // Step 4: Switching Escrow
            setTimeout(() => {
              setActiveStepIndex(5); // Step 5: Completed
              checkStatus.mutate({ jobId: jobId as string });
              refetchPayment();
              refetchJob();
            }, 500);
          } else {
            setActiveStepIndex(2);
          }
        } catch (e) {
          setActiveStepIndex(2);
        }
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [qrisData, payment?.status, isExpired, jobId, checkStatus, refetchPayment, refetchJob]);
  
  const loading = loadingJob || loadingPayment;
  const isSuccess = payment?.status === "SUCCESS" || job?.status === "PUBLISHED";
  
  // PRECISE DETERMINISTIC NUMBER ARITHMETIC (NO STRING CONCATENATION, NO FAKE NUMBERS)
  const baseAmount = Number(job?.rewardAmount ?? (job as any)?.reward_amount ?? payment?.amount ?? 0);
  const parsedFee = Number(qrisFee || (payment as any)?.fee || qrisMeta?.fee || 0);
  const qrisTotalNum = qrisAmount ? Number(qrisAmount) : 0;
  const diffFee = qrisTotalNum > baseAmount ? (qrisTotalNum - baseAmount) : 0;
  
  // Real Fee from API (0 if not charged by API)
  const displayFee = parsedFee > 0 ? parsedFee : diffFee;
  const displayAmount = baseAmount + displayFee;

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} berhasil disalin!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Official Receipt Details Payload Helper (Strictly Deterministic Static RRN)
  const getReceiptPayload = () => {
    const txId = (payment as any)?.transaction_id || qrisMeta?.transaction_id || payment?.id || '';
    const orderId = (payment as any)?.order_id || qrisMeta?.order_id || job?.id || '';
    const rawPaidAt = payment?.paidAt || (payment as any)?.paid_at;
    const paidAtFormatted = rawPaidAt 
      ? new Date(rawPaidAt).toLocaleString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : new Date().toLocaleString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const parsedQris = parseQrisPayload(qrisData);
    
    // Deterministic static RRN (derived strictly from transaction ID / payment ID, never changes!)
    const cleanId = (txId || orderId || '000000').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12).toUpperCase();
    const rrn = qrisMeta?.rrn || `RRN-${cleanId}`;
    
    const merchantName = parsedQris['59'] || qrisMeta?.raw_payment?.merchant_name || 'KERJAIN PLATFORM INDONESIA';
    const merchantPan = parsedQris['51'] || parsedQris['26'] || qrisMeta?.raw_payment?.merchant_pan || 'ID1020021982731';
    const acquirerName = qrisMeta?.raw_payment?.acquirer || 'PT PAKASIR TEKNOLOGI / BI-FAST QRIS SWITCHING';
    const merchantCity = parsedQris['60'] || 'JAKARTA';
    const postalCode = parsedQris['61'] || '12930';
    const countryCode = parsedQris['58'] || 'ID';
    const terminalId = qrisMeta?.raw_payment?.terminal_id || 'TID-KRJ01';
    const mccCode = parsedQris['52'] || '7399 (Jasa & Layanan)';

    return {
      rrn,
      txId,
      orderId,
      paidAt: paidAtFormatted,
      merchantName,
      merchantPan,
      acquirer: acquirerName,
      terminalId,
      mcc: mccCode,
      city: `${merchantCity}, ${postalCode} (${countryCode})`,
      baseAmount,
      fee: displayFee,
      totalAmount: displayAmount
    };
  };

  // Save 100% pixel-perfect receipt image identical to web screen
  const handleSaveImage = async () => {
    if (!receiptCardRef.current) return;
    const payload = getReceiptPayload();
    toast.info("Menyimpan gambar bukti transaksi...");
    
    try {
      const dataUrl = await toPng(receiptCardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        style: {
          transform: "none",
          borderRadius: "20px",
        }
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Bukti_Transaksi_${payload.rrn}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Foto bukti transaksi berhasil disimpan ke galeri!");
    } catch {
      toast.error("Gagal membuat gambar bukti transaksi.");
    }
  };

  // Share pixel-perfect receipt image directly or text fallback
  const handleShare = async () => {
    const payload = getReceiptPayload();
    
    if (receiptCardRef.current) {
      try {
        const blob = await toBlob(receiptCardRef.current, {
          cacheBust: true,
          pixelRatio: 2.5,
          style: {
            transform: "none",
            borderRadius: "20px",
          }
        });
        if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], `Bukti_Transaksi_${payload.rrn}.png`, { type: "image/png" })] })) {
          const file = new File([blob], `Bukti_Transaksi_${payload.rrn}.png`, { type: "image/png" });
          await navigator.share({
            title: `Bukti Pembayaran - ${job?.title || 'Kerjain'}`,
            text: `Bukti Transaksi Resmi QRIS Kerjain. Total: Rp ${displayAmount.toLocaleString('id-ID')}`,
            files: [file]
          });
          return;
        }
      } catch {}
    }

    // Clean Monospace Banking Receipt Fallback for Messaging
    const receiptText = 
`================================
      KERJAIN INDONESIA
   BUKTI PEMBAYARAN RESMI
================================
Status        : BERHASIL
Waktu (WIB)   : ${payload.paidAt}
No. Ref (RRN) : ${payload.rrn}
No. Transaksi : ${payload.txId}
ID Pesanan    : ${payload.orderId}
--------------------------------
Merchant      : ${payload.merchantName}
NMID / PAN    : ${payload.merchantPan}
Acquirer      : ${payload.acquirer}
Terminal ID   : ${payload.terminalId}
Kanal         : QRIS Standar BI
--------------------------------
Upah Tugas    : Rp ${payload.baseAmount.toLocaleString("id-ID")}
Pajak & Biaya : Rp ${payload.fee.toLocaleString("id-ID")}
--------------------------------
TOTAL BAYAR   : Rp ${payload.totalAmount.toLocaleString("id-ID")}
================================
*Dokumen bukti elektronik sah*`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bukti Pembayaran - ${job?.title || 'Kerjain'}`,
          text: receiptText,
        });
        return;
      } catch {}
    }

    navigator.clipboard.writeText(receiptText);
    toast.success("Struk pembayaran resmi disalin ke papan klip!");
  };

  const handlePay = async () => {
    if (!method || isExpired) return;
    try {
      if (method === "QRIS") {
        const res: any = await processQris.mutateAsync({ jobId: jobId as string });
        if (res.payment_number) {
          setQrisData(res.payment_number);
          if (res.total_payment !== undefined) {
            setQrisAmount(Number(res.total_payment));
          }
          if (res.fee !== undefined) {
            setQrisFee(Number(res.fee));
          }
          setQrisMeta(res);
          setActiveStepIndex(2);
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

  const handleManualCheck = async () => {
    setActiveStepIndex(3);
    try {
      const res = await paymentService.checkStatus(jobId as string);
      if (res.status === 'SUCCESS') {
        setActiveStepIndex(4);
        setTimeout(() => {
          setActiveStepIndex(5);
          checkStatus.mutate({ jobId: jobId as string });
          refetchPayment();
          refetchJob();
          toast.success("Pembayaran berhasil diverifikasi!");
        }, 400);
      } else {
        toast.info("Pembayaran belum terdeteksi. Silakan selesaikan scan di aplikasi Anda.");
        setActiveStepIndex(2);
      }
    } catch (e) {
      setActiveStepIndex(2);
      toast.error("Gagal memeriksa status pembayaran.");
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
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job || !payment) return null;

  // EXPIRED STATE
  if (isExpired || job.status === "CANCELLED") {
    return (
      <DashboardLayout>
        <PageContainer className="max-w-md items-center text-center pt-8 pb-12">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-in zoom-in duration-300">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <h1 className="text-xl font-black mb-1 text-foreground">Waktu Pembayaran Habis</h1>
          <p className="text-muted-foreground mb-5 text-xs leading-relaxed font-medium">
            Batas waktu pembayaran untuk tugas ini telah kedaluwarsa. Transaksi dibatalkan otomatis.
          </p>
          
          <div className="space-y-2 w-full">
            <Link href="/dashboard/jobs/create" className="block w-full">
              <Button className="w-full rounded-xl h-11 font-black shadow-sm bg-primary text-white hover:bg-primary/90 text-xs">
                <Plus className="w-4 h-4 mr-1.5" /> Buat Pekerjaan Baru
              </Button>
            </Link>
            <Link href="/dashboard" className="block w-full">
              <Button variant="outline" className="w-full rounded-xl h-10 font-bold border-border/80 text-xs">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  // SUCCESS STATE (TIGHT COMPACT NO-SCROLL LAYOUT & CLEAN DETAIL TRANSAKSI)
  if (isSuccess) {
    const payload = getReceiptPayload();
    const isSameId = payload.txId === payload.orderId;

    return (
      <DashboardLayout>
        <PageContainer className="max-w-lg items-center text-center pt-2 pb-6 overflow-x-clip space-y-3">
          
          {/* Animated Success Badge with Clean Glow */}
          <div className="flex flex-col items-center">
            <div className="relative mb-1.5 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-14 h-14 rounded-full bg-emerald-500/20 blur-sm"
              />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="relative w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-400 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-950/30 border border-emerald-300/40"
              >
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </motion.div>
            </div>

            <h1 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Pembayaran Berhasil
            </h1>
          </div>

          {/* EXACT OFFICIAL DETAIL TRANSAKSI CARD (CAPTURED 100% 1-TO-1 IN PNG) */}
          <div ref={receiptCardRef} className="w-full">
            <DashboardCard className="text-left w-full border border-border/80 bg-card rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden space-y-2.5">
              
              {/* Header: Detail Transaksi */}
              <div className="flex items-center justify-between pb-2 border-b border-border/70">
                <div className="flex items-center gap-1.5 text-primary font-black text-xs uppercase tracking-wider">
                  <Receipt className="w-3.5 h-3.5" /> Detail Transaksi
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/30">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Berhasil</span>
                </div>
              </div>

              {/* Core Transaction ID & Reference (Deterministic Static RRN, No Duplicates) */}
              <div className="space-y-1.5 text-xs">
                
                {/* Reference Number (RRN) */}
                <div className="flex justify-between items-center bg-card/60 p-2 rounded-xl border border-border/60">
                  <div>
                    <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider block">No. Referensi (RRN)</span>
                    <span className="font-mono font-black text-foreground text-xs">{payload.rrn}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleCopy(payload.rrn, 'rrn', 'No. Referensi')}
                    className="h-6 px-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    {copiedKey === 'rrn' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>

                {/* Transaction ID */}
                <div className="flex justify-between items-center bg-card/60 p-2 rounded-xl border border-border/60">
                  <div>
                    <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider block">
                      {isSameId ? "ID Transaksi & Referensi" : "ID Transaksi Gateway"}
                    </span>
                    <span className="font-mono font-bold text-foreground text-xs">{payload.txId}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleCopy(payload.txId, 'txId', 'ID Transaksi')}
                    className="h-6 px-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    {copiedKey === 'txId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>

                {/* Job ID (Only if distinct from Transaction ID) */}
                {!isSameId && payload.orderId && (
                  <div className="flex justify-between items-center bg-card/60 p-2 rounded-xl border border-border/60">
                    <div>
                      <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider block">ID Pesanan Tugas</span>
                      <span className="font-mono font-bold text-foreground text-xs">{payload.orderId}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleCopy(payload.orderId, 'orderId', 'ID Pesanan')}
                      className="h-6 px-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      {copiedKey === 'orderId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                )}

                {/* Date & Method */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider block">Waktu Transaksi (WIB)</span>
                    <span className="font-bold text-foreground text-[11px]">{payload.paidAt}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider block">Kanal Pembayaran</span>
                    <span className="font-black text-foreground text-[11px]">{payment.method === "QRIS" ? "QRIS Standar BI" : payment.method}</span>
                  </div>
                </div>

                {/* Price Breakdown with Exact Arithmetic Math */}
                <div className="pt-2 border-t border-border/60 space-y-1">
                  <div className="flex justify-between items-center text-muted-foreground font-medium text-xs">
                    <span>Upah Pekerjaan (Subtotal)</span>
                    <span className="font-bold text-foreground">Rp {payload.baseAmount.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground font-medium text-xs">
                    <span>Pajak & Biaya Transaksi</span>
                    <span className="font-bold text-foreground">
                      Rp {payload.fee.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-border/80 flex justify-between items-center font-black text-xs text-foreground">
                    <span>Total Tagihan Dibayar</span>
                    <span className="text-emerald-400 text-sm">Rp {payload.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              {/* EXPANDABLE QRIS EMVCO BANKING SPECIFICATION DETAILS */}
              <div className="pt-1.5 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowBankingDetails(!showBankingDetails)}
                  className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground py-0.5 transition-colors cursor-pointer outline-none"
                >
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-primary" />
                    Spesifikasi QRIS & Settlement
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showBankingDetails && "rotate-180 text-primary")} />
                </button>

                <AnimatePresence>
                  {showBankingDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden space-y-1 pt-1.5 text-[10px]"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-card/40 p-2 rounded-xl border border-border/60">
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-bold uppercase">Nama Merchant</span>
                          <span className="font-bold text-foreground truncate block">{payload.merchantName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-bold uppercase">NMID / Merchant PAN</span>
                          <span className="font-mono font-bold text-foreground">{payload.merchantPan}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-bold uppercase">Acquirer Gateway</span>
                          <span className="font-medium text-foreground truncate block">{payload.acquirer}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-bold uppercase">Kategori MCC</span>
                          <span className="font-medium text-foreground">{payload.mcc}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-bold uppercase">Terminal ID (TID)</span>
                          <span className="font-mono font-medium text-foreground">{payload.terminalId}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-bold uppercase">Wilayah Domisili</span>
                          <span className="font-medium text-foreground">{payload.city}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </DashboardCard>
          </div>

          {/* TWO ACTION BUTTONS: SIMPAN GAMBAR (FOTO) & BAGIKAN */}
          <div className="grid grid-cols-2 gap-2 w-full pt-1">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveImage}
              className="rounded-xl h-10 font-bold border-border/80 text-xs flex items-center justify-center gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-primary" />
              <span>Simpan Gambar</span>
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleShare}
              className="rounded-xl h-10 font-bold border-border/80 text-xs flex items-center justify-center gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span>Bagikan</span>
            </Button>
          </div>

          {/* DIRECT NAVIGATION BUTTONS */}
          <div className="space-y-1.5 w-full">
            <Link href={`/dashboard/jobs/${job.id}`} className="block w-full">
              <Button className="w-full rounded-xl h-11 font-black shadow-sm bg-primary text-white hover:bg-primary/90 text-xs">
                Lihat Pekerjaan
              </Button>
            </Link>
            <Link href="/dashboard" className="block text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors pt-0.5">
              Kembali ke Beranda
            </Link>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  // ACTIVE PAYMENT STATE: REAL-TIME QRIS CARD BOX & 5-STEP LIVE LIFECYCLE (COMPACT)
  return (
    <DashboardLayout>
      <PageContainer className="max-w-3xl pb-16 overflow-x-clip space-y-4 pt-2">
        
        {/* Header Compact */}
        <div className="flex items-center gap-2.5">
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight">Pembayaran QRIS</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Selesaikan transaksi untuk menyiarkan pekerjaan ke radar mitra</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 items-start">
          
          {/* LEFT: QRIS CARD BOX & LIVE 5-STEP PROCESS */}
          <div className="md:col-span-2 space-y-4">
            
            {/* 10-Minute Countdown Banner */}
            <div className={cn(
              "w-full rounded-xl p-3 border flex items-center justify-between shadow-2xs transition-colors",
              timeLeft <= 120 
                ? "bg-red-500/10 border-red-500/30 text-red-400" 
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            )}>
              <div className="flex items-center gap-2.5">
                <div className={cn("p-1.5 rounded-lg", timeLeft <= 120 ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400")}>
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div>
                  <p className="font-black text-xs text-foreground">Batas Waktu Pembayaran</p>
                  <p className="text-[9px] text-muted-foreground font-medium">Transaksi otomatis dibatalkan jika waktu habis</p>
                </div>
              </div>
              <div className={cn(
                "font-mono font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-lg shadow-2xs border",
                timeLeft <= 120 
                  ? "bg-red-500 text-white border-red-600" 
                  : "bg-amber-500 text-white border-amber-600"
              )}>
                {formatMinutesSeconds(timeLeft)}
              </div>
            </div>

            {qrisData ? (
              <div className="space-y-4">
                
                {/* 1. WRAPPED QRIS DISPLAY CARD BOX (ENCLOSED CONTAINER) */}
                <DashboardCard className="flex flex-col items-center justify-center p-5 sm:p-6 text-center bg-card border border-border/80 rounded-2xl shadow-xs relative overflow-hidden">
                  
                  <div className="flex items-center gap-1 mb-0.5 text-primary text-xs font-black uppercase tracking-wider">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Pindai Kode QRIS</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium mb-3 max-w-xs">
                    Gunakan GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, atau aplikasi perbankan apa pun:
                  </p>
                  
                  {/* Outer Wrapped White Box for Barcode */}
                  <div className="relative p-3.5 sm:p-4 bg-white rounded-2xl shadow-sm border-2 border-emerald-500/40 mb-3 inline-block group">
                    <div className="absolute top-1.5 left-0 right-0 text-center">
                      <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">
                        QRIS Standar Bank Indonesia
                      </span>
                    </div>
                    
                    <div className="mt-3.5">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrisData)}`} 
                        alt="QRIS Code"
                        className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] object-contain rounded-lg mx-auto"
                      />
                    </div>
                  </div>

                  {/* Real-time Detailed Price Breakdown in Card */}
                  <div className="w-full max-w-xs bg-card/80 border border-border/80 rounded-xl p-2.5 text-left space-y-1 mb-3.5 shadow-2xs">
                    <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                      <span>Harga Layanan (Subtotal):</span>
                      <span className="font-bold text-foreground">Rp {baseAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                      <span>Pajak & Biaya Transaksi:</span>
                      <span className="font-bold text-foreground">
                        Rp {displayFee.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="pt-1 border-t border-border/60 flex justify-between text-xs font-black text-foreground">
                      <span>Total Tagihan:</span>
                      <span className="text-emerald-400 text-xs sm:text-sm">Rp {displayAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full max-w-xs">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl h-10 font-bold text-xs border-border/80" 
                      onClick={() => {
                        cancelJob.mutate(jobId as string);
                        router.push("/dashboard");
                      }}
                    >
                      Batalkan
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl h-10 font-extrabold text-xs bg-primary text-white hover:bg-primary/90 shadow-2xs flex items-center justify-center gap-1.5" 
                      onClick={handleManualCheck}
                      disabled={checkStatus.isPending}
                    >
                      {checkStatus.isPending ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Memeriksa...</>
                      ) : (
                        <><RefreshCw className="w-3 h-3" /> Cek Status</>
                      )}
                    </Button>
                  </div>
                </DashboardCard>

                {/* 2. REALISTIC 5-STEP LIVE QRIS LIFECYCLE PROCESS (COMPACT) */}
                <DashboardCard className="p-4 bg-card border border-border/80 rounded-2xl space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      Proses Verifikasi Gateway QRIS
                    </h3>
                    <span className="text-[9px] font-extrabold text-primary animate-pulse">
                      Live Checking...
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {QRIS_STATUS_STEPS.map((stepItem) => {
                      const isDone = stepItem.step < activeStepIndex;
                      const isCurrent = stepItem.step === activeStepIndex;

                      return (
                        <div 
                          key={stepItem.step}
                          className={cn(
                            "flex items-start gap-2.5 p-2 rounded-lg border transition-all text-xs",
                            isCurrent 
                              ? "bg-primary/10 border-primary/40 text-foreground shadow-2xs" 
                              : isDone 
                                ? "bg-card/60 border-border/60 text-muted-foreground" 
                                : "opacity-40 border-transparent text-muted-foreground"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5",
                            isDone 
                              ? "bg-emerald-500 text-white" 
                              : isCurrent 
                                ? "bg-primary text-white animate-pulse" 
                                : "bg-muted text-muted-foreground"
                          )}>
                            {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : stepItem.step}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={cn("font-bold text-[11px]", isCurrent && "font-black text-primary")}>
                                {stepItem.title}
                              </span>
                              {isCurrent && (
                                <span className="text-[8px] font-extrabold text-primary flex items-center gap-1">
                                  <Loader2 className="w-2 h-2 animate-spin" /> Berlangsung
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-muted-foreground font-medium leading-tight mt-0.5">
                              {stepItem.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DashboardCard>

              </div>
            ) : (
              <section className="space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Pilih Metode Pembayaran
                </h2>
                <div className="space-y-2">
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

          {/* RIGHT: REAL-TIME SUMMARY CARD (COMPACT) */}
          <div className="md:col-span-1">
            <DashboardCard className="sticky top-20 border border-border/80 bg-card rounded-2xl p-4 shadow-xs space-y-3">
              <div className="pb-2 border-b border-border/70">
                <h3 className="font-black text-xs uppercase tracking-wider text-foreground">Ringkasan Tagihan</h3>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Judul Pekerjaan</p>
                  <p className="font-black text-foreground line-clamp-2 leading-snug mt-0.5 text-[11px]">{job.title}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Kategori</p>
                  <p className="font-bold text-foreground mt-0.5 text-[11px]">{job.category || "Umum"}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border/70 space-y-1.5">
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Upah Pekerjaan</span>
                  <span className="font-bold text-foreground">Rp {baseAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Pajak & Biaya Transaksi</span>
                  <span className="font-bold text-foreground">
                    Rp {displayFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-border/70 flex justify-between items-baseline">
                  <span className="font-black text-[11px] text-foreground">Total Tagihan</span>
                  <span className="text-base font-black text-emerald-400">
                    Rp {displayAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                
                {!qrisData && (
                  <Button 
                    className="w-full rounded-xl h-11 font-black shadow-sm bg-primary text-white hover:bg-primary/90 mt-2 text-xs" 
                    disabled={!method || processPayment.isPending || processQris.isPending}
                    onClick={handlePay}
                  >
                    {processPayment.isPending || processQris.isPending ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Menyiapkan QRIS...</>
                    ) : (
                      "Lanjutkan Pembayaran"
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
