import { axiosInstance } from "@/lib/axios";
import { Payment, PaymentMethod } from "@/types";

export const paymentService = {
  async getPayment(jobId: string): Promise<{ success: boolean; data: Payment | null }> {
    const res = await axiosInstance.get(`/payments/${jobId}`);
    return res.data;
  },

  async createPayment(jobId: string, amount: number): Promise<{ success: boolean; data: Payment }> {
    const res = await axiosInstance.post("/payments", { jobId, amount });
    return res.data;
  },

  async processPayment(jobId: string, method: PaymentMethod): Promise<{ success: boolean }> {
    const res = await axiosInstance.post(`/payments/${jobId}/pay`, { method });
    return res.data;
  }
};
