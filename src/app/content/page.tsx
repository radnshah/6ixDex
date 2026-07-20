import { listEntities } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { EntityListView } from "@/components/EntityListView";
import { enrichContentItems } from "@/lib/social-enrichment";

// Enrichment data comes from live platform APIs, so this page always
// renders on request rather than being frozen at build time.
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [content, admin] = await Promise.all([listEntities("content"), isAdmin()]);
  const items = await enrichContentItems(content);

  return (
    <EntityListView
      title="Content"
      kind="content"
      items={items}
      linkToMap={false}
      isAdmin={admin}
    />
  );
}
