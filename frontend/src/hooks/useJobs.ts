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
    staleTime: 15000,
    refetchInterval: 20000,
  });
};

export const usePartnerJobs = () => {
  return useQuery({
    queryKey: ["jobs", "partner"],
    queryFn: async () => {
      const res = await jobService.getPartnerJobs();
      return res.data as any;
    },
    staleTime: 15000,
    refetchInterval: 20000,
  });
};

export const useConsumerJobs = () => {
  return useQuery({
    queryKey: ["jobs", "consumer"],
    queryFn: async () => {
      const res = await jobService.getConsumerJobs();
      return res.data as any;
    },
    staleTime: 15000,
    refetchInterval: 20000,
  });
};

export const useSearchJobs = (query: string = "") => {
  return useQuery({
    queryKey: ["jobs", "search", query],
    queryFn: async () => {
      const res = await jobService.searchJobs(query);
      return res.data as any;
    },
    staleTime: 15000,
    refetchInterval: 25000,
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
    staleTime: 3000,
    refetchInterval: 8000,
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
    staleTime: 3000,
    refetchInterval: 8000,
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
      toast.success("Pekerjaan berhasil dibuat!");
      const createdJob = (res?.data?.job || res?.data) as any;
      if (createdJob?.id) {
        if (createdJob.payment_type === "QRIS" || createdJob.payment_status === "PENDING") {
          router.push(`/dashboard/payment/${createdJob.id}`);
        } else {
          router.push(`/dashboard/jobs/${createdJob.id}`);
        }
      } else {
        router.push("/dashboard");
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Pekerjaan berhasil diambil!");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal mengambil pekerjaan"),
  });
};

export const useStartJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.startJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Pekerjaan dimulai!");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memulai pekerjaan"),
  });
};

export const useDepartJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.updateJobStatus(id, "ON_THE_WAY"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Status diubah: Menuju Lokasi");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};

export const useArriveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.updateJobStatus(id, "ARRIVED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Status diubah: Tiba di Lokasi");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};

export const useFinishJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.finishJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Menunggu konfirmasi konsumen");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal menyelesaikan pekerjaan"),
  });
};

export const useConfirmJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.confirmJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Pekerjaan telah dikonfirmasi selesai!");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal mengonfirmasi pekerjaan"),
  });
};

export const useConfirmFinishJob = useConfirmJob;

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => jobService.updateJobStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Status pekerjaan berhasil diperbarui");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};

export const useAddProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { 
      id: string; 
      data?: { status?: string; note?: string; photoUrl?: string };
      status?: string; 
      note?: string; 
      photoUrl?: string; 
      description?: string; 
      photo_url?: string;
    }) => {
      const status = args.data?.status || args.status || "IN_PROGRESS";
      const note = args.data?.note || args.note || args.description || "";
      const photoUrl = args.data?.photoUrl || args.photoUrl || args.photo_url;
      return jobService.addProgress(args.id, { status, note, photoUrl });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id, "timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Progres kerja berhasil ditambahkan");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal menambahkan progres"),
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.cancelJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Pekerjaan berhasil dibatalkan");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal membatalkan pekerjaan"),
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
    staleTime: 1500,
    refetchInterval: 4000,
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
