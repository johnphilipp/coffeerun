"use client";

import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import Link from "next/link";

interface LibraryErrorStateProps {
  onReset: () => void;
}

/**
 * Shown when storage works but the stored rides can't be read.
 *
 * Rendered on both /editor and /import. /import needs it just as much: it's
 * where the homepage's primary CTA lands, and without this it showed an empty
 * mug and then overwrote the damaged value on the next import, destroying
 * whatever was still recoverable.
 */
export default function LibraryErrorState({
  onReset,
}: LibraryErrorStateProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-bold text-gray-100">
        Couldn&apos;t read your saved rides
      </h2>
      <p className="max-w-sm text-gray-300">
        The data stored in this browser is damaged. Resetting clears it and
        starts fresh — your GPX files aren&apos;t affected, so you can import
        them again.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onReset} className="font-bold">
          <RotateCcwIcon />
          Reset stored rides
        </Button>
        <Link href="/demo">
          <Button variant="outline">View a demo</Button>
        </Link>
      </div>
    </div>
  );
}
