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
- **Prisma** + **SQLite** for analysis history (swap `DATABASE_URL` for Postgres in production)
- **Zod** for request/response validation
- **Vitest** + **Testing Library** for unit/integration/component tests
- **lucide-react** for icons, **diff** for word-level before/after comparison

## Architecture

```
app/            routes: dashboard, analyze, history, templates, settings, api/*
components/
  analysis/     loading experience, empty state, the analyze workspace
  dashboard/    score ring, criterion cards, strengths, fixes, rewrite, comparison
  forms/        user story / acceptance criteria editors, framework selector
  layout/       sidebar, top nav, app shell, framework context
  charts/       score ring (SVG), score delta
  ui/           button, card, badge, tabs, dialog, toast, tooltip, skeleton, theme

lib/
  ai/           AnalysisProvider interface + factory (heuristic | anthropic)
  analysis/     the rule-based SMART/INVEST evaluation engine + rewriter
  scoring/      configurable weights, thresholds, weighted-average engine
  db/           Prisma client + history persistence
  validation/   Zod schemas for API input
  data/         templates + demo examples
  utils/        rate limiting, cn, date formatting, clipboard hook

prisma/         schema + seed script (5 example stories of varying quality)
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
cp .env.example .env        # already created for local dev
npx prisma db push          # create the SQLite database
npm run db:seed             # seed 5 demo stories (excellent → very poor)
npm run dev                 # http://localhost:3000
```

To use a real LLM instead of the built-in heuristic engine, set
`AI_PROVIDER=anthropic` and `AI_API_KEY=...` in `.env`.

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

## Notes on scope

This app ships with the `heuristic` provider as the default so the full
experience works with zero configuration and no external API calls. History
is stored per-deployment (not per-user) since no auth is implemented; wiring
up auth would mean scoping the Prisma `Analysis` model to a `userId` and
gating the API routes — the schema and routes are structured so that's a
small, additive change.
