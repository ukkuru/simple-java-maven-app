import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/marketing/json-ld";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { ORG, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "User Story and Acceptance Criteria FAQ | QPulse Analyzer",
  description:
    "Definition of Ready, INVEST criteria, Gherkin acceptance criteria and story templates for Jira, Confluence and SAFe. Plain answers, worked examples.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

const FAQ_ITEMS: { id: string; question: string; answer: string }[] = [
  {
    id: "what-is-the-definition-of-ready-in-agile",
    question: "What is the Definition of Ready in agile?",
    answer:
      "The Definition of Ready in agile is the shared standard a backlog item has to meet before a team will pull it into a sprint. It is the entry gate. A workable Definition of Ready says the story has a clear user and outcome, has acceptance criteria attached, has no unresolved dependency blocking it, is small enough to finish inside one sprint, and has been sized by the people who will build it.",
  },
  {
    id: "definition-of-ready-vs-definition-of-done",
    question: "Definition of Ready vs Definition of Done: what is the difference?",
    answer:
      "The Definition of Ready is the entry gate and asks whether a story is clear enough to start. The Definition of Done is the exit gate and asks whether the work is finished enough to release. Definition of Done vs Definition of Ready is a question of direction: DoD looks at code, tests, documentation and deployment; DoR looks at clarity, sizing, dependencies and acceptance criteria. Most teams have a documented Definition of Done and an unspoken Definition of Ready — that asymmetry is why so much rework happens.",
  },
  {
    id: "what-goes-on-a-definition-of-ready-checklist",
    question: "What goes on a Definition of Ready checklist?",
    answer:
      "Here is a Definition of Ready checklist example you can copy straight into your team wiki: the story names a specific user, not “a user”; the story states an outcome, not a mechanism; acceptance criteria are attached and written as testable conditions; every dependency is either resolved or explicitly noted; the team has sized it and the size fits inside one sprint; someone other than the author has read it and understood it the same way; and QA can write at least one passing and one failing test case from it. That last line does more work than the other six combined.",
  },
  {
    id: "what-are-the-invest-criteria",
    question: "What are the INVEST criteria?",
    answer:
      "INVEST is an acronym for the six properties of a good user story: Independent, Negotiable, Valuable, Estimable, Small, Testable. Bill Wake introduced them in 2003 and they have outlasted most of what came after. Independent means it can ship alone. Negotiable means it describes the what, not the how. Valuable means someone is measurably better off. Estimable means the team has enough detail to size it. Small means it fits a sprint. Testable means a pass or fail condition exists.",
  },
  {
    id: "how-do-i-know-if-my-user-story-is-any-good",
    question: "How do I know if my user story is any good?",
    answer:
      "Read it out loud and ask three questions: who specifically benefits, what changes for them, and how would we prove it works. If you cannot answer all three from the story text alone, the story is carrying meaning in someone's head instead of on the card — meaning that does not survive a two week sprint or a handover. The formal version of this test is the INVEST criteria plus SMART acceptance criteria, which is exactly what QPulse automates.",
  },
  {
    id: "what-are-good-acceptance-criteria-for-a-login-page",
    question: "What are good acceptance criteria for a login page?",
    answer:
      "Acceptance criteria for a login page trip up more teams than almost any other feature, because everyone assumes login is obvious. It is not. A set that holds up covers: a registered user with a verified email entering correct credentials reaches their dashboard with an active session; a registered user entering an incorrect password sees an error that does not reveal whether the email exists; a registered user who fails authentication five times in ten minutes gets locked out with a reset email sent; an unverified account entering correct credentials sees a prompt to verify with a resend option; and a logged in user whose session exceeds thirty minutes of inactivity is signed out and returned to login. Notice what is covered beyond the happy path: error messaging that does not leak account existence, rate limiting, unverified state, and session expiry. A login story that only covers the happy path is roughly twenty percent of the actual work.",
  },
  {
    id: "what-is-gherkin-and-when-should-i-use-it-for-acceptance-criteria",
    question: "What is Gherkin and when should I use it for acceptance criteria?",
    answer:
      "Gherkin is the Given, When, Then syntax used by behaviour driven development tools like Cucumber and SpecFlow. Given sets the starting state, When names the action, Then states the expected result. Gherkin acceptance criteria are worth using when the behaviour has conditions, states, or edge cases, which is most of the time; they are overkill for a copy change or a colour tweak. The real benefit is not the tooling — it is that Gherkin makes vagueness impossible to hide. You cannot write “Then the system handles it appropriately” and keep a straight face.",
  },
  {
    id: "is-there-an-acceptance-criteria-checklist-i-can-use",
    question: "Is there an acceptance criteria checklist I can use?",
    answer:
      "Yes. Run every acceptance criterion through these seven checks: it describes one behaviour, not several stitched together; it is written from the user's perspective, not the system's; it has a clear pass or fail outcome with no interpretation needed; it avoids “should,” “appropriately,” “properly,” and “as expected”; it names the starting state, not just the action; it covers at least one failure path, not only the happy path; and someone who did not attend the refinement meeting could test it correctly. That last check is the honest one.",
  },
  {
    id: "how-is-smart-different-from-invest",
    question: "How is SMART different from INVEST?",
    answer:
      "INVEST evaluates the story. SMART evaluates the acceptance criteria attached to it. A story can be perfectly INVEST compliant and still ship the wrong thing because its criteria were mushy. The reverse also happens: razor sharp criteria bolted onto a story so large that nobody can estimate it. You need both, which is why QPulse scores against both rather than picking a side.",
  },
  {
    id: "do-you-have-a-user-story-template-for-jira-or-confluence",
    question: "Do you have a user story template for Jira or Confluence?",
    answer:
      "Yes, and a warning that comes with it. A Jira user story template gives you consistent fields: user, action, outcome, acceptance criteria, dependencies, sizing. A Confluence user story template gives you the same structure with more room for context and links to designs or specs. Here is the warning: a template enforces structure, not quality — a team using a perfect template will produce perfectly formatted stories that still fail four of the six INVEST criteria. Use the template for consistency. Use a scoring check for quality, not just structure.",
  },
  {
    id: "does-this-work-with-safe",
    question: "Does this work with SAFe?",
    answer:
      "Yes. A SAFe user story template follows the same “as a, I want, so that” structure, with extra context for the enabler and feature layers above it and links up to the programme increment. SAFe raises the stakes on story quality rather than changing the rules — when a single unclear story is one of two hundred in a programme increment, the cost of ambiguity multiplies across every team in the train.",
  },
  {
    id: "will-this-replace-refinement",
    question: "Will this replace refinement?",
    answer:
      "No, and be suspicious of any tool that claims it will. Refinement is where a team builds shared understanding — that conversation is the value, not the ticket that comes out of it. What QPulse removes is the first fifteen minutes of every refinement session, the part where everyone silently reads a vague story and slowly realises they read it differently.",
  },
];

