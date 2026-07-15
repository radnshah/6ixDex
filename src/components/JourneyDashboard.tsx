"use client";

import { FloatingPanel } from "./FloatingPanel";
import { JOURNEY_STATS } from "@/data/journey-stats";

export function JourneyDashboard() {
  return (
    <FloatingPanel className="pointer-events-auto mx-auto flex w-fit min-w-0 max-w-full items-stretch divide-x divide-white/10 overflow-x-auto px-2 py-3 sm:px-4">
      {JOURNEY_STATS.map((stat) => (
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
