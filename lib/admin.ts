import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabaseServer";
import { createClient } from "@supabase/supabase-js";

// Service role client (for server-side updates)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔐 Protect admin routes
export async function requireAdmin() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin inside profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/profile");
  }

  return user;
}
