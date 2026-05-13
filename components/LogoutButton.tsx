"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:bg-purple-600/30 transition"
    >
      Logout
    </button>
  );
}