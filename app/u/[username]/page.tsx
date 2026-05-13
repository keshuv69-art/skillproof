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
  params: Promise<{ username: string }>;
}) {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">

      {/* 🌌 Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-40" />

      {/* Additional Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative max-w-5xl mx-auto px-6 py-16">

        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.12)] p-8 md:p-10 mb-14">

          {/* Decorative Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Verified Skill Profile
              </div>

              <h1 className="text-5xl font-bold tracking-tight">
                @{profile.username}
              </h1>

              <p className="mt-4 text-zinc-400 max-w-xl">
                Public verified portfolio powered by SkillProof.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-8">

                <div>
                  <p className="text-3xl font-bold text-white">
                    {skills.length}
                  </p>

                  <p className="text-sm text-zinc-500">
                    Verified Skills
                  </p>
                </div>

                <div className="w-px h-12 bg-white/10" />

                <div>
                  <p className="text-3xl font-bold text-indigo-300">
                    100%
                  </p>

                  <p className="text-sm text-zinc-500">
                    Verified
                  </p>
                </div>

              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start md:items-end gap-4">

              <div className="px-5 py-3 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1">
                  Profile Status
                </p>

                <p className="text-emerald-400 font-medium">
                  Active & Verified
                </p>
              </div>

              <CopyProfileLink username={profile.username} />

            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                Verified Skills
              </h2>

              <p className="text-zinc-500 mt-2">
                Skills approved through the SkillProof verification system.
              </p>
            </div>
          </div>

          {skills.length === 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-zinc-400">
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
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]"
                >

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

                  <div className="relative">

                    <div className="flex justify-between items-start mb-4">

                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-indigo-300 transition">
                          {skillName}
                        </h3>

                        <p className="text-sm text-zinc-500 mt-1">
                          Verified expertise
                        </p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-6">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Skill Level
                        </p>

                        <p className="text-lg font-medium mt-1">
                          {item.level}
                        </p>
                      </div>

                      {item.proof_url && (
                        <a
                          href={item.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition"
                        >
                          View Proof →
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}