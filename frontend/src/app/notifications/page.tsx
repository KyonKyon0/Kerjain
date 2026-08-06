"use client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader title="Notifikasi" description="Pusat pemberitahuan Anda." />
        <EmptyState 
          icon={<Bell className="w-12 h-12" />}
          title="Belum Ada Notifikasi"
          description="Anda akan menerima pemberitahuan di sini ketika ada aktivitas baru."
        />
      </PageContainer>
    </DashboardLayout>
  );
}
