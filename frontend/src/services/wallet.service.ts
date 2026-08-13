import { axiosInstance } from "@/lib/axios";

export const walletService = {
  async getWallet(): Promise<{ success: boolean; data: any }> {
    const res = await axiosInstance.get("/wallet");
    return res.data;
  },

  async withdraw(data: { amount: number; bank_name: string; bank_account: string }): Promise<{ success: boolean; data: any }> {
    const res = await axiosInstance.post("/wallet/withdraw", data);
    return res.data;
  },
};
