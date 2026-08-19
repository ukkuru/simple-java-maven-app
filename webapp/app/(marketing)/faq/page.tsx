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
      "The Definition of Ready in agile is the standard a backlog item has to meet before a team pulls it into a sprint. Think of it as the entry gate. A good Definition of Ready says the story has a clear user and a clear outcome. It has acceptance criteria attached. Nothing is blocking it. It is small enough to finish in one sprint. And the people who will build it have already sized it.",
  },
  {
    id: "definition-of-ready-vs-definition-of-done",
    question: "Definition of Ready vs Definition of Done: what is the difference?",
    answer:
      "The Definition of Ready is the entry gate. It asks if a story is clear enough to start. The Definition of Done is the exit gate. It asks if the work is finished enough to release. So Definition of Done vs Definition of Ready comes down to direction: DoD checks code, tests, docs, and deployment. DoR checks clarity, sizing, dependencies, and acceptance criteria. Most teams write down their Definition of Done but never write down their Definition of Ready. That gap is where a lot of rework starts.",
  },
  {
    id: "what-goes-on-a-definition-of-ready-checklist",
    question: "What goes on a Definition of Ready checklist?",
    answer:
      "Here is a Definition of Ready checklist example you can copy into your team wiki. The story names a real user, not just “a user.” It states an outcome, not a mechanism. Acceptance criteria are attached and written as testable conditions. Every dependency is resolved or written down. The team has sized it, and it fits in one sprint. Someone other than the author has read it and understood it the same way. And QA can write at least one passing and one failing test case from it. That last line does more work than the other six put together.",
  },
  {
    id: "what-are-the-invest-criteria",
    question: "What are the INVEST criteria?",
    answer:
      "INVEST is an acronym for six things a good user story should be: Independent, Negotiable, Valuable, Estimable, Small, Testable. Bill Wake introduced them in 2003, and they have outlasted most of what came after. Independent means it can ship on its own. Negotiable means it describes the what, not the how. Valuable means someone is clearly better off. Estimable means the team has enough detail to size it. Small means it fits in a sprint. Testable means there is a clear pass or fail condition.",
  },
  {
    id: "how-do-i-know-if-my-user-story-is-any-good",
    question: "How do I know if my user story is any good?",
    answer:
      "Read it out loud and ask three questions. Who specifically benefits? What changes for them? How would we prove it works? If you can't answer all three from the story text alone, the story is relying on something in your head instead of on the card. That kind of meaning does not survive a two-week sprint or a handover to someone new. The formal version of this test is the INVEST criteria plus SMART acceptance criteria, which is exactly what QPulse checks for you.",
  },
  {
    id: "what-are-good-acceptance-criteria-for-a-login-page",
    question: "What are good acceptance criteria for a login page?",
    answer:
      "Acceptance criteria for a login page trip up more teams than almost any other feature, because everyone assumes login is obvious. It isn't. A solid set covers more than the happy path. A registered user with a verified email who enters the right credentials should land on their dashboard with an active session. A registered user who enters the wrong password should see an error that doesn't reveal whether the email exists at all. A user who fails five login attempts in ten minutes should get locked out, with a reset email sent automatically. An unverified account with correct credentials should see a prompt to verify, with an option to resend. And a logged-in user whose session sits idle for thirty minutes should get signed out and sent back to login. Notice what that covers beyond the happy path: error messages that don't leak account details, rate limiting, unverified accounts, and session timeouts. A login story that only covers the happy path is about twenty percent of the real work.",
  },
  {
    id: "what-is-gherkin-and-when-should-i-use-it-for-acceptance-criteria",
    question: "What is Gherkin and when should I use it for acceptance criteria?",
    answer:
      "Gherkin is the Given, When, Then format used by behavior-driven tools like Cucumber and SpecFlow. Given sets the starting state, When names the action, and Then states what should happen. Use Gherkin acceptance criteria whenever the behavior has conditions, states, or edge cases, which is most of the time. It's overkill for a copy change or a color tweak. The real value isn't the format itself. It's that Gherkin makes it hard to hide vague thinking. You can't write “Then the system handles it appropriately” in Given/When/Then form and still sound specific.",
  },
  {
    id: "is-there-an-acceptance-criteria-checklist-i-can-use",
    question: "Is there an acceptance criteria checklist I can use?",
    answer:
      "Yes. Check every acceptance criterion against these seven things. Does it describe one behavior, not several stitched together? Is it written from the user's point of view, not the system's? Does it have a clear pass or fail outcome, with no room for interpretation? Does it avoid vague words like “should,” “appropriately,” “properly,” and “as expected”? Does it name the starting state, not just the action? Does it cover at least one failure case, not only the happy path? And could someone who wasn't in the refinement meeting test it correctly? That last one is the honest test.",
  },
  {
    id: "how-is-smart-different-from-invest",
    question: "How is SMART different from INVEST?",
    answer:
      "INVEST checks the story itself. SMART checks the acceptance criteria attached to it. A story can pass every INVEST check and still ship the wrong thing because its criteria were mushy. The opposite happens too: sharp, specific criteria bolted onto a story so big nobody can estimate it. You need both checks, which is why QPulse scores against both instead of picking one.",
  },
  {
    id: "do-you-have-a-user-story-template-for-jira-or-confluence",
    question: "Do you have a user story template for Jira or Confluence?",
    answer:
      "Yes, with a warning attached. A Jira user story template gives you consistent fields: user, action, outcome, acceptance criteria, dependencies, sizing. A Confluence user story template gives you the same structure with more room for context and links to designs. Here's the warning: a template enforces structure, not quality. A team using a perfect template can still produce stories that fail four of the six INVEST criteria, just neatly formatted. Use the template for consistency. Use a scoring check for actual quality.",
  },
  {
    id: "does-this-work-with-safe",
    question: "Does this work with SAFe?",
    answer:
      "Yes. A SAFe user story template follows the same “as a, I want, so that” structure, with extra context for the enabler and feature layers above it and links up to the program increment. SAFe raises the stakes on story quality rather than changing the rules. When one unclear story sits among two hundred others in a program increment, the cost of that ambiguity multiplies across every team in the train.",
  },
  {
    id: "will-this-replace-refinement",
    question: "Will this replace refinement?",
    answer:
      "No, and you should be suspicious of any tool that claims it will. Refinement is where a team builds shared understanding, and that conversation is the real value, not the ticket that comes out of it. What QPulse removes is the first fifteen minutes of every refinement session, the part where everyone silently reads a vague story and slowly realizes they each read it differently.",
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
          Straight answers to the questions BAs, QA engineers, and developers actually ask about story
          quality. No theory detours. Every answer has a real example, and if QPulse can check it
          automatically, we say so.
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
                    href="/#acceptance-criteria-generator"
                    className="font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    QPulse drafts the edge cases automatically
                  </Link>{" "}
                  when you leave acceptance criteria blank.
                </p>
              )}
              {item.id === "what-is-gherkin-and-when-should-i-use-it-for-acceptance-criteria" && (
                <p className="mt-3 text-sm">
                  QPulse checks your Gherkin structure and flags conditions that aren&rsquo;t actually
                  testable. If you didn&rsquo;t write any,{" "}
                  <Link
                    href="/#acceptance-criteria-generator"
                    className="font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    it writes a full Given/When/Then scenario pair
                  </Link>{" "}
                  for you.
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
              Yes, and it is free. No credit card, no trial clock, no sales call. Scoring one story on its
              own isn&rsquo;t really the point. QPulse saves every score you run, so you can see whether
              your team&rsquo;s story quality is actually improving. Setup takes about twenty seconds.{" "}
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
