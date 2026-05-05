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

    // ✅ Success (even if Supabase says "already registered")
    setMessage("✅ Account ready! You can log in now.");
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 rounded bg-black text-white border border-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-black text-white border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded bg-black text-white border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-2 rounded bg-white text-black font-semibold"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}