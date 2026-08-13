"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PaymentMethodCard } from "@/components/payment/PaymentMethodCard";
import { useJobDetail } from "@/hooks/useJobs";
import { usePaymentDetail, useProcessPayment, useProcessQris, useCheckPaymentStatus } from "@/hooks/usePayment";
import { PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, QrCode, CreditCard, Landmark, Banknote, CheckCircle2, FileText } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";

import { paymentService } from "@/services/payment.service";

export default function PaymentPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = React.use(params);
  
  if (jobId === "[object Object]" || jobId === "%5Bobject%20Object%5D" || decodeURIComponent(jobId) === "[object Object]") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }
  
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [qrisData, setQrisData] = useState<string | null>(null);
  const [qrisAmount, setQrisAmount] = useState<number | null>(null);
  const { role } = useAuthStore();
  
  const { data: job, isLoading: loadingJob } = useJobDetail(jobId as string);
  const { data: payment, isLoading: loadingPayment } = usePaymentDetail(jobId as string);
  const processPayment = useProcessPayment();
  const processQris = useProcessQris();
  const checkStatus = useCheckPaymentStatus();
  
  useEffect(() => {
    if (payment?.method) {
      setMethod(payment.method as PaymentMethod);
    }
  }, [payment]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (qrisData && payment?.status !== "SUCCESS") {
      interval = setInterval(async () => {
        try {
          const res = await paymentService.checkStatus(jobId as string);
          if (res.status === 'SUCCESS') {
            checkStatus.mutate({ jobId: jobId as string });
          }
        } catch (e) {}
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [qrisData, payment?.status, jobId, checkStatus]);
  
  const loading = loadingJob || loadingPayment;
  const isSuccess = payment?.status === "SUCCESS";
  
  const partnerName = job ? (role === "consumer" 
    ? (job.partnerName || (job as any).partner?.name) 
    : (job.consumerName || (job as any).consumer?.name)) : "-";
    
  const baseAmount = payment ? (payment.amount > 0 ? payment.amount : (job?.rewardAmount ?? (job as any)?.reward_amount ?? 0)) : 0;
  const displayAmount = qrisAmount || baseAmount;

  const handlePay = async () => {
    if (!method) return;
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

  if (isSuccess) {
    return (
      <DashboardLayout>
        <PageContainer className="max-w-md items-center text-center pt-12 pb-24">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Pembayaran Diterima!</h1>
          <p className="text-muted-foreground mb-8">
            Terima kasih, pembayaran untuk pekerjaan &quot;{job.title}&quot; telah berhasil diproses. Pekerjaan Anda sekarang sudah diterbitkan dan dapat diambil oleh Mitra.
          </p>
          
          <DashboardCard className="text-left mb-8 w-full border-dashed border-2 bg-muted/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
            <div className="flex items-center gap-2 text-primary font-medium mb-4">
              <FileText className="w-4 h-4" /> Bukti Pembayaran
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Transaksi</span>
                <span className="font-mono font-medium">{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-medium">{payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-base">
                <span>Total Bayar</span>
                <span className="text-primary">Rp {displayAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </DashboardCard>

          <div className="space-y-3 w-full">
            <Link href={`/dashboard/jobs/${job.id}`}>
              <Button className="w-full rounded-xl" size="lg">Lihat Detail Pekerjaan</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full rounded-xl" size="lg">Kembali ke Beranda</Button>
            </Link>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer className="max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Pembayaran</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {qrisData ? (
              <section className="animate-in fade-in zoom-in-95 duration-300">
                <DashboardCard className="flex flex-col items-center justify-center py-10">
                  <h2 className="text-lg font-bold mb-2">Scan QRIS</h2>
                  <p className="text-sm text-muted-foreground mb-6">Buka aplikasi e-wallet Anda (Gopay, OVO, Dana) dan scan kode QR ini.</p>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-primary/20 mb-6">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrisData)}`} 
                      alt="QRIS Code"
                      className="w-[200px] h-[200px]"
                    />
                  </div>
                  <div className="flex gap-3 w-full max-w-[300px]">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { setQrisData(null); setQrisAmount(null); }}>
                      Batal
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl" 
                      onClick={() => checkStatus.mutate({ jobId: jobId as string })}
                      disabled={checkStatus.isPending}
                    >
                      {checkStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                      Cek Pembayaran
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
                  {payment?.method ? (
                    <PaymentMethodCard 
                      id={payment.method as string}
                      name={payment.method === "QRIS" ? "QRIS (Gopay, OVO, Dana)" : "Uang Tunai (Cash di Tempat)"}
                      icon={payment.method === "QRIS" ? <QrCode className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                      selected={true}
                      onSelect={() => {}}
                    />
                  ) : (
                    <>
                      <PaymentMethodCard 
                        id="QRIS" 
                        name="QRIS (Gopay, OVO, Dana)" 
                        icon={<QrCode className="w-5 h-5" />} 
                        selected={method === "QRIS"}
                        onSelect={() => setMethod("QRIS")}
                      />
                      <PaymentMethodCard 
                        id="CASH" 
                        name="Uang Tunai (Cash di Tempat)" 
                        icon={<Banknote className="w-5 h-5" />} 
                        selected={method === "CASH"}
                        onSelect={() => setMethod("CASH")}
                      />
                    </>
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="md:col-span-1">
            <DashboardCard className="sticky top-24 border-primary/20 bg-primary/5 shadow-sm">
              <h3 className="font-bold mb-4">Ringkasan</h3>
              <div className="space-y-3 text-sm mb-6">
                <div>
                  <p className="text-muted-foreground text-xs">Pekerjaan</p>
                  <p className="font-medium line-clamp-2">{job.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Mitra</p>
                  <p className="font-medium">{partnerName}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary/10">
                <p className="text-muted-foreground text-xs mb-1">Total Tagihan</p>
                <p className="text-2xl font-bold text-primary mb-1">
                  Rp {displayAmount.toLocaleString("id-ID")}
                </p>
                {method === "QRIS" && !qrisData ? (
                  <p className="text-[11px] text-muted-foreground mb-6 leading-tight italic">
                    *Biaya admin/layanan gateway akan ditambahkan secara otomatis saat QRIS dibuat.
                  </p>
                ) : (
                  <div className="mb-6" />
                )}
                
                {!qrisData && (
                  <Button 
                    className="w-full rounded-xl shadow-md" 
                    size="lg"
                    disabled={!method || processPayment.isPending || processQris.isPending}
                    onClick={handlePay}
                  >
                    {processPayment.isPending || processQris.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Bayar Sekarang"}
                  </Button>
                )}
                {!method && !qrisData && (
                  <p className="text-xs text-center text-muted-foreground mt-3">Silakan pilih metode pembayaran</p>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}

