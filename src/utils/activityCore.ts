import { Activity } from "@/types/activity";

/**
 * The only parts of an Activity anything in this app actually reads, plus the
 * couple of stats the picker displays. Used both as the output shape of the GPX
 * parser and as the persisted shape in localStorage — the ~30 remaining fields
 * on Activity are Strava API noise that would only waste storage.
 */
export type ActivityCore = Pick<
  Activity,
  | "id"
  | "name"
  | "type"
  | "sport_type"
  | "start_date_local"
  | "distance"
  | "moving_time"
  | "elapsed_time"
  | "total_elevation_gain"
  | "map"
>;

const CORE_KEYS: (keyof ActivityCore)[] = [
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
];

/** Fills the Strava-specific fields with neutral defaults. */
export function makeActivity(core: ActivityCore): Activity {
  return {
    resource_state: 2,
    athlete: { id: 0, resource_state: 1 },
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
    average_speed:
      core.moving_time > 0 ? core.distance / core.moving_time : 0,
    max_speed: 0,
    ...core,
  };
}

/** Strips an Activity down to what's worth persisting. */
export function toActivityCore(activity: Activity): ActivityCore {
  const core = {} as Record<string, unknown>;
  for (const key of CORE_KEYS) core[key] = activity[key];
  return core as unknown as ActivityCore;
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
