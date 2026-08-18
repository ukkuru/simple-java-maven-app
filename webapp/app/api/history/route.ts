import { NextResponse } from "next/server";
import { listAnalyses } from "@/lib/db/history";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await listAnalyses(100);
    return NextResponse.json({ records });
  } catch (err) {
    console.error("Unexpected error in /api/history:", err);
    return NextResponse.json(
      { error: "We couldn't load your analysis history right now. Please try again." },
      { status: 500 }
    );
  }
}
