"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const { data } = await notificationService.getNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAsRead();
    fetchNotifs();
  };

  const handleClearAll = async () => {
    await notificationService.clearAll();
    fetchNotifs();
  };

  return (
    <DashboardLayout>
      <PageContainer className="max-w-3xl">
        <SectionHeader 
          title="Notifikasi" 
          description="Semua pemberitahuan dan pembaruan penting untuk Anda."
          action={
            notifications.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="rounded-xl hidden sm:flex">
                  <Check className="w-4 h-4 mr-2" /> Tandai Terbaca
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearAll} className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-2 hidden sm:block" /> Bersihkan
                </Button>
              </div>
            )
          }
        />

        <div className="mt-6 bg-background rounded-2xl border overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState 
              icon={<Bell className="w-12 h-12" />}
              title="Belum ada notifikasi"
              description="Anda akan menerima pemberitahuan ketika ada pembaruan pada pekerjaan Anda."
            />
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <NotificationCard 
                  key={notif.id} 
                  notification={notif} 
                  onClick={() => !notif.read && notificationService.markAsRead(notif.id)} 
                />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}

