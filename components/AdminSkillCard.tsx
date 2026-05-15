"use client";

import { verifySkill, rejectSkill } from "@/app/admin/actions";
import { useTransition } from "react";

export function AdminSkillCard({ proof }: { proof: any }) {
  const [isPending, startTransition] = useTransition();

  // 🔥 Detect image proofs
  const isImage =
    proof.proof_url &&
    (
      proof.proof_url.includes(".png") ||
      proof.proof_url.includes(".jpg") ||
      proof.proof_url.includes(".jpeg") ||
      proof.proof_url.includes("image")
    );

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.18)]">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative">

        {/* TOP */}
        <div className="flex justify-between items-start mb-5">

          <div>
            <p className="font-semibold text-white text-2xl group-hover:text-purple-300 transition">
              {proof.skill_name}
            </p>

            <div className="mt-3 space-y-1">
              <p className="text-sm text-zinc-300">
                @{proof.username}
              </p>

              <p className="text-xs text-zinc-500">
                {proof.user_email}
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            pending
          </span>
        </div>

        {/* LEVEL */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Submitted Level
          </p>

          <p className="text-lg text-white font-medium mt-1">
            {proof.level}
          </p>
        </div>

        {/* PROOF */}
        <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">

          {proof.proof_url ? (
            <>
              {/* IMAGE PREVIEW */}
              {isImage ? (
                <a
                  href={proof.proof_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={proof.proof_url}
                    alt="Proof"
                    className="w-full h-64 object-cover hover:scale-[1.02] transition duration-300"
                  />
                </a>
              ) : (
                <div className="p-6">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-white font-medium">
                        External Proof Document
                      </p>

                      <p className="text-sm text-zinc-500 mt-1">
                        PDF or external verification file
                      </p>
                    </div>

                    <div className="text-3xl">
                      📄
                    </div>

                  </div>

                </div>
              )}

              {/* VIEW BUTTON */}
              <div className="border-t border-white/10 p-4">
                <a
                  href={proof.proof_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition"
                >
                  Open Proof →
                </a>
              </div>
            </>
          ) : (
            <div className="p-6 text-sm text-zinc-500">
              No proof provided
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3 mt-6">

          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => verifySkill(proof.id))
            }
            className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 py-3 font-medium text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Approve Skill"}
          </button>

          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => rejectSkill(proof.id))
            }
            className="rounded-2xl bg-red-500/10 border border-red-500/20 py-3 font-medium text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Reject Skill"}
          </button>

        </div>

      </div>
    </div>
  );
}