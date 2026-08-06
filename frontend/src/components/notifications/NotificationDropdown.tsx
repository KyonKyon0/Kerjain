"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types";
import { NotificationCard } from "./NotificationCard";
import Link from "next/link";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = React.useCallback(async () => {
    const { data } = await notificationService.getNotifications();
    setNotifications(data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationService.markAsRead();
    fetchNotifs();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative p-2 text-muted-foreground hover:bg-muted/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none border-none">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white shadow-sm ring-2 ring-background animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          <span className="text-base font-bold p-0">Notifikasi</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10">
              <Check className="w-3 h-3 mr-1" /> Tandai Terbaca
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm">Belum ada notifikasi baru</p>
            </div>
          ) : (
            notifications.slice(0, 5).map(notif => (
              <NotificationCard 
                key={notif.id} 
                notification={notif} 
                onClick={() => {
                  if (!notif.read) notificationService.markAsRead(notif.id);
                  setIsOpen(false);
                }} 
              />
            ))
          )}
        </div>

        <div className="p-2 border-t bg-muted/10">
          <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full text-sm font-medium text-primary hover:bg-primary/5">
              Lihat Semua Notifikasi
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

