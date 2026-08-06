import { ReactNode } from "react";

import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  icon: ReactNode;
  href: string;
  description?: string;
}

export function QuickActionCard({ title, icon, href, description }: QuickActionCardProps) {
  return (
    <Link 
      href={href}
      className="group flex flex-col items-center justify-center p-6 bg-card text-card-foreground rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-primary/5 transition-all text-center h-full gap-3"
    >
      <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </Link>
  );
}
