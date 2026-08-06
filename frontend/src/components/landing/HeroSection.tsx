import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Tersedia di area sekitarmu
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Platform Bantuan Lokal <span className="text-primary">Cepat & Transparan</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Temukan bantuan untuk pekerjaan harian dari tetangga di sekitarmu, atau jadi Mitra untuk mendapat penghasilan tambahan.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-12 px-8 text-base rounded-full shadow-lg hover:shadow-primary/25 transition-all" })}>
              Cari Bantuan Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/register" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-12 px-8 text-base rounded-full" })}>
              Jadi Mitra
            </Link>
          </div>
          
          <div className="pt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Berbasis Lokasi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                ))}
              </div>
              <span>Ratusan mitra siap membantu</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-50"></div>
    </section>
  );
}
