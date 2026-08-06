import { Heart, Zap, ShieldCheck } from "lucide-react";

export function WhyChooseSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Mengapa Memilih Kerjain?</h2>
          <p className="text-lg text-muted-foreground">
            Kami tidak sekadar aplikasi pencari jasa, tapi platform sosial yang membangun kembali budaya tolong-menolong secara digital.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-5 rounded-full mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Ekosistem Gotong Royong Digital</h3>
            <p className="text-muted-foreground leading-relaxed">
              Kami memfasilitasi pertukaran bantuan antar warga lokal yang saling menguntungkan dengan fleksibilitas jenis imbalan.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-5 rounded-full mb-6">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Cepat & Relevan</h3>
            <p className="text-muted-foreground leading-relaxed">
              Algoritma pencocokan berdasarkan lokasi memastikan pekerjaan Anda direspons dengan cepat oleh orang yang memang berada di dekat Anda.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-5 rounded-full mb-6">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Transparan & Aman</h3>
            <p className="text-muted-foreground leading-relaxed">
              Semua detail tugas, lokasi, dan kesepakatan nilai imbalan dibuat jelas dari awal untuk mencegah kesalahpahaman.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
