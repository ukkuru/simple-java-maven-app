import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/db/history";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const record = await getAnalysis(params.id);
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
