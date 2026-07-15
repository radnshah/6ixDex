import { PEOPLE, getOrganizationById } from "@/data/mock-data";
import { EntityListView } from "@/components/EntityListView";

export default function PeoplePage() {
  return (
    <EntityListView
      title="People"
      kind="person"
      items={PEOPLE}
      renderMeta={(person) => {
        const organization = person.organizationIds?.[0]
          ? getOrganizationById(person.organizationIds[0])
          : undefined;
        return [person.role, organization?.name].filter(Boolean).join(" · ");
      }}
    />
  );
}
