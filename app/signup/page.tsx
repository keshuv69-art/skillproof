"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessage("Something went wrong.");
      setLoading(false);
      return;
    }

    // Create minimal profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
        },
      ]);

    if (
      profileError &&
      !profileError.message.toLowerCase().includes("duplicate")
    ) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    setMessage("✅ Account created!");

    setTimeout(() => {
      router.push("/login");
    }, 1000);

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Create Account
          </h1>

          <p className="text-zinc-400 mt-4">
            Build your verified skill identity.
          </p>
        </div>

        <div className="space-y-4">

          {/* EMAIL */}
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* PASSWORD */}
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {message && (
            <p className="text-center text-sm text-zinc-400 pt-2">
              {message}
            </p>
          )}

        </div>

      </div>
    </main>
  );
}