export default function FaqPage() {
  const schemaItems = FAQ_ITEMS.slice(0, 12);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faqpage`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: schemaItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          User story and acceptance criteria questions, answered
        </h1>
        <p className="mt-4 text-[rgb(var(--text-muted))]">
          Straight answers to the questions BAs, QA engineers and developers actually ask about story
          quality. No theory detours. Every answer has a worked example, and where a check can be
          automated, we say so.
        </p>

        <div className="mt-10 space-y-10">
          {FAQ_ITEMS.map((item, index) => (
            <div key={item.id} id={item.id} className="scroll-mt-20">
              <h2 className="text-xl font-bold tracking-tight">
                {index + 1}. {item.question}
              </h2>
              <p className="mt-3 text-[rgb(var(--text-muted))]">{item.answer}</p>
              {item.id === "what-goes-on-a-definition-of-ready-checklist" && (
                <p className="mt-3 text-sm">
                  Run any story through QPulse and{" "}
                  <Link href="/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                    score your story against this checklist
                  </Link>
                  , not just list it.
                </p>
              )}
              {item.id === "what-are-good-acceptance-criteria-for-a-login-page" && (
                <p className="mt-3 text-sm">
                  Need the failure paths written out for you?{" "}
                  <Link
                    href="/free-ai-user-story-generator"
                    className="font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    generate acceptance criteria for login
                  </Link>{" "}
                  and QPulse writes the edge cases by default.
                </p>
              )}
              {item.id === "what-is-gherkin-and-when-should-i-use-it-for-acceptance-criteria" && (
                <p className="mt-3 text-sm">
                  QPulse validates Gherkin structure and flags conditions that are not actually testable
                  with its{" "}
                  <Link
                    href="/free-ai-user-story-generator"
                    className="font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    Gherkin acceptance criteria generator
                  </Link>
                  .
                </p>
              )}
              {item.id === "do-you-have-a-user-story-template-for-jira-or-confluence" && (
                <p className="mt-3 text-sm">
                  QPulse focuses on{" "}
                  <Link href="/" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                    quality scoring, not just structure
                  </Link>
                  , which is the gap a template alone leaves open.
                </p>
              )}
            </div>
          ))}

          <div id="what-does-qpulse-do-with-my-data" className="scroll-mt-20">
            <h2 className="text-xl font-bold tracking-tight">13. What does QPulse do with my data?</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              We store your account details and the stories and acceptance criteria you submit so your
              scores and history are there next time you sign in. Full detail on what we collect, why, how
              long we keep it, and whether any of it trains a model is in our{" "}
              <Link href="/privacy" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                privacy policy
              </Link>
              .
            </p>
          </div>

          <div id="do-i-need-an-account" className="scroll-mt-20">
            <h2 className="text-xl font-bold tracking-tight">14. Do I need an account?</h2>
            <p className="mt-3 text-[rgb(var(--text-muted))]">
              Yes, and it is free. No credit card, no trial clock, no sales call. The account exists
              because scoring one story in isolation is not the point &mdash; QPulse saves every score you
              run, so you can see whether your team&rsquo;s story quality is actually moving. Setup takes
              about twenty seconds.{" "}
              <Link href="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                Sign in
              </Link>{" "}
              or{" "}
              <Link href="/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                create a free account
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-[rgb(var(--border))] pt-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Stop looking up the checklist. Run it.</h2>
          <p className="mt-3 text-[rgb(var(--text-muted))]">
            You have read what a good story looks like. QPulse tells you whether yours is one.
          </p>
          <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg", className: "mt-6" })}>
            Create My Free Account
          </Link>
          <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">Free account, no credit card.</p>
        </div>

        <div className="mt-16 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-6 text-sm">
          <p className="font-semibold">Question not answered here?</p>
          <p className="mt-2 text-[rgb(var(--text-muted))]">
            Email{" "}
            <a href={`mailto:${ORG.email}`} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              {ORG.email}
            </a>{" "}
            or message{" "}
            <a
              href={ORG.whatsappLink}
              target="_blank"
              rel="noopener"
              className="font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              {ORG.whatsappNumber} on WhatsApp
            </a>
            . A person answers.
          </p>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
