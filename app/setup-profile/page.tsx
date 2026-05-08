"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SetupProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    const cleanUsername = username.toLowerCase().trim();

    if (!cleanUsername) {
      setMessage("Username is required");
      setLoading(false);
      return;
    }

    // Check availability
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existingUser) {
      setMessage("Username already taken");
      setLoading(false);
      return;
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername,
      })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/profile");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Choose Username
          </h1>

          <p className="text-zinc-400 mt-4">
            Your public SkillProof identity.
          </p>

          <p className="text-purple-400 text-sm mt-2">
            skillproof.app/u/username
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="text"
            autoComplete="username"
            spellCheck={false}
            autoCapitalize="none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
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