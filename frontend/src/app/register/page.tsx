"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Phone,
  ShoppingBag,
  Bike,
  Sparkles,
  Check
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { registerSchema, RegisterFormData } from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "consumer",
      gender: "MALE"
    }
  });

  const selectedRole = watch("role");
  const selectedGender = watch("gender");

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: async (res, data) => {
      setSuccess(true);
      toast.success("Akun berhasil dibuat! Melakukan login otomatis...");
      try {
        const loginRes = await authService.login({ email: data.email, password: data.password });
        if (loginRes.data?.user && loginRes.data?.token) {
          login(loginRes.data.user, loginRes.data.token, loginRes.data.user.role as "consumer" | "partner");
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi kesalahan saat registrasi");
      setError(err.message || "Terjadi kesalahan saat registrasi");
    }
  });

  const onSubmit = (data: RegisterFormData) => {
    setError(null);
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen flex-col bg-primary/5">
      <header className="w-full max-w-7xl mx-auto p-4 md:p-8 flex justify-start">
        <Link 
          href="/"
          aria-label="Kembali ke Beranda"
          title="Kembali ke Beranda"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Kembali ke Beranda</span>
          <span className="sm:hidden">Beranda</span>
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-card border rounded-3xl shadow-sm mb-4 text-primary">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Daftar Akun Baru</h1>
            <p className="text-muted-foreground text-xs font-medium mt-1">Bergabunglah dengan ekosistem bantuan Kerjain</p>
          </div>


          <Card className="border shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/95 backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 text-center animate-in fade-in zoom-in-95 font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 text-sm text-emerald-600 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center animate-in fade-in zoom-in-95 font-bold">
                    Akun berhasil dibuat! Mengalihkan...
                  </div>
                )}
                
                {/* 1. SELEKTOR PERAN ANDA (Kiri: Konsumen, Kanan: Mitra) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Pilih Peran Anda
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("role", "consumer")}
                      className={cn(
                        "p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer relative overflow-hidden",
                        selectedRole === "consumer"
                          ? "bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20"
                          : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        selectedRole === "consumer" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      )}>
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-xs">Konsumen</span>
                      <span className="text-[10px] opacity-80">Mencari Bantuan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("role", "partner")}
                      className={cn(
                        "p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer relative overflow-hidden",
                        selectedRole === "partner"
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm ring-2 ring-emerald-500/20"
                          : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        selectedRole === "partner" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        <Bike className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-xs">Mitra Kerja</span>
                      <span className="text-[10px] opacity-80">Beri Bantuan & Cuan</span>
                    </button>
                  </div>
                </div>

                {/* 2. SELEKTOR GENDER (Kiri: Wanita, Kanan: Pria) */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Jenis Kelamin (Wajib Pilih)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("gender", "FEMALE")}
                      className={cn(
                        "py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 transition-all font-extrabold text-xs cursor-pointer",
                        selectedGender === "FEMALE"
                          ? "bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400 shadow-sm ring-2 ring-pink-500/20"
                          : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      <span className="text-lg">👩</span>
                      <span>Wanita</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("gender", "MALE")}
                      className={cn(
                        "py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 transition-all font-extrabold text-xs cursor-pointer",
                        selectedGender === "MALE"
                          ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm ring-2 ring-blue-500/20"
                          : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      <span className="text-lg">👨</span>
                      <span>Pria</span>
                    </button>

                  </div>
                </div>

                {/* Nama Lengkap */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="name">
                    Nama Lengkap
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="name"
                      placeholder="Nama Lengkap Anda"
                      className="pl-10 h-12 rounded-2xl transition-all bg-muted/40 focus:bg-background text-sm"
                      {...register("name")}
                      disabled={registerMutation.isPending || success}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                    Alamat Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-10 h-12 rounded-2xl transition-all bg-muted/40 focus:bg-background text-sm"
                      {...register("email")}
                      disabled={registerMutation.isPending || success}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="phone">
                    Nomor WhatsApp / Seluler
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="081234567890"
                      className="pl-10 h-12 rounded-2xl transition-all bg-muted/40 focus:bg-background text-sm"
                      {...register("phone")}
                      disabled={registerMutation.isPending || success}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
                  )}
                </div>

                {/* Kata Sandi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                    Kata Sandi
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      className="pl-10 h-12 rounded-2xl transition-all bg-muted/40 focus:bg-background text-sm"
                      {...register("password")}
                      disabled={registerMutation.isPending || success}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                  )}
                </div>

                {/* Konfirmasi Kata Sandi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="confirmPassword">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      type="password"
                      placeholder="Masukkan ulang kata sandi"
                      className="pl-10 h-12 rounded-2xl transition-all bg-muted/40 focus:bg-background text-sm"
                      {...register("confirmPassword")}
                      disabled={registerMutation.isPending || success}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-13 mt-6 rounded-2xl text-base font-extrabold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0" 
                  disabled={registerMutation.isPending || success}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mendaftarkan Akun...
                    </>
                  ) : success ? (
                    "Berhasil Mendaftar!"
                  ) : (
                    "Daftar Sekarang"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center p-5 bg-muted/20 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
