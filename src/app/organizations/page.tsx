import { listEntities } from "@/lib/db";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const organizations = await listEntities("organizations");

  return <EntityListView title="Organizations" kind="organization" items={organizations} />;
}
