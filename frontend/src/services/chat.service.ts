import { messageService } from "./message.service";

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderRole?: "consumer" | "partner";
  text: string;
  createdAt: string;
}

export const chatService = {
  async getMessagesByJobId(jobId: string): Promise<ChatMessage[]> {
    const res = await messageService.getMessages(jobId);
    return (res.data || []).map((m: any) => ({
      id: m.id,
      jobId: m.jobId || m.job_id,
      senderId: m.senderId || m.sender_id,
      senderRole: m.sender?.role || "consumer",
      text: m.content,
      createdAt: m.createdAt || m.created_at
    }));
  },

  async sendMessage(jobId: string, text: string, senderRole: "consumer" | "partner"): Promise<ChatMessage> {
    await messageService.sendMessage(jobId, text);
    return {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: `${senderRole}-user`,
      senderRole,
      text,
      createdAt: new Date().toISOString(),
    };
  },
};

