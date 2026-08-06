"use client";

import { useAuthStore } from "@/store/auth.store";
import { ConsumerDashboard } from "@/features/dashboard/ConsumerDashboard";
import { PartnerDashboard } from "@/features/dashboard/PartnerDashboard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { role } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Simulate initial loading for smooth transition
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {role === "consumer" ? <ConsumerDashboard /> : <PartnerDashboard />}
    </DashboardLayout>
  );
}
