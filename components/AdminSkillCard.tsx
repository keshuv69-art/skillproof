"use client";

import { verifySkill, rejectSkill } from "@/app/admin/actions";
import { useTransition } from "react";

export function AdminSkillCard({ proof }: { proof: any }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-zinc-700 p-4 bg-zinc-900">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-white">
            {proof.skill_name}
          </p>
          <p className="text-sm text-zinc-400">
            {proof.user_email}
          </p>
        </div>

        <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">
          Pending
        </span>
      </div>

      <div className="mt-3">
        <a
          href={proof.proof_url}
          target="_blank"
          className="text-blue-400 underline text-sm"
        >
          View Proof
        </a>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => verifySkill(proof.id))
          }
          className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
        >
          Verify
        </button>

        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => rejectSkill(proof.id))
          }
          className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
