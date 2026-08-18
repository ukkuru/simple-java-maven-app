import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { analyzeRequestSchema } from "@/lib/validation/analyze";
import { getAnalysisProvider, AnalysisProviderError } from "@/lib/ai";
import { saveAnalysis } from "@/lib/db/history";
import { checkRateLimit } from "@/lib/utils/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in to analyze a user story." }, { status: 401 });
  }

  const limitPerMinute = Number(process.env.ANALYZE_RATE_LIMIT_PER_MINUTE || 20);
  const rate = checkRateLimit(`analyze:${clientKey(req)}`, limitPerMinute);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "You're analyzing stories a bit too fast. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": Math.ceil((rate.resetAt - Date.now()) / 1000).toString() } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const { userStory, acceptanceCriteria, framework, previousScore } = parsed.data;

  try {
    const provider = getAnalysisProvider();
    const result = await provider.analyze({ userStory, acceptanceCriteria, framework });

    const saved = await saveAnalysis({
      userId: session.user.id,
      userStory,
      acceptanceCriteria,
      framework,
      result,
      previousScore: previousScore ?? null,
    });

    return NextResponse.json({ result, record: saved });
  } catch (err) {
    if (err instanceof AnalysisProviderError) {
      const status = err.code === "rate_limited" ? 429 : err.code === "not_configured" ? 500 : 502;
      const message =
        err.code === "not_configured"
          ? "The analysis service isn't configured correctly. Please contact your administrator."
          : err.code === "timeout"
            ? "The analysis is taking longer than expected. Please try again."
            : err.code === "rate_limited"
              ? "The AI provider is currently rate limited. Please try again shortly."
              : "We couldn't generate a valid analysis this time. Please try again.";
      return NextResponse.json({ error: message }, { status });
    }

    // Never leak internal error details to the client.
    console.error("Unexpected error in /api/analyze:", err);
    return NextResponse.json(
      { error: "Something went wrong while analyzing your story. Please try again." },
      { status: 500 }
    );
  }
}
