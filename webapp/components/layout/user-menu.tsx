"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--surface-2))] text-[rgb(var(--text-muted))]">
        <UserCircle className="h-5 w-5" />
      </div>
    );
  }

  const initial = (session.user.name || session.user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
      >
        {initial}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-56 animate-fade-in rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-1.5 text-sm shadow-xl"
          >
            <div className="px-2.5 py-2">
              <p className="truncate font-medium">{session.user.name || "Your account"}</p>
              <p className="truncate text-xs text-[rgb(var(--text-muted))]">{session.user.email}</p>
            </div>
            <div className="my-1 h-px bg-[rgb(var(--border))]" />
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                "focus-ring flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-[rgb(var(--surface-2))]"
              )}
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="focus-ring flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-danger-600 hover:bg-danger-50 dark:text-danger-500 dark:hover:bg-danger-500/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
