import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillProof",
  description: "Verified skill profiles powered by proof",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-zinc-950 text-white antialiased`}>
        <div className="min-h-screen flex flex-col">
          
          {/* Navbar */}
          <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
              
              {/* Logo */}
              <a
                href="/"
                className="text-xl font-bold tracking-tight hover:opacity-80 transition"
              >
                Skill<span className="text-indigo-500">Proof</span>
              </a>

              {/* Nav */}
              <nav className="flex items-center gap-6 text-sm text-zinc-400">
                <a
                  href="/profile"
                  className="hover:text-white transition"
                >
                  Profile
                </a>

                <a
                  href="/admin"
                  className="hover:text-white transition"
                >
                  Admin
                </a>
              </nav>
            </div>
          </header>

          {/* Main Content */}
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
