"use client";

import { useCreateJobStore } from "@/store/create-job.store";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { ProgressStepper } from "@/components/jobs/ProgressStepper";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Step1Info } from "@/features/jobs/components/Step1Info";
import { Step2Category } from "@/features/jobs/components/Step2Category";
import { Step3Location } from "@/features/jobs/components/Step3Location";
import { Step4Reward } from "@/features/jobs/components/Step4Reward";
import { Step5Review } from "@/features/jobs/components/Step5Review";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Info Utama", "Kategori", "Lokasi", "Imbalan", "Review"];

export default function CreateJobPage() {
  const { currentStep } = useCreateJobStore();
  const { role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (role !== "consumer") {
      router.replace("/dashboard");
    }
  }, [role, router]);

  if (role !== "consumer") return null;

  return (
    <DashboardLayout>
      <PageContainer className="max-w-3xl pb-24 overflow-x-clip">
        <div className="mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1 text-foreground">
            Buat Pekerjaan Baru
          </h2>
          <p className="text-muted-foreground text-xs font-medium">
            Lengkapi formulir terpadu untuk menyiarkan kebutuhan Anda ke mitra terdekat
          </p>
        </div>

        <DashboardCard className="p-5 sm:p-7 bg-card/95 border border-border/80 rounded-3xl shadow-sm">
          <ProgressStepper currentStep={currentStep} steps={STEPS} />
          
          <div className="relative mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {currentStep === 1 && <Step1Info />}
                {currentStep === 2 && <Step2Category />}
                {currentStep === 3 && <Step3Location />}
                {currentStep === 4 && <Step4Reward />}
                {currentStep === 5 && <Step5Review />}
              </motion.div>
            </AnimatePresence>
          </div>
        </DashboardCard>
      </PageContainer>
    </DashboardLayout>
  );
}
