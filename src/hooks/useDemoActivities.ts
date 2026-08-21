"use client";

import { useActivityStore } from "@/store/activityStore";
import { useEffect, useState } from "react";

type DemoStatus = "loading" | "ready" | "failed";

/**
 * Loads the demo fixture and seeds the activity store with it.
 *
 * demoData is ~950KB, so it's fetched lazily rather than bundled: a static
 * import put it in the homepage's initial JS, and passing it as a prop from a
 * server component also serialized it into the RSC flight payload.
 *
 * Shared by the homepage and /demo, which previously held identical copies of
 * this effect — and neither handled a rejected import, so a network blip left
 * /demo on its spinner forever.
 */
export function useDemoActivities(): DemoStatus {
  const [status, setStatus] = useState<DemoStatus>("loading");
  const setActivities = useActivityStore((state) => state.setActivities);

  useEffect(() => {
    let cancelled = false;

    import("@/data/demoData")
      .then(({ demoData }) => {
        if (cancelled) return;
        setActivities(demoData);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    return () => {
      cancelled = true;
    };
  }, [setActivities]);

  return status;
}
