"use client";

import { useEffect, useRef, useState } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { ENTITY_COLORS } from "@/lib/labels";
import { leafKey, leafKeysForCategory, leafKeysForKind } from "@/lib/map-filter";
import { MAP_KIND_TAXONOMY, type MapKind } from "@/lib/taxonomy";

type TriState = "all" | "none" | "some";

function computeState(keys: string[], enabledLeaves: Set<string>): TriState {
  const onCount = keys.filter((key) => enabledLeaves.has(key)).length;
  if (onCount === 0) return "none";
  if (onCount === keys.length) return "all";
  return "some";
}

function TriCheckbox({
  state,
  onChange,
}: {
  state: TriState;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = state === "some";
  }, [state]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={state === "all"}
      onChange={onChange}
      className="h-3.5 w-3.5 shrink-0 accent-cyan-400"
    />
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3 w-3 shrink-0 text-zinc-500 transition-transform ${
        expanded ? "rotate-90" : ""
      }`}
      fill="currentColor"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const MAP_KINDS = Object.keys(MAP_KIND_TAXONOMY) as MapKind[];

export function FilterMenu({
  enabledLeaves,
  onToggle,
}: {
  enabledLeaves: Set<string>;
  onToggle: (keys: string[], nextEnabled: boolean) => void;
}) {
  const [expandedKinds, setExpandedKinds] = useState<Set<MapKind>>(
    () => new Set(MAP_KINDS),
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  function toggleKindExpanded(kind: MapKind) {
    setExpandedKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  function toggleCategoryExpanded(key: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <FloatingPanel className="pointer-events-auto flex max-h-[70vh] w-72 flex-col overflow-y-auto p-4">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Filters</h2>

      <div className="space-y-3">
        {MAP_KINDS.map((kind) => {
          const kindMeta = MAP_KIND_TAXONOMY[kind];
          const kindKeys = leafKeysForKind(kind);
          const kindState = computeState(kindKeys, enabledLeaves);
          const kindExpanded = expandedKinds.has(kind);

          return (
            <div key={kind}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleKindExpanded(kind)}
                  aria-label={kindExpanded ? "Collapse" : "Expand"}
                >
                  <ChevronIcon expanded={kindExpanded} />
                </button>
                <TriCheckbox
                  state={kindState}
                  onChange={() => onToggle(kindKeys, kindState !== "all")}
                />
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: ENTITY_COLORS[kind] }}
                />
                <span className="text-sm font-medium text-zinc-200">
                  {kindMeta.label}
                </span>
              </div>

              {kindExpanded && (
                <div className="ml-[7px] mt-1.5 space-y-1.5 border-l border-white/10 pl-4">
                  {Object.entries(kindMeta.categories).map(
                    ([category, subtypes]) => {
                      const categoryKeys = leafKeysForCategory(kind, category);
                      const categoryState = computeState(
                        categoryKeys,
                        enabledLeaves,
                      );
                      const categoryExpandKey = `${kind}:${category}`;
                      const categoryExpanded = expandedCategories.has(
                        categoryExpandKey,
                      );
                      const hasSubtypes = subtypes.length > 0;

                      return (
                        <div key={category}>
                          <div className="flex items-center gap-2">
                            {hasSubtypes ? (
                              <button
                                onClick={() =>
                                  toggleCategoryExpanded(categoryExpandKey)
                                }
                                aria-label={
                                  categoryExpanded ? "Collapse" : "Expand"
                                }
                              >
                                <ChevronIcon expanded={categoryExpanded} />
                              </button>
                            ) : (
                              <span className="w-3" />
                            )}
                            <TriCheckbox
                              state={categoryState}
                              onChange={() =>
                                onToggle(categoryKeys, categoryState !== "all")
                              }
                            />
                            <span className="text-xs text-zinc-300">
                              {category}
                            </span>
                          </div>

                          {hasSubtypes && categoryExpanded && (
                            <div className="ml-[7px] mt-1 space-y-1 border-l border-white/5 pl-4">
                              {subtypes.map((subtype) => {
                                const key = leafKey(kind, category, subtype);
                                const on = enabledLeaves.has(key);
                                return (
                                  <label
                                    key={subtype}
                                    className="flex items-center gap-2 text-xs text-zinc-400"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={on}
                                      onChange={() => onToggle([key], !on)}
                                      className="h-3 w-3 accent-cyan-400"
                                    />
                                    {subtype}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </FloatingPanel>
  );
}
