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
  CreditCard, 
  Briefcase, 
  Zap, 
  UserCheck 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    category: "Pemberi Kerja (Konsumen)",
    icon: UserCheck,
    items: [
      {
        q: "Bagaimana cara membuat order pekerjaan baru?",
        a: "Buka menu 'Buat Pekerjaan' di sidebar atau navigasi bawah, isi judul, rincian pekerjaan, kategori, alamat lokasi, dan nominal imbalan. Setelah dikonfirmasi, pekerjaan akan langsung muncul di radar mitra terdekat."
      },
      {
        q: "Bagaimana cara menghubungi mitra yang mengambil pekerjaan?",
        a: "Setelah mitra menerima pekerjaan, Anda dapat membuka halaman detail pekerjaan lalu menekan tombol 'Chat' untuk berkirim pesan atau tombol 'Telepon' untuk menghubungi mitra secara langsung via panggilan telepon."
      },
      {
        q: "Kapan saya harus melakukan pembayaran?",
        a: "Jika menggunakan QRIS, pembayaran dilakukan di awal saat penerbitan atau penyelesaian dan ditahan oleh sistem Kerjain demi keamanan. Dana baru dilepaskan ke mitra setelah Anda mengonfirmasi pekerjaan telah selesai dengan baik."
      }
    ]
  },
  {
    category: "Mitra Pekerja",
    icon: Briefcase,
    items: [
      {
        q: "Bagaimana cara mengambil pekerjaan yang tersedia?",
        a: "Masuk ke menu 'Cari Job' di dashboard mitra, pilih pekerjaan yang sesuai dengan keahlian dan lokasi Anda, lalu klik 'Ambil' dan konfirmasi persetujuan untuk mulai bekerja."
      },
      {
        q: "Kapan saldo imbalan masuk ke akun saya?",
        a: "Saldo imbalan QRIS akan otomatis masuk ke dompet Kerjain Anda begitu konsumen mengonfirmasi penyelesaian pekerjaan."
      },
      {
        q: "Bagaimana cara melakukan penarikan dana (Withdrawal)?",
        a: "Buka menu 'Keuangan', masukkan nominal penarikan (minimal Rp 10.000), nama bank/e-wallet, serta nomor rekening Anda. Penarikan akan diproses dengan aman ke rekening tujuan Anda."
      }
    ]
  },
  {
    category: "Keamanan & Pembayaran",
    icon: ShieldCheck,
    items: [
      {
        q: "Apakah transaksi di Kerjain aman?",
        a: "Ya, 100% aman! Kerjain menggunakan sistem escrow garansi di mana dana konsumen disimpan dengan aman dan hanya dicairkan kepada mitra jika pekerjaan telah diselesaikan sesuai kesepakatan."
      },
      {
        q: "Bagaimana jika pekerjaan tidak sesuai atau ada kendala?",
        a: "Konsumen berhak menekan tombol 'Minta Revisi' pada halaman konfirmasi pekerjaan atau menghubungi layanan bantuan CS jika terjadi ketidaksesuaian."
      }
    ]
  }
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true });

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaqs = FAQS.map(cat => {
    const matchingItems = cat.items.filter(
      item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
              item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, items: matchingItems };
  }).filter(cat => cat.items.length > 0);

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Pusat Bantuan</h1>
            <p className="text-muted-foreground text-sm">Temukan jawaban atau hubungi layanan pelanggan kami 24/7.</p>
          </div>
        </div>

        {/* Hero Search & Support Banner */}
        <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Ada yang bisa kami bantu?</h2>
            <p className="opacity-90 text-sm mb-6">Cari solusi cepat seputar order, pembayaran, atau akun Anda.</p>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ketik kata kunci (contoh: pembayaran, telepon, tarik dana)..."
                className="pl-12 h-14 bg-white text-foreground rounded-2xl shadow-md border-0 text-base"
              />
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-15 hidden sm:block">
            <HelpCircle className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Direct Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <a 
            href="https://wa.me/6281234567890?text=Halo%20Kerjain%20Support%2C%20saya%20butuh%20bantuan."
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">WhatsApp CS</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Respon cepat via chat</p>
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="tel:+6281234567890" className="group">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Hotline Telepon</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">0812-3456-7890</p>
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="mailto:support@kerjain.id" className="group">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Email Bantuan</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">support@kerjain.id</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold tracking-tight">Pertanyaan yang Sering Diajukan (FAQ)</h2>

          {filteredFaqs.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <cat.icon className="w-5 h-5" />
                <h3>{cat.category}</h3>
              </div>

              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = openItems[key];
                  return (
                    <Card key={itemIdx} className="overflow-hidden border shadow-sm transition-colors">
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base hover:bg-muted/40 transition-colors outline-none cursor-pointer"
                      >
                        <span>{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0 ml-4 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="px-4 sm:px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1 pt-3">
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
            <div className="text-center py-12 bg-card rounded-3xl border">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="font-bold text-foreground">Tidak ada hasil yang cocok</p>
              <p className="text-sm text-muted-foreground mt-1">Coba gunakan kata kunci lain atau hubungi CS kami secara langsung.</p>
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
