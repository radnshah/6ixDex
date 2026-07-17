"use client";

import { useState, type FormEvent } from "react";
import { FloatingPanel } from "@/components/FloatingPanel";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again?");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-4 pl-28 sm:pl-36">
      <FloatingPanel className="w-full max-w-md p-6">
        {submitted ? (
          <>
            <h1 className="text-lg font-semibold text-zinc-50">You're on the list</h1>
            <p className="mt-2 text-sm text-zinc-400">
              I'll reach out when there's something to open up.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-zinc-50">6ixDex is a work in progress</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Right now this is my own tool for tracking Toronto&apos;s startup
              ecosystem — companies, founders, events, places, all in one map.
              It&apos;s not open for public accounts yet. If you&apos;d like to
              know when that changes, leave your email.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-cyan-300 disabled:opacity-50"
              >
                {loading ? "Joining…" : "Join the waitlist"}
              </button>
            </form>
          </>
        )}
      </FloatingPanel>
    </div>
  );
}
