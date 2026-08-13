"use client";

import React, { useEffect, useState, useRef } from "react";
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

export default function ChatRoomPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = React.use(params);
  
  if (jobId === "[object Object]") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
  }
  
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

  const previousMessagesLengthRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (messages.length > previousMessagesLengthRef.current) {
      if (scrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
        // User is considered "near bottom" if they are within 150px of the bottom
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 150;
        
        // Auto scroll ONLY if:
        // 1. It's the very first time messages load
        // 2. OR user is already near the bottom (reading the latest chat)
        if (isFirstLoadRef.current || isNearBottom) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: isFirstLoadRef.current ? "auto" : "smooth"
          });
        }
      }
      previousMessagesLengthRef.current = messages.length;
      isFirstLoadRef.current = false;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setSending(true);
    await messageService.sendMessage(jobId as string, content);
    
    // Force scroll to bottom immediately after user sends a message
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 100);

    // Auto Notif
    if (job) {
      const targetUserId = role === "consumer" 
        ? (job.partnerId || (job as any).partner_id) 
        : (job.consumerId || (job as any).consumer_id);
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

  const targetName = role === "consumer" 
    ? (job.partner?.name || job.partnerName || (job as any).partner_name || (job as any).partner?.name) 
    : (job.consumer?.name || job.consumerName || (job as any).consumer_name || (job as any).consumer?.name);
  const targetPhone = role === "consumer" ? (job.partner?.phone || job.partnerPhone) : (job.consumer?.phone || job.consumerPhone);
  const isJobActive = !["COMPLETED", "CANCELLED"].includes(job.status);

  return (
    <div className="flex-1 flex flex-col bg-muted/10 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/jobs/${job.id}`)} className="shrink-0 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${targetName}`} />
            <AvatarFallback>{targetName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm sm:text-base leading-none">{targetName || "Menunggu..."}</h3>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {targetPhone && (
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-primary/10 text-primary border-primary/20" onClick={() => window.location.href = `tel:${targetPhone}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </Button>
          )}
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl">
              <Info className="w-4 h-4 mr-2" /> Detail Pekerjaan
            </Button>
            <Button variant="outline" size="icon" className="sm:hidden rounded-full h-9 w-9">
              <Info className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-medium text-center border border-primary/20">
            Percakapan ini dilindungi. Jangan memberikan informasi sensitif.
          </div>
        </div>
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 opacity-50 space-y-2 mt-10">
            <span className="text-4xl">💬</span>
            <p className="text-sm font-medium">Belum ada pesan</p>
            <p className="text-xs">Mulai percakapan dengan {targetName}</p>
          </div>
        )}
        
        {messages.map((msg: any) => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            isMe={msg.senderId === user.id || msg.sender_id === user.id} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={cn("sticky bottom-0 bg-background border-t", !isJobActive && "opacity-50 pointer-events-none")}>
        {!isJobActive && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-xs font-bold px-4 py-1.5 rounded-full z-10 whitespace-nowrap shadow-md">
            Pekerjaan ini sudah {job.status === "COMPLETED" ? "Selesai" : "Dibatalkan"}. Chat dinonaktifkan.
          </div>
        )}
        <ChatInput onSendMessage={handleSendMessage} disabled={sending || !isJobActive} />
      </div>
    </div>
  );
}
