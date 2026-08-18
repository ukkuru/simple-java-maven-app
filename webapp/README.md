# User Story Quality Analyzer

A production-quality web application that analyzes User Stories and Acceptance
Criteria against the **SMART** or **INVEST** frameworks, and returns a
weighted quality score, a criterion-by-criterion breakdown, prioritized
fixes, and an automatically rewritten story with improved acceptance
criteria — built for Product Managers, Business Analysts, Product Owners, QA
Engineers, and developers.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **React 18**
- **Tailwind CSS** with a hand-rolled shadcn-style component set (`components/ui`)
- **NextAuth.js** (email/password + Google OAuth) for authentication
- **Prisma** + **SQLite** for users and analysis history (swap `DATABASE_URL` for Postgres in production)
- **Zod** for request/response validation
- **Vitest** + **Testing Library** for unit/integration/component tests
- **lucide-react** for icons, **diff** for word-level before/after comparison

## Architecture

```
app/
  login/, register/       public auth pages
  (app)/                  authenticated route group (dashboard, analyze, history,
                           templates, settings) — its layout redirects to /login
                           when there's no session
  api/auth/[...nextauth]/ NextAuth route handler
  api/register/           email/password sign-up endpoint
  api/account/            account preference endpoints (marketing opt-in)
  api/analyze, api/history, api/templates

components/
  auth/         login/register forms, Google button, marketing consent notice,
                 auth shell layout, marketing preference toggle
  analysis/     loading experience, empty state, the analyze workspace
  dashboard/    score ring, criterion cards, strengths, fixes, rewrite, comparison
  forms/        user story / acceptance criteria editors, framework selector
  layout/       sidebar, top nav, user menu, app shell, framework context, copyright
  charts/       score ring (SVG), score delta
  ui/           button, card, badge, input, tabs, dialog, toast, tooltip, skeleton, theme

lib/
  auth/         NextAuth options (Credentials + Google providers, Prisma adapter)
  ai/           AnalysisProvider interface + factory (heuristic | anthropic)
  analysis/     the rule-based SMART/INVEST evaluation engine + rewriter
  scoring/      configurable weights, thresholds, weighted-average engine
  db/           Prisma client + history persistence (scoped per user)
  validation/   Zod schemas for API input (analyze requests, auth forms)
  data/         templates + demo examples
  utils/        rate limiting, cn, date formatting, clipboard hook

prisma/         schema (User/Account/Session + Analysis) + seed script
types/          shared TypeScript types (AnalysisResult, Template, ...)
tests/          Vitest unit, integration, and component tests
```

The **AI layer is fully decoupled from the UI**: every route calls
`getAnalysisProvider()` from `lib/ai`, which returns whichever provider is
configured via environment variables and implements a single
`analyze(input): Promise<AnalysisResult>` method. Swapping models/vendors
means adding one class + one branch in the factory — nothing else changes.

## AI provider configuration

```bash
AI_PROVIDER=heuristic   # "heuristic" (default, no API key needed) | "anthropic"
AI_API_KEY=             # required when AI_PROVIDER=anthropic
AI_MODEL=claude-sonnet-4-5
```

- **`heuristic`** (default): a deterministic, rule-based analysis engine
  (`lib/analysis`) that requires no external API and always works. It parses
  the "As a / I want / so that" structure, detects vague terminology,
  measurable/testable acceptance criteria, bundled scope ("and" chains,
  multiple personas), dependencies, and time constraints, then computes
  scores from the same weighted-average engine used everywhere else.
- **`anthropic`**: calls the Claude API with a dedicated system prompt
  (`lib/ai/prompt.ts`) that constrains the model to the supplied story only,
  requires evidence per score, and returns structured JSON. The response is
  validated against a strict Zod schema (`lib/ai/schema.ts`); an invalid
  response triggers one corrective retry before surfacing a friendly error.

API keys are read from `process.env` on the server only and are never sent
to the browser.

## Authentication

Sign-up requires either an email address and password, or a Google account.
Both flows share the same `NextAuthOptions` config (`lib/auth/options.ts`) and
the same `User`/`Account`/`Session` Prisma models, so history and settings
work identically regardless of how someone signed in.

