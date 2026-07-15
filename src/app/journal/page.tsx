import { JOURNAL } from "@/data/mock-data";
import { EntityListView } from "@/components/EntityListView";

export default function JournalPage() {
  return (
    <EntityListView
      title="Journal"
      kind="journal"
      items={JOURNAL}
      linkToMap={false}
      renderMeta={(entry) => (
        <div>
          <p className="mb-1.5">{[entry.category, entry.date].join(" · ")}</p>
          <p className="text-zinc-300">{entry.body}</p>
        </div>
      )}
    />
  );
}
