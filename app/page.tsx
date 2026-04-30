import HowItWorks from "@/components/HowItWorks";
import ExampleProfile from "@/components/ExampleProfile";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Prove Your Skills. Don’t Just Claim Them.
        </h1>

        <p className="text-gray-400 max-w-xl mb-10">
          SkillProof lets you showcase real, verifiable proof of your skills —
          not just resumes and buzzwords.
        </p>

        <div className="flex gap-4">
          <a
            href="/signup"
            className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="border border-gray-600 px-6 py-3 rounded-xl hover:border-white transition"
          >
            Login
          </a>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-10 text-gray-500 animate-bounce text-3xl">
          ↓
        </div>

      </main>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6">
        <HowItWorks />
      </section>

      {/* EXAMPLE PROFILE */}
      <section className="py-32 px-6">
        <ExampleProfile />
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-12 border-t border-gray-800">
        © {new Date().getFullYear()} SkillProof. All rights reserved.
      </footer>
    </>
  );
}