/**
 * zustand's types claim `store.persist` is always present, but that isn't
 * true: `createJSONStorage(() => localStorage)` returns undefined when the
 * getter throws, and persistImpl then returns early without ever assigning
 * `api.persist`. Reaching for it through a signature that admits it can be
 * missing is what keeps a blocked-storage browser from throwing a TypeError
 * out of the root layout.
 *
 * Lives beside the stores rather than in a "use client" component module, so
 * hooks can use it without pulling a component into their route chunk.
 */
export type PersistApi = {
  rehydrate: () => Promise<void> | void;
  clearStorage: () => void;
};

export function persistApiOf(store: {
  persist?: PersistApi;
}): PersistApi | undefined {
  return store.persist;
}
