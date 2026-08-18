import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { authOptions } from "@/lib/auth/options";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/marketing/json-ld";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { ORG, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "User Story Quality Analyzer | INVEST and SMART Scoring",
  description:
    "Paste any user story and get an instant quality score against INVEST and SMART, plus the exact rewrite. Built for BAs, QA and engineers. Free to try.",
  alternates: { canonical: `${SITE_URL}/` },
};

const SOFTWARE_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "QPulse User Story Quality Analyzer",
  url: `${SITE_URL}/`,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Requirements Quality Analysis",
  operatingSystem: "Web browser",
  description:
    "QPulse scores user stories and acceptance criteria against the INVEST and SMART criteria, shows which criterion fails and why, and returns a corrected version.",
  featureList: [
    "INVEST criteria scoring for user stories",
    "SMART scoring for acceptance criteria",
    "Gherkin Given When Then validation",
    "Automated story rewrite",
    "Definition of Ready checks",
    "Batch backlog analysis",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free account required. No credit card. Saves every score so teams can track story quality over time.",
  },
  publisher: { "@id": `${SITE_URL}/#organization` },
  audience: {
    "@type": "Audience",
    audienceType: "Business analysts, QA engineers, product engineers and developers",
  },
  inLanguage: "en",
};

const PROBLEM_BULLETS = [
  "A developer starts building and stops within an hour to ask what the story actually meant",
  "QA writes test cases and finds there is nothing testable in the acceptance criteria",
  "The BA gets pulled into a call to explain a story they wrote nine days ago",
];

const INVEST_ITEMS = [
  { letter: "I", name: "Independent", question: "Can this ship on its own, or is it quietly waiting on three other tickets?" },
  { letter: "N", name: "Negotiable", question: "Does it describe an outcome, or has someone already written the solution into it?" },
  { letter: "V", name: "Valuable", question: 'Can you name who is better off when this ships? If the answer is "the backend," flag it.' },
  { letter: "E", name: "Estimable", question: "Is there enough here to size, or will the team guess and call it a five?" },
  { letter: "S", name: "Small", question: "Will this fit in a sprint, or is it an epic wearing a story costume?" },
  { letter: "T", name: "Testable", question: "Can QA write a passing and a failing case from this? If not, it is not done, it is just closed." },
];

const STEPS = [
  { title: "Paste", body: "Drop in a user story, an acceptance criterion, or a whole batch from your backlog." },
  { title: "Score", body: "QPulse checks it against INVEST and SMART and shows which criteria failed and why." },
  { title: "Rewrite", body: "Take the suggested version, or edit it and re score until it clears." },
];

