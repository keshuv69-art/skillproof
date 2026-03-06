"use client";

import { useState } from "react";

export default function CopyProfileLink({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/u/${username}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-4 text-sm px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition"
    >
      {copied ? "Copied ✓" : "Copy Profile Link"}
    </button>
  );
}
