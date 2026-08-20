"use client";

import { useActivityStore } from "@/store/activityStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useEffect, useState } from "react";

/**
 * Copies the persisted library into the transient activity store once
 * localStorage has been read, and re-copies whenever the library changes (an
 * import, say). The `hydrated` flag exists so callers can hold off on rendering
 * an "no rides yet" state that would otherwise flash for anyone who does have
 * rides saved.
 */
export function useLibrarySeed() {
  const [hydrated, setHydrated] = useState(false);
  const importedActivities = useLibraryStore((state) => state.importedActivities);
  const setActivities = useActivityStore((state) => state.setActivities);

  useEffect(() => {
    // StoreHydrator triggers rehydration from the root layout. localStorage is
    // synchronous, so it has usually already finished by the time this runs.
    if (useLibraryStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useLibraryStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated && importedActivities.length > 0) {
      setActivities(importedActivities);
    }
  }, [hydrated, importedActivities, setActivities]);

  return { hydrated, count: importedActivities.length };
}
