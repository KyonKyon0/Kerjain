"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { jobService } from "@/services/job.service";
import { messageService } from "@/services/message.service";
import { notificationService } from "@/services/notification.service";
import { Job } from "@/types";
import { Message } from "@/types";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/jobs/StatusBadge";

export default function ChatRoomPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { user, role } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchRoomData = async () => {
    try {
      const [{ data: jobData }, { data: msgData }] = await Promise.all([
        jobService.getJob(jobId as string),
        messageService.getMessages(jobId as string)
      ]);
      setJob(jobData);
      setMessages(msgData);
      
      // Auto mark as read when fetching
      await messageService.markAsRead(jobId as string);
    } catch (e) {
      router.push("/dashboard/chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
    const interval = setInterval(fetchRoomData, 2000); // 2s polling
    return () => clearInterval(interval);
  }, [jobId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setSending(true);
    await messageService.sendMessage(jobId as string, content);
    
    // Auto Notif
    if (job) {
      const targetUserId = role === "consumer" ? job.partnerId : job.consumerId;
      if (targetUserId) {
        notificationService.sendNotification({
          userId: targetUserId,
          title: `Pesan Baru dari ${user?.name}`,
          description: content,
          type: "NEW_MESSAGE",
          link: `/dashboard/chat/${job.id}`,
        });
      }
    }
    
    await fetchRoomData();
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job || !user) return null;

  const partnerName = role === "consumer" ? job.partnerName : job.consumerName;
  const isJobActive = !["COMPLETED", "CANCELLED"].includes(job.status);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/10 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/chat")} className="shrink-0 -ml-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${partnerName}`} />
            <AvatarFallback>{partnerName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm sm:text-base leading-none">{partnerName}</h3>
            <div className="mt-1"><StatusBadge status={job.status} /></div>
          </div>
        </div>
        <Link href={`/dashboard/jobs/${job.id}`}>
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl">
            <Info className="w-4 h-4 mr-2" /> Detail Pekerjaan
          </Button>
          <Button variant="outline" size="icon" className="sm:hidden rounded-xl h-8 w-8">
            <Info className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-medium text-center border border-primary/20">
            Percakapan ini dilindungi. Jangan memberikan informasi sensitif.
          </div>
        </div>
        
        {messages.map(msg => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            isMe={msg.senderId === user.id} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={cn("transition-opacity", !isJobActive && "opacity-50 pointer-events-none")}>
        {!isJobActive && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-xs font-bold px-4 py-1.5 rounded-full z-10 whitespace-nowrap shadow-md">
            Pekerjaan ini sudah {job.status === "COMPLETED" ? "Selesai" : "Dibatalkan"}. Chat dinonaktifkan.
          </div>
        )}
        <ChatInput onSendMessage={handleSendMessage} disabled={sending || !isJobActive} />
      </div>
    </div>
  );
}
