import { axiosInstance } from "@/lib/axios";
import { Notification } from "@/types";

export const notificationService = {
  async getNotifications(): Promise<{ success: boolean; data: Notification[] }> {
    const res = await axiosInstance.get("/notifications");
    return res.data;
  },

  async markAsRead(id?: string): Promise<{ success: boolean }> {
    const url = id ? `/notifications/${id}/read` : `/notifications/read-all`;
    const res = await axiosInstance.put(url);
    return res.data;
  },

  async clearAll(): Promise<{ success: boolean }> {
    const res = await axiosInstance.delete("/notifications");
    return res.data;
  },

  // Triggered by backend ideally, but we expose it if needed
  async sendNotification(data: Record<string, unknown>): Promise<{ success: boolean }> {
    const res = await axiosInstance.post("/notifications", data);
    return res.data;
  }
};
