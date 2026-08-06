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
  });
};

export const usePartnerJobs = () => {
  return useQuery({
    queryKey: ["jobs", "partner"],
    queryFn: async () => {
      const res = await jobService.getPartnerJobs();
      return res.data as any;
    },
  });
};

export const useConsumerJobs = () => {
  return useQuery({
    queryKey: ["jobs", "consumer"],
    queryFn: async () => {
      const res = await jobService.getConsumerJobs();
      return res.data as any;
    },
  });
};

export const useSearchJobs = (query: string = "") => {
  return useQuery({
    queryKey: ["jobs", "search", query],
    queryFn: async () => {
      const res = await jobService.searchJobs(query);
      return res.data as any;
    },
  });
};

export const useJobDetail = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: async () => {
      const res = await jobService.getJob(id);
      return res.data as any;
    },
    enabled: !!id,
  });
};

export const useJobTimeline = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id, "timeline"],
    queryFn: async () => {
      const res = await jobService.getTimeline(id);
      return res.data as any;
    },
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => jobService.createJob(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Pekerjaan berhasil dipublikasikan!");
      router.push(`/dashboard/jobs/${res.data.id}`);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Status: Sedang Dikerjakan");
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
      toast.success("Menunggu konfirmasi penyelesaian");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};

export const useConfirmJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.confirmJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Pekerjaan selesai!");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal mengkonfirmasi pekerjaan"),
  });
};

export const useReviseJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.reviseJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Pekerjaan dikembalikan untuk revisi");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal meminta revisi"),
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.cancelJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Progres berhasil ditambahkan!");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal menambahkan progres"),
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => jobService.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Status berhasil diperbarui");
    },
    onError: (error: Error) => toast.error(error.message || "Gagal memperbarui status"),
  });
};
