import Link from "next/link";
import { getServerSession } from "next-auth";
import { Sparkles } from "lucide-react";
import { authOptions } from "@/lib/auth/options";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/free-ai-user-story-generator", label: "Generator" },
  { href: "/faq", label: "FAQ" },
];

export async function MarketingHeader() {
  const session = await getServerSession(authOptions);
  const signedIn = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">QPulse</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded text-sm font-medium text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {signedIn ? (
            <Link href="/dashboard" className={buttonVariants({ variant: "primary", size: "sm" })}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="focus-ring hidden rounded text-sm font-medium text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] sm:inline-block"
              >
                Sign in
              </Link>
              <Link href="/register" className={buttonVariants({ variant: "primary", size: "sm" })}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
