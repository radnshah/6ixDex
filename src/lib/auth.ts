import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export interface CurrentUser {
  id: string;
  email: string;
  role: "ADMIN" | "VIEWER";
}

// Auto-creates a VIEWER profile on first login for any authenticated
// Supabase user — admin is never the default, only granted by manually
// updating a profile's role afterward.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;

  const profile = await prisma.userProfile.upsert({
    where: { id: user.id },
    create: { id: user.id, email: user.email, role: "VIEWER" },
    update: {},
  });

  return { id: profile.id, email: profile.email, role: profile.role };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}
