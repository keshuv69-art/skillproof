import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

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

  // ✅ YOUR admin email
  const isAdmin = user?.email === "keshuv69@gmail.com";

  return (
    <html lang="en">
      <body className={`${geist.className} bg-zinc-950 text-white antialiased`}>
        <div className="min-h-screen flex flex-col">

          {/* Navbar */}
          <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

              {/* 🔥 Logo */}
              <a
                href="/"
                className="text-xl font-semibold tracking-tight hover:opacity-80 transition"
              >
                <span className="text-white">Skill</span>

                <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                  Proof
                </span>
              </a>

              {/* Nav */}
              <nav className="flex items-center gap-6 text-sm text-zinc-400">

                <a
                  href="/profile"
                  className="hover:text-white transition"
                >
                  Profile
                </a>

                {/* ✅ ONLY SHOW TO ADMIN */}
                {isAdmin && (
                  <a
                    href="/admin"
                    className="hover:text-white transition"
                  >
                    Admin
                  </a>
                )}

              </nav>

            </div>
          </header>

          {/* Main */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-zinc-800 text-center text-xs text-zinc-500 py-6">
            © {new Date().getFullYear()} SkillProof. All rights reserved.
          </footer>

        </div>
      </body>
    </html>
  );
}