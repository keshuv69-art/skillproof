import type { Metadata } from "next";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function generateMetadata(
  props: {
    params: Promise<{ username: string }>;
  }
): Promise<Metadata> {
  const { username } = await props.params;

  const supabase = await createSupabaseServer();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "User not found • SkillProof",
      description: "This SkillProof profile does not exist",
    };
  }

  return {
    title: `@${profile.username} • Verified Skills`,
    description: `View verified skills and proofs for @${profile.username} on SkillProof`,
    openGraph: {
      title: `@${profile.username} • SkillProof`,
      description: `Verified skills and proofs for @${profile.username}`,
      type: "profile",
    },
  };
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      {children}
    </main>
  );
}
