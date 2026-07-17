"use client";

import { useEffect, useState } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { EntityFormModal } from "./EntityFormModal";
import { KIND_TO_API_TYPE } from "@/lib/entity-schema";
import { useCurrentUser } from "@/lib/use-current-user";
import type { EntityData } from "@/lib/use-entity-data";
import type {
  Event,
  MapEntity,
  Organization,
  Person,
  Place,
} from "@/types/entities";

function getHeaderInfo(entity: MapEntity): { title: string; subtitle: string } {
  switch (entity.kind) {
    case "organization":
      return {
        title: entity.data.name,
        subtitle: entity.data.industry ?? entity.data.subtype,
      };
    case "person":
      return { title: entity.data.name, subtitle: entity.data.role };
    case "place":
      return { title: entity.data.name, subtitle: entity.data.subtype };
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

function OrganizationBody({
  organization,
  data,
}: {
  organization: Organization;
  data: EntityData;
}) {
  const founders = (organization.founderIds ?? [])
    .map((id) => data.people.find((person) => person.entityId === id))
    .filter((person): person is Person => person !== undefined);
  const place = organization.placeId
    ? data.places.find((p) => p.entityId === organization.placeId)
    : undefined;
  const relatedEvents = (organization.eventIds ?? [])
    .map((id) => data.events.find((event) => event.entityId === id))
    .filter((event): event is Event => event !== undefined);
  const relatedContent = data.content.filter((item) =>
    item.relatedOrganizationIds?.includes(organization.entityId),
  );
  const relatedJournal = data.journal.filter((entry) =>
    entry.relatedOrganizationIds?.includes(organization.entityId),
  );

  const facts = [
    { label: "Stage", value: organization.stage },
    {
      label: "Founded",
      value: organization.founded ? String(organization.founded) : undefined,
    },
    {
      label: "Team size",
      value: organization.employeeCount
        ? `${organization.employeeCount}`
        : undefined,
    },
    { label: "HQ", value: organization.headquarters },
  ].filter((fact) => fact.value);

  return (
    <>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
        {organization.description}
      </p>

      {facts.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {facts.map((fact) => (
            <div key={fact.label}>
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                {fact.label}
              </p>
              <p className="text-sm text-zinc-200">{fact.value}</p>
            </div>
          ))}
        </div>
      )}

      {organization.techStack && organization.techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {organization.techStack.map((tech) => (
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
              <li key={person.entityId} className="text-sm text-zinc-200">
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

      {relatedEvents.length > 0 && (
        <div className="mt-4">
          <SectionLabel>Events</SectionLabel>
          <ul className="mt-1.5 space-y-1">
            {relatedEvents.map((event) => (
              <li key={event.entityId} className="text-sm text-zinc-200">
                {event.name}{" "}
                <span className="text-zinc-500">— {event.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedContent.length > 0 && (
        <div className="mt-4">
          <SectionLabel>Content</SectionLabel>
          <ul className="mt-1.5 space-y-1">
            {relatedContent.map((item) => (
              <li key={item.entityId} className="text-sm text-zinc-200">
                {item.name}{" "}
                <span className="text-zinc-500">— {item.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedJournal.length > 0 && (
        <div className="mt-4">
          <SectionLabel>Journal</SectionLabel>
          <ul className="mt-1.5 space-y-1">
            {relatedJournal.map((entry) => (
              <li key={entry.entityId} className="text-sm text-zinc-200">
                {entry.name}{" "}
                <span className="text-zinc-500">— {entry.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(organization.website || organization.linkedin) && (
        <div className="mt-5 flex gap-4">
          {organization.website && (
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              Website →
            </a>
          )}
          {organization.linkedin && (
            <a
              href={organization.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              LinkedIn →
            </a>
          )}
        </div>
      )}
    </>
  );
}

function PersonBody({ person, data }: { person: Person; data: EntityData }) {
  const organization = person.organizationIds?.[0]
    ? data.organizations.find((o) => o.entityId === person.organizationIds![0])
    : undefined;

  return (
    <>
      {person.bio && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {person.bio}
        </p>
      )}
      {organization && (
        <div className="mt-4">
          <SectionLabel>Organization</SectionLabel>
          <p className="mt-1.5 text-sm text-zinc-200">{organization.name}</p>
        </div>
      )}
      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          LinkedIn →
        </a>
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

function EventBody({ event, data }: { event: Event; data: EntityData }) {
  const organizations = (event.organizationIds ?? [])
    .map((id) => data.organizations.find((o) => o.entityId === id))
    .filter((organization): organization is Organization => organization !== undefined);

  return (
    <>
      {event.subtype && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {event.category} · {event.subtype}
        </p>
      )}

      {organizations.length > 0 && (
        <div className="mt-3">
          <SectionLabel>Organizations attending</SectionLabel>
          <ul className="mt-1.5 space-y-1">
            {organizations.map((organization) => (
              <li key={organization.entityId} className="text-sm text-zinc-200">
                {organization.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function EntityPanel({
  entity,
  data,
  onClose,
  onChanged,
}: {
  entity: MapEntity;
  data: EntityData;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { title, subtitle } = getHeaderInfo(entity);
  const [editing, setEditing] = useState(false);
  const { isAdmin } = useCurrentUser();

  useEffect(() => {
    // Only logs when it's actually the admin browsing — the API rejects
    // anyone else, so this just silently no-ops for public viewers.
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: entity.kind,
        entityId: entity.data.entityId,
      }),
    }).catch(() => {});
  }, [entity.kind, entity.data.entityId]);

  function handleSaved() {
    setEditing(false);
    onChanged();
  }

  return (
    <FloatingPanel className="pointer-events-auto w-full max-w-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {entity.kind === "organization" && entity.data.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entity.data.logo}
              alt=""
              className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border border-white/10 bg-white/5 object-contain p-1"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold text-zinc-50">{title}</h2>
            <p className="text-xs uppercase tracking-wide text-cyan-400">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {isAdmin && (
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit"
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
            >
              <EditIcon />
            </button>
          )}
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
      </div>

      {entity.kind === "organization" && (
        <OrganizationBody organization={entity.data} data={data} />
      )}
      {entity.kind === "person" && <PersonBody person={entity.data} data={data} />}
      {entity.kind === "place" && <PlaceBody place={entity.data} />}
      {entity.kind === "event" && <EventBody event={entity.data} data={data} />}

      {editing && (
        <EntityFormModal
          apiType={KIND_TO_API_TYPE[entity.kind]}
          entityId={entity.data.entityId}
          initialData={entity.data as unknown as Record<string, unknown>}
          onClose={() => setEditing(false)}
          onSaved={handleSaved}
        />
      )}
    </FloatingPanel>
  );
}
