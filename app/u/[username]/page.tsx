import { createSupabaseServer } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import CopyProfileLink from "@/components/CopyProfileLink";

type SkillRow = {
  level: string;
  proof_url: string | null;
  skills: { name: string } | { name: string }[] | null;
};

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>; // ✅ FIXED (Next 16)
}) {
  // ✅ unwrap params properly
  const { username } = await params;

  const supabase = await createSupabaseServer();

  // 🔥 Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (!profile) return notFound();

  // 🔥 Get ONLY approved skills
  const { data: skillsData, error } = await supabase
    .from("user_skills")
    .select(`
      level,
      proof_url,
      skills ( name )
    `)
    .eq("user_id", profile.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("PUBLIC PROFILE ERROR:", JSON.stringify(error, null, 2));
  }

  const skills: SkillRow[] = skillsData ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden">

      {/* 🌌 Midnight Purple Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-30" />

      <div className="relative max-w-4xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-12 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            @{profile.username}
          </h1>

          {/* ✅ Verified badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 text-sm rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Verified Skill Profile
          </div>

          {/* 🔗 Share */}
          <div className="mt-4">
            <CopyProfileLink username={profile.username} />
          </div>

          <p className="mt-4 text-zinc-400 text-sm">
            {skills.length} verified skill{skills.length !== 1 && "s"}
          </p>
        </div>

        {/* SKILLS */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Verified Skills
          </h2>

          {skills.length === 0 && (
            <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6 text-zinc-400">
              No verified skills yet.
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {skills.map((item, i) => {
              let skillName = "Unknown Skill";

              if (Array.isArray(item.skills)) {
                skillName = item.skills[0]?.name ?? "Unknown Skill";
              } else if (item.skills) {
                skillName = item.skills.name;
              }

              return (
                <div
                  key={i}
                  className="group bg-zinc-900/60 backdrop-blur border border-zinc-800 hover:border-indigo-500/40 transition-all rounded-2xl p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold group-hover:text-indigo-300 transition">
                      {skillName}
                    </h3>

                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      verified
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400">
                    Level: {item.level}
                  </p>

                  {item.proof_url && (
                    <a
                      href={item.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
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