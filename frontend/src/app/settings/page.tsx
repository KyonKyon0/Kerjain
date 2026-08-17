"use client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useLogout";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const { user, role } = useAuthStore();
  const logout = useLogout();

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader title="Pengaturan" description="Atur preferensi dan akun aplikasi Anda." />
        
        <div className="grid gap-6 mt-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Informasi Profil
              </CardTitle>
              <CardDescription>
                Informasi dasar akun Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                <p className="text-lg font-semibold">{user?.name || "Belum diatur"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nomor Telepon</p>
                <p className="text-base font-mono font-semibold text-primary">{user?.phone || "Belum didaftarkan"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{user?.email || "Belum diatur"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Peran (Role)</p>
                <p className="text-base capitalize font-medium px-2 py-1 bg-primary/10 text-primary w-fit rounded-md mt-1">
                  {role === 'consumer' ? 'Konsumen' : role === 'partner' ? 'Mitra' : 'Belum memilih'}
                </p>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => window.location.href = "/profile"}
                >
                  Ubah Data Profil & Nomor Telepon
                </Button>
              </div>
            </CardContent>
          </Card>


          <Card className="border-destructive/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-destructive">Keluar Akun</CardTitle>
              <CardDescription>
                Anda akan keluar dari sesi ini dan harus masuk kembali untuk mengakses dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto flex items-center gap-2"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                Keluar (Logout)
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground pt-2 font-medium">
            KerjaIn Platform • v3.170826.21.39
          </p>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
