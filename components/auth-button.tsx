"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session?.user) {
    return (
      <Button
        className="glass-bg rounded-full p-2 h-auto w-auto"
        onClick={() => signOut()}
        title={`Sign out (${session.user.email})`}
      >
        <LogOut style={{ width: "30px", height: "30px" }} />
      </Button>
    );
  }

  return (
    <Button
      className="glass-bg rounded-full p-2 h-auto w-auto"
      onClick={() => signIn()}
      title="Sign in"
    >
      <LogIn style={{ width: "30px", height: "30px" }} />
    </Button>
  );
}
