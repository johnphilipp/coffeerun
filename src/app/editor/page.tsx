"use client";

import Editor from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useLibrarySeed } from "@/hooks/useLibrarySeed";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export default function EditorPage() {
  const { hydrated, count } = useLibrarySeed();

  if (!hydrated) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
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
