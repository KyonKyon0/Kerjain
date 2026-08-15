"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types";
import { NotificationCard } from "./NotificationCard";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import Link from "next/link";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markRead.mutate(undefined);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative p-2 text-muted-foreground hover:bg-muted/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none border-none">
        <Bell className="w-5 h-5 text-foreground/80" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-extrabold text-white shadow-sm ring-2 ring-background animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 rounded-3xl overflow-hidden flex flex-col max-h-[85vh] bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-foreground">Notifikasi</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {unreadCount} Baru
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead} 
              disabled={markRead.isPending}
              className="h-8 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
            >
              <Check className="w-3.5 h-3.5 mr-1" /> Tandai Terbaca
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto max-h-[400px] divide-y divide-border/40">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
              <p className="text-xs">Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-muted/40 flex items-center justify-center mb-2 text-muted-foreground">
                <Bell className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs font-semibold">Belum ada notifikasi baru</p>
            </div>
          ) : (
            notifications.slice(0, 6).map((notif: Notification) => (
              <NotificationCard 
                key={notif.id} 
                notification={notif} 
                onClick={() => {
                  if (!notif.read) markRead.mutate(notif.id);
                  setIsOpen(false);
                }} 
              />
            ))
          )}
        </div>

        <div className="p-2 border-t border-border/60 bg-muted/10">
          <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 rounded-2xl h-10">
              Lihat Semua Notifikasi
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
