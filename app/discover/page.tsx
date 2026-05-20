import { createSupabaseServer } from "@/lib/supabaseServer";
import DiscoverSearch from "@/components/DiscoverSearch";

export default async function DiscoverPage() {
  const supabase = await createSupabaseServer();

  // 🔥 GET VERIFIED SKILLS
  const { data: verifiedSkills } = await supabase
    .from("user_skills")
    .select(`
      user_id,
      skills (
        name
      )
    `)
    .eq("status", "approved");

  // 🔥 GET ALL PROFILES
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      bio
    `)
    .not("username", "is", null);

  // 🔥 BUILD PROFILE DATA
  const formattedProfiles =
    profiles
      ?.map((profile: any) => {
        const userSkills =
          verifiedSkills?.filter(
            (skill: any) => skill.user_id === profile.id
          ) ?? [];

        const topSkills = userSkills
          .map((skill: any) => {
            if (Array.isArray(skill.skills)) {
              return skill.skills[0]?.name;
            }

            return skill.skills?.name;
          })
          .filter(Boolean)
          .slice(0, 5);

        return {
          id: profile.id,
          username: profile.username,
          bio: profile.bio,
          verifiedCount: userSkills.length,
          topSkills,
        };
      })

      // ✅ ONLY USERS WITH VERIFIED SKILLS
      .filter((profile: any) => profile.verifiedCount > 0)

      // ✅ SORT BEST FIRST
      .sort(
        (a: any, b: any) =>
          b.verifiedCount - a.verifiedCount
      ) ?? [];

  const totalSkills = formattedProfiles.reduce(
    (acc: number, profile: any) =>
      acc + profile.verifiedCount,
    0
  );

  const verifiedUsers = formattedProfiles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-40" />

      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Explore Verified Talent
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Discover
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
              {" "}SkillProof Creators
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Browse public verified profiles, discover proven skills,
            and explore professionals backed by real proof.
          </p>

        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-3 mb-14">

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 hover:border-purple-500/30 transition">

            <p className="text-4xl font-bold">
              {verifiedUsers}
            </p>

            <p className="text-zinc-500 mt-2">
              Verified Profiles
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 hover:border-indigo-500/30 transition">

            <p className="text-4xl font-bold text-indigo-300">
              {totalSkills}
            </p>

            <p className="text-zinc-500 mt-2">
              Verified Skills
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 hover:border-emerald-500/30 transition">

            <p className="text-4xl font-bold text-emerald-400">
              {verifiedUsers}
            </p>

            <p className="text-zinc-500 mt-2">
              Verified Professionals
            </p>

          </div>

        </div>

        {/* SEARCH */}
        <div className="mb-14">
          <DiscoverSearch profiles={formattedProfiles} />
        </div>

        {/* FEATURED USERS */}
        {formattedProfiles.length > 0 && (
          <div>

            <div className="flex items-center justify-between mb-8">

              <div>
                <h2 className="text-3xl font-bold">
                  Featured Profiles
                </h2>

                <p className="text-zinc-500 mt-2">
                  Verified users from the SkillProof network.
                </p>
              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {formattedProfiles
                .slice(0, 6)
                .map((profile: any) => (
                  <a
                    key={profile.id}
                    href={`/u/${profile.username}`}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.18)]"
                  >

                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

                    <div className="relative">

                      {/* Top */}
                      <div className="flex items-start justify-between mb-5">

                        <div>

                          <div className="flex items-center gap-2">

                            <h3 className="text-2xl font-semibold group-hover:text-purple-300 transition">
                              @{profile.username}
                            </h3>

                            <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                              Verified
                            </span>

                          </div>

                          <p className="text-zinc-500 mt-3 line-clamp-2">
                            {profile.bio || "No bio added yet."}
                          </p>

                        </div>

                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-6">

                        {profile.topSkills.map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                      {/* Bottom */}
                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-xs uppercase tracking-wider text-zinc-500">
                            Verified Skills
                          </p>

                          <p className="text-2xl font-bold text-emerald-400 mt-1">
                            {profile.verifiedCount}
                          </p>

                        </div>

                        <div className="text-purple-300 group-hover:translate-x-1 transition">
                          View Profile →
                        </div>

                      </div>

                    </div>

                  </a>
                ))}

            </div>

          </div>
        )}

        {/* EMPTY STATE */}
        {formattedProfiles.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center">

            <div className="text-5xl mb-4">
              🚀
            </div>

            <h2 className="text-2xl font-bold mb-3">
              No Verified Profiles Yet
            </h2>

            <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Once users submit skills and get approved by admins,
              verified professionals will appear here.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}