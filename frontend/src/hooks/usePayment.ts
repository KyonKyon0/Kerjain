import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";

export const usePaymentDetail = (jobId: string) => {
  return useQuery({
    queryKey: ["payments", jobId],
    queryFn: async () => {
      const res = await paymentService.getPayment(jobId);
      return res.data;
    },
    enabled: !!jobId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, amount }: { jobId: string; amount: number }) => 
      paymentService.createPayment(jobId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memproses penyelesaian");
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, method }: { jobId: string; method: any }) => 
      paymentService.processPayment(jobId, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Pembayaran berhasil diproses");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memproses pembayaran");
    },
  });
};
