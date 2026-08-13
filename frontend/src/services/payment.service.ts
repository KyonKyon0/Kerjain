import { axiosInstance } from "@/lib/axios";
import { Payment, PaymentMethod } from "@/types";

export const paymentService = {
  async getPayment(jobId: string): Promise<{ success: boolean; data: Payment | null }> {
    const res = await axiosInstance.get(`/payments/${jobId}`);
    return res.data;
  },

  async createPayment(jobId: string, amount: number): Promise<{ success: boolean; data: Payment }> {
    const res = await axiosInstance.post("/payments", { job_id: jobId, amount, method: "QRIS" });
    return res.data;
  },

  async processPayment(jobId: string, method: PaymentMethod): Promise<{ success: boolean }> {
    const res = await axiosInstance.post(`/payments/${jobId}/pay`, { method });
    return res.data;
  },

  async processQris(jobId: string): Promise<{ success: boolean; payment_number?: string; total_payment?: number; already_completed?: boolean }> {
    const res = await axiosInstance.post(`/payments/${jobId}/qris`);
    return res.data;
  },

  async checkStatus(jobId: string): Promise<{ success: boolean; status: string }> {
    const res = await axiosInstance.post(`/payments/${jobId}/check`);
    return res.data;
  }
};
