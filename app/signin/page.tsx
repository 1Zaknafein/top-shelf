"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const errorMessages: Record<string, string> = {
  OAuthCreateAccount: "Could not create account. Please try again.",
  OAuthSignin: "Could not sign in with Google. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  CredentialsSignin: "Incorrect email or password.",
};

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const urlError = searchParams.get("error");

  const [error, setError] = useState<string | null>(
    urlError ? (errorMessages[urlError] ?? "Something went wrong.") : null,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setError(errorMessages[result.error] ?? "Incorrect email or password.");
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-bg rounded-xl p-8 w-full max-w-sm flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-center">Sign in</h1>

        <Button
          className="w-full"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-white/30 text-xs">
          <hr className="flex-1 border-white/20" />
          or
          <hr className="flex-1 border-white/20" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="glass-bg rounded-lg px-4 py-2 text-sm outline-none border border-white/20 focus:border-white/60 transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="glass-bg rounded-lg px-4 py-2 text-sm outline-none border border-white/20 focus:border-white/60 transition-colors"
          />

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full mt-1">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-sm text-center text-white/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-white/80 hover:text-white underline transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
