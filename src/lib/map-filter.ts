import { MAP_KIND_TAXONOMY, type MapKind } from "./taxonomy";
import type { Event, Organization, Place } from "@/types/entities";

export function leafKey(kind: MapKind, category: string, subtype?: string) {
  return `${kind}:${category}:${subtype ?? "__self__"}`;
}

export function allLeafKeys(): string[] {
  const keys: string[] = [];
  for (const kind of Object.keys(MAP_KIND_TAXONOMY) as MapKind[]) {
    keys.push(...leafKeysForKind(kind));
  }
  return keys;
}

export function leafKeysForKind(kind: MapKind): string[] {
  const categories = MAP_KIND_TAXONOMY[kind].categories;
  return Object.keys(categories).flatMap((category) =>
    leafKeysForCategory(kind, category),
  );
}

export function leafKeysForCategory(kind: MapKind, category: string): string[] {
  const subtypes = MAP_KIND_TAXONOMY[kind].categories[category] ?? [];
  if (subtypes.length === 0) return [leafKey(kind, category)];
  return subtypes.map((subtype) => leafKey(kind, category, subtype));
}

export function isOrganizationVisible(
  organization: Organization,
  enabledLeaves: Set<string>,
): boolean {
  return enabledLeaves.has(
    leafKey("organization", organization.category, organization.subtype),
  );
}

export function isPlaceVisible(
  place: Place,
  enabledLeaves: Set<string>,
): boolean {
  return enabledLeaves.has(leafKey("place", place.category, place.subtype));
}

export function isEventVisible(
  event: Event,
  enabledLeaves: Set<string>,
): boolean {
  return enabledLeaves.has(leafKey("event", event.category, event.subtype));
}
