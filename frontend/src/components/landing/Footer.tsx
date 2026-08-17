"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  MessageSquare, 
  ArrowUpRight, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Lock,
  Globe2,
  PhoneCall
} from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#03060d] text-zinc-300 border-t border-white/10 relative overflow-hidden">
      {/* Dynamic Cosmic Backglow Lights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.05),transparent)]" />

      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12 relative z-10">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
          
          {/* Brand & Mission Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950 p-2 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-950/50 shrink-0 group-hover:border-emerald-400 transition-colors"
              >
                <Image
                  src="/logo-notext.png"
                  alt="KerjaIn Logo"
                  width={28}
                  height={28}
                  priority
                  className="object-contain w-auto h-auto max-w-full max-h-full aspect-square drop-shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("Logo_Here")) {
                      target.src = "/Logo_Here/Kerjain_Logo_NO Text.png";
                    }
                  }}
                />
              </motion.div>
              <div className="flex flex-col text-left">
                <span className="font-black text-white text-2xl tracking-tight leading-none">
                  Kerja<span className="text-emerald-400">In</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Daily Helpful App
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Platform penghubung konsumen dan mitra kerja untuk menyelesaikan berbagai kebutuhan rumah tangga harian secara aman, praktis, dan transparan.
            </p>

            {/* Status & Region Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sistem Aktif</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-medium shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Indonesia</span>
              </div>
            </div>

            {/* GitHub Open-Source Glass Card */}
            <div className="pt-2">
              <motion.a
                href="https://github.com/KyonKyon0/Kerjain"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[#0b101c]/90 hover:bg-[#0e1628] backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 text-white text-xs font-semibold transition-all group shadow-xl shadow-black/40"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 backdrop-blur-md flex items-center justify-center text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black group-hover:scale-110 transition-all duration-300">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold flex items-center gap-1.5 text-white group-hover:text-emerald-400 transition-colors">
                    KyonKyon0/Kerjain
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </p>
                  <p className="text-[10.5px] text-zinc-400 font-normal">Next.js 16 &middot; Tailwind &middot; Monorepo</p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Column 1: Kategori Layanan */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Solusi Layanan
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              {[
                "Pertukangan & Renovasi",
                "Cleaning & Pembersihan",
                "Pindahan & Angkut Barang",
                "Kelistrikan & Elektronik",
                "Servis AC & Perawatan",
                "Bantuan Khusus Harian"
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href="/register" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Kemitraan Mitra */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-teal-400" /> Kemitraan
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              {[
                { name: "Daftar Jadi Mitra", href: "/register?role=partner" },
                { name: "Panduan & Cara Kerja", href: "/help" },
                { name: "SOP & Ketentuan Tugas", href: "/help" },
                { name: "Dompet & Penarikan", href: "/help" },
                { name: "Tips Keamanan Kerja", href: "/help" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-teal-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500/30 group-hover:bg-teal-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Asta Cita & SDGs */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Pilar & Nilai
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              {[
                { name: "Asta Cita Kepresidenan RI", href: "/#showcase" },
                { name: "Pilar SDGs Pilihan", href: "/#showcase" },
                { name: "Pemberdayaan Ekonomi", href: "/help" },
                { name: "Inklusi Pembayaran QRIS", href: "/help" },
                { name: "Keamanan Sistem Rekber", href: "/help" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/30 group-hover:bg-cyan-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Bantuan & Keamanan */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Bantuan & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              {[
                { name: "Pusat Bantuan & FAQ", href: "/help" },
                { name: "Syarat & Ketentuan", href: "/help" },
                { name: "Kebijakan Privasi", href: "/help" },
                { name: "Sistem Rekber KerjaIn", href: "/help" },
                { name: "Hubungi Dukungan CS", href: "/help" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Security & Financial Trust Banner */}
        <div className="py-5 px-5 sm:px-8 rounded-2xl bg-gradient-to-r from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sistem Pembayaran & Rekber Terproteksi</p>
              <p className="text-[11px] text-zinc-400">Dana pesanan disimpan aman di sistem hingga pekerjaan disepakati selesai.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-zinc-400 font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">QRIS</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">Transfer Bank</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">Dompet Digital</span>
          </div>
        </div>

        {/* Divider & Bottom Master Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-center md:text-left flex-wrap justify-center">
            <span>&copy; {new Date().getFullYear()} <strong className="text-white font-extrabold">KerjaIn</strong> Platform. Seluruh hak cipta dilindungi. Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk kemajuan ekonomi kerakyatan Indonesia.</span>
          </div>

          {/* Social & Legal Badges */}
          <div className="flex items-center gap-3 font-semibold">
            <motion.a
              href="https://github.com/KyonKyon0/Kerjain"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-emerald-400 hover:border-emerald-500/40 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <GithubIcon className="w-3.5 h-3.5" /> GitHub
            </motion.a>
            <Link href="/help" className="hover:text-white transition-colors px-2 py-1">
              Bantuan
            </Link>
            <Link href="/help" className="hover:text-white transition-colors px-2 py-1">
              Privasi
            </Link>
            <Link href="/help" className="hover:text-white transition-colors px-2 py-1">
              Syarat
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
