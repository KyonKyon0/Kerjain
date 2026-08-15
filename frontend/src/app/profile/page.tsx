"use client";

import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { useAuthStore } from "@/store/auth.store";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Save, 
  ArrowLeft, 
  PhoneCall, 
  Camera, 
  Trash2, 
  Sparkles,
  RefreshCw,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DynamicLoader } from "@/components/ui/DynamicLoader";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, role, setUser } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState<string>((user as any)?.gender || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || user?.avatarUrl || "");

  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Avatar presets according to gender
  const femaleSeeds = ["Luna", "Maya", "Zara", "Aria", "Sophie", "Chloe", "Emma", "Elena"];
  const maleSeeds = ["Felix", "Oliver", "Leo", "Kai", "Arthur", "Milo", "Noah", "David"];
  const avatarSeeds = gender === "FEMALE" ? femaleSeeds : (gender === "MALE" ? maleSeeds : [...femaleSeeds.slice(0, 4), ...maleSeeds.slice(0, 4)]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        if (res.data?.data) {
          const u = res.data.data;
          setName(u.name || "");
          setPhone(u.phone || "");
          setAddress(u.address || "");
          setEmail(u.email || "");
          setGender(u.gender || "");
          setAvatarUrl(u.avatar_url || "");
          setUser({ ...u });
        }
      } catch (error) {

        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  // Handle Photo File Upload & Compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Format file harus berupa gambar (JPG, PNG, WebP)");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Ukuran gambar maksimal 5MB");
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatarUrl(compressedDataUrl);
        setUploadingPhoto(false);
        toast.success("Foto profil dipilih! Klik 'Simpan Perubahan' untuk menerapkan.");
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (seed: string) => {
    const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
    setAvatarUrl(url);
    toast.success("Avatar karakter dipilih!");
  };

  const handleRandomizeAvatar = () => {
    const randomSeed = (gender === "FEMALE" ? "Girl_" : "Boy_") + Math.random().toString(36).substring(2, 8);
    const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${randomSeed}`;
    setAvatarUrl(url);
    toast.success("Avatar acak baru dihasilkan!");
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    toast.info("Foto profil direset ke inisial nama.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Nama lengkap tidak boleh kosong");
    }
    if (!phone.trim()) {
      return toast.error("Nomor telepon tidak boleh kosong");
    }

    setSaving(true);
    try {
      const res = await axiosInstance.put("/users/profile", {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        avatar_url: avatarUrl || null,
        gender: gender || "MALE"
      });

      if (res.data?.data) {
        const updated = res.data.data;
        setUser({ ...user, ...updated });
        toast.success("Profil, jenis kelamin & foto berhasil disimpan!");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleTestCall = () => {
    if (!phone || phone.trim() === "") {
      return toast.error("Masukkan nomor telepon terlebih dahulu");
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    window.location.href = `tel:${cleanPhone}`;
  };

  const currentDisplayAvatar = avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${name || "User"}`;

  return (
    <DashboardLayout>
      <PageContainer className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/account")} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SectionHeader 
            title="Profil Saya" 
            description="Kelola foto profil, jenis kelamin, kontak, dan alamat Anda."
          />
        </div>

        {loading ? (
          <div className="py-12 bg-card/60 backdrop-blur-sm border rounded-3xl">
            <DynamicLoader text="Memuat profil Anda" subtext="Menyiapkan informasi akun..." size="md" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Avatar Card with Interactive Photo Uploader */}
            <Card className="border shadow-sm overflow-hidden bg-card rounded-3xl">
              <div className="h-28 bg-gradient-to-r from-primary/25 via-emerald-500/15 to-teal-500/10" />
              
              <CardContent className="relative pt-0 pb-6 px-6 sm:px-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-14 mb-4">
                  
                  {/* Avatar with Camera Overlay Button */}
                  <div className="relative group">
                    <Avatar className="w-28 h-28 border-4 border-background shadow-xl ring-2 ring-primary/20">
                      <AvatarImage src={currentDisplayAvatar} className="object-cover" />
                      <AvatarFallback className="text-3xl font-extrabold bg-primary text-primary-foreground">
                        {name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Camera Change Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 hover:bg-emerald-600 transition-all border-2 border-background cursor-pointer"
                      title="Unggah Foto Baru"
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Name & Badges Header */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-extrabold text-foreground">{name || "Pengguna"}</h2>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                      <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {role === "consumer" ? "Konsumen" : "Mitra"}
                      </span>
                      
                      {/* Gender Badge */}
                      {gender && (
                        <span className={cn(
                          "px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1",
                          gender === "FEMALE" ? "bg-pink-500/10 text-pink-600 dark:text-pink-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        )}>
                          <span>{gender === "FEMALE" ? "👩 Wanita" : "👨 Pria"}</span>
                        </span>
                      )}

                      <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">

                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                      </span>
                    </div>
                  </div>

                  {/* Photo Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl font-bold text-xs h-9"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Ganti Foto
                    </Button>
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="rounded-xl font-bold text-xs h-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Avatar Preset Selector */}
                <div className="mt-4 pt-4 border-t border-border/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> Karakter Ilustrasi ({gender === "FEMALE" ? "Wanita" : "Pria"})
                    </span>
                    <button
                      type="button"
                      onClick={handleRandomizeAvatar}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Acak Baru
                    </button>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    {avatarSeeds.map((seed) => {
                      const presetUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
                      const isSelected = avatarUrl === presetUrl;

                      return (
                        <button
                          key={seed}
                          type="button"
                          onClick={() => handleSelectPresetAvatar(seed)}
                          className={`relative p-1 rounded-2xl border-2 transition-all shrink-0 hover:scale-105 ${
                            isSelected 
                              ? "border-primary bg-primary/10 shadow-md shadow-primary/20 scale-105" 
                              : "border-border/80 hover:border-primary/40 bg-muted/40"
                          }`}
                        >
                          <Avatar className="w-11 h-11">
                            <AvatarImage src={presetUrl} />
                            <AvatarFallback>{seed.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <Card className="border shadow-sm bg-card rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Informasi Kontak & Akun</CardTitle>
                <CardDescription>
                  Sesuaikan data diri dan jenis kelamin akun Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  
                  {/* SELEKTOR GENDER (Cewek Kiri, Cowok Kanan) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Jenis Kelamin (Wajib Pilih Satu)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender("FEMALE")}
                        className={cn(
                          "py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 transition-all font-extrabold text-sm cursor-pointer",
                          gender === "FEMALE"
                            ? "bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400 shadow-sm ring-2 ring-pink-500/20"
                            : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                        )}
                      >
                        <span className="text-xl">👩</span>
                        <span>Wanita</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGender("MALE")}
                        className={cn(
                          "py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 transition-all font-extrabold text-sm cursor-pointer",
                          gender === "MALE"
                            ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm ring-2 ring-blue-500/20"
                            : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                        )}
                      >
                        <span className="text-xl">👨</span>
                        <span>Pria</span>
                      </button>

                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="profile-name">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Lengkap Anda"
                        className="pl-10 h-12 rounded-2xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="profile-email">
                      Email (Akun)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="profile-email"
                        value={email}
                        disabled
                        className="pl-10 h-12 rounded-2xl bg-muted/50 cursor-not-allowed opacity-80"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Email terikat secara permanen pada akun.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold" htmlFor="profile-phone">
                        Nomor Telepon (WhatsApp / Seluler)
                      </label>
                      {phone && (
                        <button
                          type="button"
                          onClick={handleTestCall}
                          className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" /> Uji Buka Telepon
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className="pl-10 h-12 rounded-2xl font-mono text-base"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Nomor ini digunakan mitra/konsumen untuk menghubungi Anda via telepon atau WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="profile-address">
                      Alamat / Domisili
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="profile-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                        className="pl-10 h-12 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-2xl h-12 px-6 font-bold"
                      onClick={() => router.push("/dashboard/account")}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-2xl h-12 px-8 font-bold shadow-md shadow-primary/20 bg-primary hover:bg-emerald-600"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
