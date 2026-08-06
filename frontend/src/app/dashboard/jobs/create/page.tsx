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
      <PageContainer className="max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Buat Pekerjaan Baru</h2>
          <p className="text-muted-foreground">Isi detail kebutuhan Anda agar mitra yang tepat dapat segera membantu.</p>
        </div>

        <DashboardCard className="p-6 sm:p-8">
          <ProgressStepper currentStep={currentStep} steps={STEPS} />
          
          <div className="mt-8">
            {currentStep === 1 && <Step1Info />}
            {currentStep === 2 && <Step2Category />}
            {currentStep === 3 && <Step3Location />}
            {currentStep === 4 && <Step4Reward />}
            {currentStep === 5 && <Step5Review />}
          </div>
        </DashboardCard>
      </PageContainer>
    </DashboardLayout>
  );
}
