"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FloatingPanel } from "./FloatingPanel";
import { EntityFormModal } from "./EntityFormModal";
import { KIND_TO_API_TYPE } from "@/lib/entity-schema";
import { useCurrentUser } from "@/lib/use-current-user";

interface ListItem {
  entityId: string;
  name: string;
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

// Renders the secondary meta line/block for a card, keyed off entity kind.
// Kept inline (rather than a render-prop) so pages can stay server
// components — passing functions across the server/client boundary isn't
// allowed, only plain data.
function renderMetaForKind(kind: string, rawItem: ListItem): ReactNode {
  const item = rawItem as unknown as Record<string, unknown>;
  switch (kind) {
    case "organization":
      return [item.category, item.subtype, item.industry]
        .filter(Boolean)
        .join(" · ");
    case "event":
      return [item.category, item.subtype, item.date].filter(Boolean).join(" · ");
    case "place":
      return [item.category, item.subtype, item.address]
        .filter(Boolean)
        .join(" · ");
    case "person":
      return [item.role, item.organizationName].filter(Boolean).join(" · ");
    case "journal":
      return (
        <div>
          <p className="mb-1.5">{[item.category, item.date].filter(Boolean).join(" · ")}</p>
          <p className="text-zinc-300">{item.body as string}</p>
        </div>
      );
    case "content": {
      const links = (item.links ?? []) as { platform: string; url: string }[];
      return (
        <div>
          {item.primaryTitle ? (
            <>
              <p className="text-zinc-300">{item.primaryTitle as string}</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-400">
                  Live from {item.primaryPlatform as string}
                </span>
                {item.primaryViewCount !== undefined && (
                  <span>{item.primaryViewCount as string} views</span>
                )}
              </p>
            </>
          ) : (
            <span>
              {[item.category, item.publishedAt].filter(Boolean).join(" · ")}
            </span>
          )}
          {links.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
                >
                  {link.platform} →
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }
    default:
      return null;
  }
}

function renderMediaForKind(kind: string, rawItem: ListItem): ReactNode {
  const item = rawItem as unknown as Record<string, unknown>;
  if (kind !== "content" || !item.primaryThumbnail) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.primaryThumbnail as string}
      alt={item.primaryTitle as string}
      className="mb-3 aspect-video w-full rounded-lg object-cover"
    />
  );
}

export function EntityListView<T extends ListItem>({
  title,
  kind,
  items,
  linkToMap = true,
}: {
  title: string;
  kind: string;
  items: T[];
  linkToMap?: boolean;
}) {
  const router = useRouter();
  const apiType = KIND_TO_API_TYPE[kind];
  const [editingItem, setEditingItem] = useState<T | "new" | null>(null);
  const { isAdmin } = useCurrentUser();

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
                <h2 className="pr-16 text-sm font-semibold text-zinc-50">
                  {item.name}
                </h2>
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
