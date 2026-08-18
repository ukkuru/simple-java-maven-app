import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getAnalysis } from "@/lib/db/history";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in to view this analysis." }, { status: 401 });
  }

  try {
    const record = await getAnalysis(params.id, session.user.id);
    if (!record) {
      return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
    }
    return NextResponse.json({ record });
  } catch (err) {
    console.error("Unexpected error in /api/history/[id]:", err);
    return NextResponse.json(
      { error: "We couldn't load that analysis right now. Please try again." },
      { status: 500 }
    );
  }
}
