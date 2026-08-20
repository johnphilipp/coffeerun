"use client";

import Editor from "@/components/editor/Editor";
import Spinner from "@/components/ui/spinner";
import { Activity } from "@/types/activity";
import { useEffect, useState } from "react";

/**
 * demoData is ~950KB. Importing it statically put it in the homepage's initial
 * JS, and passing it as a prop from the server /demo page also serialized it
 * into the RSC flight payload. Loading it lazily from a client component keeps
 * it out of both.
 */
export default function DemoLoader() {
  const [activities, setActivities] = useState<Activity[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("@/data/demoData").then(({ demoData }) => {
      if (!cancelled) setActivities(demoData);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!activities) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Editor activities={activities} />;
}
