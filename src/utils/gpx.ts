import { Activity } from "@/types/activity";
import { makeActivity } from "@/utils/activityCore";
import polyline from "@mapbox/polyline";

// GPX has no standard sport vocabulary. Strava exports put either a numeric
// code or a loose string in <trk><type>, so cover both and fall back to Ride.
const SPORT_BY_GPX_TYPE: Record<string, string> = {
  "1": "Ride",
  "4": "Hike",
  "9": "Run",
  "16": "Swim",
  ride: "Ride",
  cycling: "Ride",
  biking: "Ride",
  run: "Run",
  running: "Run",
  hike: "Hike",
  hiking: "Hike",
  walk: "Walk",
  walking: "Walk",
  swim: "Swim",
  swimming: "Swim",
};

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
// stable so re-importing the same file dedupes instead of duplicating.
function stableNegativeId(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return -((h >>> 0) || 1);
}

function textOf(parent: Element, tag: string): string | null {
  return parent.getElementsByTagName(tag)[0]?.textContent?.trim() || null;
}

/**
 * Parses a GPX document into activities — one per <trk>, concatenating points
 * across all of that track's <trkseg>s.
 *
 * Not handled: .gpx.gz and the .zip that Strava's bulk export ships (unzip
 * first), .fit (binary, needs a real parser), .tcx (would be a small extension
 * of this function).
 */
export function parseGpx(xml: string, fileName: string): Activity[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) {
    throw new Error(`${fileName} is not valid XML`);
  }

  const tracks = Array.from(doc.getElementsByTagName("trk"));
  if (tracks.length === 0) {
    throw new Error(`${fileName} contains no <trk> element`);
  }

  const fallbackName = fileName.replace(/\.gpx$/i, "");
  const activities: Activity[] = [];

  for (const trk of tracks) {
    const points = Array.from(trk.getElementsByTagName("trkpt"));
    const coords: [number, number][] = [];
    let firstMs = Number.POSITIVE_INFINITY;
    let lastMs = Number.NEGATIVE_INFINITY;
    let elevationGain = 0;
    let previousElevation: number | null = null;

    for (const point of points) {
      const lat = Number.parseFloat(point.getAttribute("lat") ?? "");
      const lon = Number.parseFloat(point.getAttribute("lon") ?? "");
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
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

    const hasTimes = Number.isFinite(firstMs) && Number.isFinite(lastMs);
    // Untimed tracks are dated now so they land in the current year's filter
    // rather than 1970, where they'd be invisible.
    const startIso = hasTimes
      ? new Date(firstMs).toISOString()
      : new Date().toISOString();
    // GPX can't reliably express pauses, so moving time == elapsed time.
    const seconds = hasTimes ? Math.round((lastMs - firstMs) / 1000) : 0;

    const summaryPolyline = polyline.encode(coords);
    const rawType = textOf(trk, "type")?.toLowerCase() ?? "";
    const sport = SPORT_BY_GPX_TYPE[rawType] ?? "Ride";

    activities.push(
      makeActivity({
        id: stableNegativeId(`${summaryPolyline}|${startIso}`),
        name: textOf(trk, "name") ?? fallbackName,
        type: sport,
        sport_type: sport,
        start_date_local: startIso,
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
