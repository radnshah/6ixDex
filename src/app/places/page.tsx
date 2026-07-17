import { listEntities } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const [places, admin] = await Promise.all([listEntities("places"), isAdmin()]);

  return <EntityListView title="Places" kind="place" items={places} isAdmin={admin} />;
}
