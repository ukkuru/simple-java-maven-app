"use client";

import { useState, type ReactNode } from "react";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/topnav";
import { FrameworkProvider } from "@/components/layout/framework-context";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <FrameworkProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen">
        <Sidebar />
        <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNav onOpenMobileNav={() => setMobileNavOpen(true)} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </FrameworkProvider>
  );
}
