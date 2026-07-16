import { listEntities } from "@/lib/db";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const places = await listEntities("places");

  return <EntityListView title="Places" kind="place" items={places} />;
}
