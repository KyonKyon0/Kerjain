import { z } from "zod";

export const step1InfoSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(100, "Judul maksimal 100 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

export const step2CategorySchema = z.object({
  category: z.string().min(1, "Kategori wajib dipilih"),
});

export const step3LocationSchema = z.object({
  address: z.string().min(10, "Alamat lengkap wajib diisi"),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export const step4RewardSchema = z.object({
  rewardType: z.enum(["FIXED", "FLEXIBLE"], {
    errorMap: () => ({ message: "Pilih tipe imbalan" })
  }),
  rewardAmount: z.number().optional().nullable(),
}).refine(
  (data) => {
    if (data.rewardType === "FIXED" && (!data.rewardAmount || data.rewardAmount <= 0)) {
      return false;
    }
    return true;
  },
  {
    message: "Nominal imbalan wajib diisi untuk tipe Pasti (Fixed)",
    path: ["rewardAmount"],
  }
);

// Gabungan untuk final review
export const createJobSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  address: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  rewardType: z.enum(["FIXED", "FLEXIBLE"]),
  rewardAmount: z.number().nullable().optional(),
});

export type Step1FormData = z.infer<typeof step1InfoSchema>;
export type Step2FormData = z.infer<typeof step2CategorySchema>;
export type Step3FormData = z.infer<typeof step3LocationSchema>;
export type Step4FormData = z.infer<typeof step4RewardSchema>;
export type CreateJobData = z.infer<typeof createJobSchema>;
