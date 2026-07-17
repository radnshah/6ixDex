import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// Anonymous, no auth required - low friction is the point.
export async function POST(request: NextRequest) {
  const { type, description, contactInfo } = await request.json();

  if (!type || !description || typeof description !== "string" || !description.trim()) {
    return NextResponse.json(
      { error: "Missing type or description" },
      { status: 400 },
    );
  }

  const suggestion = await prisma.suggestion.create({
    data: {
      type: String(type).slice(0, 100),
      description: String(description).slice(0, 2000),
      contactInfo: contactInfo ? String(contactInfo).slice(0, 200) : undefined,
    },
  });

  return NextResponse.json({ id: suggestion.id }, { status: 201 });
}

// The suggestion inbox is private - only the admin can see what's been sent in.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(suggestions);
}
