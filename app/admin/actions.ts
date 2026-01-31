"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function verifySkill(id: string) {
  await supabase
    .from("user_skills")
    .update({
      status: "verified",
      verified: true,
    })
    .eq("id", id);

  revalidatePath("/admin");
}

export async function rejectSkill(id: string) {
  await supabase
    .from("user_skills")
    .update({
      status: "rejected",
      verified: false,
    })
    .eq("id", id);

  revalidatePath("/admin");
}
