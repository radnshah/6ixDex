"use client";

import { useState } from "react";
import Map from "@/components/Map";
import { SearchBar } from "@/components/SearchBar";
import { EntityPanel } from "@/components/EntityPanel";
import { JourneyDashboard } from "@/components/JourneyDashboard";
import type { Company } from "@/types/entities";

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <Map onSelectCompany={setSelectedCompany} />

      <div className="pointer-events-none absolute inset-0 p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <SearchBar />
        </div>

        {selectedCompany && (
          <div className="pointer-events-none absolute right-4 top-20 sm:right-6 sm:top-24">
            <EntityPanel
              company={selectedCompany}
              onClose={() => setSelectedCompany(null)}
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
