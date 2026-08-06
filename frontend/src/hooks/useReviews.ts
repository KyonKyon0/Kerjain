import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useJobReviews = (jobId: string) => {
  return useQuery({
    queryKey: ["reviews", jobId],
    queryFn: async () => {
      const res = await reviewService.getReviews(jobId);
      return res.data;
    },
    enabled: !!jobId,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ jobId, targetId, rating, comment }: { jobId: string; targetId: string; rating: number; comment?: string }) => 
      reviewService.submitReview(jobId, targetId as any, rating, comment),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.jobId] });
      toast.success("Berhasil mengirimkan ulasan!");
      router.push(`/dashboard/history/${variables.jobId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengirimkan ulasan");
    },
  });
};
