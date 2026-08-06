import { Map, Tags, BellRing, MessageCircle, Wallet, Star } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Map className="h-5 w-5 text-primary" />,
      title: "Pencarian Berbasis Peta",
      description: "Temukan pekerjaan terdekat dengan radius lokasi di peta interaktif."
    },
    {
      icon: <Tags className="h-5 w-5 text-primary" />,
      title: "Kategori & Kata Kunci",
      description: "Filter pekerjaan dari angkat galon, pindahan rumah, hingga belanja."
    },
    {
      icon: <BellRing className="h-5 w-5 text-primary" />,
      title: "Status Real-Time",
      description: "Lacak status pekerjaan dari awal sampai selesai dengan notifikasi aktif."
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-primary" />,
      title: "In-App Chat",
      description: "Berkomunikasi langsung tanpa harus membagikan nomor telepon pribadi."
    },
    {
      icon: <Wallet className="h-5 w-5 text-primary" />,
      title: "Pembayaran Transparan",
      description: "Pilih imbalan nominal tetap di awal atau seikhlasnya setelah selesai."
    },
    {
      icon: <Star className="h-5 w-5 text-primary" />,
      title: "Rating & Ulasan",
      description: "Sistem ulasan untuk membangun kepercayaan dan reputasi dalam komunitas."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Fitur Lengkap untuk Kemudahan</h2>
          <p className="text-lg text-muted-foreground">
            Semua yang Anda butuhkan untuk meminta bantuan atau menjadi pahlawan lokal, tersedia dalam satu aplikasi.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
              <div className="bg-primary/10 h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
