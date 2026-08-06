"use client";

import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";
import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Sidebar Desktop */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
        <TopNav />
        
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        {/* Mobile Nav */}
        <MobileNav />
      </div>
    </div>
  );
}
