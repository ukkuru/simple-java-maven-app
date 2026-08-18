import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { listAnalyses } from "@/lib/db/history";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in to view history." }, { status: 401 });
  }

  try {
    const records = await listAnalyses(session.user.id, 100);
    return NextResponse.json({ records });
  } catch (err) {
    console.error("Unexpected error in /api/history:", err);
    return NextResponse.json(
      { error: "We couldn't load your analysis history right now. Please try again." },
      { status: 500 }
    );
  }
}
