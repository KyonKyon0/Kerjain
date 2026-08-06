import { CheckCircle2, MapPin, Handshake, ShieldCheck } from "lucide-react";

export function SolutionSection() {
  const solutions = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Pencocokan Berbasis Lokasi",
      description: "Sistem cerdas kami langsung menghubungkan pekerjaan dengan Mitra yang berada dalam radius terdekat, mempercepat respons bantuan."
    },
    {
      icon: <Handshake className="h-6 w-6 text-primary" />,
      title: "Status Pekerjaan Real-Time",
      description: "Setiap pekerjaan memiliki status yang selalu diperbarui, mencegah penerimaan ganda dan memberikan kepastian penyelesaian kepada Konsumen."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Komunikasi & Transaksi Terpusat",
      description: "Konsumen dan Mitra dapat berkomunikasi dalam aplikasi. Kesepakatan imbalan juga dicantumkan transparan sebelum pekerjaan diterima."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 w-full order-2 lg:order-1">
            <div className="grid gap-8">
              {solutions.map((solution, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 bg-primary/10 p-3 rounded-full shrink-0">
                    {solution.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{solution.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <div className="bg-background border shadow-xl rounded-3xl p-8 relative overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Solusi Praktis untuk Bantuan Lokal
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Kerjain dirancang khusus untuk memfasilitasi pertukaran bantuan secara lokal dengan cara yang aman, cepat, dan transparan.
                </p>
                <ul className="space-y-4">
                  {[
                    "Hanya Mitra terdekat yang dinotifikasi",
                    "Fitur In-App Chat untuk privasi",
                    "Pilihan imbalan tetap atau seikhlasnya",
                    "Riwayat pekerjaan yang terorganisir"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
