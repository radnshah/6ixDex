import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Anonymous, no auth required - low friction is the point.
export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  await prisma.waitlistEntry.upsert({
    where: { email: email.trim().toLowerCase() },
    create: { email: email.trim().toLowerCase() },
    update: {},
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

// Only the admin can see who's signed up.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries);
}