- **Email/password**: `app/api/register/route.ts` validates input, hashes the
  password with bcrypt, and creates the user. Sign-in goes through NextAuth's
  Credentials provider, which compares the hash.
- **Google**: enabled automatically once `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` are set — the Google button is hidden on the
  login/register pages until both are configured. Create OAuth credentials at
  https://console.cloud.google.com/apis/credentials with an authorized
  redirect URI of `<NEXTAUTH_URL>/api/auth/callback/google`.
- **Route protection**: `app/(app)/layout.tsx` checks the session
  server-side and redirects to `/login` if there isn't one; every API route
  that touches user data (`/api/analyze`, `/api/history*`,
  `/api/account/marketing-preference`) independently checks
  `getServerSession` and returns `401` otherwise. Analyses are scoped to
  `userId` end-to-end, so one account never sees another's history — enforced
  both in the Prisma queries and in the seed/tests.

```bash
NEXTAUTH_SECRET=   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Marketing email consent

The registration form and the account settings page both disclose, in plain
language, that the account email address may be used for marketing
communications in addition to account/service email. Registration includes
an explicit opt-in checkbox (`marketingOptIn`, default **off**); users can
change their preference anytime from **Settings → Account** via
`PATCH /api/account/marketing-preference`. Google sign-ups also default to
opted-out and can opt in from the same Settings toggle, since there's no
form step in the OAuth flow to show the checkbox.

### Demo login

The seed script creates a demo account so you can sign in immediately after
`npm run db:seed`:

```
email:    demo@testmetry.com
password: demo12345
```

## Scoring methodology

Overall score = **weighted average of the applicable criteria** for the
selected framework, using the weights configured in
`lib/scoring/config.ts` (not hard-coded in the UI). A criterion marked
**Not Applicable** (e.g. SMART's *Time-bound* when no timing constraint is
relevant) is excluded and its weight is redistributed proportionally across
the rest — see the Settings page for the live weight table and score bands.

## Getting started

```bash
npm install
cp .env.example .env                        # already created for local dev
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
npx prisma db push                           # create the SQLite database
npm run db:seed                              # seed a demo user + 5 demo stories
npm run dev                                  # http://localhost:3000
```

Sign in with the demo account above, or register a new one. To use a real
LLM instead of the built-in heuristic engine, set `AI_PROVIDER=anthropic` and
`AI_API_KEY=...` in `.env`. To enable Google sign-in, set `GOOGLE_CLIENT_ID`
and `GOOGLE_CLIENT_SECRET` (see **Authentication** above).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint (Next.js config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run db:seed` | Reseed demo data (also available via `prisma db seed`) |

## Testing

`tests/` covers:

- **Scoring** — weighted-average math, rounding, boundaries, not-applicable
  redistribution, score-band labeling (`tests/scoring.test.ts`)
- **Analysis engine** — schema shape for both frameworks, Time-bound
  applicability, empty-acceptance-criteria handling, scope/vagueness
  detection, and that rewrites preserve persona/intent
  (`tests/analysis.test.ts`)
- **Components** — framework selection, form validation/character limits,
  copy-to-clipboard, "Use This Version" (`tests/framework-selector.test.tsx`,
  `tests/text-editor-field.test.tsx`, `tests/rewritten-story-section.test.tsx`)
- **End-to-end analyze flow** — empty state → validation → analyze →
  results rendering → edit → re-analyze → score delta, with `fetch` mocked
  against the real heuristic engine (`tests/analyze-flow.test.tsx`)
- **Auth validation** — registration/login schema rules: password
  confirmation, minimum length, email format/normalization, marketing
  opt-in default (`tests/auth-validation.test.ts`)

Auth itself (session creation, cross-user data isolation, the marketing
preference toggle) was verified manually end-to-end against a running server
(register → sign in → analyze → sign out → sign in as a second account →
confirm history and story access are isolated per user, and a 404 rather
than a 401/403 is returned for another user's record so existence isn't
leaked) rather than through NextAuth-mocked component tests, since NextAuth's
server-only session/JWT machinery does not lend itself well to Vitest's
jsdom environment.

## Notes on scope

This app ships with the `heuristic` provider as the default so the full
experience works with zero configuration and no external API calls beyond
authentication. Every analysis, and every dashboard/history view, is scoped
to the signed-in user's `userId` in the database and in the API layer.
