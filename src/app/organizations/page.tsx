import { ORGANIZATIONS } from "@/data/mock-data";
import { EntityListView } from "@/components/EntityListView";

export default function OrganizationsPage() {
  return (
    <EntityListView
      title="Organizations"
      kind="organization"
      items={ORGANIZATIONS}
      renderMeta={(organization) =>
        [organization.category, organization.subtype, organization.industry]
          .filter(Boolean)
          .join(" · ")
      }
    />
  );
}
