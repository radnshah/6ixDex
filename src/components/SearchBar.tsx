"use client";

import { useMemo, useState } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { searchEntities, type SearchResult } from "@/lib/search";
import { ENTITY_COLORS } from "@/lib/labels";

export function SearchBar({
  onSelectResult,
}: {
  onSelectResult: (result: SearchResult) => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchEntities(query), [query]);

  function handleSelect(result: SearchResult) {
    onSelectResult(result);
    setQuery("");
  }

  return (
    <div className="relative">
      <FloatingPanel className="flex items-center gap-3 px-4 py-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search startups, founders, events, places..."
          className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
      </FloatingPanel>

      {results.length > 0 && (
        <FloatingPanel className="absolute inset-x-0 top-full mt-2 max-h-80 overflow-y-auto p-2">
          <ul className="space-y-0.5">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  onClick={() => handleSelect(result)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/10"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: ENTITY_COLORS[result.entity.kind] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-100">
                    {result.name}
                  </span>
                  <span className="shrink-0 truncate text-xs text-zinc-500">
                    {result.subtitle}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </FloatingPanel>
      )}
    </div>
  );
}
