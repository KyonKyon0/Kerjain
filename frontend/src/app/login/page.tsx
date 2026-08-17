"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { loginSchema, LoginFormData } from "@/features/auth/schemas";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    }
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      login(response.data.user, response.data.token, response.data.user.role as "consumer" | "partner");
      toast.success("Login berhasil! Mengalihkan...");
      setSuccess(true);
      setTimeout(() => {
        if (response.data.user.role) {
          router.push("/dashboard");
        } else {
          router.push("/choose-role");
        }
      }, 1000);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Email atau password salah");
      setError(err.message || "Email atau password salah");
    }
  });

  const onSubmit = (data: LoginFormData) => {
    setError(null);
    loginMutation.mutate(data);
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
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 -mt-16 md:-mt-24">
          
          <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white shadow-sm rounded-2xl mb-4 text-primary">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Selamat Datang Kembali</h1>
          <p className="text-muted-foreground text-xs font-medium mt-1">Masuk untuk melanjutkan ke Kerjain</p>
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
                  Login berhasil!
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
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
                    disabled={loginMutation.isPending || success}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Kata Sandi
                  </label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9 h-11 transition-all duration-200 focus-visible:ring-primary/20 bg-muted/50 focus:bg-background"
                    {...register("password")}
                    disabled={loginMutation.isPending || success}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  {...register("rememberMe")}
                  disabled={loginMutation.isPending || success}
                />
                <label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Ingat saya
                </label>
              </div>

              <Button type="submit" className="w-full h-11 mt-4 rounded-xl text-base font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm" disabled={loginMutation.isPending || success}>
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : success ? (
                  "Berhasil Login!"
                ) : (
                  "Masuk Sekarang"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-muted/20 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                Daftar di sini
              </Link>
            </p>
          </CardFooter>
        </Card>
        </div>
      </main>
    </div>
  );
}
