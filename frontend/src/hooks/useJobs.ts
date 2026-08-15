import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useMyJobs = () => {
  return useQuery({
    queryKey: ["jobs", "my"],
    queryFn: async () => {
      const res = await jobService.getMyJobs();
      return res.data as any;
    },
    refetchInterval: 3500,
  });
};

export const usePartnerJobs = () => {
  return useQuery({
    queryKey: ["jobs", "partner"],
    queryFn: async () => {
      const res = await jobService.getPartnerJobs();
      return res.data as any;
    },
    refetchInterval: 3500,
  });
};

export const useConsumerJobs = () => {
  return useQuery({
    queryKey: ["jobs", "consumer"],
    queryFn: async () => {
      const res = await jobService.getConsumerJobs();
      return res.data as any;
    },
    refetchInterval: 3500,
  });
};

export const useSearchJobs = (query: string = "") => {
  return useQuery({
    queryKey: ["jobs", "search", query],
    queryFn: async () => {
      const res = await jobService.searchJobs(query);
      return res.data as any;
    },
    refetchInterval: 3500,
  });
};

export const useJobDetail = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: async () => {
      const res = await jobService.getJob(id);
      return res.data as any;
    },
    enabled: !!id && id !== "[object Object]" && id !== "%5Bobject%20Object%5D" && decodeURIComponent(id) !== "[object Object]",
    refetchInterval: 2500,
  });
};

export const useJobTimeline = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id, "timeline"],
    queryFn: async () => {
      const res = await jobService.getTimeline(id);
      return res.data as any;
    },
    enabled: !!id && id !== "[object Object]" && id !== "%5Bobject%20Object%5D" && decodeURIComponent(id) !== "[object Object]",
    refetchInterval: 2500,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => jobService.createJob(data),
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      let jobId: string | null = null;
      
      // Extract from the exact structure backend returns
      if (res?.data?.job?.id && typeof res.data.job.id === "string") {
        jobId = res.data.job.id;
      }
      
      const payment = res?.data?.payment;
      
      if (!jobId || jobId === "[object Object]") {
        console.error("Failed to parse valid jobId from response:", res);
        toast.error("Gagal mendapatkan ID pekerjaan. Format respons tidak sesuai.");
        return;
      }
      
      if (payment && payment.method === 'QRIS') {
        toast.success("Pekerjaan berhasil dipublikasikan! Silakan lakukan pembayaran.");
        router.push(`/dashboard/payment/${jobId}`);
      } else {
        toast.success("Pekerjaan berhasil dipublikasikan!");
        router.push(`/dashboard/jobs/${jobId}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat pekerjaan");
    },
  });
};

export const useAcceptJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.acceptJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Pekerjaan berhasil diambil!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengambil pekerjaan");
    },
  });
};

export const useStartJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.startJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Status: Sedang Dikerjakan");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};

export const useFinishJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.finishJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Menunggu konfirmasi penyelesaian");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};

export const useConfirmJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.confirmJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Pekerjaan selesai!");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal mengkonfirmasi pekerjaan"),
  });
};

export const useReviseJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.reviseJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Pekerjaan dikembalikan untuk revisi");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal meminta revisi"),
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.cancelJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Pekerjaan dibatalkan");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal membatalkan pekerjaan"),
  });
};

export const useAddProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; note?: string; photoUrl?: string } }) => 
      jobService.addProgress(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Progres berhasil ditambahkan!");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal menambahkan progres"),
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => jobService.updateJobStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Status berhasil diperbarui");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};

export const useGetMessages = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id, "chat"],
    queryFn: async () => {
      const res = await jobService.getMessages(id);
      return res.data;
    },
    enabled: !!id && id !== "[object Object]" && id !== "%5Bobject%20Object%5D" && decodeURIComponent(id) !== "[object Object]",
    refetchInterval: 2500,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => jobService.sendMessage(id, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id, "chat"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => toast.error(error.message || "Gagal mengirim pesan"),
  });
};
