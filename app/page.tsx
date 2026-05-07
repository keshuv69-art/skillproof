import HowItWorks from "@/components/HowItWorks";
import ExampleProfile from "@/components/ExampleProfile";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <main className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center px-6">

        {/* 🌌 Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-indigo-700/10 to-transparent blur-3xl opacity-40" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-sm mb-8 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Verified Skill Profiles
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Prove Your Skills.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
              Don’t Just Claim Them.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillProof helps developers, designers, freelancers, and creators
            showcase real proof of their abilities through verified public
            profiles.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <a
              href="/signup"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition font-semibold shadow-lg shadow-purple-900/30"
            >
              Create Your Profile
            </a>

            <a
              href="/login"
              className="px-8 py-4 rounded-2xl border border-zinc-700 bg-zinc-900/40 hover:border-purple-500/40 hover:bg-zinc-900/70 transition backdrop-blur"
            >
              Login
            </a>

          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 text-zinc-500 animate-bounce text-3xl">
          ↓
        </div>

      </main>

      {/* HOW IT WORKS */}
      <section className="relative py-32 px-6 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

        <div className="relative z-10">
          <HowItWorks />
        </div>

      </section>

      {/* EXAMPLE PROFILE */}
      <section className="relative py-32 px-6 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-purple-900/10" />

        <div className="relative z-10">
          <ExampleProfile />
        </div>

      </section>
    </>
  );
}