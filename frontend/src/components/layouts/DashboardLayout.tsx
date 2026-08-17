"use client";

import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";
import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/10 w-full max-w-full overflow-x-clip">
      {/* Sidebar Desktop */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 w-full max-w-full relative">
        <TopNav />
        
        <main className="flex-1 flex flex-col w-full max-w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Floating Liquid Glass Mobile Nav */}
      <MobileNav />
    </div>
  );
}
