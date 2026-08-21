import { create } from "zustand";

/**
 * Outcome of reading the persisted stores.
 *
 * localStorage is the app's only datastore, so its failure modes need to be
 * distinguishable rather than lumped together:
 *
 * - `pending`     — not read yet
 * - `ready`       — read successfully (including "nothing stored yet")
 * - `unavailable` — storage is blocked (Safari "block all cookies", sandboxed
 *                   iframe). The app works, it just won't remember anything.
 *                   Not an error worth a screen.
 * - `failed`      — storage works but the stored value can't be read. This one
 *                   needs a way out, or the user is stuck forever.
 *
 * The point of naming a terminal state for every path is that "spins forever"
 * stops being reachable, rather than being something each caller guards against.
 */
export type HydrationStatus = "pending" | "ready" | "unavailable" | "failed";

interface HydrationState {
  status: HydrationStatus;
  setStatus: (status: HydrationStatus) => void;
}

export const useHydrationStore = create<HydrationState>((set) => ({
  status: "pending",
  setStatus: (status) => set({ status }),
}));
