"use client";

import { useMemo, useState } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { EntityFormModal } from "./EntityFormModal";
import { EditIcon, renderMediaForKind, renderMetaForKind } from "@/lib/entity-render";
import type { Content, Journal } from "@/types/entities";

type FeedKind = "content" | "journal";

interface FeedEntry {
  feedKind: FeedKind;
  item: Content | Journal;
  sortKey: string;
}

const TYPE_OPTIONS: { key: FeedKind; label: string }[] = [
  { key: "content", label: "Content" },
  { key: "journal", label: "Journal" },
];

// Merges Content and Journal into one chronological, filterable list,
// rendered as a panel next to the side nav rather than a routed page.
// Content and Journal have no map coordinates, so - unlike EntityListPanel -
// there's no selection/fly-to behavior here, just browsing and CRUD. The
// layout (fixed size, header, search+filter row, scrollable list) mirrors
// EntityListPanel exactly so every in-map browse panel feels like one system.
export function FeedListPanel({
  content,
  journal,
  isAdmin,
  onChanged,
  onClose,
}: {
  content: Content[];
  journal: Journal[];
  isAdmin: boolean;
  onChanged: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FeedKind | null>(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<
    { feedKind: FeedKind; item: Content | Journal } | "new-content" | "new-journal" | null
  >(null);

  const entries: FeedEntry[] = useMemo(() => {
    const all: FeedEntry[] = [
      ...content.map((item) => ({ feedKind: "content" as const, item, sortKey: item.publishedAt })),
      ...journal.map((item) => ({ feedKind: "journal" as const, item, sortKey: item.date })),
    ];
    return all.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }, [content, journal]);

  const visibleEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (typeFilter && entry.feedKind !== typeFilter) return false;
      if (!normalized) return true;
      const record = entry.item as unknown as Record<string, unknown>;
      return [entry.item.name, record.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [entries, typeFilter, query]);

  function handleSaved() {
    setEditingEntry(null);
    onChanged();
  }

  return (
    <FloatingPanel className="pointer-events-auto flex h-[70vh] w-80 flex-col p-4">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Feed</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {visibleEntries.length === entries.length
              ? `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`
              : `${visibleEntries.length} of ${entries.length}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setAddMenuOpen((prev) => !prev)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
              >
                + Add
              </button>
              {addMenuOpen && (
                <div className="absolute right-0 top-full z-10 mt-1.5">
                  <FloatingPanel className="w-32 p-1.5">
                    {TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setEditingEntry(`new-${option.key}` as "new-content" | "new-journal");
                          setAddMenuOpen(false);
                        }}
                        className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
                      >
                        {option.label}
                      </button>
                    ))}
                  </FloatingPanel>
                </div>
              )}
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search feed..."
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-cyan-400/40"
        />
        <div className="relative shrink-0">
          <button
            onClick={() => setTypeMenuOpen((prev) => !prev)}
            aria-label="Filter by type"
            className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg border transition-colors ${
              typeFilter || typeMenuOpen
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>

          {typeMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1.5">
              <FloatingPanel className="w-32 p-1.5">
                <button
                  onClick={() => {
                    setTypeFilter(null);
                    setTypeMenuOpen(false);
                  }}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    typeFilter === null
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  All
                </button>
                {TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setTypeFilter(option.key);
                      setTypeMenuOpen(false);
                    }}
                    className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                      typeFilter === option.key
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </FloatingPanel>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto -mr-2 pr-2">
        {visibleEntries.length === 0 && (
          <p className="py-6 text-center text-xs text-zinc-500">No matches.</p>
        )}
        {visibleEntries.map((entry) => (
          <div
            key={entry.item.entityId}
            className="group relative rounded-xl border border-white/10 bg-white/5 p-3"
          >
            {isAdmin && (
              <button
                onClick={() => setEditingEntry({ feedKind: entry.feedKind, item: entry.item })}
                aria-label="Edit"
                className="absolute right-2 top-2 rounded-full p-1.5 text-zinc-500 opacity-0 transition-opacity hover:bg-white/10 hover:text-zinc-100 group-hover:opacity-100"
              >
                <EditIcon />
              </button>
            )}
            {renderMediaForKind(entry.feedKind, entry.item)}
            <div className="flex min-w-0 items-center gap-2 pr-8">
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide ${
                  entry.feedKind === "content"
                    ? "bg-cyan-400/10 text-cyan-400"
                    : "bg-violet-400/10 text-violet-400"
                }`}
              >
                {entry.feedKind}
              </span>
              <h3 className="min-w-0 truncate text-sm font-medium text-zinc-50">
                {entry.item.name}
              </h3>
            </div>
            <div className="mt-1 truncate text-xs text-zinc-400">
              {renderMetaForKind(entry.feedKind, entry.item)}
            </div>
          </div>
        ))}
      </div>

      {editingEntry && (
        <EntityFormModal
          apiType={
            editingEntry === "new-content"
              ? "content"
              : editingEntry === "new-journal"
                ? "journal"
                : editingEntry.feedKind
          }
          entityId={
            editingEntry === "new-content" || editingEntry === "new-journal"
              ? undefined
              : editingEntry.item.entityId
          }
          initialData={
            editingEntry === "new-content" || editingEntry === "new-journal"
              ? undefined
              : (editingEntry.item as unknown as Record<string, unknown>)
          }
          onClose={() => setEditingEntry(null)}
          onSaved={handleSaved}
        />
      )}
    </FloatingPanel>
  );
}
