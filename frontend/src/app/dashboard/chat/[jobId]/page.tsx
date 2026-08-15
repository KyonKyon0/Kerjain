"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { jobService } from "@/services/job.service";
import { messageService } from "@/services/message.service";
import { notificationService } from "@/services/notification.service";
import { Job, Message } from "@/types";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Info, Phone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DynamicLoader } from "@/components/ui/DynamicLoader";

export default function ChatRoomPage({ params }: { params: Promise<{ jobId: string }> }) {

  const resolvedParams = React.use(params);
  const jobId = resolvedParams?.jobId;
  
  const router = useRouter();
  const { user, role } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const fetchRoomData = async () => {
    if (!jobId || jobId === "[object Object]") return;
    try {
      const [{ data: jobData }, { data: msgData }] = await Promise.all([
        jobService.getJob(jobId as string),
        messageService.getMessages(jobId as string)
      ]);
      
      if (jobData) setJob(jobData);
      if (Array.isArray(msgData)) setMessages(msgData);
      
      // Auto mark as read
      messageService.markAsRead(jobId as string).catch(() => {});
      initialLoadDone.current = true;
    } catch (e: any) {
      // Only redirect on first load if job really doesn't exist
      if (!initialLoadDone.current) {
        console.error("Failed to load chat room data:", e);
        toast.error("Gagal memuat percakapan");
        router.push("/dashboard/chat");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId || jobId === "[object Object]") {
      router.push("/dashboard");
      return;
    }
    fetchRoomData();
    const interval = setInterval(fetchRoomData, 2500); // 2.5s polling
    return () => clearInterval(interval);
  }, [jobId]);

  const previousMessagesLengthRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (messages.length > previousMessagesLengthRef.current) {
      if (scrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 150;
        
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
    if (!content.trim()) return;
    setSending(true);
    try {
      await messageService.sendMessage(jobId as string, content);
      
      // Force scroll to bottom
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
            title: `Pesan Baru dari ${user?.name || "Pengguna"}`,
            description: content,
            type: "NEW_MESSAGE",
            link: `/dashboard/chat/${job.id}`,
          }).catch(() => {});
        }
      }
      
      await fetchRoomData();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  const handleCall = (phoneNumber?: string | null) => {

    if (!phoneNumber || phoneNumber.trim() === "") {
      toast.error("Nomor telepon lawan bicara belum didaftarkan.");
      return;
    }
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
    window.location.href = `tel:${cleanPhone}`;
  };

  if (loading && !job) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <DynamicLoader text="Memuat percakapan" subtext="Menghubungkan ke ruang chat..." size="md" />
      </div>
    );
  }


  if (!job) return null;

  const targetName = role === "consumer" 
    ? (job.partner?.name || job.partnerName || (job as any).partner_name || "Mitra") 
    : (job.consumer?.name || job.consumerName || (job as any).consumer_name || "Konsumen");
  const targetPhone = role === "consumer" 
    ? (job.partner?.phone || job.partnerPhone || (job as any).partner_phone) 
    : (job.consumer?.phone || job.consumerPhone || (job as any).consumer_phone);
  const isJobActive = !["COMPLETED", "CANCELLED"].includes(job.status);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/chat");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/10 min-h-[calc(100vh-4rem)] relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <Avatar className="w-10 h-10 border">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${targetName}`} />
            <AvatarFallback>{targetName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm sm:text-base leading-none">{targetName}</h3>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[180px] sm:max-w-xs">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-9 w-9 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors" 
            onClick={() => handleCall(targetPhone)}
            title="Hubungi lewat Telepon"
          >
            <Phone className="w-4 h-4" />
          </Button>
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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-medium text-center border border-primary/20">
            Percakapan dilindungi oleh sistem Kerjain.
          </div>
        </div>
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 opacity-60 space-y-2 mt-10">
            <span className="text-4xl">💬</span>
            <p className="text-sm font-semibold">Belum ada pesan</p>
            <p className="text-xs text-muted-foreground">Mulai percakapan dengan {targetName} sekarang</p>
          </div>
        )}
        
        {messages.map((msg: any) => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            isMe={msg.senderId === user?.id || msg.sender_id === user?.id} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={cn("sticky bottom-0 bg-background border-t p-2 md:p-4", !isJobActive && "opacity-60")}>
        {!isJobActive && (
          <div className="mb-2 text-center bg-muted text-muted-foreground text-xs font-medium py-1.5 px-3 rounded-lg border">
            Pekerjaan ini berstatus <strong>{job.status === "COMPLETED" ? "Selesai" : "Dibatalkan"}</strong>. Riwayat obrolan tersimpan.
          </div>
        )}
        <ChatInput onSendMessage={handleSendMessage} disabled={sending || !isJobActive} />
      </div>
    </div>
  );
}

