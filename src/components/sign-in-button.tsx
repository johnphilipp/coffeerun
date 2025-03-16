import { signIn } from "@/auth";
import { Button } from "./ui/button";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("strava", { redirectTo: "/" });
      }}
    >
      <Button
        type="submit"
        className="w-full hover:cursor-pointer"
        variant="outline"
      >
        Login with Strava
      </Button>
    </form>
  );
}
