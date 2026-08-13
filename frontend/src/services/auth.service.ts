import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";

export const authService = {
  async login(data: Record<string, unknown>): Promise<{success: boolean; data: {user: User, token: string, role: "consumer" | "partner"}}> {
    const res = await axiosInstance.post("/auth/login", data);
    if (res.data && res.data.success === false) {
      throw new Error(res.data.detail || "Login gagal");
    }
    return res.data;
  },

  async register(data: Record<string, unknown>): Promise<{success: boolean; message: string; data?: unknown}> {
    const res = await axiosInstance.post("/auth/register", data);
    if (res.data && res.data.success === false) {
      throw new Error(res.data.detail || "Registrasi gagal");
    }
    return res.data;
  },

  async logout(): Promise<void> {
    // In JWT, logout is usually just deleting the token on client.
    // If backend has invalidation, we can call it here.
    return Promise.resolve();
  }
};
