import { EVENTS } from "@/data/mock-data";
import { EntityListView } from "@/components/EntityListView";

export default function EventsPage() {
  return (
    <EntityListView
      title="Events"
      kind="event"
      items={EVENTS}
      renderMeta={(event) =>
        [event.category, event.subtype, event.date].filter(Boolean).join(" · ")
      }
    />
  );
}
