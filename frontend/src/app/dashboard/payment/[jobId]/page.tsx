"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PaymentMethodCard } from "@/components/payment/PaymentMethodCard";
import { useJobDetail } from "@/hooks/useJobs";
import { usePaymentDetail, useProcessPayment } from "@/hooks/usePayment";
import { PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, QrCode, CreditCard, Landmark, Banknote, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  const { jobId } = useParams();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  
  const { data: job, isLoading: loadingJob } = useJobDetail(jobId as string);
  const { data: payment, isLoading: loadingPayment } = usePaymentDetail(jobId as string);
  const processPayment = useProcessPayment();
  
  const loading = loadingJob || loadingPayment;
  const isSuccess = payment?.status === "SUCCESS";

  const handlePay = async () => {
    if (!method) return;
    try {
      await processPayment.mutateAsync({ jobId: jobId as string, method });
      window.scrollTo(0, 0);
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
          
          <h1 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h1>
          <p className="text-muted-foreground mb-8">
            Terima kasih, pekerjaan &quot;{job.title}&quot; telah selesai secara resmi.
          </p>
          
          <DashboardCard className="text-left mb-8 w-full border-dashed border-2 bg-muted/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
            <div className="flex items-center gap-2 text-primary font-medium mb-4">
              <FileText className="w-4 h-4" /> Struk Digital
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
                <span className="text-primary">Rp {payment.amount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </DashboardCard>

          <div className="space-y-3 w-full">
            <Link href={`/dashboard/history/${job.id}`}>
              <Button className="w-full rounded-xl" size="lg">Lihat Riwayat & Beri Ulasan</Button>
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
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Pilih Metode (Sandbox)</h2>
              <div className="space-y-3">
                <PaymentMethodCard 
                  id="QRIS" 
                  name="QRIS (Gopay, OVO, Dana)" 
                  icon={<QrCode className="w-5 h-5" />} 
                  selected={method === "QRIS"}
                  onSelect={() => setMethod("QRIS")}
                />
                <PaymentMethodCard 
                  id="VA" 
                  name="Virtual Account (BCA, Mandiri, BNI)" 
                  icon={<Landmark className="w-5 h-5" />} 
                  selected={method === "VA"}
                  onSelect={() => setMethod("VA")}
                />
                <PaymentMethodCard 
                  id="TRANSFER" 
                  name="Transfer Bank Manual" 
                  icon={<CreditCard className="w-5 h-5" />} 
                  selected={method === "TRANSFER"}
                  onSelect={() => setMethod("TRANSFER")}
                />
                <PaymentMethodCard 
                  id="CASH" 
                  name="Uang Tunai (Cash di Tempat)" 
                  icon={<Banknote className="w-5 h-5" />} 
                  selected={method === "CASH"}
                  onSelect={() => setMethod("CASH")}
                />
              </div>
            </section>
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
                  <p className="font-medium">{job.partnerName}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary/10">
                <p className="text-muted-foreground text-xs mb-1">Total Tagihan</p>
                <p className="text-2xl font-bold text-primary mb-6">
                  Rp {payment.amount.toLocaleString("id-ID")}
                </p>
                
                <Button 
                  className="w-full rounded-xl shadow-md" 
                  size="lg"
                  disabled={!method || processPayment.isPending}
                  onClick={handlePay}
                >
                  {processPayment.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Bayar Sekarang"}
                </Button>
                {!method && (
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
