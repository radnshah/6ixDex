"use client";

import { useState, type FormEvent } from "react";
import { FloatingPanel } from "@/components/FloatingPanel";

const TYPE_OPTIONS = ["Place", "Event", "Opportunity", "Person to meet", "Other"];

export default function SuggestPage() {
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description, contactInfo: contactInfo || undefined }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong submitting this. Try again?");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-4 pl-28 sm:pl-36">
      <FloatingPanel className="w-full max-w-md p-6">
        {submitted ? (
          <>
            <h1 className="text-lg font-semibold text-zinc-50">Thanks!</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your suggestion has been sent — I read every one of these.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-zinc-50">
              Suggest a spot, event, or opportunity
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Know a place I should check out, an event worth attending, or
              someone I should meet? Let me know.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/50 focus:outline-none"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  What's the suggestion?
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell me about it..."
                  className="min-h-[100px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Your contact info (optional)
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Email, LinkedIn, whatever's easiest"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-cyan-300 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send suggestion"}
              </button>
            </form>
          </>
        )}
      </FloatingPanel>
    </div>
  );
}
