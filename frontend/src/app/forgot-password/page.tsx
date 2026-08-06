"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-primary/5">
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white shadow-sm rounded-2xl mb-4 text-primary">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Lupa Kata Sandi</h1>
          <p className="text-muted-foreground mt-2">Masukkan email Anda untuk reset password</p>
        </div>

        <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Email Terdaftar
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-9 h-11 transition-all duration-200 focus-visible:ring-primary/20 bg-muted/50 focus:bg-background"
                />
              </div>
            </div>

            <Button type="button" className="w-full h-11 mt-4 rounded-xl text-base font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
              Kirim Link Reset
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-muted/20 border-t border-border/50">
            <Link href="/login" className="flex items-center font-medium text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
