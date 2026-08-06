"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";

export default function WaitingPartnerPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <PageContainer className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
          <div className="relative bg-green-100 text-green-600 p-6 rounded-full shadow-lg">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight mb-4">Pekerjaan Berhasil Dipublikasikan!</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Pekerjaan Anda kini dapat dilihat oleh mitra di sekitar Anda. Kami akan memberi tahu Anda segera setelah ada mitra yang mengambilnya.
        </p>

        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl flex items-center gap-4 text-left max-w-md w-full mb-8">
          <Clock className="w-10 h-10 shrink-0 text-blue-500" />
          <div>
            <h4 className="font-bold">Status: Menunggu Mitra</h4>
            <p className="text-sm mt-1">Anda bisa bersantai sambil menunggu mitra merespons.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="rounded-xl px-8" onClick={() => router.push("/dashboard/jobs")}>
            Lihat Semua Pekerjaan
          </Button>
          <Button className="rounded-xl px-8 shadow-md" onClick={() => router.push("/dashboard")}>
            Kembali ke Dashboard
          </Button>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
