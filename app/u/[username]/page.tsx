import { createSupabaseServer } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // ✅ FIX: unwrap async params
  const { username } = await params;

  const supabase = await createSupabaseServer();

  /* 1️⃣ Load public profile by username */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return notFound();
  }

  /* 2️⃣ Load VERIFIED skills only */
  const { data: skills } = await supabase
    .from("user_skills")
    .select(`
      level,
      proof_url,
      skills ( name )
    `)
    .eq("user_id", profile.id)
    .eq("status", "verified");

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          @{profile.username}
        </h1>

        <p className="mt-2 text-green-400 text-sm">
          ✔ Verified Skill Profile
        </p>
      </div>

      {/* Skills */}
      <h2 className="text-xl font-semibold mb-4">
        Verified Skills
      </h2>

      {(!skills || skills.length === 0) && (
        <p className="text-zinc-400">
          No verified skills yet.
        </p>
      )}

      <ul className="space-y-4">
        {skills?.map((skill, i) => (
          <li
            key={i}
            className="border border-zinc-700 rounded-xl p-4 bg-zinc-900"
          >
            <div className="flex justify-between items-center">
              <strong className="text-lg">
                {skill.skills?.name}
              </strong>

              <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400">
                Verified
              </span>
            </div>

            <div className="text-sm text-zinc-400 mt-1">
              Level: {skill.level}
            </div>

            {skill.proof_url && (
              <a
                href={skill.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-400 underline text-sm"
              >
                View proof
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
