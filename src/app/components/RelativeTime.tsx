"use client";

import { useState, useEffect } from "react";

function getRelativeTime(dateISO: string): string {
  const now = Date.now();
  const then = new Date(dateISO).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default function RelativeTime({ dateISO }: { dateISO: string }) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    setText(getRelativeTime(dateISO));
    const interval = setInterval(() => {
      setText(getRelativeTime(dateISO));
    }, 60_000);
    return () => clearInterval(interval);
  }, [dateISO]);

  if (!text) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-700 border border-blue-200 text-xs font-medium">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
      </span>
      Updated {text}
    </span>
  );
}
