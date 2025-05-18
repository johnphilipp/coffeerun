import { StravaActivity } from "@/types/strava-activity";

export async function fetchStravaActivities(accessToken: string) {
  const perPage = 50;
  let page = 1;
  let activities: StravaActivity[] = [];

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const activityBatch = await res.json();
    if (!Array.isArray(activityBatch) || !activityBatch.length) break;

    activities = [...activities, ...activityBatch];
    page++;

    if (page === 3) break; // For demo purposes, only fetch first 3 pages
  }

  return activities;
}
