"use client";

import { useControlsStore } from "@/store/controlsStore";
import { useHydrationStore } from "@/store/hydrationStore";
import { useLibraryStore } from "@/store/libraryStore";
import { persistApiOf } from "@/store/persistApi";
import { useEffect } from "react";

/**
 * Both persisted stores use `skipHydration`, so reading localStorage is
 * deferred to here — after mount, on the client only. Rehydrating during
 * render would produce an SSR/client mismatch.
 *
 * Failures are reported by each store's own `onRehydrateStorage`, not caught
 * here: zustand funnels every rehydration error into an internal `.catch`, so
 * nothing escapes `rehydrate()` for a try/catch to see.
 */
export default function StoreHydrator() {
  useEffect(() => {
    const library = persistApiOf(useLibraryStore);

    // Storage is blocked (Safari "block all cookies", sandboxed iframe). The
    // app still works; it just won't remember anything.
    if (!library) {
      useHydrationStore.getState().setStatus("unavailable");
      return;
    }

    library.rehydrate();
    persistApiOf(useControlsStore)?.rehydrate();
  }, []);

  return null;
}
