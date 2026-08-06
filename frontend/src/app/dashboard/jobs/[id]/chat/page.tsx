"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

import { chatService, ChatMessage } from "@/services/chat.service";
import { useAuthStore } from "@/store/auth.store";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const params = useParams();
  const role = useAuthStore((state) => state.role);
  const jobId = params.id as string;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessagesByJobId(jobId);
        setMessages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [jobId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      const newMsg = await chatService.sendMessage(
        jobId, 
        inputText.trim(), 
        role || "consumer"
      );
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;
  }

  const activeRole = role || "consumer";

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link href={`/dashboard/jobs/${jobId}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Obrolan</h1>
          <p className="text-sm text-muted-foreground">Koordinasi pekerjaan</p>
        </div>
      </div>

      <Card className="flex flex-col flex-1 overflow-hidden shadow-sm border-border/60">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
              Belum ada pesan. Sapa mitra Anda sekarang!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderRole === activeRole;
              return (
                <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                  <div 
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                      isMe 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-muted text-foreground rounded-tl-sm border"
                    )}
                  >
                    <p>{msg.text}</p>
                    <span className={cn("text-[10px] mt-1 block opacity-70", isMe ? "text-right" : "text-left")}>
                      {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t bg-background shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              placeholder="Tulis pesan..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={sending || !inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
