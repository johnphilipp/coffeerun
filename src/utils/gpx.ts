import { activityTypeDefinitions } from "@/config/activityTypeDefinitions";
import { Activity } from "@/types/activity";
import { makeActivity } from "@/utils/activityCore";
import polyline from "@mapbox/polyline";

/**
 * The sports the rest of the app can actually render — icons, labels and the
 * type filter all come from activityTypeDefinitions. Deriving the set here
 * rather than restating it means the alias tables below can't emit a type that
 * has no definition (an earlier version emitted "Swim", which has none, and
 * produced an unlabelled iconless row in the filter).
 */
const CANONICAL_SPORTS = new Set(activityTypeDefinitions.map((d) => d.type));

const FALLBACK_SPORT = "Workout";

// GPX has no standard sport vocabulary. Strava exports put either a numeric
// code or a loose string in <trk><type>; Garmin writes trail_running, Wahoo
// writes "Trail Run". Keys are normalized (lowercased, non-letters stripped)
// so all those spellings land on one entry. A Map rather than an object
// literal because normalized input like "constructor" would otherwise resolve
// against Object.prototype and return a function instead of falling through.
const SPORT_BY_GPX_TYPE = new Map<string, string>(Object.entries({
  ride: "Ride",
  cycling: "Ride",
  biking: "Ride",
  bike: "Ride",
  gravelride: "Ride",
  mountainbikeride: "Ride",
  ebikeride: "EBikeRide",
  run: "Run",
  running: "Run",
  trailrun: "Run",
  trailrunning: "Run",
  hike: "Hike",
  hiking: "Hike",
  walk: "Walk",
  walking: "Walk",
  swim: "Swim",
  swimming: "Swim",
  kayaking: "Kayaking",
  alpineski: "AlpineSki",
  nordicski: "NordicSki",
  snowboard: "Snowboard",
  surfing: "Surfing",
  rockclimbing: "RockClimbing",
  rowing: "Rowing",
  golf: "Golf",
  yoga: "Yoga",
  weighttraining: "WeightTraining",
}));

// Strava's numeric activity codes, which survive in some older exports.
const SPORT_BY_GPX_CODE = new Map<string, string>(
  Object.entries({
    "1": "Ride",
    "4": "Hike",
    "9": "Run",
    "16": "Swim",
  })
);

function normalizeSportKey(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Resolves a raw <trk><type> to a sport the app can render. An alias pointing
 * at a type with no definition (Swim, today) degrades to Workout rather than
 * producing an orphan — and starts working on its own if a definition is added.
 */
function resolveSport(rawType: string): string {
  const candidate =
    SPORT_BY_GPX_CODE.get(rawType.trim()) ??
    SPORT_BY_GPX_TYPE.get(normalizeSportKey(rawType));
  return candidate && CANONICAL_SPORTS.has(candidate)
    ? candidate
    : FALLBACK_SPORT;
}

/**
 * Rejects coordinates that aren't real positions. A lost GPS fix routinely
 * emits (0, 0), and one such point adds two ~5000km legs to the distance and
 * stretches the polyline's bounding box across the planet, which the mug
 * renderer then normalizes into an invisible dot.
 */
function isPlausibleCoord(lat: number, lon: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return false;
  if (lat === 0 && lon === 0) return false;
  return true;
}

function haversineMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const dLat = lat2 - lat1;
  const dLon = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Negative so a GPX id can never collide with a real Strava activity id, and
// stable so re-importing the same file dedupes instead of duplicating. The seed
// must therefore contain nothing but file content — never a wall clock.
function stableNegativeId(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return -((h >>> 0) || 1);
}

// getElementsByTagName matches the *qualified* name in XML documents, so a
// perfectly valid prefixed file (<gpx:trk>) would look empty. Matching on
// localName in any namespace handles both spellings.
function tagged(parent: Element | Document, tag: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS("*", tag));
}

function textOf(parent: Element | Document, tag: string): string | null {
  return tagged(parent, tag)[0]?.textContent?.trim() || null;
}

/**
 * Direct children only, unlike `textOf`.
 *
 * `tagged` is a whole-subtree query, so reading a route's <name> that way
 * picked up the first <rtept><name> — a waypoint label like "Start" — when the
 * route had no name of its own. That became the activity's name and, on the
 * untimed path, part of its id seed, so two exports of one route with different
 * waypoint labelling hashed differently and both imported.
 */
function directChildText(parent: Element, tag: string): string | null {
  for (const child of Array.from(parent.children)) {
    if (child.localName === tag) return child.textContent?.trim() || null;
  }
  return null;
}

/**
 * UTC calendar components rendered *without* a trailing Z, so `new Date()`
 * reads them as local time.
 *
 * GPX timestamps are always UTC and the format carries no timezone for the
 * ride itself, so true ride-local time is unknowable. Storing the raw UTC
 * instant in `start_date_local` made year bucketing depend on the viewer's
 * browser timezone — a ride at 00:30 in Tokyo filed under the previous year
 * for a European, and re-filed itself if the user travelled. This is
 * deterministic for every viewer instead, which matters more here than being
 * right about the hour.
 */