const AUDIENCE = [
  { role: "Business analysts", body: "Stop defending stories in a call nine days after you wrote them. Catch the gap before it ships to the board." },
  { role: "QA engineers", body: "Get acceptance criteria you can actually build test cases from, without chasing the author for a week." },
  { role: "Product engineers", body: "Know before you branch whether the ticket has enough in it to finish." },
  { role: "Developers", body: "Spot the epic pretending to be a story before it eats your sprint." },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <>
      <JsonLd data={SOFTWARE_APPLICATION_SCHEMA} />

      {/* 1. Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              &ldquo;As a user, I want&hellip;&rdquo; is where most stories start. It is also where most of
              them go wrong.
            </h1>
            <p className="mt-5 text-lg text-[rgb(var(--text-muted))]">
              QPulse scores any user story or acceptance criteria against INVEST and SMART, tells you
              exactly which criterion it fails, and rewrites it for you. No more finding out in sprint
              planning.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Score My First Story
              </Link>
              <span className="text-sm text-[rgb(var(--text-muted))]">
                Free account. No credit card. Takes about twenty seconds to set up.
              </span>
            </div>
          </div>

          <Card className="animate-fade-in p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">As a user, I want to log in so that I can use the app.</p>
              <Badge tone="danger" className="shrink-0">4 / 10</Badge>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
                <span>
                  <strong>Valuable</strong> &mdash; &ldquo;use the app&rdquo; is not a benefit.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
                <span>
                  <strong>Testable</strong> &mdash; nothing here converts into a test case.
                </span>
              </li>
            </ul>
            <div className="my-4 border-t border-dashed border-[rgb(var(--border))]" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                As a returning customer, I want to sign in with my email and password so that I can see my
                saved orders.
              </p>
              <Badge tone="success" className="shrink-0">9 / 10</Badge>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
                <span>Specific persona, concrete outcome, Given/When/Then attached.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 2. The problem */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Everyone approved the story. Nobody agreed on it.
          </h2>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            The story passed refinement. Three people gave a thumbs up. Then the developer builds one
            thing, QA tests another, and the BA meant a third. Now you are four days into the sprint
            arguing about what &ldquo;log in&rdquo; was supposed to include.
          </p>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            The story was never the problem. The story was vague, and vague reads as agreement. Ambiguity
            does not announce itself. It looks exactly like consensus right up until someone writes code.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {PROBLEM_BULLETS.map((bullet) => (
              <li key={bullet} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 text-sm">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. INVEST scoring */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          User story INVEST criteria, scored line by line
        </h2>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          INVEST &mdash; Independent, Negotiable, Valuable, Estimable, Small, Testable &mdash; has been the
          standard for good stories since Bill Wake{" "}
          <Link href="/faq#what-are-the-invest-criteria" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            wrote the INVEST criteria
          </Link>{" "}
          in 2003. Every agile coach can recite them. Almost no team applies them consistently, because
          applying them by hand to forty stories in a refinement session is not realistic.
        </p>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          QPulse runs the INVEST criteria against your story in seconds and shows you the result per
          letter, not as one vague number. QPulse also scores against SMART for acceptance criteria, so
          you get both the shape of the story and the sharpness of the conditions attached to it.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INVEST_ITEMS.map((item) => (
            <Card key={item.letter} className="p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {item.letter}
                </span>
                <p className="font-semibold">{item.name}</p>
              </div>
              <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">{item.question}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/register" className={buttonVariants({ variant: "outline" })}>
            See INVEST Scoring on My Story
          </Link>
        </div>
      </section>

      {/* 4. Before / after */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            An example user story, scored and rewritten
          </h2>
          <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
            Here is a real user story example of the kind that passes refinement every day.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">Before</p>
                <Badge tone="danger">Score 4 / 10</Badge>
              </div>
              <p className="mt-3 text-sm italic">
                &ldquo;As a user, I want to be able to log in so that I can use the app.&rdquo;
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" /> Independent &mdash; Pass</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" /> Negotiable &mdash; Pass</li>
                <li className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" /> Valuable &mdash; Fail. &ldquo;Use the app&rdquo; is not a benefit.</li>
                <li className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" /> Estimable &mdash; Fail. No auth method, error states, or session handling.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" /> Small &mdash; Pass</li>
                <li className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" /> Testable &mdash; Fail. Nothing here converts into a test case.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">After</p>
                <Badge tone="success">Score 9 / 10</Badge>
              </div>
              <p className="mt-3 text-sm italic">
                &ldquo;As a returning customer, I want to sign in with my email and password so that I can
                see my saved orders without re entering my details.&rdquo;
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <strong>Given</strong> a registered customer with a verified email
                  <br />
                  <strong>When</strong> they submit a correct email and password
                  <br />
                  <strong>Then</strong> they land on the orders page with their saved order history visible
                </p>
                <p>
                  <strong>Given</strong> a registered customer
                  <br />
                  <strong>When</strong> they submit an incorrect password three times
                  <br />
                  <strong>Then</strong> the account locks for fifteen minutes and a reset link is emailed
                </p>
              </div>
            </Card>
          </div>

          <p className="mt-6 text-sm text-[rgb(var(--text-muted))]">
            Same feature. One of them starts an argument in sprint planning. The other one gets built. Or
            skip the manual rewrite and{" "}
            <Link href="/free-ai-user-story-generator" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              generate a user story with AI
            </Link>{" "}
            that already scores this way.
          </p>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Three steps, no setup</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {i + 1}
              </span>
              <p className="mt-3 font-semibold">{step.title}</p>
              <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Who it is for */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Built for the people who pay for a bad story
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map((a) => (
              <Card key={a.role} className="p-5">
                <p className="font-semibold">{a.role}</p>
                <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">{a.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Requirements quality positioning */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Requirements quality is measurable. Most teams just never measure it.
        </h2>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          Every other part of your delivery pipeline has a gate. Code has review. Builds have tests.
          Deploys have checks. The requirement, which is the input to all of it, goes through on a nod in
          a thirty minute meeting.
        </p>
        <p className="mt-4 max-w-3xl text-[rgb(var(--text-muted))]">
          QPulse gives that input a number. Not to gatekeep your team, but so that &ldquo;this story is not
          ready&rdquo; stops being one person&rsquo;s opinion and starts being something you can point at
          &mdash; the same standard behind the{" "}
          <Link href="/faq#what-is-the-definition-of-ready-in-agile" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Definition of Ready in agile
          </Link>
          .
        </p>
      </section>

      {/* 8. Final CTA */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Score your next story before your next refinement
          </h2>
          <p className="mt-4 text-[rgb(var(--text-muted))]">
            Bring one story. The one you already suspect is vague. QPulse will tell you in nine seconds
            whether you were right.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Create My Free Account
            </Link>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Free account, no credit card. Your scores save automatically so you can watch your backlog
              improve sprint over sprint.
            </p>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                Sign in
              </Link>
            </p>
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
