import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/marketing/json-ld";
import { ORG, SITE_URL } from "@/lib/seo/site";

const PAGE_URL = `${SITE_URL}/terms`;

export const metadata: Metadata = {
  title: "Terms of Service | QPulse",
  description:
    "The terms covering use of the QPulse user story quality analyzer, including accounts, acceptable use, AI generated output and liability.",
  alternates: { canonical: PAGE_URL },
};

const WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service",
  url: PAGE_URL,
  description: "The terms covering use of the QPulse user story quality analyzer.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={WEBPAGE_SCHEMA} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">Last updated 18 August 2026.</p>

        <div className="prose-sm mt-10 space-y-10 text-[rgb(var(--text))]">
          <div>
            <h2 className="text-xl font-bold tracking-tight">1. Agreement</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              By creating an account or otherwise using QPulse, you agree to these Terms of Service. If you
              do not agree, do not use the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">2. Who provides the service</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              QPulse is provided by {ORG.name}. You can reach us at{" "}
              <a href={`mailto:${ORG.email}`} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                {ORG.email}
              </a>{" "}
              or on WhatsApp at{" "}
              <a href={ORG.whatsappLink} target="_blank" rel="noopener" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                {ORG.whatsappNumber}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">3. Accounts</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              One account per person. You agree to provide an accurate email address and to keep your
              credentials confidential. You are responsible for all activity under your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">4. Free accounts and paid plans</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              An account is required to use QPulse. The free account includes story and acceptance
              criteria analysis, rewrites, and saved history, subject to fair-use rate limits described in
              the app. If we introduce a paid tier, its features, pricing and any limits will be described
              at the point of purchase and will not change what a free account already has without notice.
              You can close your account at any time from Settings or by emailing{" "}
              <a href={`mailto:${ORG.email}`} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                {ORG.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">5. Acceptable use</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[rgb(var(--text-muted))]">
              <li>Scrape, crawl or systematically extract data from the service</li>
              <li>Resell or repackage QPulse&rsquo;s output as a competing service</li>
              <li>Submit content you do not have the right to submit</li>
              <li>Attempt to reverse engineer, decompile, or extract the underlying scoring model</li>
              <li>Interfere with or disrupt the service or attempt to bypass its rate limits</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">6. Your content</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              You keep ownership of every user story and acceptance criterion you submit. You grant{" "}
              {ORG.name} a limited licence to process, store and display that content back to you solely to
              provide the service. We do not claim ownership of your content and do not use it to train any
              model of our own.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">7. AI generated output</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              Scores, issues, rewrites and generated stories are automated suggestions, not professional
              advice, and QPulse does not guarantee their accuracy or completeness. You are responsible for
              reviewing any generated content before it enters your backlog, ticket system, or any other
              record you rely on. QPulse is a decision-support tool; the judgement remains yours.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">8. Availability</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              We do not guarantee uptime on the free tier. We may perform maintenance that temporarily
              takes the service offline, and we may add, change or remove features at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">9. Liability</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              To the maximum extent permitted by law, {ORG.name}&rsquo;s total liability arising out of or
              relating to your use of QPulse is limited to the amount you paid us in the twelve months
              before the claim arose, or 100 USD if you used a free account. We are not liable for indirect,
              incidental, or consequential loss, including lost profits or lost data, arising from your use
              of the service or from any decision made based on its output.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">10. Termination</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              Either party can end this agreement at any time; you by closing your account, we by
              suspending or terminating access for a violation of these terms or of applicable law. Saved
              stories and account data are deleted following the schedule in our{" "}
              <Link href="/privacy" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">11. Governing law</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              These terms are governed by the laws of India, and any dispute arising from them is subject
              to the exclusive jurisdiction of the courts of Kerala, India.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">12. Changes to these terms</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              If we make a material change to these terms, we will update the date at the top of this page
              and give at least 14 days&rsquo; notice before the change takes effect, either in the app or
              by email.
            </p>
          </div>

          <div id="contact">
            <h2 className="text-xl font-bold tracking-tight">13. Contact</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              Questions about these terms: {ORG.name}
              <br />
              Email{" "}
              <a href={`mailto:${ORG.email}`} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                {ORG.email}
              </a>
              <br />
              WhatsApp{" "}
              <a href={ORG.whatsappLink} target="_blank" rel="noopener" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                {ORG.whatsappNumber}
              </a>
            </p>
          </div>
        </div>

        <p className="mt-12 text-sm text-[rgb(var(--text-muted))]">
          See also our{" "}
          <Link href="/privacy" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </>
  );
}
