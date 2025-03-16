import { auth } from "@/auth";
import SignIn from "@/components/sign-in-button";
import SignOut from "@/components/sign-out-button";
import { StravaActivity } from "@/types/strava-activity";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  if (!session) {
    // Not logged in UI
    return (
      <div className="grid ...">
        <SignIn />
      </div>
    );
  }

  // Logged-in user: fetch activities
  const perPage = 50;
  let page = 1;
  let activities: StravaActivity[] = [];

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    const activityBatch = await res.json();
    if (!Array.isArray(activityBatch) || !activityBatch.length) break;

    activities = [...activities, ...activityBatch];
    page++;

    if (page === 3) break; // For demo purposes, only fetch
  }

  console.log(activities);

  // Once the data is fetched, render final UI
  return (
    <div className="py-20 space-y-8 flex flex-col items-center justify-center">
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt={session.user.name ?? "User profile picture"}
          width={100}
          height={100}
          className="rounded-full"
        />
      )}

      <h1 className="text-2xl font-bold">
        {session.user?.name
          ? `Well done, ${session.user?.name?.split(" ")[0]}!`
          : "Well done!"}
      </h1>
      <p className="text-gray-500">
        We fetched {activities.length} activities from Strava. Here they are:
      </p>
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
          <div>
            <h2 className="font-bold">{activity.name}</h2>
            <p className="text-gray-500">
              {new Date(activity.start_date).toLocaleString()}
            </p>
          </div>
        </div>
      ))}

      <SignOut />
    </div>
  );
}
