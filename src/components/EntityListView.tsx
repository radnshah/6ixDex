"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FloatingPanel } from "./FloatingPanel";
import { EntityFormModal } from "./EntityFormModal";
import { KIND_TO_API_TYPE } from "@/lib/entity-schema";
import {
  EditIcon,
  getThumbnailForKind,
  renderMediaForKind,
  renderMetaForKind,
  type ListItem,
} from "@/lib/entity-render";

export function EntityListView<T extends ListItem>({
  title,
  kind,
  items,
  linkToMap = true,
  isAdmin,
}: {
  title: string;
  kind: string;
  items: T[];
  linkToMap?: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const apiType = KIND_TO_API_TYPE[kind];
  const [editingItem, setEditingItem] = useState<T | "new" | null>(null);

  function handleSaved() {
    setEditingItem(null);
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-zinc-950 px-6 py-10 pl-28 text-zinc-100 sm:pl-36">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setEditingItem("new")}
              className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
            >
              + Add new
            </button>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const card = (
              <FloatingPanel
                className={`relative p-4 ${linkToMap ? "transition-colors hover:bg-white/10" : ""}`}
              >
                {isAdmin && (
                  <div className="absolute right-3 top-3 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingItem(item);
                      }}
                      aria-label="Edit"
                      className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-100"
                    >
                      <EditIcon />
                    </button>
                  </div>
                )}
                {renderMediaForKind(kind, item)}
                <div className="flex min-w-0 items-center gap-3 pr-16">
                  {getThumbnailForKind(kind, item) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getThumbnailForKind(kind, item)}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-lg border border-white/10 bg-white/5 object-contain p-1"
                    />
                  )}
                  <h2 className="min-w-0 truncate text-sm font-semibold text-zinc-50">
                    {item.name}
                  </h2>
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  {renderMetaForKind(kind, item)}
                </div>
              </FloatingPanel>
            );

            return linkToMap ? (
              <Link key={item.entityId} href={`/?focus=${kind}:${item.entityId}`}>
                {card}
              </Link>
            ) : (
              <div key={item.entityId}>{card}</div>
            );
          })}
        </div>
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
    </div>
  );
}
