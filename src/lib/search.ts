import type { EntityData } from "./use-entity-data";
import type { GeoPoint, MapEntity } from "@/types/entities";

export interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  location: GeoPoint;
  entity: MapEntity;
}

function buildSearchIndex(data: EntityData): SearchResult[] {
  const results: SearchResult[] = [];
  const organizationById = new Map(
    data.organizations.map((organization) => [organization.entityId, organization]),
  );

  for (const organization of data.organizations) {
    results.push({
      id: organization.entityId,
      name: organization.name,
      subtitle: organization.industry ?? organization.subtype,
      location: organization.location,
      entity: { kind: "organization", data: organization },
    });
  }

  for (const person of data.people) {
    const organization = person.organizationIds?.[0]
      ? organizationById.get(person.organizationIds[0])
      : undefined;
    if (!organization) continue;
    results.push({
      id: person.entityId,
      name: person.name,
      subtitle: `${person.role} at ${organization.name}`,
      location: organization.location,
      entity: { kind: "person", data: person },
    });
  }

  for (const place of data.places) {
    results.push({
      id: place.entityId,
      name: place.name,
      subtitle: place.subtype,
      location: place.location,
      entity: { kind: "place", data: place },
    });
  }

  for (const event of data.events) {
    results.push({
      id: event.entityId,
      name: event.name,
      subtitle: event.date,
      location: event.location,
      entity: { kind: "event", data: event },
    });
  }

  return results;
}

export function searchEntities(
  data: EntityData,
  query: string,
  limit = 8,
): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return buildSearchIndex(data)
    .filter(
      (result) =>
        result.name.toLowerCase().includes(normalized) ||
        result.subtitle.toLowerCase().includes(normalized),
    )
    .slice(0, limit);
}
