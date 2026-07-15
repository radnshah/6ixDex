"use client";

import { FloatingPanel } from "./FloatingPanel";

export function SearchBar() {
  return (
    <FloatingPanel className="flex items-center gap-3 px-4 py-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-zinc-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        placeholder="Search startups, founders, events, places..."
        className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
      />
    </FloatingPanel>
  );
}
