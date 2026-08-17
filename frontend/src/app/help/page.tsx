"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronDown, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase, 
  Zap, 
  UserCheck,
  CreditCard,
  Headphones,
  Scale
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SECURITY_PILLARS = [
  {
    icon: Lock,
    title: "Sistem Rekber Escrow Aman",
    badge: "100% Garansi Uang",
    description: "Dana pembayaran tersimpan aman di rekening bersama Kerjain dan HANYA dicairkan ke mitra setelah Anda memeriksa dan mengonfirmasi kepuasan hasil kerja.",
    iconColor: "text-emerald-400",
    bgGradient: "from-emerald-500/15 to-emerald-500/5",
    borderColor: "border-emerald-500/30"
  },
  {
    icon: UserCheck,
    title: "Mitra & Konsumen Terverifikasi",
    badge: "Identitas Resmi",
    description: "Setiap pengguna dan mitra kerja melewati verifikasi kontak dan identitas resmi untuk menjamin transparansi, integritas, dan kenyamanan bertransaksi.",
    iconColor: "text-blue-400",
    bgGradient: "from-blue-500/15 to-blue-500/5",
    borderColor: "border-blue-500/30"
  },
  {
    icon: ShieldCheck,
    title: "Privasi & Enkripsi Data",
    badge: "Anti Bocor",
    description: "Seluruh riwayat obrolan pesan, titik koordinat, dan detail transaksi dilindungi protokol enkripsi modern untuk menjaga kerahasiaan data pribadi Anda.",
    iconColor: "text-purple-400",
    bgGradient: "from-purple-500/15 to-purple-500/5",
    borderColor: "border-purple-500/30"
  },
  {
    icon: Scale,
    title: "Mediasi Adil & CS 24/7",
    badge: "Bantuan Cepat",
    description: "Jika hasil kerja belum sesuai harapan atau terjadi kesalahpahaman, tim dukungan kami siap memediasi secara adil serta menyediakan opsi revisi.",
    iconColor: "text-amber-400",
    bgGradient: "from-amber-500/15 to-amber-500/5",
    borderColor: "border-amber-500/30"
  }
];

