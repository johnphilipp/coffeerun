"use client";

import { useActivityStore } from "@/store/activityStore";
import { useHydrationStore } from "@/store/hydrationStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useCallback, useEffect } from "react";

/**
 * Bridges the persisted library into the transient activity store.
 *
 * Status comes from hydrationStore rather than zustand's `hasHydrated()`,
 * because that flag never flips when rehydration fails — which is what made
 * /editor spin forever on a corrupt stored value.
 */
export function useLibrarySeed() {
  const status = useHydrationStore((state) => state.status);
  const importedActivities = useLibraryStore(
    (state) => state.importedActivities
  );
  const clear = useLibraryStore((state) => state.clear);
  const setActivities = useActivityStore((state) => state.setActivities);

  useEffect(() => {
    if (status === "pending") return;
    // Seeded unconditionally, including with an empty array. The homepage puts
    // demo data in the activity store, so a visitor arriving from / would
    // otherwise see 45 rides that aren't theirs. Passing [] is what clears it.
    setActivities(importedActivities);
  }, [status, importedActivities, setActivities]);

  // Recovery for `failed`: replace the unreadable value so the next load
  // starts clean. Only ever called from an explicit user action.
  //
  // clear() alone is enough — it goes through persist's wrapped set, which
  // synchronously writes an empty library over the damaged one. Calling
  // clearStorage() first would be pointless, since the very next line puts the
  // key straight back.
  const reset = useCallback(() => {
    clear();
    useHydrationStore.getState().setStatus("ready");
  }, [clear]);

  return { status, count: importedActivities.length, reset };
}
