export default function ExampleProfile() {
  return (
    <section className="px-6">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-sm mb-5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Public Profile Preview
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Example SkillProof Profile
          </h2>

          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Every verified skill is backed by real proof, making profiles more
            trustworthy than traditional resumes.
          </p>
        </div>

        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/10 via-indigo-700/5 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative p-8 border-b border-zinc-800">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <h3 className="text-3xl font-bold tracking-tight">
                  @johndev
                </h3>

                <p className="text-zinc-400 mt-2">
                  Frontend Developer
                </p>

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Verified Skill Profile
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-4xl font-bold text-white">12</p>
                <p className="text-sm text-zinc-500">
                  Verified Skills
                </p>
              </div>

            </div>

          </div>

          {/* Skills */}
          <div className="relative divide-y divide-zinc-800">

            {/* Skill */}
            <div className="p-6 hover:bg-white/[0.02] transition">
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      ✓
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">
                        React
                      </h4>

                      <p className="text-sm text-zinc-500">
                        github.com/react-dashboard
                      </p>
                    </div>

                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Verified
                </span>

              </div>
            </div>

            {/* Skill */}
            <div className="p-6 hover:bg-white/[0.02] transition">
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      ✓
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">
                        UI Design
                      </h4>

                      <p className="text-sm text-zinc-500">
                        dribbble.com/uiexample
                      </p>
                    </div>

                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Verified
                </span>

              </div>
            </div>

            {/* Skill */}
            <div className="p-6 hover:bg-white/[0.02] transition">
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      ✓
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">
                        JavaScript
                      </h4>

                      <p className="text-sm text-zinc-500">
                        github.com/js-project
                      </p>
                    </div>

                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Verified
                </span>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}