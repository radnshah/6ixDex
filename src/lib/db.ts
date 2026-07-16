import fs from "fs/promises";
import path from "path";
import type {
  Content,
  Event,
  Journal,
  Organization,
  Person,
  Place,
} from "@/types/entities";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

interface Db {
  organizations: Organization[];
  people: Person[];
  places: Place[];
  events: Event[];
  content: Content[];
  journal: Journal[];
}

export type EntityTypeKey = keyof Db;

const ID_PREFIXES: Record<EntityTypeKey, string> = {
  organizations: "org",
  people: "person",
  places: "place",
  events: "event",
  content: "content",
  journal: "journal",
};

async function readDb(): Promise<Db> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function listEntities<K extends EntityTypeKey>(
  type: K,
): Promise<Db[K]> {
  const db = await readDb();
  return db[type];
}

export async function getEntity<K extends EntityTypeKey>(
  type: K,
  entityId: string,
): Promise<Db[K][number] | undefined> {
  const list = await listEntities(type);
  return (list as { entityId: string }[]).find(
    (entity) => entity.entityId === entityId,
  ) as Db[K][number] | undefined;
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

export async function createEntity(
  type: EntityTypeKey,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const db = await readDb();
  const entityId = generateEntityId(type, String(data.name ?? "entry"));
  const entity = { ...data, entityId };
  (db[type] as unknown as Record<string, unknown>[]).push(entity);
  await writeDb(db);
  return entity;
}

export async function updateEntity(
  type: EntityTypeKey,
  entityId: string,
  data: Record<string, unknown>,
): Promise<Record<string, unknown> | undefined> {
  const db = await readDb();
  const list = db[type] as unknown as Record<string, unknown>[];
  const index = list.findIndex((entity) => entity.entityId === entityId);
  if (index === -1) return undefined;
  const updated = { ...list[index], ...data, entityId };
  list[index] = updated;
  await writeDb(db);
  return updated;
}

export async function deleteEntity(
  type: EntityTypeKey,
  entityId: string,
): Promise<boolean> {
  const db = await readDb();
  const list = db[type] as unknown as Record<string, unknown>[];
  const index = list.findIndex((entity) => entity.entityId === entityId);
  if (index === -1) return false;
  list.splice(index, 1);
  await writeDb(db);
  return true;
}
