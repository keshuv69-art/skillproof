import { supabaseAdmin } from "@/lib/admin";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AdminSkillCard } from "@/components/AdminSkillCard";
import { redirect } from "next/navigation";

type RawSubmission = {
  id: string;
  user_id: string;
  level: string;
  proof_url: string | null;
  proof_description: string | null;
  status: string;
  created_at?: string;
  skills: { name: string } | { name: string }[] | null;
};

export default async function AdminPage() {
  // 🔐 AUTH CHECK
  const supabaseUser = await createSupabaseServer();

  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

    const { data: profile } = await supabaseUser
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  if (!user || profile?.role !== "admin") {
    redirect("/");
  }

  // 🔥 ADMIN CLIENT
  const supabase = supabaseAdmin;

  // 📦 Fetch pending submissions
  const { data: submissionsData, error } = await supabase
    .from("user_skills")
    .select(`
  id,
  user_id,
  level,
  proof_url,
  proof_description,
  status,
  created_at,
  skills (
    name
  )
`)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ADMIN FETCH ERROR:", JSON.stringify(error, null, 2));
  }

  const submissions: RawSubmission[] = submissionsData ?? [];

  // 👤 Fetch user profiles
  const userIds = submissions.map((s) => s.user_id);

  let profileMap = new Map<string, any>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, username")
      .in("id", userIds);

    profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  }

  // 📊 Stats
  const totalPending = submissions.length;

  const uniqueUsers = new Set(
    submissions.map((s) => s.user_id)
  ).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-600/10 to-transparent blur-3xl opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Moderation Panel
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            Admin Dashboard
          </h1>

          <p className="text-zinc-400 mt-4 text-lg max-w-2xl">
            Review skill submissions, approve verified expertise,
            and maintain the credibility of the SkillProof network.
          </p>

        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-3 mb-12">

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">

            <p className="text-4xl font-bold text-yellow-400">
              {totalPending}
            </p>

            <p className="text-zinc-500 mt-2">
              Pending Reviews
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">

            <p className="text-4xl font-bold text-indigo-300">
              {uniqueUsers}
            </p>

            <p className="text-zinc-500 mt-2">
              Users Waiting
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">

            <p className="text-4xl font-bold text-emerald-400">
              Live
            </p>

            <p className="text-zinc-500 mt-2">
              Verification System
            </p>

          </div>

        </div>

        {/* EMPTY STATE */}
        {submissions.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-14 text-center">

            <div className="text-6xl mb-5">
              🎉
            </div>

            <h2 className="text-3xl font-bold mb-4">
              No Pending Reviews
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
              All skill submissions have been reviewed. The moderation
              queue is currently empty.
            </p>

          </div>
        )}

        {/* MODERATION QUEUE */}
        {submissions.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">

              <div>
                <h2 className="text-3xl font-bold">
                  Pending Verification Queue
                </h2>

                <p className="text-zinc-500 mt-2">
                  Review submitted proof and verify authenticity.
                </p>
              </div>

            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {submissions.map((item) => {
                const profile = profileMap.get(item.user_id);

                let skillName = "Unknown skill";

                if (Array.isArray(item.skills)) {
                  skillName =
                    item.skills[0]?.name ?? "Unknown skill";
                } else if (
                  item.skills &&
                  "name" in item.skills
                ) {
                  skillName = item.skills.name;
                }

                return (
                  <AdminSkillCard
                    key={item.id}
                    proof={{
  id: item.id,
  skill_name: skillName,
  level: item.level,
  proof_url: item.proof_url,
  proof_description: item.proof_description,
  user_email:
    profile?.email ?? "Unknown",
  username:
    profile?.username ?? "unknown",
}}
                  />
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}