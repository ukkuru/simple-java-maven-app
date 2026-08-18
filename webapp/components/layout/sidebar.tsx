"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FilePlus2,
  History,
  LayoutTemplate,
  Settings,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CopyrightNotice } from "@/components/layout/copyright-notice";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "New Analysis", icon: FilePlus2 },
  { href: "/history", label: "Analysis History", icon: History },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const navItems = session?.user?.isAdmin
    ? [...NAV_ITEMS, { href: "/admin", label: "Admin: Users", icon: ShieldCheck }]
    : NAV_ITEMS;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold leading-tight">
          User Story
          <br />
          Quality Analyzer
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  : "text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1.5 px-5 py-4">
        <p className="text-xs text-[rgb(var(--text-muted))]">
          Built for Product Managers, BAs, POs &amp; QA.
        </p>
        <CopyrightNotice />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))] lg:block">
      <div className="sticky top-0 h-screen">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="absolute left-0 top-0 h-full w-72 animate-fade-in bg-[rgb(var(--surface))] shadow-2xl">
        <div className="flex justify-end p-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="focus-ring rounded-lg p-2 hover:bg-[rgb(var(--surface-2))]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
