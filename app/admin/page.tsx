import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AdminSkillCard } from "@/components/AdminSkillCard";

const ADMIN_EMAIL = "keshuv69@gmail.com";

export default async function AdminPage() {
  const supabase = await createSupabaseServer();

  // 1️⃣ Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/profile");
  }

  // 2️⃣ Load pending skill submissions
  const { data: submissions } = await supabase
    .from("user_skills")
    .select(`
      id,
      level,
      proof_url,
      profiles (
        email,
        username
      ),
      skills (
        name
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Pending Skill Verifications
      </h1>

      {(!submissions || submissions.length === 0) && (
        <p className="text-zinc-400">
          No pending submissions 🎉
        </p>
      )}

      <div className="grid gap-4">
        {submissions?.map((item) => (
          <AdminSkillCard
            key={item.id}
            proof={{
              id: item.id,
              skill_name: item.skills?.[0]?.name ?? "Unknown skill",
              level: item.level,
              proof_url: item.proof_url,
              user_email: item.profiles?.[0]?.email ?? "Unknown email",
              username: item.profiles?.[0]?.username ?? "unknown",
            }}
          />
        ))}
      </div>
    </div>
  );
}
