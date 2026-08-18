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
    "Generate agile user stories and Gherkin acceptance criteria with AI, then score them against INVEST before you commit. Free account, no credit card.",
  alternates: { canonical: PAGE_URL },
};

const OUTPUTS = [
  {
    title: "The user story",
    body: 'Written in standard agile form with a specific user, a concrete action, and a stated outcome. Not "a user" and not "use the app."',
  },
  {
    title: "Gherkin acceptance criteria",
    body: "Given, When, Then conditions covering the happy path plus the failure paths people forget. Unverified states, rate limits, timeouts, empty results.",
  },
  {
    title: "An INVEST score",
    body: "All six criteria scored separately, with the reason for every fail written in plain language.",
  },
  {
    title: "A SMART check on the criteria",
    body: "Because acceptance criteria that cannot be measured are just wishes with better formatting.",
  },
  {
    title: "A rewrite",
    body: "If the first pass falls short, you get the corrected version rather than a lecture about what is wrong with it.",
  },
];

const STEPS = [
  { id: "step-1", title: "Describe the feature", body: 'One sentence is enough. "Customers need to filter search results by price" will do.' },
  { id: "step-2", title: "Generate", body: "The user story generator tool writes the story and the acceptance criteria together, because splitting them is how they end up contradicting each other." },
  { id: "step-3", title: "Score and refine", body: "See the INVEST result, take the rewrite, or edit and re score until it clears." },
];

const INTEGRATIONS = [
  { name: "Jira", body: "Copy the story and criteria straight into a ticket, or use QPulse for Jira AI user story creation and push the scored version across without retyping it." },
  { name: "Confluence", body: "Drop scored stories into your refinement page so the whole team sees the same standard." },
  { name: "Miro", body: "Running story mapping on a board? Generate the story text in QPulse and paste it onto the card." },
  { name: "Azure DevOps and Linear", body: "Same copy and paste flow. No plugin required." },
];

const SOFTWARE_HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${PAGE_URL}#software`,
      name: "QPulse Free AI User Story Generator",
      url: PAGE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web browser",
      description:
        "Generate agile user stories and Gherkin acceptance criteria with AI, then score the result against INVEST and SMART before it enters your backlog.",
      featureList: [
        "AI user story generation",
        "Gherkin acceptance criteria generation",
        "Failure path and edge case coverage",
        "INVEST scoring of generated output",
        "Automatic rewrite of failing stories",
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
      name: "How to generate a user story with acceptance criteria using AI",
      description:
        "Turn a one sentence feature description into a complete user story with Gherkin acceptance criteria and an INVEST score.",
      totalTime: "PT1M",
      supply: [],
      tool: [{ "@type": "HowToTool", name: "QPulse Free AI User Story Generator" }],
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
              Free AI user story generator that scores what it writes
            </h1>
            <p className="mt-5 text-lg text-[rgb(var(--text-muted))]">
              Describe the feature in a sentence. This user story generator AI writes the story and the
              Gherkin acceptance criteria, then scores both against INVEST and SMART so you know what you
              are pasting into the backlog.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Create My Free Account
              </Link>
              <span className="text-sm text-[rgb(var(--text-muted))]">
                Free account, no credit card. Generate as many stories as you want.
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
              Generated from: &ldquo;customers need to filter search results by price&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-semibold">
                As a returning shopper, I want to filter search results by a price range so that I only see
                items I can afford.
              </p>
              <Badge tone="success" className="shrink-0">9 / 10</Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Given</strong> a shopper on the search results page
                <br />
                <strong>When</strong> they set a minimum and maximum price and apply it
                <br />
                <strong>Then</strong> only items within that range are shown, with the count updated
              </p>
              <p>
                <strong>Given</strong> a shopper applies a price range with no matching items
                <br />
                <strong>When</strong> the filter runs
                <br />
                <strong>Then</strong> an empty state explains no items matched and offers to clear the filter
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 2. Differentiator */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Generating a story is the easy part</h2>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            Any language model can turn &ldquo;password reset&rdquo; into a sentence starting with
            &ldquo;As a user.&rdquo; That is not the hard problem. The hard problem is that the sentence
            looks finished.
          </p>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            A generated story arrives polished. Correct grammar, right structure, confident tone. It reads
            like something a senior BA wrote. Then it goes into the backlog, and three weeks later a
            developer finds it was independent of nothing, sized by nobody, and testable in theory only.
          </p>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            Fluent output is not the same as a good requirement. QPulse closes that gap by scoring every
            story it generates against{" "}
            <Link href="/" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              how INVEST scoring works
            </Link>{" "}
            &mdash; the same checks it would apply to a story you wrote yourself. If the generated version
            fails, you see the failure before it reaches your board, not after.
          </p>
        </div>
      </section>

      {/* 3. What you get */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          One sentence in, a complete backlog item out
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OUTPUTS.map((o) => (
            <Card key={o.title} className="p-5">
              <p className="font-semibold">{o.title}</p>
              <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">{o.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Acceptance criteria generator */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            An acceptance criteria generator that writes the failure paths too
          </h2>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            Ask most tools for acceptance criteria and you get the happy path. User does the right thing,
            system responds correctly, everyone goes home.
          </p>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            Real defects do not live there. They live in the fifth login attempt, the expired session, the
            empty search result, the network drop halfway through an upload. This AI acceptance criteria
            generator writes those cases by default, the same way you would want{" "}
            <Link href="/faq#what-are-good-acceptance-criteria-for-a-login-page" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              good acceptance criteria for a login page
            </Link>{" "}
            to cover more than a correct password.
          </p>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            You can also skip generation entirely and paste criteria you already wrote. QPulse scores those
            the same way.
          </p>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Three steps in an online user story generator that does not need setup
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
            Generate My First Story
          </Link>
          <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">
            Everything here is free with an account. No credit card, and no limit you will hit on your
            first afternoon.
          </p>
        </div>
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
          migration.
        </p>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          What AI does well is the first draft and the checking. Blank page to working draft in ten
          seconds, then a consistent quality check applied to every story instead of only the ones someone
          had energy to review that day. Use this as an ai agile user story generator for the draft and
          the audit, and see for yourself whether it&nbsp;
          <Link href="/faq#will-this-replace-refinement" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            will this replace refinement
          </Link>
          . It does not &mdash; keep the thinking where it belongs, which is with your team.
        </p>
      </section>

      {/* 8. Final CTA */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Try the AI user story writer on something real</h2>
          <p className="mt-4 text-[rgb(var(--text-muted))]">
            Not a demo feature. Take the next item on your actual backlog, describe it in one line, and see
            what comes back. Then check the score against your own judgement. If QPulse is wrong, you will
            know in ten seconds. If it is right, you just saved a refinement session.
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
