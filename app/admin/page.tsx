import { supabaseAdmin } from "@/lib/admin";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AdminSkillCard } from "@/components/AdminSkillCard";
import { redirect } from "next/navigation";

type RawSubmission = {
  id: string;
  user_id: string;
  level: string;
  proof_url: string | null;
  status: string;
  skills: { name: string } | { name: string }[] | null;
};

export default async function AdminPage() {
  // 🔐 AUTH CHECK (real user)
  const supabaseUser = await createSupabaseServer();

  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  // 🔴 CHANGE THIS TO YOUR EMAIL
  const ADMIN_EMAIL = "keshuv69@gmail.com";

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  // 🔥 ADMIN CLIENT (bypasses RLS)
  const supabase = supabaseAdmin;

  // 🔥 Get pending submissions
  const { data: submissionsData, error } = await supabase
    .from("user_skills")
    .select(`
      id,
      user_id,
      level,
      proof_url,
      status,
      skills (
        name
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
  }

  const submissions: RawSubmission[] = submissionsData ?? [];

  // 🔥 Fetch user profiles
  const userIds = submissions.map((s) => s.user_id);

  let profileMap = new Map<string, any>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, username")
      .in("id", userIds);

    profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Pending Skill Verifications
      </h1>

      {submissions.length === 0 && (
        <p className="text-zinc-400">
          No pending submissions 🎉
        </p>
      )}

      <div className="grid gap-4">
        {submissions.map((item) => {
          const profile = profileMap.get(item.user_id);

          let skillName = "Unknown skill";

          if (Array.isArray(item.skills)) {
            skillName = item.skills[0]?.name ?? "Unknown skill";
          } else if (item.skills && "name" in item.skills) {
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
                user_email: profile?.email ?? "Unknown",
                username: profile?.username ?? "unknown",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}