import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    // Extending the default Session type to include the user ID, which is added in the jwt callback
    user: {
      id: string;
      username?: string | null;
    } & DefaultSession["user"];
  }
}
