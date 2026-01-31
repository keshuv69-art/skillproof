"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState<any[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [proofInput, setProofInput] = useState<{ [key: string]: string }>({});

  // 1️⃣ Auth + ensure profile
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const user = data.user;

      setEmail(user.email);
      setLoading(false);

      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email
      });

      loadUserSkills();
    };

    loadUser();
  }, [router]);

  // 2️⃣ Load skills
  useEffect(() => {
    const loadSkills = async () => {
      const { data } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      setSkills(data || []);
    };

    loadSkills();
  }, []);

  // 3️⃣ Load user skills
  const loadUserSkills = async () => {
    const { data } = await supabase
      .from("user_skills")
      .select(`
        id,
        level,
        status,
        proof_url,
        skills ( name )
      `)
      .order("status", { ascending: false });

    setUserSkills(data || []);
  };

  // 4️⃣ Add skill
  const addSkill = async (skillId: string) => {
    if (!skillId) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("user_skills").insert({
      user_id: user.id,
      skill_id: skillId,
      level: "beginner",
      status: "pending"
    });

    if (!error) loadUserSkills();
  };

  // 5️⃣ Save proof
  const saveProof = async (id: string) => {
    const url = proofInput[id];
    if (!url) return;

    await supabase
      .from("user_skills")
      .update({
        proof_url: url,
        status: "pending"
      })
      .eq("id", id);

    setProofInput({});
    loadUserSkills();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-2">
        HELLO {email}
      </h1>

      <p className="text-gray-400 mb-8">
        Verified skill-based profile
      </p>

      {/* Add Skill */}
      <h2 className="text-xl font-semibold mb-3">
        Add a Skill
      </h2>

      <select
        onChange={(e) => addSkill(e.target.value)}
        className="w-full max-w-md mb-10 px-3 py-2 bg-black border border-gray-700 text-white rounded"
      >
        <option value="">Select a skill</option>
        {skills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>

      {/* User Skills */}
      <h2 className="text-xl font-semibold mb-4">
        Your Skills
      </h2>

      <ul className="space-y-4">
        {userSkills.map((us) => (
          <li
            key={us.id}
            className="border border-gray-700 rounded p-4"
          >
            <strong>{us.skills.name}</strong>

            {/* STATUS BADGES */}
            <div className="flex items-center gap-3 text-sm mb-3 mt-1">
              <span className="text-gray-400">
                Level: {us.level}
              </span>

              {us.status === "verified" && (
                <span className="px-2 py-1 text-xs bg-green-600 rounded">
                  ✅ Verified
                </span>
              )}

              {us.status === "pending" && (
                <span className="px-2 py-1 text-xs bg-yellow-600 rounded">
                  ⏳ Pending
                </span>
              )}

              {us.status === "rejected" && (
                <span className="px-2 py-1 text-xs bg-red-600 rounded">
                  ❌ Rejected
                </span>
              )}
            </div>

            <input
              type="text"
              disabled={us.status === "verified"}
              placeholder={
                us.status === "verified"
                  ? "Verified proof"
                  : "Paste proof link (GitHub, Drive, Video)"
              }
              value={proofInput[us.id] || us.proof_url || ""}
              onChange={(e) =>
                setProofInput({
                  ...proofInput,
                  [us.id]: e.target.value
                })
              }
              className="w-full mb-2 px-3 py-2 bg-black border border-gray-700 rounded text-white disabled:opacity-50"
            />

            <button
              disabled={us.status === "verified"}
              onClick={() => saveProof(us.id)}
              className="px-3 py-1 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Save Proof
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
        className="mt-10 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
      >
        Log out
      </button>
    </main>
  );
}
