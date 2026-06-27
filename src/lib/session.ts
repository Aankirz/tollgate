import { auth } from "@/auth";

// Shared contract: other modules import this to read the current user.
// Keep the exact signature stable.
export async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email) return null;
  return { id: user.id, email: user.email };
}
