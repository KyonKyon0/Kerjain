import { create } from "zustand";
import { CreateJobData } from "@/features/jobs/schemas";

interface CreateJobState {
  currentStep: number;
  draft: Partial<CreateJobData>;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: (data: Partial<CreateJobData>) => void;
  resetDraft: () => void;
}

const initialDraft: Partial<CreateJobData> = {
  title: "",
  description: "",
  category: "",
  address: "",
  lat: null,
  lng: null,
  rewardType: "FIXED",
  rewardAmount: null,
  paymentMethod: "QRIS",
};

export const useCreateJobStore = create<CreateJobState>((set) => ({
  currentStep: 1,
  draft: initialDraft,
  
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  updateDraft: (data) => set((state) => ({ draft: { ...state.draft, ...data } })),
  resetDraft: () => set({ draft: initialDraft, currentStep: 1 }),
}));
