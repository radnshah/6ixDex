import { CONTENT } from "@/data/mock-data";
import { EntityListView } from "@/components/EntityListView";
import { fetchEnrichment, type EnrichedMedia } from "@/lib/social-enrichment";
import type { ContentLink } from "@/types/entities";

// Enrichment data comes from live platform APIs, so this page always
// renders on request rather than being frozen at build time.
export const dynamic = "force-dynamic";

interface EnrichedLink {
  link: ContentLink;
  enriched: EnrichedMedia | null;
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export default async function ContentPage() {
  const linksById = new Map<string, EnrichedLink[]>(
    await Promise.all(
      CONTENT.map(async (item) => {
        const enrichedLinks = await Promise.all(
          item.links.map(async (link) => ({
            link,
            enriched: await fetchEnrichment(link.platform, link.url),
          })),
        );
        return [item.entityId, enrichedLinks] as const;
      }),
    ),
  );

  return (
    <EntityListView
      title="Content"
      kind="content"
      items={CONTENT}
      linkToMap={false}
      renderMedia={(item) => {
        const primary = linksById.get(item.entityId)?.find((l) => l.enriched);
        if (!primary?.enriched?.thumbnailUrl) return null;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primary.enriched.thumbnailUrl}
            alt={primary.enriched.title}
            className="mb-3 aspect-video w-full rounded-lg object-cover"
          />
        );
      }}
      renderMeta={(item) => {
        const links = linksById.get(item.entityId) ?? [];
        const primary = links.find((l) => l.enriched);

        return (
          <div>
            {primary?.enriched ? (
              <>
                <p className="text-zinc-300">{primary.enriched.title}</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-400">
                    Live from {primary.link.platform}
                  </span>
                  {primary.enriched.viewCount !== undefined && (
                    <span>{formatCount(primary.enriched.viewCount)} views</span>
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
                {links.map(({ link }) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
                  >
                    {link.platform} →
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
