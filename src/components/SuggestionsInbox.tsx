"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingPanel } from "./FloatingPanel";

interface Suggestion {
  id: string;
  type: string;
  description: string;
  contactInfo: string | null;
  reviewed: boolean;
  createdAt: string | Date;
}

interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: string | Date;
}

export function SuggestionsInbox({
  suggestions,
  waitlist,
}: {
  suggestions: Suggestion[];
  waitlist: WaitlistEntry[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function toggleReviewed(suggestion: Suggestion) {
    setPendingId(suggestion.id);
    await fetch(`/api/suggestions/${suggestion.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewed: !suggestion.reviewed }),
    });
    router.refresh();
    setPendingId(null);
  }

  async function dismiss(suggestion: Suggestion) {
    if (!confirm("Delete this suggestion permanently?")) return;
    setPendingId(suggestion.id);
    await fetch(`/api/suggestions/${suggestion.id}`, { method: "DELETE" });
    router.refresh();
    setPendingId(null);
  }

  const unreviewed = suggestions.filter((s) => !s.reviewed);
  const reviewed = suggestions.filter((s) => s.reviewed);

  return (
    <div className="min-h-dvh bg-zinc-950 px-6 py-10 pl-28 text-zinc-100 sm:pl-36">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">Suggestions</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {unreviewed.length} unreviewed · {suggestions.length} total
        </p>

        <div className="mt-6 space-y-3">
          {suggestions.length === 0 && (
            <p className="text-sm text-zinc-500">Nothing here yet.</p>
          )}
          {[...unreviewed, ...reviewed].map((suggestion) => (
            <FloatingPanel
              key={suggestion.id}
              className={`p-4 ${suggestion.reviewed ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-block rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-400">
                    {suggestion.type}
                  </span>
                  <p className="mt-2 text-sm text-zinc-200">{suggestion.description}</p>
                  {suggestion.contactInfo && (
                    <p className="mt-1.5 text-xs text-zinc-500">
                      Contact: {suggestion.contactInfo}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-zinc-600">
                    {new Date(suggestion.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button
                    onClick={() => toggleReviewed(suggestion)}
                    disabled={pendingId === suggestion.id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-400 transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    {suggestion.reviewed ? "Mark unread" : "Mark reviewed"}
                  </button>
                  <button
                    onClick={() => dismiss(suggestion)}
                    disabled={pendingId === suggestion.id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </FloatingPanel>
          ))}
        </div>

        <h2 className="mt-10 text-lg font-semibold">Waitlist</h2>
        <p className="mt-1 text-sm text-zinc-500">{waitlist.length} signed up</p>

        <div className="mt-4 space-y-2">
          {waitlist.length === 0 && (
            <p className="text-sm text-zinc-500">No signups yet.</p>
          )}
          {waitlist.map((entry) => (
            <FloatingPanel
              key={entry.id}
              className="flex items-center justify-between p-3"
            >
              <span className="text-sm text-zinc-200">{entry.email}</span>
              <span className="text-xs text-zinc-600">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </FloatingPanel>
          ))}
        </div>
      </div>
    </div>
  );
}
