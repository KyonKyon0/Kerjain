"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export default function ChooseRolePage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<"consumer" | "partner" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error("Pilih salah satu peran untuk melanjutkan.");
      return;
    }
    
    setIsLoading(true);
    const pendingDataStr = sessionStorage.getItem("pendingRegistration");
    if (!pendingDataStr) {
      toast.error("Data registrasi tidak ditemukan. Silakan daftar ulang.");
      router.push("/register");
      return;
    }
    
    try {
      const data = JSON.parse(pendingDataStr);
      data.role = selectedRole;
      
      const res = await authService.register(data);
      if (res.success) {
        const loginRes = await authService.login({ email: data.email, password: data.password });
        if (loginRes.data?.user && loginRes.data?.token) {
          login(loginRes.data.user, loginRes.data.token, loginRes.data.user.role as any);
        }
      }
      toast.success(`Berhasil mendaftar sebagai ${selectedRole === "consumer" ? "Konsumen" : "Mitra"}!`);
      sessionStorage.removeItem("pendingRegistration");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan peran");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-primary/5 py-12">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pilih Peran Anda</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Beri tahu kami bagaimana Anda ingin menggunakan Kerjain agar kami dapat menyesuaikan pengalaman Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setSelectedRole("consumer")}
            disabled={isLoading}
            className={cn(
              "text-left flex flex-col justify-between rounded-3xl border-2 p-6 transition-all hover:bg-white hover:shadow-lg cursor-pointer group h-full",
              selectedRole === "consumer" ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-white shadow-sm"
            )}
          >
            <div>
              <div className={cn(
                "inline-flex p-4 rounded-2xl mb-4 transition-colors",
                selectedRole === "consumer" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}>
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Saya Butuh Bantuan</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Buat pekerjaan, temukan Mitra terpercaya di sekitar Anda, dan berikan mereka imbalan yang sesuai.
              </p>
            </div>
            <div className="mt-6 font-medium text-sm text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Pilih sebagai Konsumen <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("partner")}
            disabled={isLoading}
            className={cn(
              "text-left flex flex-col justify-between rounded-3xl border-2 p-6 transition-all hover:bg-white hover:shadow-lg cursor-pointer group h-full",
              selectedRole === "partner" ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-white shadow-sm"
            )}
          >
            <div>
              <div className={cn(
                "inline-flex p-4 rounded-2xl mb-4 transition-colors",
                selectedRole === "partner" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}>
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Saya Ingin Membantu</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Jadilah Mitra, temukan pekerjaan di sekitar Anda, bantu tetangga, dan dapatkan penghasilan tambahan.
              </p>
            </div>
            <div className="mt-6 font-medium text-sm text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Pilih sebagai Mitra <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            size="lg" 
            className="w-full max-w-sm h-12 rounded-xl text-base shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
            disabled={!selectedRole || isLoading}
            onClick={handleContinue}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Menyiapkan akun...
              </>
            ) : (
              "Lanjutkan"
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
