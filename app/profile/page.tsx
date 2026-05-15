import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AddSkillCard } from "@/components/AddSkillCard";
import LogoutButton from "@/components/LogoutButton";
import ProfileBioEditor from "@/components/ProfileBioEditor";

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

  // 🔥 PROFILE
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, email, bio")
    .eq("id", user.id)
    .maybeSingle();

  // 🔥 SKILLS
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

  const verifiedSkills = userSkills.filter(
    (skill) => skill.status === "approved"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-40" />

      {/* Additional Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto px-6 py-14">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.12)] p-8 md:p-10 mb-12">

          {/* Decorative Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

            {/* LEFT */}
            <div className="flex-1">

              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Verified Skill Profile
              </div>

              <h1 className="text-5xl font-bold tracking-tight">
                @{profile?.username ?? "profile"}
              </h1>

              <p className="mt-3 text-zinc-400">
                {profile?.email}
              </p>

              {/* BIO EDITOR */}
              <div className="mt-8">
                <ProfileBioEditor
                  initialBio={profile?.bio ?? ""}
                  userId={user.id}
                />
              </div>

              {/* STATS */}
              <div className="flex items-center gap-8 mt-8">

                <div>
                  <p className="text-3xl font-bold text-white">
                    {userSkills.length}
                  </p>

                  <p className="text-sm text-zinc-500">
                    Total Skills
                  </p>
                </div>

                <div className="w-px h-12 bg-white/10" />

                <div>
                  <p className="text-3xl font-bold text-emerald-400">
                    {verifiedSkills}
                  </p>

                  <p className="text-sm text-zinc-500">
                    Verified
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-4 min-w-[220px]">

              <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-5">

                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Profile Status
                </p>

                <p className="text-emerald-400 font-medium">
                  Active & Verified
                </p>

              </div>

              <a
                href={`/u/${profile?.username}`}
                target="_blank"
                className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-4 text-indigo-300 hover:bg-indigo-500/20 transition"
              >
                View Public Profile →
              </a>

              <div>
                <LogoutButton />
              </div>

            </div>

          </div>
        </div>

        {/* ADD SKILL */}
        <div className="mb-14">
          <AddSkillCard userId={user.id} />
        </div>

        {/* SKILLS */}
        <div>

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-3xl font-bold">
                Your Skills
              </h2>

              <p className="text-zinc-500 mt-2">
                Manage and track your submitted verifications.
              </p>
            </div>

          </div>

          {userSkills.length === 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-zinc-400">
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
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]"
                >

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

                  <div className="relative">

                    <div className="flex items-start justify-between mb-5">

                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-indigo-300 transition">
                          {skill.skillName}
                        </h3>

                        <p className="text-sm text-zinc-500 mt-1">
                          Skill verification submission
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full capitalize ${statusStyles}`}
                      >
                        {isVerified ? "verified" : skill.status}
                      </span>

                    </div>

                    <div className="flex items-center justify-between mt-6">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Skill Level
                        </p>

                        <p className="text-lg font-medium mt-1">
                          {skill.level}
                        </p>
                      </div>

                      {skill.proof_url && (
                        <a
                          href={skill.proof_url}
                          target="_blank"
                          rel="noreferrer"
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