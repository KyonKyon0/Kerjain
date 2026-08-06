"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { registerSchema, RegisterFormData } from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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
          <div className="inline-flex items-center justify-center p-4 bg-white shadow-sm rounded-2xl mb-4 text-primary">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Daftar Akun Baru</h1>
          <p className="text-muted-foreground mt-2">Bergabunglah dengan komunitas Kerjain</p>
        </div>

        <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center animate-in fade-in zoom-in-95">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200 text-center animate-in fade-in zoom-in-95">
                  Akun berhasil dibuat! Mengalihkan...
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="name">
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder="Nama Lengkap"
                    className="pl-9 h-11 transition-all duration-200 focus-visible:ring-primary/20 bg-muted/50 focus:bg-background"
                    {...register("name")}
                    disabled={registerMutation.isPending || success}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-9 h-11 transition-all duration-200 focus-visible:ring-primary/20 bg-muted/50 focus:bg-background"
                    {...register("email")}
                    disabled={registerMutation.isPending || success}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="role">
                  Peran Anda
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={registerMutation.isPending || success}>
                      <SelectTrigger className="w-full h-11 transition-all duration-200 focus-visible:ring-primary/20 bg-muted/50 focus:bg-background">
                        <SelectValue placeholder="Pilih Konsumen atau Mitra" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consumer">Konsumen (Mencari Bantuan)</SelectItem>
                        <SelectItem value="partner">Mitra (Memberi Bantuan)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Kata Sandi
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    className="pl-9 h-11 transition-all duration-200 focus-visible:ring-primary/20 bg-muted/50 focus:bg-background"
                    {...register("password")}
                    disabled={registerMutation.isPending || success}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="password"
                    placeholder="Masukkan ulang kata sandi"
                    className="pl-9 h-11 transition-all duration-200 focus-visible:ring-primary/20 bg-muted/50 focus:bg-background"
                    {...register("confirmPassword")}
                    disabled={registerMutation.isPending || success}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 mt-6 rounded-xl text-base font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm" disabled={registerMutation.isPending || success}>
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : success ? (
                  "Berhasil Mendaftar!"
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-muted/20 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
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
