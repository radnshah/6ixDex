"use client";

import { useEffect, useState } from "react";
import { FloatingPanel } from "./FloatingPanel";

const DAYS_ON_JOURNEY = 58;

interface Counts {
  organizations: number;
  events: number;
  content: number;
  people: number;
}

export function JourneyDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ["organizations", "events", "content", "people"].map((type) =>
        fetch(`/api/${type}`).then((res) => res.json()),
      ),
    ).then(([organizations, events, content, people]) => {
      if (cancelled) return;
      setCounts({
        organizations: organizations.length,
        events: events.length,
        content: content.length,
        people: people.length,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { label: "Days on journey", value: DAYS_ON_JOURNEY },
    { label: "Startups visited", value: counts?.organizations ?? 0 },
    { label: "Events attended", value: counts?.events ?? 0 },
    { label: "Content created", value: counts?.content ?? 0 },
    { label: "People met", value: counts?.people ?? 0 },
  ];

  return (
    <FloatingPanel className="pointer-events-auto mx-auto flex w-fit min-w-0 max-w-full items-stretch divide-x divide-white/10 overflow-x-auto px-2 py-3 sm:px-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex shrink-0 flex-col items-center gap-0.5 px-4 sm:px-6"
        >
          <span className="text-xl font-semibold text-zinc-50 sm:text-2xl">
            {stat.value}
          </span>
          <span className="whitespace-nowrap text-[11px] uppercase tracking-wide text-zinc-500">
            {stat.label}
          </span>
        </div>
      ))}
    </FloatingPanel>
  );
}
