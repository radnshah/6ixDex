"use client";

import { useState } from "react";
import Map from "@/components/Map";
import { SearchBar } from "@/components/SearchBar";
import { EntityPanel } from "@/components/EntityPanel";
import type { Company } from "@/types/entities";

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <Map onSelectCompany={setSelectedCompany} />
      <div className="pointer-events-none absolute inset-0 flex flex-col gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <SearchBar />
        </div>
        {selectedCompany && (
          <div className="pointer-events-none flex flex-1 items-start justify-end">
            <EntityPanel
              company={selectedCompany}
              onClose={() => setSelectedCompany(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
