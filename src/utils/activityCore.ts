import { Activity } from "@/types/activity";
import { pick } from "lodash";

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

const num = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const str = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.length > 0 ? value : fallback;

/**
 * Fills the Strava-specific fields with neutral defaults, and coerces the core
 * fields rather than trusting them.
 *
 * The coercion matters because this also inflates values read back from
 * localStorage, which is not a trusted source. A stored record missing
 * `distance` used to reach ActivityPicker as `undefined`, where
 * `distanceInMeters.toFixed(0)` threw a TypeError — and with no error boundary
 * in the app that killed the whole route.
 */
export function makeActivity(core: ActivityCore): Activity {
  const safeCore: ActivityCore = {
    id: num(core.id),
    name: str(core.name, "Untitled activity"),
    type: str(core.type, "Workout"),
    sport_type: str(core.sport_type, str(core.type, "Workout")),
    start_date_local: str(core.start_date_local, new Date(0).toISOString()),
    distance: num(core.distance),
    moving_time: num(core.moving_time),
    elapsed_time: num(core.elapsed_time, num(core.moving_time)),
    total_elevation_gain: num(core.total_elevation_gain),
    map: {
      id: str(core.map?.id, "gpx"),
      summary_polyline: str(core.map?.summary_polyline, ""),
      resource_state: num(core.map?.resource_state, 2),
    },
  };

  return {
    resource_state: 2,
    athlete: { id: 0, resource_state: 1 },
    // Not authoritative for GPX-derived activities: start_date_local holds
    // naive local time (see toNaiveLocalIso), so this isn't a real UTC
    // instant. Nothing reads it, so it isn't worth persisting a second field.
    start_date: safeCore.start_date_local,
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
    average_speed:
      safeCore.moving_time > 0 ? safeCore.distance / safeCore.moving_time : 0,
    max_speed: 0,
    ...safeCore,
  };
}

/** Strips an Activity down to what's worth persisting. */
export function toActivityCore(activity: Activity): ActivityCore {
  return pick(activity, CORE_KEYS);
}

/**
 * Gate for values coming back out of localStorage.
 *
 * A ride is only usable if it can be identified, dated and drawn, so those
 * three are required. The remaining fields are display-only and are repaired
 * by makeActivity rather than being grounds for throwing a ride away — losing
 * someone's ride because its elevation total went missing would be worse than
 * showing it with a zero.
 */
export function isActivityCore(value: unknown): value is ActivityCore {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ActivityCore>;
  return (
    typeof candidate.id === "number" &&
    Number.isFinite(candidate.id) &&
    typeof candidate.start_date_local === "string" &&
    Number.isFinite(Date.parse(candidate.start_date_local)) &&
    typeof candidate.map?.summary_polyline === "string" &&
    candidate.map.summary_polyline.length > 0
  );
}
