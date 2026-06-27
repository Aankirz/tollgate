import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getOrCreateUser } from "@/lib/users";
import { applyReferral } from "@/lib/referral";

// ponytail: DEMO auth — email-only, no password. A real product would use a
// magic-link or OAuth provider; this exists purely so the demo has a session.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        ref: { label: "Referral", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        if (typeof email !== "string" || !email) return null;

        const ref = typeof credentials?.ref === "string" ? credentials.ref : undefined;

        const { user, isNew } = await getOrCreateUser(email);

        if (isNew && ref && ref !== user.id) {
          try {
            await applyReferral({ referrerUserId: ref, referredUserId: user.id });
          } catch {
            // Referral is best-effort; never block sign-in on a bad ref.
          }
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.uid === "string") {
        session.user.id = token.uid;
      }
      return session;
    },
  },
});
