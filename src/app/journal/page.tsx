import { listEntities } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const [journal, admin] = await Promise.all([listEntities("journal"), isAdmin()]);

  return (
    <EntityListView
      title="Journal"
      kind="journal"
      items={journal}
      linkToMap={false}
      isAdmin={admin}
    />
  );
}
