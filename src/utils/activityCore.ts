import { Activity } from "@/types/activity";

/**
 * The only parts of an Activity anything in this app reads, plus the couple of
 * stats the picker displays. Used both as the output shape of the GPX parser
 * and as the persisted shape in localStorage — the ~30 remaining fields on
 * Activity are Strava API noise that would only waste storage.
 *
 * Declared as a value first so the type is derived from it. Keeping a separate
 * `Pick<>` union in sync by hand meant adding a field could silently stop it
 * being copied and stored, with no type error anywhere.
 */
export const CORE_KEYS = [
  "id",
  "name",
  "type",
  "sport_type",
  "start_date_local",
  "distance",
  "moving_time",
  "elapsed_time",
  "total_elevation_gain",
  "map",
] as const;

export type ActivityCore = Pick<Activity, (typeof CORE_KEYS)[number]>;

/** Fills the Strava-specific fields with neutral defaults. */
export function makeActivity(core: ActivityCore): Activity {
  return {
    resource_state: 2,
    athlete: { id: 0, resource_state: 1 },
    // Not authoritative for GPX-derived activities: start_date_local holds
    // naive local time (see toNaiveLocalIso), so this isn't a real UTC
    // instant. Nothing reads it, so it isn't worth persisting a second field.
    start_date: core.start_date_local,
    timezone: "",
    utc_offset: 0,
    location_city: null,
    location_state: null,
    location_country: null,
    achievement_count: 0,
    kudos_count: 0,
    comment_count: 0,
    athlete_count: 1,
    photo_count: 0,
    trainer: false,
    commute: false,
    manual: false,
    private: false,
    visibility: "everyone",
    flagged: false,
    gear_id: null,
    start_latlng: [],
    end_latlng: [],
    average_speed: core.moving_time > 0 ? core.distance / core.moving_time : 0,
    max_speed: 0,
    ...core,
  };
}

/** Strips an Activity down to what's worth persisting. */
export function toActivityCore(activity: Activity): ActivityCore {
  const core = {} as Pick<Activity, (typeof CORE_KEYS)[number]>;
  for (const key of CORE_KEYS) {
    // Assigning across a union of key types needs the widened target; the
    // derived ActivityCore guarantees every key exists on Activity.
    (core as Record<string, unknown>)[key] = activity[key];
  }
  return core;
}

export function isActivityCore(value: unknown): value is ActivityCore {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ActivityCore>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.start_date_local === "string" &&
    typeof candidate.map?.summary_polyline === "string"
  );
}
