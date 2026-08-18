import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/marketing/json-ld";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { ORG, SITE_URL } from "@/lib/seo/site";

const PAGE_URL = `${SITE_URL}/free-ai-user-story-generator`;

export const metadata: Metadata = {
  title: "Free AI User Story Generator with Acceptance Criteria",
  description:
    "Paste a rough user story and QPulse's analyzer rewrites it, generates the acceptance criteria you skipped, and scores the result against INVEST and SMART. Free account, no credit card.",
  alternates: { canonical: PAGE_URL },
};

const OUTPUTS = [
  {
    title: "A rewritten user story",
    body: 'Your draft, tightened into standard agile form with a specific persona, a concrete action, and a stated outcome. Not "a user" and not "use the app."',
  },
  {
    title: "Acceptance criteria, generated if you skipped them",
    body: "Leave the acceptance criteria field blank and QPulse writes a happy-path and a failure-path Given/When/Then scenario for you.",
  },
  {
    title: "An INVEST score",
    body: "All six criteria scored separately, with the reason for every fail written in plain language.",
  },
  {
    title: "A SMART check on the criteria",
    body: "Because acceptance criteria that cannot be measured are just wishes with better formatting.",
  },
];

const STEPS = [
  { id: "step-1", title: "Paste", body: "Drop in whatever you have — a full story, a rough one-liner, or just a feature name. Leave acceptance criteria blank if you haven't written any yet." },
  { id: "step-2", title: "Score", body: "The same analyzer that scores a finished story checks yours against INVEST and SMART and shows exactly what's missing." },
  { id: "step-3", title: "Rewrite", body: "Take the corrected story and, if you left acceptance criteria blank, the scenarios QPulse drafted to fill that gap. Edit and re-score until it clears." },
];

const INTEGRATIONS = [
  { name: "Jira", body: "Copy the rewritten story and criteria straight into a ticket." },
  { name: "Confluence", body: "Drop scored stories into your refinement page so the whole team sees the same standard." },
  { name: "Miro", body: "Running story mapping on a board? Paste the rewritten text onto the card." },
  { name: "Azure DevOps and Linear", body: "Same copy and paste flow. No plugin required." },
];

const SOFTWARE_HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${PAGE_URL}#software`,
      name: "QPulse User Story Analyzer — Rewrite and Acceptance Criteria Generation",
      url: PAGE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web browser",
      description:
        "The same QPulse analyzer used to score finished stories also rewrites a rough draft and generates acceptance criteria you didn't write, scored against INVEST and SMART.",
      featureList: [
        "User story rewrite and clean-up",
        "Acceptance criteria generation when none are provided",
        "Gherkin Given/When/Then formatting",
        "INVEST scoring",
        "SMART scoring of acceptance criteria",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free account required. No credit card.",
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "HowTo",
      "@id": `${PAGE_URL}#howto`,
      name: "How to turn a rough user story into a scored, complete backlog item",
      description:
        "Paste a rough or incomplete user story into the QPulse analyzer and get back a rewritten story, generated acceptance criteria, and an INVEST/SMART score.",
      totalTime: "PT1M",
      supply: [],
      tool: [{ "@type": "HowToTool", name: "QPulse User Story Analyzer" }],
      step: STEPS.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.body,
        url: `${PAGE_URL}#${s.id}`,
      })),
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Free AI User Story Generator", item: PAGE_URL },
  ],
};

