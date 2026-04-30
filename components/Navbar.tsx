export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-800">

      {/* LOGO */}
      <div className="text-lg font-semibold">
        SkillProof
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center gap-6">

        <a
          href="/login"
          className="text-gray-400 hover:text-white transition"
        >
          Login
        </a>

        <a
          href="/signup"
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Sign Up
        </a>

      </div>

    </nav>
  );
}