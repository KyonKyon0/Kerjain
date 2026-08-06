import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary -z-20"></div>
      
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-6 max-w-3xl mx-auto">
          Siap Bergabung dengan Ekosistem Bantuan Lokal?
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Mulai sekarang. Daftarkan diri Anda sebagai Konsumen yang butuh bantuan, atau Mitra yang siap membantu.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className={buttonVariants({ size: "lg", variant: "secondary", className: "w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full" })}>
            Cari Bantuan
          </Link>
          <Link href="/register" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white" })}>
            Jadi Mitra
          </Link>
          <Link href="/login" className={buttonVariants({ size: "lg", variant: "ghost", className: "w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full text-white hover:bg-white/10 hover:text-white mt-4 sm:mt-0" })}>
            Masuk
          </Link>
        </div>
      </div>
    </section>
  );
}
