import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export interface WalletTransaction {
  id: string;
  type: "INCOME" | "WITHDRAWAL";
  method?: "QRIS" | "CASH";
  amount: number;
  date: string;
  description: string;
  status: string;
}

export interface ChartDataPoint {
  date: string;
  total: number;
  qris: number;
  cash: number;
  amount: number;
  method: 'QRIS' | 'CASH';
  title: string;
}

export interface WalletStats {
  total_earnings: number;
  qris_earnings: number;
  cash_earnings: number;
  completed_count: number;
}

export interface WalletData {
  balance: number;
  ledger: WalletTransaction[];
  canWithdraw: boolean;
  daysRemaining: number;
  firstIncomeDate: string | null;
  stats?: WalletStats;
  chart_data?: ChartDataPoint[];
}

export const useWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async (): Promise<WalletData> => {
      const res = await axiosInstance.get("/wallet");
      return res.data.data;
    },
    staleTime: 20000,
    refetchInterval: 30000,
  });
};


export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { amount: number; bank_name: string; bank_account: string }) => {
      const res = await axiosInstance.post("/wallet", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Penarikan dana berhasil diajukan!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || error.message || "Gagal mengajukan penarikan");
    }
  });
};
