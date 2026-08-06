import { axiosInstance } from "@/lib/axios";
import { Message } from "@/types";

export const messageService = {
  async getChats(): Promise<{ success: boolean; data: Record<string, unknown>[] }> {
    const res = await axiosInstance.get("/messages/chats");
    return res.data;
  },

  async getMessages(jobId: string): Promise<{ success: boolean; data: Message[] }> {
    const res = await axiosInstance.get(`/messages/${jobId}`);
    return res.data;
  },

  async sendMessage(jobId: string, content: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.post(`/messages/${jobId}`, { content });
    return res.data;
  },

  async markAsRead(jobId: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.put(`/messages/${jobId}/read`);
    return res.data;
  },

  // This is usually handled in backend when status updates
  async sendSystemMessage(jobId: string, content: string): Promise<{ success: boolean }> {
    const res = await axiosInstance.post(`/messages/${jobId}/system`, { content });
    return res.data;
  }
};
