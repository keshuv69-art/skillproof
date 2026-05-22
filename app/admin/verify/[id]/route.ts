import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ IMPORTANT

  const supabase = await createSupabaseServer();

  await supabase
    .from("user_skills")
    .update({ status: "approved" })
    .eq("id", id);

  return NextResponse.redirect(new URL("/admin", req.url));
}
