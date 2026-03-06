"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function verifySkill(id: string) {
  const { error } = await supabase
    .from("user_skills")
    .update({
      verified: true,   // ✅ ONLY use this column
    })
    .eq("id", id);

  if (error) {
    console.error("Verify error:", error);
    return;
  }

  revalidatePath("/admin");
}

export async function rejectSkill(id: string) {
  const { error } = await supabase
    .from("user_skills")
    .delete()           // ✅ cleaner than updating rejected
    .eq("id", id);

  if (error) {
    console.error("Reject error:", error);
    return;
  }

  revalidatePath("/admin");
}