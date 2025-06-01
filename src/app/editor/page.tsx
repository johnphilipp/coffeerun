import { auth } from "@/auth";
import Editor from "@/components/editor/Editor";
import { fetchActivitiesFromStrava } from "@/lib/fetchActivities";

export default async function EditorPage() {
  const session = await auth();

  const activities = await fetchActivitiesFromStrava(
    session!.user.accessToken!
  );
  console.log(activities);

  return <Editor activities={activities} />;
}
