import { Activity } from "@/types/activity";

export async function fetchActivitiesFromStrava(accessToken: string) {
  const perPage = 50;
  let page = 1;
  let activities: Activity[] = [];

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch activities from Strava");
    }

    const activityBatch = await res.json();
    if (!Array.isArray(activityBatch) || !activityBatch.length) break;

    activities = [...activities, ...activityBatch];
    page++;

    if (page === 5) break; // For demo purposes, only fetch first 5 pages
  }

  return activities;
}
