import type { ReactNode } from "react";

export interface ListItem {
  entityId: string;
  name: string;
}

export function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

// Small thumbnail shown next to the name for kinds that carry a logo/image
// URL (organization: logo, place/event: image).
export function getThumbnailForKind(kind: string, rawItem: ListItem): string | undefined {
  const item = rawItem as unknown as Record<string, unknown>;
  const key = kind === "organization" ? "logo" : "image";
  return typeof item[key] === "string" ? (item[key] as string) : undefined;
}

// Renders the secondary meta line/block for a card, keyed off entity kind.
// Kept inline (rather than a render-prop) so pages can stay server
// components — passing functions across the server/client boundary isn't
// allowed, only plain data.
export function renderMetaForKind(kind: string, rawItem: ListItem): ReactNode {
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

export function renderMediaForKind(kind: string, rawItem: ListItem): ReactNode {
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
