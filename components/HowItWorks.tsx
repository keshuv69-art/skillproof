export default function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-black/40">
      <div className="max-w-3xl mx-auto space-y-6">

        <h2 className="text-3xl font-bold text-center mb-16">
          How SkillProof Works
        </h2>

        <div className="space-y-6">

          <div className="border border-gray-800 bg-zinc-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">1. Add a Skill</h3>
            <p className="text-gray-400">
              Attach proof like GitHub projects, portfolios, or certificates.
            </p>
          </div>

          <div className="border border-gray-800 bg-zinc-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">2. Show Real Evidence</h3>
            <p className="text-gray-400">
              Each skill is backed by proof so people can verify your work.
            </p>
          </div>

          <div className="border border-gray-800 bg-zinc-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">3. Share Your Profile</h3>
            <p className="text-gray-400">
              Share one simple link showing everything you can actually do.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}