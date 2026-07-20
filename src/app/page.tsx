"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Map, { type MapHandle } from "@/components/Map";
import { SearchBar } from "@/components/SearchBar";
import { EntityPanel } from "@/components/EntityPanel";
import { EntityListPanel } from "@/components/EntityListPanel";
import { FilterMenu } from "@/components/FilterMenu";
import { JourneyDashboard } from "@/components/JourneyDashboard";
import { FloatingPanel } from "@/components/FloatingPanel";
import { allLeafKeys } from "@/lib/map-filter";
import { useCurrentUser } from "@/lib/use-current-user";
import { useEntityData } from "@/lib/use-entity-data";
import type { SearchResult } from "@/lib/search";
import type { MapEntity } from "@/types/entities";

// Entity kinds that can be browsed via the in-map list panel (SideNav's
// "browse" query param) rather than a separate routed page. Kept as a
// subset for now — Content/Journal/Suggest aren't spatial, so they stay
// as regular pages.
const BROWSABLE_KINDS = new Set(["organization"]);

interface EntityRef {
  kind: MapEntity["kind"];
  entityId: string;
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");
  const browseParam = searchParams.get("browse");
  const browseKind = browseParam && BROWSABLE_KINDS.has(browseParam) ? browseParam : null;

  const mapRef = useRef<MapHandle>(null);
  const entityData = useEntityData();
  const { organizations, people, places, events, loading, refetch } = entityData;
  const { isAdmin } = useCurrentUser();

  const [selectedRef, setSelectedRef] = useState<EntityRef | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [enabledLeaves, setEnabledLeaves] = useState<Set<string>>(
    () => new Set(allLeafKeys()),
  );

  // Re-derives the displayed entity from live data on every render, so an
  // edit/delete anywhere (this panel, another tab, a browse page) is
  // reflected immediately without needing to manually re-sync a snapshot.
  const selectedEntity: MapEntity | null = useMemo(() => {
    if (!selectedRef) return null;
    if (selectedRef.kind === "organization") {
      const data = organizations.find((o) => o.entityId === selectedRef.entityId);
      return data ? { kind: "organization", data } : null;
    }
    if (selectedRef.kind === "person") {
      const data = people.find((p) => p.entityId === selectedRef.entityId);
      return data ? { kind: "person", data } : null;
    }
    if (selectedRef.kind === "place") {
      const data = places.find((p) => p.entityId === selectedRef.entityId);
      return data ? { kind: "place", data } : null;
    }
    if (selectedRef.kind === "event") {
      const data = events.find((e) => e.entityId === selectedRef.entityId);
      return data ? { kind: "event", data } : null;
    }
    return null;
  }, [selectedRef, organizations, people, places, events]);

  // Consumes the ?focus=kind:entityId deep link once live data has loaded.
  useEffect(() => {
    if (loading || !focusParam) return;
    const [kind, entityId] = focusParam.split(":") as [MapEntity["kind"], string];

    let location: { lat: number; lng: number } | undefined;
    if (kind === "organization") {
      location = organizations.find((o) => o.entityId === entityId)?.location;
    } else if (kind === "place") {
      location = places.find((p) => p.entityId === entityId)?.location;
    } else if (kind === "event") {
      location = events.find((e) => e.entityId === entityId)?.location;
    } else if (kind === "person") {
      const person = people.find((p) => p.entityId === entityId);
      const organization = person?.organizationIds?.[0]
        ? organizations.find((o) => o.entityId === person.organizationIds![0])
        : undefined;
      location = organization?.location;
    }

    if (location) {
      setSelectedRef({ kind, entityId });
      mapRef.current?.flyTo(location);
    }
    router.replace("/", { scroll: false });
    // Only re-run when loading finishes or the focus param itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, focusParam]);

  function handleSearchSelect(result: SearchResult) {
    setFilterOpen(false);
    if (browseKind) closeBrowsePanel();
    setSelectedRef({ kind: result.entity.kind, entityId: result.entity.data.entityId });
    mapRef.current?.flyTo(result.location);
  }

  function handleSelectEntity(entity: MapEntity) {
    setFilterOpen(false);
    setSelectedRef({ kind: entity.kind, entityId: entity.data.entityId });
  }

  function handleToggleFilter() {
    if (!filterOpen && browseKind) closeBrowsePanel();
    setFilterOpen((prev) => !prev);
  }

  function handleSelectFromBrowsePanel(entity: MapEntity) {
    setSelectedRef({ kind: entity.kind, entityId: entity.data.entityId });
    const location =
      entity.kind === "organization" || entity.kind === "place" || entity.kind === "event"
        ? entity.data.location
        : undefined;
    if (location) mapRef.current?.flyTo(location);
  }

  function closeBrowsePanel() {
    router.replace("/", { scroll: false });
  }

  function handleFilterChange(keys: string[], nextEnabled: boolean) {
    setEnabledLeaves((prev) => {
      const next = new Set(prev);
      for (const key of keys) {
        if (nextEnabled) next.add(key);
        else next.delete(key);
      }
      return next;
    });
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <Map
        ref={mapRef}
        organizations={organizations}
        places={places}
        events={events}
        enabledLeaves={enabledLeaves}
        onSelectEntity={handleSelectEntity}
      />

      <div className="pointer-events-none absolute inset-0 p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto flex w-full max-w-xl items-start gap-2">
          <div className="min-w-0 flex-1">
            <SearchBar data={entityData} onSelectResult={handleSearchSelect} />
          </div>
          <div className="relative">
            <button onClick={handleToggleFilter} aria-label="Toggle filters">
              <FloatingPanel
                className={`flex h-[46px] items-center gap-2 whitespace-nowrap px-4 transition-colors ${
                  filterOpen
                    ? "text-cyan-400"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                <span className="text-sm font-medium">Filters</span>
              </FloatingPanel>
            </button>

            {filterOpen && (
              <div className="pointer-events-auto absolute right-0 top-full mt-2">
                <FilterMenu
                  enabledLeaves={enabledLeaves}
                  onToggle={handleFilterChange}
                />
              </div>
            )}
          </div>
        </div>

        {browseKind === "organization" && (
          <div className="pointer-events-none absolute left-24 top-1/2 -translate-y-1/2 sm:left-28">
            <EntityListPanel
              title="Organizations"
              kind="organization"
              items={organizations}
              isAdmin={isAdmin}
              onSelect={(org) =>
                handleSelectFromBrowsePanel({ kind: "organization", data: org })
              }
              onChanged={refetch}
              onClose={closeBrowsePanel}
            />
          </div>
        )}

        {selectedEntity && (
          <div className="pointer-events-none absolute right-4 top-20 sm:right-6 sm:top-24">
            <EntityPanel
              entity={selectedEntity}
              data={entityData}
              onClose={() => setSelectedRef(null)}
              onChanged={refetch}
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-center sm:inset-x-6 sm:bottom-6">
          <JourneyDashboard />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