const FAQS = [
  {
    category: "Pemberi Kerja (Konsumen)",
    icon: UserCheck,
    items: [
      {
        q: "Bagaimana cara membuat order pekerjaan baru?",
        a: "Buka menu 'Buat Pekerjaan' di navigasi, lengkapi judul, detail tugas, kategori, lokasi alamat, dan nominal imbalan. Setelah dipublikasikan, orderan akan langsung disiarkan ke radar mitra terdekat."
      },
      {
        q: "Apakah uang saya aman jika mitra tidak datang?",
        a: "Sangat aman! Dana Anda ditampung di sistem Rekber Kerjain. Jika mitra membatalkan atau tidak hadir, dana akan dikembalikan utuh ke saldo Anda secara otomatis."
      },
      {
        q: "Bagaimana cara berkomunikasi dengan mitra?",
        a: "Setelah mitra menerima pekerjaan, Anda dapat menggunakan fitur Live Chat langsung di dalam aplikasi atau melakukan panggilan telepon via tombol kontak di halaman detail order."
      }
    ]
  },
  {
    category: "Mitra Pekerja",
    icon: Briefcase,
    items: [
      {
        q: "Bagaimana cara mengambil pekerjaan di sekitar saya?",
        a: "Buka menu 'Cari Job', aktifkan toggle radar petir 'Mitra Aktif', lalu pilih pekerjaan yang sesuai. Tekan tombol 'Ambil' dan konfirmasi kesiapan Anda untuk mulai menuju lokasi."
      },
      {
        q: "Kapan imbalan hasil kerja masuk ke dompet saya?",
        a: "Setelah Anda menyelesaikan pekerjaan dan konsumen menekan tombol konfirmasi, imbalan akan langsung masuk seketika ke saldo dompet digital Kerjain Anda."
      },
      {
        q: "Berapa batas minimal penarikan dana ke rekening?",
        a: "Batas minimal penarikan dana adalah Rp 10.000 ke seluruh rekening bank dan e-wallet di Indonesia tanpa potongan biaya tersembunyi."
      }
    ]
  },
  {
    category: "Keamanan, Pembayaran & Garansi",
    icon: ShieldCheck,
    items: [
      {
        q: "Bagaimana cara kerja sistem garansi keamanan Kerjain?",
        a: "Kerjain memberlakukan protokol perlindungan ganda: pembayaran diamankan di escrow, mitra mengunggah foto progres nyata dari lokasi, dan dana baru dicairkan setelah kedua pihak sepakat pekerjaan selesai."
      },
      {
        q: "Apa yang harus saya lakukan jika pekerjaan bermasalah?",
        a: "Anda dapat meminta revisi langsung kepada mitra melalui timeline order, atau menekan tombol 'Bantuan CS' untuk dimediasi oleh tim operasional kami 24/7."
      }
    ]
  }
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true, "2-0": true });

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaqs = FAQS.map((cat, catIdx) => {
    const isCatMatch = activeCategory === "ALL" || cat.category.toLowerCase().includes(activeCategory.toLowerCase());
    if (!isCatMatch) return null;

    const matchingItems = cat.items.filter(
      item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
              item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingItems.length === 0) return null;
    return { ...cat, originalIdx: catIdx, items: matchingItems };
  }).filter(Boolean) as Array<typeof FAQS[0] & { originalIdx: number }>;

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl space-y-6 pb-24 overflow-x-clip">
        
        {/* Header Compact */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Pusat Bantuan & Keamanan</h1>
            <p className="text-muted-foreground text-xs font-medium">Informasi layanan, garansi perlindungan, dan dukungan pelanggan 24/7</p>
          </div>
        </div>

        {/* 1. ANIMATED SECURITY & ESCROW GUARANTEE BANNER (TAMENG & GEMBOK) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Animated Shield & Lock Hologram Icon */}
            <div className="relative shrink-0 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-24 h-24 rounded-3xl bg-emerald-500/20 blur-md"
              />
              
              {/* Shield Base Container */}
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-card to-emerald-950/40 border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/30 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                
                {/* Floating Padlock Badge */}
                <motion.div 
                  animate={{ y: [-2, 2, -2], rotate: [-2, 2, -2] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-card border border-emerald-500/50 shadow-md flex items-center justify-center text-emerald-400"
                >
                  <Lock className="w-4 h-4" />
                </motion.div>
              </div>
            </div>

            {/* Guarantee Explanation Content */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Anda 100% Dilindungi di Kerjain</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Keamanan Berlapis & Garansi Transaksi Nyata
              </h2>
              
              <p className="text-muted-foreground text-xs leading-relaxed max-w-2xl font-medium">
                Platform Kerjain dirancang dengan standar keamanan fintech modern. Dana konsumen dan imbalan mitra diamankan secara otomatis oleh sistem rekening bersama (*Escrow*) hingga pekerjaan tuntas diverifikasi tanpa rasa khawatir.
              </p>
            </div>
          </div>

          {/* 4 Security Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 pt-6 border-t border-border/70">
            {SECURITY_PILLARS.map((pillar, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -2 }}
                className={cn(
                  "p-4 rounded-2xl border bg-gradient-to-br transition-all flex items-start gap-3.5",
                  pillar.bgGradient,
                  pillar.borderColor
                )}
              >
                <div className="p-2 rounded-xl bg-card/80 border border-border/80 shrink-0 mt-0.5 shadow-2xs">
                  <pillar.icon className={cn("w-4 h-4", pillar.iconColor)} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-foreground">{pillar.title}</h3>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                      {pillar.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 2. SEARCH & QUICK TOPIC FILTER */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari solusi kendala (contoh: escrow, garansi, bayar QRIS, tarik saldo)..."
              className="pl-11 h-13 bg-card border-border/80 text-foreground rounded-2xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-primary/20 shadow-2xs"
            />
          </div>

          {/* Topic Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar text-xs">
            {[
              { id: "ALL", label: "Semua Topik" },
              { id: "Konsumen", label: "Pemberi Kerja" },
              { id: "Mitra", label: "Mitra Kerja" },
              { id: "Keamanan", label: "Keamanan & Garansi" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={cn(
                  "px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] whitespace-nowrap transition-all cursor-pointer border",
                  activeCategory === tab.id
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-card/70 border-border/80 text-muted-foreground hover:bg-muted/70"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. DIRECT CS CONTACT CHANNELS (24/7 ASSISTANCE) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <a 
            href="https://wa.me/6281234567890?text=Halo%20Kerjain%20Support%2C%20saya%20butuh%20bantuan%20seputar%20pesanan%20saya."
            target="_blank" 
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="hover:border-emerald-500/40 hover:shadow-md transition-all h-full bg-card/90 border-border/80 rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">WhatsApp CS</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Respon instan 24 Jam</p>
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="tel:+6281234567890" className="group block">
            <Card className="hover:border-blue-500/40 hover:shadow-md transition-all h-full bg-card/90 border-border/80 rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">Hotline Darurat</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Bantuan cepat via suara</p>
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="mailto:support@kerjain.id" className="group block">
            <Card className="hover:border-purple-500/40 hover:shadow-md transition-all h-full bg-card/90 border-border/80 rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">Email Bantuan</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">support@kerjain.id</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* 4. EXPANDABLE FAQ ACCORDION */}
        <div className="space-y-6 pt-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Jawaban cepat seputar cara kerja, transaksi, dan penanganan pesanan
            </p>
          </div>

          {filteredFaqs.map((cat) => (
            <div key={cat.originalIdx} className="space-y-2.5">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                <cat.icon className="w-4 h-4" />
                <span>{cat.category}</span>
              </div>

              <div className="space-y-2">
                {cat.items.map((item, itemIdx) => {
                  const key = `${cat.originalIdx}-${itemIdx}`;
                  const isOpen = openItems[key];
                  return (
                    <Card key={itemIdx} className="overflow-hidden border border-border/80 bg-card rounded-2xl shadow-2xs transition-all">
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 flex items-center justify-between text-left font-bold text-xs sm:text-sm hover:bg-muted/40 transition-colors outline-none cursor-pointer"
                      >
                        <span className="text-foreground font-extrabold">{item.q}</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-3",
                          isOpen && "rotate-180 text-primary"
                        )} />
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="px-4 pb-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40 mt-1 pt-2.5 font-medium">
                              {item.a}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-card rounded-3xl border border-border/80">
              <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="font-bold text-xs text-foreground">Tidak ada topik yang sesuai dengan pencarian Anda</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Coba gunakan kata kunci lain atau hubungi WhatsApp CS kami secara langsung.</p>
            </div>
          )}
        </div>

      </PageContainer>
    </DashboardLayout>
  );
}
