"use client";

import { useEffect, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

const LABELS: Record<CopyState, string | null> = {
  idle: null,
  copied: "Copied!",
  failed: "Press Ctrl+C to copy",
};

export default function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const area = document.createElement("textarea");
        area.value = email;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-left text-sm text-ink-muted transition-colors hover:text-accent"
    >
      {LABELS[state] ?? email}
    </button>
  );
}
