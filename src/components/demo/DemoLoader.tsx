"use client";

import Editor from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useDemoActivities } from "@/hooks/useDemoActivities";
import Link from "next/link";

export default function DemoLoader() {
  const status = useDemoActivities();

  if (status === "failed") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-100">
          Couldn&apos;t load the demo
        </h2>
        <p className="max-w-sm text-gray-300">
          The sample rides failed to download. Check your connection and reload.
        </p>
        <Link href="/import">
          <Button variant="outline">Add your own rides instead</Button>
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Editor />;
}
