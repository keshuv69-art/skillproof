"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    // ✅ Validate username
    if (!username.trim()) {
      setMessage("Username is required");
      setLoading(false);
      return;
    }

    const cleanUsername = username.toLowerCase().trim();

    // ✅ Check username availability
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

    // ✅ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // 🔴 Handle real auth errors
    if (error && !data?.user) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const user = data?.user;

    if (!user) {
      setMessage("Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    // ✅ Insert profile ONLY if it doesn't exist
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email,
            username: cleanUsername,
          },
        ]);

      // ⚠️ Ignore duplicate errors safely
      if (profileError && !profileError.message.includes("duplicate")) {
        setMessage(profileError.message);
        setLoading(false);
        return;
      }
    }

    // ✅ Success
    setMessage("✅ Account ready! You can log in now.");
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-900/50 backdrop-blur rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Create Account
          </h1>

          <p className="text-zinc-400 mt-3 text-sm">
            Build your verified skill identity.
          </p>
        </div>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition font-semibold disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-zinc-300">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}