import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="py-20 space-y-8 flex flex-col items-center justify-center">
      <Spinner />
      <p className="text-gray-500">Fetching your activities from Strava....</p>
    </div>
  );
}
