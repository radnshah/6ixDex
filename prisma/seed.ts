import fs from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

interface GeoPoint {
  lat: number;
  lng: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function splitLocation(entity: any): any {
  const { location, ...rest } = entity;
  return { ...rest, lat: location.lat, lng: location.lng };
}

async function main() {
  const dbPath = path.join(__dirname, "..", "data", "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  for (const organization of data.organizations) {
    const record = splitLocation(organization);
    await prisma.organization.upsert({
      where: { entityId: organization.entityId },
      create: record,
      update: record,
    });
  }

  for (const person of data.people) {
    await prisma.person.upsert({
      where: { entityId: person.entityId },
      create: person,
      update: person,
    });
  }

  for (const place of data.places) {
    const record = splitLocation(place);
    await prisma.place.upsert({
      where: { entityId: place.entityId },
      create: record,
      update: record,
    });
  }

  for (const event of data.events) {
    const record = splitLocation(event);
    await prisma.event.upsert({
      where: { entityId: event.entityId },
      create: record,
      update: record,
    });
  }

  for (const content of data.content) {
    await prisma.content.upsert({
      where: { entityId: content.entityId },
      create: content,
      update: content,
    });
  }

  for (const journal of data.journal) {
    await prisma.journal.upsert({
      where: { entityId: journal.entityId },
      create: journal,
      update: journal,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
