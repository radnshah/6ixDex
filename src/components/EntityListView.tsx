import Link from "next/link";
import { FloatingPanel } from "./FloatingPanel";
import type { ReactNode } from "react";

interface ListItem {
  entityId: string;
  name: string;
}

export function EntityListView<T extends ListItem>({
  title,
  kind,
  items,
  renderMeta,
  linkToMap = true,
}: {
  title: string;
  kind: string;
  items: T[];
  renderMeta: (item: T) => ReactNode;
  linkToMap?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-zinc-950 px-6 py-10 pl-28 text-zinc-100 sm:pl-36">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </p>

        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const card = (
              <FloatingPanel
                className={`p-4 ${linkToMap ? "transition-colors hover:bg-white/10" : ""}`}
              >
                <h2 className="text-sm font-semibold text-zinc-50">
                  {item.name}
                </h2>
                <div className="mt-1 text-xs text-zinc-400">
                  {renderMeta(item)}
                </div>
              </FloatingPanel>
            );

            return linkToMap ? (
              <Link key={item.entityId} href={`/?focus=${kind}:${item.entityId}`}>
                {card}
              </Link>
            ) : (
              <div key={item.entityId}>{card}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
