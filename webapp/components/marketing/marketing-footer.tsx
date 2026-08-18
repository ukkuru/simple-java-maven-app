import Link from "next/link";
import { ORG } from "@/lib/seo/site";
import { CopyrightNotice } from "@/components/layout/copyright-notice";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400">
                  Analyzer
                </Link>
              </li>
              <li>
                <Link
                  href="/free-ai-user-story-generator"
                  className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400"
                >
                  Generator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              Learn
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/faq" className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/login" className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${ORG.email}`}
                  className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {ORG.email}
                </a>
              </li>
              <li>
                <a
                  href={ORG.whatsappLink}
                  target="_blank"
                  rel="noopener"
                  className="focus-ring rounded hover:text-brand-600 dark:hover:text-brand-400"
                >
                  WhatsApp {ORG.whatsappNumber}
                </a>
              </li>
              <li className="text-[rgb(var(--text-muted))]">Built by {ORG.name}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[rgb(var(--border))] pt-6">
          <CopyrightNotice />
        </div>
      </div>
    </footer>
  );
}
