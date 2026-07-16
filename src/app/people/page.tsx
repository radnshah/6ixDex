import { getEntity, listEntities } from "@/lib/db";
import { EntityListView } from "@/components/EntityListView";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const people = await listEntities("people");
  const organizationNameById = new Map<string, string>();
  await Promise.all(
    people.map(async (person) => {
      const organizationId = person.organizationIds?.[0];
      if (!organizationId || organizationNameById.has(organizationId)) return;
      const organization = await getEntity("organizations", organizationId);
      if (organization) organizationNameById.set(organizationId, organization.name);
    }),
  );

  const items = people.map((person) => ({
    ...person,
    organizationName: person.organizationIds?.[0]
      ? organizationNameById.get(person.organizationIds[0])
      : undefined,
  }));

  return <EntityListView title="People" kind="person" items={items} />;
}
