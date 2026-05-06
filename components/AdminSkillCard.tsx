"use client";

import { verifySkill, rejectSkill } from "@/app/admin/actions";
import { useTransition } from "react";

export function AdminSkillCard({ proof }: { proof: any }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur p-5 hover:border-purple-500/40 transition-all">
      
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-white text-lg group-hover:text-purple-300 transition">
            {proof.skill_name}
          </p>

          <p className="text-sm text-zinc-400 mt-1">
            @{proof.username}
          </p>

          <p className="text-xs text-zinc-500">
            {proof.user_email}
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          pending
        </span>
      </div>

      {/* PROOF */}
      <div className="mt-4">
        {proof.proof_url ? (
          <a
            href={proof.proof_url}
            target="_blank"
            rel="noreferrer"
            className="text-purple-400 hover:text-purple-300 text-sm transition"
          >
            View proof →
          </a>
        ) : (
          <p className="text-sm text-zinc-500">
            No proof provided
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex gap-3">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => verifySkill(proof.id))
          }
          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition disabled:opacity-50"
        >
          Verify
        </button>

        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => rejectSkill(proof.id))
          }
          className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm transition disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}