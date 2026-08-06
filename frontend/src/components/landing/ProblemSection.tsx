import { AlertTriangle, SearchX, MessageSquareX } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: <SearchX className="h-6 w-6 text-destructive" />,
      title: "Sulit Menemukan Bantuan Terdekat",
      description: "Informasi bantuan lokal yang tidak terstruktur membuat orang sulit menemukan penolong yang berada paling dekat dengan mereka saat dibutuhkan."
    },
    {
      icon: <MessageSquareX className="h-6 w-6 text-destructive" />,
      title: "Komunikasi Tidak Fokus",
      description: "Pencarian bantuan yang mengandalkan grup chat atau media sosial sering kali membingungkan karena tidak ada ruang komunikasi khusus untuk setiap pekerjaan."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
      title: "Ketidakjelasan Imbalan",
      description: "Kesepakatan mengenai imbalan sering tidak transparan sejak awal, menimbulkan rasa canggung atau salah paham di akhir pekerjaan."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Masalah yang Sering Terjadi</h2>
          <p className="text-lg text-muted-foreground">
            Banyak orang membutuhkan bantuan untuk pekerjaan sederhana atau mendesak, tetapi menghadapi berbagai kendala saat mencari penolong.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, idx) => (
            <div key={idx} className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="bg-destructive/10 p-4 rounded-xl mb-6">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
