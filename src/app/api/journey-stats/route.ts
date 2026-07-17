import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function GET() {
  const [earliestAdmin, startupsVisited, eventsAttended, peopleMet, contentCreated] =
    await Promise.all([
      prisma.userProfile.findFirst({
        where: { role: "ADMIN" },
        orderBy: { createdAt: "asc" },
      }),
      prisma.visit.count({ where: { entityType: "organization" } }),
      prisma.visit.count({ where: { entityType: "event" } }),
      prisma.visit.count({ where: { entityType: "person" } }),
      prisma.content.count(),
    ]);

  const daysOnJourney = earliestAdmin
    ? Math.max(
        1,
        Math.floor((Date.now() - earliestAdmin.createdAt.getTime()) / MS_PER_DAY) + 1,
      )
    : 1;

  return NextResponse.json({
    daysOnJourney,
    startupsVisited,
    eventsAttended,
    peopleMet,
    contentCreated,
  });
}