export function toNaiveLocalIso(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

/**
 * Parses a GPX document into activities — one per <trk>, concatenating points
 * across all of that track's <trkseg>s.
 *
 * Not handled: .gpx.gz and the .zip that Strava's bulk export ships (unzip
 * first), .fit (binary, needs a real parser), .tcx (would be a small extension
 * of this function).
 */
export function parseGpx(
  xml: string,
  fileName: string,
  /**
   * Used to date tracks that carry no timestamps at all — pass the source
   * file's `lastModified`. Deliberately kept out of the id seed: it's a
   * reasonable guess at when a ride happened, but it changes if the file is
   * re-downloaded, and an id that moves would resurrect duplicate imports.
   */
  fallbackTimeMs?: number
): Activity[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (tagged(doc, "parsererror").length > 0) {
    throw new Error(`${fileName} is not valid XML`);
  }

  // Recorded activities use <trk><trkseg><trkpt>; planned routes — which is
  // what Komoot and most route planners export, and the import dialog names
  // Komoot explicitly — use <rte><rtept>. Same lat/lon/ele/time children, so
  // both are handled as one shape.
  const tracks = [...tagged(doc, "trk"), ...tagged(doc, "rte")];
  if (tracks.length === 0) {
    throw new Error(`${fileName} contains no <trk> or <rte> element`);
  }

  // Many route exports have no per-point times but do carry <metadata><time>.
  // Scoped to the metadata element so it can't pick up a trkpt timestamp.
  const metadataEl = tagged(doc, "metadata")[0];
  const metadataTimeMs = metadataEl
    ? Date.parse(textOf(metadataEl, "time") ?? "")
    : NaN;

  const fallbackName = fileName.replace(/\.gpx$/i, "");
  const activities: Activity[] = [];

  for (const trk of tracks) {
    const points = [...tagged(trk, "trkpt"), ...tagged(trk, "rtept")];
    const coords: [number, number][] = [];
    let firstMs = Number.POSITIVE_INFINITY;
    let lastMs = Number.NEGATIVE_INFINITY;
    let elevationGain = 0;
    let previousElevation: number | null = null;

    for (const point of points) {
      const lat = Number.parseFloat(point.getAttribute("lat") ?? "");
      const lon = Number.parseFloat(point.getAttribute("lon") ?? "");
      if (!isPlausibleCoord(lat, lon)) continue;
      coords.push([lat, lon]);

      const time = textOf(point, "time");
      if (time) {
        const ms = Date.parse(time);
        // Tracked in the loop rather than via Math.min(...times) — GPX files
        // routinely carry tens of thousands of points and would blow the stack.
        if (Number.isFinite(ms)) {
          if (ms < firstMs) firstMs = ms;
          if (ms > lastMs) lastMs = ms;
        }
      }

      const ele = textOf(point, "ele");
      if (ele) {
        const value = Number.parseFloat(ele);
        if (Number.isFinite(value)) {
          if (previousElevation !== null && value > previousElevation) {
            elevationGain += value - previousElevation;
          }
          previousElevation = value;
        }
      }
    }

    // A single point can't be drawn as a route.
    if (coords.length < 2) continue;

    let distance = 0;
    for (let i = 1; i < coords.length; i++) {
      distance += haversineMeters(coords[i - 1], coords[i]);
    }

    const hasTrackTimes = Number.isFinite(firstMs) && Number.isFinite(lastMs);
    // Anything derived from file content is stable across re-imports and safe
    // to identify a ride by. lastModified is not, so it dates the ride without
    // contributing to its id.
    const contentTimeMs = hasTrackTimes
      ? firstMs
      : Number.isFinite(metadataTimeMs)
      ? metadataTimeMs
      : NaN;
    const hasStableTime = Number.isFinite(contentTimeMs);
    // `??` would let a lastModified of 0 through — common when an archiver
    // drops mtimes — dating the ride to 1970, where the auto-selected latest
    // year hides it while a stray 1970 sits in the date picker.
    const usableFallbackMs =
      Number.isFinite(fallbackTimeMs) && (fallbackTimeMs as number) > 0
        ? (fallbackTimeMs as number)
        : Date.now();
    const startMs = hasStableTime ? contentTimeMs : usableFallbackMs;

    // GPX can't reliably express pauses, so moving time == elapsed time.
    const seconds = hasTrackTimes ? Math.round((lastMs - firstMs) / 1000) : 0;

    const summaryPolyline = polyline.encode(coords);
    const name = directChildText(trk, "name") ?? fallbackName;
    // Unknown or absent types become Workout rather than Ride — mislabelling
    // 200 runs as rides makes the type filter actively wrong.
    const sport = resolveSport(directChildText(trk, "type") ?? "");

    activities.push(
      makeActivity({
        // Two rides over one route on different days are different activities,
        // so include the time when it's trustworthy. When it isn't, geometry
        // alone identifies the route: the name would otherwise pull in the
        // filename fallback, so two copies of one untimed route under different
        // filenames would both import. Two untimed recordings of the same route
        // are indistinguishable anyway, so collapsing them is the right call.
        id: stableNegativeId(
          hasStableTime
            ? `${summaryPolyline}|${new Date(startMs).toISOString()}`
            : summaryPolyline
        ),
        name,
        type: sport,
        sport_type: sport,
        start_date_local: toNaiveLocalIso(startMs),
        distance: Math.round(distance),
        moving_time: seconds,
        elapsed_time: seconds,
        total_elevation_gain: Math.round(elevationGain),
        map: {
          id: `gpx-${summaryPolyline.length}`,
          summary_polyline: summaryPolyline,
          resource_state: 2,
        },
      })
    );
  }

  if (activities.length === 0) {
    throw new Error(`${fileName} has no track with usable coordinates`);
  }

  return activities;
}
