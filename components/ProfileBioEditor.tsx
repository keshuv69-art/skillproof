"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function ProfileBioEditor({
  initialBio,
  userId,
}: {
  initialBio: string;
  userId: string;
}) {
  const [bio, setBio] = useState(initialBio || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaved(false);

      const { error } = await supabase
        .from("profiles")
        .update({
          bio,
        })
        .eq("id", userId);

      if (error) {
        console.error(error);
        alert("Failed to save bio.");
        return;
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-5">

      <div className="flex items-center justify-between mb-4">

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Bio
          </p>

          <p className="text-sm text-zinc-500 mt-1">
            Introduce yourself publicly
          </p>
        </div>

        {saved && (
          <div className="text-emerald-400 text-sm">
            Saved ✓
          </div>
        )}

      </div>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell people about your expertise, experience, and strengths..."
        rows={5}
        maxLength={300}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex items-center justify-between mt-4">

        <p className="text-xs text-zinc-500">
          {bio.length}/300
        </p>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Bio"}
        </button>

      </div>

    </div>
  );
}