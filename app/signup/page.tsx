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

    // ✅ INSERT PROFILE ROW
    if (data.user) {
      const { error: profileError } = await supabase.auth.signUp({
  email,
  password,
});


      if (profileError) {
        setMessage(profileError.message);
        setLoading(false);
        return;
      }
    }

    setMessage("✅ Account created! You can log in now.");
    setLoading(false);
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-black text-white border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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
