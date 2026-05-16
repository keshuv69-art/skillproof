import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabaseServer";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillProof",
  description: "Verified skill profiles powered by proof",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔐 Get logged in user
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Admin check
  const isAdmin = user?.email === "keshuv69@gmail.com";

  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-zinc-950 text-white antialiased`}
      >
        <div className="min-h-screen flex flex-col relative overflow-hidden">

          {/* Background Glow */}
          <div className="fixed inset-0 bg-gradient-to-br from-purple-700/10 via-indigo-700/5 to-transparent blur-3xl pointer-events-none" />

          {/* NAVBAR */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

              {/* Logo */}
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight hover:opacity-80 transition"
              >
                <span className="text-white">Skill</span>

                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  Proof
                </span>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-6 text-sm">

                <Link
                  href="/discover"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Discover
                </Link>

                {user && (
                  <Link
                    href="/profile"
                    className="text-zinc-400 hover:text-white transition"
                  >
                    Profile
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-zinc-400 hover:text-white transition"
                  >
                    Admin
                  </Link>
                )}

                {!user ? (
                  <Link
                    href="/login"
                    className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-purple-300 hover:bg-purple-500/20 transition"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs">
                    Logged In
                  </div>
                )}

              </nav>

            </div>
          </header>

          {/* MAIN */}
          <main className="relative flex-1">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl text-center text-xs text-zinc-500 py-6">
            © {new Date().getFullYear()} SkillProof. All rights reserved.
          </footer>

        </div>
      </body>
    </html>
  );
}