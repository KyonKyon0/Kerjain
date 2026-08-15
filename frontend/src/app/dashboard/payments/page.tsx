"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useAuthStore } from "@/store/auth.store";
import { useWallet, useWithdraw } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowDownCircle, ArrowUpCircle, AlertCircle, Clock, CheckCircle2, History, CreditCard, QrCode, Banknote, ShieldCheck } from "lucide-react";
import { cn, formatWIBDate, formatWIBDateTime } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";
import { DynamicLoader } from "@/components/ui/DynamicLoader";
import Link from "next/link";


export default function PaymentsPage() {

  const { role, user } = useAuthStore();
  const router = useRouter();

  // Partner hooks
  const { data: partnerData, isLoading: partnerLoading } = useWallet();
  const withdraw = useWithdraw();

  // Consumer state
  const [consumerPayments, setConsumerPayments] = useState<any[]>([]);
  const [consumerLoading, setConsumerLoading] = useState(true);

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  useEffect(() => {
    if (role === "consumer") {
      const fetchConsumerPayments = async () => {
        try {
          const res = await axiosInstance.get("/payments");
          setConsumerPayments(res.data?.data || []);
        } catch (e) {
          console.error("Error fetching payments:", e);
        } finally {
          setConsumerLoading(false);
        }
      };
      fetchConsumerPayments();
    }
  }, [role]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount.replace(/\D/g, ""));
    if (!amount || amount < 10000) return;

    await withdraw.mutateAsync({ amount, bank_name: bankName, bank_account: bankAccount });
    setIsWithdrawOpen(false);
    setWithdrawAmount("");
    setBankName("");
    setBankAccount("");
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Skeleton className="h-48 w-full max-w-2xl rounded-3xl" />
        </div>
      </DashboardLayout>
    );
  }

  // CONSUMER VIEW
  if (role === "consumer") {
    const totalSpent = consumerPayments
      .filter(p => p.status === "SUCCESS")
      .reduce((acc, p) => acc + Number(p.amount || 0), 0);

    return (
      <DashboardLayout>
        <PageContainer className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Riwayat & Pembayaran</h1>
            <p className="text-muted-foreground font-medium">Pantau seluruh pengeluaran dan status pembayaran pesanan Anda.</p>
          </div>

          <div className="space-y-6">
            {/* Consumer Spending Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative overflow-hidden bg-gradient-to-br from-primary to-emerald-700 rounded-3xl p-8 text-white shadow-xl shadow-primary/20">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-emerald-100">
                      <CreditCard className="w-5 h-5" />
                      <span className="font-semibold uppercase tracking-wider text-sm">Total Pengeluaran Selesai</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                      {formatRupiah(totalSpent)}
                    </h2>
                  </div>
                  <Link href="/dashboard/jobs/create">
                    <Button className="bg-white text-primary hover:bg-white/90 font-bold rounded-2xl h-12 px-6 shadow-md">
                      + Buat Pekerjaan Baru
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <DashboardCard className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">QRIS Otomatis</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Gopay, OVO, Dana, ShopeePay, BCA, dll.</p>
                </div>
              </DashboardCard>
              <DashboardCard className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Uang Tunai (Cash)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Bayar langsung di tempat setelah selesai.</p>
                </div>
              </DashboardCard>
            </div>

            {/* Consumer Transactions List */}
            <DashboardCard className="shadow-sm">

              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Daftar Transaksi Pembayaran</h3>
              </div>

              {consumerLoading ? (
                <div className="py-6">
                  <DynamicLoader text="Memuat riwayat transaksi" subtext="Mengambil data pengeluaran Anda..." size="sm" />
                </div>
              ) : consumerPayments.length === 0 ? (

                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-semibold text-foreground">Belum Ada Transaksi</p>
                  <p className="text-xs text-muted-foreground mt-1">Transaksi pembayaran pekerjaan Anda akan tercatat di sini.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consumerPayments.map((p) => (
                    <div 
                      key={p.id}
                      className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                          p.status === "SUCCESS" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-sm md:text-base line-clamp-1">{p.job?.title || "Pembayaran Pekerjaan"}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>Metode: <strong>{p.method}</strong></span>
                            <span>•</span>
                            <span>{formatWIBDate(p.created_at || p.createdAt)}</span>
                          </div>
                        </div>

                      </div>

                      <div className="text-right shrink-0 ml-4">
                        <p className="font-extrabold text-base md:text-lg text-primary">
                          {formatRupiah(Number(p.amount || 0))}
                        </p>
                        <span className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1",
                          p.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  // PARTNER VIEW
  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Keuangan & Saldo</h1>
          <p className="text-muted-foreground font-medium">Kelola pendapatan dari hasil kerja Anda di Kerjain.</p>
        </div>

        {partnerLoading ? (
          <div className="py-12 bg-card/60 backdrop-blur-sm border rounded-3xl">
            <DynamicLoader text="Memuat data keuangan & saldo" subtext="Menyinkronkan saldo aktif Anda..." size="md" />
          </div>
        ) : !partnerData ? (

          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Gagal memuat data dompet.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wallet Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-emerald-900/20">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-300 opacity-10 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-emerald-50">
                      <Wallet className="w-5 h-5" />
                      <span className="font-semibold uppercase tracking-wider text-sm">Saldo Aktif</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                      {formatRupiah(partnerData.balance)}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                      <DialogTrigger 
                        render={
                          <Button 
                            className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-2xl h-14 px-8 text-base shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={!partnerData.canWithdraw}
                          />
                        }
                      >
                        <ArrowUpCircle className="w-5 h-5 mr-2" />
                        Tarik Dana
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Tarik Dana</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleWithdraw} className="space-y-4 mt-4">
                          <div>
                            <label className="text-sm font-bold mb-1 block">Nominal (Min. Rp 10.000)</label>
                            <Input 
                              type="text" 
                              placeholder="10000" 
                              value={withdrawAmount} 
                              onChange={(e) => setWithdrawAmount(e.target.value.replace(/\D/g, ""))}
                              className="h-12 text-lg font-mono rounded-xl"
                              required
                            />
                            {Number(withdrawAmount) > partnerData.balance && (
                              <p className="text-xs text-destructive mt-1">Saldo tidak mencukupi.</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-bold mb-1 block">Nama Bank / E-Wallet</label>
                            <Input 
                              placeholder="Contoh: BCA, GoPay, Dana" 
                              value={bankName} 
                              onChange={(e) => setBankName(e.target.value)}
                              className="h-12 rounded-xl"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold mb-1 block">Nomor Rekening / HP</label>
                            <Input 
                              placeholder="Masukkan nomor rekening atau nomor e-wallet" 
                              value={bankAccount} 
                              onChange={(e) => setBankAccount(e.target.value)}
                              className="h-12 rounded-xl"
                              required
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full h-12 rounded-xl text-base font-bold mt-4" 
                            disabled={withdraw.isPending || Number(withdrawAmount) < 10000 || Number(withdrawAmount) > partnerData.balance}
                          >
                            {withdraw.isPending ? "Memproses..." : "Konfirmasi Penarikan"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    {!partnerData.canWithdraw && (
                      <div className="text-xs bg-black/20 backdrop-blur-sm rounded-xl p-3 flex items-start gap-2 max-w-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                        <span className="text-emerald-50 leading-relaxed">
                          {partnerData.balance < 10000 
                            ? "Saldo minimum penarikan adalah Rp 10.000."
                            : `Penarikan ditunda T+3 (Sisa ${partnerData.daysRemaining} hari lagi) semenjak pendapatan pertama.`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ledger List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <DashboardCard className="shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <History className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Riwayat Transaksi</h3>
                </div>
                
                {partnerData.ledger.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada riwayat transaksi</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {partnerData.ledger.map((trx, i) => (
                        <motion.div 
                          key={trx.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                              trx.type === "INCOME" ? "bg-emerald-100 text-emerald-600" : "bg-destructive/10 text-destructive"
                            )}>
                              {trx.type === "INCOME" ? <ArrowDownCircle className="w-6 h-6" /> : <ArrowUpCircle className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm md:text-base line-clamp-1">{trx.description}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatWIBDateTime(trx.date)}
                                </span>

                                {trx.status === "PENDING" && (
                                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold text-[10px]">PENDING</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0 ml-4">
                            <p className={cn(
                              "font-extrabold text-base md:text-lg",
                              trx.type === "INCOME" ? "text-emerald-600" : "text-foreground"
                            )}>
                              {trx.type === "INCOME" ? "+" : "-"}{formatRupiah(trx.amount)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </DashboardCard>
            </motion.div>
          </div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}

