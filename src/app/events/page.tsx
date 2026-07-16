import { listEntities } from "@/lib/db";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await listEntities("events");

  return <EntityListView title="Events" kind="event" items={events} />;
}