export default function GeneratorPage() {
  return (
    <>
      <JsonLd data={SOFTWARE_HOWTO_SCHEMA} />
      <JsonLd data={BREADCRUMB_SCHEMA} />

      {/* 1. Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              One analyzer. It also writes what you didn&rsquo;t.
            </h1>
            <p className="mt-5 text-lg text-[rgb(var(--text-muted))]">
              QPulse isn&rsquo;t a separate generator tool bolted onto the analyzer &mdash; it&rsquo;s the
              same engine. Paste a rough story, even a single line, and leave the acceptance criteria
              blank if you haven&rsquo;t written any. QPulse rewrites the story, drafts the acceptance
              criteria you skipped, and scores the result against INVEST and SMART.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Create My Free Account
              </Link>
              <span className="text-sm text-[rgb(var(--text-muted))]">
                Free account, no credit card.
              </span>
            </div>
            <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                Sign in
              </Link>
            </p>
          </div>

          <Card className="animate-fade-in p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              Input: &ldquo;As a shopper, I want to filter search results by price.&rdquo; Acceptance
              criteria left blank.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-semibold">
                As a shopper, I want to filter search results by price, so that I get the outcome I need
                without unnecessary friction or delay.
              </p>
              <Badge tone="success" className="shrink-0">Rewritten</Badge>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              Acceptance criteria &mdash; generated, not left empty
            </p>
            <div className="mt-2 space-y-2 text-sm">
              <p>
                <strong>Given</strong> I am a shopper in a valid starting state
                <br />
                <strong>When</strong> I perform the primary action described in the story
                <br />
                <strong>Then</strong> the system completes the action and confirms success clearly, with a
                defined, measurable threshold
              </p>
              <p>
                <strong>Given</strong> I am a shopper providing invalid or incomplete input
                <br />
                <strong>When</strong> I attempt the primary action
                <br />
                <strong>Then</strong> the system rejects the action and explains what needs to be corrected,
                with a defined, measurable threshold
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 2. It's one tool, not two */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">It&rsquo;s the analyzer. Not a second tool.</h2>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            Plenty of tools will turn a feature name into a confident-sounding story from nothing. That
            sentence reads like something a senior BA wrote. Then it goes into the backlog, and three
            weeks later a developer finds it was independent of nothing, sized by nobody, and testable in
            theory only.
          </p>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            QPulse doesn&rsquo;t invent a story out of thin air. It takes what you actually wrote &mdash;
            even one rough sentence &mdash; and runs it through the exact same INVEST and SMART checks as{" "}
            <Link href="/" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              the analyzer on the homepage
            </Link>
            . Where something&rsquo;s missing, like acceptance criteria you didn&rsquo;t get to yet, it
            fills that gap and shows you the result &mdash; scored, not just generated.
          </p>
        </div>
      </section>

      {/* 3. How it works — matches the homepage exactly */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Same three steps, starting from less
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.id} id={step.id} className="scroll-mt-20">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {i + 1}
              </span>
              <p className="mt-3 font-semibold">{step.title}</p>
              <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/register" className={buttonVariants({ variant: "outline" })}>
            Try It On My Story
          </Link>
          <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">
            Free with an account. No credit card, and nothing to install.
          </p>
        </div>
      </section>

      {/* 4. What you get */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            What comes back, even from a thin starting point
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OUTPUTS.map((o) => (
              <Card key={o.title} className="p-5">
                <p className="font-semibold">{o.title}</p>
                <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">{o.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Acceptance criteria generation, explained honestly */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Skipped the acceptance criteria? QPulse still gives you two scenarios
        </h2>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          A story with no acceptance criteria at all is common &mdash; and it&rsquo;s exactly what fails{" "}
          <Link
            href="/faq#what-are-good-acceptance-criteria-for-a-login-page"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            good acceptance criteria for a login page
          </Link>{" "}
          checks most often. Leave the field blank and QPulse drafts a happy-path scenario and a
          complementary invalid-input scenario, in Given/When/Then form, so testability isn&rsquo;t
          resting on a single example you never wrote.
        </p>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          Already have acceptance criteria? Paste them in instead and QPulse scores and rewrites what you
          wrote rather than replacing it.
        </p>
      </section>

      {/* 6. Integrations */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Works with the tools your backlog already lives in
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {INTEGRATIONS.map((i) => (
              <Card key={i.name} className="p-5">
                <p className="font-semibold">{i.name}</p>
                <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">{i.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Objection handling */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Should AI be writing your user stories at all?</h2>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          A fair question, and the honest answer is: not on its own. A story is the written record of a
          conversation. Skip the conversation and you get a well formatted assumption. No model can
          interview your users, sit in your architecture review, or know that the payments team is mid
          migration. That&rsquo;s why QPulse starts from what you wrote instead of inventing a story from
          a feature name.
        </p>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          What it does well is filling the specific gaps you left &mdash; a thin benefit clause, missing
          acceptance criteria &mdash; and checking the result against the same standard every time. It
          won&rsquo;t{" "}
          <Link href="/faq#will-this-replace-refinement" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            replace refinement
          </Link>
          . Keep the thinking where it belongs, which is with your team.
        </p>
      </section>

      {/* 8. Final CTA */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Try it on a story you haven&rsquo;t finished yet</h2>
          <p className="mt-4 text-[rgb(var(--text-muted))]">
            Not a demo feature. Take the next item on your actual backlog &mdash; even a rough one-liner
            with no acceptance criteria &mdash; and see what comes back. Then check the score against your
            own judgement.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Create My Free Account
            </Link>
            <p className="text-sm text-[rgb(var(--text-muted))]">Free account, no credit card. About twenty seconds.</p>
          </div>
        </div>
      </section>

      {/* 9. Contact strip */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight">Questions about your backlog? Ask a human.</h2>
          <p className="mt-3 max-w-2xl text-sm text-[rgb(var(--text-muted))]">
            QPulse is built by {ORG.name}, which has spent years on software testing and test automation.
            If you want to talk about story quality in your team, or you hit something the tool got wrong,
            get in touch.
          </p>
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <a href={`mailto:${ORG.email}`} className="flex items-center gap-2 font-medium text-brand-600 hover:underline dark:text-brand-400">
              <Mail className="h-4 w-4" /> {ORG.email}
            </a>
            <a
              href={ORG.whatsappLink}
              target="_blank"
              rel="noopener"
              className="font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              WhatsApp {ORG.whatsappNumber}
            </a>
          </div>
          <p className="mt-4 text-xs text-[rgb(var(--text-muted))]">Usually a reply within one working day.</p>
        </Card>
      </section>

      <WhatsAppButton />
    </>
  );
}
