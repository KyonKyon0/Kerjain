"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search, Star, Wrench, Zap, Home, ChevronRight, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-xl">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Kerjain</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#layanan" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Layanan</Link>
            <Link href="#cara-kerja" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cara Kerja</Link>
            <Link href="#mitra" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Gabung Mitra</Link>
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                Masuk
              </Link>
              <Link href="/register" className={buttonVariants({ variant: "default", size: "sm" })}>
                Daftar
              </Link>
            </div>
          </nav>
          <div className="md:hidden flex">
            <Link href="/login" className={buttonVariants({ variant: "default", size: "sm" })}>
              Masuk
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative px-4 pt-16 pb-24 md:pt-28 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 fill-primary" />
              <span>Layanan Terpercaya di Sekitarmu</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight"
            >
              Butuh bantuan? <br className="hidden md:block" />
              Biar <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Tetangga</span> yang Kerjain.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Platform jasa lokal terlengkap. Dari perbaikan rumah, bersih-bersih, hingga angkut barang. Pesan cepat, harga transparan, aman terpercaya.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto text-base h-14 px-8" })}>
                Cari Jasa Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/register?role=partner" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto text-base h-14 px-8 border-2" })}>
                Daftar Jadi Mitra
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Category Shortcuts */}
        <section id="layanan" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 max-w-4xl mx-auto">
              {[
                { name: "Perbaikan", icon: Wrench, color: "bg-blue-500" },
                { name: "Kebersihan", icon: Zap, color: "bg-emerald-500" },
                { name: "Pindahan", icon: Home, color: "bg-amber-500" },
                { name: "Listrik", icon: Zap, color: "bg-yellow-500" },
                { name: "Keamanan", icon: ShieldCheck, color: "bg-red-500" },
                { name: "Lainnya", icon: Search, color: "bg-purple-500" },
              ].map((cat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 ${cat.color}`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center">{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="cara-kerja" className="py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Gampang Banget Pakainya</h2>
              <p className="text-muted-foreground text-lg">Cuma butuh 3 langkah buat nyelesain masalahmu.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Pesan Jasa", desc: "Pilih layanan yang kamu butuhkan dan jelaskan detail masalahnya.", icon: Search },
                { title: "Tunggu Mitra", desc: "Mitra terbaik di sekitarmu akan segera mengambil pesananmu.", icon: MapPin },
                { title: "Beres & Bayar", desc: "Kerjaan beres, bayar dengan aman lewat aplikasi.", icon: CheckCircle2 },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                  
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-border border-dashed border-t-2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap beresin kerjaan rumah?</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
              Gabung dengan ribuan pengguna lainnya yang sudah terbantu. Daftar sekarang, gratis!
            </p>
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-background text-primary px-8 h-14 text-lg font-bold hover:bg-background/90 transition-colors shadow-lg">
              Mulai Sekarang
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-primary-foreground p-1 rounded-lg">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xl font-bold text-foreground">Kerjain</span>
              </Link>
              <p className="text-muted-foreground max-w-xs">
                Platform layanan jasa lokal terbaik yang menghubungkan kamu dengan ahlinya.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-primary">Karir</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Bantuan</Link></li>
                <li><Link href="#" className="hover:text-primary">Syarat & Ketentuan</Link></li>
                <li><Link href="#" className="hover:text-primary">Privasi</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Kerjain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
