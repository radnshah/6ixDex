"use client";

import { useRef, useState } from "react";
import Map, { type MapHandle } from "@/components/Map";
import { SearchBar } from "@/components/SearchBar";
import { EntityPanel } from "@/components/EntityPanel";
import { JourneyDashboard } from "@/components/JourneyDashboard";
import type { SearchResult } from "@/lib/search";
import type { Company, MapEntity } from "@/types/entities";

export default function Home() {
  const mapRef = useRef<MapHandle>(null);
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);

  function handleMapCompanySelect(company: Company) {
    setSelectedEntity({ kind: "company", data: company });
  }

  function handleSearchSelect(result: SearchResult) {
    setSelectedEntity(result.entity);
    mapRef.current?.flyTo(result.location);
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <Map ref={mapRef} onSelectCompany={handleMapCompanySelect} />

      <div className="pointer-events-none absolute inset-0 p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <SearchBar onSelectResult={handleSearchSelect} />
        </div>

        {selectedEntity && (
          <div className="pointer-events-none absolute right-4 top-20 sm:right-6 sm:top-24">
            <EntityPanel
              entity={selectedEntity}
              onClose={() => setSelectedEntity(null)}
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
