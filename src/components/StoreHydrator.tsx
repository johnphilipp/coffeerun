"use client";

import { useControlsStore } from "@/store/controlsStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useEffect } from "react";

/**
 * Both persisted stores use `skipHydration`, so reading localStorage is deferred
 * to here — after mount, on the client only. Rehydrating during render would
 * produce an SSR/client mismatch.
 */
export default function StoreHydrator() {
  useEffect(() => {
    useLibraryStore.persist.rehydrate();
    useControlsStore.persist.rehydrate();
  }, []);

  return null;
}
