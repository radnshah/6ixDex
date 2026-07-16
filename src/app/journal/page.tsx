import { listEntities } from "@/lib/db";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const journal = await listEntities("journal");

  return <EntityListView title="Journal" kind="journal" items={journal} linkToMap={false} />;
}
