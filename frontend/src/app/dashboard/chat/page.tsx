"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { messageService } from "@/services/message.service";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ChatListPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    const { data } = await messageService.getChats();
    setChats(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChats();
    const interval = setInterval(fetchChats, 2000); // 2s polling
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl">
        <SectionHeader 
          title="Pesan Anda" 
          description="Berkomunikasi dengan pengguna lain terkait pekerjaan yang sedang berjalan."
        />

        <div className="mt-6 bg-background rounded-2xl border overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <EmptyState 
              icon={<MessageSquare className="w-12 h-12" />}
              title="Belum Ada Pesan"
              description="Percakapan baru akan muncul setelah Anda atau mitra menyepakati sebuah pekerjaan."
            />
          ) : (
            <div className="flex flex-col">
              {chats.map((chat) => (
                <Link 
                  key={chat.jobId} 
                  href={`/dashboard/chat/${chat.jobId}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                >
                  <Avatar className="w-12 h-12 border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${chat.partnerName}`} />
                    <AvatarFallback>{chat.partnerName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className={cn("text-base font-semibold truncate", chat.unreadCount > 0 && "text-primary")}>
                        {chat.partnerName}
                      </h4>
                      <span className={cn("text-[10px] whitespace-nowrap ml-2", chat.unreadCount > 0 ? "text-primary font-bold" : "text-muted-foreground")}>
                        {new Date(chat.lastMessageTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={cn("text-sm truncate mr-4", chat.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 opacity-70 border border-muted-foreground/20 rounded px-1.5 py-0.5 inline-block">
                      {chat.jobTitle}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
