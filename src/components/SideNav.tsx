"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FloatingPanel } from "./FloatingPanel";
import { useCurrentUser } from "@/lib/use-current-user";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Map",
    icon: (
      <>
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
        <path d="M9 4v14M15 6v14" />
      </>
    ),
  },
  {
    href: "/organizations",
    label: "Orgs",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M9 21v-4h6v4M9 8h.01M9 12h.01M15 8h.01M15 12h.01" />
      </>
    ),
  },
  {
    href: "/events",
    label: "Events",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
  },
  {
    href: "/places",
    label: "Places",
    icon: (
      <>
        <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
  },
  {
    href: "/people",
    label: "People",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </>
    ),
  },
  {
    href: "/content",
    label: "Content",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m10 9 5 3-5 3V9Z" />
      </>
    ),
  },
  {
    href: "/journal",
    label: "Journal",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path d="M9 3v18M13 8h4M13 12h4" />
      </>
    ),
  },
];

function displayNameFromEmail(email: string): string {
  const localPart = email.split("@")[0];
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="pointer-events-none fixed left-4 top-1/2 z-40 -translate-y-1/2 sm:left-6">
      <FloatingPanel className="pointer-events-auto flex flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors ${
                active
                  ? "bg-white/10 text-cyan-400"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {!loading && (
          <>
            <div className="my-1 border-t border-white/10" />
            {user && (
              <div className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-300">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                <span className="max-w-[64px] truncate text-[10px] font-medium">
                  {displayNameFromEmail(user.email)}
                </span>
              </div>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5M21 12H9" />
                </svg>
                <span className="text-[10px] font-medium">Log out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5M15 12H3" />
                </svg>
                <span className="text-[10px] font-medium">Log in</span>
              </Link>
            )}
          </>
        )}
      </FloatingPanel>
    </div>
  );
}
