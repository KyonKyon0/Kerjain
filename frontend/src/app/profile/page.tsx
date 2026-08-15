"use client";

import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { useAuthStore } from "@/store/auth.store";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Save, 
  ArrowLeft, 
  Camera, 
  Trash2, 
  Sparkles,
  RefreshCw,
  Upload,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DynamicLoader } from "@/components/ui/DynamicLoader";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ImageCropModal } from "@/components/profile/ImageCropModal";

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
  const [rawCropImage, setRawCropImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

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

  // Handle Photo File Upload & Open Crop Modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.dismiss();
      return toast.error("Format file harus berupa gambar (JPG, PNG, WebP)", { duration: 2500 });
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.dismiss();
      return toast.error("Ukuran gambar maksimal 10MB", { duration: 2500 });
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRawCropImage(event.target.result as string);
        setIsCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setAvatarUrl(croppedDataUrl);
    toast.dismiss();
    toast.success("Foto profil berhasil dipotong! Klik 'Simpan Perubahan' untuk menerapkan.", { duration: 2500 });
  };

  const handleSelectPresetAvatar = (seed: string) => {
    const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
    setAvatarUrl(url);
    toast.dismiss();
    toast.success("Avatar karakter dipilih!", { duration: 2000 });
  };

  const handleRandomizeAvatar = () => {
    const randomSeed = (gender === "FEMALE" ? "Girl_" : "Boy_") + Math.random().toString(36).substring(2, 8);
    const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${randomSeed}`;
    setAvatarUrl(url);
    toast.dismiss();
    toast.success("Avatar acak baru dihasilkan!", { duration: 2000 });
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    toast.dismiss();
    toast.info("Foto profil direset ke inisial nama.", { duration: 2000 });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.dismiss();
      return toast.error("Nama lengkap tidak boleh kosong", { duration: 2500 });
    }
    if (!phone.trim()) {
      toast.dismiss();
      return toast.error("Nomor telepon tidak boleh kosong", { duration: 2500 });
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
        toast.dismiss();
        toast.success("Profil berhasil diperbarui!", { duration: 2500 });
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Gagal memperbarui profil", { duration: 2500 });
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayAvatar = avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${name || "User"}`;

  return (
    <DashboardLayout>
      <PageContainer className="max-w-3xl space-y-6 pb-20">
        
        {/* Header Bar */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/dashboard/account")} 
            className="rounded-full hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Profil Saya</h1>
            <p className="text-xs text-muted-foreground">Kelola informasi pribadi, kontak, dan foto profil Anda</p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 bg-card/60 backdrop-blur-md border rounded-3xl">
            <DynamicLoader text="Memuat profil Anda" subtext="Menyiapkan data akun..." size="md" />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. Avatar & Photo Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="h-28 bg-gradient-to-r from-primary/30 via-emerald-500/20 to-teal-500/15" />
              
              <div className="relative pt-0 pb-6 px-6 sm:px-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-14 mb-4">
                  
                  {/* Circular Avatar */}
                  <div className="relative group shrink-0">
                    <Avatar className="w-28 h-28 border-4 border-background shadow-xl ring-2 ring-primary/20 bg-background">
                      <AvatarImage src={currentDisplayAvatar} className="object-cover" />
                      <AvatarFallback className="text-3xl font-black bg-primary text-primary-foreground">
                        {name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Camera Overlay Trigger */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 hover:bg-emerald-600 transition-all border-2 border-background cursor-pointer"
                      title="Ganti Foto Profil"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Name & Role Badges */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-black text-foreground">{name || "Pengguna"}</h2>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                      <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                        {role === "consumer" ? "Konsumen" : "Mitra"}
                      </span>
                      
                      {gender && (
                        <span className={cn(
                          "px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1",
                          gender === "FEMALE" 
                            ? "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400" 
                            : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                        )}>
                          <span>{gender === "FEMALE" ? "👩 Wanita" : "👨 Pria"}</span>
                        </span>
                      )}

                      <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
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
                      className="rounded-2xl font-extrabold text-xs h-10 px-4 border-border/80 hover:bg-muted"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Ganti Foto
                    </Button>
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="rounded-2xl font-bold text-xs h-10 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-4 h-4" />
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
                      <RefreshCw className="w-3.5 h-3.5" /> Acak Karakter
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
                          className={cn(
                            "relative p-1 rounded-2xl border-2 transition-all shrink-0 hover:scale-105",
                            isSelected 
                              ? "border-primary bg-primary/10 shadow-md shadow-primary/20 scale-105" 
                              : "border-border/80 hover:border-primary/40 bg-muted/40"
                          )}
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
              </div>
            </motion.div>

            {/* 2. Form Informasi Kontak & Akun (Modern, Animatif & Dinamis) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="bg-card border border-border/80 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6"
            >
              <div>
                <h3 className="text-lg font-black text-foreground">Informasi Akun & Kontak</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Perbarui data diri untuk mempermudah koordinasi layanan</p>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                
                {/* Selektor Gender */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Jenis Kelamin
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender("FEMALE")}
                      className={cn(
                        "py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-2.5 transition-all font-extrabold text-sm cursor-pointer shadow-xs",
                        gender === "FEMALE"
                          ? "bg-pink-500/15 border-pink-500 text-pink-600 dark:text-pink-400 shadow-sm ring-2 ring-pink-500/20"
                          : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      <span className="text-xl">👩</span>
                      <span>Wanita</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender("MALE")}
                      className={cn(
                        "py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-2.5 transition-all font-extrabold text-sm cursor-pointer shadow-xs",
                        gender === "MALE"
                          ? "bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm ring-2 ring-blue-500/20"
                          : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      <span className="text-xl">👨</span>
                      <span>Pria</span>
                    </motion.button>
                  </div>
                </div>

                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="profile-name">
                    Nama Lengkap
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-3.5 p-1 rounded-xl bg-primary/10 text-primary transition-colors group-focus-within:bg-primary group-focus-within:text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className="pl-12 h-14 rounded-2xl bg-muted/20 border-border/80 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="profile-email">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-3.5 p-1 rounded-xl bg-muted text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="profile-email"
                      value={email}
                      disabled
                      className="pl-12 h-14 rounded-2xl bg-muted/40 border-border/60 cursor-not-allowed opacity-80 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="profile-phone">
                    Nomor Telepon
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-3.5 p-1 rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-focus-within:bg-emerald-500 group-focus-within:text-white">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="pl-12 h-14 rounded-2xl bg-muted/20 border-border/80 focus:bg-background focus:ring-2 focus:ring-primary/20 font-mono text-base font-bold transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="profile-address">
                    Alamat
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-3.5 p-1 rounded-xl bg-amber-500/10 text-amber-600 transition-colors group-focus-within:bg-amber-500 group-focus-within:text-white">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <Input
                      id="profile-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                      className="pl-12 h-14 rounded-2xl bg-muted/20 border-border/80 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl h-14 px-6 font-bold text-sm"
                    onClick={() => router.push("/dashboard/account")}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-2xl h-14 px-8 font-extrabold text-sm shadow-md bg-primary hover:bg-emerald-600 text-white transition-all hover:scale-[1.01]"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Interactive Circular Image Crop Modal */}
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageSrc={rawCropImage}
          onCropComplete={handleCropComplete}
        />
      </PageContainer>
    </DashboardLayout>
  );
}
