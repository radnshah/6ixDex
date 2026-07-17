import { prisma } from "@/lib/prisma";
import type {
  Content,
  Event,
  Journal,
  Organization,
  Person,
  Place,
} from "@/types/entities";

export type EntityTypeKey =
  | "organizations"
  | "people"
  | "places"
  | "events"
  | "content"
  | "journal";

interface EntityTypeMap {
  organizations: Organization;
  people: Person;
  places: Place;
  events: Event;
  content: Content;
  journal: Journal;
}

const ID_PREFIXES: Record<EntityTypeKey, string> = {
  organizations: "org",
  people: "person",
  places: "place",
  events: "event",
  content: "content",
  journal: "journal",
};

// These entity types store location as separate lat/lng columns; the app
// shape nests them as `location: { lat, lng }`.
const LOCATION_TYPES = new Set<EntityTypeKey>(["organizations", "places", "events"]);

function toApp(
  type: EntityTypeKey,
  row: Record<string, unknown>,
): Record<string, unknown> {
  if (!LOCATION_TYPES.has(type)) return row;
  const { lat, lng, ...rest } = row;
  return { ...rest, location: { lat, lng } };
}

function toDb(
  type: EntityTypeKey,
  data: Record<string, unknown>,
): Record<string, unknown> {
  if (!LOCATION_TYPES.has(type) || !("location" in data)) return data;
  const { location, ...rest } = data as {
    location: { lat: number; lng: number };
    [key: string]: unknown;
  };
  return { ...rest, lat: location.lat, lng: location.lng };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(type: EntityTypeKey): any {
  switch (type) {
    case "organizations":
      return prisma.organization;
    case "people":
      return prisma.person;
    case "places":
      return prisma.place;
    case "events":
      return prisma.event;
    case "content":
      return prisma.content;
    case "journal":
      return prisma.journal;
  }
}

function generateEntityId(type: EntityTypeKey, name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${ID_PREFIXES[type]}-${slug || "entry"}-${suffix}`;
}

export async function listEntities<K extends EntityTypeKey>(
  type: K,
): Promise<EntityTypeMap[K][]> {
  const rows = await getModel(type).findMany();
  return rows.map((row: Record<string, unknown>) => toApp(type, row)) as EntityTypeMap[K][];
}

export async function getEntity<K extends EntityTypeKey>(
  type: K,
  entityId: string,
): Promise<EntityTypeMap[K] | undefined> {
  const row = await getModel(type).findUnique({ where: { entityId } });
  return row ? (toApp(type, row) as unknown as EntityTypeMap[K]) : undefined;
}

export async function createEntity(
  type: EntityTypeKey,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const entityId = generateEntityId(type, String(data.name ?? "entry"));
  const record = { ...toDb(type, data), entityId };
  const created = await getModel(type).create({ data: record });
  return toApp(type, created);
}

export async function updateEntity(
  type: EntityTypeKey,
  entityId: string,
  data: Record<string, unknown>,
): Promise<Record<string, unknown> | undefined> {
  try {
    const updated = await getModel(type).update({
      where: { entityId },
      data: toDb(type, data),
    });
    return toApp(type, updated);
  } catch {
    return undefined;
  }
}

export async function deleteEntity(
  type: EntityTypeKey,
  entityId: string,
): Promise<boolean> {
  try {
    await getModel(type).delete({ where: { entityId } });
    return true;
  } catch {
    return false;
  }
}
