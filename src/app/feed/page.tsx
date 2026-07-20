import { listEntities } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { enrichContentItems } from "@/lib/social-enrichment";
import { FeedListView } from "@/components/FeedListView";

// Enrichment data comes from live platform APIs, so this page always
// renders on request rather than being frozen at build time.
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const [content, journal, admin] = await Promise.all([
    listEntities("content"),
    listEntities("journal"),
    isAdmin(),
  ]);
  const enrichedContent = await enrichContentItems(content);

  return <FeedListView content={enrichedContent} journal={journal} isAdmin={admin} />;
}
