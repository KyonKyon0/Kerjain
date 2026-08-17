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
import { FinancialEarningsChart } from "@/components/dashboard/wallet/FinancialEarningsChart";
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
        <PageContainer className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1">Riwayat & Pembayaran</h1>
            <p className="text-muted-foreground font-medium text-xs">Pantau seluruh pengeluaran dan status pembayaran pesanan Anda.</p>
          </div>

          <div className="space-y-5">
            {/* Consumer Spending Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative overflow-hidden bg-gradient-to-br from-primary to-emerald-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-primary/20">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-emerald-100">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold uppercase tracking-wider text-xs">Total Pengeluaran Selesai</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {formatRupiah(totalSpent)}
                    </h2>
                  </div>

                  <Link href="/dashboard/jobs/create">
                    <Button className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-11 px-5 shadow-sm text-xs sm:text-sm">
                      + Buat Pekerjaan Baru
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods Info */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <DashboardCard className="flex items-center gap-3.5 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">QRIS Otomatis</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Gopay, OVO, Dana, ShopeePay, BCA, dll.</p>
                </div>
              </DashboardCard>
              <DashboardCard className="flex items-center gap-3.5 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Uang Tunai (Cash)</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Bayar langsung di tempat setelah selesai.</p>
                </div>
              </DashboardCard>
            </div>

            {/* Consumer Transactions List */}
            <DashboardCard className="shadow-xs rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-base">Daftar Transaksi Pembayaran</h3>
              </div>

              {consumerLoading ? (
                <div className="py-6">
                  <DynamicLoader text="Memuat riwayat transaksi" subtext="Mengambil data pengeluaran Anda..." size="sm" />
                </div>
              ) : consumerPayments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="font-semibold text-foreground text-sm">Belum Ada Transaksi</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Transaksi pembayaran pekerjaan Anda akan tercatat di sini.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consumerPayments.map((p) => (
                    <div 
                      key={p.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          p.status === "SUCCESS" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm line-clamp-1">{p.job?.title || "Pembayaran Pekerjaan"}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                            <span>Metode: <strong>{p.method}</strong></span>
                            <span>•</span>
                            <span>{formatWIBDate(p.created_at || p.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <p className="font-extrabold text-xs sm:text-sm text-primary">
                          {formatRupiah(Number(p.amount || 0))}
                        </p>
                        <span className={cn(
                          "inline-block px-2 py-0.2 rounded-md text-[9px] font-bold mt-0.5",
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
  const chartStats = partnerData?.stats || {
    total_earnings: 0,
    qris_earnings: 0,
    cash_earnings: 0,
    completed_count: 0
  };
  const chartData = partnerData?.chart_data || [];

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl space-y-5 pb-24 overflow-x-hidden w-full max-w-full">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1">Keuangan & Saldo</h1>
          <p className="text-muted-foreground font-medium text-xs">Kelola pendapatan dari hasil kerja Anda di Kerjain.</p>
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
          <div className="space-y-5">
            
            {/* 1. Interactive Financial Performance Chart (PALING ATAS) */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <FinancialEarningsChart 
                data={chartData} 
                stats={chartStats} 
              />
            </motion.div>

            {/* 2. Compact Saldo Dompet Digital (QRIS) Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-950/20">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-emerald-100 text-xs font-bold uppercase tracking-wider">
                      <Wallet className="w-4 h-4" />
                      <span>Saldo Dompet Digital (QRIS)</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        {formatRupiah(partnerData.balance)}
                      </h2>
                    </div>

                    <p className="text-[11px] text-emerald-100/80 mt-1">
                      Saldo siap ditarik ke rekening bank atau e-wallet Anda.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0">
                    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                      <DialogTrigger 
                        render={
                          <Button 
                            className="bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold rounded-xl h-11 px-5 text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                            disabled={!partnerData.canWithdraw}
                          />
                        }
                      >
                        <ArrowUpCircle className="w-4 h-4 mr-1.5" />
                        Tarik Dana
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold">Tarik Dana ke Rekening</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleWithdraw} className="space-y-3.5 mt-3">
                          <div>
                            <label className="text-xs font-bold mb-1 block">Nominal Penarikan (Min. Rp 10.000)</label>
                            <Input 
                              type="text" 
                              placeholder="10000" 
                              value={withdrawAmount} 
                              onChange={(e) => setWithdrawAmount(e.target.value.replace(/\D/g, ""))}
                              className="h-11 text-base font-mono rounded-xl"
                              required
                            />
                            {Number(withdrawAmount) > partnerData.balance && (
                              <p className="text-xs text-destructive mt-1">Saldo tidak mencukupi.</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-bold mb-1 block">Nama Bank / E-Wallet</label>
                            <Input 
                              placeholder="Contoh: BCA, GoPay, OVO, Dana" 
                              value={bankName} 
                              onChange={(e) => setBankName(e.target.value)}
                              className="h-11 rounded-xl text-xs sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold mb-1 block">Nomor Rekening / No. E-Wallet</label>
                            <Input 
                              placeholder="Masukkan nomor rekening atau HP" 
                              value={bankAccount} 
                              onChange={(e) => setBankAccount(e.target.value)}
                              className="h-11 rounded-xl text-xs sm:text-sm"
                              required
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full h-11 rounded-xl text-xs sm:text-sm font-extrabold mt-2 bg-primary hover:bg-emerald-600" 
                            disabled={withdraw.isPending || Number(withdrawAmount) < 10000 || Number(withdrawAmount) > partnerData.balance}
                          >
                            {withdraw.isPending ? "Memproses..." : "Konfirmasi Penarikan"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    {!partnerData.canWithdraw && (
                      <div className="text-[11px] bg-black/20 backdrop-blur-sm rounded-xl p-2.5 flex items-start gap-1.5 max-w-xs">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-300" />
                        <span className="text-emerald-50 leading-tight">
                          {partnerData.balance < 10000 
                            ? "Saldo minimum penarikan adalah Rp 10.000."
                            : `Penarikan ditunda T+3 (Sisa ${partnerData.daysRemaining} hari lagi) semenjak order pertama.`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>


            {/* 3. Proportional & Clean Transaction Ledger */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <DashboardCard className="shadow-xs rounded-3xl p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 mb-4 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    <h3 className="font-extrabold text-base text-foreground">Riwayat Transaksi & Pendapatan</h3>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {partnerData.ledger.length} Catatan
                  </span>
                </div>
                
                {partnerData.ledger.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="font-semibold text-foreground text-sm">Belum Ada Riwayat Transaksi</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pendapatan dari pekerjaan yang selesai akan otomatis tercatat di sini.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <AnimatePresence>
                      {partnerData.ledger.map((trx, i) => (
                        <motion.div 
                          key={trx.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                              trx.type === "INCOME" 
                                ? (trx.method === "QRIS" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600")
                                : "bg-destructive/10 text-destructive"
                            )}>
                              {trx.type === "INCOME" ? (
                                trx.method === "QRIS" ? <QrCode className="w-4 h-4" /> : <Banknote className="w-4 h-4" />
                              ) : (
                                <ArrowUpCircle className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs sm:text-sm text-foreground line-clamp-1">{trx.description}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {formatWIBDateTime(trx.date)}
                                </span>
                                {trx.method && (
                                  <span className={cn(
                                    "px-1.5 py-0.2 rounded font-black text-[9px]",
                                    trx.method === "QRIS" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                                  )}>
                                    {trx.method}
                                  </span>
                                )}
                                {trx.status === "PENDING" && (
                                  <span className="bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded-md font-bold text-[9px]">PENDING</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0 ml-3">
                            <p className={cn(
                              "font-black text-xs sm:text-sm",
                              trx.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
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
