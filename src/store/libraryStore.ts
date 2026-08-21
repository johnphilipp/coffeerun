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

/**
 * merge() runs before onRehydrateStorage's callback and can't set status
 * itself — the callback would immediately overwrite it — so the outcome is
 * handed over through these two.
 */
let lastMergeOutcome: "ok" | "unreadable" = "ok";
let lastMergeDropped = 0;

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      importedActivities: [],

      // Returns how many were actually new, so the caller can report it.
      addActivities: (activities) => {
        const existing = get().importedActivities;
        const seen = new Set(existing.map((activity) => activity.id));
        const fresh: Activity[] = [];
        for (const activity of activities) {
          // `seen` grows as we go, so duplicates *within* one selection are
          // caught too — picking a file and a renamed copy of it in the same
          // import used to write two entries sharing an id, which collides
          // ActivityPicker's React keys and draws the route twice.
          if (seen.has(activity.id)) continue;
          seen.add(activity.id);
          fresh.push(activity);
        }
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
      //
      // A throw isn't the only way to lose rides, though: a value that parses
      // but doesn't match the expected shape used to report "ready" with an
      // empty library, so the recovery screen never showed and the next import
      // wrote over data that was still there. Total loss is now reported as
      // failed; partial loss keeps what survived and is counted for a warning,
      // because blocking access to 48 good rides over 2 bad ones is worse.
      onRehydrateStorage: () => (_state, error) => {
        const hydration = useHydrationStore.getState();
        if (error || lastMergeOutcome === "unreadable") {
          hydration.setStatus("failed");
        } else {
          hydration.setStatus("ready");
          if (lastMergeDropped > 0) hydration.setDroppedRides(lastMergeDropped);
        }
        lastMergeOutcome = "ok";
        lastMergeDropped = 0;
      },
      partialize: (state) => ({
        importedActivities: state.importedActivities.map(toActivityCore),
      }),
      merge: (persisted, current) => {
        const stored = (persisted as { importedActivities?: unknown })
          ?.importedActivities;

        // Nothing stored yet is normal; a stored value of the wrong shape is not.
        if (stored === undefined) return current;
        if (!Array.isArray(stored)) {
          lastMergeOutcome = "unreadable";
          return current;
        }

        const usable = stored.filter(isActivityCore);
        if (usable.length === 0 && stored.length > 0) {
          lastMergeOutcome = "unreadable";
          return current;
        }
        lastMergeDropped = stored.length - usable.length;

        return {
          ...current,
          importedActivities: usable.map((core) => makeActivity(core)),
        };
      },
    }
  )
);
