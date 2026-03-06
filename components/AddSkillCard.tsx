"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type Skill = {
  id: string;
  name: string;
};

export function AddSkillCard({ userId }: { userId: string }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("id, name")
        .order("name");

      if (error) console.error(error);
      if (data) setSkills(data);
    };

    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!skillId) {
      alert("Select a skill first");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("user_skills").insert({
      user_id: userId,
      skill_id: skillId,
      level,
      proof_url: proofUrl || null,
      verified: false,
    });

    if (error) {
      console.error(error);
      alert("Insert failed. Check console.");
    } else {
      alert("Skill submitted!");
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Add a New Skill
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Skill Select */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Skill
          </label>

          <select
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" className="bg-zinc-800 text-white">
              Choose skill
            </option>

            {skills.map((skill) => (
              <option
                key={skill.id}
                value={skill.id}
                className="bg-zinc-800 text-white"
              >
                {skill.name}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Level
          </label>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option className="bg-zinc-800">Beginner</option>
            <option className="bg-zinc-800">Intermediate</option>
            <option className="bg-zinc-800">Advanced</option>
            <option className="bg-zinc-800">Expert</option>
          </select>
        </div>

        {/* Proof */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Proof URL
          </label>

          <input
            type="text"
            placeholder="https://..."
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-xl px-4 py-3 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition rounded-xl py-3 font-medium disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for Verification"}
        </button>

      </form>
    </div>
  );
}