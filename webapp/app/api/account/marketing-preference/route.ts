import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ marketingOptIn: z.boolean() });

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { marketingOptIn: parsed.data.marketingOptIn },
      select: { marketingOptIn: true },
    });
    return NextResponse.json({ marketingOptIn: user.marketingOptIn });
  } catch (err) {
    console.error("Unexpected error in /api/account/marketing-preference:", err);
    return NextResponse.json(
      { error: "We couldn't update your preference right now. Please try again." },
      { status: 500 }
    );
  }
}
