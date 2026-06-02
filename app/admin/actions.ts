"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function verifySkill(
  id: string,
  reviewNote?: string
) {
  const { error } = await supabase
    .from("user_skills")
    .update({
      status: "approved",
      review_note: reviewNote || null,
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Verify error:",
      JSON.stringify(error, null, 2)
    );
    return;
  }

  revalidatePath("/admin");
}

export async function rejectSkill(
  id: string,
  reviewNote?: string
) {
  const { error } = await supabase
    .from("user_skills")
    .update({
      status: "rejected",
      review_note: reviewNote || null,
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Reject error:",
      JSON.stringify(error, null, 2)
    );
    return;
  }

  revalidatePath("/admin");
}