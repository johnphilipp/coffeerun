"use client";

import { useActivityStore } from "@/store/activityStore";
import { useHydrationStore } from "@/store/hydrationStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Bridges the persisted library into the transient activity store.
 *
 * Status comes from hydrationStore rather than zustand's `hasHydrated()`,
 * because that flag never flips when rehydration fails — which is what made
 * /editor spin forever on a corrupt stored value.
 */
export function useLibrarySeed() {
  const status = useHydrationStore((state) => state.status);
  const droppedRides = useHydrationStore((state) => state.droppedRides);
  const importedActivities = useLibraryStore(
    (state) => state.importedActivities
  );
  const clear = useLibraryStore((state) => state.clear);
  const setActivities = useActivityStore((state) => state.setActivities);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (status === "pending") return;

    // Idempotent on purpose. Seeding has to run with an empty array to clear
    // demo data left by the homepage, but re-running it on every mount also
    // reset the user's selections, type filters and date range — so a trip to
    // /import and back wiped their picks. Same array means already seeded.
    if (useActivityStore.getState().activities === importedActivities) return;

    setActivities(importedActivities);
  }, [status, importedActivities, setActivities]);

  // One-shot warnings for the two silent-loss cases.
  useEffect(() => {
    if (warnedRef.current) return;

    if (status === "unavailable") {
      warnedRef.current = true;
      // Previously this status was set and never surfaced, so imports looked
      // successful and then vanished on reload with no explanation.
      toast.warning(
        "This browser is blocking storage, so imported rides won't be saved. You can still design and order a mug in this session."
      );
    } else if (droppedRides > 0) {
      warnedRef.current = true;
      toast.warning(
        `${droppedRides} saved ${
          droppedRides === 1 ? "ride" : "rides"
        } couldn't be read and ${
          droppedRides === 1 ? "was" : "were"
        } skipped. The rest loaded normally.`
      );
    }
  }, [status, droppedRides]);

  // Recovery for `failed`: replace the unreadable value so the next load
  // starts clean. Only ever called from an explicit user action.
  //
  // clear() alone is enough — it goes through persist's wrapped set, which
  // synchronously writes an empty library over the damaged one. That write can
  // itself throw on a zero-quota profile, and this is the documented way out of
  // a broken library, so it can't be the thing that breaks.
  const reset = useCallback(() => {
    try {
      clear();
      useHydrationStore.getState().setStatus("ready");
      useHydrationStore.getState().setDroppedRides(0);
    } catch {
      toast.error(
        "Couldn't clear the saved rides — this browser won't allow writes. Clearing site data for localhost will do it."
      );
    }
  }, [clear]);

  return { status, count: importedActivities.length, reset };
}
