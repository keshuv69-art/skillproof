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
    .select("id, username, bio")
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

  const hasVerifiedSkills = skills.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-40" />

      {/* Additional Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative max-w-5xl mx-auto px-6 py-16">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.12)] p-8 md:p-10 mb-14">

          {/* Decorative Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

            {/* LEFT */}
            <div className="flex-1">

              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>

                {hasVerifiedSkills
                  ? "Verified Professional"
                  : "SkillProof Member"}
              </div>

              <div className="flex items-center gap-3 flex-wrap">

                <h1 className="text-5xl font-bold tracking-tight">
                  @{profile.username}
                </h1>

                {hasVerifiedSkills && (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    Verified
                  </div>
                )}

              </div>

              <p className="mt-4 text-zinc-400 max-w-2xl leading-relaxed">
                {profile.bio ||
                  "This user hasn’t added a bio yet."}
              </p>

              {/* STATS */}
              <div className="flex items-center gap-8 mt-10">

                <div>

                  <p className="text-4xl font-bold text-white">
                    {skills.length}
                  </p>

                  <p className="text-sm text-zinc-500 mt-1">
                    Verified Skills
                  </p>

                </div>

                <div className="w-px h-14 bg-white/10" />

                <div>

                  <p className="text-4xl font-bold text-indigo-300">
                    {skills.filter((s) => s.proof_url).length}
                  </p>

                  <p className="text-sm text-zinc-500 mt-1">
                    Proof Submissions
                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-4 min-w-[240px]">

              <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-5">

                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Profile Status
                </p>

                <p className="text-emerald-400 font-medium">
                  {hasVerifiedSkills
                    ? "Active & Verified"
                    : "Profile Active"}
                </p>

              </div>

              <CopyProfileLink username={profile.username} />

            </div>

          </div>

        </div>

        {/* SKILLS SECTION */}
        <div>

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-3xl font-bold">
                Verified Skills
              </h2>

              <p className="text-zinc-500 mt-2">
                Approved skills verified through SkillProof.
              </p>

            </div>

          </div>

          {/* EMPTY */}
          {skills.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center">

              <div className="text-5xl mb-5">
                🚀
              </div>

              <h3 className="text-2xl font-semibold">
                No verified skills yet
              </h3>

              <p className="text-zinc-500 mt-3 max-w-md mx-auto">
                This user has not received any approved skill
                verifications yet.
              </p>

            </div>
          )}

          {/* SKILL GRID */}
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

                    {/* TOP */}
                    <div className="flex items-start justify-between mb-5">

                      <div>

                        <h3 className="text-2xl font-semibold group-hover:text-indigo-300 transition">
                          {skillName}
                        </h3>

                        <p className="text-sm text-zinc-500 mt-2">
                          Verified professional skill
                        </p>

                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                        verified
                      </span>

                    </div>

                    {/* LEVEL */}
                    <div className="mb-6">

                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Skill Level
                      </p>

                      <p className="text-xl font-medium mt-2">
                        {item.level}
                      </p>

                    </div>

                    {/* PROOF */}
                    {item.proof_url && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30">

                        {/* IMAGE */}
                        {item.proof_url.match(
                          /\.(jpeg|jpg|png|gif|webp)$/i
                        ) ? (
                          <img
                            src={item.proof_url}
                            alt="Skill proof"
                            className="w-full h-52 object-cover"
                          />
                        ) : (
                          <div className="h-44 flex items-center justify-center text-zinc-500 text-sm bg-zinc-900/50">
                            External Proof Document
                          </div>
                        )}

                        {/* FOOTER */}
                        <div className="p-4 border-t border-white/10 flex items-center justify-between">

                          <div>

                            <p className="text-sm font-medium">
                              Verification Proof
                            </p>

                            <p className="text-xs text-zinc-500 mt-1">
                              Evidence submitted for approval
                            </p>

                          </div>

                          <a
                            href={item.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition"
                          >
                            Open
                          </a>

                        </div>

                      </div>
                    )}

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