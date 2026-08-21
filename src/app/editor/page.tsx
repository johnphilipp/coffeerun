"use client";

import Editor from "@/components/editor/Editor";
import LibraryErrorState from "@/components/LibraryErrorState";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useLibrarySeed } from "@/hooks/useLibrarySeed";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export default function EditorPage() {
  const { status, count, reset } = useLibrarySeed();

  if (status === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Storage worked but the stored value didn't parse. Without an explicit way
  // out, the only recovery is clearing site data by hand.
  if (status === "failed") {
    return <LibraryErrorState onReset={reset} />;
  }

  if (count === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-100">No rides yet</h2>
        <p className="max-w-sm text-gray-300">
          Add a few GPX files and they&apos;ll show up on the mug. They stay in
          this browser — nothing is uploaded.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/import">
            <Button className="font-bold">
              <UploadIcon />
              Add your rides
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline">View a demo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <Editor />;
}
