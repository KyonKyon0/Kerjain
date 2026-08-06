import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  role: z.enum(["consumer", "partner"], {
    errorMap: () => ({ message: "Pilih salah satu peran" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const chooseRoleSchema = z.object({
  role: z.enum(["consumer", "partner"], {
    errorMap: () => ({ message: "Pilih salah satu peran" }),
  }),
});

export type ChooseRoleFormData = z.infer<typeof chooseRoleSchema>;
