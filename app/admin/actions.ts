"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ VERIFY SKILL
export async function verifySkill(id: string) {
  const { error } = await supabase
    .from("user_skills")
    .update({
      status: "approved", // ✅ FIXED
    })
    .eq("id", id);

  if (error) {
    console.error("Verify error:", JSON.stringify(error, null, 2));
    return;
  }

  revalidatePath("/admin");
}

// ❌ REJECT SKILL
export async function rejectSkill(id: string) {
  const { error } = await supabase
    .from("user_skills")
    .update({
      status: "rejected",
    })
    .eq("id", id);

  if (error) {
    console.error("Reject error:", JSON.stringify(error, null, 2));
    return;
  }

  revalidatePath("/admin");
}