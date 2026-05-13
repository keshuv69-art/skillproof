"use client";

import { useEffect, useState } from "react";

export default function CopyProfileLink({
  username,
}: {
  username: string;
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const profileUrl = `${origin}/u/${username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex items-center gap-3">

      {/* LINK PREVIEW */}
      <div className="text-xs text-zinc-500 bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-lg">
        {profileUrl}
      </div>

      {/* COPY BUTTON */}
      <button
        onClick={handleCopy}
        className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}