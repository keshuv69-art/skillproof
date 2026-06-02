"use client";

import { verifySkill, rejectSkill } from "@/app/admin/actions";
import { useState, useTransition } from "react";

export function AdminSkillCard({ proof }: { proof: any }) {
  const [isPending, startTransition] = useTransition();

  const [note, setNote] = useState("");

  const url = proof.proof_url || "";

  // IMAGE
  const isImage =
    url.includes(".png") ||
    url.includes(".jpg") ||
    url.includes(".jpeg") ||
    url.includes("image");

  // VIDEO
  const isVideo =
    url.includes(".mp4") ||
    url.includes(".mov") ||
    url.includes("video");

  // YOUTUBE
  const isYoutube =
    url.includes("youtube.com") ||
    url.includes("youtu.be");

  // VIMEO
  const isVimeo =
    url.includes("vimeo.com");

  // YOUTUBE EMBED
  const getYoutubeEmbed = (link: string) => {
    if (link.includes("youtu.be/")) {
      return link.replace(
        "youtu.be/",
        "youtube.com/embed/"
      );
    }

    if (link.includes("watch?v=")) {
      return link.replace(
        "watch?v=",
        "embed/"
      );
    }

    return link;
  };

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

        {/* DESCRIPTION */}
        {proof.proof_description && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-4">

            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
              Creator Description
            </p>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {proof.proof_description}
            </p>

          </div>
        )}

        {/* REVIEW NOTE */}
        <div className="mb-6">

          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-3">
            Verification Note
          </label>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional moderation note..."
            rows={3}
            className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />

        </div>

        {/* PROOF */}
        <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">

          {url ? (
            <>
              {/* IMAGE */}
              {isImage && (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={url}
                    alt="Proof"
                    className="w-full h-72 object-cover hover:scale-[1.02] transition duration-300"
                  />
                </a>
              )}

              {/* VIDEO */}
              {isVideo && (
                <video
                  controls
                  className="w-full max-h-[500px] bg-black"
                >
                  <source src={url} />
                </video>
              )}

              {/* YOUTUBE */}
              {isYoutube && (
                <iframe
                  src={getYoutubeEmbed(url)}
                  className="w-full aspect-video"
                  allowFullScreen
                />
              )}

              {/* VIMEO */}
              {isVimeo && (
                <div className="p-6">

                  <p className="text-white font-medium">
                    Vimeo Portfolio Link
                  </p>

                  <p className="text-sm text-zinc-500 mt-2">
                    Open external Vimeo showcase
                  </p>

                </div>
              )}

              {/* DEFAULT */}
              {!isImage &&
                !isVideo &&
                !isYoutube &&
                !isVimeo && (
                  <div className="p-6">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-white font-medium">
                          External Portfolio Proof
                        </p>

                        <p className="text-sm text-zinc-500 mt-1">
                          Portfolio, document, or external link
                        </p>

                      </div>

                      <div className="text-3xl">
                        🔗
                      </div>

                    </div>

                  </div>
                )}

              {/* VIEW BUTTON */}
              <div className="border-t border-white/10 p-4">

                <a
                  href={url}
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

        {/* REVIEW TIPS */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">

          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
            Verification Checklist
          </p>

          <div className="space-y-2 text-sm text-zinc-400">

            <p>• Is the proof authentic?</p>

            <p>• Does it match the claimed skill?</p>

            <p>• Is the level believable?</p>

            <p>• Is the evidence clear enough?</p>

            <p>• Is the creator showcasing original work?</p>

          </div>

        </div>

        {/* ACTIONS */}
<div className="grid grid-cols-2 gap-3 mt-6">

  <button
    disabled={isPending}
    onClick={() =>
      startTransition(() =>
        verifySkill(proof.id, note)
      )
    }
    className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 py-3 font-medium text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50"
  >
    {isPending ? "Processing..." : "Approve Skill"}
  </button>

  <button
    disabled={isPending}
    onClick={() =>
      startTransition(() =>
        rejectSkill(proof.id, note)
      )
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