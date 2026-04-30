export default function ExampleProfile() {
  return (
    <section className="px-6">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Example SkillProof Profile
        </h2>

        <div className="border border-gray-700 rounded-xl overflow-hidden">

          {/* PROFILE HEADER */}
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-xl font-semibold">John Dev</h3>
            <p className="text-gray-400">Frontend Developer</p>
          </div>

          {/* SKILLS */}
          <div>

            <div className="p-5 border-b border-gray-800 flex items-center gap-3">
              <span>✔</span>
              <div>
                <p className="font-medium">React</p>
                <p className="text-sm text-gray-400">
                  github.com/react-dashboard
                </p>
              </div>
            </div>

            <div className="p-5 border-b border-gray-800 flex items-center gap-3">
              <span>✔</span>
              <div>
                <p className="font-medium">UI Design</p>
                <p className="text-sm text-gray-400">
                  dribbble.com/uiexample
                </p>
              </div>
            </div>

            <div className="p-5 flex items-center gap-3">
              <span>✔</span>
              <div>
                <p className="font-medium">JavaScript</p>
                <p className="text-sm text-gray-400">
                  github.com/js-project
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}