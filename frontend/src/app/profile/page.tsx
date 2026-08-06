"use client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Construction } from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader title="Profil Saya" description="Kelola informasi pribadi Anda." />
        <EmptyState 
          icon={<Construction className="w-12 h-12" />}
          title="Halaman Sedang Dibangun"
          description="Fitur Profil akan tersedia pada pengembangan tahap selanjutnya."
        />
      </PageContainer>
    </DashboardLayout>
  );
}
