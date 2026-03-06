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
  // ✅ unwrap params (required in your Next version)
  const { username } = await params;

  const supabase = await createSupabaseServer();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (!profile) {
    return notFound();
  }

  const { data: skillsData } = await supabase
    .from("user_skills")
    .select(`
      level,
      proof_url,
      skills ( name )
    `)
    .eq("user_id", profile.id)
    .eq("status", "verified");

  const skills: SkillRow[] = skillsData ?? [];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold">
            @{profile.username}
          </h1>

          <p className="mt-3 text-sm text-green-400">
            ✔ Verified Skill Profile
          </p>

          <CopyProfileLink username={profile.username} />

          <p className="mt-3 text-zinc-400 text-sm">
            {skills.length} verified skill
            {skills.length !== 1 && "s"}
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-6">
          Verified Skills
        </h2>

        {skills.length === 0 && (
          <p className="text-zinc-500">
            No verified skills yet.
          </p>
        )}

        <div className="space-y-6">
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
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {skillName}
                    </h3>

                    <p className="text-sm text-zinc-400 mt-1">
                      Level: {item.level}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400">
                    Verified
                  </span>
                </div>

                {item.proof_url && (
                  <a
                    href={item.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm text-blue-400 hover:underline"
                  >
                    View proof →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
