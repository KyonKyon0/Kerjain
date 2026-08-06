import { axiosInstance } from "@/lib/axios";
import { Review } from "@/types";

export const reviewService = {
  async getReviews(jobId: string): Promise<{ success: boolean; data: Review[] }> {
    const res = await axiosInstance.get(`/reviews/${jobId}`);
    return res.data;
  },

  async submitReview(jobId: string, targetId: string, rating: number, comment?: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.post("/reviews", { jobId, targetId, rating, comment });
    return res.data;
  }
};
