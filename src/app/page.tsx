"use client";

import { useRef, useState } from "react";
import Map, { type MapHandle } from "@/components/Map";
import { SearchBar } from "@/components/SearchBar";
import { EntityPanel } from "@/components/EntityPanel";
import { FilterMenu } from "@/components/FilterMenu";
import { JourneyDashboard } from "@/components/JourneyDashboard";
import { FloatingPanel } from "@/components/FloatingPanel";
import { allLeafKeys } from "@/lib/map-filter";
import type { SearchResult } from "@/lib/search";
import type { MapEntity } from "@/types/entities";

export default function Home() {
  const mapRef = useRef<MapHandle>(null);
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [enabledLeaves, setEnabledLeaves] = useState<Set<string>>(
    () => new Set(allLeafKeys()),
  );

  function handleSearchSelect(result: SearchResult) {
    setFilterOpen(false);
    setSelectedEntity(result.entity);
    mapRef.current?.flyTo(result.location);
  }

  function handleSelectEntity(entity: MapEntity) {
    setFilterOpen(false);
    setSelectedEntity(entity);
  }

  function handleToggleFilter() {
    setSelectedEntity(null);
    setFilterOpen((prev) => !prev);
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
        enabledLeaves={enabledLeaves}
        onSelectEntity={handleSelectEntity}
      />

      <div className="pointer-events-none absolute inset-0 p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto flex w-full max-w-xl items-start gap-2">
          <div className="min-w-0 flex-1">
            <SearchBar onSelectResult={handleSearchSelect} />
          </div>
          <button onClick={handleToggleFilter} aria-label="Toggle filters">
            <FloatingPanel
              className={`flex h-[46px] w-[46px] items-center justify-center transition-colors ${
                filterOpen
                  ? "text-cyan-400"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </FloatingPanel>
          </button>
        </div>

        {selectedEntity && (
          <div className="pointer-events-none absolute right-4 top-20 sm:right-6 sm:top-24">
            <EntityPanel
              entity={selectedEntity}
              onClose={() => setSelectedEntity(null)}
            />
          </div>
        )}

        {filterOpen && (
          <div className="pointer-events-none absolute right-4 top-20 sm:right-6 sm:top-24">
            <FilterMenu
              enabledLeaves={enabledLeaves}
              onToggle={handleFilterChange}
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
