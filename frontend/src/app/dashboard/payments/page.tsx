"use client";

import React, { useState } from "react";
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
import { Wallet, ArrowDownCircle, ArrowUpCircle, AlertCircle, Clock, CheckCircle2, History, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaymentsPage() {
  const { role } = useAuthStore();
  const router = useRouter();

  // Redirect if not a partner
  React.useEffect(() => {
    if (role && role !== "partner") {
      router.replace("/dashboard");
    }
  }, [role, router]);

  const { data, isLoading } = useWallet();
  const withdraw = useWithdraw();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  if (role !== "partner") return null;

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

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Keuangan & Saldo</h1>
          <p className="text-muted-foreground font-medium">Kelola pendapatan dari hasil kerja Anda di Kerjain.</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        ) : !data ? (
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
                      {formatRupiah(data.balance)}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-2xl h-14 px-8 text-base shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                          disabled={!data.canWithdraw}
                        >
                          <ArrowUpCircle className="w-5 h-5 mr-2" />
                          Tarik Dana
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Tarik Dana</DialogTitle>
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
                            {Number(withdrawAmount) > data.balance && (
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
                              placeholder="Masukkan nomor" 
                              value={bankAccount} 
                              onChange={(e) => setBankAccount(e.target.value)}
                              className="h-12 rounded-xl"
                              required
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full h-12 rounded-xl text-base font-bold mt-4" 
                            disabled={withdraw.isPending || Number(withdrawAmount) < 10000 || Number(withdrawAmount) > data.balance}
                          >
                            {withdraw.isPending ? "Memproses..." : "Konfirmasi Penarikan"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    {/* Tooltip/Warning if cannot withdraw */}
                    {!data.canWithdraw && (
                      <div className="text-xs bg-black/20 backdrop-blur-sm rounded-xl p-3 flex items-start gap-2 max-w-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                        <span className="text-emerald-50 leading-relaxed">
                          {data.balance < 10000 
                            ? "Saldo minimum penarikan adalah Rp 10.000."
                            : `Penarikan ditunda T+3 (Sisa ${data.daysRemaining} hari lagi) semenjak pendapatan pertama.`
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
                
                {data.ledger.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada riwayat transaksi</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {data.ledger.map((trx, i) => (
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
                                  {new Date(trx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
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
