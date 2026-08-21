"use client";

import Scene from "@/components/editor/Scene";
import { Button } from "@/components/ui/button";
import { useDemoActivities } from "@/hooks/useDemoActivities";
import { ChevronRight, UploadIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // The hero mug is decorative here, so a failed load just leaves it empty
  // rather than blocking the page.
  useDemoActivities();

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

        <Link href="/import" className="w-full max-w-sm">
          <Button
            className="text-sm sm:text-base w-full flex items-center gap-3 h-11 font-bold"
            variant="default"
          >
            <UploadIcon style={{ transform: "scale(1.3)" }} />
            Add your rides
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
