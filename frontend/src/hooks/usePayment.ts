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
    enabled: !!jobId && jobId !== "[object Object]",
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

export const useProcessQris = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) => 
      paymentService.processQris(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memproses QRIS");
    },
  });
};

export const useCheckPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) => 
      paymentService.checkStatus(jobId),
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        toast.success("Pembayaran berhasil dikonfirmasi!");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengecek status pembayaran");
    },
  });
};
