"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SetupProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // Check existing profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, bio")
          .eq("id", user.id)
          .maybeSingle();

        // If already setup -> profile
        if (
          profile?.username &&
          profile.username !== user.email?.split("@")[0]
        ) {
          router.push("/profile");
          return;
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, [router]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      const cleanUsername = username
        .toLowerCase()
        .trim();

      if (!cleanUsername) {
        setMessage("Username is required");
        return;
      }

      // Username validation
      const usernameRegex = /^[a-z0-9_]+$/;

      if (!usernameRegex.test(cleanUsername)) {
        setMessage(
          "Username can only contain lowercase letters, numbers, and underscores"
        );
        return;
      }

      if (cleanUsername.length < 3) {
        setMessage(
          "Username must be at least 3 characters"
        );
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

      // Check availability
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .neq("id", user.id)
        .maybeSingle();

      if (existingUser) {
        setMessage("Username already taken");
        return;
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          username: cleanUsername,
          bio: bio.trim() || null,
        })
        .eq("id", user.id);

      if (error) {
        setMessage(error.message);
        return;
      }

      // Refresh auth/session state
      await supabase.auth.getSession();

      router.refresh();
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-40" />

      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.12)] p-8 md:p-10">

        {/* Decorative Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

        <div className="relative">

          <div className="text-center mb-10">

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Create Your Identity
            </div>

            <h1 className="text-5xl font-bold tracking-tight">
              Setup Profile
            </h1>

            <p className="text-zinc-400 mt-4">
              Choose your public SkillProof identity.
            </p>

            <p className="text-purple-400 text-sm mt-3">
              skillproof.app/u/username
            </p>

          </div>

          <div className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Username
              </label>

              <input
                type="text"
                autoComplete="username"
                spellCheck={false}
                autoCapitalize="none"
                placeholder="yourname"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full rounded-2xl bg-zinc-900/80 border border-zinc-700 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Bio
              </label>

              <textarea
                placeholder="Tell people about yourself..."
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                rows={4}
                className="w-full rounded-2xl bg-zinc-900/80 border border-zinc-700 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 font-semibold text-white hover:opacity-90 transition disabled:opacity-50 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
            >
              {loading ? "Saving..." : "Continue"}
            </button>

            {/* Message */}
            {message && (
              <p className="text-center text-sm text-zinc-400 pt-2">
                {message}
              </p>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}