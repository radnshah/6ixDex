"use client";

import { FloatingPanel } from "./FloatingPanel";
import {
  getCompanyById,
  getEventById,
  getPersonById,
  getPlaceById,
} from "@/data/mock-data";
import { PLACE_TYPE_LABELS } from "@/lib/labels";
import type { Company, Event, MapEntity, Person, Place } from "@/types/entities";

function getHeaderInfo(entity: MapEntity): { title: string; subtitle: string } {
  switch (entity.kind) {
    case "company":
      return { title: entity.data.name, subtitle: entity.data.industry };
    case "person":
      return { title: entity.data.name, subtitle: entity.data.role };
    case "place":
      return {
        title: entity.data.name,
        subtitle: PLACE_TYPE_LABELS[entity.data.type] ?? entity.data.type,
      };
    case "event":
      return { title: entity.data.name, subtitle: entity.data.date };
  }
}

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
      {children}
    </h3>
  );
}

function CompanyBody({ company }: { company: Company }) {
  const founders = (company.founderIds ?? [])
    .map(getPersonById)
    .filter((person) => person !== undefined);
  const place = company.placeId ? getPlaceById(company.placeId) : undefined;
  const events = (company.eventIds ?? [])
    .map(getEventById)
    .filter((event) => event !== undefined);

  return (
    <>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
        {company.description}
      </p>

      {company.techStack && company.techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {company.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {founders.length > 0 && (
        <div className="mt-4">
          <SectionLabel>Founders</SectionLabel>
          <ul className="mt-1.5 space-y-1">
            {founders.map((person) => (
              <li key={person.id} className="text-sm text-zinc-200">
                {person.name}{" "}
                <span className="text-zinc-500">— {person.role}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {place && (
        <div className="mt-4">
          <SectionLabel>Based at</SectionLabel>
          <p className="mt-1.5 text-sm text-zinc-200">{place.name}</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-4">
          <SectionLabel>Events</SectionLabel>
          <ul className="mt-1.5 space-y-1">
            {events.map((event) => (
              <li key={event.id} className="text-sm text-zinc-200">
                {event.name}{" "}
                <span className="text-zinc-500">— {event.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {company.website && (
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          Visit website →
        </a>
      )}
    </>
  );
}

function PersonBody({ person }: { person: Person }) {
  const company = person.companyIds?.[0]
    ? getCompanyById(person.companyIds[0])
    : undefined;

  return (
    <>
      {person.bio && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {person.bio}
        </p>
      )}
      {company && (
        <div className="mt-4">
          <SectionLabel>Company</SectionLabel>
          <p className="mt-1.5 text-sm text-zinc-200">{company.name}</p>
        </div>
      )}
    </>
  );
}

function PlaceBody({ place }: { place: Place }) {
  return (
    <>
      {place.address && (
        <div className="mt-3">
          <SectionLabel>Address</SectionLabel>
          <p className="mt-1.5 text-sm text-zinc-200">{place.address}</p>
        </div>
      )}
    </>
  );
}

function EventBody({ event }: { event: Event }) {
  const companies = (event.companyIds ?? [])
    .map(getCompanyById)
    .filter((company) => company !== undefined);

  return (
    <>
      {companies.length > 0 && (
        <div className="mt-3">
          <SectionLabel>Companies attending</SectionLabel>
          <ul className="mt-1.5 space-y-1">
            {companies.map((company) => (
              <li key={company.id} className="text-sm text-zinc-200">
                {company.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export function EntityPanel({
  entity,
  onClose,
}: {
  entity: MapEntity;
  onClose: () => void;
}) {
  const { title, subtitle } = getHeaderInfo(entity);

  return (
    <FloatingPanel className="pointer-events-auto w-full max-w-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">{title}</h2>
          <p className="text-xs uppercase tracking-wide text-cyan-400">
            {subtitle}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {entity.kind === "company" && <CompanyBody company={entity.data} />}
      {entity.kind === "person" && <PersonBody person={entity.data} />}
      {entity.kind === "place" && <PlaceBody place={entity.data} />}
      {entity.kind === "event" && <EventBody event={entity.data} />}
    </FloatingPanel>
  );
}
