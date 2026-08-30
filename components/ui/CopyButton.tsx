"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

type CopyButtonProps = {
  value?: string;
  currentUrl?: boolean;
  label: string;
  className?: string;
};

export function CopyButton({ value = "", currentUrl = false, label, className = "" }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  async function handleCopy() {
    try {
      await copyText(currentUrl ? window.location.href : value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatus("idle"), 1800);
  }

  const statusLabel = status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : label;

  return (
    <button type="button" className={`copy-button ${className}`.trim()} onClick={handleCopy}>
      {status === "copied" ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
      <span>{statusLabel}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "copied" ? `${label} copied` : status === "failed" ? `Unable to copy ${label.toLowerCase()}` : ""}
      </span>
    </button>
  );
}
