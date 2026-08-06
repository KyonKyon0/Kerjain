import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/message.service";
import { toast } from "sonner";

export const useChatList = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await messageService.getChats();
      return res.data;
    },
  });
};

export const useMessages = (jobId: string) => {
  return useQuery({
    queryKey: ["messages", jobId],
    queryFn: async () => {
      const res = await messageService.getMessages(jobId);
      return res.data;
    },
    enabled: !!jobId,
    refetchInterval: 3000, // Polling for MVP realtime simulation
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, content }: { jobId: string; content: string }) => 
      messageService.sendMessage(jobId, content),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengirim pesan");
    },
  });
};
