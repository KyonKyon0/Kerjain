import { User, Users } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function TargetUserSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Siapa yang Membutuhkan Kerjain?</h2>
          <p className="text-lg text-muted-foreground">
            Platform kami dirancang khusus untuk memenuhi kebutuhan kedua belah pihak dengan adil.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Konsumen */}
          <div className="bg-background rounded-3xl p-8 md:p-10 border shadow-sm relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Untuk Konsumen</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Anda yang membutuhkan bantuan untuk pekerjaan harian, lokal, dan spesifik. Seperti pindahan indekos, angkat barang berat, belanja, atau sekadar butuh tenaga tambahan.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></span>
                Bantuan datang lebih cepat
              </li>
              <li className="flex items-center text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></span>
                Identitas penolong terverifikasi
              </li>
              <li className="flex items-center text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></span>
                Imbalan transparan
              </li>
            </ul>
            <Link href="/register" className={buttonVariants({ variant: "outline", className: "w-full" })}>
              Daftar sebagai Konsumen
            </Link>
          </div>

          {/* Mitra */}
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-10"></div>
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Untuk Mitra</h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Anda yang bersedia mengambil pekerjaan lokal berdasarkan waktu, jarak, dan kemampuan. Cocok untuk mahasiswa, pekerja lepas, atau warga yang ingin membantu sekitar.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-sm font-medium text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white mr-3"></span>
                Temukan pekerjaan yang relevan & dekat
              </li>
              <li className="flex items-center text-sm font-medium text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white mr-3"></span>
                Waktu kerja fleksibel
              </li>
              <li className="flex items-center text-sm font-medium text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white mr-3"></span>
                Kepastian imbalan
              </li>
            </ul>
            <Link href="/register" className={buttonVariants({ variant: "secondary", className: "w-full font-bold" })}>
              Daftar sebagai Mitra
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
