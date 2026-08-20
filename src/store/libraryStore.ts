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
