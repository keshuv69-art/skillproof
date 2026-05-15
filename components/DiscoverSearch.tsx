"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Profile = {
  id: string;
  username: string;
  bio?: string | null;
  verifiedCount: number;
  topSkills: string[];
};

export default function DiscoverSearch({
  profiles,
}: {
  profiles: Profile[];
}) {
  const [query, setQuery] = useState("");

  const filteredProfiles = useMemo(() => {
    if (!query.trim()) return profiles;

    const search = query.toLowerCase();

    return profiles.filter((profile) => {
      const usernameMatch =
        profile.username.toLowerCase().includes(search);

      const skillMatch = profile.topSkills.some((skill) =>
        skill.toLowerCase().includes(search)
      );

      return usernameMatch || skillMatch;
    });
  }, [profiles, query]);

  return (
    <>
      {/* SEARCH */}
      <div className="mb-12">

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl">

          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5" />

          <div className="relative px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="text-zinc-500 text-xl">
                🔍
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search usernames or skills..."
                className="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
              />

            </div>

          </div>

        </div>

      </div>

      {/* RESULTS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {filteredProfiles.map((profile) => (
          <Link
            key={profile.id}
            href={`/u/${profile.username}`}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]"
          >

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

            <div className="relative">

              {/* TOP */}
              <div className="flex items-start justify-between mb-5">

                <div>
                  <h2 className="text-2xl font-semibold group-hover:text-indigo-300 transition">
                    @{profile.username}
                  </h2>

                  <p className="text-sm text-zinc-500 mt-1">
                    Verified Skill Portfolio
                  </p>
                </div>

                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />

              </div>

              {/* BIO */}
              <div className="min-h-[60px]">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {profile.bio ||
                    "Building verified expertise on SkillProof."}
                </p>
              </div>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mt-6">

                {profile.topSkills.length > 0 ? (
                  profile.topSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500">
                    No verified skills yet
                  </div>
                )}

              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/10">

                <div>
                  <p className="text-3xl font-bold text-white">
                    {profile.verifiedCount}
                  </p>

                  <p className="text-sm text-zinc-500">
                    Verified Skills
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500/20 transition">
                  View Profile →
                </div>

              </div>

            </div>
          </Link>
        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredProfiles.length === 0 && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center text-zinc-400">
          No profiles found.
        </div>
      )}
    </>
  );
}