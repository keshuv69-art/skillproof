"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, supabaseAdmin } from "@/lib/admin";

export async function verifySkill(
  id: string,
  reviewNote?: string
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("user_skills")
    .update({
      status: "approved",
      review_note: reviewNote || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Verify error:", JSON.stringify(error, null, 2));
    return;
  }

  revalidatePath("/admin");
}

export async function rejectSkill(
  id: string,
  reviewNote?: string
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("user_skills")
    .update({
      status: "rejected",
      review_note: reviewNote || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Reject error:", JSON.stringify(error, null, 2));
    return;
  }

  revalidatePath("/admin");
}