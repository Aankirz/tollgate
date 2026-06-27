"use server";

import { signIn, signOut } from "@/auth";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const ref = String(formData.get("ref") ?? "");

  await signIn("credentials", {
    email,
    ref: ref || undefined,
    redirectTo: "/app",
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
