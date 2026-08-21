import { useHydrationStore } from "@/store/hydrationStore";
import { Activity } from "@/types/activity";
import {
  isActivityCore,
  makeActivity,
  toActivityCore,
} from "@/utils/activityCore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Durable set of imported rides, persisted to localStorage.
 *
 * Deliberately separate from activityStore. activityStore is transient render
 * state — the homepage and /demo seed it with demo data, so persisting it would
 * mean viewing the demo silently overwrites the user's imported rides. It also
 * holds `generatedImage`, a base64 data-URL that would eat the storage budget.
 */
interface LibraryState {
  importedActivities: Activity[];
  addActivities: (activities: Activity[]) => number;
  clear: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      importedActivities: [],

      // Returns how many were actually new, so the caller can report it.
      addActivities: (activities) => {
        const existing = get().importedActivities;
        const seen = new Set(existing.map((activity) => activity.id));
        const fresh = activities.filter((activity) => !seen.has(activity.id));
        if (fresh.length > 0) {
          set({
            importedActivities: [...existing, ...fresh].sort(
              (a, b) =>
                new Date(b.start_date_local).getTime() -
                new Date(a.start_date_local).getTime()
            ),
          });
        }
        return fresh.length;
      },

      clear: () => set({ importedActivities: [] }),
    }),
    {
      name: "coffeerun-library",
      // Rehydration has to happen after mount — see StoreHydrator. Reading
      // localStorage during SSR would produce a hydration mismatch, and
      // seeding activityStore fires canvas work that only exists in a browser.
      skipHydration: true,
      version: 1,
      // Present so the "couldn't be migrated" branch is unreachable. Without a
      // migrate function zustand logs an error and hands merge `undefined`,
      // which would silently empty the user's only copy of their rides. Shape
      // drift is handled non-destructively by the isActivityCore filter below,
      // so passing state through is safe.
      migrate: (persisted) => persisted as LibraryState,
      // On failure zustand's promise chain skips the `.then` that sets
      // hasHydrated and fires the finish listeners, so this callback is the
      // only signal that anything went wrong. Awaiting rehydrate() would not
      // see it — the error is swallowed internally.
      onRehydrateStorage: () => (_state, error) => {
        useHydrationStore
          .getState()
          .setStatus(error ? "failed" : "ready");
      },
      partialize: (state) => ({
        importedActivities: state.importedActivities.map(toActivityCore),
      }),
      merge: (persisted, current) => {
        const stored = (persisted as { importedActivities?: unknown })
          ?.importedActivities;
        if (!Array.isArray(stored)) return current;
        return {
          ...current,
          importedActivities: stored
            .filter(isActivityCore)
            .map((core) => makeActivity(core)),
        };
      },
    }
  )
);
