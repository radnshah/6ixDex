import { listEntities } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [events, admin] = await Promise.all([listEntities("events"), isAdmin()]);

  return <EntityListView title="Events" kind="event" items={events} isAdmin={admin} />;
}
