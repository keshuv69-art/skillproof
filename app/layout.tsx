import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabaseServer";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SkillProof",
    template: "%s | SkillProof",
  },
  description:
    "A platform for publicly verified skills powered by real proof and trusted verification.",
  metadataBase: new URL("https://skillproof-zeta.vercel.app"),

  openGraph: {
    title: "SkillProof",
    description:
      "Publicly verified skill profiles powered by proof and trusted verification.",
    url: "https://skillproof-zeta.vercel.app",
    siteName: "SkillProof",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SkillProof",
    description:
      "Publicly verified skill profiles powered by proof and trusted verification.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.email === "keshuv69@gmail.com";

  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-zinc-950 text-white antialiased`}
      >
        <div className="min-h-screen flex flex-col relative overflow-hidden">

          {/* GLOBAL BACKGROUND */}
          <div className="fixed inset-0 bg-gradient-to-br from-purple-700/10 via-indigo-700/5 to-transparent blur-3xl pointer-events-none" />

          {/* NAVBAR */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

              {/* LOGO */}
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight hover:opacity-80 transition"
              >
                <span className="text-white">Skill</span>

                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  Proof
                </span>
              </Link>

              {/* NAVIGATION */}
              <nav className="flex items-center gap-3 sm:gap-6 text-sm">

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
                  <div className="flex items-center gap-3">

                    <Link
                      href="/login"
                      className="text-zinc-400 hover:text-white transition"
                    >
                      Login
                    </Link>

                    <Link
                      href="/signup"
                      className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2 text-white hover:opacity-90 transition shadow-lg shadow-purple-900/20"
                    >
                      Get Started
                    </Link>

                  </div>
                ) : (
                  <div className="flex items-center gap-3">

                    <div className="px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs">
                      Logged In
                    </div>

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
          <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">

            <div className="max-w-7xl mx-auto px-6 py-10">

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                {/* LEFT */}
                <div>

                  <h3 className="text-lg font-semibold">
                    <span className="text-white">Skill</span>

                    <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                      Proof
                    </span>
                  </h3>

                  <p className="text-zinc-500 text-sm mt-2 max-w-md">
                    Verified professional profiles powered by real proof and
                    trusted verification.
                  </p>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6 text-sm text-zinc-500">

                  <Link
                    href="/"
                    className="hover:text-white transition"
                  >
                    Home
                  </Link>

                  <Link
                    href="/discover"
                    className="hover:text-white transition"
                  >
                    Discover
                  </Link>

                  {!user && (
                    <Link
                      href="/signup"
                      className="hover:text-white transition"
                    >
                      Signup
                    </Link>
                  )}

                </div>

              </div>

              {/* Bottom */}
              <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-zinc-600">
                © {new Date().getFullYear()} SkillProof. All rights reserved.
              </div>

            </div>

          </footer>

        </div>
      </body>
    </html>
  );
}