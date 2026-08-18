import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { CopyrightNotice } from "@/components/layout/copyright-notice";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(var(--bg))] px-4 py-12">
      <Link href="/" className="focus-ring mb-8 flex items-center gap-2 rounded-lg">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold leading-tight">
          User Story
          <br />
          Quality Analyzer
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 shadow-sm animate-fade-in sm:p-8">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      <div className="mt-6 text-sm text-[rgb(var(--text-muted))]">{footer}</div>

      <CopyrightNotice className="mt-10" />
    </div>
  );
}
