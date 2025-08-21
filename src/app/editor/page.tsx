import { auth } from "@/auth";
import Editor from "@/components/editor/Editor";
import { fetchActivitiesFromStrava } from "@/lib/fetchActivities";
import { redirect } from "next/navigation";

export default async function EditorPage() {
  const session = await auth();
  if (!session?.user?.accessToken) {
    redirect("/api/signout");
  }

  try {
    const activities = await fetchActivitiesFromStrava(
      session.user.accessToken
    );
    return <Editor activities={activities} />;
  } catch (error) {
    console.error(error);
    redirect("/api/signout");
  }
}
