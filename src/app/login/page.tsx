"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { FloatingPanel } from "@/components/FloatingPanel";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // A full navigation (not router.push) so every client component that
    // reads auth state on mount — like SideNav, which lives in the root
    // layout and won't remount on a soft navigation — picks up the new
    // session immediately instead of only after a manual page reload.
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-4">
      <FloatingPanel className="w-full max-w-sm p-6">
        <h1 className="text-lg font-semibold text-zinc-50">Log in</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Admin access for 6ixDex.
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/50 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </FloatingPanel>
    </div>
  );
}
