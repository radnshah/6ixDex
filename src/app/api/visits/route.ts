import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// Only the admin's own browsing counts toward the journey stats - a public
// viewer opening a panel shouldn't inflate "startups visited" etc.
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { entityType, entityId } = await request.json();
  if (!entityType || !entityId) {
    return NextResponse.json(
      { error: "Missing entityType or entityId" },
      { status: 400 },
    );
  }

  await prisma.visit.upsert({
    where: { entityType_entityId: { entityType, entityId } },
    create: { entityType, entityId },
    update: {},
  });

  return NextResponse.json({ success: true });
}
