import { axiosInstance } from "@/lib/axios";
import { Job } from "@/types";

export const jobService = {
  async getMyJobs(): Promise<{ success: boolean; data: Job[] }> {
    const res = await axiosInstance.get("/jobs/my");
    return res.data;
  },

  async createJob(data: Record<string, unknown>): Promise<{ success: boolean; data: Job }> {
    const res = await axiosInstance.post("/jobs", data);
    return res.data;
  },

  async searchJobs(query: string = ""): Promise<{ success: boolean; data: Job[] }> {
    const res = await axiosInstance.get(`/jobs?search=${query}`);
    return res.data;
  },

  async getJob(id: string): Promise<{ success: boolean; data: Job }> {
    const res = await axiosInstance.get(`/jobs/${id}`);
    return res.data;
  },

  async acceptJob(id: string): Promise<{ success: boolean; message: string }> {
    const res = await axiosInstance.post(`/jobs/${id}/accept`);
    return res.data;
  },

  async startJob(id: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.patch(`/jobs/${id}/start`);
    return res.data;
  },

  async finishJob(id: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.patch(`/jobs/${id}/finish`);
    return res.data;
  },

  async confirmJob(id: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.patch(`/jobs/${id}/confirm`);
    return res.data;
  },

  async reviseJob(id: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.patch(`/jobs/${id}/revise`);
    return res.data;
  },

  async cancelJob(id: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.patch(`/jobs/${id}/cancel`);
    return res.data;
  },

  async updateJobStatus(id: string, newStatus: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.patch(`/jobs/${id}/status`, { status: newStatus });
    return res.data;
  },

  async addProgress(id: string, data: { status: string; note?: string; photoUrl?: string }): Promise<{ success: boolean }> {
    const res = await axiosInstance.post(`/jobs/${id}/progress`, data);
    return res.data;
  },

  async getTimeline(id: string): Promise<{ success: boolean; data: Record<string, unknown>[] }> {
    const res = await axiosInstance.get(`/jobs/${id}/timeline`);
    return res.data;
  },

  async getPartnerJobs(): Promise<{ success: boolean; data: Job[] }> {
    const res = await axiosInstance.get("/jobs/assigned");
    return res.data;
  },

  async getConsumerJobs(): Promise<{ success: boolean; data: Job[] }> {
    const res = await axiosInstance.get("/jobs/my");
    return res.data;
  }
};
