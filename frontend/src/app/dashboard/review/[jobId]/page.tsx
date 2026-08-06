"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StarRating } from "@/components/reviews/StarRating";
import { jobService } from "@/services/job.service";
import { reviewService } from "@/services/review.service";
import { Job } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MessageSquareHeart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ReviewPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { role } = useAuthStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobService.getJob(jobId as string);
        if (!data || data.status !== "COMPLETED") {
          throw new Error("Pekerjaan belum selesai");
        }
        setJob(data);
      } catch {
        toast.error("Gagal memuat data");
        router.push("/dashboard/history");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [jobId, router]);

  const handleSubmit = async () => {
    if (rating === 0) {
      return toast.error("Silakan berikan rating (1-5 bintang)");
    }
    
    setSubmitting(true);
    try {
      const targetId = role === "consumer" ? job?.partnerId : job?.consumerId;
      await reviewService.submitReview(jobId as string, targetId as string, rating, comment);
      toast.success("Berhasil mengirimkan ulasan!");
      router.push(`/dashboard/history/${jobId}`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Gagal mengirimkan ulasan");
    } finally {
      setSubmitting(false);
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

  if (!job) return null;

  const partnerName = role === "consumer" ? job.partnerName : job.consumerName;

  return (
    <DashboardLayout>
      <PageContainer className="max-w-xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/dashboard/history/${job.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Beri Ulasan</h1>
        </div>

        <DashboardCard className="border-t-4 border-t-primary">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquareHeart className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-xl font-bold mb-1">Bagaimana Pengalaman Anda?</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Nilai kinerja {partnerName} pada pekerjaan &quot;{job.title}&quot;. Ulasan Anda sangat berarti.
            </p>

            <div className="mb-8">
              <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              <p className="text-sm text-amber-500 font-medium mt-3 h-5">
                {rating === 1 && "Sangat Buruk"}
                {rating === 2 && "Buruk"}
                {rating === 3 && "Cukup"}
                {rating === 4 && "Bagus"}
                {rating === 5 && "Sangat Bagus!"}
              </p>
            </div>

            <div className="w-full text-left">
              <label className="block text-sm font-semibold mb-2">Tuliskan pengalaman Anda (Opsional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Ceritakan bagaimana ${partnerName} menyelesaikan tugasnya...`}
                className="w-full min-h-[120px] p-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t flex gap-3">
            <Link href={`/dashboard/history/${job.id}`} className="flex-1">
              <Button variant="outline" className="w-full rounded-xl" size="lg" disabled={submitting}>Nanti Saja</Button>
            </Link>
            <Button 
              className="flex-1 rounded-xl shadow-md" 
              size="lg"
              disabled={submitting || rating === 0}
              onClick={handleSubmit}
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Kirim Ulasan"}
            </Button>
          </div>
        </DashboardCard>
      </PageContainer>
    </DashboardLayout>
  );
}
