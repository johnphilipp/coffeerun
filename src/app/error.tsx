"use client";

import { Button } from "@/components/ui/button";
import { RotateCcwIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * Route-level boundary.
 *
 * Every crash found across three review rounds escalated from one broken
 * component to the whole app disappearing, purely because nothing caught the
 * throw. This bounds that class — including the instances nobody has found yet.
 *
 * Damaged localStorage is the likeliest cause in this app, so recovery offers
 * clearing it as well as a plain retry.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [cleared, setCleared] = useState(false);

  const clearStoredData = () => {
    try {
      localStorage.removeItem("coffeerun-library");
      localStorage.removeItem("coffeerun-controls");
    } catch {
      // Storage unavailable — nothing to clear, and retrying is still worth a go.
    }
    setCleared(true);
    reset();
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-bold text-gray-100">Something broke</h2>
      <p className="max-w-sm text-gray-300">
        {cleared
          ? "Cleared the saved data in this browser. Your GPX files aren't affected."
          : "The editor hit an error. Retrying often works; if it doesn't, clearing the data saved in this browser usually does."}
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-gray-500">{error.digest}</p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset} className="font-bold">
          <RotateCcwIcon />
          Try again
        </Button>
        <Button variant="outline" onClick={clearStoredData}>
          <Trash2Icon />
          Clear saved data
        </Button>
        <Link href="/demo">
          <Button variant="ghost">View a demo</Button>
        </Link>
      </div>
    </div>
  );
}
