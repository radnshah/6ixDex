"use client";

import { useState } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { EntityFormModal } from "./EntityFormModal";
import { KIND_TO_API_TYPE } from "@/lib/entity-schema";
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
  onSelect,
  onChanged,
  onClose,
}: {
  title: string;
  kind: string;
  items: T[];
  isAdmin: boolean;
  onSelect: (item: T) => void;
  onChanged: () => void;
  onClose: () => void;
}) {
  const apiType = KIND_TO_API_TYPE[kind];
  const [editingItem, setEditingItem] = useState<T | "new" | null>(null);

  function handleSaved() {
    setEditingItem(null);
    onChanged();
  }

  return (
    <FloatingPanel className="pointer-events-auto flex max-h-[70vh] w-80 flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {items.length} {items.length === 1 ? "entry" : "entries"}
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

      <div className="mt-3 -mr-2 space-y-2 overflow-y-auto pr-2">
        {items.map((item) => {
          const thumbnail = getThumbnailForKind(kind, item);
          return (
            <button
              key={item.entityId}
              onClick={() => onSelect(item)}
              className="group relative block w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
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
                <h3 className="min-w-0 truncate text-sm font-medium text-zinc-50">
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
