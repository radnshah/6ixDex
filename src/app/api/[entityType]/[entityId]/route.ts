import { NextRequest, NextResponse } from "next/server";
import { deleteEntity, updateEntity, type EntityTypeKey } from "@/lib/db";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> },
) {
  const { entityType, entityId } = await params;
  if (!isValidType(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }
  const data = await request.json();
  const updated = await updateEntity(entityType, entityId, data);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> },
) {
  const { entityType, entityId } = await params;
  if (!isValidType(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }
  const deleted = await deleteEntity(entityType, entityId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
