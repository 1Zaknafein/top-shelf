"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("username") as string;
    const password = form.get("password") as string;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    // Auto sign-in after successful registration
    const result = await signIn("credentials", {
      username: name,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created but sign-in failed. Please sign in manually.");
      router.push("/signin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-bg rounded-xl p-8 w-full max-w-sm flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-center">Create account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 8 characters)"
            required
            className={inputStyle}
          />

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-center text-white/50">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-white/80 hover:text-white underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle =
  "glass-bg rounded-lg px-4 py-2 text-sm outline-none border border-white/20 focus:border-white/60 transition-colors";
