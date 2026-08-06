import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="font-bold text-primary text-xl tracking-tight">
            Kerjain.
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden md:inline-flex")}>Masuk</Link>
          <Link href="/register" className={buttonVariants()}>Daftar</Link>
        </div>
      </div>
    </header>
  );
}
