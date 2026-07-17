"use client";

import { useEffect, useState } from "react";
import { FloatingPanel } from "./FloatingPanel";

interface JourneyStats {
  daysOnJourney: number;
  startupsVisited: number;
  eventsAttended: number;
  contentCreated: number;
  peopleMet: number;
}

export function JourneyDashboard() {
  const [stats, setStats] = useState<JourneyStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/journey-stats")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    { label: "Days on journey", value: stats?.daysOnJourney ?? 0 },
    { label: "Startups visited", value: stats?.startupsVisited ?? 0 },
    { label: "Events attended", value: stats?.eventsAttended ?? 0 },
    { label: "Content created", value: stats?.contentCreated ?? 0 },
    { label: "People met", value: stats?.peopleMet ?? 0 },
  ];

  return (
    <FloatingPanel className="pointer-events-auto mx-auto flex w-fit min-w-0 max-w-full items-stretch divide-x divide-white/10 overflow-x-auto px-2 py-3 sm:px-4">
      {items.map((stat) => (
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
