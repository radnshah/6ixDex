"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { SideNav } from "./SideNav";
import { LogoAnimation } from "./LogoAnimation";
import { LoadingScreen } from "./LoadingScreen";

export function AppShell({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <LayoutGroup>
      {children}

      {!loading && (
        <>
          <SideNav />
          <LogoAnimation />
        </>
      )}

      <AnimatePresence>
        {loading && (
          <LoadingScreen key="loading-screen" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
