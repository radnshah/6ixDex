import { COMPANIES, PEOPLE, PLACES, EVENTS, getCompanyById } from "@/data/mock-data";
import { PLACE_TYPE_LABELS } from "@/lib/labels";
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

  for (const company of COMPANIES) {
    results.push({
      id: company.id,
      name: company.name,
      subtitle: company.industry,
      location: company.location,
      entity: { kind: "company", data: company },
    });
  }

  for (const person of PEOPLE) {
    const company = person.companyIds?.[0]
      ? getCompanyById(person.companyIds[0])
      : undefined;
    if (!company) continue;
    results.push({
      id: person.id,
      name: person.name,
      subtitle: `${person.role} at ${company.name}`,
      location: company.location,
      entity: { kind: "person", data: person },
    });
  }

  for (const place of PLACES) {
    results.push({
      id: place.id,
      name: place.name,
      subtitle: PLACE_TYPE_LABELS[place.type] ?? place.type,
      location: place.location,
      entity: { kind: "place", data: place },
    });
  }

  for (const event of EVENTS) {
    results.push({
      id: event.id,
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
