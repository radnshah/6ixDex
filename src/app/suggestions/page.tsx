import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SuggestionsInbox } from "@/components/SuggestionsInbox";

export const dynamic = "force-dynamic";

export default async function SuggestionsPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const [suggestions, waitlist] = await Promise.all([
    prisma.suggestion.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.waitlistEntry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return <SuggestionsInbox suggestions={suggestions} waitlist={waitlist} />;
}
