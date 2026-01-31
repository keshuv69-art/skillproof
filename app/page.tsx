export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold mb-4">
        Prove Your Skills. Don’t Just Claim Them.
      </h1>

      <p className="text-gray-500 max-w-xl mb-8">
        SkillProof lets you showcase real, verifiable proof of your skills —
        not just resumes and buzzwords.
      </p>

      <div className="flex gap-4">
        <a
          href="/signup"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Get Started
        </a>
        <a
          href="/login"
          className="border px-6 py-3 rounded-xl"
        >
          Login
        </a>
      </div>
    </main>
  );
}
