import {
  ORGANIZATIONS,
  PEOPLE,
  PLACES,
  EVENTS,
  getOrganizationById,
} from "@/data/mock-data";
import type { GeoPoint, MapEntity } from "@/types/entities";

export interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  location: GeoPoint;
  entity: MapEntity;
}

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const organization of ORGANIZATIONS) {
    results.push({
      id: organization.entityId,
      name: organization.name,
      subtitle: organization.industry ?? organization.subtype,
      location: organization.location,
      entity: { kind: "organization", data: organization },
    });
  }

  for (const person of PEOPLE) {
    const organization = person.organizationIds?.[0]
      ? getOrganizationById(person.organizationIds[0])
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

  for (const place of PLACES) {
    results.push({
      id: place.entityId,
      name: place.name,
      subtitle: place.subtype,
      location: place.location,
      entity: { kind: "place", data: place },
    });
  }

  for (const event of EVENTS) {
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

const SEARCH_INDEX = buildSearchIndex();

export function searchEntities(query: string, limit = 8): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return SEARCH_INDEX.filter(
    (result) =>
      result.name.toLowerCase().includes(normalized) ||
      result.subtitle.toLowerCase().includes(normalized),
  ).slice(0, limit);
}
