"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }

    // Check profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    // No username → onboarding
    if (!profile?.username) {
      router.push("/setup-profile");
      return;
    }

    // Existing user
    router.push("/profile");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome Back
          </h1>

          <p className="text-zinc-400 mt-4">
            Log into your SkillProof account.
          </p>
        </div>

        <div className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

        </div>

      </div>
    </main>
  );
}