"use client";

import { useControlsStore } from "@/store/controlsStore";
import { useHydrationStore } from "@/store/hydrationStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useEffect } from "react";

/**
 * zustand's types claim `store.persist` is always present, but that isn't true:
 * `createJSONStorage(() => localStorage)` returns undefined when the getter
 * throws, and persistImpl then returns early without ever assigning
 * `api.persist`. Calling `.rehydrate()` in that case is a TypeError from the
 * root layout, which — with no error.tsx in the app — kills every route.
 *
 * So this reaches for it through a signature that admits it can be missing.
 */
type PersistApi = {
  rehydrate: () => Promise<void> | void;
  clearStorage: () => void;
};

export function persistApiOf(store: {
  persist?: PersistApi;
}): PersistApi | undefined {
  return store.persist;
}

/**
 * Both persisted stores use `skipHydration`, so reading localStorage is
 * deferred to here — after mount, on the client only. Rehydrating during
 * render would produce an SSR/client mismatch.
 */
export default function StoreHydrator() {
  useEffect(() => {
    const setStatus = useHydrationStore.getState().setStatus;
    const library = persistApiOf(useLibraryStore);
    const controls = persistApiOf(useControlsStore);

    // Storage is blocked. The app still works; it just won't remember anything.
    if (!library) {
      setStatus("unavailable");
      return;
    }

    try {
      library.rehydrate();
      controls?.rehydrate();
    } catch {
      // A synchronous throw here (rather than a rejected rehydration, which
      // libraryStore's onRehydrateStorage reports) still has to land somewhere.
      setStatus("failed");
    }
  }, []);

  return null;
}
