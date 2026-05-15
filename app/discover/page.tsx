import { createSupabaseServer } from "@/lib/supabaseServer";
import DiscoverSearch from "@/components/DiscoverSearch";

type Skill = {
  status: string;
  skills:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

export default async function DiscoverPage() {
  const supabase = await createSupabaseServer();

  // Fetch profiles + skills
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      bio,
      user_skills (
        status,
        skills (
          name
        )
      )
    `)
    .not("username", "is", null);

  const formattedProfiles =
    profiles?.map((profile: any) => {
      const approvedSkills =
        profile.user_skills?.filter(
          (skill: Skill) => skill.status === "approved"
        ) ?? [];

      const skillNames = approvedSkills.map((skill: Skill) => {
        if (Array.isArray(skill.skills)) {
          return skill.skills[0]?.name;
        }

        return skill.skills?.name;
      });

      return {
        id: profile.id,
        username: profile.username,
        bio: profile.bio,
        verifiedCount: approvedSkills.length,
        topSkills: skillNames.filter(Boolean).slice(0, 5),
      };
    }) ?? [];

  const totalSkills = formattedProfiles.reduce(
    (acc: number, profile: any) =>
      acc + profile.verifiedCount,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-40" />

      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-5xl font-bold tracking-tight">
            Discover Talent
          </h1>

          <p className="mt-4 text-zinc-400 text-lg max-w-2xl">
            Explore verified professionals and skill portfolios from the SkillProof network.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-3 mb-14">

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
            <p className="text-4xl font-bold">
              {formattedProfiles.length}
            </p>

            <p className="text-zinc-500 mt-2">
              Public Profiles
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
            <p className="text-4xl font-bold text-indigo-300">
              {totalSkills}
            </p>

            <p className="text-zinc-500 mt-2">
              Verified Skills
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
            <p className="text-4xl font-bold text-emerald-400">
              100%
            </p>

            <p className="text-zinc-500 mt-2">
              Verified Profiles
            </p>
          </div>

        </div>

        {/* LIVE SEARCH COMPONENT */}
        <DiscoverSearch profiles={formattedProfiles} />

      </div>
    </div>
  );
}