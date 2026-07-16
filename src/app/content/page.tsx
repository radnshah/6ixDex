import { listEntities } from "@/lib/db";
import { EntityListView } from "@/components/EntityListView";
import { fetchEnrichment } from "@/lib/social-enrichment";

// Enrichment data comes from live platform APIs, so this page always
// renders on request rather than being frozen at build time.
export const dynamic = "force-dynamic";

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export default async function ContentPage() {
  const content = await listEntities("content");

  const items = await Promise.all(
    content.map(async (item) => {
      const enrichedLinks = await Promise.all(
        item.links.map(async (link) => ({
          link,
          enriched: await fetchEnrichment(link.platform, link.url),
        })),
      );
      const primary = enrichedLinks.find((l) => l.enriched);

      return {
        ...item,
        primaryTitle: primary?.enriched?.title,
        primaryThumbnail: primary?.enriched?.thumbnailUrl,
        primaryPlatform: primary?.link.platform,
        primaryViewCount:
          primary?.enriched?.viewCount !== undefined
            ? formatCount(primary.enriched.viewCount)
            : undefined,
      };
    }),
  );

  return (
    <EntityListView title="Content" kind="content" items={items} linkToMap={false} />
  );
}
