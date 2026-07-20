"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { EntityFormModal } from "./EntityFormModal";
import { KIND_TO_API_TYPE } from "@/lib/entity-schema";
import { MAP_KIND_TAXONOMY, type MapKind } from "@/lib/taxonomy";
import {
  EditIcon,
  getThumbnailForKind,
  renderMetaForKind,
  type ListItem,
} from "@/lib/entity-render";

// The in-map counterpart to EntityListView: same cards, but clicking one
// selects the entity on the map (flies + opens EntityPanel) instead of
// navigating to a separate browse page.
export function EntityListPanel<T extends ListItem>({
  title,
  kind,
  items,
  isAdmin,
  selectedEntityId,
  onSelect,
  onChanged,
  onClose,
}: {
  title: string;
  kind: string;
  items: T[];
  isAdmin: boolean;
  selectedEntityId?: string;
  onSelect: (item: T) => void;
  onChanged: () => void;
  onClose: () => void;
}) {
  const apiType = KIND_TO_API_TYPE[kind];
  const [editingItem, setEditingItem] = useState<T | "new" | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const categoryOptions =
    kind in MAP_KIND_TAXONOMY
      ? Object.keys(MAP_KIND_TAXONOMY[kind as MapKind].categories)
      : [];

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const record = item as unknown as Record<string, unknown>;
      if (categoryFilter && record.category !== categoryFilter) return false;
      if (!normalized) return true;
      return [item.name, record.category, record.subtype, record.industry]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [items, query, categoryFilter]);

  // Keep the currently-selected card in view when selection changes
  // elsewhere (e.g. clicking a pin directly on the map).
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedEntityId]);

  function handleSaved() {
    setEditingItem(null);
    onChanged();
  }

  return (
    <FloatingPanel className="pointer-events-auto flex h-[70vh] w-80 flex-col p-4">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {filteredItems.length === items.length
              ? `${items.length} ${items.length === 1 ? "entry" : "entries"}`
              : `${filteredItems.length} of ${items.length}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isAdmin && (
            <button
              onClick={() => setEditingItem("new")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
            >
              + Add
            </button>
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
          placeholder={`Search ${title.toLowerCase()}...`}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-cyan-400/40"
        />
        <div className="relative shrink-0">
          <button
            onClick={() => setCategoryMenuOpen((prev) => !prev)}
            aria-label="Filter by category"
            className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg border transition-colors ${
              categoryFilter || categoryMenuOpen
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>

          {categoryMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1.5">
              <FloatingPanel className="w-44 p-1.5">
                <button
                  onClick={() => {
                    setCategoryFilter(null);
                    setCategoryMenuOpen(false);
                  }}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    categoryFilter === null
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  All
                </button>
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setCategoryFilter(category);
                      setCategoryMenuOpen(false);
                    }}
                    className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                      categoryFilter === category
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </FloatingPanel>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto -mr-2 pr-2">
        {filteredItems.length === 0 && (
          <p className="py-6 text-center text-xs text-zinc-500">No matches.</p>
        )}
        {filteredItems.map((item) => {
          const thumbnail = getThumbnailForKind(kind, item);
          const isSelected = item.entityId === selectedEntityId;
          return (
            <button
              key={item.entityId}
              ref={isSelected ? selectedRef : undefined}
              onClick={() => onSelect(item)}
              className={`group relative block w-full rounded-xl border p-3 text-left transition-colors ${
                isSelected
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              {isAdmin && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem(item);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      setEditingItem(item);
                    }
                  }}
                  aria-label="Edit"
                  className="absolute right-2 top-2 rounded-full p-1.5 text-zinc-500 opacity-0 transition-opacity hover:bg-white/10 hover:text-zinc-100 group-hover:opacity-100"
                >
                  <EditIcon />
                </span>
              )}
              <div className="flex min-w-0 items-center gap-2.5 pr-8">
                {thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-lg border border-white/10 bg-white/5 object-contain p-0.5"
                  />
                )}
                <h3
                  className={`min-w-0 truncate text-sm font-medium ${
                    isSelected ? "text-cyan-400" : "text-zinc-50"
                  }`}
                >
                  {item.name}
                </h3>
              </div>
              <div className="mt-1 truncate text-xs text-zinc-400">
                {renderMetaForKind(kind, item)}
              </div>
            </button>
          );
        })}
      </div>

      {editingItem && (
        <EntityFormModal
          apiType={apiType}
          entityId={editingItem === "new" ? undefined : editingItem.entityId}
          initialData={
            editingItem === "new"
              ? undefined
              : (editingItem as unknown as Record<string, unknown>)
          }
          onClose={() => setEditingItem(null)}
          onSaved={handleSaved}
        />
      )}
    </FloatingPanel>
  );
}
