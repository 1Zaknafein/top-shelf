import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

/**
 * NextAuth configuration, using PrismaAdapter for database interactions and supporting both Google OAuth and email/password credentials.
 * The JWT callback is used to include the user ID in the token, which is then added to the session object for easy access throughout the application.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        return valid ? user : null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username =
          (user as { username?: string | null }).username ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.username !== undefined)
        (session.user as { username?: string | null }).username =
          token.username as string | null;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
