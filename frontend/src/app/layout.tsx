import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/navigation/ProtectedRoute";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ClientBootstrap } from "@/components/providers/ClientBootstrap";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kerjain.id"),
  title: "Kerjain - Bantu Tetangga, Selesaikan Masalah",
  description: "Friendly Local Service Marketplace - Platform Jasa & Bantuan Mikro Terpercaya",
  icons: {
    icon: [
      { url: "/logo-notext.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/logo-notext.png"],
    apple: [
      { url: "/logo-notext.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Kerjain - Bantu Tetangga, Selesaikan Masalah",
    description: "Friendly Local Service Marketplace - Solusi Cepat & Terpercaya Jasa Lokal",
    url: "https://kerjain.id",
    siteName: "Kerjain",
    images: [
      {
        url: "/logo-notext.png",
        width: 512,
        height: 512,
        alt: "Kerjain Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Kerjain - Bantu Tetangga, Selesaikan Masalah",
    description: "Friendly Local Service Marketplace",
    images: ["/logo-notext.png"],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${plusJakartaSans.className} min-h-screen flex flex-col antialiased text-foreground selection:bg-primary/20`}>
        <ClientBootstrap />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
            <Toaster position="top-center" richColors duration={2500} closeButton />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


