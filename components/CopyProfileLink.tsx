"use client";

import { useState } from "react";

export default function CopyProfileLink({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/u/${username}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* LINK PREVIEW */}
      <div className="text-xs text-zinc-500 bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-lg">
       {typeof window !== "undefined" && window.location.origin}/u/{username}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleCopy}
        className="relative px-4 py-1.5 text-sm rounded-lg border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 transition"
      >
        {copied ? (
          <span className="text-emerald-400">Copied ✓</span>
        ) : (
          <span className="text-zinc-300">Copy link</span>
        )}
      </button>
    </div>
  );
}