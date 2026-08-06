import { Send, UserCheck, Wrench, Banknote } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Send className="h-6 w-6 text-primary" />,
      title: "1. Post Pekerjaan",
      description: "Konsumen memposting pekerjaan dengan deskripsi, lokasi, waktu, dan jenis imbalan."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      title: "2. Mitra Menerima",
      description: "Mitra terdekat melihat pekerjaan dan menerimanya. Status pekerjaan langsung diperbarui."
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "3. Pelaksanaan",
      description: "Mitra datang ke lokasi dan menyelesaikan pekerjaan. Komunikasi bisa dilakukan via chat."
    },
    {
      icon: <Banknote className="h-6 w-6 text-primary" />,
      title: "4. Selesai & Bayar",
      description: "Pekerjaan selesai, Konsumen mengonfirmasi penyelesaian, memberikan imbalan, dan rating."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Bagaimana Cara Kerjanya?</h2>
          <p className="text-lg text-muted-foreground">
            Alur sederhana dari awal hingga selesai, memastikan setiap pekerjaan ditangani dengan cepat dan aman.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="h-24 w-24 bg-background border-4 border-muted rounded-full flex items-center justify-center mb-6 shadow-sm">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
