import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black text-primary tracking-tighter">Kerjain</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Platform bantuan lokal yang menghubungkan orang yang butuh bantuan dengan orang terdekat yang bersedia membantu secara cepat dan transparan.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <MapPin className="h-4 w-4" />
              <span>Indonesia</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Produk</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/register" className="hover:text-primary transition-colors">Cara Kerja Konsumen</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Cara Kerja Mitra</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Keamanan</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Harga & Imbalan</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Perusahaan</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Karir</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Bantuan</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Kerjain. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="/" className="hover:text-primary transition-colors">Instagram</Link>
            <Link href="/" className="hover:text-primary transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
