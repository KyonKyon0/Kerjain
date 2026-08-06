export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderRole: "consumer" | "partner";
  text: string;
  createdAt: string;
}



export const chatService = {
  messages: {} as Record<string, ChatMessage[]>,

  async getMessagesByJobId(jobId: string): Promise<ChatMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.messages[jobId] || [];
  },

  async sendMessage(jobId: string, text: string, senderRole: "consumer" | "partner"): Promise<ChatMessage> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const newMessage: ChatMessage = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      jobId,
      senderId: `${senderRole}-mock-id`,
      senderRole,
      text,
      createdAt: new Date().toISOString(),
    };

    if (!this.messages[jobId]) {
      this.messages[jobId] = [];
    }
    
    this.messages[jobId] = [...this.messages[jobId], newMessage];
    return newMessage;
  },
};
