import { listEntities } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const [organizations, admin] = await Promise.all([
    listEntities("organizations"),
    isAdmin(),
  ]);

  return (
    <EntityListView
      title="Organizations"
      kind="organization"
      items={organizations}
      isAdmin={admin}
    />
  );
}
