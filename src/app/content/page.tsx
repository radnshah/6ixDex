import { CONTENT } from "@/data/mock-data";
import { EntityListView } from "@/components/EntityListView";

export default function ContentPage() {
  return (
    <EntityListView
      title="Content"
      kind="content"
      items={CONTENT}
      linkToMap={false}
      renderMeta={(item) => (
        <div className="flex items-center gap-2">
          <span>
            {[item.category, item.platform, item.publishedAt]
              .filter(Boolean)
              .join(" · ")}
          </span>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              View →
            </a>
          )}
        </div>
      )}
    />
  );
}
