"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { useWallet, useWithdraw } from "@/hooks/useWallet";
import { Loader2, Wallet, ArrowDownToLine, Landmark, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function WalletPage() {
  const { data, isLoading } = useWallet();
  const withdrawMutation = useWithdraw();
  
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    await withdrawMutation.mutateAsync({
      amount: Number(amount),
      bank_name: bankName,
      bank_account: bankAccount
    });
    setIsWithdrawOpen(false);
    setAmount("");
    setBankName("");
    setBankAccount("");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const balance = data?.wallet?.balance || 0;
  const withdrawals = data?.withdrawals || [];

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Dompet Pendapatan</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <DashboardCard className="bg-gradient-to-br from-emerald-500 to-primary text-white border-none shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-100 font-medium mb-2">
                  <Wallet className="w-5 h-5" /> Saldo Aktif
                </div>
                <div className="text-3xl font-bold mb-6">
                  Rp {balance.toLocaleString("id-ID")}
                </div>
                <Button 
                  className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-sm"
                  onClick={() => setIsWithdrawOpen(true)}
                  disabled={balance <= 0}
                >
                  <ArrowDownToLine className="w-4 h-4 mr-2" /> Tarik Dana
                </Button>
              </div>
            </DashboardCard>
          </div>

          <div className="md:col-span-2 space-y-6">
            <DashboardCard>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-primary" />
                Riwayat Penarikan
              </h3>

              {withdrawals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
                  Belum ada riwayat penarikan
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((w: any) => (
                    <div key={w.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${w.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : w.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {w.status === 'PENDING' ? <Clock className="w-5 h-5" /> : w.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">Tarik ke {w.bank_name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(w.created_at).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-foreground">Rp {w.amount.toLocaleString("id-ID")}</p>
                        <p className={`text-xs font-bold ${w.status === 'PENDING' ? 'text-amber-500' : w.status === 'COMPLETED' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {w.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>
        </div>

        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Landmark className="w-6 h-6 text-primary" />
                Tarik Dana
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleWithdraw} className="space-y-5 mt-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Nominal Penarikan (Rp)</label>
                <input 
                  type="number"
                  className="w-full bg-muted/50 border rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-primary transition-colors"
                  placeholder="0"
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2 font-medium">Saldo maksimal: Rp {balance.toLocaleString("id-ID")}</p>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Bank Tujuan</label>
                  <input 
                    type="text"
                    className="w-full bg-muted/50 border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                    placeholder="Contoh: BCA, Mandiri, BNI"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Nomor Rekening</label>
                  <input 
                    type="text"
                    className="w-full bg-muted/50 border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                    placeholder="Masukkan nomor rekening"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl text-base font-bold shadow-md shadow-primary/20"
                  disabled={withdrawMutation.isPending || Number(amount) <= 0 || Number(amount) > balance || !bankName || !bankAccount}
                >
                  {withdrawMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Ajukan Penarikan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}

function HistoryIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
