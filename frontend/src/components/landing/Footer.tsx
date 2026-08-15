"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Heart, ExternalLink, Sparkles, Mail, MessageSquare, ArrowUpRight } from "lucide-react";

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
    <footer className="bg-card/90 dark:bg-card/95 text-card-foreground border-t border-border/80 relative overflow-hidden transition-colors">
      {/* Liquid Glass Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand & About Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-10 h-10 rounded-2xl bg-primary/10 p-2 flex items-center justify-center border border-primary/20 shrink-0 group-hover:bg-primary/15 transition-colors"
              >
                <Image
                  src="/logo-notext.png"
                  alt="Kerjain Logo"
                  width={26}
                  height={26}
                  priority
                  className="object-contain w-auto h-auto max-w-full max-h-full aspect-square"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("Logo_Here")) {
                      target.src = "/Logo_Here/Kerjain_Logo_NO Text.png";
                    }
                  }}
                />
              </motion.div>
              <span className="font-extrabold text-foreground text-2xl tracking-tight">
                Kerjain
              </span>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Platform jasa lokal terpercaya yang menghubungkan Anda dengan tetangga dan mitra ahli di sekitar untuk menyelesaikan berbagai kebutuhan rumah tangga dengan aman, cepat, dan transparan.
            </p>


            {/* Liquid Glass Status & Location Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Semua Sistem Normal</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted/70 backdrop-blur-md border border-border/80 text-foreground text-xs font-medium shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Indonesia</span>
              </div>
            </div>

            {/* Liquid Glass GitHub Repo Card matching page theme */}
            <div className="pt-2">
              <motion.a
                href="https://github.com/KyonKyon0/Kerjain"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-background/80 hover:bg-muted/60 backdrop-blur-xl border border-border hover:border-primary/50 text-foreground text-xs font-semibold transition-all group shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 backdrop-blur-md flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold flex items-center gap-1.5 text-foreground group-hover:text-primary transition-colors">
                    KyonKyon0/Kerjain
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </p>
                  <p className="text-[11px] text-muted-foreground font-normal">Open-source & aktif dikembangkan di GitHub</p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Layanan Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Layanan
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-medium">
              {["Perbaikan Rumah", "Jasa Kebersihan & Cleaning", "Pindahan & Angkut Barang", "Instalasi & Kelistrikan", "Bantuan Khusus / Darurat"].map((item, idx) => (
                <li key={idx}>
                  <Link href="/register" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan & Platform Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Perusahaan
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-medium">
              {[
                { name: "Tentang Kerjain", href: "/help" },
                { name: "Gabung Jadi Mitra", href: "/register?role=partner" },
                { name: "Karir & Peluang", href: "/help" },
                { name: "Blog & Berita", href: "/help" },
                { name: "Standar Keamanan", href: "/help" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500/40 group-hover:bg-teal-500 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan & Legal Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" /> Bantuan & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-medium">
              {[
                { name: "Pusat Bantuan & FAQ", href: "/help" },
                { name: "Syarat & Ketentuan Layanan", href: "/help" },
                { name: "Kebijakan Privasi", href: "/help" },
                { name: "Panduan Pembayaran & QRIS", href: "/help" },
                { name: "Hubungi Dukungan CS", href: "/help" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider & Bottom Copyright Bar */}
        <div className="pt-8 border-t border-border/70 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-center md:text-left">
            <span>&copy; {new Date().getFullYear()} Kerjain. Seluruh hak cipta dilindungi. Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk masyarakat Indonesia.</span>
          </div>

          {/* Liquid Glass Social & Legal Badges matching page theme */}
          <div className="flex items-center gap-3 font-semibold">
            <motion.a
              href="https://github.com/KyonKyon0/Kerjain"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-xl bg-background/80 hover:bg-muted/70 backdrop-blur-md border border-border text-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <GithubIcon className="w-4 h-4" /> GitHub
            </motion.a>
            <Link href="/help" className="hover:text-primary transition-colors px-2 py-1">
              Bantuan
            </Link>
            <Link href="/help" className="hover:text-primary transition-colors px-2 py-1">
              Privasi
            </Link>
            <Link href="/help" className="hover:text-primary transition-colors px-2 py-1">
              Syarat
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
