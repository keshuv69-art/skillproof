import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AddSkillCard } from "@/components/AddSkillCard";

type RawUserSkill = {
  id: string;
  level: string;
  status: string;
  proof_url: string | null;
  skills: { name: string } | { name: string }[] | null;
};

type UserSkill = {
  id: string;
  level: string;
  status: "approved" | "pending" | "rejected";
  proof_url: string | null;
  skillName: string;
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, email")
    .eq("id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("user_skills")
    .select(`
      id,
      level,
      status,
      proof_url,
      skills ( name )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("PROFILE FETCH ERROR:", JSON.stringify(error, null, 2));
  }

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
      status: item.status as any,
      proof_url: item.proof_url,
      skillName,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden">
      
      {/* 🌌 Midnight Purple Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-30" />

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            @{profile?.username ?? "profile"}
          </h1>

          <p className="text-zinc-400 mt-2">{profile?.email}</p>

          {/* ✅ Clean Verified Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 text-sm rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Verified Skill Profile
          </div>
        </div>

        {/* ADD SKILL */}
        <div className="mb-12">
          <AddSkillCard userId={user.id} />
        </div>

        {/* SKILLS */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Your Skills
          </h2>

          {userSkills.length === 0 && (
            <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-6 text-zinc-400">
              You haven’t added any skills yet.
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {userSkills.map((skill) => {
              const isVerified = skill.status === "approved";

              const statusStyles = isVerified
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : skill.status === "pending"
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20";

              return (
                <div
                  key={skill.id}
                  className="group bg-zinc-900/60 backdrop-blur border border-zinc-800 hover:border-indigo-500/40 transition-all rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold group-hover:text-indigo-300 transition">
                      {skill.skillName}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize ${statusStyles}`}
                    >
                      {isVerified ? "verified" : skill.status}
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