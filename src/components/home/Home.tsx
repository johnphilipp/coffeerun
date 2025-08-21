"use client";

import Scene from "@/components/editor/Scene";
import { Button } from "@/components/ui/button";
import { demoData } from "@/data/demoData";
import { useActivityStore } from "@/store/activityStore";
import { ChevronRight } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { FaGift, FaStrava } from "react-icons/fa";

export default function Home() {
  const setActivities = useActivityStore((state) => state.setActivities);

  useEffect(() => {
    setActivities(demoData);
  }, [setActivities]);

  return (
    <div className="h-[100dvh] overflow-hidden">
      <Scene className="-mt-28 h-full w-full" />

      {/* Blocker so the Mug can't be moved */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-full" />

      {/* Gradient */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10 h-2/3" />

      <section className="flex flex-col gap-3 p-6 items-center absolute bottom-6 left-0 right-0 z-10 pb-[env(safe-area-inset-bottom)]">
        <h2
          className="text-2xl sm:text-3xl font-bold text-white text-left sm:text-center"
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,1)",
          }}
        >
          Your Miles. Your Mug.
        </h2>

        <p
          className="text-md sm:text-lg text-gray-300 mb-2 sm:mb-4 max-w-sm text-left sm:text-center"
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,1)",
          }}
        >
          Create and order a personalized coffee mug as a keepsake of your best
          sports moments.
        </p>

        <Button
          onClick={() => signIn("strava", { redirectTo: "/editor" })}
          className="bg-[#fc4c02] hover:bg-[#fc4c02]/90 text-sm sm:text-base w-full flex items-center gap-3 h-11 max-w-sm font-bold"
          variant="default"
        >
          <FaStrava style={{ transform: "scale(1.5)" }} />
          Connect with Strava
        </Button>

        <Link href="/" className="w-full max-w-sm">
          <Button
            onClick={() => signIn("strava", { redirectTo: "/gift" })}
            className="w-full flex items-center gap-4 h-11 font-bold text-sm sm:text-base"
          >
            <FaGift style={{ transform: "scale(1.5)" }} />
            Gift a friend
          </Button>
        </Link>

        <Link
          href="/demo"
          className="text-sm sm:text-base text-gray-300 hover:text-gray-400 transition-colors duration-200 flex items-center justify-center gap-1"
        >
          View a demo
          <ChevronRight className="w-4 h-4 mt-0.5" />
        </Link>
      </section>
    </div>
  );
}
