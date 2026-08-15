"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { jobService } from "@/services/job.service";
import { paymentService } from "@/services/payment.service";
import { reviewService } from "@/services/review.service";
import { Job } from "@/types";
import { Payment } from "@/types";
import { Review } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Star, MapPin, Receipt, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HistoryDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = React.use(params);
  const jobId = resolvedParams?.jobId;
  const router = useRouter();
  
  if (!jobId || jobId === "[object Object]") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }

  
  const { role, user } = useAuthStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId === "[object Object]") return;
    const fetchData = async () => {
      try {
        const [jobRes, payRes, revRes] = await Promise.all([
          jobService.getJob(jobId as string),
          paymentService.getPayment(jobId as string),
          reviewService.getReviews(jobId as string)
        ]);
        
        setJob(jobRes.data);
        setPayment(payRes.data);
        setReviews(revRes.data);
      } catch {
        router.push("/dashboard/history");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) return null;

  const partnerName = role === "consumer" 
    ? (job.partnerName || (job as any).partner?.name) 
    : (job.consumerName || (job as any).consumer?.name);
    
  const isCompleted = job.status === "COMPLETED";
  const myReview = reviews.find(r => r.reviewerId === user?.id || (r as any).reviewer_id === user?.id);
  
  const displayAmount = payment?.amount && payment.amount > 0 
    ? payment.amount 
    : (job.rewardAmount ?? (job as any).reward_amount ?? 0);

  return (
    <DashboardLayout>
      <PageContainer className="max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/history")} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Detail Riwayat</h1>
        </div>

        {/* Status Banner */}
        <div className={cn(
          "p-4 rounded-2xl flex items-start gap-3 mb-6",
          isCompleted ? "bg-green-100 text-green-800" : "bg-destructive/10 text-destructive"
        )}>
          {isCompleted ? <Star className="w-5 h-5 mt-0.5 fill-current" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
            <h3 className="font-bold">{isCompleted ? "Pekerjaan Telah Selesai" : "Pekerjaan Dibatalkan"}</h3>
            <p className="text-sm opacity-90 mt-1">
              {isCompleted 
                ? "Terima kasih telah menggunakan Kerjain. Jejak transaksi Anda tersimpan aman."
                : "Pekerjaan ini dibatalkan dan tidak dilanjutkan."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Job Info */}
          <div className="space-y-6">
            <DashboardCard>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3">Informasi Pekerjaan</h4>
              <h2 className="text-xl font-bold mb-2 leading-tight">{job.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{job.address}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase">{role === "consumer" ? "Mitra Pekerja" : "Pemberi Kerja"}</p>
                    <p className="font-semibold">{partnerName || "-"}</p>
                  </div>
                  <Link href={`/dashboard/chat/${job.id}`}>
                    <Button variant="secondary" size="sm" className="rounded-full h-8">
                      <MessageSquare className="w-3.5 h-3.5 mr-2" /> Histori Chat
                    </Button>
                  </Link>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Payment & Review Info */}
          <div className="space-y-6">
            {payment && (
              <DashboardCard className="bg-muted/10">
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-4 flex items-center gap-2">
                  <Receipt className="w-4 h-4" /> Informasi Tagihan
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Transaksi</span>
                    <span className="font-mono text-xs">{payment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metode</span>
                    <span className="font-medium">{payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status Pembayaran</span>
                    <span className="font-bold text-green-600">{payment.status}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-dashed mt-3">
                    <span className="font-bold">Total Nilai</span>
                    <span className="font-bold text-primary">Rp {displayAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </DashboardCard>
            )}

            {isCompleted && (
              <DashboardCard>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-4">Ulasan Anda</h4>
                {myReview ? (
                  <div>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("w-5 h-5", s <= myReview.rating ? "fill-amber-400 text-amber-400" : "text-muted")} />
                      ))}
                    </div>
                    <p className="text-sm italic text-muted-foreground bg-muted/30 p-3 rounded-xl border">
                      &quot;{myReview.comment}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Star className="w-10 h-10 text-muted mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Anda belum memberikan ulasan untuk pekerjaan ini.</p>
                    <Link href={`/dashboard/review/${job.id}`}>
                      <Button className="rounded-xl w-full">Beri Ulasan Sekarang</Button>
                    </Link>
                  </div>
                )}
              </DashboardCard>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
