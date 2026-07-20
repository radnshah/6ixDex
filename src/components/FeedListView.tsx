"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingPanel } from "./FloatingPanel";
import { EntityFormModal } from "./EntityFormModal";
import { EditIcon, renderMediaForKind, renderMetaForKind } from "@/lib/entity-render";
import type { Content, Journal } from "@/types/entities";

type FeedKind = "content" | "journal";
type EnrichedContent = Content & {
  primaryTitle?: string;
  primaryThumbnail?: string;
  primaryPlatform?: string;
  primaryViewCount?: string;
};

interface FeedEntry {
  feedKind: FeedKind;
  item: EnrichedContent | Journal;
  sortKey: string;
}

const TABS: { key: "all" | FeedKind; label: string }[] = [
  { key: "all", label: "All" },
  { key: "content", label: "Content" },
  { key: "journal", label: "Journal" },
];

export function FeedListView({
  content,
  journal,
  isAdmin,
}: {
  content: EnrichedContent[];
  journal: Journal[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | FeedKind>("all");
  const [editingEntry, setEditingEntry] = useState<
    { feedKind: FeedKind; item: EnrichedContent | Journal } | "new-content" | "new-journal" | null
  >(null);

  const entries: FeedEntry[] = useMemo(() => {
    const all: FeedEntry[] = [
      ...content.map((item) => ({ feedKind: "content" as const, item, sortKey: item.publishedAt })),
      ...journal.map((item) => ({ feedKind: "journal" as const, item, sortKey: item.date })),
    ];
    return all.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }, [content, journal]);

  const visibleEntries = tab === "all" ? entries : entries.filter((e) => e.feedKind === tab);

  function handleSaved() {
    setEditingEntry(null);
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-zinc-950 px-6 py-10 pl-28 text-zinc-100 sm:pl-36">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Feed</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {visibleEntries.length} {visibleEntries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          {isAdmin && (
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditingEntry("new-content")}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
              >
                + Content
              </button>
              <button
                onClick={() => setEditingEntry("new-journal")}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
              >
                + Journal
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.key
                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {visibleEntries.length === 0 && (
            <p className="py-10 text-center text-sm text-zinc-500">No entries yet.</p>
          )}
          {visibleEntries.map((entry) => (
            <FloatingPanel key={entry.item.entityId} className="relative p-4">
              {isAdmin && (
                <button
                  onClick={() => setEditingEntry({ feedKind: entry.feedKind, item: entry.item })}
                  aria-label="Edit"
                  className="absolute right-3 top-3 rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-100"
                >
                  <EditIcon />
                </button>
              )}
              {renderMediaForKind(entry.feedKind, entry.item)}
              <div className="flex items-center gap-2 pr-16">
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    entry.feedKind === "content"
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "bg-violet-400/10 text-violet-400"
                  }`}
                >
                  {entry.feedKind}
                </span>
                <h2 className="min-w-0 truncate text-sm font-semibold text-zinc-50">
                  {entry.item.name}
                </h2>
              </div>
              <div className="mt-1.5 text-xs text-zinc-400">
                {renderMetaForKind(entry.feedKind, entry.item)}
              </div>
            </FloatingPanel>
          ))}
        </div>
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
    </div>
  );
}
