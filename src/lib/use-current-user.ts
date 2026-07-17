"use client";

import { useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  email: string;
  role: "ADMIN" | "VIEWER";
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, isAdmin: user?.role === "ADMIN", loading };
}
