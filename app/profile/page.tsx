import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AddSkillCard } from "@/components/AddSkillCard";

type RawUserSkill = {
  id: string;
  level: string;
  verified: boolean;
  proof_url: string | null;
  skills: { name: string } | { name: string }[] | null;
};

type UserSkill = {
  id: string;
  level: string;
  status: "verified" | "pending";
  proof_url: string | null;
  skillName: string;
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();

  // 1️⃣ Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2️⃣ Load profile info
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, email")
    .eq("id", user.id)
    .maybeSingle();

  // 3️⃣ Load user's skills
  const { data, error } = await supabase
    .from("user_skills")
    .select(`
      id,
      level,
      verified,
      proof_url,
      skills (
        name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("PROFILE FETCH ERROR:", error);
  }

  // Normalize safely
  const userSkills: UserSkill[] = (data ?? []).map((item: RawUserSkill) => {
    let skillName = "Unknown Skill";

    if (Array.isArray(item.skills)) {
      skillName = item.skills[0]?.name ?? "Unknown Skill";
    } else if (item.skills) {
      skillName = item.skills.name;
    }

    return {
      id: item.id,
      level: item.level,
      status: item.verified ? "verified" : "pending",
      proof_url: item.proof_url,
      skillName,
    };
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight">
            {profile?.username ?? "Your Profile"}
          </h1>
          <p className="text-zinc-400 mt-2">{profile?.email}</p>
        </div>

        {/* Add Skill Section */}
        <div className="mb-12">
          <AddSkillCard userId={user.id} />
        </div>

        {/* Skills Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Skills</h2>

          {userSkills.length === 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-400">
              You haven’t added any skills yet.
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {userSkills.map((skill) => {
              const statusStyles =
                skill.status === "verified"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

              return (
                <div
                  key={skill.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold">
                      {skill.skillName}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${statusStyles}`}
                    >
                      {skill.status}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400">
                    Level: {skill.level}
                  </p>

                  {skill.proof_url && (
                    <a
                      href={skill.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition"
                    >
                      View proof →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
