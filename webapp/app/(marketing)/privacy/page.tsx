import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/marketing/json-ld";
import { ORG, SITE_URL } from "@/lib/seo/site";

const PAGE_URL = `${SITE_URL}/privacy`;

export const metadata: Metadata = {
  title: "Privacy Policy | QPulse",
  description:
    "How QPulse collects, processes and stores the user stories you submit, how long we keep them, and how to delete your data.",
  alternates: { canonical: PAGE_URL },
};

const WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  url: PAGE_URL,
  description: "How QPulse collects, processes and stores the user stories you submit.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={WEBPAGE_SCHEMA} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">Last updated 18 August 2026.</p>

        <div className="prose-sm mt-10 space-y-10 text-[rgb(var(--text))]">
          <div>
            <h2 className="text-xl font-bold tracking-tight">1. Who we are</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              QPulse is a product of {ORG.name} (&ldquo;{ORG.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
              {ORG.name} is the operating entity responsible for QPulse and for the data described in this
              policy. You can reach us at{" "}
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
            <h2 className="text-xl font-bold tracking-tight">2. What we collect</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">We collect three categories of data:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[rgb(var(--text-muted))]">
              <li>
                <strong>Account data</strong>: your email address, name (if provided), and a hashed
                password if you register with email and password. If you sign in with Google, we receive
                your name, email address and profile image from Google.
              </li>
              <li>
                <strong>Content data</strong>: the user stories and acceptance criteria you submit
                for analysis, and the scores, issues and rewrites QPulse generates from them.
              </li>
              <li>
                <strong>Usage data</strong>: the pages you visit, timestamps of activity such as
                sign-ins and analyses run, and your IP address as recorded in standard server logs.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">3. Why we collect it</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">We use this data to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[rgb(var(--text-muted))]">
              <li>Run the INVEST and SMART analysis you request and return a result</li>
              <li>Save your analysis history so you can track story quality over time</li>
              <li>Authenticate you and keep your account secure</li>
              <li>Operate, maintain and troubleshoot the service</li>
              <li>Respond when you contact support</li>
              <li>Send you marketing communications, but only if you have opted in (see Section 8)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">4. How your story content is processed</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              QPulse can run its analysis in one of two modes, and the mode in effect determines where your
              story text goes:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[rgb(var(--text-muted))]">
              <li>
                <strong>Built-in rule engine (default).</strong> Your story and acceptance criteria are
                scored entirely by code running on our own server. Nothing is sent to a third-party AI
                provider in this mode.
              </li>
              <li>
                <strong>AI-assisted mode (optional, operator-enabled).</strong> If this deployment has AI
                scoring turned on, your story text is sent to Anthropic&rsquo;s API to generate the
                analysis. Anthropic processes that text to return a result to us; per Anthropic&rsquo;s
                commercial API terms, content submitted through the API is not used to train Anthropic&rsquo;s
                models.
              </li>
            </ul>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              In neither mode do we use your submitted stories to train any model of our own.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">5. How long we keep it</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              We keep your account data and saved story history for as long as your account is active. If
              you delete your account, we delete your account data and saved stories within 30 days,
              except where we are required to retain limited records for legal, security or fraud-prevention
              purposes. Server access logs are retained for a rolling 90 days and then deleted automatically.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">6. Who we share it with</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">We share data with a small number of named processors, and no one else:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[rgb(var(--text-muted))]">
              <li>
                <strong>Anthropic</strong>: only your story text, and only if this deployment has
                AI-assisted mode enabled (Section 4).
              </li>
              <li>
                <strong>Google</strong>: only if you choose to sign in with Google, to authenticate
                you.
              </li>
              <li>
                <strong>Our hosting provider</strong>: to run the servers QPulse operates on. We do
                not currently use a third-party analytics or email-delivery service.
              </li>
            </ul>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              We do not sell your data, and we do not share it with anyone for their own marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">7. Where data is stored</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              QPulse runs on infrastructure we operate directly rather than a general-purpose cloud
              platform. If you need the specific hosting region confirmed for a compliance review, contact
              us at{" "}
              <a href={`mailto:${ORG.email}`} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                {ORG.email}
              </a>{" "}
              and we will provide it in writing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">8. Your rights</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              You can access, correct, export or delete your data, and you can object to or withdraw from
              marketing communications at any time from Settings inside the app, or by emailing{" "}
              <a href={`mailto:${ORG.email}`} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                {ORG.email}
              </a>
              . We action data requests within 30 days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">9. Cookies</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              QPulse sets one essential cookie to keep you signed in between visits. This cookie is
              required for the service to work and cannot be declined while remaining signed in. We do not
              currently use analytics or advertising cookies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">10. Children</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              QPulse is a business tool and is not directed at, or intended for use by, anyone under 16
              years old.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">11. Changes to this policy</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              If we make a material change to this policy, we will update the date at the top of this page
              and, where required by law, notify you directly.
            </p>
          </div>

          <div id="contact">
            <h2 className="text-xl font-bold tracking-tight">12. Contact</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              Privacy questions, data access or deletion requests: {ORG.name}
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
              <br />
              We respond to data requests within 30 days.
            </p>
          </div>
        </div>

        <p className="mt-12 text-sm text-[rgb(var(--text-muted))]">
          See also our{" "}
          <Link href="/terms" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </>
  );
}
