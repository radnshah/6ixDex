import { NextRequest, NextResponse } from "next/server";
import { createEntity, listEntities, type EntityTypeKey } from "@/lib/db";

const VALID_TYPES: EntityTypeKey[] = [
  "organizations",
  "people",
  "places",
  "events",
  "content",
  "journal",
];

function isValidType(value: string): value is EntityTypeKey {
  return (VALID_TYPES as string[]).includes(value);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ entityType: string }> },
) {
  const { entityType } = await params;
  if (!isValidType(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }
  const entities = await listEntities(entityType);
  return NextResponse.json(entities);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string }> },
) {
  const { entityType } = await params;
  if (!isValidType(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }
  const data = await request.json();
  const entity = await createEntity(entityType, data);
  return NextResponse.json(entity, { status: 201 });
}
