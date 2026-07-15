import { PLACES } from "@/data/mock-data";
import { EntityListView } from "@/components/EntityListView";

export default function PlacesPage() {
  return (
    <EntityListView
      title="Places"
      kind="place"
      items={PLACES}
      renderMeta={(place) =>
        [place.category, place.subtype, place.address].filter(Boolean).join(" · ")
      }
    />
  );
}
